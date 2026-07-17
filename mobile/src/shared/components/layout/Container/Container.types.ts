import { ViewProps, StyleProp, ViewStyle } from 'react-native';

export type ContainerVariant = 'default' | 'surface' | 'transparent';

export interface ContainerProps extends ViewProps {
  /**
   * Content of the container
   */
  children?: React.ReactNode;

  /**
   * Container style variant
   * @default 'default'
   */
  variant?: ContainerVariant;

  /**
   * Custom background color. Must be a valid color string (preferably from theme).
   */
  backgroundColor?: string;

  /**
   * Custom uniform padding
   */
  padding?: number;

  /**
   * Custom horizontal padding. If not provided and variant is 'default',
   * uses theme.spacing.layout.screenPadding
   */
  paddingHorizontal?: number;

  /**
   * Custom vertical padding
   */
  paddingVertical?: number;

  /**
   * Custom uniform margin
   */
  margin?: number;

  /**
   * Custom horizontal margin
   */
  marginHorizontal?: number;

  /**
   * Custom vertical margin
   */
  marginVertical?: number;

  /**
   * Flex value
   * @default 1
   */
  flex?: number;

  /**
   * Centers content horizontally and vertically
   * @default false
   */
  center?: boolean;

  /**
   * Wraps container in SafeAreaView
   * @default false
   */
  safe?: boolean;

  /**
   * Future support for scrollable container
   * @default false
   */
  scrollable?: boolean;

  /**
   * Optional style overrides
   */
  style?: StyleProp<ViewStyle>;
}
