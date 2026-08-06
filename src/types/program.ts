/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ExerciseRef {
  id: string;
  name: string;
  description?: string;
  muscleGroups?: string[];
  equipment?: string[];
  difficulty?: string;
  videoUrl?: string;
  progression?: string[];
}

export interface ExerciseEntry {
  exercise: ExerciseRef;
  sets: number;
  reps: string;
  rest: string;
  tempo?: string;
  rpe?: number;
  notes?: string;
  order: number;
}

export interface Workout {
  id: string;
  name: string;
  focus?: string;
  exercises: ExerciseEntry[];
  warmUp?: string[];
  coolDown?: string[];
  duration?: number;
}

export interface TrainingDay {
  id: string;
  name: string;
  workouts: Workout[];
  notes?: string;
}

export interface WeekPlan {
  weekNumber: number;
  theme?: string;
  days: TrainingDay[];
  isDeload?: boolean;
  notes?: string;
}

export interface UserProfileSnapshot {
  age: string;
  weight: string;
  height: string;
  experience: string;
  equipment: string;
  injury?: string;
  gender?: string;
  goals?: string;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  level: string;
  focus: string;
  goals: string;
  userProfile?: UserProfileSnapshot;
  weeks: WeekPlan[];
  daysPerWeek: number;
  sessionDuration?: string;
  date: string;
  createdAt: string;
  updatedAt?: string;
  intensity?: string;
  bodyFocus?: string[];
  price: number;
  // Flat exercise list for backward compatibility
  exercises?: ExerciseEntry[];
  // Weekly structure used by the AI generator
  weeklyPlan?: TrainingDay[];
}

export interface SavedProgram {
  id: string;
  userId?: string;
  title: string;
  description: string;
  level: string;
  price: number;
  exercises: ExerciseEntry[];
  date: string;
  daysPerWeek: number;
  goals: string;
  age: string;
  weight: string;
  height: string;
  experience: string;
  trainingType?: string;
  equipment: string;
  focus: string;
  injury: string;
  gender?: string;
  intensity?: string;
  sessionDuration?: string;
  bodyFocus?: string[];
  weeks?: WeekPlan[];
}

export function exerciseEntryFromSaved(ex: any): ExerciseEntry {
  return {
    exercise: {
      id: ex.id || `custom-${Date.now()}`,
      name: ex.name || 'Esercizio',
      description: ex.description,
      muscleGroups: ex.muscleGroups || [],
      equipment: ex.equipment ? [ex.equipment] : [],
      difficulty: ex.difficulty,
    },
    sets: ex.sets ?? 3,
    reps: ex.reps ?? '10',
    rest: ex.rest ?? '60s',
    tempo: ex.tempo,
    rpe: ex.rpe,
    notes: ex.notes,
    order: ex.order ?? 0,
  };
}

export function savedToProgram(saved: SavedProgram): Program {
  const entries = (saved.exercises || []).map(exerciseEntryFromSaved);
  const grouped: TrainingDay[] = [];
  const perDay = Math.ceil(entries.length / (saved.daysPerWeek || 3));
  for (let d = 0; d < (saved.daysPerWeek || 3); d++) {
    const dayEntries = entries.slice(d * perDay, (d + 1) * perDay);
    grouped.push({
      id: `day-${d + 1}`,
      name: `Giorno ${d + 1}`,
      workouts: dayEntries.length > 0 ? [{
        id: `workout-${d + 1}`,
        name: saved.focus || 'Full Body',
        exercises: dayEntries,
      }] : [],
    });
  }
  return {
    id: saved.id,
    title: saved.title,
    description: saved.description,
    level: saved.level,
    focus: saved.focus,
    goals: saved.goals,
    weeks: [{
      weekNumber: 1,
      theme: 'Programma Base',
      days: grouped,
    }],
    daysPerWeek: saved.daysPerWeek,
    date: saved.date,
    createdAt: saved.date,
    intensity: saved.intensity,
    sessionDuration: saved.sessionDuration,
    bodyFocus: saved.bodyFocus,
    price: saved.price,
    exercises: entries,
    weeklyPlan: grouped,
  };
}
