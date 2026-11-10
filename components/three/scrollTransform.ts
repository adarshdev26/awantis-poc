export type ScrollTransform = {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  scale: number;
};

export const DEFAULT_SCROLL_TRANSFORM: ScrollTransform = {
  x: 0,
  y: 0,
  z: 0,
  rx: 0.08,
  ry: 0.35,
  rz: 0,
  scale: 1,
};

export function createScrollTransform(
  overrides: Partial<ScrollTransform> = {},
): ScrollTransform {
  return { ...DEFAULT_SCROLL_TRANSFORM, ...overrides };
}
