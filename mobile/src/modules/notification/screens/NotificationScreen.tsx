import React, { useState, useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Routes } from '@/navigation/constants';
import { ScreenBackButton } from '@/shared/components';
import * as notificationApi from '@/shared/api/notificationApi';
import type { Notification } from '@/shared/api/notificationApi';

export default function NotificationScreen() {
  const navigation = useNavigation<any>();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'system'>('all');

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await notificationApi.getNotifications({ limit: 50 });
      setItems(res.notifications || []);
    } catch (error: any) {
      Alert.alert('Lỗi', 'Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications])
  );

  const openNotification = async (item: Notification) => {
    if (!item.isRead) {
      try {
        await notificationApi.markNotificationRead(item._id);
        setItems(prev => prev.map(n => n._id === item._id ? { ...n, isRead: true } : n));
      } catch (err) {
        // ignore
      }
    }
    
    // In actual app, we navigate based on item.type and item.relatedId
    // For now we just mark as read
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllNotificationsRead();
      setItems(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error: any) {
      Alert.alert('Lỗi', 'Không thể đánh dấu đã đọc');
    }
  };

  const unread = items.filter((item) => !item.isRead).length;
  const filtered = items.filter((item) => activeTab === 'all' || (activeTab === 'unread' ? !item.isRead : item.type === 'SYSTEM'));

  return (
    <ScrollView style={L.screen} contentContainerStyle={L.content}>
      <View style={styles.header}>
        <ScreenBackButton />
        <View style={styles.headerCopy}>
          <Text style={styles.title}>Thông báo</Text>
          <Text style={styles.subtitle}>{unread} thông báo chưa đọc</Text>
        </View>
        <Pressable onPress={handleMarkAllRead}>
          <Text style={styles.readAll}>Đọc tất cả</Text>
        </Pressable>
      </View>

      <View style={styles.tabs}>
        {([['all', 'Tất cả'], ['unread', 'Chưa đọc'], ['system', 'Hệ thống']] as const).map(([key, label]) => (
          <Pressable key={key} onPress={() => setActiveTab(key)}>
            <Text style={activeTab === key ? styles.activeTab : styles.tab}>{label}</Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <View style={{ padding: 40, alignItems: 'center' }}>
          <ActivityIndicator size="large" color={C.primary} />
        </View>
      ) : filtered.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 40, color: C.muted }}>Không có thông báo nào</Text>
      ) : (
        filtered.map((item) => (
          <Pressable key={item._id} onPress={() => openNotification(item)} style={[L.card, styles.item, !item.isRead && styles.unread]}>
            <View style={[styles.icon, { backgroundColor: `${item.type === 'SYSTEM' ? C.red : item.type === 'REWARD' ? C.orange : C.primary}18` }]}>
              <Text style={styles.emoji}>🔔</Text>
            </View>
            <View style={styles.copy}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.body}>{item.content}</Text>
              <Text style={styles.time}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
            {!item.isRead && <View style={styles.dot} />}
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 8, marginBottom: 18 },
  headerCopy: { flex: 1, marginHorizontal: 12 },
  title: { color: C.text, fontSize: 24, fontWeight: '800' },
  subtitle: { color: C.muted, fontSize: 11, marginTop: 4 },
  readAll: { color: C.primary, fontSize: 11, fontWeight: '800' },
  tabs: { flexDirection: 'row', gap: 25, borderBottomWidth: 1, borderBottomColor: C.border, marginBottom: 13 },
  activeTab: { color: C.primary, fontSize: 12, fontWeight: '800', paddingBottom: 11, borderBottomWidth: 2, borderBottomColor: C.primary },
  tab: { color: C.muted, fontSize: 12, paddingBottom: 11 },
  item: { padding: 13, flexDirection: 'row', alignItems: 'center', marginBottom: 9 },
  unread: { borderLeftWidth: 3, borderLeftColor: C.primary },
  icon: { width: 45, height: 45, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  emoji: { fontSize: 23 },
  copy: { flex: 1 },
  itemTitle: { color: C.text, fontSize: 12, fontWeight: '800' },
  body: { color: C.muted, fontSize: 10, lineHeight: 15, marginTop: 3 },
  time: { color: C.muted, fontSize: 9, marginTop: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.primary }
});
