"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  createSupportProgress,
  type SupportProgress,
} from "@/components/three/supportProgress";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SupportScene = dynamic(() => import("@/components/three/SupportScene"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden
      className="h-full w-full bg-[radial-gradient(circle_at_center,rgba(5,29,249,0.08),transparent_65%)]"
    />
  ),
});

const OFFERINGS = [
  {
    title: "Complete Project Delivery",
    detail:
      "Awantis owns the full engagement — discovery, design, build and handover — so complex initiatives ship as complete systems.",
  },
  {
    title: "Dedicated Team Specialists",
    detail:
      "Add experienced engineers and AI specialists into your existing team when you need capacity without losing momentum.",
  },
  {
    title: "Infrastructure & System Support",
    detail:
      "Ongoing care for the platforms you run — monitoring, optimisation and reliable support as your systems grow.",
  },
] as const;

type Quality = "high" | "low";

export default function DedicatedSupportSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<SupportProgress>(createSupportProgress());
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

      const content = section.querySelectorAll("[data-support-content]");
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { reduceMotion } = context.conditions!;

          if (reduceMotion) {
            Object.assign(progressRef.current, { join: 1 });
            gsap.set(content, { opacity: 1, y: 0 });
            return;
          }

          Object.assign(progressRef.current, { join: 0 });
          gsap.set(content, { opacity: 0, y: 24 });

          // Simple scrub — no long pin. Module docks as the section enters view.
          gsap.to(progressRef.current, {
            join: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              end: "center 45%",
              scrub: 0.6,
            },
          });

          gsap.to(content, {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
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
      id="dedicated-support"
      ref={sectionRef}
      className="relative text-aw-ink"
      style={{ backgroundColor: "#F5F7FA" }}
    >
      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_78%_35%,rgba(5,29,249,0.08),transparent_70%)]"
        />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 py-20 md:grid-cols-12 md:gap-12 md:px-10 md:py-28 lg:gap-16">
          <div className="order-2 md:order-1 md:col-span-6 lg:col-span-5">
            <p
              data-support-content
              className="mb-4 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-aw-blue"
            >
              <span className="h-px w-7 bg-aw-yellow" aria-hidden />
              Dedicated Specialists &amp; Ongoing Support
            </p>

            <h2
              data-support-content
              className="font-display text-[clamp(1.75rem,3.2vw,2.65rem)] leading-[1.12] font-extrabold tracking-[-0.03em] text-aw-ink"
            >
              <span className="block">The Right Expertise.</span>
              <span className="block">Support That Grows With You.</span>
            </h2>

            <p
              data-support-content
              className="mt-5 max-w-md text-base leading-[1.7] text-aw-muted md:text-[1.05rem]"
            >
              Whether you need a complete project delivered, additional
              specialists for your team, or ongoing infrastructure support,
              Awantis provides the expertise to keep your technology moving
              forward.
            </p>

            <ol
              className="mt-9 space-y-6"
              aria-label="Engagement models"
            >
              {OFFERINGS.map((item, index) => (
                <li
                  key={item.title}
                  data-support-content
                  className="grid grid-cols-[auto_1fr] gap-x-4"
                >
                  <span className="font-mono text-sm font-semibold tracking-[0.14em] text-aw-blue">
                    0{index + 1}
                  </span>
                  <div>
                    <p className="text-base font-semibold tracking-wide text-aw-ink">
                      {item.title}
                    </p>
                    <p className="mt-1.5 max-w-md text-sm leading-relaxed text-aw-muted">
                      {item.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div data-support-content className="mt-10">
              <a
                href="#contact"
                className="inline-flex h-11 items-center justify-center bg-aw-blue px-7 text-sm font-semibold tracking-wide text-white shadow-[0_10px_28px_rgba(5,29,249,0.22)] transition-[transform,background-color] hover:bg-aw-blue-soft active:scale-[0.98]"
              >
                Let&apos;s Work Together
              </a>
            </div>
          </div>

          <div className="order-1 md:order-2 md:col-span-6 lg:col-span-7">
            <div className="relative mx-auto h-[34vh] min-h-[220px] w-full max-w-lg md:mx-0 md:h-[min(52vh,460px)] md:max-w-none">
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[65%] w-[65%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(5,29,249,0.09)_0%,transparent_70%)] blur-2xl" />
              <SupportScene progress={progressRef} quality={quality} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
