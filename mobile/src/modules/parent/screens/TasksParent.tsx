import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import { styles, COLORS } from './TasksParent.styles';

const TODAY = '07';

// Mock Data with dates
const MOCK_TASKS = [
  // Day 06 (Past)
  {
    id: 1, date: '06', title: 'Dọn dẹp đồ chơi', time: '18:30 - 19:00', stars: 1, xp: 30, category: 'Vệ sinh', emoji: '🧸',
    status: 'ai_duyet', 
  },
  {
    id: 2, date: '06', title: 'Tự gấp quần áo của...', time: '18:30 - 19:00', stars: 1, xp: 30, category: 'Vệ sinh', emoji: '👕',
    status: 'da_duyet',
  },
  {
    id: 3, date: '06', title: 'Lau bàn sau bữa ăn', time: '18:30 - 19:00', stars: 1, xp: 30, category: 'Vệ sinh', emoji: '🪑',
    status: 'ai_duyet',
  },

  // Day 07 (Today)
  {
    id: 4, date: '07', title: 'Dọn dẹp đồ chơi', time: '18:30 - 19:00', stars: 1, xp: 30, category: 'Vệ sinh', emoji: '🧸',
    status: 'chua_kiem_tra', 
  },
  {
    id: 5, date: '07', title: 'Tự gấp quần áo của...', time: '18:30 - 19:00', stars: 2, xp: 50, category: 'Sắp xếp', emoji: '👕',
    status: 'da_duyet',
  },
  {
    id: 6, date: '07', title: 'Lau bàn sau bữa ăn', time: '18:30 - 19:00', stars: 1, xp: 30, category: 'Vệ sinh', emoji: '🪑',
    status: 'dang_thuc_hien', progress: 50,
  },
  {
    id: 7, date: '07', title: 'Tự đánh răng trước khi đi ngủ', time: '18:30 - 19:00', stars: 1, xp: 30, category: 'Vệ sinh', emoji: '🦷',
    status: 'chua_thuc_hien', 
  },
  {
    id: 8, date: '07', title: 'Xếp sách vở cho vào cặp sách', time: '18:30 - 19:00', stars: 1, xp: 30, category: 'Vệ sinh', emoji: '📔',
    status: 'chua_thuc_hien', 
  },
];

const WEEK_DAYS = [
  { name: 'Thứ 2', date: '06' },
  { name: 'Thứ 3', date: '07' },
  { name: 'Thứ 4', date: '08' },
  { name: 'Thứ 5', date: '09' },
  { name: 'Thứ 6', date: '10' },
  { name: 'Thứ 7', date: '11' },
  { name: 'Chủ nhật', date: '12' },
];

const FILTERS = ['Tất cả', 'Ai duyệt', 'Đang thực hiện', 'Chưa thực hiện'];

const MOCK_EMOJIS = ['🧸', '📖', '🎨', '🌱', '🍳', '🧹', '😊', '🤝', '💪', '🎵', '⚽', '🦷', '🧼'];
const MOCK_SKILLS = ['Tự lập', 'Giao tiếp', 'Sức khỏe', 'Sáng tạo', 'Trách nhiệm', 'Ngôn ngữ', 'Cảm xúc'];

export default function TasksParent() {
  const [activeDate, setActiveDate] = useState(TODAY);
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  
  // States cho Form thêm nhiệm vụ
  const [selectedEmoji, setSelectedEmoji] = useState('🧸');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedReward, setSelectedReward] = useState(1);

  // Lọc task theo ngày được chọn
  const filteredTasks = MOCK_TASKS.filter(task => task.date === activeDate);

  const renderStatus = (status: string) => {
    switch (status) {
      case 'da_duyet':
        return (
          <View style={styles.statusBadgeDaDuyet}>
            <Text style={styles.statusBadgeDaDuyetText}>Đã duyệt</Text>
          </View>
        );
      case 'dang_thuc_hien':
        return (
          <View style={styles.statusBadgeDangThucHien}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.white }} />
            <Text style={styles.statusBadgeDangThucHienText}>Đang thực hiện</Text>
          </View>
        );
      case 'ai_duyet':
      case 'chua_kiem_tra':
      case 'chua_thuc_hien':
      default:
        return (
          <View style={styles.statusButtonAiDuyet}>
            <FontAwesome5 name="magic" size={10} color={COLORS.white} />
            <Text style={styles.statusButtonAiDuyetText}>Ai duyệt</Text>
          </View>
        );
    }
  };

  const renderActionButtons = (task: any) => {
    const isToday = task.date === TODAY;

    if (task.status === 'da_duyet') {
      return (
        <View style={styles.taskRow2}>
          <TouchableOpacity style={styles.actionButtonXem}>
            <Ionicons name="eye-outline" size={20} color={COLORS.primary} />
            <Text style={styles.actionButtonXemText}>Xem</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIconBtn}>
            <Ionicons name="refresh" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      );
    }

    if (task.status === 'chua_thuc_hien' && isToday) {
      return (
        <View style={styles.taskRow2}>
          <TouchableOpacity style={styles.actionButtonKiemTra}>
            <Text style={styles.actionButtonKiemTraText}>Kiểm tra</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIconBtnRed}>
            <Feather name="trash-2" size={20} color={COLORS.redIcon} />
          </TouchableOpacity>
        </View>
      );
    }

    // Default for everything else (ai_duyet, dang_thuc_hien, chua_kiem_tra)
    return (
      <View style={styles.taskRow2}>
        <TouchableOpacity style={styles.actionButtonKiemTra}>
          <Text style={styles.actionButtonKiemTraText}>Kiểm tra</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionIconBtn}>
          <Ionicons name="refresh" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderAddModal = () => {
    return (
      <Modal visible={isAddModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Thêm nhiệm vụ mới cho bé</Text>
                <Text style={styles.modalSubtitle}>Bước {modalStep} / 4</Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={() => setIsAddModalVisible(false)}>
                <Ionicons name="close" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              {[1, 2, 3, 4].map((step) => (
                <View
                  key={step}
                  style={[
                    styles.progressSegment,
                    step <= modalStep && styles.progressSegmentActive,
                  ]}
                />
              ))}
            </View>

            {/* Content based on step */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {modalStep === 1 && (
                <View>
                  <Text style={styles.inputLabel}>Chọn ngày</Text>
                  <View style={styles.weekSelector}>
                    <TouchableOpacity>
                      <Ionicons name="caret-back" size={16} color={COLORS.primary} />
                    </TouchableOpacity>
                    <View style={styles.weekSelectorCenter}>
                      <Text style={styles.weekSelectorLabel}>Tuần hiện tại</Text>
                      <Text style={styles.weekSelectorDate}>06/07 - 12/07/2025</Text>
                    </View>
                    <TouchableOpacity>
                      <Ionicons name="caret-forward" size={16} color={COLORS.primary} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.calendarStrip}>
                    {WEEK_DAYS.map((day, index) => {
                      const isActive = day.date === TODAY;
                      return (
                        <View key={index} style={styles.dayCol}>
                          <Text style={styles.dayName}>{day.name}</Text>
                          <View style={[styles.dayCircle, isActive && styles.dayCircleActive]}>
                            <Text style={[styles.dayDate, isActive && styles.dayDateActive]}>{day.date}</Text>
                            {isActive ? (
                              <View style={styles.dayDot} />
                            ) : (
                              <View style={styles.dayDotInactive} />
                            )}
                          </View>
                        </View>
                      );
                    })}
                  </View>

                  <Text style={styles.inputLabel}>Thời gian</Text>
                  <View style={styles.timeInputContainer}>
                    <View style={styles.timeInputBox}>
                      <Text style={styles.timeInputText}>20</Text>
                    </View>
                    <Text style={styles.timeSeparator}>:</Text>
                    <View style={styles.timeInputBox}>
                      <Text style={styles.timeInputText}>30</Text>
                    </View>
                    <Feather name="arrow-right" size={20} color={COLORS.primary} />
                    <View style={styles.timeInputBox}>
                      <Text style={styles.timeInputText}>21</Text>
                    </View>
                    <Text style={styles.timeSeparator}>:</Text>
                    <View style={styles.timeInputBox}>
                      <Text style={styles.timeInputText}>00</Text>
                    </View>
                  </View>
                </View>
              )}

              {modalStep === 2 && (
                <View>
                  <Text style={styles.inputLabel}>Tên nhiệm vụ</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="VD: Tự đánh răng buổi sáng..."
                    placeholderTextColor={COLORS.textLight}
                  />

                  <Text style={styles.inputLabel}>Biểu tượng</Text>
                  <View style={styles.iconGrid}>
                    {MOCK_EMOJIS.map((emoji, idx) => (
                      <TouchableOpacity 
                        key={idx} 
                        style={[styles.iconBox, selectedEmoji === emoji && styles.iconBoxActive]}
                        onPress={() => setSelectedEmoji(emoji)}
                      >
                        <Text style={styles.iconText}>{emoji}</Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={[styles.iconBox, styles.iconAddBox]}>
                      <Feather name="plus" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.inputLabel}>Kỹ năng</Text>
                  <View style={styles.skillsGrid}>
                    {MOCK_SKILLS.map((skill, idx) => (
                      <TouchableOpacity 
                        key={idx} 
                        style={[
                          styles.skillTag, 
                          selectedSkill === skill && { backgroundColor: COLORS.primary }
                        ]}
                        onPress={() => setSelectedSkill(skill)}
                      >
                        <Text style={[
                          styles.skillTagText,
                          selectedSkill === skill && { color: COLORS.white }
                        ]}>{skill}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.inputLabel}>Phần thưởng</Text>
                  <View style={styles.rewardsRow}>
                    {[1, 2, 3].map((stars) => (
                      <TouchableOpacity 
                        key={stars}
                        style={[
                          styles.rewardBox,
                          selectedReward === stars && { backgroundColor: '#FFF8E1', borderWidth: 1, borderColor: '#FFA900' }
                        ]}
                        onPress={() => setSelectedReward(stars)}
                      >
                        {Array(stars).fill(0).map((_, i) => (
                          <Ionicons key={i} name="star" size={20} color={COLORS.starText} />
                        ))}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {modalStep === 3 && (
                <View>
                  <Text style={styles.inputLabel}>Mô tả nhiệm vụ</Text>
                  <TextInput
                    style={styles.textArea}
                    placeholder="Mô tả chi tiết nhiệm vụ để tạo video hướng dẫn..."
                    placeholderTextColor={COLORS.textLight}
                    multiline
                  />
                </View>
              )}

              {modalStep === 4 && (
                <View>
                  <View style={styles.aiConfirmBox}>
                    <FontAwesome5 name="magic" size={20} color={COLORS.primary} />
                    <View style={styles.aiConfirmTextGroup}>
                      <Text style={styles.aiConfirmTitle}>AI xác nhận</Text>
                      <Text style={styles.aiConfirmDesc}>Nhiệm vụ phù hợp lứa tuổi và kỹ năng cần thiết!</Text>
                    </View>
                  </View>

                  {/* Giả lập state AI đang tạo / Đã tạo xong */}
                  <View style={styles.aiLoadingContainer}>
                    <View style={styles.aiLoadingCircle} />
                    <Text style={styles.aiLoadingText}>AI đang tạo video hướng dẫn...</Text>
                  </View>
                </View>
              )}

              {/* Bottom Button */}
              {modalStep < 4 ? (
                <TouchableOpacity style={styles.primaryButton} onPress={() => setModalStep(modalStep + 1)}>
                  <Text style={styles.primaryButtonText}>Tiếp theo</Text>
                  <Feather name="arrow-right" size={20} color={COLORS.white} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.primaryButton} onPress={() => { setModalStep(1); setIsAddModalVisible(false); }}>
                  <Text style={styles.primaryButtonText}>Tạo nhiệm vụ mới</Text>
                  <Feather name="arrow-right" size={20} color={COLORS.white} />
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nhiệm vụ của bé</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalVisible(true)}>
          <Feather name="plus" size={16} color={COLORS.white} />
          <Text style={styles.addButtonText}>Thêm</Text>
        </TouchableOpacity>
      </View>

      {/* Week Selector */}
      <View style={styles.weekSelector}>
        <TouchableOpacity>
          <Ionicons name="caret-back" size={16} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.weekSelectorCenter}>
          <Text style={styles.weekSelectorLabel}>Tuần hiện tại</Text>
          <Text style={styles.weekSelectorDate}>06/07 - 12/07/2025</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="caret-forward" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Calendar Strip */}
        <View style={styles.calendarStrip}>
          {WEEK_DAYS.map((day, index) => {
            const isActive = activeDate === day.date;
            return (
              <TouchableOpacity key={index} style={styles.dayCol} onPress={() => setActiveDate(day.date)}>
                <Text style={styles.dayName}>{day.name}</Text>
                <View style={[styles.dayCircle, isActive && styles.dayCircleActive]}>
                  <Text style={[styles.dayDate, isActive && styles.dayDateActive]}>{day.date}</Text>
                  {isActive ? (
                    <View style={styles.dayDot} />
                  ) : (
                    <View style={styles.dayDotInactive} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          {FILTERS.map((filter, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.filterItem, activeFilter === filter && styles.filterItemActive]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Task List */}
        <View style={styles.taskList}>
          {filteredTasks.map((task) => {
            const isToday = task.date === TODAY;
            const iconBgColor = isToday ? COLORS.iconContainerActiveBg : COLORS.iconContainerBg;

            return (
              <View key={task.id} style={styles.taskCard}>
                <View style={styles.taskRow1}>
                  <View style={[styles.taskIconBox, { backgroundColor: iconBgColor }]}>
                    <Text style={styles.taskEmoji}>{task.emoji}</Text>
                  </View>
                  <View style={styles.taskInfo}>
                    <Text style={styles.taskTitle} numberOfLines={1}>{task.title}</Text>
                    <View style={styles.taskTimeRow}>
                      <Feather name="clock" size={12} color={COLORS.textLight} />
                      <Text style={styles.taskTimeText}>{task.time}</Text>
                    </View>
                    <View style={styles.taskTagsRow}>
                      <View style={styles.tagStar}>
                        <Ionicons name="star" size={12} color={COLORS.starText} />
                        <Text style={styles.tagStarText}>{task.stars}</Text>
                      </View>
                      <View style={styles.tagXp}>
                        <Text style={styles.tagXpText}>+{task.xp} XP</Text>
                      </View>
                      <View style={styles.tagCategory}>
                        <Text style={styles.tagCategoryText}>{task.category}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.statusContainer}>
                    {renderStatus(task.status)}
                  </View>
                </View>

                {task.status === 'dang_thuc_hien' && task.progress !== undefined && (
                  <View style={styles.progressRow}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>Tiến độ</Text>
                      <Text style={styles.progressPercent}>{task.progress}%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${task.progress}%` }]} />
                    </View>
                  </View>
                )}

                {renderActionButtons(task)}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Modal Thêm Nhiệm Vụ */}
      {renderAddModal()}
    </SafeAreaView>
  );
}
