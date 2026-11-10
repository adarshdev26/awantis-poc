"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ContactProgress } from "@/components/three/contactProgress";

type Quality = "high" | "low";

type EarthGlobeProps = {
  progress: React.MutableRefObject<ContactProgress>;
  reducedMotion?: boolean;
  quality?: Quality;
};

function createSurfaceTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Deep ocean base
  const ocean = ctx.createLinearGradient(0, 0, 0, 512);
  ocean.addColorStop(0, "#07122e");
  ocean.addColorStop(0.5, "#0a1a45");
  ocean.addColorStop(1, "#061028");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, 1024, 512);

  // Soft continental masses — original procedural marks, not a stock map
  const lands = [
    [180, 200, 160, 90],
    [320, 240, 120, 70],
    [520, 180, 200, 110],
    [700, 260, 140, 80],
    [860, 190, 110, 95],
    [240, 340, 180, 60],
    [600, 360, 150, 55],
  ] as const;

  for (const [x, y, w, h] of lands) {
    const grad = ctx.createRadialGradient(x, y, 4, x, y, w * 0.7);
    grad.addColorStop(0, "#1c3f6e");
    grad.addColorStop(0.55, "#143258");
    grad.addColorStop(1, "rgba(10, 26, 69, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x, y, w * 0.55, h * 0.55, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Sparse city lights
  ctx.fillStyle = "rgba(239, 255, 0, 0.35)";
  for (let i = 0; i < 48; i += 1) {
    const x = (i * 97) % 1024;
    const y = 140 + ((i * 53) % 240);
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

export default function EarthGlobe({
  progress,
  reducedMotion = false,
  quality = "high",
}: EarthGlobeProps) {
  const rootRef = useRef<THREE.Group>(null);
  const globeRef = useRef<THREE.Mesh>(null);
  const [surfaceMap, setSurfaceMap] = useState<THREE.CanvasTexture | null>(
    null,
  );
  const low = quality === "low";
  const segments = low ? 48 : 80;

  useEffect(() => {
    const texture = createSurfaceTexture();
    if (!texture) return;
    setSurfaceMap(texture);
    return () => {
      texture.dispose();
    };
  }, []);

  const atmosphereMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#051df9"),
        transparent: true,
        opacity: 0.14,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    [],
  );

  const glowMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#3a4cff"),
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    [],
  );

  useFrame((_, delta) => {
    const rise = reducedMotion ? 1 : progress.current.rise;
    // Start below the horizon, settle with upper hemisphere in frame
    const y = THREE.MathUtils.lerp(-3.6, -1.55, rise);

    if (rootRef.current) {
      rootRef.current.position.y = y;
      rootRef.current.rotation.x = 0.18;
    }

    if (globeRef.current && !reducedMotion) {
      globeRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group ref={rootRef} position={[0, -3.6, 0]} scale={low ? 0.92 : 1}>
      <mesh ref={globeRef}>
        <sphereGeometry args={[2.85, segments, segments]} />
        <meshStandardMaterial
          map={surfaceMap ?? undefined}
          color={surfaceMap ? "#ffffff" : "#0a1a45"}
          roughness={0.88}
          metalness={0.08}
          emissive="#051df9"
          emissiveIntensity={0.04}
        />
      </mesh>

      {/* Atmospheric rim */}
      <mesh scale={1.045} material={atmosphereMat}>
        <sphereGeometry args={[2.85, low ? 32 : 48, low ? 32 : 48]} />
      </mesh>

      {/* Soft outer glow */}
      {!low ? (
        <mesh scale={1.12} material={glowMat}>
          <sphereGeometry args={[2.85, 32, 32]} />
        </mesh>
      ) : null}
    </group>
  );
}
