import type { NavigatorScreenParams } from '@react-navigation/native';
import { Navigators, Routes } from '../constants';
import { AuthStackParamList } from './stack.types';
import { ModalStackParamList } from './modal.types';

export type RootStackParamList = {
  [Routes.Root.Splash]: undefined;

  [Navigators.Auth]: NavigatorScreenParams<AuthStackParamList>;
  [Navigators.Main]: { role?: 'parent' | 'child' } | undefined;
  [Navigators.Modal]: NavigatorScreenParams<ModalStackParamList>;
};
