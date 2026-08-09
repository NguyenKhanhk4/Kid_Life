import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';

type SubTask = { id: string; title: string; done: boolean };
type Task = { id: string; title: string; emoji: string; reward: number; subtasks: SubTask[]; status: 'todo' | 'in_progress' | 'done' };

const initialTasks: Task[] = [
  {
    id: '1', title: 'Dọn phòng khách', emoji: '🛋️', reward: 80,
    subtasks: [
      { id: 's1', title: 'Cất đồ chơi vào hộp', done: false },
      { id: 's2', title: 'Lau bàn sạch sẽ', done: false },
      { id: 's3', title: 'Quét sàn nhà', done: false },
    ],
    status: 'todo',
  },
  {
    id: '2', title: 'Chuẩn bị bữa sáng', emoji: '🍳', reward: 60,
    subtasks: [
      { id: 's4', title: 'Rửa tay sạch', done: true },
      { id: 's5', title: 'Lấy bánh mì & bơ', done: true },
      { id: 's6', title: 'Dọn bàn ăn', done: false },
      { id: 's7', title: 'Rửa chén sau khi ăn', done: false },
    ],
    status: 'in_progress',
  },
  {
    id: '3', title: 'Tự vệ sinh cá nhân', emoji: '🪥', reward: 50,
    subtasks: [
      { id: 's8', title: 'Đánh răng sáng', done: true },
      { id: 's9', title: 'Rửa mặt', done: true },
      { id: 's10', title: 'Thay đồ gọn gàng', done: true },
    ],
    status: 'done',
  },
];

const [parentView, childView] = ['parent', 'child'] as const;

export default function MultiStepTaskScreen() {
  const navigation = useNavigation<any>();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [viewMode, setViewMode] = useState<'parent' | 'child'>('child');
  const [expandedTask, setExpandedTask] = useState<string | null>('2');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) => prev.map((task) => {
      if (task.id !== taskId) return task;
      const updated = task.subtasks.map((st) => st.id === subtaskId ? { ...st, done: !st.done } : st);
      const allDone = updated.every((st) => st.done);
      const anyDone = updated.some((st) => st.done);

      if (allDone && task.status !== 'done') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        Alert.alert('🎉🎊 Hoàn thành xuất sắc!', `Bé đã hoàn thành tất cả bước của "${task.title}"!\n\n+${task.reward} ⭐ đã được thưởng!`);
      }

      return { ...task, subtasks: updated, status: allDone ? 'done' : anyDone ? 'in_progress' : 'todo' };
    }));
  };

  const getProgress = (task: Task) => {
    const done = task.subtasks.filter((st) => st.done).length;
    return { done, total: task.subtasks.length, percent: (done / task.subtasks.length) * 100 };
  };

  return (
    <ScrollView style={L.screen} contentContainerStyle={[L.content, { paddingTop: 50 }]} showsVerticalScrollIndicator={false}>
      {/* Confetti overlay */}
      {showConfetti && (
        <View style={styles.confettiOverlay}>
          <Text style={styles.confettiText}>🎉🎊🎆🥳🎇🎉</Text>
          <Text style={styles.confettiTitle}>Tuyệt vời!</Text>
        </View>
      )}

      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.overline}>NHIỆM VỤ CHUỖI</Text>
          <Text style={styles.title}>Multi-step Tasks 📋</Text>
        </View>
        <View style={styles.premiumBadge}>
          <Ionicons name="diamond" size={12} color="#8E54E9" />
          <Text style={styles.premiumText}>Premium</Text>
        </View>
      </View>

      {/* View Mode Toggle */}
      <View style={styles.tabRow}>
        <Pressable style={[styles.tab, viewMode === 'child' && styles.tabActive]} onPress={() => setViewMode('child')}>
          <Ionicons name="happy" size={16} color={viewMode === 'child' ? C.primary : C.muted} />
          <Text style={[styles.tabText, viewMode === 'child' && styles.tabTextActive]}>Bé thực hiện</Text>
        </Pressable>
        <Pressable style={[styles.tab, viewMode === 'parent' && styles.tabActive]} onPress={() => setViewMode('parent')}>
          <Ionicons name="create" size={16} color={viewMode === 'parent' ? C.primary : C.muted} />
          <Text style={[styles.tabText, viewMode === 'parent' && styles.tabTextActive]}>Phụ huynh tạo</Text>
        </Pressable>
      </View>

      {viewMode === 'child' ? (
        <>
          {/* Child View - Execute tasks */}
          <Text style={styles.childHint}>✨ Tick từng bước để hoàn thành nhiệm vụ!</Text>

          {tasks.map((task) => {
            const progress = getProgress(task);
            const isExpanded = expandedTask === task.id;
            return (
              <View key={task.id} style={[styles.taskCard, task.status === 'done' && styles.taskDone]}>
                <Pressable style={styles.taskHeader} onPress={() => setExpandedTask(isExpanded ? null : task.id)}>
                  <Text style={styles.taskEmoji}>{task.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.taskTitle, task.status === 'done' && styles.taskTitleDone]}>{task.title}</Text>
                    <View style={styles.taskMeta}>
                      <Text style={styles.taskReward}>⭐ {task.reward}</Text>
                      <Text style={styles.taskProgress}>{progress.done}/{progress.total} bước</Text>
                    </View>
                  </View>
                  <View style={styles.progressCircle}>
                    <Text style={styles.progressText}>{Math.round(progress.percent)}%</Text>
                  </View>
                  <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color={C.muted} />
                </Pressable>

                {/* Progress Bar */}
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progress.percent}%` }, task.status === 'done' && styles.progressDone]} />
                </View>

                {/* Subtasks */}
                {isExpanded && (
                  <View style={styles.subtaskList}>
                    {task.subtasks.map((st, i) => (
                      <Pressable key={st.id} style={styles.subtaskRow} onPress={() => toggleSubtask(task.id, st.id)}>
                        <View style={[styles.checkbox, st.done && styles.checkboxDone]}>
                          {st.done && <Ionicons name="checkmark" size={14} color="#FFF" />}
                        </View>
                        <Text style={[styles.subtaskText, st.done && styles.subtaskDone]}>
                          {i + 1}. {st.title}
                        </Text>
                        {st.done && <Text style={styles.doneEmoji}>✅</Text>}
                      </Pressable>
                    ))}
                  </View>
                )}

                {task.status === 'done' && (
                  <View style={styles.completeBanner}>
                    <Ionicons name="trophy" size={16} color={C.orange} />
                    <Text style={styles.completeText}>Hoàn thành xuất sắc! +{task.reward} ⭐</Text>
                  </View>
                )}
              </View>
            );
          })}
        </>
      ) : (
        <>
          {/* Parent View - Create tasks */}
          <Text style={styles.parentHint}>📝 Tạo nhiệm vụ dạng checklist cho bé</Text>

          <Pressable style={styles.createBtn} onPress={() => {
            Alert.alert(
              '📋 Tạo nhiệm vụ mới',
              'Demo: Đã tạo nhiệm vụ "Dọn dẹp phòng ngủ" với 3 bước:\n\n☐ Gấp chăn gối\n☐ Sắp xếp sách vở\n☐ Hút bụi phòng\n\nĐã giao cho bé Minh Anh!',
            );
          }}>
            <Ionicons name="add-circle" size={22} color="#FFF" />
            <Text style={styles.createBtnText}>Tạo nhiệm vụ Checklist mới</Text>
          </Pressable>

          {/* Example of created tasks with status */}
          <Text style={L.sectionTitle}>Nhiệm vụ đã tạo</Text>
          {tasks.map((task) => {
            const progress = getProgress(task);
            return (
              <View key={task.id} style={styles.parentTaskCard}>
                <View style={styles.parentTaskTop}>
                  <Text style={styles.taskEmoji}>{task.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <Text style={styles.taskSteps}>{task.subtasks.length} bước • {task.reward} ⭐</Text>
                  </View>
                  <View style={[styles.statusPill, task.status === 'done' ? styles.statusDone : task.status === 'in_progress' ? styles.statusProgress : styles.statusTodo]}>
                    <Text style={styles.statusText}>
                      {task.status === 'done' ? '✅ Xong' : task.status === 'in_progress' ? '🔄 Đang làm' : '⏳ Chờ'}
                    </Text>
                  </View>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progress.percent}%` }]} />
                </View>
                <View style={styles.parentSubtasks}>
                  {task.subtasks.map((st) => (
                    <Text key={st.id} style={[styles.parentSubtaskText, st.done && styles.parentSubtaskDone]}>
                      {st.done ? '✅' : '☐'} {st.title}
                    </Text>
                  ))}
                </View>
              </View>
            );
          })}
        </>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  overline: { color: '#E17055', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: C.text, fontSize: 24, fontWeight: '800', marginTop: 3 },
  premiumBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F0E9FF', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  premiumText: { color: '#8E54E9', fontSize: 11, fontWeight: '800' },
  tabRow: { flexDirection: 'row', backgroundColor: '#ECEFF8', borderRadius: 12, padding: 3, marginBottom: 18 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 9 },
  tabActive: { backgroundColor: '#FFF' },
  tabText: { color: C.muted, fontSize: 13, fontWeight: '700' },
  tabTextActive: { color: C.primary },
  childHint: { color: C.primary, fontSize: 13, fontWeight: '600', marginBottom: 14, textAlign: 'center' },
  parentHint: { color: C.text, fontSize: 13, fontWeight: '600', marginBottom: 14 },
  taskCard: { ...L.card, padding: 16, marginBottom: 14, overflow: 'hidden' },
  taskDone: { borderColor: C.green, backgroundColor: '#FBFFFB' },
  taskHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  taskEmoji: { fontSize: 32 },
  taskTitle: { color: C.text, fontSize: 15, fontWeight: '800' },
  taskTitleDone: { textDecorationLine: 'line-through', color: C.green },
  taskMeta: { flexDirection: 'row', gap: 12, marginTop: 4 },
  taskReward: { color: C.orange, fontSize: 11, fontWeight: '700' },
  taskProgress: { color: C.muted, fontSize: 11 },
  progressCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  progressText: { color: C.primary, fontSize: 11, fontWeight: '800' },
  progressBar: { height: 6, backgroundColor: '#EFF1F7', borderRadius: 3, overflow: 'hidden', marginTop: 12 },
  progressFill: { height: '100%', backgroundColor: C.primary, borderRadius: 3 },
  progressDone: { backgroundColor: C.green },
  subtaskList: { marginTop: 14, gap: 4 },
  subtaskRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  checkbox: { width: 24, height: 24, borderRadius: 7, borderWidth: 2, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  checkboxDone: { backgroundColor: C.green, borderColor: C.green },
  subtaskText: { flex: 1, color: C.text, fontSize: 14, fontWeight: '600' },
  subtaskDone: { textDecorationLine: 'line-through', color: C.muted },
  doneEmoji: { fontSize: 14 },
  completeBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: C.orangeSoft, borderRadius: 10, paddingVertical: 10, marginTop: 12 },
  completeText: { color: '#8A5A05', fontSize: 12, fontWeight: '700' },
  confettiOverlay: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 999, alignItems: 'center', paddingTop: 100 },
  confettiText: { fontSize: 40 },
  confettiTitle: { color: C.orange, fontSize: 24, fontWeight: '800', marginTop: 10 },
  createBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#E17055', borderRadius: 14, paddingVertical: 16, marginBottom: 20 },
  createBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  parentTaskCard: { ...L.card, padding: 16, marginBottom: 12 },
  parentTaskTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  taskSteps: { color: C.muted, fontSize: 11, marginTop: 3 },
  statusPill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  statusDone: { backgroundColor: C.greenSoft },
  statusProgress: { backgroundColor: C.primarySoft },
  statusTodo: { backgroundColor: '#F0F2F8' },
  statusText: { fontSize: 10, fontWeight: '700' },
  parentSubtasks: { marginTop: 10, gap: 6 },
  parentSubtaskText: { color: C.text, fontSize: 12 },
  parentSubtaskDone: { color: C.green },
});
