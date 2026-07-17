import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChild, setSelectedChild] = useState(MOCK_CHILDREN[0]);

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
        <TouchableOpacity style={styles.menuButton}>
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

        {/* Chuỗi học tập */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MaterialCommunityIcons name="fire" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Chuỗi học tập</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakBadgeText}>🔥 12 ngày</Text>
          </View>
        </View>

        <View style={styles.streakCard}>
          <View style={styles.daysRow}>
            {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'].map((day, index) => {
              const isActive = index < 5;
              const isToday = index === 4;
              return (
                <View key={index} style={styles.dayCol}>
                  <Text style={styles.dayText}>{day}</Text>
                  <View style={[styles.dayCircle, isActive ? styles.dayCircleActive : styles.dayCircleInactive]}>
                    {isActive ? (
                      <FontAwesome5 name="fire" size={16} color={COLORS.white} />
                    ) : (
                      <View style={styles.dotInactive} />
                    )}
                  </View>
                  {isToday && <View style={styles.todayDot} />}
                </View>
              );
            })}
          </View>
          <Text style={styles.streakMessage}>Tiếp tục để duy trì chuỗi 🎯</Text>
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
              <TouchableOpacity style={styles.taskArrowBtn}>
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
    </SafeAreaView>
  );
}
