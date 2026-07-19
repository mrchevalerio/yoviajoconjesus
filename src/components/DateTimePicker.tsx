"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarBlank, CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  formatTimeSlot,
  getMonthMatrix,
  isBeforeDay,
  isSameDay,
  isSoldOut,
  monthLabel,
  timeSlots,
  toISODate,
  weekdayLabels,
} from "@/lib/calendar";

const TIME_INTERVAL_MINUTES = 15;

interface Props {
  date: string;
  time: string;
  onChange: (patch: { date?: string; time?: string }) => void;
  className?: string;
}

export default function DateTimePicker({ date, time, onChange, className = "" }: Props) {
  const { t, lang } = useLanguage();
  const locale = lang === "es" ? "es-US" : "en-US";
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = date ? new Date(`${date}T00:00:00`) : null;
  const [viewMonth, setViewMonth] = useState(selectedDate ?? today);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const days = getMonthMatrix(viewMonth);
  const weekdays = weekdayLabels(locale);
  const slots = useMemo(() => timeSlots(TIME_INTERVAL_MINUTES), []);

  const displayLabel =
    selectedDate && time
      ? `${new Intl.DateTimeFormat(locale, { weekday: "short", month: "short", day: "numeric" }).format(
          selectedDate
        )} · ${formatTimeSlot(time, locale)}`
      : selectedDate
        ? new Intl.DateTimeFormat(locale, { weekday: "short", month: "short", day: "numeric" }).format(selectedDate)
        : null;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 rounded-md border border-border-strong bg-surface px-4 py-3.5 text-left text-[15px] text-ink transition-colors duration-200 hover:border-accent sm:py-2"
      >
        <CalendarBlank size={20} className="shrink-0 text-ink-faint" aria-hidden />
        <span className={displayLabel ? "text-ink" : "text-ink-faint"}>
          {displayLabel ?? t("hero.when.placeholder")}
        </span>
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-[320px] max-w-[90vw] rounded-lg border border-border bg-surface p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-accent-tint hover:text-accent-dark"
            >
              <CaretLeft size={16} aria-hidden />
            </button>
            <span className="text-sm font-semibold capitalize text-ink">{monthLabel(viewMonth, locale)}</span>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-accent-tint hover:text-accent-dark"
            >
              <CaretRight size={16} aria-hidden />
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase text-ink-faint">
            {weekdays.map((w, i) => (
              <span key={i}>{w}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((d, i) => {
              const inMonth = d.getMonth() === viewMonth.getMonth();
              const soldOut = inMonth && !isBeforeDay(d, today) && isSoldOut(d, today);
              const disabled = isBeforeDay(d, today) || !inMonth || soldOut;
              const selected = selectedDate ? isSameDay(d, selectedDate) : false;
              const isToday = isSameDay(d, today);
              return (
                <button
                  key={i}
                  type="button"
                  disabled={disabled}
                  aria-label={soldOut ? `${d.getDate()} — ${t("calendar.soldOut")}` : undefined}
                  title={soldOut ? t("calendar.soldOut") : undefined}
                  onClick={() => onChange({ date: toISODate(d) })}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm tabular-nums transition-colors duration-150 ${
                    selected
                      ? "bg-accent font-semibold text-white"
                      : soldOut
                        ? "text-danger/50 line-through decoration-1"
                        : disabled
                          ? "text-ink-faint/40"
                          : isToday
                            ? "font-semibold text-accent-dark ring-1 ring-inset ring-accent-tint-strong hover:bg-accent-tint"
                            : "text-ink hover:bg-accent-tint"
                  }`}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-ink-faint">
            <span className="inline-block h-2 w-2 rounded-full bg-danger/40" />
            {t("calendar.soldOut")}
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <label className="mb-1.5 block text-sm font-medium text-ink">{t("book.step1.time")}</label>
            <div className="grid max-h-[168px] grid-cols-3 gap-1.5 overflow-y-auto pr-1">
              {slots.map((slot) => {
                const selected = time === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => onChange({ time: slot })}
                    className={`rounded-md py-2 text-[13px] tabular-nums transition-colors duration-150 ${
                      selected
                        ? "bg-accent font-semibold text-white"
                        : "bg-bg text-ink hover:bg-accent-tint"
                    }`}
                  >
                    {formatTimeSlot(slot, locale)}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={!date || !time}
            className="mt-4 w-full rounded-full bg-accent py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("calendar.done")}
          </button>
        </div>
      )}
    </div>
  );
}
