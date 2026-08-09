import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, NavigationProp, RouteProp } from '@react-navigation/native';
import { Routes } from '@/navigation/constants';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMission, submitMission, updateChecklist } from '@/shared/api/missionApi';

export default function MissionDetailScreen() {
  const navigation = useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const route = useRoute<RouteProp<Record<string, { missionId?: string, mode?: 'child' | 'parent' }>, string>>();
  const missionId = route.params?.missionId;
  const mode = route.params?.mode || 'child';
  const [showUpload, setShowUpload] = useState(false);
  const queryClient = useQueryClient();

  if (!missionId) {
    return <View style={[L.screen, styles.emptyState]}><Text style={styles.title}>Không tìm thấy ID nhiệm vụ</Text></View>;
  }
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['mission', missionId],
    queryFn: () => {
      if (!missionId) return Promise.reject(new Error('Missing missionId'));
      return getMission(missionId);
    },
    enabled: !!missionId,
  });

  const checkMutation = useMutation({
    mutationFn: ({ itemId, isDone }: { itemId: string, isDone: boolean }) => updateChecklist(missionId, itemId, isDone),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mission', missionId] })
  });

  const submitMutation = useMutation({
    mutationFn: () => submitMission(missionId, []), // Empty evidence as we don't have storage yet
    onSuccess: () => {
      setShowUpload(false);
      Alert.alert('Thành công', 'Đã nộp bằng chứng! Chờ ba mẹ duyệt nhé.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    },
    onError: (err: Error) => {
      Alert.alert('Lỗi', err.message || 'Không thể nộp bằng chứng');
    }
  });

  const toggleCheck = (idx: number) => {
    if (!data?.checklist) return;
    const item = data.checklist[idx];
    checkMutation.mutate({ itemId: item._id, isDone: !item.isDone });
  };

  if (isLoading) {
    return <View style={[L.screen, styles.emptyState]}><Text style={styles.title}>Đang tải nhiệm vụ...</Text></View>;
  }

  if (isError || !data) {
    return <View style={[L.screen, styles.emptyState]}><Text style={styles.title}>Không tìm thấy nhiệm vụ</Text><Text>{error?.message}</Text></View>;
  }

  const mission = data;
  const checklist = mission.checklist || [];
  const allChecked = checklist?.length > 0 && checklist.every(i => i.isDone);

  const handleSubmit = () => {
    submitMutation.mutate();
  };

  return (
    <View style={L.screen}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Nhiệm vụ</Text>
        {mode === 'parent' ? (
          <Pressable style={styles.editBtn} onPress={() => navigation.navigate(Routes.Mission.Create, { editMissionId: mission._id })}>
            <Ionicons name="create-outline" size={20} color={C.primary} />
          </Pressable>
        ) : <View style={styles.back} />}
      </View>

      <ScrollView contentContainerStyle={L.content} showsVerticalScrollIndicator={false}>
        {/* Header card */}
        <View style={styles.topCard}>
          <View style={styles.iconBox}><Text style={{ fontSize: 36 }}>🎯</Text></View>
          <Text style={styles.title}>{mission.title}</Text>
          <View style={styles.metaRow}>
            <View style={styles.skillPill}><Text style={styles.skillPillText}>{mission.skillId || 'Kỹ năng'}</Text></View>
            <View style={styles.xpBadge}><Text style={styles.xpText}>+{mission.rewardPoints} XP</Text></View>
            <Text style={styles.dateText}>Hạn: {new Date(mission.dueDate).toLocaleDateString('vi-VN')}</Text>
          </View>
        </View>



        <Text style={styles.descTitle}>Ghi chú từ ba mẹ:</Text>
        <Text style={styles.descText}>{mission.description}</Text>

        <Text style={[L.sectionTitle, { marginTop: 20 }]}>Checklist ({checklist?.filter(c => c.isDone).length || 0}/{checklist?.length || 0})</Text>
        <View style={styles.checklist}>
          {checklist?.map((item, idx) => (
            <Pressable key={item._id} style={styles.checkItem} onPress={() => toggleCheck(idx)}>
              <Ionicons name={item.isDone ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={item.isDone ? C.green : C.muted} />
              <Text style={[styles.checkText, item.isDone && styles.checkTextDone]}>{item.text}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Footer Action */}
      {mode === 'child' && (
        <View style={styles.footer}>
          <Pressable 
            style={[styles.submitBtn, !allChecked && styles.submitBtnDisabled]}
            onPress={() => setShowUpload(true)}
            disabled={!allChecked}
          >
            <Ionicons name="camera" size={20} color="#FFF" />
            <Text style={styles.submitBtnText}>Nộp bằng chứng</Text>
          </Pressable>
        </View>
      )}

      {/* Upload Modal */}
      <Modal visible={showUpload} transparent animationType="slide" onRequestClose={() => setShowUpload(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nộp nhiệm vụ</Text>
              <Pressable onPress={() => setShowUpload(false)}><Ionicons name="close" size={24} color={C.text} /></Pressable>
            </View>
            <Text style={styles.modalDesc}>Xác nhận nộp nhiệm vụ đã hoàn thành.</Text>
            
            <View style={styles.uploadOptions}>
              <Text style={{ textAlign: 'center', marginBottom: 20, color: C.muted }}>Tính năng đính kèm tệp đang được phát triển.</Text>
              <Pressable style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitBtnText}>Nộp nhiệm vụ (Không đính kèm)</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 12 },
  emptyState: { alignItems: 'center', justifyContent: 'center' },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: '#E4E9FF', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: C.text, fontSize: 17, fontWeight: '800' },
  editBtn: { width: 42, height: 42, borderRadius: 22, backgroundColor: '#E4E9FF', alignItems: 'center', justifyContent: 'center' },
  topCard: { alignItems: 'center', paddingVertical: 10, marginBottom: 16 },
  iconBox: { width: 80, height: 80, borderRadius: 24, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  title: { color: C.text, fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  skillPill: { backgroundColor: C.primarySoft, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  skillPillText: { color: C.primary, fontSize: 11, fontWeight: '700' },
  xpBadge: { backgroundColor: C.orangeSoft, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  xpText: { color: '#B36A00', fontSize: 11, fontWeight: '800' },
  dateText: { color: C.muted, fontSize: 12, fontWeight: '600' },
  aiVideoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E7EBFF', borderRadius: 16, padding: 14, marginBottom: 20 },
  aiVideoIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  aiVideoTitle: { color: C.primary, fontSize: 14, fontWeight: '800' },
  aiVideoDesc: { color: C.muted, fontSize: 11, marginTop: 2 },
  descTitle: { color: C.text, fontSize: 14, fontWeight: '700', marginBottom: 6 },
  descText: { color: C.muted, fontSize: 14, lineHeight: 22, backgroundColor: '#F0F2FA', padding: 14, borderRadius: 12 },
  checklist: { marginTop: 10, backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden' },
  checkItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#EEF0F8', gap: 12 },
  checkText: { flex: 1, color: C.text, fontSize: 14, fontWeight: '600' },
  checkTextDone: { color: C.muted, textDecorationLine: 'line-through' },
  footer: { padding: 20, paddingBottom: 30, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EEF0F8' },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 54, borderRadius: 16, backgroundColor: C.primary },
  submitBtnDisabled: { backgroundColor: '#A4ADD0' },
  submitBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { color: C.text, fontSize: 18, fontWeight: '800' },
  modalDesc: { color: C.muted, fontSize: 13, marginBottom: 20 },
  uploadOptions: { flexDirection: 'row', gap: 12 },
  uploadBox: { flex: 1, height: 100, borderRadius: 16, backgroundColor: '#F0F2FA', alignItems: 'center', justifyContent: 'center', gap: 8 },
  uploadLabel: { color: C.text, fontSize: 12, fontWeight: '600' }
});
