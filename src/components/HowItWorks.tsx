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
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const active = steps[activeIndex];

  return (
    <section id="how-it-works" className="section-padding bg-zinc-950 border-y border-white/10">
      <div className="container-max">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">
              01 — Il metodo
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Come funziona
            </h2>
            <p className="text-zinc-400 text-base mt-4 leading-relaxed">
              Passa sopra una fase a sinistra — i dettagli compaiono nel riquadro a destra.
            </p>
          </div>
          <p className="text-xs text-zinc-500 font-mono shrink-0">
            [ 04 fasi / 01 metodo ]
          </p>
        </div>

        {/* Master-detail: lista a sinistra, dettagli a destra */}
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4 items-start">
          {/* Lista fasi */}
          <div className="flex flex-col gap-3" role="tablist" aria-label="Fasi del metodo">
            {steps.map((step, index) => {
              const isActive = activeIndex === index;
              return (
                <motion.button
                  key={step.id}
                  role="tab"
                  aria-selected={isActive}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.3 }}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  className={`w-full p-5 rounded-xl border text-left transition-colors duration-150 cursor-pointer flex items-start gap-4 ${
                    isActive
                      ? 'border-red-600/60 bg-zinc-900'
                      : 'border-white/10 bg-zinc-950 hover:border-white/25'
                  }`}
                >
                  <span className="h-11 w-11 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0">
                    {step.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-zinc-500 font-mono text-[11px] uppercase tracking-wider">
                        {step.subtitle}
                      </span>
                      <span className="text-zinc-600 font-mono text-xs shrink-0">{step.number}</span>
                    </span>
                    <span className="block text-base font-bold text-white tracking-tight leading-snug">
                      {step.title}
                    </span>
                    <span className="block text-zinc-400 text-[13px] leading-snug mt-1">
                      {step.shortDesc}
                    </span>
                  </span>
                  <ArrowRight
                    size={15}
                    className={`shrink-0 mt-1 transition-all ${isActive ? 'text-red-500 translate-x-0 opacity-100' : 'text-zinc-600 -translate-x-1 opacity-0'}`}
                  />
                </motion.button>
              );
            })}
          </div>

          {/* Pannello dettagli laterale — mai sopra le card, sempre a fianco */}
          <div className="lg:sticky lg:top-24 rounded-xl border border-white/10 bg-zinc-900/60 min-h-[420px] flex flex-col overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="p-6 md:p-8 flex flex-col gap-5 grow"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="px-2.5 py-1 rounded-md bg-zinc-950 border border-white/10 text-zinc-300 text-[11px] font-mono uppercase tracking-wider">
                    {active.badge}
                  </span>
                  <span className="text-zinc-500 font-mono text-xs">Fase {active.number} / 04</span>
                </div>

                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
                    {active.title}
                  </h3>
                  <p className="text-zinc-300 text-[15px] leading-relaxed mt-3">
                    {active.fullDesc}
                  </p>
                </div>

                <ul className="grid sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-3 pt-2">
                  {active.features.map((feat, fIdx) => (
                    <li key={fIdx} className="rounded-lg border border-white/10 bg-zinc-950 p-4 flex flex-col gap-2">
                      <span className="shrink-0">{feat.icon}</span>
                      <span className="block text-white font-semibold text-sm leading-snug">
                        {feat.title}
                      </span>
                      <span className="block text-zinc-400 text-[13px] leading-snug">
                        {feat.desc}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="pt-4 mt-auto border-t border-white/10 flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                  <CheckCircle2 size={13} className="text-red-600" /> Incluso nel protocollo
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
