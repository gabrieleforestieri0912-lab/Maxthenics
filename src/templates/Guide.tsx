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
} from "lucide-react";
import SEO from "../components/SEO";

interface Subsection {
  id: string;
  title: string;
}

interface GuideSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  subsections: Subsection[];
}

const Guide: React.FC = () => {
  const [activeSection, setActiveSection] = useState("introduction");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const guideSections: GuideSection[] = [
    {
      id: "intro",
      title: "Introduzione",
      icon: <BookOpen className="w-4 h-4" />,
      subsections: [{ id: "introduction", title: "Benvenuto" }],
    },
    {
      id: "concetti-base",
      title: "Concetti Base",
      icon: <Target className="w-4 h-4" />,
      subsections: [{ id: "concetti-base", title: "Panoramica" }],
    },
    {
      id: "scienza",
      title: "Scienza",
      icon: <Brain className="w-4 h-4" />,
      subsections: [{ id: "formula-forza", title: "Formula della Forza" }],
    },
    {
      id: "programmazione",
      title: "Programmazione",
      icon: <Target className="w-4 h-4" />, // Fixed duplicate icon reference or kept for simplicity
      subsections: [
        { id: "programmazione-allenamento", title: "Programmazione" },
      ],
    },
    {
      id: "alimentazione",
      title: "Alimentazione",
      icon: <Apple className="w-4 h-4" />,
      subsections: [{ id: "macronutrienti", title: "Macronutrienti" }],
    },
    {
      id: "recupero",
      title: "Recupero",
      icon: <Timer className="w-4 h-4" />,
      subsections: [
        { id: "strategie-recupero", title: "Strategie di Recupero" },
        { id: "deload", title: "Importanza dello Scarico" },
      ],
    },
  ];

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
      <div className="min-h-screen bg-black text-white flex">
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-zinc-950/95 backdrop-blur-xl border-r border-white/10 z-40 transition-all duration-300 ${isSidebarOpen ? "w-72" : "w-0 overflow-hidden"}`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-red-500 tracking-tighter">
                GUIDE
              </h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-zinc-500 hover:text-white transition-colors p-1"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto py-6 px-4">
            <ul className="space-y-6">
              {guideSections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.subsections[0].id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left font-bold uppercase text-sm tracking-wider mb-2 transition-all ${
                      activeSection === section.subsections[0].id
                        ? "bg-red-500/10 text-red-500 border border-red-500/20"
                        : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    {section.icon}
                    <span>{section.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-20 left-4 z-40 p-2 bg-zinc-900/80 backdrop-blur-sm border border-white/10 rounded-lg text-white hover:bg-zinc-800 transition-all md:hidden"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
      )}

      <main
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "md:ml-72" : ""} min-h-screen`}
      >
        <div className="max-w-5xl mx-auto px-6 lg:px-8 pt-32 pb-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-red-600 font-black tracking-[0.4em] uppercase text-[10px] mb-6 block">
              Education Hub
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85] mb-8">
              DOMINA IL TUO <br />
              <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-700">
                CORPO
              </span>
            </h1>
            <p className="text-zinc-500 text-xl font-medium leading-relaxed mb-12">
              Benvenuto nella guida definitiva. Qui imparerai come trasformare
              la gravità nel tuo miglior alleato, costruendo una forza che non
              avresti mai pensato di possedere.
            </p>
          </motion.div>

          <div id="introduction" className="mb-48">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-10 rounded-[2.5rem] bg-zinc-900/30 border border-white/10 hover:border-red-500/50 transition-all group">
                <div className="p-4 bg-zinc-950 rounded-2xl w-fit mb-8 group-hover:scale-110 transition-transform">
                  <BookOpen className="text-red-500" />
                </div>
                <h3 className="text-2xl font-bold mb-6 tracking-tight">
                  Cos&apos;è il Calisthenics?
                </h3>
                <p className="text-zinc-400 leading-relaxed font-medium">
                  Il Calisthenics è l&apos;arte dell&apos;allenamento a corpo
                  libero. Deriva dalle parole greche 'Kalos' (bellezza) e
                  'Sthenos' (forza).
                </p>
              </div>
              <div className="p-10 rounded-[2.5rem] bg-zinc-900/30 border border-white/10 hover:border-red-500/50 transition-all group">
                <div className="p-4 bg-zinc-950 rounded-2xl w-fit mb-8 group-hover:scale-110 transition-transform">
                  <Target className="text-red-500" />
                </div>
                <h3 className="text-2xl font-bold mb-6 tracking-tight">
                  I Pilastri della Forza
                </h3>
                <p className="text-zinc-400 leading-relaxed font-medium">
                  Si basa su movimenti multi-articolari fondamentali: Trazioni,
                  Piegamenti, Dip e Squat.
                </p>
              </div>
            </div>
          </div>

          <div id="concetti-base" className="mb-48">
            <div className="mb-16">
              <span className="text-red-600 font-black tracking-[0.4em] uppercase text-[10px] mb-4 block text-center">
                Foundations
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-center uppercase tracking-tighter">
                Concetti Base
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-zinc-900/40 border border-white/10 hover:border-red-500/30 transition-all group">
                <Activity className="text-red-500 mb-6 w-8 h-8 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">
                  Fitness
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Il fitness è un effetto positivo sul corpo causato
                  dall'allenamento.
                </p>
              </div>
              <div className="p-8 rounded-3xl bg-zinc-900/40 border border-white/10 hover:border-red-500/30 transition-all group">
                <Info className="text-red-500 mb-6 w-8 h-8 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">
                  Affaticamento
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  L'affaticamento è un effetto negativo sul corpo.
                </p>
              </div>
              <div className="p-8 rounded-3xl bg-zinc-900/40 border border-white/10 hover:border-red-500/30 transition-all group">
                <Award className="text-red-500 mb-6 w-8 h-8 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">
                  Performance
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  La performance è il modo in cui un'attività sportiva viene
                  svolta.
                </p>
              </div>
            </div>
            <div className="mt-16 p-10 rounded-[2.5rem] bg-linear-to-br from-red-600/20 to-zinc-900/40 border border-red-500/20">
              <h3 className="text-3xl font-black mb-6 uppercase tracking-tighter text-red-500">
                Regola d'Oro
              </h3>
              <p className="text-xl md:text-3xl font-bold text-white leading-tight italic">
                "Allenati nel modo più specifico possibile, il più intensamente
                possibile e il più frequentemente possibile."
              </p>
            </div>
          </div>

          <div id="intensita-volume" className="mb-48">
            <div className="mb-16">
              <span className="text-amber-500 font-black tracking-[0.4em] uppercase text-[10px] mb-4 block text-center">
                Intensity
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-center uppercase tracking-tighter">
                Intensità e Volume
              </h2>
            </div>
            <div className="p-10 rounded-[2.5rem] bg-zinc-900/40 border border-white/10">
              <h3 className="text-3xl font-black mb-6 uppercase tracking-tighter text-amber-400">
                Intensità
              </h3>
              <p className="text-zinc-300 leading-relaxed mb-4">
                L'intensità definisce la misura di quanto duramente ci si deve
                allenare. Nel Calisthenics l'intensità si misura in base a
                quanto ci si avvicina al cedimento muscolare o tecnico in ogni
                serie.
              </p>
              <p className="text-zinc-300 leading-relaxed mb-4">
                Per ottenere progressi continui ci si deve allenare con
                un'intensità sufficientemente alta da stimolare un adattamento,
                ma sufficientemente bassa da permettere un recupero efficace.
              </p>
              <h4 className="text-xl font-bold text-white mb-3">
                Il Concetto di RIR (Reps In Reserve - Ripetizioni di Riserva)
              </h4>
              <ul className="list-disc list-inside text-zinc-400 mb-4">
                <li>
                  <strong>RIR 3-4:</strong> Ti fermi avendo ancora 3 o 4
                  ripetizioni di riserva. Intensità bassa/moderata.
                </li>
                <li>
                  <strong>RIR 1-2:</strong> Ti fermi avendo ancora 1 o 2
                  ripetizioni di riserva. Intensità alta.
                </li>
                <li>
                  <strong>RIR 0:</strong> Arrivi al cedimento tecnico. Intensità
                  massima.
                </li>
              </ul>
              <p className="text-zinc-300 leading-relaxed">
                Allenati duramente entro i limiti della corretta esecuzione (RIR
                1-2, fermandosi al cedimento tecnico) per massimizzare lo
                stimolo riducendo la fatica eccessiva.
              </p>

              <h3 className="text-3xl font-black mt-8 mb-6 uppercase tracking-tighter text-amber-400">
                Quanto duramente ti devi allenare
              </h3>
              <p className="text-zinc-300 leading-relaxed mb-4">
                Qualunque cosa decidi di allenare assicurati che la puoi
                ripetere nella sessione successiva e migliora nella prossima
                settimana sbloccando più ripetizioni, più tempo in isometria o
                tecnica migliore.
              </p>
              <p className="text-zinc-300 font-bold mb-3">
                Quanto Duramente Allenarsi
              </p>
              <p className="text-zinc-400 mb-4">
                Per la maggior parte degli allenamenti, l'intensità ottimale si
                trova nella zona RIR 1-2.
              </p>
              <ul className="list-disc list-inside text-zinc-400 mb-4">
                <li>
                  <strong>Per la Crescita Muscolare e la Forza:</strong> le
                  serie vicino al cedimento (RIR 1-2) sono le più efficaci.
                </li>
                <li>
                  <strong>Per l'Apprendimento delle Skills:</strong> allenarsi a
                  RIR 2-3 o più alto per preservare la tecnica.
                </li>
                <li>
                  <strong>Evitare il Cedimento Assoluto:</strong> il cedimento
                  tecnico è preferibile rispetto al cedimento muscolare totale
                  nella maggior parte dei casi.
                </li>
              </ul>

              <h4 className="text-xl font-bold text-white mb-3">
                Regole per Capire se ti Alleni Abbastanza Duramente
              </h4>
              <ul className="list-disc list-inside text-zinc-400 mb-4">
                <li>
                  Le ultime ripetizioni sono sforzate e più lente delle prime.
                </li>
                <li>Usi il sovraccarico progressivo nel tempo.</li>
                <li>
                  Non sacrifichi la tecnica per completare ripetizioni extra.
                </li>
              </ul>
            </div>
          </div>

          <div id="formula-forza" className="mb-48">
            <div className="mb-16">
              <span className="text-cyan-500 font-black tracking-[0.4em] uppercase text-[10px] mb-4 block text-center">
                Science
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-center uppercase tracking-tighter">
                Principi di Forza
              </h2>
            </div>
            <div className="p-10 rounded-[2.5rem] bg-zinc-900/40 border border-white/10">
              <h3 className="text-3xl font-black mb-6 uppercase tracking-tighter text-cyan-500">
                Formula
              </h3>
              <p className="text-2xl font-black mb-6">
                FORZA ={" "}
                <span className="text-cyan-500">ADATTAMENTI NEURALI</span> ×{" "}
                <span className="text-white">
                  AREA DELLA SEZIONE TRASVERSALE (CSA)
                </span>
              </p>

              <h4 className="text-xl font-bold text-white mb-3">
                Adattamenti neurali
              </h4>
              <p className="text-zinc-300 mb-3">
                Gli adattamenti neurali sono cambiamenti nell'efficienza con cui
                il cervello e il sistema nervoso controllano e attivano i
                muscoli. Rappresentano la capacità del corpo di usare meglio i
                muscoli che ha già.
              </p>
              <ul className="list-disc list-inside text-zinc-400 mb-4">
                <li>Miglior reclutamento delle unità motorie</li>
                <li>Aumento della sincronizzazione</li>
                <li>Migliore coordinazione inter e intramuscolare</li>
                <li>Riduzione dell'inibizione autogena</li>
              </ul>

              <h4 className="text-xl font-bold text-white mb-3">
                Area della sezione del muscolo (CSA)
              </h4>
              <p className="text-zinc-300 mb-4">
                La CSA è la dimensione fisica del muscolo. Generalmente maggiore
                CSA = maggiore potenziale di generare forza. L'ipertrofia
                aumenta la CSA.
              </p>

              <h4 className="text-xl font-bold text-white mb-3">
                Principio SAID e Sovraccarico Progressivo
              </h4>
              <p className="text-zinc-300 mb-3">
                Il principio SAID afferma che il corpo si adatta specificamente
                allo stimolo ricevuto. Il sovraccarico progressivo è la chiave
                per continuare a migliorare: aumentare ripetizioni, difficoltà,
                densità o aggiungere zavorre nel tempo.
              </p>
              <ul className="list-disc list-inside text-zinc-400 mb-4">
                <li>Aumento delle ripetizioni</li>
                <li>Aumento della difficoltà dell'esercizio (progressioni)</li>
                <li>Manipolazione delle leve</li>
                <li>Aumento della densità e aggiunta di zavorre</li>
              </ul>

              <h4 className="text-xl font-bold text-white mb-3">
                Unità motorie e reclutamento
              </h4>
              <p className="text-zinc-300 mb-3">
                Le unità motorie sono composte da un motoneurone e dalle fibre
                che innerva. Il reclutamento segue il principio delle dimensioni
                di Henneman: dalle unità più piccole a quelle più grandi in base
                alla richiesta di forza.
              </p>
            </div>
          </div>

          <div id="percorsi-ipertrofia" className="mb-48">
            <div className="mb-16">
              <span className="text-rose-500 font-black tracking-[0.4em] uppercase text-[10px] mb-4 block text-center">
                Hypertrophy
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-center uppercase tracking-tighter">
                Percorsi dell’ipertrofia
              </h2>
            </div>
            <div className="p-10 rounded-[2.5rem] bg-zinc-900/40 border border-white/10">
              <h3 className="text-3xl font-black mb-6 uppercase tracking-tighter text-rose-400">
                Tensione meccanica
              </h3>
              <p className="text-zinc-300 mb-4">
                La tensione meccanica è la forza che le fibre muscolari
                sperimentano quando si contraggono contro una resistenza. Avvia
                processi che portano all'ipertrofia: attivazione dei
                meccanocettori, micro-traumi e aumento della sintesi proteica.
              </p>
              <h4 className="text-xl font-bold text-white mb-3">
                Fattori chiave
              </h4>
              <ul className="list-disc list-inside text-zinc-400 mb-4">
                <li>Carico progressivo (progressioni, zavorre)</li>
                <li>
                  Tempo sotto tensione (eccentrica controllata, pause
                  isometriche)
                </li>
                <li>Gamma di movimento completa</li>
                <li>Connessione mente-muscolo</li>
              </ul>

              <h3 className="text-3xl font-black mt-8 mb-6 uppercase tracking-tighter text-rose-400">
                Danno muscolare eccentrico
              </h3>
              <p className="text-zinc-300 mb-4">
                La fase eccentrica genera micro-lacerazioni che innescano una
                risposta infiammatoria, attivano cellule satellite e aumentano
                la sintesi proteica, portando alla supercompensazione e
                all'ipertrofia.
              </p>
              <p className="text-zinc-300 mb-3">
                Pratiche utili: eccentrica controllata, negative e introduzione
                graduale di sovraccarico.
              </p>

              <h3 className="text-3xl font-black mt-8 mb-6 uppercase tracking-tighter text-rose-400">
                Accumulazione metabolica
              </h3>
              <p className="text-zinc-300 mb-4">
                L&apos;accumulo di metaboliti (es. lattato) contribuisce alla
                crescita tramite maggiore reclutamento, rilascio ormonale e
                aumento della sintesi proteica. Si ottiene con serie ad alte
                ripetizioni, brevi recuperi, superset e circuiti.
              </p>
              <p className="text-zinc-300">
                Tecniche pratiche: serie ad alte ripetizioni, EMOM, rest-pause,
                superset e mantenere la tensione costante evitando lo slancio.
              </p>
            </div>
          </div>

          <div id="programmazione-allenamento" className="mb-48">
            <div className="mb-16">
              <span className="text-violet-500 font-black tracking-[0.4em] uppercase text-[10px] mb-4 block text-center">
                Programming
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-center uppercase tracking-tighter">
                Programmazione dell’allenamento
              </h2>
            </div>
            <div className="p-10 rounded-[2.5rem] bg-zinc-900/40 border border-white/10">
              <h3 className="text-3xl font-black mb-6 uppercase tracking-tighter text-violet-400">
                Split di allenamento
              </h3>
              <p className="text-zinc-300 mb-4">
                Lo split definisce come distribuisci il lavoro settimanale tra
                gruppi muscolari e schemi di movimento. Nel Calisthenics si
                preferisce spesso organizzare le sessioni per pattern motori e
                priorità di skill piuttosto che per singolo muscolo.
              </p>

              <h4 className="text-xl font-bold text-white mb-3">
                Tipologie di split
              </h4>
              <ul className="list-disc list-inside text-zinc-400 mb-6">
                <li>
                  <strong>Push / Pull / Legs (PPL)</strong> — adatto a 3–6
                  sessioni/settimana; buono per gestire volume e recupero.
                </li>
                <li>
                  <strong>Full Body</strong> — ideale per principianti o 2–3
                  sessioni/settimana; alta frequenza, basso volume per sessione.
                </li>
                <li>
                  <strong>Upper / Lower</strong> — pratica per 4
                  sessioni/settimana; equilibrata per forza e volume.
                </li>
                <li>
                  <strong>
                    Split per skill (es. braccia tese / braccia piegate)
                  </strong>{" "}
                  — utile quando si lavora molto sulle progressioni specifiche
                  delle skill.
                </li>
              </ul>

              <h3 className="text-3xl font-black mt-8 mb-6 uppercase tracking-tighter text-violet-400">
                Periodizzazione
              </h3>
              <p className="text-zinc-300 mb-4">
                La periodizzazione organizza il training in fasi con obiettivi
                diversi (accumulo, intensificazione, picco) per massimizzare
                adattamenti e minimizzare il rischio di plateau e overtraining.
              </p>

              <h4 className="text-xl font-bold text-white mb-3">
                Modelli di periodizzazione
              </h4>
              <ul className="list-disc list-inside text-zinc-400 mb-4">
                <li>
                  <strong>Lineare</strong>: aumenta l'intensità riducendo il
                  volume con il tempo; semplice e adatto ai principianti.
                </li>
                <li>
                  <strong>Ondulata</strong>: varia volume e intensità più
                  frequentemente (giornalmente o settimanalmente); efficace per
                  livelli intermedi/avanzati.
                </li>
                <li>
                  <strong>A blocchi</strong>: mesocicli con obiettivi chiari
                  (es. accumulo → intensificazione → picco); ottimo per atleti
                  con obiettivi specifici.
                </li>
              </ul>

              <h4 className="text-xl font-bold text-white mb-3">
                Aggiustamenti pratici
              </h4>
              <p className="text-zinc-300 mb-4">
                Adatta volume e intensità in base al livello dell'atleta, al
                recupero disponibile e agli obiettivi. Monitora metriche
                semplici (RIR, PR, sonno, HR a riposo) per guidare le modifiche.
              </p>

              <h4 className="text-xl font-bold text-white mb-3">
                Esempio di microciclo
              </h4>
              <p className="text-zinc-300 mb-4">
                Per un praticante intermedio: Lunedì (Forza specifica), Martedì
                (Skill + recupero attivo), Mercoledì (Ipertrofia), Giovedì
                (Riposo o mobilità), Venerdì (Forza), Sabato (Sessione leggera /
                skill), Domenica (Riposo).
              </p>

              <p className="text-zinc-400">
                Ricorda: la programmazione più efficace è quella che puoi
                sostenere nel tempo. Sii flessibile, registra i progressi e
                adatta il piano in base alla risposta del corpo.
              </p>
            </div>
          </div>

          <div id="strategie-recupero" className="mb-48">
            <div className="mb-16">
              <span className="text-amber-400 font-black tracking-[0.4em] uppercase text-[10px] mb-4 block text-center">
                Recovery
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-center uppercase tracking-tighter">
                Strategie di recupero
              </h2>
            </div>
            <div className="p-10 rounded-[2.5rem] bg-zinc-900/40 border border-white/10">
              <h3 className="text-3xl font-black mb-6 uppercase tracking-tighter text-amber-300">
                Recupero
              </h3>
              <p className="text-zinc-300 mb-4">
                Il ritorno dei sistemi fisiologici ai valori base, con
                conseguente ripristino delle prestazioni atletiche o almeno a
                livelli sufficienti per continuare gli allenamenti. Il recupero
                aiuta il tuo corpo a raggiungere uno stato di riposo.
              </p>

              <h4 className="text-xl font-bold text-white mb-3">
                Gerarchia di recupero primaria
              </h4>
              <p className="text-zinc-300 mb-4">
                Si riferisce ai fattori fondamentali e prioritari che
                influenzano la capacità del corpo di riprendersi efficacemente
                dagli stimoli dell'allenamento. Senza questi elementi di base,
                qualsiasi altra strategia di recupero avrà un impatto limitato.
              </p>

              <h4 className="text-xl font-bold text-white mb-3">
                I tre pilastri
              </h4>
              <ul className="list-disc list-inside text-zinc-400 mb-4">
                <li>
                  <strong>Sonno</strong>: Il fattore più critico per il recupero
                  muscolare, ormonale e cognitivo. Puntare a 7-9 ore di sonno di
                  qualità e regolarità.
                </li>
                <li>
                  <strong>Nutrizione</strong> (Apporto calorico e
                  macronutrienti): Mangiare abbastanza calorie, proteine
                  adeguate, carboidrati per il reintegro del glicogeno e
                  idratazione.
                </li>
                <li>
                  <strong>Gestione dello stress e stile di vita</strong>:
                  Cortisolo cronico elevato compromette recupero; tecniche come
                  meditazione, respirazione e attività ricreative aiutano.
                </li>
              </ul>

              <h4 className="text-xl font-bold text-white mb-3">
                Segnali che indicano bisogno di riposo
              </h4>
              <p className="text-zinc-300 mb-3">
                I segnali fisici e mentali che il tuo corpo invia quando ha
                bisogno di recuperare: cali di performance, dolori articolari
                persistenti, affaticamento prolungato, aumento della frequenza
                cardiaca a riposo, sonno disturbato, perdita di motivazione,
                irritabilità e difficoltà di concentrazione.
              </p>

              <h4 className="text-xl font-bold text-white mb-3">Cosa fare</h4>
              <ul className="list-disc list-inside text-zinc-400 mb-4">
                <li>
                  Riposo completo: 2-3 giorni di stop totale se necessario.
                </li>
                <li>
                  Settimana di scarico: ridurre volume/intensità per 5-7 giorni.
                </li>
                <li>
                  Priorità al recupero: sonno, alimentazione e idratazione.
                </li>
              </ul>
            </div>
          </div>

          <div id="macronutrienti" className="mb-48">
            <div className="mb-16">
              <span className="text-emerald-500 font-black tracking-[0.4em] uppercase text-[10px] mb-4 block text-center">
                Nutrition
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-center uppercase tracking-tighter">
                Alimentazione
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-4xl bg-zinc-900/40 border border-white/10">
                <Beef className="text-emerald-500 mb-6" />
                <h4 className="text-xl font-bold text-white mb-4 uppercase">
                  Proteine
                </h4>
                <p className="text-zinc-400">
                  Essenziali per la costruzione muscolare. Target: 2g per kg di
                  peso.
                </p>
              </div>
              <div className="p-8 rounded-4xl bg-zinc-900/40 border border-white/10">
                <Apple className="text-emerald-500 mb-6" />
                <h4 className="text-xl font-bold text-white mb-4 uppercase">
                  Carboidrati
                </h4>
                <p className="text-zinc-400">La fonte primaria di energia.</p>
              </div>
              <div className="p-8 rounded-4xl bg-zinc-900/40 border border-white/10">
                <Droplets className="text-emerald-500 mb-6" />
                <h4 className="text-xl font-bold text-white mb-4 uppercase">
                  Grassi
                </h4>
                <p className="text-zinc-400">
                  Vitali per la produzione ormonale.
                </p>
              </div>
            </div>
            <div className="mt-10 p-10 rounded-4xl bg-zinc-900/30 border border-white/10">
              <h3 className="text-3xl font-black mb-6 text-emerald-400">
                I macronutrienti
              </h3>
              <p className="text-zinc-300 mb-4">
                I macronutrienti sono i componenti fondamentali della dieta di
                cui il corpo ha bisogno in grandi quantità per produrre energia
                e sostenere le funzioni vitali. La dieta nel Calisthenics si
                concentra sull'ottimizzazione dell'assunzione di questi
                nutrienti per massimizzare la performance, favorire la crescita
                muscolare e mantenere un peso corporeo ottimale.
              </p>

              <h4 className="text-xl font-bold text-white mb-3">
                Cosa sono i Macronutrienti
              </h4>
              <ul className="list-disc list-inside text-zinc-400 mb-4">
                <li>
                  <strong>Carboidrati</strong>: Sono la fonte primaria di
                  energia del corpo. Vengono scomposti in glucosio, che alimenta
                  il cervello e i muscoli durante l'attività fisica.
                </li>
                <li>
                  <strong>Proteine</strong>: Essenziali per la costruzione, il
                  mantenimento e la riparazione dei tessuti muscolari, un
                  aspetto cruciale nel Calisthenics. Sono composte da
                  amminoacidi, alcuni dei quali sono essenziali e devono essere
                  assunti tramite l'alimentazione.
                </li>
                <li>
                  <strong>Grassi</strong>: Forniscono una fonte di energia a
                  lungo termine, sono necessari per l'assorbimento delle
                  vitamine liposolubili e sono vitali per la produzione di
                  ormoni e la salute cellulare.
                </li>
              </ul>

              <h4 className="text-xl font-bold text-white mb-3">
                Fasi: Massa e Definizione
              </h4>
              <p className="text-zinc-300 mb-3">
                Le fasi di <strong>massa</strong> e <strong>definizione</strong>{" "}
                sono due approcci nutrizionali distinti, che si differenziano
                principalmente per il bilancio calorico al fine di ottimizzare
                la composizione corporea.
              </p>

              <h5 className="text-lg font-bold text-white mt-4 mb-2">
                Fase di Massa
              </h5>
              <ul className="list-disc list-inside text-zinc-400 mb-4">
                <li>
                  <strong>Bilancio Calorico</strong>: Periodo di{" "}
                  <em>surplus calorico</em> (250-500 kcal sopra il mantenimento)
                  per favorire crescita muscolare minimizzando l'accumulo di
                  grasso.
                </li>
                <li>
                  <strong>Macronutrienti</strong>: Proteine (25-30% delle
                  calorie o ~2 g/kg), Carboidrati (55-60%), Grassi (15-20%).
                </li>
                <li>
                  <strong>Durata</strong>: Tipicamente 3-6 mesi, variabile in
                  base agli obiettivi.
                </li>
              </ul>

              <h5 className="text-lg font-bold text-white mt-4 mb-2">
                Fase di Definizione
              </h5>
              <ul className="list-disc list-inside text-zinc-400 mb-4">
                <li>
                  <strong>Bilancio Calorico</strong>: Periodo di{" "}
                  <em>deficit calorico</em> (250-500 kcal sotto il mantenimento)
                  per ridurre il grasso conservando massa muscolare.
                </li>
                <li>
                  <strong>Macronutrienti</strong>: Proteine prioritarie (~2
                  g/kg) per preservare il muscolo; Carboidrati ridotti ma
                  sufficienti per allenarsi; Grassi mantenuti nel range 15-25%.
                </li>
                <li>
                  <strong>Durata</strong>: Tipicamente 8-12 settimane o fino al
                  raggiungimento dell'obiettivo di composizione corporea.
                </li>
              </ul>

              <h4 className="text-xl font-bold text-white mb-3">
                Principi pratici
              </h4>
              <ul className="list-disc list-inside text-zinc-400 mb-4">
                <li>
                  <strong>Fabbisogno calorico adeguato</strong>: Consuma
                  sufficienti calorie per sostenere allenamenti intensi e
                  recupero; usa un leggero surplus per la massa.
                </li>
                <li>
                  <strong>Elevato apporto proteico</strong>: Fondamentale per
                  riparazione e crescita muscolare.
                </li>
                <li>
                  <strong>Carboidrati come carburante</strong>: Prioritari prima
                  e dopo l'allenamento per performance e reintegro del
                  glicogeno.
                </li>
                <li>
                  <strong>Grassi salutari</strong>: Non eliminarli; supportano
                  funzioni ormonali e cellulari.
                </li>
                <li>
                  <strong>Idratazione e qualità degli alimenti</strong>:
                  Privilegiare cibi integrali, non processati, ricchi di
                  micronutrienti.
                </li>
              </ul>

              <p className="text-zinc-400">
                Oscillazioni estreme tra fase di massa e definizione sono
                sconsigliate. Pianifica cambiamenti graduali e monitora
                performance, energia e recupero per adattare la dieta al tuo
                allenamento nel Calisthenics.
              </p>
            </div>
          </div>

          <div id="deload" className="mb-48">
            <div className="mb-16">
              <span className="text-orange-500 font-black tracking-[0.4em] uppercase text-[10px] mb-4 block text-center">
                Recovery
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-center uppercase tracking-tighter">
                L’importanza dello scarico
              </h2>
            </div>
            <div className="p-10 rounded-[2.5rem] bg-orange-950/10 border border-orange-500/20">
              <p className="text-zinc-300 mb-4">
                Lo scarico consiste in un breve periodo in cui si{" "}
                <strong>
                  riduce intenzionalmente il volume e/o l'intensità
                </strong>{" "}
                dell'allenamento. L'obiettivo non è migliorare in quella
                settimana, ma permettere al corpo di recuperare completamente
                dagli stress accumulati nelle settimane precedenti, prevenendo
                il sovrallenamento e gli infortuni.
              </p>

              <h4 className="text-xl font-bold text-white mb-3">
                A cosa serve lo scarico nel Calisthenics?
              </h4>
              <p className="text-zinc-300 mb-3">
                Il principio guida è che i muscoli crescono e diventano più
                forti durante il riposo, non durante l'allenamento. Lo scarico
                permette il recupero del sistema nervoso centrale, il riposo
                articolare e tendineo, la supercompensazione e la prevenzione
                degli infortuni.
              </p>

              <h4 className="text-xl font-bold text-white mb-3">
                Tipi di scarico
              </h4>
              <p className="text-zinc-300 mb-3">
                <strong>Scarico programmato:</strong> pianificazione anticipata
                (es. una settimana ogni 4/6/8 settimane). Vantaggi: struttura e
                prevedibilità. Svantaggi: potrebbe non coincidere con il reale
                bisogno corporeo.
              </p>
              <p className="text-zinc-300 mb-3">
                <strong>Scarico intuitivo:</strong> basato sull&apos;ascolto del
                corpo e segnali di fatica. Vantaggi: personalizzazione;
                svantaggi: richiede esperienza e disciplina.
              </p>

              <h4 className="text-xl font-bold text-white mb-3">
                Come eseguire uno scarico efficace
              </h4>
              <ul className="list-disc list-inside text-zinc-400 mb-4">
                <li>
                  <strong>Riduzione del volume</strong>: mantenere gli esercizi
                  ma diminuire serie/ripetizioni.
                </li>
                <li>
                  <strong>Riduzione dell&apos;intensità</strong>: usare
                  progressioni più facili.
                </li>
                <li>
                  <strong>Aumento dei tempi di recupero</strong>: pause più
                  lunghe tra le serie.
                </li>
                <li>
                  <strong>Frequenza ridotta</strong>: allenarsi meno volte nella
                  settimana di scarico.
                </li>
              </ul>

              <p className="text-zinc-400">
                Inserire regolarmente lo scarico nel programma è la chiave per
                una progressione sostenibile a lungo termine, permettendo di
                sviluppare forza e padroneggiare nuove skill senza esaurire il
                corpo.
              </p>
            </div>
          </div>


        </div>
      </main>
    </div>
    </>
  );
};

export default Guide;
