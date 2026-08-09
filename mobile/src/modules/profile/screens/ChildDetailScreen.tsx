import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Routes } from '@/navigation/constants';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';

const MOCK: Record<string, any> = {
  '1': { name: 'Minh Anh', age: 7, avatar: '🧒', level: 5, xp: 1250, maxXp: 1750, streak: 12, missionsCompleted: 48, walletBalance: 350, petName: 'Bông', petMood: '😊', badges: ['⭐', '😊', '🧹'], recentMissions: [
    { title: 'Dọn dẹp đồ chơi', status: 'completed', xp: 30, emoji: '🧸' },
    { title: 'Tự gấp quần áo', status: 'completed', xp: 50, emoji: '👕' },
    { title: 'Đánh răng trước khi ngủ', status: 'pending_review', xp: 30, emoji: '🪥' },
  ] },
  '2': { name: 'Thảo My', age: 5, avatar: '👧', level: 3, xp: 680, maxXp: 1000, streak: 5, missionsCompleted: 22, walletBalance: 150, petName: 'Miu', petMood: '😄', badges: ['⭐'], recentMissions: [
    { title: 'Rửa tay trước khi ăn', status: 'completed', xp: 20, emoji: '🧼' },
  ] },
  '3': { name: 'Nhật Linh', age: 9, avatar: '👦', level: 8, xp: 2100, maxXp: 2500, streak: 20, missionsCompleted: 95, walletBalance: 820, petName: 'Rocky', petMood: '🤩', badges: ['⭐', '😊', '🧹', '🎨', '🛡️'], recentMissions: [
    { title: 'Tô màu sáng tạo', status: 'completed', xp: 40, emoji: '🎨' },
    { title: 'Xếp sách vở', status: 'todo', xp: 30, emoji: '📔' },
  ] },
};

export default function ChildDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const childId = route.params?.childId ?? '1';
  const child = MOCK[childId] ?? MOCK['1'];

  return (
    <View style={L.screen}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Chi tiết hồ sơ</Text>
        <Pressable style={styles.editBtn} onPress={() => navigation.navigate(Routes.Profile.EditChild, { childId })}>
          <Ionicons name="create-outline" size={20} color={C.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={L.content} showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}><Text style={styles.avatarEmoji}>{child.avatar}</Text></View>
          <Text style={styles.childName}>{child.name}</Text>
          <Text style={styles.childMeta}>{child.age} tuổi  •  Cấp {child.level}</Text>
          <View style={styles.xpBar}><View style={[styles.xpFill, { width: `${(child.xp / child.maxXp) * 100}%` }]} /></View>
          <Text style={styles.xpLabel}>{child.xp.toLocaleString()} / {child.maxXp.toLocaleString()} XP</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard icon="flame" color="#FF6B6B" value={child.streak} label="Ngày liên tiếp" />
          <StatCard icon="checkmark-done" color={C.green} value={child.missionsCompleted} label="NV hoàn thành" />
          <StatCard icon="wallet" color={C.purple} value={child.walletBalance} label="Điểm thưởng" />
        </View>

        {/* Pet */}
        <Pressable style={[L.card, styles.petCard]}>
          <View style={styles.petAvatar}><Text style={{ fontSize: 30 }}>🐰</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.petName}>{child.petName}</Text>
            <Text style={styles.petMood}>Tâm trạng: {child.petMood}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={C.muted} />
        </Pressable>

        {/* Badges */}
        <Text style={L.sectionTitle}>Huy hiệu ({child.badges.length})</Text>
        <View style={styles.badgesRow}>
          {child.badges.map((b: string, i: number) => (
            <View key={i} style={styles.badgeItem}><Text style={{ fontSize: 24 }}>{b}</Text></View>
          ))}
        </View>

        {/* Recent missions */}
        <Text style={[L.sectionTitle, { marginTop: 18 }]}>Nhiệm vụ gần đây</Text>
        {child.recentMissions.map((m: any, i: number) => (
          <View key={i} style={[L.card, styles.missionItem]}>
            <View style={styles.missionIcon}><Text style={{ fontSize: 22 }}>{m.emoji}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.missionTitle}>{m.title}</Text>
              <Text style={styles.missionXp}>+{m.xp} XP</Text>
            </View>
            <View style={[styles.statusBadge, m.status === 'completed' ? styles.statusCompleted : m.status === 'pending_review' ? styles.statusPending : styles.statusTodo]}>
              <Text style={styles.statusText}>{m.status === 'completed' ? '✅' : m.status === 'pending_review' ? '⏳' : '📋'}</Text>
            </View>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function StatCard({ icon, color, value, label }: { icon: any; color: string; value: number; label: string }) {
  return (
    <View style={[styles.statCard, { backgroundColor: `${color}12` }]}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 12 },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: '#E4E9FF', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: C.text, fontSize: 17, fontWeight: '800' },
  editBtn: { width: 42, height: 42, borderRadius: 22, backgroundColor: '#E4E9FF', alignItems: 'center', justifyContent: 'center' },
  profileCard: { alignItems: 'center', paddingVertical: 24 },
  avatarLarge: { width: 90, height: 90, borderRadius: 30, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarEmoji: { fontSize: 48 },
  childName: { color: C.text, fontSize: 22, fontWeight: '800' },
  childMeta: { color: C.muted, fontSize: 13, marginTop: 4, marginBottom: 14 },
  xpBar: { width: '60%', height: 8, borderRadius: 4, backgroundColor: '#E7EBFF', overflow: 'hidden' },
  xpFill: { height: '100%', borderRadius: 4, backgroundColor: C.primary },
  xpLabel: { color: C.muted, fontSize: 11, marginTop: 6 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  statCard: { flex: 1, borderRadius: 16, paddingVertical: 14, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 10, color: C.muted, textAlign: 'center' },
  petCard: { flexDirection: 'row', alignItems: 'center', padding: 14, marginBottom: 18 },
  petAvatar: { width: 50, height: 50, borderRadius: 16, backgroundColor: C.orangeSoft, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  petName: { color: C.text, fontSize: 15, fontWeight: '700' },
  petMood: { color: C.muted, fontSize: 12, marginTop: 2 },
  badgesRow: { flexDirection: 'row', gap: 10, marginTop: 8, marginBottom: 10 },
  badgeItem: { width: 48, height: 48, borderRadius: 14, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  missionItem: { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 8 },
  missionIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  missionTitle: { color: C.text, fontSize: 13, fontWeight: '600' },
  missionXp: { color: C.orange, fontSize: 11, fontWeight: '700', marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  statusCompleted: { backgroundColor: C.greenSoft },
  statusPending: { backgroundColor: C.orangeSoft },
  statusTodo: { backgroundColor: '#E7EBFF' },
  statusText: { fontSize: 14 },
});
