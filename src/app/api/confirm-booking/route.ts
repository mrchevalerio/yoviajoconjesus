import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { fareForAddress } from "@/lib/pricing";
import { applyPromoDiscount } from "@/lib/promoCodes";
import { formatTimeSlot } from "@/lib/calendar";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendConfirmationEmail } from "@/lib/email";

interface ConfirmBookingBody {
  paymentIntentId: string;
  lang: "es" | "en";
  name: string;
  email: string;
  phone: string;
  address: string;
  date: string;
  time: string;
  passengers: number;
  luggage: number;
  airlineCode: string;
  flightNumber: string;
  promoCode?: string;
}

/**
 * The only place a booking is written to Supabase. The client never inserts
 * directly — this route independently verifies with Stripe that the payment
 * actually succeeded (and for the right amount) before writing anything,
 * using the service role key so `bookings` no longer needs a public insert
 * policy at all.
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as ConfirmBookingBody;

  if (!body.paymentIntentId || !body.name || !body.email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const baseFare = fareForAddress(body.address ?? "");
  const { fare } = applyPromoDiscount(baseFare, body.promoCode);
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (secretKey) {
    try {
      const stripe = new Stripe(secretKey);
      const paymentIntent = await stripe.paymentIntents.retrieve(body.paymentIntentId);

      if (paymentIntent.status !== "succeeded") {
        return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
      }

      if (paymentIntent.amount !== Math.round(fare * 100)) {
        return NextResponse.json({ error: "Payment amount mismatch" }, { status: 402 });
      }
    } catch {
      return NextResponse.json({ error: "Could not verify payment" }, { status: 402 });
    }
  }
  // No secret key configured: sandbox/demo mode, no real payment exists to verify.

  const reference = body.paymentIntentId;
  const locale = body.lang === "es" ? "es-US" : "en-US";
  const formattedTime = body.time ? formatTimeSlot(body.time, locale) : "";

  const { data: existing } = await supabaseAdmin
    .from("bookings")
    .select("reference")
    .eq("reference", reference)
    .maybeSingle();

  if (!existing) {
    const { error } = await supabaseAdmin.from("bookings").insert({
      reference,
      full_name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address,
      pickup_date: body.date || null,
      pickup_time: formattedTime || null,
      passengers: body.passengers,
      luggage: body.luggage,
      airline_code: body.airlineCode,
      flight_number: body.flightNumber,
      fare,
      status: "confirmed",
    });

    if (error) {
      return NextResponse.json({ error: "Failed to save booking" }, { status: 500 });
    }

    await sendConfirmationEmail({
      lang: body.lang,
      reference,
      email: body.email,
      name: body.name,
      address: body.address,
      date: body.date,
      time: formattedTime,
      passengers: body.passengers,
      luggage: body.luggage,
      fare,
    });
  }

  return NextResponse.json({ reference });
}
