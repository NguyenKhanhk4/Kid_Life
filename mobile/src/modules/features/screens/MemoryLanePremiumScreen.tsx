import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Text, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';

const albums = [
  { id: 'all', name: 'Tất cả', count: 156, icon: '📸' },
  { id: 'housework', name: 'Làm việc nhà', count: 64, icon: '🧹' },
  { id: 'study', name: 'Học tập', count: 42, icon: '📚' },
  { id: 'sport', name: 'Thể thao', count: 28, icon: '⚽' },
  { id: 'family', name: 'Gia đình', count: 22, icon: '👨‍👩‍👧' },
];

const photos = Array.from({ length: 24 }, (_, i) => ({
  id: `${i}`,
  emoji: ['🧹', '🪥', '📚', '🧸', '🍳', '🛏️', '🧼', '🌱', '🎨', '🧺', '🥗', '🐕'][i % 12],
  task: ['Dọn dẹp', 'Đánh răng', 'Đọc sách', 'Cất đồ chơi', 'Nấu ăn phụ', 'Gấp chăn', 'Giặt đồ', 'Tưới cây', 'Vẽ tranh', 'Phơi đồ', 'Rửa chén', 'Cho chó ăn'][i % 12],
  date: `${28 - i}/07/2026`,
  isVideo: i % 5 === 0,
}));

export default function MemoryLanePremiumScreen() {
  const navigation = useNavigation<any>();
  const [activeAlbum, setActiveAlbum] = useState('all');
  const [showVideoRecap, setShowVideoRecap] = useState(false);
  const [showPhotobook, setShowPhotobook] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterMonth, setFilterMonth] = useState('Tháng 7');

  return (
    <ScrollView style={L.screen} contentContainerStyle={[L.content, { paddingTop: 50 }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.overline}>NHẬT KÝ CAO CẤP</Text>
          <Text style={styles.title}>Memory Lane 💖</Text>
        </View>
        <View style={styles.premiumBadge}>
          <Text style={styles.premiumIcon}>∞</Text>
          <Text style={styles.premiumText}>Vô hạn</Text>
        </View>
      </View>

      {/* Search & Filter */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={16} color={C.muted} />
          <Text style={styles.searchPlaceholder}>Tìm kiếm theo nhiệm vụ, ngày...</Text>
        </View>
        <Pressable style={styles.filterBtn}>
          <Ionicons name="calendar-outline" size={18} color={C.primary} />
          <Text style={styles.filterText}>{filterMonth}</Text>
        </Pressable>
      </View>

      {/* Albums */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.albumRow}>
        {albums.map((album) => (
          <Pressable key={album.id} style={[styles.albumCard, activeAlbum === album.id && styles.albumActive]} onPress={() => setActiveAlbum(album.id)}>
            <Text style={styles.albumIcon}>{album.icon}</Text>
            <Text style={[styles.albumName, activeAlbum === album.id && styles.albumNameActive]}>{album.name}</Text>
            <Text style={styles.albumCount}>{album.count}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* AI Features Buttons */}
      <View style={styles.aiRow}>
        <Pressable style={styles.aiBtn} onPress={() => setShowVideoRecap(true)}>
          <View style={styles.aiBtnIcon}><Ionicons name="videocam" size={20} color="#FFF" /></View>
          <View>
            <Text style={styles.aiBtnTitle}>AI Video Recap</Text>
            <Text style={styles.aiBtnDesc}>Ghép clip năm qua</Text>
          </View>
        </Pressable>
        <Pressable style={styles.aiBtn} onPress={() => setShowPhotobook(true)}>
          <View style={[styles.aiBtnIcon, { backgroundColor: '#E17055' }]}><Ionicons name="book" size={20} color="#FFF" /></View>
          <View>
            <Text style={styles.aiBtnTitle}>Xuất Sách Ảnh</Text>
            <Text style={styles.aiBtnDesc}>PDF Tạp chí</Text>
          </View>
        </Pressable>
      </View>

      {/* Photo Grid */}
      <Text style={L.sectionTitle}>Thư viện ảnh & video</Text>
      <Text style={styles.subtitle}>156 khoảnh khắc • Full HD</Text>

      <View style={styles.photoGrid}>
        {photos.map((photo) => (
          <View key={photo.id} style={styles.photoItem}>
            <View style={styles.photoThumb}>
              <Text style={styles.photoEmoji}>{photo.emoji}</Text>
              {photo.isVideo && (
                <View style={styles.videoBadge}>
                  <Ionicons name="play" size={10} color="#FFF" />
                </View>
              )}
            </View>
            <Text style={styles.photoTask} numberOfLines={1}>{photo.task}</Text>
            <Text style={styles.photoDate}>{photo.date}</Text>
          </View>
        ))}
      </View>

      {/* AI Video Recap Modal */}
      <Modal visible={showVideoRecap} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.recapCard}>
            <View style={styles.recapHeader}>
              <Text style={styles.recapTitle}>🎬 AI Video Recap</Text>
              <Pressable onPress={() => setShowVideoRecap(false)}>
                <Ionicons name="close-circle" size={28} color={C.muted} />
              </Pressable>
            </View>
            <Text style={styles.recapDesc}>Video tổng hợp tự động được tạo vào đúng 0h ngày sinh nhật của bé!</Text>

            <View style={styles.videoPreview}>
              <View style={styles.playOverlay}>
                <Ionicons name="play-circle" size={56} color="rgba(255,255,255,0.9)" />
              </View>
              <Text style={styles.videoTitle}>🎂 Video Sinh nhật Minh Anh</Text>
              <Text style={styles.videoMeta}>2:45 • BGM: Nhạc nền du dương</Text>
            </View>

            <View style={styles.videoFeatures}>
              <View style={styles.vfItem}><Ionicons name="checkmark-circle" size={16} color={C.green} /><Text style={styles.vfText}>Tự động gom clip chăm chỉ nhất</Text></View>
              <View style={styles.vfItem}><Ionicons name="checkmark-circle" size={16} color={C.green} /><Text style={styles.vfText}>BGM cảm động</Text></View>
              <View style={styles.vfItem}><Ionicons name="checkmark-circle" size={16} color={C.green} /><Text style={styles.vfText}>Hiệu ứng chuyển cảnh đẹp mắt</Text></View>
            </View>

            <Pressable style={styles.recapBtn} onPress={() => { setShowVideoRecap(false); Alert.alert('🎬 Đang tạo Video...', 'AI đang ghép clip và thêm nhạc nền. Video sẽ sẵn sàng trong ít phút!'); }}>
              <Text style={styles.recapBtnText}>Tạo Video Recap ngay</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Photobook Modal */}
      <Modal visible={showPhotobook} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.recapCard}>
            <View style={styles.recapHeader}>
              <Text style={styles.recapTitle}>📖 Xuất Sách Ảnh</Text>
              <Pressable onPress={() => setShowPhotobook(false)}>
                <Ionicons name="close-circle" size={28} color={C.muted} />
              </Pressable>
            </View>
            <Text style={styles.recapDesc}>Hệ thống tự động dàn trang PDF tạp chí với tất cả ảnh và caption trong năm.</Text>

            <View style={styles.bookPreview}>
              <Text style={styles.bookEmoji}>📚</Text>
              <Text style={styles.bookTitle}>Sách ảnh Minh Anh 2026</Text>
              <Text style={styles.bookMeta}>156 ảnh • 32 trang • A4</Text>
            </View>

            <View style={styles.bookOptions}>
              <Pressable style={styles.bookOpt} onPress={() => { setShowPhotobook(false); Alert.alert('📥 Đang tạo PDF...', 'Sách ảnh sẽ được tải về trong ít phút!'); }}>
                <Ionicons name="download-outline" size={20} color={C.primary} />
                <Text style={styles.bookOptText}>Tải PDF về máy</Text>
              </Pressable>
              <Pressable style={styles.bookOpt} onPress={() => { setShowPhotobook(false); Alert.alert('🚚 Đặt in', 'Liên kết với đơn vị in ấn. Sách sẽ được giao tận nhà trong 5-7 ngày!'); }}>
                <Ionicons name="print-outline" size={20} color={C.primary} />
                <Text style={styles.bookOptText}>In & giao tận nhà</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  overline: { color: '#FF4C8B', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: C.text, fontSize: 24, fontWeight: '800', marginTop: 3 },
  premiumBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFE8F3', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  premiumIcon: { color: '#FF4C8B', fontSize: 14, fontWeight: '800' },
  premiumText: { color: '#FF4C8B', fontSize: 11, fontWeight: '800' },
  searchRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: C.border, paddingHorizontal: 14, height: 44 },
  searchPlaceholder: { color: C.muted, fontSize: 12 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.primarySoft, borderRadius: 12, paddingHorizontal: 14, height: 44 },
  filterText: { color: C.primary, fontSize: 12, fontWeight: '700' },
  albumRow: { gap: 10, marginBottom: 18, paddingRight: 20 },
  albumCard: { backgroundColor: '#FFF', borderRadius: 14, borderWidth: 1, borderColor: C.border, paddingHorizontal: 14, paddingVertical: 10, alignItems: 'center', width: 85 },
  albumActive: { borderColor: C.primary, backgroundColor: C.primarySoft },
  albumIcon: { fontSize: 22 },
  albumName: { color: C.text, fontSize: 10, fontWeight: '700', marginTop: 4 },
  albumNameActive: { color: C.primary },
  albumCount: { color: C.muted, fontSize: 10, marginTop: 2 },
  aiRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  aiBtn: { flex: 1, ...L.card, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  aiBtnIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  aiBtnTitle: { color: C.text, fontSize: 12, fontWeight: '700' },
  aiBtnDesc: { color: C.muted, fontSize: 10, marginTop: 2 },
  subtitle: { color: C.muted, fontSize: 12, marginTop: 4, marginBottom: 14 },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  photoItem: { width: '31%' },
  photoThumb: { width: '100%', aspectRatio: 1, backgroundColor: '#E9EDFF', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  photoEmoji: { fontSize: 32 },
  videoBadge: { position: 'absolute', bottom: 6, right: 6, width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  photoTask: { color: C.text, fontSize: 10, fontWeight: '600', marginTop: 4 },
  photoDate: { color: C.muted, fontSize: 9, marginTop: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  recapCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, width: '100%', maxWidth: 380 },
  recapHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  recapTitle: { color: C.text, fontSize: 18, fontWeight: '800' },
  recapDesc: { color: C.muted, fontSize: 13, lineHeight: 19, marginBottom: 18 },
  videoPreview: { backgroundColor: '#1A1A2E', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 16 },
  playOverlay: { marginBottom: 12 },
  videoTitle: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  videoMeta: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 4 },
  videoFeatures: { gap: 10, marginBottom: 18 },
  vfItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  vfText: { color: C.text, fontSize: 13 },
  recapBtn: { backgroundColor: C.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  recapBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  bookPreview: { backgroundColor: '#FFF3E0', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 16 },
  bookEmoji: { fontSize: 48, marginBottom: 8 },
  bookTitle: { color: C.text, fontSize: 16, fontWeight: '800' },
  bookMeta: { color: C.muted, fontSize: 12, marginTop: 4 },
  bookOptions: { gap: 10 },
  bookOpt: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.primarySoft, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 18 },
  bookOptText: { color: C.primary, fontSize: 14, fontWeight: '700' },
});
