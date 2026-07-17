import { Linking } from 'react-native';

/**
 * Safely handles an incoming deep link.
 * Can be expanded to parse specific URL parameters before passing to React Navigation.
 */
export const safeHandleDeepLink = async (url: string): Promise<void> => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.warn(`[DeepLinking] Unsupported URL: ${url}`);
    }
  } catch (error) {
    console.error(`[DeepLinking] Error handling URL ${url}:`, error);
  }
};

/**
 * Safely opens an external link (e.g., Terms of Service, external browser).
 */
export const safeOpenLink = async (url: string): Promise<void> => {
  try {
    await Linking.openURL(url);
  } catch (error) {
    console.error(`[DeepLinking] Error opening external link ${url}:`, error);
  }
};
