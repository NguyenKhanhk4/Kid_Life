import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoArrowBack,
  IoPlay,
  IoPause,
  IoCheckmarkCircle,
  IoStar,
  IoPersonCircleOutline,
  IoTimeOutline,
  IoSparkles,
  IoRibbonOutline,
  IoHelpCircleOutline,
  IoVideocamOutline,
} from 'react-icons/io5';
import { getVideoById, updateVideoProgress } from '@/shared/utils/videoLessonStorage';
import { VideoLesson } from '@/shared/types/videoLesson';
import ConfettiEffect from '@/shared/components/ConfettiEffect';

const getYouTubeEmbedUrl = (url?: string) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0` : null;
};

export default function VideoPlayerPage() {
  const navigate = useNavigate();
  const { videoId } = useParams();

  const [video, setVideo] = useState<VideoLesson | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 -> 100%
  const [showConfetti, setShowConfetti] = useState(false);
  const [toastNotice, setToastNotice] = useState<string | null>(null);
  const [playerMode, setPlayerMode] = useState<'video' | 'animated'>('video');

  // TODO: Replace with API call → GET /api/child/video-lessons/:id
  useEffect(() => {
    if (videoId) {
      const found = getVideoById(videoId);
      if (found) {
        setVideo(found);
        setProgress(found.watchProgress || 0);
        const hasUrl = Boolean(
          found.video_url && (getYouTubeEmbedUrl(found.video_url) || found.video_url.endsWith('.mp4'))
        );
        setPlayerMode(hasUrl ? 'video' : 'animated');
      }
    }
  }, [videoId]);

  // Giả lập xem video: tự động tăng 1% mỗi 200ms khi đang play
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          handleFinishVideo(100);
          return 100;
        }
        const next = prev + 1;
        // Cập nhật ngầm tiến độ vào localStorage mỗi khi tăng 5%
        if (next % 5 === 0 && video) {
          updateVideoProgress(video.id, next, false);
        }
        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isPlaying, video]);

  const handleFinishVideo = (finalProgress = 100) => {
    if (!video) return;
    setIsPlaying(false);
    setProgress(finalProgress);

    const { isNewlyCompleted, xpAwarded } = updateVideoProgress(video.id, finalProgress, true);

    if (isNewlyCompleted && xpAwarded > 0) {
      setShowConfetti(true);
      setToastNotice(`Chúc mừng bé đã hoàn thành bài học! +${xpAwarded} XP đã cộng vào Ví điểm! 🌟`);
    } else {
      setToastNotice(`Bé đã ôn tập lại bài học thành công! 🎉`);
    }

    setVideo((prev) => (prev ? { ...prev, isWatched: true, watchProgress: 100 } : null));

    setTimeout(() => {
      setToastNotice(null);
    }, 4500);
  };

  if (!video) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <p style={{ color: 'var(--kl-muted)' }}>Đang tải bài học video...</p>
      </div>
    );
  }

  // Tính toán thời gian hiển thị (vd: 02:30 / 05:00)
  const totalSeconds = video.durationSeconds || 300;
  const currentSeconds = Math.round((progress / 100) * totalSeconds);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isCompleted = video.isWatched || progress >= 100;
  const canClaimReward = progress >= 80 && !isCompleted;

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', paddingBottom: 50, paddingTop: 10 }}>
      <ConfettiEffect show={showConfetti} onFinish={() => setShowConfetti(false)} />

      {/* Toast Alert */}
      <AnimatePresence>
        {toastNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 99999,
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#ffffff',
              padding: '14px 28px',
              borderRadius: 20,
              boxShadow: '0 12px 30px rgba(5, 150, 105, 0.4)',
              fontWeight: 800,
              fontSize: 15,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              border: '2px solid #6EE7B7',
            }}
          >
            <span style={{ fontSize: 22 }}>🎉</span>
            {toastNotice}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back button */}
      <button
        onClick={() => navigate('/child/video-lessons')}
        className="kl-btn"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--kl-primary-dark)',
          fontSize: 14,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          cursor: 'pointer',
          padding: '8px 0',
          marginBottom: 16,
        }}
      >
        <IoArrowBack size={18} /> Quay lại danh sách bài học video
      </button>

      {/* Mode switcher if video_url is present */}
      {Boolean(video.video_url && (getYouTubeEmbedUrl(video.video_url) || video.video_url.endsWith('.mp4'))) && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 12 }}>
          <button
            onClick={() => {
              setPlayerMode('video');
              setIsPlaying(false);
            }}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: playerMode === 'video' ? '2px solid var(--kl-primary)' : '1px solid #CBD5E1',
              background: playerMode === 'video' ? 'var(--kl-primary)' : '#ffffff',
              color: playerMode === 'video' ? '#ffffff' : '#64748B',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s',
            }}
          >
            <IoVideocamOutline size={16} /> Video thực tế
          </button>
          <button
            onClick={() => setPlayerMode('animated')}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: playerMode === 'animated' ? '2px solid var(--kl-primary)' : '1px solid #CBD5E1',
              background: playerMode === 'animated' ? 'var(--kl-primary)' : '#ffffff',
              color: playerMode === 'animated' ? '#ffffff' : '#64748B',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s',
            }}
          >
            <IoSparkles size={16} /> Hoạt hình KidLife
          </button>
        </div>
      )}

      {playerMode === 'video' && Boolean(video.video_url && (getYouTubeEmbedUrl(video.video_url) || video.video_url.endsWith('.mp4'))) ? (
        <div
          style={{
            background: '#0F172A',
            borderRadius: 28,
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.25)',
            border: '3px solid #1E293B',
            marginBottom: 24,
          }}
        >
          {getYouTubeEmbedUrl(video.video_url) ? (
            <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000' }}>
              <iframe
                src={getYouTubeEmbedUrl(video.video_url)!}
                title={video.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div style={{ width: '100%', background: '#000', display: 'flex', justifyContent: 'center' }}>
              <video
                controls
                src={video.video_url}
                style={{ width: '100%', maxHeight: 420 }}
                onTimeUpdate={(e) => {
                  const cur = e.currentTarget.currentTime;
                  const dur = e.currentTarget.duration;
                  if (dur > 0) {
                    const pct = Math.min(100, Math.round((cur / dur) * 100));
                    setProgress(pct);
                    if (pct >= 85 && !isCompleted) {
                      handleFinishVideo(100);
                    }
                  }
                }}
              />
            </div>
          )}

          {/* Video completion action bar */}
          <div
            style={{
              padding: '16px 20px',
              background: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
              borderTop: '1px solid #1E293B',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <IoCheckmarkCircle size={22} color={isCompleted ? '#10B981' : '#94A3B8'} />
              <div>
                <div style={{ color: '#F1F5F9', fontWeight: 800, fontSize: 13.5 }}>
                  {isCompleted ? 'Bé đã hoàn thành bài học này! 🌟' : 'Bé đã xem xong video bài giảng này chưa?'}
                </div>
                <div style={{ color: '#94A3B8', fontSize: 12 }}>
                  {isCompleted
                    ? `Phần thưởng +${video.reward_xp} XP đã được lưu vào ví`
                    : `Xem xong hãy bấm nút bên phải để nhận thưởng ngay`}
                </div>
              </div>
            </div>

            <div>
              {isCompleted ? (
                <span
                  style={{
                    background: '#10B981',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: 14,
                    fontSize: 13,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <IoCheckmarkCircle size={18} /> Đã nhận +{video.reward_xp} XP
                </span>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFinishVideo(100)}
                  style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: '#ffffff',
                    padding: '10px 20px',
                    borderRadius: 16,
                    fontSize: 13.5,
                    fontWeight: 900,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <IoStar size={17} color="#FEF08A" />
                  Đã xem xong & Nhận +{video.reward_xp} XP ngay!
                </motion.button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Cinematic Player Placeholder */
        <div
          style={{
            background: '#0F172A',
            borderRadius: 28,
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.25)',
            border: '3px solid #1E293B',
            position: 'relative',
            marginBottom: 24,
          }}
        >
        {/* Screen Area */}
        <div
          style={{
            height: 380,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            background: 'radial-gradient(circle at center, #1E293B 0%, #0F172A 100%)',
          }}
        >
          {/* Pulsating Emoji Centerpiece */}
          <div style={{ position: 'relative', display: 'grid', placeItems: 'center' }}>
            {isPlaying && (
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.1, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  width: 140,
                  height: 140,
                  borderRadius: 70,
                  background: 'rgba(59, 130, 246, 0.35)',
                }}
              />
            )}
            <motion.span
              animate={isPlaying ? { y: [0, -8, 0] } : {}}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
              style={{ fontSize: 96, position: 'relative', zIndex: 2 }}
            >
              {video.thumbnail_emoji}
            </motion.span>
          </div>

          <h2
            style={{
              color: '#ffffff',
              fontSize: 20,
              fontWeight: 800,
              marginTop: 18,
              textAlign: 'center',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              padding: '0 20px',
            }}
          >
            {video.title}
          </h2>

          <p style={{ color: '#94A3B8', fontSize: 13, marginTop: 4 }}>
            Giảng viên: {video.instructor} • {video.categoryLabel}
          </p>

          {/* Big Play / Pause Overlay Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              marginTop: 20,
              width: 64,
              height: 64,
              borderRadius: 32,
              background: isPlaying ? '#EF4444' : 'var(--kl-primary)',
              border: 'none',
              color: '#ffffff',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              boxShadow: isPlaying
                ? '0 0 24px rgba(239, 68, 68, 0.6)'
                : '0 0 24px rgba(43, 68, 232, 0.6)',
            }}
          >
            {isPlaying ? <IoPause size={28} /> : <IoPlay size={28} style={{ marginLeft: 3 }} />}
          </motion.button>
        </div>

        {/* Player Controls Bar */}
        <div
          style={{
            padding: '14px 20px',
            background: 'rgba(15, 23, 42, 0.95)',
            borderTop: '1px solid #1E293B',
          }}
        >
          {/* Interactive Scrubber Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ color: '#94A3B8', fontSize: 12, fontWeight: 700, minWidth: 42 }}>
              {formatTime(currentSeconds)}
            </span>

            <div
              style={{
                flex: 1,
                height: 8,
                borderRadius: 4,
                background: '#334155',
                position: 'relative',
                cursor: 'pointer',
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newPct = Math.round((clickX / rect.width) * 100);
                const clamped = Math.min(100, Math.max(0, newPct));
                setProgress(clamped);
                if (clamped >= 100) {
                  handleFinishVideo(100);
                }
              }}
            >
              <div
                style={{
                  height: '100%',
                  borderRadius: 4,
                  background: isCompleted ? '#10B981' : 'linear-gradient(90deg, #3B82F6, #10B981)',
                  width: `${progress}%`,
                  transition: isPlaying ? 'none' : 'width 0.2s',
                }}
              />
            </div>

            <span style={{ color: '#94A3B8', fontSize: 12, fontWeight: 700, minWidth: 42, textAlign: 'right' }}>
              {video.duration}
            </span>
          </div>

          {/* Action Row inside Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="kl-btn"
                style={{
                  background: isPlaying ? '#334155' : 'var(--kl-primary)',
                  color: '#ffffff',
                  padding: '6px 14px',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {isPlaying ? (
                  <>
                    <IoPause size={16} /> Tạm dừng
                  </>
                ) : (
                  <>
                    <IoPlay size={16} /> {progress > 0 ? 'Tiếp tục xem' : 'Bắt đầu xem'}
                  </>
                )}
              </button>

              <span style={{ color: '#64748B', fontSize: 12 }}>
                Tiến độ: <strong style={{ color: '#F1F5F9' }}>{progress}%</strong>
              </span>
            </div>

            {/* Claim Reward Button */}
            <div>
              {isCompleted ? (
                <span
                  style={{
                    background: '#10B981',
                    color: '#ffffff',
                    padding: '6px 14px',
                    borderRadius: 14,
                    fontSize: 13,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <IoCheckmarkCircle size={18} /> Đã hoàn thành (+{video.reward_xp} XP)
                </span>
              ) : canClaimReward ? (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleFinishVideo(100)}
                  style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: '#ffffff',
                    padding: '8px 18px',
                    borderRadius: 14,
                    fontSize: 13,
                    fontWeight: 900,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <IoStar size={16} color="#FEF08A" />
                  Đánh dấu đã xem và nhận +{video.reward_xp} XP
                </motion.button>
              ) : (
                <button
                  onClick={() => handleFinishVideo(100)}
                  style={{
                    background: 'transparent',
                    color: '#94A3B8',
                    border: '1px dashed #475569',
                    padding: '6px 12px',
                    borderRadius: 12,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  Đánh dấu xem xong ngay
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Lesson Details Card */}
      <div className="kl-card" style={{ padding: 26, borderRadius: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span
                style={{
                  background: '#EEF2FF',
                  color: 'var(--kl-primary)',
                  padding: '3px 10px',
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                {video.categoryLabel}
              </span>
              <span style={{ fontSize: 13, color: 'var(--kl-muted)' }}>• {video.ageLabel}</span>
              <span style={{ fontSize: 13, color: 'var(--kl-muted)' }}>• {video.duration}</span>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--kl-primary-dark)', margin: 0 }}>
              {video.title}
            </h1>
          </div>

          <div
            style={{
              background: '#FEF08A',
              color: '#854D0E',
              padding: '8px 16px',
              borderRadius: 16,
              fontSize: 15,
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <IoStar size={18} color="#D97706" />
            +{video.reward_xp} XP
          </div>
        </div>

        <p style={{ color: '#475569', fontSize: 14.5, lineHeight: 1.6, marginBottom: 20 }}>
          {video.description}
        </p>

        {/* Key Takeaways */}
        <div
          style={{
            background: '#F8FAFC',
            borderRadius: 20,
            padding: 20,
            border: '1.5px solid #E2E8F0',
          }}
        >
          <h3
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: 'var(--kl-primary-dark)',
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <IoRibbonOutline size={20} color="var(--kl-primary)" />
            Nội dung bài học rút ra cho bé:
          </h3>

          <ul style={{ margin: 0, paddingLeft: 22, display: 'grid', gap: 8 }}>
            {video.keyTakeaways.map((point, idx) => (
              <li key={idx} style={{ fontSize: 14, color: '#334155', lineHeight: 1.5, fontWeight: 600 }}>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Suggestion to take quiz */}
        <div
          style={{
            marginTop: 20,
            padding: '16px 20px',
            borderRadius: 18,
            background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28 }}>🧠</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--kl-primary-dark)' }}>
                Ôn luyện trí nhớ bài học này
              </div>
              <div style={{ fontSize: 12, color: 'var(--kl-muted)' }}>
                Làm ngay quiz trắc nghiệm để củng cố kiến thức và kiếm thêm XP!
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/child/quiz-library')}
            className="kl-btn kl-btn-primary kl-btn-sm"
            style={{ borderRadius: 12, fontWeight: 800 }}
          >
            Làm Quiz ngay ▶
          </button>
        </div>
      </div>
    </div>
  );
}
