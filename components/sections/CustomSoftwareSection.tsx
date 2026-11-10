"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  createSystemsProgress,
  type SystemsProgress,
} from "@/components/three/systemsProgress";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ModularSystemScene = dynamic(
  () => import("@/components/three/ModularSystemScene"),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden
        className="h-full w-full bg-[radial-gradient(circle_at_center,rgba(5,29,249,0.08),transparent_65%)]"
      />
    ),
  },
);

const POINTS = [
  {
    title: "Custom Software Development",
    detail:
      "Products and platforms engineered around your workflows — clear architecture, durable delivery.",
  },
  {
    title: "End-to-End AI Engineering",
    detail:
      "From model selection to production systems — evaluation, orchestration and ongoing optimisation.",
  },
  {
    title: "System Integration & Automation",
    detail:
      "Connect data, tools and processes so intelligence moves through the business without friction.",
  },
] as const;

type Quality = "high" | "low";

export default function CustomSoftwareSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<SystemsProgress>(createSystemsProgress());
  const [quality, setQuality] = useState<Quality>("high");

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

      const content = section.querySelectorAll("[data-systems-content]");
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
            Object.assign(progressRef.current, { assemble: 1, turn: 0.2 });
            gsap.set(content, { opacity: 1, y: 0 });
            return;
          }

          Object.assign(progressRef.current, { assemble: 0, turn: 0 });
          gsap.set(content, { opacity: 0, y: 28 });

          if (isDesktop) {
            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: pin,
                start: "top top",
                end: () => `+=${Math.round(window.innerHeight * 1.75)}`,
                pin: true,
                scrub: 0.7,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            // Core expands first, then panels converge from the sides
            tl.to(
              progressRef.current,
              { assemble: 1, turn: 0.32, duration: 1 },
              0,
            );

            tl.to(
              content,
              {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.07,
              },
              0.18,
            );
          }

          if (isMobile) {
            gsap.to(content, {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              stagger: 0.08,
              scrollTrigger: {
                trigger: section,
                start: "top 78%",
                toggleActions: "play none none reverse",
              },
            });

            gsap.fromTo(
              progressRef.current,
              { assemble: 0.12, turn: 0 },
              {
                assemble: 1,
                turn: 0.24,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top 80%",
                  end: "bottom 35%",
                  scrub: 0.85,
                },
              },
            );
          }
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="custom-software"
      ref={sectionRef}
      className="relative text-aw-ink"
      style={{ backgroundColor: "#F5F7FA" }}
    >
      <div ref={pinRef} className="relative min-h-[100svh] overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_48%_42%_at_72%_38%,rgba(5,29,249,0.09),transparent_68%),radial-gradient(ellipse_32%_28%_at_18%_72%,rgba(5,29,249,0.04),transparent_70%)]"
        />

        <div className="relative z-10 mx-auto grid min-h-[100svh] w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 py-16 md:grid-cols-12 md:gap-10 md:px-10 md:py-8 lg:gap-14">
          <div className="order-2 flex flex-col justify-center md:order-1 md:col-span-5 lg:col-span-5">
            <p
              data-systems-content
              className="mb-4 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-aw-blue"
            >
              <span className="h-px w-7 bg-aw-yellow" aria-hidden />
              Custom Software &amp; AI Engineering
            </p>

            <h2
              data-systems-content
              className="font-display text-[clamp(1.7rem,3.1vw,2.55rem)] leading-[1.12] font-extrabold tracking-[-0.03em] text-aw-ink"
            >
              <span className="block">From Complex Ideas</span>
              <span className="block">to Complete Systems.</span>
            </h2>

            <p
              data-systems-content
              className="mt-5 max-w-md text-base leading-[1.65] text-aw-muted md:text-[1.02rem]"
            >
              We design and build custom software and AI-powered solutions,
              bringing data, systems and workflows together into products that
              work seamlessly.
            </p>

            <ul
              className="mt-7 space-y-3.5"
              aria-label="Custom software capabilities"
            >
              {POINTS.map((point) => (
                <li
                  key={point.title}
                  data-systems-content
                  className="border-l-2 border-aw-blue/30 pl-3.5"
                >
                  <p className="text-sm font-semibold tracking-wide text-aw-ink">
                    {point.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-aw-muted">
                    {point.detail}
                  </p>
                </li>
              ))}
            </ul>

            <div data-systems-content className="mt-8">
              <a
                href="#intro"
                className="inline-flex h-11 items-center justify-center bg-aw-blue px-7 text-sm font-semibold tracking-wide text-white shadow-[0_10px_28px_rgba(5,29,249,0.22)] transition-[transform,background-color] hover:bg-aw-blue-soft active:scale-[0.98]"
              >
                Explore Our Approach
              </a>
            </div>
          </div>

          <div className="order-1 md:order-2 md:col-span-7">
            <div className="relative mx-auto h-[36vh] min-h-[240px] w-full max-w-xl md:mx-0 md:h-[min(62vh,540px)] md:max-w-none">
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(5,29,249,0.1)_0%,transparent_70%)] blur-2xl" />
              <ModularSystemScene
                progress={progressRef}
                quality={quality}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
