/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  BarChart,
  BookOpen,
  Check,
  Clock,
  Dumbbell,
  Flame,
  HelpCircle,
  ListVideo,
  Play,
  ShieldCheck,
  ShoppingCart,
  Target,
  UserCheck,
  Zap,
} from "lucide-react";
import Curriculum from "../components/Curriculum";
import LanguageToggle from "../components/LanguageToggle";
import MetaPill from "../components/MetaPill";
import SectionHeading from "../components/SectionHeading";
import ShareButton from "../components/ShareButton";
import Button from "../components/Button";
import SEO from "../components/SEO";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { getCurriculum } from "../data/curriculum";
import { getProgramByIdList, localizeProgram } from "../data/programs";

const FAQ_ITEMS = [
  {
    question: "Quanto dura l'accesso al programma?",
    questionEn: "How long do I keep access to the program?",
    answer:
      "Una volta sbloccato o acquistato, l'accesso al programma è a vita. Potrai consultare le schede, i video e i materiali didattici in qualsiasi momento, ovunque ti trovi.",
    answerEn:
      "Once unlocked or purchased, access is lifetime. You can review the plans, videos and learning materials anytime, anywhere.",
  },
  {
    question: "Ho bisogno di attrezzatura specifica?",
    questionEn: "Do I need specific equipment?",
    answer:
      "La maggior parte dei nostri programmi richiede attrezzatura base da Calisthenics: sbarra per trazioni, parallele e anelli. Per programmi avanzati potrebbero essere utili bande elastiche o zavorre.",
    answerEn:
      "Most of our programs require basic Calisthenics equipment: pull-up bar, parallettes and rings. For advanced programs, resistance bands or weights can help.",
  },
  {
    question: "E se il programma è troppo difficile per me?",
    questionEn: "What if the program is too hard for me?",
    answer:
      "Ogni programma è strutturato con propedeutiche graduali. Inoltre, forniamo alternative scalabili per ogni esercizio per adattarsi al tuo livello di partenza.",
    answerEn:
      "Every program is structured with gradual progressions. We also provide scalable alternatives for each exercise to match your starting level.",
  },
];

const TARGET_AUDIENCE = [
  {
    it: "Atleti determinati a superare i plateau di forza",
    en: "Athletes determined to break through strength plateaus",
  },
  {
    it: "Appassionati di corpo libero che cercano una struttura scientifica",
    en: "Bodyweight enthusiasts looking for a scientific structure",
  },
  {
    it: "Chi vuole apprendere skill avanzate riducendo il rischio di infortuni",
    en: "Anyone who wants to learn advanced skills while reducing injury risk",
  },
];

const PHASES = [
  {
    dotClass: "border-red-500 ring-4 ring-red-500/20",
    title: { it: "Fase 1: Condizionamento & Adattamento", en: "Phase 1: Conditioning & Adaptation" },
    body: {
      it: "Le prime settimane sono focalizzate sulla costruzione della capacità di lavoro (work capacity) e sul rinforzo dei tessuti connettivi. Imparerai i pattern motori base e preparerai tendini e legamenti alle intensità future.",
      en: "The first weeks focus on building work capacity and reinforcing connective tissue. You will learn the basic motor patterns and prepare tendons and ligaments for future intensity.",
    },
  },
  {
    dotClass: "border-white/20",
    title: { it: "Fase 2: Intensificazione del Volume", en: "Phase 2: Volume Intensification" },
    body: {
      it: "Aumento progressivo delle serie e delle ripetizioni. Il corpo viene sottoposto a uno stress metabolico mirato per stimolare l'ipertrofia e consolidare la tecnica sotto fatica.",
      en: "Progressive increase in sets and reps. The body is exposed to targeted metabolic stress to stimulate hypertrophy and consolidate technique under fatigue.",
    },
  },
  {
    dotClass: "border-white/20",
    title: { it: "Fase 3: Picco di Forza & Mastery", en: "Phase 3: Strength Peak & Mastery" },
    body: {
      it: "Abbassamento del volume e innalzamento drastico dell'intensità. L'obiettivo è reclutare il massimo numero di unità motorie per trasformare il lavoro accumulato in vera forza espressa (skills).",
      en: "Lower volume and a sharp rise in intensity. The goal is to recruit the maximum number of motor units to turn accumulated work into real expressed strength (skills).",
    },
  },
];

const HIGHLIGHT_ICONS = { workouts: Dumbbell, videos: Play, theory: BookOpen } as const;

const ProgramDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, removeFromCart, cartItems } = useCart();
  const { user, addNotification } = useAuth();
  const navigate = useNavigate();
  const { locale, t } = useLanguage();

  const programId = parseInt(id || "0", 10);

  const rawProgram = getProgramByIdList(programId);
  const program = rawProgram ? localizeProgram(rawProgram, locale) : undefined;
  const curriculum = getCurriculum(programId);

  if (!program) {
    return (
      <div className="page-shell flex flex-col items-center justify-center px-6 text-center">
        <SEO title={t("Programma non trovato", "Program not found")} />
        <p className="eyebrow">404</p>
        <h1 className="page-title mt-3">{t("Programma non trovato", "Program not found")}</h1>
        <Button to="/programs" size="lg" className="mt-8">
          <ArrowLeft className="w-4 h-4" aria-hidden />
          {t("Torna ai programmi", "Back to programs")}
        </Button>
      </div>
    );
  }

  const handleUnlockFree = async () => {
    if (!user) {
      addNotification("Accedi per sbloccare il programma gratuitamente!", "error");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programId: program.id.toString() }),
      });

      if (response.ok) {
        addNotification(
          t(
            "Programma sbloccato! Ora è nella tua libreria.",
            "Program unlocked! Now in your library."
          ),
          "success"
        );
        navigate(`/program/${program.id}/content`);
      } else {
        addNotification(t("Sblocco non riuscito. Riprova.", "Unlock failed. Try again."), "error");
      }
    } catch (error) {
      console.error("Unlock error:", error);
      addNotification(t("Sblocco non riuscito. Riprova.", "Unlock failed. Try again."), "error");
    }
  };

  const isInCart = cartItems.some((item: any) => item.id === programId.toString());
  const isFree = program.price === 0;

  return (
    <div className="page-shell px-6 lg:px-8">
      <SEO
        title={`${program.localizedTitle} | ${t("Protocollo", "Protocol")}`}
        description={program.localizedDescription}
        keywords={`calisthenics, ${program.localizedTitle}, ${t("allenamento", "training")}, skills, ${program.localizedLevel}`}
        image={program.image}
      />

      <div className="container-max">
        <div className="flex items-center justify-between gap-4 mb-10">
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-bold text-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden />
            {t("Torna all'Accademia", "Back to the Academy")}
          </Link>
          <div className="flex items-center gap-2">
            <ShareButton
              compact
              url={
                typeof window !== "undefined"
                  ? `${window.location.origin}/program/${program.id}`
                  : undefined
              }
              title={program.localizedTitle}
              text={program.localizedDescription}
            />
            <LanguageToggle compact />
          </div>
        </div>

        {/* HERO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 order-2 lg:order-1"
          >
            <span className="eyebrow-pill">
              <Flame size={12} aria-hidden />
              {t("Protocollo Ufficiale", "Official Protocol")}
            </span>

            <h1 className="page-title mt-5 text-4xl md:text-6xl">{program.localizedTitle}</h1>

            <p className="body-copy mt-5 text-lg">{program.localizedDescription}</p>

            <div className="flex flex-wrap gap-3 mt-8">
              <MetaPill
                icon={Clock}
                label={t("Durata", "Duration")}
                value={program.localizedDuration}
              />
              <MetaPill
                icon={BarChart}
                label={t("Livello", "Level")}
                value={program.localizedLevel}
              />
              <MetaPill
                icon={Zap}
                label={t("Intensità", "Intensity")}
                value={program.localizedIntensity}
              />
            </div>

            <div className="pt-6 mt-8 border-t border-white/10">
              {isFree ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex flex-col mr-auto">
                    <span className="text-3xl font-bold text-white tracking-tight">
                      {t("Gratuito", "Free")}
                    </span>
                    <span className="meta-mono text-emerald-500 mt-1.5">
                      {t("Accesso Immediato", "Instant Access")}
                    </span>
                  </div>
                  <Button size="lg" onClick={handleUnlockFree}>
                    {t("Inizia ora", "Start now")}
                    <ArrowRight className="w-4 h-4" aria-hidden />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex flex-col mr-auto">
                    <span className="text-4xl font-bold text-white tracking-tight">
                      <span className="text-2xl text-zinc-500">€</span>
                      {program.price}
                    </span>
                    <span className="meta-mono mt-1.5">
                      {t("Accesso illimitato a vita", "Lifetime unlimited access")}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    {isInCart ? (
                      <Button
                        variant="secondary"
                        size="lg"
                        onClick={() => {
                          removeFromCart(program.id.toString());
                          addNotification(t("Programma rimosso", "Program removed"), "error");
                        }}
                        className="text-emerald-400"
                      >
                        {t("Nel carrello", "In cart")}
                        <Check className="w-4 h-4" aria-hidden />
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        onClick={() => {
                          addToCart({
                            id: program.id.toString(),
                            title: program.localizedTitle,
                            price: program.price,
                            image: program.image,
                            level: program.localizedLevel,
                          });
                          addNotification(
                            t("Aggiunto al carrello!", "Added to cart!"),
                            "success"
                          );
                        }}
                      >
                        {t("Aggiungi", "Add")}
                        <ShoppingCart className="w-4 h-4" aria-hidden />
                      </Button>
                    )}

                    <Button to={`/program/${program.id}/content`} variant="secondary" size="lg">
                      {t("Accedi", "Open")}
                      <Play className="w-4 h-4" aria-hidden />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 order-1 lg:order-2"
          >
            <div className="relative group rounded-2xl overflow-hidden aspect-[4/5] lg:aspect-square border border-white/10 bg-zinc-950">
              <Image
                src={program.image}
                alt={program.localizedTitle}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-zinc-950/70 to-transparent" />
            </div>
          </motion.div>
        </div>

        {/* HIGHLIGHTS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-16">
          {curriculum.highlights.map((h, i) => {
            const HIcon = HIGHLIGHT_ICONS[h.icon];
            return (
              <div key={i} className="card flex items-start gap-3 p-5">
                <div className="bg-red-500/10 p-2.5 rounded-lg shrink-0">
                  <HIcon className="w-5 h-5 text-red-500" aria-hidden />
                </div>
                <p className="text-sm font-bold text-zinc-200 leading-snug">
                  {locale === "en" ? h.textEn : h.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* BODY + SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 mt-20">
          <div className="lg:col-span-2 space-y-16">
            <section>
              <SectionHeading
                eyebrow="01 — Struttura"
                title={t("Struttura del Percorso", "Program Structure")}
              />
              <p className="body-copy mt-4 mb-8 text-[15px]">
                {t(
                  "Un'overview delle fasi di allenamento che affronterai. Il programma è diviso in mesocicli studiati per garantire il massimo adattamento fisiologico senza stalli o infortuni.",
                  "An overview of the training phases you will go through. The program is split into mesocycles designed for maximum physiological adaptation without plateaus or injuries."
                )}
              </p>

              <ol className="relative border-l border-white/10 ml-3 space-y-8">
                {PHASES.map((phase) => (
                  <li key={phase.title.it} className="relative pl-8">
                    <span
                      className={`absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-950 border-2 ${phase.dotClass}`}
                      aria-hidden
                    />
                    <h4 className="text-base font-bold tracking-tight text-white">
                      {t(phase.title.it, phase.title.en)}
                    </h4>
                    <p className="prose-block mt-2">{t(phase.body.it, phase.body.en)}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <SectionHeading
                eyebrow="02 — Contenuto"
                title={t("Contenuto del Programma", "Program Content")}
              />
              <p className="body-copy mt-4 mb-8 text-[15px]">
                {t(
                  "Un vero percorso a lezioni: teoria, biomeccanica, tecnica, piani di allenamento, video degli esercizi e consigli bonus. Le prime 2 lezioni sono in anteprima gratuita.",
                  "A real lesson-based journey: theory, biomechanics, technique, workout plans, exercise videos and bonus tips. The first 2 lessons are a free preview."
                )}
              </p>
              <Curriculum curriculum={curriculum} preview />
            </section>

            <section>
              <SectionHeading
                eyebrow="03 — Destinatari"
                title={t("Per chi è pensato?", "Who is it for?")}
              />
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                {TARGET_AUDIENCE.map((item) => (
                  <li key={item.it} className="card flex items-start gap-3 p-5">
                    <div className="bg-red-500/10 p-2 rounded-lg shrink-0 mt-0.5">
                      <UserCheck className="w-4 h-4 text-red-500" aria-hidden />
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {locale === "en" ? item.en : item.it}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <SectionHeading
                eyebrow="04 — Supporto"
                title={t("Domande Frequenti", "Frequently Asked Questions")}
              />
              <div className="space-y-3 mt-6">
                {FAQ_ITEMS.map((faq) => (
                  <div key={faq.question} className="card p-6">
                    <h4 className="text-base font-bold tracking-tight text-white mb-2">
                      <HelpCircle
                        className="w-4 h-4 text-red-500 inline-block mr-2 -mt-0.5"
                        aria-hidden
                      />
                      {locale === "en" ? faq.questionEn : faq.question}
                    </h4>
                    <p className="prose-block">
                      {locale === "en" ? faq.answerEn : faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <aside className="lg:col-span-1">
            <div className="card bg-zinc-900/60 p-7 lg:sticky lg:top-28">
              <h3 className="text-base font-bold tracking-tight text-white">
                {t("Cosa è incluso", "What's included")}
              </h3>

              <ul className="mt-6 space-y-4">
                {program.localizedFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-500" aria-hidden />
                    </div>
                    <span className="text-sm text-zinc-300 leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <hr className="border-white/10 my-7" />

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-zinc-500 shrink-0" aria-hidden />
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {t("Qualità Garantita", "Guaranteed Quality")}
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    {t(
                      "Sviluppato da atleti d'élite. Risultati tangibili con la massima sicurezza articolare.",
                      "Developed by elite athletes. Tangible results with maximum joint safety."
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-7 pt-6 border-t border-white/10 flex flex-col gap-2">
                <span className="meta-mono mb-1">
                  {t("Prossimo passo", "Next step")}
                </span>
                {isFree ? (
                  <Button size="md" onClick={handleUnlockFree} className="w-full">
                    {t("Inizia ora", "Start now")}
                    <ArrowRight className="w-4 h-4" aria-hidden />
                  </Button>
                ) : (
                  <Button
                    size="md"
                    onClick={() =>
                      isInCart
                        ? removeFromCart(program.id.toString())
                        : addToCart({
                            id: program.id.toString(),
                            title: program.localizedTitle,
                            price: program.price,
                            image: program.image,
                            level: program.localizedLevel,
                          })
                    }
                    className="w-full"
                  >
                    {isInCart ? (
                      <>
                        {t("Nel carrello", "In cart")}
                        <Check className="w-4 h-4" aria-hidden />
                      </>
                    ) : (
                      <>
                        {t("Aggiungi", "Add")}
                        <ShoppingCart className="w-4 h-4" aria-hidden />
                      </>
                    )}
                  </Button>
                )}
                <Button
                  to={`/program/${program.id}/content`}
                  variant="secondary"
                  size="md"
                  className="w-full"
                >
                  <ListVideo className="w-4 h-4" aria-hidden />
                  {t("Vedi il programma", "View the program")}
                </Button>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-20 flex items-center gap-3 border-t border-white/10 pt-8">
          <Target className="w-4 h-4 text-zinc-600" aria-hidden />
          <p className="meta-mono">
            {program.localizedLevel} · {program.localizedDuration} · €{program.price}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetails;