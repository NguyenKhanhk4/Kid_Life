import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
import { addTask, useAppDispatch } from '@/shared/store';

const radarData = { tuLap: 85, sucKhoe: 45, triTue: 72, tinhCam: 90 };
const prevMonth = { tuLap: 78, sucKhoe: 62, triTue: 65, tinhCam: 82 };

const recommendation = `Tháng này bé Minh Anh phát triển mạnh sự **Tự lập** (+7%) và **Tình cảm** (+8%), tuyệt vời! 🎉

Tuy nhiên chỉ số **Sức khỏe** giảm đáng kể (-17%). Bé ít hoàn thành các nhiệm vụ vận động.

💡 **Khuyến nghị:** Tháng tới hãy giao thêm các Nhiệm vụ như "Chạy bộ 15 phút mỗi sáng" hoặc "Ngủ trước 10h tối" để cải thiện chỉ số sức khỏe.`;

const monthlyTrend = [
  { month: 'T3', value: 62 },
  { month: 'T4', value: 68 },
  { month: 'T5', value: 71 },
  { month: 'T6', value: 75 },
  { month: 'T7', value: 73 },
];

export default function AIReportScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<'overview' | 'detail'>('overview');
  const [recommendationApplied, setRecommendationApplied] = useState(false);

  const skills = [
    { key: 'tuLap', label: 'Tự lập', icon: '🏠', value: radarData.tuLap, prev: prevMonth.tuLap, color: C.primary, desc: 'Làm việc cá nhân' },
    { key: 'sucKhoe', label: 'Sức khỏe', icon: '💪', value: radarData.sucKhoe, prev: prevMonth.sucKhoe, color: C.red, desc: 'Tập thể dục, ngủ sớm' },
    { key: 'triTue', label: 'Trí tuệ', icon: '🧠', value: radarData.triTue, prev: prevMonth.triTue, color: C.purple, desc: 'Làm bài tập, đọc sách' },
    { key: 'tinhCam', label: 'Tình cảm', icon: '💖', value: radarData.tinhCam, prev: prevMonth.tinhCam, color: '#FF6B9D', desc: 'Giúp đỡ gia đình' },
  ];

  return (
    <ScrollView style={L.screen} contentContainerStyle={[L.content, { paddingTop: 50 }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.overline}>BÁO CÁO AI</Text>
          <Text style={styles.title}>Phân tích Kỹ năng 📊</Text>
        </View>
        <View style={styles.premiumBadge}>
          <Ionicons name="diamond" size={12} color="#8E54E9" />
          <Text style={styles.premiumText}>Premium</Text>
        </View>
      </View>

      {/* Notification banner */}
      <View style={styles.notifBanner}>
        <Ionicons name="notifications" size={18} color={C.orange} />
        <Text style={styles.notifText}>Báo cáo phát triển tháng 7 của bé Minh Anh đã sẵn sàng!</Text>
      </View>

      {/* Child selector */}
      <View style={styles.childRow}>
        <View style={styles.childAvatar}><Text style={{ fontSize: 28 }}>🧒</Text></View>
        <View>
          <Text style={styles.childName}>Minh Anh</Text>
          <Text style={styles.childAge}>6 tuổi • Tháng 7/2026</Text>
        </View>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabRow}>
        <Pressable style={[styles.tab, activeTab === 'overview' && styles.tabActive]} onPress={() => setActiveTab('overview')}>
          <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>Tổng quan</Text>
        </Pressable>
        <Pressable style={[styles.tab, activeTab === 'detail' && styles.tabActive]} onPress={() => setActiveTab('detail')}>
          <Text style={[styles.tabText, activeTab === 'detail' && styles.tabTextActive]}>Chi tiết</Text>
        </Pressable>
      </View>

      {activeTab === 'overview' ? (
        <>
          {/* Radar Chart (simplified visual) */}
          <View style={styles.radarCard}>
            <Text style={styles.radarTitle}>Biểu đồ Kỹ năng (Radar Chart)</Text>
            <View style={styles.radarVisual}>
              <View style={styles.radarCenter}>
                <Text style={styles.radarScore}>73</Text>
                <Text style={styles.radarLabel}>Điểm TB</Text>
              </View>
              {skills.map((skill, i) => {
                const positions = [
                  { top: 0, left: '50%', transform: [{ translateX: -30 }] },
                  { top: '50%', right: 0, transform: [{ translateY: -20 }] },
                  { bottom: 0, left: '50%', transform: [{ translateX: -30 }] },
                  { top: '50%', left: 0, transform: [{ translateY: -20 }] },
                ] as any;
                return (
                  <View key={skill.key} style={[styles.radarPoint, positions[i]]}>
                    <Text style={styles.radarPointEmoji}>{skill.icon}</Text>
                    <Text style={styles.radarPointLabel}>{skill.label}</Text>
                    <Text style={[styles.radarPointValue, { color: skill.color }]}>{skill.value}%</Text>
                  </View>
                );
              })}
              {/* Circular indicators */}
              {skills.map((skill) => (
                <View key={`bar-${skill.key}`} style={[styles.ringWrap]}>
                  <View style={[styles.ring, { borderColor: skill.color, borderWidth: skill.value / 25 }]} />
                </View>
              ))}
            </View>
          </View>

          {/* Skill Bars */}
          <Text style={L.sectionTitle}>So sánh với tháng trước</Text>
          {skills.map((skill) => {
            const delta = skill.value - skill.prev;
            return (
              <View key={skill.key} style={styles.skillCard}>
                <View style={styles.skillTop}>
                  <Text style={styles.skillIcon}>{skill.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.skillName}>{skill.label}</Text>
                    <Text style={styles.skillDesc}>{skill.desc}</Text>
                  </View>
                  <View style={[styles.deltaChip, delta >= 0 ? styles.deltaUp : styles.deltaDown]}>
                    <Ionicons name={delta >= 0 ? 'arrow-up' : 'arrow-down'} size={11} color={delta >= 0 ? C.green : C.red} />
                    <Text style={[styles.deltaText, { color: delta >= 0 ? C.green : C.red }]}>{delta >= 0 ? '+' : ''}{delta}%</Text>
                  </View>
                </View>
                <View style={styles.compareRow}>
                  <View style={styles.barGroup}>
                    <Text style={styles.barLabel}>Tháng trước</Text>
                    <View style={styles.barTrack}><View style={[styles.barFill, { width: `${skill.prev}%`, backgroundColor: '#D8DBE7' }]} /></View>
                    <Text style={styles.barVal}>{skill.prev}%</Text>
                  </View>
                  <View style={styles.barGroup}>
                    <Text style={styles.barLabel}>Tháng này</Text>
                    <View style={styles.barTrack}><View style={[styles.barFill, { width: `${skill.value}%`, backgroundColor: skill.color }]} /></View>
                    <Text style={[styles.barVal, { color: skill.color }]}>{skill.value}%</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </>
      ) : (
        <>
          {/* Monthly Trend */}
          <View style={styles.trendCard}>
            <Text style={styles.trendTitle}>Xu hướng phát triển 5 tháng</Text>
            <View style={styles.trendChart}>
              {monthlyTrend.map((m) => (
                <View key={m.month} style={styles.trendCol}>
                  <Text style={styles.trendVal}>{m.value}</Text>
                  <View style={styles.trendBarTrack}>
                    <View style={[styles.trendBarFill, { height: `${m.value}%` }]} />
                  </View>
                  <Text style={styles.trendMonth}>{m.month}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Task completion detail */}
          <Text style={L.sectionTitle}>Chi tiết hoàn thành nhiệm vụ</Text>
          {[
            { tag: 'Tự lập', tasks: 28, total: 32, icon: '🏠' },
            { tag: 'Sức khỏe', tasks: 12, total: 28, icon: '💪' },
            { tag: 'Trí tuệ', tasks: 20, total: 28, icon: '🧠' },
            { tag: 'Tình cảm', tasks: 25, total: 28, icon: '💖' },
          ].map((item) => (
            <View key={item.tag} style={styles.detailRow}>
              <Text style={styles.detailIcon}>{item.icon}</Text>
              <Text style={styles.detailTag}>{item.tag}</Text>
              <View style={styles.detailBarTrack}>
                <View style={[styles.detailBarFill, { width: `${(item.tasks / item.total) * 100}%` }]} />
              </View>
              <Text style={styles.detailCount}>{item.tasks}/{item.total}</Text>
            </View>
          ))}
        </>
      )}

      {/* AI Recommendation */}
      <View style={styles.aiCard}>
        <View style={styles.aiHeader}>
          <Text style={styles.aiIcon}>🤖</Text>
          <Text style={styles.aiTitle}>AI Khuyến nghị</Text>
        </View>
        <Text style={styles.aiText}>{recommendation}</Text>
        <Pressable
          disabled={recommendationApplied}
          style={[styles.applyButton, recommendationApplied && styles.applyButtonDone]}
          onPress={() => {
            dispatch(addTask({
              title: 'Đánh răng & Ngủ trước 21h',
              time: '20:30 - 21:00',
              rewardXP: 50,
              category: 'Sức khỏe',
              icon: '🪥',
              subtasks: ['Đánh răng đủ 2 phút', 'Chuẩn bị giường ngủ', 'Lên giường trước 21h'],
            }));
            setRecommendationApplied(true);
            Alert.alert('Đã phát hành nhiệm vụ', 'Nhiệm vụ AI đã xuất hiện ngay trong danh sách của bé.');
          }}
        >
          <Ionicons name={recommendationApplied ? 'checkmark-circle' : 'sparkles'} size={18} color={recommendationApplied ? C.green : '#FFF'} />
          <Text style={[styles.applyButtonText, recommendationApplied && styles.applyButtonTextDone]}>
            {recommendationApplied ? 'Đã áp dụng gợi ý' : 'Áp dụng gợi ý nhiệm vụ AI'}
          </Text>
        </Pressable>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  overline: { color: C.purple, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: C.text, fontSize: 24, fontWeight: '800', marginTop: 3 },
  premiumBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F0E9FF', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  premiumText: { color: '#8E54E9', fontSize: 11, fontWeight: '800' },
  notifBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.orangeSoft, borderRadius: 14, padding: 14, marginBottom: 18 },
  notifText: { flex: 1, color: '#8A5A05', fontSize: 12, fontWeight: '600', lineHeight: 18 },
  childRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  childAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  childName: { color: C.text, fontSize: 17, fontWeight: '800' },
  childAge: { color: C.muted, fontSize: 12, marginTop: 3 },
  tabRow: { flexDirection: 'row', backgroundColor: '#ECEFF8', borderRadius: 12, padding: 3, marginBottom: 18 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 9 },
  tabActive: { backgroundColor: '#FFF' },
  tabText: { color: C.muted, fontSize: 13, fontWeight: '700' },
  tabTextActive: { color: C.primary },
  radarCard: { ...L.card, padding: 20, marginBottom: 22, alignItems: 'center' },
  radarTitle: { color: C.text, fontSize: 14, fontWeight: '700', marginBottom: 18 },
  radarVisual: { width: 240, height: 240, position: 'relative' },
  radarCenter: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -28 }, { translateY: -22 }], alignItems: 'center' },
  radarScore: { color: C.primary, fontSize: 32, fontWeight: '800' },
  radarLabel: { color: C.muted, fontSize: 10 },
  radarPoint: { position: 'absolute', alignItems: 'center', width: 60 },
  radarPointEmoji: { fontSize: 22 },
  radarPointLabel: { color: C.text, fontSize: 10, fontWeight: '700', marginTop: 2 },
  radarPointValue: { fontSize: 13, fontWeight: '800' },
  ringWrap: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -50 }, { translateY: -50 }] },
  ring: { width: 100, height: 100, borderRadius: 50, borderWidth: 2 },
  skillCard: { ...L.card, padding: 14, marginBottom: 10 },
  skillTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  skillIcon: { fontSize: 22 },
  skillName: { color: C.text, fontSize: 13, fontWeight: '700' },
  skillDesc: { color: C.muted, fontSize: 10, marginTop: 2 },
  deltaChip: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  deltaUp: { backgroundColor: C.greenSoft },
  deltaDown: { backgroundColor: C.redSoft },
  deltaText: { fontSize: 11, fontWeight: '800' },
  compareRow: { gap: 8 },
  barGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barLabel: { color: C.muted, fontSize: 10, width: 72 },
  barTrack: { flex: 1, height: 8, backgroundColor: '#EFF1F7', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  barVal: { color: C.text, fontSize: 11, fontWeight: '800', width: 38, textAlign: 'right' },
  trendCard: { ...L.card, padding: 18, marginBottom: 20 },
  trendTitle: { color: C.text, fontSize: 14, fontWeight: '700', marginBottom: 14 },
  trendChart: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 140 },
  trendCol: { alignItems: 'center', width: 40 },
  trendVal: { color: C.text, fontSize: 11, fontWeight: '800', marginBottom: 6 },
  trendBarTrack: { width: 24, height: 100, borderRadius: 12, backgroundColor: '#EFF1F7', overflow: 'hidden', justifyContent: 'flex-end' },
  trendBarFill: { width: '100%', backgroundColor: C.purple, borderRadius: 12 },
  trendMonth: { color: C.muted, fontSize: 10, marginTop: 6 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  detailIcon: { fontSize: 18 },
  detailTag: { color: C.text, fontSize: 12, fontWeight: '700', width: 65 },
  detailBarTrack: { flex: 1, height: 8, backgroundColor: '#EFF1F7', borderRadius: 4, overflow: 'hidden' },
  detailBarFill: { height: '100%', backgroundColor: C.purple, borderRadius: 4 },
  detailCount: { color: C.text, fontSize: 12, fontWeight: '800', width: 40, textAlign: 'right' },
  aiCard: { backgroundColor: '#F0F7FF', borderRadius: 20, padding: 18, marginTop: 20, borderWidth: 1, borderColor: '#D0E3FF' },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  aiIcon: { fontSize: 22 },
  aiTitle: { color: C.primary, fontSize: 15, fontWeight: '800' },
  aiText: { color: '#2A4A7F', fontSize: 13, lineHeight: 20 },
  applyButton: { marginTop: 16, minHeight: 48, borderRadius: 13, backgroundColor: C.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 14 },
  applyButtonDone: { backgroundColor: C.greenSoft },
  applyButtonText: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  applyButtonTextDone: { color: C.green },
});
