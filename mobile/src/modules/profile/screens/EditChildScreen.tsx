import React, { useState, useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Routes } from '@/navigation/constants';
import { kidlifeColors as C } from '@/theme';
import * as childApi from '@/shared/api/childApi';
import * as skillApi from '@/shared/api/skillApi';
import type { Skill } from '@/shared/api/skillApi';
import type { ChildProfile } from '@/shared/api/childApi';

const AVATARS = ['🧒', '👧', '👦', '👶', '🧒🏻', '👧🏻', '👦🏻', '🧒🏽'];

export default function EditChildScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const childId = route.params?.childId;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🧒');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [username, setUsername] = useState('');
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [childRes, skillsRes] = await Promise.all([
          childApi.getChild(childId),
          skillApi.getSkills(),
        ]);
        
        const child: ChildProfile = childRes;
        setName(child.name);
        setBirthYear(child.dateOfBirth ? new Date(child.dateOfBirth).getFullYear().toString() : '');
        setUsername(child.loginUsername || '');
        setSelectedSkills(child.preferredSkills || []);
        setSkills(skillsRes.skills || []);
      } catch (error: any) {
        Alert.alert('Lỗi', error?.message || 'Không thể tải dữ liệu');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    if (childId) {
      fetchData();
    }
  }, [childId, navigation]);

  const toggleSkill = (skillId: string) => {
    setSelectedSkills(prev => prev.includes(skillId) ? prev.filter(s => s !== skillId) : [...prev, skillId]);
  };

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert('Lỗi', 'Vui lòng nhập tên bé'); return; }
    
    setSaving(true);
    try {
      const updateData: any = {
        name: name.trim(),
        preferredSkills: selectedSkills,
      };
      if (birthYear) {
        updateData.dateOfBirth = `${birthYear}-06-15`;
      }
      if (username) {
        updateData.loginUsername = username.trim();
      }

      await childApi.updateChild(childId, updateData);
      Alert.alert('Thành công', `Đã cập nhật hồ sơ bé ${name}!`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Lỗi', error?.message || 'Không thể cập nhật hồ sơ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Xác nhận xóa', `Bạn có chắc muốn xóa hồ sơ bé ${name}?`, [
      { text: 'Hủy', style: 'cancel' },
      { 
        text: 'Xóa', style: 'destructive', onPress: async () => {
          try {
            setSaving(true);
            await childApi.deleteChild(childId);
            navigation.navigate(Routes.Profile.ChildManagement);
          } catch (error: any) {
            Alert.alert('Lỗi', error?.message || 'Không thể xóa hồ sơ');
            setSaving(false);
          }
        }
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Sửa hồ sơ trẻ</Text>
        <Pressable style={styles.deleteBtn} onPress={handleDelete} disabled={saving}>
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
        {skills.map((skill) => (
          <Pressable key={skill._id} style={[styles.skillChip, selectedSkills.includes(skill._id) && styles.skillChipActive]} onPress={() => toggleSkill(skill._id)}>
            <Text style={[styles.skillText, selectedSkills.includes(skill._id) && styles.skillTextActive]}>{skill.name}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={[styles.primaryButton, saving && { opacity: 0.7 }]} onPress={handleSave} disabled={saving}>
        <Text style={styles.buttonText}>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</Text>
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
