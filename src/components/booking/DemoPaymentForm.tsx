"use client";

import { useState } from "react";
import { CreditCard, CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface Props {
  amount: number;
  processing: boolean;
  setProcessing: (v: boolean) => void;
  onConfirmed: (reference: string) => void;
}

/**
 * Stand-in checkout UI for when STRIPE_SECRET_KEY isn't configured yet.
 * Nothing here touches a real card network — it only simulates the
 * request/response cycle so the booking flow is demoable end to end.
 */
export default function DemoPaymentForm({ amount, processing, setProcessing, onConfirmed }: Props) {
  const { t } = useLanguage();
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/29");
  const [cvc, setCvc] = useState("123");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onConfirmed(`YVCJ-${Date.now().toString(36).toUpperCase()}`);
    }, 1200);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="card" className="mb-1.5 block text-sm font-medium text-ink">
          Card number
        </label>
        <div className="flex items-center gap-2.5 rounded-md border border-border-strong bg-surface px-4 py-3 focus-within:border-accent">
          <CreditCard size={20} className="shrink-0 text-ink-faint" aria-hidden />
          <input
            id="card"
            type="text"
            inputMode="numeric"
            value={card}
            onChange={(e) => setCard(e.target.value)}
            className="w-full min-w-0 bg-transparent text-[15px] tabular-nums text-ink focus:outline-none"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiry" className="mb-1.5 block text-sm font-medium text-ink">
            Expiry
          </label>
          <input
            id="expiry"
            type="text"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="w-full rounded-md border border-border-strong bg-surface px-4 py-3 text-[15px] tabular-nums text-ink focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="cvc" className="mb-1.5 block text-sm font-medium text-ink">
            CVC
          </label>
          <input
            id="cvc"
            type="text"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            className="w-full rounded-md border border-border-strong bg-surface px-4 py-3 text-[15px] tabular-nums text-ink focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={processing}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-[15px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {processing && <CircleNotch size={18} className="animate-spin" aria-hidden />}
        {processing ? t("book.step4.processing") : `${t("book.step4.pay")} · $${amount}`}
      </button>
    </form>
  );
}
