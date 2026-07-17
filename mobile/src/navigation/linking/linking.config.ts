import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { LINKING_PREFIXES } from './linking.constants';
import { Navigators, Routes } from '../constants';

export const appLinkingConfig: LinkingOptions<RootStackParamList> = {
  prefixes: LINKING_PREFIXES,
  config: {
    screens: {
      [Routes.Root.Splash]: 'splash',
      [Navigators.Auth]: {
        screens: {
          [Routes.Auth.Login]: 'login',
          [Routes.Auth.Register]: 'register',
          [Routes.Auth.ForgotPassword]: 'forgot-password',
          [Routes.Auth.ResetPassword]: 'reset-password/:token',
        },
      },
      [Navigators.Main]: {
        screens: {
          [Navigators.Main]: {
            screens: {
              [Routes.Main.Home]: 'home',
              [Routes.Main.Tasks]: 'tasks',
              [Routes.Main.Community]: 'community',
              [Routes.Main.Profile]: 'profile',
            },
          },
        },
      },
      [Navigators.Modal]: {
        screens: {
          [Routes.Modal.Dialog]: 'dialog',
          [Routes.Modal.Confirmation]: 'confirm',
          [Routes.Modal.ImagePreview]: 'preview',
        },
      },
    },
  },
};
