import { spacing } from './spacing';

export const layout = {
  screenPadding: spacing.lg, // 16
  sectionGap: spacing['4xl'], // 32
  cardPadding: spacing.lg, // 16
  listGap: spacing.md, // 12
  gridGap: spacing.lg, // 16
  buttonGap: spacing.sm, // 8
  inputGap: spacing.sm, // 8
  modalPadding: spacing['2xl'], // 24
  bottomSheetPadding: spacing['2xl'], // 24
} as const;

export type LayoutSpacing = typeof layout;
