"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import SecuritySculpture from "@/components/three/SecuritySculpture";
import type { SecurityProgress } from "@/components/three/securityProgress";

type Quality = "high" | "low";

type SecuritySceneProps = {
  progress: React.MutableRefObject<SecurityProgress>;
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

export default function SecurityScene({
  progress,
  quality = "high",
  className,
}: SecuritySceneProps) {
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
        camera={{ position: [2.2, 1.1, 4.5], fov: 34, near: 0.1, far: 40 }}
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
        <ambientLight intensity={0.16} />
        <hemisphereLight
          color="#3a4258"
          groundColor="#121212"
          intensity={0.28}
        />
        <directionalLight
          position={[4.5, 5.5, 3]}
          intensity={1.15}
          color="#f0f2f5"
        />
        <directionalLight
          position={[-3.5, 2, -2]}
          intensity={0.85}
          color="#051df9"
        />
        <pointLight
          position={[0.5, 1.5, 2]}
          intensity={0.25}
          color="#6b7cff"
          distance={8}
        />

        <Suspense fallback={null}>
          <SecuritySculpture
            progress={progress}
            reducedMotion={reducedMotion}
            quality={quality}
          />
          {!low ? (
            <Environment preset="warehouse" environmentIntensity={0.22} />
          ) : null}
        </Suspense>

        <ContactShadows
          position={[0, -1.4, 0]}
          opacity={low ? 0.28 : 0.4}
          scale={10}
          blur={2.8}
          far={3.5}
          frames={1}
          color="#050505"
        />
      </Canvas>
    </div>
  );
}
