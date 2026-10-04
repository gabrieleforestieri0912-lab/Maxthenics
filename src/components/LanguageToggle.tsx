"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useLanguage();
  const base = compact
    ? "text-[11px] px-2 py-1"
    : "text-[11px] px-3 py-1.5";
  return (
    <div
      className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1"
      role="group"
      aria-label="Language / Lingua"
    >
      {(["it", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={`${base} rounded-lg font-black uppercase tracking-widest transition-all ${
            locale === l
              ? "bg-white text-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          {l === "it" ? "IT" : "EN"}
        </button>
      ))}
    </div>
  );
}
