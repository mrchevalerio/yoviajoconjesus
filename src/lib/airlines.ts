export interface Airline {
  code: string;
  name: string;
}

/** Major carriers operating out of JFK. */
export const AIRLINES: Airline[] = [
  { code: "AA", name: "American Airlines" },
  { code: "DL", name: "Delta Air Lines" },
  { code: "UA", name: "United Airlines" },
  { code: "B6", name: "JetBlue" },
  { code: "AF", name: "Air France" },
  { code: "BA", name: "British Airways" },
  { code: "EK", name: "Emirates" },
  { code: "IB", name: "Iberia" },
  { code: "LH", name: "Lufthansa" },
  { code: "AZ", name: "ITA Airways" },
  { code: "TK", name: "Turkish Airlines" },
  { code: "QR", name: "Qatar Airways" },
  { code: "AV", name: "Avianca" },
  { code: "CM", name: "Copa Airlines" },
  { code: "LA", name: "LATAM Airlines" },
  { code: "AC", name: "Air Canada" },
  { code: "KL", name: "KLM" },
  { code: "VS", name: "Virgin Atlantic" },
  { code: "SK", name: "SAS" },
  { code: "AS", name: "Alaska Airlines" },
];
