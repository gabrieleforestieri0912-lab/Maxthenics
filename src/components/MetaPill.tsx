import React from "react";
import type { LucideIcon } from "lucide-react";

interface MetaPillProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export default function MetaPill({ icon: Icon, label, value }: MetaPillProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-900/40 px-5 py-3">
      <Icon size={18} className="text-red-500 shrink-0" aria-hidden />
      <div className="min-w-0">
        <span className="block meta-mono">{label}</span>
        <span className="block text-sm font-bold text-white truncate">{value}</span>
      </div>
    </div>
  );
}