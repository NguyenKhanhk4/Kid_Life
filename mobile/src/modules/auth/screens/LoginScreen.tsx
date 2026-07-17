import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen, Container, Text, Input, Button } from '@/shared/components';
import { Routes } from '@/navigation/constants';
import { layout, spacing } from '@/theme';

export const LoginScreen = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Navigate to Role Selection screen per Figma spec
      navigation.navigate(Routes.Auth.RoleSelection);
    }, 1000);
  };

  return (
    <Screen safeArea keyboardAware scrollable>
      <Container style={styles.container}>
        <View style={styles.header}>
          <Text variant="displayMedium">Welcome Back</Text>
          <Text
            variant="bodyMedium"
            color="textSecondary"
            style={styles.subtitle}
          >
            Sign in to continue your journey
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
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            variant="text"
            title="Forgot Password?"
            onPress={() => navigation.navigate(Routes.Auth.ForgotPassword)}
            style={styles.forgotPassword}
          />
        </View>

        <View style={styles.footer}>
          <Button
            title="Login"
            onPress={handleLogin}
            loading={loading}
            fullWidth
            disabled={!email || !password}
          />
          <View style={styles.registerContainer}>
            <Text variant="bodyMedium">Don&apos;t have an account? </Text>
            <Button
              variant="text"
              title="Register"
              onPress={() => navigation.navigate(Routes.Auth.Register)}
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -spacing.sm,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: spacing['2xl'],
    paddingBottom: spacing.xl,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
});
