"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SupportProgress } from "@/components/three/supportProgress";

type Quality = "high" | "low";

type SupportSculptureProps = {
  progress: React.MutableRefObject<SupportProgress>;
  reducedMotion?: boolean;
  quality?: Quality;
};

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

const FROM_POS = new THREE.Vector3(2.35, 0.35, 0.55);
const TO_POS = new THREE.Vector3(0.95, 0.05, 0.12);
const FROM_ROT = new THREE.Euler(0.35, -0.55, 0.2);
const TO_ROT = new THREE.Euler(0.05, -0.08, 0.02);

/** Simple existing team/structure + one specialist module docking in. */
export default function SupportSculpture({
  progress,
  reducedMotion = false,
  quality = "high",
}: SupportSculptureProps) {
  const rootRef = useRef<THREE.Group>(null);
  const moduleRef = useRef<THREE.Group>(null);
  const connectorRef = useRef<THREE.Mesh>(null);
  const accentRef = useRef<THREE.Mesh>(null);
  const low = quality === "low";

  useFrame((state) => {
    const join = reducedMotion ? 1 : progress.current.join;
    const t = smoothstep(0, 1, join);
    const elapsed = state.clock.elapsedTime;

    if (rootRef.current && !reducedMotion) {
      rootRef.current.rotation.y = -0.35 + Math.sin(elapsed * 0.15) * 0.03;
      rootRef.current.position.y = Math.sin(elapsed * 0.4) * 0.02;
    }

    if (moduleRef.current) {
      moduleRef.current.position.lerpVectors(FROM_POS, TO_POS, t);
      moduleRef.current.rotation.set(
        THREE.MathUtils.lerp(FROM_ROT.x, TO_ROT.x, t),
        THREE.MathUtils.lerp(FROM_ROT.y, TO_ROT.y, t),
        THREE.MathUtils.lerp(FROM_ROT.z, TO_ROT.z, t),
      );
    }

    if (connectorRef.current) {
      // Bridge appears as the module approaches
      const bridge = smoothstep(0.45, 0.95, join);
      connectorRef.current.scale.set(bridge, 1, 1);
      connectorRef.current.visible = bridge > 0.02;
      const mat = connectorRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.08 + bridge * 0.2;
    }

    if (accentRef.current) {
      const lit = smoothstep(0.7, 1, join);
      accentRef.current.visible = lit > 0.05;
      accentRef.current.scale.setScalar(0.7 + lit * 0.45);
      const mat = accentRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.2 + lit * 0.55;
    }
  });

  return (
    <group ref={rootRef} position={[0, 0.05, 0]} scale={low ? 0.92 : 1}>
      {/* Existing structure — stable blue core + silver plates */}
      <mesh position={[-0.15, 0, 0]}>
        <boxGeometry args={[1.15, 1.15, 1.15]} />
        <meshPhysicalMaterial
          color="#051df9"
          metalness={0.92}
          roughness={0.18}
          clearcoat={0.3}
          clearcoatRoughness={0.28}
          emissive="#051df9"
          emissiveIntensity={0.12}
          envMapIntensity={0.35}
        />
      </mesh>

      <mesh position={[-0.55, 0.55, 0.55]} rotation={[0.2, -0.25, 0.1]}>
        <boxGeometry args={[0.7, 0.55, 0.06]} />
        <meshPhysicalMaterial
          color="#c5ccd8"
          metalness={0.9}
          roughness={0.26}
          envMapIntensity={0.35}
        />
      </mesh>

      <mesh position={[-0.5, -0.45, 0.5]} rotation={[-0.15, -0.2, -0.08]}>
        <boxGeometry args={[0.65, 0.5, 0.055]} />
        <meshPhysicalMaterial
          color="#e8ecf2"
          metalness={0.85}
          roughness={0.24}
          envMapIntensity={0.32}
        />
      </mesh>

      <mesh position={[-0.7, 0.05, -0.35]} rotation={[0.05, 0.4, 0]}>
        <boxGeometry args={[0.55, 0.85, 0.05]} />
        <meshPhysicalMaterial
          color="#aeb6c5"
          metalness={0.9}
          roughness={0.28}
          envMapIntensity={0.3}
        />
      </mesh>

      {/* Dock rail on the existing structure */}
      <mesh position={[0.45, 0.05, 0.05]}>
        <boxGeometry args={[0.08, 0.7, 0.08]} />
        <meshStandardMaterial
          color="#051df9"
          metalness={0.85}
          roughness={0.25}
          emissive="#051df9"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Connecting bridge — grows as module joins */}
      <mesh
        ref={connectorRef}
        position={[0.7, 0.05, 0.1]}
        scale={[0, 1, 1]}
      >
        <boxGeometry args={[0.45, 0.045, 0.045]} />
        <meshStandardMaterial
          color="#051df9"
          metalness={0.9}
          roughness={0.22}
          emissive="#051df9"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Additional specialist module — docks from the right */}
      <group ref={moduleRef} position={FROM_POS.toArray()}>
        <mesh castShadow>
          <boxGeometry args={[0.72, 0.72, 0.72]} />
          <meshPhysicalMaterial
            color="#b8c0ce"
            metalness={0.94}
            roughness={0.22}
            clearcoat={0.3}
            clearcoatRoughness={0.3}
            envMapIntensity={0.38}
          />
        </mesh>
        <mesh position={[0, 0.28, 0.28]} rotation={[0.15, -0.2, 0]}>
          <boxGeometry args={[0.48, 0.32, 0.05]} />
          <meshPhysicalMaterial
            color="#f4f6fa"
            metalness={0.8}
            roughness={0.24}
            envMapIntensity={0.3}
          />
        </mesh>
        <mesh position={[-0.3, 0, 0]}>
          <boxGeometry args={[0.06, 0.45, 0.06]} />
          <meshStandardMaterial
            color="#051df9"
            metalness={0.85}
            roughness={0.25}
            emissive="#051df9"
            emissiveIntensity={0.08}
          />
        </mesh>
      </group>

      {/* Yellow connection accent — lights when joined */}
      <mesh ref={accentRef} position={[0.58, 0.05, 0.1]} visible={false}>
        <octahedronGeometry args={[0.07, 0]} />
        <meshStandardMaterial
          color="#efff00"
          metalness={0.3}
          roughness={0.35}
          emissive="#efff00"
          emissiveIntensity={0.35}
        />
      </mesh>
    </group>
  );
}
