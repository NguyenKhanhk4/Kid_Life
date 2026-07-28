import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Text, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';

const history = [
  { label: 'Lãi tiết kiệm hôm nay', date: 'Hôm nay, 08:00', amount: '+15', icon: 'trending-up', color: C.green },
  { label: 'Hoàn thành “Dọn dẹp phòng khách”', date: 'Hôm nay, 18:45', amount: '+80', icon: 'checkmark-circle', color: C.green },
  { label: 'Vé phạt "Chơi game quá giờ"', date: 'Hôm qua, 21:00', amount: '-30', icon: 'warning', color: C.red },
  { label: 'Đổi thưởng “15 phút chơi game”', date: 'Thứ 6, 20:10', amount: '-100', icon: 'gift', color: C.orange },
  { label: 'Thưởng streak 11 ngày', date: 'Thứ 5, 08:00', amount: '+70', icon: 'flame', color: C.red },
];

export default function WalletScreen() {
  const navigation = useNavigation<any>();
  const [balance, setBalance] = useState(MOCK_KIDLIFE_DATA.wallet.balance);
  const [savings, setSavings] = useState(MOCK_KIDLIFE_DATA.wallet.savingsBalance);
  const [selected, setSelected] = useState<string | null>(null);
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);

  const redeem = (cost: number, title: string) => {
    if (balance >= cost) {
      setBalance((value) => value - cost);
      setSelected(title);
      Alert.alert('🎉 Đổi thành công!', `Đã gửi đề nghị đổi "${title}" với giá ${cost} XP tới ba mẹ!`);
    }
  };

  const depositSavings = () => {
    if (balance < 100) return;
    setBalance((prev) => prev - 100);
    setSavings((prev) => prev + 100);
    Alert.alert('💰 Đã gửi 100 XP vào Sổ tiết kiệm!', 'Mỗi ngày Sổ tiết kiệm sẽ sinh lời 5%/tuần cho bé nhé! 📈');
  };

  const withdrawSavings = () => {
    if (savings < 100) return;
    setSavings((prev) => prev - 100);
    setBalance((prev) => prev + 100);
    Alert.alert('📤 Đã rút 100 XP về ví!', 'Nhớ giữ tiền trong Sổ tiết kiệm để nhận thêm nhiều tiền lãi nha!');
  };

  return (
    <ScrollView style={L.screen} contentContainerStyle={L.content} showsVerticalScrollIndicator={false}>
      {/* Top Header */}
      <View style={styles.heading}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.overline}>KHO BÁU CỦA BÉ {MOCK_KIDLIFE_DATA.child.name.toUpperCase()}</Text>
          <Text style={styles.title}>Ví điểm & Tiết kiệm</Text>
        </View>
        <View style={styles.coin}>
          <Ionicons name="star" size={18} color={C.orange} />
          <Text style={styles.coinText}>XP</Text>
        </View>
      </View>

      {/* Primary Wallet Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceTop}>
          <View>
            <Text style={styles.balanceLabel}>Số dư tiêu dùng</Text>
            <Text style={styles.balance}>{balance.toLocaleString('vi-VN')} <Text style={styles.balanceUnit}>XP</Text></Text>
          </View>
          <View style={styles.walletIcon}>
            <Ionicons name="wallet" size={31} color="#FFF" />
          </View>
        </View>
        <View style={styles.balanceFooter}>
          <Text style={styles.balanceHint}>+120 XP trong 7 ngày qua</Text>
          <View style={styles.miniProgress}>
            <View style={[styles.miniProgressFill, { width: '62%' }]} />
          </View>
        </View>
      </View>

      {/* Savings Bank Section */}
      <View style={styles.savingsCard}>
        <View style={styles.savingsHeader}>
          <View style={styles.savingsIcon}>
            <Text style={{ fontSize: 24 }}>🏦</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.savingsTitle}>Sổ Tiết Kiệm</Text>
            <Text style={styles.savingsSub}>Sinh lời {MOCK_KIDLIFE_DATA.wallet.interestRate}%/tuần • Lãi kép</Text>
          </View>
          <Text style={styles.savingsVal}>{savings.toLocaleString('vi-VN')} XP</Text>
        </View>

        <View style={styles.interestTicker}>
          <Ionicons name="trending-up" size={16} color={C.green} />
          <Text style={styles.interestText}>Lãi hôm nay: <Text style={{ color: C.green, fontWeight: '800' }}>+{MOCK_KIDLIFE_DATA.wallet.dailyInterest} XP</Text></Text>
        </View>

        <View style={styles.savingsActions}>
          <Pressable style={styles.depositBtn} onPress={depositSavings}>
            <Ionicons name="arrow-down-circle" size={16} color="#FFF" />
            <Text style={styles.savingsBtnText}>Gửi 100 XP</Text>
          </Pressable>
          <Pressable style={styles.withdrawBtn} onPress={withdrawSavings}>
            <Ionicons name="arrow-up-circle" size={16} color={C.primary} />
            <Text style={[styles.savingsBtnText, { color: C.primary }]}>Rút 100 XP</Text>
          </Pressable>
        </View>
      </View>

      {/* Penalty alert banner */}
      <Pressable style={styles.penaltyAlert} onPress={() => setShowPenaltyModal(true)}>
        <Text style={{ fontSize: 22 }}>⚠️</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.penaltyAlertTitle}>Vé phạt vừa nhận</Text>
          <Text style={styles.penaltyAlertSub}>Bị trừ 30 Sao vì tội "{MOCK_KIDLIFE_DATA.penalties[0].reason}"</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={C.red} />
      </Pressable>

      {/* Redeem Rewards Section */}
      <View style={styles.sectionHeader}>
        <Text style={L.sectionTitle}>Đổi phần thưởng</Text>
        <Text style={styles.smallLink}>Xem tất cả</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rewardRow}>
        {MOCK_KIDLIFE_DATA.rewards.map((reward) => (
          <View key={reward.id} style={styles.rewardCard}>
            <Text style={styles.rewardIcon}>{reward.icon}</Text>
            <Text style={styles.rewardTitle}>{reward.title}</Text>
            <View style={styles.rewardBottom}>
              <Text style={styles.cost}>{reward.cost} XP</Text>
              <Pressable
                style={[styles.redeem, balance < reward.cost && styles.redeemDisabled]}
                onPress={() => redeem(reward.cost, reward.title)}
                disabled={balance < reward.cost}
              >
                <Text style={styles.redeemText}>{selected === reward.title ? 'Đã gửi' : 'Đổi'}</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* History */}
      <View style={styles.sectionHeader}>
        <Text style={L.sectionTitle}>Lịch sử điểm</Text>
        <Ionicons name="options-outline" size={21} color={C.muted} />
      </View>

      <View style={styles.historyCard}>
        {history.map((item, index) => (
          <View key={index} style={styles.historyItem}>
            <View style={[styles.historyIcon, { backgroundColor: `${item.color}18` }]}>
              <Ionicons name={item.icon as any} size={18} color={item.color} />
            </View>
            <View style={styles.historyCopy}>
              <Text style={styles.historyLabel}>{item.label}</Text>
              <Text style={styles.historyDate}>{item.date}</Text>
            </View>
            <Text style={[styles.historyAmount, { color: item.amount.startsWith('+') ? C.green : C.red }]}>
              {item.amount}
            </Text>
          </View>
        ))}
      </View>

      {/* Penalty Modal Details */}
      <Modal visible={showPenaltyModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.ticketCard}>
            <View style={styles.ticketBadge}>
              <Text style={styles.ticketBadgeText}>VÉ PHẠT TỪ BA MẸ</Text>
            </View>
            <Text style={styles.ticketEmoji}>🎮</Text>
            <Text style={styles.ticketTitle}>{MOCK_KIDLIFE_DATA.penalties[0].reason}!</Text>
            <Text style={styles.ticketDesc}>Bé bị trừ 30 Sao vì chưa dừng chơi game khi hết giờ hẹn.</Text>
            <Text style={styles.ticketEncourage}>💪 Lần sau cố gắng giữ đúng giờ nhé bé!</Text>
            <Pressable style={styles.ticketCloseBtn} onPress={() => setShowPenaltyModal(false)}>
              <Text style={styles.ticketCloseText}>Con hứa lần sau cố gắng!</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, marginBottom: 18 },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  overline: { color: C.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: C.text, fontSize: 24, fontWeight: '800', marginTop: 3 },
  coin: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.orangeSoft, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12 },
  coinText: { color: '#B36A00', fontSize: 12, fontWeight: '800' },
  balanceCard: { backgroundColor: C.primary, borderRadius: 22, padding: 20, marginBottom: 16 },
  balanceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceLabel: { color: '#DCE2FF', fontSize: 13 },
  balance: { color: '#FFF', fontSize: 34, fontWeight: '800', marginTop: 3 },
  balanceUnit: { fontSize: 15, color: C.lime },
  walletIcon: { width: 54, height: 54, borderRadius: 18, backgroundColor: 'rgba(255,255,255,.18)', justifyContent: 'center', alignItems: 'center' },
  balanceFooter: { marginTop: 18 },
  balanceHint: { color: '#DCE2FF', fontSize: 11, marginBottom: 8 },
  miniProgress: { height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,.2)' },
  miniProgressFill: { backgroundColor: C.lime, height: '100%', borderRadius: 4 },

  savingsCard: { backgroundColor: '#F0F5FF', borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#D0E0FF' },
  savingsHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  savingsIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  savingsTitle: { color: C.text, fontSize: 15, fontWeight: '800' },
  savingsSub: { color: C.muted, fontSize: 11, marginTop: 2 },
  savingsVal: { color: C.primary, fontSize: 16, fontWeight: '800' },
  interestTicker: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF', borderRadius: 10, padding: 10, marginBottom: 14 },
  interestText: { color: C.text, fontSize: 12 },
  savingsActions: { flexDirection: 'row', gap: 10 },
  depositBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: C.green, borderRadius: 12, paddingVertical: 11 },
  withdrawBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#FFF', borderRadius: 12, paddingVertical: 11, borderWidth: 1, borderColor: C.primary },
  savingsBtnText: { color: '#FFF', fontSize: 12, fontWeight: '800' },

  penaltyAlert: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.redSoft, borderRadius: 16, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: '#FFC8C8' },
  penaltyAlertTitle: { color: C.red, fontSize: 13, fontWeight: '800' },
  penaltyAlertSub: { color: '#900', fontSize: 11, marginTop: 2 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  smallLink: { color: C.primary, fontSize: 12, fontWeight: '700' },
  rewardRow: { gap: 12, paddingBottom: 20 },
  rewardCard: { width: 150, backgroundColor: C.surface, borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: 12 },
  rewardIcon: { fontSize: 36, marginBottom: 8 },
  rewardTitle: { color: C.text, fontSize: 13, lineHeight: 18, minHeight: 36, fontWeight: '700' },
  rewardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  cost: { color: C.orange, fontSize: 11, fontWeight: '800' },
  redeem: { backgroundColor: C.primary, paddingHorizontal: 11, paddingVertical: 7, borderRadius: 10 },
  redeemDisabled: { backgroundColor: '#D8DBE7' },
  redeemText: { color: '#FFF', fontSize: 11, fontWeight: '800' },

  historyCard: { ...L.card, paddingHorizontal: 14 },
  historyItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  historyIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  historyCopy: { flex: 1 },
  historyLabel: { color: C.text, fontSize: 12, fontWeight: '700' },
  historyDate: { color: C.muted, fontSize: 11, marginTop: 3 },
  historyAmount: { fontSize: 14, fontWeight: '800' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  ticketCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, width: '100%', maxWidth: 320, alignItems: 'center' },
  ticketBadge: { backgroundColor: C.red, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 12 },
  ticketBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  ticketEmoji: { fontSize: 56, marginVertical: 8 },
  ticketTitle: { color: C.text, fontSize: 20, fontWeight: '800' },
  ticketDesc: { color: C.muted, fontSize: 13, textAlign: 'center', marginTop: 8, lineHeight: 18 },
  ticketEncourage: { color: C.primary, fontSize: 13, fontWeight: '700', marginTop: 14, textAlign: 'center' },
  ticketCloseBtn: { backgroundColor: C.primary, borderRadius: 14, paddingVertical: 13, paddingHorizontal: 24, marginTop: 18, width: '100%', alignItems: 'center' },
  ticketCloseText: { color: '#FFF', fontSize: 13, fontWeight: '800' },
});
