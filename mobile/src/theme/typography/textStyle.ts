import { fontFamily } from './fontFamily';
import { fontWeight } from './fontWeight';
import { fontSize } from './fontSize';
import { lineHeight } from './lineHeight';
import { letterSpacing } from './letterSpacing';

// Defining exact types compatible with React Native's TextStyle
export interface TypographyStyle {
  fontFamily: string;
  fontWeight:
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | 'normal'
    | 'bold';
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
}

export const textStyle = {
  displayLarge: {
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight[700],
    fontSize: fontSize[48],
    lineHeight: lineHeight[56],
    letterSpacing: letterSpacing.negative,
  },
  displayMedium: {
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight[700],
    fontSize: fontSize[40],
    lineHeight: lineHeight[48],
    letterSpacing: letterSpacing.negative,
  },
  displaySmall: {
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight[700],
    fontSize: fontSize[32],
    lineHeight: lineHeight[40],
    letterSpacing: letterSpacing.normal,
  },
  headlineLarge: {
    fontFamily: fontFamily.semiBold,
    fontWeight: fontWeight[600],
    fontSize: fontSize[28],
    lineHeight: lineHeight[36],
    letterSpacing: letterSpacing.normal,
  },
  headlineMedium: {
    fontFamily: fontFamily.semiBold,
    fontWeight: fontWeight[600],
    fontSize: fontSize[24],
    lineHeight: lineHeight[32],
    letterSpacing: letterSpacing.normal,
  },
  headlineSmall: {
    fontFamily: fontFamily.semiBold,
    fontWeight: fontWeight[600],
    fontSize: fontSize[20],
    lineHeight: lineHeight[28],
    letterSpacing: letterSpacing.normal,
  },
  titleLarge: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight[500],
    fontSize: fontSize[18],
    lineHeight: lineHeight[24],
    letterSpacing: letterSpacing.normal,
  },
  titleMedium: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight[500],
    fontSize: fontSize[16],
    lineHeight: lineHeight[24],
    letterSpacing: letterSpacing.wide,
  },
  titleSmall: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight[500],
    fontSize: fontSize[14],
    lineHeight: lineHeight[20],
    letterSpacing: letterSpacing.wide,
  },
  bodyLarge: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight[400],
    fontSize: fontSize[16],
    lineHeight: lineHeight[24],
    letterSpacing: letterSpacing.normal,
  },
  bodyMedium: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight[400],
    fontSize: fontSize[14],
    lineHeight: lineHeight[20],
    letterSpacing: letterSpacing.normal,
  },
  bodySmall: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight[400],
    fontSize: fontSize[12],
    lineHeight: lineHeight[16],
    letterSpacing: letterSpacing.normal,
  },
  labelLarge: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight[500],
    fontSize: fontSize[14],
    lineHeight: lineHeight[20],
    letterSpacing: letterSpacing.wide,
  },
  labelMedium: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight[500],
    fontSize: fontSize[12],
    lineHeight: lineHeight[16],
    letterSpacing: letterSpacing.wide,
  },
  labelSmall: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight[500],
    fontSize: fontSize[10],
    lineHeight: lineHeight[12],
    letterSpacing: letterSpacing.wide,
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight[400],
    fontSize: fontSize[12],
    lineHeight: lineHeight[16],
    letterSpacing: letterSpacing.normal,
  },
  overline: {
    fontFamily: fontFamily.extraBold,
    fontWeight: fontWeight[800],
    fontSize: fontSize[10],
    lineHeight: lineHeight[16],
    letterSpacing: letterSpacing.extraWide,
  },
} satisfies Record<string, TypographyStyle>;

export type TextStyle = typeof textStyle;
export type TextStyleKey = keyof TextStyle;
