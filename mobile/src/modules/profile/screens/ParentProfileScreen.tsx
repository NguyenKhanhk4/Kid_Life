import React, { useState, useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/constants';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
import * as userApi from '@/shared/api/userApi';

export default function ParentProfileScreen() {
  const navigation = useNavigation<any>();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await userApi.getMe();
        setName(profile.fullName || '');
        setPhone(profile.phone || '');
        setEmail(profile.email || '');
      } catch (error: any) {
        Alert.alert('Lỗi', error?.message || 'Không thể tải thông tin');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      await userApi.updateMe({ fullName: name, phone });
      setEditing(false);
      Alert.alert('Thành công', 'Đã cập nhật thông tin!');
    } catch (error: any) {
      Alert.alert('Lỗi', error?.message || 'Không thể cập nhật');
    }
  };

  return (
    <View style={L.screen}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
        <Pressable style={styles.editBtn} onPress={() => editing ? handleSave() : setEditing(true)}>
          <Ionicons name={editing ? 'checkmark' : 'create-outline'} size={20} color={editing ? C.green : C.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={L.content} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarBox}><Text style={styles.avatarEmoji}>👨‍👩‍👧</Text></View>
          {editing && (
            <Pressable style={styles.changeAvatarBtn}>
              <Ionicons name="camera-outline" size={14} color={C.primary} />
              <Text style={styles.changeAvatarText}>Đổi ảnh</Text>
            </Pressable>
          )}
        </View>

        {/* Info fields */}
        <InfoRow icon="person-outline" label="Họ và tên" value={name} editable={editing} onChangeText={setName} />
        <InfoRow icon="mail-outline" label="Email" value={email} editable={false} />
        <InfoRow icon="call-outline" label="Số điện thoại" value={phone} editable={editing} onChangeText={setPhone} />

        {/* Subscription card */}
        <View style={[L.card, styles.subCard]}>
          <View style={styles.subIcon}><Ionicons name="diamond" size={24} color={C.orange} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.subTitle}>Gói miễn phí</Text>
            <Text style={styles.subDesc}>Nâng cấp Premium để mở khóa thêm tính năng</Text>
          </View>
          <Pressable style={styles.upgradePill}>
            <Text style={styles.upgradeText}>Nâng cấp</Text>
          </Pressable>
        </View>

        {/* Quick links */}
        <Text style={[L.sectionTitle, { marginTop: 20, marginBottom: 12 }]}>Cài đặt</Text>
        <QuickLink icon="people-outline" label="Quản lý hồ sơ trẻ" onPress={() => navigation.navigate(Routes.Profile.ChildManagement)} />
        <QuickLink icon="lock-closed-outline" label="Đổi mật khẩu" onPress={() => navigation.navigate(Routes.Profile.ChangePassword)} />
        <QuickLink icon="settings-outline" label="Cài đặt ứng dụng" onPress={() => navigation.navigate(Routes.Profile.Settings)} />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function InfoRow({ icon, label, value, editable, onChangeText }: { icon: any; label: string; value: string; editable: boolean; onChangeText?: (v: string) => void }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}><Ionicons name={icon} size={18} color={C.primary} /></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        {editable && onChangeText ? (
          <TextInput style={styles.infoInput} value={value} onChangeText={onChangeText} />
        ) : (
          <Text style={styles.infoValue}>{value}</Text>
        )}
      </View>
    </View>
  );
}

function QuickLink({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.quickLink} onPress={onPress}>
      <View style={styles.qlIcon}><Ionicons name={icon} size={20} color={C.primary} /></View>
      <Text style={styles.qlLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={C.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 12 },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: '#E4E9FF', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: C.text, fontSize: 17, fontWeight: '800' },
  editBtn: { width: 42, height: 42, borderRadius: 22, backgroundColor: '#E4E9FF', alignItems: 'center', justifyContent: 'center' },
  avatarSection: { alignItems: 'center', paddingVertical: 20 },
  avatarBox: { width: 100, height: 100, borderRadius: 35, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 50 },
  changeAvatarBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10 },
  changeAvatarText: { color: C.primary, fontSize: 12, fontWeight: '700' },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#EEF0F8' },
  infoIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  infoLabel: { color: C.muted, fontSize: 11, marginBottom: 2 },
  infoValue: { color: C.text, fontSize: 14, fontWeight: '600' },
  infoInput: { color: C.text, fontSize: 14, fontWeight: '600', borderBottomWidth: 1, borderBottomColor: C.primary, paddingVertical: 2 },
  subCard: { flexDirection: 'row', alignItems: 'center', padding: 16, marginTop: 20 },
  subIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: C.orangeSoft, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  subTitle: { color: C.text, fontSize: 14, fontWeight: '700' },
  subDesc: { color: C.muted, fontSize: 11, marginTop: 2 },
  upgradePill: { backgroundColor: C.orange, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7 },
  upgradeText: { color: '#FFF', fontSize: 11, fontWeight: '800' },
  quickLink: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#EEF0F8' },
  qlIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  qlLabel: { flex: 1, color: C.text, fontSize: 14, fontWeight: '600' },
});
