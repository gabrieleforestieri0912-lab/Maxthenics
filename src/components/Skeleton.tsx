"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "", variant = "rectangular" }) => {
  const baseClass = "animate-pulse bg-zinc-900";
  
  const variantClasses = {
    text: "h-4 w-full rounded",
    circular: "rounded-full",
    rectangular: "rounded-2xl"
  };

  return (
    <div className={`${baseClass} ${variantClasses[variant]} ${className}`} />
  );
};

export const HomeSkeleton = () => {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Navbar-ish space */}
        <div className="flex justify-between items-center mb-20">
          <Skeleton className="h-10 w-40" />
          <div className="flex gap-6">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col items-center gap-8 text-center">
          <Skeleton className="h-16 w-3/4 md:h-24" />
          <Skeleton className="h-16 w-2/3 md:h-20" />
          <Skeleton className="h-6 w-1/2" />
          <div className="flex gap-4 mt-8">
            <Skeleton className="h-14 w-40" />
            <Skeleton className="h-14 w-40" />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-8 border border-white/5 rounded-[2rem] bg-zinc-900/40">
              <Skeleton className="h-14 w-14 mb-8" />
              <Skeleton className="h-8 w-2/3 mb-4" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
