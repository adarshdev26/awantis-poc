"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SecurityProgress } from "@/components/three/securityProgress";

type Quality = "high" | "low";

type SecuritySculptureProps = {
  progress: React.MutableRefObject<SecurityProgress>;
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
  pos: [number, number, number];
  rot: [number, number, number];
  /** Extra offset while collapsed (reveal=0) */
  collapse: [number, number, number];
  delay: number;
  span: number;
};

type PointSpec = {
  pos: [number, number, number];
  /** X position used to match the scanning beam */
  scanX: number;
};

const PANELS: PanelSpec[] = [
  {
    size: [1.7, 1.15, 0.05],
    color: "#3a3d44",
    pos: [0, 0.15, 0],
    rot: [-0.18, 0.22, 0.04],
    collapse: [0, -0.35, -0.8],
    delay: 0,
    span: 0.5,
  },
  {
    size: [1.35, 0.95, 0.045],
    color: "#2f3238",
    pos: [-0.55, -0.2, 0.35],
    rot: [0.12, -0.28, -0.06],
    collapse: [-1.2, 0.2, 0.4],
    delay: 0.08,
    span: 0.5,
  },
  {
    size: [1.2, 0.85, 0.045],
    color: "#454950",
    pos: [0.6, -0.15, 0.42],
    rot: [0.08, 0.32, 0.05],
    collapse: [1.25, -0.15, 0.35],
    delay: 0.14,
    span: 0.5,
  },
  {
    size: [0.95, 0.7, 0.04],
    color: "#051df9",
    pos: [0.15, 0.45, 0.55],
    rot: [-0.25, 0.1, -0.08],
    collapse: [0.3, 1.1, 0.5],
    delay: 0.2,
    span: 0.48,
  },
  {
    size: [1.05, 0.55, 0.04],
    color: "#353840",
    pos: [-0.1, -0.55, 0.25],
    rot: [0.22, -0.12, 0.03],
    collapse: [0, -1.0, 0.2],
    delay: 0.24,
    span: 0.48,
  },
];

const INSPECTION_POINTS: PointSpec[] = [
  { pos: [-0.7, 0.55, 0.5], scanX: -0.75 },
  { pos: [0.15, 0.7, 0.7], scanX: 0.1 },
  { pos: [0.85, 0.2, 0.55], scanX: 0.85 },
  { pos: [-0.35, -0.45, 0.5], scanX: -0.35 },
  { pos: [0.45, -0.55, 0.45], scanX: 0.45 },
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

export default function SecuritySculpture({
  progress,
  reducedMotion = false,
  quality = "high",
}: SecuritySculptureProps) {
  const rootRef = useRef<THREE.Group>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  const beamGlowRef = useRef<THREE.Mesh>(null);
  const panelRefs = useRef<(THREE.Group | null)[]>([]);
  const pointRefs = useRef<(THREE.Mesh | null)[]>([]);
  const edgeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const low = quality === "low";

  const panelList = useMemo(
    () => (low ? PANELS.filter((_, i) => i < 3) : PANELS),
    [low],
  );
  const pointList = useMemo(
    () => (low ? INSPECTION_POINTS.filter((_, i) => i < 3) : INSPECTION_POINTS),
    [low],
  );

  // Scan travels from left (−1.35) to right (+1.35)
  const scanMin = -1.35;
  const scanMax = 1.35;

  useFrame((state) => {
    const reveal = reducedMotion ? 1 : progress.current.reveal;
    const scan = reducedMotion ? 1 : progress.current.scan;
    const turn = reducedMotion ? 0.18 : progress.current.turn;
    const t = state.clock.elapsedTime;

    const beamX = THREE.MathUtils.lerp(scanMin, scanMax, scan);

    if (rootRef.current) {
      const floatY = reducedMotion ? 0 : Math.sin(t * 0.4) * 0.025;
      rootRef.current.position.y = floatY;
      rootRef.current.rotation.y =
        0.35 + turn + (reducedMotion ? 0 : Math.sin(t * 0.14) * 0.02);
      rootRef.current.rotation.x =
        0.14 + (reducedMotion ? 0 : Math.sin(t * 0.11) * 0.01);
      // Fade-in scale from dark void
      const intro = smoothstep(0, 0.35, reveal);
      rootRef.current.scale.setScalar(THREE.MathUtils.lerp(0.82, 1, intro));
    }

    panelList.forEach((spec, index) => {
      const group = panelRefs.current[index];
      if (!group) return;
      const local = smoothstep(spec.delay, spec.delay + spec.span, reveal);
      const from: [number, number, number] = [
        spec.pos[0] + spec.collapse[0],
        spec.pos[1] + spec.collapse[1],
        spec.pos[2] + spec.collapse[2],
      ];
      group.position.set(...lerp3(from, spec.pos, local));
      group.rotation.set(...spec.rot);

      // Subtle depth peel while scan crosses this panel
      const panelX = spec.pos[0];
      const proximity = 1 - Math.min(1, Math.abs(beamX - panelX) / 0.55);
      const peel = proximity * scan * 0.04;
      group.position.z += peel;
    });

    if (beamRef.current && beamGlowRef.current) {
      const visible = reveal > 0.25 && scan < 0.995;
      beamRef.current.visible = visible || reducedMotion;
      beamGlowRef.current.visible = visible && !reducedMotion;
      beamRef.current.position.x = beamX;
      beamGlowRef.current.position.x = beamX;
      const opacity = reducedMotion
        ? 0.15
        : THREE.MathUtils.clamp(Math.sin(scan * Math.PI) * 0.9, 0.15, 0.85);
      const beamMat = beamRef.current.material as THREE.MeshBasicMaterial;
      const glowMat = beamGlowRef.current.material as THREE.MeshBasicMaterial;
      beamMat.opacity = opacity;
      glowMat.opacity = opacity * 0.35;
    }

    pointList.forEach((spec, index) => {
      const mesh = pointRefs.current[index];
      if (!mesh) return;
      const proximity = 1 - Math.min(1, Math.abs(beamX - spec.scanX) / 0.42);
      const lit = reducedMotion ? 0.55 : proximity * smoothstep(0.2, 1, scan);
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.15 + lit * 0.85;
      mesh.scale.setScalar(0.85 + lit * 0.45);
    });

    edgeRefs.current.forEach((edge, index) => {
      if (!edge) return;
      const mat = edge.material as THREE.MeshStandardMaterial;
      const edgeX = panelList[index]?.pos[0] ?? 0;
      const proximity = 1 - Math.min(1, Math.abs(beamX - edgeX) / 0.5);
      mat.emissiveIntensity = reducedMotion
        ? 0.2
        : 0.08 + proximity * scan * 0.55;
    });
  });

  return (
    <group ref={rootRef} position={[0.05, 0.05, 0]} scale={low ? 0.9 : 1}>
      {/* Technical spine — inspection chassis */}
      <mesh position={[0, 0, -0.15]}>
        <boxGeometry args={[0.06, 1.7, 0.06]} />
        <meshPhysicalMaterial
          color="#051df9"
          metalness={0.9}
          roughness={0.22}
          emissive="#051df9"
          emissiveIntensity={0.18}
          envMapIntensity={0.3}
        />
      </mesh>
      <mesh position={[0, -0.85, 0.1]}>
        <boxGeometry args={[1.9, 0.04, 0.04]} />
        <meshPhysicalMaterial
          color="#5a5e68"
          metalness={0.88}
          roughness={0.3}
          envMapIntensity={0.25}
        />
      </mesh>

      {panelList.map((spec, index) => (
        <group
          key={`panel-${index}`}
          ref={(node) => {
            panelRefs.current[index] = node;
          }}
        >
          <mesh castShadow receiveShadow>
            <boxGeometry args={spec.size} />
            <meshPhysicalMaterial
              color={spec.color}
              metalness={spec.color === "#051df9" ? 0.9 : 0.95}
              roughness={spec.color === "#051df9" ? 0.18 : 0.32}
              clearcoat={0.25}
              clearcoatRoughness={0.35}
              envMapIntensity={0.32}
              emissive={spec.color === "#051df9" ? "#051df9" : "#000000"}
              emissiveIntensity={spec.color === "#051df9" ? 0.12 : 0}
            />
          </mesh>
          {/* Blue structural edge — brightens as scan passes */}
          <mesh
            ref={(node) => {
              edgeRefs.current[index] = node;
            }}
            position={[0, spec.size[1] / 2 - 0.01, spec.size[2] / 2 + 0.005]}
          >
            <boxGeometry args={[spec.size[0] * 0.92, 0.012, 0.012]} />
            <meshStandardMaterial
              color="#051df9"
              metalness={0.85}
              roughness={0.25}
              emissive="#051df9"
              emissiveIntensity={0.1}
            />
          </mesh>
        </group>
      ))}

      {/* Yellow inspection beam */}
      <mesh ref={beamRef} position={[scanMin, 0, 0.75]}>
        <boxGeometry args={[0.018, 2.1, 1.35]} />
        <meshBasicMaterial
          color="#efff00"
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={beamGlowRef} position={[scanMin, 0, 0.75]}>
        <boxGeometry args={[0.12, 2.15, 1.4]} />
        <meshBasicMaterial
          color="#efff00"
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>

      {/* Inspection points — illuminate under the beam */}
      {pointList.map((spec, index) => (
        <mesh
          key={`point-${index}`}
          ref={(node) => {
            pointRefs.current[index] = node;
          }}
          position={spec.pos}
        >
          <octahedronGeometry args={[0.055, 0]} />
          <meshStandardMaterial
            color="#efff00"
            metalness={0.35}
            roughness={0.3}
            emissive="#efff00"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}
