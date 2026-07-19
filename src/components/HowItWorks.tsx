"use client";

import { motion } from "framer-motion";
import { MapPinLine, CreditCard, Car } from "@phosphor-icons/react/dist/ssr";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { EASE_OUT } from "@/lib/motion";

const STEPS = [
  { icon: MapPinLine, titleKey: "how.step1.title", bodyKey: "how.step1.body" },
  { icon: CreditCard, titleKey: "how.step2.title", bodyKey: "how.step2.body" },
  { icon: Car, titleKey: "how.step3.title", bodyKey: "how.step3.body" },
] as const;

export default function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section id="how-it-works" className="py-24">
      <div className="wrap">
        <div className="mb-16 max-w-xl">
          <span className="mb-4 block text-[13px] font-semibold uppercase tracking-[0.08em] text-accent-dark">
            {t("how.eyebrow")}
          </span>
          <h2 className="text-[clamp(28px,3.6vw,40px)]">{t("how.title")}</h2>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: EASE_OUT }}
                className={i > 0 ? "border-border pl-8 sm:border-l" : ""}
              >
                <span className="mb-4 inline-flex text-3xl font-[family-name:var(--font-display)] text-accent-tint-strong">
                  0{i + 1}
                </span>
                <div className="mb-4 inline-flex text-accent">
                  <Icon size={28} aria-hidden />
                </div>
                <h3 className="mb-2.5 text-[21px]">{t(step.titleKey)}</h3>
                <p className="text-[15px] leading-relaxed text-ink-soft">{t(step.bodyKey)}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
