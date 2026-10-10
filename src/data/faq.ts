export interface FAQItemData {
  question: string;
  answer: string;
  tag?: string;
  // ── English translations (progressive enhancement: UI falls back to IT) ──
  questionEn?: string;
  answerEn?: string;
  tagEn?: string;
}

export const faqs: FAQItemData[] = [
  {
    question: "Cos'è Maxthenics?",
    answer:
      "Una piattaforma d'élite per il Calisthenics che combina programmi scientifici, tracking automatico e un coach AI. Non è un semplice fitness app: è il tuo laboratorio di biomeccanica personale per sbloccare skills come Planche e Front Lever con un metodo testato sul campo.",
    tag: "Piattaforma",
    questionEn: "What is Maxthenics?",
    answerEn:
      "An elite Calisthenics platform combining scientific programs, automatic tracking and an AI coach. Not just a fitness app: your personal biomechanics lab to unlock skills like Planche and Front Lever with a field-tested method.",
    tagEn: "Platform",
  },
  {
    question: "Adatto ai principianti?",
    answer:
      "Assolutamente sì. Abbiamo protocolli progressivi che partono da zero assoluto. Il sistema analizza il tuo livello e ti guida step-by-step fino alle varianti avanzate, senza saltare passaggi. Ogni atleta, dal primo giorno al professionista, trova il suo percorso.",
    tag: "Livelli",
    questionEn: "Is it suitable for beginners?",
    answerEn:
      "Absolutely yes. We have progressive protocols starting from absolute zero. The system analyzes your level and guides you step-by-step to advanced variations, skipping nothing. Every athlete, from day one to pro, finds their path.",
    tagEn: "Levels",
  },
  {
    question: "Servono attrezzature?",
    answer:
      "Dipende dal protocollo. I piani Zero si fanno solo a corpo libero, ovunque. I piani Base richiedono barra per trazioni e parallele. Il percorso Elite presuppone una palestra completa. All'acquisto trovi scritto chiaramente cosa serve per ogni programma.",
    tag: "Attrezzatura",
    questionEn: "Do I need equipment?",
    answerEn:
      "It depends on the protocol. Zero plans are bodyweight-only, anywhere. Base plans require a pull-up bar and parallels. The Elite path assumes a full gym. At purchase you clearly see what each program needs.",
    tagEn: "Equipment",
  },
  {
    question: "Come funziona Sthenox AI?",
    answer:
      "Sthenox è il tuo coach AI integrato. Puoi chiedergli consigli sulla tecnica in tempo reale, calcolare il carico giusto per la seduta, ottenere varianti di esercizi o routine di mobilità personalizzate. Più lo usi, più impara il tuo corpo e affina le risposte.",
    tag: "AI",
    questionEn: "How does Sthenox AI work?",
    answerEn:
      "Sthenox is your built-in AI coach. You can ask it for real-time technique advice, calculate the right load for the session, get exercise variations or personalized mobility routines. The more you use it, the more it learns your body and sharpens answers.",
    tagEn: "AI",
  },
  {
    question: "Posso annullare l'abbonamento?",
    answer:
      "Sì, in qualsiasi momento dal tuo profilo, con un clic. Niente code, niente telefonate, niente costi nascosti. L'accesso rimane attivo fino alla fine del periodo già pagato.",
    tag: "Fatturazione",
    questionEn: "Can I cancel my subscription?",
    answerEn:
      "Yes, anytime from your profile, with one click. No queues, no phone calls, no hidden fees. Access stays active until the end of the paid period.",
    tagEn: "Billing",
  },
];