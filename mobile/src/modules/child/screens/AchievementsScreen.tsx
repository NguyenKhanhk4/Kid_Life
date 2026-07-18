import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/constants';

const INITIAL_BADGES = [
  { icon: '⭐', title: 'Siêu sao', text: 'Hoàn thành 10 nhiệm vụ', status: 'claimed', progress: '10/10', reward: 50 },
  { icon: '😊', title: 'Bé ngoan', text: 'Duy trì streak 7 ngày', status: 'claimable', progress: '7/7', reward: 100 },
  { icon: '🧹', title: 'Chăm chỉ', text: 'Hoàn thành 30 nhiệm vụ', status: 'claimed', progress: '30/30', reward: 150 },
  { icon: '🎨', title: 'Sáng tạo', text: 'Hoàn thành 5 bài học', status: 'locked', progress: '3/5', reward: 50 },
  { icon: '🛡️', title: 'Dũng cảm', text: 'Thử 10 nhiệm vụ mới', status: 'locked', progress: '4/10', reward: 100 },
  { icon: '🏆', title: 'Nhà vô địch', text: 'Đạt cấp độ 10', status: 'locked', progress: '5/10', reward: 500 }
];

export default function AchievementsScreen() {
  const navigation = useNavigation<any>();
  const [tab, setTab] = useState('Tất cả');
  const [xpToExchange, setXpToExchange] = useState(1250);
  const [badgesState, setBadgesState] = useState(INITIAL_BADGES);
  
  const handleClaim = (title: string, reward: number) => {
    setBadgesState(prev => prev.map(b => b.title === title ? { ...b, status: 'claimed' } : b));
    setXpToExchange(prev => prev + reward);
    Alert.alert('Chúc mừng!', `Bạn đã nhận được ${reward} XP từ danh hiệu ${title}!`);
  };

  const filtered = tab === 'Đã đạt' 
    ? badgesState.filter((item) => item.status !== 'locked') 
    : tab === 'Chưa đạt' 
      ? badgesState.filter((item) => item.status === 'locked') 
      : badgesState;
      
  return (
    <ScrollView style={L.screen} contentContainerStyle={L.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.overline}>BỘ SƯU TẬP CỦA MÌNH</Text>
          <Text style={styles.title}>Thành tích</Text>
        </View>
        <View style={styles.xp}>
          <Ionicons name="star" size={15} color={C.orange} />
          <Text style={styles.xpText}>{xpToExchange.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.levelCard}>
        <View style={styles.levelTop}>
          <Text style={styles.level}>Cấp 5</Text>
          <Text style={styles.levelXp}>1,250 / 1,750 XP</Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: '71%' }]} />
        </View>
        <Text style={styles.levelHint}>500 XP nữa để lên cấp 6</Text>
      </View>
      
      {/* XP to Stars Converter Card */}
      <View style={styles.converterCard}>
        <Text style={styles.converterHint}>100 XP = 1 ⭐ mua đồ cho pet & phần thưởng thực tế</Text>
        
        <View style={styles.converterBoxes}>
          {/* Box Left */}
          <View style={styles.converterBoxLeft}>
            <Ionicons name="flash" size={24} color={C.orange} style={{ marginRight: 8 }} />
            <View>
              <Text style={styles.boxLabelLeft}>XP MUỐN ĐỔI</Text>
              <Text style={styles.boxValueLeft}>{xpToExchange.toLocaleString()} XP</Text>
            </View>
          </View>
          
          <Ionicons name="arrow-forward" size={20} color={C.primary} style={{ marginHorizontal: 8 }} />
          
          {/* Box Right */}
          <View style={styles.converterBoxRight}>
            <Ionicons name="star" size={24} color={C.orange} style={{ marginRight: 8 }} />
            <View>
              <Text style={styles.boxLabelRight}>SAO ĐỔI ĐƯỢC</Text>
              <Text style={styles.boxValueRight}>{Math.floor(xpToExchange / 100)} sao</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.btnExchange}
          onPress={() => {
            Alert.alert(
              'Đổi điểm thành công!', 
              `Bạn đã nhận được ${Math.floor(xpToExchange / 100)} sao để mua đồ cho thú cưng và đổi phần thưởng thực tế.`,
              [{ text: 'Đến cửa hàng ngay', onPress: () => navigation.navigate(Routes.Reward.Shop) }, { text: 'Để sau', style: 'cancel' }]
            );
          }}
        >
          <Text style={styles.btnExchangeText}>Đổi ngay</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        {['Tất cả', 'Đã đạt', 'Chưa đạt'].map((item) => (
          <Pressable key={item} onPress={() => setTab(item)} style={[styles.tab, tab === item && styles.tabActive]}>
            <Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.grid}>
        {filtered.map((badge) => (
          <View key={badge.title} style={[L.card, styles.badgeCard, badge.status === 'locked' && styles.locked]}>
            <View style={styles.badgeIcon}>
              <Text style={styles.badgeEmoji}>{badge.status !== 'locked' ? badge.icon : '🔒'}</Text>
            </View>
            <Text style={styles.badgeTitle} numberOfLines={1}>{badge.title}</Text>
            <Text style={styles.badgeText}>{badge.text}</Text>
            <View style={styles.badgeTrack}>
              <View style={[styles.badgeFill, { width: `${(Number(badge.progress.split('/')[0]) / Number(badge.progress.split('/')[1])) * 100}%` }]} />
            </View>
            <Text style={styles.badgeProgress}>{badge.progress}</Text>
            
            {badge.status === 'claimable' && (
              <TouchableOpacity style={styles.claimBtn} onPress={() => handleClaim(badge.title, badge.reward)}>
                <Text style={styles.claimBtnText}>Nhận {badge.reward} XP</Text>
              </TouchableOpacity>
            )}
            {badge.status === 'claimed' && (
              <View style={styles.claimedBtn}>
                <Ionicons name="checkmark-circle" size={12} color={C.green} style={{marginRight: 4}} />
                <Text style={styles.claimedBtnText}>Đã nhận</Text>
              </View>
            )}
          </View>
        ))}
      </View>
      <View style={{height: 40}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, marginBottom: 17 },
  overline: { color: C.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1.1 },
  title: { color: C.text, fontSize: 28, fontWeight: '800', marginTop: 4 },
  xp: { flexDirection: 'row', gap: 5, alignItems: 'center', backgroundColor: C.orangeSoft, borderRadius: 999, padding: 9 },
  xpText: { color: '#B36A00', fontSize: 12, fontWeight: '800' },
  
  levelCard: { backgroundColor: C.primary, borderRadius: 18, padding: 17, marginBottom: 16 },
  levelTop: { flexDirection: 'row', justifyContent: 'space-between' },
  level: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  levelXp: { color: '#DCE2FF', fontSize: 11 },
  track: { height: 9, backgroundColor: 'rgba(255,255,255,.24)', borderRadius: 5, overflow: 'hidden', marginTop: 13 },
  fill: { height: '100%', backgroundColor: C.lime, borderRadius: 5 },
  levelHint: { color: '#DCE2FF', fontSize: 10, marginTop: 7 },
  
  converterCard: { backgroundColor: '#F0F4FF', borderRadius: 20, padding: 20, marginBottom: 24 },
  converterHint: { color: C.primary, fontSize: 12, fontWeight: '700', marginBottom: 16 },
  converterBoxes: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  converterBoxLeft: { flex: 1, backgroundColor: '#FFF', borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', shadowColor: C.primary, shadowOpacity: 0.1, shadowRadius: 10, elevation: 2 },
  boxLabelLeft: { fontSize: 10, fontWeight: '700', color: C.primary, marginBottom: 2 },
  boxValueLeft: { fontSize: 18, fontWeight: '900', color: C.primary },
  converterBoxRight: { flex: 1, backgroundColor: '#FFF5CD', borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center' },
  boxLabelRight: { fontSize: 10, fontWeight: '700', color: '#8D6E1C', marginBottom: 2 },
  boxValueRight: { fontSize: 18, fontWeight: '900', color: '#6A5110' },
  btnExchange: { backgroundColor: '#B4C4FF', borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  btnExchangeText: { color: C.primary, fontSize: 15, fontWeight: '800' },

  tabs: { flexDirection: 'row', gap: 7, marginBottom: 16 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10, backgroundColor: C.surface },
  tabActive: { backgroundColor: C.primary },
  tabText: { color: C.muted, fontSize: 11, fontWeight: '700' },
  tabTextActive: { color: '#FFF' },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 11 },
  badgeCard: { width: '48%', padding: 13, alignItems: 'center' },
  locked: { opacity: .56 },
  badgeIcon: { width: 70, height: 70, borderRadius: 22, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 9 },
  badgeEmoji: { fontSize: 35 },
  badgeTitle: { color: C.text, fontSize: 14, fontWeight: '800' },
  badgeText: { color: C.muted, fontSize: 10, textAlign: 'center', lineHeight: 14, marginTop: 5, minHeight: 28 },
  badgeProgress: { color: C.primary, fontSize: 10, fontWeight: '800', marginTop: 4, marginBottom: 8 },
  badgeTrack: { width: '100%', height: 5, backgroundColor: '#EFF1F7', borderRadius: 3, overflow: 'hidden', marginTop: 5 },
  badgeFill: { height: '100%', backgroundColor: C.lime, borderRadius: 3 },
  claimBtn: { backgroundColor: C.orange, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, marginTop: 4, width: '100%', alignItems: 'center' },
  claimBtnText: { color: '#FFF', fontSize: 11, fontWeight: '800' },
  claimedBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E8F5E9', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, marginTop: 4, width: '100%' },
  claimedBtnText: { color: C.green, fontSize: 11, fontWeight: '800' }
});
