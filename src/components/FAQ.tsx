import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { faqs, type FAQItemData } from '../data/faq';
import { useLanguage } from '../context/LanguageContext';

interface FAQItemProps {
  faq: FAQItemData;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

const FAQItem: React.FC<FAQItemProps> = ({ faq, isOpen, onToggle, index }) => {
  const { locale } = useLanguage();
  const question = locale === 'en' ? (faq.questionEn ?? faq.question) : faq.question;
  const answer = locale === 'en' ? (faq.answerEn ?? faq.answer) : faq.answer;
  const tag = locale === 'en' ? (faq.tagEn ?? faq.tag) : faq.tag;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className={`rounded-2xl border transition-all duration-300 ${
        isOpen
          ? "bg-red-500/5 border-red-500/20 shadow-[0_0_30px_-10px_rgba(220,38,38,0.2)]"
          : "bg-white dark:bg-zinc-900/30 border-zinc-200 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-white/10"
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
                : "bg-zinc-200 dark:bg-zinc-800 group-hover:bg-zinc-300 dark:group-hover:bg-zinc-700"
            }`}
          >
            <HelpCircle size={16} className={isOpen ? "text-white" : "text-zinc-500 dark:text-zinc-500"} />
          </div>
          <div className="min-w-0">
            <span
              className={`block text-sm sm:text-base font-bold truncate transition-colors duration-300 ${
                isOpen ? "text-zinc-900 dark:text-white" : "text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white"
              }`}
            >
              {question}
            </span>
            {tag && (
              <span className="text-[9px] font-black text-zinc-500 dark:text-zinc-600 uppercase tracking-widest">
                {tag}
              </span>
            )}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 26, mass: 0.6 }}
          className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            isOpen ? "text-red-500 bg-red-500/10" : "text-zinc-500 dark:text-zinc-600 bg-zinc-200 dark:bg-zinc-800/50"
          }`}
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>

      {/* Animazione fluida di apertura/chiusura con spring su altezza e opacità */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: -6 }}
              animate={{ y: 0 }}
              exit={{ y: -6 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="px-5 pb-5 pl-14 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium"
            >
              {answer}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const { t } = useLanguage();

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
              {t("Centro Assistenza", "Support Center")}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter"
            >
              {t("Domande", "Frequently")}{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-orange-500">
                {t("Frequenti", "Asked")}
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="text-zinc-600 dark:text-zinc-500 font-medium mt-4 max-w-lg mx-auto"
            >
              {t(
                "Tutto quello che devi sapere sul protocollo Maxthenics.",
                "Everything you need to know about the Maxthenics protocol."
              )}
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
            <p className="text-sm text-zinc-500 dark:text-zinc-600 font-bold uppercase tracking-widest mb-5">
              {t("Altre domande?", "More questions?")}
            </p>
            <Link
              to="/feedback"
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-900/30"
            >
              <Sparkles size={14} />
              {t("Contattaci", "Contact us")}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
