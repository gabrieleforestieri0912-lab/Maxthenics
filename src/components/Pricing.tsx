/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { Check, Zap, Star, ShieldCheck, Dumbbell, Loader2 } from 'lucide-react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { subscriptionPlans, SubscriptionPlan } from '../config/plans';

// Mapping icon names to Lucide-react components
const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Zap,
  Star,
  ShieldCheck,
  Dumbbell,
};

function Pricing() {
  return (
    <div id="pricing" className="section-padding relative overflow-hidden bg-transparent scroll-mt-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20 relative z-10">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-red-500 font-bold tracking-[0.3em] uppercase text-xs mb-4 block"
        >
          Membership
        </motion.span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8 text-white tracking-tighter leading-none px-4">
          Domina la <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-orange-500">Gravità</span>
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 max-w-7xl mx-auto relative z-10">
        {subscriptionPlans.map((plan, index) => {
          const IconComponent = iconMap[plan.iconName];
          return (
            <PricingCard
              key={index}
              plan={plan}
              IconComponent={IconComponent}
              index={index}
            />
          );
        })}
      </div>
    </div>
  );
}

interface PricingCardProps {
  plan: SubscriptionPlan;
  IconComponent: any;
  index: number;
}

function PricingCard({ plan, IconComponent, index }: PricingCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [loading, setLoading] = useState(false);

  const handleSubscription = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      window.location.href = '/login';
      return;
    }

    if (!plan.price || plan.price === 0) {
      window.location.href = '/register';
      return;
    }

    setLoading(true);
    try {
      // Get user profile to get ID
      const profileRes = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const profile = await profileRes.json();
      const userId = profile.user?._id;

      if (!userId) {
        window.location.href = '/login';
        return;
      }

      // Membership plans are subscriptions
      const isSubscription = ['Free', 'Base', 'Pro', 'Elite'].includes(plan.name);
      const endpoint = isSubscription 
        ? '/api/stripe/create-subscription-session' 
        : '/api/stripe/create-checkout-session';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          priceId: plan.id, // Assuming plan.id is the Stripe Price ID or mapped
          tier: plan.name.toLowerCase(),
          cartItems: isSubscription ? undefined : [{
            id: plan.name.toLowerCase().replace(/\s+/g, '-'),
            title: `Maxthenics ${plan.name}`,
            description: 'Accesso ' + plan.name,
            price: plan.price,
            level: plan.name
          }]
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Errore durante il checkout: ' + (data.message || 'Problema sconosciuto'));
      }
    } catch (error) {
      console.error('Errore checkout:', error);
      alert('Si è verificato un errore.');
    } finally {
      setLoading(false);
    }
  };

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
      transition={{ delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      className={`group relative p-6 rounded-2xl border transition-all duration-500 flex flex-col h-full overflow-hidden ${plan.highlight
          ? 'bg-zinc-900/50 border-red-500/50 shadow-[0_0_40px_-15px_rgba(220,38,38,0.3)]'
          : 'bg-zinc-900/20 border-white/10 hover:border-white/10'
        }`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              ${plan.highlight ? 'rgba(220,38,38,0.15)' : 'rgba(255,255,255,0.05)'},
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <div className={`p-2.5 rounded-xl ${plan.highlight ? 'bg-red-500/10' : 'bg-white/5'}`}>
            {IconComponent && <IconComponent className={plan.highlight ? "text-red-500" : "text-zinc-500"} size={18} />}
          </div>
          {plan.highlight && (
            <span className="bg-red-600 text-white text-[10px] font-black px-3 py-0.5 rounded-full tracking-widest uppercase">
              Pro
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-zinc-400 mb-1.5 uppercase tracking-widest">{plan.name}</h3>
        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-4xl font-black text-white leading-none">€{plan.price}</span>
          <span className="text-zinc-600 text-xs font-bold uppercase tracking-tighter">{plan.period}</span>
        </div>

        <ul className="space-y-2 mb-6">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">
              <Check size={13} className="text-red-500 mr-2.5 shrink-0" strokeWidth={3} />
              {feature}
            </li>
          ))}
        </ul>

        <button
          onClick={handleSubscription}
          disabled={loading}
          className={`w-full block py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] text-center transition-all disabled:opacity-50 disabled:cursor-not-allowed ${plan.highlight
              ? 'bg-red-600 text-white shadow-xl shadow-red-900/20 hover:bg-red-500 hover:scale-[1.02]'
              : 'bg-white text-black hover:bg-zinc-200 active:scale-95'
            }`}
        >
          {loading ? <Loader2 className="w-4 h-4 mx-auto animate-spin" /> : plan.cta}
        </button>
      </div>
    </motion.div>
  );
}

export default Pricing;
