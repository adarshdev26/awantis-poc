/**
 * Mutable scroll-driven state for the Custom Software modular system.
 * GSAP writes these fields; useFrame reads them — never mirrored in React state.
 */
export type SystemsProgress = {
  /** 0 = separated panels, 1 = fully assembled system */
  assemble: number;
  /** Subtle yaw as the structure settles */
  turn: number;
};

export const DEFAULT_SYSTEMS_PROGRESS: SystemsProgress = {
  assemble: 0,
  turn: 0,
};

export function createSystemsProgress(
  overrides: Partial<SystemsProgress> = {},
): SystemsProgress {
  return { ...DEFAULT_SYSTEMS_PROGRESS, ...overrides };
}
