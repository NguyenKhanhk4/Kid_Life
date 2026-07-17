import { StyleProp, ViewStyle } from 'react-native';
import { ReactNode } from 'react';

export type EmptyStateVariant =
  | 'default'
  | 'search'
  | 'offline'
  | 'achievement'
  | 'mission'
  | 'notification'
  | 'wallet';

export interface EmptyStateAction {
  label: string;
  onPress: () => void;
  testID?: string;
}

export interface EmptyStateProps {
  /**
   * Semantic variant of the empty state
   * @default 'default'
   */
  variant?: EmptyStateVariant;

  /**
   * Main title text
   */
  title: string;

  /**
   * Secondary description text
   */
  description?: string;

  /**
   * React component for icon
   */
  icon?: ReactNode;

  /**
   * React component for illustration (takes precedence over icon)
   */
  illustration?: ReactNode;

  /**
   * Configuration for primary button
   */
  primaryAction?: EmptyStateAction;

  /**
   * Configuration for secondary button
   */
  secondaryAction?: EmptyStateAction;

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
