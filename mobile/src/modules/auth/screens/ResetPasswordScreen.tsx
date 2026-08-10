import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Routes } from '@/navigation/constants';
import { kidlifeColors as C } from '@/theme';
import * as authApi from '@/shared/api/authApi';

export const ResetPasswordScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const token = route.params?.token || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (password.length < 8) return;
    if (password !== confirmPassword) return;
    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => {
        navigation.navigate(Routes.Auth.Login);
      }, 1500);
    } catch (error: any) {
      // Show inline error — for simplicity, keep success false
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View style={[styles.screen, styles.successContainer]}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={80} color={C.green} />
        </View>
        <Text style={styles.successTitle}>Đặt lại thành công!</Text>
        <Text style={styles.successText}>Mật khẩu đã được cập nhật. Đang chuyển về trang đăng nhập...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Pressable style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={20} color={C.primary} />
      </Pressable>

      <View style={styles.form}>
        <View style={styles.iconWrap}>
          <Ionicons name="lock-closed" size={40} color={C.primary} />
        </View>
        <Text style={styles.title}>Đặt lại mật khẩu</Text>
        <Text style={styles.subtitle}>Nhập mật khẩu mới cho tài khoản của bạn</Text>

        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Mật khẩu mới</Text>
          <View style={styles.field}>
            <Ionicons name="lock-closed-outline" size={18} color={C.primary} />
            <TextInput
              style={styles.input}
              placeholder="Ít nhất 8 ký tự..."
              placeholderTextColor="#9DA9D8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={C.muted} />
            </Pressable>
          </View>
        </View>

        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Xác nhận mật khẩu</Text>
          <View style={styles.field}>
            <Ionicons name="lock-closed-outline" size={18} color={C.primary} />
            <TextInput
              style={styles.input}
              placeholder="Nhập lại mật khẩu..."
              placeholderTextColor="#9DA9D8"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
            />
            <Pressable onPress={() => setShowConfirm(!showConfirm)}>
              <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={18} color={C.muted} />
            </Pressable>
          </View>
          {confirmPassword.length > 0 && password !== confirmPassword && (
            <Text style={styles.error}>Mật khẩu không khớp</Text>
          )}
        </View>

        <View style={styles.requirements}>
          <Requirement met={password.length >= 8} text="Ít nhất 8 ký tự" />
          <Requirement met={/[A-Z]/.test(password)} text="Ít nhất 1 chữ hoa" />
          <Requirement met={/[0-9]/.test(password)} text="Ít nhất 1 số" />
          <Requirement met={password === confirmPassword && password.length > 0} text="Mật khẩu khớp" />
        </View>

        <Pressable
          style={[styles.primaryButton, (!password || password !== confirmPassword || password.length < 8) && styles.buttonDisabled]}
          onPress={handleReset}
          disabled={!password || password !== confirmPassword || password.length < 8}
        >
          <Text style={styles.buttonText}>Đặt lại mật khẩu</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

function Requirement({ met, text }: { met: boolean; text: string }) {
  return (
    <View style={styles.reqRow}>
      <Ionicons name={met ? 'checkmark-circle' : 'ellipse-outline'} size={16} color={met ? C.green : C.muted} />
      <Text style={[styles.reqText, met && styles.reqMet]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F7FF' },
  content: { minHeight: '100%', paddingHorizontal: 20 },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: '#E4E9FF', alignItems: 'center', justifyContent: 'center', marginTop: 50 },
  form: { marginTop: 40, paddingBottom: 28 },
  iconWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 20 },
  title: { color: '#102980', fontSize: 28, fontWeight: '900', textAlign: 'center' },
  subtitle: { color: '#A4ADD0', fontSize: 12, textAlign: 'center', marginTop: 5, marginBottom: 30 },
  fieldWrap: { marginBottom: 15 },
  label: { color: '#17328B', fontSize: 12, fontWeight: '800', marginBottom: 7 },
  field: { height: 49, borderRadius: 15, backgroundColor: '#E7EBFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 },
  input: { flex: 1, color: C.text, fontSize: 12, marginLeft: 9, marginRight: 9 },
  error: { color: C.red, fontSize: 10, marginTop: 5 },
  requirements: { marginTop: 5, marginBottom: 20, gap: 8 },
  reqRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reqText: { color: C.muted, fontSize: 11 },
  reqMet: { color: C.green },
  primaryButton: { height: 53, borderRadius: 28, backgroundColor: '#2445FF', alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#FFF', fontSize: 13, fontWeight: '900' },
  successContainer: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  successIcon: { marginBottom: 20 },
  successTitle: { color: C.text, fontSize: 24, fontWeight: '900', marginBottom: 10 },
  successText: { color: C.muted, fontSize: 13, textAlign: 'center', lineHeight: 20 },
});

export default ResetPasswordScreen;
