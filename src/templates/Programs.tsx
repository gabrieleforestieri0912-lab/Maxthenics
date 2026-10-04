
'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Check, Zap, Flame, Trophy, Target } from 'lucide-react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { programData, ProgramDataItem, localizeProgram } from '../data/programs';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import ShareButton from '../components/ShareButton';
import SEO from "../components/SEO";
import Image from 'next/image';

interface SectionHeaderProps {
  title: string;
  icon: React.ElementType;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon: Icon }) => (
  <div className="flex flex-col mb-12">
    <div className="flex items-center gap-6 mb-6">
      <div className="p-4 bg-zinc-900 border border-white/10 rounded-2xl">
        <Icon className="text-red-500" size={28} />
      </div>
      <div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-none">{title}</h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
          <span className="text-[12px] font-bold text-zinc-500 uppercase tracking-widest">Mastery Path</span>
        </div>
      </div>
    </div>
    <div className="relative">
      <div className="h-px w-full bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="h-full bg-linear-to-r from-red-600 via-orange-500 to-transparent rounded-full"
        />
      </div>
    </div>
  </div>
);

interface ProgramCardProps {
  program: ProgramDataItem;
  isFree: boolean;
  onToggle: (program: ProgramDataItem) => void;
  isInCart: boolean;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, isFree, onToggle, isInCart }) => {
  const navigate = useNavigate();
  const { locale, t } = useLanguage();
  const display = localizeProgram(program, locale);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onClick={() => navigate(`/program/${program.id}`)}
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

      {isFree ? (
        <div className="absolute top-6 right-6 z-30 bg-white/90 backdrop-blur-md text-black text-[10px] font-black px-4 py-2 rounded-xl shadow-2xl uppercase tracking-[0.2em]">
          {t('Gratuito', 'Free')}
        </div>
      ) : (
        <div className="absolute top-6 right-6 z-30 bg-red-600/20 backdrop-blur-md text-red-400 text-[10px] font-black px-4 py-2 rounded-xl shadow-2xl uppercase tracking-[0.2em] border border-red-500/20">
          Premium
        </div>
      )}

      {/* Share link (stops card navigation) */}
      <div
        className="absolute top-6 left-6 z-30 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <ShareButton
          compact
          url={typeof window !== 'undefined' ? `${window.location.origin}/program/${program.id}` : undefined}
          title={display.localizedTitle}
          text={display.localizedDescription}
        />
      </div>

      {/* Image Container with Parallax-like effect on hover */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={program.image}
          alt={display.localizedTitle}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent z-20" />
        
        {/* Level Badge Overlay */}
        <div className="absolute bottom-4 left-6 z-30">
          <span className="px-3 py-1 bg-red-600/10 border border-red-500/20 rounded-lg text-red-500 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
            {display.localizedLevel}
          </span>
        </div>
      </div>

      <div className="p-6 grow flex flex-col relative z-20">
        <h3 className="text-xl font-black text-white mb-3 group-hover:text-red-500 transition-colors tracking-tighter uppercase italic">
          {display.localizedTitle}
        </h3>
        <p className="text-zinc-400 text-sm mb-8 font-medium leading-relaxed line-clamp-2">
          {display.localizedDescription}
        </p>

        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">{t('Investimento', 'Investment')}</span>
            <span className="text-3xl font-black text-white tracking-tighter italic">
              {program.price === 0 ? 'FREE' : `€${program.price}`}
            </span>
          </div>

          {program.price === 0 ? (
            <motion.button
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e: { stopPropagation: () => void; }) => {
                e.stopPropagation();
                navigate(`/program/${program.id}`);
              }}
              className="flex items-center gap-3 px-6 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all duration-500 shadow-xl shadow-black/50"
            >
              {t('Scopri', 'Explore')} <Zap size={14} fill="currentColor" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e: { stopPropagation: () => void; }) => {
                e.stopPropagation();
                onToggle(program);
              }}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isInCart
                  ? 'bg-green-600 text-white shadow-[0_0_30px_rgba(22,163,74,0.4)]'
                  : 'bg-white text-black hover:bg-red-600 hover:text-white shadow-xl shadow-black/50'
                }`}
            >
              {isInCart ? (
                <Check size={24} strokeWidth={3} />
              ) : (
                <ShoppingCart size={20} strokeWidth={3} />
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

function Programs() {
  const { addToCart, removeFromCart, cartItems } = useCart();
  const { addNotification } = useAuth();
  const { t } = useLanguage();

  const handleAddToCart = (program: ProgramDataItem) => {
    const isInCart = cartItems.some(item => item.id === program.id.toString());
    if (isInCart) {
      removeFromCart(program.id.toString());
      addNotification(t('Programma rimosso dal carrello', 'Program removed from cart'), 'error');
    } else {
      addToCart({
        id: program.id.toString(),
        title: program.title,
        price: program.price,
        image: program.image,
        stripePriceId: program.stripePriceId
      });
      addNotification(t('Programma aggiunto al carrello!', 'Program added to cart!'), 'success');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 lg:px-6 bg-black">
      <SEO
        title={t('Protocolli di Allenamento', 'Training Protocols')}
        description={t(
          "Scopri i nostri protocolli di allenamento Calisthenics: Base, Front Lever, Planche. Scegli il tuo percorso e inizia a trasformare il tuo corpo.",
          "Explore our Calisthenics training protocols: Foundation, Front Lever, Planche. Choose your path and start transforming your body."
        )}
      />
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <span className="text-red-600 font-black tracking-[0.4em] uppercase text-[10px] block">{t('Programmi di Allenamento', 'Training Programs')}</span>
            <LanguageToggle />
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.85] tracking-tighter mb-8 px-4">
            {t('SCEGLI IL', 'CHOOSE YOUR')}
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-700 italic pr-6 pb-2 inline-block">{t('TUO PERCORSO', 'PATH')}</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-3xl font-medium leading-relaxed">
            {t(
              "Dal principiante all'elite, ogni programma è progettato con metodologie biomeccaniche avanzate per trasformare il tuo corpo attraverso la forza a corpo libero.",
              "From beginner to elite, every program is built on advanced biomechanical methods to transform your body through bodyweight strength."
            )}
          </p>
        </motion.div>

        {/* Section: Workout */}
        <section className="mt-32 mb-40">
          <SectionHeader title={t('Workout Base', 'Foundation Training')} icon={Zap} />
          <p className="-mt-8 mb-10 text-zinc-500 text-sm font-medium leading-relaxed max-w-2xl">
            {t(
              'Protocolli gratuiti per costruire le fondamenta: attivazione neurale, stabilità del core e biomeccanica dei movimenti base.',
              'Free protocols to build the foundations: neural activation, core stability and basic movement biomechanics.'
            )}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {programData.workout.map((p) => (
              <ProgramCard key={p.id} program={p} isFree={p.price === 0} isInCart={cartItems.some(i => i.id === p.id.toString())} onToggle={handleAddToCart} />
            ))}
          </div>
        </section>

        {/* Section: Front Lever */}
        <section className="mb-40">
          <SectionHeader title="Front Lever" icon={Flame} />
          <p className="-mt-8 mb-10 text-zinc-500 text-sm font-medium leading-relaxed max-w-2xl">
            {t(
              'Dalla retrazione scapolare alla full front lever: un percorso progressivo per dominare la forza di trazione.',
              'From scapular retraction to the full front lever: a progressive path to master pulling strength.'
            )}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {programData.frontLever.map((p) => (
              <ProgramCard key={p.id} program={p} isFree={p.price === 0} isInCart={cartItems.some(i => i.id === p.id.toString())} onToggle={handleAddToCart} />
            ))}
          </div>
        </section>

        {/* Section: Planche */}
        <section className="mb-40">
          <SectionHeader title="Planche" icon={Trophy} />
          <p className="-mt-8 mb-10 text-zinc-500 text-sm font-medium leading-relaxed max-w-2xl">
            {t(
              'Dalla protrazione alla full planche: periodizzazione ipertrofica e condizionamento tendineo per la spinta assoluta.',
              'From protraction to the full planche: hypertrophic periodization and tendon conditioning for absolute pushing strength.'
            )}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {programData.planche.map((p) => (
              <ProgramCard key={p.id} program={p} isFree={p.price === 0} isInCart={cartItems.some(i => i.id === p.id.toString())} onToggle={handleAddToCart} />
            ))}
          </div>
        </section>

        {/* Section: Advanced Skills */}
        <section>
          <SectionHeader title={t('Skill Avanzate', 'Advanced Skills')} icon={Target} />
          <p className="-mt-8 mb-10 text-zinc-500 text-sm font-medium leading-relaxed max-w-2xl">
            {t(
              'Handstand, back lever, human flag, dragon flag e prehab: skill complesse per chi vuole spingersi oltre i limiti.',
              'Handstand, back lever, human flag, dragon flag and prehab: complex skills for those who want to push beyond limits.'
            )}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {programData.skills?.map((p) => (
              <ProgramCard key={p.id} program={p} isFree={p.price === 0} isInCart={cartItems.some(i => i.id === p.id.toString())} onToggle={handleAddToCart} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Programs;
