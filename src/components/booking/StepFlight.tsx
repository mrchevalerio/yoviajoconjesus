"use client";

import { Airplane } from "@phosphor-icons/react/dist/ssr";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import AirlineGrid from "./AirlineGrid";
import type { BookingData } from "./types";

interface Props {
  data: BookingData;
  onChange: (patch: Partial<BookingData>) => void;
}

export default function StepFlight({ data, onChange }: Props) {
  const { t } = useLanguage();

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
    </div>
  );
}
