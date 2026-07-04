"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollProgress } from "@/lib/ScrollContext";

export default function Galaxy() {
  const pointsRef = useRef<THREE.Points>(null);
  const { progressRef } = useScrollProgress();

  const count = 3000;
  const arms = 4;
  const radius = 18;
  const spin = 1.2;
  const randomness = 0.5;
  const power = 4; // concentration towards center

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorCenter = new THREE.Color("#ffaa00"); // Amber/Gold core
    const colorMiddle = new THREE.Color("#7a00ff"); // Purple body
    const colorOuter = new THREE.Color("#00f0ff");  // Blue arms

    for (let i = 0; i < count; i++) {
      // 1. Position
      const r = Math.pow(Math.random(), power) * radius;
      const armAngle = ((i % arms) / arms) * Math.PI * 2;
      const spinAngle = r * spin;

      // Random offsets for dust cloud feel
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;

      const x = Math.cos(armAngle + spinAngle) * r + randomX;
      const y = randomY * 0.4; // thin disc
      const z = Math.sin(armAngle + spinAngle) * r + randomZ;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // 2. Color interpolation based on radius
      let mixedColor = colorCenter.clone();
      if (r < radius * 0.3) {
        // Core to middle
        const t = r / (radius * 0.3);
        mixedColor.lerp(colorMiddle, t);
      } else {
        // Middle to outer
        const t = (r - radius * 0.3) / (radius * 0.7);
        mixedColor = colorMiddle.clone().lerp(colorOuter, t);
      }

      // Add a bit of color noise
      mixedColor.r += (Math.random() - 0.5) * 0.1;
      mixedColor.g += (Math.random() - 0.5) * 0.1;
      mixedColor.b += (Math.random() - 0.5) * 0.1;

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    return { positions, colors };
  }, []);

  useFrame((state, delta) => {
    const p = progressRef.current ?? 0;
    
    // Scene 3 range (0.25 - 0.375)
    // Appear at 0.22, full at 0.28, fade out by 0.50
    let opacity = 0;
    let scale = 0;

    if (p > 0.20 && p < 0.52) {
      if (p < 0.28) {
        // Fade in
        const t = (p - 0.20) / 0.08;
        opacity = THREE.MathUtils.lerp(0, 1, t);
        scale = THREE.MathUtils.lerp(0.2, 1, t);
      } else if (p < 0.42) {
        // Fully active during Scene 3 & Scene 4 start
        opacity = 1;
        scale = 1;
      } else {
        // Fade out during Scene 5 transition
        const t = (p - 0.42) / 0.10;
        opacity = THREE.MathUtils.lerp(1, 0, t);
        scale = THREE.MathUtils.lerp(1, 1.5, t); // expand out as we fly past
      }
    }

    if (pointsRef.current) {
      pointsRef.current.scale.setScalar(scale);
      
      // Slowly rotate the galaxy
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.08 + p * 0.5;
      
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      mat.transparent = true;
      mat.opacity = opacity;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
