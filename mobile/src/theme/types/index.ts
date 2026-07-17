import { SemanticColors } from '../colors/semantic';
import { TextStyle } from '../typography/textStyle';
import { SpacingScale } from '../spacing/spacing';
import { LayoutSpacing } from '../spacing/layout';
import { SafeAreaSpacing } from '../spacing/safeArea';
import { RadiusScale } from '../radius/radius';
import { ShapeRadius } from '../radius/shape';
import { ShadowTokens } from '../shadow/shadow';
import { ElevationScale } from '../shadow/elevation';
import { OpacityTokens } from '../opacity/opacity';
import { AnimationDuration } from '../animation/duration';
import { AnimationEasing } from '../animation/easing';
import { ZIndexTokens } from '../zIndex/zIndex';

export type ThemeColors = SemanticColors;
export type ThemeTypography = TextStyle;

export interface ThemeSpacing {
  base: SpacingScale;
  layout: LayoutSpacing;
  safeArea: SafeAreaSpacing;
}

export interface ThemeRadius {
  base: RadiusScale;
  shape: ShapeRadius;
}

export interface ThemeShadows {
  presets: ShadowTokens;
  elevation: ElevationScale;
}

export type ThemeOpacity = OpacityTokens;

export interface ThemeAnimation {
  duration: AnimationDuration;
  easing: AnimationEasing;
}

export type ThemeZIndex = ZIndexTokens;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ThemeBreakpoints {
  // Placeholder for breakpoints architecture
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ThemeIcons {
  // Placeholder for icons architecture
}

export interface AppTheme {
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  shadows: ThemeShadows;
  opacity: ThemeOpacity;
  animation: ThemeAnimation;
  zIndex: ThemeZIndex;
  breakpoints: ThemeBreakpoints;
  icons: ThemeIcons;
}
