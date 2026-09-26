import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import DataTable, { Column } from '../components/DataTable';
import ConfirmActionModal from '../components/ConfirmActionModal';
import CreateChallengeModal from '../components/CreateChallengeModal';
import AdminDetailDrawer from '../components/AdminDetailDrawer';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function AdminCommunityPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'reports' | 'challenges'>('reports');
  
  const [reports, setReports] = useState<any[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);
  
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loadingChallenges, setLoadingChallenges] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; post: any | null }>({ isOpen: false, post: null });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const [previewPost, setPreviewPost] = useState<any | null>(null);
  const [rankingChallenge, setRankingChallenge] = useState<any | null>(null);

  useEffect(() => {
    if (activeTab === 'reports') fetchReports();
    else fetchChallenges();
  }, [activeTab]);

  const fetchReports = async () => {
    if (!token) return;
    setLoadingReports(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/community/reports`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        // Sort by reportsCount desc
        const sorted = data.data.sort((a: any, b: any) => (b.reportsCount || 0) - (a.reportsCount || 0));
        setReports(sorted);
      }
    } catch (err) { console.error(err); } finally { setLoadingReports(false); }
  };

  const fetchChallenges = async () => {
    if (!token) return;
    setLoadingChallenges(true);
    try {
      const res = await fetch(`${API_BASE}/api/community/challenges`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setChallenges(data.data);
    } catch (err) { console.error(err); } finally { setLoadingChallenges(false); }
  };

  const handleTogglePostStatus = async () => {
    const post = confirmModal.post;
    if (!post) return;
    const newStatus = post.status === 'hidden' ? 'published' : 'hidden';
    
    try {
      const res = await fetch(`${API_BASE}/api/admin/community/posts/${post._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setReports(prev => prev.map(p => p._id === post._id ? { ...p, status: newStatus } : p));
      } else alert(data.error?.message);
    } catch (err) { alert('Lỗi hệ thống'); }
    
    setConfirmModal({ isOpen: false, post: null });
  };

  const handleCreateChallenge = async (data: any) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/community/challenges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (resData.success) {
        setChallenges([resData.data, ...challenges]);
        setIsCreateModalOpen(false);
      } else alert(resData.error?.message);
    } catch (err) { alert('Lỗi tạo thử thách'); }
  };

  const handleCloseChallenge = async (challengeId: string) => {
    if (!window.confirm('Bạn có chắc muốn đóng sớm thử thách này?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/community/challenges/${challengeId}/close`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      const resData = await res.json();
      if (resData.success) {
        setChallenges(prev => prev.map(c => c._id === challengeId ? { ...c, status: 'ended' } : c));
      } else alert(resData.error?.message);
    } catch (err) { alert('Lỗi hệ thống'); }
  };

  const reportColumns: Column<any>[] = [
    { 
      key: 'title', 
      header: 'Bài viết',
      render: (p) => (
        <span title={p.title} style={{ display: 'inline-block', maxWidth: 250, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {p.title || 'Không có tiêu đề'}
        </span>
      )
    },
    { key: 'author', header: 'Tác giả', render: (p) => p.author?.fullName || 'N/A' },
    { 
      key: 'reportsCount', 
      header: 'Số lượt báo cáo',
      render: (p) => (
        <span className={`admin-badge ${p.reportsCount > 10 ? 'badge-danger' : 'badge-warning'}`}>
          {p.reportsCount || 0}
        </span>
      )
    },
    { key: 'createdAt', header: 'Ngày đăng', render: (p) => new Date(p.createdAt).toLocaleDateString('vi-VN') },
    { 
      key: 'status', 
      header: 'Trạng thái',
      render: (p) => (
        <span className={`admin-badge ${p.status === 'hidden' ? 'badge-danger' : 'badge-info'}`}>
          {p.status === 'hidden' ? 'ĐÃ ẨN' : 'ĐANG HIỂN THỊ'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Hành động',
      render: (p) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="admin-btn admin-btn-outline" style={{ fontSize: 12, padding: '4px 8px' }} onClick={() => setPreviewPost(p)}>Xem bài</button>
          <button className="admin-btn admin-btn-outline" style={{ fontSize: 12, padding: '4px 8px' }} onClick={() => setConfirmModal({ isOpen: true, post: p })}>
            {p.status === 'hidden' ? 'Hiện lại' : 'Ẩn bài'}
          </button>
        </div>
      )
    }
  ];

  const challengeColumns: Column<any>[] = [
    { key: 'title', header: 'Tên thử thách', render: (c) => <span style={{ fontWeight: 600 }}>{c.title}</span> },
    { key: 'period', header: 'Thời gian', render: (c) => `${new Date(c.startDate).toLocaleDateString('vi-VN')} - ${new Date(c.endDate).toLocaleDateString('vi-VN')}` },
    { key: 'participants', header: 'Gia đình tham gia', render: (c) => c.participantsCount || 0 },
    { 
      key: 'status', 
      header: 'Trạng thái',
      render: (c) => (
        <span className={`admin-badge ${c.status === 'ended' ? 'badge-info' : 'badge-success'}`}>
          {c.status === 'ended' ? 'ĐÃ KẾT THÚC' : 'ĐANG DIỄN RA'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Hành động',
      render: (c) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="admin-btn admin-btn-outline" style={{ fontSize: 12, padding: '4px 8px' }} onClick={() => setRankingChallenge(c)}>BXH</button>
          {c.status !== 'ended' && (
            <button className="admin-btn admin-btn-danger" style={{ fontSize: 12, padding: '4px 8px' }} onClick={() => handleCloseChallenge(c._id)}>Đóng sớm</button>
          )}
        </div>
      )
    }
  ];

  return (
    <>
      <div className="admin-table-container">
        <div className="admin-table-toolbar" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="admin-tabs">
            <button className={`admin-tab ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>Bài viết bị báo cáo</button>
            <button className={`admin-tab ${activeTab === 'challenges' ? 'active' : ''}`} onClick={() => setActiveTab('challenges')}>Thử thách & BXH</button>
          </div>
          
          {activeTab === 'challenges' && (
            <button className="admin-btn admin-btn-primary" onClick={() => setIsCreateModalOpen(true)}>
              + Tạo thử thách mới
            </button>
          )}
        </div>

        {activeTab === 'reports' && (
          <DataTable columns={reportColumns} data={reports} loading={loadingReports} emptyMessage="Chưa có nội dung nào bị báo cáo." />
        )}

        {activeTab === 'challenges' && (
          <DataTable columns={challengeColumns} data={challenges} loading={loadingChallenges} emptyMessage="Chưa có thử thách nào." />
        )}
      </div>

      <ConfirmActionModal 
        isOpen={confirmModal.isOpen}
        title={confirmModal.post?.status === 'hidden' ? 'Hiện lại bài viết này?' : 'Ẩn bài viết này khỏi cộng đồng?'}
        description={confirmModal.post?.status === 'hidden'
          ? 'Bài viết sẽ được hiển thị lại trên bảng tin cộng đồng.'
          : 'Bài viết sẽ bị ẩn khỏi bảng tin của tất cả gia đình. Chủ bài viết vẫn có thể xem được trong trang cá nhân.'}
        confirmText={confirmModal.post?.status === 'hidden' ? 'Hiện bài' : 'Ẩn bài'}
        confirmVariant={confirmModal.post?.status === 'hidden' ? 'primary' : 'danger'}
        onConfirm={handleTogglePostStatus}
        onCancel={() => setConfirmModal({ isOpen: false, post: null })}
      />

      <CreateChallengeModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateChallenge}
      />

      {/* Reported Post Preview Drawer */}
      <AdminDetailDrawer isOpen={!!previewPost} onClose={() => setPreviewPost(null)} title="Nội dung bài viết">
        {previewPost && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--admin-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {previewPost.author?.fullName?.charAt(0) || '?'}
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>{previewPost.author?.fullName || 'Người dùng ẩn danh'}</div>
                <div style={{ fontSize: 12, color: 'var(--admin-muted)' }}>{new Date(previewPost.createdAt).toLocaleString('vi-VN')}</div>
              </div>
            </div>
            
            {previewPost.imageUrl && (
              <img src={previewPost.imageUrl} alt="Post media" style={{ width: '100%', borderRadius: 8, objectFit: 'cover', border: '1px solid var(--admin-border)' }} />
            )}
            
            <div style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--admin-ink)', whiteSpace: 'pre-wrap' }}>
              {previewPost.content || previewPost.title}
            </div>

            <div style={{ padding: 16, background: 'rgba(217, 154, 43, 0.1)', borderRadius: 8, border: '1px solid rgba(217, 154, 43, 0.3)', marginTop: 16 }}>
              <h4 style={{ margin: '0 0 8px 0', color: 'var(--admin-warning)' }}>Chi tiết Báo cáo</h4>
              <div style={{ fontSize: 14 }}>
                <strong>Tổng số lượt:</strong> {previewPost.reportsCount || 0}
              </div>
              {/* Additional report reasons could be listed here if available */}
            </div>
          </div>
        )}
      </AdminDetailDrawer>

      {/* Challenge Ranking Drawer */}
      <AdminDetailDrawer isOpen={!!rankingChallenge} onClose={() => setRankingChallenge(null)} title="Bảng xếp hạng (Top 50)">
        {rankingChallenge && (
          <div>
            <div style={{ padding: 16, background: 'var(--admin-bg)', borderRadius: 8, marginBottom: 16 }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: 16 }}>{rankingChallenge.title}</h4>
              <div style={{ fontSize: 13, color: 'var(--admin-muted)' }}>{new Date(rankingChallenge.startDate).toLocaleDateString('vi-VN')} - {new Date(rankingChallenge.endDate).toLocaleDateString('vi-VN')}</div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rankingChallenge.leaderboard?.length > 0 ? (
                rankingChallenge.leaderboard.map((item: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, border: '1px solid var(--admin-border)', borderRadius: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: idx < 3 ? 'var(--admin-primary)' : 'var(--admin-muted)', width: 24 }}>#{idx + 1}</span>
                      <span style={{ fontWeight: 600 }}>{item.familyName}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--admin-success)' }}>{item.score} XP</span>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: 32, color: 'var(--admin-muted)' }}>Chưa có gia đình nào tham gia.</div>
              )}
            </div>
          </div>
        )}
      </AdminDetailDrawer>
    </>
  );
}
