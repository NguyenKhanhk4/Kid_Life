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
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/constants';
import { styles, COLORS } from './TasksParent.styles';
import { addTask, useAppDispatch, useAppSelector } from '@/shared/store';

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
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const sharedTasks = useAppSelector((state) => state.kidlife.tasks);
  const [activeTab, setActiveTab] = useState<'personal' | 'marketplace'>('personal');
  const [activeDate, setActiveDate] = useState(TODAY);
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  
  // Marketplace states
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const MOCK_TEMPLATES = [
    { id: 1, title: 'Kỹ năng tự lập cho bé vào lớp 1', author: 'Cô Yến Nhi', authorAvatar: '👩‍🏫', copies: 1250, rating: 4.9, tags: ['Tự lập', 'Mầm non'], tasks: ['Tự gấp chăn màn', 'Đánh răng sáng tối', 'Chuẩn bị cặp sách'] },
    { id: 2, title: 'Thói quen đọc sách 7 ngày', author: 'Ba bé Cà Rốt', authorAvatar: '👨‍👧', copies: 840, rating: 4.8, tags: ['Trí tuệ', 'Tập trung'], tasks: ['Đọc 10 trang sách', 'Kể lại truyện cho ba mẹ', 'Sắp xếp kệ sách'] },
    { id: 3, title: 'Việc nhà nhỏ, trách nhiệm to', author: 'Master Mẹ Ốc', authorAvatar: '🦸‍♀️', copies: 2100, rating: 5.0, tags: ['Trách nhiệm', 'Vận động'], badge: 'Master Parent', tasks: ['Lau bàn ăn', 'Tưới cây', 'Gấp quần áo'] },
  ];
  
  // States cho Form thêm nhiệm vụ
  const [selectedEmoji, setSelectedEmoji] = useState('🧸');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedReward, setSelectedReward] = useState(1);
  const [taskDescription, setTaskDescription] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [taskType, setTaskType] = useState('ai_video');
  const [checklistItems, setChecklistItems] = useState([{ id: 1, text: '' }]);
  const [checklistPrompt, setChecklistPrompt] = useState('');
  const [isGeneratingChecklist, setIsGeneratingChecklist] = useState(false);

  // Lọc task theo ngày được chọn
  const filteredTasks = activeDate === TODAY
    ? sharedTasks.map((task) => ({
        id: task.id,
        date: TODAY,
        title: task.title,
        time: task.time,
        stars: Math.max(1, Math.round(task.rewardXP / 30)),
        xp: task.rewardXP,
        category: task.category,
        emoji: task.icon,
        status:
          task.status === 'done' ? 'da_duyet'
          : task.status === 'submitted' ? 'chua_kiem_tra'
          : task.status === 'in_progress' ? 'dang_thuc_hien'
          : 'chua_thuc_hien',
        progress: task.subtasks.length
          ? Math.round((task.subtasks.filter((item) => item.done).length / task.subtasks.length) * 100)
          : 0,
      }))
    : MOCK_TASKS.filter(task => task.date === activeDate);

  const publishTask = () => {
    if (!taskTitle.trim()) return false;
    dispatch(addTask({
      title: taskTitle,
      time: '20:30 - 21:00',
      rewardXP: selectedReward * 30,
      category: selectedSkill || 'Kỹ năng',
      icon: selectedEmoji,
      subtasks: taskType === 'checklist' ? checklistItems.map((item) => item.text) : [taskDescription || taskTitle],
    }));
    return true;
  };

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
          <TouchableOpacity style={styles.actionButtonXem} onPress={() => navigation.navigate(Routes.Mission.Detail as any, { missionId: task.id, mode: 'parent' })}>
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
          <TouchableOpacity style={styles.actionButtonKiemTra} onPress={() => navigation.navigate(Routes.Mission.Detail as any, { missionId: task.id, mode: 'parent' })}>
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
        <TouchableOpacity style={styles.actionButtonKiemTra} onPress={() => navigation.navigate(Routes.Parent.ApprovalQueue as any)}>
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
                <Text style={styles.modalSubtitle}>Bước {modalStep} / {taskType === 'ai_video' ? 5 : 4}</Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={() => setIsAddModalVisible(false)}>
                <Ionicons name="close" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              {(taskType === 'ai_video' ? [1, 2, 3, 4, 5] : [1, 2, 3, 4]).map((step) => (
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
                  <Text style={styles.inputLabel}>Loại nhiệm vụ</Text>
                  <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
                    <TouchableOpacity 
                      style={[{ flex: 1, padding: 12, borderRadius: 16, backgroundColor: '#F4F6FB', borderWidth: 2, borderColor: 'transparent', alignItems: 'center' }, taskType === 'ai_video' && { borderColor: COLORS.primary, backgroundColor: COLORS.lightBlue }]}
                      onPress={() => setTaskType('ai_video')}
                    >
                      <FontAwesome5 name="robot" size={24} color={taskType === 'ai_video' ? COLORS.primary : COLORS.textLight} style={{ marginBottom: 8 }} />
                      <Text style={[{ fontSize: 14, fontWeight: 'bold', color: COLORS.textDark, textAlign: 'center' }, taskType === 'ai_video' && { color: COLORS.primary }]}>Video AI</Text>
                      <Text style={{ fontSize: 11, color: COLORS.textLight, marginTop: 4 }}>Bé 3-5 tuổi</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[{ flex: 1, padding: 12, borderRadius: 16, backgroundColor: '#F4F6FB', borderWidth: 2, borderColor: 'transparent', alignItems: 'center' }, taskType === 'checklist' && { borderColor: COLORS.primary, backgroundColor: COLORS.lightBlue }]}
                      onPress={() => setTaskType('checklist')}
                    >
                      <Feather name="check-square" size={24} color={taskType === 'checklist' ? COLORS.primary : COLORS.textLight} style={{ marginBottom: 8 }} />
                      <Text style={[{ fontSize: 14, fontWeight: 'bold', color: COLORS.textDark, textAlign: 'center' }, taskType === 'checklist' && { color: COLORS.primary }]}>Checklist</Text>
                      <Text style={{ fontSize: 11, color: COLORS.textLight, marginTop: 4 }}>Bé 6-10 tuổi</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.inputLabel}>Tên nhiệm vụ</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="VD: Tự đánh răng buổi sáng..."
                    placeholderTextColor={COLORS.textLight}
                    value={taskTitle}
                    onChangeText={setTaskTitle}
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

              {modalStep === 3 && taskType === 'ai_video' && (
                <View>
                  <Text style={styles.inputLabel}>Mô tả nhiệm vụ</Text>
                  <TextInput
                    style={styles.textArea}
                    placeholder="Mô tả chi tiết nhiệm vụ để tạo video hướng dẫn..."
                    placeholderTextColor={COLORS.textLight}
                    multiline
                    value={taskDescription}
                    onChangeText={setTaskDescription}
                  />
                </View>
              )}

              {modalStep === 3 && taskType === 'checklist' && (
                <View>
                  <Text style={styles.inputLabel}>Các bước thực hiện (Checklist)</Text>
                  
                  {/* AI Gợi ý Checklist */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F4F6FB', padding: 12, borderRadius: 16, marginBottom: 16 }}>
                    <TextInput
                      style={{ flex: 1, fontSize: 14, color: COLORS.textDark }}
                      placeholder="Gợi ý AI: 'Các bước rửa tay'"
                      placeholderTextColor={COLORS.textLight}
                      value={checklistPrompt}
                      onChangeText={setChecklistPrompt}
                    />
                    <TouchableOpacity 
                      style={{ backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, marginLeft: 8, flexDirection: 'row', alignItems: 'center' }}
                      onPress={() => {
                        if (!checklistPrompt) return;
                        setIsGeneratingChecklist(true);
                        setTimeout(() => {
                          setChecklistItems([
                            { id: Date.now(), text: 'Làm ướt tay bằng nước sạch' },
                            { id: Date.now() + 1, text: 'Lấy xà phòng và xoa đều 2 tay' },
                            { id: Date.now() + 2, text: 'Rửa kỹ kẽ tay và móng tay' },
                            { id: Date.now() + 3, text: 'Rửa sạch xà phòng bằng nước' },
                            { id: Date.now() + 4, text: 'Lau khô tay bằng khăn sạch' }
                          ]);
                          setIsGeneratingChecklist(false);
                          setChecklistPrompt('');
                        }, 1200);
                      }}
                    >
                      {isGeneratingChecklist ? (
                        <Text style={{ color: '#FFF', fontSize: 13, fontWeight: 'bold' }}>Đang tạo...</Text>
                      ) : (
                        <>
                          <FontAwesome5 name="magic" size={12} color="#FFF" style={{ marginRight: 6 }} />
                          <Text style={{ color: '#FFF', fontSize: 13, fontWeight: 'bold' }}>Tạo tự động</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>

                  <Text style={{ fontSize: 13, color: COLORS.textLight, marginBottom: 12 }}>Hoặc tự nhập các bước:</Text>
                  {checklistItems.map((item, index) => (
                    <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                      <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.lightBlue, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                        <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>{index + 1}</Text>
                      </View>
                      <TextInput 
                        style={[styles.textInput, { flex: 1, marginBottom: 0 }]}
                        placeholder={`Bước ${index + 1}...`}
                        value={item.text}
                        onChangeText={(text) => {
                          const newItems = [...checklistItems];
                          newItems[index].text = text;
                          setChecklistItems(newItems);
                        }}
                      />
                      {checklistItems.length > 1 && (
                        <TouchableOpacity 
                          style={{ padding: 8, marginLeft: 4 }}
                          onPress={() => setChecklistItems(checklistItems.filter(i => i.id !== item.id))}
                        >
                          <Feather name="x" size={20} color={COLORS.textLight} />
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                  <TouchableOpacity 
                    style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, padding: 8 }}
                    onPress={() => setChecklistItems([...checklistItems, { id: Date.now(), text: '' }])}
                  >
                    <Feather name="plus-circle" size={20} color={COLORS.primary} />
                    <Text style={{ color: COLORS.primary, fontWeight: 'bold', marginLeft: 8 }}>Thêm bước mới</Text>
                  </TouchableOpacity>
                </View>
              )}

              {modalStep === 4 && taskType === 'ai_video' && (
                <View>
                  <View style={styles.aiConfirmBox}>
                    <FontAwesome5 name="robot" size={20} color={COLORS.primary} />
                    <View style={styles.aiConfirmTextGroup}>
                      <Text style={styles.aiConfirmTitle}>AI Đề xuất Prompt</Text>
                      <Text style={styles.aiConfirmDesc}>Dựa vào mô tả của bạn, AI đã tạo prompt dưới đây. Bạn có thể chỉnh sửa tự do trước khi tạo video.</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.inputLabel}>Prompt tạo Video AI</Text>
                  <TextInput
                    style={styles.textArea}
                    placeholder="Prompt tạo video..."
                    placeholderTextColor={COLORS.textLight}
                    multiline
                    value={aiPrompt}
                    onChangeText={setAiPrompt}
                  />
                </View>
              )}

              {modalStep === 5 && taskType === 'ai_video' && (
                <View>
                  <View style={styles.aiConfirmBox}>
                    <FontAwesome5 name="magic" size={20} color={COLORS.primary} />
                    <View style={styles.aiConfirmTextGroup}>
                      <Text style={styles.aiConfirmTitle}>AI đang xử lý...</Text>
                      <Text style={styles.aiConfirmDesc}>Video hướng dẫn đang được tạo bằng AI dựa trên prompt của bạn!</Text>
                    </View>
                  </View>

                  {/* Giả lập state AI đang tạo / Đã tạo xong */}
                  <View style={styles.aiLoadingContainer}>
                    <View style={styles.aiLoadingCircle} />
                    <Text style={styles.aiLoadingText}>Đang tạo video bằng AI...</Text>
                  </View>
                </View>
              )}

              {modalStep === 4 && taskType === 'checklist' && (
                <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                   <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                     <Feather name="check" size={40} color="#4CAF50" />
                   </View>
                   <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.textDark, textAlign: 'center' }}>Tạo nhiệm vụ thành công!</Text>
                   <Text style={{ fontSize: 14, color: COLORS.textLight, textAlign: 'center', marginTop: 8 }}>Nhiệm vụ dạng Checklist đã được tạo cho bé.</Text>
                </View>
              )}

              {/* Bottom Button */}
              {modalStep === 3 && taskType === 'ai_video' ? (
                <TouchableOpacity style={styles.primaryButton} onPress={() => {
                  setAiPrompt(`Tạo một video hoạt hình ngắn (khoảng 30 giây), vui nhộn và hướng dẫn chi tiết cách: ${taskDescription || 'thực hiện nhiệm vụ'}. Giọng đọc truyền cảm, có nhân vật hoạt hình dễ thương động viên bé.`);
                  setModalStep(4);
                }}>
                  <FontAwesome5 name="magic" size={16} color={COLORS.white} style={{ marginRight: 8 }} />
                  <Text style={styles.primaryButtonText}>Tạo Prompt AI</Text>
                </TouchableOpacity>
              ) : (modalStep === 3 && taskType === 'checklist') ? (
                <TouchableOpacity style={styles.primaryButton} onPress={() => {
                  if (publishTask()) setModalStep(4);
                }}>
                  <Feather name="check-square" size={18} color={COLORS.white} style={{ marginRight: 8 }} />
                  <Text style={styles.primaryButtonText}>Tạo nhiệm vụ Checklist</Text>
                </TouchableOpacity>
              ) : (modalStep < 5 && taskType === 'ai_video') || (modalStep < 3 && taskType === 'checklist') ? (
                <TouchableOpacity style={styles.primaryButton} onPress={() => setModalStep(modalStep + 1)}>
                  <Text style={styles.primaryButtonText}>Tiếp theo</Text>
                  <Feather name="arrow-right" size={20} color={COLORS.white} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.primaryButton} onPress={() => {
                  if (taskType !== 'ai_video' || publishTask()) {
                    setTaskTitle('');
                    setTaskDescription('');
                    setChecklistItems([{ id: 1, text: '' }]);
                    setModalStep(1);
                    setIsAddModalVisible(false);
                  }
                }}>
                  <Text style={styles.primaryButtonText}>Hoàn tất</Text>
                  <Feather name="check" size={20} color={COLORS.white} />
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
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nhiệm vụ</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalVisible(true)}>
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

      {activeTab === 'personal' ? (
        <>
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
      </>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
            <View style={{ backgroundColor: COLORS.lightBlue, padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.textDark, marginBottom: 4 }}>Dành cho phụ huynh bận rộn!</Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight, lineHeight: 18 }}>Khám phá các gói nhiệm vụ giáo dục từ chuyên gia và phụ huynh xuất sắc để áp dụng ngay cho con.</Text>
              </View>
              <Text style={{ fontSize: 40, marginLeft: 12 }}>🚀</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.textDark }}>Top gói phổ biến</Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.primary }}>Xem tất cả</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
              {MOCK_TEMPLATES.map((template) => (
                <TouchableOpacity 
                  key={template.id} 
                  style={{ width: 240, backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginRight: 16, borderWidth: 1, borderColor: '#F0F2FA' }}
                  onPress={() => {
                    setSelectedTemplate(template);
                    setIsTemplateModalVisible(true);
                  }}
                >
                  <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                    {template.tags.map(tag => (
                      <View key={tag} style={{ backgroundColor: '#F0F2FA', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                        <Text style={{ fontSize: 10, color: COLORS.textLight, fontWeight: '700' }}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.textDark, marginBottom: 12, height: 44 }} numberOfLines={2}>{template.title}</Text>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F0F2FA', paddingTop: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFF5EB', justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
                        <Text style={{ fontSize: 12 }}>{template.authorAvatar}</Text>
                      </View>
                      <View>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.textDark }}>{template.author}</Text>
                        {template.badge && <Text style={{ fontSize: 9, color: COLORS.starText, fontWeight: 'bold' }}>⭐ {template.badge}</Text>}
                      </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.textDark }}>⭐ {template.rating}</Text>
                      <Text style={{ fontSize: 10, color: COLORS.textLight }}>{template.copies} lượt dùng</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      )}

      {/* Modal Thêm Nhiệm Vụ */}
      {renderAddModal()}

      {/* Modal Chi Tiết Gói Nhiệm Vụ */}
      <Modal visible={isTemplateModalVisible} animationType="slide" transparent={true} onRequestClose={() => setIsTemplateModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40, maxHeight: '85%' }}>
            {selectedTemplate && (
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <View style={{ flex: 1, paddingRight: 16 }}>
                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                      {selectedTemplate.tags.map((tag: string) => (
                        <View key={tag} style={{ backgroundColor: '#F0F2FA', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                          <Text style={{ fontSize: 11, color: COLORS.textLight, fontWeight: '700' }}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                    <Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.textDark, marginBottom: 8 }}>{selectedTemplate.title}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ fontSize: 18, marginRight: 8 }}>{selectedTemplate.authorAvatar}</Text>
                      <Text style={{ fontSize: 14, color: COLORS.textLight }}>Bởi <Text style={{ fontWeight: '700', color: COLORS.textDark }}>{selectedTemplate.author}</Text></Text>
                      {selectedTemplate.badge && <Text style={{ fontSize: 12, color: COLORS.starText, fontWeight: 'bold', marginLeft: 8 }}>⭐ {selectedTemplate.badge}</Text>}
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setIsTemplateModalVisible(false)} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#F0F2FA', justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons name="close" size={20} color={COLORS.textDark} />
                  </TouchableOpacity>
                </View>
                
                <View style={{ backgroundColor: '#FFF5EB', borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24 }}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.starText }}>{selectedTemplate.tasks.length}</Text>
                    <Text style={{ fontSize: 12, color: COLORS.textLight }}>Nhiệm vụ</Text>
                  </View>
                  <View style={{ width: 1, backgroundColor: '#FFE4C4' }} />
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.starText }}>{selectedTemplate.copies}</Text>
                    <Text style={{ fontSize: 12, color: COLORS.textLight }}>Phụ huynh dùng</Text>
                  </View>
                  <View style={{ width: 1, backgroundColor: '#FFE4C4' }} />
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.starText }}>{selectedTemplate.rating}</Text>
                    <Text style={{ fontSize: 12, color: COLORS.textLight }}>Đánh giá</Text>
                  </View>
                </View>

                <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.textDark, marginBottom: 12 }}>Danh sách nhiệm vụ:</Text>
                <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 20 }}>
                  {selectedTemplate.tasks.map((task: string, index: number) => (
                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F2FA', padding: 12, borderRadius: 12, marginBottom: 8 }}>
                      <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.primary }}>{index + 1}</Text>
                      </View>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.textDark }}>{task}</Text>
                    </View>
                  ))}
                </ScrollView>

                <TouchableOpacity 
                  style={{ backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => {
                    setIsTemplateModalVisible(false);
                    // Giả lập alert delay để thông báo thành công
                    setTimeout(() => {
                      alert(`Đã nhân bản ${selectedTemplate.tasks.length} nhiệm vụ vào danh sách của bé thành công!`);
                      setActiveTab('personal');
                    }, 500);
                  }}
                >
                  <Feather name="copy" size={18} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700' }}>Áp dụng cho bé nhà tôi</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
