import React, { useState, useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Routes } from '@/navigation/constants';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
import * as childApi from '@/shared/api/childApi';
import type { ChildProfile } from '@/shared/api/childApi';

export default function ChildManagementScreen() {
  const navigation = useNavigation<any>();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const loadChildren = useCallback(async () => {
    try {
      setLoading(true);
      const result = await childApi.getChildren();
      setChildren(result.children || []);
    } catch (error: any) {
      Alert.alert('Lỗi', error?.message || 'Không thể tải danh sách trẻ');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadChildren();
    }, [loadChildren])
  );

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Xác nhận xóa', `Bạn có chắc muốn xóa hồ sơ bé ${name}?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa', style: 'destructive', onPress: async () => {
          try {
            await childApi.deleteChild(id);
            setChildren(children.filter(c => c._id !== id));
          } catch (error: any) {
            Alert.alert('Lỗi', error?.message || 'Không thể xóa hồ sơ');
          }
        }
      },
    ]);
  };

  const getAge = (dob: string) => {
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  return (
    <View style={L.screen}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Quản lý hồ sơ trẻ</Text>
        <Pressable style={styles.addBtn} onPress={() => navigation.navigate(Routes.Profile.AddChild)}>
          <Ionicons name="add" size={22} color="#FFF" />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={C.primary} />
        </View>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={L.content} showsVerticalScrollIndicator={false}>
          {children.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>👶</Text>
              <Text style={styles.emptyTitle}>Chưa có hồ sơ trẻ</Text>
              <Text style={styles.emptyText}>Nhấn nút + để thêm hồ sơ trẻ đầu tiên</Text>
            </View>
          )}
          {children.map((child) => (
            <Pressable
              key={child._id}
              style={[L.card, styles.childCard]}
              onPress={() => navigation.navigate(Routes.Profile.ChildDetail, { childId: child._id })}
            >
              <View style={styles.avatarBox}>
                <Text style={styles.avatarEmoji}>🧒</Text>
              </View>
              <View style={styles.childInfo}>
                <Text style={styles.childName}>{child.name}</Text>
                <Text style={styles.childMeta}>{getAge(child.dateOfBirth)} tuổi  •  Cấp {child.level}</Text>
                <View style={styles.xpBar}>
                  <View style={[styles.xpFill, { width: `${Math.min(100, (child.totalPoints / 1000) * 100)}%` }]} />
                </View>
                <Text style={styles.xpText}>{child.totalPoints.toLocaleString()} điểm</Text>
              </View>
              <View style={styles.actions}>
                <Pressable style={styles.actionBtn} onPress={() => navigation.navigate(Routes.Profile.EditChild, { childId: child._id })}>
                  <Ionicons name="create-outline" size={18} color={C.primary} />
                </Pressable>
                <Pressable style={styles.actionBtn} onPress={() => handleDelete(child._id, child.name)}>
                  <Ionicons name="trash-outline" size={18} color={C.red} />
                </Pressable>
              </View>
            </Pressable>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 12 },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: '#E4E9FF', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: C.text, fontSize: 17, fontWeight: '800' },
  addBtn: { width: 42, height: 42, borderRadius: 22, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  list: { flex: 1 },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  childCard: { flexDirection: 'row', alignItems: 'center', padding: 16, marginBottom: 12 },
  avatarBox: { width: 60, height: 60, borderRadius: 20, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  avatarEmoji: { fontSize: 32 },
  childInfo: { flex: 1 },
  childName: { color: C.text, fontSize: 16, fontWeight: '700', marginBottom: 3 },
  childMeta: { color: C.muted, fontSize: 11, marginBottom: 8 },
  xpBar: { height: 6, borderRadius: 3, backgroundColor: '#E7EBFF', overflow: 'hidden' },
  xpFill: { height: '100%', borderRadius: 3, backgroundColor: C.primary },
  xpText: { color: C.muted, fontSize: 9, marginTop: 3 },
  actions: { gap: 8 },
  actionBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#F0F2FA', alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 60, marginBottom: 16 },
  emptyTitle: { color: C.text, fontSize: 18, fontWeight: '700', marginBottom: 6 },
  emptyText: { color: C.muted, fontSize: 13 },
});
