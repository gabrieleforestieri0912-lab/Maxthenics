"use client";

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
    num: "01",
    title: "Analisi reale delle serie",
    desc: "Registri serie, ripetizioni e recupero. Il sistema ti dice quando spingere e quando fermarti, in base a quello che hai fatto davvero.",
    icon: <Zap size={18} className="text-red-600" />,
  },
  {
    num: "02",
    title: "Carico che si adatta",
    desc: "Se arrivi stanco, la seduta si alleggerisce. Se stai bene, alza il volume. Niente settimane buttate.",
    icon: <Activity size={18} className="text-red-600" />,
  },
  {
    num: "03",
    title: "Skill misurate",
    desc: "Planche, Front Lever, Handstand: tieni traccia di gradi, secondi e profondità. Vedi se stai davvero migliorando.",
    icon: <BarChart3 size={18} className="text-red-600" />,
  },
  {
    num: "04",
    title: "Costruito sul tuo corpo",
    desc: "Altezza, peso, leve e infortuni passati: le progressioni tengono conto di come sei fatto, non di un atleta medio.",
    icon: <ShieldCheck size={18} className="text-red-600" />,
  },
  {
    num: "05",
    title: "Video che spiegano",
    desc: "Ogni skill è divisa in passaggi con video e spiegazioni pratiche. Sai cosa fare, in che ordine, e perché.",
    icon: <Dumbbell size={18} className="text-red-600" />,
  },
  {
    num: "06",
    title: "Atleti veri, non numeri",
    desc: "Un gruppo ristretto dove confrontare video, chiedere feedback e partecipare a challenge mensili.",
    icon: <Users size={18} className="text-red-600" />,
  }
];

const Features = () => {
  return (
    <section id="features" className="section-padding bg-zinc-950 border-t border-white/10 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">
              02 — Cosa include
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Quello che ti serve,<br />niente fumo.
            </h2>
          </div>
          <p className="text-zinc-400 text-base max-w-sm leading-relaxed">
            Sei funzioni, ognuna con un lavoro preciso. Se una non ti serve, la ignori.
          </p>
        </div>

        <div className="border-t border-white/10">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="group grid grid-cols-[auto_1fr] md:grid-cols-[64px_48px_1fr_1.5fr] gap-4 md:gap-6 items-start py-7 border-b border-white/10 hover:bg-zinc-900/60 transition-colors px-2 md:px-4 -mx-2 md:-mx-4"
            >
              <span className="font-mono text-xs text-zinc-600 pt-1">{feature.num}</span>
              <div className="hidden md:flex w-11 h-11 rounded-lg bg-zinc-900 border border-white/10 items-center justify-center shrink-0">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                {feature.title}
              </h3>
              <p className="text-zinc-400 text-[15px] leading-relaxed col-span-2 md:col-span-1">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
