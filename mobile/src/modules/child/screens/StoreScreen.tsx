import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
import { ScreenBackButton } from '@/shared/components';

import { useNavigation } from '@react-navigation/native';
import { equipPetItem, requestReward, useAppDispatch, useAppSelector } from '@/shared/store';

const groups = {
  'Đồ ăn': [['🍎', 'Táo đỏ', 3], ['🍪', 'Bánh quy', 5], ['🍰', 'Bánh kem', 10], ['🍕', 'Pizza', 8], ['🍔', 'Burger', 9], ['🍣', 'Sushi', 12], ['🍜', 'Mì ramen', 6], ['🌽', 'Bắp ngô', 4]],
  'Trang phục': [['🧢', 'Mũ len', 6], ['👕', 'Áo xanh', 7], ['🎈', 'Bóng bay', 5], ['👟', 'Giày thể thao', 9], ['🧤', 'Găng tay', 6], ['Scarvis', 'Khăn len', 8]],
  'Nội thất': [['🛏️', 'Giường nhỏ', 12], ['🛁', 'Bồn tắm', 10], ['🪑', 'Ghế gỗ', 5], ['📺', 'Tivi', 15], ['🪴', 'Cây xanh', 7], ['🪆', 'Đồ trang trí', 9]]
} as const;

type Category = keyof typeof groups;

export default function StoreScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { wallet, rewards, redemptionRequests } = useAppSelector((state) => state.kidlife);
  const [storeType, setStoreType] = useState<'pet' | 'parent'>('pet');
  const [category, setCategory] = useState<Category>('Đồ ăn');
  const [owned, setOwned] = useState<string[]>([]);
  
  const handleRedeemReward = (item: any) => {
    if (wallet.balance < item.cost) {
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
            dispatch(requestReward(item.id));
            Alert.alert('Thành công!', 'Yêu cầu đổi quà đã được gửi cho ba mẹ. Hãy chờ ba mẹ duyệt nhé!');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={L.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <ScreenBackButton />
        <View style={styles.headerCopy}>
          <Text style={styles.title}>Cửa hàng</Text>
          <Text style={styles.subtitle}>Mang những điều vui về cho Bun Bun</Text>
        </View>
        <Pressable style={styles.coins} onPress={() => navigation.navigate('WalletScreen' as any)}>
          <Ionicons name="star" size={16} color={C.orange} />
          <Text style={styles.coinsText}>{wallet.balance} XP</Text>
        </Pressable>
      </View>

      {/* Store Type Switch */}
      <View style={styles.storeTypeSwitcher}>
        <Pressable 
          style={[styles.typeBtn, storeType === 'pet' && styles.typeBtnActive]} 
          onPress={() => setStoreType('pet')}
        >
          <Text style={[styles.typeBtnText, storeType === 'pet' && styles.typeBtnTextActive]}>🐾 Đồ cho Pet</Text>
        </Pressable>
        <Pressable 
          style={[styles.typeBtn, storeType === 'parent' && styles.typeBtnActive]} 
          onPress={() => setStoreType('parent')}
        >
          <Text style={[styles.typeBtnText, storeType === 'parent' && styles.typeBtnTextActive]}>🎁 Quà thực tế</Text>
        </Pressable>
      </View>

      {storeType === 'pet' ? (
        <>
          <View style={styles.tabs}>
            {(Object.keys(groups) as Category[]).map((item) => (
              <Pressable key={item} onPress={() => setCategory(item)} style={[styles.tab, category === item && styles.tabActive]}>
                <Text style={[styles.tabText, category === item && styles.tabTextActive]}>{item}</Text>
              </Pressable>
            ))}
          </View>
          
          <View style={styles.grid}>
            {groups[category].map(([icon, name, cost]) => (
              <Pressable 
                key={name as string} 
                style={[styles.item, owned.includes(name as string) && styles.itemOwned]} 
                onPress={() => { 
                  if (!owned.includes(name as string) && wallet.balance >= (cost as number)) {
                    dispatch(equipPetItem({ name: name as string, cost: cost as number, owned: false }));
                    setOwned([...owned, name as string]); 
                  } 
                }}
              >
                <Text style={styles.itemIcon}>{icon as string}</Text>
                <Text style={styles.itemName} numberOfLines={1}>{name as string}</Text>
                <View style={styles.cost}>
                  <Ionicons name={owned.includes(name as string) ? 'checkmark' : 'star'} size={12} color={owned.includes(name as string) ? C.green : C.orange} />
                  <Text style={[styles.costText, owned.includes(name as string) && { color: C.green }]}>
                    {owned.includes(name as string) ? 'Đã có' : cost as number}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
          
          <View style={styles.tip}>
            <Text style={styles.tipEmoji}>💡</Text>
            <Text style={styles.tipText}>Hoàn thành nhiệm vụ để kiếm thêm XP và mua đồ cho thú cưng nhé!</Text>
          </View>
        </>
      ) : (
        <>
          {/* Real Rewards Section */}
          <View style={styles.rewardBanner}>
            <View style={styles.rewardBannerIcon}><Ionicons name="star" size={24} color={C.orange} /></View>
            <Text style={styles.rewardBannerText}>Mỗi ngôi sao con nhận được là một lời khen từ ba mẹ. Con thật sự rất tuyệt!</Text>
          </View>
          
          <View style={styles.rewardGrid}>
            {rewards.filter((reward) => reward.active).map((reward) => (
              <Pressable 
                key={reward.id} 
                style={[styles.rewardCard, wallet.balance < reward.cost && styles.rewardCardLocked]} 
                onPress={() => handleRedeemReward(reward)}
              >
                <View style={styles.rewardThumb}>
                  <Text style={styles.rewardEmoji}>{reward.icon}</Text>
                </View>
                <View style={styles.rewardBody}>
                  <Text style={styles.rewardTitle} numberOfLines={2}>{reward.title}</Text>
                  <View style={styles.rewardCostRow}>
                    <Ionicons name="star" size={12} color={C.orange} />
                    <Text style={[styles.rewardCostText, wallet.balance < reward.cost && { color: C.red }]}>{reward.cost} XP</Text>
                  </View>
                  <View style={[styles.redeemBtn, wallet.balance < reward.cost ? styles.redeemBtnDisabled : styles.redeemBtnActive]}>
                    <Text style={[styles.redeemBtnText, wallet.balance < reward.cost && { color: C.muted }]}>
                      {redemptionRequests.some((request) => request.rewardId === reward.id && request.status === 'pending')
                        ? 'Đang chờ duyệt'
                        : wallet.balance >= reward.cost ? 'Đổi ngay' : 'Chưa đủ điểm'}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </>
      )}
      
      <View style={{height: 40}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({ 
  content: { ...L.content, paddingTop: 50 }, 
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 19 }, 
  headerCopy: { flex: 1, marginHorizontal: 12 },
  title: { color: C.text, fontSize: 24, fontWeight: '800' }, 
  subtitle: { color: C.muted, fontSize: 12, marginTop: 4 }, 
  coins: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.orangeSoft, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 9 }, 
  coinsText: { color: '#B36A00', fontSize: 14, fontWeight: '900' }, 
  
  storeTypeSwitcher: { flexDirection: 'row', backgroundColor: '#F0F2FA', padding: 4, borderRadius: 16, marginBottom: 20 },
  typeBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  typeBtnActive: { backgroundColor: '#FFF', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  typeBtnText: { fontSize: 14, fontWeight: '700', color: C.muted },
  typeBtnTextActive: { color: C.primary },

  tabs: { flexDirection: 'row', gap: 7, marginBottom: 18 }, 
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 11, backgroundColor: C.surface }, 
  tabActive: { backgroundColor: C.primary }, 
  tabText: { color: C.muted, fontSize: 11, fontWeight: '700' }, 
  tabTextActive: { color: '#FFF' }, 
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 }, 
  item: { width: '23.5%', minHeight: 106, backgroundColor: C.lime, borderRadius: 13, alignItems: 'center', justifyContent: 'center', padding: 7 }, 
  itemOwned: { backgroundColor: C.greenSoft }, 
  itemIcon: { fontSize: 30 }, 
  itemName: { color: C.text, fontSize: 9, fontWeight: '700', textAlign: 'center', marginTop: 5 }, 
  cost: { flexDirection: 'row', gap: 3, alignItems: 'center', marginTop: 5 }, 
  costText: { color: '#B36A00', fontSize: 10, fontWeight: '900' }, 
  tip: { flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: C.primarySoft, borderRadius: 13, padding: 12, marginTop: 22 }, 
  tipEmoji: { fontSize: 21 }, 
  tipText: { color: C.primary, fontSize: 11, lineHeight: 16, flex: 1 },
  
  // Real Reward Styles
  rewardBanner: { backgroundColor: '#FFF5EB', padding: 16, borderRadius: 12, marginBottom: 20, flexDirection: 'row', alignItems: 'center', borderColor: '#FFE4C4', borderWidth: 1 },
  rewardBannerIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rewardBannerText: { flex: 1, fontSize: 13, color: '#B36A00', fontWeight: '600', lineHeight: 20, fontStyle: 'italic' },
  rewardGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  rewardCard: { width: '48%', backgroundColor: '#FFF', borderRadius: 18, overflow: 'hidden', shadowColor: C.shadow, shadowOpacity: 0.06, shadowRadius: 10, elevation: 2, marginBottom: 4 },
  rewardCardLocked: { opacity: 0.7 },
  rewardThumb: { height: 110, backgroundColor: C.orangeSoft, alignItems: 'center', justifyContent: 'center' },
  rewardEmoji: { fontSize: 50 },
  rewardBody: { padding: 12 },
  rewardTitle: { color: C.text, fontSize: 13, fontWeight: '800', lineHeight: 18, marginBottom: 6, height: 36 },
  rewardCostRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  rewardCostText: { color: C.orange, fontSize: 13, fontWeight: '800' },
  redeemBtn: { paddingVertical: 8, borderRadius: 12, alignItems: 'center' },
  redeemBtnActive: { backgroundColor: C.primary },
  redeemBtnDisabled: { backgroundColor: '#F0F2FA' },
  redeemBtnText: { color: '#FFF', fontSize: 11, fontWeight: '800' },
});
