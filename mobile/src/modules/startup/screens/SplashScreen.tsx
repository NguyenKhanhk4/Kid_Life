import React, { useEffect } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen, Container, Text } from '@/shared/components';
import { Navigators } from '@/navigation/constants';
import { spacing } from '@/theme';

export const SplashScreen = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();

  useEffect(() => {
    // Simulate token check and initialization
    const init = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Navigate to Auth navigator; OnboardingScreen is the initial screen of AuthStack
      navigation.navigate(Navigators.Auth as never);
    };
    init();
  }, [navigation]);

  return (
    <Screen safeArea backgroundColor="primary.main">
      <Container center flex={1}>
        <Text variant="displayLarge" color="textInverse">
          KidLife
        </Text>
        <ActivityIndicator size="large" color="#FFF" style={styles.loader} />
      </Container>
    </Screen>
  );
};

const styles = StyleSheet.create({
  loader: {
    marginTop: spacing.xl,
  },
});
