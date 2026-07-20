export interface BookingData {
  address: string;
  date: string;
  time: string;
  passengers: number;
  luggage: number;
  airlineCode: string;
  flightNumber: string;
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
  name: "",
  phone: "",
  email: "",
};

export const TOTAL_STEPS = 3;
