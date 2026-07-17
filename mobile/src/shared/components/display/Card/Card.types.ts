import { StyleProp, ViewStyle, PressableProps } from 'react-native';

export type CardVariant =
  'filled' | 'outlined' | 'elevated' | 'ghost' | 'interactive';

export type CardSize = 'sm' | 'md' | 'lg';

export interface CardProps extends Omit<PressableProps, 'style'> {
  /**
   * Main content of the card
   */
  children?: React.ReactNode;

  /**
   * Visual style variant of the card
   * @default 'filled'
   */
  variant?: CardVariant;

  /**
   * Size of the card, affecting internal padding
   * @default 'md'
   */
  size?: CardSize;

  /**
   * Custom uniform padding override
   */
  padding?: number;

  /**
   * Content to render in the header slot (above body)
   */
  header?: React.ReactNode;

  /**
   * Content to render in the footer slot (below body)
   */
  footer?: React.ReactNode;

  /**
   * Content to render to the left of the body
   */
  leftAccessory?: React.ReactNode;

  /**
   * Content to render to the right of the body
   */
  rightAccessory?: React.ReactNode;

  /**
   * If true, displays a loading indicator overlay
   */
  loading?: boolean;

  /**
   * If true, disables interaction and reduces opacity
   */
  disabled?: boolean;

  /**
   * If true, makes the card pressable (even without onPress)
   */
  pressable?: boolean;

  /**
   * Style applied to the outer container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Style applied to the inner body content container
   */
  contentStyle?: StyleProp<ViewStyle>;

  /**
   * Custom background color override
   */
  backgroundColor?: string;

  /**
   * Custom border color override
   */
  borderColor?: string;

  /**
   * Custom shadow style object override
   */
  shadow?: object;

  /**
   * Custom border radius override
   */
  radius?: number;

  /**
   * Test identifier for e2e testing
   */
  testID?: string;
}
