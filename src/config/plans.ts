export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  iconName: 'Zap' | 'Star' | 'ShieldCheck' | 'Dumbbell';
  features: string[];
  description: string;
  popular?: boolean;
  highlight?: boolean;
  period?: string;
  cta?: string;
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    iconName: 'Zap',
    features: [
      '1 programma principiante preimpostato',
      'Timer allenamento con intervalli',
      'Registro pesi ultime 10 sessioni',
      'Community pubblica Maxthenics',
      'Newsletter settimanale tecnica',
      '3 messaggi Sthenox AI Coach',
      'Tracciamento calorie base',
    ],
    description: 'Per provare senza impegno',
    period: 'Sempre',
    cta: 'Inizia Gratis',
  },
  {
    id: 'base',
    name: 'Base',
    price: 7.99,
    iconName: 'Dumbbell',
    features: [
      'Tutti i programmi skill (Planche, Front Lever, Handstand)',
      'Pianificazione settimanale automatica',
      'Storico illimitato pesi e volumi',
      'Grafici progressione per esercizio',
      'Sthenox AI: messaggi illimitati',
      'Export PDF programma settimanale',
      'Supporto email risposta 48h',
    ],
    description: 'Per atleti che fanno sul serio',
    period: 'Mese',
    cta: 'Inizia Ora',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    iconName: 'Star',
    features: [
      'Tutti i programmi skill e forza',
      'Generazione programmi con AI',
      'Analisi video con feedback biomeccanico',
      'Sthenox AI: analisi RPE e auto-regolazione',
      'Tutte le video-lezioni 4K',
      'Piani nutrizionali personalizzati',
      'Supporto prioritario risposta 12h',
    ],
    popular: true,
    highlight: true,
    description: 'Il piano più completo',
    period: 'Mese',
    cta: 'Scegli Pro',
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 14.99,
    iconName: 'ShieldCheck',
    features: [
      'Sessioni 1:1 mensili con coach',
      'Programmazione annuale personalizzata',
      'Analisi video settimanale approfondita',
      'Coach dedicato via WhatsApp 7/7',
      'Piano nutrizionale mensile su misura',
      'Sthenox AI modello dedicato prioritario',
      'Supporto 24/7 risposta entro 2h',
    ],
    description: 'Per chi vive di calisthenics',
    period: 'Mese',
    cta: 'Diventa Elite',
  },
];
