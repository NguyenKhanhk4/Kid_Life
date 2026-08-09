import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, Alert, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, NavigationProp, RouteProp } from '@react-navigation/native';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSubmission, getMission, reviewSubmission } from '@/shared/api/missionApi';

export default function ApprovalDetailScreen() {
  const navigation = useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const queryClient = useQueryClient();
  const route = useRoute<RouteProp<Record<string, { submissionId?: string }>, string>>();
  const subId = route.params?.submissionId;

  const { data: sub, isLoading: subLoading } = useQuery({
    queryKey: ['submission', subId],
    queryFn: () => {
      if (!subId) return Promise.reject(new Error('Missing subId'));
      return getSubmission(subId);
    },
    enabled: !!subId,
  });

  const { data: missionData, isLoading: missionLoading } = useQuery({
    queryKey: ['mission', sub?.missionId],
    queryFn: () => {
      if (!sub?.missionId) return Promise.reject(new Error('Missing missionId'));
      return getMission(sub.missionId);
    },
    enabled: !!sub?.missionId,
  });

  const checklist = missionData?.checklist?.map((item) => `${item.text} ${item.isDone ? '✅' : '❌'}`) ?? [];

  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);



  const reviewMutation = useMutation({
    mutationFn: (data: { decision: 'approved' | 'rejected', reason?: string }) => {
      if (!subId) return Promise.reject(new Error('Missing subId'));
      return reviewSubmission(subId, data.decision, data.reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      queryClient.invalidateQueries({ queryKey: ['submission', subId] });
      Alert.alert('Thành công', 'Đã lưu phản hồi của bạn', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    },
    onError: (err: unknown) => {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      Alert.alert('Lỗi', errorMessage || 'Không thể gửi phản hồi');
    }
  });

  const handleApprove = () => {
    if (!sub) return;
    reviewMutation.mutate({ decision: 'approved' });
  };

  const handleReject = () => {
    if (!sub) return;
    if (!rejectReason.trim()) { Alert.alert('Lỗi', 'Vui lòng nhập lý do từ chối'); return; }
    reviewMutation.mutate({ decision: 'rejected', reason: rejectReason });
    setShowRejectModal(false);
  };

  if (subLoading || missionLoading) {
    return <View style={[L.screen, styles.emptyState]}><Text style={styles.missionTitle}>Đang tải...</Text></View>;
  }

  if (!sub || !missionData) {
    return <View style={[L.screen, styles.emptyState]}><Text style={styles.missionTitle}>Không tìm thấy dữ liệu</Text></View>;
  }


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
          <View style={styles.missionIcon}><Text style={{ fontSize: 32 }}>🎯</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.missionTitle}>{missionData.title}</Text>
            <View style={styles.missionMeta}>
              <View style={styles.skillPill}><Text style={styles.skillPillText}>{missionData.skillId || 'Kỹ năng'}</Text></View>
              <Text style={styles.xpText}>+{missionData.rewardPoints} XP</Text>
            </View>
          </View>
        </View>

        {/* Evidence preview */}
        <Text style={L.sectionTitle}>Hình ảnh/Video đính kèm</Text>
        {sub.evidenceUrls && sub.evidenceUrls.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingVertical: 10 }}>
            {sub.evidenceUrls.map((url, idx) => (
              <View key={idx} style={styles.evidenceCard}>
                <Image source={{ uri: url }} style={{ width: '100%', height: '100%', borderRadius: 12 }} resizeMode="cover" />
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text style={{ color: C.muted, marginVertical: 10 }}>Chưa có tệp đính kèm nào.</Text>
        )}

        {/* Checklist */}
        <Text style={[L.sectionTitle, { marginTop: 14 }]}>Checklist</Text>
        {checklist.map((item, i) => (
          <View key={i} style={styles.checkItem}>
            <Text style={styles.checkText}>{item}</Text>
          </View>
        ))}

        <View style={{ height: 20 }} />
        {sub.status === 'pending_review' && <View style={styles.actionRow}>
          <Pressable style={styles.rejectBtn} onPress={() => setShowRejectModal(true)}>
            <Ionicons name="close-circle" size={20} color={C.red} />
            <Text style={styles.rejectBtnText}>Từ chối</Text>
          </Pressable>
          <Pressable style={styles.approveBtn} onPress={handleApprove}>
            <Ionicons name="checkmark-circle" size={20} color="#FFF" />
            <Text style={styles.approveBtnText}>Duyệt & Tặng {missionData.rewardPoints} XP</Text>
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
  missionMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  skillPill: { backgroundColor: '#E4E9FF', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  skillPillText: { color: C.primary, fontSize: 11, fontWeight: '700' },
  xpText: { color: C.orange, fontSize: 13, fontWeight: '800' },
  childRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  childName: { color: C.text, fontSize: 13, fontWeight: '600' },
  timeText: { color: C.muted, fontSize: 11 },
  evidenceGrid: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  evidenceCard: { width: 120, height: 120, borderRadius: 16, backgroundColor: '#E7EBFF', alignItems: 'center', justifyContent: 'center' },
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
});
