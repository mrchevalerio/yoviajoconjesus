"use client";

import Image from "next/image";
import Link from "next/link";
import { WhatsappLogo, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto border-t border-border bg-surface py-14">
      <div className="wrap grid gap-10 sm:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="mb-3 flex items-center gap-2.5">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full text-white text-sm font-semibold"
              style={{ background: "var(--accent)" }}
            >
              YV
            </span>
            <span className="font-[family-name:var(--font-display)] text-[18px] font-medium text-ink">
              Yo Viajo con Jesus
            </span>
          </div>
          <p className="max-w-xs text-sm text-ink-soft">{t("footer.tagline")}</p>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">
            {t("footer.linksTitle")}
          </h3>
          <ul className="flex flex-col gap-2 text-sm text-ink-soft">
            <li><a href="#faq" className="hover:text-ink">{t("nav.faq")}</a></li>
            <li><Link href="/" className="hover:text-ink">{t("nav.cta")}</Link></li>
            <li><Link href="/trip-request" className="hover:text-ink">{t("nav.tripRequest")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">
            {t("footer.contactTitle")}
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm text-ink-soft">
            <li className="flex items-center gap-2">
              <WhatsappLogo size={16} className="text-accent" aria-hidden />
              <a href="https://wa.me/13474606696" target="_blank" rel="noopener" className="hover:text-ink">
                (347) 460-6696
              </a>
            </li>
            <li className="flex items-center gap-2">
              <EnvelopeSimple size={16} className="text-accent" aria-hidden /> info@yoviajoconjesus.com
            </li>
            <li className="text-ink-faint">{t("footer.hours")}</li>
          </ul>
          <Link
            href="/trip-request"
            className="mt-3 inline-block text-sm font-semibold text-accent-dark hover:underline"
          >
            {t("nav.tripRequest")}
          </Link>
        </div>
      </div>

      <div className="wrap mt-10 border-t border-border pt-6 text-xs text-ink-faint">
        © {new Date().getFullYear()} Yo Viajo con Jesus. {t("footer.rights")}
      </div>

      <div className="wrap mt-8 flex flex-col items-center border-t border-border pt-8 text-center">
        <Image src="/waitaround-logo.png" alt="" width={36} height={36} className="mb-1.5 h-9 w-auto" />
        <p className="text-xs text-ink-faint">Powered by</p>
        <a
          href="https://waitaroundllc.com/"
          target="_blank"
          rel="noopener"
          className="text-[15px] font-bold hover:underline"
          style={{ color: "#2961A9" }}
        >
          waitAround LLC
        </a>
        <p className="text-xs font-semibold text-ink-faint">Human by Design</p>
      </div>
    </footer>
  );
}
