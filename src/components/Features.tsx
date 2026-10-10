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
import { useLanguage } from "../context/LanguageContext";

const Features = () => {
  const { t } = useLanguage();

  const FEATURES = [
    {
      num: "01",
      title: t("Analisi reale delle serie", "Real set analysis"),
      desc: t(
        "Registri serie, ripetizioni e recupero. Il sistema ti dice quando spingere e quando fermarti, in base a quello che hai fatto davvero.",
        "Log sets, reps and rest. The system tells you when to push and when to stop, based on what you actually did."
      ),
      icon: <Zap size={18} className="text-red-600" />,
    },
    {
      num: "02",
      title: t("Carico che si adatta", "Adaptive load"),
      desc: t(
        "Se arrivi stanco, la seduta si alleggerisce. Se stai bene, alza il volume. Niente settimane buttate.",
        "If you arrive tired, the session lightens up. If you feel good, volume goes up. No wasted weeks."
      ),
      icon: <Activity size={18} className="text-red-600" />,
    },
    {
      num: "03",
      title: t("Skill misurate", "Measured skills"),
      desc: t(
        "Planche, Front Lever, Handstand: tieni traccia di gradi, secondi e profondità. Vedi se stai davvero migliorando.",
        "Planche, Front Lever, Handstand: track degrees, seconds and depth. See whether you're really improving."
      ),
      icon: <BarChart3 size={18} className="text-red-600" />,
    },
    {
      num: "04",
      title: t("Costruito sul tuo corpo", "Built on your body"),
      desc: t(
        "Altezza, peso, leve e infortuni passati: le progressioni tengono conto di come sei fatto, non di un atleta medio.",
        "Height, weight, levers and past injuries: progressions account for how you're built, not an average athlete."
      ),
      icon: <ShieldCheck size={18} className="text-red-600" />,
    },
    {
      num: "05",
      title: t("Video che spiegano", "Videos that explain"),
      desc: t(
        "Ogni skill è divisa in passaggi con video e spiegazioni pratiche. Sai cosa fare, in che ordine, e perché.",
        "Every skill is broken into steps with videos and practical explanations. You know what to do, in which order, and why."
      ),
      icon: <Dumbbell size={18} className="text-red-600" />,
    },
    {
      num: "06",
      title: t("Atleti veri, non numeri", "Real athletes, not numbers"),
      desc: t(
        "Un gruppo ristretto dove confrontare video, chiedere feedback e partecipare a challenge mensili.",
        "A small group to compare videos, ask for feedback and join monthly challenges."
      ),
      icon: <Users size={18} className="text-red-600" />,
    },
  ];

  return (
    <section id="features" className="section-padding bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-white/10 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">
              {t("02 — Cosa include", "02 — What's included")}
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight leading-tight">
              {t("Quello che ti serve,", "What you need,")}
              <br />
              {t("niente fumo.", "no fluff.")}
            </h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 text-base max-w-sm leading-relaxed">
            {t(
              "Sei funzioni, ognuna con un lavoro preciso. Se una non ti serve, la ignori.",
              "Six features, each with a precise job. If you don't need one, skip it."
            )}
          </p>
        </div>

        <div className="border-t border-zinc-200 dark:border-white/10">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="group grid grid-cols-[auto_1fr] md:grid-cols-[64px_48px_1fr_1.5fr] gap-4 md:gap-6 items-start py-7 border-b border-zinc-200 dark:border-white/10 hover:bg-zinc-900/5 dark:hover:bg-zinc-900/60 transition-colors px-2 md:px-4 -mx-2 md:-mx-4"
            >
              <span className="font-mono text-xs text-zinc-500 dark:text-zinc-600 pt-1">{feature.num}</span>
              <div className="hidden md:flex w-11 h-11 rounded-lg bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 items-center justify-center shrink-0">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight leading-snug">
                {feature.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-[15px] leading-relaxed col-span-2 md:col-span-1">
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
