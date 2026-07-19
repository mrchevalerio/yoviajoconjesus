"use client";

import { User, Phone, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { BookingData } from "./types";

interface Props {
  data: BookingData;
  onChange: (patch: Partial<BookingData>) => void;
}

export default function StepContact({ data, onChange }: Props) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl">{t("book.step3.title")}</h2>

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
          {t("book.step3.name")}
        </label>
        <div className="flex items-center gap-2.5 rounded-md border border-border-strong bg-surface px-4 py-3 focus-within:border-accent">
          <User size={20} className="shrink-0 text-ink-faint" aria-hidden />
          <input
            id="name"
            type="text"
            required
            autoComplete="name"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="w-full min-w-0 bg-transparent text-[15px] text-ink focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink">
            {t("book.step3.phone")}
          </label>
          <div className="flex items-center gap-2.5 rounded-md border border-border-strong bg-surface px-4 py-3 focus-within:border-accent">
            <Phone size={20} className="shrink-0 text-ink-faint" aria-hidden />
            <input
              id="phone"
              type="tel"
              required
              autoComplete="tel"
              value={data.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              className="w-full min-w-0 bg-transparent text-[15px] text-ink focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
            {t("book.step3.email")}
          </label>
          <div className="flex items-center gap-2.5 rounded-md border border-border-strong bg-surface px-4 py-3 focus-within:border-accent">
            <EnvelopeSimple size={20} className="shrink-0 text-ink-faint" aria-hidden />
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              className="w-full min-w-0 bg-transparent text-[15px] text-ink focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
