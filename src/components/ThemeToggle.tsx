"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  const size = compact ? "p-1.5" : "p-2";
  return (
    <div
      className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-zinc-900/5 p-1 dark:border-white/10 dark:bg-white/5"
      role="group"
      aria-label="Tema / Theme"
    >
      {(
        [
          { value: "dark", label: "Tema scuro", icon: Moon },
          { value: "light", label: "Tema chiaro", icon: Sun },
        ] as const
      ).map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          aria-pressed={theme === value}
          title={label}
          aria-label={label}
          className={`${size} rounded-lg transition-colors ${
            theme === value
              ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
              : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          }`}
        >
          <Icon size={14} aria-hidden />
        </button>
      ))}
    </div>
  );
}
