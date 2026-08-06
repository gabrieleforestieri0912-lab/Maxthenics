"use client";

import { Link } from "react-router-dom";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { ArrowRight, Clock, Star, Users, Zap } from "lucide-react";
import Image from "next/image";

const ProgramShowcase = () => {
  const showcasePrograms = [
    {
      id: 201,
      title: "Front Lever Mastery",
      level: "Intermedio",
      duration: "12 Settimane",
      image: "/Img/front-lever.jpg",
      description: "Il percorso completo per dominare la Front Lever, dalla retrazione scapolare alla full extension.",
      students: 340,
      rating: 4.9,
      price: 129,
    },
    {
      id: 301,
      title: "Planche Zero Gravity",
      level: "Avanzato",
      duration: "16 Settimane",
      image: "/Img/one-arm-front-lever.jpg",
      description: "Dalla tuck planche alla full planche: periodizzazione ipertrofica per la massima spinta.",
      students: 280,
      rating: 4.8,
      price: 149,
    },
    {
      id: 101,
      title: "Metabolic Flow",
      level: "Principiante",
      duration: "4 Settimane",
      image: "/Img/programs.jpg",
      description: "Protocollo d'ingresso per costruire le basi biomeccaniche e attivare il potenziale motorio.",
      students: 510,
      rating: 4.9,
      price: 0,
    },
  ];

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container-max relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 lg:mb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
              <Zap size={12} fill="currentColor" /> Percorsi Certificati
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic mb-6">
              I NOSTRI <span className="text-red-500">PROGRAMMI</span>
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed">
              Non allenarti a caso. Scegli i protocolli ultra-specializzati sviluppati dai migliori atleti. Ogni scheda è testata sul campo per garantirti risultati estremi, senza stalli.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {showcasePrograms.map((program, index) => {
            const mouseX = useMotionValue(0);
            const mouseY = useMotionValue(0);

            function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
              const { left, top } = currentTarget.getBoundingClientRect();
              mouseX.set(clientX - left);
              mouseY.set(clientY - top);
            }

            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                onMouseMove={handleMouseMove}
                className="group relative bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden transition-all duration-700 flex flex-col h-full cursor-pointer hover:border-red-500/30 hover:bg-zinc-900/60 shadow-2xl"
              >
                {/* Dynamic Spotlight Effect */}
                <motion.div
                  className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 z-10"
                  style={{
                    background: useMotionTemplate`
                      radial-gradient(
                        400px circle at ${mouseX}px ${mouseY}px,
                        rgba(220,38,38,0.15),
                        transparent 80%
                      )
                    `,
                  }}
                />

                {program.price === 0 ? (
                  <div className="absolute top-6 right-6 z-30 bg-white/90 backdrop-blur-md text-black text-[10px] font-black px-4 py-2 rounded-xl shadow-2xl uppercase tracking-[0.2em]">
                    Gratuito
                  </div>
                ) : (
                  <div className="absolute top-6 right-6 z-30 bg-red-600/20 backdrop-blur-md text-red-400 text-[10px] font-black px-4 py-2 rounded-xl shadow-2xl uppercase tracking-[0.2em] border border-red-500/20">
                    Premium
                  </div>
                )}

                <Link to="/programs" className="flex flex-col h-full">
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={program.image}
                      alt={program.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent z-20" />

                    {/* Level Badge */}
                    <div className="absolute bottom-4 left-6 z-30">
                      <span className="px-3 py-1 bg-red-600/10 border border-red-500/20 rounded-lg text-red-500 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
                        {program.level}
                      </span>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-6 left-6 z-30 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                      <Star size={11} className="text-amber-400 fill-amber-400" />
                      <span className="text-[11px] font-bold text-white">{program.rating}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 grow flex flex-col relative z-20">
                    <h3 className="text-2xl font-black text-white mb-3 group-hover:text-red-500 transition-colors tracking-tighter uppercase italic">
                      {program.title}
                    </h3>
                    <p className="text-zinc-400 text-sm mb-8 font-medium leading-relaxed line-clamp-2">
                      {program.description}
                    </p>

                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Investimento</span>
                        <span className="text-3xl font-black text-white tracking-tighter italic">
                          {program.price === 0 ? 'FREE' : `€${program.price}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                          <Users size={12} className="text-red-500" />
                          {program.students}+
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                          <Clock size={12} className="text-red-500" />
                          {program.duration}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Prominent CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex justify-center relative z-20"
        >
          <div className="absolute inset-0 bg-red-600/20 blur-3xl rounded-full scale-[1.2]" />
          <Link
            to="/programs"
            className="relative group flex items-center gap-4 bg-white text-zinc-950 hover:bg-red-600 hover:text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 hover:scale-105 shadow-[0_15px_40px_rgba(255,255,255,0.1)] hover:shadow-[0_15px_40px_rgba(220,38,38,0.3)]"
          >
            Scopri tutti i programmi
            <div className="w-8 h-8 rounded-full bg-zinc-100 group-hover:bg-white/20 flex items-center justify-center transition-colors">
              <ArrowRight size={16} className="text-zinc-900 group-hover:text-white" />
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProgramShowcase;
