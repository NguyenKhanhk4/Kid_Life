import React from 'react';
import { Pressable, ScrollView, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';

const freeFeatures = [
  { key: 'ViralMilestones', icon: '📸', title: 'Chia sẻ Thành tựu', desc: 'Tạo thiệp vinh danh & khoe lên MXH', color: '#FF6B9D', route: 'ViralMilestonesScreen' },
  { key: 'Leaderboard', icon: '🏆', title: 'Thi đua Gia đình', desc: 'Bảng xếp hạng & thử thách cộng đồng', color: '#FFA900', route: 'LeaderboardScreen' },
  { key: 'MemoryLane', icon: '📷', title: 'Nhật ký Hành trình', desc: 'Lưu giữ 50 khoảnh khắc đáng nhớ', color: '#28B978', route: 'MemoryLaneScreen' },
];

const premiumFeatures = [
  { key: 'AIReport', icon: '📊', title: 'Báo cáo AI', desc: 'Phân tích kỹ năng thông minh', color: '#8E54E9', route: 'AIReportScreen' },
  { key: 'VirtualBank', icon: '🏦', title: 'Ngân hàng Ảo', desc: 'Sổ tiết kiệm & hệ thống kỷ luật', color: '#2B44E8', route: 'VirtualBankScreen' },
  { key: 'MemoryLanePremium', icon: '💖', title: 'Nhật ký Cao cấp', desc: 'Album vô hạn & AI Video Recap', color: '#FF4C8B', route: 'MemoryLanePremiumScreen' },
  { key: 'BedtimeStories', icon: '🌟', title: 'Giờ Kể Chuyện', desc: 'Thư viện truyện & Voice Cloning', color: '#6C5CE7', route: 'BedtimeStoriesScreen' },
  { key: 'CoParenting', icon: '👨‍👩‍👧‍👦', title: 'Mở rộng Gia đình', desc: 'Đồng quản lý & phân quyền', color: '#00B894', route: 'CoParentingScreen' },
  { key: 'MultiStepTask', icon: '📋', title: 'Nhiệm vụ Chuỗi', desc: 'Task checklist & Tiến hóa thú cưng', color: '#E17055', route: 'MultiStepTaskScreen' },
  { key: 'PetEvolution', icon: '🐉', title: 'Tiến hóa Thú cưng', desc: 'Trứng → Rồng con → Rồng lửa', color: '#FDCB6E', route: 'PetEvolutionScreen' },
];

export default function FeaturesHubScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScrollView style={L.screen} contentContainerStyle={[L.content, { paddingTop: 50 }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.overline}>KHÁM PHÁ</Text>
          <Text style={styles.title}>Tính năng mới</Text>
        </View>
      </View>

      {/* Free Tier */}
      <View style={styles.tierHeader}>
        <View style={styles.freeBadge}><Text style={styles.freeBadgeText}>🟢 MIỄN PHÍ</Text></View>
        <Text style={styles.tierDesc}>Trải nghiệm ngay không cần nâng cấp</Text>
      </View>
      {freeFeatures.map((f) => (
        <Pressable key={f.key} style={styles.featureCard} onPress={() => navigation.navigate(f.route)}>
          <View style={[styles.iconWrap, { backgroundColor: f.color + '18' }]}>
            <Text style={styles.iconText}>{f.icon}</Text>
          </View>
          <View style={styles.featureInfo}>
            <Text style={styles.featureTitle}>{f.title}</Text>
            <Text style={styles.featureDesc}>{f.desc}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={C.muted} />
        </Pressable>
      ))}

      {/* Premium Tier */}
      <View style={[styles.tierHeader, { marginTop: 8 }]}>
        <View style={styles.premiumBadge}><Text style={styles.premiumBadgeText}>💎 PREMIUM</Text></View>
        <Text style={styles.tierDesc}>Công cụ mạnh mẽ cho gia đình hiện đại</Text>
      </View>
      {premiumFeatures.map((f) => (
        <Pressable key={f.key} style={styles.featureCard} onPress={() => navigation.navigate(f.route)}>
          <View style={[styles.iconWrap, { backgroundColor: f.color + '18' }]}>
            <Text style={styles.iconText}>{f.icon}</Text>
          </View>
          <View style={styles.featureInfo}>
            <Text style={styles.featureTitle}>{f.title}</Text>
            <Text style={styles.featureDesc}>{f.desc}</Text>
          </View>
          <View style={styles.premiumTag}>
            <Ionicons name="diamond" size={10} color="#8E54E9" />
          </View>
          <Ionicons name="chevron-forward" size={18} color={C.muted} />
        </Pressable>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  overline: { color: C.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: C.text, fontSize: 26, fontWeight: '800', marginTop: 3 },
  tierHeader: { marginBottom: 14 },
  freeBadge: { backgroundColor: '#E4F8EE', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6, alignSelf: 'flex-start', marginBottom: 6 },
  freeBadgeText: { color: '#1A8B52', fontSize: 11, fontWeight: '800' },
  premiumBadge: { backgroundColor: '#F0E9FF', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6, alignSelf: 'flex-start', marginBottom: 6 },
  premiumBadgeText: { color: '#7C3AED', fontSize: 11, fontWeight: '800' },
  tierDesc: { color: C.muted, fontSize: 12 },
  featureCard: { ...L.card, flexDirection: 'row', alignItems: 'center', padding: 14, marginBottom: 10 },
  iconWrap: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  iconText: { fontSize: 24 },
  featureInfo: { flex: 1 },
  featureTitle: { color: C.text, fontSize: 14, fontWeight: '700' },
  featureDesc: { color: C.muted, fontSize: 11, marginTop: 3 },
  premiumTag: { marginRight: 8, width: 20, height: 20, borderRadius: 10, backgroundColor: '#F0E9FF', alignItems: 'center', justifyContent: 'center' },
});
