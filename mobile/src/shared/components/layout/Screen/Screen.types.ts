import { ViewProps, StyleProp, ViewStyle } from 'react-native';
import { StatusBarStyle } from 'expo-status-bar';

export interface ScreenProps extends ViewProps {
  /**
   * Main content of the screen
   */
  children?: React.ReactNode;

  /**
   * If true, screen content will be scrollable
   * @default false
   */
  scrollable?: boolean;

  /**
   * If true, applies SafeAreaView at the screen level
   * @default true
   */
  safeArea?: boolean;

  /**
   * Custom background color. If not provided, uses theme.colors.background.main
   */
  backgroundColor?: string;

  /**
   * Status bar style
   * @default 'auto'
   */
  statusBarStyle?: StatusBarStyle;

  /**
   * If true, wraps content in KeyboardAvoidingView
   * @default true
   */
  keyboardAware?: boolean;

  /**
   * Style applied to the inner content container (useful when scrollable is true)
   */
  contentContainerStyle?: StyleProp<ViewStyle>;

  /**
   * Header slot, rendered above the scrollable content
   */
  header?: React.ReactNode;

  /**
   * Footer slot, rendered below the scrollable content
   */
  footer?: React.ReactNode;

  /**
   * Future support for loading overlay
   * @default false
   */
  loading?: boolean;

  /**
   * Optional style overrides
   */
  style?: StyleProp<ViewStyle>;
}
