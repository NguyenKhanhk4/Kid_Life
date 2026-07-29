import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
import { Navigators, Routes } from '@/navigation/constants';
import PremiumScreen from './PremiumScreen';
import { useAppSelector } from '@/shared/store';
import { ScreenBackButton } from '@/shared/components';

type Subscreen = 'account' | 'premium';

export default function AccountParentScreen() {
  const navigation = useNavigation<any>();
  const { child } = useAppSelector((state) => state.kidlife);
  const [subscreen, setSubscreen] = useState<Subscreen>('account');

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

  if (subscreen === 'premium') {
    return (
      <View style={styles.subscreen}>
        <Pressable style={styles.back} onPress={() => setSubscreen('account')}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
          <Text style={styles.backText}>Tài khoản</Text>
        </Pressable>
        <PremiumScreen />
      </View>
    );
  }

  const menuItems = [
    { icon: '💳', label: 'Gói KidLife Premium', detail: 'Đang hoạt động', action: () => setSubscreen('premium'), isPremium: true },
    { icon: '📈', label: 'Báo cáo kỹ năng AI', detail: 'Xem Radar chart & AI đánh giá', action: () => navigation.navigate(Routes.Features.AIReport) },
    { icon: '👨‍👩‍👧‍👦', label: 'Đồng quản lý gia đình', detail: 'Mời thành viên, phân quyền RBAC', action: () => navigation.navigate(Routes.Features.CoParenting) },
    { icon: '📷', label: 'Nhật ký hành trình', detail: 'Kho ảnh, AI Video Recap & Sách ảnh', action: () => navigation.navigate(Routes.Features.MemoryLanePremium) },
    { icon: '🏦', label: 'Ngân hàng ảo & Vé phạt', detail: 'Cài đặt tiết kiệm & quản lý kỷ luật', action: () => navigation.navigate(Routes.Features.VirtualBank) },
    { icon: '🎤', label: 'Thu âm giọng đọc (Voice Clone)', detail: 'Nhân bản giọng đọc truyện cho bé', action: () => navigation.navigate(Routes.Features.ParentBedtimeStories) },
    { icon: '🎁', label: 'Phần thưởng & ví', detail: 'Quản lý phần thưởng của bé', action: () => navigation.navigate(Routes.Parent.Rewards) },
    { icon: '🔔', label: 'Thông báo', detail: '', action: () => navigation.navigate(Routes.Main.Notifications) },
    { icon: '❓', label: 'Trợ giúp & hỗ trợ', detail: '', action: () => navigation.navigate(Routes.Profile.Settings) },
  ];

  return (
    <ScrollView style={L.screen} contentContainerStyle={L.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <ScreenBackButton />
        <Text style={styles.title}>Tài khoản phụ huynh</Text>
        <Pressable onPress={() => navigation.navigate(Routes.Profile.Settings)}>
          <Ionicons name="settings-outline" size={22} color={C.primary} />
        </Pressable>
      </View>

      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👩🏻</Text>
        </View>
        <View style={styles.profileCopy}>
          <Text style={styles.name}>Nguyễn Thị Nga</Text>
          <Text style={styles.email}>nguyennga@email.com • Quyền Admin</Text>
          <View style={styles.editPill}>
            <Ionicons name="pencil" size={11} color={C.primary} />
            <Text style={styles.editText}>Chỉnh sửa thông tin</Text>
          </View>
        </View>
      </View>

      {/* Managed Children Section */}
      <View style={styles.childTitle}>
        <Text style={L.sectionTitle}>Tài khoản trẻ em (3 bé)</Text>
        <Pressable onPress={() => navigation.navigate(Routes.Profile.ChildManagement)}>
          <Text style={styles.add}>+ Thêm bé</Text>
        </Pressable>
      </View>

      <Pressable style={[L.card, styles.childCard]} onPress={() => navigation.navigate(Routes.Profile.ChildDetail as any, { childId: '1' })}>
        <View style={styles.childAvatar}>
          <Text style={styles.childEmoji}>🧒🏻</Text>
        </View>
        <View style={styles.childCopy}>
          <Text style={styles.childName}>Bé Minh Anh</Text>
          <Text style={styles.childMeta}>{child.age} tuổi  •  Cấp {child.level}  •  {child.xp.toLocaleString('vi-VN')} XP</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={C.primary} />
      </Pressable>

      {/* Main Feature Menu */}
      <View style={styles.menu}>
        {menuItems.map((item) => (
          <Pressable style={styles.menuItem} key={item.label} onPress={item.action}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <View style={styles.menuCopy}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.detail ? <Text style={styles.menuDetail}>{item.detail}</Text> : null}
            </View>
            {item.isPremium && (
              <View style={styles.active}>
                <Text style={styles.activeText}>Premium</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={18} color={C.muted} />
          </Pressable>
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Đăng xuất"
        style={styles.logout}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={19} color={C.red} />
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  subscreen: { flex: 1, backgroundColor: C.background },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, marginHorizontal: 20, marginTop: 50, marginBottom: 8, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: C.primarySoft, borderRadius: 20, alignSelf: 'flex-start' },
  backText: { color: C.primary, fontSize: 13, fontWeight: '800' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, marginBottom: 20 },
  title: { flex: 1, color: C.text, fontSize: 23, fontWeight: '800', marginHorizontal: 12 },
  profile: { ...L.card, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  avatar: { width: 70, height: 70, borderRadius: 24, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: 13 },
  avatarText: { fontSize: 38 },
  profileCopy: { flex: 1 },
  name: { color: C.text, fontSize: 16, fontWeight: '800' },
  email: { color: C.muted, fontSize: 11, marginTop: 4 },
  editPill: { flexDirection: 'row', gap: 4, alignItems: 'center', backgroundColor: C.primarySoft, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 5, alignSelf: 'flex-start', marginTop: 8 },
  editText: { color: C.primary, fontSize: 10, fontWeight: '700' },
  childTitle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  add: { color: C.primary, fontSize: 11, fontWeight: '800' },
  childCard: { padding: 13, flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  childAvatar: { width: 48, height: 48, borderRadius: 15, backgroundColor: C.orangeSoft, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  childEmoji: { fontSize: 27 },
  childCopy: { flex: 1 },
  childName: { color: C.text, fontSize: 13, fontWeight: '800' },
  childMeta: { color: C.muted, fontSize: 10, marginTop: 4 },
  menu: { ...L.card, paddingHorizontal: 14 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: C.border },
  menuIcon: { fontSize: 20, marginRight: 11 },
  menuCopy: { flex: 1 },
  menuLabel: { color: C.text, fontSize: 12, fontWeight: '700' },
  menuDetail: { color: C.muted, fontSize: 10, marginTop: 3 },
  active: { backgroundColor: C.lime, paddingHorizontal: 7, paddingVertical: 4, borderRadius: 5, marginRight: 8 },
  activeText: { color: C.limeDark, fontSize: 9, fontWeight: '900' },
  logout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 22, paddingVertical: 13 },
  logoutText: { color: C.red, fontSize: 12, fontWeight: '800' },
});
