"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollProgress } from "@/lib/ScrollContext";

export default function VoyagerRecord() {
  const groupRef = useRef<THREE.Group>(null);
  const recordRef = useRef<THREE.Mesh>(null);
  const { progressRef } = useScrollProgress();

  useFrame((state, delta) => {
    const p = progressRef.current ?? 0;
    
    // Scene 5 range (0.50 - 0.625)
    // Starts appearing at 0.48, fully visible 0.52 - 0.61, fades out by 0.66
    let opacity = 0;
    let scale = 0;
    let zPosition = -5;
    
    if (p > 0.46 && p < 0.68) {
      if (p < 0.52) {
        const t = (p - 0.46) / 0.06;
        opacity = THREE.MathUtils.lerp(0, 1, t);
        scale = THREE.MathUtils.lerp(0.3, 1.2, t);
        zPosition = THREE.MathUtils.lerp(-10, 0, t);
      } else if (p < 0.60) {
        opacity = 1;
        scale = 1.2;
        zPosition = 0;
      } else {
        const t = (p - 0.60) / 0.08;
        opacity = THREE.MathUtils.lerp(1, 0, t);
        scale = THREE.MathUtils.lerp(1.2, 0.4, t);
        zPosition = THREE.MathUtils.lerp(0, 5, t); // fly past camera
      }
    }

    if (groupRef.current) {
      groupRef.current.position.z = zPosition;
      groupRef.current.scale.setScalar(scale);

      // Rotate whole group slightly to show angle
      groupRef.current.rotation.x = 0.5 + Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
      groupRef.current.rotation.y = 0.4;
      
      // Control opacity
      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.Material;
          mat.transparent = true;
          mat.opacity = opacity;
        }
      });
    }

    if (recordRef.current) {
      // Continuous record spin
      recordRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Golden Record Disc */}
      <mesh ref={recordRef} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.2, 2.2, 0.08, 32]} />
        <meshStandardMaterial 
          color="#d4af37" // gold
          roughness={0.15}
          metalness={0.9}
          bumpScale={0.05}
        />
        
        {/* Center spindle hole */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.09, 16]} />
          <meshStandardMaterial color="#222222" roughness={0.8} />
        </mesh>

        {/* Groove Engravings (rendered as concentric rings on both sides) */}
        {/* Top Grooves */}
        <group position={[0, 0.041, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.6, 0.015, 4, 32]} />
            <meshBasicMaterial color="#ffaa00" />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.0, 0.012, 4, 32]} />
            <meshBasicMaterial color="#ffaa00" />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.5, 0.012, 4, 32]} />
            <meshBasicMaterial color="#ffaa00" />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.9, 0.015, 4, 32]} />
            <meshBasicMaterial color="#ffaa00" />
          </mesh>

          {/* Central Pulsar Map Diagram Engraving - Stylized Crossed Lines */}
          <group position={[0, 0, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <boxGeometry args={[3.2, 0.01, 0.01]} />
              <meshBasicMaterial color="#ffaa00" />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, Math.PI / 3]}>
              <boxGeometry args={[2.5, 0.01, 0.01]} />
              <meshBasicMaterial color="#ffaa00" />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, -Math.PI / 4]}>
              <boxGeometry args={[2.8, 0.01, 0.01]} />
              <meshBasicMaterial color="#ffaa00" />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, Math.PI / 6]}>
              <boxGeometry args={[1.8, 0.01, 0.01]} />
              <meshBasicMaterial color="#ffaa00" />
            </mesh>
          </group>
        </group>
      </mesh>

      {/* Floating dust particles near the record that catch the light */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array([
                -1, 1, 1,    1.5, -0.5, 1.2,   -0.8, -1.2, 0.5,
                2, 1, -1,    -1.5, 0.8, -1.5,  0.5, 1.8, 1,
              ]),
              3
            ]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.08} color="#ffaa00" transparent opacity={0.6} />
      </points>
    </group>
  );
}
