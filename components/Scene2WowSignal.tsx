"use client";

import React from "react";
import { useScrollProgress } from "@/lib/ScrollContext";

export default function Scene2WowSignal() {
  const { progress } = useScrollProgress();

  // Active range: 0.125 to 0.25
  const start = 0.125;
  const end = 0.25;

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

  // Path lengths for SVG animation
  const waveformLength = 1000;
  const circleLength = 400;
  const textLength = 300;

  // Animate offset: start at max length (hidden) and decrease to 0 (fully drawn)
  const waveformOffset = waveformLength - (localProgress * 0.9) * waveformLength;
  const circleOffset = circleLength - Math.max(0, (localProgress - 0.4) / 0.6) * circleLength;
  const textOffset = textLength - Math.max(0, (localProgress - 0.2) / 0.6) * textLength;

  return (
    <div
      className="fixed inset-0 flex flex-col justify-between px-6 py-20 md:p-24 pointer-events-none select-none z-10"
      style={{ opacity }}
    >
      {/* Top Section: Title & Metadata */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 w-full">
        <div>
          <span className="font-sans text-xs tracking-widest text-celestial-blue uppercase font-bold">
            01 / DETECTED SIGNAL
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-white tracking-wide mt-1">
            The Wow! Signal
          </h2>
        </div>
        <div className="glass-panel px-4 py-2 rounded font-mono text-xs text-neutral-400 border border-white/5">
          FREQ: 1420.4056 MHz (Hydrogen Line)
        </div>
      </div>

      {/* Middle Section: Waveform & Circle Annotation */}
      <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between w-full h-[55%] gap-8 my-auto">
        
        {/* Left Side: Historical Info Panel */}
        <div className="glass-panel p-6 md:p-8 rounded-xl border border-white/5 max-w-md w-full pointer-events-auto backdrop-blur-md">
          <p className="font-serif text-lg text-white mb-4 italic">
            "Wow!"
          </p>
          <p className="font-sans text-sm text-neutral-300 leading-relaxed space-y-3">
            On August 15, 1977, astronomer Jerry R. Ehman scanned the constellation Sagittarius. 
            Among the computer printouts of the Big Ear radio telescope, he found a sequence of characters 
            representing a surge of signal intensity so anomalous that he circled it in red ink.
            <br /><br />
            It lasted exactly 72 seconds—the maximum duration Big Ear could observe a single point in the sky.
          </p>
        </div>

        {/* Right Side: Visual Data Plot & Highlight */}
        <div className="relative flex flex-col items-center justify-center w-full max-w-xl aspect-video lg:mr-10">
          
          {/* Waveform Drawing Overlay */}
          <svg className="absolute inset-0 w-full h-full text-celestial-blue opacity-40" viewBox="0 0 600 300">
            {/* Base noise line */}
            <path
              d="M 10 150 Q 50 145 100 155 T 200 150 T 300 135 T 400 160 T 500 150 T 590 150"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeOpacity="0.3"
            />
            {/* The actual drawn waveform based on progress */}
            <path
              d="M 10 150 Q 50 145 100 155 T 200 150 Q 250 80 300 30 Q 350 220 400 160 T 500 150 T 590 150"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="2.5"
              strokeDasharray={waveformLength}
              strokeDashoffset={waveformOffset}
              className="text-glow-blue"
            />
          </svg>

          {/* Glowing printout snippet with circled "6EQUJ5" */}
          <div className="relative flex flex-col items-center justify-center bg-black/60 border border-neutral-800 rounded-lg p-8 pointer-events-auto backdrop-blur-md">
            <span className="font-sans text-xs tracking-widest text-neutral-500 uppercase mb-4">
              Telescope Feed Printout
            </span>
            
            <div className="flex space-x-6 font-mono text-base md:text-xl text-neutral-600 tracking-wider">
              <span>10 12 11 09</span>
              
              {/* The circled sequence */}
              <span className="relative text-white font-bold tracking-widest px-2 select-all">
                6 E Q U J 5
                
                {/* Red pen circle drawing on scroll */}
                <svg className="absolute -inset-x-3 -inset-y-2 w-[120%] h-[140%] text-red-500 pointer-events-none" viewBox="0 0 100 50">
                  <path
                    d="M 10,25 C 10,12 35,5 65,8 C 90,10 95,25 90,38 C 85,45 50,48 20,44 C 10,42 8,30 15,20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={circleLength}
                    strokeDashoffset={circleOffset}
                  />
                </svg>
              </span>
              
              <span>12 08 09 11</span>
            </div>
            
            <div className="mt-6 flex space-x-12 text-xs font-mono text-neutral-500">
              <div>AZ: 19h 22m</div>
              <div>DEC: -27° 03'</div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Section: Scroll Progress Bar Indicator */}
      <div className="w-full flex justify-between items-center text-xs font-mono text-neutral-500">
        <div>BIG EAR OBSERVATORY</div>
        <div className="flex items-center space-x-2">
          <span>PROGRESS</span>
          <div className="w-24 h-[1px] bg-neutral-800">
            <div 
              className="h-full bg-celestial-blue transition-all duration-75"
              style={{ width: `${localProgress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
