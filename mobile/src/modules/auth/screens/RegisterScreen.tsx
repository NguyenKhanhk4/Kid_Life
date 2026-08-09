import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/constants';
import { kidlifeColors as C } from '@/theme';
import { useAppDispatch, useAppSelector } from '@/shared/store';
import { registerThunk, clearError } from '@/shared/store/authSlice';

export const RegisterScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', fullName: '', phone: '' });
  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (error) dispatch(clearError());
  };

  const handleRegister = async () => {
    if (!form.fullName.trim()) { Alert.alert('Lỗi', 'Vui lòng nhập họ và tên'); return; }
    if (!form.email.trim()) { Alert.alert('Lỗi', 'Vui lòng nhập email'); return; }
    if (form.password.length < 8) { Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 8 ký tự'); return; }
    if (form.password !== form.confirmPassword) { Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp'); return; }

    const result = await dispatch(registerThunk({
      email: form.email.trim(),
      password: form.password,
      fullName: form.fullName.trim(),
      role: 'PARENT',
    }));

    if (registerThunk.fulfilled.match(result)) {
      navigation.navigate(Routes.Auth.OTP, { email: form.email.trim() });
    }
  };

  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"><Pressable style={styles.back} onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={20} color={C.primary} /></Pressable><View style={styles.form}><Text style={styles.title}>Đăng ký</Text><Text style={styles.subtitle}>Tạo tài khoản mới ngay</Text>{error && <View style={styles.errorBox}><Ionicons name="alert-circle" size={16} color={C.red} /><Text style={styles.errorText}>{error}</Text></View>}<Field icon="person-outline" label="Họ và tên" placeholder="Họ và tên..." value={form.fullName} onChangeText={(v: string) => update('fullName', v)} /><Field icon="mail-outline" label="Email" placeholder="Email..." value={form.email} onChangeText={(v: string) => update('email', v)} keyboardType="email-address" autoCapitalize="none" /><Field icon="lock-closed-outline" label="Mật khẩu" placeholder="Ít nhất 8 ký tự..." value={form.password} onChangeText={(v: string) => update('password', v)} secureTextEntry /><Field icon="lock-closed-outline" label="Xác nhận mật khẩu" placeholder="Nhập lại mật khẩu..." value={form.confirmPassword} onChangeText={(v: string) => update('confirmPassword', v)} secureTextEntry /><Field icon="call-outline" label="Số điện thoại" placeholder="Số điện thoại..." value={form.phone} onChangeText={(v: string) => update('phone', v)} /><Pressable style={[styles.primaryButton, isLoading && styles.buttonDisabled]} onPress={handleRegister} disabled={isLoading}><Text style={styles.buttonText}>{isLoading ? 'Đang đăng ký...' : 'Đăng ký'}</Text></Pressable></View></ScrollView>;
};

function Field({ icon, label, placeholder, secureTextEntry, value, onChangeText, keyboardType, autoCapitalize }: any) { return <View style={styles.fieldWrap}><Text style={styles.label}>{label}</Text><View style={styles.field}><Ionicons name={icon} size={18} color={C.primary} /><TextInput style={styles.input} placeholder={placeholder} placeholderTextColor="#9DA9D8" value={value} onChangeText={onChangeText} secureTextEntry={secureTextEntry} keyboardType={keyboardType} autoCapitalize={autoCapitalize} /></View></View>; }
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#F5F7FF' }, content: { minHeight: '100%', paddingHorizontal: 20 }, back: { width: 42, height: 42, borderRadius: 22, backgroundColor: '#E4E9FF', alignItems: 'center', justifyContent: 'center', marginTop: 50 }, form: { marginTop: 32, paddingBottom: 28 }, title: { color: '#102980', fontSize: 28, fontWeight: '900', textAlign: 'center' }, subtitle: { color: '#A4ADD0', fontSize: 12, textAlign: 'center', marginTop: 5, marginBottom: 25 }, errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFE8E8', borderRadius: 12, padding: 12, marginBottom: 15, gap: 8 }, errorText: { color: C.red, fontSize: 12, flex: 1 }, fieldWrap: { marginBottom: 13 }, label: { color: '#17328B', fontSize: 12, fontWeight: '800', marginBottom: 6 }, field: { height: 47, borderRadius: 15, backgroundColor: '#E7EBFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 }, input: { flex: 1, color: C.text, fontSize: 12, marginLeft: 9 }, primaryButton: { height: 53, borderRadius: 28, backgroundColor: '#2445FF', alignItems: 'center', justifyContent: 'center', marginTop: 7 }, buttonDisabled: { opacity: 0.6 }, buttonText: { color: '#FFF', fontSize: 13, fontWeight: '900' } });
