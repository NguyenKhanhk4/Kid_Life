import {
  ActivityIndicatorProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { AppTheme } from '@/theme/types';

export interface LoadingProps extends Omit<
  ActivityIndicatorProps,
  'size' | 'color'
> {
  /**
   * If false, the component is not rendered
   * @default true
   */
  visible?: boolean;

  /**
   * If true, expands to fill the entire screen with background color
   * @default false
   */
  fullscreen?: boolean;

  /**
   * If true, overlays the nearest positioned parent with a semi-transparent background
   * @default false
   */
  overlay?: boolean;

  /**
   * Size of the indicator
   * @default 'large'
   */
  size?: 'small' | 'large' | number;

  /**
   * Color of the indicator (semantic token or hex)
   * @default 'primary'
   */
  color?: string | keyof AppTheme['colors'];

  /**
   * Optional text label displayed below the indicator
   */
  label?: string;

  /**
   * Custom style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Custom style for the label text
   */
  labelStyle?: StyleProp<TextStyle>;

  /**
   * Test identifier
   */
  testID?: string;
}
