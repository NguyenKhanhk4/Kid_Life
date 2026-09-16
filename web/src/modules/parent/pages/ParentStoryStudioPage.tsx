import { useState } from 'react';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';
import { IoMic, IoSearch, IoAddCircle, IoCheckmarkCircle, IoSparkles, IoMusicalNotes } from 'react-icons/io5';

const D = MOCK_KIDLIFE_DATA;

export default function ParentStoryStudioPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [stories, setStories] = useState(D.stories);
  const [searchQuery, setSearchQuery] = useState('');
  const [clonedSuccess, setClonedSuccess] = useState(true);

  const startRecording = () => {
    setIsRecording(true);
    setRecordProgress(0);
    const interval = setInterval(() => {
      setRecordProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRecording(false);
          setClonedSuccess(true);
          alert('Đã xử lý & nhân bản thành công Giọng đọc của Mẹ! ✨ Bé giờ đây có thể nghe đọc truyện bằng giọng của mẹ.');
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  const toggleAddToChild = (storyId: string) => {
    setStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, addedToChildLibrary: !s.addedToChildLibrary } : s))
    );
  };

  const filteredStories = stories.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Page Header */}
      <div className="web-page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <IoSparkles color="var(--kl-pink)" size={20} />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--kl-pink)' }}>Công nghệ AI Voice Cloning</span>
          </div>
          <h1>AI Voice Studio & Thư Viện Truyện 🎤</h1>
          <p className="page-subtitle">Nhân bản giọng đọc cha mẹ & chọn lọc truyện cổ tích ý nghĩa cho con</p>
        </div>
      </div>

      <div className="web-grid-2-1" style={{ marginBottom: 24 }}>
        {/* Left: Curated Story Search & Management */}
        <div className="kl-card" style={{ padding: 24, borderRadius: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--kl-primary-dark)' }}>
              Thư Viện Truyện Cổ Tích & Bài Học
            </h2>
            <span className="kl-badge" style={{ background: '#EAF0FF', color: 'var(--kl-primary)' }}>
              {stories.filter((s) => s.addedToChildLibrary).length}/{stories.length} Đã duyệt cho bé
            </span>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', marginBottom: 20 }}>
            <IoSearch style={{ position: 'absolute', left: 16, top: 16, color: 'var(--kl-muted)', fontSize: 18 }} />
            <input
              type="text"
              placeholder="Tìm kiếm truyện cổ tích, bài học đạo đức (VD: Thạch Sanh, Cây vú sữa)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="kl-input"
              style={{ paddingLeft: 46, fontSize: 14 }}
            />
          </div>

          {/* Story Items */}
          <div style={{ display: 'grid', gap: 14 }}>
            {filteredStories.map((story) => (
              <div
                key={story.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: 16,
                  borderRadius: 18,
                  border: story.addedToChildLibrary ? '2px solid var(--kl-primary)' : '1px solid var(--kl-border)',
                  background: story.addedToChildLibrary ? 'var(--kl-primary-soft)' : '#fff',
                }}
              >
                <div style={{ width: 56, height: 56, borderRadius: 16, background: '#F0F3FF', display: 'grid', placeItems: 'center', fontSize: 30, flexShrink: 0 }}>
                  {story.cover}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--kl-primary-dark)' }}>{story.title}</span>
                    <span className="kl-badge" style={{ background: '#FFF4E5', color: '#E85D04', fontSize: 11 }}>{story.category}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--kl-muted)', margin: '4px 0 6px' }}>{story.moral}</p>
                  <span style={{ fontSize: 12, color: 'var(--kl-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <IoMusicalNotes size={14} color="var(--kl-primary)" /> Thời lượng: {story.duration}
                  </span>
                </div>
                <button
                  onClick={() => toggleAddToChild(story.id)}
                  className="kl-btn kl-btn-sm"
                  style={{
                    background: story.addedToChildLibrary ? 'var(--kl-green)' : 'var(--kl-primary)',
                    color: '#fff',
                    padding: '8px 14px',
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    flexShrink: 0,
                  }}
                >
                  {story.addedToChildLibrary ? (
                    <>
                      <IoCheckmarkCircle size={16} /> Đã cho bé nghe
                    </>
                  ) : (
                    <>
                      <IoAddCircle size={16} /> + Thêm vào bé
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Voice Recorder Studio */}
        <div style={{ display: 'grid', gap: 20 }}>
          <div
            className="kl-card"
            style={{
              padding: 24,
              borderRadius: 24,
              background: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4EC 100%)',
              border: '2px solid rgba(255, 71, 133, 0.2)',
              textAlign: 'center',
            }}
          >
            <div style={{ width: 64, height: 64, borderRadius: 32, background: 'var(--kl-pink)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 32, margin: '0 auto 14px' }}>
              <IoMic />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#9E1B48' }}>Studio Thu Âm Giọng Mẹ / Bố</h3>
            <p style={{ fontSize: 13, color: '#66233B', margin: '6px 0 16px', lineHeight: 1.5 }}>
              Chỉ cần đọc 1 đoạn văn mẫu ngắn 1 phút, công nghệ AI sẽ tạo mẫu giọng nói giúp bé luôn được nghe mẹ kể chuyện hàng đêm!
            </p>

            {/* Script Text Box */}
            <div style={{ background: '#fff', padding: 14, borderRadius: 16, fontSize: 13, color: 'var(--kl-text)', fontStyle: 'italic', marginBottom: 18, textAlign: 'left', border: '1px solid #FFC2D4' }}>
              "Ngày xửa ngày xưa, trong một khu rừng xanh mát, có chú thỏ nhỏ chăm chỉ luôn biết vâng lời cha mẹ..."
            </div>

            {/* Recording Animation & Progress */}
            {isRecording ? (
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--kl-pink)', marginBottom: 8 }}>
                  🎙️ Đang thu âm & phân tích tần số giọng... ({recordProgress}%)
                </div>
                <div style={{ height: 8, background: '#FFC2D4', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--kl-pink)', width: `${recordProgress}%`, transition: 'width 0.4s ease' }} />
                </div>
              </div>
            ) : clonedSuccess ? (
              <div style={{ background: '#E6F9F3', color: 'var(--kl-green)', padding: '10px 14px', borderRadius: 14, fontWeight: 700, fontSize: 13, marginBottom: 18 }}>
                ✅ Đã có giọng đọc Mẹ (Mẫu AI đã sẵn sàng 100%)
              </div>
            ) : null}

            <button
              onClick={startRecording}
              className="kl-btn kl-btn-block"
              style={{
                background: isRecording ? '#E0E0E0' : 'var(--kl-pink)',
                color: isRecording ? '#666' : '#fff',
                padding: 14,
                fontSize: 15,
                fontWeight: 800,
                borderRadius: 18,
                boxShadow: '0 6px 16px rgba(255, 71, 133, 0.3)',
              }}
              disabled={isRecording}
            >
              {isRecording ? 'Đang thu âm...' : '🎙️ Bấm Thu Âm Giọng Mẫu (1 Phút)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
