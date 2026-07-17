import type { NavigatorScreenParams } from '@react-navigation/native';
import { Routes } from '../constants';
import { MainTabParamList } from './tab.types';

// Hardcoded string to avoid circular dependency if Navigators is needed
// but we can just import Navigators.
import { Navigators } from '../constants';

export type AuthStackParamList = {
  [Routes.Auth.Onboarding]: undefined;
  [Routes.Auth.Login]: undefined;
  [Routes.Auth.Register]: undefined;
  [Routes.Auth.ForgotPassword]: undefined;
  [Routes.Auth.OTP]: { email: string };
  [Routes.Auth.ResetPassword]: { token: string };
  [Routes.Auth.RoleSelection]: undefined;
};

export type AppStackParamList = {
  [Navigators.Main]:
    | (NavigatorScreenParams<MainTabParamList> & { role?: 'parent' | 'child' })
    | undefined;
};
