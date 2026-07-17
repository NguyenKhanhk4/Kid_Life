export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  header: 300,
  fab: 400,
  bottomSheet: 500,
  modal: 1000,
  overlay: 1100,
  toast: 1200,
  tooltip: 1300,
} as const;

export type ZIndexTokens = typeof zIndex;
