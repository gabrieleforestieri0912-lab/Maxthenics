/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Target,
  Activity,
  Info,
  Award,
  Brain,
  Apple,
  Timer,
  Beef,
  Droplets,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Button from "../components/Button";
import SectionHeading from "../components/SectionHeading";
import SEO from "../components/SEO";
import { useLanguage } from "../context/LanguageContext";

interface Subsection {
  id: string;
  title: { it: string; en: string };
  accent: Accent;
}

interface GuideSection {
  id: string;
  title: { it: string; en: string };
  icon: React.ReactNode;
  accent: Accent;
  subsections: Subsection[];
}

/** Per-section accent colors, restored from the original guide palette. */
type Accent = "red" | "amber" | "cyan" | "rose" | "violet" | "emerald" | "orange";

const ACCENTS: Record<
  Accent,
  {
    eyebrow: string;
    icon: string;
    iconBox: string;
    hoverBorder: string;
    highlight: string;
    dot: string;
    activeItem: string;
  }
> = {
  red: {
    eyebrow: "text-red-600",
    icon: "text-red-500",
    iconBox: "bg-red-500/10 border-red-500/20",
    hoverBorder: "hover:border-red-500/30",
    highlight: "border-red-500/20 bg-red-600/[0.06]",
    dot: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]",
    activeItem: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  amber: {
    eyebrow: "text-amber-500",
    icon: "text-amber-400",
    iconBox: "bg-amber-500/10 border-amber-500/20",
    hoverBorder: "hover:border-amber-500/30",
    highlight: "border-amber-500/20 bg-amber-600/[0.06]",
    dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
    activeItem: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  cyan: {
    eyebrow: "text-cyan-500",
    icon: "text-cyan-400",
    iconBox: "bg-cyan-500/10 border-cyan-500/20",
    hoverBorder: "hover:border-cyan-500/30",
    highlight: "border-cyan-500/20 bg-cyan-600/[0.06]",
    dot: "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]",
    activeItem: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  },
  rose: {
    eyebrow: "text-rose-500",
    icon: "text-rose-400",
    iconBox: "bg-rose-500/10 border-rose-500/20",
    hoverBorder: "hover:border-rose-500/30",
    highlight: "border-rose-500/20 bg-rose-600/[0.06]",
    dot: "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]",
    activeItem: "bg-rose-500/10 text-rose-300 border-rose-500/20",
  },
  violet: {
    eyebrow: "text-violet-500",
    icon: "text-violet-400",
    iconBox: "bg-violet-500/10 border-violet-500/20",
    hoverBorder: "hover:border-violet-500/30",
    highlight: "border-violet-500/20 bg-violet-600/[0.06]",
    dot: "bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]",
    activeItem: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  },
  emerald: {
    eyebrow: "text-emerald-500",
    icon: "text-emerald-400",
    iconBox: "bg-emerald-500/10 border-emerald-500/20",
    hoverBorder: "hover:border-emerald-500/30",
    highlight: "border-emerald-500/20 bg-emerald-600/[0.06]",
    dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
    activeItem: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  },
  orange: {
    eyebrow: "text-orange-500",
    icon: "text-orange-400",
    iconBox: "bg-orange-500/10 border-orange-500/20",
    hoverBorder: "hover:border-orange-500/30",
    highlight: "border-orange-500/20 bg-orange-600/[0.06]",
    dot: "bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)]",
    activeItem: "bg-orange-500/10 text-orange-300 border-orange-500/20",
  },
};

const guideSections: GuideSection[] = [
  {
    id: "intro",
    title: { it: "Introduzione", en: "Introduction" },
    icon: <BookOpen className="w-4 h-4" />,
    accent: "red",
    subsections: [{ id: "introduction", title: { it: "Benvenuto", en: "Welcome" }, accent: "red" }],
  },
  {
    id: "concetti-base",
    title: { it: "Concetti Base", en: "Basics" },
    icon: <Target className="w-4 h-4" />,
    accent: "red",
    subsections: [
      { id: "concetti-base", title: { it: "Panoramica", en: "Overview" }, accent: "red" },
      { id: "intensita-volume", title: { it: "Intensità e volume", en: "Intensity & volume" }, accent: "amber" },
    ],
  },
  {
    id: "scienza",
    title: { it: "Scienza", en: "Science" },
    icon: <Brain className="w-4 h-4" />,
    accent: "cyan",
    subsections: [
      { id: "formula-forza", title: { it: "Formula della forza", en: "Strength formula" }, accent: "cyan" },
      { id: "percorsi-ipertrofia", title: { it: "Ipertrofia", en: "Hypertrophy" }, accent: "rose" },
    ],
  },
  {
    id: "programmazione",
    title: { it: "Programmazione", en: "Programming" },
    icon: <Target className="w-4 h-4" />,
    accent: "violet",
    subsections: [
      { id: "programmazione-allenamento", title: { it: "Programmazione", en: "Programming" }, accent: "violet" },
    ],
  },
  {
    id: "alimentazione",
    title: { it: "Alimentazione", en: "Nutrition" },
    icon: <Apple className="w-4 h-4" />,
    accent: "emerald",
    subsections: [{ id: "macronutrienti", title: { it: "Macronutrienti", en: "Macronutrients" }, accent: "emerald" }],
  },
  {
    id: "recupero",
    title: { it: "Recupero", en: "Recovery" },
    icon: <Timer className="w-4 h-4" />,
    accent: "orange",
    subsections: [
      { id: "strategie-recupero", title: { it: "Strategie di recupero", en: "Recovery strategies" }, accent: "amber" },
      { id: "deload", title: { it: "Importanza dello scarico", en: "Why deload matters" }, accent: "orange" },
    ],
  },
];

/** All section blocks share this rhythm so the page reads as one document. */
function GuideBlock({
  id,
  index,
  eyebrow,
  title,
  accent = "red",
  children,
}: {
  id: string;
  index?: string;
  eyebrow: string;
  title: string;
  accent?: Accent;
  children: React.ReactNode;
}) {
  const a = ACCENTS[accent];
  return (
    <section id={id} className="scroll-mt-28 pt-20 first:pt-0">
      <SectionHeading
        index={index}
        eyebrow={eyebrow}
        eyebrowClassName={`text-xs font-bold uppercase tracking-widest ${a.eyebrow}`}
        title={title}
        className="mb-10"
      />
      {children}
    </section>
  );
}

function ConceptCard({
  icon,
  title,
  accent = "red",
  children,
}: {
  icon: React.ReactNode;
  title: string;
  accent?: Accent;
  children: React.ReactNode;
}) {
  const a = ACCENTS[accent];
  return (
    <div className={`card card-hover p-7 ${a.hoverBorder}`}>
      <div
        className={`w-11 h-11 rounded-lg border flex items-center justify-center mb-5 ${a.iconBox} ${a.icon}`}
      >
        {icon}
      </div>
      <h3 className="text-base font-bold tracking-tight text-zinc-900 dark:text-white mb-3">{title}</h3>
      <div className="prose-block">{children}</div>
    </div>
  );
}

function ProseCard({ children }: { children: React.ReactNode }) {
  return <div className="card p-7 md:p-9">{children}</div>;
}

function Highlight({
  accent = "red",
  children,
}: {
  accent?: Accent;
  children: React.ReactNode;
}) {
  const a = ACCENTS[accent];
  return (
    <div className={`card p-7 md:p-9 ${a.highlight}`}>
      <p className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white leading-snug">{children}</p>
    </div>
  );
}

function MacroCard({
  icon,
  title,
  accent = "emerald",
  children,
}: {
  icon: React.ReactNode;
  title: string;
  accent?: Accent;
  children: React.ReactNode;
}) {
  const a = ACCENTS[accent];
  return (
    <div className={`card card-hover p-7 ${a.hoverBorder}`}>
      <div className={`mb-5 ${a.icon}`}>{icon}</div>
      <h4 className="text-base font-bold tracking-tight text-white mb-3">{title}</h4>
      <p className="prose-block">{children}</p>
    </div>
  );
}

const Guide: React.FC = () => {
  const [activeSection, setActiveSection] = useState("introduction");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      guideSections.forEach((section) => {
        section.subsections.forEach((sub) => {
          const el = document.getElementById(sub.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 200 && rect.bottom >= 200) setActiveSection(sub.id);
          }
        });
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [guideSections]);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <SEO
        title={t("Guida Calisthenics", "Calisthenics Guide")}
        description={t(
          "Guida completa al calisthenics: tecniche, progressioni, esercizi e programmi per principianti e atleti avanzati. Impara Front Lever, Planche e molto altro.",
          "Complete calisthenics guide: techniques, progressions, exercises and programs for beginners and advanced athletes. Learn Front Lever, Planche and more."
        )}
        keywords="guida calisthenics, progressioni calisthenics, tecniche bodyweight, front lever tutorial, planche progression"
      />

      <div className="page-shell flex">
        <aside
          aria-label="Indice della guida"
          className={`fixed left-4 top-24 z-40 w-72 card shadow-2xl shadow-black/50 max-h-[calc(100vh-8rem)] ${
            isSidebarOpen ? "flex" : "hidden"
          }`}
        >
          <div className="flex flex-col min-h-0 w-full">
            <div className="flex items-center justify-between px-5 h-16 border-b border-zinc-200 dark:border-white/10 shrink-0">
              <span className="meta-mono text-red-500">{t("Guida", "Guide")}</span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                aria-label={t("Chiudi indice", "Close index")}
                className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors p-1"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-5 px-4 scrollbar-hide min-h-0">
              <ul className="space-y-4">
                {guideSections.map((section) => {
                  const sectionActive = section.subsections.some(
                    (sub) => sub.id === activeSection
                  );
                  const sa = ACCENTS[section.accent];
                  return (
                    <li key={section.id}>
                      <button
                        onClick={() => scrollToSection(section.subsections[0].id)}
                        aria-current={sectionActive ? "true" : undefined}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm font-bold transition-colors border ${
                          sectionActive
                            ? sa.activeItem
                            : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-900/5 dark:hover:text-white dark:hover:bg-white/5 border-transparent"
                        }`}
                      >
                        <span className={sectionActive ? sa.icon : "text-zinc-600"}>
                          {section.icon}
                        </span>
                        <span className="truncate">{t(section.title.it, section.title.en)}</span>
                      </button>
                      <ul className="ml-4 mt-1 space-y-0.5 border-l border-zinc-200 dark:border-white/10 pl-3">
                        {section.subsections.map((sub) => {
                          const subActive = activeSection === sub.id;
                          const dot = ACCENTS[sub.accent].dot;
                          return (
                            <li key={sub.id} className="relative">
                              <span
                                aria-hidden
                                className={`absolute -left-4 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full transition-colors ${
                                  subActive ? dot : "bg-zinc-700"
                                }`}
                              />
                              <button
                                onClick={() => scrollToSection(sub.id)}
                                aria-current={subActive ? "true" : undefined}
                                className={`w-full rounded-md px-1 py-1 text-left text-xs transition-colors ${
                                  subActive
                                    ? "font-bold text-white"
                                    : "font-medium text-zinc-500 hover:text-zinc-200"
                                }`}
                              >
                                <span className="truncate block">{t(sub.title.it, sub.title.en)}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="p-4 border-t border-zinc-200 dark:border-white/10 shrink-0">
              <Button to="/programs" size="sm" className="w-full">
                {t("Vedi i programmi", "See programs")}
                <ChevronRight className="w-4 h-4" aria-hidden />
              </Button>
            </div>
          </div>
        </aside>

        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            aria-label={t("Apri indice", "Open index")}
            className="fixed top-24 left-4 z-40 p-2.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors shadow-xl"
          >
            <ChevronRight className="w-5 h-5" aria-hidden />
          </button>
        )}

        <main
          className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "md:ml-80" : ""}`}
        >
          <div className="max-w-5xl mx-auto px-6 lg:px-8 pt-32 pb-32">
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <p className="eyebrow">{t("Centro Educativo", "Education Hub")}</p>
              <h1 className="page-title mt-3 text-4xl md:text-6xl">
                {t("Domina il tuo corpo.", "Master your body.")}
              </h1>
              <p className="body-copy mt-5 text-lg">
                {t(
                  "Benvenuto nella guida definitiva. Qui imparerai come trasformare la gravità nel tuo miglior alleato, costruendo una forza che non avresti mai pensato di possedere.",
                  "Welcome to the definitive guide. Here you will learn how to turn gravity into your best ally, building strength you never thought you had."
                )}
              </p>
            </motion.header>

            <GuideBlock id="introduction" eyebrow={t("01 — Fondamenti", "01 — Foundations")} title={t("Introduzione", "Introduction")}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ConceptCard icon={<BookOpen size={20} />} title={t("Cos'è il Calisthenics?", "What is Calisthenics?")}>
                  {t(
                    "Il Calisthenics è l'arte dell'allenamento a corpo libero. Deriva dalle parole greche 'Kalos' (bellezza) e 'Sthenos' (forza).",
                    "Calisthenics is the art of bodyweight training. It comes from the Greek words 'Kalos' (beauty) and 'Sthenos' (strength)."
                  )}
                </ConceptCard>
                <ConceptCard icon={<Target size={20} />} title={t("I Pilastri della Forza", "The Pillars of Strength")}>
                  {t(
                    "Si basa su movimenti multi-articolari fondamentali: Trazioni, Piegamenti, Dip e Squat.",
                    "It is based on fundamental multi-joint movements: Pull-ups, Push-ups, Dips and Squats."
                  )}
                </ConceptCard>
              </div>
            </GuideBlock>

            <GuideBlock id="concetti-base" eyebrow={t("02 — Fondamenti", "02 — Foundations")} title={t("Concetti Base", "Basic Concepts")}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ConceptCard icon={<Activity size={20} />} title={t("Fitness", "Fitness")}>
                  {t(
                    "Il fitness è un effetto positivo sul corpo causato dall'allenamento.",
                    "Fitness is a positive effect on the body caused by training."
                  )}
                </ConceptCard>
                <ConceptCard icon={<Info size={20} />} title={t("Affaticamento", "Fatigue")}>
                  {t(
                    "L'affaticamento è un effetto negativo sul corpo.",
                    "Fatigue is a negative effect on the body."
                  )}
                </ConceptCard>
                <ConceptCard icon={<Award size={20} />} title={t("Performance", "Performance")}>
                  {t(
                    "La performance è il modo in cui un'attività sportiva viene svolta.",
                    "Performance is the way a sports activity is performed."
                  )}
                </ConceptCard>
              </div>

              <div className="mt-4">
                <p className="meta-mono mb-3">{t("Regola d'Oro", "Golden Rule")}</p>
                <Highlight>
                  {t(
                    "\"Allenati nel modo più specifico possibile, il più intensamente possibile e il più frequentemente possibile.\"",
                    "\"Train as specifically as possible, as intensely as possible and as frequently as possible.\""
                  )}
                </Highlight>
              </div>
            </GuideBlock>

            <GuideBlock id="intensita-volume" eyebrow={t("03 — Intensità", "03 — Intensity")} title={t("Intensità e Volume", "Intensity & Volume")} accent="amber">
              <ProseCard>
                <h3 className="text-base font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
                  {t("Intensità", "Intensity")}
                </h3>
                <p className="prose-block mb-4">
                  {t(
                    "L'intensità definisce la misura di quanto duramente ci si deve allenare. Nel Calisthenics l'intensità si misura in base a quanto ci si avvicina al cedimento muscolare o tecnico in ogni serie.",
                    "Intensity defines how hard you must train. In Calisthenics, intensity is measured by how close you get to muscular or technical failure in each set."
                  )}
                </p>
                <p className="prose-block mb-4">
                  {t(
                    "Per ottenere progressi continui ci si deve allenare con un'intensità sufficientemente alta da stimolare un adattamento, ma sufficientemente bassa da permettere un recupero efficace.",
                    "To keep progressing you must train with intensity high enough to stimulate adaptation, but low enough to allow effective recovery."
                  )}
                </p>

                <h4 className="prose-subheading">
                  {t("Il Concetto di RIR (Reps In Reserve — Ripetizioni di Riserva)", "The RIR Concept (Reps In Reserve)")}
                </h4>
                <ul className="prose-list">
                  <li>
                    <strong className="text-zinc-800 dark:text-zinc-200">RIR 3-4:</strong> {t("ti fermi avendo ancora 3 o 4 ripetizioni di riserva. Intensità bassa/moderata.", "you stop with 3 or 4 reps still in reserve. Low/moderate intensity.")}
                  </li>
                  <li>
                    <strong className="text-zinc-800 dark:text-zinc-200">RIR 1-2:</strong> {t("ti fermi avendo ancora 1 o 2 ripetizioni di riserva. Intensità alta.", "you stop with 1 or 2 reps still in reserve. High intensity.")}
                  </li>
                  <li>
                    <strong className="text-zinc-800 dark:text-zinc-200">RIR 0:</strong> {t("arrivi al cedimento tecnico. Intensità massima.", "you reach technical failure. Maximum intensity.")}
                  </li>
                </ul>
                <p className="prose-block">
                  {t(
                    "Allenati duramente entro i limiti della corretta esecuzione (RIR 1-2, fermandosi al cedimento tecnico) per massimizzare lo stimolo riducendo la fatica eccessiva.",
                    "Train hard within correct execution limits (RIR 1-2, stopping at technical failure) to maximize stimulus while reducing excessive fatigue."
                  )}
                </p>

                <h3 className="prose-subheading">{t("Quanto duramente ti devi allenare", "How hard you must train")}</h3>
                <p className="prose-block mb-4">
                  {t(
                    "Qualunque cosa decidi di allenare assicurati che la puoi ripetere nella sessione successiva e migliora nella prossima settimana sbloccando più ripetizioni, più tempo in isometria o tecnica migliore.",
                    "Whatever you train, make sure you can repeat it next session and improve the following week by unlocking more reps, more isometric time or better technique."
                  )}
                </p>
                <p className="prose-block mb-4">
                  {t(
                    "Per la maggior parte degli allenamenti, l'intensità ottimale si trova nella zona RIR 1-2.",
                    "For most workouts, optimal intensity sits in the RIR 1-2 zone."
                  )}
                </p>
                <ul className="prose-list">
                  <li>
                    <strong className="text-zinc-800 dark:text-zinc-200">{t("Per la crescita muscolare e la forza:", "For muscle growth and strength:")}</strong>{" "}
                    {t("le serie vicino al cedimento (RIR 1-2) sono le più efficaci.", "sets close to failure (RIR 1-2) are the most effective.")}
                  </li>
                  <li>
                    <strong className="text-zinc-800 dark:text-zinc-200">{t("Per l'apprendimento delle skills:", "For skill learning:")}</strong>{" "}
                    {t("allenarsi a RIR 2-3 o più alto per preservare la tecnica.", "train at RIR 2-3 or higher to preserve technique.")}
                  </li>
                  <li>
                    <strong className="text-zinc-800 dark:text-zinc-200">{t("Evitare il cedimento assoluto:", "Avoid absolute failure:")}</strong>{" "}
                    {t(
                      "il cedimento tecnico è preferibile rispetto al cedimento muscolare totale nella maggior parte dei casi.",
                      "technical failure is preferable to total muscular failure in most cases."
                    )}
                  </li>
                </ul>

                <h4 className="prose-subheading">
                  {t("Regole per capire se ti alleni abbastanza duramente", "Rules to tell if you train hard enough")}
                </h4>
                <ul className="prose-list">
                  <li>{t("Le ultime ripetizioni sono sforzate e più lente delle prime.", "The last reps feel strained and slower than the first.")}</li>
                  <li>{t("Usi il sovraccarico progressivo nel tempo.", "You use progressive overload over time.")}</li>
                  <li>{t("Non sacrifichi la tecnica per completare ripetizioni extra.", "You never sacrifice technique to complete extra reps.")}</li>
                </ul>
              </ProseCard>
            </GuideBlock>

            <GuideBlock id="formula-forza" eyebrow={t("04 — Scienza", "04 — Science")} title={t("Principi di Forza", "Strength Principles")} accent="cyan">
              <ProseCard>
                <h3 className="text-base font-bold tracking-tight text-zinc-900 dark:text-white mb-4">{t("Formula", "Formula")}</h3>
                <p className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-6 leading-snug">
                  {t("FORZA", "STRENGTH")} ={" "}
                  <span className="text-cyan-500">{t("ADATTAMENTI NEURALI", "NEURAL ADAPTATIONS")}</span> × {t("AREA DELLA SEZIONE TRASVERSALE (CSA)", "CROSS-SECTIONAL AREA (CSA)")}
                </p>

                <h4 className="prose-subheading">{t("Adattamenti neurali", "Neural adaptations")}</h4>
                <p className="prose-block mb-3">
                  {t(
                    "Gli adattamenti neurali sono cambiamenti nell'efficienza con cui il cervello e il sistema nervoso controllano e attivano i muscoli. Rappresentano la capacità del corpo di usare meglio i muscoli che ha già.",
                    "Neural adaptations are changes in how efficiently the brain and nervous system control and activate muscles. They represent the body's ability to better use the muscles it already has."
                  )}
                </p>
                <ul className="prose-list">
                  <li>{t("Miglior reclutamento delle unità motorie", "Better motor unit recruitment")}</li>
                  <li>{t("Aumento della sincronizzazione", "Increased synchronization")}</li>
                  <li>{t("Migliore coordinazione inter e intramuscolare", "Better inter and intramuscular coordination")}</li>
                  <li>{t("Riduzione dell'inibizione autogena", "Reduced autogenic inhibition")}</li>
                </ul>

                <h4 className="prose-subheading">{t("Area della sezione del muscolo (CSA)", "Muscle cross-sectional area (CSA)")}</h4>
                <p className="prose-block">
                  {t(
                    "La CSA è la dimensione fisica del muscolo. Generalmente maggiore CSA = maggiore potenziale di generare forza. L'ipertrofia aumenta la CSA.",
                    "CSA is the physical size of the muscle. Generally, bigger CSA = bigger force potential. Hypertrophy increases CSA."
                  )}
                </p>

                <h4 className="prose-subheading">{t("Principio SAID e Sovraccarico Progressivo", "SAID Principle and Progressive Overload")}</h4>
                <p className="prose-block mb-3">
                  {t(
                    "Il principio SAID afferma che il corpo si adatta specificamente allo stimolo ricevuto. Il sovraccarico progressivo è la chiave per continuare a migliorare: aumentare ripetizioni, difficoltà, densità o aggiungere zavorre nel tempo.",
                    "The SAID principle states the body adapts specifically to the stimulus received. Progressive overload is the key to keep improving: more reps, difficulty, density or added weight over time."
                  )}
                </p>
                <ul className="prose-list">
                  <li>{t("Aumento delle ripetizioni", "More repetitions")}</li>
                  <li>{t("Aumento della difficoltà dell'esercizio (progressioni)", "Harder exercises (progressions)")}</li>
                  <li>{t("Manipolazione delle leve", "Lever manipulation")}</li>
                  <li>{t("Aumento della densità e aggiunta di zavorre", "More density and added weight")}</li>
                </ul>

                <h4 className="prose-subheading">{t("Unità motorie e reclutamento", "Motor units and recruitment")}</h4>
                <p className="prose-block">
                  {t(
                    "Le unità motorie sono composte da un motoneurone e dalle fibre che innerva. Il reclutamento segue il principio delle dimensioni di Henneman: dalle unità più piccole a quelle più grandi in base alla richiesta di forza.",
                    "Motor units are made of a motor neuron and the fibers it innervates. Recruitment follows Henneman's size principle: from the smallest to the largest units based on force demand."
                  )}
                </p>
              </ProseCard>
            </GuideBlock>

            <GuideBlock id="percorsi-ipertrofia" eyebrow={t("05 — Ipertrofia", "05 — Hypertrophy")} title={t("Percorsi dell'ipertrofia", "Hypertrophy pathways")} accent="rose">
              <ProseCard>
                <h3 className="text-base font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
                  {t("Tensione meccanica", "Mechanical tension")}
                </h3>
                <p className="prose-block mb-4">
                  {t(
                    "La tensione meccanica è la forza che le fibre muscolari sperimentano quando si contraggono contro una resistenza. Avvia processi che portano all'ipertrofia: attivazione dei meccanocettori, micro-traumi e aumento della sintesi proteica.",
                    "Mechanical tension is the force muscle fibers experience when contracting against resistance. It triggers processes leading to hypertrophy: mechanoreceptor activation, micro-trauma and increased protein synthesis."
                  )}
                </p>
                <h4 className="prose-subheading">{t("Fattori chiave", "Key factors")}</h4>
                <ul className="prose-list">
                  <li>{t("Carico progressivo (progressioni, zavorre)", "Progressive load (progressions, added weight)")}</li>
                  <li>{t("Tempo sotto tensione (eccentrica controllata, pause isometriche)", "Time under tension (controlled eccentrics, isometric pauses)")}</li>
                  <li>{t("Gamma di movimento completa", "Full range of motion")}</li>
                  <li>{t("Connessione mente-muscolo", "Mind-muscle connection")}</li>
                </ul>

                <h3 className="prose-subheading">{t("Danno muscolare eccentrico", "Eccentric muscle damage")}</h3>
                <p className="prose-block mb-4">
                  {t(
                    "La fase eccentrica genera micro-lacerazioni che innescano una risposta infiammatoria, attivano cellule satellite e aumentano la sintesi proteica, portando alla supercompensazione e all'ipertrofia.",
                    "The eccentric phase creates micro-tears that trigger an inflammatory response, activate satellite cells and increase protein synthesis, leading to supercompensation and hypertrophy."
                  )}
                </p>
                <p className="prose-block">
                  {t(
                    "Pratiche utili: eccentrica controllata, negative e introduzione graduale di sovraccarico.",
                    "Useful practices: controlled eccentrics, negatives and gradual overload introduction."
                  )}
                </p>

                <h3 className="prose-subheading">{t("Accumulazione metabolica", "Metabolic accumulation")}</h3>
                <p className="prose-block mb-4">
                  {t(
                    "L'accumulo di metaboliti (es. lattato) contribuisce alla crescita tramite maggiore reclutamento, rilascio ormonale e aumento della sintesi proteica. Si ottiene con serie ad alte ripetizioni, brevi recuperi, superset e circuiti.",
                    "Metabolite buildup (e.g. lactate) drives growth through greater recruitment, hormonal release and more protein synthesis. You get it with high-rep sets, short rests, supersets and circuits."
                  )}
                </p>
                <p className="prose-block">
                  {t(
                    "Tecniche pratiche: serie ad alte ripetizioni, EMOM, rest-pause, superset e mantenere la tensione costante evitando lo slancio.",
                    "Practical techniques: high-rep sets, EMOM, rest-pause, supersets, and keeping constant tension without momentum."
                  )}
                </p>
              </ProseCard>
            </GuideBlock>

            <GuideBlock
              id="programmazione-allenamento"
              eyebrow={t("06 — Programmazione", "06 — Programming")}
              title={t("Programmazione dell'allenamento", "Training programming")}
              accent="violet"
            >
              <ProseCard>
                <h3 className="text-base font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
                  {t("Split di allenamento", "Training splits")}
                </h3>
                <p className="prose-block mb-4">
                  {t(
                    "Lo split definisce come distribuisci il lavoro settimanale tra gruppi muscolari e schemi di movimento. Nel Calisthenics si preferisce spesso organizzare le sessioni per pattern motori e priorità di skill piuttosto che per singolo muscolo.",
                    "The split defines how you distribute weekly work across muscle groups and movement patterns. In Calisthenics, sessions are often organized by motor patterns and skill priorities rather than single muscles."
                  )}
                </p>

                <h4 className="prose-subheading">{t("Tipologie di split", "Split types")}</h4>
                <ul className="prose-list mb-6">
                  <li>
                    <strong className="text-zinc-800 dark:text-zinc-200">Push / Pull / Legs (PPL)</strong> {t("— adatto a 3–6 sessioni/settimana; buono per gestire volume e recupero.", "— good for 3–6 sessions/week; great for managing volume and recovery.")}
                  </li>
                  <li>
                    <strong className="text-zinc-800 dark:text-zinc-200">Full Body</strong> {t("— ideale per principianti o 2–3 sessioni/settimana; alta frequenza, basso volume per sessione.", "— ideal for beginners or 2–3 sessions/week; high frequency, low volume per session.")}
                  </li>
                  <li>
                    <strong className="text-zinc-800 dark:text-zinc-200">Upper / Lower</strong> {t("— pratica per 4 sessioni/settimana; equilibrata per forza e volume.", "— practical for 4 sessions/week; balanced for strength and volume.")}
                  </li>
                  <li>
                    <strong className="text-zinc-800 dark:text-zinc-200">
                      {t("Split per skill (es. braccia tese / braccia piegate)", "Skill split (e.g. straight arms / bent arms)")}
                    </strong>{" "}
                    {t("— utile quando si lavora molto sulle progressioni specifiche delle skill.", "— useful when working a lot on skill-specific progressions.")}
                  </li>
                </ul>

                <h3 className="prose-subheading">{t("Periodizzazione", "Periodization")}</h3>
                <p className="prose-block mb-4">
                  {t(
                    "La periodizzazione organizza il training in fasi con obiettivi diversi (accumulo, intensificazione, picco) per massimizzare adattamenti e minimizzare il rischio di plateau e overtraining.",
                    "Periodization organizes training into phases with different goals (accumulation, intensification, peak) to maximize adaptations and minimize plateau and overtraining risk."
                  )}
                </p>

                <h4 className="prose-subheading">{t("Modelli di periodizzazione", "Periodization models")}</h4>
                <ul className="prose-list">
                  <li>
                    <strong className="text-zinc-800 dark:text-zinc-200">{t("Lineare", "Linear")}</strong>{t(": aumenta l'intensità riducendo il volume con il tempo; semplice e adatto ai principianti.", ": intensity rises while volume drops over time; simple and beginner-friendly.")}
                  </li>
                  <li>
                    <strong className="text-zinc-800 dark:text-zinc-200">{t("Ondulata", "Undulating")}</strong>{t(": varia volume e intensità più frequentemente (giornalmente o settimanalmente); efficace per livelli intermedi/avanzati.", ": varies volume and intensity more often (daily or weekly); effective for intermediate/advanced levels.")}
                  </li>
                  <li>
                    <strong className="text-zinc-800 dark:text-zinc-200">{t("A blocchi", "Block")}</strong>{t(": mesocicli con obiettivi chiari (es. accumulo → intensificazione → picco); ottimo per atleti con obiettivi specifici.", ": mesocycles with clear goals (e.g. accumulation → intensification → peak); great for athletes with specific goals.")}
                  </li>
                </ul>

                <h4 className="prose-subheading">{t("Aggiustamenti pratici", "Practical adjustments")}</h4>
                <p className="prose-block">
                  {t(
                    "Adatta volume e intensità in base al livello dell'atleta, al recupero disponibile e agli obiettivi. Monitora metriche semplici (RIR, PR, sonno, HR a riposo) per guidare le modifiche.",
                    "Adjust volume and intensity to the athlete's level, available recovery and goals. Track simple metrics (RIR, PRs, sleep, resting HR) to guide changes."
                  )}
                </p>

                <h4 className="prose-subheading">{t("Esempio di microciclo", "Microcycle example")}</h4>
                <p className="prose-block mb-4">
                  {t(
                    "Per un praticante intermedio: Lunedì (Forza specifica), Martedì (Skill + recupero attivo), Mercoledì (Ipertrofia), Giovedì (Riposo o mobilità), Venerdì (Forza), Sabato (Sessione leggera / skill), Domenica (Riposo).",
                    "For an intermediate: Monday (Specific strength), Tuesday (Skills + active recovery), Wednesday (Hypertrophy), Thursday (Rest or mobility), Friday (Strength), Saturday (Light session / skills), Sunday (Rest)."
                  )}
                </p>

                <p className="prose-block">
                  {t(
                    "Ricorda: la programmazione più efficace è quella che puoi sostenere nel tempo. Sii flessibile, registra i progressi e adatta il piano in base alla risposta del corpo.",
                    "Remember: the most effective programming is the one you can sustain over time. Stay flexible, log progress and adapt the plan to your body's response."
                  )}
                </p>
              </ProseCard>
            </GuideBlock>

            <GuideBlock id="strategie-recupero" eyebrow={t("07 — Recupero", "07 — Recovery")} title={t("Strategie di recupero", "Recovery strategies")} accent="amber">
              <ProseCard>
                <h3 className="text-base font-bold tracking-tight text-zinc-900 dark:text-white mb-4">{t("Recupero", "Recovery")}</h3>
                <p className="prose-block mb-4">
                  {t(
                    "Il ritorno dei sistemi fisiologici ai valori base, con conseguente ripristino delle prestazioni atletiche o almeno a livelli sufficienti per continuare gli allenamenti. Il recupero aiuta il tuo corpo a raggiungere uno stato di riposo.",
                    "The return of physiological systems to baseline, restoring athletic performance at least to levels that let you keep training. Recovery helps your body reach a resting state."
                  )}
                </p>

                <h4 className="prose-subheading">{t("Gerarchia di recupero primaria", "Primary recovery hierarchy")}</h4>
                <p className="prose-block">
                  {t(
                    "Si riferisce ai fattori fondamentali e prioritari che influenzano la capacità del corpo di riprendersi efficacemente dagli stimoli dell'allenamento. Senza questi elementi di base, qualsiasi altra strategia di recupero avrà un impatto limitato.",
                    "These are the fundamental, priority factors affecting the body's ability to recover effectively from training stimuli. Without these basics, any other recovery strategy has limited impact."
                  )}
                </p>

                <h4 className="prose-subheading">{t("I tre pilastri", "The three pillars")}</h4>
                <ul className="prose-list">
                  <li>
                    <strong className="text-zinc-800 dark:text-zinc-200">{t("Sonno", "Sleep")}</strong>{t(": il fattore più critico per il recupero muscolare, ormonale e cognitivo. Puntare a 7-9 ore di sonno di qualità e regolarità.", ": the most critical factor for muscular, hormonal and cognitive recovery. Aim for 7-9 hours of quality, regular sleep.")}
                  </li>
                  <li>
                    <strong className="text-zinc-800 dark:text-zinc-200">{t("Nutrizione", "Nutrition")}</strong> {t("(apporto calorico e macronutrienti): mangiare abbastanza calorie, proteine adeguate, carboidrati per il reintegro del glicogeno e idratazione.", "(calories and macronutrients): eat enough calories, adequate protein, carbs to replenish glycogen, and hydration.")}
                  </li>
                  <li>
                    <strong className="text-zinc-800 dark:text-zinc-200">{t("Gestione dello stress e stile di vita", "Stress management and lifestyle")}</strong>{" "}
                    {t(
                      "cortisolo cronico elevato compromette recupero; tecniche come meditazione, respirazione e attività ricreative aiutano.",
                      "chronically high cortisol impairs recovery; techniques like meditation, breathing and recreational activities help."
                    )}
                  </li>
                </ul>

                <h4 className="prose-subheading">{t("Segnali che indicano bisogno di riposo", "Signs you need rest")}</h4>
                <p className="prose-block mb-4">
                  {t(
                    "I segnali fisici e mentali che il tuo corpo invia quando ha bisogno di recuperare: cali di performance, dolori articolari persistenti, affaticamento prolungato, aumento della frequenza cardiaca a riposo, sonno disturbato, perdita di motivazione, irritabilità e difficoltà di concentrazione.",
                    "The physical and mental signals your body sends when it needs to recover: performance drops, persistent joint pain, prolonged fatigue, higher resting heart rate, disturbed sleep, lost motivation, irritability and trouble concentrating."
                  )}
                </p>

                <h4 className="prose-subheading">{t("Cosa fare", "What to do")}</h4>
                <ul className="prose-list">
                  <li>{t("Riposo completo: 2-3 giorni di stop totale se necessario.", "Full rest: 2-3 days of total stop if needed.")}</li>
                  <li>{t("Settimana di scarico: ridurre volume/intensità per 5-7 giorni.", "Deload week: reduce volume/intensity for 5-7 days.")}</li>
                  <li>{t("Priorità al recupero: sonno, alimentazione e idratazione.", "Recovery first: sleep, nutrition and hydration.")}</li>
                </ul>
              </ProseCard>
            </GuideBlock>

            <GuideBlock id="macronutrienti" eyebrow={t("08 — Alimentazione", "08 — Nutrition")} title={t("Alimentazione", "Nutrition")} accent="emerald">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MacroCard icon={<Beef size={22} />} title={t("Proteine", "Protein")}>
                  {t("Essenziali per la costruzione muscolare. Target: 2g per kg di peso.", "Essential for muscle building. Target: 2g per kg of weight.")}
                </MacroCard>
                <MacroCard icon={<Apple size={22} />} title={t("Carboidrati", "Carbs")}>
                  {t("La fonte primaria di energia.", "The primary energy source.")}
                </MacroCard>
                <MacroCard icon={<Droplets size={22} />} title={t("Grassi", "Fats")}>
                  {t("Vitali per la produzione ormonale.", "Vital for hormone production.")}
                </MacroCard>
              </div>

              <div className="mt-4">
                <ProseCard>
                  <h3 className="text-base font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
                    {t("I macronutrienti", "Macronutrients")}
                  </h3>
                  <p className="prose-block mb-4">
                    {t(
                      "I macronutrienti sono i componenti fondamentali della dieta di cui il corpo ha bisogno in grandi quantità per produrre energia e sostenere le funzioni vitali. La dieta nel Calisthenics si concentra sull'ottimizzazione dell'assunzione di questi nutrienti per massimizzare la performance, favorire la crescita muscolare e mantenere un peso corporeo ottimale.",
                      "Macronutrients are the fundamental diet components the body needs in large amounts to produce energy and sustain vital functions. The Calisthenics diet focuses on optimizing these nutrients to maximize performance, support muscle growth and maintain optimal body weight."
                    )}
                  </p>

                  <h4 className="prose-subheading">{t("Cosa sono i macronutrienti", "What macronutrients are")}</h4>
                  <ul className="prose-list">
                    <li>
                      <strong className="text-zinc-800 dark:text-zinc-200">{t("Carboidrati", "Carbs")}</strong>{t(": sono la fonte primaria di energia del corpo. Vengono scomposti in glucosio, che alimenta il cervello e i muscoli durante l'attività fisica.", ": the body's primary energy source. They break down into glucose, which fuels the brain and muscles during physical activity.")}
                    </li>
                    <li>
                      <strong className="text-zinc-800 dark:text-zinc-200">{t("Proteine", "Protein")}</strong>{t(": essenziali per la costruzione, il mantenimento e la riparazione dei tessuti muscolari, un aspetto cruciale nel Calisthenics. Sono composte da amminoacidi, alcuni dei quali sono essenziali e devono essere assunti tramite l'alimentazione.", ": essential for building, maintaining and repairing muscle tissue, crucial in Calisthenics. They are made of amino acids, some essential and to be taken through food.")}
                    </li>
                    <li>
                      <strong className="text-zinc-800 dark:text-zinc-200">{t("Grassi", "Fats")}</strong>{t(": forniscono una fonte di energia a lungo termine, sono necessari per l'assorbimento delle vitamine liposolubili e sono vitali per la produzione di ormoni e la salute cellulare.", ": provide long-term energy, are needed to absorb fat-soluble vitamins, and are vital for hormone production and cell health.")}
                    </li>
                  </ul>

                  <h4 className="prose-subheading">{t("Fasi: Massa e Definizione", "Phases: Bulk and Cut")}</h4>
                  <p className="prose-block mb-4">
                    {t(
                      "Le fasi di massa e definizione sono due approcci nutrizionali distinti, che si differenziano principalmente per il bilancio calorico al fine di ottimizzare la composizione corporea.",
                      "Bulking and cutting are two distinct nutritional approaches, differing mainly in calorie balance to optimize body composition."
                    )}
                  </p>

                  <h4 className="prose-subheading">{t("Fase di massa", "Bulking phase")}</h4>
                  <ul className="prose-list">
                    <li>
                      <strong className="text-zinc-800 dark:text-zinc-200">{t("Bilancio calorico", "Calorie balance")}</strong>{t(": periodo di surplus calorico (250-500 kcal sopra il mantenimento) per favorire crescita muscolare minimizzando l'accumulo di grasso.", ": calorie surplus period (250-500 kcal above maintenance) to support muscle growth while minimizing fat gain.")}
                    </li>
                    <li>
                      <strong className="text-zinc-800 dark:text-zinc-200">{t("Macronutrienti", "Macronutrients")}</strong>{t(": proteine (25-30% delle calorie o ~2 g/kg), carboidrati (55-60%), grassi (15-20%).", ": protein (25-30% of calories or ~2 g/kg), carbs (55-60%), fats (15-20%).")}
                    </li>
                    <li>
                      <strong className="text-zinc-800 dark:text-zinc-200">{t("Durata", "Duration")}</strong>{t(": tipicamente 3-6 mesi, variabile in base agli obiettivi.", ": typically 3-6 months, depending on goals.")}
                    </li>
                  </ul>

                  <h4 className="prose-subheading">{t("Fase di definizione", "Cutting phase")}</h4>
                  <ul className="prose-list">
                    <li>
                      <strong className="text-zinc-800 dark:text-zinc-200">{t("Bilancio calorico", "Calorie balance")}</strong>{t(": periodo di deficit calorico (250-500 kcal sotto il mantenimento) per ridurre il grasso conservando massa muscolare.", ": calorie deficit period (250-500 kcal below maintenance) to lose fat while keeping muscle.")}
                    </li>
                    <li>
                      <strong className="text-zinc-800 dark:text-zinc-200">{t("Macronutrienti", "Macronutrients")}</strong>{t(": proteine prioritarie (~2 g/kg) per preservare il muscolo; carboidrati ridotti ma sufficienti per allenarsi; grassi mantenuti nel range 15-25%.", ": priority protein (~2 g/kg) to preserve muscle; reduced but sufficient carbs to train; fats kept at 15-25%.")}
                    </li>
                    <li>
                      <strong className="text-zinc-800 dark:text-zinc-200">{t("Durata", "Duration")}</strong>{t(": tipicamente 8-12 settimane o fino al raggiungimento dell'obiettivo di composizione corporea.", ": typically 8-12 weeks or until the body-composition goal is reached.")}
                    </li>
                  </ul>

                  <h4 className="prose-subheading">{t("Principi pratici", "Practical principles")}</h4>
                  <ul className="prose-list">
                    <li>
                      <strong className="text-zinc-800 dark:text-zinc-200">{t("Fabbisogno calorico adeguato", "Adequate calorie intake")}</strong>{t(": consuma sufficienti calorie per sostenere allenamenti intensi e recupero; usa un leggero surplus per la massa.", ": eat enough calories to sustain hard training and recovery; use a slight surplus for bulking.")}
                    </li>
                    <li>
                      <strong className="text-zinc-800 dark:text-zinc-200">{t("Elevato apporto proteico", "High protein intake")}</strong>{t(": fondamentale per riparazione e crescita muscolare.", ": key for muscle repair and growth.")}
                    </li>
                    <li>
                      <strong className="text-zinc-800 dark:text-zinc-200">{t("Carboidrati come carburante", "Carbs as fuel")}</strong>{t(": prioritari prima e dopo l'allenamento per performance e reintegro del glicogeno.", ": priority before and after training for performance and glycogen replenishment.")}
                    </li>
                    <li>
                      <strong className="text-zinc-800 dark:text-zinc-200">{t("Grassi salutari", "Healthy fats")}</strong>{t(": non eliminarli; supportano funzioni ormonali e cellulari.", ": don't cut them; they support hormonal and cellular functions.")}
                    </li>
                    <li>
                      <strong className="text-zinc-800 dark:text-zinc-200">{t("Idratazione e qualità degli alimenti", "Hydration and food quality")}</strong>{" "}
                      {t("privilegiare cibi integrali, non processati, ricchi di micronutrienti.", "favor whole, unprocessed, micronutrient-rich foods.")}
                    </li>
                  </ul>

                  <p className="prose-block">
                    {t(
                      "Oscillazioni estreme tra fase di massa e definizione sono sconsigliate. Pianifica cambiamenti graduali e monitora performance, energia e recupero per adattare la dieta al tuo allenamento nel Calisthenics.",
                      "Extreme swings between bulking and cutting are discouraged. Plan gradual changes and track performance, energy and recovery to adapt your diet to Calisthenics training."
                    )}
                  </p>
                </ProseCard>
              </div>
            </GuideBlock>

            <GuideBlock id="deload" eyebrow={t("09 — Recupero", "09 — Recovery")} title={t("L'importanza dello scarico", "Why deloading matters")} accent="orange">
              <ProseCard>
                <p className="prose-block mb-4">
                  {t(
                    "Lo scarico consiste in un breve periodo in cui si riduce intenzionalmente il volume e/o l'intensità dell'allenamento. L'obiettivo non è migliorare in quella settimana, ma permettere al corpo di recuperare completamente dagli stress accumulati nelle settimane precedenti, prevenendo il sovrallenamento e gli infortuni.",
                    "Deloading is a short period where you intentionally reduce training volume and/or intensity. The goal isn't to improve that week, but to let the body fully recover from accumulated stress, preventing overtraining and injuries."
                  )}
                </p>

                <h4 className="prose-subheading">{t("A cosa serve lo scarico nel Calisthenics?", "What is deloading for in Calisthenics?")}</h4>
                <p className="prose-block">
                  {t(
                    "Il principio guida è che i muscoli crescono e diventano più forti durante il riposo, non durante l'allenamento. Lo scarico permette il recupero del sistema nervoso centrale, il riposo articolare e tendineo, la supercompensazione e la prevenzione degli infortuni.",
                    "The guiding principle is that muscles grow and get stronger during rest, not during training. Deloading allows central nervous system recovery, joint and tendon rest, supercompensation and injury prevention."
                  )}
                </p>

                <h4 className="prose-subheading">{t("Tipi di scarico", "Deload types")}</h4>
                <p className="prose-block mb-4">
                  <strong className="text-zinc-800 dark:text-zinc-200">{t("Scarico programmato", "Planned deload")}</strong>{t(": pianificazione anticipata (es. una settimana ogni 4/6/8 settimane). Vantaggi: struttura e prevedibilità. Svantaggi: potrebbe non coincidere con il reale bisogno corporeo.", ": planned in advance (e.g. one week every 4/6/8 weeks). Pros: structure and predictability. Cons: it may not match your body's real needs.")}
                </p>
                <p className="prose-block">
                  <strong className="text-zinc-800 dark:text-zinc-200">{t("Scarico intuitivo", "Intuitive deload")}</strong>{t(": basato sull'ascolto del corpo e segnali di fatica. Vantaggi: personalizzazione; svantaggi: richiede esperienza e disciplina.", ": based on listening to your body and fatigue signals. Pros: personalization; cons: it takes experience and discipline.")}
                </p>

                <h4 className="prose-subheading">{t("Come eseguire uno scarico efficace", "How to run an effective deload")}</h4>
                <ul className="prose-list">
                  <li>
                    <strong className="text-zinc-800 dark:text-zinc-200">{t("Riduzione del volume", "Lower volume")}</strong>{t(": mantenere gli esercizi ma diminuire serie/ripetizioni.", ": keep the exercises but cut sets/reps.")}
                  </li>
                  <li>
                    <strong className="text-zinc-800 dark:text-zinc-200">{t("Riduzione dell'intensità", "Lower intensity")}</strong>{t(": usare progressioni più facili.", ": use easier progressions.")}
                  </li>
                  <li>
                    <strong className="text-zinc-800 dark:text-zinc-200">{t("Aumento dei tempi di recupero", "Longer rests")}</strong>{t(": pause più lunghe tra le serie.", ": longer breaks between sets.")}
                  </li>
                  <li>
                    <strong className="text-zinc-800 dark:text-zinc-200">{t("Frequenza ridotta", "Lower frequency")}</strong>{t(": allenarsi meno volte nella settimana di scarico.", ": train fewer times in the deload week.")}
                  </li>
                </ul>

                <p className="prose-block">
                  {t(
                    "Inserire regolarmente lo scarico nel programma è la chiave per una progressione sostenibile a lungo termine, permettendo di sviluppare forza e padroneggiare nuove skill senza esaurire il corpo.",
                    "Regularly scheduling deloads is the key to sustainable long-term progression, letting you build strength and master new skills without burning out."
                  )}
                </p>
              </ProseCard>
            </GuideBlock>

            <div className="pt-24">
              <div className="card flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <p className="eyebrow">{t("Prossimo passo", "Next step")}</p>
                  <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white mt-2">
                    {t("Pronto a mettere in pratica?", "Ready to put it into practice?")}
                  </h2>
                  <p className="body-copy text-sm mt-2 max-w-md">
                    {t(
                      "Scegli il protocollo che risponde al tuo livello e inizia dalla prima lezione.",
                      "Choose the protocol that matches your level and start from lesson one."
                    )}
                  </p>
                </div>
                <Button to="/programs" size="lg" className="shrink-0">
                  {t("Vedi i programmi", "See programs")}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Guide;