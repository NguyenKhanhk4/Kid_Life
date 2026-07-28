import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Text, Modal, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';

export default function VirtualBankScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'savings' | 'penalties'>('savings');
  const [savingsBalance, setSavingsBalance] = useState(MOCK_KIDLIFE_DATA.wallet.savingsBalance);
  const [interestRate, setInterestRate] = useState(MOCK_KIDLIFE_DATA.wallet.interestRate.toString());
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);
  const [penaltyReason, setPenaltyReason] = useState('');
  const [penaltyAmount, setPenaltyAmount] = useState('30');
  const [penalties, setPenalties] = useState(MOCK_KIDLIFE_DATA.penalties);

  const handleIssuePenalty = () => {
    if (!penaltyReason.trim()) return;
    const newP = {
      id: `p_${Date.now()}`,
      reason: penaltyReason,
      amount: -Math.abs(Number(penaltyAmount) || 30),
      emoji: '⚠️',
      date: 'Vừa xong',
      status: 'issued',
    };
    setPenalties([newP, ...penalties]);
    setShowPenaltyModal(false);
    setPenaltyReason('');
    Alert.alert('✅ Xuất vé phạt thành công!', `Đã gửi vé phạt -${Math.abs(Number(penaltyAmount))} XP cho bé ${MOCK_KIDLIFE_DATA.child.name}.`);
  };

  return (
    <ScrollView style={L.screen} contentContainerStyle={[L.content, { paddingTop: 50 }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.overline}>TÀI CHÍNH & KỶ LUẬT</Text>
          <Text style={styles.title}>Ngân Hàng Ảo 🏦</Text>
        </View>
        <View style={styles.badgePill}>
          <Text style={styles.badgePillText}>Đồng bộ chính xác</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <Pressable style={[styles.tabBtn, activeTab === 'savings' && styles.tabBtnActive]} onPress={() => setActiveTab('savings')}>
          <Text style={[styles.tabText, activeTab === 'savings' && styles.tabTextActive]}>💰 Sổ Tiết Kiệm</Text>
        </Pressable>
        <Pressable style={[styles.tabBtn, activeTab === 'penalties' && styles.tabBtnActive]} onPress={() => setActiveTab('penalties')}>
          <Text style={[styles.tabText, activeTab === 'penalties' && styles.tabTextActive]}>⚠️ Vé Phạt Kỷ Luật</Text>
        </Pressable>
      </View>

      {activeTab === 'savings' ? (
        <>
          {/* Savings Summary */}
          <View style={styles.bankCard}>
            <View style={styles.bankCardHeader}>
              <View>
                <Text style={styles.childNameLabel}>SỔ TIẾT KIỆM CỦA BÉ</Text>
                <Text style={styles.childName}>Bé {MOCK_KIDLIFE_DATA.child.name}</Text>
              </View>
              <View style={styles.bankIconWrap}>
                <Text style={{ fontSize: 28 }}>🏦</Text>
              </View>
            </View>

            <Text style={styles.savingsBalanceText}>{savingsBalance.toLocaleString('vi-VN')} <Text style={{ fontSize: 18 }}>XP</Text></Text>

            <View style={styles.rateRow}>
              <Text style={styles.rateLabel}>Lãi suất hiện tại:</Text>
              <Text style={styles.rateVal}>{interestRate}% / tuần (Lãi kép)</Text>
            </View>

            <View style={styles.tickerBox}>
              <Ionicons name="trending-up" size={16} color={C.green} />
              <Text style={styles.tickerText}>Tiền lãi dự kiến hôm nay: <Text style={{ color: C.green, fontWeight: '800' }}>+{MOCK_KIDLIFE_DATA.wallet.dailyInterest} XP</Text></Text>
            </View>
          </View>

          {/* Savings Settings */}
          <View style={[L.card, styles.settingCard]}>
            <Text style={L.sectionTitle}>Cấu hình Ngân hàng ảo</Text>
            <Text style={styles.settingDesc}>Điều chỉnh lãi suất khuyến khích bé tiết kiệm tiền thưởng</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mức lãi suất hàng tuần (%):</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={interestRate}
                onChangeText={setInterestRate}
              />
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={() => Alert.alert('Đã lưu', 'Mức lãi suất mới đã được áp dụng cho sổ tiết kiệm của bé!')}>
              <Text style={styles.saveBtnText}>Lưu thiết lập lãi suất</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          {/* Issue Penalty CTA */}
          <TouchableOpacity style={styles.issuePenaltyBtn} onPress={() => setShowPenaltyModal(true)}>
            <Ionicons name="warning" size={20} color="#FFF" />
            <Text style={styles.issuePenaltyText}>Xuất vé phạt mới cho bé</Text>
          </TouchableOpacity>

          {/* Penalties History List */}
          <Text style={[L.sectionTitle, { marginBottom: 12 }]}>Lịch sử vé phạt đã phát hành</Text>

          {penalties.map((item) => (
            <View key={item.id} style={[L.card, styles.penaltyCard]}>
              <Text style={{ fontSize: 32, marginRight: 12 }}>{item.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.penaltyReason}>{item.reason}</Text>
                <Text style={styles.penaltyDate}>{item.date} • Áp dụng cho {MOCK_KIDLIFE_DATA.child.name}</Text>
              </View>
              <Text style={styles.penaltyAmount}>{item.amount} XP</Text>
            </View>
          ))}
        </>
      )}

      {/* Issue Penalty Modal */}
      <Modal visible={showPenaltyModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>⚠️ Tạo vé phạt kỷ luật</Text>
              <Pressable onPress={() => setShowPenaltyModal(false)}>
                <Ionicons name="close-circle" size={24} color={C.muted} />
              </Pressable>
            </View>

            <Text style={styles.modalSub}>Vé phạt sẽ nhắc nhở bé rèn luyện tính kỷ luật nhẹ nhàng.</Text>

            <Text style={styles.label}>Lý do vi phạm:</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="VD: Không đánh răng, chơi game quá giờ..."
              placeholderTextColor={C.muted}
              value={penaltyReason}
              onChangeText={setPenaltyReason}
            />

            <Text style={styles.label}>Số sao/XP trừ:</Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              value={penaltyAmount}
              onChangeText={setPenaltyAmount}
            />

            <TouchableOpacity style={styles.submitPenaltyBtn} onPress={handleIssuePenalty}>
              <Text style={styles.submitPenaltyText}>Phát hành vé phạt</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  overline: { color: C.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: C.text, fontSize: 24, fontWeight: '800', marginTop: 3 },
  badgePill: { backgroundColor: C.greenSoft, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  badgePillText: { color: C.green, fontSize: 10, fontWeight: '800' },

  tabContainer: { flexDirection: 'row', backgroundColor: '#ECEFF8', borderRadius: 14, padding: 4, marginBottom: 20 },
  tabBtn: { flex: 1, paddingVertical: 11, borderRadius: 11, alignItems: 'center' },
  tabBtnActive: { backgroundColor: '#FFF' },
  tabText: { color: C.muted, fontSize: 12, fontWeight: '700' },
  tabTextActive: { color: C.primary, fontWeight: '800' },

  bankCard: { backgroundColor: C.primary, borderRadius: 22, padding: 20, marginBottom: 16 },
  bankCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  childNameLabel: { color: '#DCE2FF', fontSize: 10, fontWeight: '800' },
  childName: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  bankIconWrap: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  savingsBalanceText: { color: '#FFF', fontSize: 36, fontWeight: '900', marginBottom: 12 },
  rateRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: 10, marginBottom: 12 },
  rateLabel: { color: '#DCE2FF', fontSize: 12 },
  rateVal: { color: C.lime, fontSize: 12, fontWeight: '800' },
  tickerBox: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF', borderRadius: 10, padding: 10 },
  tickerText: { color: C.text, fontSize: 12 },

  settingCard: { padding: 18, marginBottom: 20 },
  settingDesc: { color: C.muted, fontSize: 11, marginTop: 4, marginBottom: 14 },
  inputGroup: { marginBottom: 14 },
  inputLabel: { color: C.text, fontSize: 12, fontWeight: '700', marginBottom: 6 },
  textInput: { backgroundColor: '#F0F2FA', borderRadius: 12, paddingHorizontal: 14, height: 44, fontSize: 14, color: C.text, fontWeight: '700' },
  saveBtn: { backgroundColor: C.primary, borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontSize: 13, fontWeight: '800' },

  issuePenaltyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.red, borderRadius: 16, paddingVertical: 14, marginBottom: 20 },
  issuePenaltyText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  penaltyCard: { padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  penaltyReason: { color: C.text, fontSize: 14, fontWeight: '800' },
  penaltyDate: { color: C.muted, fontSize: 11, marginTop: 3 },
  penaltyAmount: { color: C.red, fontSize: 16, fontWeight: '800' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, width: '100%', maxWidth: 360 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  modalTitle: { color: C.text, fontSize: 18, fontWeight: '800' },
  modalSub: { color: C.muted, fontSize: 11, marginBottom: 14 },
  label: { color: C.text, fontSize: 12, fontWeight: '700', marginBottom: 6 },
  modalInput: { backgroundColor: '#F0F2FA', borderRadius: 12, paddingHorizontal: 14, height: 44, fontSize: 14, color: C.text, marginBottom: 14 },
  submitPenaltyBtn: { backgroundColor: C.red, borderRadius: 14, paddingVertical: 13, alignItems: 'center', marginTop: 6 },
  submitPenaltyText: { color: '#FFF', fontSize: 13, fontWeight: '800' },
});
