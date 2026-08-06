import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQItemData {
  question: string;
  answer: string;
  tag?: string;
}

const faqs: FAQItemData[] = [
  {
    question: "Cos'è Maxthenics?",
    answer: "Una piattaforma d'élite per il Calisthenics che combina programmi scientifici, tracking automatico e un coach AI. Non è un semplice fitness app: è il tuo laboratorio di biomeccanica personale per sbloccare skills come Planche e Front Lever con un metodo testato sul campo.",
    tag: "Piattaforma",
  },
  {
    question: "Adatto ai principianti?",
    answer: "Assolutamente sì. Abbiamo protocolli progressivi che partono da zero assoluto. Il sistema analizza il tuo livello e ti guida step-by-step fino alle varianti avanzate, senza saltare passaggi. Ogni atleta, dal primo giorno al professionista, trova il suo percorso.",
    tag: "Livelli",
  },
  {
    question: "Servono attrezzature?",
    answer: "Dipende dal protocollo. I piani Zero si fanno solo a corpo libero, ovunque. I piani Base richiedono barra per trazioni e parallele. Il percorso Elite presuppone una palestra completa. All'acquisto trovi scritto chiaramente cosa serve per ogni programma.",
    tag: "Attrezzatura",
  },
  {
    question: "Come funziona Sthenox AI?",
    answer: "Sthenox è il tuo coach AI integrato. Puoi chiedergli consigli sulla tecnica in tempo reale, calcolare il carico giusto per la seduta, ottenere varianti di esercizi o routine di mobilità personalizzate. Più lo usi, più impara il tuo corpo e affina le risposte.",
    tag: "AI",
  },
  {
    question: "Posso annullare l'abbonamento?",
    answer: "Sì, in qualsiasi momento dal tuo profilo, con un clic. Niente code, niente telefonate, niente costi nascosti. L'accesso rimane attivo fino alla fine del periodo già pagato.",
    tag: "Fatturazione",
  },
];

interface FAQItemProps {
  faq: FAQItemData;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

const FAQItem: React.FC<FAQItemProps> = ({ faq, isOpen, onToggle, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className={`rounded-2xl border transition-all duration-300 ${
        isOpen
          ? "bg-red-500/5 border-red-500/20 shadow-[0_0_30px_-10px_rgba(220,38,38,0.2)]"
          : "bg-zinc-900/30 border-white/5 hover:bg-zinc-900/50 hover:border-white/10"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center justify-between text-left gap-4"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
              isOpen
                ? "bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                : "bg-zinc-800 group-hover:bg-zinc-700"
            }`}
          >
            <HelpCircle size={16} className={isOpen ? "text-white" : "text-zinc-500"} />
          </div>
          <div className="min-w-0">
            <span
              className={`block text-sm sm:text-base font-bold truncate transition-colors duration-300 ${
                isOpen ? "text-white" : "text-zinc-300 group-hover:text-white"
              }`}
            >
              {faq.question}
            </span>
            {faq.tag && (
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                {faq.tag}
              </span>
            )}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 26, mass: 0.6 }}
          className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            isOpen ? "text-red-500 bg-red-500/10" : "text-zinc-600 bg-zinc-800/50"
          }`}
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>

      {/* CSS grid transition per animazione fluida — niente height: auto con JS */}
      <div
        className={`grid transition-all duration-[400ms] ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
        style={{ transitionProperty: "grid-template-rows, opacity" }}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pl-14 text-sm text-zinc-400 leading-relaxed font-medium">
            {faq.answer}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="section-padding relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-max relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-red-600 font-black tracking-[0.4em] uppercase text-[10px] mb-4 block"
            >
              Support Center
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl font-black text-white tracking-tighter"
            >
              Domande{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-orange-500">
                Frequenti
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="text-zinc-500 font-medium mt-4 max-w-lg mx-auto"
            >
              Tutto quello che devi sapere sul protocollo Maxthenics.
            </motion.p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                index={index}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-zinc-600 font-bold uppercase tracking-widest mb-5">
              Altre domande?
            </p>
            <Link
              to="/feedback"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-900/30"
            >
              <Sparkles size={14} />
              Contattaci
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
