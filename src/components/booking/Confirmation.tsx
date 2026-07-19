"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { EASE_OUT } from "@/lib/motion";

export default function Confirmation({ reference }: { reference: string }) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className="flex flex-col items-center py-12 text-center"
    >
      <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success-tint text-success">
        <CheckCircle size={36} weight="fill" aria-hidden />
      </span>
      <h2 className="mb-3 text-3xl">{t("book.confirm.title")}</h2>
      <p className="mb-6 max-w-md text-ink-soft">{t("book.confirm.body")}</p>
      <p className="mb-8 rounded-full bg-accent-tint px-5 py-2 text-sm font-semibold tabular-nums text-accent-dark">
        {t("book.confirm.ref")}: {reference}
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent"
      >
        {t("book.confirm.home")}
      </Link>
    </motion.div>
  );
}
