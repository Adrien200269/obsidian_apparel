"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Compass } from "lucide-react";

interface LuxuryLoaderProps {
  fullScreen?: boolean;
  label?: string;
  sublabel?: string;
  className?: string;
}

export const LuxuryLoader: React.FC<LuxuryLoaderProps> = ({
  fullScreen = false,
  label = "RETRIEVING ARCHIVAL SILHOUETTES...",
  sublabel = "KATHMANDU ATELIER // 2026",
  className,
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center select-none overflow-hidden",
        fullScreen
          ? "fixed inset-0 z-50 min-h-screen w-screen bg-luga-bg dark:bg-luga-darkBg text-luga-ink dark:text-luga-darkInk"
          : "w-full py-16 sm:py-24 bg-luga-bg/80 dark:bg-luga-darkBg/80 text-luga-ink dark:text-luga-darkInk",
        className
      )}
      role="status"
      aria-label="Loading archival silhouettes"
    >
      {/* Background Architectural Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] dark:opacity-[0.09]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top Laser Progress Line (for full-screen loader) */}
      {fullScreen && (
        <div className="absolute top-0 inset-x-0 h-[2px] bg-luga-border/40 dark:border-luga-darkBorder/40 overflow-hidden">
          <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-luga-crimson dark:via-luga-gold to-transparent animate-laser-sweep" />
        </div>
      )}

      {/* Architectural Corner Framing Marks (when fullScreen) */}
      {fullScreen && (
        <>
          <div className="pointer-events-none absolute top-4 left-4 sm:top-8 sm:left-8 w-4 h-4 border-t-2 border-l-2 border-luga-crimson/50 dark:border-luga-gold/50" />
          <div className="pointer-events-none absolute top-4 right-4 sm:top-8 sm:right-8 w-4 h-4 border-t-2 border-r-2 border-luga-crimson/50 dark:border-luga-gold/50" />
          <div className="pointer-events-none absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-4 h-4 border-b-2 border-l-2 border-luga-crimson/50 dark:border-luga-gold/50" />
          <div className="pointer-events-none absolute bottom-4 right-4 sm:bottom-8 sm:right-8 w-4 h-4 border-b-2 border-r-2 border-luga-crimson/50 dark:border-luga-gold/50" />
        </>
      )}

      {/* Centered Editorial Reticle & Typography */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md">
        {/* Dual-Ring Rotating Newari Compass Reticle */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-6 flex items-center justify-center">
          {/* Outer Dashed Rotating Ring */}
          <div className="absolute inset-0 rounded-full border border-dashed border-luga-muted/40 dark:border-luga-darkMuted/40 animate-spin-slow" />

          {/* Middle Precision Tick Ring */}
          <div className="absolute inset-2 rounded-full border border-luga-crimson/20 dark:border-luga-gold/25 animate-spin-reverse-slow">
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-luga-crimson dark:bg-luga-gold rounded-full" />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-luga-crimson dark:bg-luga-gold rounded-full" />
          </div>

          {/* Inner Glowing Crosshair */}
          <div className="absolute w-8 h-[1px] bg-luga-muted/40 dark:bg-luga-darkMuted/40" />
          <div className="absolute h-8 w-[1px] bg-luga-muted/40 dark:bg-luga-darkMuted/40" />

          {/* Central Compass Needle */}
          <div className="relative z-10 flex items-center justify-center animate-pulse-gold">
            <Compass className="w-8 h-8 sm:w-9 sm:h-9 text-luga-crimson dark:text-luga-gold stroke-[1.25]" />
          </div>
        </div>

        {/* Brand Monogram */}
        <div className="space-y-1.5 mb-5">
          <span className="font-editorial text-xl sm:text-3xl tracking-[0.25em] uppercase font-light text-luga-ink dark:text-luga-darkInk block">
            OBSIDIAN APPAREL
          </span>
          <span className="font-mono text-[8px] sm:text-[9.5px] tracking-[0.22em] uppercase text-luga-muted dark:text-luga-darkMuted block font-light">
            {sublabel}
          </span>
        </div>

        {/* Dynamic Architectural Progress Indicator */}
        <div className="w-48 sm:w-56 space-y-2">
          {/* Subtle Progress Track */}
          <div className="w-full h-[1px] bg-luga-border dark:bg-luga-darkBorder relative overflow-hidden">
            <div className="w-1/2 h-full bg-luga-crimson dark:bg-luga-gold animate-laser-sweep" />
          </div>

          {/* Micro Status Label */}
          <div className="flex items-center justify-between font-mono text-[8.5px] sm:text-[9.5px] tracking-wider text-luga-muted dark:text-luga-darkMuted uppercase">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-luga-crimson dark:bg-luga-gold animate-ping inline-block" />
              <span>{label}</span>
            </span>
            <span className="text-luga-ink/60 dark:text-luga-darkInk/60">27.71° N</span>
          </div>
        </div>
      </div>

      {/* Bottom Technical Spec Footer (when fullScreen) */}
      {fullScreen && (
        <div className="absolute bottom-6 inset-x-0 z-10 flex flex-col sm:flex-row items-center justify-between px-6 sm:px-12 text-[9px] font-mono tracking-mega text-luga-muted/70 dark:text-luga-darkMuted/70 uppercase gap-2 sm:gap-0">
          <span>HIMALAYAN YAK WOOL & HANDLOOM DHAKA</span>
          <span className="text-luga-crimson dark:text-luga-gold">SYS // ONLINE</span>
          <span>420–580 GSM ARTISANAL FORM</span>
        </div>
      )}
    </div>
  );
};
