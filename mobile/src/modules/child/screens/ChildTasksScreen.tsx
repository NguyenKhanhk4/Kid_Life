import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';

const missions = [
  { id: '1', icon: '🧸', title: 'Dọn dẹp đồ chơi', time: '18:30 - 19:00', xp: '+30 XP', category: 'Vệ sinh' },
  { id: '2', icon: '👕', title: 'Tự gấp quần áo của mình', time: '19:00 - 19:15', xp: '+50 XP', category: 'Kỹ năng' },
  { id: '3', icon: '📚', title: 'Xếp sách vở vào cặp', time: '20:00 - 20:15', xp: '+30 XP', category: 'Học tập' },
];

export default function ChildTasksScreen() {
  const [selected, setSelected] = useState<(typeof missions)[number] | null>(null);
  const [submitted, setSubmitted] = useState(false);
  
  const [isWardrobeVisible, setIsWardrobeVisible] = useState(false);
  const [wardrobeTab, setWardrobeTab] = useState('Đồ ăn');
  const [equippedItem, setEquippedItem] = useState<string | null>(null);
  
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
          <View style={styles.starPill}>
            <Ionicons name="star" size={16} color={C.orange} />
            <Text style={styles.starText}>1,250</Text>
          </View>
          <TouchableOpacity style={styles.bagBtn} onPress={() => setIsWardrobeVisible(true)}>
            <Text style={{ fontSize: 22 }}>🎒</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mascotContainer}>
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>Làm nhiệm vụ kiếm sao để mua đồ cho tớ nhé!</Text>
            <View style={styles.speechArrow} />
          </View>
          <Text style={styles.mascotEmoji}>🐹</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
          <Ionicons name="map-outline" size={24} color={C.primary} />
          <Text style={styles.sectionTitle}>Nhiệm vụ hôm nay</Text>
        </View>
        <View style={styles.progressPill}>
          <Text style={styles.progressText}>2/5 hoàn thành</Text>
        </View>
      </View>

      <View style={styles.taskList}>
        {missions.map((mission) => (
          <View key={mission.id} style={styles.taskCard}>
            <View style={styles.taskCardTop}>
              <View style={styles.taskImage}>
                <Text style={styles.taskEmoji}>{mission.icon}</Text>
              </View>
              <View style={styles.taskCopy}>
                <Text style={styles.taskTitle}>{mission.title}</Text>
                
                <View style={styles.taskTime}>
                  <Ionicons name="time-outline" size={14} color={C.muted} />
                  <Text style={styles.taskTimeText}>{mission.time}</Text>
                </View>
                
                <View style={styles.taskTags}>
                  <View style={styles.tagStar}>
                    <Ionicons name="star" size={12} color={C.orange} />
                    <Text style={styles.tagStarText}>1</Text>
                  </View>
                  <View style={styles.tagXp}>
                    <Text style={styles.tagXpText}>{mission.xp}</Text>
                  </View>
                  <View style={styles.tagCategory}>
                    <Text style={styles.tagCategoryText}>{mission.category}</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <TouchableOpacity style={styles.actionBtn} onPress={() => { setSelected(mission); setSubmitted(false); }}>
              <Text style={styles.actionBtnText}>Làm ngay</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={{height: 40}} />

      {/* Upload Modal (Kept unchanged) */}
      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modal}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>{selected?.title}</Text>
                <Text style={styles.modalSubtitle}>Bước 1 / 1  •  {selected?.xp}</Text>
              </View>
              <Pressable onPress={() => setSelected(null)}>
                <Ionicons name="close-circle" size={26} color={C.muted} />
              </Pressable>
            </View>
            
            <View style={styles.aiBox}>
              <Ionicons name="sparkles" size={19} color={C.primary} />
              <View>
                <Text style={styles.aiTitle}>AI gợi ý</Text>
                <Text style={styles.aiBody}>Nhiệm vụ phù hợp với độ tuổi và kỹ năng của bé.</Text>
              </View>
            </View>
            
            <View style={styles.videoPlaceholder}>
              <Text style={styles.videoEmoji}>🎬</Text>
              <Text style={styles.videoText}>Video hướng dẫn nhiệm vụ</Text>
            </View>
            
            <Text style={styles.evidenceTitle}>Ảnh bằng chứng</Text>
            <View style={styles.evidenceBox}>
              <Text style={styles.evidenceEmoji}>{submitted ? '✅' : '📷'}</Text>
              <Text style={styles.evidenceText}>{submitted ? 'Đã gửi bằng chứng cho ba mẹ' : 'Chụp ảnh hoặc chọn từ thư viện'}</Text>
            </View>
            
            <Pressable style={[styles.submitButton, submitted && styles.submittedButton]} onPress={() => setSubmitted(true)}>
              <Text style={styles.submitText}>{submitted ? 'Đã gửi chờ phê duyệt' : 'Nộp bằng chứng'}</Text>
              <Ionicons name={submitted ? 'checkmark' : 'arrow-forward'} size={18} color={submitted ? C.green : '#FFF'} />
            </Pressable>
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
  
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#1B2444' },
  progressPill: { backgroundColor: '#E7EBFF', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  progressText: { color: C.primary, fontSize: 11, fontWeight: '800' },
  
  taskList: { gap: 16 },
  taskCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 16, shadowColor: C.shadow, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  taskCardTop: { flexDirection: 'row', marginBottom: 16 },
  taskImage: { width: 80, height: 80, borderRadius: 16, backgroundColor: '#DDF45B', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  taskEmoji: { fontSize: 40 },
  taskCopy: { flex: 1, justifyContent: 'center' },
  taskTitle: { color: '#1B2444', fontSize: 16, fontWeight: '800', marginBottom: 6 },
  taskTime: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  taskTimeText: { color: C.muted, fontSize: 12, fontWeight: '600' },
  taskTags: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  tagStar: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F0F2FA', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  tagStarText: { color: C.primary, fontSize: 11, fontWeight: '800' },
  tagXp: { backgroundColor: '#F4EBFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  tagXpText: { color: '#9747FF', fontSize: 11, fontWeight: '800' },
  tagCategory: { backgroundColor: '#FFF5EB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  tagCategoryText: { color: '#E85D04', fontSize: 11, fontWeight: '800' },
  
  actionBtn: { width: '100%', backgroundColor: C.primary, paddingVertical: 14, borderRadius: 16, alignItems: 'center' },
  actionBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(17,24,70,.48)' },
  modal: { backgroundColor: C.background, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 20, paddingBottom: 32 },
  modalHandle: { width: 40, height: 4, borderRadius: 4, backgroundColor: '#CDD2E2', alignSelf: 'center', marginBottom: 17 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  modalTitle: { color: C.text, fontSize: 19, fontWeight: '800' },
  modalSubtitle: { color: C.muted, fontSize: 11, marginTop: 4 },
  aiBox: { flexDirection: 'row', gap: 9, backgroundColor: '#EFF7C9', borderRadius: 12, padding: 11, marginTop: 17 },
  aiTitle: { color: C.limeDark, fontSize: 11, fontWeight: '800' },
  aiBody: { color: '#788B3C', fontSize: 10, marginTop: 3 },
  videoPlaceholder: { height: 135, borderRadius: 15, backgroundColor: '#D6DEFF', alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  videoEmoji: { fontSize: 35 },
  videoText: { color: C.primary, fontSize: 11, fontWeight: '700', marginTop: 5 },
  evidenceTitle: { color: C.text, fontSize: 13, fontWeight: '800', marginTop: 17, marginBottom: 8 },
  evidenceBox: { height: 72, borderWidth: 1, borderStyle: 'dashed', borderColor: C.primary, backgroundColor: C.primarySoft, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  evidenceEmoji: { fontSize: 20 },
  evidenceText: { color: C.primary, fontSize: 10, fontWeight: '700', marginTop: 4 },
  submitButton: { height: 52, borderRadius: 14, backgroundColor: C.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 16 },
  submittedButton: { backgroundColor: C.greenSoft },
  submitText: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  
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
  equippedBadge: { position: 'absolute', top: -6, right: -6, width: 24, height: 24, borderRadius: 12, backgroundColor: C.green, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' }
});
