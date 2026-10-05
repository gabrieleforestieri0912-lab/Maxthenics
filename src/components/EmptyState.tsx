import React from "react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  children?: React.ReactNode;
  compact?: boolean;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  compact = false,
}: EmptyStateProps) {
  return (
    <div className="card flex flex-col items-center text-center">
      <div
        className={`flex items-center justify-center rounded-xl border border-white/10 bg-zinc-950 text-zinc-500 shrink-0 ${
          compact ? "w-11 h-11 mb-4" : "w-14 h-14 mb-6"
        }`}
      >
        <Icon size={compact ? 18 : 24} aria-hidden />
      </div>

      <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">{title}</h2>

      {description && <p className="body-copy text-sm mt-2 max-w-sm">{description}</p>}

      {children && <div className="mt-6 w-full max-w-xs">{children}</div>}
    </div>
  );
}