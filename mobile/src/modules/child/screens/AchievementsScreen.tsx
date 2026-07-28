import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Alert, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/constants';

const INITIAL_BADGES = [
  { icon: '⭐', title: 'Siêu sao', text: 'Hoàn thành 10 nhiệm vụ', status: 'claimed', progress: '10/10', reward: 50 },
  { icon: '😊', title: 'Bé ngoan', text: 'Duy trì streak 7 ngày', status: 'claimable', progress: '7/7', reward: 100 },
  { icon: '🧹', title: 'Chăm chỉ', text: 'Hoàn thành 30 nhiệm vụ', status: 'claimed', progress: '30/30', reward: 150 },
  { icon: '🎨', title: 'Sáng tạo', text: 'Hoàn thành 5 bài học', status: 'locked', progress: '3/5', reward: 50 },
  { icon: '🛡️', title: 'Dũng cảm', text: 'Thử 10 nhiệm vụ mới', status: 'locked', progress: '4/10', reward: 100 },
  { icon: '🏆', title: 'Nhà vô địch', text: 'Đạt cấp độ 10', status: 'locked', progress: '5/10', reward: 500 },
];

const templates = [
  { id: 'knight', emoji: '🛡️', name: 'Hiệp sĩ Dũng cảm', bg: '#2B44E8' },
  { id: 'princess', emoji: '👸', name: 'Công chúa Ngọt ngào', bg: '#FF6B9D' },
  { id: 'astronaut', emoji: '🚀', name: 'Phi hành gia Siêu sao', bg: '#6C5CE7' },
];

export default function AchievementsScreen() {
  const navigation = useNavigation<any>();
  const [tab, setTab] = useState('Tất cả');
  const [xpToExchange, setXpToExchange] = useState(1250);
  const [badgesState, setBadgesState] = useState(INITIAL_BADGES);

  // Viral Milestone Modal state
  const [showShareCard, setShowShareCard] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<typeof INITIAL_BADGES[0] | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [showShareSheet, setShowShareSheet] = useState(false);

  const handleClaim = (title: string, reward: number) => {
    setBadgesState((prev) => prev.map((b) => (b.title === title ? { ...b, status: 'claimed' } : b)));
    setXpToExchange((prev) => prev + reward);
    Alert.alert('🎉 Chúc mừng!', `Bé đã nhận được ${reward} XP từ huy hiệu "${title}"! Chạm vào huy hiệu để khoe với ông bà!`);
  };

  const handleBadgePress = (badge: typeof INITIAL_BADGES[0]) => {
    if (badge.status === 'locked') {
      Alert.alert('Huy hiệu chưa mở khóa', `Hãy hoàn thành "${badge.text}" để mở khóa huy hiệu này nhé!`);
      return;
    }
    setSelectedBadge(badge);
    setShowShareCard(true);
  };

  const handleShare = (platform: string) => {
    setShowShareSheet(false);
    Alert.alert('🎉 Chia sẻ thành công!', `Thiệp thành tựu "${selectedBadge?.title}" đã được chia sẻ qua ${platform}!\n\nNgười thân có thể quét mã QR trên thiệp để tải KidLife.`);
  };

  const filtered = tab === 'Đã đạt'
    ? badgesState.filter((item) => item.status !== 'locked')
    : tab === 'Chưa đạt'
      ? badgesState.filter((item) => item.status === 'locked')
      : badgesState;

  return (
    <ScrollView style={L.screen} contentContainerStyle={L.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.overline}>BỘ SƯU TẬP THÀNH TỰU</Text>
          <Text style={styles.title}>Huy hiệu của bé</Text>
        </View>
        <View style={styles.xp}>
          <Ionicons name="star" size={15} color={C.orange} />
          <Text style={styles.xpText}>{xpToExchange.toLocaleString()} XP</Text>
        </View>
      </View>

      {/* Level Progress */}
      <View style={styles.levelCard}>
        <View style={styles.levelTop}>
          <Text style={styles.level}>Cấp 5 - Em bé tự lập</Text>
          <Text style={styles.levelXp}>1,250 / 1,750 XP</Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: '71%' }]} />
        </View>
        <Text style={styles.levelHint}>Còn 500 XP nữa để lên Cấp 6 ✨</Text>
      </View>

      {/* Share Hint Banner */}
      <View style={styles.shareHintBox}>
        <Text style={{ fontSize: 20 }}>📸</Text>
        <Text style={styles.shareHintText}>Chạm vào huy hiệu đã đạt để tạo Thiệp Vinh Danh & khoe lên MXH!</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {['Tất cả', 'Đã đạt', 'Chưa đạt'].map((item) => (
          <Pressable key={item} onPress={() => setTab(item)} style={[styles.tab, tab === item && styles.tabActive]}>
            <Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {filtered.map((badge) => (
          <TouchableOpacity
            key={badge.title}
            style={[L.card, styles.badgeCard, badge.status === 'locked' && styles.locked]}
            onPress={() => handleBadgePress(badge)}
          >
            <View style={styles.badgeIcon}>
              <Text style={styles.badgeEmoji}>{badge.status !== 'locked' ? badge.icon : '🔒'}</Text>
            </View>
            <Text style={styles.badgeTitle} numberOfLines={1}>{badge.title}</Text>
            <Text style={styles.badgeText}>{badge.text}</Text>
            <View style={styles.badgeTrack}>
              <View style={[styles.badgeFill, { width: `${(Number(badge.progress.split('/')[0]) / Number(badge.progress.split('/')[1])) * 100}%` }]} />
            </View>
            <Text style={styles.badgeProgress}>{badge.progress}</Text>

            {badge.status === 'claimable' && (
              <TouchableOpacity style={styles.claimBtn} onPress={() => handleClaim(badge.title, badge.reward)}>
                <Text style={styles.claimBtnText}>Nhận {badge.reward} XP</Text>
              </TouchableOpacity>
            )}
            {badge.status === 'claimed' && (
              <View style={styles.claimedBtn}>
                <Ionicons name="sparkles" size={12} color={C.green} style={{ marginRight: 4 }} />
                <Text style={styles.claimedBtnText}>Khoe thiệp 📸</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Viral Milestone Card Modal */}
      <Modal visible={showShareCard} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.popupCard}>
            <Text style={styles.fireworks}>🎆🎇🎆</Text>
            <Text style={styles.congratsTitle}>🎉 Thiệp vinh danh thành tựu!</Text>
            <Text style={styles.congratsDesc}>Bé Minh Anh đã đạt danh hiệu "{selectedBadge?.title}"</Text>

            {/* Card Preview */}
            <View style={[styles.cardPreview, { backgroundColor: selectedTemplate.bg }]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardLogo}>KidLife</Text>
                <Text style={styles.cardBadge}>{selectedTemplate.emoji}</Text>
              </View>
              <Text style={styles.cardChildName}>✨ Bé Minh Anh ✨</Text>
              <View style={styles.cardAvatarWrap}>
                <Text style={{ fontSize: 44 }}>{selectedBadge?.icon}</Text>
              </View>
              <Text style={styles.cardAchievement}>{selectedBadge?.title}</Text>
              <Text style={styles.cardSubText}>{selectedBadge?.text}</Text>

              <View style={styles.qrPlaceholder}>
                <Text style={styles.qrText}>▣ QR Code</Text>
                <Text style={styles.qrHint}>Quét để tải app KidLife</Text>
              </View>
            </View>

            {/* Template Picker */}
            <Text style={styles.templateLabel}>Chọn mẫu thiệp:</Text>
            <View style={styles.templateRow}>
              {templates.map((t) => (
                <Pressable
                  key={t.id}
                  style={[styles.templateCard, selectedTemplate.id === t.id && styles.templateActive]}
                  onPress={() => setSelectedTemplate(t)}
                >
                  <Text style={{ fontSize: 24 }}>{t.emoji}</Text>
                  <Text style={styles.templateName}>{t.name}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable style={styles.ctaButton} onPress={() => setShowShareSheet(true)}>
              <Ionicons name="share-social" size={18} color="#FFF" />
              <Text style={styles.ctaText}>Chia sẻ với ông bà / bạn bè</Text>
            </Pressable>

            <Pressable style={styles.closePopup} onPress={() => setShowShareCard(false)}>
              <Text style={styles.closePopupText}>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Share Sheet */}
      <Modal visible={showShareSheet} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.shareSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Chia sẻ thiệp thành tựu</Text>
              <Pressable onPress={() => setShowShareSheet(false)}>
                <Ionicons name="close-circle" size={26} color={C.muted} />
              </Pressable>
            </View>
            <View style={styles.shareGrid}>
              {[
                { name: 'Facebook', icon: 'logo-facebook', color: '#1877F2' },
                { name: 'Instagram', icon: 'logo-instagram', color: '#E4405F' },
                { name: 'Zalo', icon: 'chatbubbles', color: '#0068FF' },
                { name: 'Lưu ảnh', icon: 'download-outline', color: C.green },
              ].map((p) => (
                <Pressable key={p.name} style={styles.shareItem} onPress={() => handleShare(p.name)}>
                  <View style={[styles.shareIconWrap, { backgroundColor: p.color + '18' }]}>
                    <Ionicons name={p.icon as any} size={24} color={p.color} />
                  </View>
                  <Text style={styles.shareName}>{p.name}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, marginBottom: 17 },
  overline: { color: C.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1.1 },
  title: { color: C.text, fontSize: 28, fontWeight: '800', marginTop: 4 },
  xp: { flexDirection: 'row', gap: 5, alignItems: 'center', backgroundColor: C.orangeSoft, borderRadius: 999, padding: 9 },
  xpText: { color: '#B36A00', fontSize: 12, fontWeight: '800' },

  levelCard: { backgroundColor: C.primary, borderRadius: 18, padding: 17, marginBottom: 14 },
  levelTop: { flexDirection: 'row', justifyContent: 'space-between' },
  level: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  levelXp: { color: '#DCE2FF', fontSize: 11 },
  track: { height: 9, backgroundColor: 'rgba(255,255,255,.24)', borderRadius: 5, overflow: 'hidden', marginTop: 12 },
  fill: { height: '100%', backgroundColor: C.lime, borderRadius: 5 },
  levelHint: { color: '#DCE2FF', fontSize: 10, marginTop: 7 },

  shareHintBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFF5CD', borderRadius: 14, padding: 12, marginBottom: 18 },
  shareHintText: { flex: 1, color: '#8A6D2B', fontSize: 11, fontWeight: '700', lineHeight: 16 },

  tabs: { flexDirection: 'row', gap: 7, marginBottom: 16 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10, backgroundColor: C.surface },
  tabActive: { backgroundColor: C.primary },
  tabText: { color: C.muted, fontSize: 11, fontWeight: '700' },
  tabTextActive: { color: '#FFF' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 11 },
  badgeCard: { width: '48%', padding: 13, alignItems: 'center' },
  locked: { opacity: 0.56 },
  badgeIcon: { width: 64, height: 64, borderRadius: 20, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 9 },
  badgeEmoji: { fontSize: 32 },
  badgeTitle: { color: C.text, fontSize: 14, fontWeight: '800' },
  badgeText: { color: C.muted, fontSize: 10, textAlign: 'center', lineHeight: 14, marginTop: 4, minHeight: 28 },
  badgeProgress: { color: C.primary, fontSize: 10, fontWeight: '800', marginTop: 4, marginBottom: 6 },
  badgeTrack: { width: '100%', height: 5, backgroundColor: '#EFF1F7', borderRadius: 3, overflow: 'hidden', marginTop: 4 },
  badgeFill: { height: '100%', backgroundColor: C.lime, borderRadius: 3 },
  claimBtn: { backgroundColor: C.orange, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, marginTop: 4, width: '100%', alignItems: 'center' },
  claimBtnText: { color: '#FFF', fontSize: 11, fontWeight: '800' },
  claimedBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E8F5E9', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, marginTop: 4, width: '100%' },
  claimedBtnText: { color: C.green, fontSize: 11, fontWeight: '800' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  popupCard: { backgroundColor: '#FFF', borderRadius: 26, padding: 20, width: '100%', maxWidth: 360, alignItems: 'center' },
  fireworks: { fontSize: 32 },
  congratsTitle: { color: C.text, fontSize: 18, fontWeight: '800', textAlign: 'center', marginTop: 4 },
  congratsDesc: { color: C.muted, fontSize: 12, textAlign: 'center', marginTop: 2, marginBottom: 14 },

  cardPreview: { width: '100%', borderRadius: 18, padding: 16, marginBottom: 14, alignItems: 'center' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 8 },
  cardLogo: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '800' },
  cardBadge: { fontSize: 22 },
  cardChildName: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  cardAvatarWrap: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginVertical: 8 },
  cardAchievement: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  cardSubText: { color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 2 },
  qrPlaceholder: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingVertical: 6, paddingHorizontal: 14, marginTop: 10, alignItems: 'center' },
  qrText: { color: '#FFF', fontSize: 18 },
  qrHint: { color: 'rgba(255,255,255,0.8)', fontSize: 9 },

  templateLabel: { color: C.text, fontSize: 12, fontWeight: '700', alignSelf: 'flex-start', marginBottom: 8 },
  templateRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  templateCard: { flex: 1, borderWidth: 2, borderColor: C.border, borderRadius: 12, padding: 8, alignItems: 'center' },
  templateActive: { borderColor: C.primary, backgroundColor: C.primarySoft },
  templateName: { color: C.text, fontSize: 9, fontWeight: '700', marginTop: 4, textAlign: 'center' },

  ctaButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.primary, borderRadius: 14, paddingVertical: 13, paddingHorizontal: 20, width: '100%', justifyContent: 'center' },
  ctaText: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  closePopup: { marginTop: 10 },
  closePopupText: { color: C.muted, fontSize: 13, fontWeight: '600' },

  shareSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40, width: '100%', position: 'absolute', bottom: 0 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sheetTitle: { color: C.text, fontSize: 16, fontWeight: '800' },
  shareGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  shareItem: { alignItems: 'center', gap: 6 },
  shareIconWrap: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  shareName: { color: C.text, fontSize: 11, fontWeight: '600' },
});
