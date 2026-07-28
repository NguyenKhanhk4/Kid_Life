import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Text, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';

const milestones = [
  { id: '1', icon: '🦷', title: 'Giữ chuỗi 30 ngày đánh răng!', stars: 500, unlocked: true },
  { id: '2', icon: '⭐', title: 'Đạt 1.000 Sao tích lũy!', stars: 1000, unlocked: true },
  { id: '3', icon: '🧹', title: 'Huy hiệu "Em bé gọn gàng"', stars: 300, unlocked: true },
  { id: '4', icon: '📚', title: 'Đọc sách 7 ngày liên tiếp', stars: 200, unlocked: false },
  { id: '5', icon: '🏃', title: 'Tập thể dục 14 ngày liên tiếp', stars: 350, unlocked: false },
];

const templates = [
  { id: 'knight', emoji: '🛡️', name: 'Hiệp sĩ Dũng cảm', bg: '#2B44E8', accent: '#C9ED3A' },
  { id: 'princess', emoji: '👸', name: 'Công chúa Ngọt ngào', bg: '#FF6B9D', accent: '#FFD93D' },
  { id: 'astronaut', emoji: '🚀', name: 'Phi hành gia Siêu sao', bg: '#6C5CE7', accent: '#81ECEC' },
];

export default function ViralMilestonesScreen() {
  const navigation = useNavigation<any>();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(milestones[0]);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [showPreview, setShowPreview] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [shared, setShared] = useState(false);

  const handleMilestoneTap = (milestone: typeof milestones[0]) => {
    if (!milestone.unlocked) return;
    setSelectedMilestone(milestone);
    setShowPopup(true);
  };

  const handleShare = (platform: string) => {
    setShowShareSheet(false);
    setShared(true);
    Alert.alert('🎉 Chia sẻ thành công!', `Thiệp thành tựu đã được chia sẻ qua ${platform}!\n\nBạn bè của bạn có thể quét mã QR trên thiệp để tải app KidLife.`);
  };

  return (
    <ScrollView style={L.screen} contentContainerStyle={[L.content, { paddingTop: 50 }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.overline}>CHIA SẺ THÀNH TỰU</Text>
          <Text style={styles.title}>Viral Milestones 📸</Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>💡</Text>
        <Text style={styles.infoText}>Khi bé đạt cột mốc, hãy tạo thiệp vinh danh và chia sẻ niềm tự hào lên mạng xã hội!</Text>
      </View>

      <Text style={L.sectionTitle}>Thành tựu của bé Minh Anh</Text>
      <Text style={styles.subtitle}>Chạm vào thành tựu đã mở khóa để tạo thiệp</Text>

      {milestones.map((m) => (
        <Pressable key={m.id} style={[styles.milestoneCard, !m.unlocked && styles.locked]} onPress={() => handleMilestoneTap(m)}>
          <Text style={styles.milestoneIcon}>{m.icon}</Text>
          <View style={styles.milestoneInfo}>
            <Text style={[styles.milestoneName, !m.unlocked && styles.lockedText]}>{m.title}</Text>
            <Text style={styles.milestoneStars}>⭐ {m.stars} Sao</Text>
          </View>
          {m.unlocked ? (
            <View style={styles.unlockedBadge}>
              <Ionicons name="checkmark-circle" size={22} color={C.green} />
            </View>
          ) : (
            <View style={styles.lockBadge}>
              <Ionicons name="lock-closed" size={16} color={C.muted} />
            </View>
          )}
        </Pressable>
      ))}

      {/* Popup Pháo hoa chúc mừng */}
      <Modal visible={showPopup} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.popupCard}>
            <Text style={styles.fireworks}>🎆🎇🎆</Text>
            <Text style={styles.congratsTitle}>🎉 Chúc mừng bé Minh Anh!</Text>
            <Text style={styles.congratsDesc}>{selectedMilestone.title}</Text>
            <Text style={styles.congratsEmoji}>{selectedMilestone.icon}</Text>

            {!showPreview ? (
              <>
                <Text style={styles.templateLabel}>Chọn mẫu thiệp:</Text>
                <View style={styles.templateRow}>
                  {templates.map((t) => (
                    <Pressable key={t.id} style={[styles.templateCard, selectedTemplate.id === t.id && styles.templateActive]} onPress={() => setSelectedTemplate(t)}>
                      <Text style={styles.templateEmoji}>{t.emoji}</Text>
                      <Text style={styles.templateName}>{t.name}</Text>
                      {selectedTemplate.id === t.id && <View style={styles.checkDot}><Ionicons name="checkmark" size={10} color="#FFF" /></View>}
                    </Pressable>
                  ))}
                </View>
                <Pressable style={styles.ctaButton} onPress={() => setShowPreview(true)}>
                  <Ionicons name="sparkles" size={18} color="#FFF" />
                  <Text style={styles.ctaText}>Khoe ngay với ông bà/bạn bè!</Text>
                </Pressable>
              </>
            ) : (
              <>
                {/* Preview thiệp */}
                <View style={[styles.cardPreview, { backgroundColor: selectedTemplate.bg }]}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardLogo}>KidLife</Text>
                    <Text style={styles.cardBadge}>{selectedTemplate.emoji}</Text>
                  </View>
                  <Text style={styles.cardChildName}>✨ Minh Anh ✨</Text>
                  <View style={styles.cardAvatarWrap}>
                    <Text style={styles.cardAvatar}>🧒</Text>
                  </View>
                  <Text style={styles.cardAchievement}>{selectedMilestone.title}</Text>
                  <Text style={styles.cardDate}>Ngày 28/07/2026</Text>
                  <View style={styles.qrPlaceholder}>
                    <Text style={styles.qrText}>▣ QR Code</Text>
                    <Text style={styles.qrHint}>Quét để tải KidLife</Text>
                  </View>
                </View>
                <Pressable style={[styles.ctaButton, { backgroundColor: '#28B978' }]} onPress={() => setShowShareSheet(true)}>
                  <Ionicons name="share-social" size={18} color="#FFF" />
                  <Text style={styles.ctaText}>Chia sẻ thiệp</Text>
                </Pressable>
              </>
            )}

            <Pressable style={styles.closePopup} onPress={() => { setShowPopup(false); setShowPreview(false); }}>
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
              <Text style={styles.sheetTitle}>Chia sẻ đến</Text>
              <Pressable onPress={() => setShowShareSheet(false)}>
                <Ionicons name="close-circle" size={28} color={C.muted} />
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
                    <Ionicons name={p.icon as any} size={26} color={p.color} />
                  </View>
                  <Text style={styles.shareName}>{p.name}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  overline: { color: '#FF6B9D', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: C.text, fontSize: 24, fontWeight: '800', marginTop: 3 },
  infoBox: { flexDirection: 'row', backgroundColor: '#FFF8E1', borderRadius: 14, padding: 14, marginBottom: 22, gap: 10, alignItems: 'center' },
  infoIcon: { fontSize: 22 },
  infoText: { flex: 1, color: '#8A6D2B', fontSize: 12, lineHeight: 18 },
  subtitle: { color: C.muted, fontSize: 12, marginTop: 6, marginBottom: 14 },
  milestoneCard: { ...L.card, flexDirection: 'row', alignItems: 'center', padding: 14, marginBottom: 10 },
  locked: { opacity: 0.5 },
  milestoneIcon: { fontSize: 32, marginRight: 12 },
  milestoneInfo: { flex: 1 },
  milestoneName: { color: C.text, fontSize: 13, fontWeight: '700' },
  lockedText: { color: C.muted },
  milestoneStars: { color: C.orange, fontSize: 11, marginTop: 4, fontWeight: '600' },
  unlockedBadge: { marginLeft: 8 },
  lockBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F0F2F8', alignItems: 'center', justifyContent: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  popupCard: { backgroundColor: '#FFF', borderRadius: 28, padding: 24, width: '100%', maxWidth: 380, alignItems: 'center' },
  fireworks: { fontSize: 38, marginBottom: 8 },
  congratsTitle: { color: C.text, fontSize: 20, fontWeight: '800', textAlign: 'center' },
  congratsDesc: { color: C.muted, fontSize: 14, marginTop: 6, textAlign: 'center' },
  congratsEmoji: { fontSize: 56, marginVertical: 16 },
  templateLabel: { color: C.text, fontSize: 13, fontWeight: '700', alignSelf: 'flex-start', marginBottom: 10 },
  templateRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  templateCard: { flex: 1, borderWidth: 2, borderColor: C.border, borderRadius: 14, padding: 10, alignItems: 'center' },
  templateActive: { borderColor: C.primary, backgroundColor: C.primarySoft },
  templateEmoji: { fontSize: 28 },
  templateName: { color: C.text, fontSize: 9, fontWeight: '700', marginTop: 6, textAlign: 'center' },
  checkDot: { position: 'absolute', top: 4, right: 4, width: 18, height: 18, borderRadius: 9, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  ctaButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.primary, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 24, width: '100%', justifyContent: 'center' },
  ctaText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  cardPreview: { width: '100%', borderRadius: 20, padding: 20, marginBottom: 16, alignItems: 'center' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 12 },
  cardLogo: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '800' },
  cardBadge: { fontSize: 26 },
  cardChildName: { color: '#FFF', fontSize: 22, fontWeight: '800' },
  cardAvatarWrap: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginVertical: 12 },
  cardAvatar: { fontSize: 42 },
  cardAchievement: { color: 'rgba(255,255,255,0.95)', fontSize: 14, fontWeight: '700', textAlign: 'center' },
  cardDate: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 8 },
  qrPlaceholder: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16, marginTop: 14, alignItems: 'center' },
  qrText: { color: '#FFF', fontSize: 22 },
  qrHint: { color: 'rgba(255,255,255,0.8)', fontSize: 9, marginTop: 4 },
  closePopup: { marginTop: 14 },
  closePopupText: { color: C.muted, fontSize: 14, fontWeight: '600' },
  shareSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, width: '100%', position: 'absolute', bottom: 0 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  sheetTitle: { color: C.text, fontSize: 18, fontWeight: '800' },
  shareGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  shareItem: { alignItems: 'center', gap: 8 },
  shareIconWrap: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  shareName: { color: C.text, fontSize: 11, fontWeight: '600' },
});
