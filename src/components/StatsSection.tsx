"use client";

import { motion } from "framer-motion";

const STATS = [
  { label: "Atleti Attivi", value: "15K+", desc: "In tutto il mondo" },
  { label: "Skill Sbloccate", value: "85K", desc: "Performance monitorate" },
  { label: "Precisione AI", value: "99.8%", desc: "Analisi biomeccanica" },
  { label: "Training Hub", value: "24/7", desc: "Supporto costante" },
];

const StatsSection = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-black border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {STATS.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter group-hover:text-red-500 transition-colors duration-500">
                {stat.value}
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600 mb-2">
                {stat.label}
              </div>
              <div className="text-xs text-zinc-600 font-medium">
                {stat.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
