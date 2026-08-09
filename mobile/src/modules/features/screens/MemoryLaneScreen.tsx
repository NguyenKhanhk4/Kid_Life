import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';

const MAX_FREE = 50;
const mockPhotos = Array.from({ length: 48 }, (_, i) => ({
  id: `${i + 1}`,
  emoji: ['🧹', '🪥', '📚', '🧸', '🍳', '🛏️', '🧼', '🌱', '🎨', '🧺', '🥗', '🐕'][i % 12],
  task: ['Dọn dẹp', 'Đánh răng', 'Đọc sách', 'Cất đồ chơi', 'Nấu ăn phụ', 'Gấp chăn', 'Giặt đồ', 'Tưới cây', 'Vẽ tranh', 'Phơi đồ', 'Rửa chén', 'Cho chó ăn'][i % 12],
  date: `${28 - Math.floor(i / 4)}/07/2026`,
  time: `${8 + (i % 12)}:${i % 2 === 0 ? '00' : '30'}`,
}));

export default function MemoryLaneScreen() {
  const navigation = useNavigation<any>();
  const [photos, setPhotos] = useState(mockPhotos);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  const usedSlots = photos.length;
  const remaining = MAX_FREE - usedSlots;

  const handleAddPhoto = () => {
    if (usedSlots >= MAX_FREE) {
      setShowLimitWarning(true);
      return;
    }
    Alert.alert('📸 Thêm ảnh', 'Đã thêm ảnh mới vào nhật ký!\n(Demo: Ảnh giả được thêm)', [{ text: 'OK' }]);
    setPhotos((prev) => [{ id: `new-${Date.now()}`, emoji: '📸', task: 'Ảnh mới', date: '28/07/2026', time: '20:00' }, ...prev]);
  };

  const handleDeletePhoto = (id: string) => {
    Alert.alert('Xóa ảnh?', 'Bạn phải xóa ảnh cũ mới có thể lưu ảnh mới (giới hạn 50 ảnh).', [
      { text: 'Hủy' },
      { text: 'Xóa', style: 'destructive', onPress: () => setPhotos((prev) => prev.filter((p) => p.id !== id)) },
    ]);
  };

  return (
    <ScrollView style={L.screen} contentContainerStyle={[L.content, { paddingTop: 50 }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.overline}>NHẬT KÝ HÀNH TRÌNH</Text>
          <Text style={styles.title}>Memory Lane 📷</Text>
        </View>
        <Pressable style={styles.addBtn} onPress={handleAddPhoto}>
          <Ionicons name="camera" size={20} color="#FFF" />
        </Pressable>
      </View>

      {/* Storage indicator */}
      <View style={styles.storageCard}>
        <View style={styles.storageTop}>
          <Text style={styles.storageLabel}>Dung lượng đã dùng</Text>
          <Text style={styles.storageCount}>{usedSlots}/{MAX_FREE}</Text>
        </View>
        <View style={styles.storageBar}>
          <View style={[styles.storageFill, { width: `${(usedSlots / MAX_FREE) * 100}%` }, usedSlots >= 45 && styles.storageDanger]} />
        </View>
        <Text style={[styles.storageHint, usedSlots >= 45 && { color: C.red }]}>
          {remaining > 0 ? `Còn ${remaining} ảnh có thể lưu` : '⚠️ Hết dung lượng! Xóa ảnh cũ hoặc nâng cấp Premium'}
        </Text>
      </View>

      {/* Upsell Banner */}
      {usedSlots >= 40 && (
        <Pressable style={styles.premiumBanner} onPress={() => Alert.alert('💎 Premium', 'Nâng cấp Premium để lưu trữ vô hạn ảnh & video chất lượng gốc!')}>
          <View style={styles.premiumBannerLeft}>
            <Text style={styles.premiumBannerIcon}>💎</Text>
            <View>
              <Text style={styles.premiumBannerTitle}>Nâng cấp Premium</Text>
              <Text style={styles.premiumBannerDesc}>Lưu trữ vô hạn + Album + AI Video</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#8E54E9" />
        </Pressable>
      )}

      {/* Photo list - vertical scroll */}
      <Text style={L.sectionTitle}>Khoảnh khắc của bé</Text>
      <Text style={styles.subtitle}>Danh sách cuộn dọc • Gói miễn phí</Text>

      {photos.map((photo) => (
        <View key={photo.id} style={styles.photoCard}>
          <View style={styles.photoThumb}>
            <Text style={styles.photoEmoji}>{photo.emoji}</Text>
          </View>
          <View style={styles.photoInfo}>
            <Text style={styles.photoTask}>Bé hoàn thành: {photo.task}</Text>
            <Text style={styles.photoDate}>{photo.date} lúc {photo.time}</Text>
          </View>
          <Pressable onPress={() => handleDeletePhoto(photo.id)} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={16} color={C.red} />
          </Pressable>
        </View>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  overline: { color: C.green, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: C.text, fontSize: 24, fontWeight: '800', marginTop: 3 },
  addBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  subtitle: { color: C.muted, fontSize: 12, marginTop: 4, marginBottom: 14 },
  storageCard: { ...L.card, padding: 16, marginBottom: 14 },
  storageTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  storageLabel: { color: C.text, fontSize: 13, fontWeight: '700' },
  storageCount: { color: C.primary, fontSize: 14, fontWeight: '800' },
  storageBar: { height: 8, backgroundColor: '#EFF1F7', borderRadius: 4, overflow: 'hidden' },
  storageFill: { height: '100%', backgroundColor: C.primary, borderRadius: 4 },
  storageDanger: { backgroundColor: C.red },
  storageHint: { color: C.muted, fontSize: 11, marginTop: 8 },
  premiumBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F0E9FF', borderRadius: 16, padding: 14, marginBottom: 18, borderWidth: 1, borderColor: '#DDD0FF' },
  premiumBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  premiumBannerIcon: { fontSize: 28 },
  premiumBannerTitle: { color: '#6C3AED', fontSize: 13, fontWeight: '800' },
  premiumBannerDesc: { color: '#8E6FD8', fontSize: 11, marginTop: 2 },
  photoCard: { ...L.card, flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 8 },
  photoThumb: { width: 52, height: 52, borderRadius: 12, backgroundColor: '#E9EDFF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  photoEmoji: { fontSize: 26 },
  photoInfo: { flex: 1 },
  photoTask: { color: C.text, fontSize: 12, fontWeight: '700' },
  photoDate: { color: C.muted, fontSize: 11, marginTop: 3 },
  deleteBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.redSoft, alignItems: 'center', justifyContent: 'center' },
});
