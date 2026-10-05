import React from "react";
import { motion } from "framer-motion";
import Pricing from "../components/Pricing";
import HowItWorks from "../components/HowItWorks";
import SEO from "../components/SEO";
import FAQ from "../components/FAQ";
import Features from "../components/Features";
import ProgramShowcase from "../components/ProgramShowcase";
import Button from "../components/Button";
import {
  Zap,
  Crown,
  ArrowRight,
} from "lucide-react";

const Home: React.FC = () => {
  return (
    <div className="overflow-hidden relative bg-black">
      <SEO
        title="Home"
        description="Maxthenics: La piattaforma leader per l'allenamento a corpo libero. Sblocca skills come Front Lever e Planche con programmi scientifici."
      />

      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute bottom-[10%] right-[-10%] w-[700px] h-[700px] bg-orange-600/5 rounded-full blur-[120px]"
        />
      </div>

      {/* Restructured Vertical High-Tech Hero Section (No Images) */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-32 pb-16 bg-zinc-950 border-b border-white/10 text-left md:text-center">
        <div className="container-max relative max-w-6xl mx-auto flex flex-col items-start md:items-center">

          {/* Top Pill / Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900 border border-white/10 text-zinc-300 text-xs font-mono uppercase tracking-wider mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" /> Calisthenics · Programmi su misura
          </motion.div>

          {/* Main H1 Title (Max 2 Lines, Balanced Size) */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-white mb-6 max-w-4xl"
          >
            Diventa forte a corpo libero, con un metodo chiaro.
          </motion.h1>

          {/* Subtitle Copy */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed mb-10"
          >
            Programmi di calisthenics costruiti sui tuoi dati — livello, attrezzatura, tempo.
            Per sbloccare trazioni, dip, muscle-up, front lever e planche senza improvvisare.
          </motion.p>

          {/* Action Buttons (Centered Row) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start md:justify-center gap-3 w-full sm:w-auto mb-12"
          >
            <Button to="/programs" size="lg">
              Vedi i programmi
              <ArrowRight size={17} aria-hidden />
            </Button>

            <Button to="/calisthenics-room" variant="secondary" size="lg">
              Coaching 1:1
              <Crown size={17} className="text-zinc-400" aria-hidden />
            </Button>
          </motion.div>

          {/* Stats Grid - Matching Calisthenics Room Section Style */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-4xl"
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-lg overflow-hidden border border-white/10 max-w-4xl mx-auto text-left">
              {[
                { label: "15 programmi", sub: "Workout, skill, forza e mobilità." },
                { label: "7 stili", sub: "Street, Skill, Rings, Power, e altri." },
                { label: "15 dati", sub: "età, livello, attrezzatura, infortuni." },
                { label: "Coach vero", sub: "risposta umana entro 24h nei piani Pro." },
              ].map((item, i) => (
                <div key={i} className="p-5 bg-zinc-950 text-left">
                  <p className="text-[15px] font-bold text-white mb-1">{item.label}</p>
                  <p className="text-[13px] text-zinc-500 leading-snug">{item.sub}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* About Section - Full Text */}
      <section
        id="about"
        className="section-padding scroll-mt-24"
      >
        <div className="container-max max-w-4xl mx-auto text-center">
          <div className="eyebrow-pill mb-8">
            <Zap size={12} fill="currentColor" /> Filosofia
          </div>
          <h2 className="page-title mb-10 text-4xl md:text-5xl">
            Oltre il semplice <span className="text-red-500">allenamento</span>
          </h2>
          <div className="space-y-6 text-base text-zinc-400 leading-relaxed text-left md:text-center max-w-3xl mx-auto">
            <p>
              Maxthenics è un ecosistema di allenamento intelligente. Non un semplice generatore di schede, ma un sistema che analizza, adatta e ottimizza ogni variabile del tuo percorso: dalla biomeccanica dei movimenti alla gestione del carico neurologico, dalla periodizzazione alla tecnica pura.
            </p>
            <p>
              Ogni programma viene costruito partendo da un principio fondamentale: non esistono due corpi uguali. Per questo il nostro algoritmo proprietario elabora i tuoi dati biometrici — età, peso, altezza, sesso, esperienza, infortuni pregressi e obiettivi specifici — per produrre un protocollo che si evolve con te, seduta dopo seduta.
            </p>
            <p>
              Il risultato è un percorso scientifico che trasforma l&apos;istinto in strategia. Non più tentativi casuali, ma progressioni calibrate al millimetro per portarti dalla prima trazione alla Planche in tempo reale, senza infortuni e senza piattori.
            </p>
          </div>
          <div className="mt-12">
            <p className="meta-mono mb-6">Cosa ottieni</p>
            <div className="grid sm:grid-cols-3 gap-4 text-left">
              {[
                { title: "Progressioni Frame-by-Frame", desc: "Ogni skill scomposta in micro-step misurabili. Sai esattamente cosa fare oggi per arrivare domani." },
                { title: "Schede Dinamiche", desc: "Il programma si aggiorna in base ai tuoi progressi reali. Niente più settimane sprecate su esercizi troppo facili o impossibili." },
                { title: "Supporto Coach AI 24/7", desc: "Il nostro assistente virtuale risponde a ogni dubbio: tecnica, alimentazione, recupero. Sempre acceso, sempre disponibile." },
              ].map((item) => (
                <div key={item.title} className="group card card-hover relative overflow-hidden p-6">
                  <div className="card-lift" aria-hidden />
                  <div className="relative">
                    <p className="text-base font-bold text-white mb-2">{item.title}</p>
                    <p className="prose-block text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Features Section */}
      <Features />

      {/* Personalized Program Section - Full Text */}
      <section className="section-padding relative">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl p-8 md:p-12 lg:p-16 border border-white/10 overflow-hidden bg-zinc-900/40"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(220,38,38,0.15)_0%,transparent_60%)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="eyebrow-pill mb-8"
              >
                <Zap size={12} fill="currentColor" /> Algoritmo Proprietario
              </motion.div>

              <h2 className="page-title mb-8 text-4xl md:text-5xl">
                Programma <span className="text-red-500">personalizzato</span>
              </h2>

              <div className="space-y-6 text-base text-zinc-400 leading-relaxed text-left md:text-center max-w-3xl mx-auto mb-12">
                <p>
                  Ogni programma generato da Maxthenics è unico perché parte da te. Non esistono due utenti con lo stesso percorso: il nostro sistema incrocia oltre quindici variabili — dai dati antropometrici allo stile di allenamento preferito, dalle attrezzature disponibili agli infortuni pregressi — per costruire un protocollo che nessun altro ha.
                </p>
                <p>
                  Inserisci età, peso, altezza, sesso, livello di esperienza e obiettivi. Scegli tra sette stili di training — Street Workout, Skill Work, Freestyle, Power, Rings, Hypertrophy, Endurance — e seleziona le attrezzature che hai realmente a disposizione: parallele, anelli, barra per trazioni, cintura pesi, elastici, swiss ball, parallele svedesi o panca. Il sistema analizza ogni combinazione e produce un programma strutturato in blocchi progressivi, con esercizi, serie, ripetizioni e tempi di recupero calcolati sulla tua soglia fisiologica.
                </p>
                <p>
                  Non è una scheda statica. Il programma vive con te: puoi aggiornare i tuoi progressi, ricevere varianti sugli esercizi e consultare il Coach AI per qualsiasi dubbio tecnico. Periodizzazione ondulata, sovraccarico progressivo e deload programmati sono gestiti automaticamente, così tu puoi concentrarti solo sul movimento.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10 mb-12 max-w-3xl mx-auto">
                {[
                  { val: "15+", label: "Variabili analizzate" },
                  { val: "7", label: "Stili di training" },
                  { val: "8", label: "Attrezzature supportate" },
                  { val: "24/7", label: "Supporto Coach AI" },
                ].map((item) => (
                  <div key={item.label} className="p-5 bg-zinc-950">
                    <p className="text-2xl font-bold text-red-500">{item.val}</p>
                    <p className="meta-mono mt-1">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button to="/create" size="lg">
                  Genera il tuo protocollo
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                    aria-hidden
                  />
                </Button>
                <Button to="/programs" variant="secondary" size="lg">
                  Vedi programmi esempio
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* General Programs Showcase */}
      <ProgramShowcase />

      {/* Calisthenics Room Section - Full Text */}
      <section id="coaching" className="section-padding relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container-max">
          <div className="card relative overflow-hidden p-8 md:p-12 lg:p-16">
            <div className="absolute inset-0 opacity-[0.03] bg-grid pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <div className="eyebrow-pill mb-8">
                <Crown size={12} /> Elite Coaching Service
              </div>
              <h2 className="page-title mb-8 text-4xl md:text-5xl">
                Calisthenics <span className="text-red-500">Room</span>
              </h2>

              <div className="space-y-6 text-base text-zinc-400 leading-relaxed text-left md:text-center max-w-3xl mx-auto mb-12">
                <p>
                  La Calisthenics Room è il nostro servizio di coaching 1:1 premium. Non un corso registrato né una serie di video generici: è un percorso individuale dove ogni seduta viene progettata, monitorata e corretta in tempo reale da un coach dedicato. Il programma non esiste fino a quando non iniziamo a lavorare insieme.
                </p>
                <p>
                  Il processo inizia con un&apos;analisi approfondita: video-analisi della tua tecnica attuale, valutazione dei punti di forza e delle debolezze, identificazione degli squilibri muscolari e definizione degli obiettivi a breve, medio e lungo termine. Da qui costruiamo un protocollo che evolve di settimana in settimana, mai uguale a sé stesso, sempre calibrato sul tuo recupero e sui tuoi progressi reali.
                </p>
                <p>
                  Ogni sessione prevede correzioni in diretta via video, varianti istantanee quando un esercizio non risponde come previsto e un piano di lavoro che integra tecnica, condizionamento e mobilità. Il coach è disponibile su WhatsApp per dubbi, dubbi dell&apos;ultimo minuto e aggiustamenti fuori orario. L&apos;accesso è su richiesta perché ogni atleta merita attenzione totale, niente schede preconfezionate.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 max-w-3xl mx-auto text-left">
                {[
                  { label: "Live Coaching", sub: "Ogni sessione è in diretta con video-analisi frame-by-frame della tua tecnica. Correggiamo l'esecuzione in tempo reale, non a posteriori." },
                  { label: "Supporto H24", sub: "Accesso diretto via WhatsApp per qualsiasi necessità: variazioni dell'ultimo minuto, dubbi sul recupero, ripensamenti sul programma." },
                  { label: "Protocolli Live", sub: "Il piano si modifica seduta dopo seduta in base alla tua risposta. Se un esercizio non funziona, lo sostituiamo subito." },
                  { label: "Attenzione esclusiva", sub: "Ogni coaching riceve attenzione dedicata e continuità nel tempo." },
                ].map((item) => (
                  <div key={item.label} className="group card card-hover relative overflow-hidden p-5">
                    <div className="card-lift" aria-hidden />
                    <div className="relative">
                      <p className="text-sm font-bold text-white mb-1.5">{item.label}</p>
                      <p className="text-xs text-zinc-500 leading-relaxed">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button to="/calisthenics-room" size="lg">
                Richiedi accesso
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                  aria-hidden
                />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <Pricing />

      {/* FAQ Section */}
      <FAQ />

    </div>
  );
};

export default Home;
