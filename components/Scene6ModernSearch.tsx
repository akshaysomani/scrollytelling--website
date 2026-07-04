"use client";

import React from "react";
import { useScrollProgress } from "@/lib/ScrollContext";
import { Server, Zap } from "lucide-react";

export default function Scene6ModernSearch() {
  const { progress } = useScrollProgress();

  // Active range: 0.625 to 0.75
  const start = 0.625;
  const end = 0.75;

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

  // Odometers counting up
  const dataProcessed = Math.floor(1542000 + localProgress * 6435000); // Terabytes
  const signalsLogged = Math.floor(12900 + localProgress * 87400);

  // Observatory locations on the stylized SVG map
  const locations = [
    { name: "ATA (Allen Telescope Array) - CA, USA", x: 120, y: 100 },
    { name: "Green Bank Observatory - WV, USA", x: 160, y: 105 },
    { name: "Arecibo Legacy - Puerto Rico", x: 190, y: 135 },
    { name: "MeerKAT Array - South Africa", x: 340, y: 215 },
    { name: "FAST Telescope - China", x: 440, y: 125 },
    { name: "Parkes Observatory - Australia", x: 500, y: 235 },
  ];

  return (
    <div
      className="fixed inset-0 flex flex-col justify-between px-6 py-20 md:p-24 pointer-events-none select-none z-10"
      style={{ opacity }}
    >
      {/* Top Title Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 w-full">
        <div>
          <span className="font-sans text-xs tracking-widest text-celestial-blue uppercase font-bold">
            05 / THE GLOBAL LISTENING GRID
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-white tracking-wide mt-1">
            Modern Search
          </h2>
        </div>
        
        {/* Modern Stats */}
        <div className="flex space-x-6">
          <div className="glass-panel px-4 py-2 rounded text-left border border-white/5">
            <div className="flex items-center space-x-1 font-sans text-[10px] tracking-widest text-neutral-500 uppercase">
              <Server className="w-3 h-3 text-celestial-blue mr-1" />
              DATA PROCESSED
            </div>
            <div className="font-mono text-base text-white font-bold">{dataProcessed.toLocaleString()} TB</div>
          </div>
          <div className="glass-panel px-4 py-2 rounded text-left border border-white/5">
            <div className="flex items-center space-x-1 font-sans text-[10px] tracking-widest text-neutral-500 uppercase">
              <Zap className="w-3 h-3 text-celestial-blue mr-1" />
              SIGNALS LOGGED
            </div>
            <div className="font-mono text-base text-celestial-blue font-bold">{signalsLogged.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Center Section: World map SVG with pulsing beacons */}
      <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between w-full h-[55%] gap-8 my-auto">
        
        {/* Left Side: Modern SETI Info */}
        <div className="glass-panel p-6 md:p-8 rounded-xl border border-white/5 max-w-md w-full pointer-events-auto backdrop-blur-md">
          <p className="font-serif text-lg text-white mb-4 italic">
            Expanding the Grid
          </p>
          <p className="font-sans text-sm text-neutral-300 leading-relaxed">
            In the decades following Ehman's discovery, SETI programs expanded globally. 
            We transitioned from single-frequency listeners to massive, computer-orchestrated telescope arrays.
            <br /><br />
            Today, systems like the Allen Telescope Array, South Africa's MeerKAT, and China's massive FAST scan billions of radio channels simultaneously, utilizing AI to filter cosmic noise in real-time.
          </p>
        </div>

        {/* Right Side: Beacons Map SVG */}
        <div className="relative flex items-center justify-center w-full max-w-xl aspect-[2/1] lg:mr-10">
          
          <svg className="w-full h-full text-neutral-800" viewBox="0 0 600 300">
            {/* Extremely stylized vector continent guide lines */}
            {/* North America */}
            <path d="M 80 60 L 190 60 L 220 120 L 180 160 L 150 140 Z" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            {/* South America */}
            <path d="M 180 165 L 240 210 L 210 270 L 190 230 Z" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            {/* Africa */}
            <path d="M 290 140 L 350 140 L 360 210 L 330 250 L 290 190 Z" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            {/* Eurasia / China */}
            <path d="M 270 60 L 450 60 L 490 140 L 370 140 L 320 100 Z" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            {/* Australia */}
            <path d="M 460 200 L 520 200 L 530 250 L 470 250 Z" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

            {/* Connecting network lines */}
            <g opacity={localProgress * 0.5}>
              <line x1={locations[0].x} y1={locations[0].y} x2={locations[1].x} y2={locations[1].y} stroke="#7a00ff" strokeWidth="0.8" strokeDasharray="3,3" />
              <line x1={locations[1].x} y1={locations[1].y} x2={locations[2].x} y2={locations[2].y} stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="3,3" />
              <line x1={locations[2].x} y1={locations[2].y} x2={locations[3].x} y2={locations[3].y} stroke="#7a00ff" strokeWidth="0.8" strokeDasharray="3,3" />
              <line x1={locations[3].x} y1={locations[3].y} x2={locations[4].x} y2={locations[4].y} stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="3,3" />
              <line x1={locations[4].x} y1={locations[4].y} x2={locations[5].x} y2={locations[5].y} stroke="#7a00ff" strokeWidth="0.8" strokeDasharray="3,3" />
            </g>

            {/* Beacons */}
            {locations.map((loc, idx) => {
              const appearanceTime = idx * 0.15;
              const isVisible = localProgress >= appearanceTime;
              const beaconOpacity = isVisible ? 1 : 0;
              
              return (
                <g key={loc.name} opacity={beaconOpacity}>
                  {/* Pulse ring */}
                  <circle
                    cx={loc.x}
                    cy={loc.y}
                    r={7}
                    fill="none"
                    stroke="#00f0ff"
                    strokeWidth="1"
                    className="pulse-ring-element"
                  />
                  {/* Core */}
                  <circle
                    cx={loc.x}
                    cy={loc.y}
                    r={2.5}
                    fill="#00f0ff"
                  />
                </g>
              );
            })}
          </svg>

        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full flex justify-between items-center text-xs font-mono text-neutral-500">
        <div>STATUS: ACTIVE MONITORING</div>
        <div>COORDINATED SURVEY GRID</div>
      </div>
    </div>
  );
}
