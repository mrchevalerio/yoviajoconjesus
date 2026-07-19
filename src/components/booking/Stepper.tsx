"use client";

import { Minus, Plus } from "@phosphor-icons/react/dist/ssr";

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export default function Stepper({ label, value, min, max, onChange }: Props) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border-strong bg-surface px-4 py-3">
      <span className="text-[15px] text-ink">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label="Decrease"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border-strong text-ink-soft transition-colors duration-150 hover:border-accent hover:text-accent-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Minus size={14} aria-hidden />
        </button>
        <span className="w-4 text-center text-[15px] tabular-nums text-ink">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label="Increase"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border-strong text-ink-soft transition-colors duration-150 hover:border-accent hover:text-accent-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus size={14} aria-hidden />
        </button>
      </div>
    </div>
  );
}
