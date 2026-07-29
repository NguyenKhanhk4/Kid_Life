import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Routes } from '@/navigation/constants';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
import { addTask, useAppDispatch } from '@/shared/store';

const MOCK_CHILDREN = [
  { id: '1', name: 'Minh Anh', avatar: '🧒' },
  { id: '2', name: 'Thảo My', avatar: '👧' },
];

const SKILLS = ['Vệ sinh', 'Tự lập', 'Giao tiếp', 'Cảm xúc'];

export default function CreateMissionScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const route = useRoute<any>();
  const editMode = !!route.params?.editMissionId;

  const [title, setTitle] = useState(editMode ? 'Đánh răng trước khi ngủ' : '');
  const [desc, setDesc] = useState(editMode ? 'Bé nhớ lấy kem bằng hạt đậu...' : '');
  const [childId, setChildId] = useState('1');
  const [skill, setSkill] = useState('Vệ sinh');
  const [points, setPoints] = useState('30');
  const [time, setTime] = useState('18:30 - 19:00');
  const [checklist, setChecklist] = useState(editMode ? ['Lấy bàn chải và kem', 'Đánh đủ 2 phút'] : ['']);

  const updateChecklist = (text: string, index: number) => {
    const newList = [...checklist];
    newList[index] = text;
    setChecklist(newList);
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên nhiệm vụ.');
      return;
    }
    if (!editMode) {
      dispatch(addTask({
        title,
        time,
        rewardXP: Math.max(1, Number(points) || 30),
        category: skill,
        subtasks: checklist,
      }));
    }
    Alert.alert('Thành công', editMode ? 'Đã cập nhật nhiệm vụ' : 'Đã tạo nhiệm vụ mới', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <View style={L.screen}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>{editMode ? 'Sửa nhiệm vụ' : 'Tạo nhiệm vụ mới'}</Text>
        <View style={styles.back} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Child selector */}
        <Text style={styles.sectionLabel}>Giao cho bé</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rowList}>
          {MOCK_CHILDREN.map(c => (
            <Pressable key={c.id} style={[styles.childChip, childId === c.id && styles.childChipActive]} onPress={() => setChildId(c.id)}>
              <Text style={{ fontSize: 20, marginRight: 6 }}>{c.avatar}</Text>
              <Text style={[styles.childChipText, childId === c.id && styles.childChipTextActive]}>{c.name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Field label="Tên nhiệm vụ" placeholder="VD: Đánh răng trước khi ngủ" value={title} onChangeText={setTitle} />
        
        {/* AI Video Button */}
        <Pressable style={styles.aiBtn} onPress={() => navigation.navigate(Routes.Mission.AIVideoPrompt, { missionTitle: title })}>
          <View style={styles.aiIconBox}><Ionicons name="sparkles" size={18} color="#FFF" /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.aiBtnTitle}>🎬 Tạo video AI cho nhiệm vụ</Text>
            <Text style={styles.aiBtnDesc}>Sinh video hoạt hình hướng dẫn bé làm</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={C.primary} />
        </Pressable>

        <Field label="Mô tả / Lời nhắc" placeholder="Nhập ghi chú cho bé..." value={desc} onChangeText={setDesc} multiline />

        {/* Skill selector */}
        <Text style={styles.sectionLabel}>Kỹ năng phát triển</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rowList}>
          {SKILLS.map(s => (
            <Pressable key={s} style={[styles.skillChip, skill === s && styles.skillChipActive]} onPress={() => setSkill(s)}>
              <Text style={[styles.skillText, skill === s && styles.skillTextActive]}>{s}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Field label="Điểm thưởng (XP)" placeholder="VD: 30" value={points} onChangeText={setPoints} keyboardType="numeric" />
        <Field label="Khung giờ thực hiện" placeholder="VD: 18:30 - 19:00" value={time} onChangeText={setTime} />

        {/* Checklist */}
        <Text style={styles.sectionLabel}>Checklist (Các bước bé cần làm)</Text>
        {checklist.map((item, i) => (
          <View key={i} style={styles.checkRow}>
            <Ionicons name="ellipse-outline" size={20} color={C.muted} />
            <TextInput style={styles.checkInput} placeholder={`Bước ${i + 1}`} value={item} onChangeText={(t) => updateChecklist(t, i)} />
            {checklist.length > 1 && (
              <Pressable onPress={() => setChecklist(checklist.filter((_, idx) => idx !== i))}>
                <Ionicons name="close-circle" size={20} color={C.redSoft} />
              </Pressable>
            )}
          </View>
        ))}
        <Pressable style={styles.addCheckBtn} onPress={() => setChecklist([...checklist, ''])}>
          <Ionicons name="add-circle-outline" size={18} color={C.primary} />
          <Text style={styles.addCheckText}>Thêm bước</Text>
        </Pressable>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable style={styles.submitBtn} onPress={handleSave}>
          <Text style={styles.submitBtnText}>{editMode ? 'Lưu thay đổi' : 'Phát hành nhiệm vụ'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Field({ label, placeholder, value, onChangeText, multiline, keyboardType }: any) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput 
        style={[styles.input, multiline && styles.inputMultiline]} 
        placeholder={placeholder} 
        placeholderTextColor="#9DA9D8" 
        value={value} 
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 12 },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: '#E4E9FF', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: C.text, fontSize: 17, fontWeight: '800' },
  content: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
  sectionLabel: { color: '#17328B', fontSize: 13, fontWeight: '800', marginBottom: 10, marginTop: 16 },
  rowList: { gap: 10, paddingBottom: 10 },
  childChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#E7EBFF', borderWidth: 2, borderColor: 'transparent' },
  childChipActive: { borderColor: C.primary, backgroundColor: C.primarySoft },
  childChipText: { color: C.muted, fontSize: 13, fontWeight: '700' },
  childChipTextActive: { color: C.primary },
  fieldWrap: { marginBottom: 16 },
  label: { color: '#17328B', fontSize: 13, fontWeight: '800', marginBottom: 8 },
  input: { backgroundColor: '#F0F2FA', borderRadius: 14, paddingHorizontal: 16, height: 50, color: C.text, fontSize: 14 },
  inputMultiline: { height: 100, textAlignVertical: 'top', paddingVertical: 14 },
  skillChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#E7EBFF' },
  skillChipActive: { backgroundColor: C.primary },
  skillText: { color: C.muted, fontSize: 12, fontWeight: '700' },
  skillTextActive: { color: '#FFF' },
  aiBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E7EBFF', padding: 14, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#C3CEFF' },
  aiIconBox: { width: 36, height: 36, borderRadius: 12, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  aiBtnTitle: { color: C.primary, fontSize: 14, fontWeight: '800' },
  aiBtnDesc: { color: C.muted, fontSize: 11, marginTop: 2 },
  checkRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F2FA', borderRadius: 12, paddingHorizontal: 14, height: 46, marginBottom: 10 },
  checkInput: { flex: 1, color: C.text, fontSize: 14, marginLeft: 10 },
  addCheckBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 6, paddingVertical: 8 },
  addCheckText: { color: C.primary, fontSize: 13, fontWeight: '700' },
  footer: { padding: 20, paddingBottom: 30, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EEF0F8' },
  submitBtn: { height: 54, borderRadius: 16, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  submitBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
});
