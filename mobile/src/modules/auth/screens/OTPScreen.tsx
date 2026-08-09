import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Screen, Container, Text, Button, ScreenBackButton } from '@/shared/components';
import { OTPInput } from '@/shared/components/forms';
import { Routes } from '@/navigation/constants';
import { layout, spacing } from '@/theme';
import * as authApi from '@/shared/api/authApi';

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

  const handleVerify = async () => {
    if (otp.length < 4) {
      setError(true);
      return;
    }

    setLoading(true);
    try {
      await authApi.verifyEmail(otp);
      Alert.alert('Thành công', 'Email đã được xác thực!', [
        { text: 'OK', onPress: () => navigation.navigate(Routes.Auth.Login) },
      ]);
    } catch (err: any) {
      Alert.alert('Lỗi', err?.message || 'Mã xác thực không hợp lệ. Vui lòng thử lại.');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen safeArea keyboardAware scrollable>
      <Container style={styles.container}>
        <ScreenBackButton />
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
            <Button variant="text" title="Resend" onPress={() => {
              authApi.forgotPassword(email).catch(() => {});
              Alert.alert('Đã gửi lại', `Mã mới đã được gửi tới ${email}`);
            }} />
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
