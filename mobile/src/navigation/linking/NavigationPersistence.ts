import { NavigationState } from '@react-navigation/native';
import { NavigationPersistenceStrategy } from './linking.types';

/**
 * Placeholder implementation for Navigation Persistence.
 * In a real-world app, this would be backed by AsyncStorage or MMKV
 * to persist the NavigationState across app restarts (useful for dev mode or crash recovery).
 */
class NavigationPersistenceService implements NavigationPersistenceStrategy {
  private memoryState: NavigationState | undefined;

  public async saveState(state: NavigationState): Promise<void> {
    // Future: await AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
    this.memoryState = state;
    return Promise.resolve();
  }

  public async restoreState(): Promise<NavigationState | undefined> {
    // Future: const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
    // return savedStateString ? JSON.parse(savedStateString) : undefined;
    return Promise.resolve(this.memoryState);
  }

  public async clearState(): Promise<void> {
    // Future: await AsyncStorage.removeItem(PERSISTENCE_KEY);
    this.memoryState = undefined;
    return Promise.resolve();
  }
}

export const NavigationPersistence = new NavigationPersistenceService();
