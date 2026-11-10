"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  createScrollTransform,
  type ScrollTransform,
} from "@/components/three/scrollTransform";
import type { FloatingObjectQuality } from "@/components/three/FloatingObject";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Scene = dynamic(() => import("@/components/three/Scene"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden
      className="h-full w-full bg-[radial-gradient(circle_at_center,rgba(5,29,249,0.1),transparent_65%)]"
    />
  ),
});

const SERVICES = [
  {
    id: "ai-automation",
    index: "01",
    title: "AI Implementation & Automation",
    description:
      "We embed production-grade models into your workflows — from copilots and document intelligence to autonomous operations that compound over time.",
  },
  {
    id: "custom-software",
    index: "02",
    title: "Custom Software Development",
    description:
      "Purpose-built platforms and products engineered for clarity, speed, and scale — with the craft of a studio and the rigor of a systems team.",
  },
  {
    id: "private-ai",
    index: "03",
    title: "Private AI & Infrastructure",
    description:
      "Secure, private AI stacks and cloud-native infrastructure designed for sovereignty, observability, and long-horizon reliability.",
  },
  {
    id: "cybersecurity",
    index: "04",
    title: "Cybersecurity",
    description:
      "Hardened architectures, continuous assurance, and pragmatic security engineering that protect intelligent systems without slowing delivery.",
  },
] as const;

/** Pose keyframes per service — GSAP tweens this object; R3F reads the same ref. */
const POSES: ScrollTransform[] = [
  createScrollTransform({
    x: 0.15,
    y: 0.05,
    z: 0,
    rx: 0.12,
    ry: 0.45,
    rz: 0.04,
    scale: 1,
  }),
  createScrollTransform({
    x: -0.35,
    y: 0.2,
    z: 0.15,
    rx: -0.15,
    ry: 1.15,
    rz: -0.08,
    scale: 1.12,
  }),
  createScrollTransform({
    x: 0.4,
    y: -0.15,
    z: -0.1,
    rx: 0.35,
    ry: 1.95,
    rz: 0.12,
    scale: 0.92,
  }),
  createScrollTransform({
    x: -0.1,
    y: 0.1,
    z: 0.25,
    rx: -0.22,
    ry: 2.75,
    rz: -0.05,
    scale: 1.05,
  }),
];

const ACTIVE = "#051df9";
const INACTIVE = "#8a8a8a";

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  // Single mutable pose object: GSAP writes, useFrame reads — never React state.
  const scrollProxy = useRef<ScrollTransform>(createScrollTransform(POSES[0]));
  const [quality, setQuality] = useState<FloatingObjectQuality>("high");

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setQuality(media.matches ? "low" : "high");
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const pin = pinRef.current;
      if (!section || !pin) return;

      const panels = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll("[data-service-panel]"),
      );
      const progressItems = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll("[data-service-progress]"),
      );
      const progressMarkers = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll("[data-service-marker]"),
      );

      const setProgressActive = (activeIndex: number) => {
        progressItems.forEach((item, index) => {
          const isActive = index === activeIndex;
          gsap.set(item, {
            color: isActive ? ACTIVE : INACTIVE,
          });
          gsap.set(progressMarkers[index], {
            backgroundColor: isActive ? ACTIVE : "rgba(18,18,18,0.12)",
            scaleY: isActive ? 1 : 0.55,
          });
        });
      };

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, isMobile, reduceMotion } = context.conditions!;

          if (reduceMotion) {
            gsap.set(panels, { opacity: 1, y: 0 });
            progressItems.forEach((item) => {
              gsap.set(item, { color: ACTIVE });
            });
            gsap.set(progressMarkers, {
              backgroundColor: ACTIVE,
              scaleY: 1,
            });
            Object.assign(scrollProxy.current, POSES[0]);
            return;
          }

          Object.assign(scrollProxy.current, POSES[0]);

          if (isDesktop) {
            gsap.set(panels, { opacity: 0, y: 28 });
            gsap.set(panels[0], { opacity: 1, y: 0 });
            setProgressActive(0);

            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: pin,
                start: "top top",
                end: () => `+=${Math.round(window.innerHeight * 3.2)}`,
                pin: true,
                scrub: 0.65,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            for (let i = 0; i < SERVICES.length - 1; i += 1) {
              const at = i;

              tl.to(
                scrollProxy.current,
                {
                  x: POSES[i + 1].x,
                  y: POSES[i + 1].y,
                  z: POSES[i + 1].z,
                  rx: POSES[i + 1].rx,
                  ry: POSES[i + 1].ry,
                  rz: POSES[i + 1].rz,
                  scale: POSES[i + 1].scale,
                  duration: 1,
                },
                at,
              );

              tl.to(
                panels[i],
                { opacity: 0, y: -28, duration: 0.35 },
                at + 0.15,
              );
              tl.to(
                progressItems[i],
                { color: INACTIVE, duration: 0.3 },
                at + 0.15,
              );
              tl.to(
                progressMarkers[i],
                {
                  backgroundColor: "rgba(18,18,18,0.12)",
                  scaleY: 0.55,
                  duration: 0.3,
                },
                at + 0.15,
              );
              tl.fromTo(
                panels[i + 1],
                { opacity: 0, y: 28 },
                { opacity: 1, y: 0, duration: 0.4 },
                at + 0.3,
              );
              tl.to(
                progressItems[i + 1],
                { color: ACTIVE, duration: 0.3 },
                at + 0.3,
              );
              tl.to(
                progressMarkers[i + 1],
                {
                  backgroundColor: ACTIVE,
                  scaleY: 1,
                  duration: 0.3,
                },
                at + 0.3,
              );
            }
          }

          if (isMobile) {
            gsap.set(panels, { opacity: 1, y: 0 });
            setProgressActive(-1);
            gsap.set(progressMarkers, {
              backgroundColor: ACTIVE,
              scaleY: 1,
            });
            gsap.set(progressItems, { color: "#121212" });

            panels.forEach((panel) => {
              gsap.from(panel, {
                opacity: 0,
                y: 28,
                duration: 0.65,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: panel,
                  start: "top 88%",
                  toggleActions: "play none none reverse",
                },
              });
            });

            gsap.to(scrollProxy.current, {
              ry: POSES[0].ry + 1.1,
              rx: POSES[0].rx + 0.18,
              scale: 1.05,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top 75%",
                end: "bottom top",
                scrub: 0.85,
              },
            });
          }
        },
      );

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative bg-aw-light text-aw-ink"
    >
      <div ref={pinRef} className="relative min-h-[100svh] overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_48%_42%_at_78%_38%,rgba(5,29,249,0.1),transparent_68%),linear-gradient(180deg,#f7f7f5_0%,#f0f0ee_48%,#ececec_100%)]"
        />

        <div className="relative z-10 mx-auto grid min-h-[100svh] w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 py-20 md:grid-cols-12 md:gap-10 md:px-10 md:py-0">
          <div className="order-2 md:order-1 md:col-span-5 lg:col-span-5">
            <p className="mb-4 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-aw-blue">
              <span className="h-px w-7 bg-aw-yellow" aria-hidden />
              Capabilities
            </p>
            <h2 className="font-display max-w-[15ch] text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.08] font-extrabold tracking-[-0.03em] text-aw-ink">
              Services engineered for what&apos;s next.
            </h2>

            <ol
              className="mt-9 hidden gap-1 md:flex md:flex-col"
              aria-label="Service progress"
            >
              {SERVICES.map((service) => (
                <li
                  key={service.id}
                  data-service-progress
                  className="grid grid-cols-[10px_auto_1fr] items-start gap-x-3 py-2.5 text-sm leading-snug tracking-wide"
                  style={{ color: INACTIVE }}
                >
                  <span
                    data-service-marker
                    className="mt-1.5 h-4 w-[3px] origin-top rounded-full"
                    style={{ backgroundColor: "rgba(18,18,18,0.12)" }}
                    aria-hidden
                  />
                  <span className="font-mono text-[0.7rem] font-semibold tracking-[0.14em]">
                    {service.index}
                  </span>
                  <span className="text-[0.92rem] font-medium text-balance">
                    {service.title}
                  </span>
                </li>
              ))}
            </ol>

            <div className="relative mt-10 md:mt-12 md:min-h-[15rem]">
              {SERVICES.map((service, index) => (
                <article
                  key={service.id}
                  data-service-panel
                  className="md:absolute md:inset-x-0 md:top-0"
                  aria-label={service.title}
                >
                  <p className="font-mono text-sm font-semibold tracking-[0.22em] text-aw-blue">
                    {service.index}
                  </p>
                  <h3 className="font-display mt-3 max-w-[16ch] text-[clamp(1.55rem,2.4vw,2.05rem)] font-bold leading-[1.15] tracking-[-0.025em] text-aw-ink">
                    {service.title}
                  </h3>
                  <p className="mt-5 max-w-md text-[1.02rem] leading-[1.7] text-aw-muted">
                    {service.description}
                  </p>
                  {index < SERVICES.length - 1 ? (
                    <div className="my-10 h-px w-full bg-black/10 md:hidden" />
                  ) : null}
                </article>
              ))}
            </div>
          </div>

          <div className="order-1 md:order-2 md:col-span-7">
            <div className="relative mx-auto h-[38vh] min-h-[240px] w-full max-w-xl md:mx-0 md:h-[min(72vh,640px)] md:max-w-none">
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(5,29,249,0.14)_0%,transparent_68%)] blur-2xl" />
              <Scene
                scrollTransform={scrollProxy}
                autoSpin={false}
                quality={quality}
                tone="light"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
