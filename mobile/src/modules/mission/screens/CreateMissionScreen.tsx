import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, Alert, KeyboardTypeOptions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, NavigationProp, RouteProp } from '@react-navigation/native';
import { Routes } from '@/navigation/constants';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createMission, updateMission, getMission, CreateMissionInput, UpdateMissionInput } from '@/shared/api/missionApi';

export default function CreateMissionScreen() {
  const navigation = useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const queryClient = useQueryClient();
  const route = useRoute<RouteProp<Record<string, { editMissionId?: string, childId?: string }>, string>>();
  const editMissionId = route.params?.editMissionId;
  const passedChildId = route.params?.childId;

  const { data: editData } = useQuery({
    queryKey: ['mission', editMissionId],
    queryFn: () => {
      if (!editMissionId) return Promise.reject(new Error('Missing editMissionId'));
      return getMission(editMissionId);
    },
    enabled: !!editMissionId,
  });

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [points, setPoints] = useState('30');
  const [dueDate, setDueDate] = useState('');
  const [checklist, setChecklist] = useState<{text: string}[]>([{text: ''}]);

  React.useEffect(() => {
    if (editData) {
      setTitle(editData.title);
      setDesc(editData.description);
      setPoints(String(editData.rewardPoints));
      setDueDate(editData.dueDate ? new Date(editData.dueDate).toISOString().split('T')[0] : '');
      setChecklist(editData.checklist?.length ? editData.checklist.map(c => ({ text: c.text })) : [{text: ''}]);
    }
  }, [editData]);

  const updateChecklist = (text: string, index: number) => {
    const newList = [...checklist];
    newList[index] = { ...newList[index], text };
    setChecklist(newList);
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateMissionInput) => createMission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
      Alert.alert('Thành công', 'Đã tạo nhiệm vụ mới', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    },
    onError: (err: Error) => Alert.alert('Lỗi', err.message || 'Không thể tạo nhiệm vụ')
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateMissionInput) => {
      if (!editMissionId) return Promise.reject(new Error('Missing editMissionId'));
      return updateMission(editMissionId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mission', editMissionId] });
      queryClient.invalidateQueries({ queryKey: ['missions'] });
      Alert.alert('Thành công', 'Đã cập nhật nhiệm vụ', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    },
    onError: (err: Error) => Alert.alert('Lỗi', err.message || 'Không thể cập nhật nhiệm vụ')
  });

  const handleSave = () => {
    if (!title.trim() || !desc.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên và mô tả nhiệm vụ.');
      return;
    }
    const childToUse = editData?.childId || passedChildId;
    if (!childToUse) {
      Alert.alert('Lỗi', 'Không xác định được trẻ. Vui lòng thử lại.');
      return;
    }

    let parsedDate = new Date();
    if (dueDate.trim()) {
      const dateParts = dueDate.split('-');
      if (dateParts.length !== 3 || isNaN(Date.parse(dueDate))) {
        Alert.alert('Lỗi', 'Ngày hết hạn không hợp lệ (YYYY-MM-DD)');
        return;
      }
      parsedDate = new Date(dueDate);
      if (parsedDate < new Date(new Date().setHours(0,0,0,0))) {
        Alert.alert('Lỗi', 'Ngày hết hạn phải từ hôm nay trở đi');
        return;
      }
    }

    if (editMissionId) {
      const payload: UpdateMissionInput = {
        title,
        description: desc,
        rewardPoints: Math.max(1, Number(points) || 30),
        dueDate: parsedDate.toISOString(),
      };
      updateMutation.mutate(payload);
    } else {
      const payload: CreateMissionInput = {
        title,
        description: desc,
        rewardPoints: Math.max(1, Number(points) || 30),
        dueDate: parsedDate.toISOString(),
        childId: childToUse,
        checklist: checklist.filter(c => c.text.trim()).map(c => ({ text: c.text }))
      };
      createMutation.mutate(payload);
    }
  };

  return (
    <View style={L.screen}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>{editMissionId ? 'Sửa nhiệm vụ' : 'Tạo nhiệm vụ'}</Text>
        <View style={styles.back} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">


        <Field label="Tên nhiệm vụ" placeholder="VD: Đánh răng trước khi ngủ" value={title} onChangeText={setTitle} />
        

        <Field label="Mô tả / Lời nhắc" placeholder="Nhập ghi chú cho bé..." value={desc} onChangeText={setDesc} multiline />

        {/* Skill selector */}
        <Text style={styles.sectionLabel}>Kỹ năng phát triển</Text>
        <Text style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>Tính năng Kỹ năng hiện chưa khả dụng.</Text>

        <Field label="Điểm thưởng (XP)" placeholder="VD: 30" value={points} onChangeText={setPoints} keyboardType="numeric" />
        <Field label="Ngày hết hạn" placeholder="YYYY-MM-DD" value={dueDate} onChangeText={setDueDate} />

        {/* Checklist */}
        <Text style={styles.sectionLabel}>Checklist (Các bước bé cần làm)</Text>
        {checklist.map((item, i) => (
          <View key={i} style={styles.checkRow}>
            <Ionicons name="ellipse-outline" size={20} color={C.muted} />
            <TextInput style={styles.checkInput} placeholder={`Bước ${i + 1}`} value={item.text} onChangeText={(t) => updateChecklist(t, i)} />
            {checklist.length > 1 && (
              <Pressable onPress={() => setChecklist(checklist.filter((_, idx) => idx !== i))}>
                <Ionicons name="close-circle" size={20} color={C.redSoft} />
              </Pressable>
            )}
          </View>
        ))}
        <Pressable style={styles.addCheckBtn} onPress={() => setChecklist([...checklist, {text: ''}])}>
          <Ionicons name="add-circle-outline" size={18} color={C.primary} />
          <Text style={styles.addCheckText}>Thêm bước</Text>
        </Pressable>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable style={styles.submitBtn} onPress={handleSave}>
          <Text style={styles.submitBtnText}>{editMissionId ? 'Lưu thay đổi' : 'Phát hành nhiệm vụ'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Field({ label, placeholder, value, onChangeText, multiline, keyboardType }: { label: string, placeholder: string, value: string, onChangeText: (t: string) => void, multiline?: boolean, keyboardType?: KeyboardTypeOptions }) {
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
