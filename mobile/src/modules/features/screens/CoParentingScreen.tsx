import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Text, Modal, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
import { inviteFamilyMember, useAppDispatch, useAppSelector } from '@/shared/store';

export default function CoParentingScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { child, familyMembers: members } = useAppSelector((state) => state.kidlife);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [invitePhone, setInvitePhone] = useState('');
  const [selectedRole, setSelectedRole] = useState('parent');

  const handleInvite = () => {
    if (!invitePhone.trim()) return;
    dispatch(inviteFamilyMember({
      name: `Thành viên (${invitePhone})`,
      phone: invitePhone,
      role: selectedRole as 'parent' | 'grandparent',
    }));
    setShowInviteModal(false);
    setInvitePhone('');
    Alert.alert('✅ Gửi lời mời thành công!', `Đã gửi liên kết tham gia gia đình tới số điện thoại ${invitePhone}.`);
  };

  return (
    <ScrollView style={L.screen} contentContainerStyle={[L.content, { paddingTop: 50 }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={C.primary} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.overline}>GIA ĐÌNH & PHÂN QUYỀN RBAC</Text>
          <Text style={styles.title}>Đồng Quản Lý 👨‍👩‍👧‍👦</Text>
        </View>
        <View style={styles.badgePill}>
          <Text style={styles.badgePillText}>{members.length} thành viên</Text>
        </View>
      </View>

      {/* Overview Banner */}
      <View style={styles.bannerCard}>
        <Text style={styles.bannerTitle}>Cùng nuôi dạy bé {child.name}</Text>
        <Text style={styles.bannerSub}>Mời thêm Bố, Mẹ, Ông Nội, Bà Nội cùng tham gia giao task & xem thành tựu của bé.</Text>

        <TouchableOpacity style={styles.inviteCtaBtn} onPress={() => setShowInviteModal(true)}>
          <Ionicons name="person-add" size={18} color="#FFF" />
          <Text style={styles.inviteCtaText}>Mời thành viên gia đình</Text>
        </TouchableOpacity>
      </View>

      {/* Members List */}
      <Text style={[L.sectionTitle, { marginBottom: 12 }]}>Danh sách thành viên gia đình</Text>

      <View style={styles.memberBox}>
        {members.map((m) => (
          <View key={m.id} style={styles.memberRow}>
            <Text style={{ fontSize: 32, marginRight: 12 }}>{m.avatar}</Text>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.memberName}>{m.name}</Text>
                {m.status === 'pending' && (
                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingBadgeText}>Chờ chấp nhận</Text>
                  </View>
                )}
              </View>
              <Text style={styles.memberMeta}>{m.roleLabel} • {m.phone}</Text>
            </View>

            <Ionicons name="ellipsis-vertical" size={18} color={C.muted} />
          </View>
        ))}
      </View>

      {/* Permission Explanation (RBAC) */}
      <View style={[L.card, styles.rbacInfoCard]}>
        <Text style={L.sectionTitle}>Bảng Phân Quyền Vai Trò (RBAC)</Text>
        <View style={styles.rbacItem}>
          <Text style={styles.rbacRole}>👑 Admin (Phụ huynh chính):</Text>
          <Text style={styles.rbacDesc}>Toàn quyền quản lý tài chính, duyệt phạt, mời thành viên.</Text>
        </View>
        <View style={styles.rbacItem}>
          <Text style={styles.rbacRole}>👨‍👩‍👧 Phụ huynh:</Text>
          <Text style={styles.rbacDesc}>Tạo & duyệt nhiệm vụ, theo dõi báo cáo kỹ năng AI.</Text>
        </View>
        <View style={styles.rbacItem}>
          <Text style={styles.rbacRole}>👴👵 Ông / Bà:</Text>
          <Text style={styles.rbacDesc}>Chỉ xem ảnh nhật ký, bắn tim & gửi phần thưởng cho bé.</Text>
        </View>
      </View>

      {/* Invite Modal */}
      <Modal visible={showInviteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>👨‍👩‍👧‍👦 Mời thành viên mới</Text>
              <Pressable onPress={() => setShowInviteModal(false)}>
                <Ionicons name="close-circle" size={24} color={C.muted} />
              </Pressable>
            </View>

            <Text style={styles.label}>Số điện thoại:</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nhập SĐT (VD: 0912345678)"
              keyboardType="phone-pad"
              placeholderTextColor={C.muted}
              value={invitePhone}
              onChangeText={setInvitePhone}
            />

            <Text style={styles.label}>Chọn vai trò:</Text>
            <View style={styles.rolePickerRow}>
              {[
                { id: 'parent', label: 'Phụ huynh' },
                { id: 'grandparent', label: 'Ông / Bà' },
              ].map((r) => (
                <Pressable
                  key={r.id}
                  style={[styles.roleChip, selectedRole === r.id && styles.roleChipActive]}
                  onPress={() => setSelectedRole(r.id)}
                >
                  <Text style={[styles.roleChipText, selectedRole === r.id && styles.roleChipTextActive]}>{r.label}</Text>
                </Pressable>
              ))}
            </View>

            <TouchableOpacity style={styles.submitInviteBtn} onPress={handleInvite}>
              <Text style={styles.submitInviteText}>Gửi lời mời ngay</Text>
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
  badgePill: { backgroundColor: C.primarySoft, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  badgePillText: { color: C.primary, fontSize: 10, fontWeight: '800' },

  bannerCard: { backgroundColor: C.primary, borderRadius: 22, padding: 20, marginBottom: 20 },
  bannerTitle: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  bannerSub: { color: '#DCE2FF', fontSize: 12, marginTop: 4, marginBottom: 16, lineHeight: 18 },
  inviteCtaBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.orange, borderRadius: 14, paddingVertical: 12 },
  inviteCtaText: { color: '#FFF', fontSize: 13, fontWeight: '800' },

  memberBox: { ...L.card, paddingHorizontal: 16, marginBottom: 20 },
  memberRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  memberName: { color: C.text, fontSize: 14, fontWeight: '800' },
  memberMeta: { color: C.muted, fontSize: 11, marginTop: 3 },
  pendingBadge: { backgroundColor: C.orangeSoft, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  pendingBadgeText: { color: C.orange, fontSize: 9, fontWeight: '800' },

  rbacInfoCard: { padding: 18, marginBottom: 20 },
  rbacItem: { marginTop: 12 },
  rbacRole: { color: C.primary, fontSize: 13, fontWeight: '800' },
  rbacDesc: { color: C.muted, fontSize: 11, marginTop: 2, lineHeight: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, width: '100%', maxWidth: 360 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  modalTitle: { color: C.text, fontSize: 18, fontWeight: '800' },
  label: { color: C.text, fontSize: 12, fontWeight: '700', marginBottom: 6 },
  modalInput: { backgroundColor: '#F0F2FA', borderRadius: 12, paddingHorizontal: 14, height: 44, fontSize: 14, color: C.text, marginBottom: 14 },
  rolePickerRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  roleChip: { flex: 1, backgroundColor: '#F0F2FA', borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  roleChipActive: { backgroundColor: C.primary },
  roleChipText: { color: C.muted, fontSize: 12, fontWeight: '700' },
  roleChipTextActive: { color: '#FFF' },
  submitInviteBtn: { backgroundColor: C.primary, borderRadius: 14, paddingVertical: 13, alignItems: 'center' },
  submitInviteText: { color: '#FFF', fontSize: 13, fontWeight: '800' },
});
