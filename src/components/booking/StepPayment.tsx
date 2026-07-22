"use client";

import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { CircleNotch, Info, LockSimple, Tag } from "@phosphor-icons/react/dist/ssr";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getStripe } from "@/lib/stripeClient";
import { fareForAddress } from "@/lib/pricing";
import { formatTimeSlot } from "@/lib/calendar";
import type { BookingData } from "./types";
import RealPaymentForm from "./RealPaymentForm";
import DemoPaymentForm from "./DemoPaymentForm";

interface Props {
  data: BookingData;
  onConfirmed: (reference: string, promoCode?: string) => void;
  processing: boolean;
  setProcessing: (v: boolean) => void;
}

interface IntentResponse {
  demo: boolean;
  livemode: boolean;
  clientSecret: string | null;
  amount: number;
  discount: number;
  promoValid: boolean;
  currency: string;
  error?: string;
}

export default function StepPayment({ data, onConfirmed, processing, setProcessing }: Props) {
  const { t, lang } = useLanguage();
  const locale = lang === "es" ? "es-US" : "en-US";
  const [intent, setIntent] = useState<IntentResponse | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const [promoTouched, setPromoTouched] = useState(false);

  const fare = fareForAddress(data.address);

  useEffect(() => {
    let cancelled = false;
    setIntent(null);
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: data.address, promoCode: appliedPromo }),
    })
      .then((res) => res.json())
      .then((json: IntentResponse) => {
        if (!cancelled) setIntent(json);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [data.address, appliedPromo]);

  function handleApplyPromo() {
    setPromoTouched(true);
    setAppliedPromo(promoInput);
  }

  const total = intent ? intent.amount : fare;
  const promoInvalid = promoTouched && appliedPromo && intent && !intent.promoValid;

  function handleConfirmedWithPromo(reference: string) {
    onConfirmed(reference, intent?.promoValid ? appliedPromo : undefined);
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl">{t("book.step4.title")}</h2>

      <div className="rounded-md border border-border bg-surface p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-faint">
          {t("book.step4.summary")}
        </h3>
        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft">{t("book.step1.address")}</dt>
            <dd className="text-right text-ink">{data.address}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft">{t("book.step1.date")} / {t("book.step1.time")}</dt>
            <dd className="text-ink">{data.date} · {data.time ? formatTimeSlot(data.time, locale) : data.time}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft">{t("book.step2.flightNumber")}</dt>
            <dd className="text-ink">{data.airlineCode}{data.flightNumber}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft">{t("book.step1.passengers")} / {t("book.step1.luggage")}</dt>
            <dd className="text-ink">{data.passengers} · {data.luggage}</dd>
          </div>
          <div className="mt-2 flex justify-between gap-4 border-t border-border pt-2 text-base font-semibold">
            <dt className="text-ink">Total</dt>
            <dd className="tabular-nums text-ink">
              {intent && intent.discount > 0 ? (
                <>
                  <span className="mr-2 text-sm font-normal text-ink-faint line-through">${fare}</span>
                  ${total}
                </>
              ) : (
                `$${total}`
              )}
            </dd>
          </div>
        </dl>
      </div>

      <div className="rounded-md border border-border bg-surface p-4">
        <label htmlFor="promo" className="mb-1.5 block text-sm font-medium text-ink">
          {t("book.step4.promoLabel")}
        </label>
        <div className="flex gap-2">
          <div className="flex flex-1 items-center gap-2.5 rounded-md border border-border-strong bg-bg px-4 py-2.5 focus-within:border-accent">
            <Tag size={18} className="shrink-0 text-ink-faint" aria-hidden />
            <input
              id="promo"
              type="text"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              placeholder={t("book.step4.promoPlaceholder")}
              className="w-full min-w-0 bg-transparent text-[15px] text-ink placeholder:text-ink-faint focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={handleApplyPromo}
            disabled={!promoInput.trim()}
            className="rounded-md border border-border-strong px-4 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("book.step4.promoApply")}
          </button>
        </div>
        {promoInvalid && <p className="mt-1.5 text-xs text-danger">{t("book.step4.promoInvalid")}</p>}
        {intent?.promoValid && (
          <p className="mt-1.5 text-xs text-success">
            {t("book.step4.promoApplied")} (-${intent.discount})
          </p>
        )}
      </div>

      {intent && !intent.livemode && (
        <p className="flex items-start gap-2 rounded-md bg-accent-tint px-4 py-3 text-xs text-accent-dark">
          <Info size={16} className="mt-0.5 shrink-0" aria-hidden />
          {t("book.step4.testNotice")}
        </p>
      )}

      {!intent && !loadError && (
        <div className="flex items-center gap-2 text-sm text-ink-soft">
          <CircleNotch size={18} className="animate-spin text-accent" aria-hidden />
          {t("book.step4.processing")}
        </div>
      )}

      {loadError && (
        <p className="text-sm text-danger">Something went wrong preparing payment. Please try again.</p>
      )}

      {intent && !intent.clientSecret && (
        <DemoPaymentForm
          amount={total}
          processing={processing}
          setProcessing={setProcessing}
          onConfirmed={handleConfirmedWithPromo}
        />
      )}

      {intent && intent.clientSecret && (
        <Elements key={intent.clientSecret} stripe={getStripe()} options={{ clientSecret: intent.clientSecret }}>
          <RealPaymentForm processing={processing} setProcessing={setProcessing} onConfirmed={handleConfirmedWithPromo} />
        </Elements>
      )}

      <p className="flex items-center gap-1.5 text-xs text-ink-faint">
        <LockSimple size={14} aria-hidden /> Secure checkout
      </p>
    </div>
  );
}
