/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Zap,
  BarChart3,
  ShieldCheck,
  Users,
  Dumbbell,
  Activity,
} from "lucide-react";

const FEATURES = [
  {
    title: "Analisi AI Real-Time",
    desc: "Ogni tua serie viene processata da un sistema neurale che calcola reclutamento motorio, affaticamento e finestra di recupero in tempo reale.",
    icon: <Zap className="text-red-500" />,
    color: "bg-red-500/10",
  },
  {
    title: "Protocolli Adattivi",
    desc: "Il carico si regola da solo in base al tuo recupero giornaliero: niente più sedute sprecate per stanchezza o volumi insufficienti.",
    icon: <Activity className="text-red-500" />,
    color: "bg-red-500/10",
  },
  {
    title: "Tracking Skill",
    desc: "Gradi di inclinazione in Planche, secondi di Front Lever, profondità Handstand: ogni variabile è tracciata con precisione centimetrica.",
    icon: <BarChart3 className="text-red-500" />,
    color: "bg-red-500/10",
  },
  {
    title: "Profilo Biometrico",
    desc: "Calcolo dei tuoi leveraggi ossei per identificare le progressioni più sicure ed efficaci per la tua struttura fisica specifica.",
    icon: <ShieldCheck className="text-red-500" />,
    color: "bg-red-500/10",
  },
  {
    title: "Mastery Academy",
    desc: "Ogni skill è scomposta in micro-adattamenti anatomici: video 4K con voiceover che spiega esattamente cosa fare in ogni fase del movimento.",
    icon: <Dumbbell className="text-red-500" />,
    color: "bg-red-500/10",
  },
  {
    title: "Elite Community",
    desc: "Network chiuso dei migliori atleti: scambio feedback, confronto settimanale su skill, challenge esclusive e accesso diretto ai coach.",
    icon: <Users className="text-red-500" />,
    color: "bg-red-500/10",
  }
];

const Features = () => {
  return (
    <section id="features" className="section-padding relative overflow-hidden scroll-mt-24">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="mb-16 lg:mb-20 text-center">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-red-600 font-black tracking-[0.4em] uppercase text-[10px] mb-4 block"
          >
            Tecnologia d&apos;Elite
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none"
          >
            POTENZA <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-orange-500 italic pr-2">SENZA LIMITI</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 text-base md:text-lg max-w-2xl mx-auto mt-6 font-medium leading-relaxed"
          >
            Ogni funzionalità è progettata per un unico scopo: portarti al massimo delle tue capacitá senza lasciare nulla al caso.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative p-7 bg-zinc-900/30 border border-white/5 rounded-2xl hover:border-red-500/20 transition-all duration-500 hover:shadow-xl hover:shadow-red-900/10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-lg group-hover:shadow-red-900/20`}>
                  {React.cloneElement(feature.icon as any, { size: 22 })}
                </div>
                <h3 className="text-base font-black text-white mb-3 group-hover:text-red-500 transition-colors uppercase tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
