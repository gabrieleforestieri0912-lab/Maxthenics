/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  Clock,
  TrendingUp,
  Dumbbell,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Heart,
  Repeat,
  Eye,
  Star,
  BrainCircuit,
  Shield,
  BarChart3,
  Ruler,
  Scale,
  Calendar,
} from "lucide-react";
import { downloadTxt, downloadJson, downloadPdf } from "../lib/exportProgram";
import type { ProgramForExport } from "../lib/exportProgram";
import SEO from "../components/SEO";
import type { SavedProgram } from "../types/program";

interface ExperienceOption {
  label: string;
  icon: string;
  color: string;
  desc: string;
}

interface WorkoutIntensity {
  value: string;
  label: string;
  desc: string;
  barColor: string;
}

interface FocusOption {
  val: string;
  label: string;
  icon: string;
  desc: string;
  gradient: string;
}

interface GenderOption {
  val: string;
  icon: string;
  label: string;
}

const LEVEL_STYLES: Record<string, { bg: string; border: string; glow: string; accent: string; tag: string }> = {
  principiante: {
    bg: "bg-emerald-600/8",
    border: "border-emerald-500/30",
    glow: "shadow-[0_0_30px_rgba(16,185,129,0.12)]",
    accent: "text-emerald-400",
    tag: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  intermedio: {
    bg: "bg-red-600/8",
    border: "border-red-600/30",
    glow: "shadow-[0_0_30px_rgba(220,38,38,0.12)]",
    accent: "text-red-500",
    tag: "bg-red-500/15 text-red-400 border-red-500/30",
  },
  avanzato: {
    bg: "bg-amber-600/8",
    border: "border-amber-500/30",
    glow: "shadow-[0_0_30px_rgba(245,158,11,0.12)]",
    accent: "text-amber-400",
    tag: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
};

const FOCUS_OPTIONS: FocusOption[] = [
  { val: "ipertrofia", icon: "💪", label: "Ipertrofia", desc: "Aumenta la massa muscolare e definizione", gradient: "from-red-600/20 to-red-500/5" },
  { val: "forza", icon: "🏋️", label: "Forza Pura", desc: "Rafforza il sistema neuromuscolare e la potenza", gradient: "from-blue-600/20 to-blue-500/5" },
  { val: "resistenza", icon: "🏃", label: "Resistenza", desc: "Migliora la resistenza cardiovascolare e muscolare", gradient: "from-green-600/20 to-green-500/5" },
  { val: "skills", icon: "🌟", label: "Skills & Moves", desc: "Padroneggia le mosse avanzate", gradient: "from-violet-600/20 to-violet-500/5" },
  { val: "dimagrimento", icon: "🔥", label: "Dimagrimento", desc: "Riduci la massa grassa con allenamenti intensi", gradient: "from-orange-600/20 to-orange-500/5" },
  { val: "mobilita", icon: "🧘", label: "Mobilità & Recupero", desc: "Aumenta la flessibilità articolare e previeni infortuni", gradient: "from-cyan-600/20 to-cyan-500/5" },
];

const INTENSITY_OPTIONS: WorkoutIntensity[] = [
  { value: "baja", label: "Bassa", desc: "Sessione leggera, ideale per recupero o principianti", barColor: "bg-emerald-500" },
  { value: "media", label: "Media", desc: "Allenamento bilanciato — adatto alla maggior parte", barColor: "bg-amber-500" },
  { value: "alta", label: "Alta", desc: "Massimo impegno — richiede esperienza", barColor: "bg-red-500" },
];

const EXPERIENCE_OPTIONS: ExperienceOption[] = [
  { label: "0-1 anni", icon: "🌱", color: "text-emerald-400", desc: "Inizio del percorso" },
  { label: "1-3 anni", icon: "⚡", color: "text-red-400", desc: "Fondamenti solidi" },
  { label: "3-5 anni", icon: "🔥", color: "text-orange-400", desc: "Consolidamento" },
  { label: "5+ anni", icon: "👑", color: "text-amber-400", desc: "Livello esperto" },
];

const BODY_FOCUS_OPTIONS = [
  { label: "Petto", icon: "💪", group: "Upper" },
  { label: "Schiena", icon: "🔙", group: "Upper" },
  { label: "Spalle", icon: "🎯", group: "Upper" },
  { label: "Bicipiti", icon: "💪", group: "Upper" },
  { label: "Tricipiti", icon: "💪", group: "Upper" },
  { label: "Addominali", icon: "🔥", group: "Core" },
  { label: "Core", icon: "🎯", group: "Core" },
  { label: "Quadricipiti", icon: "🦵", group: "Lower" },
  { label: "Femorali", icon: "🦵", group: "Lower" },
  { label: "Glutei", icon: "🍑", group: "Lower" },
  { label: "Polpacci", icon: "🦶", group: "Lower" },
  { label: "Gambe Completo", icon: "🏗️", group: "Lower" },
];

const GENDER_OPTIONS: GenderOption[] = [
  { val: "male", icon: "♂️", label: "Maschile" },
  { val: "female", icon: "♀️", label: "Femminile" },
  { val: "other", icon: "⚧", label: "Altro" },
  { val: "prefer-not-say", icon: "🔒", label: "Preferisco non dire" },
];

const DURATION_OPTIONS = [
  { val: "30", label: "30 min", sub: "Breve & intenso" },
  { val: "45", label: "45 min", sub: "Standard equilibrato" },
  { val: "60", label: "60 min", sub: "Sessione completa" },
  { val: "75", label: "75 min", sub: "Allenamento lungo" },
  { val: "90", label: "90 min", sub: "Massimale su tutto" },
];

const TRAINING_TYPES = [
  { val: "street-workout", icon: "🏙️", label: "Street Workout", desc: "Esplosività, tricking, muscle-up, movimenti dinamici" },
  { val: "skill-work", icon: "🎯", label: "Skill Work", desc: "Front Lever, Planche, Handstand, progressioni tecniche" },
  { val: "freestyle", icon: "🌀", label: "Freestyle & Flow", desc: "Combinazioni creative, transizioni fluide, stile libero" },
  { val: "power", icon: "💥", label: "Power & Static Holds", desc: "Massimale isometrico, tenute statiche, forza bruta" },
  { val: "rings", icon: "⭕", label: "Anelli & Gymnastics", desc: "Lavoro agli anelli, elementi olimpici, controllo" },
  { val: "hypertrophy", icon: "💪", label: "Ipertrofia & Estetica", desc: "Volume alto, definizione, scheda estetica classica" },
  { val: "endurance", icon: "🏃", label: "Endurance & High Rep", desc: "Resistenza muscolare, high rep, circuiti" },
];

const Create: React.FC = () => {
  const { user, loading: authLoading, addNotification } = useAuth();
  const navigate = useNavigate();
  const confettiRef = useRef<HTMLDivElement>(null);

  const [programs, setPrograms] = useState<SavedProgram[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("maxthenicsPrograms");
      return saved ? JSON.parse(saved) : [];
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
        throw new Error("Completa tutti i campi obbligatori (età, peso, altezza).");
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

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Errore nella generazione");

      setGenerationProgress(95);

      const newProgram: SavedProgram = {
        id: data._id || String(Date.now()),
        userId: userId || undefined,
        title: data.title || "Programma Personalizzato",
        description: data.description || "",
        level: data.level || "Intermediate",
        price: data.price || 0,
        exercises: data.exercises || [],
        date: new Date().toLocaleDateString("it-IT", {
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
        addNotification("Programma aggiornato con successo!", "success");
      } else {
        setPrograms([...programs, newProgram]);
        addNotification("Programma generato con successo!", "success");
      }

      setGenerationProgress(100);
      triggerCelebration();

      setTimeout(() => {
        resetForm();
      }, 800);
    } catch (error: any) {
      addNotification(error.message || "Errore nella generazione del programma");
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

  const handleExport = (format: "txt" | "json" | "pdf", program: SavedProgram, index: number) => {
    setOpenExportIdx(null);
    const flatExercises: { name: string; sets: number; reps: string; rest: string; notes?: string }[] = (program.exercises || []).map((ex: any) => ({
      name: ex.exercise?.name || ex.name || 'Esercizio',
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
  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="h-12 w-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ─── PROGRESS INDICATOR COMPONENT ──────────────────────────────────────
  const StepProgress = () => (
    <div className="space-y-4">
      {[
        { n: 1, label: "Identità", icon: User },
        { n: 2, label: "Livello & Esperienza", icon: Award },
        { n: 3, label: "Logistica", icon: Activity },
        { n: 4, label: "Obiettivi", icon: Target },
        { n: 5, label: "Riepilogo", icon: CheckCircle2 },
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
                  : "bg-zinc-800/50 border border-white/5 text-zinc-600 group-hover:border-white/10"
              }`}
            >
              {done ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-xs font-black uppercase tracking-widest transition-colors ${
                  done || active ? "text-white" : "text-zinc-600"
                }`}
              >
                {s.label}
              </p>
              <div className={`h-0.5 rounded-full mt-2 transition-all duration-500 ${done || active ? "bg-red-600" : "bg-zinc-800"}`}>
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
                <h3 className="text-xl font-black text-white">Identità Atletica</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Definisci il tuo profilo per un programma su misura</p>
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-3">
              <label className="block text-[11px] font-black uppercase tracking-[0.15em] text-zinc-400">
                Sesso <span className="text-zinc-600 font-normal ml-1">(opzionale)</span>
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
                        : "bg-zinc-950/40 border-white/5 hover:border-white/15"
                    }`}
                  >
                    <div className="text-xl mb-1">{g.icon}</div>
                    <p className="text-[10px] font-bold text-zinc-300 leading-tight">{g.label}</p>
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
                  label: "Età",
                  icon: Calendar,
                  unit: "anni",
                  ph: "Es. 25",
                  cls: "bg-linear-to-br from-red-600/5 to-orange-600/5",
                  iconCls: "text-red-500",
                },
                {
                  val: weight,
                  set: setWeight,
                  label: "Peso",
                  icon: Scale,
                  unit: "kg",
                  ph: "Es. 75",
                  cls: "bg-linear-to-br from-blue-600/5 to-red-600/5",
                  iconCls: "text-blue-400",
                },
                {
                  val: height,
                  set: setHeight,
                  label: "Altezza",
                  icon: Ruler,
                  unit: "cm",
                  ph: "Es. 180",
                  cls: "bg-linear-to-br from-emerald-600/5 to-blue-600/5",
                  iconCls: "text-emerald-400",
                },
              ].map((field) => {
                const FI = field.icon;
                return (
                  <div key={field.label} className={`rounded-2xl border border-white/5 ${field.cls} p-4`}>
                    <div className="flex items-center gap-2 mb-3">
                      <FI className={`w-4 h-4 ${field.iconCls}`} />
                      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400">{field.label}</span>
                      <span className="text-[10px] text-zinc-600 ml-auto">{field.unit}</span>
                    </div>
                    <input
                      type="number"
                      value={field.val}
                      onChange={(e) => field.set(e.target.value)}
                      placeholder={field.ph}
                      className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-3 text-white font-bold text-2xl focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/40 transition-all placeholder:text-zinc-700 placeholder:font-normal placeholder:text-sm"
                    />
                  </div>
                );
              })}
            </div>

            {(age || weight || height) && (
              <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <p className="text-xs text-zinc-400">
                  Usiamo questi dati per calcolare <span className="text-white font-bold">metabolismo</span>,{" "}
                  <span className="text-white font-bold">carico di lavoro</span> e{" "}
                  <span className="text-white font-bold">volume ideale</span> del programma.
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
                <h3 className="text-xl font-black text-white">Livello & Esperienza</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Scegli il tuo livello: l'IA lo rispeterà in ogni dettaglio</p>
              </div>
            </div>

            {/* Level cards */}
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500">Livello di Abilità</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {
                    val: "principiante",
                    icon: "🌱",
                    title: "Principiante",
                    subt: "0 – 1 anni di esperienza",
                    points: ["Fondamenti posturali", "Progressioni graduali", "Volume moderato"],
                    style: LEVEL_STYLES.principiante,
                  },
                  {
                    val: "intermedio",
                    icon: "⚡",
                    title: "Intermedio",
                    subt: "1 – 3 anni di esperienza",
                    points: ["Tecniche complesse", "Periodizzazione", "Volume progressivo"],
                    style: LEVEL_STYLES.intermedio,
                  },
                  {
                    val: "avanzato",
                    icon: "🔥",
                    title: "Avanzato",
                    subt: "3+ anni di esperienza",
                    points: ["Skills avanzate", "Massimo volume", "Periodizzazione completa"],
                    style: LEVEL_STYLES.avanzato,
                  },
                ].map((lvl: any) => (
                  <button
                    key={lvl.val}
                    type="button"
                    onClick={() => setLevel(lvl.val)}
                    className={`p-5 rounded-3xl border-2 transition-all text-left group relative overflow-hidden ${
                      level === lvl.val
                        ? `${lvl.style.bg} ${lvl.style.border} ${lvl.style.glow} scale-[1.02]`
                        : "bg-zinc-950/40 border-white/5 hover:border-white/15 hover:bg-zinc-950/60"
                    }`}
                  >
                    <div
                      className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] -mr-10 -mt-10 transition-all ${
                        level === lvl.val ? "opacity-40" : "opacity-0"
                      }`}
                    />
                    <div className="text-3xl mb-3">{lvl.icon}</div>
                    <p className={`font-black text-base mb-0.5 transition-colors ${level === lvl.val ? lvl.style.accent : "text-white"}`}>
                      {lvl.title}
                    </p>
                    <p className="text-[11px] text-zinc-500 mb-4">{lvl.subt}</p>
                    <div className="space-y-1.5">
                      {lvl.points.map((pt: string) => (
                        <div key={pt} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${level === lvl.val ? "bg-red-500" : "bg-zinc-700"}`} />
                          <p className={`text-[11px] font-medium leading-snug ${level === lvl.val ? "text-zinc-300" : "text-zinc-600"}`}>
                            {pt}
                          </p>
                        </div>
                      ))}
                    </div>
                    {level === lvl.val && (
                      <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/40">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience pills */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 mb-4">
                Anni di Allenamento
              </label>
              <div className="flex gap-2">
                {EXPERIENCE_OPTIONS.map((exp) => (
                  <button
                    key={exp.label}
                    type="button"
                    onClick={() => setExperience(exp.label.split(" ")[0])}
                    className={`flex-1 py-4 rounded-2xl border transition-all text-center group ${
                      experience === exp.label.split(" ")[0]
                        ? "bg-red-600/12 border-red-600/40 shadow-[0_0_20px_rgba(220,38,38,0.1)]"
                        : "bg-zinc-950/40 border-white/5 hover:border-white/15"
                    }`}
                  >
                    <div className={`text-2xl mb-1.5 ${experience === exp.label.split(" ")[0] ? "scale-125 transition-transform" : ""}`}>
                      {exp.icon}
                    </div>
                    <p className={`text-xs font-black transition-colors ${experience === exp.label.split(" ")[0] ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"}`}>
                      {exp.label}
                    </p>
                    <p className="text-[10px] text-zinc-600 mt-0.5">{exp.desc}</p>
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
                <h3 className="text-xl font-black text-white">Configura il Tuo Allenamento</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Completa i dettagli logistici e scegli come vuoi allenarti</p>
              </div>
            </div>

            {/* Days/week + session duration */}
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 mb-5">
                  Frequenza Settimanale
                </label>
                <div className="flex items-center gap-6 bg-zinc-950/30 rounded-2xl p-5 border border-white/5">
                  <input
                    type="range"
                    min="2"
                    max="7"
                    value={daysPerWeek}
                    onChange={(e) => setDaysPerWeek(parseInt(e.target.value))}
                    className="grow accent-red-600 h-3 bg-zinc-800 rounded-xl cursor-pointer"
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
                            : "bg-zinc-800 text-zinc-600"
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
                  <span className="text-zinc-600 text-sm font-medium ml-1">giorni / settimana</span>
                </p>
              </div>

              {/* Session duration */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 mb-4">
                  Durata Sessione Stimata
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
                          : "bg-zinc-950/40 border-white/5 hover:border-white/15"
                      }`}
                    >
                      <p className={`text-base font-black transition-colors ${sessionDuration === d.val ? "text-white" : "text-zinc-500"}`}>
                        {d.label}
                      </p>
                      <p className="text-[10px] text-zinc-600 mt-0.5">{d.sub}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Training Type */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 mb-4">
                Tipo di Allenamento
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {TRAINING_TYPES.map((t) => (
                  <button
                    key={t.val}
                    type="button"
                    onClick={() => setTrainingType(t.val)}
                    className={`p-3 rounded-2xl border-2 transition-all text-center group ${
                      trainingType === t.val
                        ? "bg-red-600/10 border-red-600/40 shadow-[0_0_20px_rgba(220,38,38,0.12)]"
                        : "bg-zinc-950/40 border-white/5 hover:border-white/15"
                    }`}
                  >
                    <div className={`text-2xl mb-1 transition-transform ${trainingType === t.val ? "scale-125" : ""}`}>
                      {t.icon}
                    </div>
                    <p className={`text-[11px] font-black leading-tight ${trainingType === t.val ? "text-white" : "text-zinc-400"}`}>
                      {t.label}
                    </p>
                    <p className="text-[9px] text-zinc-600 mt-1 leading-snug">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 mb-4">
                Attrezzatura Disponibile
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { val: "nessuna", icon: "🏋️", label: "Solo Corpo Libero", sub: "Nessun attrezzo" },
                  { val: "sbarra", icon: "🏗️", label: "Sbarra Trazioni", sub: "Pull-up bar" },
                  { val: "parallele", icon: "〰️", label: "Parallette", sub: "Dip bars / P-bars" },
                  { val: "anelli", icon: "⭕", label: "Anelli", sub: "Gymnastics Rings" },
                  { val: "bande", icon: "🔄", label: "Bande Elastiche", sub: "Resistance Bands" },
                  { val: "zavorra", icon: "🏋️‍♂️", label: "Zavorra", sub: "Weight Vest / Cintura" },
                  { val: "base", icon: "🏗️", label: "Set Base", sub: "Sbarra + Parallele" },
                  { val: "completo", icon: "🏟️", label: "Completo", sub: "Tutto disponibile" },
                ].map((eq) => (
                  <button
                    key={eq.val}
                    type="button"
                    onClick={() => setEquipment(eq.val)}
                    className={`p-3 rounded-2xl border transition-all text-center group ${
                      equipment === eq.val
                        ? "bg-red-600/10 border-red-600/40 shadow-[0_0_16px_rgba(220,38,38,0.1)]"
                        : "bg-zinc-950/40 border-white/5 hover:border-white/15"
                    }`}
                  >
                    <div className={`text-xl mb-1 transition-transform ${equipment === eq.val ? "scale-125" : ""}`}>
                      {eq.icon}
                    </div>
                    <p className={`text-[10px] font-bold leading-tight ${equipment === eq.val ? "text-white" : "text-zinc-400"}`}>{eq.label}</p>
                    <p className="text-[9px] text-zinc-600 mt-0.5">{eq.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 mb-4">
                Intensità di Allenamento
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
                        : "bg-zinc-950/40 border-white/5 hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className={`w-4 h-4 ${intensity === opt.value ? "text-red-500" : "text-zinc-600"}`} />
                      <p className={`text-sm font-black ${intensity === opt.value ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"}`}>
                        {opt.label}
                      </p>
                    </div>
                    <p className="text-[10px] text-zinc-600 leading-snug">{opt.desc}</p>
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
                <h3 className="text-xl font-black text-white">Obiettivi & Focus</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Specifica cosa vuoi raggiungere e dove concentrarti</p>
              </div>
            </div>

            {/* Focus principale */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 mb-5">
                Focus Principale
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {FOCUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setFocus(opt.val)}
                    className={`p-4 rounded-2xl border-2 transition-all text-center relative overflow-hidden group ${
                      focus === opt.val ? "border-red-600/50 shadow-lg shadow-red-900/10" : "bg-zinc-950/40 border-white/5 hover:border-white/15"
                    }`}
                  >
                    <div className={`absolute inset-0 bg-linear-to-br ${opt.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    <div className="relative z-10">
                      <div className="text-2xl mb-1.5">{opt.icon}</div>
                      <p className={`text-xs font-black ${focus === opt.val ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"}`}>
                        {opt.label}
                      </p>
                      <p className="text-[10px] text-zinc-600 mt-0.5 leading-snug">{opt.desc}</p>
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
              <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 mb-2">
                Aree del Corpo da Lavorare{" "}
                <span className="text-zinc-600 font-normal normal-case ml-1">(opzionale)</span>
              </label>
              <p className="text-[11px] text-zinc-600 mb-4">
                Seleziona le aree su cui vuoi concentrarti di più.{" "}
                {bodyFocus.length > 0 ? (
                  <span className="text-red-400 font-bold"> {bodyFocus.length} selezionate</span>
                ) : null}
              </p>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {BODY_FOCUS_OPTIONS.map((bf) => {
                  const active = bodyFocus.includes(bf.label);
                  return (
                    <button
                      key={bf.label}
                      type="button"
                      onClick={() => toggleBodyFocus(bf.label)}
                      className={`p-3 rounded-xl border transition-all text-center ${
                        active
                          ? "bg-red-600/12 border-red-600/40 text-white shadow-[0_0_12px_rgba(220,38,38,0.1)]"
                          : "bg-zinc-950/40 border-white/5 text-zinc-500 hover:text-zinc-300 hover:border-white/10"
                      }`}
                    >
                      <span className="text-lg">{bf.icon}</span>
                      <p className="text-[10px] font-bold mt-1">{bf.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Goals */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 mb-2">
                I Tuoi Obiettivi Specifici
              </label>
              <div className="relative">
                <textarea
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  rows={4}
                  placeholder="Es. Sbloccare la Planche, aumentare le trazioni senza aiuto, migliorare la resistenza per un trail di 10km..."
                  className="w-full bg-zinc-950/60 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/30 transition-all placeholder:text-zinc-700 resize-none"
                />
                <div className="absolute bottom-3 right-3 text-[10px] text-zinc-700">
                  {goals.length > 0 ? `${goals.length} caratteri` : ""}
                </div>
              </div>
            </div>

            {/* Injury */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 mb-2">
                Condizioni Mediche o Infortuni{" "}
                <span className="text-zinc-600 font-normal normal-case ml-1">(opzionale)</span>
              </label>
              <div className="relative">
                <textarea
                  value={injury}
                  onChange={(e) => setInjury(e.target.value)}
                  rows={3}
                  placeholder="Descrivi eventuali infortuni, limitazioni fisiche, dolori articolari o patologie che dobbiamo considerare..."
                  className="w-full bg-zinc-950/60 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/30 transition-all placeholder:text-zinc-700 resize-none"
                />
                {injury && (
                  <div className="absolute top-3 right-3 text-amber-500">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                )}
              </div>
              <p className="text-[10px] text-zinc-600 mt-2 flex items-center gap-1.5">
                <Shield className="w-3 h-3" />
                I tuoi dati sono riservati e usati solo per personalizzare il programma.
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
                <h3 className="text-xl font-black text-white">Riepilogo Finale</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Verifica i dati prima di generare il tuo programma</p>
              </div>
            </div>

            {/* Grand Summary Card */}
            <div className="bg-linear-to-br from-zinc-900 via-zinc-950 to-black border border-white/10 rounded-[2rem] p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden">
              {/* Subtle glow border */}
              <div className="absolute inset-0 rounded-[2rem] bg-linear-to-br from-red-600/5 via-transparent to-orange-600/5 pointer-events-none" />

              {/* Header row */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">
                  {level.charAt(0).toUpperCase() + level.slice(1)} — {focus}
                </span>
                <span className="text-[10px] font-bold text-zinc-600">
                  {sessionDuration}min / sessione · {daysPerWeek}x settimana
                </span>
              </div>

              <div className="h-px bg-linear-to-r from-red-600/30 via-zinc-800 to-transparent relative z-10" />

              {/* Profile row */}
              <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Età", value: `${age} anni`, col: "text-red-400" },
                  { label: "Peso", value: `${weight} kg`, col: "text-blue-400" },
                  { label: "Altezza", value: `${height} cm`, col: "text-emerald-400" },
                  { label: "Esperienza", value: `${experience} anni`, col: "text-amber-400" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-zinc-950/60 rounded-xl p-3.5 border border-white/5">
                    <p className="text-[9px] font-black uppercase tracking-wider text-zinc-600 mb-1">{stat.label}</p>
                    <p className={`text-base font-black ${stat.col}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="h-px bg-white/5 relative z-10" />

              {/* Detail rows */}
              {[
                {
                  label: "Attrezzatura",
                  value: equipment.charAt(0).toUpperCase() + equipment.slice(1),
                  icon: Dumbbell,
                  iconCol: "text-orange-400",
                },
                {
                  label: "Intensità",
                  value: intensity.charAt(0).toUpperCase() + intensity.slice(1),
                  icon: Zap,
                  iconCol: "text-red-400",
                },
                ...(bodyFocus.length > 0
                  ? [
                      {
                        label: "Aree Focus",
                        value: bodyFocus.join(", "),
                        icon: Target,
                        iconCol: "text-emerald-400",
                      },
                    ]
                  : []),
              ].map((row) => (
                <div key={row.label} className="relative z-10 flex items-center justify-between py-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                    <row.icon className={`w-3.5 h-3.5 ${row.iconCol}`} />
                    {row.label}
                  </span>
                  <span className="text-sm font-bold text-white">{row.value}</span>
                </div>
              ))}

              {goals && (
                <>
                  <div className="h-px bg-white/5 relative z-10" />
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500 mb-2">Obiettivi</p>
                    <div className="bg-zinc-950/60 rounded-xl p-4 border border-white/5 border-l-2 border-l-red-500/60">
                      <p className="text-sm text-zinc-300 italic leading-relaxed">&ldquo;{goals}&rdquo;</p>
                    </div>
                  </div>
                </>
              )}

              {injury && (
                <>
                  <div className="h-px bg-white/5 relative z-10" />
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      Note su Infortuni / Condizioni
                    </p>
                    <div className="bg-amber-950/20 rounded-xl p-4 border border-amber-500/10 border-l-2 border-l-amber-500/60">
                      <p className="text-sm text-amber-200/80 italic leading-relaxed">&ldquo;{injury}&rdquo;</p>
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
                  <p className="text-xs font-bold text-amber-500 mb-0.5">Nessuna nota su infortuni</p>
                  <p className="text-[11px] text-zinc-500 leading-snug">
                    Il programma sarà progettato senza adattamenti per infortuni specifici.
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

  const StepHint = () => {
    const hints: Record<number, { title: string; body: string }> = {
      1: {
        title: "Perché questi dati?",
        body: "L'IA usa età, peso e altezza per calcolare il carico, il volume e la densità di allenamento ottimale per te.",
      },
      2: {
        title: "Sii onesto con te stesso",
        body: "Il livello definisce la difficoltà degli esercizi e la densità del programma. Non farti vedere più bravo di quello che sei.",
      },
      3: {
        title: "Logistica vincente",
        body: "Scegliere i giorni giusti è la chiave della consistenza. L'IA costruisce il programma attorno alla tua disponibilità.",
      },
      4: {
        title: "Più dettagli = programma migliore",
        body: "Specificare obiettivi e focus permette all'IA di selezionare gli esercizi più efficaci per raggiungere i tuoi risultati.",
      },
      5: {
        title: "Quasi pronto!",
        body: "L'IA genererà un programma completo con esercizi, serie, ripetizioni, recupero e note tecniche — tutto su misura per te.",
      },
    };
    const hint = hints[step];
    if (!hint) return null;
    return (
      <div className="bg-zinc-950/30 border border-white/5 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <BrainCircuit className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">{hint.title}</p>
            <p className="text-[11px] text-zinc-500 leading-relaxed">{hint.body}</p>
          </div>
        </div>
      </div>
    );
  };

  const SavedProgramsPanel = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
        <Layout className="w-6 h-6 text-red-500" />
        I Tuoi Piani
      </h2>
      <p className="text-[11px] text-zinc-500">
        I programmi che hai creato con l&apos;AI. Modifica, esporta o eliminali quando vuoi.
      </p>

      {programs.length === 0 ? (
        <div className="bg-zinc-900/20 border border-dashed border-white/8 rounded-[1.5rem] p-10 text-center">
          <Layout className="mx-auto text-zinc-800 mb-4" size={40} />
          <p className="text-zinc-600 italic text-sm">Nessun programma creato ancora.</p>
          <p className="text-zinc-700 text-xs mt-1">Compila il wizard e genera il tuo primo piano!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {programs.map((p, i) => {
            const lvlStyle = LEVEL_STYLES[p.level] || LEVEL_STYLES.principiante;
            return (
              <div
                key={i}
                className="group bg-zinc-900/60 backdrop-blur-sm p-5 rounded-2xl border border-white/8 hover:border-red-500/25 transition-all duration-300 hover:bg-zinc-900/80"
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
                        <span className="text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-white/5">
                          {p.intensity}
                        </span>
                      )}
                    </div>
                    <p className="text-base font-black text-white truncate">{p.title}</p>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      {p.daysPerWeek} giorni/sett · {p.sessionDuration}min ·&nbsp;
                      {p.goals ? `"${p.goals.length > 60 ? p.goals.slice(0, 60) + "..." : p.goals}"` : "Senza obiettivi"}
                    </p>
                  </div>
                  <div className="flex gap-0.5 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(i)}
                      className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      title="Modifica programma"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(i)}
                      className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-600/10 rounded-xl transition-all"
                      title="Elimina programma"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setOpenExportIdx(openExportIdx === i ? null : i)}
                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        title="Esporta"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      {openExportIdx === i && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setOpenExportIdx(null)} />
                          <div className="absolute right-0 top-full mt-1 z-50 w-44 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                            <button
                              onClick={() => handleExport("txt", p, i)}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                            >
                              <FileText size={14} className="text-zinc-500" />
                              Esporta TXT
                            </button>
                            <button
                              onClick={() => handleExport("json", p, i)}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                            >
                              <FileJson size={14} className="text-zinc-500" />
                              Esporta JSON
                            </button>
                            <button
                              onClick={() => handleExport("pdf", p, i)}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                            >
                              <Printer size={14} className="text-zinc-500" />
                              Stampa / PDF
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
                    <Dumbbell className="w-3 h-3" /> {p.exercises?.length || 0} esercizi
                  </span>
                  {p.age && (
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" /> {p.age} anni
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
                        className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-white/3 text-zinc-600 rounded-full"
                      >
                        {ex.name || "Esercizio"}
                      </span>
                    ))}
                    {p.exercises.length > 6 && (
                      <span className="text-[9px] text-zinc-700">+{p.exercises.length - 6} altri</span>
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

  const canProceedStep1 = age && weight && height;
  const canProceedStep2 = true;
  const canProceedStep3 = daysPerWeek >= 2;
  const canProceedStep4 = !!focus.trim();

  const canNext =
    (step === 1 && canProceedStep1) ||
    (step === 2 && canProceedStep2) ||
    (step === 3 && canProceedStep3) ||
    (step === 4 && canProceedStep4);

  const GenerationProgressBar = () => {
    if (!isGenerating) return null;
    return (
      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-red-500 flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            Generazione in corso...
          </span>
          <span className="text-[10px] font-black text-zinc-500">{Math.min(100, Math.round(generationProgress))}%</span>
        </div>
        <div className="h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-linear-to-r from-red-600 via-orange-500 to-red-600 rounded-full transition-all duration-500 ease-out shadow-[0_0_20px_rgba(220,38,38,0.4)]"
            style={{ width: `${Math.min(100, generationProgress)}%` }}
          />
        </div>
      </div>
    );
  };

  // ─── RENDER ────────────────────────────────────────────────────────────
  return (
    <>
      <SEO
        title="Crea Programma"
        description="Crea il tuo programma di calisthenics personalizzato con Maxthenics."
        keywords="creare programma calisthenics, personalizza workout, allenamento personalizzato"
      />
      <div className="min-h-screen py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-black">
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
              Allenamento AI-Powered
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 text-white tracking-tight leading-[1.1]">
              {editingIndex !== null ? "Ricalibra" : "Costruisci"} il tuo{" "}
              <span className="bg-linear-to-r from-red-500 via-orange-500 to-red-500 bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient">
                Programma
              </span>
            </h1>
            <p className="text-zinc-500 max-w-lg mx-auto text-sm leading-relaxed">
              In 5 passaggi creiamo un piano di allenamento su misura per le tue caratteristiche,
              i tuoi obiettivi e la tua disponibilità. Più dettagli fornisci, più efficace sarà il programma.
            </p>

            {/* Steps bar */}
            <div className="flex items-center justify-center gap-1.5 mt-8">
              {[1, 2, 3, 4, 5].map((s) => (
                <React.Fragment key={s}>
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      step >= s ? "bg-red-500 w-8 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-zinc-800 w-3"
                    }`}
                  />
                  {s < 5 && <div className={`h-px w-4 transition-colors ${step > s ? "bg-red-500" : "bg-zinc-800"}`} />}
                </React.Fragment>
              ))}
            </div>
            <p className="text-[10px] text-zinc-600 mt-2 font-black uppercase tracking-[0.2em]">
              Passo {step} di {totalSteps}
            </p>
          </div>

          {/* Main layout */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* ── LEFT: Wizard ────────────────────────────────── */}
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="bg-zinc-900/30 backdrop-blur-2xl p-6 sm:p-8 md:p-10 rounded-[2rem] border border-white/8 shadow-2xl relative overflow-hidden">
                {/* Top glow bar */}
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-red-500/60 to-transparent" />

                <form onSubmit={handleSubmit} noValidate>
                  {renderStep()}

                  {/* Progress bar when generating */}
                  <GenerationProgressBar />

                  {/* Action buttons */}
                  <div className="mt-10 flex gap-3">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 bg-zinc-800/60 hover:bg-zinc-700/80 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border border-white/5"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        Indietro
                      </button>
                    )}
                    {step < totalSteps ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!canNext}
                        className={`flex-1 bg-linear-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white py-4 rounded-2xl font-black transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed ${
                          step === totalSteps - 1 ? "from-red-600 via-orange-600 to-red-600 bg-[length:200%_100%] animate-gradient" : ""
                        }`}
                      >
                        Continua
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
                            Generazione in corso...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-6 h-6" />
                            {editingIndex !== null ? "Aggiorna Programma" : "Genera Programma"}
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
              <StepProgress />
              <StepHint />
            </div>
          </div>

          {/* ── BOTTOM: Saved Programs ──────────────────────── */}
          <div className="mt-16">
            <SavedProgramsPanel />
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;
