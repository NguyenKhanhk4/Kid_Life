import { ReactNode } from 'react';

export type DialogVariant =
  'info' | 'success' | 'warning' | 'error' | 'confirm' | 'custom';

export interface DialogAction {
  label: string;
  onPress: () => void;
  testID?: string;
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'danger'
    | 'success'
    | 'warning';
}

export interface DialogProps {
  /** Whether the dialog is visible */
  visible: boolean;

  /** Title of the dialog */
  title: string;

  /** Description text */
  description?: string;

  /** React component for icon */
  icon?: ReactNode;

  /** React component for illustration */
  illustration?: ReactNode;

  /** Primary button configuration */
  primaryAction?: DialogAction;

  /** Secondary button configuration */
  secondaryAction?: DialogAction;

  /** Whether the dialog is in a loading state (disables actions) */
  loading?: boolean;

  /** Callback to close the dialog */
  onClose?: () => void;

  /** Semantic variant of the dialog */
  variant?: DialogVariant;

  /** Test identifier */
  testID?: string;
}
