"use client";

import React from "react";
import { useScrollProgress } from "@/lib/ScrollContext";
import { RotateCcw } from "lucide-react";

export default function Scene8Final() {
  const { progress } = useScrollProgress();

  // Active range: 0.875 to 1.0
  const start = 0.875;
  const end = 1.0;

  let opacity = 0;
  let localProgress = 0;

  if (progress > start - 0.03) {
    if (progress < start) {
      opacity = (progress - (start - 0.03)) / 0.03;
    } else {
      opacity = 1;
    }
    localProgress = Math.min(Math.max((progress - start) / (end - start), 0), 1);
  }

  if (opacity <= 0) return null;

  const handleReplay = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="fixed inset-0 flex flex-col justify-between items-center px-6 py-24 pointer-events-none select-none z-10 text-center"
      style={{ opacity }}
    >
      {/* Invisible spacer to balance layout */}
      <div className="h-6" />

      {/* Core Message Panel */}
      <div className="flex flex-col items-center justify-center space-y-8 max-w-2xl px-4 my-auto">
        <p className="font-serif text-3xl md:text-5xl lg:text-6xl text-white tracking-wide leading-relaxed">
          The universe is quiet.
        </p>
        <p className="font-serif text-2xl md:text-4xl text-celestial-blue/90 tracking-wide leading-relaxed font-light">
          That doesn't mean we're alone.
        </p>
        
        {/* Replay CTA */}
        <div className="pt-6 pointer-events-auto">
          <button
            onClick={handleReplay}
            className="glass-panel flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-sans font-semibold tracking-wider text-neutral-300 border border-white/5 hover:border-celestial-blue/30 hover:text-white transition-all cursor-pointer shadow-lg hover:shadow-celestial-blue/10 active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>REPLAY THE JOURNEY</span>
          </button>
        </div>
      </div>

      {/* Footer Credits */}
      <div className="flex flex-col items-center space-y-4 pointer-events-auto">
        <div className="flex space-x-6 text-neutral-600 text-xs font-mono">
          <span>THE LAST SIGNAL © 2026</span>
          <span className="text-neutral-700">|</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-celestial-blue transition-colors flex items-center"
          >
            <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg> SOURCE
          </a>
        </div>
      </div>
    </div>
  );
}
