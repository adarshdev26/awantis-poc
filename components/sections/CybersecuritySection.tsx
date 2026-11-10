"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  createSecurityProgress,
  type SecurityProgress,
} from "@/components/three/securityProgress";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SecurityScene = dynamic(
  () => import("@/components/three/SecurityScene"),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden
        className="h-full w-full bg-[radial-gradient(circle_at_center,rgba(5,29,249,0.14),transparent_65%)]"
      />
    ),
  },
);

const POINTS = [
  {
    title: "Security Testing",
    detail: "Structured tests that expose weaknesses before adversaries do.",
  },
  {
    title: "Technical Assessments",
    detail: "Deep reviews of architecture, controls and operational readiness.",
  },
  {
    title: "Remediation",
    detail: "Prioritised fixes that harden systems without stalling delivery.",
  },
  {
    title: "Technical Investigation",
    detail: "Evidence-led analysis when incidents demand clarity and speed.",
  },
] as const;

type Quality = "high" | "low";

export default function CybersecuritySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<SecurityProgress>(createSecurityProgress());
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

      const content = section.querySelectorAll("[data-security-content]");
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
            Object.assign(progressRef.current, {
              reveal: 1,
              scan: 1,
              turn: 0.2,
            });
            gsap.set(content, { opacity: 1, y: 0 });
            return;
          }

          Object.assign(progressRef.current, {
            reveal: 0,
            scan: 0,
            turn: 0,
          });
          gsap.set(content, { opacity: 0, y: 28 });

          if (isDesktop) {
            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: pin,
                start: "top top",
                end: () => `+=${Math.round(window.innerHeight * 1.85)}`,
                pin: true,
                scrub: 0.7,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            // 1) Structure emerges from charcoal
            tl.to(
              progressRef.current,
              { reveal: 1, turn: 0.18, duration: 0.4 },
              0,
            );
            // 2) Yellow inspection beam travels across
            tl.to(
              progressRef.current,
              { scan: 1, turn: 0.34, duration: 0.55 },
              0.28,
            );
            // 3) Copy arrives with the scan
            tl.to(
              content,
              {
                opacity: 1,
                y: 0,
                duration: 0.35,
                stagger: 0.06,
              },
              0.2,
            );
          }

          if (isMobile) {
            gsap.to(content, {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              stagger: 0.07,
              scrollTrigger: {
                trigger: section,
                start: "top 78%",
                toggleActions: "play none none reverse",
              },
            });

            gsap.fromTo(
              progressRef.current,
              { reveal: 0.2, scan: 0, turn: 0 },
              {
                reveal: 1,
                scan: 1,
                turn: 0.26,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top 80%",
                  end: "bottom 30%",
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
      id="cybersecurity"
      ref={sectionRef}
      className="relative bg-aw-charcoal text-white"
    >
      <div ref={pinRef} className="relative min-h-[100svh] overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_48%_42%_at_74%_40%,rgba(5,29,249,0.2),transparent_68%),radial-gradient(ellipse_30%_28%_at_18%_78%,rgba(239,255,0,0.04),transparent_70%),linear-gradient(165deg,#1c1c1c_0%,#232323_50%,#1a1a1a_100%)]"
        />
        <div className="aw-grain opacity-[0.05]" />

        <div className="relative z-10 mx-auto grid min-h-[100svh] w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 py-16 md:grid-cols-12 md:gap-10 md:px-10 md:py-8 lg:gap-14">
          <div className="order-2 flex flex-col justify-center md:order-1 md:col-span-5 lg:col-span-5">
            <p
              data-security-content
              className="mb-4 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-aw-yellow"
            >
              <span className="h-px w-7 bg-aw-yellow" aria-hidden />
              Security &amp; Resilience
            </p>

            <h2
              data-security-content
              className="font-display text-[clamp(1.7rem,3.1vw,2.55rem)] leading-[1.12] font-extrabold tracking-[-0.03em] text-white"
            >
              <span className="block">Find the Weak Points.</span>
              <span className="block">Strengthen What Matters.</span>
            </h2>

            <p
              data-security-content
              className="mt-5 max-w-md text-base leading-[1.65] text-white/62 md:text-[1.02rem]"
            >
              Identify vulnerabilities, investigate risks and strengthen your
              systems through structured security testing and technical
              assessments.
            </p>

            <ul
              className="mt-7 grid gap-3.5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2"
              aria-label="Security services"
            >
              {POINTS.map((point, index) => (
                <li
                  key={point.title}
                  data-security-content
                  className="border-l-2 border-aw-blue/50 pl-3.5"
                >
                  <p className="font-mono text-[0.65rem] tracking-[0.18em] text-aw-blue">
                    0{index + 1}
                  </p>
                  <p className="mt-1 text-sm font-semibold tracking-wide text-white">
                    {point.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-white/55">
                    {point.detail}
                  </p>
                </li>
              ))}
            </ul>

            <div data-security-content className="mt-8">
              <a
                href="#contact"
                className="inline-flex h-11 items-center justify-center bg-aw-blue px-7 text-sm font-semibold tracking-wide text-white shadow-[0_10px_28px_rgba(5,29,249,0.28)] transition-[transform,background-color] hover:bg-aw-blue-soft active:scale-[0.98]"
              >
                Explore Security Services
              </a>
            </div>
          </div>

          <div className="order-1 md:order-2 md:col-span-7">
            <div className="relative mx-auto h-[36vh] min-h-[240px] w-full max-w-xl md:mx-0 md:h-[min(62vh,540px)] md:max-w-none">
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(5,29,249,0.18)_0%,transparent_70%)] blur-2xl" />
              <SecurityScene progress={progressRef} quality={quality} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
