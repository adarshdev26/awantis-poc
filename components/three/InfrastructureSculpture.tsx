"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { InfrastructureProgress } from "@/components/three/infrastructureProgress";

type Quality = "high" | "low";

type InfrastructureSculptureProps = {
  progress: React.MutableRefObject<InfrastructureProgress>;
  reducedMotion?: boolean;
  quality?: Quality;
};

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

type PlaneSpec = {
  width: number;
  height: number;
  color: string;
  metalness: number;
  roughness: number;
  transmission?: number;
  assembled: [number, number, number];
  fromRot: [number, number, number];
  toRot: [number, number, number];
  delay: number;
  span: number;
};

type ShardSpec = {
  size: number;
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  fromPos: [number, number, number];
  toPos: [number, number, number];
  fromRot: [number, number, number];
  toRot: [number, number, number];
  delay: number;
  span: number;
};

/**
 * Four fins share one vertical spine and open like architectural leaves —
 * silver / blue / glass / silver, stacked in depth.
 */
const PLANES: PlaneSpec[] = [
  {
    width: 2.45,
    height: 1.45,
    color: "#c5ccd8",
    metalness: 0.92,
    roughness: 0.28,
    assembled: [0.15, 0.12, -0.08],
    fromRot: [-1.05, 0.02, 0.04],
    toRot: [-0.28, 0.04, 0.02],
    delay: 0,
    span: 0.52,
  },
  {
    width: 2.25,
    height: 1.32,
    color: "#051df9",
    metalness: 0.9,
    roughness: 0.22,
    assembled: [0.15, 0.04, 0.12],
    fromRot: [0.95, -0.04, -0.06],
    toRot: [0.12, -0.03, -0.02],
    delay: 0.06,
    span: 0.52,
  },
  {
    width: 2.05,
    height: 1.18,
    color: "#f2f5fa",
    metalness: 0.05,
    roughness: 0.08,
    transmission: 0.82,
    assembled: [0.15, -0.04, 0.3],
    fromRot: [-0.88, 0.06, 0.05],
    toRot: [-0.06, 0.05, 0.02],
    delay: 0.12,
    span: 0.52,
  },
  {
    width: 1.85,
    height: 1.05,
    color: "#aeb6c6",
    metalness: 0.94,
    roughness: 0.26,
    assembled: [0.15, -0.14, 0.46],
    fromRot: [1.0, -0.05, 0.04],
    toRot: [0.22, -0.02, 0.01],
    delay: 0.18,
    span: 0.52,
  },
];

/** Shards dock to panel corners as braces — not free-floating accents. */
const SHARDS: ShardSpec[] = [
  {
    size: 0.28,
    color: "#051df9",
    emissive: "#051df9",
    emissiveIntensity: 0.14,
    fromPos: [2.2, 1.5, 0.2],
    toPos: [1.28, 0.62, 0.18],
    fromRot: [0.6, 0.9, -0.3],
    toRot: [0.2, 0.35, -0.1],
    delay: 0.32,
    span: 0.45,
  },
  {
    size: 0.24,
    color: "#051df9",
    emissive: "#051df9",
    emissiveIntensity: 0.1,
    fromPos: [-2.0, 1.35, 0.1],
    toPos: [-0.95, 0.55, 0.14],
    fromRot: [-0.5, -0.85, 0.35],
    toRot: [-0.15, -0.3, 0.12],
    delay: 0.36,
    span: 0.45,
  },
  {
    size: 0.22,
    color: "#b4bccb",
    fromPos: [2.0, -1.4, 0.5],
    toPos: [1.15, -0.55, 0.42],
    fromRot: [0.85, 0.35, 0.55],
    toRot: [0.28, 0.18, 0.2],
    delay: 0.4,
    span: 0.42,
  },
  {
    size: 0.2,
    color: "#051df9",
    fromPos: [-1.9, -1.3, 0.35],
    toPos: [-0.88, -0.48, 0.34],
    fromRot: [-0.7, -0.4, -0.4],
    toRot: [-0.22, -0.15, -0.12],
    delay: 0.44,
    span: 0.42,
  },
];

const YELLOW_MARKERS: ShardSpec[] = [
  {
    size: 0.065,
    color: "#efff00",
    emissive: "#efff00",
    emissiveIntensity: 0.45,
    fromPos: [0.4, 1.8, 0.8],
    toPos: [1.05, 0.55, 0.34],
    fromRot: [0, 0, 0.6],
    toRot: [0.15, 0.25, 0.4],
    delay: 0.58,
    span: 0.35,
  },
  {
    size: 0.055,
    color: "#efff00",
    emissive: "#efff00",
    emissiveIntensity: 0.4,
    fromPos: [-0.2, -1.7, 0.9],
    toPos: [-0.55, -0.45, 0.48],
    fromRot: [0.4, 0, -0.3],
    toRot: [0.2, -0.15, 0.25],
    delay: 0.62,
    span: 0.32,
  },
];

function lerp3(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] {
  return [
    THREE.MathUtils.lerp(a[0], b[0], t),
    THREE.MathUtils.lerp(a[1], b[1], t),
    THREE.MathUtils.lerp(a[2], b[2], t),
  ];
}

export default function InfrastructureSculpture({
  progress,
  reducedMotion = false,
  quality = "high",
}: InfrastructureSculptureProps) {
  const rootRef = useRef<THREE.Group>(null);
  const planeRefs = useRef<(THREE.Group | null)[]>([]);
  const shardRefs = useRef<(THREE.Mesh | null)[]>([]);
  const markerRefs = useRef<(THREE.Mesh | null)[]>([]);
  const low = quality === "low";

  const planeList = useMemo(
    () => (low ? PLANES.filter((_, i) => i < 3) : PLANES),
    [low],
  );
  const shardList = useMemo(
    () => (low ? SHARDS.filter((_, i) => i < 2) : SHARDS),
    [low],
  );

  useFrame((state) => {
    const assemble = reducedMotion ? 1 : progress.current.assemble;
    const turn = reducedMotion ? 0.18 : progress.current.turn;
    const t = state.clock.elapsedTime;

    if (rootRef.current) {
      const floatY = reducedMotion ? 0 : Math.sin(t * 0.5) * 0.035;
      rootRef.current.position.y = floatY;
      rootRef.current.rotation.y =
        turn + (reducedMotion ? 0 : Math.sin(t * 0.18) * 0.025);
      rootRef.current.rotation.x =
        0.16 + (reducedMotion ? 0 : Math.sin(t * 0.14) * 0.012);
    }

    planeList.forEach((spec, index) => {
      const group = planeRefs.current[index];
      if (!group) return;
      const local = smoothstep(spec.delay, spec.delay + spec.span, assemble);
      const depthBias = (1 - local) * (0.28 + index * 0.06);
      group.position.set(
        spec.assembled[0],
        spec.assembled[1],
        spec.assembled[2] - depthBias,
      );
      group.rotation.set(...lerp3(spec.fromRot, spec.toRot, local));
    });

    shardList.forEach((spec, index) => {
      const mesh = shardRefs.current[index];
      if (!mesh) return;
      const local = smoothstep(spec.delay, spec.delay + spec.span, assemble);
      mesh.position.set(...lerp3(spec.fromPos, spec.toPos, local));
      mesh.rotation.set(...lerp3(spec.fromRot, spec.toRot, local));
    });

    YELLOW_MARKERS.forEach((spec, index) => {
      const mesh = markerRefs.current[index];
      if (!mesh) return;
      const local = smoothstep(spec.delay, spec.delay + spec.span, assemble);
      mesh.position.set(...lerp3(spec.fromPos, spec.toPos, local));
      mesh.rotation.set(...lerp3(spec.fromRot, spec.toRot, local));
    });
  });

  return (
    <group ref={rootRef} position={[0.05, 0.08, 0]} scale={low ? 0.9 : 1}>
      {/* Vertical hinge spine — connects every panel */}
      <mesh position={[-1.05, 0, 0.18]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.035, 1.55, 0.035]} />
        <meshPhysicalMaterial
          color="#051df9"
          metalness={0.9}
          roughness={0.22}
          emissive="#051df9"
          emissiveIntensity={0.12}
          envMapIntensity={0.35}
        />
      </mesh>

      {/* Horizontal cross-member for structural read */}
      <mesh position={[0.05, -0.72, 0.18]}>
        <boxGeometry args={[2.15, 0.028, 0.028]} />
        <meshPhysicalMaterial
          color="#9aa3b4"
          metalness={0.88}
          roughness={0.3}
          envMapIntensity={0.3}
        />
      </mesh>

      {planeList.map((spec, index) => {
        const useGlass = Boolean(spec.transmission) && !low;
        return (
          <group
            key={`plane-${index}`}
            ref={(node) => {
              planeRefs.current[index] = node;
            }}
          >
            <mesh castShadow receiveShadow>
              <boxGeometry args={[spec.width, spec.height, 0.04]} />
              {useGlass ? (
                <meshPhysicalMaterial
                  color={spec.color}
                  metalness={0}
                  roughness={0.08}
                  transmission={spec.transmission}
                  thickness={0.4}
                  ior={1.42}
                  transparent
                  clearcoat={0.35}
                  clearcoatRoughness={0.2}
                  envMapIntensity={0.45}
                  attenuationColor="#7a8cff"
                  attenuationDistance={4.5}
                />
              ) : (
                <meshPhysicalMaterial
                  color={spec.color}
                  metalness={spec.metalness}
                  roughness={spec.roughness}
                  clearcoat={0.35}
                  clearcoatRoughness={0.28}
                  envMapIntensity={0.4}
                  emissive={spec.color === "#051df9" ? "#051df9" : "#000000"}
                  emissiveIntensity={spec.color === "#051df9" ? 0.1 : 0}
                />
              )}
            </mesh>
            <mesh position={[-spec.width / 2 + 0.02, 0, 0.024]}>
              <boxGeometry args={[0.014, spec.height * 0.92, 0.014]} />
              <meshStandardMaterial
                color="#051df9"
                metalness={0.85}
                roughness={0.28}
                emissive="#051df9"
                emissiveIntensity={0.06}
              />
            </mesh>
          </group>
        );
      })}

      {shardList.map((spec, index) => (
        <mesh
          key={`shard-${index}`}
          ref={(node) => {
            shardRefs.current[index] = node;
          }}
          castShadow
        >
          <tetrahedronGeometry args={[spec.size, 0]} />
          <meshPhysicalMaterial
            color={spec.color}
            metalness={0.88}
            roughness={0.24}
            clearcoat={0.3}
            clearcoatRoughness={0.3}
            emissive={spec.emissive ?? "#000000"}
            emissiveIntensity={spec.emissiveIntensity ?? 0}
            envMapIntensity={0.35}
          />
        </mesh>
      ))}

      {YELLOW_MARKERS.map((spec, index) => (
        <mesh
          key={`marker-${index}`}
          ref={(node) => {
            markerRefs.current[index] = node;
          }}
        >
          <octahedronGeometry args={[spec.size, 0]} />
          <meshStandardMaterial
            color={spec.color}
            metalness={0.3}
            roughness={0.35}
            emissive={spec.emissive}
            emissiveIntensity={spec.emissiveIntensity}
          />
        </mesh>
      ))}
    </group>
  );
}
