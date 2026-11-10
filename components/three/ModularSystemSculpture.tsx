"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SystemsProgress } from "@/components/three/systemsProgress";

type Quality = "high" | "low";

type ModularSystemSculptureProps = {
  progress: React.MutableRefObject<SystemsProgress>;
  reducedMotion?: boolean;
  quality?: Quality;
};

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

type PanelSpec = {
  size: [number, number, number];
  color: string;
  metalness: number;
  roughness: number;
  side: "left" | "right" | "center";
  fromPos: [number, number, number];
  toPos: [number, number, number];
  fromRot: [number, number, number];
  toRot: [number, number, number];
  delay: number;
  span: number;
};

type AccentSpec = {
  size: number;
  fromPos: [number, number, number];
  toPos: [number, number, number];
  delay: number;
  span: number;
};

/**
 * Modular system: left / right chrome panels converge on a blue core frame.
 * Inspired by layered AI-studio depth + brief "panels assembling into one system".
 */
const PANELS: PanelSpec[] = [
  // Left stack
  {
    size: [0.95, 1.35, 0.06],
    color: "#c8ceda",
    metalness: 0.94,
    roughness: 0.24,
    side: "left",
    fromPos: [-3.4, 0.35, 0.4],
    toPos: [-0.95, 0.12, 0.08],
    fromRot: [0.15, -0.55, 0.2],
    toRot: [0.05, -0.12, 0.04],
    delay: 0.02,
    span: 0.55,
  },
  {
    size: [0.82, 1.1, 0.055],
    color: "#051df9",
    metalness: 0.9,
    roughness: 0.2,
    side: "left",
    fromPos: [-3.8, -0.45, -0.2],
    toPos: [-0.78, -0.28, 0.28],
    fromRot: [-0.25, -0.7, -0.15],
    toRot: [-0.08, -0.1, -0.03],
    delay: 0.1,
    span: 0.55,
  },
  {
    size: [0.7, 0.85, 0.05],
    color: "#e8ecf3",
    metalness: 0.85,
    roughness: 0.22,
    side: "left",
    fromPos: [-3.2, 0.9, 0.9],
    toPos: [-0.62, 0.55, 0.42],
    fromRot: [0.4, -0.45, 0.25],
    toRot: [0.1, -0.08, 0.05],
    delay: 0.18,
    span: 0.52,
  },
  // Right stack
  {
    size: [0.95, 1.35, 0.06],
    color: "#b7bfcd",
    metalness: 0.94,
    roughness: 0.24,
    side: "right",
    fromPos: [3.4, -0.2, 0.35],
    toPos: [0.95, -0.05, 0.1],
    fromRot: [-0.12, 0.55, -0.18],
    toRot: [-0.04, 0.12, -0.03],
    delay: 0.05,
    span: 0.55,
  },
  {
    size: [0.82, 1.1, 0.055],
    color: "#051df9",
    metalness: 0.9,
    roughness: 0.2,
    side: "right",
    fromPos: [3.7, 0.55, -0.15],
    toPos: [0.78, 0.32, 0.3],
    fromRot: [0.22, 0.65, 0.12],
    toRot: [0.06, 0.1, 0.02],
    delay: 0.14,
    span: 0.55,
  },
  {
    size: [0.7, 0.85, 0.05],
    color: "#f4f6fa",
    metalness: 0.82,
    roughness: 0.2,
    side: "right",
    fromPos: [3.15, -0.85, 0.85],
    toPos: [0.62, -0.48, 0.44],
    fromRot: [-0.35, 0.5, -0.2],
    toRot: [-0.08, 0.08, -0.04],
    delay: 0.22,
    span: 0.52,
  },
  // Bridging top / depth layers
  {
    size: [1.55, 0.12, 0.9],
    color: "#aeb6c5",
    metalness: 0.92,
    roughness: 0.26,
    side: "center",
    fromPos: [0, 2.4, -0.6],
    toPos: [0, 0.78, -0.05],
    fromRot: [0.5, 0, 0],
    toRot: [0.02, 0, 0],
    delay: 0.28,
    span: 0.5,
  },
  {
    size: [1.4, 0.1, 0.75],
    color: "#d5dae5",
    metalness: 0.88,
    roughness: 0.24,
    side: "center",
    fromPos: [0, -2.3, 0.7],
    toPos: [0, -0.78, 0.2],
    fromRot: [-0.45, 0, 0],
    toRot: [-0.02, 0, 0],
    delay: 0.32,
    span: 0.5,
  },
];

const YELLOW_MARKERS: AccentSpec[] = [
  {
    size: 0.07,
    fromPos: [-2.5, 1.6, 1.2],
    toPos: [-0.35, 0.72, 0.55],
    delay: 0.55,
    span: 0.35,
  },
  {
    size: 0.055,
    fromPos: [2.5, -1.5, 1.1],
    toPos: [0.35, -0.7, 0.55],
    delay: 0.6,
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

export default function ModularSystemSculpture({
  progress,
  reducedMotion = false,
  quality = "high",
}: ModularSystemSculptureProps) {
  const rootRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Group>(null);
  const panelRefs = useRef<(THREE.Mesh | null)[]>([]);
  const markerRefs = useRef<(THREE.Mesh | null)[]>([]);
  const low = quality === "low";

  const panelList = useMemo(() => {
    if (!low) return PANELS;
    // Mobile: keep left/right primaries + one bridge
    return PANELS.filter((_, i) => [0, 1, 3, 4, 6].includes(i));
  }, [low]);

  useFrame((state) => {
    const assemble = reducedMotion ? 1 : progress.current.assemble;
    const turn = reducedMotion ? 0.16 : progress.current.turn;
    const t = state.clock.elapsedTime;

    if (rootRef.current) {
      const floatY = reducedMotion ? 0 : Math.sin(t * 0.48) * 0.03;
      rootRef.current.position.y = floatY;
      rootRef.current.rotation.y =
        -0.28 + turn + (reducedMotion ? 0 : Math.sin(t * 0.16) * 0.02);
      rootRef.current.rotation.x =
        0.12 + (reducedMotion ? 0 : Math.sin(t * 0.12) * 0.01);
    }

    if (coreRef.current) {
      const coreT = smoothstep(0, 0.45, assemble);
      const scale = THREE.MathUtils.lerp(0.55, 1, coreT);
      coreRef.current.scale.setScalar(scale);
      coreRef.current.rotation.y = (1 - coreT) * 0.6;
    }

    panelList.forEach((spec, index) => {
      const mesh = panelRefs.current[index];
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
    });
  });

  return (
    <group ref={rootRef} position={[0.05, 0.1, 0]} scale={low ? 0.88 : 1}>
      {/* Central connector — the system that panels converge into */}
      <group ref={coreRef}>
        <mesh>
          <boxGeometry args={[0.55, 0.55, 0.55]} />
          <meshPhysicalMaterial
            color="#051df9"
            metalness={0.92}
            roughness={0.18}
            clearcoat={0.35}
            clearcoatRoughness={0.25}
            emissive="#051df9"
            emissiveIntensity={0.14}
            envMapIntensity={0.35}
          />
        </mesh>
        {/* Open frame rings around the core */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.52, 0.022, 10, low ? 32 : 48]} />
          <meshPhysicalMaterial
            color="#9aa3b4"
            metalness={0.9}
            roughness={0.28}
            envMapIntensity={0.3}
          />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.62, 0.016, 10, low ? 28 : 48]} />
          <meshPhysicalMaterial
            color="#051df9"
            metalness={0.88}
            roughness={0.22}
            emissive="#051df9"
            emissiveIntensity={0.08}
            envMapIntensity={0.3}
          />
        </mesh>
        {/* Cross beams linking left/right docks */}
        <mesh>
          <boxGeometry args={[1.55, 0.03, 0.03]} />
          <meshStandardMaterial
            color="#051df9"
            metalness={0.85}
            roughness={0.25}
            emissive="#051df9"
            emissiveIntensity={0.06}
          />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[1.35, 0.03, 0.03]} />
          <meshStandardMaterial
            color="#b0b8c7"
            metalness={0.85}
            roughness={0.28}
          />
        </mesh>
      </group>

      {panelList.map((spec, index) => (
        <mesh
          key={`panel-${spec.side}-${index}`}
          ref={(node) => {
            panelRefs.current[index] = node;
          }}
          castShadow
          receiveShadow
        >
          <boxGeometry args={spec.size} />
          <meshPhysicalMaterial
            color={spec.color}
            metalness={spec.metalness}
            roughness={spec.roughness}
            clearcoat={0.3}
            clearcoatRoughness={0.3}
            envMapIntensity={0.38}
            emissive={spec.color === "#051df9" ? "#051df9" : "#000000"}
            emissiveIntensity={spec.color === "#051df9" ? 0.1 : 0}
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
            color="#efff00"
            metalness={0.3}
            roughness={0.35}
            emissive="#efff00"
            emissiveIntensity={0.45}
          />
        </mesh>
      ))}
    </group>
  );
}
