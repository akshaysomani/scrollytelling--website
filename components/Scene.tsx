"use client";

import React, { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollProgress } from "@/lib/ScrollContext";
import Starfield from "./Starfield";
import Telescope from "./Telescope";
import Galaxy from "./Galaxy";
import Exoplanets3D from "./Exoplanets3D";
import VoyagerRecord from "./VoyagerRecord";
import DishArray from "./DishArray";

function SceneCameraAndLights() {
  const { progressRef, reducedMotion } = useScrollProgress();
  const { camera } = useThree();

  // Keep track of current lookAt position to lerp smoothly
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  
  // Light refs for dynamic animations
  const pointLightRef = useRef<THREE.PointLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);

  useFrame((state, delta) => {
    const p = progressRef.current ?? 0;
    
    // Default targets
    const targetPos = new THREE.Vector3(0, 0, 12);
    const targetLook = new THREE.Vector3(0, 0, 0);
    
    let lightColor = new THREE.Color("#00f0ff"); // celestial blue
    let lightIntensity = 1.5;
    let ambientIntensity = 0.4;

    // Define camera paths & lighting per scene timeline
    if (p < 0.125) {
      // Scene 1: The Beginning
      const t = p / 0.125;
      targetPos.set(0, 0, 15);
      targetLook.set(0, 0, 0);
      
      lightColor.set("#00f0ff");
      lightIntensity = 0.5 + t * 1.0;
      ambientIntensity = 0.2 + t * 0.2;
    } 
    else if (p < 0.25) {
      // Scene 2: Wow! Signal
      const t = (p - 0.125) / 0.125;
      targetPos.set(0, 1.5, 11);
      targetLook.set(0, 0.8, 0);
      
      lightColor.set("#7a00ff"); // purple glow
      lightIntensity = 1.8;
      ambientIntensity = 0.4;
    } 
    else if (p < 0.375) {
      // Scene 3: Milky Way (Dolly far out)
      const t = (p - 0.25) / 0.125;
      targetPos.set(
        THREE.MathUtils.lerp(0, 0, t),
        THREE.MathUtils.lerp(1.5, 15, t),
        THREE.MathUtils.lerp(11, 28, t)
      );
      targetLook.set(0, 0, 0);
      
      lightColor.lerpColors(new THREE.Color("#7a00ff"), new THREE.Color("#00f0ff"), t);
      lightIntensity = 2.0;
      ambientIntensity = 0.5;
    } 
    else if (p < 0.50) {
      // Scene 4: Where Could They Be? (Orbiting in space)
      const t = (p - 0.375) / 0.125;
      // Camera orbits around the exoplanets slightly
      const angle = t * Math.PI * 0.3;
      targetPos.set(
        Math.sin(angle) * 12,
        4 - t * 3,
        Math.cos(angle) * 20
      );
      targetLook.set(0, -0.5, 0);
      
      lightColor.set("#7a00ff");
      lightIntensity = 1.5;
      ambientIntensity = 0.35;
    } 
    else if (p < 0.625) {
      // Scene 5: Voyager (Warm amber color shift)
      const t = (p - 0.50) / 0.125;
      targetPos.set(
        THREE.MathUtils.lerp(0, -2, t),
        THREE.MathUtils.lerp(1, 1.2, t),
        THREE.MathUtils.lerp(15, 6, t)
      );
      targetLook.set(
        THREE.MathUtils.lerp(0, 0.2, t),
        THREE.MathUtils.lerp(-0.5, 0.5, t),
        THREE.MathUtils.lerp(0, 0.5, t)
      );
      
      // Warm golden glow
      lightColor.lerpColors(new THREE.Color("#7a00ff"), new THREE.Color("#ffaa00"), t);
      lightIntensity = THREE.MathUtils.lerp(1.5, 3.5, t);
      ambientIntensity = THREE.MathUtils.lerp(0.35, 0.6, t);
    } 
    else if (p < 0.75) {
      // Scene 6: Modern Search (D dishes)
      const t = (p - 0.625) / 0.125;
      targetPos.set(
        THREE.MathUtils.lerp(-2, 0, t),
        THREE.MathUtils.lerp(1.2, 5, t),
        THREE.MathUtils.lerp(6, 16, t)
      );
      targetLook.set(
        THREE.MathUtils.lerp(0.2, 0, t),
        THREE.MathUtils.lerp(0.5, -0.8, t),
        THREE.MathUtils.lerp(0.5, 0, t)
      );
      
      // Cool blue observatory lighting
      lightColor.lerpColors(new THREE.Color("#ffaa00"), new THREE.Color("#00f0ff"), t);
      lightIntensity = THREE.MathUtils.lerp(3.5, 2.2, t);
      ambientIntensity = THREE.MathUtils.lerp(0.6, 0.4, t);
    } 
    else if (p < 0.875) {
      // Scene 7: What If They Answer? (Freeze & Pulse)
      const t = (p - 0.75) / 0.125;
      // Camera holds static immediately
      targetPos.set(0, 5, 16);
      targetLook.set(0, -0.8, 0);
      
      // Pulsing blue-white light
      const pulse = Math.sin(state.clock.getElapsedTime() * 12) * 0.4 + 0.6;
      lightColor.set("#ffffff");
      lightIntensity = pulse * 3.0 * (1 - t); // slowly fades down to zero
      ambientIntensity = 0.3 * (1 - t);
    } 
    else {
      // Scene 8: Final Scene (Fade everything to absolute black)
      const t = (p - 0.875) / 0.125;
      targetPos.set(0, 0, 22);
      targetLook.set(0, 0, 0);
      
      lightColor.set("#000000");
      lightIntensity = 0;
      ambientIntensity = 0;
    }

    // Apply smooth interpolation (lerping)
    const lerpSpeed = reducedMotion ? 1.0 : 1 - Math.exp(-3.5 * delta);
    camera.position.lerp(targetPos, lerpSpeed);
    
    currentLookAt.current.lerp(targetLook, lerpSpeed);
    camera.lookAt(currentLookAt.current);

    // Apply lighting animations
    if (pointLightRef.current) {
      pointLightRef.current.color.lerp(lightColor, lerpSpeed);
      pointLightRef.current.intensity = THREE.MathUtils.lerp(pointLightRef.current.intensity, lightIntensity, lerpSpeed);
    }
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = THREE.MathUtils.lerp(ambientLightRef.current.intensity, ambientIntensity, lerpSpeed);
    }
  });

  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={0.4} />
      <pointLight ref={pointLightRef} position={[5, 10, 5]} intensity={1.5} />
      <directionalLight position={[-10, 10, -5]} intensity={0.5} color="#7a00ff" />
    </>
  );
}

export default function Scene() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color("#000000"));
        }}
      >
        <SceneCameraAndLights />
        
        {/* Persistent components */}
        <Starfield />
        <Telescope />
        <Galaxy />
        <Exoplanets3D />
        <VoyagerRecord />
        <DishArray />
      </Canvas>
    </div>
  );
}
