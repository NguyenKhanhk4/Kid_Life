import React, { useState, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Routes } from '@/navigation/constants';
import { kidlifeColors as C } from '@/theme';

const MOCK_QUIZZES: Record<string, any> = {
  '1': { title: 'Đánh răng đúng cách', passScore: 3, rewardPoints: 50, questions: [
    { id: '1', content: 'Nên đánh răng mấy lần mỗi ngày?', options: ['1 lần', '2 lần', '3 lần', '4 lần'], correctIndex: 1 },
    { id: '2', content: 'Mỗi lần đánh răng bao lâu?', options: ['30 giây', '1 phút', '2 phút', '5 phút'], correctIndex: 2 },
    { id: '3', content: 'Nên đánh răng khi nào?', options: ['Sau khi ăn', 'Trước khi ăn', 'Sáng và tối', 'Chỉ buổi sáng'], correctIndex: 2 },
    { id: '4', content: 'Dùng bao nhiêu kem đánh răng?', options: ['Thật nhiều', 'Bằng hạt đậu', 'Nửa bàn chải', 'Không cần kem'], correctIndex: 1 },
    { id: '5', content: 'Nên thay bàn chải bao lâu 1 lần?', options: ['1 tháng', '3 tháng', '6 tháng', '1 năm'], correctIndex: 1 },
  ] },
};

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function QuizScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const quizId = route.params?.quizId ?? '1';
  const quiz = MOCK_QUIZZES[quizId] ?? MOCK_QUIZZES['1'];

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(quiz.questions.length).fill(null));
  const [timer, setTimer] = useState(30);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const question = quiz.questions[currentQ];
  const isLast = currentQ === quiz.questions.length - 1;

  useEffect(() => {
    Animated.timing(progressAnim, { toValue: (currentQ + 1) / quiz.questions.length, duration: 300, useNativeDriver: false }).start();
  }, [currentQ]);

  useEffect(() => {
    setTimer(30);
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) { clearInterval(interval); handleNext(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentQ]);

  const handleSelect = (index: number) => {
    setSelected(index);
    const newAnswers = [...answers];
    newAnswers[currentQ] = index;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isLast) {
      const finalAnswers = [...answers];
      if (selected !== null) finalAnswers[currentQ] = selected;
      const score = finalAnswers.reduce<number>((acc, ans, i) => acc + (ans === quiz.questions[i].correctIndex ? 1 : 0), 0);
      const passed = score >= quiz.passScore;
      navigation.replace(Routes.Quiz.Result, {
        score, total: quiz.questions.length, passed, pointsAwarded: passed ? quiz.rewardPoints : 0, quizId,
      });
    } else {
      setCurrentQ(currentQ + 1);
      setSelected(null);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={20} color={C.primary} />
        </Pressable>
        <View style={styles.progressWrap}>
          <Animated.View style={[styles.progressFill, { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
        </View>
        <View style={styles.timerBadge}>
          <Ionicons name="time-outline" size={14} color={timer <= 10 ? C.red : C.muted} />
          <Text style={[styles.timerText, timer <= 10 && { color: C.red }]}>{timer}s</Text>
        </View>
      </View>

      <Text style={styles.qCounter}>Câu {currentQ + 1}/{quiz.questions.length}</Text>
      <Text style={styles.qContent}>{question.content}</Text>

      <View style={styles.options}>
        {question.options.map((opt: string, i: number) => (
          <Pressable key={i} style={[styles.optionCard, selected === i && styles.optionSelected]} onPress={() => handleSelect(i)}>
            <View style={[styles.optionLabel, selected === i && styles.optionLabelSelected]}>
              <Text style={[styles.optionLabelText, selected === i && styles.optionLabelTextSelected]}>{OPTION_LABELS[i]}</Text>
            </View>
            <Text style={[styles.optionText, selected === i && styles.optionTextSelected]}>{opt}</Text>
            {selected === i && <Ionicons name="checkmark-circle" size={22} color={C.primary} />}
          </Pressable>
        ))}
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[styles.nextBtn, selected === null && styles.nextBtnDisabled]}
          onPress={handleNext}
          disabled={selected === null}
        >
          <Text style={styles.nextBtnText}>{isLast ? 'Nộp bài' : 'Tiếp theo'}</Text>
          <Ionicons name={isLast ? 'checkmark' : 'arrow-forward'} size={18} color="#FFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F7FF', paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 50, paddingBottom: 20 },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: '#E4E9FF', alignItems: 'center', justifyContent: 'center' },
  progressWrap: { flex: 1, height: 8, borderRadius: 4, backgroundColor: '#E7EBFF', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4, backgroundColor: C.primary },
  timerBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#E7EBFF', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 },
  timerText: { color: C.muted, fontSize: 13, fontWeight: '700' },
  qCounter: { color: C.primary, fontSize: 13, fontWeight: '700', marginBottom: 8 },
  qContent: { color: C.text, fontSize: 20, fontWeight: '800', lineHeight: 28, marginBottom: 28 },
  options: { gap: 12 },
  optionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, padding: 16, borderWidth: 2, borderColor: 'transparent', gap: 12 },
  optionSelected: { borderColor: C.primary, backgroundColor: C.primarySoft },
  optionLabel: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#E7EBFF', alignItems: 'center', justifyContent: 'center' },
  optionLabelSelected: { backgroundColor: C.primary },
  optionLabelText: { color: C.muted, fontSize: 14, fontWeight: '800' },
  optionLabelTextSelected: { color: '#FFF' },
  optionText: { flex: 1, color: C.text, fontSize: 14, fontWeight: '600' },
  optionTextSelected: { color: C.primary },
  footer: { marginTop: 'auto', paddingBottom: 30, paddingTop: 20 },
  nextBtn: { height: 53, borderRadius: 28, backgroundColor: C.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  nextBtnDisabled: { opacity: 0.4 },
  nextBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
});
