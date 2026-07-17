import { palette } from './palette';
import { SemanticColors } from './semantic';

export const lightColors: SemanticColors = {
  primary: palette.blue[600],
  primaryContainer: palette.blue[100],
  onPrimary: palette.white,

  secondary: palette.purple[600],
  secondaryContainer: palette.purple[100],
  onSecondary: palette.white,

  background: palette.gray[50],
  surface: palette.white,
  card: palette.white,

  border: palette.gray[200],
  divider: palette.gray[100],

  textPrimary: palette.gray[900],
  textSecondary: palette.gray[500],
  textDisabled: palette.gray[400],
  textInverse: palette.white,

  success: palette.green[600],
  warning: palette.orange[500],
  error: palette.red[600],
  info: palette.blue[500],

  link: palette.blue[600],
  overlay: 'rgba(0, 0, 0, 0.4)',
  backdrop: 'rgba(0, 0, 0, 0.5)',

  focus: palette.blue[400],
  disabled: palette.gray[400],
  disabledBackground: palette.gray[200],

  skeleton: palette.gray[200],
  shimmer: palette.gray[100],
};
