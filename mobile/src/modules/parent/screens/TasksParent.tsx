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
import { useNavigation, useRoute, NavigationProp, RouteProp } from '@react-navigation/native';
import { Routes } from '@/navigation/constants';
import { styles, COLORS } from './TasksParent.styles';
import { useQuery } from '@tanstack/react-query';
import { getMissions, getSubmissions } from '@/shared/api/missionApi';

const TODAY = new Date().toISOString().split('T')[0];

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

export default function TasksParent() {
  const navigation = useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const route = useRoute<RouteProp<Record<string, { childId?: string }>, string>>();
  const childId = route.params?.childId;

  const { data: missions, isLoading } = useQuery({
    queryKey: ['missions', childId],
    queryFn: () => {
      if (!childId) return Promise.reject(new Error('Missing childId'));
      return getMissions(childId);
    },
    enabled: !!childId,
  });

  const { data: submissions } = useQuery({
    queryKey: ['submissions', childId],
    queryFn: () => {
      if (!childId) return Promise.reject(new Error('Missing childId'));
      return getSubmissions(childId);
    },
    enabled: !!childId,
  });

  const [activeTab, setActiveTab] = useState<'personal' | 'marketplace'>('personal');
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const [activeDate, setActiveDate] = useState(TODAY);
  // Filter tasks
  const filteredTasks = (missions || []).map((task) => {
    const progress = task.checklist.length
      ? Math.round((task.checklist.filter((item) => item.isDone).length / task.checklist.length) * 100)
      : 0;

    let status = 'chua_thuc_hien';
    const sub = submissions?.find((s) => s.missionId === task._id);
    if (sub) {
      if (sub.status === 'approved') status = 'da_duyet';
      else if (sub.status === 'pending_review') status = 'chua_kiem_tra';
    } else {
      if (progress > 0 && progress < 100) status = 'dang_thuc_hien';
    }

    return {
      id: task._id,
      date: new Date(task.dueDate).toISOString().split('T')[0],
      title: task.title,
      time: new Date(task.dueDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      stars: Math.max(1, Math.round(task.rewardPoints / 30)),
      xp: task.rewardPoints,
      category: task.skillId || 'Kỹ năng',
      emoji: '🎯',
      status,
      progress,
    };
  });

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
      case 'chua_kiem_tra':
        return (
          <View style={styles.statusButtonAiDuyet}>
            <FontAwesome5 name="hourglass-half" size={10} color={COLORS.white} />
            <Text style={styles.statusButtonAiDuyetText}>Chờ duyệt</Text>
          </View>
        );
      case 'chua_thuc_hien':
      default:
        return (
          <View style={styles.statusButtonAiDuyet}>
            <Text style={styles.statusButtonAiDuyetText}>Chưa làm</Text>
          </View>
        );
    }
  };

  const renderActionButtons = (task: { id: string, date: string, status: string }) => {
    const isToday = task.date === TODAY;

    if (task.status === 'da_duyet') {
      return (
        <View style={styles.taskRow2}>
          <TouchableOpacity style={styles.actionButtonXem} onPress={() => (navigation.navigate as any)(Routes.Mission.Detail, { missionId: task.id, mode: 'parent' })}>
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
            <TouchableOpacity style={styles.actionButtonKiemTra} onPress={() => (navigation.navigate as any)(Routes.Mission.Detail, { missionId: task.id, mode: 'parent' })}>
            <Text style={styles.actionButtonKiemTraText}>Kiểm tra</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIconBtnRed}>
            <Feather name="trash-2" size={20} color={COLORS.redIcon} />
          </TouchableOpacity>
        </View>
      );
    }

    // Default for everything else
    return (
      <View style={styles.taskRow2}>
        <TouchableOpacity style={styles.actionButtonKiemTra} onPress={() => navigation.navigate(Routes.Mission.Detail as any, { missionId: task.id, mode: 'parent' })}>
          <Text style={styles.actionButtonKiemTraText}>Chi tiết</Text>
        </TouchableOpacity>
      </View>
    );
  };



  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nhiệm vụ</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => (navigation.navigate as any)(Routes.Mission.Create, { childId })}>
          <Feather name="plus" size={16} color={COLORS.white} />
          <Text style={styles.addButtonText}>Thêm</Text>
        </TouchableOpacity>
      </View>

      {/* Segmented Control */}
      <View style={{ flexDirection: 'row', backgroundColor: '#F0F2FA', padding: 4, marginHorizontal: 20, borderRadius: 12, marginBottom: 16 }}>
        <TouchableOpacity 
          style={{ flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: activeTab === 'personal' ? '#FFF' : 'transparent', alignItems: 'center', elevation: activeTab === 'personal' ? 2 : 0, shadowColor: '#000', shadowOpacity: activeTab === 'personal' ? 0.05 : 0, shadowRadius: 2 }}
          onPress={() => setActiveTab('personal')}
        >
          <Text style={{ fontWeight: '700', color: activeTab === 'personal' ? COLORS.primary : COLORS.textLight }}>Của bé</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: activeTab === 'marketplace' ? '#FFF' : 'transparent', alignItems: 'center', elevation: activeTab === 'marketplace' ? 2 : 0, shadowColor: '#000', shadowOpacity: activeTab === 'marketplace' ? 0.05 : 0, shadowRadius: 2 }}
          onPress={() => setActiveTab('marketplace')}
        >
          <Text style={{ fontWeight: '700', color: activeTab === 'marketplace' ? COLORS.primary : COLORS.textLight }}>Sàn khám phá</Text>
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
    </SafeAreaView>
  );
}
