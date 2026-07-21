import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { fareForAddress } from "@/lib/pricing";

interface CreateIntentBody {
  address: string;
  currency?: string;
}

/**
 * Real integration point: set STRIPE_SECRET_KEY in .env.local (test key
 * looks like sk_test_...) to start creating real PaymentIntents. Until
 * then this route returns a `demo: true` response and the checkout step
 * runs a simulated payment so the full flow stays clickable end to end.
 *
 * The fare is always computed here from the address, never trusted from the
 * client — otherwise a tampered request could pay less than the real price.
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as CreateIntentBody;
  const fare = fareForAddress(body.address ?? "");
  const amount = Math.round(fare * 100);
  const currency = body.currency ?? "usd";

  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json({
      demo: true,
      livemode: false,
      clientSecret: null,
      amount: amount / 100,
      currency,
    });
  }

  try {
    const stripe = new Stripe(secretKey);
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
      demo: false,
      livemode: paymentIntent.livemode,
      clientSecret: paymentIntent.client_secret,
      amount: amount / 100,
      currency,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Stripe error" },
      { status: 500 }
    );
  }
}
