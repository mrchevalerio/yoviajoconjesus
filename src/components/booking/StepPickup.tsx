"use client";

import { MapPinLine } from "@phosphor-icons/react/dist/ssr";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { MAX_PASSENGERS } from "@/lib/pricing";
import AddressAutocomplete from "../AddressAutocomplete";
import DateTimePicker from "../DateTimePicker";
import Stepper from "./Stepper";
import type { BookingData } from "./types";

interface Props {
  data: BookingData;
  onChange: (patch: Partial<BookingData>) => void;
}

export default function StepPickup({ data, onChange }: Props) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl">{t("book.step1.title")}</h2>

      <div>
        <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-ink">
          {t("book.step1.address")}
        </label>
        <AddressAutocomplete
          id="address"
          value={data.address}
          onChange={(address) => onChange({ address })}
          required
          placeholder={t("book.step1.addressPlaceholder")}
          icon={<MapPinLine size={20} className="shrink-0 text-ink-faint" aria-hidden />}
          wrapperClassName="flex items-center gap-2.5 rounded-md border border-border-strong bg-surface px-4 py-3 focus-within:border-accent"
          inputClassName="w-full min-w-0 bg-transparent text-[15px] text-ink placeholder:text-ink-faint focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">{t("book.step1.when")}</label>
        <DateTimePicker
          date={data.date}
          time={data.time}
          onChange={(p) => onChange(p)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Stepper
            label={t("book.step1.passengers")}
            value={data.passengers}
            min={1}
            max={MAX_PASSENGERS}
            onChange={(passengers) => onChange({ passengers })}
          />
          <p className="mt-1.5 text-xs text-ink-faint">{t("book.step1.passengersNote")}</p>
        </div>
        <Stepper
          label={t("book.step1.luggage")}
          value={data.luggage}
          min={0}
          max={6}
          onChange={(luggage) => onChange({ luggage })}
        />
      </div>
    </div>
  );
}
