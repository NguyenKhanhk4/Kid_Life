import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/constants';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';

const SKILLS = ['Tất cả', 'Vệ sinh', 'Tự lập', 'Giao tiếp', 'Cảm xúc', 'Sáng tạo', 'Lễ phép'];

const MOCK_LESSONS = [
  { id: '1', title: 'Cách đánh răng đúng cách', skill: 'Vệ sinh', ageRange: '4-6', duration: '5 phút', thumbnail: '🪥', author: 'Cô Hoa', views: 1250 },
  { id: '2', title: 'Tự gấp quần áo gọn gàng', skill: 'Tự lập', ageRange: '6-8', duration: '7 phút', thumbnail: '👕', author: 'Thầy Nam', views: 980 },
  { id: '3', title: 'Biết nói lời cảm ơn', skill: 'Giao tiếp', ageRange: '4-6', duration: '4 phút', thumbnail: '🙏', author: 'Cô Mai', views: 2100 },
  { id: '4', title: 'Tô màu sáng tạo', skill: 'Sáng tạo', ageRange: '4-8', duration: '10 phút', thumbnail: '🎨', author: 'Cô Lan', views: 750 },
  { id: '5', title: 'Rửa tay trước khi ăn', skill: 'Vệ sinh', ageRange: '4-6', duration: '3 phút', thumbnail: '🧼', author: 'Bác sĩ Tùng', views: 3200 },
  { id: '6', title: 'Chia sẻ đồ chơi với bạn', skill: 'Cảm xúc', ageRange: '5-8', duration: '6 phút', thumbnail: '🤝', author: 'Cô Hạnh', views: 1500 },
];

const SKILL_COLORS: Record<string, string> = {
  'Vệ sinh': C.green, 'Tự lập': C.purple, 'Giao tiếp': C.primary, 'Cảm xúc': C.red, 'Sáng tạo': C.orange, 'Lễ phép': '#28B978',
};

export default function LessonLibraryScreen() {
  const navigation = useNavigation<any>();
  const [selectedSkill, setSelectedSkill] = useState('Tất cả');
  const [search, setSearch] = useState('');

  const filtered = MOCK_LESSONS.filter(l => {
    if (selectedSkill !== 'Tất cả' && l.skill !== selectedSkill) return false;
    if (search && !l.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <View style={L.screen}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Thư viện bài học</Text>
        <View style={styles.back} />
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={C.muted} />
        <TextInput style={styles.searchInput} placeholder="Tìm kiếm bài học..." placeholderTextColor={C.muted} value={search} onChangeText={setSearch} />
        {search ? <Pressable onPress={() => setSearch('')}><Ionicons name="close-circle" size={18} color={C.muted} /></Pressable> : null}
      </View>

      {/* Skill filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.skillRow}>
        {SKILLS.map((skill) => (
          <Pressable key={skill} style={[styles.skillChip, selectedSkill === skill && styles.skillChipActive]} onPress={() => setSelectedSkill(skill)}>
            <Text style={[styles.skillText, selectedSkill === skill && styles.skillTextActive]}>{skill}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="book-outline" size={50} color={C.muted} />
            <Text style={styles.emptyText}>Không tìm thấy bài học</Text>
          </View>
        )}
        {filtered.map((lesson) => (
          <Pressable key={lesson.id} style={styles.card} onPress={() => navigation.navigate(Routes.Lesson.Detail, { lessonId: lesson.id })}>
            <View style={styles.cardThumb}>
              <Text style={styles.thumbEmoji}>{lesson.thumbnail}</Text>
              <View style={styles.durationBadge}>
                <Ionicons name="time-outline" size={10} color="#FFF" />
                <Text style={styles.durationText}>{lesson.duration}</Text>
              </View>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle} numberOfLines={2}>{lesson.title}</Text>
              <View style={styles.cardMeta}>
                <View style={[styles.skillBadge, { backgroundColor: `${SKILL_COLORS[lesson.skill] ?? C.primary}18` }]}>
                  <Text style={[styles.skillBadgeText, { color: SKILL_COLORS[lesson.skill] ?? C.primary }]}>{lesson.skill}</Text>
                </View>
                <Text style={styles.ageText}>{lesson.ageRange} tuổi</Text>
              </View>
              <View style={styles.authorRow}>
                <Ionicons name="person-circle-outline" size={14} color={C.muted} />
                <Text style={styles.authorText}>{lesson.author}</Text>
                <Text style={styles.viewsText}>•  {lesson.views.toLocaleString()} lượt xem</Text>
              </View>
            </View>
          </Pressable>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 8 },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: '#E4E9FF', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: C.text, fontSize: 17, fontWeight: '800' },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E7EBFF', borderRadius: 14, marginHorizontal: 20, paddingHorizontal: 14, height: 44, marginBottom: 12, gap: 8 },
  searchInput: { flex: 1, color: C.text, fontSize: 13 },
  skillRow: { paddingHorizontal: 20, gap: 8, paddingBottom: 12 },
  skillChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#E7EBFF' },
  skillChipActive: { backgroundColor: C.primary },
  skillText: { color: C.muted, fontSize: 12, fontWeight: '600' },
  skillTextActive: { color: '#FFF' },
  grid: { paddingHorizontal: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '47%', backgroundColor: '#FFF', borderRadius: 18, overflow: 'hidden', shadowColor: C.shadow, shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  cardThumb: { height: 100, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  thumbEmoji: { fontSize: 42 },
  durationBadge: { position: 'absolute', bottom: 6, right: 6, flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 3 },
  durationText: { color: '#FFF', fontSize: 9, fontWeight: '700' },
  cardBody: { padding: 10 },
  cardTitle: { color: C.text, fontSize: 12, fontWeight: '700', lineHeight: 17, marginBottom: 6 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  skillBadge: { borderRadius: 999, paddingHorizontal: 7, paddingVertical: 2 },
  skillBadgeText: { fontSize: 9, fontWeight: '700' },
  ageText: { color: C.muted, fontSize: 9 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  authorText: { color: C.muted, fontSize: 9 },
  viewsText: { color: C.muted, fontSize: 9 },
  empty: { width: '100%', alignItems: 'center', paddingTop: 60 },
  emptyText: { color: C.muted, fontSize: 14, marginTop: 10 },
});
