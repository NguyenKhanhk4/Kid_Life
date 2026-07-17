import React from 'react';
import { Pressable, ScrollView, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';

const tasks = [
  { icon: '🧸', title: 'Dọn dẹp đồ chơi', meta: '18:30 - 19:00', xp: '+30 XP', done: true },
  { icon: '👕', title: 'Tự gấp quần áo', meta: '19:00 - 19:15', xp: '+50 XP', done: true },
  { icon: '🪥', title: 'Đánh răng trước khi ngủ', meta: '20:30 - 20:45', xp: '+30 XP', done: false },
];

export default function ChildHomeScreen() {
  return (
    <ScrollView style={L.screen} contentContainerStyle={L.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <View style={styles.xpPill}><Ionicons name="star" size={15} color={C.orange} /><Text style={styles.xpText}> 1,250 XP</Text></View>
          <Text style={styles.greeting}>Chào Minh Anh! 👋</Text>
          <Text style={styles.subtitle}>Hôm nay mình làm gì nhỉ?</Text>
        </View>
        <View style={styles.avatar}><Text style={styles.avatarText}>🧒</Text></View>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>Bạn đang làm rất tốt!</Text>
          <Text style={styles.heroBody}>Hoàn thành thêm 2 nhiệm vụ để nhận huy hiệu mới.</Text>
          <View style={styles.progressTrack}><View style={[styles.progressFill, { width: '70%' }]} /></View>
          <Text style={styles.progressLabel}>Cấp 5  •  1,250 / 1,750 XP</Text>
        </View>
        <View style={styles.heroPet}><Text style={styles.petEmoji}>🐰</Text><Text style={styles.petBubble}>Cố lên!</Text></View>
      </View>

      <View style={styles.sectionHeader}><Text style={L.sectionTitle}>Nhiệm vụ hôm nay</Text><View style={[L.pill, styles.countPill]}><Text style={styles.countText}>2/5 hoàn thành</Text></View></View>
      {tasks.map((task) => (
        <Pressable key={task.title} style={[L.card, styles.taskCard, task.done && styles.taskDone]} accessibilityRole="button">
          <View style={styles.taskIcon}><Text style={styles.taskEmoji}>{task.icon}</Text></View>
          <View style={styles.taskCopy}><Text style={styles.taskTitle}>{task.title}</Text><View style={styles.taskMeta}><Ionicons name="time-outline" size={14} color={C.muted} /><Text style={L.body}>  {task.meta}</Text><View style={styles.xpBadge}><Text style={styles.xpBadgeText}>{task.xp}</Text></View></View></View>
          <Ionicons name={task.done ? 'checkmark-circle' : 'chevron-forward'} size={24} color={task.done ? C.green : C.primary} />
        </Pressable>
      ))}

      <View style={styles.sectionHeader}><Text style={L.sectionTitle}>Thành tích của bạn</Text><Ionicons name="chevron-forward" size={20} color={C.muted} /></View>
      <View style={styles.badgesCard}>
        {['⭐', '😊', '🧹', '🎨', '🛡️'].map((badge, index) => <View key={badge} style={[styles.badge, index > 2 && styles.badgeLocked]}><Text style={styles.badgeEmoji}>{index > 2 ? '🔒' : badge}</Text></View>)}
      </View>

      <View style={styles.quickRow}>
        <QuickAction icon="wallet-outline" label="Ví điểm" color={C.primary} />
        <QuickAction icon="paw-outline" label="Thú cưng" color={C.orange} />
        <QuickAction icon="book-outline" label="Học bài" color={C.purple} />
      </View>
    </ScrollView>
  );
}

function QuickAction({ icon, label, color }: { icon: any; label: string; color: string }) { return <Pressable style={[styles.quickAction, { backgroundColor: `${color}12` }]}><Ionicons name={icon} size={22} color={color} /><Text style={[styles.quickLabel, { color }]}>{label}</Text></Pressable>; }

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, paddingBottom: 20 },
  xpPill: { flexDirection: 'row', alignItems: 'center', marginBottom: 7 }, xpText: { color: C.text, fontSize: 13, fontWeight: '700' },
  greeting: { color: C.text, fontSize: 22, fontWeight: '800' }, subtitle: { color: C.muted, fontSize: 13, marginTop: 3 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' }, avatarText: { fontSize: 27 },
  hero: { backgroundColor: C.primary, borderRadius: 24, padding: 20, minHeight: 172, flexDirection: 'row', overflow: 'hidden', marginBottom: 24 },
  heroCopy: { flex: 1, zIndex: 2 }, heroTitle: { color: '#FFF', fontSize: 20, fontWeight: '800', marginBottom: 8 }, heroBody: { color: '#DCE2FF', fontSize: 13, lineHeight: 19, maxWidth: 210 },
  progressTrack: { height: 9, borderRadius: 5, backgroundColor: 'rgba(255,255,255,.22)', marginTop: 18, overflow: 'hidden' }, progressFill: { height: '100%', borderRadius: 5, backgroundColor: C.lime }, progressLabel: { color: '#DCE2FF', fontSize: 11, marginTop: 7 },
  heroPet: { width: 104, alignItems: 'center', justifyContent: 'center' }, petEmoji: { fontSize: 66 }, petBubble: { backgroundColor: '#FFF', color: C.primary, fontSize: 11, fontWeight: '700', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 10, transform: [{ rotate: '-5deg' }] },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, marginTop: 4 }, countPill: { backgroundColor: C.primarySoft }, countText: { color: C.primary, fontWeight: '700', fontSize: 11 },
  taskCard: { minHeight: 86, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 10 }, taskDone: { backgroundColor: '#F1F9D7', borderColor: '#E2F19F' }, taskIcon: { width: 56, height: 56, borderRadius: 16, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: 12 }, taskEmoji: { fontSize: 30 }, taskCopy: { flex: 1 }, taskTitle: { color: C.text, fontSize: 14, fontWeight: '700', marginBottom: 7 }, taskMeta: { flexDirection: 'row', alignItems: 'center' }, xpBadge: { marginLeft: 8, backgroundColor: C.orangeSoft, borderRadius: 999, paddingHorizontal: 7, paddingVertical: 3 }, xpBadgeText: { color: '#B36A00', fontSize: 10, fontWeight: '800' },
  badgesCard: { ...L.card, padding: 14, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 }, badge: { width: 54, height: 54, borderRadius: 16, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' }, badgeLocked: { backgroundColor: '#EEF0F8' }, badgeEmoji: { fontSize: 26 },
  quickRow: { flexDirection: 'row', gap: 10, marginTop: 2 }, quickAction: { flex: 1, borderRadius: 16, paddingVertical: 14, alignItems: 'center', gap: 5 }, quickLabel: { fontSize: 12, fontWeight: '700' },
});
