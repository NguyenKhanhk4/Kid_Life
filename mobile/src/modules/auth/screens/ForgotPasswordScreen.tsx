import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen, Container, Text, Input, Button } from '@/shared/components';
import { Routes } from '@/navigation/constants';
import { layout, spacing } from '@/theme';

export const ForgotPasswordScreen = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate(Routes.Auth.OTP, { email });
    }, 1000);
  };

  return (
    <Screen safeArea keyboardAware scrollable>
      <Container style={styles.container}>
        <View style={styles.header}>
          <Text variant="displayMedium">Forgot Password</Text>
          <Text
            variant="bodyMedium"
            color="textSecondary"
            style={styles.subtitle}
          >
            Enter your email to receive a recovery code
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.footer}>
          <Button
            title="Send Recovery Code"
            onPress={handleReset}
            loading={loading}
            fullWidth
            disabled={!email}
          />
          <Button
            variant="ghost"
            title="Back to Login"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
        </View>
      </Container>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: layout.screenPadding,
    flex: 1,
  },
  header: {
    marginTop: spacing['2xl'],
    marginBottom: spacing['2xl'],
  },
  subtitle: {
    marginTop: spacing.xs,
  },
  form: {
    gap: spacing.lg,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: spacing['2xl'],
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  backButton: {
    marginTop: spacing.xs,
  },
});
