import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Text, Modal, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';

const internetStories = [
  { id: 'ext1', title: 'Sự tích cây vú sữa', source: 'Kho tàng Cổ tích VN', age: '4-8', duration: '6 phút', lesson: 'Tình mẫu tử thiêng liêng', added: true },
  { id: 'ext2', title: 'Thạch Sanh đánh Chằn Tinh', source: 'Truyện Dân gian VN', age: '6-10', duration: '9 phút', lesson: 'Dũng cảm, chính nghĩa', added: true },
  { id: 'ext3', title: 'Rùa và Thỏ thi chạy', source: 'Ngụ ngôn Aesop', age: '3-6', duration: '5 phút', lesson: 'Kiên trì, không chủ quan', added: true },
  { id: 'ext4', title: 'Cậu bé chăn cừu', source: 'Ngụ ngôn Aesop', age: '5-8', duration: '7 phút', lesson: 'Trung thực, không nói dối', added: false },
  { id: 'ext5', title: 'Cây tre trăm đốt', source: 'Cổ tích Việt Nam', age: '6-10', duration: '10 phút', lesson: 'Ở hiền gặp lành', added: false },
];

export default function ParentBedtimeStoriesScreen() {
  const navigation = useNavigation<any>();
  const [voiceClonedMom, setVoiceClonedMom] = useState(true);
  const [voiceClonedDad, setVoiceClonedDad] = useState(false);
  const [showStudioModal, setShowStudioModal] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [searchInternet, setSearchInternet] = useState('');
  const [storyList, setStoryList] = useState(internetStories);
  const [selectedRole, setSelectedRole] = useState<'mom' | 'dad'>('mom');

  const handleRecord = () => {
    setRecording(true);
    setRecordProgress(0);
    const interval = setInterval(() => {
      setRecordProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setRecording(false);
          if (selectedRole === 'mom') setVoiceClonedMom(true);
          else setVoiceClonedDad(true);
          Alert.alert('✅ Hoàn tất!', `Giọng nói của ${selectedRole === 'mom' ? 'Mẹ' : 'Bố'} đã được nhân bản thành công! Bé sẽ được nghe truyện bằng giọng của ${selectedRole === 'mom' ? 'Mẹ' : 'Bố'}.`);
          return 100;
        }
        return prev + 5;
      });
    }, 250);
  };

  const toggleAddStory = (id: string) => {
    setStoryList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, added: !s.added } : s))
    );
  };

  const filteredInternet = storyList.filter(
    (s) => !searchInternet || s.title.toLowerCase().includes(searchInternet.toLowerCase()) || s.source.toLowerCase().includes(searchInternet.toLowerCase())
  );

  return (
    <ScrollView style={L.screen} contentContainerStyle={[L.content, { paddingTop: 50 }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.overline}>QUẢN LÝ KỂ CHUYỆN & AI VOICE STUDIO</Text>
          <Text style={styles.title}>Giờ Kể Chuyện PH 🎤</Text>
        </View>
        <View style={styles.badgePill}>
          <Text style={styles.badgePillText}>Premium Studio</Text>
        </View>
      </View>

      {/* AI Voice Studio Banner Section */}
      <View style={styles.studioCard}>
        <View style={styles.studioHeader}>
          <Text style={{ fontSize: 32 }}>🎙️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.studioTitle}>AI Voice Cloning Studio</Text>
            <Text style={styles.studioSub}>Nhân bản giọng đọc Bố/Mẹ để đọc truyện đêm cho bé {MOCK_KIDLIFE_DATA.child.name}</Text>
          </View>
        </View>

        {/* Voice Status Badges */}
        <View style={styles.voiceStatusContainer}>
          {/* Mom Voice Status */}
          <View style={[styles.voiceStatusBox, voiceClonedMom && styles.voiceStatusDone]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.voiceRoleText}>👩 Giọng đọc của Mẹ ({MOCK_KIDLIFE_DATA.parent.name})</Text>
              <Text style={[styles.voiceStateText, voiceClonedMom && { color: C.green }]}>
                {voiceClonedMom ? '✅ Đã nhân bản (Sẵn sàng)' : '⚪ Chưa thu âm mẫu'}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.studioBtn, voiceClonedMom && styles.studioBtnSecondary]}
              onPress={() => {
                setSelectedRole('mom');
                setShowStudioModal(true);
              }}
            >
              <Text style={[styles.studioBtnText, voiceClonedMom && { color: C.primary }]}>
                {voiceClonedMom ? 'Thu lại' : 'Thu âm'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Dad Voice Status */}
          <View style={[styles.voiceStatusBox, voiceClonedDad && styles.voiceStatusDone]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.voiceRoleText}>👨 Giọng đọc của Bố (Minh Tuấn)</Text>
              <Text style={[styles.voiceStateText, voiceClonedDad && { color: C.green }]}>
                {voiceClonedDad ? '✅ Đã nhân bản (Sẵn sàng)' : '⚪ Chưa thu âm mẫu'}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.studioBtn, voiceClonedDad && styles.studioBtnSecondary]}
              onPress={() => {
                setSelectedRole('dad');
                setShowStudioModal(true);
              }}
            >
              <Text style={[styles.studioBtnText, voiceClonedDad && { color: C.primary }]}>
                {voiceClonedDad ? 'Thu lại' : 'Thu âm'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Curated Internet Story Search Section */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={L.sectionTitle}>Tìm kiếm & Biên tập Truyện từ Internet 🌐</Text>
          <Text style={styles.subText}>Tìm câu chuyện hay từ Internet và thêm vào kho truyện của bé</Text>
        </View>
      </View>

      {/* Internet Search Box */}
      <View style={styles.searchBox}>
        <Ionicons name="globe-outline" size={18} color={C.primary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm truyện ngụ ngôn, dân gian từ Internet..."
          placeholderTextColor={C.muted}
          value={searchInternet}
          onChangeText={setSearchInternet}
        />
        {searchInternet ? (
          <Pressable onPress={() => setSearchInternet('')}>
            <Ionicons name="close-circle" size={18} color={C.muted} />
          </Pressable>
        ) : null}
      </View>

      {/* Internet Story List */}
      <View style={styles.storyList}>
        {filteredInternet.map((story) => (
          <View key={story.id} style={[L.card, styles.storyCard]}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.storyTitle}>{story.title}</Text>
                <View style={styles.sourceTag}>
                  <Text style={styles.sourceText}>{story.source}</Text>
                </View>
              </View>

              <Text style={styles.storyDesc}>Mục tiêu: {story.lesson} • Độ tuổi {story.age} • {story.duration}</Text>
            </View>

            <TouchableOpacity
              style={[styles.addLibraryBtn, story.added && styles.addLibraryBtnAdded]}
              onPress={() => toggleAddStory(story.id)}
            >
              <Ionicons name={story.added ? 'checkmark' : 'add'} size={16} color={story.added ? C.green : '#FFF'} />
              <Text style={[styles.addLibraryText, story.added && { color: C.green }]}>
                {story.added ? 'Đã thêm' : 'Thêm'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Recording Studio Modal */}
      <Modal visible={showStudioModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🎤 AI Voice Studio - {selectedRole === 'mom' ? 'Giọng Mẹ' : 'Giọng Bố'}</Text>
              <Pressable onPress={() => setShowStudioModal(false)}>
                <Ionicons name="close-circle" size={24} color={C.muted} />
              </Pressable>
            </View>

            <Text style={styles.sampleInstruction}>Vui lòng đọc rõ ràng đoạn văn mẫu dưới đây trong 1 phút để AI phân tích tần số giọng đọc:</Text>

            <View style={styles.sampleBox}>
              <Text style={styles.sampleText}>
                "Ngày xửa ngày xưa, ở một vương quốc xa xôi có một cô bé rất ngoan và hiền lành. Cô bé luôn chăm chỉ làm việc nhà và yêu thương mọi người. Mỗi buổi tối, cô bé đều ngồi bên cửa sổ nhìn những vì sao lấp lánh và ước mong một ngày tốt lành..."
              </Text>
            </View>

            {!recording ? (
              <TouchableOpacity style={styles.startRecordBtn} onPress={handleRecord}>
                <Ionicons name="mic" size={22} color="#FFF" />
                <Text style={styles.startRecordText}>Bắt đầu thu âm 1 phút</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.recordingProgressWrap}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingProgressText}>Đang thu âm... {recordProgress}%</Text>
                <View style={styles.trackBar}>
                  <View style={[styles.trackFill, { width: `${recordProgress}%` }]} />
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  overline: { color: C.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: C.text, fontSize: 24, fontWeight: '800', marginTop: 3 },
  badgePill: { backgroundColor: '#F0E9FF', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  badgePillText: { color: '#8E54E9', fontSize: 10, fontWeight: '800' },

  studioCard: { backgroundColor: '#F0F5FF', borderRadius: 22, padding: 18, marginBottom: 20, borderWidth: 1, borderColor: '#D0E0FF' },
  studioHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  studioTitle: { color: C.text, fontSize: 16, fontWeight: '800' },
  studioSub: { color: C.muted, fontSize: 11, marginTop: 2, lineHeight: 16 },

  voiceStatusContainer: { gap: 10 },
  voiceStatusBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: C.border },
  voiceStatusDone: { borderColor: C.greenSoft, backgroundColor: '#FBFFFB' },
  voiceRoleText: { color: C.text, fontSize: 12, fontWeight: '700' },
  voiceStateText: { color: C.muted, fontSize: 10, marginTop: 2 },
  studioBtn: { backgroundColor: C.primary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  studioBtnSecondary: { backgroundColor: C.primarySoft },
  studioBtnText: { color: '#FFF', fontSize: 11, fontWeight: '800' },

  sectionHeader: { marginBottom: 12 },
  subText: { color: C.muted, fontSize: 11, marginTop: 2 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFF', borderRadius: 14, borderWidth: 1, borderColor: C.border, paddingHorizontal: 14, height: 46, marginBottom: 16 },
  searchInput: { flex: 1, fontSize: 13, color: C.text },

  storyList: { gap: 10, marginBottom: 20 },
  storyCard: { padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  storyTitle: { color: C.text, fontSize: 14, fontWeight: '800' },
  sourceTag: { backgroundColor: '#EBF4FF', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  sourceText: { color: C.primary, fontSize: 9, fontWeight: '800' },
  storyDesc: { color: C.muted, fontSize: 11, marginTop: 4 },
  addLibraryBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.primary, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  addLibraryBtnAdded: { backgroundColor: C.greenSoft },
  addLibraryText: { color: '#FFF', fontSize: 11, fontWeight: '800' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, width: '100%', maxWidth: 380 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  modalTitle: { color: C.text, fontSize: 16, fontWeight: '800' },
  sampleInstruction: { color: C.muted, fontSize: 12, lineHeight: 18, marginBottom: 14 },
  sampleBox: { backgroundColor: '#F8FAFF', borderRadius: 14, padding: 14, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: C.primary },
  sampleText: { color: C.text, fontSize: 13, lineHeight: 20, fontStyle: 'italic' },
  startRecordBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.red, borderRadius: 14, paddingVertical: 13 },
  startRecordText: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  recordingProgressWrap: { alignItems: 'center', gap: 8 },
  recordingDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: C.red },
  recordingProgressText: { color: C.text, fontSize: 13, fontWeight: '700' },
  trackBar: { width: '100%', height: 7, backgroundColor: '#EFF1F7', borderRadius: 4, overflow: 'hidden' },
  trackFill: { height: '100%', backgroundColor: C.red, borderRadius: 4 },
});
