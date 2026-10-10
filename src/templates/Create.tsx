/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import {
  User,
  Award,
  Activity,
  Target,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Download,
  FileText,
  FileJson,
  Printer,
  Pencil,
  Trash2,
  Layout,
  Dumbbell,
  AlertTriangle,
  CheckCircle2,
  Zap,
  BrainCircuit,
  Shield,
  Ruler,
  Scale,
  Calendar,
  Flame,
  Wind,
  Sprout,
  Crown,
  MoveLeft,
  Crosshair,
  Footprints,
  Circle,
  Building2,
  Orbit,
  Bomb,
  HeartPulse,
  RefreshCw,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { downloadTxt, downloadJson, downloadPdf } from "../lib/exportProgram";
import type { ProgramForExport } from "../lib/exportProgram";
import { safeJsonParse } from "../lib/safeJson";
import SEO from "../components/SEO";
import type { SavedProgram } from "../types/program";

interface LocalizedText {
  it: string;
  en: string;
}

interface ExperienceOption {
  val: string;
  label: LocalizedText;
  icon: LucideIcon;
  color: string;
  desc: LocalizedText;
}

interface WorkoutIntensity {
  value: string;
  label: LocalizedText;
  desc: LocalizedText;
  barColor: string;
}

interface FocusOption {
  val: string;
  label: LocalizedText;
  icon: LucideIcon;
  desc: LocalizedText;
  gradient: string;
}

interface GenderOption {
  val: string;
  label: LocalizedText;
}

const LEVEL_STYLES: Record<string, { bg: string; border: string; glow: string; accent: string; tag: string }> = {
  principiante: {
    bg: "bg-emerald-600/10",
    border: "border-emerald-500/30",
    glow: "shadow-[0_0_30px_rgba(16,185,129,0.12)]",
    accent: "text-emerald-400",
    tag: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  intermedio: {
    bg: "bg-red-600/10",
    border: "border-red-600/30",
    glow: "shadow-[0_0_30px_rgba(220,38,38,0.12)]",
    accent: "text-red-500",
    tag: "bg-red-500/15 text-red-400 border-red-500/30",
  },
  avanzato: {
    bg: "bg-amber-600/10",
    border: "border-amber-500/30",
    glow: "shadow-[0_0_30px_rgba(245,158,11,0.12)]",
    accent: "text-amber-400",
    tag: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
};

const FOCUS_OPTIONS: FocusOption[] = [
  { val: "ipertrofia", icon: Dumbbell, label: { it: "Ipertrofia", en: "Hypertrophy" }, desc: { it: "Aumenta la massa muscolare e definizione", en: "Build muscle mass and definition" }, gradient: "from-red-600/20 to-red-500/5" },
  { val: "forza", icon: Zap, label: { it: "Forza Pura", en: "Pure Strength" }, desc: { it: "Rafforza il sistema neuromuscolare e la potenza", en: "Strengthen the neuromuscular system and power" }, gradient: "from-blue-600/20 to-blue-500/5" },
  { val: "resistenza", icon: Activity, label: { it: "Resistenza", en: "Endurance" }, desc: { it: "Migliora la resistenza cardiovascolare e muscolare", en: "Improve cardiovascular and muscular endurance" }, gradient: "from-green-600/20 to-green-500/5" },
  { val: "skills", icon: Target, label: { it: "Skills & Moves", en: "Skills & Moves" }, desc: { it: "Padroneggia le mosse avanzate", en: "Master advanced moves" }, gradient: "from-violet-600/20 to-violet-500/5" },
  { val: "dimagrimento", icon: Flame, label: { it: "Dimagrimento", en: "Fat Loss" }, desc: { it: "Riduci la massa grassa con allenamenti intensi", en: "Reduce body fat with intense training" }, gradient: "from-orange-600/20 to-orange-500/5" },
  { val: "mobilita", icon: Wind, label: { it: "Mobilità & Recupero", en: "Mobility & Recovery" }, desc: { it: "Aumenta la flessibilità articolare e previeni infortuni", en: "Increase joint mobility and prevent injuries" }, gradient: "from-cyan-600/20 to-cyan-500/5" },
];

const INTENSITY_OPTIONS: WorkoutIntensity[] = [
  { value: "baja", label: { it: "Bassa", en: "Low" }, desc: { it: "Sessione leggera, ideale per recupero o principianti", en: "Light session, ideal for recovery or beginners" }, barColor: "bg-emerald-500" },
  { value: "media", label: { it: "Media", en: "Medium" }, desc: { it: "Allenamento bilanciato — adatto alla maggior parte", en: "Balanced training — suitable for most people" }, barColor: "bg-amber-500" },
  { value: "alta", label: { it: "Alta", en: "High" }, desc: { it: "Massimo impegno — richiede esperienza", en: "Maximum effort — requires experience" }, barColor: "bg-red-500" },
];

const EXPERIENCE_OPTIONS: ExperienceOption[] = [
  { val: "0-1", label: { it: "0-1 anni", en: "0-1 years" }, icon: Sprout, color: "text-emerald-400", desc: { it: "Inizio del percorso", en: "Start of the journey" } },
  { val: "1-3", label: { it: "1-3 anni", en: "1-3 years" }, icon: Zap, color: "text-red-400", desc: { it: "Fondamenti solidi", en: "Solid foundations" } },
  { val: "3-5", label: { it: "3-5 anni", en: "3-5 years" }, icon: Flame, color: "text-orange-400", desc: { it: "Consolidamento", en: "Consolidation" } },
  { val: "5+", label: { it: "5+ anni", en: "5+ years" }, icon: Crown, color: "text-amber-400", desc: { it: "Livello esperto", en: "Expert level" } },
];

const BODY_FOCUS_OPTIONS: { label: LocalizedText; icon: LucideIcon; group: string }[] = [
  { label: { it: "Petto", en: "Chest" }, icon: Dumbbell, group: "Upper" },
  { label: { it: "Schiena", en: "Back" }, icon: MoveLeft, group: "Upper" },
  { label: { it: "Spalle", en: "Shoulders" }, icon: Crosshair, group: "Upper" },
  { label: { it: "Bicipiti", en: "Biceps" }, icon: Dumbbell, group: "Upper" },
  { label: { it: "Tricipiti", en: "Triceps" }, icon: Dumbbell, group: "Upper" },
  { label: { it: "Addominali", en: "Abs" }, icon: Flame, group: "Core" },
  { label: { it: "Core", en: "Core" }, icon: Shield, group: "Core" },
  { label: { it: "Quadricipiti", en: "Quadriceps" }, icon: Footprints, group: "Lower" },
  { label: { it: "Femorali", en: "Hamstrings" }, icon: Footprints, group: "Lower" },
  { label: { it: "Glutei", en: "Glutes" }, icon: Circle, group: "Lower" },
  { label: { it: "Polpacci", en: "Calves" }, icon: Footprints, group: "Lower" },
  { label: { it: "Gambe Completo", en: "Full Legs" }, icon: Building2, group: "Lower" },
];

const GENDER_OPTIONS: GenderOption[] = [
  { val: "male", label: { it: "Maschile", en: "Male" } },
  { val: "female", label: { it: "Femminile", en: "Female" } },
  { val: "other", label: { it: "Altro", en: "Other" } },
  { val: "prefer-not-say", label: { it: "Preferisco non dire", en: "Prefer not to say" } },
];

const DURATION_OPTIONS: { val: string; label: string; sub: LocalizedText }[] = [
  { val: "30", label: "30 min", sub: { it: "Breve & intenso", en: "Short & intense" } },
  { val: "45", label: "45 min", sub: { it: "Standard equilibrato", en: "Balanced standard" } },
  { val: "60", label: "60 min", sub: { it: "Sessione completa", en: "Full session" } },
  { val: "75", label: "75 min", sub: { it: "Allenamento lungo", en: "Long workout" } },
  { val: "90", label: "90 min", sub: { it: "Massimale su tutto", en: "Maximum on everything" } },
];

const TRAINING_TYPES: { val: string; icon: LucideIcon; label: LocalizedText; desc: LocalizedText }[] = [
  { val: "street-workout", icon: Building2, label: { it: "Street Workout", en: "Street Workout" }, desc: { it: "Esplosività, tricking, muscle-up, movimenti dinamici", en: "Explosiveness, tricking, muscle-ups, dynamic moves" } },
  { val: "skill-work", icon: Crosshair, label: { it: "Skill Work", en: "Skill Work" }, desc: { it: "Front Lever, Planche, Handstand, progressioni tecniche", en: "Front Lever, Planche, Handstand, technical progressions" } },
  { val: "freestyle", icon: Orbit, label: { it: "Freestyle & Flow", en: "Freestyle & Flow" }, desc: { it: "Combinazioni creative, transizioni fluide, stile libero", en: "Creative combos, fluid transitions, freestyle" } },
  { val: "power", icon: Bomb, label: { it: "Power & Static Holds", en: "Power & Static Holds" }, desc: { it: "Massimale isometrico, tenute statiche, forza bruta", en: "Max isometrics, static holds, raw strength" } },
  { val: "rings", icon: Circle, label: { it: "Anelli & Gymnastics", en: "Rings & Gymnastics" }, desc: { it: "Lavoro agli anelli, elementi olimpici, controllo", en: "Ring work, gymnastic elements, control" } },
  { val: "hypertrophy", icon: Dumbbell, label: { it: "Ipertrofia & Estetica", en: "Hypertrophy & Aesthetics" }, desc: { it: "Volume alto, definizione, scheda estetica classica", en: "High volume, definition, classic aesthetic split" } },
  { val: "endurance", icon: HeartPulse, label: { it: "Endurance & High Rep", en: "Endurance & High Rep" }, desc: { it: "Resistenza muscolare, high rep, circuiti", en: "Muscular endurance, high reps, circuits" } },
];

const EQUIPMENT_OPTIONS: { val: string; icon: LucideIcon; label: LocalizedText; sub: LocalizedText }[] = [
  { val: "nessuna", icon: User, label: { it: "Solo Corpo Libero", en: "Bodyweight Only" }, sub: { it: "Nessun attrezzo", en: "No equipment" } },
  { val: "sbarra", icon: Building2, label: { it: "Sbarra Trazioni", en: "Pull-up Bar" }, sub: { it: "Pull-up bar", en: "Pull-up bar" } },
  { val: "parallele", icon: MoveLeft, label: { it: "Parallette", en: "Parallettes" }, sub: { it: "Dip bars / P-bars", en: "Dip bars / P-bars" } },
  { val: "anelli", icon: Circle, label: { it: "Anelli", en: "Rings" }, sub: { it: "Anelli ginnici", en: "Gymnastics rings" } },
  { val: "bande", icon: RefreshCw, label: { it: "Bande Elastiche", en: "Resistance Bands" }, sub: { it: "Bande di resistenza", en: "Resistance bands" } },
  { val: "zavorra", icon: Dumbbell, label: { it: "Zavorra", en: "Weighted" }, sub: { it: "Giubbotto / Cintura", en: "Weight vest / Belt" } },
  { val: "base", icon: Building2, label: { it: "Set Base", en: "Basic Set" }, sub: { it: "Sbarra + Parallele", en: "Bar + Parallettes" } },
  { val: "completo", icon: Layers, label: { it: "Completo", en: "Full Kit" }, sub: { it: "Tutto disponibile", en: "Everything available" } },
];

// ─── EXTRACTED COMPONENTS ─────────────────────────────────────────────────

interface StepProgressProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const StepProgress: React.FC<StepProgressProps> = ({ step, setStep }) => {
  const { t } = useLanguage();
  return (
  <div className="space-y-4">
    {[
      { n: 1, label: { it: "Identità", en: "Identity" }, icon: User },
      { n: 2, label: { it: "Livello & Esperienza", en: "Level & Experience" }, icon: Award },
      { n: 3, label: { it: "Logistica", en: "Logistics" }, icon: Activity },
      { n: 4, label: { it: "Obiettivi", en: "Goals" }, icon: Target },
      { n: 5, label: { it: "Riepilogo", en: "Summary" }, icon: CheckCircle2 },
    ].map((s) => {
      const Icon = s.icon;
      const active = step === s.n;
      const done = step > s.n;
      return (
        <button
          key={s.n}
          type="button"
          onClick={() => s.n <= step && setStep(s.n)}
          className={`flex items-center gap-4 w-full text-left transition-all group ${
            s.n > step ? "opacity-40 cursor-default" : "cursor-pointer hover:opacity-100"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all shrink-0 ${
              done
                ? "bg-red-600 text-white shadow-lg shadow-red-900/30"
                : active
                ? "bg-red-600/15 border border-red-600/40 text-red-500 scale-110"
                : "bg-zinc-200 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/5 text-zinc-600 group-hover:border-zinc-300 dark:group-hover:border-white/10"
            }`}
          >
            {done ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`text-xs font-black uppercase tracking-widest transition-colors ${
                done || active ? "text-zinc-900 dark:text-white" : "text-zinc-600"
              }`}
            >
              {t(s.label.it, s.label.en)}
            </p>
            <div className={`h-0.5 rounded-full mt-2 transition-all duration-500 ${done || active ? "bg-red-600" : "bg-zinc-200 dark:bg-zinc-800"}`}>
              <div className={`h-full rounded-full ${done || active ? "bg-red-600 w-full" : "w-0"}`} />
            </div>
          </div>
          {active && (
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
          )}
        </button>
      );
    })}
  </div>
  );
};

interface StepHintProps {
  step: number;
}

const StepHint: React.FC<StepHintProps> = ({ step }) => {
  const { t } = useLanguage();
  const hints: Record<number, { title: LocalizedText; body: LocalizedText }> = {
    1: {
      title: { it: "Perché questi dati?", en: "Why this data?" },
      body: { it: "L'IA usa età, peso e altezza per calcolare il carico, il volume e la densità di allenamento ottimale per te.", en: "The AI uses age, weight and height to calculate the optimal load, volume and training density for you." },
    },
    2: {
      title: { it: "Sii onesto con te stesso", en: "Be honest with yourself" },
      body: { it: "Il livello definisce la difficoltà degli esercizi e la densità del programma. Non farti vedere più bravo di quello che sei.", en: "Your level defines exercise difficulty and program density. Do not oversell your skills." },
    },
    3: {
      title: { it: "Logistica vincente", en: "Winning logistics" },
      body: { it: "Scegliere i giorni giusti è la chiave della consistenza. L'IA costruisce il programma attorno alla tua disponibilità.", en: "Choosing the right days is the key to consistency. The AI builds the program around your availability." },
    },
    4: {
      title: { it: "Più dettagli = programma migliore", en: "More details = better program" },
      body: { it: "Specificare obiettivi e focus permette all'IA di selezionare gli esercizi più efficaci per raggiungere i tuoi risultati.", en: "Specifying goals and focus lets the AI pick the most effective exercises for your results." },
    },
    5: {
      title: { it: "Quasi pronto!", en: "Almost ready!" },
      body: { it: "L'IA genererà un programma completo con esercizi, serie, ripetizioni, recupero e note tecniche — tutto su misura per te.", en: "The AI will generate a complete program with exercises, sets, reps, rest and technical notes — fully tailored to you." },
    },
  };
  const hint = hints[step];
  if (!hint) return null;
  return (
    <div className="bg-white dark:bg-zinc-950/30 border border-zinc-200 dark:border-white/5 rounded-2xl p-5">
      <div className="flex items-start gap-3">
        <BrainCircuit className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">{t(hint.title.it, hint.title.en)}</p>
          <p className="text-[11px] text-zinc-500 leading-relaxed">{t(hint.body.it, hint.body.en)}</p>
        </div>
      </div>
    </div>
  );
};

interface SavedProgramsPanelProps {
  programs: SavedProgram[];
  openExportIdx: number | null;
  setOpenExportIdx: React.Dispatch<React.SetStateAction<number | null>>;
  handleEdit: (index: number) => void;
  handleDelete: (index: number) => void;
  handleExport: (format: "txt" | "json" | "pdf", program: SavedProgram) => void;
  bodyFocus: string[];
}

const SavedProgramsPanel: React.FC<SavedProgramsPanelProps> = ({
  programs,
  openExportIdx,
  setOpenExportIdx,
  handleEdit,
  handleDelete,
  handleExport,
  bodyFocus,
}) => {
  const { t } = useLanguage();
  return (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
      <Layout className="w-6 h-6 text-red-500" />
      {t("I Tuoi Piani", "Your Plans")}
    </h2>
    <p className="text-[11px] text-zinc-500">
      {t("I programmi che hai creato con l'AI. Modifica, esporta o eliminali quando vuoi.", "The programs you created with AI. Edit, export or delete them anytime.")}
    </p>

    {programs.length === 0 ? (
      <div className="bg-white dark:bg-zinc-900/20 border border-dashed border-zinc-200 dark:border-white/10 rounded-[1.5rem] p-10 text-center">
        <Layout className="mx-auto text-zinc-800 mb-4" size={40} />
        <p className="text-zinc-600 text-sm">{t("Nessun programma creato ancora.", "No programs created yet.")}</p>
        <p className="text-zinc-700 text-xs mt-1">{t("Compila il wizard e genera il tuo primo piano!", "Fill in the wizard and generate your first plan!")}</p>
      </div>
    ) : (
      <div className="space-y-3">
        {programs.map((p, i) => {
          const lvlStyle = LEVEL_STYLES[p.level] || LEVEL_STYLES.principiante;
          return (
            <div
              key={i}
              className="group bg-white dark:bg-zinc-900/60 backdrop-blur-sm p-5 rounded-2xl border border-zinc-200 dark:border-white/10 hover:border-red-500/25 transition-all duration-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/80"
            >
              {/* Header row */}
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className={`text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full ${lvlStyle.tag}`}>
                      {p.level}
                    </span>
                    {p.focus && (
                      <span className="text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                        {p.focus}
                      </span>
                    )}
                    {p.intensity && (
                      <span className="text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-white/5">
                        {p.intensity}
                      </span>
                    )}
                  </div>
                  <p className="text-base font-black text-zinc-900 dark:text-white truncate">{p.title}</p>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    {p.daysPerWeek} {t("giorni/sett", "days/week")} · {p.sessionDuration}min ·&nbsp;
                    {p.goals ? `"${p.goals.length > 60 ? p.goals.slice(0, 60) + "..." : p.goals}"` : t("Senza obiettivi", "No goals")}
                  </p>
                </div>
                <div className="flex gap-0.5 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(i)}
                    className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-900/5 dark:hover:bg-white/5 rounded-xl transition-all"
                    title={t("Modifica programma", "Edit program")}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(i)}
                    className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-red-500 hover:bg-red-600/10 rounded-xl transition-all"
                    title={t("Elimina programma", "Delete program")}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setOpenExportIdx(openExportIdx === i ? null : i)}
                      className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      title={t("Esporta", "Export")}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    {openExportIdx === i && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setOpenExportIdx(null)} />
                        <div className="absolute right-0 top-full mt-1 z-50 w-44 bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden">
                          <button
                            onClick={() => handleExport("txt", p)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
                          >
                            <FileText size={14} className="text-zinc-500" />
                            {t("Esporta TXT", "Export TXT")}
                          </button>
                          <button
                            onClick={() => handleExport("json", p)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
                          >
                            <FileJson size={14} className="text-zinc-500" />
                            {t("Esporta JSON", "Export JSON")}
                          </button>
                          <button
                            onClick={() => handleExport("pdf", p)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
                          >
                            <Printer size={14} className="text-zinc-500" />
                            {t("Stampa / PDF", "Print / PDF")}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Meta bar */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[10px] text-zinc-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {p.date}
                </span>
                <span className="flex items-center gap-1">
                  <Dumbbell className="w-3 h-3" /> {p.exercises?.length || 0} {t("esercizi", "exercises")}
                </span>
                {p.age && (
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" /> {p.age} {t("anni", "yrs")}
                  </span>
                )}
                {(bodyFocus || p.bodyFocus || []).length > 0 && (
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3" /> {(bodyFocus || p.bodyFocus || []).join(", ")}
                  </span>
                )}
              </div>

              {/* Exercise preview */}
              {p.exercises && p.exercises.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.exercises.slice(0, 6).map((ex: any, j: number) => (
                    <span
                      key={j}
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-zinc-900/5 dark:bg-white/5 text-zinc-600 rounded-full"
                    >
                      {ex.name || t("Esercizio", "Exercise")}
                    </span>
                  ))}
                  {p.exercises.length > 6 && (
                    <span className="text-[9px] text-zinc-700">+{p.exercises.length - 6} {t("altri", "more")}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    )}
  </div>
  );
};

interface GenerationProgressBarProps {
  isGenerating: boolean;
  generationProgress: number;
}

const GenerationProgressBar: React.FC<GenerationProgressBarProps> = ({ isGenerating, generationProgress }) => {
  const { t } = useLanguage();
  if (!isGenerating) return null;
  return (
    <div className="mt-6 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-red-500 flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          {t("Generazione in corso...", "Generating...")}
        </span>
        <span className="text-[10px] font-black text-zinc-500">{Math.min(100, Math.round(generationProgress))}%</span>
      </div>
      <div className="h-2 bg-zinc-200 dark:bg-zinc-900 rounded-full overflow-hidden border border-zinc-200 dark:border-white/5">
        <div
          className="h-full bg-linear-to-r from-red-600 via-orange-500 to-red-600 rounded-full transition-all duration-500 ease-out shadow-[0_0_20px_rgba(220,38,38,0.4)]"
          style={{ width: `${Math.min(100, generationProgress)}%` }}
        />
      </div>
    </div>
  );
};

// ─── CREATE COMPONENT ───────────────────────────────────────────────────

const Create: React.FC = () => {
  const { user, loading: authLoading, addNotification } = useAuth();
  const { t, locale } = useLanguage();
  const confettiRef = useRef<HTMLDivElement>(null);

  const [programs, setPrograms] = useState<SavedProgram[]>(() => {
    if (typeof window !== "undefined") {
      const parsed = safeJsonParse<unknown>(localStorage.getItem("maxthenicsPrograms"), []);
      return Array.isArray(parsed) ? (parsed as SavedProgram[]) : [];
    }
    return [];
  });

  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // ─── FORM STATE ────────────────────────────────────────────────────────
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [level, setLevel] = useState("principiante");
  const [experience, setExperience] = useState("0-1");
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [trainingType, setTrainingType] = useState("street-workout");
  const [equipment, setEquipment] = useState("nessuna");
  const [focus, setFocus] = useState("ipertrofia");
  const [intensity, setIntensity] = useState("media");
  const [sessionDuration, setSessionDuration] = useState("60");
  const [goals, setGoals] = useState("");
  const [injury, setInjury] = useState("");
  const [bodyFocus, setBodyFocus] = useState<string[]>([]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [openExportIdx, setOpenExportIdx] = useState<number | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);

  // ─── PERSIST ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("maxthenicsPrograms", JSON.stringify(programs));
    }
  }, [programs]);

  // ─── HELPERS ──────────────────────────────────────────────────────────
  const resetForm = () => {
    setGender("male");
    setAge("");
    setWeight("");
    setHeight("");
    setLevel("principiante");
    setExperience("0-1");
    setDaysPerWeek(3);
    setTrainingType("street-workout");
    setEquipment("nessuna");
    setFocus("ipertrofia");
    setIntensity("media");
    setSessionDuration("60");
    setGoals("");
    setInjury("");
    setBodyFocus([]);
    setStep(1);
    setEditingIndex(null);
    setGenerationProgress(0);
  };

  const toggleBodyFocus = (label: string) => {
    setBodyFocus((prev) =>
      prev.includes(label) ? prev.filter((b) => b !== label) : [...prev, label]
    );
  };

  // ─── CELEBRATION ANIMATION ─────────────────────────────────────────────
  const triggerCelebration = () => {
    if (!confettiRef.current) return;
    const container = confettiRef.current;
    container.innerHTML = "";
    const COLORS = [
      "from-red-500 to-orange-400",
      "from-orange-500 to-yellow-400",
      "from-red-600 to-red-400",
      "from-white to-red-400",
      "from-amber-500 to-yellow-400",
      "from-emerald-500 to-teal-400",
    ];
    const N = 120;
    for (let idx = 0; idx < N; idx++) {
      const el = document.createElement("span");
      const col = COLORS[idx % COLORS.length];
      const elSize = Math.random() * 12 + 6;
      const vx = Math.random() * 100 - 50;
      const vy = Math.random() * 80 - 20;
      const dur = Math.random() * 1800 + 1200;
      const dly = Math.random() * 500;
      const isSquare = Math.random() > 0.5;

      Object.assign(el.style, {
        position: "fixed",
        top: "-20px",
        left: Math.random() * 100 + "vw",
        width: elSize + "px",
        height: elSize + "px",
        borderRadius: isSquare ? "3px" : "50%",
        background: "linear-gradient(" + col + ")",
        pointerEvents: "none",
        zIndex: "9999",
        opacity: "1",
        filter: "brightness(1.1)",
      });

      container.appendChild(el);

      let startedAt: number | null = null;
      function tick(ts: number): void {
        if (startedAt === null) startedAt = ts;
        const progress = Math.max(0, (ts - startedAt - dly) / dur);
        if (progress >= 1) {
          el.remove();
          return;
        }
        el.style.top = (8 + progress * progress * 100 + progress * 260) + "px";
        el.style.left = String(vx + progress * vy * 0.6);
        el.style.opacity = String(Math.max(0, 1 - progress * 0.9));
        el.style.transform = `rotate(${progress * 720}deg) scale(${1 - progress * 0.3})`;
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
  };

  // ─── SUBMIT ───────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGenerationProgress(0);

    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 25;
      });
    }, 400);

    try {
      if (!age || !weight || !height) {
        throw new Error(t("Completa tutti i campi obbligatori (età, peso, altezza).", "Fill in all required fields (age, weight, height)."));
      }

      const preferences = {
        level:
          level === "principiante" ? "Beginner" : level === "intermedio" ? "Intermediate" : "Advanced",
        trainingType,
        goal: focus,
        daysPerWeek,
        equipment,
        intensity,
        sessionDuration,
        bodyFocus: bodyFocus.join(", "),
        age,
        weight,
        height,
        gender,
        experience,
        goals: goals || "",
        injuries: injury || "",
      };

      const token = localStorage.getItem("token");
      let userId = "";
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          userId = payload.userId || "";
        } catch { /* ignore */ }
      }
      const response = await fetch("/api/ai/generate-program", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ preferences, userId }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error((data && data.message) || t("Errore nella generazione", "Generation error"));
      if (!data) throw new Error(t("Risposta non valida dal server", "Invalid server response"));

      setGenerationProgress(95);

      const newProgram: SavedProgram = {
        id: data._id || String(Date.now()),
        userId: userId || undefined,
        title: data.title || t("Programma Personalizzato", "Custom Program"),
        description: data.description || "",
        level: data.level || "Intermediate",
        price: data.price || 0,
        exercises: data.exercises || [],
        date: new Date().toLocaleDateString(locale === "en" ? "en-US" : "it-IT", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
        trainingType,
        daysPerWeek,
        goals,
        age,
        weight,
        height,
        experience,
        equipment,
        focus,
        injury,
        gender,
        intensity,
        sessionDuration,
        bodyFocus,
      };

      if (editingIndex !== null) {
        const updated = [...programs];
        updated[editingIndex] = newProgram;
        setPrograms(updated);
        addNotification(t("Programma aggiornato con successo!", "Program updated successfully!"), "success");
      } else {
        setPrograms([...programs, newProgram]);
        addNotification(t("Programma generato con successo!", "Program generated successfully!"), "success");
      }

      setGenerationProgress(100);
      triggerCelebration();

      setTimeout(() => {
        resetForm();
      }, 800);
    } catch (error: any) {
      addNotification(error.message || t("Errore nella generazione del programma", "Error generating the program"));
      setGenerationProgress(0);
    } finally {
      setIsGenerating(false);
    }
  };

  // ─── EDIT / DELETE / EXPORT ────────────────────────────────────────────
  const handleEdit = (index: number) => {
    const p = programs[index];
    setGender(p.gender || "male");
    setAge(p.age || "");
    setWeight(p.weight || "");
    setHeight(p.height || "");
    setLevel(p.level || "principiante");
    setExperience(p.experience || "0-1");
    setDaysPerWeek(p.daysPerWeek || 3);
    setTrainingType(p.trainingType || "street-workout");
    setEquipment(p.equipment || "nessuna");
    setFocus(p.focus || "ipertrofia");
    setIntensity(p.intensity || "media");
    setSessionDuration(p.sessionDuration || "60");
    setGoals(p.goals || "");
    setInjury(p.injury || "");
    setBodyFocus(p.bodyFocus || []);
    setEditingIndex(index);
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (index: number) => {
    const updated = programs.filter((_, i) => i !== index);
    setPrograms(updated);
  };

  const handleExport = (format: "txt" | "json" | "pdf", program: SavedProgram) => {
    setOpenExportIdx(null);
    const flatExercises: { name: string; sets: number; reps: string; rest: string; notes?: string }[] = (program.exercises || []).map((ex: any) => ({
      name: ex.exercise?.name || ex.name || t('Esercizio', 'Exercise'),
      sets: ex.sets ?? 3,
      reps: ex.reps ?? '10',
      rest: ex.rest ?? '60s',
      notes: ex.notes,
    }));
    const p: ProgramForExport = {
      _id: program.id,
      title: program.title,
      description: program.description,
      level: program.level,
      price: program.price,
      exercises: flatExercises,
      date: program.date,
      daysPerWeek: program.daysPerWeek,
      goals: program.goals,
      age: program.age,
      weight: program.weight,
      height: program.height,
      experience: program.experience,
      equipment: program.equipment,
      focus: program.focus,
      injury: program.injury,
    };
    if (format === "txt") downloadTxt(p);
    else if (format === "json") downloadJson(p);
    else downloadPdf(p);
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // ─── AUTH GUARD ─────────────────────────────────────────────────────────
  // While auth resolves the wizard renders immediately; actions requiring
  // a user are guarded at submit time. Logged-out users get a login prompt.
  if (!authLoading && !user) {
    return (
      <div className="page-shell flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-3">{t("Accedi per creare", "Log in to create")}</h2>
          <p className="text-zinc-500 text-sm mb-6">{t("Devi accedere per generare il tuo programma personalizzato.", "You need to log in to generate your custom program.")}</p>
          <Link
            to="/login"
            className="inline-block px-8 py-3 bg-linear-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-900/30"
          >
            {t("Accedi", "Log in")}
          </Link>
        </div>
      </div>
    );
  }

  // ─── STEP RENDERING ────────────────────────────────────────────────────
  const renderStep = () => {
    switch (step) {
      // ─── STEP 1 — IDENTITÀ ATLETICA ─────────────────────────────────
      case 1:
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-red-600 to-orange-500 flex items-center justify-center shadow-lg shadow-red-900/20">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white">{t("Identità Atletica", "Athletic Identity")}</h3>
                <p className="text-xs text-zinc-500 mt-0.5">{t("Definisci il tuo profilo per un programma su misura", "Define your profile for a tailored program")}</p>
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-3">
              <label className="block meta-mono">
                {t("Sesso", "Gender")} <span className="text-zinc-600 font-normal ml-1">{t("(opzionale)", "(optional)")}</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {GENDER_OPTIONS.map((g) => (
                  <button
                    key={g.val}
                    type="button"
                    onClick={() => setGender(g.val)}
                    className={`p-3.5 rounded-2xl border transition-all text-center ${
                      gender === g.val
                        ? "bg-red-600/10 border-red-600/40 shadow-[0_0_16px_rgba(220,38,38,0.1)]"
                        : "bg-white dark:bg-zinc-950/40 border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/15"
                    }`}
                  >
                    <p className={`text-[10px] font-bold text-zinc-700 dark:text-zinc-300 leading-tight ${gender === g.val ? "text-zinc-900 dark:text-white" : ""}`}>
                      {t(g.label.it, g.label.en)}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Age / Weight / Height */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  val: age,
                  set: setAge,
                  label: { it: "Età", en: "Age" },
                  icon: Calendar,
                  unit: { it: "anni", en: "yrs" },
                  ph: { it: "Es. 25", en: "E.g. 25" },
                  cls: "bg-linear-to-br from-red-600/5 to-orange-600/5",
                  iconCls: "text-red-500",
                },
                {
                  val: weight,
                  set: setWeight,
                  label: { it: "Peso", en: "Weight" },
                  icon: Scale,
                  unit: { it: "kg", en: "kg" },
                  ph: { it: "Es. 75", en: "E.g. 75" },
                  cls: "bg-linear-to-br from-blue-600/5 to-red-600/5",
                  iconCls: "text-blue-400",
                },
                {
                  val: height,
                  set: setHeight,
                  label: { it: "Altezza", en: "Height" },
                  icon: Ruler,
                  unit: { it: "cm", en: "cm" },
                  ph: { it: "Es. 180", en: "E.g. 180" },
                  cls: "bg-linear-to-br from-emerald-600/5 to-blue-600/5",
                  iconCls: "text-emerald-400",
                },
              ].map((field) => {
                const FI = field.icon;
                return (
                  <div key={field.label.it} className={`rounded-2xl border border-zinc-200 dark:border-white/5 ${field.cls} p-4`}>
                    <div className="flex items-center gap-2 mb-3">
                      <FI className={`w-4 h-4 ${field.iconCls}`} />
                      <span className="meta-mono">{t(field.label.it, field.label.en)}</span>
                      <span className="text-[10px] text-zinc-600 ml-auto">{t(field.unit.it, field.unit.en)}</span>
                    </div>
                    <input
                      type="number"
                      value={field.val}
                      onChange={(e) => field.set(e.target.value)}
                      placeholder={t(field.ph.it, field.ph.en)}
                      className="w-full bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white font-bold text-2xl focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/40 transition-all placeholder:text-zinc-700 placeholder:font-normal placeholder:text-sm"
                    />
                  </div>
                );
              })}
            </div>

            {(age || weight || height) && (
              <div className="bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/5 rounded-2xl p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  {t("Usiamo questi dati per calcolare", "We use this data to calculate")}{" "}
                  <span className="text-zinc-900 dark:text-white font-bold">{t("metabolismo", "metabolism")}</span>,{" "}
                  <span className="text-zinc-900 dark:text-white font-bold">{t("carico di lavoro", "workload")}</span> {t("e", "and")}{" "}
                  <span className="text-zinc-900 dark:text-white font-bold">{t("volume ideale", "ideal volume")}</span> {t("del programma.", "of the program.")}
                </p>
              </div>
            )}
          </div>
        );

      // ─── STEP 2 — LIVELLO & ESPERIENZA ───────────────────────────────
      case 2:
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-red-600 to-orange-500 flex items-center justify-center shadow-lg shadow-red-900/20">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white">{t("Livello & Esperienza", "Level & Experience")}</h3>
                <p className="text-xs text-zinc-500 mt-0.5">{t("Scegli il tuo livello: l'IA lo rispeterà in ogni dettaglio", "Choose your level: the AI will respect it in every detail")}</p>
              </div>
            </div>

            {/* Level cards */}
            <div className="space-y-3">
              <p className="meta-mono">{t("Livello di Abilità", "Skill Level")}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {
                    val: "principiante",
                    icon: Sprout,
                    title: { it: "Principiante", en: "Beginner" },
                    subt: { it: "0 – 1 anni di esperienza", en: "0 – 1 years of experience" },
                    points: [
                      { it: "Fondamenti posturali", en: "Postural foundations" },
                      { it: "Progressioni graduali", en: "Gradual progressions" },
                      { it: "Volume moderato", en: "Moderate volume" },
                    ],
                    style: LEVEL_STYLES.principiante,
                  },
                  {
                    val: "intermedio",
                    icon: Zap,
                    title: { it: "Intermedio", en: "Intermediate" },
                    subt: { it: "1 – 3 anni di esperienza", en: "1 – 3 years of experience" },
                    points: [
                      { it: "Tecniche complesse", en: "Complex techniques" },
                      { it: "Periodizzazione", en: "Periodization" },
                      { it: "Volume progressivo", en: "Progressive volume" },
                    ],
                    style: LEVEL_STYLES.intermedio,
                  },
                  {
                    val: "avanzato",
                    icon: Flame,
                    title: { it: "Avanzato", en: "Advanced" },
                    subt: { it: "3+ anni di esperienza", en: "3+ years of experience" },
                    points: [
                      { it: "Skills avanzate", en: "Advanced skills" },
                      { it: "Massimo volume", en: "Maximum volume" },
                      { it: "Periodizzazione completa", en: "Full periodization" },
                    ],
                    style: LEVEL_STYLES.avanzato,
                  },
                ].map((lvl) => (
                  <button
                    key={lvl.val}
                    type="button"
                    onClick={() => setLevel(lvl.val)}
                    className={`p-5 rounded-3xl border-2 transition-all text-left group relative overflow-hidden ${
                      level === lvl.val
                        ? `${lvl.style.bg} ${lvl.style.border} ${lvl.style.glow} scale-[1.02]`
                        : "bg-white dark:bg-zinc-950/40 border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/15 hover:bg-zinc-100 dark:hover:bg-zinc-950/60"
                    }`}
                  >
                    <div
                      className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] -mr-10 -mt-10 transition-all ${
                        level === lvl.val ? "opacity-40" : "opacity-0"
                      }`}
                    />
                    <lvl.icon
                      size={28}
                      className={`mb-3 ${level === lvl.val ? lvl.style.accent : "text-zinc-600"}`}
                      aria-hidden
                    />
                    <p className={`text-base font-bold mb-0.5 transition-colors ${level === lvl.val ? lvl.style.accent : "text-zinc-900 dark:text-white"}`}>
                      {t(lvl.title.it, lvl.title.en)}
                    </p>
                    <p className="text-[11px] text-zinc-500 mb-4">{t(lvl.subt.it, lvl.subt.en)}</p>
                    <div className="space-y-1.5">
                      {lvl.points.map((pt) => (
                        <div key={pt.it} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${level === lvl.val ? "bg-red-500" : "bg-zinc-700"}`} />
                          <p className={`text-[11px] font-medium leading-snug ${level === lvl.val ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-600"}`}>
                            {t(pt.it, pt.en)}
                          </p>
                        </div>
                      ))}
                    </div>
                    {level === lvl.val && (
                      <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/40">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" aria-hidden />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience pills */}
            <div>
              <label className="block meta-mono mb-4">
                {t("Anni di Allenamento", "Years of Training")}
              </label>
              <div className="flex gap-2">
                {EXPERIENCE_OPTIONS.map((exp) => (
                  <button
                    key={exp.val}
                    type="button"
                    onClick={() => setExperience(exp.val)}
                    className={`flex-1 py-4 rounded-2xl border transition-all text-center group ${
                      experience === exp.val
                        ? "bg-red-600/12 border-red-600/40 shadow-[0_0_20px_rgba(220,38,38,0.1)]"
                        : "bg-white dark:bg-zinc-950/40 border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/15"
                    }`}
                  >
                    <exp.icon
                      size={22}
                      className={`mx-auto mb-1.5 transition-colors ${
                        exp.color
                      } ${experience === exp.val ? "scale-110" : "opacity-50 group-hover:opacity-80"}`}
                      aria-hidden
                    />
                    <p className={`text-xs font-bold transition-colors ${experience === exp.val ? "text-zinc-900 dark:text-white" : "text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300"}`}>
                      {t(exp.label.it, exp.label.en)}
                    </p>
                    <p className="text-[10px] text-zinc-600 mt-0.5">{t(exp.desc.it, exp.desc.en)}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      // ─── STEP 3 — LOGISTICA ──────────────────────────────────────────
      case 3:
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-red-600 to-orange-500 flex items-center justify-center shadow-lg shadow-red-900/20">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white">{t("Configura il Tuo Allenamento", "Set Up Your Training")}</h3>
                <p className="text-xs text-zinc-500 mt-0.5">{t("Completa i dettagli logistici e scegli come vuoi allenarti", "Fill in the logistics details and choose how you want to train")}</p>
              </div>
            </div>

            {/* Days/week + session duration */}
            <div className="space-y-5">
              <div>
                <label className="block meta-mono mb-5">
                  {t("Frequenza Settimanale", "Weekly Frequency")}
                </label>
                <div className="flex items-center gap-6 bg-white dark:bg-zinc-950/30 rounded-2xl p-5 border border-zinc-200 dark:border-white/5">
                  <input
                    type="range"
                    min="2"
                    max="7"
                    value={daysPerWeek}
                    onChange={(e) => setDaysPerWeek(parseInt(e.target.value))}
                    className="grow accent-red-600 h-3 bg-zinc-200 dark:bg-zinc-800 rounded-xl cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${((daysPerWeek - 2) / 5) * 100}%, #27272a ${((daysPerWeek - 2) / 5) * 100}%, #27272a 100%)`,
                    }}
                  />
                  <div className="flex gap-1.5">
                    {Array.from({ length: 7 }, (_, i) => i + 2).map((d) => (
                      <span
                        key={d}
                        className={`w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center transition-all duration-300 ${
                          daysPerWeek >= d
                            ? "bg-linear-to-r from-red-500 to-orange-500 text-white shadow-[0_0_12px_rgba(220,38,38,0.6)] scale-110"
                            : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600"
                        }`}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-center mt-4">
                  <span className="text-4xl font-black bg-linear-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                    {daysPerWeek}
                  </span>
                  <span className="text-zinc-600 text-sm font-medium ml-1">{t("giorni / settimana", "days / week")}</span>
                </p>
              </div>

              {/* Session duration */}
              <div>
                <label className="block meta-mono mb-4">
                  {t("Durata Sessione Stimata", "Estimated Session Length")}
                </label>
                <div className="flex gap-2">
                  {DURATION_OPTIONS.map((d) => (
                    <button
                      key={d.val}
                      type="button"
                      onClick={() => setSessionDuration(d.val)}
                      className={`flex-1 py-3.5 rounded-2xl border transition-all text-center ${
                        sessionDuration === d.val
                          ? "bg-red-600/12 border-red-600/40 shadow-[0_0_16px_rgba(220,38,38,0.1)]"
                          : "bg-white dark:bg-zinc-950/40 border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/15"
                      }`}
                    >
                      <p className={`text-base font-black transition-colors ${sessionDuration === d.val ? "text-zinc-900 dark:text-white" : "text-zinc-500"}`}>
                        {d.label}
                      </p>
                      <p className="text-[10px] text-zinc-600 mt-0.5">{t(d.sub.it, d.sub.en)}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Training Type */}
            <div>
              <label className="block meta-mono mb-4">
                {t("Tipo di Allenamento", "Training Type")}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {TRAINING_TYPES.map((tr) => (
                  <button
                    key={tr.val}
                    type="button"
                    onClick={() => setTrainingType(tr.val)}
                    className={`p-3 rounded-2xl border-2 transition-all text-center group ${
                      trainingType === tr.val
                        ? "bg-red-600/10 border-red-600/40 shadow-[0_0_20px_rgba(220,38,38,0.12)]"
                        : "bg-white dark:bg-zinc-950/40 border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/15"
                    }`}
                  >
                    <tr.icon
                      size={20}
                      className={`mx-auto mb-1 transition-colors ${
                        trainingType === tr.val
                          ? "text-red-500"
                          : "text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300"
                      }`}
                      aria-hidden
                    />
                    <p className={`text-[11px] font-bold leading-tight ${trainingType === tr.val ? "text-zinc-900 dark:text-white" : "text-zinc-600 dark:text-zinc-400"}`}>
                      {t(tr.label.it, tr.label.en)}
                    </p>
                    <p className="text-[9px] text-zinc-600 mt-1 leading-snug">{t(tr.desc.it, tr.desc.en)}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div>
              <label className="block meta-mono mb-4">
                {t("Attrezzatura Disponibile", "Available Equipment")}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {EQUIPMENT_OPTIONS.map((eq) => (
                  <button
                    key={eq.val}
                    type="button"
                    onClick={() => setEquipment(eq.val)}
                    className={`p-3 rounded-2xl border transition-all text-center group ${
                      equipment === eq.val
                        ? "bg-red-600/10 border-red-600/40 shadow-[0_0_16px_rgba(220,38,38,0.1)]"
                        : "bg-white dark:bg-zinc-950/40 border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/15"
                    }`}
                  >
                    <eq.icon
                      size={18}
                      className={`mx-auto mb-1 transition-colors ${
                        equipment === eq.val ? "text-red-500" : "text-zinc-600"
                      }`}
                      aria-hidden
                    />
                    <p className={`text-[10px] font-bold leading-tight ${equipment === eq.val ? "text-zinc-900 dark:text-white" : "text-zinc-600 dark:text-zinc-400"}`}>{t(eq.label.it, eq.label.en)}</p>
                    <p className="text-[9px] text-zinc-600 mt-0.5">{t(eq.sub.it, eq.sub.en)}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity */}
            <div>
              <label className="block meta-mono mb-4">
                {t("Intensità di Allenamento", "Training Intensity")}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {INTENSITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setIntensity(opt.value)}
                    className={`p-4 rounded-2xl border transition-all text-left group ${
                      intensity === opt.value
                        ? "bg-red-600/10 border-red-600/40 shadow-[0_0_20px_rgba(220,38,38,0.1)]"
                        : "bg-white dark:bg-zinc-950/40 border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className={`w-4 h-4 ${intensity === opt.value ? "text-red-500" : "text-zinc-600"}`} />
                      <p className={`text-sm font-black ${intensity === opt.value ? "text-zinc-900 dark:text-white" : "text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300"}`}>
                        {t(opt.label.it, opt.label.en)}
                      </p>
                    </div>
                    <p className="text-[10px] text-zinc-600 leading-snug">{t(opt.desc.it, opt.desc.en)}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      // ─── STEP 4 — OBIETTIVI & FOCUS ──────────────────────────────────
      case 4:
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-red-600 to-orange-500 flex items-center justify-center shadow-lg shadow-red-900/20">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white">{t("Obiettivi & Focus", "Goals & Focus")}</h3>
                <p className="text-xs text-zinc-500 mt-0.5">{t("Specifica cosa vuoi raggiungere e dove concentrarti", "Specify what you want to achieve and where to focus")}</p>
              </div>
            </div>

            {/* Focus principale */}
            <div>
              <label className="block meta-mono mb-5">
                {t("Focus Principale", "Main Focus")}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {FOCUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setFocus(opt.val)}
                    className={`p-4 rounded-2xl border-2 transition-all text-center relative overflow-hidden group ${
                      focus === opt.val ? "border-red-600/50 shadow-lg shadow-red-900/10" : "bg-white dark:bg-zinc-950/40 border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/15"
                    }`}
                  >
                    <div className={`absolute inset-0 bg-linear-to-br ${opt.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    <div className="relative z-10">
                      <opt.icon
                        size={20}
                        className={`mb-1.5 transition-colors ${
                          focus === opt.val
                            ? "text-red-500"
                            : "text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300"
                        }`}
                        aria-hidden
                      />
                      <p className={`text-xs font-bold ${focus === opt.val ? "text-zinc-900 dark:text-white" : "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200"}`}>
                        {t(opt.label.it, opt.label.en)}
                      </p>
                      <p className="text-[10px] text-zinc-600 mt-0.5 leading-snug">{t(opt.desc.it, opt.desc.en)}</p>
                    </div>
                    {focus === opt.val && (
                      <div className="absolute top-2 right-2 z-10">
                        <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-700/30">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Body parts focus */}
            <div>
              <label className="block meta-mono mb-2">
                {t("Aree del Corpo da Lavorare", "Body Areas to Train")}{" "}
                <span className="text-zinc-600 font-normal normal-case ml-1">{t("(opzionale)", "(optional)")}</span>
              </label>
              <p className="text-[11px] text-zinc-600 mb-4">
                {t("Seleziona le aree su cui vuoi concentrarti di più.", "Select the areas you want to focus on most.")}{" "}
                {bodyFocus.length > 0 ? (
                  <span className="text-red-400 font-bold"> {bodyFocus.length} {t("selezionate", "selected")}</span>
                ) : null}
              </p>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {BODY_FOCUS_OPTIONS.map((bf) => {
                  const label = t(bf.label.it, bf.label.en);
                  const active = bodyFocus.includes(label);
                  return (
                    <button
                      key={bf.label.it}
                      type="button"
                      onClick={() => toggleBodyFocus(label)}
                      className={`p-3 rounded-xl border transition-all text-center ${
                        active
                          ? "bg-red-600/12 border-red-600/40 text-zinc-900 dark:text-white shadow-[0_0_12px_rgba(220,38,38,0.1)]"
                          : "bg-white dark:bg-zinc-950/40 border-zinc-200 dark:border-white/5 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-white/10"
                      }`}
                    >
                      <bf.icon
                        size={16}
                        className={`mx-auto transition-colors ${
                          active
                            ? "text-red-500"
                            : "text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300"
                        }`}
                        aria-hidden
                      />
                      <p className="text-[10px] font-bold mt-1">{label}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Goals */}
            <div>
              <label className="block meta-mono mb-2">
                {t("I Tuoi Obiettivi Specifici", "Your Specific Goals")}
              </label>
              <div className="relative">
                <textarea
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  rows={4}
                  placeholder={t("Es. Sbloccare la Planche, aumentare le trazioni senza aiuto, migliorare la resistenza per un trail di 10km...", "E.g. Unlock the Planche, increase unassisted pull-ups, improve endurance for a 10km trail...")}
                  className="w-full bg-white dark:bg-zinc-950/60 border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-4 text-zinc-900 dark:text-white text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/30 transition-all placeholder:text-zinc-700 resize-none"
                />
                <div className="absolute bottom-3 right-3 text-[10px] text-zinc-700">
                  {goals.length > 0 ? `${goals.length} ${t("caratteri", "characters")}` : ""}
                </div>
              </div>
            </div>

            {/* Injury */}
            <div>
              <label className="block meta-mono mb-2">
                {t("Condizioni Mediche o Infortuni", "Medical Conditions or Injuries")}{" "}
                <span className="text-zinc-600 font-normal normal-case ml-1">{t("(opzionale)", "(optional)")}</span>
              </label>
              <div className="relative">
                <textarea
                  value={injury}
                  onChange={(e) => setInjury(e.target.value)}
                  rows={3}
                  placeholder={t("Descrivi eventuali infortuni, limitazioni fisiche, dolori articolari o patologie che dobbiamo considerare...", "Describe any injuries, physical limitations, joint pain or conditions we should consider...")}
                  className="w-full bg-white dark:bg-zinc-950/60 border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-4 text-zinc-900 dark:text-white text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/30 transition-all placeholder:text-zinc-700 resize-none"
                />
                {injury && (
                  <div className="absolute top-3 right-3 text-amber-500">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                )}
              </div>
              <p className="text-[10px] text-zinc-600 mt-2 flex items-center gap-1.5">
                <Shield className="w-3 h-3" />
                {t("I tuoi dati sono riservati e usati solo per personalizzare il programma.", "Your data is private and only used to personalize the program.")}
              </p>
            </div>
          </div>
        );

      // ─── STEP 5 — RIEPILOGO ──────────────────────────────────────────
      case 5:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-red-600 to-orange-500 flex items-center justify-center shadow-lg shadow-red-900/20">
                <Layout className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white">{t("Riepilogo Finale", "Final Summary")}</h3>
                <p className="text-xs text-zinc-500 mt-0.5">{t("Verifica i dati prima di generare il tuo programma", "Review your data before generating your program")}</p>
              </div>
            </div>

            {/* Grand Summary Card */}
            <div className="bg-linear-to-br from-zinc-200 via-white to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-black border border-zinc-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden">
              {/* Subtle glow border */}
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-red-600/5 via-transparent to-orange-600/5 pointer-events-none" />

              {/* Header row */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">
                  {level.charAt(0).toUpperCase() + level.slice(1)} — {focus}
                </span>
                <span className="text-[10px] font-bold text-zinc-600">
                  {sessionDuration}min / {t("sessione", "session")} · {daysPerWeek}x {t("settimana", "week")}
                </span>
              </div>

              <div className="h-px bg-linear-to-r from-red-600/30 via-zinc-200 dark:via-zinc-800 to-transparent relative z-10" />

              {/* Profile row */}
              <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: { it: "Età", en: "Age" }, value: `${age} ${t("anni", "yrs")}`, col: "text-red-400" },
                  { label: { it: "Peso", en: "Weight" }, value: `${weight} kg`, col: "text-blue-400" },
                  { label: { it: "Altezza", en: "Height" }, value: `${height} cm`, col: "text-emerald-400" },
                  { label: { it: "Esperienza", en: "Experience" }, value: `${experience} ${t("anni", "yrs")}`, col: "text-amber-400" },
                ].map((stat) => (
                  <div key={stat.label.it} className="bg-white dark:bg-zinc-950/60 rounded-xl p-3.5 border border-zinc-200 dark:border-white/5">
                    <p className="text-[9px] font-black uppercase tracking-wider text-zinc-600 mb-1">{t(stat.label.it, stat.label.en)}</p>
                    <p className={`text-base font-black ${stat.col}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="h-px bg-zinc-900/5 dark:bg-white/5 relative z-10" />

              {/* Detail rows */}
              {[
                {
                  label: { it: "Attrezzatura", en: "Equipment" },
                  value: equipment.charAt(0).toUpperCase() + equipment.slice(1),
                  icon: Dumbbell,
                  iconCol: "text-orange-400",
                },
                {
                  label: { it: "Intensità", en: "Intensity" },
                  value: intensity.charAt(0).toUpperCase() + intensity.slice(1),
                  icon: Zap,
                  iconCol: "text-red-400",
                },
                ...(bodyFocus.length > 0
                  ? [
                      {
                        label: { it: "Aree Focus", en: "Focus Areas" },
                        value: bodyFocus.join(", "),
                        icon: Target,
                        iconCol: "text-emerald-400",
                      },
                    ]
                  : []),
              ].map((row) => (
                <div key={row.label.it} className="relative z-10 flex items-center justify-between py-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                    <row.icon className={`w-3.5 h-3.5 ${row.iconCol}`} />
                    {t(row.label.it, row.label.en)}
                  </span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">{row.value}</span>
                </div>
              ))}

              {goals && (
                <>
                  <div className="h-px bg-zinc-900/5 dark:bg-white/5 relative z-10" />
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500 mb-2">{t("Obiettivi", "Goals")}</p>
                    <div className="bg-white dark:bg-zinc-950/60 rounded-xl p-4 border border-zinc-200 dark:border-white/5 border-l-2 border-l-red-500/60">
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">&ldquo;{goals}&rdquo;</p>
                    </div>
                  </div>
                </>
              )}

              {injury && (
                <>
                  <div className="h-px bg-zinc-900/5 dark:bg-white/5 relative z-10" />
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      {t("Note su Infortuni / Condizioni", "Injury / Condition Notes")}
                    </p>
                    <div className="bg-amber-950/20 rounded-xl p-4 border border-amber-500/10 border-l-2 border-l-amber-500/60">
                      <p className="text-sm text-amber-200/80 leading-relaxed">&ldquo;{injury}&rdquo;</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Injury reminder */}
            {!injury && (
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-500 mb-0.5">{t("Nessuna nota su infortuni", "No injury notes")}</p>
                  <p className="text-[11px] text-zinc-500 leading-snug">
                    {t("Il programma sarà progettato senza adattamenti per infortuni specifici.", "The program will be designed without adaptations for specific injuries.")}
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const canProceedStep1 = age && weight && height;
  const canProceedStep2 = true;
  const canProceedStep3 = daysPerWeek >= 2;
  const canProceedStep4 = !!focus.trim();

  const canNext =
    (step === 1 && canProceedStep1) ||
    (step === 2 && canProceedStep2) ||
    (step === 3 && canProceedStep3) ||
    (step === 4 && canProceedStep4);

  // ─── RENDER ────────────────────────────────────────────────────────────
  return (
    <>
      <SEO
        title={t("Crea Programma", "Create Program")}
        description={t("Crea il tuo programma di calisthenics personalizzato con Maxthenics.", "Create your custom calisthenics program with Maxthenics.")}
        keywords={t("creare programma calisthenics, personalizza workout, allenamento personalizzato", "create calisthenics program, customize workout, personalized training")}
      />
      <div className="page-shell relative overflow-hidden px-6 lg:px-8">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-600/4 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-600/4 rounded-full blur-[140px] pointer-events-none -z-10" />
        {/* Confetti container */}
          <div ref={confettiRef} className="fixed inset-0 [z-index:var(--z-overlay)] pointer-events-none" />

        <div className="max-w-6xl mx-auto">
          {/* Page header */}
          <div className="text-center mb-12 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-[0.2em] mb-5">
              <Sparkles className="w-3 h-3" />
              {t("Allenamento AI-Powered", "AI-Powered Training")}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 text-zinc-900 dark:text-white tracking-tight leading-[1.1]">
              {editingIndex !== null ? t("Ricalibra", "Recalibrate") : t("Costruisci", "Build")} {t("il tuo", "your")}{" "}
              <span className="bg-linear-to-r from-red-500 via-orange-500 to-red-500 bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient">
                {t("Programma", "Program")}
              </span>
            </h1>
            <p className="text-zinc-500 max-w-lg mx-auto text-sm leading-relaxed">
              {t("In 5 passaggi creiamo un piano di allenamento su misura per le tue caratteristiche, i tuoi obiettivi e la tua disponibilità. Più dettagli fornisci, più efficace sarà il programma.", "In 5 steps we build a training plan tailored to your profile, goals and availability. The more details you provide, the more effective the program.")}
            </p>

            {/* Steps bar */}
            <div className="flex items-center justify-center gap-1.5 mt-8">
              {[1, 2, 3, 4, 5].map((s) => (
                <React.Fragment key={s}>
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      step >= s ? "bg-red-500 w-8 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-zinc-200 dark:bg-zinc-800 w-3"
                    }`}
                  />
                  {s < 5 && <div className={`h-px w-4 transition-colors ${step > s ? "bg-red-500" : "bg-zinc-200 dark:bg-zinc-800"}`} />}
                </React.Fragment>
              ))}
            </div>
            <p className="text-[10px] text-zinc-600 mt-2 font-black uppercase tracking-[0.2em]">
              {t("Passo", "Step")} {step} {t("di", "of")} {totalSteps}
            </p>
          </div>

          {/* Main layout */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* ── LEFT: Wizard ────────────────────────────────── */}
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="bg-white dark:bg-zinc-900/30 backdrop-blur-2xl p-6 sm:p-8 md:p-10 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-2xl relative overflow-hidden">
                {/* Top glow bar */}
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-red-500/60 to-transparent" />

                <form onSubmit={handleSubmit} noValidate>
                  {renderStep()}

                  {/* Progress bar when generating */}
                  <GenerationProgressBar isGenerating={isGenerating} generationProgress={generationProgress} />

                  {/* Action buttons */}
                  <div className="mt-10 flex gap-3">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 bg-zinc-200 dark:bg-zinc-800/60 hover:bg-zinc-300 dark:hover:bg-zinc-700/80 text-zinc-900 dark:text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border border-zinc-200 dark:border-white/5"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        {t("Indietro", "Back")}
                      </button>
                    )}
                    {step < totalSteps ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!canNext}
                        className={`flex-1 bg-linear-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white py-4 rounded-2xl font-black transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed ${
                          step === totalSteps - 1 ? "from-red-600 via-orange-600 to-red-600 bg-[length:200%_100%] animate-gradient" : ""
                        }`}
                      >
                        {t("Continua", "Continue")}
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isGenerating}
                        className="w-full bg-linear-to-r from-red-600 via-orange-600 to-red-600 bg-[length:200%_100%] hover:bg-right text-white py-6 rounded-2xl font-black text-lg transition-all hover:scale-[1.01] shadow-2xl shadow-red-900/40 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed animate-gradient"
                      >
                        {isGenerating ? (
                          <>
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {t("Generazione in corso...", "Generating...")}
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-6 h-6" />
                            {editingIndex !== null ? t("Aggiorna Programma", "Update Program") : t("Genera Programma", "Generate Program")}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* ── RIGHT: Sidebar ──────────────────────────────── */}
            <div className="lg:col-span-4 xl:col-span-4 space-y-5">
              <StepProgress step={step} setStep={setStep} />
              <StepHint step={step} />
            </div>
          </div>

          {/* ── BOTTOM: Saved Programs ──────────────────────── */}
          <div className="mt-16">
            <SavedProgramsPanel
              programs={programs}
              openExportIdx={openExportIdx}
              setOpenExportIdx={setOpenExportIdx}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleExport={handleExport}
              bodyFocus={bodyFocus}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;
