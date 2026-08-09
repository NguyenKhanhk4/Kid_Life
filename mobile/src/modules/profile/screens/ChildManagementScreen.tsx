import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/constants';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';

const MOCK_CHILDREN = [
  { id: '1', name: 'Minh Anh', age: 7, avatar: '🧒', level: 5, xp: 1250, maxXp: 1750, skills: ['Tự lập', 'Vệ sinh'] },
  { id: '2', name: 'Thảo My', age: 5, avatar: '👧', level: 3, xp: 680, maxXp: 1000, skills: ['Giao tiếp', 'Cảm xúc'] },
  { id: '3', name: 'Nhật Linh', age: 9, avatar: '👦', level: 8, xp: 2100, maxXp: 2500, skills: ['Sáng tạo', 'Tự lập'] },
];

export default function ChildManagementScreen() {
  const navigation = useNavigation<any>();
  const [children, setChildren] = useState(MOCK_CHILDREN);

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Xác nhận xóa', `Bạn có chắc muốn xóa hồ sơ bé ${name}?`, [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => setChildren(children.filter(c => c.id !== id)) },
    ]);
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
            key={child.id}
            style={[L.card, styles.childCard]}
            onPress={() => navigation.navigate(Routes.Profile.ChildDetail, { childId: child.id })}
          >
            <View style={styles.avatarBox}>
              <Text style={styles.avatarEmoji}>{child.avatar}</Text>
            </View>
            <View style={styles.childInfo}>
              <Text style={styles.childName}>{child.name}</Text>
              <Text style={styles.childMeta}>{child.age} tuổi  •  Cấp {child.level}</Text>
              <View style={styles.xpBar}>
                <View style={[styles.xpFill, { width: `${(child.xp / child.maxXp) * 100}%` }]} />
              </View>
              <Text style={styles.xpText}>{child.xp.toLocaleString()} / {child.maxXp.toLocaleString()} XP</Text>
            </View>
            <View style={styles.actions}>
              <Pressable style={styles.actionBtn} onPress={() => navigation.navigate(Routes.Profile.EditChild, { childId: child.id })}>
                <Ionicons name="create-outline" size={18} color={C.primary} />
              </Pressable>
              <Pressable style={styles.actionBtn} onPress={() => handleDelete(child.id, child.name)}>
                <Ionicons name="trash-outline" size={18} color={C.red} />
              </Pressable>
            </View>
          </Pressable>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 12 },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: '#E4E9FF', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: C.text, fontSize: 17, fontWeight: '800' },
  addBtn: { width: 42, height: 42, borderRadius: 22, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  list: { flex: 1 },
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
