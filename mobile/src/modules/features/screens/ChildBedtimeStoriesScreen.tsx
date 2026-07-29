import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Text, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';
import { useAppSelector } from '@/shared/store';

const categories = [
  { id: 'all', name: 'Tất cả', emoji: '📚' },
  { id: 'cotich', name: 'Cổ tích', emoji: '🏰' },
  { id: 'giaoduc', name: 'Giáo dục', emoji: '📖' },
  { id: 'khoahoc', name: 'Khoa học', emoji: '🔬' },
  { id: 'daoduc', name: 'Đạo đức', emoji: '🌈' },
];

const characterVoices = [
  { id: 'mom', name: 'Giọng Mẹ', emoji: '👩', color: '#FF6B9D', tag: 'Trầm ấm & Thân thương' },
  { id: 'dad', name: 'Giọng Bố', emoji: '👨', color: '#2B44E8', tag: 'Vui vẻ & Dũng cảm' },
  { id: 'wizard', name: 'Phù thủy Xám', emoji: '🧙‍♂️', color: '#6C5CE7', tag: 'Huyền bí & Phép thuật' },
  { id: 'robot', name: 'Robot BiBi', emoji: '🤖', color: '#00B894', tag: 'Thông thái & Vui nhộn' },
  { id: 'princess', name: 'Công chúa Ánh Sao', emoji: '👸', color: '#FF4785', tag: 'Ngọt ngào & Nhu hòa' },
  { id: 'dragon', name: 'Rồng Con Béo', emoji: '🐲', color: '#E17055', tag: 'Tinh nghịch & Hóm hỉnh' },
  { id: 'owl', name: 'Cú Mèo Tri Thức', emoji: '🦉', color: '#D63031', tag: 'Thông thái & Sâu lắng' },
  { id: 'bear', name: 'Gấu Bơ Ấm Áp', emoji: '🧸', color: '#E67E22', tag: 'Nhẹ nhàng & Dễ ngủ' },
];

const stories = [
  { id: '1', title: 'Cô bé Lọ Lem', category: 'cotich', age: '3-6', emoji: '👸', duration: '8 phút', desc: 'Câu chuyện về sự kiên nhẫn và lòng tốt sẽ được đền đáp', lesson: 'Kiên nhẫn, tử tế' },
  { id: '2', title: 'Chú thỏ và chú rùa', category: 'daoduc', age: '3-5', emoji: '🐢', duration: '5 phút', desc: 'Ai chậm mà chắc sẽ thắng cuộc!', lesson: 'Kiên trì, không chủ quan' },
  { id: '3', title: 'Vì sao mưa rơi?', category: 'khoahoc', age: '5-8', emoji: '🌧️', duration: '6 phút', desc: 'Khám phá vòng tuần hoàn nước thú vị', lesson: 'Khoa học thường thức' },
  { id: '4', title: 'Bé học chia sẻ', category: 'giaoduc', age: '3-5', emoji: '🤝', duration: '4 phút', desc: 'Chia sẻ đồ chơi với bạn bè', lesson: 'Chia sẻ, đồng cảm' },
  { id: '5', title: 'Aladdin và cây đèn thần', category: 'cotich', age: '5-8', emoji: '🧞', duration: '10 phút', desc: 'Phiêu lưu cùng cậu bé Aladdin dũng cảm', lesson: 'Trung thực, dũng cảm' },
  { id: '6', title: 'Hệ mặt trời kỳ diệu', category: 'khoahoc', age: '6-10', emoji: '🌍', duration: '7 phút', desc: 'Du hành vũ trụ cùng bé học về các hành tinh', lesson: 'Thiên văn học' },
];

const curatedStories = [
  { id: 'ext1', title: 'Sự tích cây vú sữa', category: 'daoduc', age: '4-8', emoji: '🌳', duration: '6 phút', desc: 'Câu chuyện cảm động về tình mẫu tử', lesson: 'Tình mẫu tử' },
  { id: 'ext2', title: 'Thạch Sanh đánh Chằn Tinh', category: 'cotich', age: '6-10', emoji: '⚔️', duration: '9 phút', desc: 'Hành trình dũng cảm bảo vệ mọi người', lesson: 'Dũng cảm, chính nghĩa' },
  { id: 'ext3', title: 'Rùa và Thỏ thi chạy', category: 'daoduc', age: '3-6', emoji: '🐢', duration: '5 phút', desc: 'Chậm mà chắc sẽ đến đích', lesson: 'Kiên trì' },
  { id: 'ext4', title: 'Cậu bé chăn cừu', category: 'daoduc', age: '5-8', emoji: '🐑', duration: '7 phút', desc: 'Bài học về lời nói thật', lesson: 'Trung thực' },
  { id: 'ext5', title: 'Cây tre trăm đốt', category: 'cotich', age: '6-10', emoji: '🎋', duration: '10 phút', desc: 'Truyện cổ tích Việt Nam giàu ý nghĩa', lesson: 'Ở hiền gặp lành' },
];

export default function ChildBedtimeStoriesScreen() {
  const navigation = useNavigation<any>();
  const childStoryIds = useAppSelector((state) => state.kidlife.childStoryIds);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedVoice, setSelectedVoice] = useState('wizard');
  const [selectedStory, setSelectedStory] = useState<typeof stories[0] | null>(null);
  const [showReader, setShowReader] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bgmOn, setBgmOn] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const availableStories = [...stories, ...curatedStories.filter((story) => childStoryIds.includes(story.id))];
  const filteredStories = availableStories.filter((s) => {
    const matchCat = activeCategory === 'all' || s.category === activeCategory;
    const matchSearch = !searchQuery || s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.lesson.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const activeVoiceObj = characterVoices.find((v) => v.id === selectedVoice) || characterVoices[0];

  return (
    <ScrollView style={L.screen} contentContainerStyle={[L.content, { paddingTop: 50 }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.overline}>GÓC CHUYỆN KỂ CỦA BÉ {MOCK_KIDLIFE_DATA.child.name.toUpperCase()}</Text>
          <Text style={styles.title}>Giờ Kể Chuyện 🌟</Text>
        </View>
        <View style={styles.starBadge}>
          <Text style={{ fontSize: 16 }}>🌙</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={16} color={C.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm truyện cổ tích, khoa học..."
          placeholderTextColor={C.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Character Voice Picker Section */}
      <View style={styles.voiceSectionHeader}>
        <Text style={styles.voicePickerLabel}>🎭 Chọn nhân vật kể chuyện cho bé:</Text>
        <Text style={styles.voiceSelectedText}>{activeVoiceObj.emoji} {activeVoiceObj.name}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.voiceGrid}>
        {characterVoices.map((v) => {
          const isSelected = selectedVoice === v.id;
          return (
            <Pressable
              key={v.id}
              style={[
                styles.voiceCard,
                isSelected && { borderColor: v.color, backgroundColor: v.color + '12' },
              ]}
              onPress={() => setSelectedVoice(v.id)}
            >
              <Text style={styles.voiceEmoji}>{v.emoji}</Text>
              <Text style={[styles.voiceName, isSelected && { color: v.color, fontWeight: '800' }]}>{v.name}</Text>
              <Text style={styles.voiceTag} numberOfLines={1}>{v.tag}</Text>
              {isSelected && (
                <View style={[styles.selectedCheck, { backgroundColor: v.color }]}>
                  <Ionicons name="checkmark" size={10} color="#FFF" />
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
        {categories.map((cat) => (
          <Pressable key={cat.id} style={[styles.catChip, activeCategory === cat.id && styles.catChipActive]} onPress={() => setActiveCategory(cat.id)}>
            <Text style={styles.catEmoji}>{cat.emoji}</Text>
            <Text style={[styles.catName, activeCategory === cat.id && styles.catNameActive]}>{cat.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Story List */}
      <Text style={L.sectionTitle}>Thư viện truyện cho bé ({filteredStories.length})</Text>
      <Text style={styles.subtitle}>Chọn truyện và đắm chìm vào thế giới kỳ diệu</Text>

      {filteredStories.map((story) => (
        <Pressable key={story.id} style={styles.storyCard} onPress={() => { setSelectedStory(story); setShowReader(true); }}>
          <View style={styles.storyEmoji}><Text style={{ fontSize: 34 }}>{story.emoji}</Text></View>
          <View style={styles.storyInfo}>
            <Text style={styles.storyTitle}>{story.title}</Text>
            <Text style={styles.storyDesc} numberOfLines={1}>{story.desc}</Text>
            <View style={styles.storyMeta}>
              <View style={styles.ageBadge}><Text style={styles.ageText}>{story.age} tuổi</Text></View>
              <Text style={styles.duration}><Ionicons name="time-outline" size={11} color={C.muted} /> {story.duration}</Text>
              <Text style={styles.lessonTag}>💡 {story.lesson}</Text>
            </View>
          </View>
          <Ionicons name="play-circle" size={36} color={activeVoiceObj.color} />
        </Pressable>
      ))}

      {/* Story Reader Modal */}
      <Modal visible={showReader} transparent animationType="slide">
        <View style={styles.readerOverlay}>
          <View style={styles.readerCard}>
            <Pressable style={styles.readerClose} onPress={() => { setShowReader(false); setIsPlaying(false); }}>
              <Ionicons name="chevron-down" size={26} color={C.muted} />
            </Pressable>

            <Text style={styles.readerEmoji}>{selectedStory?.emoji}</Text>
            <Text style={styles.readerTitle}>{selectedStory?.title}</Text>
            <Text style={styles.readerLesson}>💡 Bài học: {selectedStory?.lesson}</Text>

            {/* Currently Selected Voice Character Banner */}
            <View style={[styles.activeVoiceBadge, { backgroundColor: activeVoiceObj.color + '18' }]}>
              <Text style={{ fontSize: 18 }}>{activeVoiceObj.emoji}</Text>
              <View style={{ marginLeft: 6 }}>
                <Text style={[styles.activeVoiceText, { color: activeVoiceObj.color }]}>Nhân vật đọc: {activeVoiceObj.name}</Text>
                <Text style={styles.activeVoiceTag}>{activeVoiceObj.tag}</Text>
              </View>
            </View>

            {/* Story Content */}
            <ScrollView style={styles.storyContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.storyText}>
                Ngày xửa ngày xưa, ở một vương quốc xa xôi, có một {selectedStory?.emoji === '👸' ? 'cô bé hiền lành tên Lọ Lem' : selectedStory?.emoji === '🐢' ? 'chú rùa nhỏ rất kiên trì' : 'câu chuyện thú vị'} ...{'\n\n'}
                Mỗi ngày, {selectedStory?.emoji === '👸' ? 'cô bé đều chăm chỉ làm việc nhà, dù bị hai người chị ghẻ bắt nạt' : 'chú rùa đều luyện tập không ngừng nghỉ'}.{'\n\n'}
                Và cuối cùng, nhờ sự kiên nhẫn và lòng tốt, {selectedStory?.emoji === '👸' ? 'cô bé đã được gặp hoàng tử' : 'chú rùa đã chiến thắng cuộc đua'}.{'\n\n'}
                ✨ Bài học rút ra: {selectedStory?.lesson}
              </Text>
            </ScrollView>

            {/* Audio Player */}
            <View style={styles.player}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: isPlaying ? '45%' : '0%', backgroundColor: activeVoiceObj.color }]} />
              </View>
              <View style={styles.playerControls}>
                <Pressable><Ionicons name="play-skip-back" size={24} color={C.muted} /></Pressable>
                <Pressable style={[styles.playBtn, { backgroundColor: activeVoiceObj.color }]} onPress={() => setIsPlaying(!isPlaying)}>
                  <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color="#FFF" />
                </Pressable>
                <Pressable><Ionicons name="play-skip-forward" size={24} color={C.muted} /></Pressable>
              </View>
              <View style={styles.playerFooter}>
                <Pressable style={styles.bgmToggle} onPress={() => setBgmOn(!bgmOn)}>
                  <Ionicons name={bgmOn ? 'musical-notes' : 'musical-notes-outline'} size={16} color={bgmOn ? activeVoiceObj.color : C.muted} />
                  <Text style={[styles.bgmText, bgmOn && { color: activeVoiceObj.color }]}>Nhạc nền BGM {bgmOn ? 'BẬT' : 'TẮT'}</Text>
                </Pressable>
              </View>
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
  overline: { color: '#6C5CE7', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: C.text, fontSize: 24, fontWeight: '800', marginTop: 3 },
  starBadge: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0E9FF', alignItems: 'center', justifyContent: 'center' },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: C.border, paddingHorizontal: 14, height: 44, marginBottom: 14 },
  searchInput: { flex: 1, fontSize: 13, color: C.text },

  voiceSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  voicePickerLabel: { color: C.text, fontSize: 13, fontWeight: '800' },
  voiceSelectedText: { color: C.primary, fontSize: 12, fontWeight: '700' },
  voiceGrid: { gap: 10, marginBottom: 18, paddingRight: 20 },
  voiceCard: { width: 105, backgroundColor: '#FFF', borderRadius: 16, borderWidth: 1.5, borderColor: C.border, padding: 10, alignItems: 'center', position: 'relative' },
  voiceEmoji: { fontSize: 32, marginBottom: 4 },
  voiceName: { color: C.text, fontSize: 11, fontWeight: '700', textAlign: 'center' },
  voiceTag: { color: C.muted, fontSize: 9, marginTop: 2, textAlign: 'center' },
  selectedCheck: { position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },

  catRow: { gap: 8, marginBottom: 20, paddingRight: 20 },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF', borderRadius: 999, borderWidth: 1, borderColor: C.border, paddingHorizontal: 14, paddingVertical: 8 },
  catChipActive: { borderColor: C.primary, backgroundColor: C.primarySoft },
  catEmoji: { fontSize: 16 },
  catName: { color: C.text, fontSize: 12, fontWeight: '600' },
  catNameActive: { color: C.primary, fontWeight: '700' },
  subtitle: { color: C.muted, fontSize: 12, marginTop: 4, marginBottom: 14 },
  storyCard: { ...L.card, flexDirection: 'row', alignItems: 'center', padding: 14, marginBottom: 10 },
  storyEmoji: { width: 56, height: 56, borderRadius: 14, backgroundColor: '#F0E9FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  storyInfo: { flex: 1 },
  storyTitle: { color: C.text, fontSize: 14, fontWeight: '700' },
  storyDesc: { color: C.muted, fontSize: 11, marginTop: 3 },
  storyMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  ageBadge: { backgroundColor: '#E4F8EE', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  ageText: { color: C.green, fontSize: 9, fontWeight: '700' },
  duration: { color: C.muted, fontSize: 10 },
  lessonTag: { color: C.orange, fontSize: 10 },
  readerOverlay: { flex: 1, backgroundColor: '#FFF', paddingTop: 50 },
  readerCard: { flex: 1, padding: 24, alignItems: 'center' },
  readerClose: { alignSelf: 'center', marginBottom: 16 },
  readerEmoji: { fontSize: 72, marginBottom: 12 },
  readerTitle: { color: C.text, fontSize: 22, fontWeight: '800' },
  readerLesson: { color: C.orange, fontSize: 13, marginTop: 6 },
  activeVoiceBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 8, marginTop: 12, width: '100%' },
  activeVoiceText: { fontSize: 13, fontWeight: '800' },
  activeVoiceTag: { color: C.muted, fontSize: 10, marginTop: 1 },
  storyContent: { flex: 1, marginVertical: 18, width: '100%' },
  storyText: { color: C.text, fontSize: 15, lineHeight: 26 },
  player: { width: '100%', paddingTop: 16, borderTopWidth: 1, borderTopColor: C.border },
  progressBar: { height: 4, backgroundColor: '#EFF1F7', borderRadius: 2, overflow: 'hidden', marginBottom: 14 },
  progressFill: { height: '100%', borderRadius: 2 },
  playerControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24 },
  playBtn: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  playerFooter: { flexDirection: 'row', justifyContent: 'center', marginTop: 14 },
  bgmToggle: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  bgmText: { color: C.muted, fontSize: 11, fontWeight: '700' },
});
