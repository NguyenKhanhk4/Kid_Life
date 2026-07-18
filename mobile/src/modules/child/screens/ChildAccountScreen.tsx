import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';

export default function ChildAccountScreen() {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  
  // Pet State
  const [petName, setPetName] = useState('Bún bò');
  const [petType, setPetType] = useState('Chuột Hamster');
  const [petAge, setPetAge] = useState('15 ngày');
  const [petEmoji, setPetEmoji] = useState('🐹');
  
  // Form State
  const [editName, setEditName] = useState(petName);
  const [editAge, setEditAge] = useState(petAge);
  
  // Child Info State (Mock)
  const childInfo = {
    name: 'Nguyễn Minh Anh',
    nickname: 'Su Su',
    dob: '19/05/2018',
    age: '8 tuổi',
    parent: 'Nguyễn Hồng Minh'
  };

  const handleChangePetType = () => {
    Alert.alert(
      'Đổi thú cưng', 
      'Bạn có muốn dùng 50 Sao để đổi sang Mèo con (🐱) không?', 
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Đổi ngay (50 Sao)', 
          onPress: () => {
            setPetType('Mèo con');
            setPetEmoji('🐱');
            Alert.alert('Thành công!', 'Thú cưng của bạn đã được đổi thành Mèo con.');
          }
        }
      ]
    );
  };

  const handleSavePet = () => {
    setPetName(editName);
    setPetAge(editAge);
    setIsEditModalVisible(false);
    Alert.alert('Thành công', 'Thông tin thú cưng đã được cập nhật!');
  };

  return (
    <ScrollView style={L.screen} contentContainerStyle={L.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Thông tin</Text>
        <View style={styles.settingsBtn}>
          <Ionicons name="settings-outline" size={24} color={C.primary} />
        </View>
      </View>

      {/* Pet Profile Card */}
      <View style={styles.petCard}>
        <View style={styles.petAvatarBg}>
          <Text style={styles.petAvatarEmoji}>{petEmoji}</Text>
        </View>
        <View style={styles.petDetails}>
          <View style={styles.petNameRow}>
            <Text style={styles.petName}>{petName}</Text>
            <TouchableOpacity style={styles.editBtn} onPress={() => {
              setEditName(petName);
              setEditAge(petAge);
              setIsEditModalVisible(true);
            }}>
              <Ionicons name="pencil" size={16} color={C.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.petStatRow}>
            <Text style={styles.petStatLabel}>Chủng loại</Text>
            <Text style={styles.petStatValue}>{petType}</Text>
          </View>
          <View style={styles.petStatRow}>
            <Text style={styles.petStatLabel}>Tuổi</Text>
            <Text style={styles.petStatValue}>{petAge}</Text>
          </View>
          <View style={styles.petStatRow}>
            <Text style={styles.petStatLabel}>Cấp độ</Text>
            <Text style={styles.petStatValue}>Cấp 5</Text>
          </View>
        </View>
      </View>

      {/* Chuỗi học tập */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="flame-outline" size={24} color={C.primary} />
          <Text style={styles.sectionTitle}>Chuỗi học tập</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakBadgeText}>🔥 12 ngày</Text>
        </View>
      </View>

      <View style={styles.streakCard}>
        <View style={styles.streakDays}>
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, index) => {
            const isActive = index < 5;
            return (
              <View key={day} style={styles.streakDay}>
                <Text style={styles.streakDayLabel}>{day}</Text>
                <View style={[styles.streakCircle, isActive ? styles.streakCircleActive : styles.streakCircleInactive]}>
                  {isActive ? <Text style={{fontSize: 16}}>🔥</Text> : <Text style={{color: '#D1D5E4'}}>-</Text>}
                </View>
                {index === 4 && <View style={styles.streakDot} />}
              </View>
            )
          })}
        </View>
      </View>

      {/* Thông tin bé */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="person-outline" size={24} color={C.primary} />
          <Text style={styles.sectionTitle}>Thông tin bé</Text>
        </View>
      </View>

      <View style={styles.childInfoCard}>
        <View style={styles.childInfoRow}>
          <View style={[styles.childInfoIcon, {backgroundColor: '#EEF8D5'}]}><Ionicons name="person-outline" size={20} color="#607D0B" /></View>
          <View style={styles.childInfoTextContainer}>
            <Text style={styles.childInfoLabel}>Tên</Text>
            <Text style={styles.childInfoValue}>{childInfo.name}</Text>
          </View>
        </View>
        <View style={styles.childInfoDivider} />
        
        <View style={styles.childInfoRow}>
          <View style={[styles.childInfoIcon, {backgroundColor: '#EEF8D5'}]}><Ionicons name="heart-outline" size={20} color="#607D0B" /></View>
          <View style={styles.childInfoTextContainer}>
            <Text style={styles.childInfoLabel}>Tên thân mật</Text>
            <Text style={styles.childInfoValue}>{childInfo.nickname}</Text>
          </View>
        </View>
        <View style={styles.childInfoDivider} />
        
        <View style={styles.childInfoRow}>
          <View style={[styles.childInfoIcon, {backgroundColor: '#EEF8D5'}]}><Ionicons name="calendar-outline" size={20} color="#607D0B" /></View>
          <View style={styles.childInfoTextContainer}>
            <Text style={styles.childInfoLabel}>Ngày sinh</Text>
            <Text style={styles.childInfoValue}>{childInfo.dob}</Text>
          </View>
        </View>
        <View style={styles.childInfoDivider} />
        
        <View style={styles.childInfoRow}>
          <View style={[styles.childInfoIcon, {backgroundColor: '#EEF8D5'}]}><Ionicons name="gift-outline" size={20} color="#607D0B" /></View>
          <View style={styles.childInfoTextContainer}>
            <Text style={styles.childInfoLabel}>Tuổi</Text>
            <Text style={styles.childInfoValue}>{childInfo.age}</Text>
          </View>
        </View>
        <View style={styles.childInfoDivider} />
        
        <View style={styles.childInfoRow}>
          <View style={[styles.childInfoIcon, {backgroundColor: '#EEF8D5'}]}><Ionicons name="people-outline" size={20} color="#607D0B" /></View>
          <View style={styles.childInfoTextContainer}>
            <Text style={styles.childInfoLabel}>Phụ huynh</Text>
            <Text style={styles.childInfoValue}>{childInfo.parent}</Text>
          </View>
        </View>
      </View>

      <Pressable style={styles.switchBtn}>
        <Ionicons name="swap-horizontal" size={20} color={C.primary} />
        <Text style={styles.switchBtnText}>Chuyển sang tài khoản phụ huynh</Text>
      </Pressable>
      
      <View style={{height: 40}} />

      {/* Edit Modal */}
      <Modal visible={isEditModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Chỉnh sửa thú cưng</Text>
            
            <Text style={styles.inputLabel}>Tên thú cưng</Text>
            <TextInput 
              style={styles.textInput} 
              value={editName}
              onChangeText={setEditName}
            />
            
            <Text style={styles.inputLabel}>Tuổi</Text>
            <TextInput 
              style={styles.textInput} 
              value={editAge}
              onChangeText={setEditAge}
            />

            <View style={styles.changePetSection}>
              <Text style={styles.inputLabel}>Chủng loại</Text>
              <View style={styles.changePetRow}>
                <Text style={styles.currentPetType}>{petType} ({petEmoji})</Text>
                <TouchableOpacity style={styles.changePetBtn} onPress={handleChangePetType}>
                  <Text style={styles.changePetBtnText}>Đổi Pet</Text>
                  <Ionicons name="star" size={12} color={C.orange} style={{marginLeft: 4}} />
                </TouchableOpacity>
              </View>
              <Text style={styles.changePetHint}>Lưu ý: Bạn cần dùng 50 Sao để đổi sang thú cưng khác.</Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsEditModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSavePet}>
                <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, marginBottom: 20 },
  title: { color: C.text, fontSize: 32, fontWeight: '900' },
  settingsBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E7EBFF', justifyContent: 'center', alignItems: 'center' },
  
  petCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 24, padding: 16, marginBottom: 24, shadowColor: C.shadow, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  petAvatarBg: { width: 100, height: 110, borderRadius: 16, backgroundColor: '#E7EBFF', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  petAvatarEmoji: { fontSize: 60 },
  petDetails: { flex: 1, justifyContent: 'center' },
  petNameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  petName: { fontSize: 20, fontWeight: '800', color: C.primary },
  editBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F0F2FA', justifyContent: 'center', alignItems: 'center' },
  petStatRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  petStatLabel: { fontSize: 12, color: C.muted },
  petStatValue: { fontSize: 12, fontWeight: '800', color: '#3A4A7A' },
  
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#1B2444' },
  streakBadge: { backgroundColor: '#FFF5EB', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  streakBadgeText: { color: '#E85D04', fontSize: 12, fontWeight: '700' },
  
  streakCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginBottom: 24, shadowColor: C.shadow, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  streakDays: { flexDirection: 'row', justifyContent: 'space-between' },
  streakDay: { alignItems: 'center' },
  streakDayLabel: { fontSize: 11, color: C.muted, marginBottom: 8 },
  streakCircle: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  streakCircleActive: { backgroundColor: '#FF8A00' },
  streakCircleInactive: { backgroundColor: '#F8F9FD' },
  streakDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00C48C', marginTop: 6 },
  
  childInfoCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginBottom: 24, shadowColor: C.shadow, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  childInfoRow: { flexDirection: 'row', alignItems: 'center' },
  childInfoIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  childInfoTextContainer: { flex: 1 },
  childInfoLabel: { fontSize: 11, color: C.muted, marginBottom: 2 },
  childInfoValue: { fontSize: 14, fontWeight: '800', color: '#3A4A7A' },
  childInfoDivider: { height: 1, backgroundColor: '#F0F2FA', my: 12, marginVertical: 12 },
  
  switchBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, backgroundColor: '#F0F2FA', borderRadius: 16 },
  switchBtnText: { color: C.primary, fontSize: 14, fontWeight: '800' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContainer: { backgroundColor: '#FFF', borderRadius: 24, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: C.text, marginBottom: 24, textAlign: 'center' },
  inputLabel: { fontSize: 13, fontWeight: '700', color: C.text, marginBottom: 8 },
  textInput: { backgroundColor: '#F4F6FB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: C.text, marginBottom: 20 },
  changePetSection: { marginBottom: 24 },
  changePetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F4F6FB', padding: 12, borderRadius: 12 },
  currentPetType: { fontSize: 14, fontWeight: '800', color: C.text },
  changePetBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  changePetBtnText: { fontSize: 12, fontWeight: '800', color: C.primary },
  changePetHint: { fontSize: 11, color: C.orange, marginTop: 8, fontStyle: 'italic' },
  modalActions: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, backgroundColor: '#F4F6FB', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  cancelBtnText: { color: C.muted, fontSize: 14, fontWeight: '800' },
  saveBtn: { flex: 1, backgroundColor: C.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800' }
});
