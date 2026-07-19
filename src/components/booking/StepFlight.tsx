"use client";

import { useEffect, useState } from "react";
import { Airplane, CircleNotch, CheckCircle, Info } from "@phosphor-icons/react/dist/ssr";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { FlightLookupResult } from "@/app/api/flight-lookup/route";
import AirlineGrid from "./AirlineGrid";
import type { BookingData } from "./types";

interface Props {
  data: BookingData;
  onChange: (patch: Partial<BookingData>) => void;
}

export default function StepFlight({ data, onChange }: Props) {
  const { t, lang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const isValidFlightNumber = /^\d{1,4}[A-Za-z]?$/.test(data.flightNumber.trim());
    if (!data.airlineCode || !isValidFlightNumber) {
      onChange({ flightInfo: null });
      // Clearing stale lookup state when inputs become invalid, not deriving render output.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(false);
      return;
    }

    setLoading(true);
    setError(false);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/flight-lookup?airline=${encodeURIComponent(data.airlineCode)}&flightNumber=${encodeURIComponent(
            data.flightNumber.trim()
          )}`
        );
        const result: FlightLookupResult = await res.json();
        onChange({ flightInfo: result });
        setError(!result.found);
      } catch {
        setError(true);
        onChange({ flightInfo: null });
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.airlineCode, data.flightNumber]);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl">{t("book.step2.title")}</h2>

      <div>
        <label className="mb-2 block text-sm font-medium text-ink">{t("book.step2.airline")}</label>
        <AirlineGrid value={data.airlineCode} onSelect={(code) => onChange({ airlineCode: code })} />
      </div>

      <div>
        <label htmlFor="flightNumber" className="mb-1.5 block text-sm font-medium text-ink">
          {t("book.step2.flightNumber")}
        </label>
        <div className="flex max-w-xs items-center gap-2.5 rounded-md border border-border-strong bg-surface px-4 py-3 focus-within:border-accent">
          <Airplane size={20} className="shrink-0 text-ink-faint" aria-hidden />
          <input
            id="flightNumber"
            type="text"
            inputMode="numeric"
            required
            value={data.flightNumber}
            onChange={(e) => onChange({ flightNumber: e.target.value })}
            placeholder={t("book.step2.flightNumberPlaceholder")}
            className="w-full min-w-0 bg-transparent text-[15px] text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </div>
      </div>

      <div aria-live="polite" className="min-h-[64px]">
        {loading && (
          <div className="flex items-center gap-2 text-sm text-ink-soft">
            <CircleNotch size={18} className="animate-spin text-accent" aria-hidden />
            {t("book.step2.lookup")}
          </div>
        )}

        {!loading && data.flightInfo?.found && (
          <div className="flex flex-col gap-2 rounded-md bg-success-tint px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium text-ink">
              <CheckCircle size={18} className="text-success" aria-hidden />
              {t("book.step2.scheduled")}:{" "}
              {data.flightInfo.scheduledDeparture &&
                new Date(data.flightInfo.scheduledDeparture).toLocaleString(
                  lang === "es" ? "es-US" : "en-US",
                  { weekday: "short", hour: "numeric", minute: "2-digit" }
                )}
            </div>
            {data.flightInfo.demo && (
              <p className="flex items-center gap-1.5 text-xs text-ink-faint">
                <Info size={14} aria-hidden /> {t("book.step2.demoNotice")}
              </p>
            )}
          </div>
        )}

        {!loading && error && (
          <p className="text-sm text-ink-soft">{t("book.step2.notFound")}</p>
        )}
      </div>
    </div>
  );
}
