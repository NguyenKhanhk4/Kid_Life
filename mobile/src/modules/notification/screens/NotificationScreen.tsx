import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/constants';
import { ScreenBackButton } from '@/shared/components';
import {
  markAllNotificationsRead,
  markNotificationRead,
  useAppDispatch,
  useAppSelector,
} from '@/shared/store';

export default function NotificationScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.kidlife.notifications);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'system'>('all');
  const unread = items.filter((item) => !item.read).length;
  const filtered = items.filter((item) => activeTab === 'all' || (activeTab === 'unread' ? !item.read : item.type === 'system'));
  const openNotification = (item: (typeof items)[number]) => {
    dispatch(markNotificationRead(item.id));
    if (item.type === 'submission' && item.targetId) {
      navigation.navigate(Routes.Parent.ApprovalDetail, { submissionId: item.targetId });
    } else if (item.type === 'reward') {
      navigation.navigate(Routes.Parent.Rewards);
    } else if (item.type === 'penalty') {
      navigation.navigate(Routes.Features.VirtualBank);
    }
  };
  return <ScrollView style={L.screen} contentContainerStyle={L.content}><View style={styles.header}><ScreenBackButton /><View style={styles.headerCopy}><Text style={styles.title}>Thông báo</Text><Text style={styles.subtitle}>{unread} thông báo chưa đọc</Text></View><Pressable onPress={() => dispatch(markAllNotificationsRead())}><Text style={styles.readAll}>Đọc tất cả</Text></Pressable></View><View style={styles.tabs}>{([['all', 'Tất cả'], ['unread', 'Chưa đọc'], ['system', 'Hệ thống']] as const).map(([key, label]) => <Pressable key={key} onPress={() => setActiveTab(key)}><Text style={activeTab === key ? styles.activeTab : styles.tab}>{label}</Text></Pressable>)}</View>{filtered.map((item) => <Pressable key={item.id} onPress={() => openNotification(item)} style={[L.card, styles.item, !item.read && styles.unread]}><View style={[styles.icon, { backgroundColor: `${item.type === 'penalty' ? C.red : item.type === 'reward' ? C.orange : C.primary}18` }]}><Text style={styles.emoji}>{item.icon}</Text></View><View style={styles.copy}><Text style={styles.itemTitle}>{item.title}</Text><Text style={styles.body}>{item.body}</Text><Text style={styles.time}>{item.time}</Text></View>{!item.read && <View style={styles.dot} />}</Pressable>)}</ScrollView>;
}

const styles = StyleSheet.create({ header: { flexDirection: 'row', alignItems: 'center', paddingTop: 8, marginBottom: 18 }, headerCopy: { flex: 1, marginHorizontal: 12 }, title: { color: C.text, fontSize: 24, fontWeight: '800' }, subtitle: { color: C.muted, fontSize: 11, marginTop: 4 }, readAll: { color: C.primary, fontSize: 11, fontWeight: '800' }, tabs: { flexDirection: 'row', gap: 25, borderBottomWidth: 1, borderBottomColor: C.border, marginBottom: 13 }, activeTab: { color: C.primary, fontSize: 12, fontWeight: '800', paddingBottom: 11, borderBottomWidth: 2, borderBottomColor: C.primary }, tab: { color: C.muted, fontSize: 12, paddingBottom: 11 }, item: { padding: 13, flexDirection: 'row', alignItems: 'center', marginBottom: 9 }, unread: { borderLeftWidth: 3, borderLeftColor: C.primary }, icon: { width: 45, height: 45, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 11 }, emoji: { fontSize: 23 }, copy: { flex: 1 }, itemTitle: { color: C.text, fontSize: 12, fontWeight: '800' }, body: { color: C.muted, fontSize: 10, lineHeight: 15, marginTop: 3 }, time: { color: C.muted, fontSize: 9, marginTop: 6 }, dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.primary } });
