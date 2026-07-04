"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollProgress } from "@/lib/ScrollContext";

export default function Starfield() {
  const { progressRef, reducedMotion } = useScrollProgress();
  const nearPointsRef = useRef<THREE.Points>(null);
  const midPointsRef = useRef<THREE.Points>(null);
  const farPointsRef = useRef<THREE.Points>(null);

  // Mouse parallax target variables
  const mouseRef = useRef({ x: 0, y: 0 });

  // Handle mouse move on client side
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1 to 1
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Generate random positions and colors for 3 layers of stars
  const count = 1500;
  
  const nearData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 50;
      positions[i + 1] = (Math.random() - 0.5) * 50;
      positions[i + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    return positions;
  }, []);

  const midData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 80;
      positions[i + 1] = (Math.random() - 0.5) * 80;
      positions[i + 2] = (Math.random() - 0.5) * 40 - 25;
    }
    return positions;
  }, []);

  const farData = useMemo(() => {
    const positions = new Float32Array(count * 2.5 * 3);
    for (let i = 0; i < count * 2.5 * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 150;
      positions[i + 1] = (Math.random() - 0.5) * 150;
      positions[i + 2] = (Math.random() - 0.5) * 80 - 60;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    const p = progressRef.current ?? 0;
    
    // Slow rotational spin of the universe
    const rotationSpeed = reducedMotion ? 0.005 : 0.02 + p * 0.05;
    
    if (nearPointsRef.current) {
      nearPointsRef.current.rotation.y += delta * rotationSpeed * 0.4;
      nearPointsRef.current.rotation.x += delta * rotationSpeed * 0.1;
    }
    if (midPointsRef.current) {
      midPointsRef.current.rotation.y += delta * rotationSpeed * 0.2;
      midPointsRef.current.rotation.z += delta * rotationSpeed * 0.15;
    }
    if (farPointsRef.current) {
      farPointsRef.current.rotation.y += delta * rotationSpeed * 0.08;
    }

    // Apply mouse parallax, smoothed over time (lerp)
    if (!reducedMotion) {
      const targetX = mouseRef.current.x * 0.5;
      const targetY = mouseRef.current.y * 0.5;

      if (nearPointsRef.current) {
        nearPointsRef.current.position.x = THREE.MathUtils.lerp(nearPointsRef.current.position.x, targetX * 1.5, 0.05);
        nearPointsRef.current.position.y = THREE.MathUtils.lerp(nearPointsRef.current.position.y, targetY * 1.5, 0.05);
      }
      if (midPointsRef.current) {
        midPointsRef.current.position.x = THREE.MathUtils.lerp(midPointsRef.current.position.x, targetX * 0.8, 0.05);
        midPointsRef.current.position.y = THREE.MathUtils.lerp(midPointsRef.current.position.y, targetY * 0.8, 0.05);
      }
      if (farPointsRef.current) {
        farPointsRef.current.position.x = THREE.MathUtils.lerp(farPointsRef.current.position.x, targetX * 0.3, 0.05);
        farPointsRef.current.position.y = THREE.MathUtils.lerp(farPointsRef.current.position.y, targetY * 0.3, 0.05);
      }
    }

    // Scene 7 Freeze Effect
    if (p >= 0.75 && p < 0.875) {
      // Suddenly slow down rotation to absolute freeze
      if (nearPointsRef.current) {
        nearPointsRef.current.rotation.x = THREE.MathUtils.lerp(nearPointsRef.current.rotation.x, 0, 0.1);
        nearPointsRef.current.rotation.y = THREE.MathUtils.lerp(nearPointsRef.current.rotation.y, 0, 0.1);
      }
    }

    // Scene 8 Fade to Black
    if (p >= 0.875) {
      const fadeProgress = (p - 0.875) / 0.125;
      const opacity = Math.max(0, 1 - fadeProgress);
      
      if (nearPointsRef.current) {
        const mat = nearPointsRef.current.material as THREE.PointsMaterial;
        mat.opacity = opacity * 0.8;
      }
      if (midPointsRef.current) {
        const mat = midPointsRef.current.material as THREE.PointsMaterial;
        mat.opacity = opacity * 0.6;
      }
      if (farPointsRef.current) {
        const mat = farPointsRef.current.material as THREE.PointsMaterial;
        mat.opacity = opacity * 0.4;
      }
    } else {
      // Default opacities
      if (nearPointsRef.current) {
        (nearPointsRef.current.material as THREE.PointsMaterial).opacity = 0.8;
      }
      if (midPointsRef.current) {
        (midPointsRef.current.material as THREE.PointsMaterial).opacity = 0.6;
      }
      if (farPointsRef.current) {
        (farPointsRef.current.material as THREE.PointsMaterial).opacity = 0.4;
      }
    }
  });

  return (
    <group>
      {/* Near starfield layer */}
      <points ref={nearPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[nearData, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#00f0ff"
          transparent
          opacity={0.8}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </points>

      {/* Mid starfield layer */}
      <points ref={midPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[midData, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#ffffff"
          transparent
          opacity={0.6}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </points>

      {/* Far starfield layer */}
      <points ref={farPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[farData, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#7a00ff"
          transparent
          opacity={0.4}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
