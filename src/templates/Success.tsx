"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, LayoutDashboard } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Button from "../components/Button";
import SEO from "../components/SEO";

const Success: React.FC = () => {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Clear the cart when reaching the success page
    clearCart();
  }, [clearCart]);

  return (
    <div className="page-shell relative overflow-hidden flex items-center justify-center px-6">
      <SEO
        title="Pagamento Completato"
        description="Grazie per il tuo acquisto su Maxthenics. Il tuo percorso verso la maestria del calisthenics inizia ora."
      />

      <div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none"
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="card bg-zinc-900/60 backdrop-blur-xl p-8 md:p-12 text-center relative z-10 w-full max-w-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
          className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="w-8 h-8 text-emerald-500" aria-hidden />
        </motion.div>

        <p className="eyebrow">Pagamento ricevuto</p>

        <h1 className="page-title mt-3 text-3xl md:text-4xl">
          Ordine <span className="text-emerald-500">completato</span>
        </h1>

        <p className="body-copy mt-4">
          Grazie per aver scelto Maxthenics. I tuoi nuovi protocolli sono ora sbloccati e pronti
          per essere dominati.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Button to="/my-program" size="lg" className="w-full">
            Vai ai miei programmi
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Button>
          <Button to="/dashboard" variant="secondary" size="lg" className="w-full">
            <LayoutDashboard className="w-4 h-4" aria-hidden />
            Torna alla dashboard
          </Button>
        </div>

        {sessionId && <p className="meta-mono mt-8">Session {sessionId.substring(0, 20)}...</p>}
      </motion.div>
    </div>
  );
};

export default Success;