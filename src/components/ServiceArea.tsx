"use client";

import { motion } from "framer-motion";
import { Buildings, TreeEvergreen, Mountains, Airplane } from "@phosphor-icons/react/dist/ssr";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { EASE_OUT } from "@/lib/motion";

const ZONES = [
  { icon: Buildings, titleKey: "area.zone1.title", bodyKey: "area.zone1.body" },
  { icon: TreeEvergreen, titleKey: "area.zone2.title", bodyKey: "area.zone2.body" },
  { icon: Mountains, titleKey: "area.zone3.title", bodyKey: "area.zone3.body" },
] as const;

export default function ServiceArea() {
  const { t } = useLanguage();

  return (
    <section id="service-area" className="border-y border-border bg-surface py-24">
      <div className="wrap">
        <div className="mb-16 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div className="max-w-xl">
            <span className="mb-4 block text-[13px] font-semibold uppercase tracking-[0.08em] text-accent-dark">
              {t("area.eyebrow")}
            </span>
            <h2 className="mb-4 text-[clamp(28px,3.6vw,40px)]">{t("area.title")}</h2>
            <p className="text-[15px] leading-relaxed text-ink-soft">{t("area.body")}</p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="relative flex items-center justify-center gap-4 rounded-lg bg-accent-tint p-8"
          >
            <div className="flex flex-col items-center gap-2 text-ink-soft">
              <Buildings size={22} className="text-accent" aria-hidden />
              <span className="text-xs font-semibold">Manhattan</span>
            </div>
            <div className="h-px flex-1 border-t-2 border-dashed border-accent-tint-strong" />
            <div className="flex flex-col items-center gap-2 text-ink-soft">
              <Mountains size={22} className="text-accent" aria-hidden />
              <span className="text-xs font-semibold">Bronx</span>
            </div>
            <div className="h-px flex-1 border-t-2 border-dashed border-accent-tint-strong" />
            <div className="flex flex-col items-center gap-2 text-ink">
              <Airplane size={22} className="text-accent" aria-hidden />
              <span className="text-xs font-semibold">JFK</span>
            </div>
          </motion.div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {ZONES.map((zone, i) => {
            const Icon = zone.icon;
            return (
              <motion.div
                key={zone.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE_OUT }}
                className="rounded-lg border border-border bg-bg p-6"
              >
                <div className="mb-3 inline-flex text-accent">
                  <Icon size={26} aria-hidden />
                </div>
                <h3 className="mb-1.5 text-lg">{t(zone.titleKey)}</h3>
                <p className="text-sm text-ink-soft">{t(zone.bodyKey)}</p>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-8 max-w-2xl text-sm text-ink-faint">{t("area.disclaimer")}</p>
      </div>
    </section>
  );
}
