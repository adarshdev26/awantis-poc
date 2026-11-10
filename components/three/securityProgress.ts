/**
 * Mutable scroll-driven state for the Cybersecurity inspection visual.
 * GSAP writes these fields; useFrame reads them — never mirrored in React state.
 */
export type SecurityProgress = {
  /** 0 = obscured / collapsed, 1 = structure revealed */
  reveal: number;
  /** 0→1 yellow inspection beam travel across the object */
  scan: number;
  /** Subtle yaw as the structure settles */
  turn: number;
};

export const DEFAULT_SECURITY_PROGRESS: SecurityProgress = {
  reveal: 0,
  scan: 0,
  turn: 0,
};

export function createSecurityProgress(
  overrides: Partial<SecurityProgress> = {},
): SecurityProgress {
  return { ...DEFAULT_SECURITY_PROGRESS, ...overrides };
}
