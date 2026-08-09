import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Routes } from '@/navigation/constants';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';

const MOCK: Record<string, any> = {
  '1': { title: 'Cách đánh răng đúng cách', skill: 'Vệ sinh', ageRange: '4-6', duration: '5 phút', thumbnail: '🪥', author: 'Cô Hoa', views: 1250, content: 'Đánh răng đúng cách rất quan trọng cho sức khỏe răng miệng của bé. Video này sẽ hướng dẫn bé các bước đánh răng chuẩn theo khuyến cáo của nha sĩ:\n\n1. Lấy bàn chải và kem đánh răng\n2. Bóp một lượng kem bằng hạt đậu\n3. Đánh mặt ngoài, mặt trong và mặt nhai\n4. Đánh trong 2 phút\n5. Súc miệng sạch', quizId: '1', quizTitle: 'Kiểm tra: Đánh răng đúng cách' },
  '2': { title: 'Tự gấp quần áo gọn gàng', skill: 'Tự lập', ageRange: '6-8', duration: '7 phút', thumbnail: '👕', author: 'Thầy Nam', views: 980, content: 'Học cách tự gấp quần áo gọn gàng giúp bé rèn tính tự lập và ngăn nắp.', quizId: '2', quizTitle: 'Kiểm tra: Gấp quần áo' },
  '3': { title: 'Biết nói lời cảm ơn', skill: 'Giao tiếp', ageRange: '4-6', duration: '4 phút', thumbnail: '🙏', author: 'Cô Mai', views: 2100, content: 'Nói lời cảm ơn là kỹ năng giao tiếp quan trọng nhất.', quizId: '3', quizTitle: 'Kiểm tra: Lời cảm ơn' },
};

export default function LessonDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const lessonId = route.params?.lessonId ?? '1';
  const lesson = MOCK[lessonId] ?? MOCK['1'];

  return (
    <View style={L.screen}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>{lesson.title}</Text>
        <View style={styles.back} />
      </View>

      <ScrollView contentContainerStyle={L.content} showsVerticalScrollIndicator={false}>
        {/* Video player placeholder */}
        <View style={styles.videoPlayer}>
          <Text style={styles.videoEmoji}>{lesson.thumbnail}</Text>
          <Pressable style={styles.playButton}>
            <Ionicons name="play" size={32} color="#FFF" />
          </Pressable>
          <View style={styles.videoDuration}>
            <Ionicons name="time-outline" size={12} color="#FFF" />
            <Text style={styles.videoDurationText}>{lesson.duration}</Text>
          </View>
        </View>

        {/* Info */}
        <Text style={styles.title}>{lesson.title}</Text>
        <View style={styles.metaRow}>
          <View style={styles.skillPill}><Text style={styles.skillPillText}>{lesson.skill}</Text></View>
          <Text style={styles.metaText}>{lesson.ageRange} tuổi</Text>
          <Text style={styles.metaText}>•  {lesson.views.toLocaleString()} lượt xem</Text>
        </View>

        {/* Author */}
        <View style={[L.card, styles.authorCard]}>
          <View style={styles.authorAvatar}><Ionicons name="person-circle" size={36} color={C.primary} /></View>
          <View>
            <Text style={styles.authorName}>{lesson.author}</Text>
            <Text style={styles.authorRole}>Chuyên gia giáo dục</Text>
          </View>
        </View>

        {/* Content */}
        <Text style={[L.sectionTitle, { marginTop: 18 }]}>Nội dung</Text>
        <Text style={styles.content}>{lesson.content}</Text>

        {/* Quiz section */}
        <View style={[L.card, styles.quizCard]}>
          <View style={styles.quizIcon}><Ionicons name="help-circle" size={28} color={C.orange} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.quizTitle}>{lesson.quizTitle}</Text>
            <Text style={styles.quizDesc}>Kiểm tra kiến thức sau khi xem</Text>
          </View>
          <Pressable
            style={styles.quizBtn}
            onPress={() => navigation.navigate(Routes.Quiz.Play, { quizId: lesson.quizId, lessonTitle: lesson.title })}
          >
            <Text style={styles.quizBtnText}>Làm bài</Text>
            <Ionicons name="arrow-forward" size={14} color="#FFF" />
          </Pressable>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 8 },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: '#E4E9FF', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: C.text, fontSize: 15, fontWeight: '800', flex: 1, textAlign: 'center', marginHorizontal: 10 },
  videoPlayer: { height: 210, borderRadius: 20, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 18, overflow: 'hidden' },
  videoEmoji: { fontSize: 70, opacity: 0.3, position: 'absolute' },
  playButton: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  videoDuration: { position: 'absolute', bottom: 10, right: 12, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  videoDurationText: { color: '#FFF', fontSize: 11, fontWeight: '600' },
  title: { color: C.text, fontSize: 20, fontWeight: '800', lineHeight: 28, marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  skillPill: { backgroundColor: C.primarySoft, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  skillPillText: { color: C.primary, fontSize: 11, fontWeight: '700' },
  metaText: { color: C.muted, fontSize: 11 },
  authorCard: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 },
  authorAvatar: {},
  authorName: { color: C.text, fontSize: 14, fontWeight: '700' },
  authorRole: { color: C.muted, fontSize: 11, marginTop: 1 },
  content: { color: C.text, fontSize: 14, lineHeight: 22, marginTop: 8, marginBottom: 20 },
  quizCard: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, marginTop: 4 },
  quizIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: C.orangeSoft, alignItems: 'center', justifyContent: 'center' },
  quizTitle: { color: C.text, fontSize: 13, fontWeight: '700' },
  quizDesc: { color: C.muted, fontSize: 11, marginTop: 2 },
  quizBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.orange, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  quizBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
});
