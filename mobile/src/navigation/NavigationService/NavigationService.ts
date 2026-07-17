import {
  CommonActions,
  StackActions,
  NavigationState,
  PartialState,
} from '@react-navigation/native';
import { navigationRef } from './navigationRef';
import { safeAction } from './NavigationService.utils';
import { RootRouteName, RouteParams } from './NavigationService.types';

export const navigate = <RouteName extends RootRouteName>(
  name: RouteName,
  params?: RouteParams<RouteName>,
) => {
  safeAction(() => {
    navigationRef.dispatch(CommonActions.navigate(name, params));
  });
};

export const replace = <RouteName extends RootRouteName>(
  name: RouteName,
  params?: RouteParams<RouteName>,
) => {
  safeAction(() => {
    navigationRef.dispatch(StackActions.replace(name, params));
  });
};

export const push = <RouteName extends RootRouteName>(
  name: RouteName,
  params?: RouteParams<RouteName>,
) => {
  safeAction(() => {
    navigationRef.dispatch(StackActions.push(name, params));
  });
};

export const pop = (count: number = 1) => {
  safeAction(() => {
    navigationRef.dispatch(StackActions.pop(count));
  });
};

export const popToTop = () => {
  safeAction(() => {
    navigationRef.dispatch(StackActions.popToTop());
  });
};

export const reset = (
  state: PartialState<NavigationState> | NavigationState,
) => {
  safeAction(() => {
    navigationRef.dispatch(CommonActions.reset(state));
  });
};

export const goBack = () => {
  safeAction(() => {
    if (navigationRef.canGoBack()) {
      navigationRef.goBack();
    }
  });
};

export const canGoBack = (): boolean => {
  if (navigationRef.isReady()) {
    return navigationRef.canGoBack();
  }
  return false;
};

export const getCurrentRoute = () => {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute();
  }
  return undefined;
};

export const getCurrentRouteName = (): string | undefined => {
  return getCurrentRoute()?.name;
};

// Exporting as a single object for easy imports like NavigationService.navigate
export const NavigationService = {
  navigate,
  replace,
  push,
  pop,
  popToTop,
  reset,
  goBack,
  canGoBack,
  getCurrentRoute,
  getCurrentRouteName,
};
