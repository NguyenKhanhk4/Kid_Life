import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export type ModalVariant = 'default' | 'fullscreen' | 'bottom' | 'center';

export interface ModalProps {
  /** Whether the modal is currently visible */
  visible: boolean;

  /** Main content of the modal */
  children: ReactNode;

  /** Optional title to show in the header */
  title?: string;

  /** Optional custom header component */
  header?: ReactNode;

  /** Optional custom footer component */
  footer?: ReactNode;

  /** Whether the modal can be dismissed by tapping the backdrop or hardware back button */
  dismissible?: boolean;

  /** Animation type for the modal */
  animationType?: 'none' | 'slide' | 'fade';

  /** Callback when the modal requests to be closed */
  onClose?: () => void;

  /** Style for the outermost container (Modal wrapper) */
  style?: StyleProp<ViewStyle>;

  /** Style for the content container */
  contentStyle?: StyleProp<ViewStyle>;

  /** Style for the backdrop overlay */
  overlayStyle?: StyleProp<ViewStyle>;

  /** Visual variant affecting layout and position */
  variant?: ModalVariant;

  /** Test identifier */
  testID?: string;
}
