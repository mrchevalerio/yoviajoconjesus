"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SUPPORTED_LANGS, translations, type Lang, type TranslationKey } from "./translations";

const LANG_KEY = "yvcj-lang";

const DEFAULT_LANG: Lang = "es";

function sanitizeLang(value: string | null): Lang {
  return (SUPPORTED_LANGS as readonly string[]).includes(value ?? "")
    ? (value as Lang)
    : DEFAULT_LANG;
}

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    // Reads a browser-only API unavailable during SSR, so it must run post-mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLangState(sanitizeLang(window.localStorage.getItem(LANG_KEY)));
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    window.localStorage.setItem(LANG_KEY, next);
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translations[lang][key] ?? translations.en[key] ?? key,
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
