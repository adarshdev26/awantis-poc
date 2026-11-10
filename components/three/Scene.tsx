"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import FloatingObject, {
  type FloatingObjectQuality,
} from "@/components/three/FloatingObject";
import type { ScrollTransform } from "@/components/three/scrollTransform";

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

type SceneProps = {
  scrollTransform?: React.MutableRefObject<ScrollTransform>;
  quality?: FloatingObjectQuality;
  autoSpin?: boolean;
  className?: string;
  /** Lighting/shadow treatment for dark or light section backgrounds. */
  tone?: "dark" | "light";
};

export default function Scene({
  scrollTransform,
  quality = "high",
  autoSpin,
  className,
  tone = "dark",
}: SceneProps) {
  const mouse = useRef({ x: 0, y: 0 });
  const reducedMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const low = quality === "low";
  const light = tone === "light";
  const spin = autoSpin ?? !scrollTransform;

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

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

  const shouldAnimate =
    visible && (!reducedMotion || Boolean(scrollTransform));

  return (
    <div ref={containerRef} className={className ?? "h-full w-full"}>
      <Canvas
        dpr={low ? [1, 1.25] : [1, 1.5]}
        frameloop={shouldAnimate ? "always" : "demand"}
        camera={{ position: [0.15, 0.2, 5.2], fov: 38, near: 0.1, far: 40 }}
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
        <ambientLight intensity={light ? 0.32 : 0.18} />
        <hemisphereLight
          color={light ? "#f4f6ff" : "#e8ecff"}
          groundColor={light ? "#d7d7d4" : "#121212"}
          intensity={light ? 0.48 : 0.35}
        />
        <directionalLight
          position={[5, 6, 4]}
          intensity={light ? 1.35 : 1.55}
          color="#ffffff"
        />
        <directionalLight
          position={[-4, 2.5, -2.5]}
          intensity={light ? 0.85 : 1.05}
          color="#051df9"
        />
        <pointLight
          position={[0.4, -2.2, 1.8]}
          intensity={light ? 0.28 : 0.35}
          color="#6b7cff"
          distance={10}
          decay={2}
        />

        <Suspense fallback={null}>
          <FloatingObject
            mouse={mouse}
            reducedMotion={reducedMotion}
            scrollTransform={scrollTransform}
            autoSpin={spin && !reducedMotion}
            quality={quality}
          />
          {!low ? (
            <Environment
              preset="studio"
              environmentIntensity={light ? 0.7 : 0.55}
            />
          ) : null}
        </Suspense>

        {!low ? (
          <ContactShadows
            position={[0, -1.7, 0]}
            opacity={light ? 0.22 : 0.38}
            scale={9}
            blur={3.2}
            far={3.5}
            frames={1}
            color={light ? "#1a1a1a" : "#05080f"}
          />
        ) : null}
      </Canvas>
    </div>
  );
}
