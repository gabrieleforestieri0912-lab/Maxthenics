
'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Check, Zap, Flame, Trophy, Target, Package, BadgePercent } from 'lucide-react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { programData, programBundles, ProgramDataItem, ProgramBundle } from '../data/programs';
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

const allPrograms: ProgramDataItem[] = [
  ...programData.workout,
  ...programData.frontLever,
  ...programData.planche,
  ...programData.skills,
];

const BundleCard: React.FC<{
  bundle: ProgramBundle;
  isInCart: boolean;
  onToggle: (bundle: ProgramBundle) => void;
}> = ({ bundle, isInCart, onToggle }) => {
  const included = bundle.programIds
    .map((id) => allPrograms.find((p) => p.id === id)?.title)
    .filter(Boolean) as string[];
  const savings = Math.round((1 - bundle.price / bundle.originalPrice) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-gradient-to-br from-red-600/10 via-zinc-900/60 to-orange-600/10 backdrop-blur-xl border border-red-500/25 rounded-2xl overflow-hidden transition-all duration-700 flex flex-col h-full hover:border-orange-500/40 hover:shadow-[0_0_50px_rgba(249,115,22,0.15)] shadow-2xl"
    >
      <div className="absolute top-6 right-6 z-30 flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-black px-4 py-2 rounded-xl shadow-2xl uppercase tracking-[0.2em]">
        <BadgePercent size={12} />
        -{savings}%
      </div>

      <div className="relative h-56 overflow-hidden">
        <Image
          src={bundle.image}
          alt={bundle.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent z-20" />
        <div className="absolute bottom-4 left-6 z-30 flex items-center gap-2">
          <span className="p-2 bg-red-600/20 border border-red-500/30 rounded-lg backdrop-blur-md">
            <Package size={14} className="text-orange-400" />
          </span>
          <span className="px-3 py-1 bg-red-600/10 border border-red-500/20 rounded-lg text-red-500 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
            {bundle.level} · {bundle.programIds.length} programmi
          </span>
        </div>
      </div>

      <div className="p-8 grow flex flex-col relative z-20">
        <h3 className="text-2xl font-black text-white mb-3 group-hover:text-orange-400 transition-colors tracking-tighter uppercase italic">
          {bundle.title}
        </h3>
        <p className="text-zinc-400 text-sm mb-6 font-medium leading-relaxed line-clamp-2">
          {bundle.description}
        </p>

        <ul className="space-y-2 mb-8">
          {included.map((title) => (
            <li key={title} className="flex items-center gap-2 text-xs text-zinc-300 font-medium">
              <Check size={13} className="text-orange-400 shrink-0" strokeWidth={3} />
              {title}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Investimento</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white tracking-tighter italic">
                €{bundle.price}
              </span>
              <span className="text-sm font-bold text-zinc-600 line-through">
                €{bundle.originalPrice}
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggle(bundle)}
            className={`h-14 px-6 rounded-2xl flex items-center gap-2 transition-all duration-500 font-black text-[10px] uppercase tracking-widest ${isInCart
                ? 'bg-green-600 text-white shadow-[0_0_30px_rgba(22,163,74,0.4)]'
                : 'bg-gradient-to-r from-red-600 to-orange-500 text-white hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] shadow-xl shadow-red-900/30'
              }`}
          >
            {isInCart ? (
              <><Check size={18} strokeWidth={3} /> Nel carrello</>
            ) : (
              <><ShoppingCart size={18} strokeWidth={2.5} /> Aggiungi bundle</>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const ProgramCard: React.FC<ProgramCardProps> = ({ program, isFree, onToggle, isInCart }) => {
  const navigate = useNavigate();
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
          Gratuito
        </div>
      ) : (
        <div className="absolute top-6 right-6 z-30 bg-red-600/20 backdrop-blur-md text-red-400 text-[10px] font-black px-4 py-2 rounded-xl shadow-2xl uppercase tracking-[0.2em] border border-red-500/20">
          Premium
        </div>
      )}

      {/* Image Container with Parallax-like effect on hover */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={program.image}
          alt={program.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent z-20" />
        
        {/* Level Badge Overlay */}
        <div className="absolute bottom-4 left-6 z-30">
          <span className="px-3 py-1 bg-red-600/10 border border-red-500/20 rounded-lg text-red-500 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
            {program.level}
          </span>
        </div>
      </div>

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
              Scopri <Zap size={14} fill="currentColor" />
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

  const handleAddToCart = (program: ProgramDataItem) => {
    const isInCart = cartItems.some(item => item.id === program.id.toString());
    if (isInCart) {
      removeFromCart(program.id.toString());
      addNotification('Programma rimosso dal carrello', 'error');
    } else {
      addToCart({
        id: program.id.toString(),
        title: program.title,
        price: program.price,
        image: program.image,
        stripePriceId: program.stripePriceId
      });
      addNotification('Programma aggiunto al carrello!', 'success');
    }
  };

  const handleAddBundleToCart = (bundle: ProgramBundle) => {
    const bundleId = `bundle-${bundle.id}`;
    const isInCart = cartItems.some(item => item.id === bundleId);
    if (isInCart) {
      removeFromCart(bundleId);
      addNotification('Bundle rimosso dal carrello', 'error');
    } else {
      addToCart({
        id: bundleId,
        title: bundle.title,
        price: bundle.price,
        image: bundle.image,
        description: bundle.description,
      });
      addNotification('Bundle aggiunto al carrello!', 'success');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 lg:px-6 bg-black">
      <SEO
        title="Protocolli di Allenamento"
        description="Scopri i nostri protocolli di allenamento Calisthenics: Base, Front Lever, Planche. Scegli il tuo percorso e inizia a trasformare il tuo corpo."
      />
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <span className="text-red-600 font-black tracking-[0.4em] uppercase text-[10px] mb-4 block">Programmi di Allenamento</span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.85] tracking-tighter mb-8 px-4">
            SCEGLI IL <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-orange-500 italic pr-6 pb-2 inline-block">TUO PERCORSO</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-3xl font-medium leading-relaxed">
            Dal principiante all&apos;elite, ogni programma è progettato con metodologie biomeccaniche avanzate per trasformare il tuo corpo attraverso la forza a corpo libero.
          </p>
        </motion.div>

        {/* Section: Workout */}
        <section className="mt-32 mb-40">
          <SectionHeader title="Workout Base" icon={Zap} />
          <p className="-mt-8 mb-10 text-zinc-500 text-sm font-medium leading-relaxed max-w-2xl">
            Protocolli gratuiti per costruire le fondamenta: attivazione neurale, stabilità del core e biomeccanica dei movimenti base.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programData.workout.map((p) => (
              <ProgramCard key={p.id} program={p} isFree={p.price === 0} isInCart={cartItems.some(i => i.id === p.id.toString())} onToggle={handleAddToCart} />
            ))}
          </div>
        </section>

        {/* Section: Front Lever */}
        <section className="mb-40">
          <SectionHeader title="Front Lever" icon={Flame} />
          <p className="-mt-8 mb-10 text-zinc-500 text-sm font-medium leading-relaxed max-w-2xl">
            Dalla retrazione scapolare alla full front lever: un percorso progressivo per dominare la forza di trazione.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programData.frontLever.map((p) => (
              <ProgramCard key={p.id} program={p} isFree={p.price === 0} isInCart={cartItems.some(i => i.id === p.id.toString())} onToggle={handleAddToCart} />
            ))}
          </div>
        </section>

        {/* Section: Planche */}
        <section className="mb-40">
          <SectionHeader title="Planche" icon={Trophy} />
          <p className="-mt-8 mb-10 text-zinc-500 text-sm font-medium leading-relaxed max-w-2xl">
            Dalla protrazione alla full planche: periodizzazione ipertrofica e condizionamento tendineo per la spinta assoluta.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programData.planche.map((p) => (
              <ProgramCard key={p.id} program={p} isFree={p.price === 0} isInCart={cartItems.some(i => i.id === p.id.toString())} onToggle={handleAddToCart} />
            ))}
          </div>
        </section>

        {/* Section: Advanced Skills */}
        <section className="mb-40">
          <SectionHeader title="Skill Avanzate" icon={Target} />
          <p className="-mt-8 mb-10 text-zinc-500 text-sm font-medium leading-relaxed max-w-2xl">
            Handstand, back lever, human flag, dragon flag e prehab: skill complesse per chi vuole spingersi oltre i limiti.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programData.skills?.map((p) => (
              <ProgramCard key={p.id} program={p} isFree={p.price === 0} isInCart={cartItems.some(i => i.id === p.id.toString())} onToggle={handleAddToCart} />
            ))}
          </div>
        </section>

        {/* Section: Bundles */}
        <section>
          <SectionHeader title="Bundle Risparmio" icon={Package} />
          <p className="-mt-8 mb-10 text-zinc-500 text-sm font-medium leading-relaxed max-w-2xl">
            Percorsi completi a prezzo ridotto: più programmi in un unico acquisto, con sconti fino al 56% rispetto alla somma dei singoli.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programBundles.map((b) => (
              <BundleCard
                key={b.id}
                bundle={b}
                isInCart={cartItems.some(i => i.id === `bundle-${b.id}`)}
                onToggle={handleAddBundleToCart}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Programs;
