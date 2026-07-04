"use client";

import React from "react";
import { useScrollProgress } from "@/lib/ScrollContext";

export default function Scene7Answer() {
  const { progress } = useScrollProgress();

  // Active range: 0.75 to 0.875
  const start = 0.75;
  const end = 0.875;

  let opacity = 0;
  let localProgress = 0;

  if (progress > start - 0.03 && progress < end + 0.03) {
    if (progress < start) {
      opacity = (progress - (start - 0.03)) / 0.03;
    } else if (progress > end) {
      opacity = (end + 0.03 - progress) / 0.03;
    } else {
      opacity = 1;
    }
    localProgress = Math.min(Math.max((progress - start) / (end - start), 0), 1);
  }

  if (opacity <= 0) return null;

  // Narrative Timeline Steps:
  // 1. 0.0 - 0.35: A single incoming signal blip flashes on screen
  // 2. 0.35 - 0.45: Full screen cyan/white strobe flash
  // 3. 0.45 - 0.70: Complete empty darkness/visual silence
  // 4. 0.70 - 1.00: Text fades in: "We're still waiting."

  const isBlipVisible = localProgress >= 0 && localProgress < 0.35;
  
  // Strobe calculation
  let strobeOpacity = 0;
  if (localProgress >= 0.35 && localProgress < 0.45) {
    // Peak at 0.38, then fades down
    if (localProgress < 0.39) {
      strobeOpacity = (localProgress - 0.35) / 0.04;
    } else {
      strobeOpacity = 1 - (localProgress - 0.39) / 0.06;
    }
  }

  // Text fade-in calculation
  let textOpacity = 0;
  if (localProgress >= 0.65) {
    textOpacity = (localProgress - 0.65) / 0.25;
  }

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-10"
      style={{ opacity }}
    >
      {/* 1. Incoming Signal Blip */}
      {isBlipVisible && (
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-celestial-blue flex items-center justify-center blip-element">
            <div className="w-4 h-4 rounded-full bg-white text-glow-blue" />
          </div>
          <span className="font-mono text-sm tracking-[0.4em] text-celestial-blue text-glow-blue animate-pulse uppercase">
            INCOMING TRANSMISSION
          </span>
        </div>
      )}

      {/* 2. Full-Screen Flash Overlay */}
      {strobeOpacity > 0 && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-celestial-blue via-white to-celestial-blue z-50 mix-blend-screen"
          style={{ opacity: strobeOpacity }}
        />
      )}

      {/* 3. Empty Silent Gap (rendered implicitly by empty space) */}

      {/* 4. We're still waiting */}
      <div 
        className="flex flex-col items-center justify-center space-y-6 text-center max-w-xl px-6 transition-all duration-300"
        style={{ opacity: textOpacity }}
      >
        <p className="font-serif text-3xl md:text-5xl text-white tracking-wide leading-relaxed">
          We're still waiting.
        </p>
        <p className="font-sans text-xs md:text-sm tracking-[0.2em] text-neutral-500 uppercase leading-relaxed max-w-sm">
          No secondary pulse followed. The silence of the universe returned, as absolute as before.
        </p>
      </div>
    </div>
  );
}
