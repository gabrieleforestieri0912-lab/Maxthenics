/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Calendar,
  Clock,
  Dumbbell,
  Zap,
  Star,
  AlertCircle,
  Download,
  FileText,
  FileJson,
  Printer,
  Pencil,
  Trash2,
  Plus,
  TrendingUp,
  Award,
  Eye,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { downloadTxt, downloadJson, downloadPdf, downloadCsv, downloadWeeksTxt, downloadWeeksCsv, downloadWeeksPdf, downloadWeeksJson } from "../lib/exportProgram";
import type { ProgramForExport, ExerciseExport } from "../lib/exportProgram";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";
import type { SavedProgram } from "../types/program";
import { savedToProgram } from "../types/program";

interface TrendData {
  label: string;
  current: number;
  target: number;
}

const LEVEL_CONFIG: Record<string, { color: string; bg: string; bar: string; label: string }> = {
  principiante: { color: "text-emerald-400", bg: "bg-emerald-500/10", bar: "bg-emerald-500", label: "Principiante" },
  intermedio: { color: "text-red-400", bg: "bg-red-500/10", bar: "bg-red-500", label: "Intermedio" },
  avanzato: { color: "text-amber-400", bg: "bg-amber-500/10", bar: "bg-amber-500", label: "Avanzato" },
};

const MyWorkouts: React.FC = () => {
  const navigate = useNavigate();
  const { user, addNotification } = useAuth();

  const [programs, setPrograms] = useState<SavedProgram[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [exportOpenId, setExportOpenId] = useState<string | null>(null);
  const [viewMode] = useState<"grid" | "list">("grid");
  const [filterLevel, setFilterLevel] = useState<string | null>(null);
  const [lastEdited, setLastEdited] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("maxthenicsPrograms");
    const local: SavedProgram[] = saved ? JSON.parse(saved) : [];

    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/programs/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : []))
        .then((serverPrograms: any[]) => {
          const server: SavedProgram[] = serverPrograms.map((p: any) => ({
            id: p._id || p.id,
            userId: p.userId || "",
            title: p.title || "Programma",
            description: p.description || "",
            level: p.level || "Intermediate",
            price: p.price || 0,
            exercises: p.exercises || [],
            date: p.createdAt
              ? new Date(p.createdAt).toLocaleDateString("it-IT", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "",
            daysPerWeek: p.daysPerWeek || 3,
            goals: p.goals || "",
            age: p.age || "",
            weight: p.weight || "",
            height: p.height || "",
            experience: p.experience || "",
            equipment: p.equipment || "",
            focus: p.focus || "",
            injury: p.injury || "",
          }));
          const merged = [...server];
          const serverIds = new Set(server.map((s) => s.id));
          for (const l of local) {
            if (!serverIds.has(l.id)) merged.push(l);
          }
          setPrograms(merged);
        })
        .catch(() => {
          if (local.length) setPrograms(local);
        });
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (local.length) setPrograms(local);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("maxthenicsPrograms", JSON.stringify(programs));
    }
  }, [programs]);

  useEffect(() => {
    const sub = localStorage.getItem("maxthenicsProgramsUpdated");
    if (sub) {
      const id = sub;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLastEdited(id);
      const t = setTimeout(() => setLastEdited(null), 3000);
      return () => clearTimeout(t);
    }
  }, []);

  // ─── FILTERED PROGRAMS ────────────────────────────────────────────────
  const filteredPrograms = programs.filter((p) => {
    if (filterLevel && p.level !== filterLevel) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.focus.toLowerCase().includes(q) ||
        (p.goals || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.equipment || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  // ─── ACTION HANDLERS ──────────────────────────────────────────────────
  const handleEdit = (id: string, index: number) => {
    navigate("/create", { state: { editId: id, editIndex: index } });
    addNotification("Modifica il programma direttamente nella pagina di creazione.", "success");
  };

  const handleDelete = (id: string, index: number) => {
    if (window.confirm("Eliminare definitivamente questo programma?")) {
      setPrograms(programs.filter((_, i) => i !== index));
      const token = localStorage.getItem("token");
      if (token) {
        fetch(`/api/programs/user?id=${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {});
      }
      addNotification("Programma eliminato.", "success");
    }
  };

  const handleExport = (
    format: "txt" | "json" | "pdf" | "csv" | "weeks-txt" | "weeks-csv" | "weeks-pdf" | "weeks-json",
    program: SavedProgram
  ) => {
    setExportOpenId(null);
    const flatExercises: ExerciseExport[] = (program.exercises || []).map((ex: any) => ({
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
    else if (format === "csv") downloadCsv(p);
    else if (format === "json") downloadJson(p);
    else if (format === "pdf") downloadPdf(p);
    else {
      const prog = savedToProgram(program);
      const weeks = prog.weeks || [];
      if (format === "weeks-txt") downloadWeeksTxt(prog, weeks);
      else if (format === "weeks-csv") downloadWeeksCsv(prog, weeks);
      else if (format === "weeks-pdf") downloadWeeksPdf(prog, weeks);
      else if (format === "weeks-json") downloadWeeksJson(prog);
    }
    const label: Record<string, string> = {
      txt: "TXT", csv: "CSV", json: "JSON", pdf: "PDF",
      "weeks-txt": "TXT completo", "weeks-csv": "CSV completo",
      "weeks-pdf": "PDF completo", "weeks-json": "JSON completo",
    };
    addNotification(`Programma esportato in ${label[format] || format}!`, "success");
  };

  const navigateToCreate = () => {
    navigate("/create");
  };

  const formatIntensity = (val?: string) => {
    if (!val) return null;
    const map: Record<string, string> = { baja: "Bassa", media: "Media", alta: "Alta" };
    return map[val] || val;
  };

  // ─── PROGRESS DERIVED FROM PROGRAM DATA ───────────────────────────────────
  const getProgressData = (p: SavedProgram): TrendData[] => {
    const intensityFactor = p.intensity === "alta" ? 0.88 : p.intensity === "baja" ? 0.70 : 0.79;

    // Slightly "improve performance" each week based on level and intensity
    const levelMultiplier =
      p.level === "avanzato" ? 1.15 : p.level === "intermedio" ? 1.0 : 0.85;

    return [1, 2, 3, 4].map((week) => {
      const base = Math.min(68, 52 + week * 6);
      const target = Math.min(95, 78 + week * (p.level === "principiante" ? 3 : 4));
      const current = Math.round(
        Math.min(
          target * intensityFactor,
          base * levelMultiplier + week * 3.5
        )
      );
      return { label: `Sett. ${week}`, current, target: Math.round(target) };
    });
  };

  // ─── AUTH GUARD ────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <AlertCircle className="mx-auto text-red-500 mb-6" size={48} />
          <h2 className="text-xl font-black text-white mb-3">Accesso Richiesto</h2>
          <p className="text-zinc-500 text-sm mb-6">Accedi per vedere i tuoi programmi di allenamento.</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all"
          >
            Accedi
          </button>
        </div>
      </div>
    );
  }

  // ─── COUNT STATS ───────────────────────────────────────────────────────
  const stats = {
    total: programs.length,
    beginner: programs.filter((p) => p.level === "principiante").length,
    intermediate: programs.filter((p) => p.level === "intermedio").length,
    advanced: programs.filter((p) => p.level === "avanzato").length,
  };

  return (
    <>
      <SEO
        title="I Miei Allenamenti"
        description="Tutti i tuoi programmi di allenamento personalizzati, raccolti in un unico spazio."
        keywords="miei allenamenti, programmi personalizzati, workout, calisthenics"
      />

      <div className="min-h-screen bg-black text-white py-8 sm:py-14 px-4 sm:px-6 relative">
        {/* Background atmosphere */}
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-red-600/3 rounded-full blur-[150px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-orange-600/3 rounded-full blur-[150px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto">
          {/* ── PAGE HEADER ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500 mb-2">Dashboard Allenamento</p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
                  I Miei{" "}
                  <span className="bg-linear-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Workout</span>
                </h1>
                <p className="text-zinc-500 mt-3 text-sm leading-relaxed max-w-xl">
                  {stats.total > 0
                    ? `Hai ${stats.total} programma${stats.total > 1 ? "i" : ""} attivo${stats.total > 1 ? "i" : ""}. Modificalo, esportalo o allenati.`
                    : "Non hai ancora nessun programma. Inizia a costruire il tuo percorso."}
                </p>
              </div>
              <button
                onClick={navigateToCreate}
                className="shrink-0 bg-linear-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all shadow-lg shadow-red-900/20 hover:shadow-red-900/40 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Plus className="w-4 h-4" />
                Nuovo Programma
              </button>
            </div>
          </motion.div>

          {/* ── LIVE EDIT TOAST ───────────────────────────── */}
          <AnimatePresence>
            {lastEdited && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mb-8 bg-emerald-500/8 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-white">Programma modificato con successo!</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Le modifiche sono state salvate automaticamente.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── STATS BAR ────────────────────────────────── */}
          {stats.total > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
            >
              {[
                {
                  val: stats.total,
                  label: "Programmi Attivi",
                  icon: Dumbbell,
                  col: "text-white",
                  bg: "bg-linear-to-br from-zinc-800 to-zinc-900",
                  accent: "from-red-500/10 to-orange-500/10",
                  border: "border-red-500/15",
                },
                {
                  val: stats.beginner,
                  label: "Principianti",
                  icon: Award,
                  col: "text-emerald-400",
                  bg: "bg-linear-to-br from-emerald-950/40 to-zinc-900",
                  accent: "from-emerald-500/10 to-emerald-600/5",
                  border: "border-emerald-500/15",
                },
                {
                  val: stats.intermediate,
                  label: "Intermedi",
                  icon: Zap,
                  col: "text-red-400",
                  bg: "bg-linear-to-br from-red-950/40 to-zinc-900",
                  accent: "from-red-500/10 to-red-600/5",
                  border: "border-red-500/15",
                },
                {
                  val: stats.advanced,
                  label: "Avanzati",
                  icon: Star,
                  col: "text-amber-400",
                  bg: "bg-linear-to-br from-amber-950/40 to-zinc-900",
                  accent: "from-amber-500/10 to-amber-600/5",
                  border: "border-amber-500/15",
                },
              ].map((s) => (
                <div key={s.label} className={`rounded-2xl border ${s.border} p-5 bg-linear-to-br ${s.accent} relative overflow-hidden`}>
                  <div className={`absolute inset-0 bg-linear-to-br ${s.accent} pointer-events-none`} />
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <p className={`text-2xl sm:text-3xl font-black ${s.col}`}>{s.val}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">{s.label}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl ${s.border} flex items-center justify-center`}>
                      <s.icon className={`w-5 h-5 ${s.col}`} />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* ── SEARCH & FILTERS ─────────────────────────── */}
          {stats.total > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-3 mb-8"
            >
              {/* Search */}
              <div className="flex-1 relative">
                <Eye className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cerca per nome, focus, obiettivi..."
                  className="w-full bg-zinc-950/60 border border-white/8 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/30 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Level filter */}
              <div className="flex gap-2">
                {[
                  { val: null, label: "Tutti" },
                  { val: "principiante", label: "Principiante" },
                  { val: "intermedio", label: "Intermedio" },
                  { val: "avanzato", label: "Avanzato" },
                ].map((f) => (
                  <button
                    key={f.label}
                    type="button"
                    onClick={() => setFilterLevel(filterLevel === f.val ? null : f.val)}
                    className={`px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border ${
                      filterLevel === f.val
                        ? "bg-red-600 text-white border-red-500 shadow-[0_0_16px_rgba(220,38,38,0.2)]"
                        : "bg-zinc-950/60 text-zinc-500 border-white/8 hover:text-white hover:border-white/15"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── NO PROGRAMS ──────────────────────────────── */}
          {programs.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 px-6"
            >
              <div className="w-24 h-24 mx-auto rounded-[2rem] bg-linear-to-br from-red-600/10 to-orange-600/10 border border-red-500/10 flex items-center justify-center mb-8">
                <Dumbbell className="w-10 h-10 text-red-500/40" />
              </div>
              <h2 className="text-2xl font-black text-white mb-3">Nessun programma ancora</h2>
              <p className="text-zinc-500 max-w-md mx-auto text-sm leading-relaxed mb-8">
                Il tuo primo piano di allenamento personalizzato ti aspetta. Compila il wizard e lascia che
                l&apos;IA crei il programma perfetto per te.
              </p>
              <button
                onClick={navigateToCreate}
                className="bg-linear-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.15em] transition-all shadow-xl shadow-red-900/20 hover:shadow-red-900/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Crea il Tuo Primo Programma
              </button>
            </motion.div>
          )}

          {/* ── NO MATCHES ───────────────────────────────── */}
          {programs.length > 0 && filteredPrograms.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <AlertCircle className="mx-auto text-zinc-700 mb-4" size={36} />
              <p className="text-zinc-500 text-sm">Nessun programma corrisponde alla ricerca.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterLevel(null);
                }}
                className="mt-4 text-red-500 text-xs font-bold uppercase tracking-wider hover:underline"
              >
                Rimuovi filtri
              </button>
            </motion.div>
          )}

          {/* ── PROGRAMS GRID ────────────────────────────── */}
          {filteredPrograms.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`grid gap-4 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {filteredPrograms.map((p, idx) => {
                const lvlCfg = LEVEL_CONFIG[p.level] || LEVEL_CONFIG.principiante;
                const isExpanded = expandedId === p.id;
                const isExportOpen = exportOpenId === p.id;
                const programIndex = programs.findIndex((x) => x.id === p.id);

                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    layout
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className={`relative group rounded-[1.75rem] border border-white/8 bg-zinc-900/50 backdrop-blur-sm overflow-hidden hover:border-red-500/20 transition-all duration-300 hover:bg-zinc-900/70 ${
                      viewMode === "list" ? "" : ""
                    }`}
                  >
                    {/* Top accent gradient */}
                    <div className={`h-1 bg-linear-to-r ${p.level === "avanzato" ? "from-amber-500 to-red-500" : p.level === "intermedio" ? "from-red-500 to-orange-500" : "from-emerald-500 to-teal-500"}`} />

                    <div className="p-5 sm:p-6">
                      {/* Card header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            <span className={`text-[9px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full ${lvlCfg.bg} ${lvlCfg.color} border border-white/8`}>
                              {lvlCfg.label}
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full bg-red-500/8 text-red-400 border border-red-500/15">
                              {p.focus}
                            </span>
                            {formatIntensity(p.intensity) && (
                              <span className="text-[9px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full bg-white/3 text-zinc-500 border border-white/5">
                                {formatIntensity(p.intensity)}
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-black text-white truncate leading-tight">{p.title}</h3>
                          <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                            {p.description || p.goals || "Programma AI personalizzato"}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-0.5 shrink-0">
                          <button
                            onClick={() => handleEdit(p.id, programIndex)}
                            className="p-2 text-zinc-500 hover:text-white hover:bg-white/8 rounded-xl transition-all"
                            title="Modifica"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, programIndex)}
                            className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-600/10 rounded-xl transition-all"
                            title="Elimina"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="relative">
                            <button
                              onClick={() => setExportOpenId(isExportOpen ? null : p.id)}
                              className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/8 rounded-xl transition-all"
                              title="Esporta"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            {isExportOpen && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setExportOpenId(null)} />
                                <div className="absolute right-0 top-full mt-1 z-50 w-52 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                                  <div className="p-1.5">
                                    <p className="text-[9px] text-zinc-500 uppercase tracking-wider px-2 py-1 font-bold">Esporta semplice</p>
                                    <button onClick={() => handleExport("txt", p)}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors">
                                      <FileText size={13} className="text-zinc-500" /> TXT
                                    </button>
                                    <button onClick={() => handleExport("csv", p)}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors">
                                      <FileText size={13} className="text-zinc-500" /> CSV
                                    </button>
                                    <button onClick={() => handleExport("json", p)}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors">
                                      <FileJson size={13} className="text-zinc-500" /> JSON
                                    </button>
                                    <button onClick={() => handleExport("pdf", p)}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors">
                                      <Printer size={13} className="text-zinc-500" /> PDF / Stampa
                                    </button>
                                  </div>
                                  <div className="border-t border-white/5 p-1.5">
                                    <p className="text-[9px] text-zinc-500 uppercase tracking-wider px-2 py-1 font-bold">Completo (settimane)</p>
                                    <button onClick={() => handleExport("weeks-txt", p)}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors">
                                      <FileText size={13} className="text-zinc-500" /> TXT
                                    </button>
                                    <button onClick={() => handleExport("weeks-csv", p)}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors">
                                      <FileText size={13} className="text-zinc-500" /> CSV
                                    </button>
                                    <button onClick={() => handleExport("weeks-json", p)}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors">
                                      <FileJson size={13} className="text-zinc-500" /> JSON
                                    </button>
                                    <button onClick={() => handleExport("weeks-pdf", p)}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors">
                                      <Printer size={13} className="text-zinc-500" /> PDF / Stampa
                                    </button>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Meta chips */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-zinc-600 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {p.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {p.daysPerWeek}g/sett · {p.sessionDuration || 60}min
                        </span>
                        <span className="flex items-center gap-1">
                          <Dumbbell className="w-3 h-3" />
                          {p.exercises?.length || 0} esercizi
                        </span>
                        {p.equipment && (
                          <span className="flex items-center gap-1">
                            <Dumbbell className="w-3 h-3" />
                            {p.equipment}
                          </span>
                        )}
                      </div>

                      {/* Exercise tags preview */}
                      {p.exercises && p.exercises.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {p.exercises.slice(0, 5).map((ex: any, j: number) => (
                            <span
                              key={j}
                              className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 bg-red-500/5 text-red-500/50 rounded-full border border-red-500/8"
                            >
                              {ex.name}
                            </span>
                          ))}
                          {p.exercises.length > 5 && (
                            <span className="text-[8px] text-zinc-700 font-bold">+{p.exercises.length - 5}</span>
                          )}
                        </div>
                      )}

                      {/* Goals bar */}
                      {p.goals && (
                        <div className="bg-zinc-950/50 rounded-xl p-3.5 border border-white/5 border-l-2 border-l-red-500/40 mb-4">
                          <p className="text-[10px] text-zinc-600 font-black uppercase tracking-wider mb-1">Obiettivi</p>
                          <p className="text-xs text-zinc-400 italic leading-relaxed line-clamp-2">&ldquo;{p.goals}&rdquo;</p>
                        </div>
                      )}

                      {/* Expandable: Body focus + mock progress */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-4 pt-3 mt-3 border-t border-white/5">
                              {/* Body Focus */}
                              {p.bodyFocus && p.bodyFocus.length > 0 && (
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-wider text-zinc-600 mb-2">Aree Focus</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {p.bodyFocus.map((bf: string) => (
                                      <span key={bf} className="text-[9px] font-bold px-2.5 py-1 bg-red-500/8 text-red-400/70 rounded-full border border-red-500/12">
                                        {bf}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* User stats */}
                              <div className="grid grid-cols-3 gap-2">
                                {[
                                  { label: "Età", value: `${p.age || "—"} anni` },
                                  { label: "Peso", value: `${p.weight || "—"} kg` },
                                  { label: "Altezza", value: `${p.height || "—"} cm` },
                                ].map((s) => (
                                  <div key={s.label} className="text-center p-2.5 rounded-xl bg-zinc-950/50 border border-white/5">
                                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-wider mb-0.5">{s.label}</p>
                                    <p className="text-sm font-black text-white">{s.value}</p>
                                  </div>
                                ))}
                              </div>

                              {/* Progress visualization */}
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-wider text-zinc-600 mb-3 flex items-center gap-1.5">
                                  <TrendingUp className="w-3 h-3" />
                                  Andamento Previsto
                                </p>
                                <div className="flex items-end gap-2 h-16 px-1">
                                  {getProgressData(p).map((pt, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                                      <span className="text-[8px] text-zinc-700">{pt.target}%</span>
                                      <div className="relative w-full flex flex-col items-center gap-[2px] h-12 justify-end">
                                        {/* Target bar */}
                                        <div className="w-full bg-zinc-800 rounded-t-sm" style={{ height: `${pt.target * 0.12}rem` }}>
                                          <div
                                            className="w-full bg-zinc-700/40 rounded-t-sm transition-all"
                                            style={{ height: `${pt.current}%`, opacity: 0.5 }}
                                          />
                                        </div>
                                        {/* Current bar overlay */}
                                        <div
                                          className={`absolute bottom-0 w-full ${p.level === "avanzato" ? "bg-amber-500" : p.level === "intermedio" ? "bg-red-500" : "bg-emerald-500"} rounded-t-sm transition-all`}
                                          style={{
                                            height: `${(pt.current / pt.target) * (pt.target * 0.12)}rem`,
                                            minHeight: pt.current > 0 ? "4px" : "0",
                                            opacity: 0.8,
                                          }}
                                        />
                                      </div>
                                      <span className="text-[7px] text-zinc-600">{pt.label}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex items-center justify-between text-[9px] mt-1">
                                  <span className="flex items-center gap-1 text-zinc-700">
                                    <span className="w-2 h-2 rounded-sm bg-zinc-700/40" /> Obiettivo
                                  </span>
                                  <span className="flex items-center gap-1 text-red-500/70">
                                    <span className="w-2 h-2 rounded-sm bg-red-500" /> Attuale
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Expand / Collapse */}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : p.id)}
                        className="w-full mt-1 text-[10px] font-bold text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1 pt-2"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronDown className="w-3 h-3 rotate-180" />
                            Mostra meno
                          </>
                        ) : (
                          <>
                                <span
                                  onClick={() => handleEdit(p.id, programIndex)}
                                  className="text-red-500 hover:text-red-400 text-sm font-bold transition-colors mr-2"
                                  title="Modifica"
                                >
                                  Modifica
                                </span>
                            <ChevronDown className="w-3 h-3" />
                            Dettagli
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* ── COUNT SUMMARY ────────────────────────────── */}
          {filteredPrograms.length > 0 && (
            <p className="text-center text-[10px] text-zinc-700 mt-8">
              {filteredPrograms.length} di {programs.length} programmi visibili
            </p>
          )}
        </div>
      </div>
    </>
  );

  // We need XCircle in the imports — it's already there from lucide-react
};

export default MyWorkouts;
