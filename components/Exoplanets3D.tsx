"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollProgress } from "@/lib/ScrollContext";

interface PlanetProps {
  position: [number, number, number];
  color: string;
  glowColor: string;
  name: string;
  active: boolean;
  scale: number;
}

function Planet({ position, color, glowColor, active, scale }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotation
      meshRef.current.rotation.y += delta * 0.4;
      
      // Pulse scale if active
      const baseScale = active 
        ? scale * (1 + Math.sin(state.clock.getElapsedTime() * 4) * 0.1)
        : scale;
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, baseScale, 0.1));
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Target marker orbit ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[1.5, 0.02, 8, 48]} />
        <meshBasicMaterial 
          color={active ? glowColor : "#ffffff"} 
          transparent 
          opacity={active ? 0.6 : 0.15} 
        />
      </mesh>

      {/* Planet Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.8}
          metalness={0.2}
          emissive={active ? new THREE.Color(glowColor) : new THREE.Color("#000000")}
          emissiveIntensity={active ? 1.5 : 0.1}
        />
      </mesh>

      {/* Highlight glow ring for active state */}
      {active && (
        <mesh>
          <sphereGeometry args={[0.85, 16, 16]} />
          <meshBasicMaterial 
            color={glowColor} 
            transparent 
            opacity={0.15} 
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

export default function Exoplanets3D() {
  const groupRef = useRef<THREE.Group>(null);
  const { progressRef } = useScrollProgress();

  useFrame((state) => {
    const p = progressRef.current ?? 0;
    
    // Scene 4 range (0.375 - 0.50)
    // Appear at 0.35, fully active 0.375 - 0.50, fade out by 0.53
    let opacity = 0;
    
    if (p > 0.34 && p < 0.54) {
      if (p < 0.375) {
        const t = (p - 0.34) / 0.035;
        opacity = THREE.MathUtils.lerp(0, 1, t);
      } else if (p < 0.50) {
        opacity = 1;
      } else {
        const t = (p - 0.50) / 0.04;
        opacity = THREE.MathUtils.lerp(1, 0, t);
      }
    }

    if (groupRef.current) {
      // Gentle orbit drift
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.15;
      
      // Control overall transparency of elements inside the group
      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.Material;
          mat.transparent = true;
          mat.opacity = (child.material as any).opacity ? (child.material as any).opacity * opacity : opacity;
        }
      });
    }
  });

  // Calculate active sub-states of Scene 4
  const p = progressRef.current ?? 0;
  const isKeplerActive = p >= 0.375 && p < 0.42;
  const isTrappistActive = p >= 0.42 && p < 0.46;
  const isProximaActive = p >= 0.46 && p <= 0.50;

  return (
    <group ref={groupRef}>
      {/* Kepler-452b (Green-ish, Earth-like) */}
      <Planet
        position={[-3.5, 1, -2]}
        color="#2a7d4a"
        glowColor="#00f0ff"
        name="Kepler-452b"
        active={isKeplerActive}
        scale={1.2}
      />

      {/* TRAPPIST-1e (Reddish-brown, multi-ringed vibe) */}
      <Planet
        position={[4, -1, -3]}
        color="#8c2d19"
        glowColor="#7a00ff"
        name="TRAPPIST-1e"
        active={isTrappistActive}
        scale={0.9}
      />

      {/* Proxima Centauri b (Dusty copper, close companion) */}
      <Planet
        position={[-0.8, -1.8, 1]}
        color="#bf6b21"
        glowColor="#ffaa00"
        name="Proxima Centauri b"
        active={isProximaActive}
        scale={0.7}
      />
    </group>
  );
}
