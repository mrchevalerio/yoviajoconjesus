"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { EASE_OUT } from "@/lib/motion";
import { MAX_PASSENGERS, fareForAddress } from "@/lib/pricing";
import { formatTimeSlot } from "@/lib/calendar";
import { supabase } from "@/lib/supabase";
import ProgressBar from "./ProgressBar";
import StepFlight from "./StepFlight";
import StepContact from "./StepContact";
import StepPayment from "./StepPayment";
import Confirmation from "./Confirmation";
import { INITIAL_BOOKING_DATA, TOTAL_STEPS, type BookingData } from "./types";

function isStepValid(step: number, data: BookingData): boolean {
  switch (step) {
    case 1:
      return Boolean(data.airlineCode && /^\d{1,4}[A-Za-z]?$/.test(data.flightNumber.trim()));
    case 2:
      return Boolean(data.name && data.phone && /\S+@\S+\.\S+/.test(data.email));
    default:
      return true;
  }
}

function parseCount(raw: string | null, fallback: number, min: number, max: number): number {
  const n = Number(raw);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : fallback;
}

export default function BookingWizard() {
  const { t, lang } = useLanguage();
  const locale = lang === "es" ? "es-US" : "en-US";
  const searchParams = useSearchParams();

  const [data, setData] = useState<BookingData>(() => ({
    ...INITIAL_BOOKING_DATA,
    address: searchParams.get("address") ?? "",
    date: searchParams.get("date") ?? "",
    time: searchParams.get("time") ?? "",
    passengers: parseCount(searchParams.get("passengers"), 1, 1, MAX_PASSENGERS),
    luggage: parseCount(searchParams.get("luggage"), 1, 0, 6),
  }));
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [processing, setProcessing] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const patch = (p: Partial<BookingData>) => setData((prev) => ({ ...prev, ...p }));

  async function handleConfirmed(reference: string) {
    const formattedTime = data.time ? formatTimeSlot(data.time, locale) : "";
    const fare = fareForAddress(data.address);

    const { error } = await supabase.from("bookings").insert({
      reference,
      full_name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      pickup_date: data.date || null,
      pickup_time: formattedTime || null,
      passengers: data.passengers,
      luggage: data.luggage,
      airline_code: data.airlineCode,
      flight_number: data.flightNumber,
      fare,
      status: "confirmed",
    });

    // Payment already succeeded — don't block the confirmation screen on a
    // database hiccup, just leave a trace for follow-up.
    if (error) console.error("Failed to save booking:", error.message);

    // Same reasoning — a failed confirmation email shouldn't block the
    // confirmation screen either, just leave a trace for follow-up.
    fetch("/api/send-confirmation-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lang,
        reference,
        email: data.email,
        name: data.name,
        address: data.address,
        date: data.date,
        time: formattedTime,
        passengers: data.passengers,
        luggage: data.luggage,
        fare,
      }),
    }).catch((err) => console.error("Failed to send confirmation email:", err));

    setReference(reference);
  }

  function goNext() {
    if (step < TOTAL_STEPS && isStepValid(step, data)) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => Math.max(1, s - 1));
  }

  const valid = useMemo(() => isStepValid(step, data), [step, data]);

  if (reference) {
    return (
      <div className="wrap max-w-2xl">
        <Confirmation reference={reference} />
      </div>
    );
  }

  return (
    <div className="wrap max-w-2xl">
      <h1 className="mb-8 text-[clamp(26px,3.6vw,34px)]">{t("book.title")}</h1>

      <ProgressBar step={step} />

      <motion.div
        key={step}
        initial={{ opacity: 0, x: direction === 1 ? 32 : -32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.32, ease: EASE_OUT }}
      >
        {step === 1 && <StepFlight data={data} onChange={patch} />}
        {step === 2 && <StepContact data={data} onChange={patch} />}
        {step === 3 && (
          <StepPayment
            data={data}
            processing={processing}
            setProcessing={setProcessing}
            onConfirmed={handleConfirmed}
          />
        )}
      </motion.div>

      {step < TOTAL_STEPS && (
        <div className="mt-10 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
            >
              <ArrowLeft size={16} aria-hidden />
              {t("book.back")}
            </button>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={goNext}
            disabled={!valid}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {t("book.continue")}
          </button>
        </div>
      )}

      {step === TOTAL_STEPS && !processing && (
        <div className="mt-6">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowLeft size={16} aria-hidden />
            {t("book.back")}
          </button>
        </div>
      )}
    </div>
  );
}
