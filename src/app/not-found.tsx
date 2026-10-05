"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const LINK_BASE =
  "inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-150";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative overflow-hidden flex min-h-screen items-center justify-center px-6">
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

          <p className="eyebrow mt-6">Pagina non trovata</p>

          <h1 className="page-title mt-3">Questa pagina non esiste</h1>

          <p className="body-copy mt-4">
            La pagina che stai cercando è stata spostata, eliminata o non è mai esistita.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/" className={`${LINK_BASE} btn-primary w-full sm:w-auto`}>
              Torna alla Home
            </Link>
            <Link
              href="/programs"
              className={`${LINK_BASE} btn-secondary w-full sm:w-auto`}
            >
              Vedi i Programmi
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}