"use client";

import { motion } from "framer-motion";
import { Quotes, Star } from "@phosphor-icons/react/dist/ssr";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { EASE_OUT } from "@/lib/motion";

const TESTIMONIALS = [
  { quoteKey: "testimonials.t1.quote", nameKey: "testimonials.t1.name", locKey: "testimonials.t1.loc" },
  { quoteKey: "testimonials.t2.quote", nameKey: "testimonials.t2.name", locKey: "testimonials.t2.loc" },
  { quoteKey: "testimonials.t3.quote", nameKey: "testimonials.t3.name", locKey: "testimonials.t3.loc" },
  { quoteKey: "testimonials.t4.quote", nameKey: "testimonials.t4.name", locKey: "testimonials.t4.loc" },
  { quoteKey: "testimonials.t5.quote", nameKey: "testimonials.t5.name", locKey: "testimonials.t5.loc" },
  { quoteKey: "testimonials.t6.quote", nameKey: "testimonials.t6.name", locKey: "testimonials.t6.loc" },
] as const;

function Stars({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-0.5 ${className}`} aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={14} weight="fill" className="text-accent" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { t } = useLanguage();

  return (
    <section className="border-y border-border bg-surface py-24">
      <div className="wrap">
        <div className="mb-16 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <span className="mb-4 block text-[13px] font-semibold uppercase tracking-[0.08em] text-accent-dark">
              {t("testimonials.eyebrow")}
            </span>
            <h2 className="text-[clamp(28px,3.6vw,40px)]">{t("testimonials.title")}</h2>
          </div>

          <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1.5">
            <div className="flex items-center gap-2">
              <Stars />
              <span className="font-[family-name:var(--font-display)] text-2xl tabular-nums text-ink">
                {t("testimonials.rating")}
              </span>
            </div>
            <p className="text-xs text-ink-faint">{t("testimonials.ratingNote")}</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((item, i) => (
            <motion.figure
              key={item.nameKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: EASE_OUT }}
              className="flex flex-col rounded-lg bg-bg p-7"
            >
              <Stars className="mb-3" />
              <Quotes size={22} className="mb-3 text-accent-tint-strong" weight="fill" aria-hidden />
              <blockquote className="mb-5 text-[15px] italic leading-relaxed text-ink">
                &ldquo;{t(item.quoteKey)}&rdquo;
              </blockquote>
              <figcaption className="mt-auto text-sm">
                <span className="font-semibold text-ink">{t(item.nameKey)}</span>
                <span className="text-ink-faint"> · {t(item.locKey)}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
