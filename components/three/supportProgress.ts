/**
 * Mutable scroll-driven state for the Dedicated Support modular join visual.
 * GSAP writes these fields; useFrame reads them — never mirrored in React state.
 */
export type SupportProgress = {
  /** 0 = module apart, 1 = module connected to the base structure */
  join: number;
};

export const DEFAULT_SUPPORT_PROGRESS: SupportProgress = {
  join: 0,
};

export function createSupportProgress(
  overrides: Partial<SupportProgress> = {},
): SupportProgress {
  return { ...DEFAULT_SUPPORT_PROGRESS, ...overrides };
}
