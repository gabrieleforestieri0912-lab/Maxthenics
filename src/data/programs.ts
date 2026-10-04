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
}

export interface ProgramData {
  workout: ProgramDataItem[];
  frontLever: ProgramDataItem[];
  planche: ProgramDataItem[];
  skills: ProgramDataItem[];
}

export const programData: ProgramData = {
  workout: [
    { 
      id: 101, 
      title: 'Attivazione Metabolica & Neurale', 
      description: 'Protocollo di attivazione metabolica e neurale. Ottimizzazione delle catene cinetiche attraverso movimenti ad alta tensione.', 
      price: 0, 
      level: 'Principiante', 
      image: '/Img/programs.jpg',
      features: ['Preparazione Neurale', 'Video Tutorial 4K', 'Community Elite', 'Piano Nutrizionale Base'],
      duration: '4 Settimane',
      intensity: 'Bassa/Media'
    },
    { 
      id: 102, 
      title: 'Stabilità Strutturale del Core', 
      description: 'Analisi biomeccanica della stabilità del core. Integrazione dei muscoli profondi per una base di forza indistruttibile.', 
      price: 0, 
      level: 'Intermedio', 
      image: '/Img/content.jpg',
      features: ['Stabilità Bio-Core', 'Tecniche di Respirazione', 'Scheda Esercizi PDF', 'Accesso App'],
      duration: '3 Settimane',
      intensity: 'Alta'
    },
    { 
      id: 103, 
      title: 'Biomeccanica Fondamentale', 
      description: 'La scomposizione tecnica dei tre pilastri: Trazioni, Piegamenti e Dip. Focus sulla longevità articolare.', 
      price: 0, 
      level: 'Principiante', 
      image: '/Img/motor-unit-recruitment.png',
      features: ['Basi Biomeccaniche', 'Prevenzione Infortuni', 'Propedeutiche Analitiche', 'Guida Riscaldamento'],
      duration: '6 Settimane',
      intensity: 'Media'
    },
  ],
  frontLever: [
    { 
      id: 201, 
      title: 'Retrazione & Depressione Scapolare', 
      description: 'Sviluppo della forza specifica dei retrattori scapolari. La base bioenergetica per il Front Lever.', 
      price: 49, 
      level: 'Intermedio', 
      image: '/Img/front-lever.jpg',
      features: ['Forza Scapolare', 'Propedeutiche FL', 'Accesso 24/7', 'Aggiornamenti Vitalizi'],
      duration: '8 Settimane',
      intensity: 'Alta'
    },
    { 
      id: 202, 
      title: 'Dinamiche Straddle Lever', 
      description: 'Transizione avanzata verso la leva completa. Utilizzo di carichi isoinerziali e progressioni basate sull\'RPE.', 
      price: 79, 
      level: 'Avanzato', 
      image: '/Img/front-lever-touch.jpg',
      features: ['Progressioni Straddle', 'Esercizi Complementari', 'Video Analisi Biomeccanica', 'Piano di Recupero'],
      duration: '10 Settimane',
      intensity: 'Molto Alta'
    },
    { 
      id: 203, 
      title: 'Meccanica di Trazione Elite', 
      description: 'Il culmine della forza di trazione. Full Front Lever e ottimizzazione del reclutamento delle unità motorie.', 
      price: 129, 
      level: 'Elite', 
      image: '/Img/one-arm-front-lever.jpg',
      features: ['Mastery Full FL', 'Pull-ups in FL', 'Programma Personalizzato', 'Coaching Privato'],
      duration: '12 Settimane',
      intensity: 'Elite'
    },
  ],
  planche: [
    { 
      id: 301, 
      title: 'Protrazione & Resilienza Polsi', 
      description: 'Condizionamento specifico dei serrati anteriori e resilienza tendinea dei polsi. Fondamenta per la spinta.', 
      price: 59, 
      level: 'Intermedio', 
      image: '/Img/undulating-periodization.png',
      features: ['Rinforzo Polsi', 'Lean & Tuck Planche', 'Mobilità Spalle', 'Supporto Discord Elite'],
      duration: '8 Settimane',
      intensity: 'Alta'
    },
    { 
      id: 302, 
      title: 'Periodizzazione Ipertrofica Push', 
      description: 'Dalla Tuck alla Straddle. Periodizzazione ondulata per il volume specifico e la forza esplosiva.', 
      price: 89, 
      level: 'Avanzato', 
      image: '/Img/linear-periodization.png',
      features: ['Straddle Planche', 'Condizionamento Tendineo', 'Metodi di Intensità', 'FAQ & Risposte'],
      duration: '10 Settimane',
      intensity: 'Molto Alta'
    },
    { 
      id: 303, 
      title: 'Bio-Ottimizzazione Full Planche', 
      description: 'Dominio totale della gravità. Full Planche analizzata attraverso la scomposizione dei momenti di forza.', 
      price: 149, 
      level: 'Elite', 
      image: '/Img/programs.jpg',
      features: ['Full Planche', 'Planche Pushups', 'Accesso a Vita', 'Certificato Mastery'],
      duration: '14 Settimane',
      intensity: 'Elite'
    },
  ],
  skills: [
    {
      id: 401,
      title: 'Handstand Mastery — Inversione di Gravità',
      description: 'Il programma più completo sul mercato per padroneggiare l\'handstand libero. Dalla preparazione dei polsi alla walk progressiva e alle HSPU. Ogni movimento è analizzato fase per fase.',
      price: 79,
      level: 'Intermedio',
      image: '/Img/content.jpg',
      features: [
        'Handstand Libera Senza Parete',
        'Handstand Push-up (HSPU)',
        'Mobilità di Spalle & Polsi',
        'Video Tutorial 4K per ogni progressione',
        'Piano di Riscaldamento Specifico',
        'Accesso a Vita e Aggiornamenti',
      ],
      duration: '8 Settimane',
      intensity: 'Molto Alta',
    },
    {
      id: 402,
      title: 'Back Lever & German Hang — Decompressione Spinale',
      description: 'Il programma che completa la catena posteriore. Dal German Hang al Full Back Lever, con focus sulla salute della spalla e ilriequilibrio tra catena anteriore e posteriore.',
      price: 89,
      level: 'Avanzato',
      image: '/Img/front-lever.jpg',
      features: [
        'German Hang → Tuck → Straddle → Full Back Lever',
        'Rinforzo di Trapezio & Romboidi (postura)',
        'Progressioni RPE-Based per catena posteriore',
        'Prehab Shoulder Flow incluso',
        'Community Elite & Analisi Biomeccanica',
        'Accesso a Vita',
      ],
      duration: '10 Settimane',
      intensity: 'Molto Alta',
    },
    {
      id: 403,
      title: 'Human Flag & Maltese — Dominanza Orizzontale',
      description: 'Il programma definitivo per la forza laterale e la dominanza orizzontale. Human Flag → Straddle Maltese → Full Maltese. Include una consulenza video feedback inclusa.',
      price: 169,
      level: 'Elite',
      image: '/Img/one-arm-front-lever.jpg',
      features: [
        'Tuck → Straddle → Full Human Flag',
        'Progressioni verso Straddle & Full Maltese',
        '1 Consulenza Video Feedback Inclusa (15 min)',
        'Rinforzo Cuffia dei Rotatori & Fasci Posteriori',
        'Periodizzazione 3-Phase per 3-5 secondi hold',
        'Accesso a Vita & Certificato Mastery',
      ],
      duration: '12 Settimane',
      intensity: 'Elite',
    },
    {
      id: 404,
      title: 'Dragon Flag — Corazza del Core',
      description: 'Il programma strutturato per padroneggiare la Dragon Flag di Bruce Lee. Tuck → Advanced Tuck → Straddle → Full. Costruisci il core più resistente della tua vita.',
      price: 49,
      level: 'Intermedio',
      image: '/Img/undulating-periodization.png',
      features: [
        'Tutta la scala della Dragon Flag',
        'Core Stability Eccentrica Controllata',
        'Integrazione con Front Lever & Pull-up',
        'Warm-up & Rehab Flow incluso',
        'Video Progress Track',
        'Accesso a Vita',
      ],
      duration: '6 Settimane',
      intensity: 'Alta',
    },
    {
      id: 405,
      title: 'Prehab & Longevità — Protocollo Articolare',
      description: 'Il programma rolling per atleti di calisthenics che vogliono allenare più a lungo, senza infortuni. Protocolli settimanali per spalle, gomiti, polsi, ginocchia e schiena.',
      price: 39,
      level: 'Principiante',
      image: '/Img/linear-periodization.png',
      features: [
        'Shoulder Shield Progression (Prehab Spalle)',
        'Elbow Rehab Flow (Gomiti)',
        'Wrist & Ankle Mobility Protocol',
        'Tendon Loading Deliberate Practice',
        '1 Nuovo Flusso Ogni Settimana (12 totali)',
        'Aggiornamenti mensili e Comunicità Prehab',
      ],
      duration: '12 Settimane',
      intensity: 'Bassa/Media',
    },
    {
      id: 406,
      title: 'Ipertrofia Calisthenics — Massa a Corpo Libero',
      description: 'Costruisci massa muscolare con solo il corpo libero. Periodrizzazione 5-day split con progressive overload, tempo manipulation e volume cycling. 40+ esercizi unici.',
      price: 59,
      level: 'Principiante',
      image: '/Img/motor-unit-recruitment.png',
      features: [
        'Split 5 Giorni: Push / Pull / Legs / Upper / Lower',
        'Progressive Overload Sistema di Tracciamento',
        '40+ Esercizi Unici (oltre i 23 base)',
        'Nutrizione Base e Schema Calorico',
        'Tempo Manipulation (tempo sotto tensione)',
        'Video Tutorial 4K per ogni movimento',
      ],
      duration: '12 Settimane',
      intensity: 'Media',
    },
  ],
};
