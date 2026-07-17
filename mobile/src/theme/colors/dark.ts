import { palette } from './palette';
import { SemanticColors } from './semantic';

export const darkColors: SemanticColors = {
  primary: palette.blue[400],
  primaryContainer: palette.blue[900],
  onPrimary: palette.gray[900],

  secondary: palette.purple[400],
  secondaryContainer: palette.purple[900],
  onSecondary: palette.gray[900],

  background: palette.gray[900],
  surface: palette.gray[800],
  card: palette.gray[800],

  border: palette.gray[700],
  divider: palette.gray[800],

  textPrimary: palette.gray[50],
  textSecondary: palette.gray[400],
  textDisabled: palette.gray[600],
  textInverse: palette.gray[900],

  success: palette.green[400],
  warning: palette.orange[400],
  error: palette.red[400],
  info: palette.blue[400],

  link: palette.blue[400],
  overlay: 'rgba(0, 0, 0, 0.6)',
  backdrop: 'rgba(0, 0, 0, 0.7)',

  focus: palette.blue[500],
  disabled: palette.gray[600],
  disabledBackground: palette.gray[800],

  skeleton: palette.gray[800],
  shimmer: palette.gray[700],
};
