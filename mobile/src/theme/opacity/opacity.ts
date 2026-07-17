export const opacity = {
  transparent: 0,
  hover: 0.08,
  pressed: 0.12,
  disabled: 0.38,
  overlay: 0.4,
  loading: 0.5,
  backdrop: 0.6,
  opaque: 1,
} as const;

export type OpacityTokens = typeof opacity;
