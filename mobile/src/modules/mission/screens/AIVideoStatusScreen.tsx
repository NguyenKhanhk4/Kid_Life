import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';

type Status = 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED';

export default function AIVideoStatusScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const isPreviewOnly = route.params?.prompt === 'preview';

  const [status, setStatus] = useState<Status>(isPreviewOnly ? 'COMPLETED' : 'PENDING');
  
  // Mock generation flow
  useEffect(() => {
    if (isPreviewOnly) return;
    
    const t1 = setTimeout(() => setStatus('GENERATING'), 1500);
    const t2 = setTimeout(() => setStatus('COMPLETED'), 4000);
    
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isPreviewOnly]);

  const handleUseVideo = () => {
    // Navigate back twice (Status -> Prompt -> CreateMission)
    navigation.goBack();
    setTimeout(() => navigation.goBack(), 100);
  };

  return (
    <View style={L.screen}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>{isPreviewOnly ? 'Xem video AI' : 'Trạng thái tạo video'}</Text>
        <View style={styles.back} />
      </View>

      <View style={styles.content}>
        {/* Progress Tracker (only if not just previewing) */}
        {!isPreviewOnly && (
          <View style={styles.trackerRow}>
            <Step active={status !== 'PENDING'} done={status !== 'PENDING'} label="Nhận yêu cầu" />
            <View style={[styles.line, status !== 'PENDING' && styles.lineActive]} />
            <Step active={status === 'GENERATING'} done={status === 'COMPLETED'} label="Đang tạo video" />
            <View style={[styles.line, status === 'COMPLETED' && styles.lineActive]} />
            <Step active={status === 'COMPLETED'} done={status === 'COMPLETED'} label="Hoàn thành" />
          </View>
        )}

        {/* Status Display */}
        {status === 'PENDING' && (
          <View style={styles.stateCenter}>
            <Ionicons name="cloud-upload" size={60} color={C.primary} />
            <Text style={styles.stateTitle}>Đang gửi yêu cầu...</Text>
            <Text style={styles.stateDesc}>Vui lòng đợi trong giây lát</Text>
          </View>
        )}

        {status === 'GENERATING' && (
          <View style={styles.stateCenter}>
            <View style={styles.spinner} />
            <Text style={styles.stateTitle}>AI đang tạo video</Text>
            <Text style={styles.stateDesc}>Dự kiến mất khoảng 2-5 phút. Bạn có thể rời khỏi màn hình này, hệ thống sẽ thông báo khi xong.</Text>
          </View>
        )}

        {status === 'COMPLETED' && (
          <View style={styles.completedState}>
            <View style={styles.videoPlayer}>
              <Text style={styles.videoEmoji}>🦸‍♂️</Text>
              <Pressable style={styles.playButton}>
                <Ionicons name="play" size={40} color="#FFF" />
              </Pressable>
              <View style={styles.videoLabel}>
                <Ionicons name="sparkles" size={12} color="#FFF" />
                <Text style={styles.videoLabelText}>AI Video (15s)</Text>
              </View>
            </View>

            <Text style={styles.successTitle}>Video đã sẵn sàng!</Text>
            
            <View style={styles.infoRow}>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>AI Provider</Text>
                <Text style={styles.infoValue}>Sora API</Text>
              </View>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Độ phân giải</Text>
                <Text style={styles.infoValue}>720p (Dọc)</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Footer Actions */}
      {status === 'COMPLETED' && !isPreviewOnly && (
        <View style={styles.footer}>
          <Pressable style={styles.secondaryBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="refresh" size={18} color={C.primary} />
            <Text style={styles.secondaryBtnText}>Tạo lại</Text>
          </Pressable>
          <Pressable style={styles.primaryBtn} onPress={handleUseVideo}>
            <Text style={styles.primaryBtnText}>Sử dụng video này</Text>
            <Ionicons name="checkmark-circle" size={18} color="#FFF" />
          </Pressable>
        </View>
      )}
    </View>
  );
}

function Step({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <View style={styles.stepBox}>
      <View style={[styles.stepCircle, active && styles.stepCircleActive, done && styles.stepCircleDone]}>
        {done ? <Ionicons name="checkmark" size={16} color="#FFF" /> : <View style={styles.stepDot} />}
      </View>
      <Text style={[styles.stepLabel, (active || done) && styles.stepLabelActive]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 12 },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: '#E4E9FF', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: C.text, fontSize: 17, fontWeight: '800' },
  content: { flex: 1, paddingHorizontal: 20 },
  trackerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 30, paddingBottom: 40 },
  stepBox: { alignItems: 'center', width: 80 },
  stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E7EBFF', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  stepCircleActive: { backgroundColor: C.primarySoft, borderWidth: 2, borderColor: C.primary },
  stepCircleDone: { backgroundColor: C.green },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.primary },
  stepLabel: { color: C.muted, fontSize: 11, textAlign: 'center', fontWeight: '600' },
  stepLabelActive: { color: C.text, fontWeight: '700' },
  line: { flex: 1, height: 3, backgroundColor: '#E7EBFF', marginTop: 15, marginHorizontal: -20, zIndex: -1 },
  lineActive: { backgroundColor: C.green },
  stateCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: -100 },
  spinner: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: C.primarySoft, borderTopColor: C.primary, marginBottom: 20 },
  stateTitle: { color: C.text, fontSize: 20, fontWeight: '800', marginBottom: 10 },
  stateDesc: { color: C.muted, fontSize: 14, textAlign: 'center', lineHeight: 22, paddingHorizontal: 30 },
  completedState: { flex: 1, alignItems: 'center', paddingTop: 10 },
  videoPlayer: { width: '100%', height: 380, backgroundColor: '#1C1C1E', borderRadius: 24, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 24 },
  videoEmoji: { fontSize: 100, position: 'absolute', opacity: 0.8 },
  playButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  videoLabel: { position: 'absolute', top: 16, left: 16, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  videoLabelText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  successTitle: { color: C.text, fontSize: 22, fontWeight: '800', marginBottom: 20 },
  infoRow: { flexDirection: 'row', gap: 12, width: '100%' },
  infoCol: { flex: 1, backgroundColor: '#F0F2FA', borderRadius: 16, padding: 14 },
  infoLabel: { color: C.muted, fontSize: 12, fontWeight: '600', marginBottom: 4 },
  infoValue: { color: C.text, fontSize: 14, fontWeight: '800' },
  footer: { flexDirection: 'row', gap: 12, padding: 20, paddingBottom: 30, backgroundColor: '#FFF' },
  secondaryBtn: { flex: 1, height: 54, borderRadius: 16, backgroundColor: '#E7EBFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  secondaryBtnText: { color: C.primary, fontSize: 14, fontWeight: '800' },
  primaryBtn: { flex: 2, height: 54, borderRadius: 16, backgroundColor: C.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
});
