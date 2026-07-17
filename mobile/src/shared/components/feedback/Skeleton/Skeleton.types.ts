import { StyleProp, ViewStyle } from 'react-native';

export type SkeletonVariant =
  | 'text'
  | 'avatar'
  | 'card'
  | 'button'
  | 'input'
  | 'rectangle'
  | 'circle'
  | 'rounded';

export interface SkeletonProps {
  /**
   * Width of the skeleton. Can be a number or string (e.g. '100%').
   */
  width?: number | string;

  /**
   * Height of the skeleton.
   */
  height?: number | string;

  /**
   * Visual variant preset for the skeleton.
   * @default 'text'
   */
  variant?: SkeletonVariant;

  /**
   * Number of lines to render (only applies to 'text' variant)
   * @default 1
   */
  lines?: number;

  /**
   * If true, applies a pulse animation
   * @default true
   */
  animated?: boolean;

  /**
   * Custom border radius override
   */
  radius?: number;

  /**
   * Optional custom style
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test identifier
   */
  testID?: string;
}
