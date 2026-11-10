"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import SupportSculpture from "@/components/three/SupportSculpture";
import type { SupportProgress } from "@/components/three/supportProgress";

type Quality = "high" | "low";

type SupportSceneProps = {
  progress: React.MutableRefObject<SupportProgress>;
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

export default function SupportScene({
  progress,
  quality = "high",
  className,
}: SupportSceneProps) {
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
        dpr={low ? [1, 1.25] : [1, 1.4]}
        frameloop={visible ? "always" : "demand"}
        camera={{ position: [2.4, 1.2, 4.4], fov: 34, near: 0.1, far: 40 }}
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
        <ambientLight intensity={0.45} />
        <hemisphereLight
          color="#ffffff"
          groundColor="#d0d4dc"
          intensity={0.4}
        />
        <directionalLight
          position={[4, 6, 3.5]}
          intensity={1.4}
          color="#ffffff"
        />
        <directionalLight
          position={[-3, 2, -2]}
          intensity={0.45}
          color="#051df9"
        />

        <Suspense fallback={null}>
          <SupportSculpture
            progress={progress}
            reducedMotion={reducedMotion}
            quality={quality}
          />
          {!low ? (
            <Environment preset="warehouse" environmentIntensity={0.24} />
          ) : null}
        </Suspense>

        <ContactShadows
          position={[0, -1.25, 0]}
          opacity={0.18}
          scale={9}
          blur={3}
          far={3.5}
          frames={1}
          color="#1a2230"
        />
      </Canvas>
    </div>
  );
}
