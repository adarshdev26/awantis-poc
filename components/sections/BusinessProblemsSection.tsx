"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProblemCard from "@/components/sections/ProblemCard";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PROBLEMS = [
  {
    index: "01",
    title: "Repetitive manual work",
    description:
      "Teams spend too much time on tasks that could be automated.",
  },
  {
    index: "02",
    title: "Disconnected systems",
    description: "Tools and platforms don't communicate properly.",
  },
  {
    index: "03",
    title: "Slow handovers",
    description:
      "Processes depend on manual coordination and unnecessary steps.",
  },
  {
    index: "04",
    title: "Difficult access to information",
    description:
      "Important business knowledge is scattered across different systems.",
  },
] as const;

export default function BusinessProblemsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressFillRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const progressFill = progressFillRef.current;
      if (!section) return;

      const intro = section.querySelectorAll("[data-problems-intro]");
      const cards = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll("[data-problem-card]"),
      );
      const story = section.querySelector<HTMLElement>("[data-problems-story]");
      const mm = gsap.matchMedia();

      const setActiveCard = (activeIndex: number) => {
        cards.forEach((card, index) => {
          card.classList.toggle("is-active", index === activeIndex);
        });
      };

      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          isTablet: "(min-width: 768px) and (max-width: 1023px)",
          isMobile: "(max-width: 767px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, isTablet, isMobile, reduceMotion } =
            context.conditions!;

          if (reduceMotion) {
            gsap.set([intro, cards], {
              clearProps: "opacity,transform",
              opacity: 1,
              y: 0,
              scale: 1,
            });
            setActiveCard(0);
            if (progressFill) gsap.set(progressFill, { scaleY: 1 });
            return;
          }

          gsap.set(intro, { opacity: 0, y: 20 });
          gsap.to(intro, {
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

          // Desktop / tablet storytelling: scrubbed chapter reveals + active emphasis
          if ((isDesktop || isTablet) && story) {
            gsap.set(cards, { opacity: 0.28, y: 48, scale: 0.985 });
            setActiveCard(-1);

            cards.forEach((card, index) => {
              gsap.to(card, {
                opacity: 1,
                y: 0,
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top 78%",
                  end: "top 42%",
                  scrub: 0.55,
                },
              });

              ScrollTrigger.create({
                trigger: card,
                start: "top 58%",
                end: "bottom 42%",
                onEnter: () => setActiveCard(index),
                onEnterBack: () => setActiveCard(index),
              });
            });

            if (progressFill) {
              gsap.set(progressFill, { scaleY: 0, transformOrigin: "top" });
              gsap.to(progressFill, {
                scaleY: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: story,
                  start: "top 60%",
                  end: "bottom 45%",
                  scrub: 0.4,
                },
              });
            }
          }

          // Mobile: simple staggered chapter reveals, no sticky progress scrub
          if (isMobile) {
            gsap.set(cards, { opacity: 0, y: 28, scale: 1 });
            cards.forEach((card, index) => {
              gsap.to(card, {
                opacity: 1,
                y: 0,
                ease: "power2.out",
                duration: 0.55,
                scrollTrigger: {
                  trigger: card,
                  start: "top 88%",
                  toggleActions: "play none none reverse",
                  onEnter: () => setActiveCard(index),
                  onEnterBack: () => setActiveCard(index),
                },
              });
            });
            if (progressFill) gsap.set(progressFill, { scaleY: 1 });
          }
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="business-problems"
      ref={sectionRef}
      className="relative text-aw-ink"
      style={{ backgroundColor: "#F5F7FA" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_35%_at_8%_10%,rgba(5,29,249,0.05),transparent_60%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 md:px-10 md:py-28 lg:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-20">
          {/* Sticky story frame — CSS sticky only, no scroll hijack / pin */}
          <div className="lg:col-span-5 lg:self-start lg:sticky lg:top-28">
            <p
              data-problems-intro
              className="mb-4 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-aw-blue"
            >
              <span className="h-px w-7 bg-aw-yellow" aria-hidden />
              The Challenge
            </p>

            <h2
              data-problems-intro
              className="font-display max-w-[14ch] text-[clamp(1.85rem,3.2vw,2.85rem)] leading-[1.1] font-extrabold tracking-[-0.03em] text-aw-ink"
            >
              Remove operational drag — so your systems can move.
            </h2>

            <p
              data-problems-intro
              className="mt-5 max-w-md text-base leading-[1.7] text-aw-muted md:text-[1.05rem]"
            >
              Awantis helps businesses improve automation, connect platforms and
              restore clear access to information — turning everyday operational
              friction into systems that move with intent.
            </p>

            {/* Thin vertical progress — tracks chapter scroll on desktop/tablet */}
            <div
              className="mt-10 hidden items-stretch gap-4 lg:flex"
              aria-hidden
            >
              <div className="relative w-[2px] overflow-hidden bg-black/10">
                <span
                  ref={progressFillRef}
                  className="absolute inset-x-0 top-0 h-full origin-top bg-aw-blue"
                  style={{ transform: "scaleY(0)" }}
                />
              </div>
              <ol className="flex flex-col justify-between gap-5 py-0.5">
                {PROBLEMS.map((problem) => (
                  <li
                    key={problem.index}
                    className="font-mono text-[0.65rem] tracking-[0.18em] text-aw-muted"
                  >
                    {problem.index}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Scrolling chapters */}
          <div
            data-problems-story
            className="flex flex-col gap-6 md:gap-10 lg:col-span-7 lg:gap-14"
          >
            {PROBLEMS.map((problem) => (
              <ProblemCard
                key={problem.index}
                index={problem.index}
                title={problem.title}
                description={problem.description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
