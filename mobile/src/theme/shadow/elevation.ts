export const elevation = {
  0: 0,
  1: 1,
  2: 2,
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  24: 24,
} as const;

export type ElevationScale = typeof elevation;
