/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Crown,
  PlayCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Award,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  Target,
  Flame,
  BookOpen,
  Users,
  Video,
  MessageCircle,
  Brain,
} from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

interface Lesson {
  title: string;
  duration: string;
}

interface Module {
  title: string;
  lessons: Lesson[];
}

interface Plan {
  period: string;
  price: string;
  priceValue: number;
  label: string;
  save?: string | null;
  highlight?: boolean;
}

const StepPopup = ({ item, index, anchorEl, onClose }: {
  item: any;
  index: number;
  anchorEl: HTMLDivElement;
  onClose: () => void;
}) => {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const rect = anchorEl.getBoundingClientRect();
    const gap = 16;
    if (index === 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPos({ top: rect.top, left: rect.left - gap - 260 });
    } else {
      setPos({ top: rect.top, left: rect.right + gap });
    }
  }, [anchorEl, index]);

  return (
    <motion.div
      initial={{ opacity: 0, x: index === 2 ? -10 : 10, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: index === 2 ? -10 : 10, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="fixed z-50 hidden lg:block"
      style={{ top: pos.top, left: pos.left, width: 260 }}
      onMouseEnter={() => {}} // keep visible when inside popup
      onMouseLeave={onClose}
    >
      <div className="bg-white dark:bg-zinc-900 border border-red-500/20 rounded-2xl p-5 shadow-2xl shadow-black/60">
        <div className={`absolute top-6 w-3 h-3 bg-white dark:bg-zinc-900 border-t border-b rotate-45 ${
          index === 2 ? "-left-1.5 border-l border-r-0" : "-right-1.5 border-r border-l-0"
        } border-red-500/20`}
          style={index === 2
            ? { borderRight: 'none', marginLeft: -1 }
            : { borderLeft: 'none', marginRight: -1 }
          }
        />
        <div className="flex items-center gap-2 mb-4">
          <span className="w-7 h-7 rounded-lg bg-red-600/10 flex items-center justify-center text-red-500 font-bold text-xs">{item.step}</span>
          <span className="text-xs font-bold text-zinc-900 dark:text-white tracking-tight">{item.title}</span>
        </div>
        <ul className="space-y-2.5">
          {item.details.map((d: string, di: number) => (
            <li key={di} className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              {d}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const CalisthenicsRoom: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [hasSubscription, setHasSubscription] = useState(false);
  const [, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState(0);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [hoveredCardEl, setHoveredCardEl] = useState<HTMLDivElement | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (hoveredStep !== null) {
      setHoveredCardEl(cardRefs.current[hoveredStep]);
    } else {
      setHoveredCardEl(null);
    }
  }, [hoveredStep]);

  const courseModules: Module[] = [
    {
      title: t("Fondamenti del Calisthenics", "Calisthenics Foundations"),
      lessons: [
        { title: t("Introduzione alla disciplina", "Introduction to the discipline"), duration: t("15 min", "15 min") },
        { title: t("Esercizi base: Push, Pull, Squat", "Basic exercises: Push, Pull, Squat"), duration: t("30 min", "30 min") },
        { title: t("Progressions anatomiche", "Anatomical progressions"), duration: t("25 min", "25 min") },
        { title: t("Esercizi di mobilita", "Mobility exercises"), duration: t("20 min", "20 min") },
      ],
    },
    {
      title: t("Skill progressions", "Skill progressions"),
      lessons: [
        { title: t("Front Lever progression", "Front Lever progression"), duration: t("35 min", "35 min") },
        { title: t("Planche progression", "Planche progression"), duration: t("35 min", "35 min") },
        { title: t("Muscle-up tecnica", "Muscle-up technique"), duration: t("25 min", "25 min") },
        { title: t("Handstand basics", "Handstand basics"), duration: t("30 min", "30 min") },
      ],
    },
    {
      title: t("Programmazione Avanzata", "Advanced Programming"),
      lessons: [
        { title: t("Costruire Routine", "Building Routines"), duration: t("20 min", "20 min") },
        { title: t("Progress overload", "Progressive overload"), duration: t("25 min", "25 min") },
        { title: t("Deload e recupero", "Deload and recovery"), duration: t("15 min", "15 min") },
        { title: t("Periodizzazione", "Periodization"), duration: t("30 min", "30 min") },
      ],
    },
  ];

  useEffect(() => {
    const checkSubscription = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/purchases", {
          credentials: "same-origin",
        });

        if (response.ok) {
          const purchases = await response.json();
          const hasValid = purchases.some(
            (p: any) =>
              p.status === "Completato" &&
              p.items?.some(
                (item: any) =>
                  item.title?.toLowerCase().includes("calisthenics") ||
                  item.title?.toLowerCase().includes("room") ||
                  item.title?.toLowerCase().includes("coaching") ||
                  item.title?.toLowerCase().includes("elite"),
              ),
          );
          setHasSubscription(hasValid);
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [isAuthenticated, user]);

  const handlePurchase = async (plan: Plan) => {
    setPurchaseError(null);
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: [
            {
              id: `calisthenics-room-${plan.period.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
              title: `Calisthenics Room - ${plan.period}`,
              description: `Accesso coaching 1:1 per ${plan.period}`,
              price: plan.priceValue,
              image: "/Img/programs.jpg",
              quantity: 1,
            },
          ],
          userId: user?.id,
        }),
      });

      const data = await response.json().catch(() => null);
      if (response.ok && data?.url) {
        window.location.href = data.url;
      } else {
        setPurchaseError(data?.message || t("Checkout non riuscito. Riprova.", "Checkout failed. Try again."));
      }
    } catch (error) {
      console.error("Errore checkout:", error);
      setPurchaseError(t("Errore di connessione. Riprova.", "Connection error. Try again."));
    }
  };

  // ─── NON-SUBSCRIBER VIEW ──────────────────────────────────────────────────────
  if (!isAuthenticated || !hasSubscription) {
    const allFeatures = [
      { icon: <Video className="text-red-500" />, text: t("Videochiamata settimanale 1 a 1 con me", "Weekly 1-on-1 video call with me") },
      { icon: <Users className="text-red-500" />, text: t("Videochiamata settimanale di gruppo", "Weekly group video call") },
      { icon: <MessageCircle className="text-red-500" />, text: t("Community esclusiva", "Exclusive community") },
      { icon: <Target className="text-red-500" />, text: t("Ti aiuto a sbloccare il Front Lever", "I'll help you unlock the Front Lever") },
      { icon: <Brain className="text-red-500" />, text: t("Mentalità applicata al Calisthenics", "Mindset applied to Calisthenics") },
      { icon: <Flame className="text-red-500" />, text: t("Costruisci il fisico dei tuoi sogni", "Build the physique of your dreams") },
      { icon: <Award className="text-red-500" />, text: t("Migliora la tua disciplina", "Improve your discipline") },
      { icon: <ShieldCheck className="text-red-500" />, text: t("Impara a non saltare neanche un allenamento", "Learn to never skip a workout") },
      { icon: <Sparkles className="text-red-500" />, text: t("Elimina la procrastinazione", "Eliminate procrastination") },
      { icon: <BookOpen className="text-red-500" />, text: t("Programmi di allenamento personalizzati", "Personalized training programs") },
      { icon: <PlayCircle className="text-red-500" />, text: t("Corsi sul Calisthenics e sulla mentalità", "Courses on Calisthenics and mindset") },
      { icon: <CheckCircle className="text-red-500" />, text: t("Crea e rispetta una dieta sana", "Create and stick to a healthy diet") },
    ];

    const bonuses = [
      t("1 Anno di MIND PROJECT incluso", "1 Year of MIND PROJECT included"),
      t("Videochiamate di gruppo precedenti registrate", "Recorded past group video calls"),
      t("Template Guida completa sul Calisthenics", "Complete Calisthenics Guide template"),
    ];

    return (
      <div className="page-shell">
        <SEO
          title={t("Calisthenics Room - Elite Coaching", "Calisthenics Room - Elite Coaching")}
          description={t(
            "L'esperienza definitiva di coaching 1:1 e programmazione avanzata.",
            "The ultimate 1:1 coaching and advanced programming experience."
          )}
        />

        {/* ── HERO ── */}
        <section className="section-padding relative flex items-center justify-center overflow-hidden pt-28">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none"
            aria-hidden
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-[120px] pointer-events-none"
            aria-hidden
          />

          <div className="container-max relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="eyebrow-pill mb-8"
            >
              <Sparkles size={12} aria-hidden />
              {t("Coaching d'Élite", "Élite Coaching")}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="page-title text-5xl md:text-7xl mb-8"
            >
              Calisthenics
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-br from-red-500 via-red-600 to-orange-500">Room</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="body-copy text-lg max-w-3xl mx-auto mb-10"
            >
              {t(
                "L'unico percorso che trasforma radicalmente il tuo fisico e la tua mentalità attraverso la scienza della performance.",
                "The only path that radically transforms your physique and mindset through performance science."
              )}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <a href="#offers" className="btn-primary-lg">
                {t("Inizia il percorso", "Start the journey")}
              </a>
              <a href="#features" className="btn-secondary-lg">
                {t("Scopri di più", "Learn more")}
              </a>
            </motion.div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="features" className="section-padding relative">
          <div className="container-max relative">
            <div className="text-center mb-12">
              <p className="eyebrow mb-3">{t("Il metodo", "The method")}</p>
              <h2 className="page-title">
                {t("Come", "How")} <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-orange-500">{t("funziona", "it works")}</span>
              </h2>
            </div>

            <div className="relative">
              {/* Arrow connector line */}
              <div className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] h-px -translate-y-1/2 z-0 pointer-events-none">
                <svg width="100%" height="20" viewBox="0 0 1000 20" preserveAspectRatio="none" className="overflow-visible">
                  <defs>
                    <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#dc2626" stopOpacity="0.1" />
                      <stop offset="30%" stopColor="#dc2626" stopOpacity="0.6" />
                      <stop offset="70%" stopColor="#dc2626" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#dc2626" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  <line x1="50" y1="10" x2="950" y2="10" stroke="url(#arrowGrad)" strokeWidth="2" strokeDasharray="8 6" />
                  <polygon points="340,4 350,10 340,16" fill="#dc2626" opacity="0.5" />
                  <polygon points="660,4 670,10 660,16" fill="#dc2626" opacity="0.5" />
                </svg>
              </div>

              {(() => {
                const steps = [
                  {
                    step: "01",
                    title: t("Analisi & Obiettivi", "Analysis & Goals"),
                    brief: t("Valutazione iniziale", "Initial assessment"),
                    desc: t("Ti conosco, valuto il tuo livello, la tua biomeccanica e i tuoi limiti. Impostiamo obiettivi chiari e misurabili con scadenze precise.", "I get to know you, assess your level, biomechanics and limits. We set clear, measurable goals with precise deadlines."),
                    details: [
                      t("Valutazione biomeccanica completa", "Full biomechanical assessment"),
                      t("Test di forza e mobilità", "Strength and mobility testing"),
                      t("Definizione obiettivi SMART", "SMART goal setting"),
                      t("Analisi abitudini alimentari", "Eating habits analysis"),
                    ],
                    icon: <Target size={28} />,
                  },
                  {
                    step: "02",
                    title: t("Programmazione", "Programming"),
                    brief: t("Percorso su misura", "Tailored path"),
                    desc: t("Costruisco un percorso su misura per te: skill, forza, volume, recupero. Ogni variabile è calibrata sul tuo corpo.", "I build a path tailored to you: skills, strength, volume, recovery. Every variable is calibrated on your body."),
                    details: [
                      t("Scheda personalizzata settimanale", "Weekly personalized plan"),
                      t("Progressioni skill-specifiche", "Skill-specific progressions"),
                      t("Periodizzazione dei carichi", "Load periodization"),
                      t("Piano nutrizionale base", "Basic nutrition plan"),
                    ],
                    icon: <Brain size={28} />,
                  },
                  {
                    step: "03",
                    title: t("Checkpoint Costanti", "Constant Checkpoints"),
                    brief: t("Monitoraggio continuo", "Continuous monitoring"),
                    desc: t("Ogni settimana rivediamo i progressi, correggiamo la tecnica, aggiustiamo il carico. Nessuna sessione lasciata al caso.", "Every week we review progress, fix technique, adjust load. No session left to chance."),
                    details: [
                      t("Video analisi settimanale", "Weekly video analysis"),
                      t("Correzione tecnica in tempo reale", "Real-time technique correction"),
                      t("Aggiustamento carichi e volumi", "Load and volume adjustment"),
                      t("Report mensile dei progressi", "Monthly progress report"),
                    ],
                    icon: <Flame size={28} />,
                  },
                ];

                return (
                  <>
                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8 relative z-10">
                      {steps.map((item, i) => (
                        <div
                          key={i}
                          ref={(el) => { cardRefs.current[i] = el; }}
                          className="relative"
                          onMouseEnter={() => setHoveredStep(i)}
                          onMouseLeave={() => setHoveredStep(null)}
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="group relative card card-hover p-6 md:p-8 cursor-default"
                          >
                            <div className="card-lift" />
                            <div className="relative z-10">
                              <div className="flex items-center justify-between mb-4">
                                <span className="meta-mono text-base">{item.step}</span>
                                <span className="meta-mono group-hover:text-red-500/80 transition-colors">{item.brief}</span>
                              </div>
                              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5 text-red-500 group-hover:scale-110 transition-transform">
                                {item.icon}
                              </div>
                              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">{item.title}</h3>
                              <p className="body-copy text-sm">{item.desc}</p>
                            </div>
                          </motion.div>
                        </div>
                      ))}
                    </div>

                    {/* Floating popup positioned next to hovered card */}
                    {hoveredStep !== null && hoveredCardEl && (
                      <StepPopup
                        item={steps[hoveredStep]}
                        index={hoveredStep}
                        anchorEl={hoveredCardEl}
                        onClose={() => setHoveredStep(null)}
                      />
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </section>

        {/* ── THREE PILLARS ── */}
        <section className="section-padding relative overflow-hidden">
          <div className="container-max relative z-10">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: t("Coaching 1:1", "1:1 Coaching"),
                  desc: t("Correzioni video e feedback personalizzati direttamente da me ogni settimana. Ogni tua ripetizione viene analizzata.", "Video corrections and personalized feedback directly from me every week. Every single rep gets analyzed."),
                  icon: <PlayCircle />,
                },
                {
                  title: t("Protocolli Elite", "Elite Protocols"),
                  desc: t("Accesso totale a tutti i programmi Mastery: Planche, Front Lever, Handstand. Segui il percorso giusto per ogni skill.", "Full access to all Mastery programs: Planche, Front Lever, Handstand. Follow the right path for every skill."),
                  icon: <Award />,
                },
                {
                  title: t("Mindset & Disciplina", "Mindset & Discipline"),
                  desc: t("Strategie psicologiche per eliminare la procrastinazione e costruire abitudini incrollabili. La mente comanda il corpo.", "Psychological strategies to kill procrastination and build unshakable habits. Mind commands body."),
                  icon: <Crown />,
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="group"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900/80 border hairline flex items-center justify-center mx-auto mb-6 group-hover:border-red-500/40 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-900 transition-colors duration-300">
                      {React.cloneElement(item.icon as any, { size: 32, className: "text-red-500 group-hover:scale-110 transition-transform duration-300" })}
                    </div>
                    <h3 className="text-lg font-bold mb-2 tracking-tight text-zinc-900 dark:text-white">{item.title}</h3>
                    <p className="body-copy text-sm max-w-xs mx-auto">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES + BONUSES ── */}
        <section id="offers" className="section-padding relative">
          <div className="container-max max-w-4xl">
            <div className="text-center mb-12">
              <p className="eyebrow mb-3">{t("Cosa ottieni", "What you get")}</p>
              <h2 className="page-title">
                {t("Il", "The")} <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-orange-500">{t("protocollo", "protocol")}</span> {t("completo", "complete")}
              </h2>
            </div>

            <div className="space-y-6">
              {/* Features */}
              <div className="card p-6 md:p-8">
                <div className="eyebrow-pill mb-8">
                  <Sparkles size={12} aria-hidden />
                  {t("Cosa include", "What's included")}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {allFeatures.map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/[0.02] dark:bg-white/[0.02] border hairline hover:border-red-500/20 hover:bg-red-500/5 transition-colors duration-300 group"
                    >
                      <div className="w-7 h-7 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                        <CheckCircle size={16} className="text-green-500" />
                      </div>
                      <span className="text-sm font-bold leading-snug text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                        {f.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Bonuses */}
              <div className="relative">
                <div className="card p-8 md:p-12 overflow-hidden">
                  <div className="absolute -top-20 -right-20 opacity-5">
                    <Crown size={200} />
                  </div>
                  <div className="relative z-10">
                    <div className="eyebrow-pill mb-8 bg-amber-500/10 border-amber-500/20 text-amber-500">
                      <Sparkles size={12} aria-hidden />
                      {t("Bonus esclusivi", "Exclusive bonuses")}
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      {bonuses.map((bonus, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          className="flex items-center gap-4 p-5 card group hover:border-amber-500/30 hover:bg-amber-500/5 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Crown size={20} className="text-amber-500" />
                          </div>
                          <span className="text-zinc-900 dark:text-white font-bold text-sm md:text-base tracking-tight">{bonus}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-8 p-5 card border-red-500/20 bg-red-600/[0.08] flex items-center gap-3">
                      <Sparkles size={16} className="text-amber-500 shrink-0" aria-hidden />
                      <p className="meta-mono text-zinc-600 dark:text-zinc-300">
                        {t("Bonus inclusi in tutti i piani", "Bonuses included in all plans")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section className="section-padding" id="pricing">
          <div className="container-max">
            <div className="text-center mb-12">
              <p className="eyebrow mb-3">{t("Investimento", "Investment")}</p>
              <h2 className="page-title">
                {t("Scegli il tuo", "Choose your")} <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-orange-500">{t("percorso", "path")}</span>
              </h2>
              <p className="body-copy mt-4 max-w-xl mx-auto">{t("Più investi su di te, più il costo per mese scende. Il miglior affare? Il pacchetto annuale.", "The more you invest in yourself, the lower the monthly cost. The best deal? The yearly package.")}</p>
            </div>

            {/* Frequency Toggle */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 card rounded-full">
                {[t("Mensile", "Monthly"), t("Semestrale", "6-Month"), t("Annuale", "Yearly")].map((freq, fi) => (
                  <span
                    key={fi}
                    className={`px-4 py-1.5 rounded-full meta-mono transition-colors cursor-default ${
                      fi === 2
                        ? "bg-red-600 text-white shadow-lg shadow-red-900/30"
                        : "text-zinc-600"
                    }`}
                  >
                    {freq}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-5xl mx-auto">
              {[
                {
                  period: t("Mensile", "Monthly"),
                  price: "79",
                  priceValue: 79,
                  label: t("FLESSIBILE", "FLEXIBLE"),
                  desc: t("Nessun vincolo, nessun impegno. Attiva e disattiva quando vuoi.", "No strings attached. Turn on and off whenever you want."),
                  monthly: null,
                  save: null,
                  highlight: false,
                  cta: t("Inizia Mensile", "Start Monthly"),
                  badge: null,
                  features: [
                    t("Coaching 1:1 settimanale", "Weekly 1:1 coaching"),
                    t("Videochiamata di gruppo", "Group video call"),
                    t("Community esclusiva", "Exclusive community"),
                    t("Programma personalizzato", "Personalized program"),
                    t("Cancella quando vuoi", "Cancel anytime"),
                  ],
                },
                {
                  period: t("6 Mesi", "6 Months"),
                  price: "297",
                  priceValue: 297,
                  label: "PROGRESSION",
                  desc: t("Il giusto commitment per vedere risultati reali e trasformare il tuo fisico.", "The right commitment to see real results and transform your physique."),
                  monthly: t("€49,50/mese", "€49.50/mo"),
                  save: t("Risparmi il 37%", "Save 37%"),
                  highlight: false,
                  cta: t("Inizia Progression", "Start Progression"),
                  badge: null,
                  features: [
                    t("Coaching 1:1 settimanale", "Weekly 1:1 coaching"),
                    t("Videochiamata di gruppo", "Group video call"),
                    t("Community esclusiva", "Exclusive community"),
                    t("Programma personalizzato", "Personalized program"),
                    t("Corsi Calisthenics completi", "Full Calisthenics courses"),
                    t("Template pianificazione", "Planning template"),
                  ],
                },
                {
                  period: t("1 Anno", "1 Year"),
                  price: "547",
                  priceValue: 547,
                  label: t("MASTERY ELITE", "MASTERY ELITE"),
                  desc: t("Il pacchetto completo: massimo risparmio, tutti i bonus e supporto continuo.", "The full package: maximum savings, all bonuses and continuous support."),
                  monthly: t("€45,58/mese", "€45.58/mo"),
                  save: t("Risparmi il 42%", "Save 42%"),
                  highlight: true,
                  cta: t("Scegli Mastery Elite", "Choose Mastery Elite"),
                  badge: t("Miglior Valore", "Best Value"),
                  features: [
                    t("Tutto del piano Progression", "Everything in Progression"),
                    t("1 anno di MIND PROJECT incluso", "1 year of MIND PROJECT included"),
                    t("Videochiamate gruppo registrate", "Recorded group calls"),
                    t("Guida Completa PDF", "Complete PDF Guide"),
                    t("Certificato Mastery", "Mastery Certificate"),
                    t("Priorità supporto 24/7", "24/7 priority support"),
                  ],
                },
              ].map((plan, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className={`relative card card-hover flex flex-col justify-between overflow-hidden group ${
                    plan.highlight
                      ? "border-red-400 bg-red-600 shadow-2xl shadow-red-900/40 md:scale-105 z-10"
                      : ""
                  }`}
                >
                  {/* Background effects */}
                  {plan.highlight && (
                    <div className="absolute -top-12 -right-12 w-72 h-72 bg-red-400/10 rounded-full blur-[100px]" aria-hidden />
                  )}
                  {!plan.highlight && (
                    <div className="card-lift" />
                  )}

                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
                      <span className="meta-mono inline-flex items-center gap-1.5 px-4 py-1.5 bg-white text-red-600 rounded-full shadow-xl">
                        <Sparkles size={10} aria-hidden />
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="relative z-10 p-6 md:p-8 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`meta-mono ${
                        plan.highlight ? "text-red-200" : ""
                      }`}>
                        {plan.label}
                      </span>
                      {plan.save && (
                        <span className={`meta-mono px-3 py-1 rounded-full ${
                          plan.highlight
                            ? "bg-white/20 text-white"
                            : "bg-red-600/10 text-red-500 border border-red-500/20"
                        }`}>
                          {plan.save}
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="mt-6 mb-2">
                      <div className="flex items-end gap-2">
                        <span className={`text-4xl md:text-5xl font-bold tracking-tight ${plan.highlight ? "text-white" : "text-zinc-900 dark:text-white"}`}>
                          €{plan.price}
                        </span>
                        <span className={`text-sm font-bold mb-1.5 ${
                          plan.highlight ? "text-red-200" : "text-zinc-500"
                        }`}>
                          / {plan.period.toLowerCase()}
                        </span>
                      </div>
                      {plan.monthly && (
                        <p className={`text-xs font-bold mt-1 ${
                          plan.highlight ? "text-red-200/80" : "text-zinc-600"
                        }`}>
                          {plan.monthly}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <p className={`body-copy text-sm mt-4 mb-8 ${
                      plan.highlight ? "text-red-100" : ""
                    }`}>
                      {plan.desc}
                    </p>

                    {/* Features */}
                    <ul className="space-y-3 mb-10 grow">
                      {plan.features.map((feat, fi) => (
                        <li key={fi} className="flex items-start gap-3">
                          <CheckCircle
                            size={16}
                            className={`mt-0.5 shrink-0 ${
                              plan.highlight ? "text-white" : "text-red-500"
                            }`}
                          />
                          <span className={`text-sm leading-snug ${
                            plan.highlight ? "text-red-50" : "text-zinc-700 dark:text-zinc-300"
                          }`}>
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <button
                      onClick={() => handlePurchase(plan)}
                      className={`w-full relative z-10 ${
                        plan.highlight
                          ? "btn-secondary-lg bg-white text-black hover:bg-zinc-100 border-transparent shadow-xl"
                          : "btn-primary-lg"
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Payment Info */}
            <div className="mt-12 flex flex-col items-center gap-5">
              {purchaseError && (
                <p className="body-copy text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-3" role="alert">
                  {purchaseError}
                </p>
              )}
              <div className="meta-mono flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                <span className="flex items-center gap-1.5"><ShieldCheck size={12} aria-hidden /> {t("Pagamento sicuro Stripe", "Secure Stripe payment")}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-400 dark:bg-zinc-700" aria-hidden />
                <span className="flex items-center gap-1.5"><Sparkles size={12} aria-hidden /> {t("Accesso immediato", "Instant access")}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-400 dark:bg-zinc-700" aria-hidden />
                <span className="flex items-center gap-1.5"><Award size={12} aria-hidden /> {t("Garanzia 14 giorni", "14-day guarantee")}</span>
              </div>
              {!isAuthenticated && (
                <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                  <span className="body-copy text-sm">{t("Hai già un account?", "Already have an account?")}</span>
                  <Link to="/login" className="btn-secondary-sm">
                    {t("Accedi", "Log in")}
                  </Link>
                  <Link to="/register" className="btn-primary-sm">
                    {t("Registrati", "Sign up")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="section-padding">
          <div className="container-max max-w-3xl">
            <div className="text-center mb-12">
              <p className="eyebrow mb-3">{t("Dubbi?", "Questions?")}</p>
              <h2 className="page-title">{t("Domande", "Frequently")} <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-orange-500">{t("frequenti", "asked")}</span></h2>
            </div>

            <div className="space-y-3">
              {[
                { q: t("Cosa serve per iniziare?", "What do I need to start?"), a: t("Solo la voglia di migliorare. Non serve esperienza pregressa: partiamo dal tuo livello attuale e costruiamo da lì.", "Just the will to improve. No prior experience needed: we start from your current level and build from there.") },
                { q: t("Quanto tempo devo dedicare?", "How much time must I dedicate?"), a: t("Minimo 3 sessioni a settimana da 60-90 minuti. I risultati arrivano con la costanza, non con la quantità.", "Minimum 3 sessions per week, 60-90 minutes. Results come from consistency, not quantity.") },
                { q: t("E se non vedo risultati?", "What if I see no results?"), a: t("Ogni settimana abbiamo un check-point. Se qualcosa non funziona, lo correggiamo subito. Nessun mese sprecato.", "Every week we have a check-point. If something doesn't work, we fix it immediately. No wasted month.") },
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card card-hover group p-6"
                >
                  <h3 className="font-bold text-zinc-900 dark:text-white tracking-tight mb-2 text-sm">{faq.q}</h3>
                  <p className="prose-block">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ─── SUBSCRIBER VIEW ──────────────────────────────────────────────────────
  return (
    <div className="page-shell selection:bg-red-500/30">
      <SEO
        title={t("Calisthenics Room - Area Riservata", "Calisthenics Room - Members Area")}
        description={t(
          "Benvenuto nella Calisthenics Room. Accedi al tuo coaching e ai tuoi programmi.",
          "Welcome to the Calisthenics Room. Access your coaching and programs."
        )}
      />

      {/* Status Banner */}
      <div className="px-6 lg:px-8">
        <div className="container-max max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card border-red-500/20 bg-red-600/[0.08] p-4 flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center">
                <Crown size={20} className="text-white" aria-hidden />
              </div>
              <div>
                <p className="meta-mono">{t("Stato abbonamento", "Subscription status")}</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
                  {t("Piano", "Plan")} {user?.subscriptionTier || 'Elite'} <span className="text-red-500">• {t("Attivo", "Active")}</span>
                </p>
              </div>
            </div>
            <Link to="/purchase-history" className="btn-secondary-sm">
              {t("Gestisci abbonamento", "Manage subscription")}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Header */}
      <section className="section-padding pb-12">
        <div className="container-max max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="eyebrow-pill mb-4">
              <Sparkles size={12} aria-hidden /> {t("Bentornato", "Welcome back")}
            </div>
            <h1 className="page-title mb-4">
              {t("La tua", "Your")} <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-orange-500">room</span>
            </h1>
            <p className="body-copy text-lg">{t("Il tuo portale d'élite per la massima performance fisica.", "Your elite portal for peak physical performance.")}</p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-max max-w-5xl px-6 lg:px-8 pb-20 space-y-12">

        {/* Resource Cards */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-red-600 rounded-full" aria-hidden />
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">{t("Risorse e guide", "Resources & guides")}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: t("Guida Completa al Calisthenics Moderno", "Complete Modern Calisthenics Guide"),
                desc: t("Scienza applicata, programmazione avanzata e protocolli di recupero.", "Applied science, advanced programming and recovery protocols."),
                action: t("Apri la Guida", "Open the Guide"),
                to: "/guide",
                icon: <BookOpen size={28} />,
              },
              {
                title: t("Template Scheda Settimanale", "Weekly Plan Template"),
                desc: t("Il planner settimanale per tracciare volume, intensità e recupero.", "The weekly planner to track volume, intensity and recovery."),
                action: t("Crea Scheda", "Create Plan"),
                to: "/create",
                icon: <Target size={28} />,
              },
            ].map((res, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card card-hover p-6 md:p-8 relative overflow-hidden group"
              >
                <div className="card-lift" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 text-red-500">
                    {res.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2 tracking-tight text-zinc-900 dark:text-white">{res.title}</h3>
                  <p className="body-copy text-sm mb-6">{res.desc}</p>
                  <Link to={res.to} className="btn-primary-sm">
                    {res.action} <ArrowRight size={14} aria-hidden />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Masterclass Video */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-red-600 rounded-full" aria-hidden />
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">{t("Masterclass video", "Video masterclass")}</h2>
          </div>

          <div className="space-y-3">
            {courseModules.map((module, moduleIndex) => (
              <motion.div
                key={moduleIndex}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: moduleIndex * 0.1 }}
                className="card overflow-hidden group hover:border-red-500/20 transition-colors"
              >
                <button
                  onClick={() => setExpandedModule(expandedModule === moduleIndex ? -1 : moduleIndex)}
                  className="w-full p-5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 rounded-xl bg-zinc-200 dark:bg-zinc-900 border hairline flex items-center justify-center text-red-500 font-bold text-lg group-hover:bg-red-600 group-hover:text-white group-hover:border-red-500 transition-colors duration-300">
                      {moduleIndex + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900 dark:text-white tracking-tight text-sm">{module.title}</h3>
                      <p className="meta-mono mt-0.5">{module.lessons.length} {t("lezioni", "lessons")}</p>
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${expandedModule === moduleIndex ? "bg-red-600/20" : "bg-zinc-900/5 dark:bg-white/5"}`}>
                    {expandedModule === moduleIndex ? (
                      <ChevronDown size={18} className="text-red-500" aria-hidden />
                    ) : (
                      <ChevronRight size={18} className="text-zinc-500 dark:text-zinc-600" aria-hidden />
                    )}
                  </div>
                </button>
                {expandedModule === moduleIndex && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="px-5 pb-5 space-y-2"
                  >
                    {module.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lessonIndex}
                        className="flex items-center justify-between p-4 rounded-xl border hairline bg-zinc-100 dark:bg-zinc-950/40 hover:bg-zinc-200 dark:hover:bg-zinc-950/70 transition-colors group/lesson"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center text-red-500 group-hover/lesson:bg-red-600 group-hover/lesson:text-white transition-colors">
                            <PlayCircle size={16} aria-hidden />
                          </div>
                          <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 group-hover/lesson:text-zinc-900 dark:group-hover/lesson:text-white transition-colors">{lesson.title}</span>
                        </div>
                        <span className="meta-mono flex items-center gap-1.5">
                          <Clock size={10} aria-hidden /> {lesson.duration}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="section-padding border-t hairline text-center">
        <div className="container-max max-w-5xl">
          <Link to="/" className="btn-ghost text-sm">
            {t("Torna alla home", "Back home")} <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default CalisthenicsRoom;
