import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus,
  Target,
  Zap,
  Trophy,
  ShieldCheck,
  Sparkles,
  Layout,
  Flame,
  Dumbbell,
  Crown,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Users
} from 'lucide-react';

interface FeatureItem {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

interface Step {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  shortDesc: string;
  fullDesc: string;
  icon: React.ReactNode;
  color: string;
  glowColor: string;
  badge: string;
  features: FeatureItem[];
}

const steps: Step[] = [
  {
    id: "profile",
    number: "01",
    title: "Crea il tuo Profilo",
    subtitle: "La base della tua evoluzione",
    shortDesc: "Inserisci dati biometrici, livello attuale e obiettivi per calibrare il tuo percorso.",
    fullDesc: "Il primo passo per la maestria del tuo corpo. Analizziamo le tue leve biologiche per adattare il programma alle tue caratteristiche antropometriche.",
    icon: <UserPlus size={32} className="text-red-500" />,
    color: "from-red-500/20 to-orange-500/20",
    glowColor: "rgba(239, 68, 68, 0.15)",
    badge: "Analisi Biometrica",
    features: [
      {
        title: "Analisi Biometrica",
        desc: "Altezza, peso e leve corporee per ottimizzare i momenti di forza.",
        icon: <Layout className="text-red-500 shrink-0" size={16} />
      },
      {
        title: "Valutazione Livello",
        desc: "Test d'ingresso dinamico per calibrare perfettamente il punto di partenza.",
        icon: <ShieldCheck className="text-red-500 shrink-0" size={16} />
      },
      {
        title: "Obiettivi Personalizzati",
        desc: "Forza pura, ipertrofia o skill d'élite come Planche e Front Lever.",
        icon: <Target className="text-red-500 shrink-0" size={16} />
      }
    ]
  },
  {
    id: "protocols",
    number: "02",
    title: "Scegli il Protocollo",
    subtitle: "Programmazione basata sull'evidenza",
    shortDesc: "Seleziona programmi scientifici basati su multifrequenza e carico progressivo.",
    fullDesc: "I nostri programmi sono algoritmi di allenamento avanzati testati su atleti d'élite per garantire progressioni costanti senza stalli.",
    icon: <Target size={32} className="text-red-500" />,
    color: "from-orange-500/20 to-red-500/20",
    glowColor: "rgba(249, 115, 22, 0.15)",
    badge: "Scienza & Metodo",
    features: [
      {
        title: "Mastery Class",
        desc: "Progressioni millimetriche per Front Lever, Planche, OAP e Handstand.",
        icon: <Crown className="text-red-500 shrink-0" size={16} />
      },
      {
        title: "Workout Ibridi",
        desc: "Unisci il potenziamento muscolare alla coordinazione del Calisthenics.",
        icon: <Dumbbell className="text-red-500 shrink-0" size={16} />
      },
      {
        title: "Periodizzazione",
        desc: "Gestione automatica di carichi, cicli di forza e deload programmati.",
        icon: <Zap className="text-red-500 shrink-0" size={16} />
      }
    ]
  },
  {
    id: "ai-coach",
    number: "03",
    title: "Allenati con l'AI",
    subtitle: "Un Coach d'Elite sempre con te",
    shortDesc: "Usa la Chat AI Sthenox per correzioni tecniche e risposte istantanee.",
    fullDesc: "Sthenox è un'intelligenza artificiale addestrata su biomeccanica e fisiologia del Calisthenics, pronta a guidare ogni singola serie.",
    icon: <Zap size={32} className="text-red-500" />,
    color: "from-red-500/20 to-orange-500/20",
    glowColor: "rgba(239, 68, 68, 0.15)",
    badge: "AI Sthenox Powered",
    features: [
      {
        title: "Correzione Tecnica",
        desc: "Feedback immediati su postura, impugnatura e traiettoria di movimento.",
        icon: <Sparkles className="text-red-500 shrink-0" size={16} />
      },
      {
        title: "Auto-regolazione",
        desc: "Analisi dello sforzo percepito e adattamento del volume in tempo reale.",
        icon: <Flame className="text-red-500 shrink-0" size={16} />
      },
      {
        title: "Supporto Nutrizionale",
        desc: "Consigli macro e micro specifici per accelerare il recupero neurale.",
        icon: <CheckCircle2 className="text-red-500 shrink-0" size={16} />
      }
    ]
  },
  {
    id: "mastery",
    number: "04",
    title: "Domina le Skill",
    subtitle: "Oltre i limiti umani",
    shortDesc: "Traccia i tuoi progressi millimetrici e sblocca le skill più avanzate.",
    fullDesc: "Sbloccare una skill richiede metodo e costanza. Ti forniamo gli strumenti analitici per trasformare la forza bruta in maestria tecnica.",
    icon: <Trophy size={32} className="text-red-500" />,
    color: "from-orange-500/20 to-red-500/20",
    glowColor: "rgba(249, 115, 22, 0.15)",
    badge: "Mastery & Growth",
    features: [
      {
        title: "Tracking Avanzato",
        desc: "Grafici di tenuta, carichi e massimali per ogni singolo esercizio.",
        icon: <BarChart3 className="text-red-500 shrink-0" size={16} />
      },
      {
        title: "Certificazioni Virtuali",
        desc: "Sblocca traguardi e badge man mano che superi i tuoi record.",
        icon: <Trophy className="text-red-500 shrink-0" size={16} />
      },
      {
        title: "Community Elite",
        desc: "Confrontati e cresci insieme agli altri atleti della Mastery Academy.",
        icon: <Users className="text-red-500 shrink-0" size={16} />
      }
    ]
  }
];

const HowItWorks: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="how-it-works" className="section-padding relative overflow-visible bg-transparent">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Connection timeline line for desktop */}
      <div className="absolute top-[280px] left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent hidden lg:block pointer-events-none" />

      <div className="container-max relative z-10">
        <div className="text-center mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4"
          >
            <Sparkles size={12} fill="currentColor" /> Workflow Interattivo
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none uppercase"
          >
            COME <br />
            <span className="text-transparent bg-clip-text bg-linear-to-b from-white via-zinc-200 to-zinc-600 italic">
              FUNZIONA
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto mt-4 font-medium"
          >
            Passa con il cursore su una card per esplorare in dettaglio ogni fase del protocollo
          </motion.p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-20">
          {steps.map((step, index) => {
            const isHovered = hoveredIndex === index;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12, duration: 0.5 }}
                className="relative group min-h-[380px] flex flex-col"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setHoveredIndex(isHovered ? null : index)}
              >
                {/* Resting Card State */}
                <div className={`relative z-10 p-8 bg-zinc-950/90 border rounded-3xl transition-all duration-500 flex flex-col h-full justify-between shadow-xl cursor-pointer ${
                  isHovered ? 'border-red-500/50 shadow-red-950/40' : 'border-white/10 hover:border-white/20'
                }`}>
                  {/* Top Header: Step Icon & Number */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`h-16 w-16 rounded-2xl bg-linear-to-br ${step.color} flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform duration-500 shrink-0 shadow-lg`}>
                        {step.icon}
                      </div>
                      <span className="text-zinc-700 font-black italic text-4xl select-none group-hover:text-zinc-500 transition-colors">
                        {step.number}
                      </span>
                    </div>

                    <span className="text-red-500 font-black tracking-widest uppercase text-[10px] mb-2 block">
                      {step.subtitle}
                    </span>

                    <h3 className="text-xl font-black text-white tracking-tight mb-3">
                      {step.title}
                    </h3>

                    <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                      {step.shortDesc}
                    </p>
                  </div>

                  {/* Card Bottom CTA Prompt */}
                  <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs font-bold text-zinc-500 group-hover:text-red-400 transition-colors">
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={13} className="text-red-500 animate-pulse" />
                      Dettagli al passaggio
                    </span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

                {/* Hover Popup Overlay */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="absolute -inset-2 z-30 p-7 bg-zinc-950/98 backdrop-blur-2xl border border-red-500/40 rounded-3xl shadow-2xl shadow-red-950/70 flex flex-col justify-between overflow-hidden"
                      style={{
                        boxShadow: `0 20px 50px -10px ${step.glowColor}, 0 0 25px -5px rgba(220, 38, 38, 0.3)`
                      }}
                    >
                      {/* Gradient glow background accent */}
                      <div className="absolute top-0 right-0 w-36 h-36 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

                      {/* Popup Content Header */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-[9px] font-black uppercase tracking-widest">
                            {step.badge}
                          </span>
                          <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                            Step {step.number}
                          </span>
                        </div>

                        <h4 className="text-lg font-black text-white tracking-tight mb-2">
                          {step.title}
                        </h4>

                        <p className="text-zinc-300 text-xs leading-relaxed font-medium mb-5 pb-4 border-b border-white/10">
                          {step.fullDesc}
                        </p>

                        {/* Feature Bullets List */}
                        <div className="space-y-3">
                          {step.features.map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-start gap-2.5">
                              <div className="p-1 rounded-lg bg-red-500/10 border border-red-500/20 mt-0.5">
                                {feat.icon}
                              </div>
                              <div>
                                <p className="text-white font-bold text-xs leading-none mb-1">
                                  {feat.title}
                                </p>
                                <p className="text-zinc-400 text-[11px] leading-tight font-normal">
                                  {feat.desc}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Popup Footer */}
                      <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[10px] uppercase font-black tracking-widest text-zinc-400">
                        <span className="flex items-center gap-1 text-red-500">
                          <CheckCircle2 size={13} /> Protocollo Maxthenics
                        </span>
                        <span className="text-zinc-500">
                          Hover attivo
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
