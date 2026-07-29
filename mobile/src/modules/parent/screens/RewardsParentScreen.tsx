import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
import {
  addReward,
  reviewRedemption,
  toggleReward,
  useAppDispatch,
  useAppSelector,
} from '@/shared/store';
import { ScreenBackButton } from '@/shared/components';

export default function RewardsParentScreen() {
  const dispatch = useAppDispatch();
  const { wallet, child, rewards, redemptionRequests } = useAppSelector((state) => state.kidlife);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [cost, setCost] = useState('100');
  const [type, setType] = useState('Trải nghiệm');
  const pendingCount = redemptionRequests.filter((request) => request.status === 'pending').length;

  const handleAdd = () => {
    if (!title.trim()) return;
    dispatch(addReward({ title, cost: Math.max(1, Number(cost) || 100), detail: `Phần thưởng ${type.toLowerCase()}` }));
    setTitle('');
    setCost('100');
    setShowAdd(false);
  };

  return <>
    <ScrollView style={L.screen} contentContainerStyle={L.content} showsVerticalScrollIndicator={false}>
    <View style={styles.header}><ScreenBackButton /><View style={styles.headerCopy}><Text style={styles.overline}>GAMIFICATION</Text><Text style={styles.title}>Phần thưởng</Text><Text style={styles.subtitle}>Tạo động lực cho bé mỗi ngày</Text></View><Pressable style={styles.addButton} onPress={() => setShowAdd(true)}><Ionicons name="add" size={20} color="#FFF" /><Text style={styles.addText}>Thêm</Text></Pressable></View>
    <View style={styles.overview}><View style={styles.overviewBlock}><Text style={styles.overviewValue}>{wallet.balance.toLocaleString('vi-VN')}</Text><Text style={styles.overviewLabel}>XP của bé {child.name}</Text></View><View style={styles.verticalLine} /><View style={styles.overviewBlock}><Text style={[styles.overviewValue, { color: C.orange }]}>{pendingCount}</Text><Text style={styles.overviewLabel}>Yêu cầu chờ duyệt</Text></View></View>
    <View style={styles.sectionHeader}><Text style={L.sectionTitle}>Danh sách phần thưởng</Text><View style={styles.filter}><Text style={styles.filterText}>Đang hoạt động</Text><Ionicons name="chevron-down" size={15} color={C.primary} /></View></View>
    {rewards.map((reward) => <View key={reward.id} style={[L.card, styles.rewardCard]}><View style={styles.rewardTop}><View style={styles.iconBox}><Text style={styles.icon}>{reward.icon}</Text></View><View style={styles.rewardCopy}><Text style={styles.rewardTitle}>{reward.title}</Text><Text style={styles.rewardDetail}>{reward.detail}</Text></View><Pressable onPress={() => dispatch(toggleReward(reward.id))}><View style={[styles.switch, reward.active && styles.switchActive]}><View style={[styles.switchThumb, reward.active && styles.switchThumbActive]} /></View></Pressable></View><View style={styles.rewardBottom}><View style={styles.costPill}><Ionicons name="star" size={14} color={C.orange} /><Text style={styles.costText}>{reward.cost} XP</Text></View><View style={styles.actions}><Pressable><Text style={styles.edit}>Chỉnh sửa</Text></Pressable><Pressable><Ionicons name="ellipsis-horizontal" size={20} color={C.muted} /></Pressable></View></View></View>)}
    <View style={styles.sectionHeader}><Text style={L.sectionTitle}>Yêu cầu đổi thưởng</Text><View style={styles.pendingBadge}><Text style={styles.pendingText}>{pendingCount} mới</Text></View></View>
    <View style={[L.card, styles.redemptionCard, { marginBottom: 30 }]}>
      {redemptionRequests.map((request) => <View key={request.id} style={styles.redemption}><Text style={styles.redemptionIcon}>{request.icon}</Text><View style={styles.redemptionCopy}><Text style={styles.redemptionTitle}>{request.childName} muốn đổi “{request.rewardTitle}”</Text><Text style={styles.redemptionMeta}>{request.cost} XP  •  {request.requestedAt}</Text></View>{request.status === 'pending' ? <Pressable style={styles.approve} onPress={() => dispatch(reviewRedemption({ requestId: request.id, approved: true }))}><Ionicons name="checkmark" size={17} color="#FFF" /></Pressable> : <View style={styles.approved}><Ionicons name={request.status === 'approved' ? 'checkmark-circle' : 'close-circle'} size={20} color={request.status === 'approved' ? C.green : C.red} /></View>}</View>)}
    </View>
    </ScrollView>
    <Modal visible={showAdd} transparent animationType="fade" onRequestClose={() => setShowAdd(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}><Text style={styles.modalTitle}>Thêm phần thưởng mới</Text><Pressable onPress={() => setShowAdd(false)}><Ionicons name="close" size={22} color={C.muted} /></Pressable></View>
          <Text style={styles.fieldLabel}>Tên phần thưởng</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="VD: 15 phút chơi game" />
          <Text style={styles.fieldLabel}>Giá đổi (XP)</Text>
          <TextInput style={styles.input} value={cost} onChangeText={setCost} keyboardType="numeric" />
          <Text style={styles.fieldLabel}>Loại phần thưởng</Text>
          <View style={styles.typeRow}>{['Trải nghiệm', 'Vật lý', 'Gia đình'].map((item) => <Pressable key={item} style={[styles.typeChip, type === item && styles.typeChipActive]} onPress={() => setType(item)}><Text style={[styles.typeText, type === item && styles.typeTextActive]}>{item}</Text></Pressable>)}</View>
          <Pressable style={styles.submitReward} onPress={handleAdd}><Text style={styles.submitRewardText}>Tạo phần thưởng</Text></Pressable>
        </View>
      </View>
    </Modal>
  </>;
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 8, marginBottom: 20 },
  headerCopy: { flex: 1, marginHorizontal: 12 },
  overline: { color: C.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: C.text, fontSize: 23, fontWeight: '800', marginTop: 3 },
  subtitle: { color: C.muted, fontSize: 12, marginTop: 3 },
  addButton: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.primary, borderRadius: 12, paddingHorizontal: 13, paddingVertical: 10 },
  addText: { color: '#FFF', fontWeight: '800', fontSize: 12 },
  overview: { flexDirection: 'row', backgroundColor: C.primary, borderRadius: 20, paddingVertical: 18, marginBottom: 24 },
  overviewBlock: { flex: 1, alignItems: 'center' },
  overviewValue: { color: '#FFF', fontSize: 25, fontWeight: '800' },
  overviewLabel: { color: '#DCE2FF', fontSize: 11, marginTop: 4 },
  verticalLine: { width: 1, backgroundColor: 'rgba(255,255,255,.24)' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  filter: { flexDirection: 'row', gap: 4, alignItems: 'center', backgroundColor: C.primarySoft, paddingHorizontal: 9, paddingVertical: 7, borderRadius: 999 },
  filterText: { color: C.primary, fontSize: 10, fontWeight: '700' },
  rewardCard: { padding: 15, marginBottom: 10 },
  rewardTop: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 52, height: 52, borderRadius: 15, backgroundColor: C.orangeSoft, justifyContent: 'center', alignItems: 'center', marginRight: 11 },
  icon: { fontSize: 28 },
  rewardCopy: { flex: 1 },
  rewardTitle: { color: C.text, fontSize: 14, fontWeight: '800' },
  rewardDetail: { color: C.muted, fontSize: 11, marginTop: 4 },
  switch: { width: 39, height: 23, borderRadius: 12, backgroundColor: '#D9DDE9', padding: 3, justifyContent: 'center' },
  switchActive: { backgroundColor: C.green },
  switchThumb: { width: 17, height: 17, borderRadius: 9, backgroundColor: '#FFF' },
  switchThumbActive: { alignSelf: 'flex-end' },
  rewardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, marginTop: 13, borderTopWidth: 1, borderTopColor: C.border },
  costPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.orangeSoft, paddingVertical: 6, paddingHorizontal: 9, borderRadius: 999 },
  costText: { color: '#B36A00', fontSize: 11, fontWeight: '800' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  edit: { color: C.primary, fontSize: 11, fontWeight: '700' },
  pendingBadge: { backgroundColor: C.orangeSoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  pendingText: { color: '#B36A00', fontSize: 11, fontWeight: '800' },
  redemptionCard: { paddingHorizontal: 14 },
  redemption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  redemptionIcon: { fontSize: 24, marginRight: 10 },
  redemptionCopy: { flex: 1 },
  redemptionTitle: { color: C.text, fontSize: 12, fontWeight: '700' },
  redemptionMeta: { color: C.muted, fontSize: 11, marginTop: 4 },
  approve: { width: 35, height: 35, borderRadius: 12, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center' },
  approved: { width: 35, height: 35, borderRadius: 12, backgroundColor: C.greenSoft, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,.5)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  modalTitle: { color: C.text, fontSize: 18, fontWeight: '800' },
  fieldLabel: { color: C.text, fontSize: 12, fontWeight: '700', marginBottom: 6 },
  input: { minHeight: 46, borderRadius: 12, backgroundColor: '#F0F2FA', color: C.text, paddingHorizontal: 13, marginBottom: 14 },
  typeRow: { flexDirection: 'row', gap: 7, marginBottom: 18 },
  typeChip: { flex: 1, paddingVertical: 9, borderRadius: 10, backgroundColor: '#F0F2FA', alignItems: 'center' },
  typeChipActive: { backgroundColor: C.primary },
  typeText: { color: C.muted, fontSize: 10, fontWeight: '700' },
  typeTextActive: { color: '#FFF' },
  submitReward: { minHeight: 48, borderRadius: 13, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  submitRewardText: { color: '#FFF', fontSize: 13, fontWeight: '800' },
});
