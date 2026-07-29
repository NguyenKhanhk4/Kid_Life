import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/constants';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
import { useAppSelector } from '@/shared/store';

type FilterType = 'all' | 'pending' | 'approved' | 'rejected';

export default function ApprovalQueueScreen() {
  const navigation = useNavigation<any>();
  const submissions = useAppSelector((state) => state.kidlife.submissions);
  const [filter, setFilter] = useState<FilterType>('pending');

  const filtered = filter === 'all' ? submissions : submissions.filter(s => s.status === filter);

  const getConfidenceColor = (c: number) => c >= 80 ? C.green : c >= 50 ? C.orange : C.red;

  return (
    <View style={L.screen}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Phê duyệt bằng chứng</Text>
        <View style={styles.back} />
      </View>

      {/* Filter tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, flexShrink: 0 }} contentContainerStyle={styles.filterRow}>
        {([['all', 'Tất cả'], ['pending', 'Chờ duyệt'], ['approved', 'Đã duyệt'], ['rejected', 'Từ chối']] as [FilterType, string][]).map(([key, label]) => (
          <Pressable key={key} style={[styles.filterChip, filter === key && styles.filterChipActive]} onPress={() => setFilter(key)}>
            <Text style={[styles.filterText, filter === key && styles.filterTextActive]}>{label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={L.content} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="checkmark-done-circle-outline" size={60} color={C.muted} />
            <Text style={styles.emptyTitle}>Không có bằng chứng</Text>
            <Text style={styles.emptyText}>Chưa có bằng chứng nào trong mục này</Text>
          </View>
        )}
        {filtered.map((sub) => (
          <Pressable
            key={sub.id}
            style={[L.card, styles.subCard]}
            onPress={() => navigation.navigate(Routes.Parent.ApprovalDetail, { submissionId: sub.id })}
          >
            <View style={styles.subTop}>
              <View style={styles.subIcon}><Text style={{ fontSize: 24 }}>{sub.emoji}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.subTitle}>{sub.missionTitle}</Text>
                <View style={styles.subMeta}>
                  <Text style={{ fontSize: 14 }}>{sub.childAvatar}</Text>
                  <Text style={styles.subChild}>{sub.childName}</Text>
                  <Text style={styles.subTime}>•  {sub.submittedAt}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={C.muted} />
            </View>
            <View style={styles.subBottom}>
              <View style={styles.aiRow}>
                <Ionicons name="sparkles" size={14} color={C.purple} />
                <Text style={styles.aiLabel}>AI: {sub.aiLabel}</Text>
                <View style={[styles.confidencePill, { backgroundColor: `${getConfidenceColor(sub.aiConfidence)}18` }]}>
                  <Text style={[styles.confidenceText, { color: getConfidenceColor(sub.aiConfidence) }]}>{sub.aiConfidence}%</Text>
                </View>
              </View>
              <View style={[styles.statusPill,
                sub.status === 'approved' ? styles.statusApproved :
                sub.status === 'rejected' ? styles.statusRejected : styles.statusPending
              ]}>
                <Text style={styles.statusText}>
                  {sub.status === 'approved' ? '✅ Đã duyệt' : sub.status === 'rejected' ? '❌ Từ chối' : '⏳ Chờ duyệt'}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 8 },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: '#E4E9FF', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: C.text, fontSize: 17, fontWeight: '800' },
  filterRow: { paddingHorizontal: 20, gap: 8, paddingBottom: 12, alignItems: 'center' },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#E7EBFF' },
  filterChipActive: { backgroundColor: C.primary },
  filterText: { color: C.muted, fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: '#FFF' },
  subCard: { padding: 14, marginBottom: 12 },
  subTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  subIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  subTitle: { color: C.text, fontSize: 14, fontWeight: '700', marginBottom: 4 },
  subMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  subChild: { color: C.muted, fontSize: 11, fontWeight: '600' },
  subTime: { color: C.muted, fontSize: 11 },
  subBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#EEF0F8' },
  aiRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  aiLabel: { color: C.purple, fontSize: 11, fontWeight: '600' },
  confidencePill: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  confidenceText: { fontSize: 11, fontWeight: '800' },
  statusPill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  statusApproved: { backgroundColor: C.greenSoft },
  statusRejected: { backgroundColor: C.redSoft },
  statusPending: { backgroundColor: C.orangeSoft },
  statusText: { fontSize: 11, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: { color: C.text, fontSize: 18, fontWeight: '700', marginTop: 12 },
  emptyText: { color: C.muted, fontSize: 13, marginTop: 4 },
});
