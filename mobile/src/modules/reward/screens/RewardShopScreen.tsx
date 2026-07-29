import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Alert, Modal, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';

const MOCK_REWARDS = [
  { id: '1', title: 'Đồ chơi Lego', cost: 150, icon: '🧩', stock: 1, type: 'item' },
  { id: '2', title: 'Đi chơi công viên', cost: 300, icon: '🎢', stock: 99, type: 'experience' },
  { id: '3', title: 'Xem phim cuối tuần', cost: 200, icon: '🍿', stock: 99, type: 'experience' },
  { id: '4', title: 'Ăn gà rán KFC', cost: 250, icon: '🍗', stock: 99, type: 'food' },
  { id: '5', title: 'Mua sách truyện mới', cost: 100, icon: '📚', stock: 5, type: 'item' },
];

export default function RewardShopScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const mode = route.params?.mode ?? 'child'; // 'parent' or 'child'
  
  const [balance, setBalance] = useState(350);
  const [filter, setFilter] = useState('all');
  
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newRewardTitle, setNewRewardTitle] = useState('');
  const [newRewardCost, setNewRewardCost] = useState('100');
  const [newRewardIcon, setNewRewardIcon] = useState('🎁');

  const handleRedeem = (item: any) => {
    if (balance < item.cost) {
      Alert.alert('Không đủ điểm', 'Bé cần làm thêm nhiệm vụ để đổi phần thưởng này nhé!');
      return;
    }
    Alert.alert(
      'Gửi yêu cầu đổi quà', 
      `Bạn có muốn dùng ${item.cost} XP để đổi "${item.title}" không? Hệ thống sẽ gửi yêu cầu cho ba mẹ duyệt.`, 
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Gửi yêu cầu', 
          onPress: () => {
            Alert.alert('Thành công!', 'Yêu cầu đổi quà đã được gửi cho ba mẹ. Hãy chờ ba mẹ duyệt nhé!');
          }
        }
      ]
    );
  };

  const filteredRewards = filter === 'all' ? MOCK_REWARDS : MOCK_REWARDS.filter(r => r.type === filter);

  return (
    <View style={L.screen}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>{mode === 'child' ? 'Cửa hàng phần thưởng' : 'Quản lý phần thưởng'}</Text>
        {mode === 'parent' ? (
          <Pressable style={styles.addBtn} onPress={() => setIsAddModalVisible(true)}>
            <Ionicons name="add" size={22} color="#FFF" />
          </Pressable>
        ) : <View style={styles.back} />}
      </View>

      <ScrollView contentContainerStyle={L.content} showsVerticalScrollIndicator={false}>
        
        {/* Motivational Banner */}
        <View style={{ backgroundColor: mode === 'parent' ? '#F0F9FF' : '#FFF5EB', padding: 16, borderRadius: 12, marginBottom: 20, flexDirection: 'row', alignItems: 'center', borderColor: mode === 'parent' ? '#BAE6FD' : '#FFE4C4', borderWidth: 1 }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
            <Ionicons name={mode === 'parent' ? "heart" : "star"} size={24} color={mode === 'parent' ? "#0EA5E9" : C.orange} />
          </View>
          <Text style={{ flex: 1, fontSize: 13, color: mode === 'parent' ? '#0369A1' : '#B36A00', fontWeight: '600', lineHeight: 20, fontStyle: 'italic' }}>
            {mode === 'parent' 
              ? "Mỗi phần thưởng được trao đi là một lần bạn giúp con hiểu được giá trị của sự chăm chỉ."
              : "Mỗi ngôi sao con nhận được là một lời khen từ ba mẹ. Con thật sự rất tuyệt!"}
          </Text>
        </View>

        {/* Pending Requests for Parent */}
        {mode === 'parent' && (
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 12 }}>Yêu cầu đổi quà (1)</Text>
            <View style={{ backgroundColor: '#FFF', padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', shadowColor: C.shadow, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: C.orangeSoft, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                <Text style={{ fontSize: 24 }}>🧩</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 4 }}>Bé Măng muốn đổi Đồ chơi Lego</Text>
                <Text style={{ fontSize: 12, color: C.muted }}>Cần 150 XP để đổi</Text>
              </View>
              <TouchableOpacity style={{ backgroundColor: C.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }} onPress={() => Alert.alert('Thành công', 'Đã duyệt tặng thưởng cho bé!')}>
                <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '700' }}>Duyệt</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Balance Card */}
        {mode === 'child' && (
          <View style={[L.card, styles.balanceCard]}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>Điểm hiện có của bé</Text>
              <Ionicons name="wallet-outline" size={20} color={C.orange} />
            </View>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceValue}>{balance}</Text>
              <Text style={styles.balanceXp}>XP</Text>
            </View>
            <View style={styles.balanceBarBg}>
              <View style={[styles.balanceBarFill, { width: `${Math.min((balance/500)*100, 100)}%` }]} />
            </View>
            <Text style={styles.balanceHint}>Gần đủ để đổi đồ chơi xịn rồi, cố lên!</Text>
          </View>
        )}

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {[
            { id: 'all', label: 'Tất cả' }, 
            { id: 'item', label: 'Đồ vật' }, 
            { id: 'experience', label: 'Trải nghiệm' }, 
            { id: 'food', label: 'Ăn uống' }
          ].map(f => (
            <Pressable key={f.id} style={[styles.filterChip, filter === f.id && styles.filterChipActive]} onPress={() => setFilter(f.id)}>
              <Text style={[styles.filterText, filter === f.id && styles.filterTextActive]}>{f.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Grid */}
        <View style={styles.grid}>
          {filteredRewards.map((reward) => (
            <Pressable 
              key={reward.id} 
              style={[styles.card, balance < reward.cost && mode === 'child' && styles.cardLocked]} 
              onPress={() => mode === 'child' ? handleRedeem(reward) : Alert.alert('Quản lý', 'Sửa phần thưởng')}
            >
              <View style={styles.cardThumb}>
                <Text style={styles.thumbEmoji}>{reward.icon}</Text>
                {reward.stock < 10 && (
                  <View style={styles.stockBadge}>
                    <Text style={styles.stockText}>Còn {reward.stock}</Text>
                  </View>
                )}
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={2}>{reward.title}</Text>
                <View style={styles.costRow}>
                  <Ionicons name="star" size={12} color={C.orange} />
                  <Text style={[styles.costText, balance < reward.cost && mode === 'child' && { color: C.red }]}>{reward.cost} XP</Text>
                </View>
                
                {mode === 'child' ? (
                  <View style={[styles.redeemBtn, balance < reward.cost ? styles.redeemBtnDisabled : styles.redeemBtnActive]}>
                    <Text style={[styles.redeemBtnText, balance < reward.cost && { color: C.muted }]}>
                      {balance >= reward.cost ? 'Đổi ngay' : 'Chưa đủ điểm'}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.parentActions}>
                    <Ionicons name="create-outline" size={16} color={C.primary} />
                    <Text style={{ fontSize: 11, color: C.primary, fontWeight: '600' }}>Sửa</Text>
                  </View>
                )}
              </View>
            </Pressable>
          ))}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Reward Modal for Parents */}
      <Modal visible={isAddModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm phần thưởng mới</Text>
              <TouchableOpacity onPress={() => setIsAddModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color={C.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Tên phần thưởng</Text>
              <TextInput 
                style={styles.textInput} 
                placeholder="VD: Đi siêu thị cuối tuần..."
                value={newRewardTitle}
                onChangeText={setNewRewardTitle}
              />

              <Text style={styles.inputLabel}>Số lượng XP cần để đổi</Text>
              <TextInput 
                style={styles.textInput} 
                placeholder="VD: 150"
                keyboardType="numeric"
                value={newRewardCost}
                onChangeText={setNewRewardCost}
              />

              <Text style={styles.inputLabel}>Biểu tượng (Emoji)</Text>
              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
                {['🎁', '🍕', '🎮', '🏖️', '📚'].map(emoji => (
                  <TouchableOpacity 
                    key={emoji} 
                    style={[styles.emojiSelect, newRewardIcon === emoji && styles.emojiSelectActive]}
                    onPress={() => setNewRewardIcon(emoji)}
                  >
                    <Text style={{ fontSize: 24 }}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={() => {
                  Alert.alert('Thành công', 'Đã thêm phần thưởng vào cửa hàng!');
                  setIsAddModalVisible(false);
                }}
              >
                <Text style={styles.primaryButtonText}>Lưu phần thưởng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 12 },
  back: { width: 42, height: 42, borderRadius: 22, backgroundColor: '#E4E9FF', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: C.text, fontSize: 17, fontWeight: '800' },
  addBtn: { width: 42, height: 42, borderRadius: 22, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  balanceCard: { padding: 20, marginBottom: 16, backgroundColor: '#FFF5EB', borderColor: '#FFE4C4', borderWidth: 1 },
  balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  balanceLabel: { color: '#B36A00', fontSize: 13, fontWeight: '700' },
  balanceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 12 },
  balanceValue: { color: C.orange, fontSize: 36, fontWeight: '900' },
  balanceXp: { color: C.orange, fontSize: 16, fontWeight: '800' },
  balanceBarBg: { height: 8, borderRadius: 4, backgroundColor: '#FFE4C4', overflow: 'hidden', marginBottom: 8 },
  balanceBarFill: { height: '100%', borderRadius: 4, backgroundColor: C.orange },
  balanceHint: { color: '#B36A00', fontSize: 11, fontWeight: '600' },
  filterRow: { paddingHorizontal: 20, gap: 8, paddingBottom: 16 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#E7EBFF' },
  filterChipActive: { backgroundColor: C.primary },
  filterText: { color: C.muted, fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: '#FFF' },
  grid: { paddingHorizontal: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '47%', backgroundColor: '#FFF', borderRadius: 18, overflow: 'hidden', shadowColor: C.shadow, shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  cardLocked: { opacity: 0.7 },
  cardThumb: { height: 110, backgroundColor: C.orangeSoft, alignItems: 'center', justifyContent: 'center' },
  thumbEmoji: { fontSize: 50 },
  stockBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  stockText: { color: C.red, fontSize: 10, fontWeight: '800' },
  cardBody: { padding: 12 },
  cardTitle: { color: C.text, fontSize: 13, fontWeight: '800', lineHeight: 18, marginBottom: 6, height: 36 },
  costRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  costText: { color: C.orange, fontSize: 13, fontWeight: '800' },
  redeemBtn: { paddingVertical: 8, borderRadius: 12, alignItems: 'center' },
  redeemBtnActive: { backgroundColor: C.primary },
  redeemBtnDisabled: { backgroundColor: '#F0F2FA' },
  redeemBtnText: { color: '#FFF', fontSize: 11, fontWeight: '800' },
  parentActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 8, backgroundColor: '#E7EBFF', borderRadius: 12 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F0F2FA' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: C.text },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F2FA', justifyContent: 'center', alignItems: 'center' },
  modalBody: { padding: 20 },
  inputLabel: { fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 8 },
  textInput: { backgroundColor: '#F4F6FB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 14, color: C.text, marginBottom: 20 },
  emojiSelect: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F4F6FB', justifyContent: 'center', alignItems: 'center' },
  emojiSelectActive: { backgroundColor: C.primarySoft, borderWidth: 2, borderColor: C.primary },
  primaryButton: { backgroundColor: C.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' }
});
