import { StyleSheet } from 'react-native';
import { AppTheme } from '@/theme';

export const createStyles = (
  theme: AppTheme,
  variant: keyof AppTheme['typography'],
  color: keyof AppTheme['colors'] | 'inherit',
  align: 'auto' | 'left' | 'right' | 'center' | 'justify',
) => {
  const typographyStyle = theme.typography[variant];
  const colorStyle = color === 'inherit' ? {} : { color: theme.colors[color] };

  return StyleSheet.create({
    text: {
      ...typographyStyle,
      ...colorStyle,
      textAlign: align,
    },
  });
};
