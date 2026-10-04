"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShoppingBag, ArrowRight, Star } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import SEO from '../components/SEO';

const Success: React.FC = () => {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Clear the cart when reaching the success page
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <SEO 
        title="Pagamento Completato"
        description="Grazie per il tuo acquisto su Maxthenics. Il tuo percorso verso la maestria del calisthenics inizia ora."
      />
      
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl w-full bg-zinc-900/50 border border-white/10 rounded-[2.5rem] p-8 md:p-16 text-center relative z-10 backdrop-blur-xl shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 bg-green-500/10 border border-green-500/50 rounded-3xl flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter leading-none"
        >
          ORDINE <br />
          <span className="text-green-500">COMPLETATO!</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-zinc-400 mb-10 leading-relaxed font-medium"
        >
          Grazie per aver scelto Maxthenics. Abbiamo ricevuto il tuo pagamento. 
          I tuoi nuovi protocolli sono ora sbloccati e pronti per essere dominati.
        </motion.p>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              to="/my-program"
              className="group w-full bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_20px_50px_rgba(255,255,255,0.1)] uppercase tracking-widest text-sm"
            >
              Vai ai Miei Programmi
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              to="/dashboard"
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all text-sm uppercase tracking-widest border border-white/5"
            >
              <ShoppingBag className="w-5 h-5" />
              Torna alla Dashboard
            </Link>
          </motion.div>
        </div>

        {sessionId && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 1 }}
            className="mt-8 text-[10px] text-zinc-500 font-mono uppercase"
          >
            Session ID: {sessionId.substring(0, 20)}...
          </motion.p>
        )}

        {/* Decorative Stars */}
        <div className="absolute top-10 right-10 opacity-20">
            <Star className="text-red-500 animate-pulse" size={24} />
        </div>
        <div className="absolute bottom-10 left-10 opacity-20">
            <Star className="text-orange-500 animate-pulse" size={16} />
        </div>
      </motion.div>
    </div>
  );
};

export default Success;
