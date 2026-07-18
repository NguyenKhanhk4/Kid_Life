import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Alert, Modal, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { kidlifeColors as C, kidlifeLayout as L } from '@/theme';

const posts = [
  { name: 'Nguyễn Thị Nga', time: '2 giờ trước', avatar: '👩🏻', text: 'Bé nhà mình hôm nay tự giác dọn đồ chơi mà không cần nhắc, vui quá các ba mẹ ơi! 🌱', image: '🧒🏻🧸', likes: 24, comments: 8 },
  { name: 'Trần Minh Anh', time: 'Hôm qua', avatar: '👨🏻', text: 'Có ai có gợi ý nhiệm vụ rèn kỹ năng tự lập cho bé 5 tuổi không ạ?', image: '', likes: 12, comments: 14 }
];

export default function CommunityScreen() {
  const [liked, setLiked] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);
  const [postText, setPostText] = useState('');
  
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [activeSharePost, setActiveSharePost] = useState<string | null>(null);

  const handleNotImplemented = () => {
    Alert.alert("Tính năng đang phát triển", "Tính năng này sẽ được ra mắt trong phiên bản tiếp theo của KidLife!");
  };

  const handleShare = () => {
    if (!postText.trim()) return;
    Alert.alert("Thành công", "Bài viết của bạn đã được đăng lên cộng đồng KidLife!");
    setPostText('');
    setIsPostModalVisible(false);
  };

  const submitComment = () => {
    if (!commentText.trim()) return;
    Alert.alert("Thành công", "Bình luận của bạn đã được gửi!");
    setCommentText('');
    setActiveCommentPost(null);
  };

  const submitShare = (platform: string) => {
    Alert.alert("Chia sẻ thành công", `Đã chia sẻ bài viết qua ${platform}!`);
    setActiveSharePost(null);
  };

  return (
    <ScrollView style={L.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Cộng đồng KidLife</Text>
          <Text style={styles.subtitle}>Cùng nhau nuôi dạy những em bé hạnh phúc</Text>
        </View>
        <Pressable style={styles.search} onPress={handleNotImplemented}>
          <Ionicons name="search" size={19} color={C.primary} />
        </Pressable>
      </View>

      <View style={styles.tabs}>
        {['Tất cả', 'Hỏi đáp', 'Chia sẻ'].map(tab => (
          <Pressable key={tab} onPress={() => setActiveTab(tab)}>
            <Text style={activeTab === tab ? styles.activeTab : styles.tab}>{tab}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.composer} onPress={() => setIsPostModalVisible(true)}>
        <View style={styles.composerAvatar}><Text>👩🏻</Text></View>
        <Text style={styles.placeholder}>Bạn muốn chia sẻ điều gì?</Text>
        <Ionicons name="image-outline" size={20} color={C.primary} />
      </Pressable>

      {posts.map((post) => (
        <View style={[L.card, styles.post]} key={post.name}>
          <View style={styles.postHeader}>
            <Text style={styles.postAvatar}>{post.avatar}</Text>
            <View style={styles.postUser}>
              <Text style={styles.postName}>{post.name}</Text>
              <Text style={styles.postTime}>{post.time}</Text>
            </View>
            <Pressable onPress={handleNotImplemented}>
              <Ionicons name="ellipsis-horizontal" size={20} color={C.muted} />
            </Pressable>
          </View>
          
          <Text style={styles.postText}>{post.text}</Text>
          {post.image ? (
            <View style={styles.postImage}>
              <Text style={styles.postImageText}>{post.image}</Text>
            </View>
          ) : null}
          
          <View style={styles.postActions}>
            <Pressable 
              style={styles.action} 
              onPress={() => setLiked((value) => value.includes(post.name) ? value.filter((item) => item !== post.name) : [...value, post.name])}
            >
              <Ionicons name={liked.includes(post.name) ? 'heart' : 'heart-outline'} size={18} color={liked.includes(post.name) ? C.red : C.muted} />
              <Text style={styles.actionText}>{post.likes + (liked.includes(post.name) ? 1 : 0)}</Text>
            </Pressable>
            <Pressable style={styles.action} onPress={() => setActiveCommentPost(post.name)}>
              <Ionicons name="chatbubble-outline" size={17} color={C.muted} />
              <Text style={styles.actionText}>{post.comments}</Text>
            </Pressable>
            <Pressable style={styles.action} onPress={() => setActiveSharePost(post.name)}>
              <Ionicons name="share-social-outline" size={17} color={C.muted} />
              <Text style={styles.actionText}>Chia sẻ</Text>
            </Pressable>
          </View>
        </View>
      ))}

      {/* Modal Đăng Bài */}
      <Modal visible={isPostModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tạo bài viết mới</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setIsPostModalVisible(false)}>
                <Ionicons name="close" size={20} color={C.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.composerAvatar}><Text>👩🏻</Text></View>
              <TextInput
                style={styles.modalInput}
                placeholder="Bạn muốn chia sẻ điều gì?"
                placeholderTextColor={C.muted}
                multiline
                value={postText}
                onChangeText={setPostText}
                autoFocus
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.attachButton}>
                <Ionicons name="image-outline" size={24} color={C.primary} />
                <Text style={styles.attachText}>Thêm ảnh/video</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.postButton, postText.trim() ? styles.postButtonActive : null]}
                onPress={handleShare}
                disabled={!postText.trim()}
              >
                <Text style={styles.postButtonText}>Đăng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Bình Luận */}
      <Modal visible={!!activeCommentPost} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.modalTitle}>Bình luận</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setActiveCommentPost(null)}>
                <Ionicons name="close" size={20} color={C.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.commentInputRow}>
              <View style={styles.composerAvatar}><Text>👩🏻</Text></View>
              <TextInput
                style={styles.commentInput}
                placeholder="Viết bình luận..."
                placeholderTextColor={C.muted}
                value={commentText}
                onChangeText={setCommentText}
                autoFocus
              />
              <TouchableOpacity 
                style={[styles.sendButton, commentText.trim() ? styles.sendButtonActive : null]}
                onPress={submitComment}
                disabled={!commentText.trim()}
              >
                <Ionicons name="send" size={18} color={commentText.trim() ? '#FFF' : C.muted} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Chia Sẻ */}
      <Modal visible={!!activeSharePost} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.modalTitle}>Chia sẻ bài viết</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setActiveSharePost(null)}>
                <Ionicons name="close" size={20} color={C.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.shareGrid}>
              {[
                { name: 'Facebook', icon: 'logo-facebook', color: '#1877F2' },
                { name: 'Zalo', icon: 'chatbubbles', color: '#0068FF' },
                { name: 'Copy Link', icon: 'link', color: C.muted },
                { name: 'Khác', icon: 'ellipsis-horizontal', color: C.muted }
              ].map(platform => (
                <TouchableOpacity key={platform.name} style={styles.shareItem} onPress={() => submitShare(platform.name)}>
                  <View style={[styles.shareIconBox, { backgroundColor: platform.color + '15' }]}>
                    <Ionicons name={platform.icon as any} size={24} color={platform.color} />
                  </View>
                  <Text style={styles.shareText}>{platform.name}</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, marginBottom: 18, paddingHorizontal: 20 },
  title: { color: C.text, fontSize: 24, fontWeight: '800' },
  subtitle: { color: C.muted, fontSize: 11, marginTop: 4 },
  search: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  tabs: { flexDirection: 'row', gap: 24, borderBottomWidth: 1, borderBottomColor: C.border, marginBottom: 13, paddingHorizontal: 20 },
  activeTab: { color: C.primary, fontSize: 12, fontWeight: '800', paddingBottom: 11, borderBottomWidth: 2, borderBottomColor: C.primary },
  tab: { color: C.muted, fontSize: 12, paddingBottom: 11 },
  composer: { ...L.card, flexDirection: 'row', alignItems: 'center', padding: 11, marginBottom: 13, marginHorizontal: 20 },
  composerAvatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: 9 },
  placeholder: { flex: 1, color: C.muted, fontSize: 11 },
  post: { padding: 14, marginBottom: 12, marginHorizontal: 20 },
  postHeader: { flexDirection: 'row', alignItems: 'center' },
  postAvatar: { fontSize: 30, marginRight: 9 },
  postUser: { flex: 1 },
  postName: { color: C.text, fontSize: 12, fontWeight: '800' },
  postTime: { color: C.muted, fontSize: 10, marginTop: 3 },
  postText: { color: C.text, fontSize: 12, lineHeight: 18, marginTop: 12 },
  postImage: { height: 130, backgroundColor: '#E5EFFF', borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  postImageText: { fontSize: 56 },
  postActions: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: C.border, marginTop: 12, paddingTop: 4 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 12 },
  actionText: { color: C.muted, fontSize: 12, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40, minHeight: 400 },
  bottomSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: C.text },
  closeButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  modalBody: { flexDirection: 'row', alignItems: 'flex-start', flex: 1 },
  modalInput: { flex: 1, fontSize: 16, color: C.text, minHeight: 150, textAlignVertical: 'top', paddingTop: 8 },
  modalFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: C.border, paddingTop: 16 },
  attachButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  attachText: { color: C.primary, fontSize: 14, fontWeight: '600' },
  postButton: { backgroundColor: C.muted, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  postButtonActive: { backgroundColor: C.primary },
  postButtonText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  commentInput: { flex: 1, backgroundColor: C.primarySoft, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: C.text },
  sendButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.muted, alignItems: 'center', justifyContent: 'center' },
  sendButtonActive: { backgroundColor: C.primary },
  shareGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 },
  shareItem: { alignItems: 'center', gap: 8 },
  shareIconBox: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  shareText: { fontSize: 12, color: C.text, fontWeight: '500' }
});
