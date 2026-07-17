import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Screen, Container, Text, Button } from '@/shared/components';
import { OTPInput } from '@/shared/components/forms';
import { Routes } from '@/navigation/constants';
import { layout, spacing } from '@/theme';

type ParamList = {
  OTP: { email: string };
};

export const OTPScreen = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<ParamList, 'OTP'>>();
  const email = route.params?.email || 'your email';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleVerify = () => {
    if (otp.length < 4) {
      setError(true);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // For this sprint, assume verification routes back to login to login with new credentials
      // Or in Forgot Password flow, to ResetPassword. We will route to Login for simplicity now.
      navigation.navigate(Routes.Auth.Login);
    }, 1000);
  };

  return (
    <Screen safeArea keyboardAware scrollable>
      <Container style={styles.container}>
        <View style={styles.header}>
          <Text variant="displayMedium">Verify OTP</Text>
          <Text
            variant="bodyMedium"
            color="textSecondary"
            style={styles.subtitle}
          >
            Enter the 4-digit code sent to {email}
          </Text>
        </View>

        <View style={styles.form}>
          <OTPInput
            length={4}
            value={otp}
            onChange={(val: string) => {
              setOtp(val);
              setError(false);
            }}
            error={error}
          />
          {error && (
            <Text variant="bodySmall" color="error" style={styles.errorText}>
              Please enter a valid 4-digit code.
            </Text>
          )}
        </View>

        <View style={styles.footer}>
          <Button
            title="Verify & Proceed"
            onPress={handleVerify}
            loading={loading}
            fullWidth
            disabled={otp.length < 4}
          />
          <View style={styles.resendContainer}>
            <Text variant="bodyMedium">Didn&apos;t receive the code? </Text>
            <Button variant="text" title="Resend" onPress={() => {}} />
          </View>
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
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  errorText: {
    marginTop: spacing.sm,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: spacing['2xl'],
    paddingBottom: spacing.xl,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
});
