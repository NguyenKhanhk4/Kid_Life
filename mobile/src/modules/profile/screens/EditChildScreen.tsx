import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { kidlifeColors as C } from '@/theme';

const SKILLS = ['Vệ sinh', 'Tự lập', 'Giao tiếp', 'Cảm xúc', 'Sáng tạo', 'Lễ phép', 'An toàn'];
const AVATARS = ['🧒', '👧', '👦', '👶', '🧒🏻', '👧🏻', '👦🏻', '🧒🏽'];

const MOCK_DATA: Record<string, any> = {
  '1': { name: 'Minh Anh', birthYear: '2019', avatar: '🧒', skills: ['Tự lập', 'Vệ sinh'], username: 'minhanh' },
  '2': { name: 'Thảo My', birthYear: '2021', avatar: '👧', skills: ['Giao tiếp', 'Cảm xúc'], username: 'thaomy' },
  '3': { name: 'Nhật Linh', birthYear: '2017', avatar: '👦', skills: ['Sáng tạo', 'Tự lập'], username: 'nhatlinh' },
};

export default function EditChildScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const childId = route.params?.childId ?? '1';
  const data = MOCK_DATA[childId] ?? MOCK_DATA['1'];

  const [name, setName] = useState(data.name);
  const [birthYear, setBirthYear] = useState(data.birthYear);
  const [selectedAvatar, setSelectedAvatar] = useState(data.avatar);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(data.skills);
  const [username, setUsername] = useState(data.username);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const handleSave = () => {
    Alert.alert('Thành công', `Đã cập nhật hồ sơ bé ${name}!`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const handleDelete = () => {
    Alert.alert('Xác nhận xóa', `Bạn có chắc muốn xóa hồ sơ bé ${name}?`, [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Sửa hồ sơ trẻ</Text>
        <Pressable style={styles.deleteBtn} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color={C.red} />
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Chọn avatar</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.avatarRow}>
        {AVATARS.map((av) => (
          <Pressable key={av} style={[styles.avatarItem, selectedAvatar === av && styles.avatarSelected]} onPress={() => setSelectedAvatar(av)}>
            <Text style={styles.avatarEmoji}>{av}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Field icon="person-outline" label="Tên bé" placeholder="Nhập tên bé..." value={name} onChangeText={setName} />
      <Field icon="calendar-outline" label="Năm sinh" placeholder="VD: 2019" value={birthYear} onChangeText={setBirthYear} keyboardType="numeric" />
      <Field icon="person-circle-outline" label="Tên đăng nhập" placeholder="username..." value={username} onChangeText={setUsername} />

      <Text style={styles.sectionTitle}>Kỹ năng ưu tiên</Text>
      <View style={styles.skillGrid}>
        {SKILLS.map((skill) => (
          <Pressable key={skill} style={[styles.skillChip, selectedSkills.includes(skill) && styles.skillChipActive]} onPress={() => toggleSkill(skill)}>
            <Text style={[styles.skillText, selectedSkills.includes(skill) && styles.skillTextActive]}>{skill}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.primaryButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Lưu thay đổi</Text>
      </Pressable>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function Field({ icon, label, placeholder, value, onChangeText, secureTextEntry, keyboardType }: any) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.field}>
        <Ionicons name={icon} size={18} color={C.primary} />
        <TextInput style={styles.input} placeholder={placeholder} placeholderTextColor="#9DA9D8" value={value} onChangeText={onChangeText} secureTextEntry={secureTextEntry} keyboardType={keyboardType} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F7FF' },
  content: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, marginBottom: 20 },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: '#E4E9FF', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: C.text, fontSize: 17, fontWeight: '800' },
  deleteBtn: { width: 42, height: 42, borderRadius: 22, backgroundColor: C.redSoft, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { color: C.text, fontSize: 14, fontWeight: '700', marginBottom: 10, marginTop: 10 },
  avatarRow: { gap: 10, paddingBottom: 15 },
  avatarItem: { width: 56, height: 56, borderRadius: 18, backgroundColor: '#E7EBFF', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' },
  avatarSelected: { borderColor: C.primary, backgroundColor: C.primarySoft },
  avatarEmoji: { fontSize: 28 },
  fieldWrap: { marginBottom: 13 },
  label: { color: '#17328B', fontSize: 12, fontWeight: '800', marginBottom: 6 },
  field: { height: 47, borderRadius: 15, backgroundColor: '#E7EBFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 },
  input: { flex: 1, color: C.text, fontSize: 12, marginLeft: 9 },
  skillGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 25 },
  skillChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#E7EBFF' },
  skillChipActive: { backgroundColor: C.primary },
  skillText: { color: C.muted, fontSize: 12, fontWeight: '600' },
  skillTextActive: { color: '#FFF' },
  primaryButton: { height: 53, borderRadius: 28, backgroundColor: '#2445FF', alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#FFF', fontSize: 13, fontWeight: '900' },
});
