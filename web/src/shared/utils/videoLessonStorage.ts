import { VideoLesson, VideoProgressRecord } from '@/shared/types/videoLesson';
import { getWalletData, saveWalletData, addTransaction, WalletData } from '@/shared/utils/walletStorage';
import {
  getAdminVideoBank,
  getAssignedVideos,
  toggleAssignVideo,
} from '@/shared/utils/contentStorage';

const VIDEO_PROGRESS_KEY = 'kidlife_video_progress';

// 1. Lấy danh sách ID các video được bố mẹ giao
export function getAssignedVideoIds(): string[] {
  return getAssignedVideos();
}

// 2. Toggle trạng thái giao video cho bé
export function toggleVideoAssignment(videoId: string): boolean {
  return toggleAssignVideo(videoId);
}

// 3. Lấy tiến độ xem video
export function getVideoProgressMap(): Record<string, VideoProgressRecord> {
  try {
    const raw = localStorage.getItem(VIDEO_PROGRESS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return {};
}

// 4. Lấy tất cả video bài học kèm trạng thái giao & tiến độ (chỉ lấy video visible cho Phụ huynh & Bé)
export function getAllVideos(): VideoLesson[] {
  const bank = getAdminVideoBank();
  const visibleVideos = bank.filter((v) => v.status !== 'hidden');
  const assignedIds = getAssignedVideos();
  const progressMap = getVideoProgressMap();

  return visibleVideos.map((video) => {
    const isAssigned = assignedIds.includes(video.id);
    const progressRecord = progressMap[video.id];
    return {
      ...video,
      isAssigned,
      isWatched: progressRecord?.watched || false,
      watchProgress: progressRecord?.progress || 0,
    };
  });
}

// 5. Lấy video chỉ dành cho bé (các video đã được phụ huynh giao)
export function getAssignedVideosForChild(): VideoLesson[] {
  const all = getAllVideos();
  return all.filter((v) => v.isAssigned);
}

// 6. Lấy chi tiết 1 video theo ID
export function getVideoById(id: string): VideoLesson | undefined {
  const all = getAllVideos();
  return all.find((v) => v.id === id);
}

// 7. Cập nhật tiến độ xem video và hoàn thành bài học
export function updateVideoProgress(
  videoId: string,
  progress: number,
  isFinished = false
): { isNewlyCompleted: boolean; xpAwarded: number } {
  const all = getAllVideos();
  const video = all.find((v) => v.id === videoId);
  if (!video) return { isNewlyCompleted: false, xpAwarded: 0 };

  const currentMap = getVideoProgressMap();
  const prevRecord = currentMap[videoId];
  const wasAlreadyCompleted = prevRecord?.watched === true;

  const willBeCompleted = isFinished || progress >= 100;
  const isNewlyCompleted = willBeCompleted && !wasAlreadyCompleted;
  const xpAwarded = isNewlyCompleted ? video.reward_xp : 0;

  const updatedRecord: VideoProgressRecord = {
    videoId,
    videoTitle: video.title,
    watched: willBeCompleted || (prevRecord?.watched ?? false),
    progress: Math.min(100, Math.max(progress, prevRecord?.progress || 0)),
    reward_xp: isNewlyCompleted ? video.reward_xp : (prevRecord?.reward_xp || 0),
    completedAt: isNewlyCompleted ? new Date().toISOString() : prevRecord?.completedAt,
    lastWatchedAt: new Date().toISOString(),
  };

  currentMap[videoId] = updatedRecord;
  localStorage.setItem(VIDEO_PROGRESS_KEY, JSON.stringify(currentMap));
  window.dispatchEvent(new CustomEvent('kidlife_video_progress_update', { detail: updatedRecord }));

  // Nếu hoàn thành lần đầu, cộng XP vào ví và ghi giao dịch
  if (isNewlyCompleted && xpAwarded > 0) {
    const wallet = getWalletData();
    const newWallet: WalletData = {
      ...wallet,
      balance: wallet.balance + xpAwarded,
    };
    saveWalletData(newWallet);

    addTransaction({
      title: `Hoàn thành xem video: ${video.title}`,
      amount: xpAwarded,
      emoji: '🎬',
      type: 'earn',
      date: 'Vừa xong',
    });
  }

  return { isNewlyCompleted, xpAwarded };
}
