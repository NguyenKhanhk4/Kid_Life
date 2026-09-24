import { useState, useEffect } from 'react';
import { useAuth } from '@/modules/auth/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface LeaderboardEntry {
  rank: number;
  family?: string;
  familyName?: string;
  avatar?: string;
  points: number;
  streak: number;
}

interface ForumPost {
  _id: string;
  title?: string;
  content: string;
  authorName?: string;
  author?: { fullName?: string };
  likesCount?: number;
  likes_count?: number;
  commentsCount?: number;
  comments_count?: number;
  createdAt?: string;
  created_at?: string;
}

const MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

const timeAgo = (dateStr?: string) => {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
};

export default function ParentCommunityPage() {
  const { token } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loadingLB, setLoadingLB] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoadingLB(true);
    fetch(`${API_BASE}/api/community/leaderboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(json => setLeaderboard(json.success && json.data ? json.data : []))
      .catch(() => {})
      .finally(() => setLoadingLB(false));
  }, [token]);

  useEffect(() => {
    if (!token) return;
    setLoadingPosts(true);
    fetch(`${API_BASE}/api/community/posts?page=1`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(json => setPosts(json.success && json.data ? json.data : []))
      .catch(() => {})
      .finally(() => setLoadingPosts(false));
  }, [token]);

  return (
    <div>
      <div className="web-page-header">
        <div>
          <h1>Cộng đồng KidLife 🏆</h1>
          <p className="page-subtitle">Thi đua và chia sẻ kinh nghiệm cùng các gia đình khác</p>
        </div>
      </div>

      <div className="web-grid-2-1">
        {/* Leaderboard */}
        <div>
          <div className="section-header">
            <div className="section-title-row">
              <span style={{ fontSize: 20 }}>🏆</span>
              <h2 className="section-title">Thử thách gia đình</h2>
            </div>
            <span className="kl-badge" style={{ background: 'var(--kl-orange-soft)', color: '#B36A00' }}>
              🔥 Đang diễn ra
            </span>
          </div>

          <div className="kl-card" style={{ padding: 20 }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--kl-primary)' }}>
                Thử thách rèn luyện 14 ngày
              </span>
            </div>

            {loadingLB ? (
              <p style={{ color: 'var(--kl-muted)', textAlign: 'center', padding: '20px 0', fontSize: 13 }}>Đang tải bảng xếp hạng...</p>
            ) : leaderboard.length === 0 ? (
              <p style={{ color: 'var(--kl-muted)', textAlign: 'center', padding: '20px 0', fontSize: 13 }}>Chưa có dữ liệu xếp hạng</p>
            ) : (
              leaderboard.map((entry) => (
                <div key={entry.rank} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0',
                  borderBottom: '1px solid var(--kl-border)',
                }}>
                  <span style={{ width: 32, fontSize: entry.rank <= 3 ? 22 : 15, fontWeight: 800, textAlign: 'center', color: entry.rank <= 3 ? 'var(--kl-text)' : 'var(--kl-muted)' }}>
                    {MEDALS[entry.rank] || `#${entry.rank}`}
                  </span>
                  <div style={{ width: 44, height: 44, borderRadius: 22, background: 'var(--kl-primary-soft)', display: 'grid', placeItems: 'center', fontSize: 22 }}>
                    {entry.avatar || '👨‍👩‍👧'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{entry.familyName || entry.family || 'Gia đình'}</div>
                    <div style={{ fontSize: 12, color: 'var(--kl-muted)' }}>🔥 {entry.streak} ngày streak</div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--kl-primary)' }}>
                    {entry.points.toLocaleString()} đ
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Forum */}
        <div>
          <div className="section-header">
            <div className="section-title-row">
              <span style={{ fontSize: 20 }}>💬</span>
              <h2 className="section-title">Diễn đàn phụ huynh</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 14 }}>
            {loadingPosts ? (
              <div className="kl-card" style={{ padding: 18 }}>
                <p style={{ color: 'var(--kl-muted)', textAlign: 'center', fontSize: 13 }}>Đang tải bài viết...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="kl-card" style={{ padding: 18, textAlign: 'center' }}>
                <p style={{ color: 'var(--kl-muted)', fontSize: 13 }}>Chưa có bài viết nào</p>
              </div>
            ) : (
              posts.map(post => (
                <div key={post._id} className="kl-card" style={{ padding: 18 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 20, background: 'var(--kl-purple-soft)', display: 'grid', placeItems: 'center', fontSize: 20, flexShrink: 0 }}>
                      👤
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>
                        {post.author?.fullName || post.authorName || 'Phụ huynh'}
                      </div>
                      {post.title && (
                        <div style={{ fontWeight: 600, fontSize: 14, marginTop: 4, color: 'var(--kl-text)' }}>{post.title}</div>
                      )}
                      <p style={{ fontSize: 13, color: 'var(--kl-muted)', marginTop: 6, lineHeight: 1.5 }}>
                        {post.content}
                      </p>
                      <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 12, color: 'var(--kl-muted)' }}>
                        <span>❤️ {post.likesCount ?? post.likes_count ?? 0}</span>
                        <span>💬 {post.commentsCount ?? post.comments_count ?? 0} bình luận</span>
                        <span>{timeAgo(post.createdAt || post.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

