"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import ModularSystemSculpture from "@/components/three/ModularSystemSculpture";
import type { SystemsProgress } from "@/components/three/systemsProgress";

type Quality = "high" | "low";

type ModularSystemSceneProps = {
  progress: React.MutableRefObject<SystemsProgress>;
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

export default function ModularSystemScene({
  progress,
  quality = "high",
  className,
}: ModularSystemSceneProps) {
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
        camera={{ position: [0.2, 0.55, 5.2], fov: 34, near: 0.1, far: 40 }}
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
        <ambientLight intensity={0.46} />
        <hemisphereLight
          color="#ffffff"
          groundColor="#cfd4dc"
          intensity={0.4}
        />
        <directionalLight
          position={[4, 6, 4]}
          intensity={1.5}
          color="#ffffff"
        />
        <directionalLight
          position={[-4, 2.5, -2]}
          intensity={0.5}
          color="#051df9"
        />
        <directionalLight
          position={[0, 3, 5]}
          intensity={0.3}
          color="#eef2f7"
        />

        <Suspense fallback={null}>
          <ModularSystemSculpture
            progress={progress}
            reducedMotion={reducedMotion}
            quality={quality}
          />
          {!low ? (
            <Environment preset="warehouse" environmentIntensity={0.26} />
          ) : null}
        </Suspense>

        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={low ? 0.14 : 0.2}
          scale={11}
          blur={3.2}
          far={4}
          frames={1}
          color="#1a2230"
        />
      </Canvas>
    </div>
  );
}
