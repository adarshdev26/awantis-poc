/**
 * Mutable scroll-driven state for the Private AI sculpture.
 * GSAP writes these fields; useFrame reads them — never mirrored in React state.
 */
export type InfrastructureProgress = {
  /** 0 = folded / scattered, 1 = fully assembled */
  assemble: number;
  /** Subtle yaw as the structure settles */
  turn: number;
};

export const DEFAULT_INFRASTRUCTURE_PROGRESS: InfrastructureProgress = {
  assemble: 0,
  turn: 0,
};

export function createInfrastructureProgress(
  overrides: Partial<InfrastructureProgress> = {},
): InfrastructureProgress {
  return { ...DEFAULT_INFRASTRUCTURE_PROGRESS, ...overrides };
}
