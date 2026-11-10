"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import EarthGlobe from "@/components/three/EarthGlobe";
import type { ContactProgress } from "@/components/three/contactProgress";

type Quality = "high" | "low";

type EarthSceneProps = {
  progress: React.MutableRefObject<ContactProgress>;
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

export default function EarthScene({
  progress,
  quality = "high",
  className,
}: EarthSceneProps) {
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
        camera={{ position: [0, 0.35, 6.2], fov: 36, near: 0.1, far: 40 }}
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
        <ambientLight intensity={0.12} />
        <hemisphereLight
          color="#1a2a5c"
          groundColor="#050505"
          intensity={0.35}
        />
        <directionalLight
          position={[3, 4, 2]}
          intensity={1.1}
          color="#dce6ff"
        />
        <directionalLight
          position={[-4, 1, -2]}
          intensity={0.7}
          color="#051df9"
        />
        <pointLight
          position={[0, -1, 3]}
          intensity={0.35}
          color="#3a4cff"
          distance={12}
        />

        <Suspense fallback={null}>
          <EarthGlobe
            progress={progress}
            reducedMotion={reducedMotion}
            quality={quality}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
