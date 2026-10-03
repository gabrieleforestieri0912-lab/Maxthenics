/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />

      {mounted && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-lg"
        >
          {/* 404 number */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="relative inline-block mb-8"
          >
            <span className="text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-red-500 to-orange-500 select-none">
              404
            </span>
            <span className="absolute inset-0 text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-red-500/20 to-transparent blur-sm select-none">
              404
            </span>
          </motion.div>

          {/* Label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-red-500 font-black tracking-[0.4em] uppercase text-xs mb-4"
          >
            Pagina non trovata
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-3xl font-black text-white mb-4 tracking-tight"
          >
            Questa pagina non esiste
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-zinc-500 mb-10 leading-relaxed"
          >
            La pagina che stai cercando è stata spostata, eliminata o non è mai esistita.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/"
              className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl transition-all hover:scale-[1.03] active:scale-[0.98] text-sm uppercase tracking-widest shadow-xl shadow-red-900/30"
            >
              Torna alla Home
            </Link>
            <Link
              to="/programs"
              className="w-full sm:w-auto px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-black rounded-xl transition-all text-sm uppercase tracking-widest"
            >
              Vedi Programmi
            </Link>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
