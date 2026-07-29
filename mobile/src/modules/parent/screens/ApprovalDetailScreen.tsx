import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
import { reviewSubmission, useAppDispatch, useAppSelector } from '@/shared/store';

export default function ApprovalDetailScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const route = useRoute<any>();
  const subId = route.params?.submissionId;
  const { submissions, tasks } = useAppSelector((state) => state.kidlife);
  const sub = submissions.find((item) => item.id === subId) ?? submissions[0];
  const task = tasks.find((item) => item.id === sub?.taskId);
  const checklist = task?.subtasks.map((item) => `${item.title} ${item.done ? '✅' : '❌'}`) ?? [];

  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const getConfidenceColor = (c: number) => c >= 80 ? C.green : c >= 50 ? C.orange : C.red;

  const handleApprove = () => {
    if (!sub) return;
    dispatch(reviewSubmission({ submissionId: sub.id, approved: true }));
    Alert.alert('Đã duyệt!', `Bé ${sub.childName} được cộng điểm thưởng 🎉`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const handleReject = () => {
    if (!sub) return;
    if (!rejectReason.trim()) { Alert.alert('Lỗi', 'Vui lòng nhập lý do từ chối'); return; }
    dispatch(reviewSubmission({ submissionId: sub.id, approved: false, feedback: rejectReason }));
    setShowRejectModal(false);
    Alert.alert('Đã từ chối', 'Bé sẽ được thông báo và có thể nộp lại', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  if (!sub) {
    return <View style={[L.screen, styles.emptyState]}><Text style={styles.missionTitle}>Không tìm thấy bằng chứng</Text></View>;
  }

  const aiRecommendation = sub.aiConfidence >= 80 ? 'approve' : 'review';

  return (
    <View style={L.screen}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Chi tiết phê duyệt</Text>
        <View style={styles.back} />
      </View>

      <ScrollView contentContainerStyle={L.content} showsVerticalScrollIndicator={false}>
        {/* Mission info */}
        <View style={[L.card, styles.missionCard]}>
          <View style={styles.missionIcon}><Text style={{ fontSize: 30 }}>{sub.emoji}</Text></View>
          <Text style={styles.missionTitle}>{sub.missionTitle}</Text>
          <View style={styles.childRow}>
            <Text style={{ fontSize: 18 }}>{sub.childAvatar}</Text>
            <Text style={styles.childName}>{sub.childName}</Text>
            <Text style={styles.timeText}>•  {sub.submittedAt}</Text>
          </View>
        </View>

        {/* Evidence preview */}
        <Text style={L.sectionTitle}>Bằng chứng (1 ảnh)</Text>
        <Pressable style={styles.evidenceGrid} onPress={() => setShowImageModal(true)}>
          <View style={styles.evidencePlaceholder}>
            <Ionicons name="image" size={40} color={C.muted} />
            <Text style={styles.evidenceText}>Nhấn để xem</Text>
          </View>
          <View style={styles.evidencePlaceholder}>
            <Ionicons name="videocam" size={40} color={C.muted} />
            <Text style={styles.evidenceText}>Video</Text>
          </View>
        </Pressable>

        {/* Note from child */}
        <View style={[L.card, styles.noteCard]}>
          <Text style={styles.noteLabel}>💬 Ghi chú từ bé:</Text>
          <Text style={styles.noteText}>Con đã hoàn thành đủ các bước ạ!</Text>
        </View>

        {/* Checklist */}
        <Text style={[L.sectionTitle, { marginTop: 14 }]}>Checklist</Text>
        {checklist.map((item, i) => (
          <View key={i} style={styles.checkItem}>
            <Text style={styles.checkText}>{item}</Text>
          </View>
        ))}

        {/* AI Result */}
        <Text style={[L.sectionTitle, { marginTop: 18 }]}>Kết quả AI</Text>
        <View style={[L.card, styles.aiCard]}>
          <View style={styles.aiHeader}>
            <Ionicons name="sparkles" size={20} color={C.purple} />
            <Text style={styles.aiTitle}>Phân tích bằng chứng</Text>
          </View>
          <View style={styles.aiRow}>
            <Text style={styles.aiLabel}>Nhận diện:</Text>
            <Text style={styles.aiValue}>{sub.aiLabel}</Text>
          </View>
          <View style={styles.aiRow}>
            <Text style={styles.aiLabel}>Độ tin cậy:</Text>
            <View style={styles.confidenceBarBg}>
              <View style={[styles.confidenceBarFill, { width: `${sub.aiConfidence}%`, backgroundColor: getConfidenceColor(sub.aiConfidence) }]} />
            </View>
            <Text style={[styles.aiValue, { color: getConfidenceColor(sub.aiConfidence) }]}>{sub.aiConfidence}%</Text>
          </View>
          <View style={styles.aiRow}>
            <Text style={styles.aiLabel}>Đề xuất:</Text>
            <View style={[styles.recPill, aiRecommendation === 'approve' ? { backgroundColor: C.greenSoft } : { backgroundColor: C.orangeSoft }]}>
              <Text style={[styles.recText, aiRecommendation === 'approve' ? { color: C.green } : { color: C.orange }]}>
                {aiRecommendation === 'approve' ? '✅ Nên duyệt' : '⚠️ Cần xem xét'}
              </Text>
            </View>
          </View>
        </View>

        {/* Action buttons */}
        {sub.status === 'pending' && <View style={styles.actionRow}>
          <Pressable style={styles.rejectBtn} onPress={() => setShowRejectModal(true)}>
            <Ionicons name="close-circle" size={20} color={C.red} />
            <Text style={styles.rejectBtnText}>Từ chối</Text>
          </Pressable>
          <Pressable style={styles.approveBtn} onPress={handleApprove}>
            <Ionicons name="checkmark-circle" size={20} color="#FFF" />
            <Text style={styles.approveBtnText}>Duyệt & Tặng {sub.rewardXP} XP</Text>
          </Pressable>
        </View>}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Reject Modal */}
      <Modal visible={showRejectModal} transparent animationType="fade" onRequestClose={() => setShowRejectModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowRejectModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Lý do từ chối</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nhập lý do..."
              placeholderTextColor={C.muted}
              value={rejectReason}
              onChangeText={setRejectReason}
              multiline
              numberOfLines={3}
            />
            <View style={styles.modalActions}>
              <Pressable style={styles.modalCancel} onPress={() => setShowRejectModal(false)}>
                <Text style={styles.modalCancelText}>Hủy</Text>
              </Pressable>
              <Pressable style={styles.modalConfirm} onPress={handleReject}>
                <Text style={styles.modalConfirmText}>Xác nhận từ chối</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Image Preview Modal */}
      <Modal visible={showImageModal} transparent animationType="fade" onRequestClose={() => setShowImageModal(false)}>
        <Pressable style={styles.imageModalOverlay} onPress={() => setShowImageModal(false)}>
          <View style={styles.imageModalContent}>
            <Ionicons name="image-outline" size={80} color={C.muted} />
            <Text style={styles.imageModalText}>Xem trước bằng chứng</Text>
            <Text style={styles.imageModalSub}>(Sẽ hiển thị ảnh/video thực khi kết nối backend)</Text>
            <Pressable style={styles.imageModalClose} onPress={() => setShowImageModal(false)}>
              <Text style={styles.imageModalCloseText}>Đóng</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 12 },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: '#E4E9FF', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: C.text, fontSize: 17, fontWeight: '800' },
  emptyState: { alignItems: 'center', justifyContent: 'center' },
  missionCard: { alignItems: 'center', padding: 20, marginBottom: 18 },
  missionIcon: { width: 64, height: 64, borderRadius: 20, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  missionTitle: { color: C.text, fontSize: 18, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  childRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  childName: { color: C.text, fontSize: 13, fontWeight: '600' },
  timeText: { color: C.muted, fontSize: 11 },
  evidenceGrid: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  evidencePlaceholder: { flex: 1, height: 120, borderRadius: 16, backgroundColor: '#E7EBFF', alignItems: 'center', justifyContent: 'center' },
  evidenceText: { color: C.muted, fontSize: 11, marginTop: 4 },
  noteCard: { padding: 14, marginBottom: 10 },
  noteLabel: { color: C.text, fontSize: 13, fontWeight: '700', marginBottom: 6 },
  noteText: { color: C.muted, fontSize: 13, lineHeight: 20 },
  checkItem: { paddingVertical: 8, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: '#EEF0F8' },
  checkText: { color: C.text, fontSize: 13 },
  aiCard: { padding: 16, marginBottom: 20 },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  aiTitle: { color: C.purple, fontSize: 15, fontWeight: '700' },
  aiRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  aiLabel: { color: C.muted, fontSize: 12, width: 90 },
  aiValue: { color: C.text, fontSize: 13, fontWeight: '700' },
  confidenceBarBg: { flex: 1, height: 8, borderRadius: 4, backgroundColor: '#E7EBFF', marginHorizontal: 10, overflow: 'hidden' },
  confidenceBarFill: { height: '100%', borderRadius: 4 },
  recPill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  recText: { fontSize: 12, fontWeight: '700' },
  actionRow: { flexDirection: 'row', gap: 12 },
  rejectBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 52, borderRadius: 16, backgroundColor: C.redSoft },
  rejectBtnText: { color: C.red, fontSize: 14, fontWeight: '800' },
  approveBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 52, borderRadius: 16, backgroundColor: C.green },
  approveBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 20, padding: 20 },
  modalTitle: { color: C.text, fontSize: 18, fontWeight: '800', marginBottom: 14 },
  modalInput: { backgroundColor: '#F0F2FA', borderRadius: 12, padding: 14, color: C.text, fontSize: 13, minHeight: 80, textAlignVertical: 'top', marginBottom: 16 },
  modalActions: { flexDirection: 'row', gap: 10 },
  modalCancel: { flex: 1, height: 46, borderRadius: 14, backgroundColor: '#E7EBFF', alignItems: 'center', justifyContent: 'center' },
  modalCancelText: { color: C.muted, fontSize: 13, fontWeight: '700' },
  modalConfirm: { flex: 1, height: 46, borderRadius: 14, backgroundColor: C.red, alignItems: 'center', justifyContent: 'center' },
  modalConfirmText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  imageModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  imageModalContent: { alignItems: 'center', padding: 30 },
  imageModalText: { color: '#FFF', fontSize: 18, fontWeight: '700', marginTop: 16 },
  imageModalSub: { color: '#AAA', fontSize: 12, marginTop: 8 },
  imageModalClose: { marginTop: 30, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20, backgroundColor: '#FFF' },
  imageModalCloseText: { color: C.text, fontSize: 13, fontWeight: '700' },
});
