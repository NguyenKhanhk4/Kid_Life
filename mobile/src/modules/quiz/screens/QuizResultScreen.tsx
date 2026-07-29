import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Routes } from '@/navigation/constants';
import { kidlifeColors as C } from '@/theme';
import { claimQuizReward, useAppDispatch } from '@/shared/store';

const MOCK_ANSWERS: Record<string, any[]> = {
  '1': [
    { content: 'Nên đánh răng mấy lần mỗi ngày?', options: ['1 lần', '2 lần', '3 lần', '4 lần'], correctIndex: 1 },
    { content: 'Mỗi lần đánh răng bao lâu?', options: ['30 giây', '1 phút', '2 phút', '5 phút'], correctIndex: 2 },
    { content: 'Nên đánh răng khi nào?', options: ['Sau khi ăn', 'Trước khi ăn', 'Sáng và tối', 'Chỉ buổi sáng'], correctIndex: 2 },
    { content: 'Dùng bao nhiêu kem đánh răng?', options: ['Thật nhiều', 'Bằng hạt đậu', 'Nửa bàn chải', 'Không cần kem'], correctIndex: 1 },
    { content: 'Nên thay bàn chải bao lâu 1 lần?', options: ['1 tháng', '3 tháng', '6 tháng', '1 năm'], correctIndex: 1 },
  ],
};

export default function QuizResultScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const route = useRoute<any>();
  const { score = 4, total = 5, passed = true, pointsAwarded = 50, quizId = '1' } = route.params ?? {};

  const questions = MOCK_ANSWERS[quizId] ?? MOCK_ANSWERS['1'];
  useEffect(() => {
    if (passed && pointsAwarded > 0) {
      dispatch(claimQuizReward({ quizId, amount: pointsAwarded }));
    }
  }, [dispatch, passed, pointsAwarded, quizId]);
  // Mock user answers (simulate some wrong ones)
  const mockUserAnswers = questions.map((q: any, i: number) => i < score ? q.correctIndex : (q.correctIndex + 1) % 4);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Result header */}
        <View style={styles.resultHeader}>
          <View style={[styles.resultCircle, passed ? styles.resultPassed : styles.resultFailed]}>
            <Text style={styles.resultScore}>{score}/{total}</Text>
            <Text style={styles.resultLabel}>câu đúng</Text>
          </View>
          <View style={[styles.resultBadge, passed ? styles.badgePassed : styles.badgeFailed]}>
            <Ionicons name={passed ? 'trophy' : 'refresh'} size={18} color={passed ? '#B36A00' : C.red} />
            <Text style={[styles.resultBadgeText, { color: passed ? '#B36A00' : C.red }]}>
              {passed ? 'Xuất sắc!' : 'Chưa đạt'}
            </Text>
          </View>
          {pointsAwarded > 0 && (
            <View style={styles.xpAward}>
              <Ionicons name="star" size={16} color={C.orange} />
              <Text style={styles.xpAwardText}>+{pointsAwarded} XP</Text>
            </View>
          )}
        </View>

        {/* Review answers */}
        <Text style={styles.sectionTitle}>Xem lại câu trả lời</Text>
        {questions.map((q: any, i: number) => {
          const userAnswer = mockUserAnswers[i];
          const isCorrect = userAnswer === q.correctIndex;
          return (
            <View key={i} style={[styles.reviewCard, isCorrect ? styles.reviewCorrect : styles.reviewWrong]}>
              <View style={styles.reviewHeader}>
                <Ionicons name={isCorrect ? 'checkmark-circle' : 'close-circle'} size={20} color={isCorrect ? C.green : C.red} />
                <Text style={styles.reviewQ}>Câu {i + 1}: {q.content}</Text>
              </View>
              {!isCorrect && (
                <View style={styles.reviewAnswers}>
                  <Text style={styles.wrongAnswer}>❌ Bạn chọn: {q.options[userAnswer]}</Text>
                  <Text style={styles.correctAnswer}>✅ Đáp án: {q.options[q.correctIndex]}</Text>
                </View>
              )}
              {isCorrect && <Text style={styles.correctOnly}>✅ {q.options[q.correctIndex]}</Text>}
            </View>
          );
        })}
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable style={styles.retryBtn} onPress={() => navigation.replace(Routes.Quiz.Play, { quizId })}>
          <Ionicons name="refresh" size={18} color={C.primary} />
          <Text style={styles.retryBtnText}>Làm lại</Text>
        </Pressable>
        <Pressable style={styles.doneBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.doneBtnText}>Quay về</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F7FF' },
  content: { paddingHorizontal: 20, paddingTop: 30, paddingBottom: 20 },
  resultHeader: { alignItems: 'center', marginBottom: 30 },
  resultCircle: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  resultPassed: { backgroundColor: C.greenSoft, borderWidth: 4, borderColor: C.green },
  resultFailed: { backgroundColor: C.redSoft, borderWidth: 4, borderColor: C.red },
  resultScore: { fontSize: 36, fontWeight: '900', color: C.text },
  resultLabel: { fontSize: 12, color: C.muted, marginTop: -2 },
  resultBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginBottom: 10 },
  badgePassed: { backgroundColor: C.orangeSoft },
  badgeFailed: { backgroundColor: C.redSoft },
  resultBadgeText: { fontSize: 16, fontWeight: '800' },
  xpAward: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  xpAwardText: { color: C.orange, fontSize: 16, fontWeight: '800' },
  sectionTitle: { color: C.text, fontSize: 16, fontWeight: '800', marginBottom: 12 },
  reviewCard: { borderRadius: 14, padding: 14, marginBottom: 10, borderLeftWidth: 4 },
  reviewCorrect: { backgroundColor: '#F1F9D7', borderLeftColor: C.green },
  reviewWrong: { backgroundColor: '#FFF0F0', borderLeftColor: C.red },
  reviewHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  reviewQ: { flex: 1, color: C.text, fontSize: 13, fontWeight: '600', lineHeight: 19 },
  reviewAnswers: { marginTop: 8, marginLeft: 28, gap: 4 },
  wrongAnswer: { color: C.red, fontSize: 12 },
  correctAnswer: { color: C.green, fontSize: 12, fontWeight: '600' },
  correctOnly: { color: C.green, fontSize: 12, fontWeight: '600', marginTop: 6, marginLeft: 28 },
  actions: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingBottom: 30, paddingTop: 12 },
  retryBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 52, borderRadius: 16, backgroundColor: '#E7EBFF' },
  retryBtnText: { color: C.primary, fontSize: 14, fontWeight: '700' },
  doneBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 52, borderRadius: 16, backgroundColor: C.primary },
  doneBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
});
