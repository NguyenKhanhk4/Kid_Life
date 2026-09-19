import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import DataTable, { Column } from '../components/DataTable';
import ConfirmActionModal from '../components/ConfirmActionModal';
import CuratedStoryFormModal from '../components/CuratedStoryFormModal';
import PetAccessoryFormModal from '../components/PetAccessoryFormModal';
import SystemLessonFormModal from '../components/SystemLessonFormModal';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

type MasterDataTab = 'stories' | 'accessories' | 'lessons';

export default function AdminMasterDataPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<MasterDataTab>('stories');
  
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Modals state
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isAccessoryModalOpen, setIsAccessoryModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  
  const [editingItem, setEditingItem] = useState<any | null>(null);
  
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; item: any | null }>({ isOpen: false, item: null });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    let endpoint = '';
    if (activeTab === 'stories') endpoint = '/api/admin/master-data/stories';
    if (activeTab === 'accessories') endpoint = '/api/admin/master-data/accessories';
    if (activeTab === 'lessons') endpoint = '/api/admin/master-data/lessons';
    
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, { headers: { Authorization: `Bearer ${token}` } });
      const resData = await res.json();
      if (resData.success) {
        setData(resData.data);
      }
    } catch (err) {
      console.error(err);
      // Fallback dummy data if endpoint not exists yet
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData: any, endpoint: string) => {
    const isEditing = !!editingItem;
    const url = isEditing ? `${API_BASE}${endpoint}/${editingItem._id}` : `${API_BASE}${endpoint}`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      const resData = await res.json();
      if (resData.success) {
        if (isEditing) {
          setData(prev => prev.map(i => i._id === editingItem._id ? resData.data : i));
        } else {
          setData([resData.data, ...data]);
        }
        closeAllModals();
      } else alert(resData.error?.message || 'Lỗi lưu dữ liệu');
    } catch (err) { alert('Lỗi hệ thống'); }
  };

  const handleDelete = async () => {
    const item = confirmDelete.item;
    if (!item) return;

    let endpoint = '';
    if (activeTab === 'stories') endpoint = `/api/admin/master-data/stories/${item._id}`;
    if (activeTab === 'accessories') endpoint = `/api/admin/master-data/accessories/${item._id}`;
    if (activeTab === 'lessons') endpoint = `/api/admin/master-data/lessons/${item._id}`;

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const resData = await res.json();
      if (resData.success) {
        setData(prev => prev.filter(i => i._id !== item._id));
      } else alert(resData.error?.message || 'Lỗi xoá dữ liệu');
    } catch (err) { alert('Lỗi hệ thống'); }
    
    setConfirmDelete({ isOpen: false, item: null });
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    if (activeTab === 'stories') setIsStoryModalOpen(true);
    if (activeTab === 'accessories') setIsAccessoryModalOpen(true);
    if (activeTab === 'lessons') setIsLessonModalOpen(true);
  };

  const closeAllModals = () => {
    setIsStoryModalOpen(false);
    setIsAccessoryModalOpen(false);
    setIsLessonModalOpen(false);
    setEditingItem(null);
  };

  const openCreate = () => {
    setEditingItem(null);
    if (activeTab === 'stories') setIsStoryModalOpen(true);
    if (activeTab === 'accessories') setIsAccessoryModalOpen(true);
    if (activeTab === 'lessons') setIsLessonModalOpen(true);
  };

  // Columns for Stories
  const storyColumns: Column<any>[] = [
    { key: 'title', header: 'Tiêu đề', render: (i) => <span style={{ fontWeight: 600 }}>{i.title}</span> },
    { key: 'category', header: 'Thể loại', render: (i) => <span className="admin-badge badge-info">{i.category}</span> },
    { key: 'duration', header: 'Thời lượng', render: (i) => `${i.duration} phút` },
    { key: 'createdAt', header: 'Ngày thêm', render: (i) => new Date(i.createdAt).toLocaleDateString('vi-VN') },
    {
      key: 'actions',
      header: 'Hành động',
      render: (i) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="admin-btn admin-btn-outline" style={{ fontSize: 12, padding: '4px 8px' }} onClick={() => openEdit(i)}>Sửa</button>
          <button className="admin-btn admin-btn-outline" style={{ fontSize: 12, padding: '4px 8px', color: 'var(--admin-danger)', borderColor: 'var(--admin-danger)' }} onClick={() => setConfirmDelete({ isOpen: true, item: i })}>Xoá</button>
        </div>
      )
    }
  ];

  // Columns for Accessories
  const accessoryColumns: Column<any>[] = [
    { key: 'icon', header: 'Icon', render: (i) => <div style={{ fontSize: 24 }}>{i.icon}</div> },
    { key: 'name', header: 'Tên phụ kiện', render: (i) => <span style={{ fontWeight: 600 }}>{i.name}</span> },
    { key: 'category', header: 'Danh mục', render: (i) => <span className="admin-badge badge-primary">{i.category}</span> },
    { key: 'priceXP', header: 'Giá (XP)', render: (i) => `${i.priceXP} XP` },
    {
      key: 'actions',
      header: 'Hành động',
      render: (i) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="admin-btn admin-btn-outline" style={{ fontSize: 12, padding: '4px 8px' }} onClick={() => openEdit(i)}>Sửa</button>
          <button className="admin-btn admin-btn-outline" style={{ fontSize: 12, padding: '4px 8px', color: 'var(--admin-danger)', borderColor: 'var(--admin-danger)' }} onClick={() => setConfirmDelete({ isOpen: true, item: i })}>Xoá</button>
        </div>
      )
    }
  ];

  // Columns for Lessons
  const lessonColumns: Column<any>[] = [
    { key: 'thumbnail', header: 'Thumbnail', render: (i) => <img src={i.thumbnail} alt="" style={{ width: 48, height: 32, objectFit: 'cover', borderRadius: 4 }} /> },
    { key: 'title', header: 'Tiêu đề', render: (i) => <span style={{ fontWeight: 600 }}>{i.title}</span> },
    { key: 'skill', header: 'Kỹ năng', render: (i) => <span className="admin-badge badge-success">{i.skill}</span> },
    { key: 'ageGroup', header: 'Độ tuổi', render: (i) => `${i.ageGroup} tuổi` },
    {
      key: 'actions',
      header: 'Hành động',
      render: (i) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="admin-btn admin-btn-outline" style={{ fontSize: 12, padding: '4px 8px' }} onClick={() => openEdit(i)}>Sửa</button>
          <button className="admin-btn admin-btn-outline" style={{ fontSize: 12, padding: '4px 8px', color: 'var(--admin-danger)', borderColor: 'var(--admin-danger)' }} onClick={() => setConfirmDelete({ isOpen: true, item: i })}>Xoá</button>
        </div>
      )
    }
  ];

  const getColumns = () => {
    if (activeTab === 'stories') return storyColumns;
    if (activeTab === 'accessories') return accessoryColumns;
    return lessonColumns;
  };

  const getButtonText = () => {
    if (activeTab === 'stories') return '+ Thêm truyện mới';
    if (activeTab === 'accessories') return '+ Thêm phụ kiện';
    return '+ Thêm bài học';
  };

  return (
    <>
      <div className="admin-table-container">
        <div className="admin-table-toolbar" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="admin-tabs">
            <button className={`admin-tab ${activeTab === 'stories' ? 'active' : ''}`} onClick={() => setActiveTab('stories')}>Truyện cổ tích</button>
            <button className={`admin-tab ${activeTab === 'accessories' ? 'active' : ''}`} onClick={() => setActiveTab('accessories')}>Phụ kiện thú cưng</button>
            <button className={`admin-tab ${activeTab === 'lessons' ? 'active' : ''}`} onClick={() => setActiveTab('lessons')}>Bài học kỹ năng</button>
          </div>
          <button className="admin-btn admin-btn-primary" onClick={openCreate}>
            {getButtonText()}
          </button>
        </div>

        <DataTable columns={getColumns()} data={data} loading={loading} />
      </div>

      <CuratedStoryFormModal 
        isOpen={isStoryModalOpen} 
        onClose={closeAllModals} 
        initialData={editingItem}
        onSubmit={(data) => handleCreateOrUpdate(data, '/api/admin/master-data/stories')} 
      />

      <PetAccessoryFormModal 
        isOpen={isAccessoryModalOpen} 
        onClose={closeAllModals} 
        initialData={editingItem}
        onSubmit={(data) => handleCreateOrUpdate(data, '/api/admin/master-data/accessories')} 
      />

      <SystemLessonFormModal 
        isOpen={isLessonModalOpen} 
        onClose={closeAllModals} 
        initialData={editingItem}
        onSubmit={(data) => handleCreateOrUpdate(data, '/api/admin/master-data/lessons')} 
      />

      <ConfirmActionModal 
        isOpen={confirmDelete.isOpen}
        title="Xoá danh mục gốc?"
        description="Việc xoá dữ liệu gốc này có thể ảnh hưởng đến trải nghiệm của tất cả gia đình đang sử dụng. Bạn có chắc chắn muốn xoá?"
        confirmText="Xoá vĩnh viễn"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete({ isOpen: false, item: null })}
      />
    </>
  );
}
