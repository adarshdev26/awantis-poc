"use client";

import { forwardRef } from "react";

/**
 * CSS modular system: a central “existing business” core with three
 * capability modules that dock into place. Animated by the parent via GSAP.
 */
const ModularSystemVisual = forwardRef<HTMLDivElement>(
  function ModularSystemVisual(_, ref) {
    return (
      <div
        ref={ref}
        data-modular-visual
        className="relative mx-auto aspect-square w-full max-w-[420px] md:max-w-none"
        aria-hidden
      >
        {/* Soft depth */}
        <div className="pointer-events-none absolute inset-[12%] rounded-[2px] bg-[radial-gradient(circle_at_center,rgba(5,29,249,0.1),transparent_68%)] blur-2xl" />

        {/* Central base — client's existing system */}
        <div
          data-modular-core
          className="absolute left-1/2 top-1/2 z-10 h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 border border-aw-blue/30 bg-aw-blue shadow-[0_18px_40px_rgba(5,29,249,0.22)]"
        >
          <span className="absolute inset-[18%] border border-white/25" />
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/20" />
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/20" />
        </div>

        {/* Blue structural rails */}
        <span
          data-modular-rail="h"
          className="absolute left-[18%] top-1/2 z-[5] h-px w-[64%] -translate-y-1/2 bg-aw-blue/35"
        />
        <span
          data-modular-rail="v"
          className="absolute left-1/2 top-[18%] z-[5] h-[64%] w-px -translate-x-1/2 bg-aw-blue/35"
        />

        {/* 01 — Complete Project Delivery (top) */}
        <div
          data-modular-piece="project"
          className="absolute left-1/2 top-[6%] z-20 h-[22%] w-[28%] -translate-x-1/2 border border-black/10 bg-[#e8ecf3] shadow-[0_12px_28px_rgba(18,18,18,0.08)]"
        >
          <span className="absolute inset-x-[12%] top-[18%] h-px bg-aw-blue/40" />
          <span className="absolute inset-x-[12%] top-[38%] h-px bg-black/10" />
          <span className="absolute inset-x-[12%] top-[58%] h-px bg-black/10" />
          <span className="absolute bottom-[14%] left-[12%] font-mono text-[0.55rem] tracking-[0.16em] text-aw-blue">
            01
          </span>
        </div>
        <span
          data-modular-link="project"
          className="absolute left-1/2 top-[28%] z-[6] h-[6%] w-px -translate-x-1/2 origin-top bg-aw-blue"
        />
        <span
          data-modular-marker="project"
          className="absolute left-1/2 top-[33%] z-30 size-1.5 -translate-x-1/2 -translate-y-1/2 bg-aw-yellow"
        />

        {/* 02 — Dedicated Specialists (right) */}
        <div
          data-modular-piece="specialists"
          className="absolute right-[6%] top-1/2 z-20 h-[28%] w-[22%] -translate-y-1/2 border border-black/10 bg-white shadow-[0_12px_28px_rgba(18,18,18,0.08)]"
        >
          <span className="absolute left-[16%] top-[16%] size-[28%] border border-aw-blue/35" />
          <span className="absolute bottom-[14%] left-[16%] font-mono text-[0.55rem] tracking-[0.16em] text-aw-blue">
            02
          </span>
        </div>
        <span
          data-modular-link="specialists"
          className="absolute right-[28%] top-1/2 z-[6] h-px w-[6%] -translate-y-1/2 origin-left bg-aw-blue"
        />
        <span
          data-modular-marker="specialists"
          className="absolute right-[33%] top-1/2 z-30 size-1.5 -translate-y-1/2 bg-aw-yellow"
        />

        {/* 03 — Ongoing Support (bottom-left) */}
        <div
          data-modular-piece="support"
          className="absolute bottom-[8%] left-[10%] z-20 h-[20%] w-[30%] border border-black/10 bg-[#d9dee8] shadow-[0_12px_28px_rgba(18,18,18,0.08)]"
        >
          <span className="absolute inset-[16%] border border-dashed border-aw-blue/30" />
          <span className="absolute bottom-[12%] left-[14%] font-mono text-[0.55rem] tracking-[0.16em] text-aw-blue">
            03
          </span>
        </div>
        <span
          data-modular-link="support"
          className="absolute bottom-[28%] left-[32%] z-[6] h-[8%] w-px origin-bottom rotate-[-28deg] bg-aw-blue"
        />
        <span
          data-modular-marker="support"
          className="absolute bottom-[35%] left-[38%] z-30 size-1.5 bg-aw-yellow"
        />
      </div>
    );
  },
);

export default ModularSystemVisual;
