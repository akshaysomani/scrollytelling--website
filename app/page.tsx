"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ScrollProgressProvider } from "@/lib/ScrollContext";
import Scene1Beginning from "@/components/Scene1Beginning";
import Scene2WowSignal from "@/components/Scene2WowSignal";
import Scene3MilkyWay from "@/components/Scene3MilkyWay";
import Scene4Exoplanets from "@/components/Scene4Exoplanets";
import Scene5Voyager from "@/components/Scene5Voyager";
import Scene6ModernSearch from "@/components/Scene6ModernSearch";
import Scene7Answer from "@/components/Scene7Answer";
import Scene8Final from "@/components/Scene8Final";

// Dynamically import the 3D Canvas Scene component with SSR disabled
const Scene = dynamic(() => import("@/components/Scene"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black z-0" />,
});

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [loaderProgress, setLoaderProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    // Simulate loading/tuning feed connection
    const interval = setInterval(() => {
      setLoaderProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (loaderProgress >= 100) {
      // Give the browser a tick to paint the new 800vh document layout,
      // then refresh GSAP ScrollTrigger so it measures heights correctly.
      const timer = setTimeout(() => {
        import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
          ScrollTrigger.refresh();
        });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [loaderProgress]);

  if (!mounted || loaderProgress < 100) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-center z-50 select-none">
        <div className="space-y-6 max-w-md w-full px-6">
          <div className="relative w-12 h-12 border-2 border-celestial-blue/20 border-t-celestial-blue rounded-full animate-spin mx-auto" />
          <div className="space-y-2">
            <h2 className="font-serif text-lg text-white tracking-widest uppercase">
              TUNING RECEIVER
            </h2>
            <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest animate-pulse">
              ESTABLISHING LINK TO BIG EAR GRID...
            </p>
          </div>
          <div className="w-full bg-neutral-900 h-[1px]">
            <div 
              className="bg-celestial-blue h-full transition-all duration-150"
              style={{ width: `${Math.min(loaderProgress, 100)}%` }}
            />
          </div>
          <div className="font-mono text-[10px] text-neutral-600">
            FREQ: 1420.406 MHz | SIGNAL LOCK: {Math.min(loaderProgress, 100)}%
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScrollProgressProvider>
      <main className="relative w-full bg-black min-h-screen">
        {/* Background 3D Canvas Scene */}
        <Scene />

        {/* 2D Overlay Narratives */}
        <Scene1Beginning />
        <Scene2WowSignal />
        <Scene3MilkyWay />
        <Scene4Exoplanets />
        <Scene5Voyager />
        <Scene6ModernSearch />
        <Scene7Answer />
        <Scene8Final />

        {/* Native scroll trigger heights (8 scenes x 100vh = 800vh) */}
        <div id="scroll-container" className="relative w-full h-[800vh] pointer-events-none z-0">
          <div className="h-screen w-full" />
          <div className="h-screen w-full" />
          <div className="h-screen w-full" />
          <div className="h-screen w-full" />
          <div className="h-screen w-full" />
          <div className="h-screen w-full" />
          <div className="h-screen w-full" />
          <div className="h-screen w-full" />
        </div>
      </main>
    </ScrollProgressProvider>
  );
}
