"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  createContactProgress,
  type ContactProgress,
} from "@/components/three/contactProgress";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const EarthScene = dynamic(() => import("@/components/three/EarthScene"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden
      className="h-full w-full bg-[radial-gradient(ellipse_at_bottom,rgba(5,29,249,0.18),transparent_55%)]"
    />
  ),
});

type Quality = "high" | "low";

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<ContactProgress>(createContactProgress());
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
      if (!section) return;

      const content = section.querySelectorAll("[data-contact-content]");
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { reduceMotion } = context.conditions!;

          if (reduceMotion) {
            Object.assign(progressRef.current, { rise: 1 });
            gsap.set(content, { opacity: 1, y: 0 });
            return;
          }

          Object.assign(progressRef.current, { rise: 0 });
          gsap.set(content, { opacity: 0, y: 28 });

          gsap.to(progressRef.current, {
            rise: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "top 20%",
              scrub: 0.75,
            },
          });

          gsap.to(content, {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: section,
              start: "top 65%",
              toggleActions: "play none none reverse",
            },
          });
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative isolate min-h-[100svh] overflow-hidden text-white"
      style={{ backgroundColor: "#161616" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_100%,rgba(5,29,249,0.28),transparent_60%),radial-gradient(ellipse_50%_30%_at_50%_70%,rgba(5,29,249,0.1),transparent_70%)]"
      />
      <div className="aw-grain opacity-[0.07]" />

      {/* Planet sits behind copy */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[18%] z-0 md:top-[8%]"
      >
        <EarthScene progress={progressRef} quality={quality} />
      </div>

      {/* Horizon fade so the sphere reads as rising from darkness */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[28%] bg-gradient-to-t from-[#161616] via-[#161616]/85 to-transparent"
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-4xl flex-col items-center justify-start px-6 pb-40 pt-28 text-center md:justify-center md:px-10 md:pb-48 md:pt-24">
        <p
          data-contact-content
          className="mb-5 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-aw-yellow"
        >
          <span className="h-px w-7 bg-aw-yellow" aria-hidden />
          Let&apos;s Build What&apos;s Next
          <span className="h-px w-7 bg-aw-yellow" aria-hidden />
        </p>

        <h2
          data-contact-content
          className="font-display max-w-[16ch] text-[clamp(2rem,5vw,3.5rem)] leading-[1.08] font-extrabold tracking-[-0.035em] text-white"
        >
          Have an ambitious idea? Let&apos;s make it real.
        </h2>

        <p
          data-contact-content
          className="mt-6 max-w-xl text-base leading-[1.7] text-white/60 md:text-lg"
        >
          Whether you&apos;re building something new, modernising existing
          systems or exploring AI, let&apos;s talk about what comes next.
        </p>

        <div data-contact-content className="mt-10">
          <a
            href="#contact"
            className="inline-flex h-12 items-center justify-center bg-aw-blue px-8 text-sm font-semibold tracking-wide text-white shadow-[0_12px_36px_rgba(5,29,249,0.35)] transition-[transform,background-color] hover:bg-aw-blue-soft active:scale-[0.98]"
          >
            Start a Conversation
          </a>
        </div>
      </div>
    </section>
  );
}
