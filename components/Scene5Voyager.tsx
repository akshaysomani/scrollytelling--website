"use client";

import React from "react";
import { useScrollProgress } from "@/lib/ScrollContext";
import { Disc, Radio, MessageSquare } from "lucide-react";

export default function Scene5Voyager() {
  const { progress } = useScrollProgress();

  // Active range: 0.50 to 0.625
  const start = 0.50;
  const end = 0.625;

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

  return (
    <div
      className="fixed inset-0 flex flex-col justify-between px-6 py-20 md:p-24 pointer-events-none select-none z-10"
      style={{ opacity }}
    >
      {/* Top Title Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 w-full">
        <div>
          <span className="font-sans text-xs tracking-widest text-voyager-amber uppercase font-bold text-glow-amber">
            04 / OUTWARD MESSAGES
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-white tracking-wide mt-1">
            Humanity Sends Messages
          </h2>
        </div>
        <div className="glass-panel px-4 py-2 rounded font-mono text-xs text-voyager-amber border border-voyager-amber/20">
          PROBE: VOYAGER 1 & 2 (1977)
        </div>
      </div>

      {/* Middle Section: Glassmorphic panel detailing record contents */}
      <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between w-full h-[55%] gap-8 my-auto">
        
        {/* Left Side: Historical Info Panel */}
        <div className="glass-panel-amber p-6 md:p-8 rounded-xl max-w-md w-full pointer-events-auto backdrop-blur-md">
          <div className="flex items-center space-x-3 mb-4">
            <Disc className="w-6 h-6 text-voyager-amber" />
            <h3 className="font-serif text-xl text-white tracking-wide">The Golden Record</h3>
          </div>
          <p className="font-sans text-sm text-neutral-300 leading-relaxed space-y-3">
            Humanity didn't just listen. In 1977, we launched two twin spacecraft carrying a message to the stars: 
            a 12-inch gold-plated copper disc containing the sounds and images of life on Earth.
            <br /><br />
            Designed to last a billion years in the harsh vacuum of interstellar space, the records are time capsules, 
            sent in the hope that someone, somewhere, might one day intercept them.
          </p>
        </div>

        {/* Right Side: Quick specifications of the cargo */}
        <div className="glass-panel-amber p-6 md:p-8 rounded-xl max-w-sm w-full pointer-events-auto backdrop-blur-md lg:mr-10">
          <span className="font-mono text-xs text-voyager-amber uppercase font-semibold block mb-4">
            Message Spec Sheet
          </span>
          
          <div className="space-y-4 font-sans text-xs text-neutral-300">
            <div className="flex items-start space-x-3">
              <MessageSquare className="w-5 h-5 text-voyager-amber mt-0.5" />
              <div>
                <span className="block font-semibold text-white">55 Languages</span>
                <span className="text-neutral-400">Greetings from ancient Sumerian to modern dialects.</span>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Radio className="w-5 h-5 text-voyager-amber mt-0.5" />
              <div>
                <span className="block font-semibold text-white">Sounds of Earth</span>
                <span className="text-neutral-400">Wind, rain, bird songs, a mother's kiss, and pulsar clicks.</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Disc className="w-5 h-5 text-voyager-amber mt-0.5" />
              <div>
                <span className="block font-semibold text-white">Analog Diagrams</span>
                <span className="text-neutral-400">115 etched images depicting mathematics, chemistry, and human biology.</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="w-full flex justify-between items-center text-xs font-mono text-neutral-500">
        <div>LOCATION: INTERSTELLAR SPACE</div>
        <div>VELOCITY: ~38,000 MPH</div>
      </div>
    </div>
  );
}
