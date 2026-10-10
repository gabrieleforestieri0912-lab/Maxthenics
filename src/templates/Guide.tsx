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

interface Subsection {
  id: string;
  title: string;
  accent: Accent;
}

interface GuideSection {
  id: string;
  title: string;
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
    title: "Introduzione",
    icon: <BookOpen className="w-4 h-4" />,
    accent: "red",
    subsections: [{ id: "introduction", title: "Benvenuto", accent: "red" }],
  },
  {
    id: "concetti-base",
    title: "Concetti Base",
    icon: <Target className="w-4 h-4" />,
    accent: "red",
    subsections: [
      { id: "concetti-base", title: "Panoramica", accent: "red" },
      { id: "intensita-volume", title: "Intensità e volume", accent: "amber" },
    ],
  },
  {
    id: "scienza",
    title: "Scienza",
    icon: <Brain className="w-4 h-4" />,
    accent: "cyan",
    subsections: [
      { id: "formula-forza", title: "Formula della forza", accent: "cyan" },
      { id: "percorsi-ipertrofia", title: "Ipertrofia", accent: "rose" },
    ],
  },
  {
    id: "programmazione",
    title: "Programmazione",
    icon: <Target className="w-4 h-4" />,
    accent: "violet",
    subsections: [
      { id: "programmazione-allenamento", title: "Programmazione", accent: "violet" },
    ],
  },
  {
    id: "alimentazione",
    title: "Alimentazione",
    icon: <Apple className="w-4 h-4" />,
    accent: "emerald",
    subsections: [{ id: "macronutrienti", title: "Macronutrienti", accent: "emerald" }],
  },
  {
    id: "recupero",
    title: "Recupero",
    icon: <Timer className="w-4 h-4" />,
    accent: "orange",
    subsections: [
      { id: "strategie-recupero", title: "Strategie di recupero", accent: "amber" },
      { id: "deload", title: "Importanza dello scarico", accent: "orange" },
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
      <h3 className="text-base font-bold tracking-tight text-white mb-3">{title}</h3>
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
      <p className="text-lg md:text-xl font-bold text-white leading-snug">{children}</p>
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
        title="Guida Calisthenics"
        description="Guida completa al calisthenics: tecniche, progressioni, esercizi e programmi per principianti e atleti avanzati. Impara Front Lever, Planche e molto altro."
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
            <div className="flex items-center justify-between px-5 h-16 border-b border-white/10 shrink-0">
              <span className="meta-mono text-red-500">Guida</span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Chiudi indice"
                className="text-zinc-500 hover:text-white transition-colors p-1"
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
                            : "text-zinc-400 hover:text-white hover:bg-white/5 border-transparent"
                        }`}
                      >
                        <span className={sectionActive ? sa.icon : "text-zinc-600"}>
                          {section.icon}
                        </span>
                        <span className="truncate">{section.title}</span>
                      </button>
                      <ul className="ml-4 mt-1 space-y-0.5 border-l border-white/10 pl-3">
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
                                <span className="truncate block">{sub.title}</span>
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

            <div className="p-4 border-t border-white/10 shrink-0">
              <Button to="/programs" size="sm" className="w-full">
                Vedi i programmi
                <ChevronRight className="w-4 h-4" aria-hidden />
              </Button>
            </div>
          </div>
        </aside>

        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Apri indice"
            className="fixed top-24 left-4 z-40 p-2.5 rounded-xl bg-zinc-900/90 backdrop-blur-sm border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shadow-xl"
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
              <p className="eyebrow">Education Hub</p>
              <h1 className="page-title mt-3 text-4xl md:text-6xl">
                Domina il tuo corpo.
              </h1>
              <p className="body-copy mt-5 text-lg">
                Benvenuto nella guida definitiva. Qui imparerai come trasformare la gravità
                nel tuo miglior alleato, costruendo una forza che non avresti mai pensato di
                possedere.
              </p>
            </motion.header>

            <GuideBlock id="introduction" eyebrow="01 — Fondamenti" title="Introduzione">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ConceptCard icon={<BookOpen size={20} />} title="Cos'è il Calisthenics?">
                  Il Calisthenics è l'arte dell'allenamento a corpo libero. Deriva dalle parole
                  greche 'Kalos' (bellezza) e 'Sthenos' (forza).
                </ConceptCard>
                <ConceptCard icon={<Target size={20} />} title="I Pilastri della Forza">
                  Si basa su movimenti multi-articolari fondamentali: Trazioni, Piegamenti, Dip e
                  Squat.
                </ConceptCard>
              </div>
            </GuideBlock>

            <GuideBlock id="concetti-base" eyebrow="02 — Foundations" title="Concetti Base">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ConceptCard icon={<Activity size={20} />} title="Fitness">
                  Il fitness è un effetto positivo sul corpo causato dall'allenamento.
                </ConceptCard>
                <ConceptCard icon={<Info size={20} />} title="Affaticamento">
                  L'affaticamento è un effetto negativo sul corpo.
                </ConceptCard>
                <ConceptCard icon={<Award size={20} />} title="Performance">
                  La performance è il modo in cui un'attività sportiva viene svolta.
                </ConceptCard>
              </div>

              <div className="mt-4">
                <p className="meta-mono mb-3">Regola d'Oro</p>
                <Highlight>
                  "Allenati nel modo più specifico possibile, il più intensamente possibile e il
                  più frequentemente possibile."
                </Highlight>
              </div>
            </GuideBlock>

            <GuideBlock id="intensita-volume" eyebrow="03 — Intensity" title="Intensità e Volume" accent="amber">
              <ProseCard>
                <h3 className="text-base font-bold tracking-tight text-white mb-4">
                  Intensità
                </h3>
                <p className="prose-block mb-4">
                  L'intensità definisce la misura di quanto duramente ci si deve allenare. Nel
                  Calisthenics l'intensità si misura in base a quanto ci si avvicina al cedimento
                  muscolare o tecnico in ogni serie.
                </p>
                <p className="prose-block mb-4">
                  Per ottenere progressi continui ci si deve allenare con un'intensità
                  sufficientemente alta da stimolare un adattamento, ma sufficientemente bassa da
                  permettere un recupero efficace.
                </p>

                <h4 className="prose-subheading">
                  Il Concetto di RIR (Reps In Reserve — Ripetizioni di Riserva)
                </h4>
                <ul className="prose-list">
                  <li>
                    <strong className="text-zinc-200">RIR 3-4:</strong> ti fermi avendo ancora 3 o 4
                    ripetizioni di riserva. Intensità bassa/moderata.
                  </li>
                  <li>
                    <strong className="text-zinc-200">RIR 1-2:</strong> ti fermi avendo ancora 1 o 2
                    ripetizioni di riserva. Intensità alta.
                  </li>
                  <li>
                    <strong className="text-zinc-200">RIR 0:</strong> arrivi al cedimento tecnico.
                    Intensità massima.
                  </li>
                </ul>
                <p className="prose-block">
                  Allenati duramente entro i limiti della corretta esecuzione (RIR 1-2, fermandosi
                  al cedimento tecnico) per massimizzare lo stimolo riducendo la fatica eccessiva.
                </p>

                <h3 className="prose-subheading">Quanto duramente ti devi allenare</h3>
                <p className="prose-block mb-4">
                  Qualunque cosa decidi di allenare assicurati che la puoi ripetere nella
                  sessione successiva e migliora nella prossima settimana sbloccando più
                  ripetizioni, più tempo in isometria o tecnica migliore.
                </p>
                <p className="prose-block mb-4">
                  Per la maggior parte degli allenamenti, l'intensità ottimale si trova nella zona RIR
                  1-2.
                </p>
                <ul className="prose-list">
                  <li>
                    <strong className="text-zinc-200">Per la crescita muscolare e la forza:</strong>{" "}
                    le serie vicino al cedimento (RIR 1-2) sono le più efficaci.
                  </li>
                  <li>
                    <strong className="text-zinc-200">Per l'apprendimento delle skills:</strong>{" "}
                    allenarsi a RIR 2-3 o più alto per preservare la tecnica.
                  </li>
                  <li>
                    <strong className="text-zinc-200">Evitare il cedimento assoluto:</strong> il
                    cedimento tecnico è preferibile rispetto al cedimento muscolare totale nella
                    maggior parte dei casi.
                  </li>
                </ul>

                <h4 className="prose-subheading">
                  Regole per capire se ti alleni abbastanza duramente
                </h4>
                <ul className="prose-list">
                  <li>Le ultime ripetizioni sono sforzate e più lente delle prime.</li>
                  <li>Usi il sovraccarico progressivo nel tempo.</li>
                  <li>Non sacrifichi la tecnica per completare ripetizioni extra.</li>
                </ul>
              </ProseCard>
            </GuideBlock>

            <GuideBlock id="formula-forza" eyebrow="04 — Science" title="Principi di Forza" accent="cyan">
              <ProseCard>
                <h3 className="text-base font-bold tracking-tight text-white mb-4">Formula</h3>
                <p className="text-xl md:text-2xl font-bold text-white mb-6 leading-snug">
                  FORZA ={" "}
                  <span className="text-cyan-500">ADATTAMENTI NEURALI</span> × AREA DELLA
                  SEZIONE TRASVERSALE (CSA)
                </p>

                <h4 className="prose-subheading">Adattamenti neurali</h4>
                <p className="prose-block mb-3">
                  Gli adattamenti neurali sono cambiamenti nell'efficienza con cui il cervello e il
                  sistema nervoso controllano e attivano i muscoli. Rappresentano la capacità del
                  corpo di usare meglio i muscoli che ha già.
                </p>
                <ul className="prose-list">
                  <li>Miglior reclutamento delle unità motorie</li>
                  <li>Aumento della sincronizzazione</li>
                  <li>Migliore coordinazione inter e intramuscolare</li>
                  <li>Riduzione dell'inibizione autogena</li>
                </ul>

                <h4 className="prose-subheading">Area della sezione del muscolo (CSA)</h4>
                <p className="prose-block">
                  La CSA è la dimensione fisica del muscolo. Generalmente maggiore CSA = maggiore
                  potenziale di generare forza. L'ipertrofia aumenta la CSA.
                </p>

                <h4 className="prose-subheading">Principio SAID e Sovraccarico Progressivo</h4>
                <p className="prose-block mb-3">
                  Il principio SAID afferma che il corpo si adatta specificamente allo stimolo
                  ricevuto. Il sovraccarico progressivo è la chiave per continuare a migliorare:
                  aumentare ripetizioni, difficoltà, densità o aggiungere zavorre nel tempo.
                </p>
                <ul className="prose-list">
                  <li>Aumento delle ripetizioni</li>
                  <li>Aumento della difficoltà dell'esercizio (progressioni)</li>
                  <li>Manipolazione delle leve</li>
                  <li>Aumento della densità e aggiunta di zavorre</li>
                </ul>

                <h4 className="prose-subheading">Unità motorie e reclutamento</h4>
                <p className="prose-block">
                  Le unità motorie sono composte da un motoneurone e dalle fibre che innerva. Il
                  reclutamento segue il principio delle dimensioni di Henneman: dalle unità più
                  piccole a quelle più grandi in base alla richiesta di forza.
                </p>
              </ProseCard>
            </GuideBlock>

            <GuideBlock id="percorsi-ipertrofia" eyebrow="05 — Hypertrophy" title="Percorsi dell'ipertrofia" accent="rose">
              <ProseCard>
                <h3 className="text-base font-bold tracking-tight text-white mb-4">
                  Tensione meccanica
                </h3>
                <p className="prose-block mb-4">
                  La tensione meccanica è la forza che le fibre muscolari sperimentano quando si
                  contraggono contro una resistenza. Avvia processi che portano all'ipertrofia:
                  attivazione dei meccanocettori, micro-traumi e aumento della sintesi proteica.
                </p>
                <h4 className="prose-subheading">Fattori chiave</h4>
                <ul className="prose-list">
                  <li>Carico progressivo (progressioni, zavorre)</li>
                  <li>Tempo sotto tensione (eccentrica controllata, pause isometriche)</li>
                  <li>Gamma di movimento completa</li>
                  <li>Connessione mente-muscolo</li>
                </ul>

                <h3 className="prose-subheading">Danno muscolare eccentrico</h3>
                <p className="prose-block mb-4">
                  La fase eccentrica genera micro-lacerazioni che innescano una risposta
                  infiammatoria, attivano cellule satellite e aumentano la sintesi proteica,
                  portando alla supercompensazione e all'ipertrofia.
                </p>
                <p className="prose-block">
                  Pratiche utili: eccentrica controllata, negative e introduzione graduale di
                  sovraccarico.
                </p>

                <h3 className="prose-subheading">Accumulazione metabolica</h3>
                <p className="prose-block mb-4">
                  L'accumulo di metaboliti (es. lattato) contribuisce alla crescita tramite maggiore
                  reclutamento, rilascio ormonale e aumento della sintesi proteica. Si ottiene con
                  serie ad alte ripetizioni, brevi recuperi, superset e circuiti.
                </p>
                <p className="prose-block">
                  Tecniche pratiche: serie ad alte ripetizioni, EMOM, rest-pause, superset e
                  mantenere la tensione costante evitando lo slancio.
                </p>
              </ProseCard>
            </GuideBlock>

            <GuideBlock
              id="programmazione-allenamento"
              eyebrow="06 — Programming"
              title="Programmazione dell'allenamento"
              accent="violet"
            >
              <ProseCard>
                <h3 className="text-base font-bold tracking-tight text-white mb-4">
                  Split di allenamento
                </h3>
                <p className="prose-block mb-4">
                  Lo split definisce come distribuisci il lavoro settimanale tra gruppi muscolari e
                  schemi di movimento. Nel Calisthenics si preferisce spesso organizzare le
                  sessioni per pattern motori e priorità di skill piuttosto che per singolo
                  muscolo.
                </p>

                <h4 className="prose-subheading">Tipologie di split</h4>
                <ul className="prose-list mb-6">
                  <li>
                    <strong className="text-zinc-200">Push / Pull / Legs (PPL)</strong> — adatto a
                    3–6 sessioni/settimana; buono per gestire volume e recupero.
                  </li>
                  <li>
                    <strong className="text-zinc-200">Full Body</strong> — ideale per principianti o
                    2–3 sessioni/settimana; alta frequenza, basso volume per sessione.
                  </li>
                  <li>
                    <strong className="text-zinc-200">Upper / Lower</strong> — pratica per 4
                    sessioni/settimana; equilibrata per forza e volume.
                  </li>
                  <li>
                    <strong className="text-zinc-200">
                      Split per skill (es. braccia tese / braccia piegate)
                    </strong>{" "}
                    — utile quando si lavora molto sulle progressioni specifiche delle skill.
                  </li>
                </ul>

                <h3 className="prose-subheading">Periodizzazione</h3>
                <p className="prose-block mb-4">
                  La periodizzazione organizza il training in fasi con obiettivi diversi (accumulo,
                  intensificazione, picco) per massimizzare adattamenti e minimizzare il rischio di
                  plateau e overtraining.
                </p>

                <h4 className="prose-subheading">Modelli di periodizzazione</h4>
                <ul className="prose-list">
                  <li>
                    <strong className="text-zinc-200">Lineare</strong>: aumenta l'intensità
                    riducendo il volume con il tempo; semplice e adatto ai principianti.
                  </li>
                  <li>
                    <strong className="text-zinc-200">Ondulata</strong>: varia volume e intensità più
                    frequentemente (giornalmente o settimanalmente); efficace per livelli
                    intermedi/avanzati.
                  </li>
                  <li>
                    <strong className="text-zinc-200">A blocchi</strong>: mesocicli con obiettivi
                    chiari (es. accumulo → intensificazione → picco); ottimo per atleti con obiettivi
                    specifici.
                  </li>
                </ul>

                <h4 className="prose-subheading">Aggiustamenti pratici</h4>
                <p className="prose-block">
                  Adatta volume e intensità in base al livello dell'atleta, al recupero disponibile e
                  agli obiettivi. Monitora metriche semplici (RIR, PR, sonno, HR a riposo) per
                  guidare le modifiche.
                </p>

                <h4 className="prose-subheading">Esempio di microciclo</h4>
                <p className="prose-block mb-4">
                  Per un praticante intermedio: Lunedì (Forza specifica), Martedì (Skill + recupero
                  attivo), Mercoledì (Ipertrofia), Giovedì (Riposo o mobilità), Venerdì (Forza),
                  Sabato (Sessione leggera / skill), Domenica (Riposo).
                </p>

                <p className="prose-block">
                  Ricorda: la programmazione più efficace è quella che puoi sostenere nel tempo. Sii
                  flessibile, registra i progressi e adatta il piano in base alla risposta del
                  corpo.
                </p>
              </ProseCard>
            </GuideBlock>

            <GuideBlock id="strategie-recupero" eyebrow="07 — Recovery" title="Strategie di recupero" accent="amber">
              <ProseCard>
                <h3 className="text-base font-bold tracking-tight text-white mb-4">Recupero</h3>
                <p className="prose-block mb-4">
                  Il ritorno dei sistemi fisiologici ai valori base, con conseguente ripristino delle
                  prestazioni atletiche o almeno a livelli sufficienti per continuare gli
                  allenamenti. Il recupero aiuta il tuo corpo a raggiungere uno stato di riposo.
                </p>

                <h4 className="prose-subheading">Gerarchia di recupero primaria</h4>
                <p className="prose-block">
                  Si riferisce ai fattori fondamentali e prioritari che influenzano la capacità
                  del corpo di riprendersi efficacemente dagli stimoli dell'allenamento. Senza questi
                  elementi di base, qualsiasi altra strategia di recupero avrà un impatto limitato.
                </p>

                <h4 className="prose-subheading">I tre pilastri</h4>
                <ul className="prose-list">
                  <li>
                    <strong className="text-zinc-200">Sonno</strong>: il fattore più critico per il
                    recupero muscolare, ormonale e cognitivo. Puntare a 7-9 ore di sonno di qualità e
                    regolarità.
                  </li>
                  <li>
                    <strong className="text-zinc-200">Nutrizione</strong> (apporto calorico e
                    macronutrienti): mangiare abbastanza calorie, proteine adeguate, carboidrati per
                    il reintegro del glicogeno e idratazione.
                  </li>
                  <li>
                    <strong className="text-zinc-200">Gestione dello stress e stile di vita</strong>:{" "}
                    cortisolo cronico elevato compromette recupero; tecniche come meditazione,
                    respirazione e attività ricreative aiutano.
                  </li>
                </ul>

                <h4 className="prose-subheading">Segnali che indicano bisogno di riposo</h4>
                <p className="prose-block mb-4">
                  I segnali fisici e mentali che il tuo corpo invia quando ha bisogno di recuperare:
                  cali di performance, dolori articolari persistenti, affaticamento prolungato,
                  aumento della frequenza cardiaca a riposo, sonno disturbato, perdita di
                  motivazione, irritabilità e difficoltà di concentrazione.
                </p>

                <h4 className="prose-subheading">Cosa fare</h4>
                <ul className="prose-list">
                  <li>Riposo completo: 2-3 giorni di stop totale se necessario.</li>
                  <li>Settimana di scarico: ridurre volume/intensità per 5-7 giorni.</li>
                  <li>Priorità al recupero: sonno, alimentazione e idratazione.</li>
                </ul>
              </ProseCard>
            </GuideBlock>

            <GuideBlock id="macronutrienti" eyebrow="08 — Nutrition" title="Alimentazione" accent="emerald">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MacroCard icon={<Beef size={22} />} title="Proteine">
                  Essenziali per la costruzione muscolare. Target: 2g per kg di peso.
                </MacroCard>
                <MacroCard icon={<Apple size={22} />} title="Carboidrati">
                  La fonte primaria di energia.
                </MacroCard>
                <MacroCard icon={<Droplets size={22} />} title="Grassi">
                  Vitali per la produzione ormonale.
                </MacroCard>
              </div>

              <div className="mt-4">
                <ProseCard>
                  <h3 className="text-base font-bold tracking-tight text-white mb-4">
                    I macronutrienti
                  </h3>
                  <p className="prose-block mb-4">
                    I macronutrienti sono i componenti fondamentali della dieta di cui il corpo ha
                    bisogno in grandi quantità per produrre energia e sostenere le funzioni vitali.
                    La dieta nel Calisthenics si concentra sull'ottimizzazione dell'assunzione di
                    questi nutrienti per massimizzare la performance, favorire la crescita muscolare
                    e mantenere un peso corporeo ottimale.
                  </p>

                  <h4 className="prose-subheading">Cosa sono i macronutrienti</h4>
                  <ul className="prose-list">
                    <li>
                      <strong className="text-zinc-200">Carboidrati</strong>: sono la fonte primaria
                      di energia del corpo. Vengono scomposti in glucosio, che alimenta il cervello e
                      i muscoli durante l'attività fisica.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Proteine</strong>: essenziali per la
                      costruzione, il mantenimento e la riparazione dei tessuti muscolari, un aspetto
                      cruciale nel Calisthenics. Sono composte da amminoacidi, alcuni dei quali
                      sono essenziali e devono essere assunti tramite l'alimentazione.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Grassi</strong>: forniscono una fonte di
                      energia a lungo termine, sono necessari per l'assorbimento delle vitamine
                      liposolubili e sono vitali per la produzione di ormoni e la salute cellulare.
                    </li>
                  </ul>

                  <h4 className="prose-subheading">Fasi: Massa e Definizione</h4>
                  <p className="prose-block mb-4">
                    Le fasi di <strong className="text-zinc-200">massa</strong> e{" "}
                    <strong className="text-zinc-200">definizione</strong> sono due approcci
                    nutrizionali distinti, che si differenziano principalmente per il bilancio
                    calorico al fine di ottimizzare la composizione corporea.
                  </p>

                  <h4 className="prose-subheading">Fase di massa</h4>
                  <ul className="prose-list">
                    <li>
                      <strong className="text-zinc-200">Bilancio calorico</strong>: periodo di{" "}
                      <em>surplus calorico</em> (250-500 kcal sopra il mantenimento) per favorire
                      crescita muscolare minimizzando l'accumulo di grasso.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Macronutrienti</strong>: proteine (25-30%
                      delle calorie o ~2 g/kg), carboidrati (55-60%), grassi (15-20%).
                    </li>
                    <li>
                      <strong className="text-zinc-200">Durata</strong>: tipicamente 3-6 mesi,
                      variabile in base agli obiettivi.
                    </li>
                  </ul>

                  <h4 className="prose-subheading">Fase di definizione</h4>
                  <ul className="prose-list">
                    <li>
                      <strong className="text-zinc-200">Bilancio calorico</strong>: periodo di{" "}
                      <em>deficit calorico</em> (250-500 kcal sotto il mantenimento) per ridurre il
                      grasso conservando massa muscolare.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Macronutrienti</strong>: proteine prioritarie
                      (~2 g/kg) per preservare il muscolo; carboidrati ridotti ma sufficienti per
                      allenarsi; grassi mantenuti nel range 15-25%.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Durata</strong>: tipicamente 8-12 settimane o
                      fino al raggiungimento dell'obiettivo di composizione corporea.
                    </li>
                  </ul>

                  <h4 className="prose-subheading">Principi pratici</h4>
                  <ul className="prose-list">
                    <li>
                      <strong className="text-zinc-200">Fabbisogno calorico adeguato</strong>: consuma
                      sufficienti calorie per sostenere allenamenti intensi e recupero; usa un
                      leggero surplus per la massa.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Elevato apporto proteico</strong>:
                      fondamentale per riparazione e crescita muscolare.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Carboidrati come carburante</strong>:
                      prioritari prima e dopo l'allenamento per performance e reintegro del
                      glicogeno.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Grassi salutari</strong>: non eliminarli;
                      supportano funzioni ormonali e cellulari.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Idratazione e qualità degli alimenti</strong>:{" "}
                      privilegiare cibi integrali, non processati, ricchi di micronutrienti.
                    </li>
                  </ul>

                  <p className="prose-block">
                    Oscillazioni estreme tra fase di massa e definizione sono sconsigliate. Pianifica
                    cambiamenti graduali e monitora performance, energia e recupero per adattare la
                    dieta al tuo allenamento nel Calisthenics.
                  </p>
                </ProseCard>
              </div>
            </GuideBlock>

            <GuideBlock id="deload" eyebrow="09 — Recovery" title="L'importanza dello scarico" accent="orange">
              <ProseCard>
                <p className="prose-block mb-4">
                  Lo scarico consiste in un breve periodo in cui si{" "}
                  <strong className="text-zinc-200">
                    riduce intenzionalmente il volume e/o l'intensità
                  </strong>{" "}
                  dell'allenamento. L'obiettivo non è migliorare in quella settimana, ma permettere
                  al corpo di recuperare completamente dagli stress accumulati nelle settimane
                  precedenti, prevenendo il sovrallenamento e gli infortuni.
                </p>

                <h4 className="prose-subheading">A cosa serve lo scarico nel Calisthenics?</h4>
                <p className="prose-block">
                  Il principio guida è che i muscoli crescono e diventano più forti durante il
                  riposo, non durante l'allenamento. Lo scarico permette il recupero del sistema
                  nervoso centrale, il riposo articolare e tendineo, la supercompensazione e la
                  prevenzione degli infortuni.
                </p>

                <h4 className="prose-subheading">Tipi di scarico</h4>
                <p className="prose-block mb-4">
                  <strong className="text-zinc-200">Scarico programmato</strong>: pianificazione
                  anticipata (es. una settimana ogni 4/6/8 settimane). Vantaggi: struttura e
                  prevedibilità. Svantaggi: potrebbe non coincidere con il reale bisogno corporeo.
                </p>
                <p className="prose-block">
                  <strong className="text-zinc-200">Scarico intuitivo</strong>: basato
                  sull'ascolto del corpo e segnali di fatica. Vantaggi: personalizzazione; svantaggi:
                  richiede esperienza e disciplina.
                </p>

                <h4 className="prose-subheading">Come eseguire uno scarico efficace</h4>
                <ul className="prose-list">
                  <li>
                    <strong className="text-zinc-200">Riduzione del volume</strong>: mantenere gli
                    esercizi ma diminuire serie/ripetizioni.
                  </li>
                  <li>
                    <strong className="text-zinc-200">Riduzione dell'intensità</strong>: usare
                    progressioni più facili.
                  </li>
                  <li>
                    <strong className="text-zinc-200">Aumento dei tempi di recupero</strong>: pause
                    più lunghe tra le serie.
                  </li>
                  <li>
                    <strong className="text-zinc-200">Frequenza ridotta</strong>: allenarsi meno volte
                    nella settimana di scarico.
                  </li>
                </ul>

                <p className="prose-block">
                  Inserire regolarmente lo scarico nel programma è la chiave per una progressione
                  sostenibile a lungo termine, permettendo di sviluppare forza e padroneggiare nuove
                  skill senza esaurire il corpo.
                </p>
              </ProseCard>
            </GuideBlock>

            <div className="pt-24">
              <div className="card flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <p className="eyebrow">Prossimo passo</p>
                  <h2 className="text-xl font-bold tracking-tight text-white mt-2">
                    Pronto a mettere in pratica?
                  </h2>
                  <p className="body-copy text-sm mt-2 max-w-md">
                    Scegli il protocollo che risponde al tuo livello e inizia dalla prima lezione.
                  </p>
                </div>
                <Button to="/programs" size="lg" className="shrink-0">
                  Vedi i programmi
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