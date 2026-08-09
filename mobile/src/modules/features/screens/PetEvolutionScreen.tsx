import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
import { useAppSelector } from '@/shared/store';
import { usePet, useFeedPet } from '@/shared/hooks/apiHooks';
import { AppStackParamList } from '@/navigation/types';

type EvoStage = {
  level: number;
  name: string;
  emoji: string;
  xpRequired: number;
};

const evolutionStages: EvoStage[] = [
  { level: 1, name: 'Trứng rồng', emoji: '🥚', xpRequired: 0 },
  { level: 2, name: 'Rồng con', emoji: '🐉', xpRequired: 500 },
  { level: 3, name: 'Rồng thiếu niên', emoji: '🐲', xpRequired: 1500 },
  { level: 4, name: 'Rồng lửa', emoji: '🔥', xpRequired: 3000 },
  { level: 5, name: 'Rồng huyền thoại', emoji: '⚡', xpRequired: 5000 },
];

const streakHistory = [
  { day: 1, done: true },
  { day: 2, done: true },
  { day: 3, done: true },
  { day: 4, done: true },
  { day: 5, done: true },
  { day: 6, done: true },
  { day: 7, done: true },
  { day: 8, done: true },
  { day: 9, done: true },
  { day: 10, done: true },
  { day: 11, done: true },
  { day: 12, done: false },
  { day: 13, done: false },
  { day: 14, done: false },
];

export default function PetEvolutionScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { child } = useAppSelector((state) => state.kidlife);

  const {
    data: petData,
    isLoading,
    isError,
    refetch,
  } = usePet(child?.id || '');
  const { mutate: feedPet, isPending: isFeeding } = useFeedPet();

  // Local UI state for demo features
  const [streak, setStreak] = useState(11);
  const [showEvoDetail, setShowEvoDetail] = useState(false);

  const currentXP = petData?.xp || 0;
  const currentLevel = petData?.level || 1;
  const mood = petData?.mood?.toLowerCase() || 'normal';

  // Convert API level (1-indexed) to stages array index (0-indexed)
  const currentStage = Math.max(
    0,
    Math.min(currentLevel - 1, evolutionStages.length - 1),
  );
  const stage = evolutionStages[currentStage];
  const nextStage = evolutionStages[currentStage + 1];
  const xpToNext = nextStage ? nextStage.xpRequired - currentXP : 0;
  const progress = nextStage
    ? ((currentXP - stage.xpRequired) /
        (nextStage.xpRequired - stage.xpRequired)) *
      100
    : 100;

  const isFedToday = () => {
    if (!petData?.lastFedAt) return false;
    const lastFed = new Date(petData.lastFedAt);
    const today = new Date();
    return lastFed.toDateString() === today.toDateString();
  };

  const fed = isFedToday();

  const handleFeed = () => {
    if (fed || isFeeding || !child?.id) return;
    feedPet(child.id, {
      onSuccess: () => {
        Alert.alert(
          '🍖 Cho ăn thành công!',
          'Rồng con đã được cho ăn!\n\nHãy giữ streak 14 ngày để tiến hóa!',
        );
      },
      onError: (err: unknown) => {
        const msg =
          err instanceof Error ? err.message : 'Không thể cho ăn lúc này';
        Alert.alert('Lỗi', msg);
      },
    });
  };

  const handleSimulateSick = () => {
    Alert.alert(
      'Chức năng demo',
      'Đã chuyển sang API thật, demo mood tạm khóa.',
    );
  };

  const handleSimulateEvolve = () => {
    Alert.alert(
      'Chức năng demo',
      'Đã chuyển sang API thật, demo tiến hóa tạm khóa.',
    );
  };

  if (isLoading) {
    return (
      <View
        style={[L.screen, { justifyContent: 'center', alignItems: 'center' }]}
      >
        <Text style={{ color: C.text }}>Đang tải thú cưng...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={[L.screen, { justifyContent: 'center', alignItems: 'center' }]}
      >
        <Text style={{ color: C.text, marginBottom: 10 }}>
          Lỗi tải dữ liệu thú cưng
        </Text>
        <Pressable
          onPress={() => refetch()}
          style={{ padding: 10, backgroundColor: C.primary, borderRadius: 8 }}
        >
          <Text style={{ color: '#FFF' }}>Thử lại</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={L.screen}
      contentContainerStyle={[L.content, { paddingTop: 50 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.overline}>TIẾN HÓA THÚ CƯNG</Text>
          <Text style={styles.title}>Pet Evolution 🐉</Text>
        </View>
        <View style={styles.premiumBadge}>
          <Ionicons name="diamond" size={12} color="#8E54E9" />
          <Text style={styles.premiumText}>Premium</Text>
        </View>
      </View>

      {/* Pet Display Card */}
      <View style={styles.petCard}>
        <View style={styles.petSky}>
          <View style={styles.cloud1} />
          <View style={styles.cloud2} />
          <Text style={styles.petEmoji}>{stage.emoji}</Text>
          <View style={styles.petShadow} />
          {mood === 'sick' && (
            <Text style={styles.sickBubble}>😷 Ốm rồi...</Text>
          )}
          {mood === 'happy' && (
            <Text style={styles.happyBubble}>😄 No rồi!</Text>
          )}
        </View>
        <View style={styles.petInfo}>
          <View style={styles.petNameRow}>
            <Text style={styles.petName}>{stage.name}</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>CẤP {stage.level}</Text>
            </View>
          </View>
          <View style={styles.moodRow}>
            <Text style={styles.moodLabel}>Tâm trạng:</Text>
            <Text style={styles.moodValue}>
              {mood === 'happy'
                ? '😄 Vui vẻ'
                : mood === 'sick'
                  ? '😷 Bị ốm'
                  : '😐 Bình thường'}
            </Text>
          </View>
          <View style={styles.xpRow}>
            <Text style={styles.xpLabel}>XP: {currentXP.toLocaleString()}</Text>
            {nextStage && (
              <Text style={styles.xpToNext}>Còn {xpToNext} XP để tiến hóa</Text>
            )}
          </View>
          <View style={styles.xpBar}>
            <View
              style={[styles.xpFill, { width: `${Math.min(progress, 100)}%` }]}
            />
          </View>

          <Pressable
            style={[
              styles.feedBtn,
              fed && styles.feedBtnDone,
              mood === 'sick' && styles.feedBtnSick,
            ]}
            onPress={handleFeed}
            disabled={isFeeding}
          >
            <Ionicons
              name={fed ? 'checkmark-circle' : 'restaurant'}
              size={20}
              color={fed ? C.green : '#FFF'}
            />
            <Text style={[styles.feedBtnText, fed && { color: C.green }]}>
              {isFeeding
                ? 'Đang cho ăn...'
                : fed
                  ? 'Đã cho ăn hôm nay'
                  : 'Cho rồng ăn (30 XP)'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Streak Tracker */}
      <View style={styles.sectionRow}>
        <Text style={L.sectionTitle}>Chuỗi ngày (Streak)</Text>
        <View style={styles.streakBadge}>
          <Text style={styles.streakIcon}>🔥</Text>
          <Text style={styles.streakNum}>{streak}</Text>
          <Text style={styles.streakLabel}>ngày</Text>
        </View>
      </View>
      <Text style={styles.streakHint}>
        Giữ streak 14 ngày liên tiếp để tiến hóa! ({streak}/14)
      </Text>

      <View style={styles.streakGrid}>
        {streakHistory.map((day) => (
          <View
            key={day.day}
            style={[
              styles.streakDay,
              day.done
                ? styles.streakDone
                : day.day <= 14
                  ? styles.streakPending
                  : null,
            ]}
          >
            <Text
              style={[
                styles.streakDayText,
                day.done && styles.streakDayTextDone,
              ]}
            >
              {day.day}
            </Text>
            {day.done && <Ionicons name="checkmark" size={10} color="#FFF" />}
          </View>
        ))}
      </View>

      {/* Evolution Timeline */}
      <Text style={L.sectionTitle}>Quá trình Tiến hóa</Text>
      <View style={styles.evoCard}>
        <View style={styles.evoTimeline}>
          {evolutionStages.map((evo, i) => {
            const isReached = i <= currentStage;
            const isCurrent = i === currentStage;
            return (
              <View key={evo.level} style={styles.evoStep}>
                <View style={styles.evoLeft}>
                  <View
                    style={[
                      styles.evoDot,
                      isReached && styles.evoDotReached,
                      isCurrent && styles.evoDotCurrent,
                    ]}
                  >
                    <Text style={styles.evoDotEmoji}>{evo.emoji}</Text>
                  </View>
                  {i < evolutionStages.length - 1 && (
                    <View
                      style={[
                        styles.evoLine,
                        isReached && styles.evoLineReached,
                      ]}
                    />
                  )}
                </View>
                <View style={styles.evoRight}>
                  <Text
                    style={[styles.evoName, isCurrent && styles.evoNameCurrent]}
                  >
                    {evo.name} {isCurrent && '← Hiện tại'}
                  </Text>
                  <Text style={styles.evoXP}>Cần {evo.xpRequired} XP</Text>
                  {!isReached && (
                    <Text style={styles.evoLocked}>🔒 Chưa mở khóa</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Demo Controls Disabled */}
      <Text style={L.sectionTitle}>⚙️ Demo Controls</Text>
      <Text style={styles.demoHint}>Đã chuyển sang API thật</Text>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  back: {
    width: 42,
    height: 42,
    borderRadius: 22,
    backgroundColor: C.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overline: {
    color: '#FDCB6E',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  title: { color: C.text, fontSize: 24, fontWeight: '800', marginTop: 3 },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0E9FF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  premiumText: { color: '#8E54E9', fontSize: 11, fontWeight: '800' },
  petCard: { ...L.card, overflow: 'hidden', marginBottom: 20 },
  petSky: {
    height: 220,
    backgroundColor: '#BFD6FF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cloud1: {
    position: 'absolute',
    width: 120,
    height: 42,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.65)',
    top: 30,
    left: -30,
  },
  cloud2: {
    position: 'absolute',
    width: 100,
    height: 36,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.5)',
    top: 80,
    right: -25,
  },
  petEmoji: { fontSize: 100, zIndex: 2 },
  petShadow: {
    width: 110,
    height: 22,
    borderRadius: 50,
    backgroundColor: 'rgba(48,76,155,0.2)',
    position: 'absolute',
    bottom: 24,
  },
  sickBubble: {
    position: 'absolute',
    top: 35,
    right: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
  },
  happyBubble: {
    position: 'absolute',
    top: 35,
    right: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
  },
  petInfo: { padding: 18 },
  petNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  petName: { color: C.text, fontSize: 20, fontWeight: '800' },
  levelBadge: {
    backgroundColor: C.orangeSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  levelText: { color: C.orange, fontSize: 11, fontWeight: '800' },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  moodLabel: { color: C.muted, fontSize: 12 },
  moodValue: { color: C.text, fontSize: 13, fontWeight: '700' },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  xpLabel: { color: C.primary, fontSize: 13, fontWeight: '800' },
  xpToNext: { color: C.muted, fontSize: 11 },
  xpBar: {
    height: 10,
    backgroundColor: '#EFF1F7',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 16,
  },
  xpFill: { height: '100%', backgroundColor: C.primary, borderRadius: 5 },
  feedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: C.primary,
    borderRadius: 14,
    height: 50,
  },
  feedBtnDone: { backgroundColor: C.greenSoft },
  feedBtnSick: { backgroundColor: C.red },
  feedBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: C.orangeSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  streakIcon: { fontSize: 14 },
  streakNum: { color: C.orange, fontSize: 16, fontWeight: '800' },
  streakLabel: { color: '#B36A00', fontSize: 10 },
  streakHint: { color: C.muted, fontSize: 12, marginBottom: 12 },
  streakGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 22,
  },
  streakDay: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EFF1F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakDone: { backgroundColor: C.green },
  streakPending: {
    borderWidth: 1,
    borderColor: C.border,
    borderStyle: 'dashed',
  },
  streakDayText: { color: C.muted, fontSize: 11, fontWeight: '700' },
  streakDayTextDone: { color: '#FFF' },
  evoCard: { ...L.card, padding: 18, marginBottom: 22 },
  evoTimeline: {},
  evoStep: { flexDirection: 'row', minHeight: 60 },
  evoLeft: { width: 50, alignItems: 'center' },
  evoDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF1F7',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  evoDotReached: { backgroundColor: C.primarySoft },
  evoDotCurrent: {
    backgroundColor: C.primary,
    borderWidth: 3,
    borderColor: '#B8C4FF',
  },
  evoDotEmoji: { fontSize: 20 },
  evoLine: { width: 3, flex: 1, backgroundColor: '#EFF1F7', marginVertical: 2 },
  evoLineReached: { backgroundColor: C.primary },
  evoRight: { flex: 1, paddingLeft: 12, paddingBottom: 16 },
  evoName: { color: C.text, fontSize: 14, fontWeight: '700' },
  evoNameCurrent: { color: C.primary, fontWeight: '800' },
  evoXP: { color: C.muted, fontSize: 11, marginTop: 3 },
  evoLocked: { color: C.muted, fontSize: 10, marginTop: 2 },
  demoHint: { color: C.muted, fontSize: 11, marginBottom: 10 },
  demoRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  demoBtn: {
    flex: 1,
    backgroundColor: C.primarySoft,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  demoBtnDanger: { backgroundColor: C.redSoft },
  demoBtnText: { color: C.text, fontSize: 12, fontWeight: '700' },
});
