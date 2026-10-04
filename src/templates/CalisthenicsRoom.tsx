/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Crown,
  PlayCircle,
  Loader2,
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
      <div className="bg-zinc-900 border border-red-500/20 rounded-2xl p-5 shadow-2xl shadow-black/60">
        <div className={`absolute top-6 w-3 h-3 bg-zinc-900 border-t border-b rotate-45 ${
          index === 2 ? "-left-1.5 border-l border-r-0" : "-right-1.5 border-r border-l-0"
        } border-red-500/20`}
          style={index === 2
            ? { borderRight: 'none', marginLeft: -1 }
            : { borderLeft: 'none', marginRight: -1 }
          }
        />
        <div className="flex items-center gap-2 mb-4">
          <span className="w-7 h-7 rounded-lg bg-red-600/10 flex items-center justify-center text-red-500 font-black text-xs">{item.step}</span>
          <span className="text-xs font-black text-white uppercase tracking-tight">{item.title}</span>
        </div>
        <ul className="space-y-2.5">
          {item.details.map((d: string, di: number) => (
            <li key={di} className="flex items-start gap-2.5 text-xs text-zinc-400">
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
  const [hasSubscription, setHasSubscription] = useState(false);
  const [loading, setLoading] = useState(true);
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
      title: "Fondamenti del Calisthenics",
      lessons: [
        { title: "Introduzione alla disciplina", duration: "15 min" },
        { title: "Esercizi base: Push, Pull, Squat", duration: "30 min" },
        { title: "Progressions anatomiche", duration: "25 min" },
        { title: "Esercizi di mobilita", duration: "20 min" },
      ],
    },
    {
      title: "Skill progressions",
      lessons: [
        { title: "Front Lever progression", duration: "35 min" },
        { title: "Planche progression", duration: "35 min" },
        { title: "Muscle-up tecnica", duration: "25 min" },
        { title: "Handstand basics", duration: "30 min" },
      ],
    },
    {
      title: "Programmazione Avanzata",
      lessons: [
        { title: "Costruire Routine", duration: "20 min" },
        { title: "Progress overload", duration: "25 min" },
        { title: "Deload e recupero", duration: "15 min" },
        { title: "Periodizzazione", duration: "30 min" },
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
        setPurchaseError(data?.message || "Checkout non riuscito. Riprova.");
      }
    } catch (error) {
      console.error("Errore checkout:", error);
      setPurchaseError("Errore di connessione. Riprova.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  // ─── NON-SUBSCRIBER VIEW ──────────────────────────────────────────────────
  if (!isAuthenticated || !hasSubscription) {
    const allFeatures = [
      { icon: <Video className="text-red-500" />, text: "Videochiamata settimanale 1 a 1 con me" },
      { icon: <Users className="text-red-500" />, text: "Videochiamata settimanale di gruppo" },
      { icon: <MessageCircle className="text-red-500" />, text: "Community esclusiva" },
      { icon: <Target className="text-red-500" />, text: "Ti aiuto a sbloccare il Front Lever" },
      { icon: <Brain className="text-red-500" />, text: "Mentalità applicata al Calisthenics" },
      { icon: <Flame className="text-red-500" />, text: "Costruisci il fisico dei tuoi sogni" },
      { icon: <Award className="text-red-500" />, text: "Migliora la tua disciplina" },
      { icon: <ShieldCheck className="text-red-500" />, text: "Impara a non saltare neanche un allenamento" },
      { icon: <Sparkles className="text-red-500" />, text: "Elimina la procrastinazione" },
      { icon: <BookOpen className="text-red-500" />, text: "Programmi di allenamento personalizzati" },
      { icon: <PlayCircle className="text-red-500" />, text: "Corsi sul Calisthenics e sulla mentalità" },
      { icon: <CheckCircle className="text-red-500" />, text: "Crea e rispetta una dieta sana" },
    ];

    const bonuses = [
      "1 Anno di MIND PROJECT incluso",
      "Videochiamate di gruppo precedenti registrate",
      "Template Guida completa sul Calisthenics",
    ];

    return (
      <div className="min-h-screen bg-zinc-950 text-white selection:bg-red-500/30">
        <SEO
          title="Calisthenics Room - Elite Coaching"
          description="L'esperienza definitiva di coaching 1:1 e programmazione avanzata."
        />

        {/* ── HERO ── */}
        <section className="relative min-h-[120vh] flex items-center justify-center px-6 pt-24 pb-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.18)_0%,transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(249,115,22,0.1)_0%,transparent_50%)]" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[150px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[150px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[200px]" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
            >
              <Sparkles size={12} />
              Coaching d&apos;Élite
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.8] mb-8"
            >
              <span className="text-white">CALISTHENICS</span>
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-br from-red-500 via-red-600 to-orange-500 italic">ROOM</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-zinc-400 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed mb-10"
            >
              L&apos;unico percorso che trasforma radicalmente il tuo fisico e la tua mentalità<br className="hidden md:block" />
              attraverso la scienza della performance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a href="#offers" className="px-10 py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl text-sm uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-red-900/30">
                Inizia il Percorso
              </a>
              <a href="#features" className="px-10 py-4 border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white font-black rounded-2xl text-sm uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95">
                Scopri di Più
              </a>
            </motion.div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="features" className="py-32 px-6 relative">
          <div className="max-w-5xl mx-auto relative">
            <div className="text-center mb-16">
              <span className="text-red-500 font-black tracking-[0.3em] uppercase text-[10px] mb-4 block">Il Metodo</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
                Come <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-orange-500">Funziona</span>
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
                    title: "Analisi & Obiettivi",
                    brief: "Valutazione iniziale",
                    desc: "Ti conosco, valuto il tuo livello, la tua biomeccanica e i tuoi limiti. Impostiamo obiettivi chiari e misurabili con scadenze precise.",
                    details: [
                      "Valutazione biomeccanica completa",
                      "Test di forza e mobilità",
                      "Definizione obiettivi SMART",
                      "Analisi abitudini alimentari",
                    ],
                    icon: <Target size={28} />,
                  },
                  {
                    step: "02",
                    title: "Programmazione",
                    brief: "Percorso su misura",
                    desc: "Costruisco un percorso su misura per te: skill, forza, volume, recupero. Ogni variabile è calibrata sul tuo corpo.",
                    details: [
                      "Scheda personalizzata settimanale",
                      "Progressioni skill-specifiche",
                      "Periodizzazione dei carichi",
                      "Piano nutrizionale base",
                    ],
                    icon: <Brain size={28} />,
                  },
                  {
                    step: "03",
                    title: "Checkpoint Costanti",
                    brief: "Monitoraggio continuo",
                    desc: "Ogni settimana rivediamo i progressi, correggiamo la tecnica, aggiustiamo il carico. Nessuna sessione lasciata al caso.",
                    details: [
                      "Video analisi settimanale",
                      "Correzione tecnica in tempo reale",
                      "Aggiustamento carichi e volumi",
                      "Report mensile dei progressi",
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
                            className="group relative p-8 bg-zinc-900/30 border border-white/5 rounded-[2.5rem] hover:border-red-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-red-900/10 cursor-default"
                          >
                            <div className="absolute inset-0 bg-linear-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]" />
                            <div className="relative z-10">
                              <div className="flex items-center justify-between mb-4">
                                <span className="text-5xl font-black text-zinc-800 group-hover:text-red-600/20 transition-colors duration-500">{item.step}</span>
                                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-red-500/60 transition-colors">{item.brief}</span>
                              </div>
                              <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center mb-5 text-red-500 group-hover:scale-110 transition-transform group-hover:shadow-lg group-hover:shadow-red-900/30">
                                {item.icon}
                              </div>
                              <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight">{item.title}</h3>
                              <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
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
        <section className="py-24 px-6 bg-zinc-900/20 border-y border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.08)_0%,transparent_60%)]" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  title: "Coaching 1:1",
                  desc: "Correzioni video e feedback personalizzati direttamente da me ogni settimana. Ogni tua ripetizione viene analizzata.",
                  icon: <PlayCircle />,
                },
                {
                  title: "Protocolli Elite",
                  desc: "Accesso totale a tutti i programmi Mastery: Planche, Front Lever, Handstand. Segui il percorso giusto per ogni skill.",
                  icon: <Award />,
                },
                {
                  title: "Mindset & Disciplina",
                  desc: "Strategie psicologiche per eliminare la procrastinazione e costruire abitudini incrollabili. La mente comanda il corpo.",
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
                  <div className="text-center mb-8">
                    <div className="w-24 h-24 rounded-2xl bg-zinc-900/80 border border-white/5 flex items-center justify-center mx-auto mb-8 group-hover:border-red-500/40 group-hover:bg-zinc-900 transition-all duration-500">
                      {React.cloneElement(item.icon as any, { size: 44, className: "text-red-500 group-hover:scale-110 transition-transform duration-500" })}
                    </div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{item.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES + BONUSES ── */}
        <section id="offers" className="py-32 px-6 relative">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-red-500 font-black tracking-[0.3em] uppercase text-[10px] mb-4 block">Cosa Ottieni</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
                Il <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-orange-500">Protocollo</span> Completo
              </h2>
            </div>

            <div className="space-y-12">
              {/* Features */}
              <div className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] p-8 md:p-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-10">
                  <Sparkles size={12} />
                  Cosa Include
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {allFeatures.map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-red-500/20 hover:bg-red-500/5 transition-all duration-300 group"
                    >
                      <div className="w-7 h-7 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                        <CheckCircle size={16} className="text-green-500" />
                      </div>
                      <span className="text-sm font-bold leading-snug text-zinc-300 group-hover:text-white transition-colors">
                        {f.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Bonuses */}
              <div className="relative">
                <div className="bg-linear-to-br from-zinc-900/40 to-zinc-950/40 border border-white/5 rounded-[2.5rem] p-8 md:p-12 overflow-hidden">
                  <div className="absolute -top-20 -right-20 opacity-5">
                    <Crown size={200} />
                  </div>
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-10">
                      <Sparkles size={12} />
                      Bonus Esclusivi
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      {bonuses.map((bonus, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/5 group hover:border-amber-500/30 hover:bg-amber-500/5 transition-all"
                        >
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Crown size={20} className="text-amber-500" />
                          </div>
                          <span className="text-white font-bold text-sm md:text-base tracking-tight">{bonus}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-10 p-6 bg-gradient-to-r from-red-600/10 to-amber-600/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                      <Sparkles size={16} className="text-amber-500 shrink-0" />
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-300">
                        Bonus inclusi in tutti i piani
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section className="pb-32 px-6" id="pricing">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-red-500 font-black tracking-[0.3em] uppercase text-[10px] mb-4 block">Investimento</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
                Scegli il tuo <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-orange-500">Percorso</span>
              </h2>
              <p className="text-zinc-500 font-medium italic mt-4 max-w-xl mx-auto">Più investi su di te, più il costo per mese scende. Il miglior affare? Il pacchetto annuale.</p>
            </div>

            {/* Frequency Toggle */}
            <div className="flex justify-center mb-14">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-zinc-900/60 border border-white/5 rounded-full">
                {["Mensile", "Semestrale", "Annuale"].map((freq, fi) => (
                  <span
                    key={fi}
                    className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all cursor-default ${
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
                  period: "Mensile",
                  price: "79",
                  priceValue: 79,
                  label: "FLESSIBILE",
                  desc: "Nessun vincolo, nessun impegno. Attiva e disattiva quando vuoi.",
                  monthly: null,
                  save: null,
                  highlight: false,
                  cta: "Inizia Mensile",
                  badge: null,
                  features: [
                    "Coaching 1:1 settimanale",
                    "Videochiamata di gruppo",
                    "Community esclusiva",
                    "Programma personalizzato",
                    "Cancella quando vuoi",
                  ],
                },
                {
                  period: "6 Mesi",
                  price: "297",
                  priceValue: 297,
                  label: "PROGRESSION",
                  desc: "Il giusto commitment per vedere risultati reali e trasformare il tuo fisico.",
                  monthly: "€49,50/mese",
                  save: "Risparmi il 37%",
                  highlight: false,
                  cta: "Inizia Progression",
                  badge: null,
                  features: [
                    "Coaching 1:1 settimanale",
                    "Videochiamata di gruppo",
                    "Community esclusiva",
                    "Programma personalizzato",
                    "Corsi Calisthenics completi",
                    "Template pianificazione",
                  ],
                },
                {
                  period: "1 Anno",
                  price: "547",
                  priceValue: 547,
                  label: "MASTERY ELITE",
                  desc: "Il pacchetto completo: massimo risparmio, tutti i bonus e supporto continuo.",
                  monthly: "€45,58/mese",
                  save: "Risparmi il 42%",
                  highlight: true,
                  cta: "Scegli Mastery Elite",
                  badge: "Miglior Valore",
                  features: [
                    "Tutto del piano Progression",
                    "1 anno di MIND PROJECT incluso",
                    "Videochiamate gruppo registrate",
                    "Guida Completa PDF",
                    "Certificato Mastery",
                    "Priorità supporto 24/7",
                  ],
                },
              ].map((plan, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className={`relative rounded-[2.5rem] border transition-all duration-500 flex flex-col justify-between overflow-hidden group ${
                    plan.highlight
                      ? "bg-red-600 border-red-400 shadow-2xl shadow-red-900/40 scale-[1.02] md:scale-105 z-10"
                      : "bg-zinc-900/40 border-white/10 hover:border-red-500/30 hover:shadow-xl hover:shadow-red-900/10"
                  }`}
                >
                  {/* Background effects */}
                  {plan.highlight && (
                    <>
                      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-bl-full" />
                      <div className="absolute -top-12 -right-12 w-72 h-72 bg-red-400/10 rounded-full blur-[100px]" />
                    </>
                  )}
                  {!plan.highlight && (
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  )}

                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white text-red-600 rounded-full text-[9px] font-black uppercase tracking-[0.25em] shadow-xl">
                        <Sparkles size={10} />
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="relative z-10 p-8 lg:p-10 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${
                        plan.highlight ? "text-red-200" : "text-zinc-500"
                      }`}>
                        {plan.label}
                      </span>
                      {plan.save && (
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
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
                        <span className="text-5xl lg:text-6xl font-black tracking-tighter">
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
                    <p className={`text-sm font-medium leading-relaxed mt-4 mb-8 ${
                      plan.highlight ? "text-red-100" : "text-zinc-400"
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
                            plan.highlight ? "text-red-50" : "text-zinc-300"
                          }`}>
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <button
                      onClick={() => handlePurchase(plan)}
                      className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all relative z-10 ${
                        plan.highlight
                          ? "bg-white text-black hover:bg-zinc-100 shadow-xl"
                          : "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/20 hover:shadow-xl hover:shadow-red-900/30"
                      } hover:scale-[1.02] active:scale-95`}
                    >
                      {plan.cta}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Payment Info */}
            <div className="mt-16 flex flex-col items-center gap-5">
              {purchaseError && (
                <p className="text-red-400 text-xs font-bold bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-3">
                  {purchaseError}
                </p>
              )}
              <div className="flex items-center gap-6 text-zinc-600 text-[10px] font-black uppercase tracking-[0.15em]">
                <span className="flex items-center gap-1.5"><ShieldCheck size={12} /> Pagamento sicuro Stripe</span>
                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                <span className="flex items-center gap-1.5"><Sparkles size={12} /> Accesso immediato</span>
                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                <span className="flex items-center gap-1.5"><Award size={12} /> Garanzia 14 giorni</span>
              </div>
              {!isAuthenticated && (
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-zinc-600 text-xs font-medium">Hai già un account?</span>
                  <Link to="/login" className="px-5 py-2.5 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                    Accedi
                  </Link>
                  <Link to="/register" className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                    Registrati
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="pb-32 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-red-500 font-black tracking-[0.3em] uppercase text-[10px] mb-4 block">Dubbi?</span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">Domande <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-orange-500">Frequenti</span></h2>
            </div>

            <div className="space-y-3">
              {[
                { q: "Cosa serve per iniziare?", a: "Solo la voglia di migliorare. Non serve esperienza pregressa: partiamo dal tuo livello attuale e costruiamo da lì." },
                { q: "Quanto tempo devo dedicare?", a: "Minimo 3 sessioni a settimana da 60-90 minuti. I risultati arrivano con la costanza, non con la quantità." },
                { q: "E se non vedo risultati?", a: "Ogni settimana abbiamo un check-point. Se qualcosa non funziona, lo correggiamo subito. Nessun mese sprecato." },
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group p-6 bg-zinc-900/20 border border-white/5 rounded-2xl hover:border-red-500/20 transition-all"
                >
                  <h3 className="font-black text-white uppercase tracking-tight mb-2 text-sm">{faq.q}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{faq.a}</p>
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
    <div className="min-h-screen bg-black text-white selection:bg-red-500/30">
      <SEO
        title="Calisthenics Room - Area Riservata"
        description="Benvenuto nella Calisthenics Room. Accedi al tuo coaching e ai tuoi programmi."
      />

      {/* Status Banner */}
      <div className="pt-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-linear-to-r from-red-600/10 to-transparent border border-red-500/20 flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center animate-pulse">
                <Crown size={20} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Stato Abbonamento</p>
                <p className="text-sm font-bold text-white uppercase tracking-tight">
                  Piano {user?.subscriptionTier || 'Elite'} <span className="text-red-500">• ATTIVO</span>
                </p>
              </div>
            </div>
            <Link to="/purchase-history" className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors border border-white/5">
              Gestisci Abbonamento
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Header */}
      <section className="pt-16 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest mb-4">
              <Sparkles size={12} /> Bentornato
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
              LA TUA <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-orange-500">ROOM</span>
            </h1>
            <p className="text-zinc-500 font-medium italic text-lg">Il tuo portale d&apos;élite per la massima performance fisica.</p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 pb-32 space-y-20">

        {/* Resource Cards */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-red-600 rounded-full" />
            <h2 className="text-2xl font-black uppercase tracking-tight">Risorse & Guide</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Guida Completa al Calisthenics Moderno",
                desc: "Scienza applicata, programmazione avanzata e protocolli di recupero.",
                action: "Apri la Guida",
                to: "/guide",
                icon: <BookOpen size={32} />,
              },
              {
                title: "Template Scheda Settimanale",
                desc: "Il planner settimanale per tracciare volume, intensità e recupero.",
                action: "Crea Scheda",
                to: "/create",
                icon: <Target size={32} />,
              },
            ].map((res, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.01 }}
                className="bg-linear-to-br from-zinc-900 to-zinc-950 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group"
              >
                <div className="absolute -right-8 -top-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Crown size={180} />
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 text-red-500">
                    {res.icon}
                  </div>
                  <h3 className="text-xl font-black mb-3 leading-tight">{res.title}</h3>
                  <p className="text-zinc-500 text-sm mb-8 leading-relaxed">{res.desc}</p>
                  <Link to={res.to} className="inline-flex items-center gap-3 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl transition-all text-xs tracking-widest uppercase shadow-lg shadow-red-900/20">
                    {res.action} <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Masterclass Video */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-red-600 rounded-full" />
            <h2 className="text-2xl font-black uppercase tracking-tight">Masterclass Video</h2>
          </div>

          <div className="space-y-3">
            {courseModules.map((module, moduleIndex) => (
              <motion.div
                key={moduleIndex}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: moduleIndex * 0.1 }}
                className="bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden group hover:border-red-500/20 transition-all"
              >
                <button
                  onClick={() => setExpandedModule(expandedModule === moduleIndex ? -1 : moduleIndex)}
                  className="w-full p-5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-red-500 font-black text-lg group-hover:bg-red-600 group-hover:text-white group-hover:border-red-500 transition-all duration-300">
                      {moduleIndex + 1}
                    </div>
                    <div>
                      <h3 className="font-black text-white uppercase tracking-tight text-sm">{module.title}</h3>
                      <p className="text-[10px] font-bold text-zinc-600 tracking-widest uppercase">{module.lessons.length} lezioni</p>
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${expandedModule === moduleIndex ? "bg-red-600/20" : "bg-white/5"}`}>
                    {expandedModule === moduleIndex ? (
                      <ChevronDown size={18} className="text-red-500" />
                    ) : (
                      <ChevronRight size={18} className="text-zinc-600" />
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
                        className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 hover:border-white/10 hover:bg-black/60 transition-all group/lesson"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center text-red-500 group-hover/lesson:bg-red-600 group-hover/lesson:text-white transition-all">
                            <PlayCircle size={16} />
                          </div>
                          <span className="text-sm font-bold text-zinc-300 group-hover/lesson:text-white transition-colors">{lesson.title}</span>
                        </div>
                        <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest flex items-center gap-1.5">
                          <Clock size={10} /> {lesson.duration}
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
      <footer className="py-16 border-t border-white/5 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-zinc-600 hover:text-white text-xs font-black uppercase tracking-[0.3em] transition-all">
            Torna alla Home <ArrowRight size={14} />
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default CalisthenicsRoom;
