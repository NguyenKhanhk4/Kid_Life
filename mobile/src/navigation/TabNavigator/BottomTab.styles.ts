import { StyleSheet } from 'react-native';
import { layout, spacing, lightColors } from '@/theme';

export const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: lightColors.surface,
    borderTopColor: lightColors.border,
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: lightColors.backdrop,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Future safe area padding
    paddingBottom: spacing.sm,
    paddingTop: spacing.xs,
    minHeight: 60,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.screenPadding,
  },
  placeholderText: {
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
