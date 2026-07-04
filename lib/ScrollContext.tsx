"use client";

import React, { createContext, useContext, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollContextType {
  progress: number;            // 0 to 1 React state for 2D UI re-renders
  progressRef: React.RefObject<number | null>; // Ref for 3D useFrame loops (prevents re-renders)
  activeScene: number;         // 0 to 7 representing the current scene
  reducedMotion: boolean;      // Fallback for user motion preference
  registerSection: (index: number, element: HTMLDivElement | null) => void;
}

const ScrollContext = createContext<ScrollContextType>({
  progress: 0,
  progressRef: { current: 0 } as React.RefObject<number | null>,
  activeScene: 0,
  reducedMotion: false,
  registerSection: () => {},
});

export const useScrollProgress = () => useContext(ScrollContext);

export const ScrollProgressProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [progress, setProgress] = useState(0);
  const [activeScene, setActiveScene] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const progressRef = useRef<number>(0);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  const registerSection = (index: number, element: HTMLDivElement | null) => {
    sectionsRef.current[index] = element;
  };

  useGSAP(() => {
    // 1. Accessibility: prefers-reduced-motion check
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    // 2. Global Scroll Setup
    // Track the absolute scroll progress of the entire window scrollbar
    const mainTrigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        progressRef.current = p;
        setProgress(p);

        // Map 0-1 progress to 8 scenes (indices 0 to 7)
        const currentScene = Math.min(Math.floor(p * 8), 7);
        setActiveScene(currentScene);
      },
    });

    // Force ScrollTrigger refresh after rendering
    ScrollTrigger.refresh();

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
      mainTrigger.kill();
    };
  }, []);

  return (
    <ScrollContext.Provider
      value={{
        progress,
        progressRef,
        activeScene,
        reducedMotion,
        registerSection,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
};
