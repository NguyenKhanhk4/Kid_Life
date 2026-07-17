import { NavigationState } from '@react-navigation/native';
import {
  RootRouteName,
  RouteParams,
} from '../NavigationService/NavigationService.types';

export interface RecoveryState<
  RouteName extends RootRouteName = RootRouteName,
> {
  route: RouteName;
  params?: RouteParams<RouteName>;
}

export interface NavigationPersistenceStrategy {
  saveState: (state: NavigationState) => Promise<void>;
  restoreState: () => Promise<NavigationState | undefined>;
  clearState: () => Promise<void>;
}
