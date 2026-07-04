"use client";

import React from "react";
import { useScrollProgress } from "@/lib/ScrollContext";

export default function Scene3MilkyWay() {
  const { progress } = useScrollProgress();

  // Active range: 0.25 to 0.375
  const start = 0.25;
  const end = 0.375;

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

  // Node coordinates for the constellation mapping
  const nodes = [
    { id: "A", x: 120, y: 150, name: "Chi Sagittarii" },
    { id: "B", x: 220, y: 80, name: "Tau Sagittarii" },
    { id: "C", x: 300, y: 190, name: "Sigma Sagittarii" },
    { id: "D", x: 420, y: 130, name: "Nunki" },
    { id: "E", x: 500, y: 220, name: "Ascella" },
  ];

  // We have 4 connection paths. We animate them sequentially based on localProgress.
  // Segment 1 (A->B): localProgress from 0.0 to 0.25
  // Segment 2 (B->C): localProgress from 0.25 to 0.50
  // Segment 3 (C->D): localProgress from 0.50 to 0.75
  // Segment 4 (D->E): localProgress from 0.75 to 1.0
  const getDashOffset = (segStart: number, segEnd: number, lineLength: number) => {
    if (localProgress <= segStart) return lineLength;
    if (localProgress >= segEnd) return 0;
    const t = (localProgress - segStart) / (segEnd - segStart);
    return lineLength - t * lineLength;
  };

  const lineLengths = {
    AB: 122, // sqrt((220-120)^2 + (80-150)^2) = sqrt(10000 + 4900) = ~122
    BC: 136, // sqrt((300-220)^2 + (190-80)^2) = sqrt(6400 + 12100) = ~136
    CD: 134, // sqrt((420-300)^2 + (130-190)^2) = sqrt(14400 + 3600) = ~134
    DE: 120, // sqrt((500-420)^2 + (220-130)^2) = sqrt(6400 + 8100) = ~120
  };

  return (
    <div
      className="fixed inset-0 flex flex-col justify-between px-6 py-20 md:p-24 pointer-events-none select-none z-10"
      style={{ opacity }}
    >
      {/* Top Title Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 w-full">
        <div>
          <span className="font-sans text-xs tracking-widest text-celestial-blue uppercase font-bold">
            02 / THE DIRECTION
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-white tracking-wide mt-1">
            Sagittarius & The Core
          </h2>
        </div>
        <div className="glass-panel px-4 py-2 rounded font-mono text-xs text-neutral-400 border border-white/5">
          TARGET RA: 19h 25m | DEC: -27° 15'
        </div>
      </div>

      {/* Middle Section: Constellation Mapping & Narrative */}
      <div className="flex flex-col lg:flex-row-reverse items-center justify-center lg:justify-between w-full h-[55%] gap-8 my-auto">
        
        {/* Left Side: Historical Info Panel */}
        <div className="glass-panel p-6 md:p-8 rounded-xl border border-white/5 max-w-md w-full pointer-events-auto backdrop-blur-md">
          <p className="font-serif text-lg text-white mb-4 italic">
            Looking into the Center
          </p>
          <p className="font-sans text-sm text-neutral-300 leading-relaxed">
            The Wow! Signal originated from the direction of the Sagittarius constellation, 
            only a few degrees away from the bright star group Chi Sagittarii.
            <br /><br />
            As the camera pulls back, the telescope's gaze aligns with the dense stellar clouds of the Milky Way galaxy. 
            A void of 100,000 light-years, holding over 100 billion stars, lies in the signal's path. 
            Which star system sent the signal? How far did it travel?
          </p>
        </div>

        {/* Right Side: Constellation Line Drawing SVG */}
        <div className="relative flex items-center justify-center w-full max-w-lg aspect-square">
          
          <svg className="w-full h-full text-celestial-blue/30" viewBox="0 0 600 300">
            {/* Constellation Connection Lines */}
            {/* Segment 1: A -> B */}
            <line
              x1={nodes[0].x} y1={nodes[0].y}
              x2={nodes[1].x} y2={nodes[1].y}
              stroke="#00f0ff"
              strokeWidth="1.5"
              strokeDasharray={lineLengths.AB}
              strokeDashoffset={getDashOffset(0, 0.25, lineLengths.AB)}
            />
            {/* Segment 2: B -> C */}
            <line
              x1={nodes[1].x} y1={nodes[1].y}
              x2={nodes[2].x} y2={nodes[2].y}
              stroke="#7a00ff"
              strokeWidth="1.5"
              strokeDasharray={lineLengths.BC}
              strokeDashoffset={getDashOffset(0.25, 0.50, lineLengths.BC)}
            />
            {/* Segment 3: C -> D */}
            <line
              x1={nodes[2].x} y1={nodes[2].y}
              x2={nodes[3].x} y2={nodes[3].y}
              stroke="#00f0ff"
              strokeWidth="1.5"
              strokeDasharray={lineLengths.CD}
              strokeDashoffset={getDashOffset(0.50, 0.75, lineLengths.CD)}
            />
            {/* Segment 4: D -> E */}
            <line
              x1={nodes[3].x} y1={nodes[3].y}
              x2={nodes[4].x} y2={nodes[4].y}
              stroke="#7a00ff"
              strokeWidth="1.5"
              strokeDasharray={lineLengths.DE}
              strokeDashoffset={getDashOffset(0.75, 1.0, lineLengths.DE)}
            />

            {/* Draw Star Nodes and Labels */}
            {nodes.map((node, index) => {
              // Node starts appearing after its segment is reached
              const appearanceThreshold = index * 0.25;
              const isVisible = localProgress >= appearanceThreshold;
              const scale = isVisible ? (1 + Math.sin(localProgress * Math.PI * 2) * 0.15) : 0;
              const opacityNode = isVisible ? Math.min(1, (localProgress - appearanceThreshold) / 0.1) : 0;

              return (
                <g key={node.id} className="transition-all duration-300" style={{ opacity: opacityNode }}>
                  {/* Outer glow ring */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={8}
                    fill="none"
                    stroke="#00f0ff"
                    strokeWidth="1"
                    className="animate-pulse"
                  />
                  {/* Solid core */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={3}
                    fill="#ffffff"
                  />
                  {/* Node label */}
                  <text
                    x={node.x + 10}
                    y={node.y + 4}
                    fill="#a3a3a3"
                    fontSize="9"
                    fontFamily="monospace"
                    className="select-none pointer-events-none"
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>

        </div>
      </div>

      {/* Bottom Section: Footer metadata */}
      <div className="w-full flex justify-between items-center text-xs font-mono text-neutral-500">
        <div>CONSTELLATION: SAGITTARIUS</div>
        <div className="flex items-center space-y-2 select-none">
          <span>COSMIC ZOOM: 100K LIGHT YEARS</span>
        </div>
      </div>
    </div>
  );
}
