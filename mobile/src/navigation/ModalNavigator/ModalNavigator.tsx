import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from '../constants';
import { ModalStackParamList } from '../types';
import { ModalPlaceholderProps } from './ModalNavigator.types';
import {
  transparentModalOptions,
  fullScreenModalOptions,
} from './ModalNavigator.options';
import { styles } from './ModalNavigator.styles';
import { Container, Text } from '@/shared/components';

const PlaceholderScreen: React.FC<
  ModalPlaceholderProps & { isFullScreen?: boolean }
> = ({ name, description, isFullScreen }) => {
  if (isFullScreen) {
    return (
      <View style={styles.fullScreenContainer}>
        <Text variant="headlineMedium">{name}</Text>
        <Text
          variant="bodyMedium"
          color="textSecondary"
          style={styles.placeholderText}
        >
          {description}
        </Text>
      </View>
    );
  }

  return (
    <Container style={styles.overlayContainer}>
      <Container style={styles.cardContainer}>
        <Text variant="headlineMedium">{name}</Text>
        <Text
          variant="bodyMedium"
          color="textSecondary"
          style={styles.placeholderText}
        >
          {description}
        </Text>
      </Container>
    </Container>
  );
};

const ModalStackNav = createNativeStackNavigator<ModalStackParamList>();

export const ModalNavigator = () => {
  return (
    <ModalStackNav.Navigator>
      <ModalStackNav.Screen
        name={Routes.Modal.Dialog}
        options={transparentModalOptions}
      >
        {() => (
          <PlaceholderScreen
            name="Dialog Modal"
            description="Architecture Ready"
          />
        )}
      </ModalStackNav.Screen>
      <ModalStackNav.Screen
        name={Routes.Modal.Confirmation}
        options={transparentModalOptions}
      >
        {() => (
          <PlaceholderScreen
            name="Confirmation Modal"
            description="Architecture Ready"
          />
        )}
      </ModalStackNav.Screen>
      <ModalStackNav.Screen
        name={Routes.Modal.ImagePreview}
        options={fullScreenModalOptions}
      >
        {() => (
          <PlaceholderScreen
            name="Image Preview"
            description="Architecture Ready"
            isFullScreen
          />
        )}
      </ModalStackNav.Screen>
    </ModalStackNav.Navigator>
  );
};
