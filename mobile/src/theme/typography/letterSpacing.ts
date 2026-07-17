export const letterSpacing = {
  negative: -0.5,
  normal: 0,
  wide: 0.5,
  extraWide: 1.5,
} as const;

export type LetterSpacing = typeof letterSpacing;
