import { TextProps as RNTextProps } from 'react-native';
import { TextStyleKey, SemanticColors } from '@/theme';

export interface TextProps extends Omit<RNTextProps, 'style'> {
  /** The text content to display */
  children: React.ReactNode;
  /** Semantic typography variant from Theme */
  variant?: TextStyleKey;
  /** Semantic color from Theme */
  color?: keyof SemanticColors | 'inherit';
  /** Text alignment */
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  /** Style override */
  style?: RNTextProps['style'];
}
