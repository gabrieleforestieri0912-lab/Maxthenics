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
import { useLanguage } from "../context/LanguageContext";

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

const HowItWorks: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { t } = useLanguage();

  const steps: Step[] = [
    {
      id: "profile",
      number: "01",
      title: t("Crea il tuo Profilo", "Create your Profile"),
      subtitle: t("La base della tua evoluzione", "The base of your evolution"),
      shortDesc: t(
        "Inserisci dati biometrici, livello attuale e obiettivi per calibrare il tuo percorso.",
        "Enter biometric data, current level and goals to calibrate your path."
      ),
      fullDesc: t(
        "Il primo passo per la maestria del tuo corpo. Analizziamo le tue leve biologiche per adattare il programma alle tue caratteristiche antropometriche.",
        "The first step to mastering your body. We analyze your biological levers to adapt the program to your anthropometric traits."
      ),
      icon: <UserPlus size={32} className="text-red-500" />,
      color: "from-red-500/20 to-orange-500/20",
      glowColor: "rgba(239, 68, 68, 0.15)",
      badge: t("Analisi Biometrica", "Biometric Analysis"),
      features: [
        {
          title: t("Analisi Biometrica", "Biometric Analysis"),
          desc: t(
            "Altezza, peso e leve corporee per ottimizzare i momenti di forza.",
            "Height, weight and body levers to optimize strength moments."
          ),
          icon: <Layout className="text-red-500 shrink-0" size={16} />
        },
        {
          title: t("Valutazione Livello", "Level Assessment"),
          desc: t(
            "Test d'ingresso dinamico per calibrare perfettamente il punto di partenza.",
            "Dynamic entry test to perfectly calibrate your starting point."
          ),
          icon: <ShieldCheck className="text-red-500 shrink-0" size={16} />
        },
        {
          title: t("Obiettivi Personalizzati", "Custom Goals"),
          desc: t(
            "Forza pura, ipertrofia o skill d'élite come Planche e Front Lever.",
            "Pure strength, hypertrophy or elite skills like Planche and Front Lever."
          ),
          icon: <Target className="text-red-500 shrink-0" size={16} />
        }
      ]
    },
    {
      id: "protocols",
      number: "02",
      title: t("Scegli il Protocollo", "Choose the Protocol"),
      subtitle: t("Programmazione basata sull'evidenza", "Evidence-based programming"),
      shortDesc: t(
        "Seleziona programmi scientifici basati su multifrequenza e carico progressivo.",
        "Select scientific programs based on multi-frequency and progressive overload."
      ),
      fullDesc: t(
        "I nostri programmi sono algoritmi di allenamento avanzati testati su atleti d'élite per garantire progressioni costanti senza stalli.",
        "Our programs are advanced training algorithms tested on elite athletes to guarantee constant progression without stalls."
      ),
      icon: <Target size={32} className="text-red-500" />,
      color: "from-orange-500/20 to-red-500/20",
      glowColor: "rgba(249, 115, 22, 0.15)",
      badge: t("Scienza & Metodo", "Science & Method"),
      features: [
        {
          title: t("Mastery Class", "Mastery Class"),
          desc: t(
            "Progressioni millimetriche per Front Lever, Planche, OAP e Handstand.",
            "Millimeter progressions for Front Lever, Planche, OAP and Handstand."
          ),
          icon: <Crown className="text-red-500 shrink-0" size={16} />
        },
        {
          title: t("Workout Ibridi", "Hybrid Workouts"),
          desc: t(
            "Unisci il potenziamento muscolare alla coordinazione del Calisthenics.",
            "Combine muscle building with Calisthenics coordination."
          ),
          icon: <Dumbbell className="text-red-500 shrink-0" size={16} />
        },
        {
          title: t("Periodizzazione", "Periodization"),
          desc: t(
            "Gestione automatica di carichi, cicli di forza e deload programmati.",
            "Automatic management of loads, strength cycles and scheduled deloads."
          ),
          icon: <Zap className="text-red-500 shrink-0" size={16} />
        }
      ]
    },
    {
      id: "ai-coach",
      number: "03",
      title: t("Allenati con l'AI", "Train with AI"),
      subtitle: t("Un Coach d'Elite sempre con te", "An Elite Coach always with you"),
      shortDesc: t(
        "Usa la Chat AI Sthenox per correzioni tecniche e risposte istantanee.",
        "Use the Sthenox AI Chat for technique corrections and instant answers."
      ),
      fullDesc: t(
        "Sthenox è un'intelligenza artificiale addestrata su biomeccanica e fisiologia del Calisthenics, pronta a guidare ogni singola serie.",
        "Sthenox is an artificial intelligence trained on Calisthenics biomechanics and physiology, ready to guide every single set."
      ),
      icon: <Zap size={32} className="text-red-500" />,
      color: "from-red-500/20 to-orange-500/20",
      glowColor: "rgba(239, 68, 68, 0.15)",
      badge: t("AI Sthenox Powered", "AI Sthenox Powered"),
      features: [
        {
          title: t("Correzione Tecnica", "Technique Correction"),
          desc: t(
            "Feedback immediati su postura, impugnatura e traiettoria di movimento.",
            "Instant feedback on posture, grip and movement trajectory."
          ),
          icon: <Sparkles className="text-red-500 shrink-0" size={16} />
        },
        {
          title: t("Auto-regolazione", "Auto-regulation"),
          desc: t(
            "Analisi dello sforzo percepito e adattamento del volume in tempo reale.",
            "Perceived effort analysis and real-time volume adjustment."
          ),
          icon: <Flame className="text-red-500 shrink-0" size={16} />
        },
        {
          title: t("Supporto Nutrizionale", "Nutrition Support"),
          desc: t(
            "Consigli macro e micro specifici per accelerare il recupero neurale.",
            "Specific macro and micro advice to speed up neural recovery."
          ),
          icon: <CheckCircle2 className="text-red-500 shrink-0" size={16} />
        }
      ]
    },
    {
      id: "mastery",
      number: "04",
      title: t("Domina le Skill", "Master the Skills"),
      subtitle: t("Oltre i limiti umani", "Beyond human limits"),
      shortDesc: t(
        "Traccia i tuoi progressi millimetrici e sblocca le skill più avanzate.",
        "Track your millimeter progress and unlock the most advanced skills."
      ),
      fullDesc: t(
        "Sbloccare una skill richiede metodo e costanza. Ti forniamo gli strumenti analitici per trasformare la forza bruta in maestria tecnica.",
        "Unlocking a skill takes method and consistency. We give you the analytical tools to turn brute strength into technical mastery."
      ),
      icon: <Trophy size={32} className="text-red-500" />,
      color: "from-orange-500/20 to-red-500/20",
      glowColor: "rgba(249, 115, 22, 0.15)",
      badge: t("Mastery & Growth", "Mastery & Growth"),
      features: [
        {
          title: t("Tracking Avanzato", "Advanced Tracking"),
          desc: t(
            "Grafici di tenuta, carichi e massimali per ogni singolo esercizio.",
            "Hold, load and max charts for every single exercise."
          ),
          icon: <BarChart3 className="text-red-500 shrink-0" size={16} />
        },
        {
          title: t("Certificazioni Virtuali", "Virtual Certifications"),
          desc: t(
            "Sblocca traguardi e badge man mano che superi i tuoi record.",
            "Unlock milestones and badges as you beat your records."
          ),
          icon: <Trophy className="text-red-500 shrink-0" size={16} />
        },
        {
          title: t("Community Elite", "Elite Community"),
          desc: t(
            "Confrontati e cresci insieme agli altri atleti della Mastery Academy.",
            "Compare and grow with the other athletes of the Mastery Academy."
          ),
          icon: <Users className="text-red-500 shrink-0" size={16} />
        }
      ]
    }
  ];

  const active = steps[activeIndex];

  return (
    <section id="how-it-works" className="section-padding bg-white dark:bg-zinc-950 border-y border-zinc-200 dark:border-white/10">
      <div className="container-max">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">
              {t("01 — Il metodo", "01 — The method")}
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight leading-tight">
              {t("Come funziona", "How it works")}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-base mt-4 leading-relaxed">
              {t(
                "Passa sopra una fase a sinistra — i dettagli compaiono nel riquadro a destra.",
                "Hover a phase on the left — details appear in the panel on the right."
              )}
            </p>
          </div>
          <p className="text-xs text-zinc-500 font-mono shrink-0">
            {t("[ 04 fasi / 01 metodo ]", "[ 04 phases / 01 method ]")}
          </p>
        </div>

        {/* Master-detail: lista a sinistra, dettagli a destra */}
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4 items-start">
          {/* Lista fasi */}
          <div className="flex flex-col gap-3" role="tablist" aria-label={t("Fasi del metodo", "Method phases")}>
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
                      ? 'border-red-600/60 bg-zinc-100 dark:bg-zinc-900'
                      : 'border-zinc-200 bg-white hover:border-zinc-400 dark:border-white/10 dark:bg-zinc-950 dark:hover:border-white/25'
                  }`}
                >
                  <span className="h-11 w-11 rounded-lg bg-zinc-200 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 flex items-center justify-center shrink-0">
                    {step.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-zinc-500 font-mono text-[11px] uppercase tracking-wider">
                        {step.subtitle}
                      </span>
                      <span className="text-zinc-500 dark:text-zinc-600 font-mono text-xs shrink-0">{step.number}</span>
                    </span>
                    <span className="block text-base font-bold text-zinc-900 dark:text-white tracking-tight leading-snug">
                      {step.title}
                    </span>
                    <span className="block text-zinc-600 dark:text-zinc-400 text-[13px] leading-snug mt-1">
                      {step.shortDesc}
                    </span>
                  </span>
                  <ArrowRight
                    size={15}
                    className={`shrink-0 mt-1 transition-all ${isActive ? 'text-red-500 translate-x-0 opacity-100' : 'text-zinc-400 dark:text-zinc-600 -translate-x-1 opacity-0'}`}
                  />
                </motion.button>
              );
            })}
          </div>

          {/* Pannello dettagli laterale — mai sopra le card, sempre a fianco */}
          <div className="lg:sticky lg:top-24 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/60 min-h-[420px] flex flex-col overflow-hidden">
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
                  <span className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 text-[11px] font-mono uppercase tracking-wider">
                    {active.badge}
                  </span>
                  <span className="text-zinc-500 font-mono text-xs">
                    {t("Fase", "Phase")} {active.number} / 04
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight leading-tight">
                    {active.title}
                  </h3>
                  <p className="text-zinc-700 dark:text-zinc-300 text-[15px] leading-relaxed mt-3">
                    {active.fullDesc}
                  </p>
                </div>

                <ul className="grid sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-3 pt-2">
                  {active.features.map((feat, fIdx) => (
                    <li key={fIdx} className="rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 p-4 flex flex-col gap-2">
                      <span className="shrink-0">{feat.icon}</span>
                      <span className="block text-zinc-900 dark:text-white font-semibold text-sm leading-snug">
                        {feat.title}
                      </span>
                      <span className="block text-zinc-600 dark:text-zinc-400 text-[13px] leading-snug">
                        {feat.desc}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="pt-4 mt-auto border-t border-zinc-200 dark:border-white/10 flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                  <CheckCircle2 size={13} className="text-red-600" /> {t("Incluso nel protocollo", "Included in the protocol")}
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
