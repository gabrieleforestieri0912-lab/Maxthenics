import React from "react";
import { motion } from "framer-motion";

interface PageHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  align?: "left" | "center";
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  children,
  align = "left",
}: PageHeaderProps) {
  const centered = align === "center";

  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col gap-4 ${centered ? "items-center text-center" : ""}`}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}

      <h1 className="page-title max-w-4xl">{title}</h1>

      {description && (
        <p className={`body-copy max-w-2xl ${centered ? "mx-auto" : ""}`}>{description}</p>
      )}

      {children && (
        <div className={`flex flex-wrap items-center gap-3 pt-2 ${centered ? "justify-center" : ""}`}>
          {children}
        </div>
      )}
    </motion.header>
  );
}