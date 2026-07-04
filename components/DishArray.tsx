"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollProgress } from "@/lib/ScrollContext";

interface DishProps {
  position: [number, number, number];
  delay: number;
}

function SmallDish({ position, delay }: DishProps) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime() + delay;
      // Gentle panning back and forth
      meshRef.current.rotation.y = Math.sin(time * 0.2) * 0.4;
      // Gentle tilting up and down
      const dishPivot = meshRef.current.getObjectByName("dishPivot");
      if (dishPivot) {
        dishPivot.rotation.x = -Math.PI / 4 + Math.sin(time * 0.3) * 0.1;
      }
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Small base mount */}
      <mesh>
        <cylinderGeometry args={[0.4, 0.5, 0.2, 6]} />
        <meshBasicMaterial color="#7a00ff" wireframe />
      </mesh>
      {/* Support shaft */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.8, 4]} />
        <meshBasicMaterial color="#00f0ff" wireframe />
      </mesh>
      
      {/* Dish pivot mount */}
      <group name="dishPivot" position={[0, 0.8, 0]}>
        {/* Tilt support bar */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 4]} />
          <meshBasicMaterial color="#7a00ff" wireframe />
        </mesh>
        
        {/* The Dish itself */}
        <group position={[0, 0.4, 0.2]} rotation={[Math.PI / 4, 0, 0]}>
          <mesh>
            <coneGeometry args={[1.2, 0.6, 12, 2, true]} />
            <meshBasicMaterial color="#00f0ff" wireframe side={THREE.DoubleSide} />
          </mesh>
          {/* Feed horn */}
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.8, 4]} />
            <meshBasicMaterial color="#ffaa00" wireframe />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default function DishArray() {
  const groupRef = useRef<THREE.Group>(null);
  const beam1Ref = useRef<THREE.Mesh>(null);
  const beam2Ref = useRef<THREE.Mesh>(null);
  const beam3Ref = useRef<THREE.Mesh>(null);
  
  const { progressRef } = useScrollProgress();

  useFrame((state) => {
    const p = progressRef.current ?? 0;
    
    // Scene 6 range (0.625 - 0.75)
    // Appear at 0.60, fully active 0.625 - 0.75, dissolves/freezes by 0.76
    let opacity = 0;
    
    if (p > 0.58 && p < 0.77) {
      if (p < 0.625) {
        const t = (p - 0.58) / 0.045;
        opacity = THREE.MathUtils.lerp(0, 1, t);
      } else if (p < 0.75) {
        opacity = 1;
      } else {
        const t = (p - 0.75) / 0.02;
        opacity = THREE.MathUtils.lerp(1, 0, t);
      }
    }

    if (groupRef.current) {
      // Scale group in
      const scale = opacity;
      groupRef.current.scale.setScalar(scale);
      
      // Control opacity
      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.Material;
          mat.transparent = true;
          // Retain some of the target opacity
          mat.opacity = (child.material as any).opacity ? (child.material as any).opacity * opacity : opacity;
        }
      });
    }

    // Animate signal beams pulsing and sliding upwards
    const time = state.clock.getElapsedTime();
    if (beam1Ref.current) {
      beam1Ref.current.scale.y = 1 + Math.sin(time * 5) * 0.2;
      (beam1Ref.current.material as THREE.MeshBasicMaterial).opacity = (0.2 + Math.sin(time * 10) * 0.1) * opacity;
    }
    if (beam2Ref.current) {
      beam2Ref.current.scale.y = 1 + Math.sin(time * 5 + 2) * 0.2;
      (beam2Ref.current.material as THREE.MeshBasicMaterial).opacity = (0.2 + Math.sin(time * 10 + 2) * 0.1) * opacity;
    }
    if (beam3Ref.current) {
      beam3Ref.current.scale.y = 1 + Math.sin(time * 5 + 4) * 0.2;
      (beam3Ref.current.material as THREE.MeshBasicMaterial).opacity = (0.2 + Math.sin(time * 10 + 4) * 0.1) * opacity;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.8, 0]}>
      {/* Base Grid Plane representing Earth surface */}
      <gridHelper args={[20, 20, "#7a00ff", "#222222"]} position={[0, -0.1, 0]} />

      {/* The Dish Array */}
      <SmallDish position={[-2.5, 0, 0]} delay={0} />
      <SmallDish position={[0, 0, -1]} delay={2.5} />
      <SmallDish position={[2.5, 0, 0]} delay={5} />

      {/* Signal Beams (translucent cylinders shooting upwards) */}
      <mesh ref={beam1Ref} position={[-2.5, 5, 0.2]}>
        <cylinderGeometry args={[0.08, 0.4, 10, 8, 1, true]} />
        <meshBasicMaterial 
          color="#00f0ff" 
          transparent 
          opacity={0.3} 
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={beam2Ref} position={[0, 5, -0.8]}>
        <cylinderGeometry args={[0.08, 0.4, 10, 8, 1, true]} />
        <meshBasicMaterial 
          color="#00f0ff" 
          transparent 
          opacity={0.3} 
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={beam3Ref} position={[2.5, 5, 0.2]}>
        <cylinderGeometry args={[0.08, 0.4, 10, 8, 1, true]} />
        <meshBasicMaterial 
          color="#00f0ff" 
          transparent 
          opacity={0.3} 
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
