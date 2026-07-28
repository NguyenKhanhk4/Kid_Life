import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';

type Subtask = { id: string; title: string; done: boolean };
type Mission = {
  id: string;
  icon: string;
  title: string;
  time: string;
  xp: string;
  category: string;
  subtasks: Subtask[];
};

export default function ChildTasksScreen() {
  const [taskList, setTaskList] = useState<Mission[]>(MOCK_KIDLIFE_DATA.todayTasks);
  const [selected, setSelected] = useState<Mission | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleToggleSubtask = (missionId: string, subtaskId: string) => {
    setTaskList((prev) =>
      prev.map((m) => {
        if (m.id !== missionId) return m;
        const updatedSubtasks = m.subtasks.map((st) => (st.id === subtaskId ? { ...st, done: !st.done } : st));
        const allDone = updatedSubtasks.every((st) => st.done);

        if (allDone) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 2500);
          Alert.alert('🎉 Xuất sắc!', `Bé đã tick đủ tất cả các bước của "${m.title}"! Nhận ${m.xp}!`);
        }

        return { ...m, subtasks: updatedSubtasks };
      })
    );

    if (selected && selected.id === missionId) {
      setSelected((prevSelected) => {
        if (!prevSelected) return null;
        const updatedSubtasks = prevSelected.subtasks.map((st) => (st.id === subtaskId ? { ...st, done: !st.done } : st));
        return { ...prevSelected, subtasks: updatedSubtasks };
      });
    }
  };

  const getCompletedCount = (subtasks: Subtask[]) => subtasks.filter((st) => st.done).length;

  return (
    <ScrollView style={L.screen} contentContainerStyle={L.content} showsVerticalScrollIndicator={false}>
      {showConfetti && (
        <View style={styles.confettiOverlay}>
          <Text style={{ fontSize: 40 }}>🎉 🎆 🥳 🌟 🎇</Text>
          <Text style={styles.confettiText}>BÉ HOÀN THÀNH TASK CHUỖI!</Text>
        </View>
      )}

      {/* Top Section Banner */}
      <View style={styles.topSection}>
        <View style={styles.topBar}>
          <View style={styles.starPill}>
            <Ionicons name="star" size={16} color={C.orange} />
            <Text style={styles.starText}>{MOCK_KIDLIFE_DATA.child.xp.toLocaleString()} XP</Text>
          </View>
          <View style={styles.badgePill}>
            <Ionicons name="map" size={16} color={C.primary} />
            <Text style={styles.badgeText}>Bản đồ nhiệm vụ</Text>
          </View>
        </View>

        <View style={styles.mascotContainer}>
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>Chào {MOCK_KIDLIFE_DATA.child.name}! Chạm vào nhiệm vụ để tick từng bước nhé!</Text>
            <View style={styles.speechArrow} />
          </View>
          <Text style={styles.mascotEmoji}>🐹</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="checkbox-outline" size={24} color={C.primary} />
          <Text style={styles.sectionTitle}>Nhiệm vụ chuỗi (Checklist)</Text>
        </View>
        <View style={styles.progressPill}>
          <Text style={styles.progressText}>1/4 hoàn thành</Text>
        </View>
      </View>

      {/* Task List */}
      <View style={styles.taskList}>
        {taskList.map((mission) => {
          const doneCount = getCompletedCount(mission.subtasks);
          const isFullyDone = doneCount === mission.subtasks.length;
          return (
            <View key={mission.id} style={[styles.taskCard, isFullyDone && styles.taskDoneCard]}>
              <View style={styles.taskCardTop}>
                <View style={styles.taskImage}>
                  <Text style={styles.taskEmoji}>{mission.icon}</Text>
                </View>
                <View style={styles.taskCopy}>
                  <Text style={styles.taskTitle}>{mission.title}</Text>
                  <View style={styles.taskTime}>
                    <Ionicons name="time-outline" size={14} color={C.muted} />
                    <Text style={styles.taskTimeText}>{mission.time}</Text>
                  </View>
                  <View style={styles.taskTags}>
                    <View style={styles.tagXp}>
                      <Text style={styles.tagXpText}>{mission.xp}</Text>
                    </View>
                    <View style={styles.tagCategory}>
                      <Text style={styles.tagCategoryText}>{doneCount}/{mission.subtasks.length} bước đã làm</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Progress bar inside card */}
              <View style={styles.cardProgressBar}>
                <View style={[styles.cardProgressFill, { width: `${(doneCount / mission.subtasks.length) * 100}%` }, isFullyDone && { backgroundColor: C.green }]} />
              </View>

              <TouchableOpacity
                style={[styles.actionBtn, isFullyDone && styles.actionBtnDone]}
                onPress={() => {
                  setSelected(mission);
                  setSubmitted(false);
                }}
              >
                <Text style={styles.actionBtnText}>{isFullyDone ? '✅ Hoàn thành chuỗi' : 'Thực hiện chuỗi bước'}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      <View style={{ height: 30 }} />

      {/* Multi-step Checklist Modal */}
      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modal}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>{selected?.icon} {selected?.title}</Text>
                <Text style={styles.modalSubtitle}>Nhiệm vụ chuỗi multi-step • {selected?.xp}</Text>
              </View>
              <Pressable onPress={() => setSelected(null)}>
                <Ionicons name="close-circle" size={26} color={C.muted} />
              </Pressable>
            </View>

            <Text style={styles.checklistInstruction}>Tick chọn từng ô khi bé làm xong từng bước:</Text>

            {/* Checklist Items */}
            <View style={styles.checklistContainer}>
              {selected?.subtasks.map((st, i) => (
                <Pressable
                  key={st.id}
                  style={[styles.checkItem, st.done && styles.checkItemDone]}
                  onPress={() => selected && handleToggleSubtask(selected.id, st.id)}
                >
                  <View style={[styles.checkBox, st.done && styles.checkBoxDone]}>
                    {st.done && <Ionicons name="checkmark" size={16} color="#FFF" />}
                  </View>
                  <Text style={[styles.checkText, st.done && styles.checkTextDone]}>
                    Bước {i + 1}: {st.title}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.evidenceTitleRow}>
              <Text style={styles.evidenceTitle}>Ảnh minh chứng (Không bắt buộc)</Text>
            </View>
            <View style={styles.evidenceBox}>
              <Text style={styles.evidenceEmoji}>{submitted ? '✅' : '📷'}</Text>
              <Text style={styles.evidenceText}>{submitted ? 'Đã gửi ảnh minh chứng cho ba mẹ' : 'Chụp ảnh để ba mẹ duyệt'}</Text>
            </View>

            <Pressable style={[styles.submitButton, submitted && styles.submittedButton]} onPress={() => setSubmitted(true)}>
              <Text style={styles.submitText}>{submitted ? 'Đã gửi cho ba mẹ' : 'Nộp bằng chứng'}</Text>
              <Ionicons name={submitted ? 'checkmark' : 'arrow-forward'} size={18} color={submitted ? C.green : '#FFF'} />
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  topSection: { backgroundColor: '#F9E9D2', marginHorizontal: -20, marginTop: -20, paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, marginBottom: 24 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  starPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, gap: 6 },
  starText: { color: C.primary, fontWeight: '800', fontSize: 14 },
  badgePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, gap: 6 },
  badgeText: { color: C.primary, fontWeight: '700', fontSize: 12 },

  mascotContainer: { alignItems: 'center', marginTop: 16, height: 160 },
  speechBubble: { backgroundColor: '#F8A959', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, marginBottom: 8 },
  speechText: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  speechArrow: { position: 'absolute', bottom: -8, left: '50%', marginLeft: -8, width: 0, height: 0, borderLeftWidth: 8, borderRightWidth: 8, borderTopWidth: 8, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#F8A959' },
  mascotEmoji: { fontSize: 100 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#1B2444' },
  progressPill: { backgroundColor: '#E7EBFF', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  progressText: { color: C.primary, fontSize: 11, fontWeight: '800' },

  taskList: { gap: 14 },
  taskCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: C.border },
  taskDoneCard: { borderColor: C.green, backgroundColor: '#FBFFFB' },
  taskCardTop: { flexDirection: 'row', marginBottom: 12 },
  taskImage: { width: 70, height: 70, borderRadius: 16, backgroundColor: '#DDF45B', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  taskEmoji: { fontSize: 36 },
  taskCopy: { flex: 1, justifyContent: 'center' },
  taskTitle: { color: '#1B2444', fontSize: 15, fontWeight: '800', marginBottom: 4 },
  taskTime: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  taskTimeText: { color: C.muted, fontSize: 11 },
  taskTags: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  tagXp: { backgroundColor: '#F4EBFF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagXpText: { color: '#9747FF', fontSize: 10, fontWeight: '800' },
  tagCategory: { backgroundColor: '#FFF5EB', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagCategoryText: { color: '#E85D04', fontSize: 10, fontWeight: '800' },

  cardProgressBar: { height: 6, backgroundColor: '#EFF1F7', borderRadius: 3, overflow: 'hidden', marginBottom: 12 },
  cardProgressFill: { height: '100%', backgroundColor: C.primary, borderRadius: 3 },

  actionBtn: { width: '100%', backgroundColor: C.primary, paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  actionBtnDone: { backgroundColor: C.green },
  actionBtnText: { color: '#FFF', fontSize: 13, fontWeight: '800' },

  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(17,24,70,.48)' },
  modal: { backgroundColor: C.background, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 20, paddingBottom: 32 },
  modalHandle: { width: 40, height: 4, borderRadius: 4, backgroundColor: '#CDD2E2', alignSelf: 'center', marginBottom: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  modalTitle: { color: C.text, fontSize: 18, fontWeight: '800' },
  modalSubtitle: { color: C.primary, fontSize: 11, marginTop: 3, fontWeight: '700' },

  checklistInstruction: { color: C.text, fontSize: 13, fontWeight: '700', marginBottom: 12 },
  checklistContainer: { gap: 8, marginBottom: 16 },
  checkItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFF', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.border },
  checkItemDone: { backgroundColor: '#F0FFF4', borderColor: C.green },
  checkBox: { width: 24, height: 24, borderRadius: 7, borderWidth: 2, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  checkBoxDone: { backgroundColor: C.green, borderColor: C.green },
  checkText: { color: C.text, fontSize: 13, fontWeight: '700', flex: 1 },
  checkTextDone: { textDecorationLine: 'line-through', color: C.muted },

  evidenceTitleRow: { marginTop: 4, marginBottom: 8 },
  evidenceTitle: { color: C.text, fontSize: 12, fontWeight: '800' },
  evidenceBox: { height: 60, borderWidth: 1, borderStyle: 'dashed', borderColor: C.primary, backgroundColor: C.primarySoft, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  evidenceEmoji: { fontSize: 18 },
  evidenceText: { color: C.primary, fontSize: 10, fontWeight: '700', marginTop: 2 },
  submitButton: { height: 50, borderRadius: 14, backgroundColor: C.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 14 },
  submittedButton: { backgroundColor: C.greenSoft },
  submitText: { color: '#FFF', fontSize: 13, fontWeight: '800' },

  confettiOverlay: { position: 'absolute', top: 100, left: 0, right: 0, zIndex: 999, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.95)', padding: 20, borderRadius: 20, marginHorizontal: 20 },
  confettiText: { color: C.orange, fontSize: 15, fontWeight: '900', marginTop: 8 },
});
