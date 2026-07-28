import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Text, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';

const challenges = [
  { id: '1', title: '14 ngày làm việc nhà không cần nhắc', duration: '14 ngày', participants: 47, status: 'active', ageGroup: '5-8 tuổi', endsIn: '3 ngày 14 giờ' },
  { id: '2', title: '7 ngày đọc sách trước khi ngủ', duration: '7 ngày', participants: 32, status: 'upcoming', ageGroup: '6-10 tuổi', endsIn: 'Bắt đầu trong 2 ngày' },
  { id: '3', title: 'Tự giác tập thể dục 21 ngày', duration: '21 ngày', participants: 50, status: 'ended', ageGroup: '7-12 tuổi', endsIn: 'Đã kết thúc' },
];

const leaderboard = [
  { rank: 1, family: 'Gia đình Minh Anh', avatar: '👨‍👩‍👧', points: 2450, streak: 14, medal: '🥇' },
  { rank: 2, family: 'Gia đình Bảo Ngọc', avatar: '👨‍👩‍👦', points: 2380, streak: 13, medal: '🥈' },
  { rank: 3, family: 'Gia đình Đức Huy', avatar: '👩‍👧‍👦', points: 2200, streak: 12, medal: '🥉' },
  { rank: 4, family: 'Gia đình Thu Hà', avatar: '👨‍👧', points: 1980, streak: 11, medal: '' },
  { rank: 5, family: 'Gia đình Quốc Bảo', avatar: '👩‍👦', points: 1850, streak: 10, medal: '' },
  { rank: 6, family: 'Gia đình Phương Linh', avatar: '👨‍👩‍👧‍👦', points: 1720, streak: 9, medal: '' },
  { rank: 7, family: 'Gia đình Tuấn Kiệt', avatar: '👩‍👧', points: 1650, streak: 8, medal: '' },
  { rank: 8, family: 'Gia đình Hạ Vi', avatar: '👨‍👩‍👦‍👦', points: 1540, streak: 7, medal: '' },
];

export default function LeaderboardScreen() {
  const navigation = useNavigation<any>();
  const [activeChallenge, setActiveChallenge] = useState(challenges[0]);
  const [joined, setJoined] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const handleJoin = () => {
    setJoined(true);
    Alert.alert('🎉 Tham gia thành công!', `Bé đã tham gia thử thách "${activeChallenge.title}".\n\nHãy hoàn thành nhiệm vụ mỗi ngày để leo hạng!`);
  };

  return (
    <ScrollView style={L.screen} contentContainerStyle={[L.content, { paddingTop: 50 }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.overline}>THI ĐUA GIA ĐÌNH</Text>
          <Text style={styles.title}>Thử thách Cộng đồng 🏆</Text>
        </View>
      </View>

      {/* Active Challenges */}
      <Text style={L.sectionTitle}>Thử thách đang diễn ra</Text>
      <Text style={styles.subtitle}>Tham gia và thi đua cùng các gia đình khác</Text>

      {challenges.map((ch) => (
        <Pressable key={ch.id} style={[styles.challengeCard, ch.status === 'ended' && styles.ended]} onPress={() => { setActiveChallenge(ch); setShowDetail(true); if (ch.status === 'ended') setShowCongrats(true); }}>
          <View style={styles.challengeTop}>
            <View style={[styles.statusDot, ch.status === 'active' ? styles.dotActive : ch.status === 'upcoming' ? styles.dotUpcoming : styles.dotEnded]} />
            <Text style={styles.statusText}>{ch.status === 'active' ? 'Đang diễn ra' : ch.status === 'upcoming' ? 'Sắp diễn ra' : 'Đã kết thúc'}</Text>
            <View style={styles.ageBadge}><Text style={styles.ageText}>{ch.ageGroup}</Text></View>
          </View>
          <Text style={styles.challengeTitle}>{ch.title}</Text>
          <View style={styles.challengeMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color={C.muted} />
              <Text style={styles.metaText}>{ch.endsIn}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={14} color={C.muted} />
              <Text style={styles.metaText}>{ch.participants}/50 gia đình</Text>
            </View>
          </View>
          <View style={styles.participantBar}>
            <View style={[styles.participantFill, { width: `${(ch.participants / 50) * 100}%` }]} />
          </View>
        </Pressable>
      ))}

      {/* Leaderboard */}
      <View style={styles.sectionRow}>
        <Text style={L.sectionTitle}>Bảng xếp hạng 🔥</Text>
        <Text style={styles.liveText}>● LIVE</Text>
      </View>
      <Text style={styles.subtitle}>Cập nhật theo thời gian thực</Text>

      {/* Your rank highlight */}
      <View style={styles.yourRank}>
        <Text style={styles.yourRankText}>Vị trí của bạn</Text>
        <View style={styles.yourRankBadge}>
          <Text style={styles.yourRankNum}>#1</Text>
          <Text style={styles.yourRankPts}>2,450 điểm</Text>
        </View>
      </View>

      <View style={styles.leaderboardCard}>
        {leaderboard.map((entry, index) => (
          <View key={entry.rank} style={[styles.rankRow, index === 0 && styles.firstRow]}>
            <Text style={[styles.rank, entry.rank <= 3 && styles.topRank]}>{entry.medal || `#${entry.rank}`}</Text>
            <Text style={styles.rankAvatar}>{entry.avatar}</Text>
            <View style={styles.rankInfo}>
              <Text style={[styles.rankName, entry.rank === 1 && styles.firstName]}>{entry.family}</Text>
              <Text style={styles.rankStreak}>🔥 {entry.streak} ngày liên tiếp</Text>
            </View>
            <View style={styles.pointsCol}>
              <Text style={[styles.points, entry.rank === 1 && styles.firstPoints]}>{entry.points.toLocaleString()}</Text>
              <Text style={styles.pointsLabel}>điểm</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Join button */}
      {!joined ? (
        <Pressable style={styles.joinButton} onPress={handleJoin}>
          <Ionicons name="trophy" size={20} color="#FFF" />
          <Text style={styles.joinText}>Tham gia thử thách ngay!</Text>
        </Pressable>
      ) : (
        <View style={styles.joinedBanner}>
          <Ionicons name="checkmark-circle" size={20} color={C.green} />
          <Text style={styles.joinedText}>Đã tham gia! Hãy hoàn thành task mỗi ngày</Text>
        </View>
      )}

      {/* Trophy Modal for ended challenges */}
      <Modal visible={showCongrats} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.trophyCard}>
            <Text style={styles.trophyEmoji}>🏆</Text>
            <Text style={styles.trophyTitle}>Cúp Vàng!</Text>
            <Text style={styles.trophyDesc}>Gia đình bạn đã giành vị trí #1 trong thử thách "{challenges[2].title}"</Text>
            <Text style={styles.trophyStars}>⭐ +500 Sao thưởng</Text>
            <Pressable style={styles.trophyBtn} onPress={() => setShowCongrats(false)}>
              <Text style={styles.trophyBtnText}>Tuyệt vời!</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  overline: { color: C.orange, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: C.text, fontSize: 24, fontWeight: '800', marginTop: 3 },
  subtitle: { color: C.muted, fontSize: 12, marginTop: 4, marginBottom: 14 },
  challengeCard: { ...L.card, padding: 16, marginBottom: 12 },
  ended: { opacity: 0.65 },
  challengeTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  dotActive: { backgroundColor: C.green },
  dotUpcoming: { backgroundColor: C.orange },
  dotEnded: { backgroundColor: C.muted },
  statusText: { color: C.muted, fontSize: 11, fontWeight: '700', flex: 1 },
  ageBadge: { backgroundColor: C.primarySoft, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  ageText: { color: C.primary, fontSize: 10, fontWeight: '700' },
  challengeTitle: { color: C.text, fontSize: 15, fontWeight: '800', marginBottom: 10 },
  challengeMeta: { flexDirection: 'row', gap: 20, marginBottom: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { color: C.muted, fontSize: 11 },
  participantBar: { height: 6, backgroundColor: '#EFF1F7', borderRadius: 3, overflow: 'hidden' },
  participantFill: { height: '100%', backgroundColor: C.primary, borderRadius: 3 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  liveText: { color: C.red, fontSize: 11, fontWeight: '800' },
  yourRank: { ...L.card, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, marginBottom: 12, backgroundColor: C.primarySoft, borderColor: C.primary },
  yourRankText: { color: C.primary, fontSize: 13, fontWeight: '700' },
  yourRankBadge: { alignItems: 'flex-end' },
  yourRankNum: { color: C.primary, fontSize: 22, fontWeight: '800' },
  yourRankPts: { color: C.primary, fontSize: 11, fontWeight: '600' },
  leaderboardCard: { ...L.card, paddingHorizontal: 14, marginBottom: 18 },
  rankRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: C.border },
  firstRow: { backgroundColor: '#FFFCF0', marginHorizontal: -14, paddingHorizontal: 14, borderRadius: 12 },
  rank: { width: 34, color: C.muted, fontSize: 14, fontWeight: '700', textAlign: 'center' },
  topRank: { fontSize: 20 },
  rankAvatar: { fontSize: 24, marginRight: 10 },
  rankInfo: { flex: 1 },
  rankName: { color: C.text, fontSize: 12, fontWeight: '700' },
  firstName: { color: C.primary, fontWeight: '800' },
  rankStreak: { color: C.muted, fontSize: 10, marginTop: 3 },
  pointsCol: { alignItems: 'flex-end' },
  points: { color: C.text, fontSize: 14, fontWeight: '800' },
  firstPoints: { color: C.primary },
  pointsLabel: { color: C.muted, fontSize: 9 },
  joinButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.orange, borderRadius: 14, paddingVertical: 16 },
  joinText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  joinedBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.greenSoft, borderRadius: 14, paddingVertical: 16 },
  joinedText: { color: C.green, fontSize: 13, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  trophyCard: { backgroundColor: '#FFF', borderRadius: 28, padding: 30, alignItems: 'center', width: '100%', maxWidth: 340 },
  trophyEmoji: { fontSize: 72, marginBottom: 12 },
  trophyTitle: { color: C.text, fontSize: 26, fontWeight: '800' },
  trophyDesc: { color: C.muted, fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 20 },
  trophyStars: { color: C.orange, fontSize: 16, fontWeight: '800', marginTop: 14 },
  trophyBtn: { backgroundColor: C.orange, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 40, marginTop: 20 },
  trophyBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
});
