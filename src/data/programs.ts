export type Locale = 'it' | 'en';

export interface ProgramDataItem {
  id: number;
  title: string;
  description: string;
  price: number;
  level: string;
  image: string;
  features: string[];
  duration: string;
  intensity: string;
  stripePriceId?: string;
  // ── English translations (progressive enhancement: UI falls back to IT) ──
  titleEn?: string;
  descriptionEn?: string;
  levelEn?: string;
  featuresEn?: string[];
  durationEn?: string;
  intensityEn?: string;
}

export interface ProgramData {
  workout: ProgramDataItem[];
  frontLever: ProgramDataItem[];
  planche: ProgramDataItem[];
  skills: ProgramDataItem[];
}

export type ProgramCategory = keyof ProgramData;

export const PROGRAM_CATEGORIES: ProgramCategory[] = [
  'workout',
  'frontLever',
  'planche',
  'skills',
];

export interface LocalizedProgram extends ProgramDataItem {
  locale: Locale;
  localizedTitle: string;
  localizedDescription: string;
  localizedLevel: string;
  localizedFeatures: string[];
  localizedDuration: string;
  localizedIntensity: string;
}

/** Return the display strings for a program in the requested locale (fallback IT). */
export function localizeProgram(program: ProgramDataItem, locale: Locale): LocalizedProgram {
  const isEn = locale === 'en';
  return {
    ...program,
    locale,
    localizedTitle: isEn ? (program.titleEn ?? program.title) : program.title,
    localizedDescription: isEn ? (program.descriptionEn ?? program.description) : program.description,
    localizedLevel: isEn ? (program.levelEn ?? program.level) : program.level,
    localizedFeatures: isEn ? (program.featuresEn ?? program.features) : program.features,
    localizedDuration: isEn ? (program.durationEn ?? program.duration) : program.duration,
    localizedIntensity: isEn ? (program.intensityEn ?? program.intensity) : program.intensity,
  };
}

export function getAllProgramsList(data: ProgramData = programData): ProgramDataItem[] {
  return PROGRAM_CATEGORIES.flatMap((c) => data[c] ?? []);
}

export function getProgramByIdList(
  id: string | number,
  data: ProgramData = programData,
): ProgramDataItem | undefined {
  const numeric = typeof id === 'number' ? id : parseInt(id, 10);
  return getAllProgramsList(data).find((p) => p.id === numeric);
}

export const programData: ProgramData = {
  workout: [
    {
      id: 101,
      title: 'Attivazione Metabolica & Neurale',
      titleEn: 'Metabolic & Neural Activation',
      description: 'Protocollo di attivazione metabolica e neurale. Ottimizzazione delle catene cinetiche attraverso movimenti ad alta tensione.',
      descriptionEn: 'Metabolic and neural activation protocol. Optimization of kinetic chains through high-tension movements.',
      price: 0,
      level: 'Principiante',
      levelEn: 'Beginner',
      image: '/Img/programs.jpg',
      features: ['Preparazione Neurale', 'Video Tutorial 4K', 'Community Elite', 'Piano Nutrizionale Base'],
      featuresEn: ['Neural Preparation', '4K Video Tutorials', 'Elite Community', 'Basic Nutrition Plan'],
      duration: '4 Settimane',
      durationEn: '4 Weeks',
      intensity: 'Bassa/Media',
      intensityEn: 'Low/Medium',
    },
    {
      id: 102,
      title: 'Stabilità Strutturale del Core',
      titleEn: 'Structural Core Stability',
      description: 'Analisi biomeccanica della stabilità del core. Integrazione dei muscoli profondi per una base di forza indistruttibile.',
      descriptionEn: 'Biomechanical analysis of core stability. Deep-muscle integration for an unbreakable strength base.',
      price: 0,
      level: 'Intermedio',
      levelEn: 'Intermediate',
      image: '/Img/content.jpg',
      features: ['Stabilità Bio-Core', 'Tecniche di Respirazione', 'Scheda Esercizi PDF', 'Accesso App'],
      featuresEn: ['Bio-Core Stability', 'Breathing Techniques', 'PDF Exercise Sheet', 'App Access'],
      duration: '3 Settimane',
      durationEn: '3 Weeks',
      intensity: 'Alta',
      intensityEn: 'High',
    },
    {
      id: 103,
      title: 'Biomeccanica Fondamentale',
      titleEn: 'Fundamental Biomechanics',
      description: 'La scomposizione tecnica dei tre pilastri: Trazioni, Piegamenti e Dip. Focus sulla longevità articolare.',
      descriptionEn: 'Technical breakdown of the three pillars: Pull-ups, Push-ups and Dips. Focus on joint longevity.',
      price: 0,
      level: 'Principiante',
      levelEn: 'Beginner',
      image: '/Img/motor-unit-recruitment.png',
      features: ['Basi Biomeccaniche', 'Prevenzione Infortuni', 'Propedeutiche Analitiche', 'Guida Riscaldamento'],
      featuresEn: ['Biomechanical Foundations', 'Injury Prevention', 'Analytical Progressions', 'Warm-up Guide'],
      duration: '6 Settimane',
      durationEn: '6 Weeks',
      intensity: 'Media',
      intensityEn: 'Medium',
    },
  ],
  frontLever: [
    {
      id: 201,
      title: 'Retrazione & Depressione Scapolare',
      titleEn: 'Scapular Retraction & Depression',
      description: 'Sviluppo della forza specifica dei retrattori scapolari. La base bioenergetica per il Front Lever.',
      descriptionEn: 'Development of specific scapular-retractor strength. The bioenergetic foundation for the Front Lever.',
      price: 49,
      level: 'Intermedio',
      levelEn: 'Intermediate',
      image: '/Img/front-lever.jpg',
      features: ['Forza Scapolare', 'Propedeutiche FL', 'Accesso 24/7', 'Aggiornamenti Vitalizi'],
      featuresEn: ['Scapular Strength', 'Front Lever Progressions', '24/7 Access', 'Lifetime Updates'],
      duration: '8 Settimane',
      durationEn: '8 Weeks',
      intensity: 'Alta',
      intensityEn: 'High',
    },
    {
      id: 202,
      title: 'Dinamiche Straddle Lever',
      titleEn: 'Straddle Lever Dynamics',
      description: 'Transizione avanzata verso la leva completa. Utilizzo di carichi isoinerziali e progressioni basate sull\'RPE.',
      descriptionEn: 'Advanced transition to the full lever. Iso-inertial loading and RPE-based progressions.',
      price: 79,
      level: 'Avanzato',
      levelEn: 'Advanced',
      image: '/Img/front-lever-touch.jpg',
      features: ['Progressioni Straddle', 'Esercizi Complementari', 'Video Analisi Biomeccanica', 'Piano di Recupero'],
      featuresEn: ['Straddle Progressions', 'Accessory Exercises', 'Biomechanical Video Analysis', 'Recovery Plan'],
      duration: '10 Settimane',
      durationEn: '10 Weeks',
      intensity: 'Molto Alta',
      intensityEn: 'Very High',
    },
    {
      id: 203,
      title: 'Meccanica di Trazione Elite',
      titleEn: 'Elite Pulling Mechanics',
      description: 'Il culmine della forza di trazione. Full Front Lever e ottimizzazione del reclutamento delle unità motorie.',
      descriptionEn: 'The pinnacle of pulling strength. Full Front Lever and motor-unit recruitment optimization.',
      price: 129,
      level: 'Elite',
      levelEn: 'Elite',
      image: '/Img/one-arm-front-lever.jpg',
      features: ['Mastery Full FL', 'Pull-ups in FL', 'Programma Personalizzato', 'Coaching Privato'],
      featuresEn: ['Full Front Lever Mastery', 'Pull-ups in Front Lever', 'Custom Program', 'Private Coaching'],
      duration: '12 Settimane',
      durationEn: '12 Weeks',
      intensity: 'Elite',
      intensityEn: 'Elite',
    },
  ],
  planche: [
    {
      id: 301,
      title: 'Protrazione & Resilienza Polsi',
      titleEn: 'Protraction & Wrist Resilience',
      description: 'Condizionamento specifico dei serrati anteriori e resilienza tendinea dei polsi. Fondamenta per la spinta.',
      descriptionEn: 'Specific conditioning of the serratus anterior and tendon resilience of the wrists. The foundation of pushing strength.',
      price: 59,
      level: 'Intermedio',
      levelEn: 'Intermediate',
      image: '/Img/undulating-periodization.png',
      features: ['Rinforzo Polsi', 'Lean & Tuck Planche', 'Mobilità Spalle', 'Supporto Discord Elite'],
      featuresEn: ['Wrist Strengthening', 'Lean & Tuck Planche', 'Shoulder Mobility', 'Elite Discord Support'],
      duration: '8 Settimane',
      durationEn: '8 Weeks',
      intensity: 'Alta',
      intensityEn: 'High',
    },
    {
      id: 302,
      title: 'Periodizzazione Ipertrofica Push',
      titleEn: 'Hypertrophic Push Periodization',
      description: 'Dalla Tuck alla Straddle. Periodizzazione ondulata per il volume specifico e la forza esplosiva.',
      descriptionEn: 'From Tuck to Straddle. Undulating periodization for specific volume and explosive strength.',
      price: 89,
      level: 'Avanzato',
      levelEn: 'Advanced',
      image: '/Img/linear-periodization.png',
      features: ['Straddle Planche', 'Condizionamento Tendineo', 'Metodi di Intensità', 'FAQ & Risposte'],
      featuresEn: ['Straddle Planche', 'Tendon Conditioning', 'Intensity Methods', 'FAQ & Answers'],
      duration: '10 Settimane',
      durationEn: '10 Weeks',
      intensity: 'Molto Alta',
      intensityEn: 'Very High',
    },
    {
      id: 303,
      title: 'Bio-Ottimizzazione Full Planche',
      titleEn: 'Full Planche Bio-Optimization',
      description: 'Dominio totale della gravità. Full Planche analizzata attraverso la scomposizione dei momenti di forza.',
      descriptionEn: 'Total mastery of gravity. Full Planche analyzed through torque breakdown.',
      price: 149,
      level: 'Elite',
      levelEn: 'Elite',
      image: '/Img/programs.jpg',
      features: ['Full Planche', 'Planche Pushups', 'Accesso a Vita', 'Certificato Mastery'],
      featuresEn: ['Full Planche', 'Planche Push-ups', 'Lifetime Access', 'Mastery Certificate'],
      duration: '14 Settimane',
      durationEn: '14 Weeks',
      intensity: 'Elite',
      intensityEn: 'Elite',
    },
  ],
  skills: [
    {
      id: 401,
      title: 'Handstand Mastery — Inversione di Gravità',
      titleEn: 'Handstand Mastery — Defying Gravity',
      description: 'Il programma più completo sul mercato per padroneggiare l\'handstand libero. Dalla preparazione dei polsi alla walk progressiva e alle HSPU. Ogni movimento è analizzato fase per fase.',
      descriptionEn: 'The most complete program on the market to master the freestanding handstand. From wrist preparation to progressive walks and HSPUs. Every movement is analyzed phase by phase.',
      price: 79,
      level: 'Intermedio',
      levelEn: 'Intermediate',
      image: '/Img/content.jpg',
      features: [
        'Handstand Libera Senza Parete',
        'Handstand Push-up (HSPU)',
        'Mobilità di Spalle & Polsi',
        'Video Tutorial 4K per ogni progressione',
        'Piano di Riscaldamento Specifico',
        'Accesso a Vita e Aggiornamenti',
      ],
      featuresEn: [
        'Freestanding Handstand Without Wall',
        'Handstand Push-up (HSPU)',
        'Shoulder & Wrist Mobility',
        '4K Video Tutorial for Every Progression',
        'Specific Warm-up Plan',
        'Lifetime Access and Updates',
      ],
      duration: '8 Settimane',
      durationEn: '8 Weeks',
      intensity: 'Molto Alta',
      intensityEn: 'Very High',
    },
    {
      id: 402,
      title: 'Back Lever & German Hang — Decompressione Spinale',
      titleEn: 'Back Lever & German Hang — Spinal Decompression',
      description: 'Il programma che completa la catena posteriore. Dal German Hang al Full Back Lever, con focus sulla salute della spalla e ilriequilibrio tra catena anteriore e posteriore.',
      descriptionEn: 'The program that completes the posterior chain. From German Hang to Full Back Lever, with a focus on shoulder health and rebalancing the anterior and posterior chains.',
      price: 89,
      level: 'Avanzato',
      levelEn: 'Advanced',
      image: '/Img/front-lever.jpg',
      features: [
        'German Hang → Tuck → Straddle → Full Back Lever',
        'Rinforzo di Trapezio & Romboidi (postura)',
        'Progressioni RPE-Based per catena posteriore',
        'Prehab Shoulder Flow incluso',
        'Community Elite & Analisi Biomeccanica',
        'Accesso a Vita',
      ],
      featuresEn: [
        'German Hang → Tuck → Straddle → Full Back Lever',
        'Trapezius & Rhomboid Strengthening (posture)',
        'RPE-Based Progressions for the Posterior Chain',
        'Prehab Shoulder Flow Included',
        'Elite Community & Biomechanical Analysis',
        'Lifetime Access',
      ],
      duration: '10 Settimane',
      durationEn: '10 Weeks',
      intensity: 'Molto Alta',
      intensityEn: 'Very High',
    },
    {
      id: 403,
      title: 'Human Flag & Maltese — Dominanza Orizzontale',
      titleEn: 'Human Flag & Maltese — Horizontal Dominance',
      description: 'Il programma definitivo per la forza laterale e la dominanza orizzontale. Human Flag → Straddle Maltese → Full Maltese. Include una consulenza video feedback inclusa.',
      descriptionEn: 'The definitive program for lateral strength and horizontal dominance. Human Flag → Straddle Maltese → Full Maltese. Includes one video-feedback consultation.',
      price: 169,
      level: 'Elite',
      levelEn: 'Elite',
      image: '/Img/one-arm-front-lever.jpg',
      features: [
        'Tuck → Straddle → Full Human Flag',
        'Progressioni verso Straddle & Full Maltese',
        '1 Consulenza Video Feedback Inclusa (15 min)',
        'Rinforzo Cuffia dei Rotatori & Fasci Posteriori',
        'Periodizzazione 3-Phase per 3-5 secondi hold',
        'Accesso a Vita & Certificato Mastery',
      ],
      featuresEn: [
        'Tuck → Straddle → Full Human Flag',
        'Progressions to Straddle & Full Maltese',
        '1 Video-Feedback Consultation Included (15 min)',
        'Rotator Cuff & Posterior Chain Strengthening',
        '3-Phase Periodization for 3–5 Second Holds',
        'Lifetime Access & Mastery Certificate',
      ],
      duration: '12 Settimane',
      durationEn: '12 Weeks',
      intensity: 'Elite',
      intensityEn: 'Elite',
    },
    {
      id: 404,
      title: 'Dragon Flag — Corazza del Core',
      titleEn: 'Dragon Flag — Core Armor',
      description: 'Il programma strutturato per padroneggiare la Dragon Flag di Bruce Lee. Tuck → Advanced Tuck → Straddle → Full. Costruisci il core più resistente della tua vita.',
      descriptionEn: 'The structured program to master the Bruce Lee Dragon Flag. Tuck → Advanced Tuck → Straddle → Full. Build the most resilient core of your life.',
      price: 49,
      level: 'Intermedio',
      levelEn: 'Intermediate',
      image: '/Img/undulating-periodization.png',
      features: [
        'Tutta la scala della Dragon Flag',
        'Core Stability Eccentrica Controllata',
        'Integrazione con Front Lever & Pull-up',
        'Warm-up & Rehab Flow incluso',
        'Video Progress Track',
        'Accesso a Vita',
      ],
      featuresEn: [
        'The Full Dragon Flag Spectrum',
        'Controlled Eccentric Core Stability',
        'Integration with Front Lever & Pull-up',
        'Warm-up & Rehab Flow Included',
        'Video Progress Tracking',
        'Lifetime Access',
      ],
      duration: '6 Settimane',
      durationEn: '6 Weeks',
      intensity: 'Alta',
      intensityEn: 'High',
    },
    {
      id: 405,
      title: 'Prehab & Longevità — Protocollo Articolare',
      titleEn: 'Prehab & Longevity — Joint Protocol',
      description: 'Il programma rolling per atleti di calisthenics che vogliono allenare più a lungo, senza infortuni. Protocolli settimanali per spalle, gomiti, polsi, ginocchia e schiena.',
      descriptionEn: 'The rolling program for calisthenics athletes who want to train longer, injury-free. Weekly protocols for shoulders, elbows, wrists, knees and back.',
      price: 39,
      level: 'Principiante',
      levelEn: 'Beginner',
      image: '/Img/linear-periodization.png',
      features: [
        'Shoulder Shield Progression (Prehab Spalle)',
        'Elbow Rehab Flow (Gomiti)',
        'Wrist & Ankle Mobility Protocol',
        'Tendon Loading Deliberate Practice',
        '1 Nuovo Flusso Ogni Settimana (12 totali)',
        'Aggiornamenti mensili e Comunicità Prehab',
      ],
      featuresEn: [
        'Shoulder Shield Progression (Shoulder Prehab)',
        'Elbow Rehab Flow (Elbows)',
        'Wrist & Ankle Mobility Protocol',
        'Deliberate-Practice Tendon Loading',
        '1 New Flow Every Week (12 total)',
        'Monthly Updates and Prehab Community',
      ],
      duration: '12 Settimane',
      durationEn: '12 Weeks',
      intensity: 'Bassa/Media',
      intensityEn: 'Low/Medium',
    },
    {
      id: 406,
      title: 'Ipertrofia Calisthenics — Massa a Corpo Libero',
      titleEn: 'Calisthenics Hypertrophy — Bodyweight Mass',
      description: 'Costruisci massa muscolare con solo il corpo libero. Periodrizzazione 5-day split con progressive overload, tempo manipulation e volume cycling. 40+ esercizi unici.',
      descriptionEn: 'Build muscle mass with bodyweight only. 5-day split periodization with progressive overload, tempo manipulation and volume cycling. 40+ unique exercises.',
      price: 59,
      level: 'Principiante',
      levelEn: 'Beginner',
      image: '/Img/motor-unit-recruitment.png',
      features: [
        'Split 5 Giorni: Push / Pull / Legs / Upper / Lower',
        'Progressive Overload Sistema di Tracciamento',
        '40+ Esercizi Unici (oltre i 23 base)',
        'Nutrizione Base e Schema Calorico',
        'Tempo Manipulation (tempo sotto tensione)',
        'Video Tutorial 4K per ogni movimento',
      ],
      featuresEn: [
        '5-Day Split: Push / Pull / Legs / Upper / Lower',
        'Progressive Overload Tracking System',
        '40+ Unique Exercises (beyond the 23 basics)',
        'Basic Nutrition and Calorie Framework',
        'Tempo Manipulation (time under tension)',
        '4K Video Tutorial for Every Movement',
      ],
      duration: '12 Settimane',
      durationEn: '12 Weeks',
      intensity: 'Media',
      intensityEn: 'Medium',
    },
  ],
};
