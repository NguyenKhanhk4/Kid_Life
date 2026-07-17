import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';

const history = [
  { label: 'Hoàn thành “Dọn dẹp đồ chơi”', date: 'Hôm nay, 18:45', amount: '+30', icon: 'checkmark-circle', color: C.green },
  { label: 'Đổi thưởng “15 phút chơi game”', date: 'Hôm qua, 20:10', amount: '-100', icon: 'gift', color: C.orange },
  { label: 'Thưởng streak 7 ngày', date: 'Thứ 6, 08:00', amount: '+70', icon: 'flame', color: C.red },
];

const rewards = [
  { title: '15 phút chơi game', cost: 100, icon: '🎮' },
  { title: 'Chọn món ăn tối', cost: 180, icon: '🍕' },
  { title: 'Một quyển truyện mới', cost: 350, icon: '📚' },
];

export default function WalletScreen() {
  const [balance, setBalance] = useState(1250);
  const [selected, setSelected] = useState<string | null>(null);
  const redeem = (cost: number, title: string) => { if (balance >= cost) { setBalance((value) => value - cost); setSelected(title); } };
  return <ScrollView style={L.screen} contentContainerStyle={L.content} showsVerticalScrollIndicator={false}>
    <View style={styles.heading}><View><Text style={styles.overline}>KHO BÁU CỦA MÌNH</Text><Text style={styles.title}>Ví điểm</Text></View><View style={styles.coin}><Ionicons name="star" size={18} color={C.orange} /><Text style={styles.coinText}>XP</Text></View></View>
    <View style={styles.balanceCard}><View style={styles.balanceTop}><View><Text style={styles.balanceLabel}>Số dư hiện tại</Text><Text style={styles.balance}>{balance.toLocaleString('vi-VN')} <Text style={styles.balanceUnit}>XP</Text></Text></View><View style={styles.walletIcon}><Ionicons name="wallet" size={31} color="#FFF" /></View></View><View style={styles.balanceFooter}><Text style={styles.balanceHint}>+120 XP trong 7 ngày qua</Text><View style={styles.miniProgress}><View style={[styles.miniProgressFill, { width: '62%' }]} /></View></View></View>
    <View style={styles.sectionHeader}><Text style={L.sectionTitle}>Đổi phần thưởng</Text><Text style={styles.smallLink}>Xem tất cả</Text></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rewardRow}>{rewards.map((reward) => <View key={reward.title} style={styles.rewardCard}><Text style={styles.rewardIcon}>{reward.icon}</Text><Text style={styles.rewardTitle}>{reward.title}</Text><View style={styles.rewardBottom}><Text style={styles.cost}>{reward.cost} XP</Text><Pressable style={[styles.redeem, balance < reward.cost && styles.redeemDisabled]} onPress={() => redeem(reward.cost, reward.title)} disabled={balance < reward.cost}><Text style={styles.redeemText}>{selected === reward.title ? 'Đã gửi' : 'Đổi'}</Text></Pressable></View></View>)}</ScrollView>
    <View style={styles.sectionHeader}><Text style={L.sectionTitle}>Lịch sử điểm</Text><Ionicons name="options-outline" size={21} color={C.muted} /></View>
    <View style={styles.historyCard}>{history.map((item) => <View key={item.label} style={styles.historyItem}><View style={[styles.historyIcon, { backgroundColor: `${item.color}18` }]}><Ionicons name={item.icon as any} size={18} color={item.color} /></View><View style={styles.historyCopy}><Text style={styles.historyLabel}>{item.label}</Text><Text style={styles.historyDate}>{item.date}</Text></View><Text style={[styles.historyAmount, { color: item.amount.startsWith('+') ? C.green : C.red }]}>{item.amount}</Text></View>)}</View>
  </ScrollView>;
}

const styles = StyleSheet.create({ heading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, marginBottom: 18 }, overline: { color: C.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 }, title: { color: C.text, fontSize: 28, fontWeight: '800', marginTop: 3 }, coin: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.orangeSoft, borderRadius: 999, paddingVertical: 9, paddingHorizontal: 12 }, coinText: { color: '#B36A00', fontSize: 12, fontWeight: '800' }, balanceCard: { backgroundColor: C.primary, borderRadius: 22, padding: 20, marginBottom: 25 }, balanceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, balanceLabel: { color: '#DCE2FF', fontSize: 13 }, balance: { color: '#FFF', fontSize: 34, fontWeight: '800', marginTop: 3 }, balanceUnit: { fontSize: 15, color: C.lime }, walletIcon: { width: 58, height: 58, borderRadius: 18, backgroundColor: 'rgba(255,255,255,.18)', justifyContent: 'center', alignItems: 'center' }, balanceFooter: { marginTop: 20 }, balanceHint: { color: '#DCE2FF', fontSize: 11, marginBottom: 8 }, miniProgress: { height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,.2)' }, miniProgressFill: { backgroundColor: C.lime, height: '100%', borderRadius: 4 }, sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 2 }, smallLink: { color: C.primary, fontSize: 12, fontWeight: '700' }, rewardRow: { gap: 12, paddingBottom: 24 }, rewardCard: { width: 155, backgroundColor: C.surface, borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: 12 }, rewardIcon: { fontSize: 38, marginBottom: 8 }, rewardTitle: { color: C.text, fontSize: 13, lineHeight: 18, minHeight: 37, fontWeight: '700' }, rewardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }, cost: { color: C.orange, fontSize: 11, fontWeight: '800' }, redeem: { backgroundColor: C.primary, paddingHorizontal: 11, paddingVertical: 7, borderRadius: 10 }, redeemDisabled: { backgroundColor: '#D8DBE7' }, redeemText: { color: '#FFF', fontSize: 11, fontWeight: '800' }, historyCard: { ...L.card, paddingHorizontal: 14 }, historyItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border }, historyIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 11 }, historyCopy: { flex: 1 }, historyLabel: { color: C.text, fontSize: 12, fontWeight: '700' }, historyDate: { color: C.muted, fontSize: 11, marginTop: 3 }, historyAmount: { fontSize: 14, fontWeight: '800' } });
