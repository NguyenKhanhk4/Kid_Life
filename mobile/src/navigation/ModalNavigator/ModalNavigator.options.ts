import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export const transparentModalOptions: NativeStackNavigationOptions = {
  presentation: 'transparentModal',
  headerShown: false,
  animation: 'fade',
  contentStyle: {
    backgroundColor: 'transparent',
  },
};

export const fullScreenModalOptions: NativeStackNavigationOptions = {
  presentation: 'fullScreenModal',
  headerShown: false,
  animation: 'slide_from_bottom',
};

export const cardModalOptions: NativeStackNavigationOptions = {
  presentation: 'modal',
  headerShown: false,
  animation: 'slide_from_bottom',
};

// Represents a modal that behaves like a popup/contained overlay but is not full screen.
export const containedModalOptions: NativeStackNavigationOptions = {
  ...transparentModalOptions,
  animation: 'slide_from_bottom',
};
