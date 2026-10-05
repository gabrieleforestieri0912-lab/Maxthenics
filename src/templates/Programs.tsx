"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import Image from "next/image";
import { ShoppingCart, Check, Zap, Flame, Trophy, Target, type LucideIcon } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { localizeProgram, programData, type ProgramDataItem } from "../data/programs";
import LanguageToggle from "../components/LanguageToggle";
import PageHeader from "../components/PageHeader";
import SectionHeading from "../components/SectionHeading";
import ShareButton from "../components/ShareButton";
import SEO from "../components/SEO";

interface ProgramGroup {
  key: keyof typeof programData;
  title: { it: string; en: string };
  eyebrow: string;
  icon: LucideIcon;
  description: { it: string; en: string };
}

const PROGRAM_GROUPS: ProgramGroup[] = [
  {
    key: "workout",
    title: { it: "Workout Base", en: "Foundation Training" },
    eyebrow: "01 — Fundamentals",
    icon: Zap,
    description: {
      it: "Protocolli gratuiti per costruire le fondamenta: attivazione neurale, stabilità del core e biomeccanica dei movimenti base.",
      en: "Free protocols to build the foundations: neural activation, core stability and basic movement biomechanics.",
    },
  },
  {
    key: "frontLever",
    title: { it: "Front Lever", en: "Front Lever" },
    eyebrow: "02 — Pull",
    icon: Flame,
    description: {
      it: "Dalla retrazione scapolare alla full front lever: un percorso progressivo per dominare la forza di trazione.",
      en: "From scapular retraction to the full front lever: a progressive path to master pulling strength.",
    },
  },
  {
    key: "planche",
    title: { it: "Planche", en: "Planche" },
    eyebrow: "03 — Push",
    icon: Trophy,
    description: {
      it: "Dalla protrazione alla full planche: periodizzazione ipertrofica e condizionamento tendineo per la spinta assoluta.",
      en: "From protraction to the full planche: hypertrophic periodization and tendon conditioning for absolute pushing strength.",
    },
  },
  {
    key: "skills",
    title: { it: "Skill Avanzate", en: "Advanced Skills" },
    eyebrow: "04 — Mastery",
    icon: Target,
    description: {
      it: "Handstand, back lever, human flag, dragon flag e prehab: skill complesse per chi vuole spingersi oltre i limiti.",
      en: "Handstand, back lever, human flag, dragon flag and prehab: complex skills for those who want to push beyond limits.",
    },
  },
];

const ProgramCard: React.FC<{
  program: ProgramDataItem;
  onToggle: (program: ProgramDataItem) => void;
  isInCart: boolean;
}> = ({ program, onToggle, isInCart }) => {
  const navigate = useNavigate();
  const { locale, t } = useLanguage();
  const display = localizeProgram(program, locale);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const isFree = program.price === 0;

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/30 cursor-pointer card-hover"
    >
      <motion.div
        aria-hidden
        className="card-lift"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              420px circle at ${mouseX}px ${mouseY}px,
              rgba(220,38,38,0.16),
              transparent 70%
            )
          `,
        }}
      />

      {isFree ? (
        <span className="eyebrow-pill absolute top-4 right-4 z-30 bg-white/90 text-black border-white/0">
          {t("Gratuito", "Free")}
        </span>
      ) : (
        <span className="eyebrow-pill absolute top-4 right-4 z-30">Premium</span>
      )}

      <div
        className="absolute top-4 left-4 z-30 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <ShareButton
          compact
          url={
            typeof window !== "undefined"
              ? `${window.location.origin}/program/${program.id}`
              : undefined
          }
          title={display.localizedTitle}
          text={display.localizedDescription}
        />
      </div>

      <div
        className="relative h-44 overflow-hidden"
        onClick={() => navigate(`/program/${program.id}`)}
      >
        <Image
          src={program.image}
          alt={display.localizedTitle}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent z-20" />
        <span className="eyebrow-pill absolute bottom-3 left-4 z-30">
          {display.localizedLevel}
        </span>
      </div>

      <div className="relative z-20 flex flex-col grow p-5">
        <h3
          className="text-base font-bold tracking-tight text-white group-hover:text-red-500 transition-colors cursor-pointer"
          onClick={() => navigate(`/program/${program.id}`)}
        >
          {display.localizedTitle}
        </h3>

        <p className="prose-block text-sm mt-2 mb-6 line-clamp-2">{display.localizedDescription}</p>

        <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="meta-mono">{t("Investimento", "Investment")}</span>
            <span className="text-2xl font-bold text-white tracking-tight">
              {program.price === 0 ? "FREE" : `€${program.price}`}
            </span>
          </div>

          {isFree ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/program/${program.id}`);
              }}
              className="btn-secondary-sm"
            >
              {t("Scopri", "Explore")}
              <Zap size={14} aria-hidden />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle(program);
              }}
              aria-pressed={isInCart}
              aria-label={
                isInCart
                  ? t(`Rimuovi ${display.localizedTitle} dal carrello`, `Remove ${display.localizedTitle} from cart`)
                  : t(`Aggiungi ${display.localizedTitle} al carrello`, `Add ${display.localizedTitle} to cart`)
              }
              className={`btn-base w-11 h-11 rounded-xl text-sm ${
                isInCart
                  ? "bg-emerald-600 text-white"
                  : "btn-secondary text-white"
              }`}
            >
              {isInCart ? (
                <Check size={18} strokeWidth={3} aria-hidden />
              ) : (
                <ShoppingCart size={18} strokeWidth={2} aria-hidden />
              )}
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
};

function Programs() {
  const { addToCart, removeFromCart, cartItems } = useCart();
  const { addNotification } = useAuth();
  const { t } = useLanguage();

  const handleAddToCart = (program: ProgramDataItem) => {
    const isInCart = cartItems.some((item) => item.id === program.id.toString());

    if (isInCart) {
      removeFromCart(program.id.toString());
      addNotification(
        t("Programma rimosso dal carrello", "Program removed from cart"),
        "error"
      );
    } else {
      addToCart({
        id: program.id.toString(),
        title: program.title,
        price: program.price,
        image: program.image,
        stripePriceId: program.stripePriceId,
      });
      addNotification(
        t("Programma aggiunto al carrello!", "Program added to cart!"),
        "success"
      );
    }
  };

  return (
    <div className="page-shell px-6 lg:px-8">
      <SEO
        title={t("Protocolli di Allenamento", "Training Protocols")}
        description={t(
          "Scopri i nostri protocolli di allenamento Calisthenics: Base, Front Lever, Planche. Scegli il tuo percorso e inizia a trasformare il tuo corpo.",
          "Explore our Calisthenics training protocols: Foundation, Front Lever, Planche. Choose your path and start transforming your body."
        )}
      />

      <div className="container-max">
        <PageHeader
          align="center"
          eyebrow={t("Programmi di Allenamento", "Training Programs")}
          title={t("Scegli il tuo percorso.", "Choose your path.")}
          description={t(
            "Dal principiante all'elite, ogni programma è progettato con metodologie biomeccaniche avanzate per trasformare il tuo corpo attraverso la forza a corpo libero.",
            "From beginner to elite, every program is built on advanced biomechanical methods to transform your body through bodyweight strength."
          )}
        >
          <LanguageToggle />
        </PageHeader>

        <div className="mt-20 space-y-24">
          {PROGRAM_GROUPS.map((group) => {
            const items = programData[group.key] ?? [];
            const Icon = group.icon;

            return (
              <section key={group.key}>
                <SectionHeading
                  align="center"
                  eyebrow={group.eyebrow}
                  title={t(group.title.it, group.title.en)}
                  description={t(group.description.it, group.description.en)}
                  aside={
                    <span className="inline-flex items-center gap-2">
                      <Icon size={14} className="text-red-600" aria-hidden />
                      {items.length} {t("protocolli", "protocols")}
                    </span>
                  }
                  className="mb-10"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.map((program) => (
                    <ProgramCard
                      key={program.id}
                      program={program}
                      isInCart={cartItems.some((i) => i.id === program.id.toString())}
                      onToggle={handleAddToCart}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Programs;