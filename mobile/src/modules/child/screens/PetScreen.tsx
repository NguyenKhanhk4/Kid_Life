import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
import WardrobeScreen from './WardrobeScreen';

type EvoStage = { level: number; name: string; emoji: string; xpRequired: number };

const evolutionStages: EvoStage[] = [
  { level: 1, name: 'Trứng rồng', emoji: '🥚', xpRequired: 0 },
  { level: 2, name: 'Rồng con', emoji: '🐉', xpRequired: 500 },
  { level: 3, name: 'Rồng lửa', emoji: '🐲', xpRequired: 1500 },
  { level: 4, name: 'Rồng siêu cấp', emoji: '🔥', xpRequired: 3000 },
  { level: 5, name: 'Rồng huyền thoại', emoji: '⚡', xpRequired: 5000 },
];

const streakDays = [
  { day: 1, done: true }, { day: 2, done: true }, { day: 3, done: true }, { day: 4, done: true },
  { day: 5, done: true }, { day: 6, done: true }, { day: 7, done: true }, { day: 8, done: true },
  { day: 9, done: true }, { day: 10, done: true }, { day: 11, done: true }, { day: 12, done: false },
  { day: 13, done: false }, { day: 14, done: false },
];

export default function PetScreen() {
  const navigation = useNavigation<any>();
  const [currentXP, setCurrentXP] = useState(1200);
  const [stageIndex, setStageIndex] = useState(1); // Rồng con
  const [streak] = useState(11);
  const [fed, setFed] = useState(false);
  const [mood, setMood] = useState<'happy' | 'normal' | 'sick'>('normal');
  const [wardrobe, setWardrobe] = useState(false);

  if (wardrobe) return <WardrobeScreen onBack={() => setWardrobe(false)} />;

  const stage = evolutionStages[stageIndex];
  const nextStage = evolutionStages[stageIndex + 1];
  const progress = nextStage ? ((currentXP - stage.xpRequired) / (nextStage.xpRequired - stage.xpRequired)) * 100 : 100;

  const handleFeed = () => {
    if (fed) return;
    setFed(true);
    setMood('happy');
    setCurrentXP((prev) => prev + 30);
    Alert.alert('🍖 Cho ăn thành công!', 'Rồng con no bụng và rất vui! +30 XP\n\nGiữ streak 14 ngày làm việc nhà để rồng tiến hóa!');
  };

  const handleEvolveDemo = () => {
    if (stageIndex < evolutionStages.length - 1) {
      setStageIndex((prev) => prev + 1);
      Alert.alert('🎊 TIẾN HÓA THÀNH CÔNG!', `Thú cưng của bé đã tiến hóa thành ${evolutionStages[stageIndex + 1].name} ${evolutionStages[stageIndex + 1].emoji}! 🎉`);
    }
  };

  return (
    <ScrollView style={L.screen} contentContainerStyle={L.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.heading}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.overline}>THÚ CƯNG CỦA MÌNH</Text>
          <Text style={styles.title}>{stage.name} {stage.emoji}</Text>
        </View>
        <View style={styles.levelPill}><Text style={styles.levelText}>CẤP {stage.level}</Text></View>
      </View>

      {/* Pet Sky Card */}
      <View style={styles.petCard}>
        <View style={styles.sky}>
          <View style={styles.cloudOne} />
          <View style={styles.cloudTwo} />
          <Text style={styles.pet}>{stage.emoji}</Text>
          <View style={styles.shadow} />
          <View style={styles.speech}>
            <Text style={styles.speechText}>
              {fed ? 'No quá rồiiii! 😄' : mood === 'sick' ? 'Tớ bị ốm rồi... 😷' : 'Tớ đói bụng rồii 😋'}
            </Text>
          </View>
        </View>

        <View style={styles.petInfo}>
          <View style={styles.infoLine}>
            <Text style={styles.infoLabel}>Tâm trạng</Text>
            <View style={styles.mood}>
              <Text style={styles.moodEmoji}>{fed ? '😄' : mood === 'sick' ? '😷' : '😋'}</Text>
              <Text style={styles.moodText}>{fed ? 'Vui vẻ' : mood === 'sick' ? 'Bị ốm' : 'Đói bụng'}</Text>
            </View>
          </View>

          <View style={styles.infoLine}>
            <Text style={styles.infoLabel}>Năng lượng</Text>
            <View style={styles.energyTrack}>
              <View style={[styles.energyFill, { width: fed ? '88%' : '35%' }]} />
            </View>
            <Text style={styles.energyText}>{fed ? '88%' : '35%'}</Text>
          </View>

          <Pressable style={[styles.feedButton, fed && styles.feedButtonDone]} onPress={handleFeed}>
            <Ionicons name={fed ? 'checkmark-circle' : 'restaurant'} size={20} color={fed ? C.green : '#FFF'} />
            <Text style={[styles.feedText, fed && { color: C.green }]}>
              {fed ? 'Đã cho ăn hôm nay' : 'Cho rồng ăn (30 XP)'}
            </Text>
          </Pressable>
        </View>
      </View>

      <Pressable style={styles.wardrobeButton} onPress={() => setWardrobe(true)}>
        <Ionicons name="shirt-outline" size={18} color={C.primary} />
        <Text style={styles.wardrobeText}>Tủ đồ của {stage.name}</Text>
        <Ionicons name="chevron-forward" size={17} color={C.primary} />
      </Pressable>

      {/* 14-Day Streak Evolution Section */}
      <View style={styles.sectionHeader}>
        <Text style={L.sectionTitle}>Chuỗi ngày Tiến hóa (Streak)</Text>
        <View style={styles.streakBadge}>
          <Text style={styles.streakIcon}>🔥</Text>
          <Text style={styles.streakNum}>{streak}/14</Text>
        </View>
      </View>
      <Text style={styles.streakHint}>Bé cần giữ chuỗi 14 ngày làm việc nhà không đứt đoạn để tiến hóa!</Text>

      <View style={styles.streakGrid}>
        {streakDays.map((item) => (
          <View key={item.day} style={[styles.streakBox, item.done && styles.streakDone]}>
            <Text style={[styles.streakDayNum, item.done && styles.streakDayTextDone]}>{item.day}</Text>
            {item.done && <Ionicons name="checkmark" size={10} color="#FFF" />}
          </View>
        ))}
      </View>

      {/* Evolution Stages Timeline */}
      <View style={styles.sectionHeader}>
        <Text style={L.sectionTitle}>Tiến trình nâng cấp</Text>
        <Text style={styles.smallText}>{currentXP.toLocaleString()} / {nextStage ? nextStage.xpRequired.toLocaleString() : 5000} XP</Text>
      </View>

      <View style={styles.evolutionCard}>
        <View style={styles.evoTop}>
          <Text style={styles.evoLevel}>Giai đoạn: {stage.name}</Text>
          {nextStage && <Text style={styles.evoNext}>Còn {nextStage.xpRequired - currentXP} XP để tiến hóa</Text>}
        </View>
        <View style={styles.evoTrack}>
          <View style={[styles.evoFill, { width: `${Math.min(progress, 100)}%` }]} />
        </View>

        <View style={styles.evoBadges}>
          {evolutionStages.slice(0, 4).map((item, idx) => {
            const isUnlocked = idx <= stageIndex;
            return (
              <React.Fragment key={item.level}>
                <Pressable onPress={() => isUnlocked && idx > stageIndex && handleEvolveDemo()}>
                  <View style={!isUnlocked ? styles.locked : null}>
                    <Text style={styles.evoEmoji}>{item.emoji}</Text>
                    <Text style={styles.evoCaption}>{item.name}</Text>
                  </View>
                </Pressable>
                {idx < 3 && <Text style={styles.evoLine}>—</Text>}
              </React.Fragment>
            );
          })}
        </View>

        <Pressable style={styles.demoEvolveBtn} onPress={handleEvolveDemo}>
          <Ionicons name="sparkles" size={16} color={C.primary} />
          <Text style={styles.demoEvolveText}>Chạm để Demo Tiến Hóa ✨</Text>
        </Pressable>
      </View>

      {/* Recent Activity */}
      <View style={styles.sectionHeader}>
        <Text style={L.sectionTitle}>Hoạt động gần đây</Text>
      </View>

      <View style={styles.activityCard}>
        {[
          ['🧼', 'Bé dọn dẹp đồ chơi', 'Rồng con vui +10 năng lượng'],
          ['⭐', 'Nhận 30 XP', 'Từ việc tự gấp quần áo'],
          ['🍎', 'Được cho ăn', 'Hôm nay, 19:30'],
        ].map(([icon, title, desc]) => (
          <View key={title} style={styles.activity}>
            <Text style={styles.activityIcon}>{icon}</Text>
            <View>
              <Text style={styles.activityTitle}>{title}</Text>
              <Text style={styles.activityDesc}>{desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, marginBottom: 18 },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: '#E4E9FF', alignItems: 'center', justifyContent: 'center' },
  overline: { color: C.orange, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: C.text, fontSize: 26, fontWeight: '800', marginTop: 3 },
  levelPill: { backgroundColor: C.primarySoft, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  levelText: { color: C.primary, fontSize: 11, fontWeight: '800' },
  petCard: { ...L.card, overflow: 'hidden', marginBottom: 20 },
  sky: { height: 230, backgroundColor: '#BFD6FF', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  cloudOne: { position: 'absolute', width: 125, height: 46, borderRadius: 30, backgroundColor: 'rgba(255,255,255,.7)', top: 37, left: -38 },
  cloudTwo: { position: 'absolute', width: 105, height: 38, borderRadius: 25, backgroundColor: 'rgba(255,255,255,.58)', top: 98, right: -30 },
  pet: { fontSize: 100, zIndex: 2, marginTop: 10 },
  shadow: { width: 120, height: 22, borderRadius: 50, backgroundColor: 'rgba(48,76,155,.2)', position: 'absolute', bottom: 22 },
  speech: { position: 'absolute', top: 30, right: 20, backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 7 },
  speechText: { color: C.text, fontSize: 11, fontWeight: '700' },
  petInfo: { padding: 18 },
  infoLine: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  infoLabel: { color: C.muted, fontSize: 12, width: 82 },
  mood: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  moodEmoji: { fontSize: 18 },
  moodText: { color: C.text, fontSize: 13, fontWeight: '700' },
  energyTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: '#EFF1F7', overflow: 'hidden' },
  energyFill: { height: '100%', borderRadius: 4, backgroundColor: C.lime },
  energyText: { color: C.text, fontSize: 11, fontWeight: '800', marginLeft: 8 },
  feedButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, backgroundColor: C.primary, borderRadius: 13, height: 48 },
  feedButtonDone: { backgroundColor: C.greenSoft },
  feedText: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  wardrobeButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.primarySoft, borderRadius: 13, paddingHorizontal: 14, height: 47, marginBottom: 20 },
  wardrobeText: { color: C.primary, fontSize: 12, fontWeight: '800', flex: 1 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  smallText: { color: C.muted, fontSize: 11 },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.orangeSoft, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  streakIcon: { fontSize: 13 },
  streakNum: { color: C.orange, fontSize: 13, fontWeight: '800' },
  streakHint: { color: C.muted, fontSize: 11, marginBottom: 10 },
  streakGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 20 },
  streakBox: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#EFF1F7', alignItems: 'center', justifyContent: 'center' },
  streakDone: { backgroundColor: C.green },
  streakDayNum: { color: C.muted, fontSize: 11, fontWeight: '700' },
  streakDayTextDone: { color: '#FFF' },
  evolutionCard: { ...L.card, padding: 16, marginBottom: 20 },
  evoTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  evoLevel: { color: C.primary, fontSize: 13, fontWeight: '800' },
  evoNext: { color: C.muted, fontSize: 11 },
  evoTrack: { height: 9, borderRadius: 5, backgroundColor: '#EFF1F7', overflow: 'hidden' },
  evoFill: { height: '100%', borderRadius: 5, backgroundColor: C.primary },
  evoBadges: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
  evoEmoji: { fontSize: 26, textAlign: 'center' },
  evoCaption: { color: C.muted, fontSize: 9, textAlign: 'center', marginTop: 4 },
  evoLine: { color: '#C7CDDF', fontSize: 14 },
  locked: { opacity: 0.35 },
  demoEvolveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: C.primarySoft, borderRadius: 10, paddingVertical: 10, marginTop: 14 },
  demoEvolveText: { color: C.primary, fontSize: 12, fontWeight: '800' },
  activityCard: { ...L.card, paddingHorizontal: 15 },
  activity: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  activityIcon: { fontSize: 22, marginRight: 12 },
  activityTitle: { color: C.text, fontSize: 12, fontWeight: '700' },
  activityDesc: { color: C.muted, fontSize: 11, marginTop: 3 },
});
