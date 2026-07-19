"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPinLine, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { EASE_OUT } from "@/lib/motion";
import { ZONES } from "@/lib/pricing";

export default function Pricing() {
  const { t } = useLanguage();

  return (
    <section id="fleet" className="py-24">
      <div className="wrap">
        <div className="mb-16 max-w-xl">
          <span className="mb-4 block text-[13px] font-semibold uppercase tracking-[0.08em] text-accent-dark">
            {t("fleet.eyebrow")}
          </span>
          <h2 className="mb-3 text-[clamp(28px,3.6vw,40px)]">{t("fleet.title")}</h2>
          <p className="text-[15px] text-ink-soft">{t("fleet.note")}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {ZONES.map((zone, i) => (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: EASE_OUT }}
              className="group flex flex-col rounded-lg border border-border bg-surface p-7 shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <div className="mb-5 inline-flex text-accent transition-transform duration-300 group-hover:-translate-y-0.5">
                <MapPinLine size={32} aria-hidden />
              </div>
              <h3 className="mb-6 text-xl">{t(zone.labelKey)}</h3>
              <div className="mt-auto">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  {t("fleet.from")}
                </p>
                <p className="mb-4 font-[family-name:var(--font-display)] text-3xl tabular-nums">
                  ${zone.baseFare}
                </p>
                <Link
                  href="/book"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-dark"
                >
                  {t("fleet.cta")}
                  <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-6 text-sm text-ink-faint">{t("fleet.priceNote")}</p>
      </div>
    </section>
  );
}
