import React from "react";
import { motion } from "framer-motion";

interface SectionHeadingProps {
  /** Monospace step index, e.g. "01" */
  index?: string;
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Optional right-aligned column, e.g. a counter or meta note */
  aside?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  id?: string;
}

export default function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  aside,
  align = "left",
  className = "",
  id,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      id={id}
      className={`flex flex-col gap-3 scroll-mt-24 ${centered ? "items-center text-center" : ""} ${className}`}
    >
      {(eyebrow || index) && (
        <div className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
          {index && <span className="meta-mono">{index}</span>}
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        </div>
      )}

      <h2 className="page-title">{title}</h2>

      {description && (
        <p className={`body-copy max-w-2xl ${centered ? "mx-auto" : ""}`}>{description}</p>
      )}

      {aside && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="meta-mono pt-1"
        >
          {aside}
        </motion.div>
      )}
    </div>
  );
}