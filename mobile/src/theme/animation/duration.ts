export const duration = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 1000,
} as const;

export type AnimationDuration = typeof duration;
