import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Routes } from '@/navigation/constants';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';

const MOCK_TEMPLATES = [
  { id: '1', name: 'Hoạt hình 3D vui nhộn', icon: '🎬', description: 'Nhân vật 3D sinh động, màu sắc tươi sáng' },
  { id: '2', name: 'Hoạt hình 2D dễ thương', icon: '🎨', description: 'Phong cách vẽ tay, nhẹ nhàng' },
  { id: '3', name: 'Phong cách cổ tích', icon: '🏰', description: 'Bối cảnh cổ tích, nhân vật thần tiên' },
  { id: '4', name: 'Siêu anh hùng', icon: '🦸', description: 'Nhân vật siêu anh hùng yêu thích của bé' },
];

export default function AIVideoPromptScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const missionTitle = route.params?.missionTitle ?? '';

  const [prompt, setPrompt] = useState(missionTitle ? `Nhiệm vụ: ${missionTitle}. ` : '');
  const [templateId, setTemplateId] = useState('1');

  const handleGenerate = () => {
    navigation.navigate(Routes.Mission.AIVideoStatus, { prompt, templateId });
  };

  return (
    <View style={L.screen}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Tạo Video AI</Text>
        <View style={styles.back} />
      </View>

      <ScrollView contentContainerStyle={L.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.introCard}>
          <Text style={styles.introIcon}>✨</Text>
          <Text style={styles.introTitle}>Tạo video hướng dẫn bé</Text>
          <Text style={styles.introText}>Mô tả nhiệm vụ bằng lời, AI sẽ tự động tạo video hoạt hình vui nhộn để bé dễ hiểu và hào hứng làm theo.</Text>
        </View>

        <Text style={styles.sectionLabel}>Mô tả nhiệm vụ</Text>
        <TextInput
          style={styles.promptInput}
          placeholder="VD: Mẹ muốn con đánh răng lúc 9h tối, có siêu nhân nhện hướng dẫn..."
          placeholderTextColor="#9DA9D8"
          value={prompt}
          onChangeText={setPrompt}
          multiline
        />

        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Chọn phong cách video</Text>
        <View style={styles.templateGrid}>
          {MOCK_TEMPLATES.map((t) => (
            <Pressable key={t.id} style={[styles.templateCard, templateId === t.id && styles.templateActive]} onPress={() => setTemplateId(t.id)}>
              <View style={styles.templateIconWrap}><Text style={{ fontSize: 24 }}>{t.icon}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.templateName}>{t.name}</Text>
                <Text style={styles.templateDesc}>{t.description}</Text>
              </View>
              {templateId === t.id && <Ionicons name="checkmark-circle" size={22} color={C.primary} />}
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable 
          style={[styles.generateBtn, !prompt.trim() && styles.generateBtnDisabled]} 
          onPress={handleGenerate}
          disabled={!prompt.trim()}
        >
          <Ionicons name="sparkles" size={18} color="#FFF" />
          <Text style={styles.generateBtnText}>Tạo Video AI (1 phút)</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 12 },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: '#E4E9FF', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: C.text, fontSize: 17, fontWeight: '800' },
  introCard: { backgroundColor: C.primary, borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 24 },
  introIcon: { fontSize: 40, marginBottom: 8 },
  introTitle: { color: '#FFF', fontSize: 18, fontWeight: '800', marginBottom: 6 },
  introText: { color: '#DCE2FF', fontSize: 13, textAlign: 'center', lineHeight: 20 },
  sectionLabel: { color: '#17328B', fontSize: 14, fontWeight: '800', marginBottom: 12 },
  promptInput: { backgroundColor: '#F0F2FA', borderRadius: 16, padding: 16, color: C.text, fontSize: 14, minHeight: 120, textAlignVertical: 'top' },
  templateGrid: { gap: 12 },
  templateCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F2FA', borderRadius: 16, padding: 14, borderWidth: 2, borderColor: 'transparent' },
  templateActive: { backgroundColor: '#E7EBFF', borderColor: C.primary },
  templateIconWrap: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  templateName: { color: C.text, fontSize: 14, fontWeight: '700', marginBottom: 4 },
  templateDesc: { color: C.muted, fontSize: 11, paddingRight: 10 },
  footer: { padding: 20, paddingBottom: 30, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EEF0F8' },
  generateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 54, borderRadius: 16, backgroundColor: C.primary },
  generateBtnDisabled: { opacity: 0.5 },
  generateBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
});
