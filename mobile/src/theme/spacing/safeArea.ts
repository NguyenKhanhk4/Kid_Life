export const safeArea = {
  top: 0,
  bottom: 0,
  horizontal: 0,
  vertical: 0,
} as const;

export type SafeAreaSpacing = typeof safeArea;
