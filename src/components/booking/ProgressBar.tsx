"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { TOTAL_STEPS } from "./types";

export default function ProgressBar({ step }: { step: number }) {
  const { t } = useLanguage();
  const percent = (step / TOTAL_STEPS) * 100;

  return (
    <div className="mb-10">
      <p className="mb-2 text-sm font-medium text-ink-soft">
        {t("book.step")} {step} {t("book.of")} {TOTAL_STEPS}
      </p>
      <div className="h-1.5 w-full overflow-hidden rounded-pill bg-border">
        <motion.div
          className="h-full rounded-pill bg-accent"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
