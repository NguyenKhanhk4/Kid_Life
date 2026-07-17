import { StyleSheet } from 'react-native';
import { layout, spacing, lightColors } from '@/theme';

export const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.screenPadding,
    backgroundColor: lightColors.backdrop,
  },
  cardContainer: {
    padding: layout.screenPadding,
    borderRadius: 16,
    backgroundColor: lightColors.surface,
    width: '100%',
    alignItems: 'center',
    shadowColor: lightColors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: lightColors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.screenPadding,
  },
  placeholderText: {
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
