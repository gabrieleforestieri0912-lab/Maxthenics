'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { programData, localizeProgram } from '../data/programs';
import { getCurriculum } from '../data/curriculum';
import { localizeList, localizeNote } from '../data/exerciseI18n';
import { getLessonProgress, toggleLessonProgress } from '../lib/lessonProgress';
import Curriculum from '../components/Curriculum';
import ShareButton from '../components/ShareButton';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { exerciseDatabase, Exercise } from '../data/exercises';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, ChevronRight, Target, Dumbbell, BookOpen, Flame, Zap, Check, GraduationCap } from 'lucide-react';
import SEO from "../components/SEO";

// ─── Workout Data Types ───
interface WorkoutSet {
  sets: number;
  reps: string;
  rest: string;
  tempo: string;
  notes: string;
}

interface ExerciseEntry {
  exerciseId: string;
  exercise: Exercise;
  workout: WorkoutSet;
}

interface WorkoutDay {
  day: number;
  week: number;
  focus: string;
  exercises: ExerciseEntry[];
}

interface WeekPlan {
  week: number;
  theme: string;
  days: WorkoutDay[];
}

interface ProgramWorkoutPlan {
  id: number;
  weeks: WeekPlan[];
  weeklyOverview: {
    day: string;
    focus: string;
    exerciseIds: string[];
  }[];
  warmUp: string[];
  coolDown: string[];
  progressionNotes: string[];
}

// ─── Exercise finder helper ───
const findExercise = (id: string): Exercise | undefined =>
  exerciseDatabase.find((ex) => ex.id === id);

function weekTheme(weekIdx: number, totalWeeks: number, _programId: number, locale: 'it' | 'en' = 'it'): string {
  const third = Math.ceil(totalWeeks / 3);
  if (locale === 'en') {
    if (weekIdx < third) return 'Conditioning & Adaptation';
    if (weekIdx < third * 2) return 'Volume Intensification';
    return 'Strength Peak & Mastery';
  }
  if (weekIdx < third) return 'Condizionamento & Adattamento';
  if (weekIdx < third * 2) return 'Intensificazione del Volume';
  return 'Picco di Forza & Mastery';
}

// ─── Program-specific workout configs ───
const PROGRAM_CONFIG: Record<number, {
  title: string;
  tagline: string;
  taglineEn: string;
  warmUp: string[];
  warmUpEn: string[];
  coolDown: string[];
  coolDownEn: string[];
  getWorkout: (exercise: Exercise, week: number, dayIndex: number) => WorkoutSet;
}> = {
  101: {
    title: 'Metabolic Neural Flow',
    tagline: 'Attivazione neurale e metabolica per principianti assoluti.',
    taglineEn: 'Neural and metabolic activation for absolute beginners.',
    warmUp: ['Cat-Cow Stretch (10x)', "Child's Pose (30s)", 'Jumping Jacks (1 min)', 'Arm Circles (fwd/bwd 10x)'],
    warmUpEn: ['Cat-Cow Stretch (10x)', "Child's Pose (30s)", 'Jumping Jacks (1 min)', 'Arm Circles (fwd/bwd 10x)'],
    coolDown: ['Deep Squat Hold (1 min)', 'Pigeon Stretch (1 min/side)', 'Foam Rolling (gambe)'],
    coolDownEn: ['Deep Squat Hold (1 min)', 'Pigeon Stretch (1 min/side)', 'Foam Rolling (legs)'],
    getWorkout: (ex, _week) => ({
      sets: 3,
      reps: ex.type === 'strength' ? '8-10' : '30-45s',
      rest: '60-90s',
      tempo: '2/0/1/0',
      notes: 'Movimento controllato, priorità alla forma corretta',
    }),
  },
  102: {
    title: 'Core Structural Stability',
    tagline: 'La base biomeccanica indistruttibile: core profondo, respirazione, forza isometrica.',
    taglineEn: 'The unbreakable biomechanical base: deep core, breathing, isometric strength.',
    warmUp: ['Plank (60s)', 'Bird-Dog (10x/side)', 'Cat-Cow (10x)', 'Hollow Body Rock (20x)'],
    warmUpEn: ['Plank (60s)', 'Bird-Dog (10x/side)', 'Cat-Cow (10x)', 'Hollow Body Rock (20x)'],
    coolDown: ['Arch Body Rock (20x)', 'Child\'s Pose (1 min)', 'Deep Squat Hold (30s)'],
    coolDownEn: ['Arch Body Rock (20x)', 'Child\'s Pose (1 min)', 'Deep Squat Hold (30s)'],
    getWorkout: (ex, week, dayIndex) => {
      const isCoreDay = dayIndex === 4;
      return {
        sets: ex.type === 'strength' ? 4 : 3,
        reps: ex.type === 'strength' ? '8-12' : '45-60s',
        rest: isCoreDay ? '30-45s' : '90-120s',
        tempo: '3/1/2/1',
        notes: isCoreDay
          ? 'Respirazione diaframmatica. Attiva il trasverso prima di ogni movimento.'
          : 'Controllo totale, nessun rimbalzo',
      };
    },
  },
  103: {
    title: 'Fundamental Biomechanics',
    tagline: 'Traiettorie tecniche perfette per trazioni, piegamenti e dip.',
    taglineEn: 'Perfect technical patterns for pull-ups, push-ups and dips.',
    warmUp: ['Scapular Wall Slides (15x)', 'Dynamic Chest Stretch (10x/side)', 'Jumping Jacks (1 min)', 'Wrist Prep (30s/side)'],
    warmUpEn: ['Scapular Wall Slides (15x)', 'Dynamic Chest Stretch (10x/side)', 'Jumping Jacks (1 min)', 'Wrist Prep (30s/side)'],
    coolDown: ['Deep Squat Hold (1 min)', 'Pigeon Stretch (1 min/side)', 'Thoracic Spine Rotation (10x/side)'],
    coolDownEn: ['Deep Squat Hold (1 min)', 'Pigeon Stretch (1 min/side)', 'Thoracic Spine Rotation (10x/side)'],
    getWorkout: (ex, week, _dayId) => {
      if (ex.id === 'bw-004') { // pull-up day high intensity
        return { sets: 4, reps: week <= 2 ? '5-7' : '6-9', rest: '90-120s', tempo: '2/1/2/0', notes: 'Scapular retraction before each rep' };
      }
      if (ex.id === 'bw-001') { // push-up
        return { sets: 4, reps: week <= 2 ? '10-12' : '8-10', rest: '60-90s', tempo: '2/0/1/0', notes: 'Full ROM, core braced' };
      }
      if (ex.id === 'bw-006') { // burpee
        return { sets: 3, reps: week <= 2 ? '8' : '10-12', rest: '60s', tempo: 'esplosivo', notes: 'Full extension at the top' };
      }
      return { sets: 3, reps: '10-12', rest: '60-90s', tempo: '2/1/2/0', notes: 'Controllo totale, nessun rimbalzo' };
    },
  },
  201: {
    title: 'Retraction & Depression Protocol',
    tagline: 'Forza scapolare specifica per il Front Lever: la base bioenergetica.',
    taglineEn: 'Specific scapular strength for the Front Lever: the bioenergetic base.',
    warmUp: ['Scapular Wall Slides (15x)', 'Wrist Prep (30s/side)', 'Arm Circles (10x fwd/bwd)', 'Tuck Front Lever Hold (20s x 3)'],
    warmUpEn: ['Scapular Wall Slides (15x)', 'Wrist Prep (30s/side)', 'Arm Circles (10x fwd/bwd)', 'Tuck Front Lever Hold (20s x 3)'],
    coolDown: ['Child\'s Pose (1 min)', 'Thoracic Rotation (10x/side)', 'Dislocate al Bastone (10x, presa larga)'],
    coolDownEn: ['Child\'s Pose (1 min)', 'Thoracic Rotation (10x/side)', 'Wide-Grip Stick Dislocates (10x)'],
    getWorkout: (ex, week) => {
      if (ex.id === 'bw-004') {
        return { sets: 4, reps: week <= 3 ? '5-7' : week <= 6 ? '6-8' : '5-6 zavorrato', rest: '90-120s', tempo: '2/0/1/0', notes: 'Retriczione completa nella fase discendente' };
      }
      if (ex.id === 'bw-008') {
        return { sets: 4, reps: week <= 3 ? '10-15s' : week <= 6 ? '15-20s' : '20-25s', rest: '90s', tempo: 'isometrico', notes: 'Corpo perfettamente allineato, braccia tese' };
      }
      if (ex.id === 'bw-003') {
        return { sets: 3, reps: '60-90s', rest: '90s', tempo: 'isometrico', notes: 'Core banda bassa attiva come supporto' };
      }
      if (ex.id === 'mob-003') {
        return { sets: 2, reps: '15x/side', rest: '30s', tempo: 'dinamico', notes: 'Apertura profonda del petto al termine di ogni lato' };
      }
      return { sets: 3, reps: '8-10', rest: '60-90s', tempo: '2/1/2/1', notes: 'Controllo totale' };
    },
  },
  202: {
    title: 'Straddle Lever Dynamics',
    tagline: 'Transizione avanzata: dalla leva al massimo reclutamento delle unità motorie.',
    taglineEn: 'Advanced transition: from the lever to maximum motor-unit recruitment.',
    warmUp: ['Adv Tuck Front Lever (30s x 1)', 'Wrist Prep arcobaleno (20s/side)', 'Scapular Depression drills (10x)', 'Dislocate al Bastone larga (10x)'],
    warmUpEn: ['Adv Tuck Front Lever (30s x 1)', 'Rainbow Wrist Prep (20s/side)', 'Scapular Depression Drills (10x)', 'Wide Stick Dislocates (10x)'],
    coolDown: ['Child\'s Pose con apertura braccia (1 min)', 'Foam Rolling Schiena (2 min)', 'Deep Squat Hold (30s)'],
    coolDownEn: ['Child\'s Pose with open arms (1 min)', 'Back Foam Rolling (2 min)', 'Deep Squat Hold (30s)'],
    getWorkout: (ex, week, dayIndex) => {
      const isSkillsDay = dayIndex === 4;
      // Straddle/full front lever days
      if (ex.id === 'bw-009' || ex.id === 'bw-009-full') {
        return { sets: 4, reps: week <= 3 ? '8-12s' : week <= 7 ? '12-18s' : '15-20s', rest: '120-150s', tempo: 'isometrico', notes: 'Allinea bacino e gambe; spalle attive contro trazione' };
      }
      if (ex.id === 'bw-008-one-leg') {
        return { sets: 3, reps: week <= 3 ? '6-8x hold' : week <= 7 ? '8-10x hold' : '10-12x hold', rest: '90s', tempo: 'isometrico', notes: 'Cambia gamba ogni ripetizione' };
      }
      if (ex.id === 'bw-004') {
        const repsTarget = week <= 3 ? '6-8' : week <= 7 ? '5-7 (+5kg)' : '4-5 (+8kg)';
        return { sets: 4, reps: repsTarget, rest: '120s', tempo: '2/1/2/0', notes: 'Spinte esplosive, fase discendente controllata 2s' };
      }
      if (ex.id === 'bw-003') {
        return { sets: 3, reps: '90-120s', rest: '90s', tempo: 'isometrico', notes: 'Core e scapole attive' };
      }
      return { sets: 4, reps: isSkillsDay ? '5-8' : '8-10', rest: isSkillsDay ? '150s' : '90s', tempo: '2/1/2/0', notes: 'Focus su tecnica e controllo della barra' };
    },
  },
  203: {
    title: 'Elite Pulling Mechanics',
    tagline: 'Il culmine. Full Front Lever e pull-ups in leva. Reclutamento massimale delle unità motorie.',
    taglineEn: 'The pinnacle. Full Front Lever and lever pull-ups. Maximal motor-unit recruitment.',
    warmUp: ['Full FL Hold (30s)', 'Muscle-up Assistito (5x)', 'Wrist Prep arcobaleno (30s/side)', 'Dislocate al Bastone stretta (10x)'],
    warmUpEn: ['Full FL Hold (30s)', 'Assisted Muscle-up (5x)', 'Rainbow Wrist Prep (30s/side)', 'Narrow Stick Dislocates (10x)'],
    coolDown: ['German Hang (60s)', 'Arch Body Rock (20x)', 'Deep Squat Hold (1 min)'],
    coolDownEn: ['German Hang (60s)', 'Arch Body Rock (20x)', 'Deep Squat Hold (1 min)'],
    getWorkout: (ex, week) => {
      if (ex.id === 'bw-009-full') {
        return { sets: 5, reps: week <= 4 ? '8-12s' : week <= 8 ? '12-18s' : '15-22s', rest: '180s', tempo: 'isometrico', notes: 'Massima tensione, zero slack nel corpo' };
      }
      if (ex.id === 'bw-014') {
        return { sets: 4, reps: week <= 4 ? '3-4' : week <= 8 ? '4-5' : '5-6', rest: '180s', tempo: 'esplosivo', notes: 'Transizione pulita, nessun swing' };
      }
      if (ex.id === 'bw-004' || ex.id === 'bw-029') {
        return { sets: 4, reps: week <= 4 ? '3-5 zavorrato' : week <= 8 ? '4-6 zavorrato' : '5-7 zavorrato', rest: '150s', tempo: '2/1/2/0', notes: 'Solo trazioni esplosive e controllate' };
      }
      if (ex.id === 'bw-030') {
        return { sets: 3, reps: week <= 4 ? '2-3' : week <= 8 ? '3-4' : '4-5', rest: '180s', tempo: '2/0/2/0', notes: 'Mantieni leva più a lungo possibile' };
      }
      return { sets: 4, reps: '6-9', rest: '120-150s', tempo: '2/1/2/0', notes: 'Focus su tecnica, non sul numero di ripetizioni' };
    },
  },
  301: {
    title: 'Protraction & Wrist Resilience',
    tagline: 'Serrati anteriori e salute dei polsi: le fondamenta pneumatiche per la spinta.',
    taglineEn: 'Serratus anterior and wrist health: the foundations of pushing strength.',
    warmUp: ['Wrist Prep arcobaleno (30s/side)', 'Dislocate al Bastone (presa larga, 10x)', 'Cat-Cow (10x)', 'Dynamic Chest Stretch (10x/side)'],
    warmUpEn: ['Rainbow Wrist Prep (30s/side)', 'Wide-Grip Stick Dislocates (10x)', 'Cat-Cow (10x)', 'Dynamic Chest Stretch (10x/side)'],
    coolDown: ['Child\'s Pose (1 min)', 'Deep Squat Hold (30s)', 'Tuck Planche Hold (20s x 2)'],
    coolDownEn: ['Child\'s Pose (1 min)', 'Deep Squat Hold (30s)', 'Tuck Planche Hold (20s x 2)'],
    getWorkout: (ex, week, _dayIndex) => {
      if (ex.id === 'bw-010') {
        return {
          sets: 4,
          reps: week <= 2 ? '10-15s' : week <= 5 ? '15-22s' : '20-30s',
          rest: '90s',
          tempo: 'isometrico',
          notes: 'Spingi attraverso le braccia (protrazione), non basta protrarre il torace',
        };
      }
      if (ex.id === 'bw-011') {
        return { sets: 4, reps: week <= 2 ? '5-8s' : week <= 5 ? '8-12s' : '10-15s', rest: '120s', tempo: 'isometrico', notes: 'Stringi le gambe gradualmente per aumentare la difficoltà' };
      }
      return { sets: 3, reps: '10-12', rest: '60-90s', tempo: '2/1/2/0', notes: 'Controllo totale, nessun rimbalzo' };
    },
  },
   302: {
    title: 'Hypertrophic Push Periodization',
    tagline: 'Periodizzazione ondulata per volume specifico e forza esplosiva: dalla Tuck alla Straddle Planche.',
    taglineEn: 'Undulating periodization for specific volume and explosive strength: from Tuck to Straddle Planche.',
    warmUp: ['Pike Push-up (8x)', 'Wrist Prep (30s/side)', 'Scapular Wall Slides (15x)', 'Push-up incline (10x)'],
    warmUpEn: ['Pike Push-up (8x)', 'Wrist Prep (30s/side)', 'Scapular Wall Slides (15x)', 'Incline Push-ups (10x)'],
    coolDown: ['Child\'s Pose (1 min)', 'Dynamic Chest Stretch (10x/side)', 'Deep Squat Hold (30s)'],
    coolDownEn: ['Child\'s Pose (1 min)', 'Dynamic Chest Stretch (10x/side)', 'Deep Squat Hold (30s)'],
    getWorkout: (ex, week, _dayIndex) => {
      // Periodizzazione ondulata: Week 1-3 volume, Week 4-6 intensità, Week 7-10 picco
      const phase = week <= 3 ? 'volume' : week <= 6 ? 'intensity' : 'peak';
      if (ex.id === 'bw-011') {
        const hold = phase === 'volume' ? '8-12s' : phase === 'intensity' ? '12-18s' : '15-22s';
        return { sets: phase === 'volume' ? 5 : phase === 'intensity' ? 4 : 3, reps: hold, rest: phase === 'peak' ? '180s' : '120s', tempo: 'isometrico', notes: 'Attenzione alla caviglia: apri gradualmente la straddle' };
      }
      if (ex.id === 'bw-010') {
        const setsN = phase === 'volume' ? 4 : phase === 'intensity' ? 3 : 5;
        return { sets: setsN, reps: phase === 'volume' ? '15-20s' : phase === 'intensity' ? '10-15s' : '8-12s', rest: '90s', tempo: 'isometrico', notes: 'Riduci progressivamente la flessione delle gambe' };
      }
      if (ex.id === 'bw-001') {
        return { sets: phase === 'volume' ? 5 : 4, reps: phase === 'volume' ? '12-15' : '8-10', rest: '60-90s', tempo: phase === 'volume' ? '2/0/1/0' : '3/1/2/0', notes: 'Controllo eccentrico soprattutto nella fase discendente' };
      }
      return { sets: phase === 'volume' ? 4 : 3, reps: '8-10', rest: '90-120s', tempo: '2/1/2/0', notes: 'Focus su tempo sotto tensione durante la fase intensiva' };
    },
  },
  303: {
    title: 'Full Planche Bio-Optimization',
    tagline: 'Il culmine della spinta statica. Dominio totale della gravità con momenti di forza ottimizzati.',
    taglineEn: 'The pinnacle of static pushing. Total mastery of gravity with optimized torque.',
    warmUp: ['Straddle Planche (15s x 3)', 'Pike Push-up (8x)', 'Wrist Prep arcobaleno (30s/side)', 'Planche Lean (15x)', 'Hollow Body Rock (25x)'],
    warmUpEn: ['Straddle Planche (15s x 3)', 'Pike Push-up (8x)', 'Rainbow Wrist Prep (30s/side)', 'Planche Lean (15x)', 'Hollow Body Rock (25x)'],
    coolDown: ['Child\'s Pose (1 min)', 'Dislocate al Bastone stretta (10x)', 'Deep Squat Hold (30s)', 'Foam Rolling petto e spalle'],
    coolDownEn: ['Child\'s Pose (1 min)', 'Narrow Stick Dislocates (10x)', 'Deep Squat Hold (30s)', 'Chest & Shoulder Foam Rolling'],
    getWorkout: (ex, week) => {
      // Fase 1 (week 1-5): Volume / Fase 2 (week 6-10): Intensità / Fase 3 (week 11-14): Peak
      const phase = week <= 5 ? 'volume' : week <= 10 ? 'intensity' : 'peak';
      if (ex.id === 'bw-011') {
        return {
          sets: phase === 'volume' ? 5 : phase === 'intensity' ? 4 : 5,
          reps: phase === 'volume' ? '10-15s' : phase === 'intensity' ? '8-12s' : '12-18s',
          rest: phase === 'volume' ? '90s' : phase === 'intensity' ? '120s' : '180s',
          tempo: 'isometrico',
          notes: phase === 'peak' ? 'Tensione massimale, 3-5s hold qualità. Recupera completamente.' : 'Graduale avvicinamento alla straddle completa',
        };
      }
      if (ex.id === 'bw-010') {
        return { sets: phase === 'volume' ? 4 : 3, reps: phase === 'volume' ? '15-20s' : '12-15s', rest: '60-90s', tempo: 'isometrico', notes: 'Avvicinamento piano al tuck' };
      }
      if (ex.id === 'bw-027') {
        return { sets: phase === 'volume' ? 4 : 3, reps: phase === 'volume' ? '10-15' : '6-9', rest: phase === 'intensity' ? '120s' : '90s', tempo: '2/1/2/0', notes: 'Fase eccentrica 3s per massimizzare la tensione' };
      }
      if (ex.id === 'bw-001') {
        return {
          sets: 4,
          reps: phase === 'volume' ? '12-15' : phase === 'intensity' ? '8-10' : '6-8',
          rest: '90-120s',
          tempo: '3/1/2/0',
          notes: 'Controllo eccentrico 3 secondi. Massima tensione isometrica in fondo',
        };
      }
      return { sets: phase === 'volume' ? 4 : 3, reps: '8-10', rest: '90-120s', tempo: '2/1/2/0', notes: 'Focus su tensione isometrica e controllo' };
    },
  },
  401: {
    title: 'Handstand Mastery',
    tagline: 'Dalla preparazione di polsi alla handstand libera. Il blueprint completo per l\'inversione.',
    taglineEn: 'From wrist prep to the freestanding handstand. The complete inversion blueprint.',
    warmUp: ['Wrist Prep arcobaleno (30s/side)', 'Dislocate al Bastone larga (10x)', 'Hollow Body Hold (20s x 3)', 'Cat-Cow (10x)', 'Pike Compression (30s)'],
    warmUpEn: ['Rainbow Wrist Prep (30s/side)', 'Wide Stick Dislocates (10x)', 'Hollow Body Hold (20s x 3)', 'Cat-Cow (10x)', 'Pike Compression (30s)'],
    coolDown: ['Pigeon Stretch (1 min/side)', 'Child\'s Pose (1 min)', 'Foam Rolling spalle (2 min)', 'Wrist Circles (30s/side)'],
    coolDownEn: ['Pigeon Stretch (1 min/side)', 'Child\'s Pose (1 min)', 'Shoulder Foam Rolling (2 min)', 'Wrist Circles (30s/side)'],
    getWorkout: (ex, week, dayIndex) => {
      const isHSDay = dayIndex === 2;
      if (ex.id === 'bw-012') { // Handstand Hold
        return { sets: 5, reps: week <= 2 ? '10-15s' : week <= 5 ? '15-25s' : '25-40s', rest: '90-120s', tempo: 'isometrico', notes: isHSDay ? 'Al muro → progressivamente meno supporto' : 'Sostegni chiusi, core e glutei serrati' };
      }
      if (ex.id === 'bw-013') { // Wall Walk
        return { sets: 4, reps: week <= 2 ? '2-3' : week <= 5 ? '4-5' : '5-6', rest: '120-150s', tempo: 'controllato', notes: 'Movimenti lenti e controllati. Non precipitare verso il muro.' };
      }
      if (ex.id === 'bw-037') { // Handstand Walk
        return { sets: 4, reps: week <= 4 ? '6-8 passi' : week <= 6 ? '10-15 passi' : '3-5 round x 30s', rest: '120s', tempo: 'dinamico', notes: 'Spalle lontane dalle orecchie, core serrato' };
      }
      if (ex.id === 'bw-024') { // Handstand Push-up
        return {
          sets: 4,
          reps: week <= 3 ? '3-4 (negativa 5s)' : week <= 6 ? '5-6 (negativa 3s)' : '6-8',
          rest: '150-180s',
          tempo: '2/0/1/0',
          notes: 'Negativa sempre controllata. Non scendere oltre il punto di sicurezza.',
        };
      }
      if (ex.id === 'bw-023') { // Pike Push-up
        return {
          sets: 4,
          reps: week <= 3 ? '8-10' : week <= 6 ? '10-12' : '10-12 (+5kg se possibile)',
          rest: '90-120s',
          tempo: '2/0/1/0',
          notes: 'V-shape stretta, testa tra le braccia',
        };
      }
      if (ex.id === 'bw-015' || ex.id === 'bw-016') {
        return {
          sets: 4,
          reps: '20-30s' + (week > 4 ? ' (con discese)' : ''),
          rest: '60s',
          tempo: 'isometrico',
          notes: 'L-sit e compressione del core per la stabilizzazione inversa',
        };
      }
      return { sets: 4, reps: '8-10', rest: '90-120s', tempo: '2/1/2/0', notes: 'Focus su isometria e controllo' };
    },
  },
  402: {
    title: 'Back Lever & German Hang',
    tagline: 'La catena posteriore completa: German Hang → Tuck → Straddle → Full Back Lever.',
    taglineEn: 'The complete posterior chain: German Hang → Tuck → Straddle → Full Back Lever.',
    warmUp: ['German Hang (30s x 2)', 'Hollow Body Rock (25x)', 'Arch Body Rock (25x)', 'Thoracic Spine Rotation (10x/side)', 'Scapular Depression drills (10x)'],
    warmUpEn: ['German Hang (30s x 2)', 'Hollow Body Rock (25x)', 'Arch Body Rock (25x)', 'Thoracic Spine Rotation (10x/side)', 'Scapular Depression Drills (10x)'],
    coolDown: ['Child\'s Pose con torace aperto (1 min)', 'Deep Squat Hold (45s)', 'Foam Rolling catena posteriore completa (3 min)'],
    coolDownEn: ['Child\'s Pose with open chest (1 min)', 'Deep Squat Hold (45s)', 'Full Posterior-Chain Foam Rolling (3 min)'],
    getWorkout: (ex, week, _dayIndex) => {
      if (ex.id === 'bw-020-tuck' || ex.id === 'bw-020-german') {
        return { sets: 4, reps: week <= 3 ? '10-15s tuck' : week <= 7 ? '15-25s tuck' : '20-35s tuck', rest: '90-120s', tempo: 'isometrico', notes: 'Scapole depresse e addominale contratto' };
      }
      if (ex.id === 'bw-020') {
        return { sets: 3, reps: week <= 3 ? '5-8s' : week <= 7 ? '8-12s' : '12-18s', rest: '150-180s', tempo: 'isometrico', notes: 'Completa apertura del corpo, tensione massima' };
      }
      if (ex.id === 'bw-004' || ex.id === 'bw-029') {
        return { sets: 4, reps: week <= 3 ? '6-8' : week <= 7 ? '5-7' : '4-6 (+peso)', rest: '90-120s', tempo: '2/0/2/0', notes: 'Scapole depresse in fase discendente, discesa controllata' };
      }
      if (ex.id === 'bw-035') {
        return { sets: 3, reps: week <= 3 ? '15x' : '20x', rest: '60s', tempo: 'dinamico', notes: 'Rock fluido, non fermarti a metà del movimento' };
      }
      if (ex.id === 'bw-034') {
        return { sets: 3, reps: week <= 3 ? '20x' : '25x', rest: '45s', tempo: 'dinamico', notes: 'Corpo a forma di banana chiusa, movimento da cuscino a cuscino' };
      }
      return { sets: 3, reps: '8-10', rest: '90-120s', tempo: '2/1/2/0', notes: 'Focus su scapole depresse e attivazione lombare' };
    },
  },
  403: {
    title: 'Human Flag & Maltese',
    tagline: 'La dominanza orizzontale. Human Flag → Struttle Maltese → Full Maltese.',
    taglineEn: 'Horizontal dominance. Human Flag → Straddle Maltese → Full Maltese.',
    warmUp: ['German Hang (30s)', 'Tuck Human Flag hold (10s/side)', 'Arch Body Rock (25x)', 'Core Hollow Body (30s)', 'Scapular Wall Slides (15x)'],
    warmUpEn: ['German Hang (30s)', 'Tuck Human Flag Hold (10s/side)', 'Arch Body Rock (25x)', 'Hollow Body Core (30s)', 'Scapular Wall Slides (15x)'],
    coolDown: ['Child\'s Pose (1 min)', 'Pigeon Stretch (1 min/side)', 'Deep Squat Hold (45s)', 'Foam Rolling (3 min)'],
    coolDownEn: ['Child\'s Pose (1 min)', 'Pigeon Stretch (1 min/side)', 'Deep Squat Hold (45s)', 'Foam Rolling (3 min)'],
    getWorkout: (ex, week) => {
      const phase = week <= 4 ? 'tuck' : week <= 8 ? 'straddle' : 'full';
      if (ex.id === 'bw-019-tuck') {
        return {
          sets: 4,
          reps: phase === 'tuck' ? `${10 + week * 3}s hold` : `${15 + week * 2}s`,
          rest: '120-150s',
          tempo: 'isometrico',
          notes: phase === 'tuck'
            ? 'Gambe raccolte. Rotea gradualmente il bacino per la posizione di tuck-dip'
            : 'Transizione graduale dalla tuck alla straddle',
        };
      }
      if (ex.id === 'bw-019') {
        return { sets: 3, reps: week <= 8 ? `${5 + week}s hold` : `${8 + week}s hold`, rest: '180s', tempo: 'isometrico', notes: phase === 'full' ? 'Corpo perfettamente orizzontale' : 'Progressivo distanziamento delle gambe' };
      }
      if (ex.id === 'bw-022' || ex.id === 'bw-028') {
        return { sets: 4, reps: week <= 4 ? '6-8' : week <= 8 ? '8-10' : '8-10 (+ pesi)', rest: '120s', tempo: '2/1/2/0', notes: 'Rotazione esterna della spalla per sicurezza articolare' };
      }
      if (ex.id === 'bw-011' || ex.id === 'bw-031' || ex.id === 'mob-003') {
        return { sets: 4, reps: '12-15', rest: '60-90s', tempo: '2/1/2/0', notes: 'Spinte controllate, enfasi sulla protezione della cuffia dei rotatori' };
      }
      return { sets: 4, reps: '6-10', rest: '120-180s', tempo: '2/1/2/0', notes: 'Focus sulla forza laterale e sulla rotazione del core' };
    },
  },
  404: {
    title: 'Dragon Flag Progression',
    tagline: "L'armatura del core. Tuck → Advanced Tuck → Straddle → Full Dragon Flag.",
    taglineEn: 'Core armor. Tuck → Advanced Tuck → Straddle → Full Dragon Flag.',
    warmUp: ['Hollow Body Rock (25x)', 'Arch Body Rock (25x)', 'Tuck Dragon Flag (3 x 5s)', 'Plank (60s)'],
    warmUpEn: ['Hollow Body Rock (25x)', 'Arch Body Rock (25x)', 'Tuck Dragon Flag (3 x 5s)', 'Plank (60s)'],
    coolDown: ['Child\'s Pose (1 min)', 'Pigeon Stretch (1 min/side)', 'Foam Rolling bassa schiena (2 min)'],
    coolDownEn: ['Child\'s Pose (1 min)', 'Pigeon Stretch (1 min/side)', 'Lower-Back Foam Rolling (2 min)'],
    getWorkout: (ex, week) => {
      if (ex.id === 'bw-018-tuck' || ex.id === 'bw-018') {
        const level = week <= 2 ? 'tuck' : week <= 4 ? 'adv-tuck' : week <= 5 ? 'straddle' : 'full';
        return {
          sets: 4,
          reps: level === 'tuck' ? `${5 + week * 2}s hold` : level === 'adv-tuck' ? `${4 + week}s hold` : level === 'straddle' ? `${3 + week}s hold` : `${2 + Math.floor(week / 2)}s hold`,
          rest: '90-120s',
          tempo: 'isometrico-eccentrico',
          notes: 'Discesa controllata 3s. Stop 1cm da terra. Bilancio perfetto tra catena anteriore e posteriore.',
        };
      }
      if (ex.id === 'bw-004') {
        return { sets: 4, reps: week <= 3 ? '6-8' : week <= 5 ? '5-7' : '5-6 (+peso)', rest: '90-120s', tempo: '2/1/2/0', notes: 'Trazioni verticali per rinforzo generale della schiena tra le serie di dragon flag' };
      }
      if (ex.id === 'bw-009' || ex.id === 'bw-009-full') {
        return { sets: 3, reps: '10-15s', rest: '90s', tempo: 'isometrico', notes: 'Complementary: front lever isometriche per sinergia con il core' };
      }
      return { sets: 4, reps: '8-10', rest: '90s', tempo: '2/1/2/0', notes: 'Focus su controllo del corpo rigido e tensione costante' };
    },
  },
  405: {
    title: 'Prehab & Longevity',
    tagline: 'Allenati di più e per più tempo. Protocolli settimanali per ogni articolazione.',
    taglineEn: 'Train more and longer. Weekly protocols for every joint.',
    warmUp: ['Cat-Cow (12x)', 'Wrist Circles (20x/side)', 'Cat-Cow (12x)', 'Hollow Body Rock (20x)'],
    warmUpEn: ['Cat-Cow (12x)', 'Wrist Circles (20x/side)', 'Cat-Cow (12x)', 'Hollow Body Rock (20x)'],
    coolDown: ['Deep Squat Hold (45s)', 'Pigeon Stretch (1 min/side)', 'Child\'s Pose (2 min)', 'Foam Rolling completo (5 min)'],
    coolDownEn: ['Deep Squat Hold (45s)', 'Pigeon Stretch (1 min/side)', 'Child\'s Pose (2 min)', 'Full-Body Foam Rolling (5 min)'],
    getWorkout: (ex, week) => {
      if (ex.id === 'mob-005' || ex.id === 'mob-010') {
        return { sets: 3, reps: '15x', rest: '30s', tempo: 'controllato', notes: 'Presa larga → presa stretta. Non forzare il ROM articolare.' };
      }
      if (ex.id === 'mob-004') {
        return { sets: 3, reps: `${30 + week * 10}s`, rest: '30s', tempo: 'isometrico', notes: 'Anche aperte, talloni a terra, core attivo' };
      }
      if (ex.id === 'mob-006') {
        return { sets: 2, reps: '20 circle/side entrambi i versi', rest: '30s', tempo: 'lento', notes: 'Movimento circolare completo senza dolore' };
      }
      if (ex.id === 'mob-008') {
        return { sets: 3, reps: `${45 + week * 15}s/side`, rest: '30s', tempo: 'stretch statico', notes: 'Anca in posizione di piccola esterna lateral rotation' };
      }
      if (ex.id === 'bw-003' || ex.id === 'bw-020-german') {
        return { sets: 3, reps: '45-60s', rest: '45s', tempo: 'isometrico', notes: 'Core basso attivo, respiro regolare' };
      }
      return { sets: 3, reps: '10-15x', rest: '30-60s', tempo: 'lento e controllato', notes: 'Nessun dolore. Stop se c\'è disagio articolare.' };
    },
  },
  406: {
    title: 'Calisthenics Hypertrophy',
    tagline: 'Costruisci massa con solo il corpo. Split 5 giorni con progressive overload e volume cycling.',
    taglineEn: 'Build mass with bodyweight only. 5-day split with progressive overload and volume cycling.',
    warmUp: ['Dynamic Chest Stretch (10x/side)', 'Scapular Wall Slides (15x)', 'Arm Circles (10x each way)', 'Bodyweight Squat (15x)', 'Wrist Prep (20s/side)'],
    warmUpEn: ['Dynamic Chest Stretch (10x/side)', 'Scapular Wall Slides (15x)', 'Arm Circles (10x each way)', 'Bodyweight Squat (15x)', 'Wrist Prep (20s/side)'],
    coolDown: ['Deep Squat Hold (1 min)', 'Pigeon Stretch (1 min/side)', 'Child\'s Pose (1 min)', 'Foam Rolling full body (3 min)'],
    coolDownEn: ['Deep Squat Hold (1 min)', 'Pigeon Stretch (1 min/side)', 'Child\'s Pose (1 min)', 'Full-Body Foam Rolling (3 min)'],
    getWorkout: (ex, week, _dayIndex) => {
      const phase = week <= 4 ? 'accum' : week <= 8 ? 'intensify' : 'peak';
      if (ex.id === 'bw-001' || ex.id === 'bw-027') {
        const { s, r, reps: res } = pushDay(phase);
        return { sets: s, reps: res, rest: r, tempo: phase === 'intensify' ? '3/1/2/0' : '2/0/1/0', notes: 'Controllo eccentrico in fase di intensificazione e picco' };
      }
      if (ex.id === 'bw-004' || ex.id === 'bw-029' || ex.id === 'bw-040') {
        const { s: s2, r: r2, reps: reps2 } = pullDay(phase);
        return { sets: s2, reps: reps2, rest: r2, tempo: '3/1/2/0', notes: 'Scapole attive in fase discendente' };
      }
      if (ex.id === 'bw-002' || ex.id === 'bw-025' || ex.id === 'bw-032') {
        const { sets: s3, rest: r3, reps: reps3 } = legsDay(phase);
        return { sets: s3, reps: reps3, rest: r3, tempo: '2/0/1/0', notes: 'Controllo eccentrico, spingi dal tallone' };
      }
      if (ex.id === 'bw-031' || ex.id === 'bw-038') {
        const { sets: s4, rest: r4, reps: reps4 } = legsDay(phase);
        return { sets: s4, reps: reps4, rest: r4, tempo: '2/0/1/0', notes: 'Isometria di gambe, core serrato' };
      }
      return { sets: 3, reps: '10-12', rest: '60-90s', tempo: '2/0/1/0', notes: 'Movimento controllato, tensione costante' };
    },
  },
};

function pushDay(phase: string): { s: number; r: string; reps: string } {
  return phase === 'accum'
    ? { s: 4, r: '90s', reps: '10-12' }
    : phase === 'intensify'
    ? { s: 4, r: '120s', reps: '8-10' }
    : { s: 5, r: '120-150s', reps: '6-9' };
}

function pullDay(phase: string): { s: number; r: string; reps: string } {
  return phase === 'accum'
    ? { s: 4, r: '90s', reps: '8-10' }
    : phase === 'intensify'
    ? { s: 4, r: '120s', reps: '6-8' }
    : { s: 5, r: '150s', reps: '5-7' };
}

function legsDay(phase: string): { sets: number; rest: string; reps: string } {
  return phase === 'accum'
    ? { sets: 4, rest: '90s', reps: '10-12' }
    : phase === 'intensify'
    ? { sets: 4, rest: '120s', reps: '8-10' }
    : { sets: 5, rest: '120-150s', reps: '6-9' };
}

// ─── Program → Exercise mapping ───
interface ProgramWorkoutPlanDef {
  id: number;
  weeks: number;
  exerciseIds: string[];
}

const programWorkoutPlans: ProgramWorkoutPlanDef[] = [
  { id: 101, weeks: 4, exerciseIds: ['bw-001', 'bw-002', 'bw-003', 'bw-006', 'bw-007', 'mob-001', 'mob-002', 'mob-004', 'mob-009'] },
  { id: 102, weeks: 3, exerciseIds: ['bw-003', 'bw-034', 'bw-035', 'bw-008', 'bw-020-german', 'mob-007', 'mob-006', 'mob-009'] },
  { id: 103, weeks: 6, exerciseIds: ['bw-004', 'bw-001', 'bw-005', 'bw-006', 'bw-040', 'bw-029', 'bw-003', 'mob-005', 'mob-003', 'mob-010'] },
  { id: 201, weeks: 8, exerciseIds: ['bw-004', 'bw-008', 'bw-008-adv', 'bw-003', 'mob-003', 'mob-010', 'mob-007', 'bw-036'] },
  { id: 202, weeks: 10, exerciseIds: ['bw-009', 'bw-008-one-leg', 'bw-004', 'bw-008-touch', 'bw-003', 'bw-008-adv', 'bw-029', 'mob-010'] },
  { id: 203, weeks: 12, exerciseIds: ['bw-009-full', 'bw-014', 'bw-004', 'bw-029', 'bw-030', 'bw-020-tuck', 'bw-020-german', 'bw-003', 'bw-018-tuck', 'bw-018'] },
  { id: 301, weeks: 8, exerciseIds: ['bw-010', 'bw-011', 'bw-001', 'db-003', 'bw-004', 'mob-003', 'mob-006', 'bw-036'] },
  { id: 302, weeks: 10, exerciseIds: ['bw-011', 'bw-010', 'bw-027', 'bw-023', 'bw-001', 'bw-028', 'bw-022', 'mob-003', 'bw-003', 'mob-006'] },
  { id: 303, weeks: 14, exerciseIds: ['bw-011', 'bw-010', 'bw-028', 'bw-001', 'bw-027', 'bw-023', 'bw-003', 'bw-011', 'bw-014', 'mob-006', 'bw-004'] },
  { id: 401, weeks: 8, exerciseIds: ['bw-012', 'bw-013', 'bw-024', 'bw-023', 'bw-015', 'bw-016', 'bw-037', 'bw-039', 'bw-017', 'bw-020-german', 'bw-003', 'mob-006', 'mob-010'] },
  { id: 402, weeks: 10, exerciseIds: ['bw-020-german', 'bw-020-tuck', 'bw-020', 'bw-034', 'bw-035', 'bw-004', 'bw-029', 'bw-004', 'mob-003', 'mob-010', 'mob-007', 'mob-006', 'mob-009', 'bw-014'] },
  { id: 403, weeks: 12, exerciseIds: ['bw-019-tuck', 'bw-019', 'bw-022', 'bw-028', 'bw-011', 'bw-031', 'bw-032', 'bw-001', 'bw-023', 'bw-004', 'mob-003', 'bw-035', 'bw-020-german', 'bw-014'] },
  { id: 404, weeks: 6, exerciseIds: ['bw-018-tuck', 'bw-018', 'bw-004', 'bw-009', 'bw-009-full', 'bw-010', 'bw-003', 'bw-001'] },
  { id: 405, weeks: 12, exerciseIds: ['bw-003', 'mob-004', 'mob-005', 'mob-006', 'mob-007', 'mob-008', 'mob-009', 'mob-010', 'mob-001', 'mob-002', 'bw-020-german', 'bw-038', 'mob-007'] },
  { id: 406, weeks: 12, exerciseIds: ['bw-001', 'bw-027', 'bw-004', 'bw-029', 'bw-040', 'bw-014', 'bw-002', 'bw-025', 'bw-032', 'bw-033', 'bw-038', 'bw-031', 'bw-022', 'bw-023', 'bw-006'] },
];

// ─── Build workout data for a given program ───
function getProgramPlan(programId: number, locale: 'it' | 'en' = 'it'): ProgramWorkoutPlan {
  const planDef = programWorkoutPlans.find((p) => p.id === programId);
  if (!planDef) {
    return { id: programId, weeks: [], weeklyOverview: [], warmUp: [], coolDown: [], progressionNotes: [] };
  }
  const cfg = PROGRAM_CONFIG[programId] || PROGRAM_CONFIG[101]!;
  return {
    id: programId,
    weeks: Array.from({ length: planDef.weeks }, (_, wi) => ({
      week: wi + 1,
      theme: weekTheme(wi, planDef.weeks, programId, locale),
      days: [
        { day: 1, week: wi + 1, focus: 'Push', exercises: buildDayExercises(planDef.exerciseIds, cfg.getWorkout, wi + 1, 1) },
        { day: 2, week: wi + 1, focus: 'Pull', exercises: buildDayExercises(planDef.exerciseIds, cfg.getWorkout, wi + 1, 2) },
        { day: 3, week: wi + 1, focus: 'Legs', exercises: buildDayExercises(planDef.exerciseIds, cfg.getWorkout, wi + 1, 3) },
        { day: 4, week: wi + 1, focus: 'Core / Skills', exercises: buildDayExercises(planDef.exerciseIds, cfg.getWorkout, wi + 1, 4) },
      ],
    })),
    weeklyOverview: [],
    warmUp: cfg.warmUp,
    coolDown: cfg.coolDown,
    progressionNotes: [],
  };
}

function buildDayExercises(
  exerciseIds: string[],
  getWorkout: (ex: Exercise, week: number, dayIndex: number) => WorkoutSet,
  week: number,
  dayIndex: number,
): ExerciseEntry[] {
  return exerciseIds
    .map((eid) => {
      const ex = findExercise(eid);
      if (!ex) return null;
      const workout = getWorkout(ex, week, dayIndex);
      return { exerciseId: eid, exercise: ex, workout };
    })
    .filter(Boolean) as ExerciseEntry[];
}

// ─── Grip Handle (2x2 dots) ───
const GripHandle: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <div
    {...props}
    className={`cursor-grab active:cursor-grabbing p-1.5 opacity-0 group-hover:opacity-100 transition-opacity ${props.className || ''}`}
    onClick={(e) => e.stopPropagation()}
  >
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="text-zinc-500">
      <circle cx="3" cy="3" r="1.5" />
      <circle cx="11" cy="3" r="1.5" />
      <circle cx="3" cy="11" r="1.5" />
      <circle cx="11" cy="11" r="1.5" />
    </svg>
  </div>
);

// ─── Workout Table Row ───
interface WorkoutTableProps {
  exercise: ExerciseEntry;
  exerciseIndex: number;
  highlighted?: boolean;
  autoExpand?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  isDragTarget?: boolean;
}

const WorkoutTable: React.FC<WorkoutTableProps> = ({ exercise, exerciseIndex, highlighted = false, autoExpand = false, onDragStart, onDragOver, onDrop, onDragEnd, isDragTarget }) => {
  const [expanded, setExpanded] = useState(autoExpand || highlighted);
  const [wasHighlighted, setWasHighlighted] = useState(highlighted);
  // Adjust state during render when a new highlight arrives (documented React pattern).
  if (wasHighlighted !== highlighted) {
    setWasHighlighted(highlighted);
    if (highlighted) setExpanded(true);
  }
  const rowRef = useRef<HTMLDivElement>(null);
  const { locale, t } = useLanguage();
  const w = exercise.workout;
  const muscles = localizeList(exercise.exercise.muscleGroups.primary, locale);
  const progressions = localizeList(exercise.exercise.progression, locale);
  const notes = localizeNote(w.notes, locale) ?? w.notes;

  useEffect(() => {
    if (highlighted) {
      rowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlighted]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: exerciseIndex * 0.04 }}
    >
      <div
        ref={rowRef}
        className={`border-b border-white/10 last:border-0 group relative rounded-xl transition-shadow ${isDragTarget ? 'opacity-40' : ''} ${highlighted ? 'ring-2 ring-red-500/60 bg-red-500/[0.04]' : ''}`}
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragEnd={onDragEnd}
      >
      <div
        className="p-3 sm:p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <GripHandle />
          <div className="w-8 h-8 rounded-lg bg-red-600/20 flex items-center justify-center text-red-500 font-bold text-xs">
            {exerciseIndex + 1}
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">{exercise.exercise.name}</h4>
            <p className="text-[10px] text-zinc-500 uppercase">{muscles.join(', ')}</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-5 text-xs">
          <div className="text-center"><span className="text-zinc-500 block">SET</span><span className="font-bold text-white">{w.sets}</span></div>
          <div className="text-center"><span className="text-zinc-500 block">REP</span><span className="font-bold text-white">{w.reps}</span></div>
          <div className="text-center"><span className="text-zinc-500 block">REST</span><span className="font-bold text-white">{w.rest}</span></div>
        </div>
        <ChevronDown size={16} className={`text-zinc-500 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </div>

      {expanded && (
        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="px-4 pb-4 space-y-2 bg-zinc-950/30">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3">
            {[
              { label: 'Sets', val: String(w.sets) },
              { label: 'Reps', val: w.reps },
              { label: 'Rest', val: w.rest },
              { label: 'Tempo', val: w.tempo },
            ].map((cell) => (
              <div key={cell.label} className="bg-zinc-900/50 p-3 rounded-lg">
                <span className="text-[10px] text-zinc-500 uppercase block mb-1">{cell.label}</span>
                <span className="font-bold text-white text-lg">{cell.val}</span>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-2 p-3 bg-zinc-900/50 rounded-lg">
            <Target size={14} className="text-red-500 mt-0.5 shrink-0" />
            <span className="text-xs text-zinc-400">{notes}</span>
          </div>
          {progressions.length > 0 && (
            <div className="p-3 bg-zinc-900/50 rounded-lg">
              <span className="text-[10px] text-zinc-500 uppercase block mb-2">
                {t('Progressioni consigliate', 'Recommended progressions')}: {progressions.join(' → ')}
              </span>
            </div>
          )}
        </motion.div>
      )}
      </div>
    </motion.div>
  );
};

// ─── Day Card ───
interface DayCardProps {
  day: WorkoutDay;
}
const DayCard: React.FC<DayCardProps> = ({ day }) => {
  const [expanded, setExpanded] = useState(day.day <= 2);
  const { t } = useLanguage();
  const [exercises, setExercises] = useState(day.exercises);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const handleDragStart = (idx: number) => (e: React.DragEvent) => {
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
    (e.currentTarget as HTMLElement).style.opacity = '0.4';
  };

  const handleDragOver = (idx: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIdx(idx);
  };

  const handleDrop = (toIdx: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === toIdx) return;
    const updated = [...exercises];
    const [moved] = updated.splice(dragIdx, 1);
    updated.splice(toIdx, 0, moved);
    setExercises(updated);
    setDragIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDragIdx(null);
    setDragOverIdx(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/30 border border-white/10 rounded-2xl overflow-hidden"
    >
      <button onClick={() => setExpanded(!expanded)} className="w-full p-4 flex items-center justify-between bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${day.day <= 2 ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
            {day.day}
          </div>
          <div className="text-left">
            <h3 className="font-bold text-white text-sm">{t('Settimana', 'Week')} {day.week} — {t('Giorno', 'Day')} {day.day}</h3>
            <p className="text-[10px] text-zinc-500">{day.focus} · {exercises.length} {t('esercizi', 'exercises')}</p>
          </div>
        </div>
        {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>

      {expanded && (
        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="divide-y divide-white/5">
          {exercises.map((entry, i) => (
            <div
              key={entry.exerciseId}
              onDragOver={handleDragOver(i)}
              onDrop={handleDrop(i)}
              className={dragOverIdx === i && dragIdx !== i ? 'border-t-2 border-red-500' : ''}
            >
              <WorkoutTable
                exercise={entry}
                exerciseIndex={i}
                onDragStart={handleDragStart(i)}
                onDragOver={handleDragOver(i)}
                onDrop={handleDrop(i)}
                onDragEnd={handleDragEnd}
                isDragTarget={dragIdx === i}
              />
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

// ─── Week Tabs ───
interface WeekTabsProps {
  plan: ProgramWorkoutPlan;
  weekIndex: number;
  setWeekIndex: (idx: number) => void;
}
const WeekTabs: React.FC<WeekTabsProps> = ({ plan, weekIndex, setWeekIndex }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-700">
      {plan.weeks.map((wk, wi) => (
        <button
          key={wk.week}
          onClick={() => setWeekIndex(wi)}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            wi === weekIndex
              ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
          }`}
        >
          S{wk.week}
        </button>
      ))}
    </div>
  );
};

// ─── Main Component ───
interface IProgram { id: number; title: string; level: string; duration?: string; }

const ProgramContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'workout' | 'warmup' | 'exercises' | 'lessons'>('lessons');
  const [weekIndex, setWeekIndex] = useState(0);
  const [highlightExercise, setHighlightExercise] = useState<string | null>(null);
  const [lessonDone, setLessonDone] = useState<Set<string>>(new Set());
  const [progressFor, setProgressFor] = useState<string | null>(null);
  const { locale, t } = useLanguage();

  const allPrograms: IProgram[] = [
    ...programData.workout,
    ...(programData.frontLever || []),
    ...(programData.planche || []),
    ...(programData.skills || []),
  ];
  const rawProgram = allPrograms.find((p) => p.id === parseInt(id || '0'));
  const localized = rawProgram
    ? localizeProgram(rawProgram as unknown as Parameters<typeof localizeProgram>[0], locale)
    : undefined;
  const program = rawProgram
    ? {
        ...rawProgram,
        title: localized!.localizedTitle,
        level: localized!.localizedLevel,
        duration: localized!.localizedDuration,
      }
    : undefined;

  if (!program) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <h2 className="text-3xl font-bold mb-4">{t('Programma non trovato', 'Program not found')}</h2>
        <Link to="/programs" className="text-red-500 hover:underline">{t('Torna ai programmi', 'Back to programs')}</Link>
      </div>
    );
  }

  const plan = getProgramPlan(program.id, locale);
  const curriculum = getCurriculum(program.id);
  const currentWeek = plan.weeks[weekIndex] || plan.weeks[0];

  // Reload per-program state when navigating between programs (same component instance).
  if (progressFor !== program.id.toString()) {
    setProgressFor(program.id.toString());
    setLessonDone(getLessonProgress(program.id));
    setHighlightExercise(null);
  }
  const cfg = PROGRAM_CONFIG[program.id] || PROGRAM_CONFIG[101]!;
  const tagline = locale === 'en' ? (cfg.taglineEn || cfg.tagline) : cfg.tagline;
  const warmUp = locale === 'en' ? (cfg.warmUpEn || cfg.warmUp) : cfg.warmUp;
  const coolDown = locale === 'en' ? (cfg.coolDownEn || cfg.coolDown) : cfg.coolDown;

  const programExercises = programWorkoutPlans.find((p) => p.id === program.id)?.exerciseIds
    .map((eid) => exerciseDatabase.find((ex) => ex.id === eid))
    .filter(Boolean) as Exercise[];

  return (
    <>
      <SEO
        title={`Programma ${program.title}`}
        description={`Visualizza il contenuto del programma ${program.title} su Maxthenics. Esercizi, serie, ripetizioni e progressioni dettagliate.`}
        keywords={`programma calisthenics ${program.title.toLowerCase()}, workout, esercizi, progressioni`}
      />
      <div className="min-h-screen bg-black text-white pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <Link to="/programs" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-bold text-sm">
              <ArrowLeft className="w-4 h-4" />
              {t('Torna ai Programmi', 'Back to Programs')}
            </Link>
            <div className="flex items-center gap-2">
              <ShareButton
                compact
                url={typeof window !== 'undefined' ? `${window.location.origin}/program/${program.id}` : undefined}
                title={program.title}
              />
              <LanguageToggle compact />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-red-600 font-black tracking-[0.3em] uppercase text-[10px] mb-2 block">{t('Protocollo di Allenamento', 'Training Protocol')}</span>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tighter uppercase">{program.title}</h1>
              {tagline && <p className="text-zinc-500 text-sm mt-1 font-medium italic">{tagline}</p>}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-zinc-500 uppercase">{t('Durata', 'Duration')}</span>
                <span className="font-black text-white ml-2">{program.duration || plan.weeks.length + (locale === 'en' ? ' Weeks' : ' Settimane')}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-zinc-500 uppercase">{t('Livello', 'Level')}</span>
                <span className="font-black text-white ml-2">{program.level}</span>
              </div>
            </div>
          </div>

          {/* Week Tabs */}
          {plan.weeks.length > 1 && (
            <div className="mb-6">
              <p className="text-xs text-zinc-500 mb-2 font-bold uppercase tracking-widest">{t('Seleziona Settimana', 'Select Week')}</p>
              <WeekTabs plan={plan} weekIndex={weekIndex} setWeekIndex={setWeekIndex} />
            </div>
          )}

          {/* Info Card */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {currentWeek && (
                <div className="bg-red-600/10 border border-red-500/20 p-5 rounded-2xl">
                  <h3 className="font-bold text-red-400 text-sm mb-2 flex items-center gap-2">
                    <Flame size={16} /> {t('Settimana', 'Week')} {currentWeek.week}: {currentWeek.theme}
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    {t('Giorni di allenamento', 'Training days')}: {currentWeek.days.length} · Focus: {currentWeek.days.map((d) => d.focus).join(' · ')}
                  </p>
                </div>
              )}

              <div className="bg-zinc-900/30 border border-white/10 p-5 rounded-2xl">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Target size={16} className="text-red-500" /> {t('Panoramica Settimanale', 'Weekly Overview')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {currentWeek?.days.map((d) => (
                    <div key={d.day} className={`p-4 rounded-xl border ${d.exercises.length > 0 ? 'bg-zinc-900/50 border-white/10' : 'bg-zinc-950/30 border-white/10 opacity-50'}`}>
                      <span className="text-[10px] text-zinc-500 uppercase block mb-1">{t('Giorno', 'Day')} {d.day}</span>
                      <span className="font-bold text-white text-sm">{d.focus}</span>
                      <span className="text-[10px] text-zinc-500 block mt-1">{d.exercises.length} {t('esercizi', 'exercises')}</span>
                    </div>
                  )) || null}
                </div>
              </div>

              <div className="bg-zinc-900/30 border border-white/10 p-5 rounded-2xl">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><BookOpen size={16} className="text-red-500" /> {t('Riscaldamento', 'Warm-up')}</h3>
                <ul className="space-y-2">
                  {warmUp.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                      <span className="w-6 h-6 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black flex items-center justify-center">{i + 1}</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-zinc-900/30 border border-white/10 p-5 rounded-2xl">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Dumbbell size={16} className="text-red-500" /> {t('Defaticamento', 'Cool-down')}</h3>
                <ul className="space-y-2">
                  {coolDown.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                      <CheckCircle />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-zinc-900/30 border border-white/10 p-5 rounded-2xl">
                <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Zap size={16} className="text-red-500" /> {t('Info Programma', 'Program Info')}</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-zinc-900/50 p-3 rounded-lg">
                    <span className="text-[10px] text-zinc-500 uppercase block">{t('Durata Totale', 'Total Duration')}</span>
                    <span className="font-bold text-white">{program.duration || plan.weeks.length + (locale === 'en' ? ' Weeks' : ' Settimane')}</span>
                  </div>
                  <div className="bg-zinc-900/50 p-3 rounded-lg">
                    <span className="text-[10px] text-zinc-500 uppercase block">{t('Frequenza', 'Frequency')}</span>
                    <span className="font-bold text-white">{t('4 giorni/settimana', '4 days/week')}</span>
                  </div>
                  <div className="bg-zinc-900/50 p-3 rounded-lg">
                    <span className="text-[10px] text-zinc-500 uppercase block">{t('Livello', 'Level')}</span>
                    <span className="font-bold text-white">{program.level}</span>
                  </div>
                  <div className="bg-zinc-900/50 p-3 rounded-lg">
                    <span className="text-[10px] text-zinc-500 uppercase block">{t('Esercizi Totali', 'Total Exercises')}</span>
                    <span className="font-bold text-white">{programExercises.length}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'lessons' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <p className="text-xs text-zinc-500 mb-2">
                {t(
                  'Il percorso completo: teoria, tecnica, schede, video e consigli. Tocca una lezione per aprirla.',
                  'The full journey: theory, technique, plans, videos and tips. Tap a lesson to open it.'
                )}
              </p>
              <Curriculum
                curriculum={curriculum}
                progress={lessonDone}
                onToggleLesson={(lessonId) =>
                  setLessonDone(toggleLessonProgress(program.id, lessonId))
                }
                onOpenWorkout={() => setActiveTab('workout')}
                onOpenExercise={(exerciseId) => {
                  setActiveTab('exercises');
                  setHighlightExercise(exerciseId ?? null);
                }}
              />
            </motion.div>
          )}

          {activeTab === 'workout' && currentWeek && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <p className="text-xs text-zinc-500 mb-2">
                {t('Settimana', 'Week')} {currentWeek.week} {t('di', 'of')} {plan.weeks.length} · {currentWeek.theme}. {t('Clicca un giorno per espandere gli esercizi.', 'Click a day to expand the exercises.')}
              </p>
              {currentWeek.days.map((day) => (
                <DayCard key={day.day} day={day} />
              ))}
            </motion.div>
          )}

          {activeTab === 'warmup' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="bg-zinc-900/30 border border-red-500/20 p-6 rounded-2xl">
                <h3 className="font-bold text-white mb-4 text-lg flex items-center gap-2"><Flame className="text-red-500" size={20} /> {t('Riscaldamento Pre-Allenamento', 'Pre-Workout Warm-up')}</h3>
                <ul className="space-y-3">
                  {warmUp.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                      <span className="w-7 h-7 rounded-full bg-red-500/20 text-red-500 text-xs font-black flex items-center justify-center shrink-0">{i + 1}</span>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-zinc-900/30 border border-green-500/10 p-6 rounded-2xl">
                <h3 className="font-bold text-white mb-4 text-lg flex items-center gap-2"><Dumbbell className="text-green-500" size={20} /> {t('Defaticamento Post-Allenamento', 'Post-Workout Cool-down')}</h3>
                <ul className="space-y-3">
                  {coolDown.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                      <CheckCircle />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {activeTab === 'exercises' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {programExercises.map((exercise, i) => (
                <WorkoutTable
                  key={exercise.id}
                  exercise={{
                    exerciseId: exercise.id,
                    exercise,
                    workout: cfg.getWorkout(exercise, 1, 1),
                  }}
                  exerciseIndex={i}
                  highlighted={highlightExercise === exercise.id}
                  autoExpand={highlightExercise === exercise.id}
                />
              ))}
            </motion.div>
          )}

          {/* Nab Tab Bar */}
          <div className="sticky bottom-0 mt-8 -mx-4 px-4 py-3 bg-zinc-950/90 backdrop-blur-xl border-t border-white/5 flex gap-2 overflow-x-auto">
            {[
              { key: 'lessons' as const, label: t('Lezioni', 'Lessons'), icon: GraduationCap },
              { key: 'workout' as const, label: 'Workout', icon: Dumbbell },
              { key: 'overview' as const, label: t('Panoramica', 'Overview'), icon: BookOpen },
              { key: 'warmup' as const, label: t('Riscaldamento', 'Warm-up'), icon: Flame },
              { key: 'exercises' as const, label: t('Esercizi', 'Exercises'), icon: Target },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? 'bg-red-600 text-white'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <tab.icon size={13} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const CheckCircle: React.FC = () => (
  <span className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
    <Check size={12} className="text-green-500" />
  </span>
);

export default ProgramContent;
