"use client";

import { useState } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface Props {
  processing: boolean;
  setProcessing: (v: boolean) => void;
  onConfirmed: (reference: string) => void;
}

export default function RealPaymentForm({ processing, setProcessing, onConfirmed }: Props) {
  const { t } = useLanguage();
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    setProcessing(false);

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed. Please try again.");
      return;
    }

    onConfirmed(paymentIntent?.id ?? `YVCJ-${Date.now().toString(36).toUpperCase()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />

      {error && <p className="text-sm text-danger">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-[15px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {processing && <CircleNotch size={18} className="animate-spin" aria-hidden />}
        {processing ? t("book.step4.processing") : t("book.step4.pay")}
      </button>
    </form>
  );
}
