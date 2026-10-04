"use client";

import { motion } from "framer-motion";

const SKILLS = [
  "PLANCHE", "FRONT LEVER", "HANDSTAND", "HUMAN FLAG", "MUSCLE UP", 
  "HEFESTO", "OAP", "BACK LEVER", "IRON CROSS", "VICTORIAN", "MALTAESE"
];

const SkillMarquee = () => {
  return (
    <div className="py-10 bg-zinc-950 overflow-hidden border-b border-white/5 relative">
      {/* Glow effects */}
      <div className="absolute top-0 left-0 w-40 h-full bg-linear-to-r from-zinc-950 to-transparent z-10" />
      <div className="absolute top-0 right-0 w-40 h-full bg-linear-to-l from-zinc-950 to-transparent z-10" />
      
      <motion.div 
        animate={{ x: [0, -1000] }}
        transition={{ 
          repeat: Infinity, 
          duration: 30, 
          ease: "linear" 
        }}
        className="flex whitespace-nowrap gap-12 items-center"
      >
        {[...SKILLS, ...SKILLS].map((skill, index) => (
          <span 
            key={index} 
            className="text-5xl md:text-8xl font-black text-transparent stroke-white/10 stroke-1 hover:text-white/5 transition-colors cursor-default tracking-tighter"
            style={{ WebkitTextStroke: "1px rgba(255,255,255,0.1)" }}
          >
            {skill}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default SkillMarquee;
