"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const content = section.querySelectorAll("[data-intro]");

      // Continuity with the light Services section — stay on the light system.
      gsap.set(section, {
        backgroundColor: "#f3f3f1",
        color: "#121212",
      });

      if (prefersReducedMotion()) {
        gsap.set(content, { clearProps: "all", opacity: 1, y: 0 });
        return;
      }

      gsap.set(content, { opacity: 0, y: 36 });

      gsap.to(content, {
        opacity: 1,
        y: 0,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: "top 40%",
          scrub: 0.6,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="intro"
      ref={sectionRef}
      className="relative z-10 min-h-[70vh] px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-12 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <p
            data-intro
            className="text-xs font-semibold uppercase tracking-[0.28em] text-aw-blue"
          >
            Introduction
          </p>
          <h2
            data-intro
            className="font-display mt-5 text-[clamp(2rem,4vw,3.4rem)] leading-[1.05] font-extrabold tracking-[-0.03em]"
          >
            From signal to system — crafted for the frontier.
          </h2>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <p data-intro className="text-lg leading-relaxed text-current/70">
            We partner with ambitious teams to engineer intelligent products:
            models that reason, platforms that scale, and infrastructure that
            stays ahead of demand. The hero above is a living prototype of the
            motion and spatial craft we bring into every engagement.
          </p>
          <div
            data-intro
            className="mt-10 grid gap-6 sm:grid-cols-3"
            id="contact"
          >
            {[
              { label: "AI Systems", detail: "Applied research to production" },
              { label: "Software", detail: "Platforms built to compound" },
              { label: "Infrastructure", detail: "Reliable at every scale" },
            ].map((item) => (
              <div key={item.label} className="border-t border-current/15 pt-4">
                <p className="text-sm font-semibold tracking-wide">
                  {item.label}
                </p>
                <p className="mt-2 text-sm text-current/55">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
