"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import type { ScrollTransform } from "@/components/three/scrollTransform";

type MouseRef = React.MutableRefObject<{ x: number; y: number }>;

export type FloatingObjectQuality = "high" | "low";

type FloatingObjectProps = {
  mouse?: MouseRef;
  reducedMotion?: boolean;
  /** GSAP mutates this ref; useFrame applies it — never mirrored in React state. */
  scrollTransform?: React.MutableRefObject<ScrollTransform>;
  /** Hero idle spin. Disable when scroll drives orientation. */
  autoSpin?: boolean;
  quality?: FloatingObjectQuality;
};

/**
 * Cohesive Awantis artefact: metallic core, nested blue nucleus,
 * equatorial glass ring, aligned accent band, and two yellow markers.
 */
export default function FloatingObject({
  mouse,
  reducedMotion = false,
  scrollTransform,
  autoSpin = true,
  quality = "high",
}: FloatingObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const low = quality === "low";

  useFrame((_, delta) => {
    if (!groupRef.current || !spinRef.current) return;

    if (scrollTransform) {
      const t = scrollTransform.current;
      groupRef.current.position.set(t.x, t.y, t.z);
      groupRef.current.rotation.set(t.rx, t.ry, t.rz);
      groupRef.current.scale.setScalar(t.scale);

      if (!reducedMotion && mouse) {
        groupRef.current.rotation.x += mouse.current.y * 0.04;
        groupRef.current.rotation.y += mouse.current.x * 0.05;
      }

      if (!reducedMotion && autoSpin) {
        spinRef.current.rotation.y += delta * 0.04;
      }
      return;
    }

    if (reducedMotion) {
      groupRef.current.rotation.set(0.12, 0.28, 0);
      spinRef.current.rotation.set(0, 0.4, 0);
      return;
    }

    if (autoSpin) {
      spinRef.current.rotation.y += delta * 0.09;
    }

    if (mouse) {
      const targetX = mouse.current.y * 0.14;
      const targetY = mouse.current.x * 0.18;

      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        targetX,
        2.4,
        delta,
      );
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetY,
        2.4,
        delta,
      );
    }
  });

  const shellDetail = low ? 0 : 1;
  const torusRadial = low ? 10 : 20;
  const torusTubular = low ? 36 : 72;

  const content = (
    <group ref={groupRef} position={[0.05, 0.08, 0]}>
      <group ref={spinRef}>
        {/* Chassis — cool brushed metal with a blue-tech undertone */}
        <mesh>
          <icosahedronGeometry args={[1.05, shellDetail]} />
          <meshPhysicalMaterial
            color="#a7b0c4"
            metalness={1}
            roughness={0.14}
            clearcoat={low ? 0.45 : 0.95}
            clearcoatRoughness={0.1}
            envMapIntensity={low ? 0.9 : 1.55}
            reflectivity={1}
          />
        </mesh>

        {/* Core signal — Awantis blue nucleus */}
        <mesh scale={0.5}>
          <octahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color="#051df9"
            metalness={0.94}
            roughness={0.1}
            clearcoat={low ? 0.55 : 1}
            clearcoatRoughness={0.06}
            emissive="#051df9"
            emissiveIntensity={0.32}
            envMapIntensity={low ? 0.8 : 1.4}
          />
        </mesh>

        {/* Primary glass orbit */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.28, 0.078, torusRadial, torusTubular]} />
          {low ? (
            <meshPhysicalMaterial
              color="#9eb0ff"
              metalness={0.15}
              roughness={0.12}
              transparent
              opacity={0.72}
              clearcoat={0.6}
              envMapIntensity={0.9}
            />
          ) : (
            <meshPhysicalMaterial
              color="#e4eaff"
              metalness={0}
              roughness={0.035}
              transmission={0.94}
              thickness={0.7}
              ior={1.46}
              transparent
              opacity={1}
              clearcoat={1}
              clearcoatRoughness={0.03}
              envMapIntensity={1.7}
              attenuationColor="#051df9"
              attenuationDistance={3.2}
            />
          )}
        </mesh>

        {/* Blue orbital rail — brand accent locked to the glass ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.28, 0.024, low ? 8 : 12, low ? 40 : 72]} />
          <meshPhysicalMaterial
            color="#051df9"
            metalness={0.96}
            roughness={0.12}
            clearcoat={0.8}
            clearcoatRoughness={0.08}
            emissive="#051df9"
            emissiveIntensity={0.22}
            envMapIntensity={low ? 0.75 : 1.35}
          />
        </mesh>

        {!low ? (
          <mesh rotation={[Math.PI / 2.55, 0.18, 0.32]}>
            <torusGeometry args={[1.46, 0.014, 10, 72]} />
            <meshPhysicalMaterial
              color="#051df9"
              metalness={0.92}
              roughness={0.18}
              transparent
              opacity={0.88}
              emissive="#051df9"
              emissiveIntensity={0.14}
              envMapIntensity={1.1}
            />
          </mesh>
        ) : null}

        {/* Machined blue node on the chassis */}
        <mesh
          position={[0.7, 0.4, 0.56]}
          rotation={[0.55, 0.75, 0.15]}
          scale={0.34}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color="#051df9"
            metalness={0.9}
            roughness={0.14}
            clearcoat={1}
            emissive="#051df9"
            emissiveIntensity={0.18}
          />
        </mesh>

        {/* Yellow instrument markers — sparse signal points */}
        <mesh
          position={[1.28, 0.02, 0]}
          rotation={[0, 0, Math.PI / 4]}
          scale={0.075}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#efff00"
            metalness={0.35}
            roughness={0.3}
            emissive="#efff00"
            emissiveIntensity={0.55}
          />
        </mesh>
        <mesh
          position={[-1.28, -0.02, 0]}
          rotation={[0, 0, Math.PI / 4]}
          scale={0.058}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#efff00"
            metalness={0.35}
            roughness={0.3}
            emissive="#efff00"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
    </group>
  );

  // Scroll-driven mode: skip Float so GSAP owns position without fighting
  if (scrollTransform) {
    return content;
  }

  return (
    <Float
      speed={reducedMotion ? 0 : 0.55}
      rotationIntensity={0}
      floatIntensity={reducedMotion ? 0 : 0.28}
      floatingRange={reducedMotion ? [0, 0] : [-0.1, 0.1]}
    >
      {content}
    </Float>
  );
}
