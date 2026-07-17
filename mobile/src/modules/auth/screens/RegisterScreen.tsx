import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen, Container, Text, Input, Button } from '@/shared/components';
import { Routes } from '@/navigation/constants';
import { layout, spacing } from '@/theme';

export const RegisterScreen = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate(Routes.Auth.OTP, { email: form.email });
    }, 1000);
  };

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Screen safeArea keyboardAware scrollable>
      <Container style={styles.container}>
        <View style={styles.header}>
          <Text variant="displayMedium">Create Account</Text>
          <Text
            variant="bodyMedium"
            color="textSecondary"
            style={styles.subtitle}
          >
            Join KidLife and start the adventure
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="Enter your name"
            value={form.name}
            onChangeText={(v: string) => updateForm('name', v)}
          />
          <Input
            label="Email"
            placeholder="Enter your email"
            value={form.email}
            onChangeText={(v: string) => updateForm('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Password"
            placeholder="Create a password"
            value={form.password}
            onChangeText={(v: string) => updateForm('password', v)}
            secureTextEntry
          />
          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={form.confirmPassword}
            onChangeText={(v: string) => updateForm('confirmPassword', v)}
            secureTextEntry
          />
        </View>

        <View style={styles.footer}>
          <Button
            title="Register"
            onPress={handleRegister}
            loading={loading}
            fullWidth
            disabled={
              !form.name ||
              !form.email ||
              !form.password ||
              form.password !== form.confirmPassword
            }
          />
          <View style={styles.loginContainer}>
            <Text variant="bodyMedium">Already have an account? </Text>
            <Button
              variant="text"
              title="Login"
              onPress={() => navigation.goBack()}
            />
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
  },
  footer: {
    marginTop: 'auto',
    paddingTop: spacing['2xl'],
    paddingBottom: spacing.xl,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
});
