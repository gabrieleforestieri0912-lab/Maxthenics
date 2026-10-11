"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  Dumbbell,
  Gauge,
  PersonStanding,
  Repeat,
  CornerDownRight,
} from "lucide-react";
import Button from "./Button";
import { useLanguage } from "../context/LanguageContext";
import { useChatContext } from "../context/ChatContext";
import { QUICK_SUGGESTIONS } from "../lib/sthenox";

const CAPABILITIES = [
  { icon: Dumbbell, key: "tecnica" },
  { icon: Gauge, key: "carico" },
  { icon: Repeat, key: "varianti" },
  { icon: PersonStanding, key: "mobilita" },
] as const;

const CAPABILITY_COPY: Record<string, [[string, string], [string, string]]> = {
  tecnica: [
    ["Tecnica e cue", "Technique and cues"],
    ["Forma, errori comuni e hold per ogni skill.", "Form, common mistakes and holds for every skill."],
  ],
  carico: [
    ["Carico e volume", "Load and volume"],
    ["Serie, rep, riposi e RPE calcolati sul tuo livello.", "Sets, reps, rest and RPE based on your level."],
  ],
  varianti: [
    ["Varianti e regressioni", "Variations and regressions"],
    ["Progressioni giuste e versioni senza attrezzi.", "Right progressions and no-equipment versions."],
  ],
  mobilita: [
    ["Mobilita e prehab", "Mobility and prehab"],
    ["Routine per polsi, spalle, gomiti e scapole.", "Routines for wrists, shoulders, elbows and scapulas."],
  ],
};

const SthenoxSpotlight = () => {
  const { t } = useLanguage();
  const { setIsChatOpen } = useChatContext();

  return (
    <section id="sthenox" className="section-padding relative overflow-hidden scroll-mt-24">
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[640px] h-[640px] bg-red-600/[0.07] rounded-full blur-[130px] pointer-events-none"
        aria-hidden
      />

      <div className="container-max relative">
        <div className="card relative overflow-hidden p-8 md:p-12 lg:p-16">
          <div className="absolute inset-0 opacity-[0.03] bg-grid pointer-events-none" aria-hidden />
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-red-500/40 to-transparent" aria-hidden />

          <div className="relative z-10 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Copy + capability */}
            <div>
              <div className="eyebrow-pill mb-6">
                <Brain size={12} aria-hidden />
                {t("Coach AI Sthenox", "Sthenox AI Coach")}
              </div>
              <h2 className="page-title mb-6 text-4xl md:text-5xl">
                {t("Il coach che", "The coach that")}{" "}
                <span className="text-red-500">{t("non dorme mai", "never sleeps")}</span>
              </h2>
              <div className="space-y-4 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
                <p>
                  {t(
                    "Sthenox risponde in secondi su tecnica, carico, varianti e mobilita. Risposte brevi e dirette: indicazione chiave, come eseguirla, errore comune, progressione.",
                    "Sthenox answers in seconds on technique, load, variations and mobility. Short, direct answers: key cue, how to execute, common mistake, progression."
                  )}
                </p>
                <p>
                  {t(
                    "Ricorda livello, attrezzatura e obiettivo, e adatta ogni consiglio al tuo piano. Se segnali dolore, ti ferma e ti rimanda a un professionista.",
                    "It remembers your level, equipment and goal, and adapts every answer to your plan. If you report pain, it stops you and refers you to a professional."
                  )}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {CAPABILITIES.map(({ icon: Icon, key }, i) => {
                  const [title, desc] = CAPABILITY_COPY[key];
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07, duration: 0.3 }}
                      className="group card card-hover relative overflow-hidden p-4"
                    >
                      <div className="card-lift" aria-hidden />
                      <div className="relative flex items-start gap-3">
                        <span className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 text-red-500 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-500 group-hover:shadow-lg group-hover:shadow-red-900/40 transition-all duration-300 ease-out">
                          <Icon size={17} aria-hidden />
                        </span>
                        <span>
                          <span className="block text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
                            {t(title[0], title[1])}
                          </span>
                          <span className="block text-xs text-zinc-500 leading-relaxed mt-0.5">
                            {t(desc[0], desc[1])}
                          </span>
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button to="/chat" size="lg">
                  {t("Prova Sthenox", "Try Sthenox")}
                  <ArrowRight size={16} aria-hidden />
                </Button>
                <Button to="/calisthenics-room" variant="secondary" size="lg">
                  {t("Coaching umano 1:1", "Human 1:1 coaching")}
                </Button>
              </div>
            </div>

            {/* Mock conversazione */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 overflow-hidden shadow-2xl"
            >
              <div className="flex items-center gap-2.5 px-4 py-3 border-b border-zinc-200 dark:border-white/10">
                <span className="w-8 h-8 rounded-xl bg-linear-to-br from-red-600 to-orange-500 flex items-center justify-center shadow-lg shadow-red-900/30">
                  <Brain size={15} className="text-white" aria-hidden />
                </span>
                <span className="flex flex-col">
                  <span className="text-[13px] font-bold text-zinc-900 dark:text-white tracking-tight leading-none">
                    Sthenox AI
                  </span>
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.15em] mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" aria-hidden />
                    {t("In linea", "Online")}
                  </span>
                </span>
              </div>

              <div className="px-4 py-5 space-y-4">
                <div className="flex justify-end">
                  <p className="max-w-[85%] px-4 py-3 text-[13px] leading-relaxed bg-linear-to-br from-red-600 to-orange-500 text-white rounded-2xl rounded-tr-md shadow-lg shadow-red-900/20">
                    {t(
                      "Ho solo una sbarra. Come arrivo al front lever?",
                      "I only have a pull-up bar. How do I get to the front lever?"
                    )}
                  </p>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[85%]">
                    <p className="meta-mono mb-2 flex items-center gap-1.5">
                      <Brain size={10} className="text-red-500" aria-hidden />
                      Sthenox
                    </p>
                    <div className="px-4 py-3 text-[13px] leading-relaxed bg-zinc-900/[0.04] dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-200 rounded-2xl rounded-tl-md space-y-2">
                      <p>
                        <strong className="font-bold text-zinc-900 dark:text-white">
                          {t("Chiave:", "Key:")}
                        </strong>{" "}
                        {t(
                          "scapole depresse, corpo rigido come una tavola.",
                          "depressed scapulas, body rigid like a board."
                        )}
                      </p>
                      <p>
                        <strong className="font-bold text-zinc-900 dark:text-white">
                          {t("Errore comune:", "Common mistake:")}
                        </strong>{" "}
                        {t("fianchi piegati.", "bent hips.")}
                      </p>
                      <p>
                        <strong className="font-bold text-zinc-900 dark:text-white">
                          {t("Parti da:", "Start from:")}
                        </strong>{" "}
                        {t(
                          "rematore orizzontale 4x8, poi tuck front lever 5x10s.",
                          "horizontal rows 4x8, then tuck front lever 5x10s."
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {QUICK_SUGGESTIONS.slice(0, 3).map((s) => (
                    <Link
                      key={s}
                      to="/chat"
                      onClick={() => setIsChatOpen(false)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-900/[0.03] dark:bg-white/[0.03] px-3 py-1.5 text-[11px] font-bold text-zinc-500 hover:text-zinc-900 hover:border-red-500/40 hover:bg-red-600/[0.06] dark:hover:text-white transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    >
                      <CornerDownRight size={10} aria-hidden />
                      {t(s, s)}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SthenoxSpotlight;
