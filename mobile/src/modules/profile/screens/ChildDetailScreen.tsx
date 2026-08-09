import React, { useState, useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Routes } from '@/navigation/constants';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
import * as childApi from '@/shared/api/childApi';
import type { ChildProfile } from '@/shared/api/childApi';

export default function ChildDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const childId = route.params?.childId;

  const [child, setChild] = useState<ChildProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadChild = useCallback(async () => {
    try {
      setLoading(true);
      const res = await childApi.getChild(childId);
      setChild(res);
    } catch (error: any) {
      Alert.alert('Lỗi', error?.message || 'Không thể tải thông tin trẻ');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [childId, navigation]);

  useFocusEffect(
    useCallback(() => {
      loadChild();
    }, [loadChild])
  );

  const getAge = (dob?: string) => {
    if (!dob) return 0;
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  if (loading || !child) {
    return (
      <View style={[L.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  // Fallbacks for MVP fields not in backend yet
  const maxXp = 1000 * child.level;
  const badges = ['⭐'];
  const recentMissions: any[] = [];
  const petName = 'Thú cưng';
  const petMood = 'Vui vẻ';

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
          <View style={styles.avatarLarge}><Text style={styles.avatarEmoji}>🧒</Text></View>
          <Text style={styles.childName}>{child.name}</Text>
          <Text style={styles.childMeta}>{getAge(child.dateOfBirth)} tuổi  •  Cấp {child.level}</Text>
          <View style={styles.xpBar}><View style={[styles.xpFill, { width: `${Math.min(100, (child.totalPoints / maxXp) * 100)}%` }]} /></View>
          <Text style={styles.xpLabel}>{child.totalPoints.toLocaleString()} / {maxXp.toLocaleString()} XP</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard icon="flame" color="#FF6B6B" value={1} label="Ngày liên tiếp" />
          <StatCard icon="checkmark-done" color={C.green} value={0} label="NV hoàn thành" />
          <StatCard icon="wallet" color={C.purple} value={child.totalPoints} label="Điểm thưởng" />
        </View>

        {/* Pet */}
        <Pressable style={[L.card, styles.petCard]}>
          <View style={styles.petAvatar}><Text style={{ fontSize: 30 }}>🐰</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.petName}>{petName}</Text>
            <Text style={styles.petMood}>Tâm trạng: {petMood}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={C.muted} />
        </Pressable>

        {/* Badges */}
        <Text style={L.sectionTitle}>Huy hiệu ({badges.length})</Text>
        <View style={styles.badgesRow}>
          {badges.map((b: string, i: number) => (
            <View key={i} style={styles.badgeItem}><Text style={{ fontSize: 24 }}>{b}</Text></View>
          ))}
        </View>

        {/* Recent missions */}
        <Text style={[L.sectionTitle, { marginTop: 18 }]}>Nhiệm vụ gần đây</Text>
        {recentMissions.length === 0 ? (
          <Text style={{ color: C.muted, fontSize: 12, marginTop: 10 }}>Chưa có nhiệm vụ nào</Text>
        ) : (
          recentMissions.map((m: any, i: number) => (
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
          ))
        )}
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
