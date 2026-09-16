import { useState } from 'react';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';
import { IoPlay, IoPause, IoVolumeHigh, IoVolumeMute, IoSparkles, IoArrowBack } from 'react-icons/io5';

const D = MOCK_KIDLIFE_DATA;

export default function ChildStoriesPage() {
  const [selectedStory, setSelectedStory] = useState(D.stories[0]);
  const [selectedVoice, setSelectedVoice] = useState(D.voiceCharacters[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bgmActive, setBgmActive] = useState(true);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="web-page-header">
        <div>
          <h1>Góc Giờ Kể Chuyện Kỳ Diệu 🌙🌟</h1>
          <p className="page-subtitle">Nghe truyện cổ tích với 8 nhân vật giọng đọc bí mật</p>
        </div>
        <span className="kl-badge" style={{ background: '#FFF0F5', color: 'var(--kl-pink)', fontSize: 13, padding: '6px 14px' }}>
          ✨ Giọng Mẹ AI đã sẵn sàng
        </span>
      </div>

      <div className="web-grid-2-1" style={{ marginBottom: 24 }}>
        {/* Left: Audio Story Player */}
        <div
          className="kl-card"
          style={{
            padding: 32,
            borderRadius: 28,
            background: selectedVoice.bgGradient,
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
            transition: 'background 0.5s ease',
          }}
        >
          {/* Top Player Status */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="kl-badge" style={{ background: 'rgba(255,255,255,0.25)', color: '#fff', fontSize: 12, fontWeight: 700 }}>
              {selectedStory.category}
            </span>
            <button
              onClick={() => setBgmActive(!bgmActive)}
              style={{
                background: 'rgba(255,255,255,0.25)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {bgmActive ? <IoVolumeHigh size={16} /> : <IoVolumeMute size={16} />}
              {bgmActive ? 'BGM Nhạc Nền: Bật 🎶' : 'BGM: Tắt'}
            </button>
          </div>

          {/* Center Story Cover & Voice Avatar */}
          <div style={{ textAlign: 'center', margin: '24px 0' }}>
            <div style={{ fontSize: 90, marginBottom: 12, filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))' }}>
              {selectedStory.cover}
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
              {selectedStory.title}
            </h2>
            <div style={{ fontSize: 13, opacity: 0.9, maxWidth: 360, margin: '0 auto', background: 'rgba(0,0,0,0.15)', padding: '8px 16px', borderRadius: 20 }}>
              🗣️ Đang phát bằng: <b>{selectedVoice.icon} {selectedVoice.name}</b>
            </div>
          </div>

          {/* Story Text Excerpt */}
          <div
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              padding: 20,
              borderRadius: 20,
              fontSize: 14,
              lineHeight: 1.7,
              marginBottom: 24,
              maxHeight: 130,
              overflowY: 'auto',
            }}
          >
            "{selectedStory.text}"
          </div>

          {/* Player Controls */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, opacity: 0.8, marginBottom: 6 }}>
              <span>{isPlaying ? '01:25' : '00:00'}</span>
              <span>{selectedStory.duration}</span>
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.3)', borderRadius: 4, overflow: 'hidden', marginBottom: 20 }}>
              <div style={{ height: '100%', background: '#fff', width: isPlaying ? '35%' : '0%', transition: 'width 0.4s ease' }} />
            </div>

            <button
              onClick={togglePlay}
              style={{
                width: '100%',
                padding: 16,
                borderRadius: 24,
                background: '#fff',
                color: 'var(--kl-primary-dark)',
                fontSize: 17,
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
              }}
            >
              {isPlaying ? <IoPause size={24} /> : <IoPlay size={24} />}
              {isPlaying ? 'Tạm Dừng Đọc Truyện' : '▶️ Bấm Đọc Truyện Cho Bé'}
            </button>
          </div>
        </div>

        {/* Right: Voice Character & Story Selection */}
        <div style={{ display: 'grid', gap: 20 }}>
          {/* 8 Voice Character Selector */}
          <div className="kl-card" style={{ padding: 22, borderRadius: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--kl-primary-dark)', marginBottom: 14 }}>
              Chọn 8 Nhân Vật Giọng Đọc 🗣️
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {D.voiceCharacters.map((voice) => {
                const isSelected = selectedVoice.id === voice.id;
                return (
                  <button
                    key={voice.id}
                    onClick={() => setSelectedVoice(voice)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      borderRadius: 16,
                      border: isSelected ? `2px solid ${voice.color}` : '1px solid var(--kl-border)',
                      background: isSelected ? 'rgba(43, 68, 232, 0.08)' : '#fff',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{voice.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--kl-primary-dark)' }}>{voice.name}</div>
                      {voice.isCloned && (
                        <span style={{ fontSize: 10, color: 'var(--kl-pink)', fontWeight: 700 }}>✨ AI Voice</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Story List */}
          <div className="kl-card" style={{ padding: 22, borderRadius: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--kl-primary-dark)', marginBottom: 14 }}>
              Chọn Thư Viện Truyện 📚
            </h3>
            <div style={{ display: 'grid', gap: 10 }}>
              {D.stories.map((story) => {
                const isSelected = selectedStory.id === story.id;
                return (
                  <button
                    key={story.id}
                    onClick={() => setSelectedStory(story)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: 12,
                      borderRadius: 14,
                      border: isSelected ? '2px solid var(--kl-primary)' : '1px solid var(--kl-border)',
                      background: isSelected ? 'var(--kl-primary-soft)' : '#fff',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: 28 }}>{story.cover}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--kl-primary-dark)' }}>{story.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--kl-muted)', marginTop: 2 }}>{story.category} • {story.duration}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
