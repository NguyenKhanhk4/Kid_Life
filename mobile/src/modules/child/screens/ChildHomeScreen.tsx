import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Text, Alert, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/constants';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
const tasks = [
  { icon: '🧸', title: 'Dọn dẹp đồ chơi', meta: '18:30 - 19:00', xp: '+30 XP', done: true },
  { icon: '👕', title: 'Tự gấp quần áo', meta: '19:00 - 19:15', xp: '+50 XP', done: true },
  { icon: '🪥', title: 'Đánh răng trước khi ngủ', meta: '20:30 - 20:45', xp: '+30 XP', done: false },
];

export default function ChildHomeScreen() {
  const navigation = useNavigation();
  
  const [isWardrobeVisible, setIsWardrobeVisible] = useState(false);
  const [wardrobeTab, setWardrobeTab] = useState('Đồ ăn');
  const [equippedItem, setEquippedItem] = useState<string | null>(null);
  
  const [isWishVisible, setIsWishVisible] = useState(false);
  const [wishText, setWishText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const wardrobeItems: Record<string, string[]> = {
    'Đồ ăn': ['🍬', '🍦', '🍩', '🍕', '🍔', '🍣'],
    'Trang phục': ['👒', '👕', '👟', '🕶️', '🎀', '🧣'],
    'Nội thất': ['🛏️', '🛋️', '🪴', '🖼️', '🧸', '📻'],
  };

  return (
    <ScrollView style={L.screen} contentContainerStyle={L.content} showsVerticalScrollIndicator={false}>
      {/* Top Banner section */}
      <View style={styles.topSection}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.starPill} onPress={() => navigation.navigate('WalletScreen' as any)}>
            <Ionicons name="star" size={16} color={C.orange} />
            <Text style={styles.starText}>1,250 XP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bagBtn} onPress={() => setIsWardrobeVisible(true)}>
            <Text style={{ fontSize: 22 }}>🎒</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mascotContainer}>
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>Chào Minh Anh! Cùng làm nhiệm vụ kiếm sao nhé!</Text>
            <View style={styles.speechArrow} />
          </View>
          <Text style={styles.mascotEmoji}>🐹</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.quickRow, { marginBottom: 24, marginTop: 0 }]}>
        <QuickAction icon="wallet-outline" label="Ví điểm" color={C.primary} onPress={() => navigation.navigate('WalletScreen' as any)} />
        <QuickAction icon="paw-outline" label="Thú cưng" color={C.orange} onPress={() => navigation.navigate('PetScreen' as any)} />
        <QuickAction icon="book-outline" label="Học bài" color={C.purple} onPress={() => navigation.navigate(Routes.Lesson.Library as any)} />
        <QuickAction icon="moon-outline" label="Kể chuyện" color="#6C5CE7" onPress={() => navigation.navigate(Routes.Features.ChildBedtimeStories as any)} />
        <QuickAction icon="sparkles-outline" label="Điều ước" color="#FF4785" onPress={() => setIsWishVisible(true)} />
      </ScrollView>

      <View style={styles.sectionHeader}><Text style={L.sectionTitle}>Nhiệm vụ hôm nay</Text><View style={[L.pill, styles.countPill]}><Text style={styles.countText}>2/5 hoàn thành</Text></View></View>
      {tasks.map((task) => (
        <Pressable key={task.title} style={[L.card, styles.taskCard, task.done && styles.taskDone]} accessibilityRole="button" onPress={() => navigation.navigate(Routes.Mission.Detail as any, { missionId: '1', mode: 'child' })}>
          <View style={styles.taskIcon}><Text style={styles.taskEmoji}>{task.icon}</Text></View>
          <View style={styles.taskCopy}><Text style={styles.taskTitle}>{task.title}</Text><View style={styles.taskMeta}><Ionicons name="time-outline" size={14} color={C.muted} /><Text style={L.body}>  {task.meta}</Text><View style={styles.xpBadge}><Text style={styles.xpBadgeText}>{task.xp}</Text></View></View></View>
          <Ionicons name={task.done ? 'checkmark-circle' : 'chevron-forward'} size={24} color={task.done ? C.green : C.primary} />
        </Pressable>
      ))}

      <View style={{height: 20}} />

      {/* Wish Modal */}
      <Modal visible={isWishVisible} transparent animationType="slide" onRequestClose={() => setIsWishVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.wardrobeModal}>
            <View style={styles.wardrobeHandle} />
            <View style={styles.wardrobeHeader}>
              <Text style={styles.wardrobeTitle}>Gửi điều ước</Text>
              <TouchableOpacity style={styles.wardrobeCloseBtn} onPress={() => setIsWishVisible(false)}>
                <Ionicons name="close" size={20} color={C.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.wishCostPill}>
              <Text style={styles.wishCostText}>Phí gửi: 50</Text>
              <Ionicons name="star" size={14} color={C.orange} />
            </View>

            <Text style={styles.wishPrompt}>Cậu đang ước điều gì thế?</Text>
            
            <View style={styles.wishInputContainer}>
              <TextInput 
                style={styles.wishInput} 
                placeholder="Nhập điều ước của cậu..." 
                placeholderTextColor={C.muted} 
                multiline
                value={wishText}
                onChangeText={setWishText}
              />
            </View>

            <View style={styles.recordSection}>
              <Text style={styles.orText}>Hoặc ghi âm nhé!</Text>
              <TouchableOpacity 
                style={[styles.recordBtn, isRecording && styles.recordingActive]} 
                onPress={() => setIsRecording(!isRecording)}
              >
                <Ionicons name={isRecording ? "stop" : "mic"} size={28} color="#FFF" />
              </TouchableOpacity>
              {isRecording && <Text style={styles.recordingText}>Đang ghi âm... 00:05</Text>}
            </View>

            <TouchableOpacity 
              style={[styles.wishSubmitBtn, (!wishText && !isRecording) && {opacity: 0.5}]}
              onPress={() => {
                if(wishText || isRecording) {
                  Alert.alert('Thành công', 'Điều ước đã được gửi đến ba mẹ! (-50 Sao)');
                  setIsWishVisible(false);
                  setWishText('');
                  setIsRecording(false);
                }
              }}
            >
              <Text style={styles.wishSubmitText}>Gửi điều ước</Text>
              <Ionicons name="paper-plane" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Wardrobe Modal */}
      <Modal visible={isWardrobeVisible} transparent animationType="slide" onRequestClose={() => setIsWardrobeVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.wardrobeModal}>
            <View style={styles.wardrobeHandle} />
            
            <View style={styles.wardrobeHeader}>
              <Text style={styles.wardrobeTitle}>Tủ đồ của pet</Text>
              <TouchableOpacity style={styles.wardrobeCloseBtn} onPress={() => setIsWardrobeVisible(false)}>
                <Ionicons name="close" size={20} color={C.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.wardrobeTabs}>
              {['Đồ ăn', 'Trang phục', 'Nội thất'].map(tab => (
                <TouchableOpacity 
                  key={tab} 
                  style={[styles.wardrobeTab, wardrobeTab === tab && styles.wardrobeTabActive]}
                  onPress={() => setWardrobeTab(tab)}
                >
                  <Text style={[styles.wardrobeTabText, wardrobeTab === tab && styles.wardrobeTabTextActive]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.wardrobeGrid}>
              {wardrobeItems[wardrobeTab].map((item, idx) => (
                <TouchableOpacity 
                  key={idx} 
                  style={[styles.wardrobeItem, equippedItem === item && styles.wardrobeItemEquipped]}
                  onPress={() => setEquippedItem(equippedItem === item ? null : item)}
                >
                  <Text style={styles.wardrobeItemEmoji}>{item}</Text>
                  {equippedItem === item && (
                    <View style={styles.equippedBadge}>
                      <Ionicons name="checkmark" size={12} color="#FFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function QuickAction({ icon, label, color, onPress }: { icon: any; label: string; color: string; onPress?: () => void }) { return <Pressable onPress={onPress} style={[styles.quickAction, { backgroundColor: `${color}12` }]}><Ionicons name={icon} size={22} color={color} /><Text style={[styles.quickLabel, { color }]}>{label}</Text></Pressable>; }

const styles = StyleSheet.create({
  topSection: { backgroundColor: '#F9E9D2', marginHorizontal: -20, marginTop: -20, paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, marginBottom: 24 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  starPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, gap: 6 },
  starText: { color: C.primary, fontWeight: '800', fontSize: 15 },
  bagBtn: { width: 44, height: 44, backgroundColor: '#FFF', borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  
  mascotContainer: { alignItems: 'center', marginTop: 20, height: 180 },
  speechBubble: { backgroundColor: '#F8A959', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, marginBottom: 12, position: 'relative' },
  speechText: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  speechArrow: { position: 'absolute', bottom: -8, left: '50%', marginLeft: -8, width: 0, height: 0, borderLeftWidth: 8, borderRightWidth: 8, borderTopWidth: 8, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#F8A959' },
  mascotEmoji: { fontSize: 120 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, marginTop: 4 }, countPill: { backgroundColor: C.primarySoft }, countText: { color: C.primary, fontWeight: '700', fontSize: 11 },
  taskCard: { minHeight: 86, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 10 }, taskDone: { backgroundColor: '#F1F9D7', borderColor: '#E2F19F' }, taskIcon: { width: 56, height: 56, borderRadius: 16, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: 12 }, taskEmoji: { fontSize: 30 }, taskCopy: { flex: 1 }, taskTitle: { color: C.text, fontSize: 14, fontWeight: '700', marginBottom: 7 }, taskMeta: { flexDirection: 'row', alignItems: 'center' }, xpBadge: { marginLeft: 8, backgroundColor: C.orangeSoft, borderRadius: 999, paddingHorizontal: 7, paddingVertical: 3 }, xpBadgeText: { color: '#B36A00', fontSize: 10, fontWeight: '800' },
  badgesCard: { ...L.card, padding: 14, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 }, badge: { width: 54, height: 54, borderRadius: 16, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' }, badgeLocked: { backgroundColor: '#EEF0F8' }, badgeEmoji: { fontSize: 26 },
  quickRow: { flexDirection: 'row', gap: 10, marginTop: 2 }, quickAction: { width: 72, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 4, alignItems: 'center', gap: 5 }, quickLabel: { fontSize: 11, fontWeight: '700' },

  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(17,24,70,.48)' },
  wardrobeModal: { backgroundColor: '#F8FAFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40, minHeight: '60%' },
  wardrobeHandle: { width: 40, height: 4, borderRadius: 4, backgroundColor: '#E4E7F0', alignSelf: 'center', marginBottom: 24 },
  wardrobeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  wardrobeTitle: { fontSize: 20, fontWeight: '900', color: '#1B2444' },
  wardrobeCloseBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E7EBFF', justifyContent: 'center', alignItems: 'center' },
  wardrobeTabs: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  wardrobeTab: { flex: 1, paddingVertical: 12, borderRadius: 16, backgroundColor: '#E7EBFF', alignItems: 'center' },
  wardrobeTabActive: { backgroundColor: C.primary },
  wardrobeTabText: { color: C.primary, fontSize: 13, fontWeight: '800', opacity: 0.6 },
  wardrobeTabTextActive: { color: '#FFF', opacity: 1 },
  wardrobeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 },
  wardrobeItem: { width: '30%', aspectRatio: 1, backgroundColor: '#E3F59F', borderRadius: 20, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  wardrobeItemEquipped: { borderWidth: 3, borderColor: C.primary },
  wardrobeItemEmoji: { fontSize: 40 },
  equippedBadge: { position: 'absolute', top: -6, right: -6, width: 24, height: 24, borderRadius: 12, backgroundColor: C.green, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  
  wishCostPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF5EB', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 16 },
  wishCostText: { color: '#E85D04', fontSize: 13, fontWeight: '800', marginRight: 4 },
  wishPrompt: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 12 },
  wishInputContainer: { backgroundColor: '#F0F2FA', borderRadius: 16, padding: 16, minHeight: 100, marginBottom: 20 },
  wishInput: { fontSize: 15, color: C.text, fontWeight: '600' },
  recordSection: { alignItems: 'center', marginBottom: 30 },
  orText: { fontSize: 13, color: C.muted, fontWeight: '700', marginBottom: 12 },
  recordBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center', shadowColor: C.primary, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  recordingActive: { backgroundColor: '#FF4785' },
  recordingText: { marginTop: 12, color: '#FF4785', fontSize: 13, fontWeight: '800' },
  wishSubmitBtn: { backgroundColor: C.primary, height: 56, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  wishSubmitText: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});
