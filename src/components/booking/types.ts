import type { FlightLookupResult } from "@/app/api/flight-lookup/route";

export interface BookingData {
  address: string;
  date: string;
  time: string;
  passengers: number;
  luggage: number;
  airlineCode: string;
  flightNumber: string;
  flightInfo: FlightLookupResult | null;
  name: string;
  phone: string;
  email: string;
}

export const INITIAL_BOOKING_DATA: BookingData = {
  address: "",
  date: "",
  time: "",
  passengers: 1,
  luggage: 1,
  airlineCode: "",
  flightNumber: "",
  flightInfo: null,
  name: "",
  phone: "",
  email: "",
};

export const TOTAL_STEPS = 3;
