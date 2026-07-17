import { RecoveryState } from './linking.types';
import { RootRouteName } from '../NavigationService/NavigationService.types';
import { NavigationService } from '../NavigationService';

class NavigationRecoveryService {
  private pendingState: RecoveryState<RootRouteName> | null = null;

  /**
   * Saves the route that the user intended to navigate to, so it can be
   * recovered later (e.g., after a successful login).
   */
  public savePendingRoute<RouteName extends RootRouteName>(
    route: RouteName,
    params?: RecoveryState<RouteName>['params'],
  ): void {
    this.pendingState = { route, params };
  }

  /**
   * Navigates to the saved pending route, if one exists, and clears it.
   * Returns true if a route was recovered, false otherwise.
   */
  public recoverPendingRoute(): boolean {
    if (this.pendingState) {
      const { route, params } = this.pendingState;
      NavigationService.navigate(route, params);
      this.clearPendingRoute();
      return true;
    }
    return false;
  }

  /**
   * Clears any saved pending route.
   */
  public clearPendingRoute(): void {
    this.pendingState = null;
  }
}

export const NavigationRecovery = new NavigationRecoveryService();
