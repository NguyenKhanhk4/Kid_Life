import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
  TextInput
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/constants';
import { styles, COLORS } from './HomeParent.styles';

// Mock data
const MOCK_CHILDREN = [
  { id: 1, name: 'Vũ Lương', avatar: '🐥' },
  { id: 2, name: 'Thảo My', avatar: '🐥' },
  { id: 3, name: 'Nhật Linh', avatar: '🐥' },
];

const MOCK_TASKS = [
  { id: 1, title: 'Dọn dẹp đồ chơi', stars: 1, xp: 30, completed: true, emoji: '🧸' },
  { id: 2, title: 'Tự gấp quần áo của mình', stars: 2, xp: 50, completed: true, emoji: '👕' },
  { id: 3, title: 'Lau bàn sau bữa ăn', stars: 1, xp: 30, completed: false, emoji: '🪑' },
  { id: 4, title: 'Tự đánh răng trước khi đi ngủ', stars: 1, xp: 30, completed: false, emoji: '🦷' },
  { id: 5, title: 'Xếp sách vở cho vào cặp sách', stars: 1, xp: 30, completed: false, emoji: '📔' },
];

const MOCK_BADGES = [
  { id: 1, name: 'Siêu sao', icon: 'star', color: '#FFD233', bgColor: '#4A62FF', locked: false },
  { id: 2, name: 'Bé ngoan', icon: 'smile', color: '#FFD233', bgColor: '#4A62FF', locked: false },
  { id: 3, name: 'Chăm chỉ', icon: 'broom', color: '#FFD233', bgColor: '#4A62FF', locked: false },
  { id: 4, name: 'Sáng tạo', icon: 'palette', color: '#A0A7C0', bgColor: '#E8EDFC', locked: true },
  { id: 5, name: 'Dũng cảm', icon: 'shield-alt', color: '#A0A7C0', bgColor: '#E8EDFC', locked: true },
];

export default function HomeParent() {
  const navigation = useNavigation<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChild, setSelectedChild] = useState(MOCK_CHILDREN[0]);

  const [isWishesModalVisible, setIsWishesModalVisible] = useState(false);
  const [wishes, setWishes] = useState([
    { id: 'w1', child: 'Minh Anh', text: 'Con muốn cuối tuần đi nhà bóng', cost: 50, time: 'Hôm nay, 19:30', status: 'pending' },
    { id: 'w2', child: 'Minh Anh', text: 'Mua hộp lego siêu nhân', cost: 50, time: 'Hôm qua, 15:20', status: 'pending' }
  ]);
  const [rejectPromptVisible, setRejectPromptVisible] = useState(false);
  const [rejectingWishId, setRejectingWishId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarEmoji}>🐥</Text>
            {/* TODO: Replace with Figma asset Image */}
          </View>
          <View style={styles.headerTitles}>
            <Text style={styles.greetingText}>Xin chào phụ huynh! 👋</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.childNameSelector}>
              <Text style={styles.childName}>Bé {selectedChild.name}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate(Routes.Main.Profile as any)}>
          <Ionicons name="menu" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Blue Card Summary */}
        <View style={styles.overviewCard}>
          <View style={styles.xpRow}>
            <View style={styles.xpLeft}>
              <Ionicons name="star" size={16} color={COLORS.yellow} />
              <Text style={styles.xpText}> 1,250 XP</Text>
            </View>
            <Text style={styles.levelText}>Cấp 5 → Cấp 6: 1,750 XP</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: '70%' }]} />
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <FontAwesome5 name="fire" size={24} color="#FF6B6B" />
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Ngày liên tiếp</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="star" size={24} color={COLORS.yellow} />
              <Text style={styles.statNumber}>48</Text>
              <Text style={styles.statLabel}>Sao tuần này</Text>
            </View>
            <View style={styles.statBox}>
              <FontAwesome5 name="medal" size={24} color="#FFA900" />
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Huy hiệu mới</Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 8, marginHorizontal: 20, marginBottom: 24 }}>
          {/* Quick Actions (Tủ phần thưởng) */}
          <TouchableOpacity 
            style={{ flex: 1, backgroundColor: `${COLORS.orange}12`, paddingVertical: 12, borderRadius: 14, alignItems: 'center', gap: 4 }}
            onPress={() => navigation.navigate(Routes.Reward.Shop as any, { mode: 'parent' })}
          >
            <Ionicons name="gift" size={20} color={COLORS.orange} />
            <Text style={{ fontSize: 10, fontWeight: '700', color: COLORS.orange }}>Duyệt thưởng</Text>
          </TouchableOpacity>

          {/* Quick Actions (Duyệt điều ước) */}
          <TouchableOpacity 
            style={{ flex: 1, backgroundColor: '#FF478512', paddingVertical: 12, borderRadius: 14, alignItems: 'center', gap: 4 }}
            onPress={() => setIsWishesModalVisible(true)}
          >
            <Text style={{ fontSize: 18 }}>🧞‍♂️</Text>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#FF4785' }}>Duyệt điều ước</Text>
          </TouchableOpacity>

          {/* Quick Actions (Thi đua gia đình) */}
          <TouchableOpacity 
            style={{ flex: 1, backgroundColor: '#8E54E912', paddingVertical: 12, borderRadius: 14, alignItems: 'center', gap: 4 }}
            onPress={() => navigation.navigate(Routes.Features.Leaderboard as any)}
          >
            <Text style={{ fontSize: 18 }}>🏆</Text>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#8E54E9' }}>Thi đua</Text>
          </TouchableOpacity>

          {/* Quick Actions (Ngân hàng ảo) */}
          <TouchableOpacity 
            style={{ flex: 1, backgroundColor: '#2B44E812', paddingVertical: 12, borderRadius: 14, alignItems: 'center', gap: 4 }}
            onPress={() => navigation.navigate(Routes.Features.VirtualBank as any)}
          >
            <Ionicons name="card" size={20} color="#2B44E8" />
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#2B44E8' }}>Ngân hàng ảo</Text>
          </TouchableOpacity>
        </View>

        {/* Nhiệm vụ hôm nay */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="map-outline" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Nhiệm vụ hôm nay</Text>
          </View>
          <View style={styles.taskBadge}>
            <Text style={styles.taskBadgeText}>2/5 hoàn thành</Text>
          </View>
        </View>

        <View style={styles.parentMessageCard}>
          <View style={styles.parentMessageHeader}>
            <Text style={styles.parentMessageIcon}>👨‍👩‍👧</Text>
            <Text style={styles.parentMessageTitle}>Nhắn cho ba mẹ</Text>
          </View>
          <Text style={styles.parentMessageContent}>
            Hôm nay bé Minh Anh đã hoàn thành 2 nhiệm vụ, cải thiện kỹ năng cảm xúc lên 5%. Hãy khen ngợi và động viên bé nhé! 🌸
          </Text>
        </View>

        <View style={styles.taskList}>
          {MOCK_TASKS.map((task) => (
            <View
              key={task.id}
              style={[
                styles.taskItem,
                { backgroundColor: task.completed ? COLORS.taskCompleted : COLORS.taskPending },
              ]}
            >
              <View style={styles.taskIconContainer}>
                <Text style={styles.taskEmoji}>{task.emoji}</Text>
                {/* TODO: Replace with Figma asset Image */}
              </View>
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <View style={styles.taskRewards}>
                  <View style={styles.rewardStar}>
                    <Ionicons name="star" size={12} color={COLORS.orange} />
                    <Text style={styles.rewardStarText}>{task.stars}</Text>
                  </View>
                  <View style={styles.rewardXp}>
                    <Text style={styles.rewardXpText}>+{task.xp} XP</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.taskArrowBtn} onPress={() => navigation.navigate(Routes.Parent.ApprovalQueue as any)}>
                <Ionicons name="arrow-forward" size={20} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Báo cáo tiến độ */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Feather name="activity" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Báo cáo tiến độ</Text>
          </View>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressContent}>
            <View style={styles.circularProgressContainer}>
              {/* Mock Circular Progress */}
              <View style={styles.circularProgressBase}>
                <View style={styles.circularProgressInner}>
                  <Text style={styles.circularProgressPercent}>40%</Text>
                  <Text style={styles.circularProgressLabel}>hôm nay</Text>
                </View>
                <View style={styles.circularProgressActive} />
              </View>
            </View>
            <View style={styles.barChartsContainer}>
              <View style={styles.barChartRow}>
                <View style={styles.barChartHeader}>
                  <Text style={styles.barChartLabel}>Giao tiếp</Text>
                  <Text style={[styles.barChartValue, { color: COLORS.purple }]}>72%</Text>
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { backgroundColor: COLORS.purple, width: '72%' }]} />
                </View>
              </View>
              <View style={styles.barChartRow}>
                <View style={styles.barChartHeader}>
                  <Text style={styles.barChartLabel}>Tự lập</Text>
                  <Text style={[styles.barChartValue, { color: COLORS.green }]}>55%</Text>
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { backgroundColor: COLORS.green, width: '55%' }]} />
                </View>
              </View>
              <View style={styles.barChartRow}>
                <View style={styles.barChartHeader}>
                  <Text style={styles.barChartLabel}>Cảm xúc</Text>
                  <Text style={[styles.barChartValue, { color: COLORS.red }]}>88%</Text>
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { backgroundColor: COLORS.red, width: '88%' }]} />
                </View>
              </View>
              <View style={styles.barChartRow}>
                <View style={styles.barChartHeader}>
                  <Text style={styles.barChartLabel}>Sáng tạo</Text>
                  <Text style={[styles.barChartValue, { color: COLORS.orange }]}>40%</Text>
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { backgroundColor: COLORS.orange, width: '40%' }]} />
                </View>
              </View>
            </View>
          </View>
          <View style={styles.trophyBanner}>
            <FontAwesome5 name="trophy" size={24} color={COLORS.orange} />
            <View style={styles.trophyBannerTextContainer}>
              <Text style={styles.trophyBannerTitle}>Tuần này xuất sắc!</Text>
              <Text style={styles.trophyBannerSub}>Bé đã hoàn thành 34/40 nhiệm vụ - top 10% bé ngoan</Text>
            </View>
          </View>
        </View>

        {/* Huy hiệu của bé */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <FontAwesome5 name="trophy" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Huy hiệu của bé</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeScrollView} contentContainerStyle={styles.badgeScrollContent}>
          {MOCK_BADGES.map((badge) => (
            <View key={badge.id} style={styles.badgeItem}>
              <View style={[styles.badgeIconBox, { backgroundColor: badge.bgColor }]}>
                {badge.locked ? (
                  <View style={styles.lockedBadge}>
                    <FontAwesome5 name={badge.icon} size={28} color="#D1D5E4" />
                    <View style={styles.lockIconOverlay}>
                      <FontAwesome5 name="lock" size={10} color={COLORS.textGray} />
                    </View>
                  </View>
                ) : badge.icon === 'smile' ? (
                  <Text style={{fontSize: 28}}>👼</Text>
                ) : (
                  <FontAwesome5 name={badge.icon} size={28} color={badge.color} />
                )}
              </View>
              <Text style={styles.badgeName}>{badge.name}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Modal Chọn Tài Khoản */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn tài khoản con khác</Text>
            {MOCK_CHILDREN.map((child, index) => (
              <TouchableOpacity 
                key={child.id} 
                style={[styles.modalChildItem, index !== MOCK_CHILDREN.length - 1 && styles.modalChildItemBorder]}
                onPress={() => {
                  setSelectedChild(child);
                  setModalVisible(false);
                }}
              >
                <View style={styles.modalAvatarContainer}>
                  <Text style={styles.modalAvatarEmoji}>{child.avatar}</Text>
                  {/* TODO: Replace with Figma asset Image */}
                </View>
                <Text style={styles.modalChildName}>{child.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
      {/* Modal Quản lý Điều ước */}
      <Modal visible={isWishesModalVisible} animationType="slide" transparent={true} onRequestClose={() => setIsWishesModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40, maxHeight: '80%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.textDark }}>Điều ước của bé</Text>
              <TouchableOpacity onPress={() => setIsWishesModalVisible(false)} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#F0F2FA', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="close" size={20} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {wishes.map((wish) => (
                <View key={wish.id} style={{ backgroundColor: '#F9F0FF', borderRadius: 16, padding: 16, marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
                    <Text style={{ fontSize: 32, marginRight: 12 }}>🧞‍♂️</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.textDark, marginBottom: 4 }}>Bé {wish.child} mong muốn:</Text>
                      <Text style={{ fontSize: 16, color: COLORS.primary, fontWeight: '800', marginBottom: 4 }}>"{wish.text}"</Text>
                      <Text style={{ fontSize: 12, color: COLORS.textLight }}>{wish.time} • Đã dùng {wish.cost} Sao</Text>
                    </View>
                  </View>
                  
                  {wish.status === 'pending' ? (
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TouchableOpacity 
                        style={{ flex: 1, backgroundColor: '#FFF', paddingVertical: 10, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: COLORS.green }}
                        onPress={() => {
                          setWishes(w => w.map(item => item.id === wish.id ? {...item, status: 'approved'} : item));
                          Alert.alert('Chấp thuận', 'Bé sẽ rất vui khi biết điều này!');
                        }}
                      >
                        <Text style={{ color: COLORS.green, fontWeight: '700' }}>Thực hiện ngay</Text>
                      </TouchableOpacity>

                      <TouchableOpacity 
                        style={{ flex: 1, backgroundColor: '#FFF', paddingVertical: 10, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: COLORS.orange }}
                        onPress={() => {
                          setRejectingWishId(wish.id);
                          setRejectPromptVisible(true);
                        }}
                      >
                        <Text style={{ color: COLORS.orange, fontWeight: '700' }}>Từ chối</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={{ backgroundColor: '#FFF', padding: 8, borderRadius: 8, alignItems: 'center' }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: wish.status === 'approved' ? COLORS.green : (wish.status === 'converted' ? COLORS.primary : COLORS.orange) }}>
                        {wish.status === 'approved' ? '✓ Đã đồng ý thực hiện' : (wish.status === 'converted' ? '🌟 Đã đưa vào Cửa hàng' : '✕ Đã từ chối (Hoàn 50 Sao)')}
                      </Text>
                    </View>
                  )}
                  {wish.status === 'pending' && (
                    <TouchableOpacity 
                      style={{ backgroundColor: COLORS.primary, paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 8 }}
                      onPress={() => {
                        Alert.alert('Chuyển thành Phần thưởng', 'Điều ước này sẽ được đưa vào cửa hàng với giá do bạn định mức.', [
                          { text: 'Hủy', style: 'cancel' },
                          { text: 'Tạo phần thưởng', onPress: () => {
                            setWishes(w => w.map(item => item.id === wish.id ? {...item, status: 'converted'} : item));
                            Alert.alert('Thành công', 'Đã chuyển vào Cửa hàng phần thưởng!');
                          }}
                        ]);
                      }}
                    >
                      <Text style={{ color: '#FFF', fontWeight: '700' }}>Biến thành Phần thưởng (Cửa hàng)</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal nhập lý do từ chối */}
      <Modal visible={rejectPromptVisible} transparent={true} animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 }}>
          <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.textDark, marginBottom: 8 }}>Từ chối điều ước</Text>
            <Text style={{ fontSize: 14, color: COLORS.textLight, marginBottom: 16 }}>Bé sẽ được hoàn lại 50 Sao. Hãy để lại một lời nhắn động viên cho bé nhé.</Text>
            
            <TextInput
              style={{ backgroundColor: '#F0F2FA', borderRadius: 12, padding: 16, minHeight: 100, textAlignVertical: 'top', marginBottom: 20 }}
              placeholder="VD: Món đồ này khá đắt, con hãy cố gắng làm việc nhà thêm nhé!"
              multiline
              value={rejectReason}
              onChangeText={setRejectReason}
            />
            
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity 
                style={{ flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#F0F2FA', alignItems: 'center' }}
                onPress={() => {
                  setRejectPromptVisible(false);
                  setRejectReason('');
                }}
              >
                <Text style={{ color: COLORS.textDark, fontWeight: '700' }}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{ flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: COLORS.orange, alignItems: 'center' }}
                onPress={() => {
                  if (rejectingWishId) {
                    setWishes(w => w.map(item => item.id === rejectingWishId ? {...item, status: 'rejected'} : item));
                  }
                  setRejectPromptVisible(false);
                  setRejectReason('');
                  Alert.alert('Đã từ chối', 'Đã hoàn lại 50 Sao và gửi lời nhắn cho bé.');
                }}
              >
                <Text style={{ color: '#FFF', fontWeight: '700' }}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
