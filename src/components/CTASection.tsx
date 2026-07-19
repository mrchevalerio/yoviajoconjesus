"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { EASE_OUT } from "@/lib/motion";

export default function CTASection() {
  const { t } = useLanguage();

  return (
    <section className="py-24" style={{ background: "var(--ink)" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="wrap max-w-2xl text-center"
      >
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-[clamp(28px,4vw,40px)] italic text-white">
          {t("cta.title")}
        </h2>
        <p className="mb-8 text-[17px] text-white/70">{t("cta.body")}</p>
        <Link
          href="/book"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-[15px] font-semibold text-white shadow-md transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-accent-dark"
        >
          {t("cta.button")}
          <ArrowRight size={18} aria-hidden />
        </Link>
      </motion.div>
    </section>
  );
}
