"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Button from "../components/Button";
import { useLanguage } from "../context/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="page-shell relative overflow-hidden flex items-center justify-center px-6">
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-[120px] pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-[120px] pointer-events-none"
        aria-hidden
      />

      {mounted && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-center max-w-lg"
        >
          <p className="text-7xl sm:text-8xl font-bold leading-none tracking-tight text-transparent bg-clip-text bg-linear-to-b from-zinc-700 to-zinc-950 select-none">
            404
          </p>

          <p className="eyebrow mt-6">{t("Pagina non trovata", "Page not found")}</p>

          <h1 className="page-title mt-3">{t("Questa pagina non esiste", "This page doesn't exist")}</h1>

          <p className="body-copy mt-4">
            {t(
              "La pagina che stai cercando è stata spostata, eliminata o non è mai esistita.",
              "The page you are looking for was moved, deleted, or never existed."
            )}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button to="/" size="lg" className="w-full sm:w-auto">
              {t("Torna alla Home", "Back to home")}
            </Button>
            <Button to="/programs" variant="secondary" size="lg" className="w-full sm:w-auto">
              {t("Vedi i Programmi", "Browse programs")}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
