export interface FAQItemData {
  question: string;
  answer: string;
  tag?: string;
}

export const faqs: FAQItemData[] = [
  {
    question: "Cos'è Maxthenics?",
    answer:
      "Una piattaforma d'élite per il Calisthenics che combina programmi scientifici, tracking automatico e un coach AI. Non è un semplice fitness app: è il tuo laboratorio di biomeccanica personale per sbloccare skills come Planche e Front Lever con un metodo testato sul campo.",
    tag: "Piattaforma",
  },
  {
    question: "Adatto ai principianti?",
    answer:
      "Assolutamente sì. Abbiamo protocolli progressivi che partono da zero assoluto. Il sistema analizza il tuo livello e ti guida step-by-step fino alle varianti avanzate, senza saltare passaggi. Ogni atleta, dal primo giorno al professionista, trova il suo percorso.",
    tag: "Livelli",
  },
  {
    question: "Servono attrezzature?",
    answer:
      "Dipende dal protocollo. I piani Zero si fanno solo a corpo libero, ovunque. I piani Base richiedono barra per trazioni e parallele. Il percorso Elite presuppone una palestra completa. All'acquisto trovi scritto chiaramente cosa serve per ogni programma.",
    tag: "Attrezzatura",
  },
  {
    question: "Come funziona Sthenox AI?",
    answer:
      "Sthenox è il tuo coach AI integrato. Puoi chiedergli consigli sulla tecnica in tempo reale, calcolare il carico giusto per la seduta, ottenere varianti di esercizi o routine di mobilità personalizzate. Più lo usi, più impara il tuo corpo e affina le risposte.",
    tag: "AI",
  },
  {
    question: "Posso annullare l'abbonamento?",
    answer:
      "Sì, in qualsiasi momento dal tuo profilo, con un clic. Niente code, niente telefonate, niente costi nascosti. L'accesso rimane attivo fino alla fine del periodo già pagato.",
    tag: "Fatturazione",
  },
];