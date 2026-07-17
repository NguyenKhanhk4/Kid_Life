import { radius } from './radius';

export const shape = {
  button: radius.md,
  card: radius.xl,
  avatar: radius.full,
  modal: radius['2xl'],
  chip: radius.pill,
  badge: radius.pill,
  input: radius.md,
} as const;

export type ShapeRadius = typeof shape;
