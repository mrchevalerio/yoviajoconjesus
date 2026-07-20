export interface Zone {
  id: string;
  labelKey: "area.zone1.title" | "area.zone2.title" | "area.zone3.title";
  matches: RegExp;
  baseFare: number;
}

/** Single flat rate for all zones, regardless of pickup address. */
const FLAT_FARE = 115;

export const ZONES: Zone[] = [
  {
    id: "washington-heights",
    labelKey: "area.zone1.title",
    matches: /washington heights|155th|181st|wash\.?\s?heights/i,
    baseFare: FLAT_FARE,
  },
  {
    id: "inwood",
    labelKey: "area.zone2.title",
    matches: /inwood|dyckman/i,
    baseFare: FLAT_FARE,
  },
  {
    id: "bronx",
    labelKey: "area.zone3.title",
    matches: /bronx|riverdale|fordham|kingsbridge|pelham|morris/i,
    baseFare: FLAT_FARE,
  },
];

const DEFAULT_BASE_FARE = FLAT_FARE;

export const MAX_PASSENGERS = 3;

export function detectZone(address: string): Zone | null {
  return ZONES.find((zone) => zone.matches.test(address)) ?? null;
}

export function fareForAddress(address: string): number {
  return detectZone(address)?.baseFare ?? DEFAULT_BASE_FARE;
}
