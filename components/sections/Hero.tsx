"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/layout/Navbar";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Scene = dynamic(() => import("@/components/three/Scene"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden
      className="h-full w-full bg-[radial-gradient(circle_at_center,rgba(5,29,249,0.18),transparent_65%)]"
    />
  ),
});

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const navItems = root.querySelectorAll(
        '[data-animate^="nav-"]',
      );
      const headline = root.querySelectorAll('[data-animate="headline"]');
      const copy = root.querySelectorAll('[data-animate="copy"]');
      const actions = root.querySelectorAll('[data-animate="cta"]');
      const scene = root.querySelector('[data-animate="scene"]');

      if (prefersReducedMotion()) {
        gsap.set([navItems, headline, copy, actions, scene], {
          clearProps: "all",
          opacity: 1,
          y: 0,
          x: 0,
        });
        return;
      }

      gsap.set([navItems, headline, copy, actions], {
        opacity: 0,
        y: 28,
      });
      gsap.set(scene, { opacity: 0, x: 36 });

      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      intro
        .to(navItems, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.06,
        })
        .to(
          headline,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.08,
          },
          "-=0.35",
        )
        .to(
          copy,
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
          },
          "-=0.55",
        )
        .to(
          actions,
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.1,
          },
          "-=0.5",
        )
        .to(
          scene,
          {
            opacity: 1,
            x: 0,
            duration: 1.1,
            ease: "power2.out",
          },
          "-=0.95",
        );

      gsap.to(root, {
        opacity: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      data-hero
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-aw-charcoal text-white"
    >
      <div className="aw-hero-glow" />
      <div className="aw-grain" />

      <Navbar />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-8 px-6 pb-16 pt-28 md:grid-cols-12 md:gap-12 md:px-10 md:pb-24 md:pt-28 lg:gap-16">
        <div className="relative z-10 md:col-span-5 lg:col-span-5 lg:pr-4">
          <p
            data-animate="headline"
            className="mb-6 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-aw-yellow md:mb-7"
          >
            <span className="h-px w-8 bg-aw-yellow" aria-hidden />
            Intelligence Studio
          </p>

          <h1 className="font-display max-w-[11ch] text-[clamp(2.35rem,5.4vw,4.35rem)] leading-[1.02] font-extrabold tracking-[-0.035em] text-white md:max-w-none">
            <span data-animate="headline" className="block">
              Engineering Intelligence.
            </span>
            <span
              data-animate="headline"
              className="mt-1.5 block text-white/88 md:mt-2"
            >
              Building What&apos;s Next.
            </span>
          </h1>

          <p
            data-animate="copy"
            className="mt-6 max-w-[34ch] text-base leading-[1.7] text-white/62 md:mt-8 md:max-w-md md:text-[1.05rem]"
          >
            Awantis designs and ships advanced AI systems, resilient software
            platforms, and the infrastructure that turns ambitious ideas into
            production reality.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:mt-11 sm:flex-row sm:items-center sm:gap-4">
            <a
              href="#contact"
              data-animate="cta"
              className="inline-flex h-12 min-w-[9.5rem] items-center justify-center bg-aw-blue px-8 text-sm font-semibold tracking-wide text-white shadow-[0_0_0_1px_rgba(5,29,249,0.4),0_10px_30px_rgba(5,29,249,0.25)] transition-[transform,background-color,box-shadow] hover:bg-aw-blue-soft hover:shadow-[0_0_0_1px_rgba(58,76,255,0.5),0_12px_36px_rgba(5,29,249,0.35)] active:scale-[0.98]"
            >
              Let&apos;s Talk
            </a>
            <a
              href="#intro"
              data-animate="cta"
              className="inline-flex h-12 min-w-[9.5rem] items-center justify-center border border-white/25 bg-white/[0.03] px-8 text-sm font-semibold tracking-wide text-white transition-[transform,border-color,background-color] hover:border-white/45 hover:bg-white/[0.06] active:scale-[0.98]"
            >
              Explore Our Work
            </a>
          </div>
        </div>

        <div
          data-animate="scene"
          className="relative h-[40vh] min-h-[260px] md:col-span-7 md:h-[min(68vh,620px)] lg:col-span-7"
          aria-hidden
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(5,29,249,0.22)_0%,transparent_70%)] blur-2xl md:h-[75%] md:w-[75%]" />
          <div className="absolute inset-0 md:inset-y-0 md:-right-4 md:left-2 lg:left-4">
            <Scene />
          </div>
        </div>
      </div>
    </section>
  );
}
