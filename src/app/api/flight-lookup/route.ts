import { NextRequest, NextResponse } from "next/server";

export interface FlightLookupResult {
  found: boolean;
  demo: boolean;
  airlineCode: string;
  flightNumber: string;
  scheduledDeparture: string | null;
  origin: string | null;
  destination: string | null;
  status: string | null;
}

/**
 * Deterministic mock so the same flight number always returns the same
 * demo time within a session — makes manual testing feel consistent.
 */
function mockLookup(airlineCode: string, flightNumber: string): FlightLookupResult {
  const seed = Array.from(`${airlineCode}${flightNumber}`).reduce(
    (acc, ch) => acc + ch.charCodeAt(0),
    0
  );
  const hour = 5 + (seed % 17); // 05:00–21:00
  const minute = (seed * 7) % 60;
  const departure = new Date();
  departure.setDate(departure.getDate() + 1);
  departure.setHours(hour, minute, 0, 0);

  return {
    found: true,
    demo: true,
    airlineCode,
    flightNumber,
    scheduledDeparture: departure.toISOString(),
    origin: "JFK",
    destination: "—",
    status: "scheduled",
  };
}

/**
 * Real integration point: AeroDataBox (via RapidAPI) or FlightAware AeroAPI.
 * Set FLIGHT_API_KEY (+ FLIGHT_API_HOST for AeroDataBox) in .env.local to
 * go live — until then this endpoint returns realistic mock data so the
 * booking flow is fully demoable.
 */
async function liveLookup(
  airlineCode: string,
  flightNumber: string
): Promise<FlightLookupResult> {
  const apiKey = process.env.FLIGHT_API_KEY;
  const apiHost = process.env.FLIGHT_API_HOST ?? "aerodatabox.p.rapidapi.com";

  if (!apiKey) {
    return mockLookup(airlineCode, flightNumber);
  }

  const flightIdent = `${airlineCode}${flightNumber}`;
  const today = new Date().toISOString().slice(0, 10);

  try {
    const res = await fetch(
      `https://${apiHost}/flights/number/${flightIdent}/${today}`,
      {
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": apiHost,
        },
        next: { revalidate: 0 },
      }
    );

    if (!res.ok) {
      return { ...mockLookup(airlineCode, flightNumber), found: false };
    }

    const data = await res.json();
    const flight = Array.isArray(data) ? data[0] : data;

    if (!flight) {
      return { ...mockLookup(airlineCode, flightNumber), found: false };
    }

    return {
      found: true,
      demo: false,
      airlineCode,
      flightNumber,
      scheduledDeparture: flight?.departure?.scheduledTime?.utc ?? null,
      origin: flight?.departure?.airport?.iata ?? null,
      destination: flight?.arrival?.airport?.iata ?? null,
      status: flight?.status ?? null,
    };
  } catch {
    return mockLookup(airlineCode, flightNumber);
  }
}

export async function GET(request: NextRequest) {
  const airlineCode = request.nextUrl.searchParams.get("airline")?.trim().toUpperCase();
  const flightNumber = request.nextUrl.searchParams.get("flightNumber")?.trim();

  if (!airlineCode || !flightNumber || !/^\d{1,4}[A-Z]?$/.test(flightNumber)) {
    return NextResponse.json(
      { error: "airline and flightNumber are required" },
      { status: 400 }
    );
  }

  const result = await liveLookup(airlineCode, flightNumber);
  return NextResponse.json(result);
}
