"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { EASE_OUT } from "@/lib/motion";

export default function Statement() {
  const { t } = useLanguage();

  return (
    <section className="py-20" style={{ background: "var(--ink)" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="wrap max-w-2xl text-center"
      >
        <p className="mb-3 text-sm font-medium text-white/55">{t("statement.kicker")}</p>
        <p className="font-[family-name:var(--font-display)] text-[clamp(22px,3.2vw,32px)] italic leading-snug text-white">
          {t("statement.body")}
        </p>
      </motion.div>
    </section>
  );
}
