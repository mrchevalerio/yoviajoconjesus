"use client";

import { useState } from "react";
import { CaretDown, CaretUp, Check } from "@phosphor-icons/react/dist/ssr";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { AIRLINES } from "@/lib/airlines";

const VISIBLE_COUNT = 4;

interface Props {
  value: string;
  onSelect: (code: string) => void;
}

/**
 * No licensed airline logo assets are available yet, so each carrier gets a
 * deterministic colored initials badge instead of a real logo — swap in
 * official logo assets here once they're licensed/sourced.
 */
const BADGE_COLORS = [
  "#2961A9",
  "#1E8E5A",
  "#B8562F",
  "#6B4FA0",
  "#0F7C86",
  "#A03A5C",
  "#5A6B1E",
  "#8A4B9E",
];

function badgeColor(code: string): string {
  const sum = Array.from(code).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return BADGE_COLORS[sum % BADGE_COLORS.length];
}

export default function AirlineGrid({ value, onSelect }: Props) {
  const { t } = useLanguage();
  const selectedBeyondVisible = AIRLINES.slice(VISIBLE_COUNT).some((a) => a.code === value);
  const [expanded, setExpanded] = useState(selectedBeyondVisible);

  const visibleAirlines = expanded ? AIRLINES : AIRLINES.slice(0, VISIBLE_COUNT);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {visibleAirlines.map((airline) => {
        const selected = value === airline.code;
        return (
          <button
            key={airline.code}
            type="button"
            onClick={() => onSelect(airline.code)}
            aria-pressed={selected}
            className={`relative flex flex-col items-center gap-2 rounded-md border p-3 text-center transition-[border-color,box-shadow] duration-200 ${
              selected ? "border-accent shadow-sm ring-1 ring-accent" : "border-border-strong hover:border-accent"
            }`}
          >
            {selected && (
              <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                <Check size={12} weight="bold" aria-hidden />
              </span>
            )}
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-bold text-white"
              style={{ background: badgeColor(airline.code) }}
              aria-hidden
            >
              {airline.code}
            </span>
            <span className="text-xs font-medium leading-tight text-ink-soft">{airline.name}</span>
          </button>
          );
        })}
      </div>

      {AIRLINES.length > VISIBLE_COUNT && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-accent-dark transition-colors hover:text-accent"
        >
          {expanded ? t("book.step2.seeFewerAirlines") : t("book.step2.seeMoreAirlines")}
          {expanded ? <CaretUp size={14} aria-hidden /> : <CaretDown size={14} aria-hidden />}
        </button>
      )}
    </div>
  );
}
