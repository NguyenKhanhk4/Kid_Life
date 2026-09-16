import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';
import { IoSearchOutline, IoCloseCircle, IoTimeOutline, IoPersonCircleOutline } from 'react-icons/io5';

const D = MOCK_KIDLIFE_DATA;
const SKILLS = ['Tất cả', 'Vệ sinh', 'Tự lập', 'Giao tiếp', 'Cảm xúc', 'Sáng tạo', 'Lễ phép'];
const SKILL_COLORS: Record<string, string> = {
  'Vệ sinh': 'var(--kl-green)', 'Tự lập': 'var(--kl-purple)', 'Giao tiếp': 'var(--kl-primary)',
  'Cảm xúc': 'var(--kl-red)', 'Sáng tạo': 'var(--kl-orange)', 'Lễ phép': '#28B978',
};

export default function LessonLibraryPage() {
  const navigate = useNavigate();
  const [selectedSkill, setSelectedSkill] = useState('Tất cả');
  const [search, setSearch] = useState('');

  const filtered = D.lessons.filter(l => {
    if (selectedSkill !== 'Tất cả' && l.skill !== selectedSkill) return false;
    if (search && !l.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      {/* Page Header */}
      <div className="web-page-header">
        <div>
          <h1>Thư viện bài học 📚</h1>
          <p className="page-subtitle">Khám phá các bài học kỹ năng sống dành cho bé</p>
        </div>
        <span className="kl-badge" style={{ background: 'var(--kl-primary-soft)', color: 'var(--kl-primary)', fontSize: 13, padding: '6px 14px' }}>
          {D.lessons.length} bài học
        </span>
      </div>

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, background: '#fff',
        borderRadius: 16, padding: '0 16px', height: 50, marginBottom: 16,
        border: '1px solid var(--kl-border)', maxWidth: 500,
      }}>
        <IoSearchOutline size={20} color="var(--kl-muted)" />
        <input
          className="kl-input"
          style={{ background: 'transparent', height: 46, border: 'none', padding: 0, flex: 1 }}
          placeholder="Tìm kiếm bài học..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch('')}>
            <IoCloseCircle size={20} color="var(--kl-muted)" />
          </button>
        )}
      </div>

      {/* Skill filters */}
      <div className="filter-tab-bar" style={{ marginBottom: 24 }}>
        {SKILLS.map((skill) => (
          <button
            key={skill}
            onClick={() => setSelectedSkill(skill)}
            className={`filter-tab-btn ${selectedSkill === skill ? 'active' : ''}`}
          >
            {skill}
          </button>
        ))}
      </div>

      {/* Lesson Grid — 3 columns on desktop */}
      <div className="web-grid-3">
        {filtered.map((lesson) => {
          const skillColor = SKILL_COLORS[lesson.skill] ?? 'var(--kl-primary)';
          return (
            <div
              key={lesson.id}
              className="kl-card"
              style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => navigate(`/child/quiz/${lesson.id}`)}
            >
              <div style={{
                height: 120, background: 'var(--kl-primary-soft)', display: 'grid', placeItems: 'center',
                position: 'relative',
              }}>
                <span style={{ fontSize: 48 }}>{lesson.thumbnail}</span>
                <span style={{
                  position: 'absolute', bottom: 8, right: 8, display: 'flex', alignItems: 'center', gap: 4,
                  background: 'rgba(0,0,0,0.55)', borderRadius: 8, padding: '4px 8px', color: '#fff', fontSize: 11, fontWeight: 700,
                }}>
                  <IoTimeOutline size={12} /> {lesson.duration}
                </span>
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {lesson.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{
                    borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 700,
                    background: `${skillColor}18`, color: skillColor,
                  }}>
                    {lesson.skill}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--kl-muted)' }}>{lesson.ageRange} tuổi</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--kl-muted)' }}>
                  <IoPersonCircleOutline size={16} />
                  <span>{lesson.author}</span>
                  <span>• {lesson.views.toLocaleString()} lượt xem</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 80, color: 'var(--kl-muted)' }}>
          <span style={{ fontSize: 56 }}>📚</span>
          <p style={{ marginTop: 12, fontSize: 15 }}>Không tìm thấy bài học</p>
        </div>
      )}
    </div>
  );
}
