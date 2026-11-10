/**
 * Mutable scroll-driven state for the contact Earth visual.
 * GSAP writes these fields; useFrame reads them — never mirrored in React state.
 */
export type ContactProgress = {
  /** 0 = below horizon, 1 = risen into frame */
  rise: number;
};

export const DEFAULT_CONTACT_PROGRESS: ContactProgress = {
  rise: 0,
};

export function createContactProgress(
  overrides: Partial<ContactProgress> = {},
): ContactProgress {
  return { ...DEFAULT_CONTACT_PROGRESS, ...overrides };
}
