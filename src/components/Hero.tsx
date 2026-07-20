"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { EASE_OUT } from "@/lib/motion";
import { MAX_PASSENGERS } from "@/lib/pricing";
import AddressAutocomplete from "./AddressAutocomplete";
import Stepper from "./booking/Stepper";
import DateTimePicker from "./DateTimePicker";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: EASE_OUT },
  }),
};

export default function Hero() {
  const { t } = useLanguage();
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [luggage, setLuggage] = useState(1);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (address) params.set("address", address);
    if (date) params.set("date", date);
    if (time) params.set("time", time);
    params.set("passengers", String(passengers));
    params.set("luggage", String(luggage));
    router.push(`/book?${params.toString()}`);
  }

  return (
    <section className="flex min-h-[100dvh] items-center justify-center px-4 pb-24 pt-32">
      <div className="mx-auto w-full max-w-2xl text-center">
        <motion.h1
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-3 font-[family-name:var(--font-display)] text-[clamp(32px,5vw,44px)]"
        >
          Yo Viajo con <em className="font-normal italic text-accent">Jesus</em>
        </motion.h1>

        <motion.p
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-10 text-[15px] text-ink-soft"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.form
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          onSubmit={handleSubmit}
          className="flex flex-col gap-3"
        >
          <AddressAutocomplete
            value={address}
            onChange={setAddress}
            required
            placeholder={t("hero.search.placeholder")}
            icon={
              <>
                <MagnifyingGlass size={20} className="shrink-0 text-ink-faint" aria-hidden />
                <span className="sr-only">{t("hero.search.label")}</span>
              </>
            }
            wrapperClassName="flex w-full items-center gap-3 rounded-full border border-border-strong bg-surface px-5 py-4 shadow-md transition-shadow duration-200 focus-within:shadow-lg"
            inputClassName="w-full min-w-0 bg-transparent text-center text-[16px] text-ink placeholder:text-ink-faint focus:outline-none sm:text-left"
          />

          <DateTimePicker
            date={date}
            time={time}
            onChange={(p) => {
              if (p.date !== undefined) setDate(p.date);
              if (p.time !== undefined) setTime(p.time);
            }}
            className="[&>button]:justify-center [&>button]:rounded-full sm:[&>button]:justify-start"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <Stepper
              label={t("book.step1.passengers")}
              value={passengers}
              min={1}
              max={MAX_PASSENGERS}
              onChange={setPassengers}
            />
            <Stepper
              label={t("book.step1.luggage")}
              value={luggage}
              min={0}
              max={6}
              onChange={setLuggage}
            />
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-full bg-accent px-8 py-3.5 text-[15px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-accent-dark"
          >
            {t("hero.search.button")}
          </button>
        </motion.form>

        <motion.p
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-8 text-xs text-ink-faint"
        >
          {t("hero.urgency")}
        </motion.p>
      </div>
    </section>
  );
}
