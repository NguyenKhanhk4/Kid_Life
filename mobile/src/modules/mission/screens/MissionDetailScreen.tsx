import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Routes } from '@/navigation/constants';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
import { submitTask, toggleSubtask, useAppDispatch, useAppSelector } from '@/shared/store';

export default function MissionDetailScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const route = useRoute<any>();
  const { missionId = '1', mode = 'child' } = route.params ?? {};
  const tasks = useAppSelector((state) => state.kidlife.tasks);
  const storedTask = tasks.find((task) => task.id === missionId) ?? tasks[0];
  const [showUpload, setShowUpload] = useState(false);

  const toggleCheck = (idx: number) => {
    const subtask = storedTask?.subtasks[idx];
    if (storedTask && subtask) {
      dispatch(toggleSubtask({ taskId: storedTask.id, subtaskId: subtask.id }));
    }
  };

  if (!storedTask) {
    return <View style={[L.screen, styles.emptyState]}><Text style={styles.title}>Không tìm thấy nhiệm vụ</Text></View>;
  }

  const mission = {
    id: storedTask.id,
    title: storedTask.title,
    description: 'Bé hoàn thành lần lượt từng bước, sau đó chụp ảnh hoặc quay video để ba mẹ duyệt nhé.',
    skill: storedTask.category,
    rewardPoints: storedTask.rewardXP,
    dueDate: storedTask.time,
    emoji: storedTask.icon,
    aiVideoUrl: true,
    checklist: storedTask.subtasks.map((item) => ({ id: item.id, text: item.title, isDone: item.done })),
  };
  const allChecked = mission.checklist.every(i => i.isDone);

  const handleSubmit = () => {
    dispatch(submitTask({ taskId: mission.id }));
    setShowUpload(false);
    Alert.alert('Thành công', 'Đã nộp bằng chứng! Chờ ba mẹ duyệt nhé.', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <View style={L.screen}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Nhiệm vụ</Text>
        {mode === 'parent' ? (
          <Pressable style={styles.editBtn} onPress={() => navigation.navigate(Routes.Mission.Create, { editMissionId: mission.id })}>
            <Ionicons name="create-outline" size={20} color={C.primary} />
          </Pressable>
        ) : <View style={styles.back} />}
      </View>

      <ScrollView contentContainerStyle={L.content} showsVerticalScrollIndicator={false}>
        {/* Header card */}
        <View style={styles.topCard}>
          <View style={styles.iconBox}><Text style={{ fontSize: 36 }}>{mission.emoji}</Text></View>
          <Text style={styles.title}>{mission.title}</Text>
          <View style={styles.metaRow}>
            <View style={styles.skillPill}><Text style={styles.skillPillText}>{mission.skill}</Text></View>
            <View style={styles.xpBadge}><Text style={styles.xpText}>+{mission.rewardPoints} XP</Text></View>
            <Text style={styles.dateText}>Hạn: {mission.dueDate}</Text>
          </View>
        </View>

        {/* AI Video Link */}
        {mission.aiVideoUrl && mode === 'child' && (
          <Pressable style={styles.aiVideoCard} onPress={() => navigation.navigate(Routes.Mission.AIVideoStatus, { prompt: 'preview', templateId: '1' })}>
            <View style={styles.aiVideoIcon}><Ionicons name="play" size={20} color="#FFF" /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.aiVideoTitle}>Xem video hướng dẫn AI</Text>
              <Text style={styles.aiVideoDesc}>Nhấn để xem hoạt hình nhiệm vụ</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={C.primary} />
          </Pressable>
        )}

        <Text style={styles.descTitle}>Ghi chú từ ba mẹ:</Text>
        <Text style={styles.descText}>{mission.description}</Text>

        <Text style={[L.sectionTitle, { marginTop: 20 }]}>Checklist ({mission.checklist.filter(c => c.isDone).length}/{mission.checklist.length})</Text>
        <View style={styles.checklist}>
          {mission.checklist.map((item, idx) => (
            <Pressable key={item.id} style={styles.checkItem} onPress={() => toggleCheck(idx)}>
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
              <Text style={styles.modalTitle}>Nộp bằng chứng</Text>
              <Pressable onPress={() => setShowUpload(false)}><Ionicons name="close" size={24} color={C.text} /></Pressable>
            </View>
            <Text style={styles.modalDesc}>Chụp ảnh hoặc quay video bé đang làm nhiệm vụ để ba mẹ duyệt nhé.</Text>
            
            <View style={styles.uploadOptions}>
              <Pressable style={styles.uploadBox} onPress={handleSubmit}>
                <Ionicons name="camera" size={32} color={C.primary} />
                <Text style={styles.uploadLabel}>Chụp ảnh</Text>
              </Pressable>
              <Pressable style={styles.uploadBox} onPress={handleSubmit}>
                <Ionicons name="videocam" size={32} color={C.orange} />
                <Text style={styles.uploadLabel}>Quay video</Text>
              </Pressable>
              <Pressable style={styles.uploadBox} onPress={handleSubmit}>
                <Ionicons name="images" size={32} color={C.purple} />
                <Text style={styles.uploadLabel}>Thư viện</Text>
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
