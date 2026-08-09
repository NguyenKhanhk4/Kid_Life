import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
import { equipPetItem, useAppDispatch, useAppSelector } from '@/shared/store';

const items = [
  { icon: '👒', name: 'Mũ vàng', cost: 0 },
  { icon: '👕', name: 'Áo xanh', cost: 0 },
  { icon: '🎒', name: 'Balo nhỏ', cost: 40 },
  { icon: '👟', name: 'Giày thể thao', cost: 60 },
  { icon: '🕶️', name: 'Kính mát', cost: 50 },
  { icon: '🎀', name: 'Nơ xinh', cost: 35 },
  { icon: '🧣', name: 'Khăn len', cost: 45 },
  { icon: '🌱', name: 'Cây nhỏ', cost: 30 },
];

export default function WardrobeScreen({ onBack }: { onBack?: () => void }) {
  const dispatch = useAppDispatch();
  const { wallet, pet } = useAppSelector((state) => state.kidlife);
  const [tab, setTab] = useState('Đã có');
  const owned = pet.ownedItems;
  const equipped = pet.equippedItem ?? 'Mũ vàng';

  const selectItem = (item: (typeof items)[number]) => {
    const isOwned = owned.includes(item.name);
    if (!isOwned && wallet.balance < item.cost) {
      Alert.alert('Chưa đủ XP', 'Bé hãy hoàn thành thêm nhiệm vụ để mua món đồ này nhé.');
      return;
    }
    dispatch(equipPetItem({ name: item.name, cost: item.cost, owned: isOwned }));
  };

  const visibleItems = tab === 'Đã có' ? items.filter((item) => owned.includes(item.name)) : items;
  return <ScrollView style={L.screen} contentContainerStyle={styles.content}><View style={styles.header}><Pressable onPress={onBack}><Ionicons name="chevron-back" size={22} color={C.primary} /></Pressable><Text style={styles.title}>Tủ đồ của pet</Text><Pressable onPress={onBack}><Ionicons name="close" size={21} color={C.muted} /></Pressable></View><View style={styles.preview}><Text style={styles.pet}>🐉</Text><View style={styles.speech}><Text style={styles.speechText}>{equipped} thật đẹp!</Text></View></View><View style={styles.tabs}>{['Đã có', 'Trang phục', 'Nội thất'].map((item) => <Pressable key={item} onPress={() => setTab(item)} style={[styles.tab, tab === item && styles.activeTab]}><Text style={[styles.tabText, tab === item && styles.activeText]}>{item}</Text></Pressable>)}</View><View style={styles.grid}>{visibleItems.map((item) => <Pressable key={item.name} onPress={() => selectItem(item)} style={[styles.item, equipped === item.name && styles.selected]}><Text style={styles.icon}>{item.icon}</Text><Text style={styles.itemName}>{item.name}</Text><Text style={styles.itemName}>{owned.includes(item.name) ? 'Đã có' : `${item.cost} XP`}</Text>{equipped === item.name && <View style={styles.check}><Ionicons name="checkmark" size={10} color="#FFF" /></View>}</Pressable>)}</View></ScrollView>;
}
const styles = StyleSheet.create({ content: { ...L.content, paddingTop: 50 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }, title: { color: C.text, fontSize: 19, fontWeight: '800' }, preview: { height: 210, backgroundColor: '#D8E1FF', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }, pet: { fontSize: 98 }, speech: { position: 'absolute', right: 18, top: 38, backgroundColor: '#FFF', borderRadius: 11, padding: 7 }, speechText: { color: C.text, fontSize: 10, fontWeight: '700' }, tabs: { flexDirection: 'row', gap: 7, marginBottom: 15 }, tab: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 10, backgroundColor: C.surface }, activeTab: { backgroundColor: C.primary }, tabText: { color: C.muted, fontSize: 10, fontWeight: '700' }, activeText: { color: '#FFF' }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, item: { width: '23.5%', minHeight: 93, borderRadius: 13, backgroundColor: C.lime, alignItems: 'center', justifyContent: 'center', position: 'relative' }, selected: { borderWidth: 2, borderColor: C.primary }, icon: { fontSize: 28 }, itemName: { color: C.text, fontSize: 9, fontWeight: '700', textAlign: 'center', marginTop: 5 }, check: { position: 'absolute', right: 4, top: 4, width: 17, height: 17, borderRadius: 9, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' } });
