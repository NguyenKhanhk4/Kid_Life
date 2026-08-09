import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';

const radarSkills = [
  { key: 'tuLap', name: 'Tự lập', icon: '🏠', value: 85, prev: 78, color: C.primary, desc: 'Làm việc cá nhân, dọn dẹp' },
  { key: 'sucKhoe', name: 'Sức khỏe', icon: '💪', value: 45, prev: 62, color: C.red, desc: 'Tập thể dục, ngủ sớm' },
  { key: 'triTue', name: 'Trí tuệ', icon: '🧠', value: 72, prev: 65, color: C.purple, desc: 'Làm bài tập, đọc sách' },
  { key: 'tinhCam', name: 'Tình cảm', icon: '💖', value: 90, prev: 82, color: '#FF6B9D', desc: 'Giúp đỡ gia đình' },
];

const aiRecommendationText = `Tháng này bé Minh Anh phát triển mạnh sự Tự lập (+7%) và Tình cảm (+8%), rất tuyệt vời! 🎉

Tuy nhiên chỉ số Sức khỏe giảm đáng kể (-17%). Bé ít hoàn thành các nhiệm vụ vận động.

💡 AI Khuyến nghị: Tháng tới hãy giao thêm các Nhiệm vụ như 'Chạy bộ 15 phút mỗi sáng' hoặc 'Ngủ trước 10h tối' để cải thiện chỉ số sức khỏe của bé.`;

export default function ReportsParentScreen() {
  const [range, setRange] = useState('Tháng này');
  const [activeTab, setActiveTab] = useState<'radar' | 'trend'>('radar');

  return (
    <ScrollView style={L.screen} contentContainerStyle={L.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.overline}>BÁO CÁO PHÂN TÍCH AI</Text>
          <Text style={styles.title}>Báo cáo kỹ năng</Text>
        </View>
        <Pressable style={styles.childPill}>
          <Text style={styles.childEmoji}>🧒</Text>
          <Text style={styles.childName}>Minh Anh</Text>
          <Ionicons name="chevron-down" size={15} color={C.primary} />
        </Pressable>
      </View>

      {/* Date Range Selector */}
      <View style={styles.rangeRow}>
        {['Tuần này', 'Tháng này', 'Quý này'].map((item) => (
          <Pressable key={item} onPress={() => setRange(item)} style={[styles.range, range === item && styles.rangeActive]}>
            <Text style={[styles.rangeText, range === item && styles.rangeTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>

      {/* High-level metrics */}
      <View style={styles.statsRow}>
        <Metric value="34/40" label="Nhiệm vụ" icon="checkmark-circle" color={C.green} />
        <Metric value="85%" label="Hoàn thành" icon="trending-up" color={C.primary} />
        <Metric value="+420" label="XP tích lũy" icon="star" color={C.orange} />
      </View>

      {/* Radar Chart Card */}
      <View style={[L.card, styles.radarCard]}>
        <View style={styles.radarHeader}>
          <View style={styles.aiBadge}>
            <Ionicons name="sparkles" size={14} color="#8E54E9" />
            <Text style={styles.aiBadgeText}>AI Skill Analytics</Text>
          </View>
          <Text style={styles.chartTitle}>Biểu đồ Radar Kỹ năng</Text>
        </View>

        {/* Circular Radar Graphic */}
        <View style={styles.radarVisual}>
          <View style={styles.radarCenter}>
            <Text style={styles.radarScore}>73</Text>
            <Text style={styles.radarLabel}>Điểm TB</Text>
          </View>
          {radarSkills.map((skill, i) => {
            const positions = [
              { top: 0, left: '50%', transform: [{ translateX: -30 }] },
              { top: '45%', right: 0 },
              { bottom: 0, left: '50%', transform: [{ translateX: -30 }] },
              { top: '45%', left: 0 },
            ] as any;
            return (
              <View key={skill.key} style={[styles.radarPoint, positions[i]]}>
                <Text style={styles.radarPointEmoji}>{skill.icon}</Text>
                <Text style={styles.radarPointName}>{skill.name}</Text>
                <Text style={[styles.radarPointVal, { color: skill.color }]}>{skill.value}%</Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.radarSubtitle}>Đo lường 4 chỉ số cốt lõi sự phát triển của bé</Text>
      </View>

      {/* Skill Details & Comparison */}
      <View style={styles.sectionHeader}>
        <Text style={L.sectionTitle}>Chi tiết kỹ năng & So sánh</Text>
      </View>

      {radarSkills.map((skill) => {
        const delta = skill.value - skill.prev;
        return (
          <View key={skill.key} style={[L.card, styles.skillCard]}>
            <View style={styles.skillTop}>
              <Text style={styles.skillIcon}>{skill.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.skillName}>{skill.name}</Text>
                <Text style={styles.skillDesc}>{skill.desc}</Text>
              </View>
              <View style={[styles.deltaBadge, delta >= 0 ? styles.deltaUp : styles.deltaDown]}>
                <Ionicons name={delta >= 0 ? 'arrow-up' : 'arrow-down'} size={11} color={delta >= 0 ? C.green : C.red} />
                <Text style={[styles.deltaText, { color: delta >= 0 ? C.green : C.red }]}>{delta >= 0 ? '+' : ''}{delta}%</Text>
              </View>
            </View>

            <View style={styles.compareBars}>
              <View style={styles.compareRow}>
                <Text style={styles.compareLabel}>Kỳ trước</Text>
                <View style={styles.barTrack}><View style={[styles.barFill, { width: `${skill.prev}%`, backgroundColor: '#D8DBE7' }]} /></View>
                <Text style={styles.compareVal}>{skill.prev}%</Text>
              </View>
              <View style={styles.compareRow}>
                <Text style={styles.compareLabel}>Kỳ này</Text>
                <View style={styles.barTrack}><View style={[styles.barFill, { width: `${skill.value}%`, backgroundColor: skill.color }]} /></View>
                <Text style={[styles.compareVal, { color: skill.color }]}>{skill.value}%</Text>
              </View>
            </View>
          </View>
        );
      })}

      {/* AI Recommendation Box */}
      <View style={styles.aiBox}>
        <View style={styles.aiBoxHeader}>
          <Text style={{ fontSize: 24 }}>🤖</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.aiBoxTitle}>AI Khuyến nghị Giáo dục</Text>
            <Text style={styles.aiBoxSub}>Phân tích từ dữ liệu làm việc nhà của bé</Text>
          </View>
        </View>
        <Text style={styles.aiBoxText}>{aiRecommendationText}</Text>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

function Metric({ value, label, icon, color }: { value: string; label: string; icon: any; color: string }) {
  return (
    <View style={styles.metric}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, marginBottom: 17 },
  overline: { color: '#8E54E9', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: C.text, fontSize: 26, fontWeight: '800', marginTop: 3 },
  childPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 999, padding: 6, paddingRight: 10 },
  childEmoji: { fontSize: 19 },
  childName: { color: C.text, fontSize: 11, fontWeight: '700' },
  rangeRow: { flexDirection: 'row', backgroundColor: '#ECEFF8', borderRadius: 12, padding: 3, marginBottom: 18 },
  range: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 9 },
  rangeActive: { backgroundColor: C.surface },
  rangeText: { color: C.muted, fontSize: 11, fontWeight: '700' },
  rangeTextActive: { color: C.primary },
  statsRow: { flexDirection: 'row', gap: 9, marginBottom: 20 },
  metric: { flex: 1, alignItems: 'center', backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, paddingVertical: 12 },
  metricValue: { color: C.text, fontSize: 16, fontWeight: '800', marginTop: 7 },
  metricLabel: { color: C.muted, fontSize: 10, marginTop: 3 },
  radarCard: { padding: 18, marginBottom: 20, alignItems: 'center' },
  radarHeader: { alignItems: 'center', marginBottom: 16 },
  aiBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#F0E9FF', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 6 },
  aiBadgeText: { color: '#8E54E9', fontSize: 11, fontWeight: '800' },
  chartTitle: { color: C.text, fontSize: 15, fontWeight: '800' },
  radarVisual: { width: 220, height: 220, position: 'relative', marginVertical: 10 },
  radarCenter: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -24 }, { translateY: -20 }], alignItems: 'center' },
  radarScore: { color: C.primary, fontSize: 28, fontWeight: '800' },
  radarLabel: { color: C.muted, fontSize: 10 },
  radarPoint: { position: 'absolute', alignItems: 'center', width: 60 },
  radarPointEmoji: { fontSize: 20 },
  radarPointName: { color: C.text, fontSize: 10, fontWeight: '700' },
  radarPointVal: { fontSize: 12, fontWeight: '800' },
  radarSubtitle: { color: C.muted, fontSize: 11, marginTop: 10 },
  sectionHeader: { marginBottom: 12 },
  skillCard: { padding: 14, marginBottom: 10 },
  skillTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  skillIcon: { fontSize: 24 },
  skillName: { color: C.text, fontSize: 13, fontWeight: '700' },
  skillDesc: { color: C.muted, fontSize: 10, marginTop: 2 },
  deltaBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  deltaUp: { backgroundColor: C.greenSoft },
  deltaDown: { backgroundColor: C.redSoft },
  deltaText: { fontSize: 11, fontWeight: '800' },
  compareBars: { gap: 6 },
  compareRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  compareLabel: { color: C.muted, fontSize: 10, width: 55 },
  barTrack: { flex: 1, height: 7, backgroundColor: '#EFF1F7', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  compareVal: { color: C.text, fontSize: 11, fontWeight: '800', width: 34, textAlign: 'right' },
  aiBox: { backgroundColor: '#F0F7FF', borderRadius: 20, padding: 18, marginTop: 14, borderWidth: 1, borderColor: '#D0E3FF' },
  aiBoxHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  aiBoxTitle: { color: C.primary, fontSize: 15, fontWeight: '800' },
  aiBoxSub: { color: C.muted, fontSize: 11, marginTop: 2 },
  aiBoxText: { color: '#2A4A7F', fontSize: 12, lineHeight: 19 },
});
