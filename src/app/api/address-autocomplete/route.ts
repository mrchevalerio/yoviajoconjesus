import { NextRequest, NextResponse } from "next/server";

export interface AddressSuggestion {
  id: string;
  label: string;
}

// Roughly covers all five boroughs (left, top, right, bottom).
const NYC_VIEWBOX = "-74.3,40.92,-73.65,40.49";

/**
 * Real geocoding, no API key required: OpenStreetMap Nominatim. This is the
 * default provider — free and fully functional, but rate-limited and less
 * polished than a commercial API. For production-grade autocomplete, set
 * GOOGLE_PLACES_API_KEY or MAPBOX_ACCESS_TOKEN in .env.local and this route
 * will prefer that provider instead.
 */
interface NominatimAddress {
  house_number?: string;
  road?: string;
  suburb?: string; // NYC borough (Manhattan, The Bronx, ...)
  city_district?: string;
  city?: string;
  postcode?: string;
}

/**
 * Nominatim's `display_name` includes neighbourhood/quarter/county tags that
 * come from loosely-drawn OSM boundary polygons and are frequently wrong or
 * misleading (e.g. attaching a decades-old micro-neighborhood name to a
 * building that isn't really in it). The house number, street, borough, and
 * zip are the reliable parts — keep only those.
 */
function formatNominatimLabel(address: NominatimAddress): string | null {
  if (!address.road) return null;
  const street = address.house_number ? `${address.house_number} ${address.road}` : address.road;
  const borough = address.suburb ?? address.city_district ?? address.city;
  const parts = [street, borough, address.postcode ? `NY ${address.postcode}` : "NY"];
  return parts.filter(Boolean).join(", ");
}

async function nominatimSearch(query: string): Promise<AddressSuggestion[]> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("q", query);
  url.searchParams.set("countrycodes", "us");
  url.searchParams.set("viewbox", NYC_VIEWBOX);
  url.searchParams.set("bounded", "1");
  url.searchParams.set("limit", "6");
  url.searchParams.set("addressdetails", "1");

  const res = await fetch(url, {
    headers: {
      // Required by Nominatim's usage policy for server-side callers.
      "User-Agent": "YoViajoConJesus/1.0 (airport car service; info@yoviajoconjesus.com)",
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) return [];

  const data: { place_id: number; address: NominatimAddress }[] = await res.json();
  return data
    .map((item) => ({ id: String(item.place_id), label: formatNominatimLabel(item.address) }))
    .filter((item): item is AddressSuggestion => item.label !== null);
}

async function mapboxSearch(query: string, token: string): Promise<AddressSuggestion[]> {
  const url = new URL(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`
  );
  url.searchParams.set("access_token", token);
  url.searchParams.set("country", "us");
  url.searchParams.set("bbox", "-74.3,40.49,-73.65,40.92");
  url.searchParams.set("types", "address");
  url.searchParams.set("limit", "6");

  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) return [];

  const data: { id: string; place_name: string }[] = (await res.json()).features ?? [];
  return data.map((item) => ({ id: item.id, label: item.place_name }));
}

async function googlePlacesSearch(query: string, key: string): Promise<AddressSuggestion[]> {
  const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
  url.searchParams.set("input", query);
  url.searchParams.set("key", key);
  url.searchParams.set("components", "country:us");
  url.searchParams.set("location", "40.83,-73.87");
  url.searchParams.set("radius", "30000");

  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) return [];

  const data: { predictions?: { place_id: string; description: string }[] } = await res.json();
  return (data.predictions ?? []).map((item) => ({ id: item.place_id, label: item.description }));
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query || query.length < 3) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;
    const googleKey = process.env.GOOGLE_PLACES_API_KEY;

    const suggestions = mapboxToken
      ? await mapboxSearch(query, mapboxToken)
      : googleKey
        ? await googlePlacesSearch(query, googleKey)
        : await nominatimSearch(query);

    // Distinct OSM buildings can collapse onto the same trimmed label; keep one.
    const seen = new Set<string>();
    const deduped = suggestions.filter((s) => {
      if (seen.has(s.label)) return false;
      seen.add(s.label);
      return true;
    });

    return NextResponse.json({ suggestions: deduped });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}
