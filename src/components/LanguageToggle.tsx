"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Lang } from "@/lib/i18n/translations";

export default function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useLanguage();

  const options: Lang[] = ["en", "es"];

  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-full border border-border-strong bg-surface p-[3px] ${className}`}
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLang(option)}
          aria-pressed={lang === option}
          className={`rounded-full px-3 py-1.5 text-xs font-bold tracking-wide transition-colors duration-[180ms] ${
            lang === option
              ? "bg-ink text-white"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          {t(option === "en" ? "lang.en" : "lang.es")}
        </button>
      ))}
    </div>
  );
}
