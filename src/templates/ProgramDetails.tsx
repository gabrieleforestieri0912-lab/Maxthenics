/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { programData } from '../data/programs';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  Check, ArrowLeft, Zap, Clock, BarChart, ShieldCheck,
  ShoppingCart, Play, Target,
  Flame, HelpCircle, ArrowRight, UserCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from "../components/SEO";
import Image from 'next/image';



const FAQ_ITEMS = [
  {
    question: "Quanto dura l'accesso al programma?",
    answer: "Una volta sbloccato o acquistato, l'accesso al programma è a vita. Potrai consultare le schede, i video e i materiali didattici in qualsiasi momento, ovunque ti trovi."
  },
  {
    question: "Ho bisogno di attrezzatura specifica?",
    answer: "La maggior parte dei nostri programmi richiede attrezzatura base da Calisthenics: sbarra per trazioni, parallele e anelli. Per programmi avanzati potrebbero essere utili bande elastiche o zavorre."
  },
  {
    question: "E se il programma è troppo difficile per me?",
    answer: "Ogni programma è strutturato con propedeutiche graduali. Inoltre, forniamo alternative scalabili per ogni esercizio per adattarsi al tuo livello di partenza."
  }
];

const TARGET_AUDIENCE = [
  "Atleti determinati a superare i plateau di forza",
  "Appassionati di corpo libero che cercano una struttura scientifica",
  "Chi vuole apprendere skills avanzate riducendo il rischio di infortuni"
];



interface IProgramDetails {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  duration: string;
  level: string;
  intensity: string;
  features: string[];
}

const ProgramDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, removeFromCart, cartItems } = useCart();
  const { user, addNotification } = useAuth();
  const navigate = useNavigate();

  const programId = parseInt(id || '0');

  const allPrograms: IProgramDetails[] = [...programData.workout, ...programData.frontLever, ...programData.planche];
  const program = allPrograms.find(p => p.id === programId);

  if (!program) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <SEO title="Programma non trovato" />
        <h2 className="text-3xl font-bold mb-4">Programma non trovato</h2>
        <Link to="/programs" className="text-red-500 hover:underline">Torna ai programmi</Link>
      </div>
    );
  }

  const handleUnlockFree = async () => {
    if (!user) {
      addNotification('Accedi per sbloccare il programma gratuitamente!', 'error');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ programId: program.id.toString() }),
      });

      if (response.ok) {
        addNotification('Programma sbloccato! Ora è nella tua libreria.', 'success');
      }
      navigate(`/program/${program.id}/content`);
    } catch (error) {
      console.error('Unlock error:', error);
      navigate(`/program/${program.id}/content`);
    }
  };

  const isInCart = cartItems.some((item: any) => item.id === programId.toString());

  const isFree = program.price === 0;

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-24 selection:bg-red-600/30">
      <SEO
        title={`${program.title} | Protocollo`}
        description={program.description}
        keywords={`calisthenics, ${program.title}, allenamento, skills, ${program.level}`}
        image={program.image}
      />

      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <Link
          to="/programs"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-10 transition-colors font-bold group text-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Torna all&apos;Accademia
        </Link>

        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-8 order-2 lg:order-1"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest mb-6">
                <Flame size={12} />
                Protocollo Ufficiale
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tighter">
                {program.title}
              </h1>
              <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl font-medium">
                {program.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 bg-zinc-900/40 border border-white/5 py-3 px-5 rounded-xl">
                <Clock className="w-5 h-5 text-red-500" />
                <div>
                  <span className="block text-[10px] text-zinc-500 uppercase font-bold">Durata</span>
                  <span className="font-bold text-sm">{program.duration}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-zinc-900/40 border border-white/5 py-3 px-5 rounded-xl">
                <BarChart className="w-5 h-5 text-red-500" />
                <div>
                  <span className="block text-[10px] text-zinc-500 uppercase font-bold">Livello</span>
                  <span className="font-bold text-sm">{program.level}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-zinc-900/40 border border-white/5 py-3 px-5 rounded-xl">
                <Zap className="w-5 h-5 text-red-500" />
                <div>
                  <span className="block text-[10px] text-zinc-500 uppercase font-bold">Intensità</span>
                  <span className="font-bold text-sm">{program.intensity}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              {isFree ? (
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex flex-col mb-4 sm:mb-0 mr-auto">
                    <span className="text-3xl font-black text-white tracking-tighter">Gratuito</span>
                    <span className="text-xs text-green-500 font-bold uppercase tracking-widest mt-1">Accesso Immediato</span>
                  </div>
                  <button
                    onClick={handleUnlockFree}
                    className="w-full sm:w-auto bg-white text-black hover:bg-red-600 hover:text-white font-black py-4 px-10 rounded-2xl flex items-center justify-center gap-3 transition-all duration-500 text-sm uppercase tracking-widest shadow-xl shadow-white/5 group"
                  >
                    INIZIA ORA
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex flex-col mb-4 sm:mb-0 mr-auto">
                    <span className="text-4xl font-black text-white tracking-tighter flex items-baseline gap-1">
                      <span className="text-2xl text-zinc-500">€</span>{program.price}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Accesso illimitato a vita</span>
                  </div>

                  <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
                    {isInCart ? (
                      <button
                        onClick={() => {
                          removeFromCart(program.id.toString());
                          addNotification('Programma rimosso', 'error');
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all text-xs uppercase tracking-widest"
                      >
                        NEL CARRELLO
                        <Check className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          addToCart({
                            id: program.id.toString(),
                            title: program.title,
                            price: program.price,
                            image: program.image,
                            level: program.level
                          });
                          addNotification('Aggiunto al carrello!', 'success');
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-2 transition-all text-sm uppercase tracking-widest shadow-xl shadow-red-900/20"
                      >
                        AGGIUNGI
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    )}
                    <Link
                      to={`/program/${program.id}/content`}
                      className="bg-zinc-800 hover:bg-zinc-700 text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all text-xs uppercase tracking-widest"
                    >
                      ACCEDI
                      <Play className="w-4 h-4" fill="currentColor" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-6 relative order-1 lg:order-2"
          >
            <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] lg:aspect-square shadow-2xl border border-white/10 group">
              <Image
                src={program.image}
                alt={program.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />


            </div>

            {/* Decorative Glow */}
            <div className="absolute -inset-4 bg-red-500/20 blur-3xl -z-10 rounded-full opacity-50" />
          </motion.div>
        </div>

        {/* CONTENT TABS / INFO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-20">
          <div className="lg:col-span-2 space-y-16">



            {/* Curriculum Summary */}
            <section>
              <h3 className="text-2xl font-black mb-6 uppercase tracking-tight flex items-center gap-3">
                <Target className="text-red-500 w-6 h-6" />
                Struttura del Percorso
              </h3>
              <p className="text-zinc-400 mb-8 font-medium">
                Un&apos;overview delle fasi di allenamento che affronterai. Il programma è diviso in mesocicli studiati per garantire il massimo adattamento fisiologico senza stalli o infortuni.
              </p>

              <div className="relative border-l-2 border-white/10 ml-3 md:ml-4 space-y-10 pb-4">
                <div className="relative pl-8 md:pl-10">
                  <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-zinc-950 border-2 border-red-500 ring-4 ring-red-500/20" />
                  <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">Fase 1: Condizionamento & Adattamento</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Le prime settimane sono focalizzate sulla costruzione della capacità di lavoro (work capacity) e sul rinforzo dei tessuti connettivi. Imparerai i pattern motori base e preparerai tendini e legamenti alle intensità future.
                  </p>
                </div>

                <div className="relative pl-8 md:pl-10">
                  <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-zinc-950 border-2 border-zinc-600" />
                  <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">Fase 2: Intensificazione del Volume</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Aumento progressivo delle serie e delle ripetizioni. Il corpo viene sottoposto a uno stress metabolico mirato per stimolare l&apos;ipertrofia e consolidare la tecnica sotto fatica.
                  </p>
                </div>

                <div className="relative pl-8 md:pl-10">
                  <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-zinc-950 border-2 border-zinc-600" />
                  <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">Fase 3: Picco di Forza & Mastery</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Abbassamento del volume e innalzamento drastico dell&apos;intensità. L&apos;obiettivo è reclutare il massimo numero di unità motorie per trasformare il lavoro accumulato in vera forza espressa (skills).
                  </p>
                </div>
              </div>
            </section>

            {/* Target Audience */}
            <section>
              <h3 className="text-2xl font-black mb-6 uppercase tracking-tight flex items-center gap-3">
                <UserCheck className="text-red-500 w-6 h-6" />
                Per chi è pensato?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TARGET_AUDIENCE.map((text, i) => (
                  <div key={i} className="bg-zinc-900/30 border border-white/5 p-6 rounded-2xl flex items-start gap-4">
                    <div className="bg-red-500/10 p-2 rounded-lg shrink-0 mt-1">
                      <Check className="w-4 h-4 text-red-500" />
                    </div>
                    <p className="text-zinc-300 font-medium text-sm leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQs */}
            <section>
              <h3 className="text-2xl font-black mb-6 uppercase tracking-tight flex items-center gap-3">
                <HelpCircle className="text-red-500 w-6 h-6" />
                Domande Frequenti
              </h3>
              <div className="space-y-4">
                {FAQ_ITEMS.map((faq, index) => (
                  <div key={index} className="bg-zinc-900/20 border border-white/5 p-6 rounded-2xl">
                    <h4 className="text-lg font-bold text-white mb-3">{faq.question}</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Sidebar: Features & Guarantee */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-zinc-900/40 border border-white/10 rounded-[2rem] p-8 sticky top-28">
              <h3 className="text-xl font-black mb-6 uppercase tracking-tight">Cosa è incluso</h3>
              <ul className="space-y-5">
                {program.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    </div>
                    <span className="text-zinc-300 text-sm font-medium leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <hr className="border-white/10 my-8" />

              <div className="flex items-center gap-4">
                <ShieldCheck className="w-10 h-10 text-zinc-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-white text-sm">Qualità Garantita</h4>
                  <p className="text-xs text-zinc-500 mt-1">Sviluppato da atleti d&apos;élite. Risultati tangibili con la massima sicurezza articolare.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgramDetails;
