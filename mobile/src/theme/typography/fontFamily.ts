export const fontFamily = {
  regular: 'System', // Replace with actual font family string (e.g., 'Inter-Regular') when fonts are loaded
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
  extraBold: 'System',
} as const;

export type FontFamily = typeof fontFamily;
