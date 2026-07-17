import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';

const initialNotifications = [
  { id: '1', icon: '🎉', title: 'Bé đã hoàn thành nhiệm vụ!', body: 'Minh Anh vừa hoàn thành “Dọn dẹp đồ chơi”.', time: '5 phút trước', color: C.green, read: false },
  { id: '2', icon: '⭐', title: 'Bé nhận được 30 XP', body: 'Ví điểm của bé vừa được cập nhật.', time: '1 giờ trước', color: C.orange, read: false },
  { id: '3', icon: '💡', title: 'Gợi ý nhiệm vụ mới', body: 'Có 3 nhiệm vụ phù hợp với kỹ năng của bé.', time: 'Hôm qua', color: C.primary, read: true },
  { id: '4', icon: '🎁', title: 'Yêu cầu đổi thưởng', body: 'Bé đang muốn đổi một phần thưởng mới.', time: 'Hôm qua', color: C.purple, read: true },
];

export default function NotificationScreen() {
  const [items, setItems] = useState(initialNotifications);
  const unread = items.filter((item) => !item.read).length;
  return <ScrollView style={L.screen} contentContainerStyle={L.content}><View style={styles.header}><View><Text style={styles.title}>Thông báo</Text><Text style={styles.subtitle}>{unread} thông báo chưa đọc</Text></View><Pressable onPress={() => setItems((value) => value.map((item) => ({ ...item, read: true })))}><Text style={styles.readAll}>Đọc tất cả</Text></Pressable></View><View style={styles.tabs}><Text style={styles.activeTab}>Tất cả</Text><Text style={styles.tab}>Chưa đọc</Text><Text style={styles.tab}>Hệ thống</Text></View>{items.map((item) => <Pressable key={item.id} onPress={() => setItems((value) => value.map((current) => current.id === item.id ? { ...current, read: true } : current))} style={[L.card, styles.item, !item.read && styles.unread]}><View style={[styles.icon, { backgroundColor: `${item.color}18` }]}><Text style={styles.emoji}>{item.icon}</Text></View><View style={styles.copy}><Text style={styles.itemTitle}>{item.title}</Text><Text style={styles.body}>{item.body}</Text><Text style={styles.time}>{item.time}</Text></View>{!item.read && <View style={styles.dot} />}</Pressable>)}</ScrollView>;
}

const styles = StyleSheet.create({ header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, marginBottom: 18 }, title: { color: C.text, fontSize: 28, fontWeight: '800' }, subtitle: { color: C.muted, fontSize: 11, marginTop: 4 }, readAll: { color: C.primary, fontSize: 11, fontWeight: '800' }, tabs: { flexDirection: 'row', gap: 25, borderBottomWidth: 1, borderBottomColor: C.border, marginBottom: 13 }, activeTab: { color: C.primary, fontSize: 12, fontWeight: '800', paddingBottom: 11, borderBottomWidth: 2, borderBottomColor: C.primary }, tab: { color: C.muted, fontSize: 12, paddingBottom: 11 }, item: { padding: 13, flexDirection: 'row', alignItems: 'center', marginBottom: 9 }, unread: { borderLeftWidth: 3, borderLeftColor: C.primary }, icon: { width: 45, height: 45, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 11 }, emoji: { fontSize: 23 }, copy: { flex: 1 }, itemTitle: { color: C.text, fontSize: 12, fontWeight: '800' }, body: { color: C.muted, fontSize: 10, lineHeight: 15, marginTop: 3 }, time: { color: C.muted, fontSize: 9, marginTop: 6 }, dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.primary } });
