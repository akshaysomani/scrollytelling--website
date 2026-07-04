"use client";

import React from "react";
import { useScrollProgress } from "@/lib/ScrollContext";
import { Globe, Compass, RefreshCw } from "lucide-react";

export default function Scene4Exoplanets() {
  const { progress } = useScrollProgress();

  // Active range: 0.375 to 0.50
  const start = 0.375;
  const end = 0.50;

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

  // Active sub-phases
  const activePlanet = 
    progress >= 0.375 && progress < 0.42 ? 0 :
    progress >= 0.42 && progress < 0.46 ? 1 :
    progress >= 0.46 && progress <= 0.50 ? 2 : -1;

  // Odometer calculations
  const totalStarsSurveyed = Math.floor(120500 + localProgress * 879400);
  const habitableCandidates = Math.floor(820 + localProgress * 4428);

  return (
    <div
      className="fixed inset-0 flex flex-col justify-between px-6 py-20 md:p-24 pointer-events-none select-none z-10"
      style={{ opacity }}
    >
      {/* Top Title Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 w-full">
        <div>
          <span className="font-sans text-xs tracking-widest text-celestial-blue uppercase font-bold">
            03 / HABITABLE ZONES
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-white tracking-wide mt-1">
            Where Could They Be?
          </h2>
        </div>
        
        {/* Odometers */}
        <div className="flex space-x-6">
          <div className="glass-panel px-4 py-2 rounded text-left border border-white/5">
            <div className="font-sans text-[10px] tracking-widest text-neutral-500 uppercase">STARS ANALYZED</div>
            <div className="font-mono text-base text-white font-bold">{totalStarsSurveyed.toLocaleString()}</div>
          </div>
          <div className="glass-panel px-4 py-2 rounded text-left border border-white/5">
            <div className="font-sans text-[10px] tracking-widest text-neutral-500 uppercase">HABITABLE SPHERES</div>
            <div className="font-mono text-base text-celestial-blue font-bold">{habitableCandidates.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Center Section: Glassmorphic cards floating out based on active exoplanet */}
      <div className="relative w-full h-[60%] flex items-center justify-center lg:justify-start my-auto">
        
        {/* CARD 1: Kepler-452b (Active from 0.375 to 0.42) */}
        {activePlanet === 0 && (
          <div className="glass-panel max-w-md w-full p-6 md:p-8 rounded-xl border border-celestial-blue/30 backdrop-blur-md pointer-events-auto transform translate-x-0 md:translate-x-12 transition-all duration-500 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="w-6 h-6 text-celestial-blue" />
              <h3 className="font-serif text-2xl text-white tracking-wide">Kepler-452b</h3>
            </div>
            
            <p className="font-sans text-sm text-neutral-300 leading-relaxed mb-6">
              Often dubbed "Earth's Older Cousin," Kepler-452b is a super-Earth planet orbiting inside the habitable zone of a G2-type star similar to our Sun. 
              It is 60% larger than Earth, suggesting a rocky composition.
            </p>

            <div className="grid grid-cols-2 gap-4 font-mono text-xs text-neutral-400">
              <div className="border-l border-celestial-blue/30 pl-3">
                <span className="block text-[10px] text-neutral-500 uppercase">DISTANCE</span>
                <span className="text-white font-semibold text-sm">1,402 Light Years</span>
              </div>
              <div className="border-l border-celestial-blue/30 pl-3">
                <span className="block text-[10px] text-neutral-500 uppercase">EARTH SIMILARITY</span>
                <span className="text-celestial-blue font-semibold text-sm">98% Index</span>
              </div>
              <div className="border-l border-celestial-blue/30 pl-3">
                <span className="block text-[10px] text-neutral-500 uppercase">ORBIT PERIOD</span>
                <span className="text-white font-semibold text-sm">385 Earth Days</span>
              </div>
              <div className="border-l border-celestial-blue/30 pl-3">
                <span className="block text-[10px] text-neutral-500 uppercase">MASS</span>
                <span className="text-white font-semibold text-sm">~5x Earth Mass</span>
              </div>
            </div>
          </div>
        )}

        {/* CARD 2: TRAPPIST-1e (Active from 0.42 to 0.46) */}
        {activePlanet === 1 && (
          <div className="glass-panel max-w-md w-full p-6 md:p-8 rounded-xl border border-nebula-purple/30 backdrop-blur-md pointer-events-auto mx-auto lg:ml-auto lg:mr-20 transition-all duration-500 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex items-center space-x-3 mb-4">
              <Compass className="w-6 h-6 text-nebula-purple" />
              <h3 className="font-serif text-2xl text-white tracking-wide">TRAPPIST-1e</h3>
            </div>
            
            <p className="font-sans text-sm text-neutral-300 leading-relaxed mb-6">
              A nearly Earth-sized planet orbiting the ultra-cool red dwarf star TRAPPIST-1. It is the most habitable-zone planet in the system and holds potential for liquid surface water.
            </p>

            <div className="grid grid-cols-2 gap-4 font-mono text-xs text-neutral-400">
              <div className="border-l border-nebula-purple/30 pl-3">
                <span className="block text-[10px] text-neutral-500 uppercase">DISTANCE</span>
                <span className="text-white font-semibold text-sm">40 Light Years</span>
              </div>
              <div className="border-l border-nebula-purple/30 pl-3">
                <span className="block text-[10px] text-neutral-500 uppercase">EARTH SIMILARITY</span>
                <span className="text-nebula-purple font-semibold text-sm">95% Index</span>
              </div>
              <div className="border-l border-nebula-purple/30 pl-3">
                <span className="block text-[10px] text-neutral-500 uppercase">ORBIT PERIOD</span>
                <span className="text-white font-semibold text-sm">6.1 Earth Days</span>
              </div>
              <div className="border-l border-nebula-purple/30 pl-3">
                <span className="block text-[10px] text-neutral-500 uppercase">STAR TYPE</span>
                <span className="text-white font-semibold text-sm">M-Type Red Dwarf</span>
              </div>
            </div>
          </div>
        )}

        {/* CARD 3: Proxima Centauri b (Active from 0.46 to 0.50) */}
        {activePlanet === 2 && (
          <div className="glass-panel max-w-md w-full p-6 md:p-8 rounded-xl border border-voyager-amber/30 backdrop-blur-md pointer-events-auto transform translate-y-0 lg:translate-y-8 lg:translate-x-32 transition-all duration-500 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex items-center space-x-3 mb-4">
              <RefreshCw className="w-6 h-6 text-voyager-amber" />
              <h3 className="font-serif text-2xl text-white tracking-wide">Proxima Centauri b</h3>
            </div>
            
            <p className="font-sans text-sm text-neutral-300 leading-relaxed mb-6">
              Our closest known exoplanet neighbor. Located in the habitable zone of Proxima Centauri, this rocky planet represents our nearest opportunity to seek biosignatures directly.
            </p>

            <div className="grid grid-cols-2 gap-4 font-mono text-xs text-neutral-400">
              <div className="border-l border-voyager-amber/30 pl-3">
                <span className="block text-[10px] text-neutral-500 uppercase">DISTANCE</span>
                <span className="text-white font-semibold text-sm">4.24 Light Years</span>
              </div>
              <div className="border-l border-voyager-amber/30 pl-3">
                <span className="block text-[10px] text-neutral-500 uppercase">EARTH SIMILARITY</span>
                <span className="text-voyager-amber font-semibold text-sm">82% Index</span>
              </div>
              <div className="border-l border-voyager-amber/30 pl-3">
                <span className="block text-[10px] text-neutral-500 uppercase">ORBIT PERIOD</span>
                <span className="text-white font-semibold text-sm">11.2 Earth Days</span>
              </div>
              <div className="border-l border-voyager-amber/30 pl-3">
                <span className="block text-[10px] text-neutral-500 uppercase">ORBITAL TYPE</span>
                <span className="text-white font-semibold text-sm">Tidally Locked</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Section */}
      <div className="w-full flex justify-between items-center text-xs font-mono text-neutral-500">
        <div>HIGHLIGHTING: {activePlanet === 0 ? "KEPLER-452B" : activePlanet === 1 ? "TRAPPIST-1E" : activePlanet === 2 ? "PROXIMA CENTAURI B" : "SEARCHING..."}</div>
        <div>CANDIDATES CATALOGUED</div>
      </div>
    </div>
  );
}
