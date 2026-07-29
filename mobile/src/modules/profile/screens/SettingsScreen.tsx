import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Routes, Navigators } from '@/navigation/constants';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: () => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: Navigators.Auth,
                  state: {
                    index: 0,
                    routes: [{ name: Routes.Auth.Login }],
                  },
                },
              ],
            }),
          );
        },
      },
    ]);
  };

  return (
    <View style={L.screen}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Cài đặt</Text>
        <View style={styles.back} />
      </View>

      <ScrollView contentContainerStyle={L.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Thông báo</Text>
        <ToggleRow icon="notifications-outline" label="Nhận thông báo push" value={notifications} onToggle={setNotifications} />
        <ToggleRow icon="volume-medium-outline" label="Âm thanh thông báo" value={sound} onToggle={setSound} />

        <Text style={styles.sectionLabel}>Giao diện</Text>
        <ToggleRow icon="moon-outline" label="Chế độ tối" value={darkMode} onToggle={setDarkMode} />

        <Text style={styles.sectionLabel}>Tài khoản</Text>
        <LinkRow icon="lock-closed-outline" label="Đổi mật khẩu" onPress={() => navigation.navigate(Routes.Profile.ChangePassword)} />
        <LinkRow icon="language-outline" label="Ngôn ngữ" subtitle="Tiếng Việt" onPress={() => Alert.alert('Ngôn ngữ', 'Tính năng đang phát triển')} />
        <LinkRow icon="people-outline" label="Quản lý hồ sơ trẻ" onPress={() => navigation.navigate(Routes.Profile.ChildManagement)} />

        <Text style={styles.sectionLabel}>Hỗ trợ</Text>
        <LinkRow icon="document-text-outline" label="Điều khoản sử dụng" onPress={() => Alert.alert('Điều khoản', 'Tính năng đang phát triển')} />
        <LinkRow icon="shield-outline" label="Chính sách bảo mật" onPress={() => Alert.alert('Bảo mật', 'Tính năng đang phát triển')} />
        <LinkRow icon="help-circle-outline" label="Trung tâm hỗ trợ" onPress={() => Alert.alert('Hỗ trợ', 'Tính năng đang phát triển')} />
        <LinkRow icon="information-circle-outline" label="Phiên bản" subtitle="1.0.0" />

        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={C.red} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function ToggleRow({ icon, label, value, onToggle }: { icon: any; label: string; value: boolean; onToggle: (v: boolean) => void }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}><Ionicons name={icon} size={20} color={C.primary} /></View>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch value={value} onValueChange={onToggle} trackColor={{ false: '#DCE2F4', true: C.primarySoft }} thumbColor={value ? C.primary : '#FFF'} />
    </View>
  );
}

function LinkRow({ icon, label, subtitle, onPress }: { icon: any; label: string; subtitle?: string; onPress?: () => void }) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.rowIcon}><Ionicons name={icon} size={20} color={C.primary} /></View>
      <Text style={styles.rowLabel}>{label}</Text>
      {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      {onPress ? <Ionicons name="chevron-forward" size={18} color={C.muted} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 12 },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: '#E4E9FF', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: C.text, fontSize: 17, fontWeight: '800' },
  sectionLabel: { color: C.muted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginTop: 20, marginBottom: 8, letterSpacing: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 14, padding: 14, marginBottom: 8 },
  rowIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rowLabel: { flex: 1, color: C.text, fontSize: 14, fontWeight: '600' },
  rowSubtitle: { color: C.muted, fontSize: 12, marginRight: 6 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.redSoft, borderRadius: 16, padding: 16, marginTop: 30 },
  logoutText: { color: C.red, fontSize: 14, fontWeight: '800' },
});
