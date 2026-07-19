"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { EASE_OUT } from "@/lib/motion";
import LanguageToggle from "./LanguageToggle";

const NAV_LINKS: { href: string; key: Parameters<ReturnType<typeof useLanguage>["t"]>[0] }[] = [
  { href: "/#faq", key: "nav.faq" },
];

export default function Nav() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-[padding,background-color,box-shadow] duration-300 ${
          scrolled
            ? "py-3.5 bg-bg/80 backdrop-blur-md shadow-[0_1px_0_rgba(16,27,38,0.06)]"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="wrap flex items-center gap-6">
          <Link
            href="/"
            className="mr-auto text-[15px] font-semibold text-ink transition-colors hover:text-accent"
          >
            {t("nav.home")}
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative py-1 text-[15px] font-medium text-ink-soft transition-colors hover:text-ink"
              >
                {t(link.key)}
                <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-accent transition-[width] duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <LanguageToggle />
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
          >
            {menuOpen ? <X size={22} /> : <List size={22} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28, ease: EASE_OUT }}
            className="fixed inset-0 top-0 z-[90] h-dvh overflow-y-auto bg-bg pt-24"
          >
            <nav className="wrap flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="border-b border-border py-4 font-[family-name:var(--font-display)] text-[28px] font-medium text-ink"
              >
                {t("nav.home")}
              </Link>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-border py-4 font-[family-name:var(--font-display)] text-[28px] font-medium text-ink"
                >
                  {t(link.key)}
                </a>
              ))}
              <LanguageToggle className="mt-4 self-start" />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
