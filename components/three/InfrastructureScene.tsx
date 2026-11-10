"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import InfrastructureSculpture from "@/components/three/InfrastructureSculpture";
import type { InfrastructureProgress } from "@/components/three/infrastructureProgress";

type Quality = "high" | "low";

type InfrastructureSceneProps = {
  progress: React.MutableRefObject<InfrastructureProgress>;
  quality?: Quality;
  className?: string;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

export default function InfrastructureScene({
  progress,
  quality = "high",
  className,
}: InfrastructureSceneProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const low = quality === "low";

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className ?? "h-full w-full"}>
      <Canvas
        dpr={low ? [1, 1.25] : [1, 1.5]}
        frameloop={visible ? "always" : "demand"}
        camera={{ position: [2.4, 1.15, 4.6], fov: 35, near: 0.1, far: 40 }}
        gl={{
          antialias: !low,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        style={{ width: "100%", height: "100%" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        {/* Neutral cool lighting — avoid warm/magenta environment cast */}
        <ambientLight intensity={0.48} />
        <hemisphereLight
          color="#ffffff"
          groundColor="#cfd4dc"
          intensity={0.42}
        />
        <directionalLight
          position={[4.5, 6.5, 3.5]}
          intensity={1.55}
          color="#ffffff"
        />
        <directionalLight
          position={[-3.5, 2.5, -1.5]}
          intensity={0.55}
          color="#051df9"
        />
        <directionalLight
          position={[1.5, 2, 4]}
          intensity={0.35}
          color="#eef2f7"
        />

        <Suspense fallback={null}>
          <InfrastructureSculpture
            progress={progress}
            reducedMotion={reducedMotion}
            quality={quality}
          />
          {!low ? (
            <Environment preset="warehouse" environmentIntensity={0.28} />
          ) : null}
        </Suspense>

        <ContactShadows
          position={[0, -1.45, 0]}
          opacity={low ? 0.14 : 0.2}
          scale={10}
          blur={3.2}
          far={3.8}
          frames={1}
          color="#1a2230"
        />
      </Canvas>
    </div>
  );
}
