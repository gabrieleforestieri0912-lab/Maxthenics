"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Locale } from "../data/programs";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (it: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "it",
  setLocale: () => {},
  t: (it) => it,
});

const STORAGE_KEY = "maxthenics-locale";

function detectInitialLocale(): Locale {
  if (typeof window === "undefined") return "it";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "it" || stored === "en") return stored;
  } catch {
    /* ignore */
  }
  const nav = typeof navigator !== "undefined" ? navigator.language.toLowerCase() : "it";
  if (nav.startsWith("en")) return "en";
  return "it";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => detectInitialLocale());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = locale === "en" ? "en" : "it";
  }, [locale]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);
  const t = useCallback((it: string, en: string) => (locale === "en" ? en : it), [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
