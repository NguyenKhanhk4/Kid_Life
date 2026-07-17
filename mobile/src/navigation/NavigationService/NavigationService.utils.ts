import { navigationRef } from './navigationRef';

/**
 * Checks if the navigation tree is mounted and ready.
 */
export const isNavigationReady = (): boolean => {
  return navigationRef.isReady();
};

/**
 * Safely executes a navigation action only if the navigator is ready.
 * Prevents crashes during deep linking or background notifications on cold starts.
 */
export const safeAction = (action: () => void): void => {
  if (isNavigationReady()) {
    try {
      action();
    } catch (error) {
      console.error('[NavigationService] Error executing action:', error);
    }
  } else {
    console.warn(
      '[NavigationService] Attempted to navigate before navigator was ready.',
    );
    // Future: implement a queue system for delayed navigation here.
  }
};
