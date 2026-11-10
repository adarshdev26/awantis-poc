"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ModularSystemVisual from "@/components/sections/ModularSystemVisual";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const OFFERINGS = [
  {
    index: "01",
    title: "Complete Project Delivery",
    detail:
      "From initial planning and development to deployment and ongoing improvements, Awantis can deliver complete technical projects.",
    piece: "project",
  },
  {
    index: "02",
    title: "Dedicated Specialists & Team Extension",
    detail:
      "Bring experienced developers and technical specialists into your existing team when you need additional expertise or capacity.",
    piece: "specialists",
  },
  {
    index: "03",
    title: "Ongoing Infrastructure & System Support",
    detail:
      "Keep your systems and infrastructure running reliably through ongoing maintenance, monitoring and improvements.",
    piece: "support",
  },
] as const;

export default function DedicatedSupportSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const visual = visualRef.current;
      if (!section || !visual) return;

      const content = section.querySelectorAll("[data-support-content]");
      const core = visual.querySelector<HTMLElement>("[data-modular-core]");
      const rails = visual.querySelectorAll("[data-modular-rail]");
      const pieces = {
        project: visual.querySelector<HTMLElement>(
          '[data-modular-piece="project"]',
        ),
        specialists: visual.querySelector<HTMLElement>(
          '[data-modular-piece="specialists"]',
        ),
        support: visual.querySelector<HTMLElement>(
          '[data-modular-piece="support"]',
        ),
      };
      const links = visual.querySelectorAll("[data-modular-link]");
      const markers = visual.querySelectorAll("[data-modular-marker]");

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, isMobile, reduceMotion } = context.conditions!;

          const showAssembled = () => {
            gsap.set([content, core, rails, links, markers], {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              clearProps: "transform",
            });
            gsap.set(Object.values(pieces), {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
            });
          };

          if (reduceMotion) {
            showAssembled();
            return;
          }

          gsap.set(content, { opacity: 0, y: 22 });
          gsap.set(core, { opacity: 0, scale: 0.82 });
          gsap.set(rails, { opacity: 0, scale: 0.6 });
          gsap.set(links, { opacity: 0 });
          gsap.set(markers, { opacity: 0, scale: 0 });

          if (pieces.project) {
            gsap.set(pieces.project, {
              opacity: 0,
              y: isMobile ? -28 : -56,
              scale: 0.92,
            });
          }
          if (pieces.specialists) {
            gsap.set(pieces.specialists, {
              opacity: 0,
              x: isMobile ? 28 : 64,
              scale: 0.92,
            });
          }
          if (pieces.support) {
            gsap.set(pieces.support, {
              opacity: 0,
              x: isMobile ? -20 : -40,
              y: isMobile ? 28 : 48,
              scale: 0.92,
            });
          }

          const tl = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          });

          tl.to(content, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.07,
          })
            .to(
              core,
              { opacity: 1, scale: 1, duration: 0.5 },
              isDesktop ? 0.15 : 0.05,
            )
            .to(rails, { opacity: 1, scale: 1, duration: 0.35 }, "-=0.2")
            // 1) Project delivery joins
            .to(
              pieces.project,
              { opacity: 1, y: 0, scale: 1, duration: 0.55 },
              "-=0.05",
            )
            .to(
              '[data-modular-link="project"]',
              { opacity: 1, duration: 0.25 },
              "-=0.2",
            )
            .to(
              '[data-modular-marker="project"]',
              { opacity: 1, scale: 1, duration: 0.2 },
              "-=0.1",
            )
            // 2) Specialists join
            .to(
              pieces.specialists,
              { opacity: 1, x: 0, scale: 1, duration: 0.55 },
              "-=0.05",
            )
            .to(
              '[data-modular-link="specialists"]',
              { opacity: 1, duration: 0.25 },
              "-=0.2",
            )
            .to(
              '[data-modular-marker="specialists"]',
              { opacity: 1, scale: 1, duration: 0.2 },
              "-=0.1",
            )
            // 3) Support joins last
            .to(
              pieces.support,
              { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.55 },
              "-=0.05",
            )
            .to(
              '[data-modular-link="support"]',
              { opacity: 1, duration: 0.25 },
              "-=0.2",
            )
            .to(
              '[data-modular-marker="support"]',
              { opacity: 1, scale: 1, duration: 0.2 },
              "-=0.1",
            );
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
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_80%_30%,rgba(5,29,249,0.07),transparent_70%)]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-12 md:gap-12 md:px-10 md:py-28 lg:gap-16">
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
            Expertise that fits the way you work.
          </h2>

          <p
            data-support-content
            className="mt-5 max-w-md text-base leading-[1.7] text-aw-muted md:text-[1.05rem]"
          >
            Whether you need a complete solution, additional technical expertise
            or ongoing support, Awantis works alongside your business to keep
            things moving.
          </p>

          <ol className="mt-9 space-y-6" aria-label="Engagement models">
            {OFFERINGS.map((item) => (
              <li
                key={item.index}
                data-support-content
                className="grid grid-cols-[auto_1fr] gap-x-4"
              >
                <span className="font-mono text-sm font-semibold tracking-[0.14em] text-aw-blue">
                  {item.index}
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
          <div className="mx-auto w-full max-w-md md:max-w-lg lg:ml-auto lg:max-w-xl">
            <ModularSystemVisual ref={visualRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
