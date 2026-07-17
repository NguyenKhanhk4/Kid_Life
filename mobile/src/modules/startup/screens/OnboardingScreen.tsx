import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen, Container, Text, Button } from '@/shared/components';
import { Routes, Navigators } from '@/navigation/constants';
import { spacing, layout, shape, lightColors } from '@/theme';

const SLIDES = [
  {
    id: '1',
    title: 'Learn and Grow',
    description: 'Complete lessons and get ready for the real world.',
  },
  {
    id: '2',
    title: 'Real World Missions',
    description: 'Apply what you learn in real life and earn rewards.',
  },
  {
    id: '3',
    title: 'Virtual Pets',
    description: 'Spend your coins to feed and evolve your very own pet.',
  },
];

export const OnboardingScreen = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      navigation.navigate(Navigators.Auth, { screen: Routes.Auth.Login });
    }
  };

  const currentSlide = SLIDES[currentIndex];

  return (
    <Screen safeArea>
      <Container flex={1} style={styles.container}>
        <View style={styles.imagePlaceholder}>
          <Text variant="bodyLarge" color="textSecondary">
            Illustration Placeholder
          </Text>
        </View>

        <View style={styles.content}>
          <Text variant="headlineMedium" align="center">
            {currentSlide.title}
          </Text>
          <Text
            variant="bodyMedium"
            color="textSecondary"
            align="center"
            style={styles.description}
          >
            {currentSlide.description}
          </Text>

          <View style={styles.pagination}>
            {SLIDES.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, currentIndex === index && styles.activeDot]}
              />
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title={currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
            onPress={handleNext}
            fullWidth
          />
        </View>
      </Container>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: layout.screenPadding,
  },
  imagePlaceholder: {
    flex: 2,
    backgroundColor: lightColors.surface,
    borderRadius: shape.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  description: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  pagination: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: lightColors.border,
  },
  activeDot: {
    backgroundColor: lightColors.primary,
    width: 24,
  },
  footer: {
    paddingBottom: spacing.xl,
  },
});
