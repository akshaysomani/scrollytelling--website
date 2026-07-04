"use client";

import React from "react";
import { useScrollProgress } from "@/lib/ScrollContext";
import { ChevronDown } from "lucide-react";

export default function Scene1Beginning() {
  const { progress } = useScrollProgress();

  // Fade out as scroll progress increases
  // Fully visible at 0, starts fading at 0.06, completely gone by 0.12
  let opacity = 1;
  if (progress > 0.05) {
    opacity = Math.max(0, 1 - (progress - 0.05) / 0.07);
  }

  if (opacity <= 0) return null;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center text-center px-4 transition-opacity duration-150 pointer-events-none select-none z-10"
      style={{ opacity }}
    >
      <div className="flex flex-col items-center justify-center space-y-8 max-w-3xl">
        {/* Pulsing Radio Dot (SVG) */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Inner solid core */}
          <div className="absolute w-4 h-4 bg-celestial-blue rounded-full text-glow-blue z-10" />
          
          {/* Pulsing rings */}
          <div className="absolute w-12 h-12 border-2 border-celestial-blue/40 rounded-full pulse-ring-element" />
          <div className="absolute w-12 h-12 border border-celestial-blue/20 rounded-full pulse-ring-element" style={{ animationDelay: "1s" }} />
          <div className="absolute w-12 h-12 border border-nebula-purple/20 rounded-full pulse-ring-element" style={{ animationDelay: "2s" }} />
        </div>

        {/* Narrative Headline */}
        <div className="space-y-4">
          <h1 className="font-serif text-4xl md:text-6xl tracking-wider text-white leading-tight">
            THE LAST SIGNAL
          </h1>
          <p className="font-sans text-sm md:text-lg tracking-[0.2em] text-celestial-blue uppercase font-medium">
            A Journey Through the Quiet Cosmos
          </p>
        </div>

        <p className="font-sans text-base md:text-xl text-neutral-400 font-light max-w-xl leading-relaxed">
          In 1977, humanity heard a sound from the deep void... <br />
          and we are still listening.
        </p>
      </div>

      {/* Scroll indicator chevron (only visible at very beginning) */}
      {progress < 0.02 && (
        <div className="absolute bottom-10 flex flex-col items-center space-y-2 animate-bounce">
          <span className="font-sans text-xs tracking-widest text-neutral-500 uppercase">
            Scroll to begin
          </span>
          <ChevronDown className="w-5 h-5 text-neutral-500" />
        </div>
      )}
    </div>
  );
}
