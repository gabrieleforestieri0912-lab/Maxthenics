// ─── Lesson-based curriculum model (PRIME PULL style) ───
// Every training program exposes a structured curriculum:
// theory → anatomy & biomechanics → technique → plan → workout plans →
// exercise videos → secret tips. Bilingual (IT/EN), generated per program
// from its skill focus so all 15 programs share the same structure.

export type LessonKind =
  | 'intro'
  | 'theory'
  | 'anatomy'
  | 'technique'
  | 'plan'
  | 'workout'
  | 'video'
  | 'tips';

export interface Lesson {
  id: string;
  kind: LessonKind;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  minutes: number;
  /** Watchable without owning the program (used by the sales-page preview). */
  freePreview?: boolean;
  /** Deep link into the member-area exercise library (when known). */
  exerciseId?: string;
}

export interface CurriculumSection {
  id: string;
  title: string;
  titleEn: string;
  lessons: Lesson[];
}

export interface CurriculumHighlight {
  icon: 'workouts' | 'videos' | 'theory';
  text: string;
  textEn: string;
}

export interface ProgramCurriculum {
  programId: number;
  sections: CurriculumSection[];
  highlights: CurriculumHighlight[];
  totalLessons: number;
  totalMinutes: number;
}

// ─── Program length (weeks) — mirrors programWorkoutPlans in ProgramContent ───
export const PROGRAM_WEEKS: Record<number, number> = {
  101: 4, 102: 3, 103: 6,
  201: 8, 202: 10, 203: 12,
  301: 8, 302: 10, 303: 14,
  401: 8, 402: 10, 403: 12, 404: 6, 405: 12, 406: 12,
};

// ─── Skill focus per program (drives lesson titles) ───
interface SkillMeta {
  skill1: string; skill1En: string;
  skill2: string; skill2En: string;
  videos: { name: string; nameEn: string; exerciseId?: string }[];
}

const SKILL_META: Record<number, SkillMeta> = {
  101: {
    skill1: 'Piegamenti', skill1En: 'Push-ups',
    skill2: 'Trazioni', skill2En: 'Pull-ups',
    videos: [
      { name: 'Piegamenti', nameEn: 'Push-ups', exerciseId: 'bw-001' },
      { name: 'Squat a corpo libero', nameEn: 'Bodyweight squats', exerciseId: 'bw-002' },
      { name: 'Plank', nameEn: 'Plank', exerciseId: 'bw-003' },
      { name: 'Trazioni', nameEn: 'Pull-ups', exerciseId: 'bw-004' },
    ],
  },
  102: {
    skill1: 'Hollow Body', skill1En: 'Hollow Body',
    skill2: 'Plank avanzato', skill2En: 'Advanced Plank',
    videos: [
      { name: 'Plank', nameEn: 'Plank', exerciseId: 'bw-003' },
      { name: 'Hollow Body Rock', nameEn: 'Hollow Body Rock' },
      { name: 'Arch Body Rock', nameEn: 'Arch Body Rock' },
      { name: 'Trazioni', nameEn: 'Pull-ups', exerciseId: 'bw-004' },
    ],
  },
  103: {
    skill1: 'Trazioni', skill1En: 'Pull-ups',
    skill2: 'Dip alle parallele', skill2En: 'Parallel-bar Dips',
    videos: [
      { name: 'Trazioni', nameEn: 'Pull-ups', exerciseId: 'bw-004' },
      { name: 'Piegamenti', nameEn: 'Push-ups', exerciseId: 'bw-001' },
      { name: 'Dip alle parallele', nameEn: 'Parallel-bar Dips' },
      { name: 'Squat a corpo libero', nameEn: 'Bodyweight squats', exerciseId: 'bw-002' },
    ],
  },
  201: {
    skill1: 'Front Lever', skill1En: 'Front Lever',
    skill2: 'Trazioni zavorrate', skill2En: 'Weighted Pull-ups',
    videos: [
      { name: 'Trazioni', nameEn: 'Pull-ups', exerciseId: 'bw-004' },
      { name: 'Tuck Front Lever', nameEn: 'Tuck Front Lever', exerciseId: 'bw-008' },
      { name: 'Front Lever', nameEn: 'Front Lever', exerciseId: 'bw-009' },
      { name: 'Retrazione scapolare', nameEn: 'Scapular retraction' },
    ],
  },
  202: {
    skill1: 'Straddle Front Lever', skill1En: 'Straddle Front Lever',
    skill2: 'Muscle-Up', skill2En: 'Muscle-Up',
    videos: [
      { name: 'Front Lever', nameEn: 'Front Lever', exerciseId: 'bw-009' },
      { name: 'Trazioni', nameEn: 'Pull-ups', exerciseId: 'bw-004' },
      { name: 'Muscle-Up', nameEn: 'Muscle-Up', exerciseId: 'bw-014' },
      { name: 'One-leg Front Lever', nameEn: 'One-leg Front Lever' },
    ],
  },
  203: {
    skill1: 'Full Front Lever', skill1En: 'Full Front Lever',
    skill2: 'Muscle-Up', skill2En: 'Muscle-Up',
    videos: [
      { name: 'Full Front Lever', nameEn: 'Full Front Lever', exerciseId: 'bw-009-full' },
      { name: 'Muscle-Up', nameEn: 'Muscle-Up', exerciseId: 'bw-014' },
      { name: 'Trazioni zavorrate', nameEn: 'Weighted pull-ups', exerciseId: 'bw-004' },
      { name: 'Front Lever Pull-up', nameEn: 'Front Lever Pull-ups' },
    ],
  },
  301: {
    skill1: 'Tuck Planche', skill1En: 'Tuck Planche',
    skill2: 'Planche Lean', skill2En: 'Planche Lean',
    videos: [
      { name: 'Piegamenti', nameEn: 'Push-ups', exerciseId: 'bw-001' },
      { name: 'Tuck Planche', nameEn: 'Tuck Planche', exerciseId: 'bw-010' },
      { name: 'Planche Lean', nameEn: 'Planche Lean' },
      { name: 'Trazioni', nameEn: 'Pull-ups', exerciseId: 'bw-004' },
    ],
  },
  302: {
    skill1: 'Straddle Planche', skill1En: 'Straddle Planche',
    skill2: 'Planche Push-up', skill2En: 'Planche Push-ups',
    videos: [
      { name: 'Straddle Planche', nameEn: 'Straddle Planche', exerciseId: 'bw-011' },
      { name: 'Tuck Planche', nameEn: 'Tuck Planche', exerciseId: 'bw-010' },
      { name: 'Piegamenti', nameEn: 'Push-ups', exerciseId: 'bw-001' },
      { name: 'Pike Push-up', nameEn: 'Pike Push-ups' },
    ],
  },
  303: {
    skill1: 'Full Planche', skill1En: 'Full Planche',
    skill2: 'Planche Push-up', skill2En: 'Planche Push-ups',
    videos: [
      { name: 'Straddle Planche', nameEn: 'Straddle Planche', exerciseId: 'bw-011' },
      { name: 'Tuck Planche', nameEn: 'Tuck Planche', exerciseId: 'bw-010' },
      { name: 'Muscle-Up', nameEn: 'Muscle-Up', exerciseId: 'bw-014' },
      { name: 'Piegamenti', nameEn: 'Push-ups', exerciseId: 'bw-001' },
    ],
  },
  401: {
    skill1: 'Handstand libera', skill1En: 'Freestanding Handstand',
    skill2: 'Handstand Push-up', skill2En: 'Handstand Push-ups',
    videos: [
      { name: 'Handstand al muro', nameEn: 'Wall handstand', exerciseId: 'bw-012' },
      { name: 'Handstand Push-up', nameEn: 'Handstand Push-ups', exerciseId: 'bw-024' },
      { name: 'Wall Walk', nameEn: 'Wall Walk' },
      { name: 'Handstand Walk', nameEn: 'Handstand Walk' },
    ],
  },
  402: {
    skill1: 'Back Lever', skill1En: 'Back Lever',
    skill2: 'German Hang', skill2En: 'German Hang',
    videos: [
      { name: 'German Hang', nameEn: 'German Hang' },
      { name: 'Tuck Back Lever', nameEn: 'Tuck Back Lever' },
      { name: 'Back Lever', nameEn: 'Back Lever', exerciseId: 'bw-020' },
      { name: 'Trazioni', nameEn: 'Pull-ups', exerciseId: 'bw-004' },
    ],
  },
  403: {
    skill1: 'Human Flag', skill1En: 'Human Flag',
    skill2: 'Maltese', skill2En: 'Maltese',
    videos: [
      { name: 'Tuck Human Flag', nameEn: 'Tuck Human Flag' },
      { name: 'Human Flag', nameEn: 'Human Flag', exerciseId: 'bw-019' },
      { name: 'Straddle Planche', nameEn: 'Straddle Planche', exerciseId: 'bw-011' },
      { name: 'Trazioni', nameEn: 'Pull-ups', exerciseId: 'bw-004' },
    ],
  },
  404: {
    skill1: 'Dragon Flag', skill1En: 'Dragon Flag',
    skill2: 'Front Lever', skill2En: 'Front Lever',
    videos: [
      { name: 'Tuck Dragon Flag', nameEn: 'Tuck Dragon Flag' },
      { name: 'Dragon Flag', nameEn: 'Dragon Flag', exerciseId: 'bw-018' },
      { name: 'Front Lever', nameEn: 'Front Lever', exerciseId: 'bw-009' },
      { name: 'Trazioni', nameEn: 'Pull-ups', exerciseId: 'bw-004' },
    ],
  },
  405: {
    skill1: 'Prehab spalle', skill1En: 'Shoulder prehab',
    skill2: 'Prehab gomiti e polsi', skill2En: 'Elbow & wrist prehab',
    videos: [
      { name: 'Shoulder Shield Flow', nameEn: 'Shoulder Shield Flow' },
      { name: 'Elbow Rehab Flow', nameEn: 'Elbow Rehab Flow' },
      { name: 'Wrist & Ankle Mobility', nameEn: 'Wrist & Ankle Mobility' },
      { name: 'Full-body Prehab Flow', nameEn: 'Full-body Prehab Flow' },
    ],
  },
  406: {
    skill1: 'Ipertrofia Push', skill1En: 'Push hypertrophy',
    skill2: 'Ipertrofia Pull', skill2En: 'Pull hypertrophy',
    videos: [
      { name: 'Piegamenti', nameEn: 'Push-ups', exerciseId: 'bw-001' },
      { name: 'Trazioni', nameEn: 'Pull-ups', exerciseId: 'bw-004' },
      { name: 'Squat a corpo libero', nameEn: 'Bodyweight squats', exerciseId: 'bw-002' },
      { name: 'Dip alle parallele', nameEn: 'Parallel-bar Dips' },
    ],
  },
};

const DEFAULT_META: SkillMeta = SKILL_META[101]!;

// ─── Curriculum builder ───
export function getCurriculum(programId: number): ProgramCurriculum {
  const meta = SKILL_META[programId] ?? DEFAULT_META;
  const weeks = PROGRAM_WEEKS[programId] ?? 8;
  const routines = weeks * 4; // 4 training days per week
  const { skill1, skill1En, skill2, skill2En } = meta;

  const sections: CurriculumSection[] = [
    {
      id: 'intro',
      title: 'Introduzione',
      titleEn: 'Introduction',
      lessons: [
        {
          id: `${programId}-l01`, kind: 'intro',
          title: 'Benvenuto nel programma', titleEn: 'Welcome to the program',
          description: 'Panoramica del percorso, obiettivi e come ottenere il massimo da ogni settimana.',
          descriptionEn: 'Program overview, goals and how to get the most out of every week.',
          minutes: 6, freePreview: true,
        },
        {
          id: `${programId}-l02`, kind: 'intro',
          title: 'Come funziona il programma', titleEn: 'How the program works',
          description: 'Struttura delle settimane, giorni di allenamento, riscaldamento e progressione dei carichi.',
          descriptionEn: 'Week structure, training days, warm-up and load progression.',
          minutes: 8, freePreview: true,
        },
      ],
    },
    {
      id: 'theory',
      title: 'Come funziona teoricamente?',
      titleEn: 'How does it work theoretically?',
      lessons: [
        {
          id: `${programId}-l03`, kind: 'theory',
          title: 'Cosa genera progresso ed evoluzione', titleEn: 'What causes progress and evolution',
          description: 'Sovraccarico progressivo, specificità e continuità: i tre principi che guidano ogni adattamento.',
          descriptionEn: 'Progressive overload, specificity and consistency: the three principles behind every adaptation.',
          minutes: 12,
        },
        {
          id: `${programId}-l04`, kind: 'theory',
          title: 'Come crescere e come sbloccare le skill', titleEn: 'How to gain muscle & master skills',
          description: 'Ipertrofia e apprendimento motorio: volumi, intensità e densità per massa e skill.',
          descriptionEn: 'Hypertrophy and motor learning: volume, intensity and density for mass and skills.',
          minutes: 14,
        },
        {
          id: `${programId}-l05`, kind: 'theory',
          title: 'Come applicare i principi alla tua routine', titleEn: 'How to apply these principles to your routine',
          description: 'Dal concetto alla pratica: tradurre i principi in serie, ripetizioni e recuperi.',
          descriptionEn: 'From concept to practice: translating principles into sets, reps and rest.',
          minutes: 11,
        },
        {
          id: `${programId}-l06`, kind: 'theory',
          title: 'RPE, autoregolazione e tracciamento', titleEn: 'RPE, autoregulation & tracking',
          description: 'Usare l’RPE per adattare ogni seduta al tuo stato di forma e tracciare i progressi.',
          descriptionEn: 'Using RPE to adapt every session to your readiness and track progress.',
          minutes: 10,
        },
      ],
    },
    {
      id: 'anatomy',
      title: 'Anatomia & Biomeccanica',
      titleEn: 'Anatomy & Biomechanics',
      lessons: [
        {
          id: `${programId}-l07`, kind: 'anatomy',
          title: 'Ripasso di anatomia', titleEn: 'Anatomy recap',
          description: 'I muscoli coinvolti, catene cinetiche e ruolo di scapole, core e anca.',
          descriptionEn: 'Muscles involved, kinetic chains and the role of scapulae, core and hips.',
          minutes: 12,
        },
        {
          id: `${programId}-l08`, kind: 'anatomy',
          title: `Biomeccanica di ${skill1}`, titleEn: `${skill1En} biomechanics`,
          description: `Leve, momenti di forza e punti critici della tecnica di ${skill1}.`,
          descriptionEn: `Levers, torque and technical sticking points of the ${skill1En}.`,
          minutes: 13,
        },
        {
          id: `${programId}-l09`, kind: 'anatomy',
          title: 'Leve, genetica e differenze individuali', titleEn: 'Levers, genetics & individual differences',
          description: 'Perché la stessa skill è più facile o difficile in base ad antropometria ed esperienza.',
          descriptionEn: 'Why the same skill feels easier or harder depending on anthropometry and background.',
          minutes: 9,
        },
      ],
    },
    {
      id: 'technique',
      title: 'Impara le esecuzioni tecniche',
      titleEn: 'Learn the technical executions',
      lessons: [
        {
          id: `${programId}-l10`, kind: 'technique',
          title: `Tecnica: ${skill1}`, titleEn: `${skill1En} technique`,
          description: `Setup, esecuzione e respirazione per ${skill1}, passo dopo passo.`,
          descriptionEn: `Setup, execution and breathing for the ${skill1En}, step by step.`,
          minutes: 15,
        },
        {
          id: `${programId}-l11`, kind: 'technique',
          title: `Tecnica: ${skill2}`, titleEn: `${skill2En} technique`,
          description: `Setup, esecuzione e respirazione per ${skill2}, passo dopo passo.`,
          descriptionEn: `Setup, execution and breathing for ${skill2En}, step by step.`,
          minutes: 15,
        },
        {
          id: `${programId}-l12`, kind: 'technique',
          title: 'Errori comuni e correzioni', titleEn: 'Common mistakes & fixes',
          description: 'Gli errori più frequenti, come riconoscerli in video e come correggerli.',
          descriptionEn: 'The most frequent mistakes, how to spot them on video and how to fix them.',
          minutes: 10,
        },
      ],
    },
    {
      id: 'plan',
      title: 'Qual è il piano?',
      titleEn: "What's the plan?",
      lessons: [
        {
          id: `${programId}-l13`, kind: 'plan',
          title: 'Quali sono i metodi migliori?', titleEn: 'What are the best methods?',
          description: 'Isometrie, eccentriche, zavorre e volume: quando usare ciascun metodo.',
          descriptionEn: 'Isometrics, eccentrics, added load and volume: when to use each method.',
          minutes: 12,
        },
        {
          id: `${programId}-l14`, kind: 'plan',
          title: `Progressioni: ${skill1}`, titleEn: `${skill1En} progressions`,
          description: `La scala completa delle propedeutiche verso ${skill1}: quando avanzare e quando fermarsi.`,
          descriptionEn: `The full progression ladder to the ${skill1En}: when to move up and when to hold.`,
          minutes: 14,
        },
        {
          id: `${programId}-l15`, kind: 'plan',
          title: `Progressioni: ${skill2}`, titleEn: `${skill2En} progressions`,
          description: `La scala completa delle propedeutiche verso ${skill2}: standard e test di passaggio.`,
          descriptionEn: `The full progression ladder to ${skill2En}: standards and gate tests.`,
          minutes: 14,
        },
        {
          id: `${programId}-l16`, kind: 'plan',
          title: 'Come strutturare ogni seduta', titleEn: 'How to structure each session',
          description: 'Ordine degli esercizi, riscaldamento specifico, lavoro principale e defaticamento.',
          descriptionEn: 'Exercise order, specific warm-up, main work and cool-down.',
          minutes: 9,
        },
        {
          id: `${programId}-l17`, kind: 'plan',
          title: 'Scarico, recupero e prevenzione', titleEn: 'Deload, recovery & prevention',
          description: 'Settimane di scarico, sonno, gestione dei fastidi e segnali di sovraccarico.',
          descriptionEn: 'Deload weeks, sleep, managing niggles and overreaching signals.',
          minutes: 10,
        },
      ],
    },
    {
      id: 'workouts',
      title: 'I miei piani di allenamento per te',
      titleEn: 'My workout plans for you',
      lessons: [
        {
          id: `${programId}-l18`, kind: 'workout',
          title: 'Livelli e presentazione dei workout', titleEn: 'Levels & workouts presentation',
          description: 'Come sono organizzati i livelli e come scegliere il tuo punto di partenza.',
          descriptionEn: 'How levels are organized and how to choose your starting point.',
          minutes: 8,
        },
        {
          id: `${programId}-l19`, kind: 'workout',
          title: 'Livello Beginner: schede e tabelle', titleEn: 'Beginner level: plans & tables',
          description: 'Le schede del livello base con esercizi, serie, ripetizioni e recuperi.',
          descriptionEn: 'Beginner-level plans with exercises, sets, reps and rest.',
          minutes: 12,
        },
        {
          id: `${programId}-l20`, kind: 'workout',
          title: 'Livello Intermediate: schede e tabelle', titleEn: 'Intermediate level: plans & tables',
          description: 'Le schede del livello intermedio con lavoro specifico e isolato.',
          descriptionEn: 'Intermediate-level plans with specific and isolated work.',
          minutes: 12,
        },
        {
          id: `${programId}-l21`, kind: 'workout',
          title: 'Livello Advanced: schede e tabelle', titleEn: 'Advanced level: plans & tables',
          description: 'Le schede del livello avanzato con picchi di intensità e skill complete.',
          descriptionEn: 'Advanced-level plans with intensity peaks and full skills.',
          minutes: 12,
        },
        {
          id: `${programId}-l22`, kind: 'workout',
          title: 'Come gestire la settimana', titleEn: 'How to manage your weekly schedule',
          description: 'Distribuire le 4 sedute nella settimana, giorni di riposo e attività leggere.',
          descriptionEn: 'Fitting the 4 sessions into your week, rest days and light activity.',
          minutes: 7,
        },
      ],
    },
    {
      id: 'videos',
      title: 'Video degli esercizi',
      titleEn: 'Exercise videos',
      lessons: meta.videos.map((v, i) => ({
        id: `${programId}-v${i + 1}`,
        kind: 'video' as const,
        title: `Video: ${v.name}`,
        titleEn: `Video: ${v.nameEn}`,
        description: `Dimostrazione video ed esecuzione tecnica di ${v.name}.`,
        descriptionEn: `Video demonstration and technical execution of ${v.nameEn}.`,
        minutes: 5,
        exerciseId: v.exerciseId,
      })),
    },
    {
      id: 'tips',
      title: 'Consigli segreti',
      titleEn: 'Secret tips',
      lessons: [
        {
          id: `${programId}-t1`, kind: 'tips',
          title: `I miei consigli bonus per ${skill1}`, titleEn: `My bonus tips for ${skill1En}`,
          description: 'I trucchi pratici che hanno sbloccato la skill più in fretta ai miei atleti.',
          descriptionEn: 'The practical tricks that unlocked the skill fastest for my athletes.',
          minutes: 9,
        },
        {
          id: `${programId}-t2`, kind: 'tips',
          title: 'Tocca a te: test e prossimi passi', titleEn: 'Your turn: test & next steps',
          description: 'Come testare i progressi, quando passare al programma successivo e come continuare.',
          descriptionEn: 'How to test progress, when to move to the next program and how to continue.',
          minutes: 7,
        },
      ],
    },
  ];

  const allLessons = sections.flatMap((s) => s.lessons);
  const highlights: CurriculumHighlight[] = [
    {
      icon: 'workouts',
      text: `${routines} schede di allenamento create ad hoc`,
      textEn: `${routines} expertly crafted workout routines`,
    },
    {
      icon: 'videos',
      text: 'Video-dimostrazioni di ogni esercizio',
      textEn: 'Video demonstrations for every exercise',
    },
    {
      icon: 'theory',
      text: 'Spiegazioni tecniche, biomeccaniche e anatomiche',
      textEn: 'Technical, biomechanical and anatomical explanations',
    },
  ];

  return {
    programId,
    sections,
    highlights,
    totalLessons: allLessons.length,
    totalMinutes: allLessons.reduce((sum, l) => sum + l.minutes, 0),
  };
}
