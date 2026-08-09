import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
import { useAppSelector } from '@/shared/store';
import { ScreenBackButton } from '@/shared/components';
import {
  useApproveRedemption,
  useCreateReward,
  useDeleteReward,
  useRedemptions,
  useRewards,
  useUpdateReward,
  useWallet,
} from '@/shared/hooks/apiHooks';

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu.';

export default function RewardsParentScreen() {
  const child = useAppSelector((state) => state.kidlife.child);
  const wallet = useWallet(child.id);
  const rewards = useRewards();
  const redemptions = useRedemptions('PENDING');
  const createReward = useCreateReward();
  const updateReward = useUpdateReward();
  const archiveReward = useDeleteReward();
  const approveRedemption = useApproveRedemption();
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [cost, setCost] = useState('100');
  const [type, setType] = useState<'VIRTUAL' | 'PHYSICAL'>('VIRTUAL');

  const handleAdd = () => {
    const parsedCost = Number(cost);
    if (!title.trim() || !Number.isInteger(parsedCost) || parsedCost <= 0) {
      Alert.alert('Dữ liệu chưa hợp lệ', 'Hãy nhập tên và số XP nguyên dương.');
      return;
    }
    createReward.mutate(
      { title: title.trim(), cost: parsedCost, type },
      {
        onSuccess: () => {
          setTitle('');
          setCost('100');
          setShowAdd(false);
        },
        onError: (error) =>
          Alert.alert('Không thể tạo phần thưởng', errorMessage(error)),
      },
    );
  };

  const loading =
    wallet.isLoading || rewards.isLoading || redemptions.isLoading;
  const failed = wallet.isError || rewards.isError || redemptions.isError;

  return (
    <>
      <ScrollView
        style={L.screen}
        contentContainerStyle={L.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ScreenBackButton />
          <View style={styles.headerCopy}>
            <Text style={styles.overline}>GAMIFICATION</Text>
            <Text style={styles.title}>Phần thưởng</Text>
            <Text style={styles.subtitle}>Tạo động lực cho bé mỗi ngày</Text>
          </View>
          <Pressable style={styles.addButton} onPress={() => setShowAdd(true)}>
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.addText}>Thêm</Text>
          </Pressable>
        </View>
        {loading && (
          <ActivityIndicator color={C.primary} style={styles.state} />
        )}
        {failed && (
          <View style={styles.state}>
            <Text style={styles.stateText}>
              Không tải được dữ liệu phần thưởng.
            </Text>
            <Pressable
              onPress={() => {
                void wallet.refetch();
                void rewards.refetch();
                void redemptions.refetch();
              }}
            >
              <Text style={styles.retry}>Thử lại</Text>
            </Pressable>
          </View>
        )}
        {!loading && !failed && (
          <>
            <View style={styles.overview}>
              <View style={styles.overviewBlock}>
                <Text style={styles.overviewValue}>
                  {(wallet.data?.availableBalance ?? 0).toLocaleString('vi-VN')}
                </Text>
                <Text style={styles.overviewLabel}>XP của bé {child.name}</Text>
              </View>
              <View style={styles.verticalLine} />
              <View style={styles.overviewBlock}>
                <Text style={[styles.overviewValue, { color: C.orange }]}>
                  {redemptions.data?.length ?? 0}
                </Text>
                <Text style={styles.overviewLabel}>Yêu cầu chờ duyệt</Text>
              </View>
            </View>
            <View style={styles.sectionHeader}>
              <Text style={L.sectionTitle}>Danh sách phần thưởng</Text>
              <Text style={styles.filterText}>Đang hoạt động</Text>
            </View>
            {rewards.data?.length === 0 && (
              <Text style={styles.empty}>Chưa có phần thưởng nào.</Text>
            )}
            {rewards.data?.map((reward) => (
              <View key={reward._id} style={[L.card, styles.rewardCard]}>
                <View style={styles.rewardTop}>
                  <View style={styles.iconBox}>
                    <Text style={styles.icon}>🎁</Text>
                  </View>
                  <View style={styles.rewardCopy}>
                    <Text style={styles.rewardTitle}>{reward.title}</Text>
                    <Text style={styles.rewardDetail}>
                      {reward.description ||
                        (reward.type === 'VIRTUAL' ? 'Trải nghiệm' : 'Vật lý')}
                    </Text>
                  </View>
                  <Pressable
                    disabled={updateReward.isPending || archiveReward.isPending}
                    onPress={() =>
                      reward.status === 'ACTIVE'
                        ? archiveReward.mutate(reward._id, {
                            onError: (error) =>
                              Alert.alert('Không thể lưu', errorMessage(error)),
                          })
                        : updateReward.mutate(
                            { id: reward._id, data: { status: 'ACTIVE' } },
                            {
                              onError: (error) =>
                                Alert.alert(
                                  'Không thể lưu',
                                  errorMessage(error),
                                ),
                            },
                          )
                    }
                  >
                    <View
                      style={[
                        styles.switch,
                        reward.status === 'ACTIVE' && styles.switchActive,
                      ]}
                    >
                      <View
                        style={[
                          styles.switchThumb,
                          reward.status === 'ACTIVE' &&
                            styles.switchThumbActive,
                        ]}
                      />
                    </View>
                  </Pressable>
                </View>
                <View style={styles.rewardBottom}>
                  <View style={styles.costPill}>
                    <Ionicons name="star" size={14} color={C.orange} />
                    <Text style={styles.costText}>{reward.cost} XP</Text>
                  </View>
                </View>
              </View>
            ))}
            <View style={styles.sectionHeader}>
              <Text style={L.sectionTitle}>Yêu cầu đổi thưởng</Text>
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingText}>
                  {redemptions.data?.length ?? 0} mới
                </Text>
              </View>
            </View>
            <View style={[L.card, styles.redemptionCard, { marginBottom: 30 }]}>
              {redemptions.data?.length === 0 && (
                <Text style={styles.empty}>Không có yêu cầu đang chờ.</Text>
              )}
              {redemptions.data?.map((request) => (
                <View key={request._id} style={styles.redemption}>
                  <Text style={styles.redemptionIcon}>🎁</Text>
                  <View style={styles.redemptionCopy}>
                    <Text style={styles.redemptionTitle}>
                      Bé muốn đổi “{request.rewardTitleSnapshot}”
                    </Text>
                    <Text style={styles.redemptionMeta}>
                      {request.costSnapshot} XP •{' '}
                      {new Date(request.createdAt).toLocaleDateString('vi-VN')}
                    </Text>
                  </View>
                  <Pressable
                    disabled={approveRedemption.isPending}
                    style={styles.approve}
                    onPress={() =>
                      approveRedemption.mutate(
                        { redemptionId: request._id, approved: true },
                        {
                          onError: (error) =>
                            Alert.alert('Không thể duyệt', errorMessage(error)),
                        },
                      )
                    }
                  >
                    <Ionicons name="checkmark" size={17} color="#FFF" />
                  </Pressable>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
      <Modal
        visible={showAdd}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAdd(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm phần thưởng mới</Text>
              <Pressable onPress={() => setShowAdd(false)}>
                <Ionicons name="close" size={22} color={C.muted} />
              </Pressable>
            </View>
            <Text style={styles.fieldLabel}>Tên phần thưởng</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="VD: 15 phút chơi game"
            />
            <Text style={styles.fieldLabel}>Giá đổi (XP)</Text>
            <TextInput
              style={styles.input}
              value={cost}
              onChangeText={setCost}
              keyboardType="numeric"
            />
            <Text style={styles.fieldLabel}>Loại phần thưởng</Text>
            <View style={styles.typeRow}>
              {(
                [
                  ['VIRTUAL', 'Trải nghiệm'],
                  ['PHYSICAL', 'Vật lý'],
                ] as const
              ).map(([value, label]) => (
                <Pressable
                  key={value}
                  style={[
                    styles.typeChip,
                    type === value && styles.typeChipActive,
                  ]}
                  onPress={() => setType(value)}
                >
                  <Text
                    style={[
                      styles.typeText,
                      type === value && styles.typeTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable
              disabled={createReward.isPending}
              style={styles.submitReward}
              onPress={handleAdd}
            >
              <Text style={styles.submitRewardText}>
                {createReward.isPending ? 'Đang tạo…' : 'Tạo phần thưởng'}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    marginBottom: 20,
  },
  headerCopy: { flex: 1, marginHorizontal: 12 },
  overline: {
    color: C.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  title: { color: C.text, fontSize: 23, fontWeight: '800', marginTop: 3 },
  subtitle: { color: C.muted, fontSize: 12, marginTop: 3 },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: C.primary,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  addText: { color: '#FFF', fontWeight: '800', fontSize: 12 },
  state: { paddingVertical: 36, alignItems: 'center' },
  stateText: { color: C.muted, marginBottom: 8 },
  retry: { color: C.primary, fontWeight: '800' },
  empty: { color: C.muted, paddingVertical: 16, textAlign: 'center' },
  overview: {
    flexDirection: 'row',
    backgroundColor: C.primary,
    borderRadius: 20,
    paddingVertical: 18,
    marginBottom: 24,
  },
  overviewBlock: { flex: 1, alignItems: 'center' },
  overviewValue: { color: '#FFF', fontSize: 25, fontWeight: '800' },
  overviewLabel: { color: '#DCE2FF', fontSize: 11, marginTop: 4 },
  verticalLine: { width: 1, backgroundColor: 'rgba(255,255,255,.24)' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterText: { color: C.primary, fontSize: 10, fontWeight: '700' },
  rewardCard: { padding: 15, marginBottom: 10 },
  rewardTop: { flexDirection: 'row', alignItems: 'center' },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: C.orangeSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },
  icon: { fontSize: 28 },
  rewardCopy: { flex: 1 },
  rewardTitle: { color: C.text, fontSize: 14, fontWeight: '800' },
  rewardDetail: { color: C.muted, fontSize: 11, marginTop: 4 },
  switch: {
    width: 39,
    height: 23,
    borderRadius: 12,
    backgroundColor: '#D9DDE9',
    padding: 3,
    justifyContent: 'center',
  },
  switchActive: { backgroundColor: C.green },
  switchThumb: {
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#FFF',
  },
  switchThumbActive: { alignSelf: 'flex-end' },
  rewardBottom: {
    paddingTop: 14,
    marginTop: 13,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  costPill: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    gap: 5,
    backgroundColor: C.orangeSoft,
    paddingVertical: 6,
    paddingHorizontal: 9,
    borderRadius: 999,
  },
  costText: { color: '#B36A00', fontSize: 11, fontWeight: '800' },
  pendingBadge: {
    backgroundColor: C.orangeSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pendingText: { color: '#B36A00', fontSize: 11, fontWeight: '800' },
  redemptionCard: { paddingHorizontal: 14 },
  redemption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  redemptionIcon: { fontSize: 24, marginRight: 10 },
  redemptionCopy: { flex: 1 },
  redemptionTitle: { color: C.text, fontSize: 12, fontWeight: '700' },
  redemptionMeta: { color: C.muted, fontSize: 11, marginTop: 4 },
  approve: {
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor: C.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  modalTitle: { color: C.text, fontSize: 18, fontWeight: '800' },
  fieldLabel: {
    color: C.text,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    minHeight: 46,
    borderRadius: 12,
    backgroundColor: '#F0F2FA',
    color: C.text,
    paddingHorizontal: 13,
    marginBottom: 14,
  },
  typeRow: { flexDirection: 'row', gap: 7, marginBottom: 18 },
  typeChip: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#F0F2FA',
    alignItems: 'center',
  },
  typeChipActive: { backgroundColor: C.primary },
  typeText: { color: C.muted, fontSize: 10, fontWeight: '700' },
  typeTextActive: { color: '#FFF' },
  submitReward: {
    minHeight: 48,
    borderRadius: 13,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitRewardText: { color: '#FFF', fontSize: 13, fontWeight: '800' },
});
