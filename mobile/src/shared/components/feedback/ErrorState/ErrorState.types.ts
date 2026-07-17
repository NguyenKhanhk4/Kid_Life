import { StyleProp, ViewStyle } from 'react-native';
import { ReactNode } from 'react';

export type ErrorStateVariant =
  'default' | 'offline' | 'server' | 'permission' | 'unknown';

export interface ErrorStateAction {
  label: string;
  onPress: () => void;
  testID?: string;
}

export interface ErrorStateProps {
  /**
   * Semantic variant of the error state
   * @default 'default'
   */
  variant?: ErrorStateVariant;

  /**
   * Main title text
   */
  title: string;

  /**
   * Detailed description of the error
   */
  description?: string;

  /**
   * Error code if available (e.g., '404', 'E_NETWORK')
   */
  errorCode?: string;

  /**
   * React component for icon
   */
  icon?: ReactNode;

  /**
   * React component for illustration (takes precedence over icon)
   */
  illustration?: ReactNode;

  /**
   * Configuration for retry/primary button
   */
  primaryAction?: ErrorStateAction;

  /**
   * Configuration for secondary button
   */
  secondaryAction?: ErrorStateAction;

  /**
   * Custom children to render below actions
   */
  children?: ReactNode;

  /**
   * Container style
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test identifier
   */
  testID?: string;
}
