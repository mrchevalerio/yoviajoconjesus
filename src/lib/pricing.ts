export interface Zone {
  id: string;
  labelKey: "area.zone1.title" | "area.zone2.title" | "area.zone3.title";
  matches: RegExp;
  baseFare: number;
}

/**
 * Placeholder flat-rate table. Replace baseFare values with real negotiated
 * rates before launch — these are illustrative, not pricing commitments.
 * One vehicle type, up to 3 passengers — no per-vehicle multiplier.
 */
export const ZONES: Zone[] = [
  {
    id: "washington-heights",
    labelKey: "area.zone1.title",
    matches: /washington heights|155th|181st|wash\.?\s?heights/i,
    baseFare: 75,
  },
  {
    id: "inwood",
    labelKey: "area.zone2.title",
    matches: /inwood|dyckman/i,
    baseFare: 80,
  },
  {
    id: "bronx",
    labelKey: "area.zone3.title",
    matches: /bronx|riverdale|fordham|kingsbridge|pelham|morris/i,
    baseFare: 95,
  },
];

const DEFAULT_BASE_FARE = 88;

export const MAX_PASSENGERS = 3;

export function detectZone(address: string): Zone | null {
  return ZONES.find((zone) => zone.matches.test(address)) ?? null;
}

export function fareForAddress(address: string): number {
  return detectZone(address)?.baseFare ?? DEFAULT_BASE_FARE;
}
