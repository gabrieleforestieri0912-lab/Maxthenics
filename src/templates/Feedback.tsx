"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, ChevronDown, Send } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import SEO from "../components/SEO";
import { useLanguage } from "../context/LanguageContext";

interface Category {
  id: string;
  it: string;
  en: string;
}

const categories: Category[] = [
  { id: "app", it: "App & Interfaccia", en: "App & Interface" },
  { id: "programs", it: "Programmi di Allenamento", en: "Training Programs" },
  { id: "ai", it: "Assistente AI", en: "AI Assistant" },
  { id: "bug", it: "Segnala un Bug", en: "Report a Bug" },
  { id: "suggestion", it: "Suggerimento", en: "Suggestion" },
];

const INPUT_CLASS =
  "w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 px-4 py-3 text-sm text-zinc-900 dark:text-white transition-colors placeholder:text-zinc-700 focus:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500/30";

const Feedback: React.FC = () => {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>(categories[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <SEO
          title={t("Feedback inviato", "Feedback submitted")}
          description={t("Grazie per il tuo contributo.", "Thanks for your contribution.")}
        />
        <div className="page-shell flex items-center justify-center px-6">
          <div className="w-full max-w-md">
            <EmptyState
              icon={Send}
              title={t("Feedback inviato", "Feedback submitted")}
              description={t(
                "Grazie per il tuo contributo. Lo leggiamo tutto.",
                "Thanks for your contribution. We read everything."
              )}
            >
              <Button to="/" size="lg" className="w-full">
                {t("Torna alla Dashboard", "Back to Dashboard")}
              </Button>
            </EmptyState>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="page-shell px-6 lg:px-8">
      <SEO
        title={t("Invia Feedback", "Send Feedback")}
        description={t(
          "Aiutaci a migliorare Maxthenics inviando i tuoi suggerimenti.",
          "Help us improve Maxthenics by sending your suggestions."
        )}
      />

      <div className="container-max max-w-2xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft
            size={15}
            className="group-hover:-translate-x-1 transition-transform"
            aria-hidden
          />
          <span className="meta-mono">Dashboard</span>
        </Link>

        <PageHeader
          eyebrow={t("Contattaci", "Contact us")}
          title={
            <>
              {t("Il tuo", "Your")} <span className="text-red-500">feedback</span>
            </>
          }
          description={t(
            "Ogni segnalazione viene letta. Raccontaci cosa funziona e cosa non funziona.",
            "Every report is read. Tell us what works and what doesn't."
          )}
        />

        <form onSubmit={handleSubmit} className="card bg-white dark:bg-zinc-900/60 p-6 md:p-8 mt-10 space-y-6">
          <div className="relative" ref={dropdownRef}>
            <label className="meta-mono block mb-2" id="category-label">
              {t("Categoria", "Category")}
            </label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
              aria-labelledby="category-label"
              className={`${INPUT_CLASS} flex items-center justify-between font-bold`}
            >
              <span>{t(selectedCategory.it, selectedCategory.en)}</span>
              <ChevronDown
                size={16}
                className={`text-zinc-500 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  role="listbox"
                  className="absolute left-0 right-0 mt-2 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 overflow-hidden z-50 shadow-2xl shadow-black"
                >
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      role="option"
                      aria-selected={selectedCategory.id === cat.id}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm font-bold transition-colors flex items-center justify-between ${
                        selectedCategory.id === cat.id
                          ? "bg-red-600 text-white"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-900/5 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
                      }`}
                    >
                      {t(cat.it, cat.en)}
                      {selectedCategory.id === cat.id && <Check size={14} aria-hidden />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label htmlFor="message" className="meta-mono block mb-2">
              {t("Dettagli", "Details")}
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder={t(
                "Raccontaci la tua esperienza o suggerisci un miglioramento...",
                "Tell us about your experience or suggest an improvement..."
              )}
              required
              className={`${INPUT_CLASS} resize-none leading-relaxed`}
            />
          </div>

          <Button type="submit" size="lg" className="w-full">
            {t("Invia", "Send")}
            <Send size={15} aria-hidden />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
