"use client";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";

interface ShowcaseProgram {
  id: number;
  title: string;
  level: string;
  duration: string;
  image: string;
  description: string;
  price: number;
}

const ProgramCard = ({ program, index }: { program: ShowcaseProgram; index: number }) => {
  const { t } = useLanguage();
  return (
    <motion.div
      key={program.id}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      className="group relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl overflow-hidden flex flex-col h-full hover:border-zinc-300 dark:hover:border-white/25 transition-colors"
    >

      {program.price === 0 ? (
        <div className="absolute top-4 right-4 z-10 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[11px] font-bold px-2.5 py-1 rounded-md">
          {t("Gratis", "Free")}
        </div>
      ) : (
        <div className="absolute top-4 right-4 z-10 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/15 text-zinc-600 dark:text-zinc-200 text-[11px] font-mono px-2.5 py-1 rounded-md">
          €{program.price}
        </div>
      )}

      <Link to="/programs" className="flex flex-col h-full">
        {/* Image Container */}
        <div className="relative h-52 overflow-hidden border-b border-zinc-200 dark:border-white/10">
          <Image
            src={program.image}
            alt={program.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          {/* Level Badge */}
          <div className="absolute bottom-3 left-5">
            <span className="px-2.5 py-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/15 rounded-md text-zinc-600 dark:text-zinc-200 text-[11px] font-mono uppercase">
              {program.level}
            </span>
          </div>
        </div>

        {/* Content — descrizione sempre intera, mai troncata */}
        <div className="p-6 grow flex flex-col">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">
            {program.title}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6 leading-relaxed">
            {program.description}
          </p>

          <div className="mt-auto pt-5 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-zinc-500 font-mono uppercase mb-0.5">{t("Prezzo", "Price")}</span>
              <span className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                {program.price === 0 ? t('Gratis', 'Free') : `€${program.price}`}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                <Clock size={13} />
                {program.duration}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const ProgramShowcase = () => {
  const { t } = useLanguage();
  const showcasePrograms: ShowcaseProgram[] = [
    {
      id: 201,
      title: "Front Lever Mastery",
      level: t("Intermedio", "Intermediate"),
      duration: t("12 Settimane", "12 Weeks"),
      image: "/Img/front-lever.jpg",
      description: t(
        "Il percorso completo per dominare la Front Lever, dalla retrazione scapolare alla full extension.",
        "The complete path to master the Front Lever, from scapular retraction to full extension."
      ),
      price: 129,
    },
    {
      id: 301,
      title: "Planche Zero Gravity",
      level: t("Avanzato", "Advanced"),
      duration: t("16 Settimane", "16 Weeks"),
      image: "/Img/one-arm-front-lever.jpg",
      description: t(
        "Dalla tuck planche alla full planche: periodizzazione ipertrofica per la massima spinta.",
        "From tuck planche to full planche: hypertrophic periodization for maximum pushing strength."
      ),
      price: 149,
    },
    {
      id: 101,
      title: "Metabolic Flow",
      level: t("Principiante", "Beginner"),
      duration: t("4 Settimane", "4 Weeks"),
      image: "/Img/programs.jpg",
      description: t(
        "Protocollo d'ingresso per costruire le basi biomeccaniche e attivare il potenziale motorio.",
        "Entry protocol to build biomechanical foundations and unlock motor potential."
      ),
      price: 0,
    },
  ];

  return (
    <section className="section-padding bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-white/10">
      <div className="container-max">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">
              {t("03 — I programmi", "03 — Programs")}
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight mb-4">
              {t("Parti da uno di questi.", "Start from one of these.")}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed">
              {t(
                "Tre percorsi chiari per tre livelli diversi. Ognuno dice cosa fai, per quanto, e cosa ottieni.",
                "Three clear paths for three different levels. Each tells you what you do, for how long, and what you get."
              )}
            </p>
          </div>
          <Link to="/programs" className="shrink-0 inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white border border-zinc-300 dark:border-white/15 rounded-lg px-5 py-3 hover:border-zinc-500 dark:hover:border-white/30 transition-colors">
            {t("Tutti i programmi", "All programs")} <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {showcasePrograms.map((program, index) => (
            <ProgramCard key={program.id} program={program} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramShowcase;
