import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { kidlifeColors as C } from '@/theme';

export const ChangePasswordScreen = () => {
  const navigation = useNavigation<any>();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const canSubmit = oldPassword.length >= 1 && newPassword.length >= 8 && newPassword === confirmPassword && oldPassword !== newPassword;

  const handleChange = () => {
    if (!canSubmit) return;
    Alert.alert('Thành công', 'Mật khẩu đã được đổi thành công!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Đổi mật khẩu</Text>
        <View style={styles.back} />
      </View>

      <View style={styles.form}>
        <View style={styles.iconWrap}>
          <Ionicons name="shield-checkmark" size={40} color={C.primary} />
        </View>

        <PasswordField
          label="Mật khẩu hiện tại"
          placeholder="Nhập mật khẩu hiện tại..."
          value={oldPassword}
          onChangeText={setOldPassword}
          show={showOld}
          onToggle={() => setShowOld(!showOld)}
        />
        <PasswordField
          label="Mật khẩu mới"
          placeholder="Ít nhất 8 ký tự..."
          value={newPassword}
          onChangeText={setNewPassword}
          show={showNew}
          onToggle={() => setShowNew(!showNew)}
        />
        {oldPassword.length > 0 && newPassword.length > 0 && oldPassword === newPassword && (
          <Text style={styles.error}>Mật khẩu mới phải khác mật khẩu cũ</Text>
        )}
        <PasswordField
          label="Xác nhận mật khẩu mới"
          placeholder="Nhập lại mật khẩu mới..."
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          show={showConfirm}
          onToggle={() => setShowConfirm(!showConfirm)}
        />
        {confirmPassword.length > 0 && newPassword !== confirmPassword && (
          <Text style={styles.error}>Mật khẩu không khớp</Text>
        )}

        <View style={styles.requirements}>
          <Requirement met={newPassword.length >= 8} text="Ít nhất 8 ký tự" />
          <Requirement met={/[A-Z]/.test(newPassword)} text="Ít nhất 1 chữ hoa" />
          <Requirement met={/[0-9]/.test(newPassword)} text="Ít nhất 1 số" />
        </View>

        <Pressable
          style={[styles.primaryButton, !canSubmit && styles.buttonDisabled]}
          onPress={handleChange}
          disabled={!canSubmit}
        >
          <Text style={styles.buttonText}>Đổi mật khẩu</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

function PasswordField({ label, placeholder, value, onChangeText, show, onToggle }: { label: string; placeholder: string; value: string; onChangeText: (v: string) => void; show: boolean; onToggle: () => void }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.field}>
        <Ionicons name="lock-closed-outline" size={18} color={C.primary} />
        <TextInput style={styles.input} placeholder={placeholder} placeholderTextColor="#9DA9D8" value={value} onChangeText={onChangeText} secureTextEntry={!show} />
        <Pressable onPress={onToggle}>
          <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={18} color={C.muted} />
        </Pressable>
      </View>
    </View>
  );
}

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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, marginBottom: 10 },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: '#E4E9FF', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: C.text, fontSize: 17, fontWeight: '800' },
  form: { marginTop: 20, paddingBottom: 28 },
  iconWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 30 },
  fieldWrap: { marginBottom: 15 },
  label: { color: '#17328B', fontSize: 12, fontWeight: '800', marginBottom: 7 },
  field: { height: 49, borderRadius: 15, backgroundColor: '#E7EBFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 },
  input: { flex: 1, color: C.text, fontSize: 12, marginLeft: 9, marginRight: 9 },
  error: { color: C.red, fontSize: 10, marginTop: -8, marginBottom: 8 },
  requirements: { marginTop: 5, marginBottom: 20, gap: 8 },
  reqRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reqText: { color: C.muted, fontSize: 11 },
  reqMet: { color: C.green },
  primaryButton: { height: 53, borderRadius: 28, backgroundColor: '#2445FF', alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#FFF', fontSize: 13, fontWeight: '900' },
});

export default ChangePasswordScreen;
