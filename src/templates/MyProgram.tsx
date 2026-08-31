/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Loader2, Edit, X, Plus, Trash2, Search, Download, ChevronDown } from 'lucide-react';
import { exerciseDatabase, type Exercise } from '../data/exercises';
import { downloadTxt, downloadJson, downloadPdf, downloadCsv, downloadWeeksTxt, downloadWeeksCsv, downloadWeeksPdf, downloadWeeksJson } from '../lib/exportProgram';
import type { ProgramForExport } from '../lib/exportProgram';
import SEO from "../components/SEO";

const API_URL = '/api';

interface ExerciseEntry {
  exercise: {
    id: string;
    name: string;
    muscleGroups?: string[];
    equipment?: string[];
    difficulty?: string;
    progression?: string[];
  };
  sets: number;
  reps: string;
  rest: string;
  tempo?: string;
  notes?: string;
  order: number;
}

interface Workout {
  id: string;
  name: string;
  focus?: string;
  exercises: ExerciseEntry[];
}

interface DayPlan {
  id: string;
  name: string;
  workouts: Workout[];
  notes?: string;
}

interface WeekPlan {
  weekNumber: number;
  theme?: string;
  days: DayPlan[];
  isDeload?: boolean;
}

interface Program {
  id?: string;
  title?: string;
  level?: string;
  focus?: string;
  description?: string;
  goals?: string;
  daysPerWeek?: number;
  weeks: WeekPlan[];
  weeklyPlan?: DayPlan[];
  message?: string;
}

const MyProgram: React.FC = () => {
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProgram, setEditedProgram] = useState<Program | null>(null);

  // Exercise browser state
  const [showExerciseBrowser, setShowExerciseBrowser] = useState(false);
  const [browserTarget, setBrowserTarget] = useState<{ weekIdx: number; dayIdx: number; workoutIdx: number } | null>(null);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [exerciseFilter, setExerciseFilter] = useState<string | null>(null);

  const exercises = useMemo(() => exerciseDatabase, []);
  const filteredExercises = useMemo(() => {
    let result = exercises;
    if (exerciseSearch) {
      const q = exerciseSearch.toLowerCase();
      result = result.filter(ex =>
        ex.name.toLowerCase().includes(q) ||
        ex.muscleGroups.primary.some(m => m.toLowerCase().includes(q)) ||
        ex.equipment.some(e => e.toLowerCase().includes(q))
      );
    }
    if (exerciseFilter) {
      result = result.filter(ex =>
        ex.muscleGroups.primary.some(m => m.toLowerCase() === exerciseFilter.toLowerCase()) ||
        ex.type === exerciseFilter ||
        ex.difficulty === exerciseFilter
      );
    }
    return result;
  }, [exercises, exerciseSearch, exerciseFilter]);

  const muscleGroups = useMemo(() => {
    const groups = new Set<string>();
    exercises.forEach(ex => ex.muscleGroups.primary.forEach(m => groups.add(m)));
    return Array.from(groups).sort();
  }, [exercises]);

  // Fetch user profile and generated program
  useEffect(() => {
    const fetchProgram = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setProgram({ weeks: [], weeklyPlan: [], message: "Accedi per visualizzare il tuo programma personalizzato." });
          setLoading(false);
          return;
        }

        const profileResponse = await fetch(`${API_URL}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        });

        if (!profileResponse.ok) {
          if (profileResponse.status === 401 || profileResponse.status === 403) {
            setProgram({ weeks: [], weeklyPlan: [], message: "Sessione scaduta. Accedi nuovamente." });
            setLoading(false);
            return;
          }
          throw new Error('Errore nel caricamento del profilo utente.');
        }
        const profileData = await profileResponse.json();

        if (!profileData.user) {
          setProgram({ weeks: [], weeklyPlan: [], message: "Completa il tuo profilo per generare un programma." });
          setLoading(false);
          return;
        }

        const programResponse = await fetch(`${API_URL}/programs/myprogram`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        });

        if (!programResponse.ok) {
          if (programResponse.status === 404) {
            setProgram({ weeks: [], weeklyPlan: [], message: "Nessun programma generato. Utilizza l'AI o contatta il coach per crearne uno." });
            setLoading(false);
            return;
          }
          throw new Error(`HTTP error! status: ${programResponse.status}`);
        }

        const programData: Program = await programResponse.json();
        if (programData.weeklyPlan && !programData.weeks) {
          programData.weeks = [{
            weekNumber: 1,
            days: programData.weeklyPlan,
          }];
        }
        setProgram(programData);
        setEditedProgram(JSON.parse(JSON.stringify(programData)));

      } catch (err: any) {
        console.error("Error fetching program:", err);
        setError(err.message || "Impossibile caricare il tuo programma. Riprova.");
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
  }, [navigate]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setEditedProgram(JSON.parse(JSON.stringify(program)));
    }
  };

  const handleSaveProgram = async () => {
    if (!editedProgram) return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Devi effettuare l'accesso per salvare il programma");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/programs/myprogram`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(editedProgram),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Errore nel salvataggio del programma');
      }

      const result = await response.json();
      setProgram(result);
      setIsEditing(false);
      alert('Programma salvato con successo!');

    } catch (err: any) {
      console.error("Error saving program:", err);
      setError(err.message || "Impossibile salvare il programma.");
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseChange = (weekIdx: number, dayIdx: number, workoutIdx: number, exerciseIdx: number, field: string, value: any) => {
    if (!editedProgram) return;
    const newProgram = JSON.parse(JSON.stringify(editedProgram)) as Program;
    const ex = newProgram.weeks[weekIdx].days[dayIdx].workouts[workoutIdx].exercises[exerciseIdx];
    (ex as any)[field] = value;
    setEditedProgram(newProgram);
  };

  const handleAddExercise = (weekIdx: number, dayIdx: number, workoutIdx: number, exercise?: Exercise) => {
    if (!editedProgram) return;
    const newProgram = JSON.parse(JSON.stringify(editedProgram)) as Program;
    const newEx: ExerciseEntry = exercise ? {
      exercise: {
        id: exercise.id,
        name: exercise.name,
        muscleGroups: exercise.muscleGroups.primary,
        equipment: exercise.equipment,
        difficulty: exercise.difficulty,
        progression: exercise.progression,
      },
      sets: 3,
      reps: '10',
      rest: '60s',
      notes: '',
      order: newProgram.weeks[weekIdx].days[dayIdx].workouts[workoutIdx].exercises.length,
    // eslint-disable-next-line react-hooks/purity
    } : { exercise: { id: `custom-${Date.now()}`, name: 'Nuovo Esercizio' }, sets: 3, reps: '10', rest: '60s', notes: '', order: 0 };
    newProgram.weeks[weekIdx].days[dayIdx].workouts[workoutIdx].exercises.push(newEx);
    setEditedProgram(newProgram);
  };

  const handleRemoveExercise = (weekIdx: number, dayIdx: number, workoutIdx: number, exerciseIdx: number) => {
    if (!editedProgram) return;
    const newProgram = JSON.parse(JSON.stringify(editedProgram)) as Program;
    newProgram.weeks[weekIdx].days[dayIdx].workouts[workoutIdx].exercises.splice(exerciseIdx, 1);
    setEditedProgram(newProgram);
  };

  const handleAddWorkout = (weekIdx: number, dayIdx: number) => {
    if (!editedProgram) return;
    const newProgram = JSON.parse(JSON.stringify(editedProgram)) as Program;
    newProgram.weeks[weekIdx].days[dayIdx].workouts.push({ id: `workout-${Date.now()}`, name: 'Nuovo Allenamento', exercises: [] });
    setEditedProgram(newProgram);
  };

  const handleRemoveWorkout = (weekIdx: number, dayIdx: number, workoutIdx: number) => {
    if (!editedProgram) return;
    const newProgram = JSON.parse(JSON.stringify(editedProgram)) as Program;
    newProgram.weeks[weekIdx].days[dayIdx].workouts.splice(workoutIdx, 1);
    setEditedProgram(newProgram);
  };

  const dragSource = useRef<{ weekIdx: number; dayIdx: number; workoutIdx: number; exerciseIdx: number } | null>(null);
  const [dropTarget, setDropTarget] = useState<{ weekIdx: number; dayIdx: number; workoutIdx: number; exerciseIdx: number } | null>(null);

  const handleExerciseDragStart = (w: number, d: number, wo: number, eIdx: number) => (ev: React.DragEvent) => {
    dragSource.current = { weekIdx: w, dayIdx: d, workoutIdx: wo, exerciseIdx: eIdx };
    ev.dataTransfer.effectAllowed = 'move';
  };

  const handleExerciseDragOver = (w: number, d: number, wo: number, eIdx: number) => (ev: React.DragEvent) => {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'move';
    if (!dragSource.current) return;
    const src = dragSource.current;
    if (src.weekIdx === w && src.dayIdx === d && src.workoutIdx === wo && src.exerciseIdx === eIdx) {
      setDropTarget(null);
      return;
    }
    setDropTarget({ weekIdx: w, dayIdx: d, workoutIdx: wo, exerciseIdx: eIdx });
  };

  const handleExerciseDrop = (w: number, d: number, wo: number, eIdx: number) => (ev: React.DragEvent) => {
    ev.preventDefault();
    if (!dragSource.current || !editedProgram) return;
    const src = dragSource.current;
    if (src.weekIdx === w && src.dayIdx === d && src.workoutIdx === wo && src.exerciseIdx === eIdx) {
      dragSource.current = null;
      setDropTarget(null);
      return;
    }
    const newProgram = JSON.parse(JSON.stringify(editedProgram)) as Program;
    const srcExercises = newProgram.weeks[src.weekIdx].days[src.dayIdx].workouts[src.workoutIdx].exercises;
    const dstExercises = newProgram.weeks[w].days[d].workouts[wo].exercises;
    const [moved] = srcExercises.splice(src.exerciseIdx, 1);
    const targetIdx = src.weekIdx === w && src.dayIdx === d && src.workoutIdx === wo && eIdx > src.exerciseIdx ? eIdx - 1 : eIdx;
    dstExercises.splice(targetIdx, 0, moved);
    setEditedProgram(newProgram);
    dragSource.current = null;
    setDropTarget(null);
  };

  const handleExerciseDragEnd = () => {
    dragSource.current = null;
    setDropTarget(null);
  };

  const handleAddDay = (weekIdx: number) => {
    if (!editedProgram) return;
    const newProgram = JSON.parse(JSON.stringify(editedProgram)) as Program;
    newProgram.weeks[weekIdx].days.push({ id: `day-${Date.now()}`, name: 'Nuovo Giorno', workouts: [] });
    setEditedProgram(newProgram);
  };

  const handleRemoveDay = (weekIdx: number, dayIdx: number) => {
    if (!editedProgram) return;
    const newProgram = JSON.parse(JSON.stringify(editedProgram)) as Program;
    newProgram.weeks[weekIdx].days.splice(dayIdx, 1);
    setEditedProgram(newProgram);
  };

  const handleAddWeek = () => {
    if (!editedProgram) return;
    const newProgram = JSON.parse(JSON.stringify(editedProgram)) as Program;
    const num = newProgram.weeks.length + 1;
    newProgram.weeks.push({
      weekNumber: num,
      theme: 'Nuova Settimana',
      days: [{ id: `day-${Date.now()}`, name: 'Giorno 1', workouts: [] }],
    });
    setEditedProgram(newProgram);
  };

  const handleRemoveWeek = (weekIdx: number) => {
    if (!editedProgram) return;
    const newProgram = JSON.parse(JSON.stringify(editedProgram)) as Program;
    newProgram.weeks.splice(weekIdx, 1);
    setEditedProgram(newProgram);
  };

  const openExerciseBrowser = (weekIdx: number, dayIdx: number, workoutIdx: number) => {
    setBrowserTarget({ weekIdx, dayIdx, workoutIdx });
    setShowExerciseBrowser(true);
    setExerciseSearch('');
    setExerciseFilter(null);
  };

  const addExerciseFromBrowser = (exercise: Exercise) => {
    if (!browserTarget) return;
    handleAddExercise(browserTarget.weekIdx, browserTarget.dayIdx, browserTarget.workoutIdx, exercise);
  };

  // Export handlers
  const handleExportSimple = (format: 'txt' | 'json' | 'pdf' | 'csv') => {
    if (!program) return;
    const flatExercises = program.weeks?.flatMap(w =>
      w.days.flatMap(d => d.workouts.flatMap(wk => wk.exercises))
    ) || [];
    const exportProgram: ProgramForExport = {
      _id: program.id || '',
      title: program.title || 'Programma',
      description: program.description || '',
      level: program.level || '',
      price: 0,
      exercises: flatExercises.map((ex) => ({
        name: ex.exercise.name,
        sets: ex.sets,
        reps: ex.reps,
        rest: ex.rest,
        notes: ex.notes,
      })),
      date: new Date().toLocaleDateString('it-IT'),
      daysPerWeek: program.daysPerWeek,
      goals: program.goals,
      focus: program.focus,
    };
    if (format === 'txt') downloadTxt(exportProgram);
    else if (format === 'json') downloadJson(exportProgram);
    else if (format === 'pdf') downloadPdf(exportProgram);
    else if (format === 'csv') downloadCsv(exportProgram);
  };

  const handleExportWeeks = (format: 'txt' | 'csv' | 'pdf' | 'json') => {
    if (!program || !program.weeks) return;
    const progTitle = program.title || 'Programma';
    const prog: any = {
      id: program.id || '',
      title: progTitle,
      level: program.level || '',
      focus: program.focus || '',
      date: new Date().toLocaleDateString('it-IT'),
    };
    if (format === 'txt') downloadWeeksTxt(prog, program.weeks);
    else if (format === 'csv') downloadWeeksCsv(prog, program.weeks);
    else if (format === 'pdf') downloadWeeksPdf(prog, program.weeks);
    else if (format === 'json') downloadWeeksJson(prog);
  };

  const renderProgramContent = (programData: Program | null, isEditable: boolean) => {
    if (!programData) return null;
    if (programData.message) return <p className="text-center text-zinc-400">{programData.message}</p>;

    const weeks = programData.weeks || (programData.weeklyPlan ? [{
      weekNumber: 1,
      theme: undefined as string | undefined,
      days: programData.weeklyPlan,
    }] : []);

    return (
      <>
        {weeks.map((week, weekIdx) => (
          <div key={week.weekNumber} className="mb-16">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-white">
                  Settimana {week.weekNumber}
                </h2>
                {week.theme && (
                  <span className="text-sm text-zinc-500 italic">{week.theme}</span>
                )}
                {week.isDeload && (
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Scarico
                  </span>
                )}
              </div>
              {isEditable && (
                <button onClick={() => handleRemoveWeek(weekIdx)} className="text-red-500 hover:text-red-400 transition">
                  <Trash2 size={20} />
                </button>
              )}
            </div>

            {week.days.map((day, dayIdx) => (
              <div key={day.id || dayIdx} className={`mb-8 p-6 rounded-xl border ${day.workouts.length > 0 ? 'border-zinc-700' : 'border-zinc-800/50'}`}>
                <div className="flex justify-between items-center mb-5">
                  {isEditable ? (
                    <input
                      type="text"
                      value={day.name}
                      onChange={(e) => {
                        if (!editedProgram) return;
                        const newProgram = JSON.parse(JSON.stringify(editedProgram)) as Program;
                        newProgram.weeks[weekIdx].days[dayIdx].name = e.target.value;
                        setEditedProgram(newProgram);
                      }}
                      className="text-xl font-bold text-white bg-transparent border-b-2 border-red-500 focus:outline-none w-1/2"
                    />
                  ) : (
                    <h3 className="text-xl font-bold text-white">{day.name}</h3>
                  )}
                  {isEditable && (
                    <button onClick={() => handleRemoveDay(weekIdx, dayIdx)} className="text-red-500 hover:text-red-400 transition">
                      <X size={20} />
                    </button>
                  )}
                </div>

                {day.workouts.map((workout, workoutIdx) => (
                  <div key={workout.id || workoutIdx} className={`mb-6 p-5 rounded-lg ${isEditable ? 'bg-zinc-900/70 border border-zinc-700' : 'bg-zinc-900/30'}`}>
                    <div className="flex justify-between items-center mb-4">
                      {isEditable ? (
                        <input
                          type="text"
                          value={workout.name}
                          onChange={(e) => {
                            if (!editedProgram) return;
                            const newProgram = JSON.parse(JSON.stringify(editedProgram)) as Program;
                            newProgram.weeks[weekIdx].days[dayIdx].workouts[workoutIdx].name = e.target.value;
                            setEditedProgram(newProgram);
                          }}
                          className="text-lg font-semibold text-red-500 bg-transparent border-b-2 border-zinc-600 focus:outline-none w-1/2"
                        />
                      ) : (
                        <h4 className="text-lg font-semibold text-red-500">{workout.name}</h4>
                      )}
                      {isEditable && (
                        <button onClick={() => handleRemoveWorkout(weekIdx, dayIdx, workoutIdx)} className="text-red-500 hover:text-red-400 transition ml-4">
                          <X size={18} />
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      {workout.exercises.map((exercise, exerciseIdx) => {
                        const isDropTarget = dropTarget &&
                          dropTarget.weekIdx === weekIdx &&
                          dropTarget.dayIdx === dayIdx &&
                          dropTarget.workoutIdx === workoutIdx &&
                          dropTarget.exerciseIdx === exerciseIdx;
                        const isDragSrc = dragSource.current &&
                          dragSource.current.weekIdx === weekIdx &&
                          dragSource.current.dayIdx === dayIdx &&
                          dragSource.current.workoutIdx === workoutIdx &&
                          dragSource.current.exerciseIdx === exerciseIdx;
                        return (
                        <div
                          key={exerciseIdx}
                          draggable
                          onDragStart={handleExerciseDragStart(weekIdx, dayIdx, workoutIdx, exerciseIdx)}
                          onDragOver={handleExerciseDragOver(weekIdx, dayIdx, workoutIdx, exerciseIdx)}
                          onDrop={handleExerciseDrop(weekIdx, dayIdx, workoutIdx, exerciseIdx)}
                          onDragEnd={handleExerciseDragEnd}
                          className={`p-4 rounded-lg group relative ${isDropTarget ? 'ring-2 ring-red-500' : ''} ${isDragSrc ? 'opacity-40' : ''} ${isEditable ? 'bg-zinc-800 border border-zinc-700' : 'bg-zinc-800/50'}`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div className="flex-1 md:w-1/3 flex items-center gap-2">
                              <div
                                className="cursor-grab active:cursor-grabbing p-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                onMouseDown={(e) => e.stopPropagation()}
                              >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="text-zinc-500">
                                  <circle cx="3" cy="3" r="1.5" />
                                  <circle cx="11" cy="3" r="1.5" />
                                  <circle cx="3" cy="11" r="1.5" />
                                  <circle cx="11" cy="11" r="1.5" />
                                </svg>
                              </div>
                              {isEditable ? (
                                <div className="flex items-center gap-2 flex-1">
                                  <input
                                    type="text"
                                    value={exercise.exercise.name}
                                    onChange={(e) => handleExerciseChange(weekIdx, dayIdx, workoutIdx, exerciseIdx, 'exercise', { ...exercise.exercise, name: e.target.value })}
                                    className="font-semibold text-white bg-transparent border-b-2 border-zinc-600 focus:outline-none w-full"
                                  />
                                  <button
                                    onClick={() => openExerciseBrowser(weekIdx, dayIdx, workoutIdx)}
                                    className="text-zinc-500 hover:text-red-500 transition shrink-0"
                                    title="Cerca esercizio nel database"
                                  >
                                    <Search size={16} />
                                  </button>
                                </div>
                              ) : (
                                <span className="font-semibold text-white">{exercise.exercise.name}</span>
                              )}
                              {exercise.exercise.muscleGroups && exercise.exercise.muscleGroups.length > 0 && !isEditable && (
                                <p className="text-[10px] text-zinc-500 uppercase mt-1">
                                  {exercise.exercise.muscleGroups.join(', ')}
                                </p>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-4 md:w-2/3 md:justify-end">
                              {[
                                { label: 'Serie', field: 'sets', type: 'number', width: 'w-16' },
                                { label: 'Ripetizioni', field: 'reps', type: 'text', width: 'w-20' },
                                { label: 'Recupero', field: 'rest', type: 'text', width: 'w-20' },
                              ].map(f => (
                                <div key={f.field} className="flex items-center gap-2">
                                  <span className="text-zinc-400 text-xs">{f.label}:</span>
                                  {isEditable ? (
                                    <input
                                      type={f.type}
                                      value={(exercise as any)[f.field] ?? ''}
                                      onChange={(e) => handleExerciseChange(
                                        weekIdx, dayIdx, workoutIdx, exerciseIdx,
                                        f.field,
                                        f.type === 'number' ? parseInt(e.target.value, 10) || 0 : e.target.value
                                      )}
                                      min="1"
                                      className={`${f.width} p-1 border border-zinc-600 rounded bg-zinc-900 text-center text-sm`}
                                    />
                                  ) : (
                                    <span className="text-white text-sm font-medium">{(exercise as any)[f.field]}</span>
                                  )}
                                </div>
                              ))}
                            </div>

                            {isEditable && (
                              <button
                                onClick={() => handleRemoveExercise(weekIdx, dayIdx, workoutIdx, exerciseIdx)}
                                className="text-red-500 hover:text-red-400 transition ml-2 shrink-0"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                          {exercise.notes && (
                            <div className="mt-2 text-xs text-zinc-400 italic">
                              Note: {exercise.notes}
                            </div>
                          )}
                        </div>
                        );
                      })}
                    </div>

                    {isEditable && (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleAddExercise(weekIdx, dayIdx, workoutIdx)}
                          className="flex items-center text-red-500 hover:text-red-400 transition text-sm"
                        >
                          <Plus size={16} className="mr-1" /> Aggiungi Esercizio
                        </button>
                        <button
                          onClick={() => openExerciseBrowser(weekIdx, dayIdx, workoutIdx)}
                          className="flex items-center text-zinc-400 hover:text-red-400 transition text-sm"
                        >
                          <Search size={14} className="mr-1" /> Da Database
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {isEditable && (
                  <button onClick={() => handleAddWorkout(weekIdx, dayIdx)} className="flex items-center text-red-500 hover:text-red-400 transition text-sm">
                    <Plus size={16} className="mr-1" /> Aggiungi Allenamento
                  </button>
                )}
              </div>
            ))}

            {isEditable && (
              <button onClick={() => handleAddDay(weekIdx)} className="flex items-center text-red-500 hover:text-red-400 transition text-sm">
                <Plus size={16} className="mr-1" /> Aggiungi Giorno a Settimana {week.weekNumber}
              </button>
            )}
          </div>
        ))}

        {isEditable && (
          <button onClick={handleAddWeek} className="flex items-center text-red-500 hover:text-red-400 transition text-sm mt-4">
            <Plus size={18} className="mr-2" /> Aggiungi Settimana
          </button>
        )}
      </>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8 bg-black text-white min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-zinc-800 border-t-red-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-8 bg-black text-white min-h-screen">
        <p className="text-red-500 text-center text-lg">{error}</p>
        <div className="text-center mt-8">
          <button onClick={() => navigate('/questionnaire')} className="px-6 py-3 rounded-xl font-bold text-base uppercase tracking-widest text-white bg-red-600 hover:bg-red-500 transition">
            Torna al Profilo
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Mio Programma"
        description="Il tuo programma di calisthenics personalizzato su Maxthenics. Visualizza e gestisci il tuo piano di allenamento settimanale."
        keywords="mio programma calisthenics, piano allenamento personalizzato, settimana workout"
      />
      <div className="container mx-auto p-4 md:p-8 bg-black text-white min-h-screen">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-b from-white to-red-500"
          >
            Il Tuo Programma di Allenamento
          </motion.h1>
          <div className="flex items-center gap-2">
            {/* Export dropdown */}
            {program && program.weeks && program.weeks.length > 0 && !isEditing && (
              <div className="relative group">
                <button className="flex items-center px-3 py-2 rounded-lg text-white bg-zinc-800 hover:bg-zinc-700 transition text-sm">
                  <Download size={16} className="mr-1" /> Esporta <ChevronDown size={14} className="ml-1" />
                </button>
                <div className="absolute right-0 top-full mt-1 z-50 w-52 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden hidden group-hover:block">
                  <div className="p-2">
                    <p className="text-[9px] text-zinc-500 uppercase tracking-wider px-2 py-1">Semplice (lista piatta)</p>
                    <button onClick={() => handleExportSimple('txt')} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors">TXT</button>
                    <button onClick={() => handleExportSimple('csv')} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors">CSV</button>
                    <button onClick={() => handleExportSimple('json')} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors">JSON</button>
                    <button onClick={() => handleExportSimple('pdf')} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors">PDF / Stampa</button>
                  </div>
                  <div className="border-t border-white/5 p-2">
                    <p className="text-[9px] text-zinc-500 uppercase tracking-wider px-2 py-1">Completo (per settimane)</p>
                    <button onClick={() => handleExportWeeks('txt')} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors">TXT</button>
                    <button onClick={() => handleExportWeeks('csv')} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors">CSV</button>
                    <button onClick={() => handleExportWeeks('json')} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors">JSON</button>
                    <button onClick={() => handleExportWeeks('pdf')} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors">PDF / Stampa</button>
                  </div>
                </div>
              </div>
            )}
            {!isEditing && program && program.weeks && program.weeks.length > 0 && (
              <button onClick={handleEditToggle} className="flex items-center px-4 py-2 rounded-lg text-white bg-zinc-800 hover:bg-zinc-700 transition">
                <Edit size={18} className="mr-1" /> Modifica
              </button>
            )}
            {isEditing && (
              <>
                <button onClick={handleSaveProgram} disabled={loading} className="flex items-center px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-500 transition mr-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin mr-1" /> : <Check size={18} className="mr-1" />} Salva Modifiche
                </button>
                <button onClick={handleEditToggle} className="flex items-center px-4 py-2 rounded-lg text-white bg-zinc-700 hover:bg-zinc-600 transition">
                  Annulla
                </button>
              </>
            )}
          </div>
        </div>

        {/* eslint-disable-next-line react-hooks/refs */}
        {renderProgramContent(isEditing ? editedProgram : program, isEditing)}
      </div>

      {/* Exercise Browser Modal */}
      {showExerciseBrowser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-zinc-700">
              <h3 className="text-lg font-bold text-white">Database Esercizi</h3>
              <button onClick={() => setShowExerciseBrowser(false)} className="text-zinc-400 hover:text-white transition">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 border-b border-zinc-800 space-y-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={exerciseSearch}
                  onChange={(e) => setExerciseSearch(e.target.value)}
                  placeholder="Cerca per nome, muscolo, attrezzatura..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setExerciseFilter(null)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                    !exerciseFilter ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  Tutti
                </button>
                {['beginner', 'intermediate', 'advanced'].map(d => (
                  <button
                    key={d}
                    onClick={() => setExerciseFilter(exerciseFilter === d ? null : d)}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                      exerciseFilter === d ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {d === 'beginner' ? 'Princip.' : d === 'intermediate' ? 'Intermed.' : 'Avanz.'}
                  </button>
                ))}
                {muscleGroups.slice(0, 8).map(m => (
                  <button
                    key={m}
                    onClick={() => setExerciseFilter(exerciseFilter === m ? null : m)}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                      exerciseFilter === m ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {m.slice(0, 12)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredExercises.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => {
                      addExerciseFromBrowser(ex);
                      setShowExerciseBrowser(false);
                    }}
                    className="text-left p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:border-red-500/30 hover:bg-zinc-800 transition-all group"
                  >
                    <p className="font-semibold text-white text-sm group-hover:text-red-400 transition-colors">{ex.name}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {ex.muscleGroups.primary.slice(0, 2).map(m => (
                        <span key={m} className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400/70">{m}</span>
                      ))}
                      <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                        ex.difficulty === 'beginner' ? 'bg-emerald-500/10 text-emerald-400' :
                        ex.difficulty === 'intermediate' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>{ex.difficulty}</span>
                    </div>
                    <p className="text-[10px] text-zinc-600 mt-1 line-clamp-1">{ex.description}</p>
                  </button>
                ))}
              </div>
              {filteredExercises.length === 0 && (
                <p className="text-center text-zinc-500 py-8">Nessun esercizio trovato</p>
              )}
            </div>

            <div className="p-3 border-t border-zinc-800 text-center text-xs text-zinc-600">
              {filteredExercises.length} di {exercises.length} esercizi
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyProgram;
