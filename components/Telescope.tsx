"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollProgress } from "@/lib/ScrollContext";

export default function Telescope() {
  const meshRef = useRef<THREE.Group>(null);
  const { progressRef } = useScrollProgress();

  useFrame((state, delta) => {
    const p = progressRef.current ?? 0;
    
    // Smooth visibility mapping for Scene 2 (0.125 - 0.25)
    // Starts appearing at p=0.08, fully visible 0.125 - 0.23, dissolves by 0.3
    let opacity = 0;
    let scale = 0;
    
    if (p > 0.05 && p < 0.32) {
      if (p < 0.125) {
        // Fade in
        const t = (p - 0.05) / 0.075;
        opacity = THREE.MathUtils.lerp(0, 1, t);
        scale = THREE.MathUtils.lerp(0.2, 1, t);
      } else if (p < 0.22) {
        // Fully visible
        opacity = 1;
        scale = 1;
      } else {
        // Fade out as camera pulls away to galaxy
        const t = (p - 0.22) / 0.1;
        opacity = THREE.MathUtils.lerp(1, 0, t);
        scale = THREE.MathUtils.lerp(1, 0.4, t);
      }
    }

    if (meshRef.current) {
      meshRef.current.scale.setScalar(scale);
      meshRef.current.position.set(0, -1, 0); // centered, slightly down
      
      // Animate rotation based on scroll progress + slow idle rotation
      meshRef.current.rotation.y = p * Math.PI * 2 + state.clock.getElapsedTime() * 0.15;
      
      // Rotate materials opacity
      meshRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.Material;
          mat.transparent = true;
          mat.opacity = opacity;
        }
      });
    }
  });

  return (
    <group ref={meshRef}>
      {/* Telescope Base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[2.5, 3, 0.5, 8]} />
        <meshBasicMaterial color="#00f0ff" wireframe />
      </mesh>

      {/* Main Mount Column */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 1.5, 6]} />
        <meshBasicMaterial color="#7a00ff" wireframe />
      </mesh>

      {/* Support Arm Assembly */}
      <group position={[0, 1.8, 0]}>
        {/* Horizontal Axis */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 2, 6]} />
          <meshBasicMaterial color="#7a00ff" wireframe />
        </mesh>

        {/* Dish Mount Arm */}
        <mesh position={[0, 0.5, 0.5]} rotation={[Math.PI / 6, 0, 0]}>
          <boxGeometry args={[0.5, 1.8, 0.5]} />
          <meshBasicMaterial color="#00f0ff" wireframe />
        </mesh>

        {/* The Radio Dish (Cone shaped to represent the dish curve) */}
        <group position={[0, 1.4, 1.2]} rotation={[Math.PI / 4, 0, 0]}>
          <mesh>
            <coneGeometry args={[4, 1.8, 16, 4, true]} />
            <meshBasicMaterial color="#00f0ff" wireframe side={THREE.DoubleSide} />
          </mesh>
          
          {/* Outer rim ring */}
          <mesh position={[0, -0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[4, 0.05, 8, 32]} />
            <meshBasicMaterial color="#7a00ff" wireframe />
          </mesh>

          {/* Feed Horn Supports */}
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 2.4, 4]} />
            <meshBasicMaterial color="#00f0ff" wireframe />
          </mesh>
          
          {/* Feed Receiver Receiver horn */}
          <mesh position={[0, 2.4, 0]}>
            <coneGeometry args={[0.4, 0.6, 8]} />
            <meshBasicMaterial color="#ffaa00" wireframe />
          </mesh>
        </group>
      </group>
    </group>
  );
}
