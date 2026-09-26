// Interface định nghĩa module Học bài Video
export type VideoCategory = 've_sinh' | 'tu_lap' | 'giao_tiep' | 'cam_xuc' | 'sang_tao' | 'le_phep';

export interface VideoLesson {
  id: string;
  title: string;           // "Cách đánh răng đúng cách"
  description: string;
  category: VideoCategory;
  categoryLabel: string;
  ageMin: number;
  ageMax: number;
  ageLabel: string;        // "4-6 tuổi"
  duration: string;        // "5:30" (phút:giây)
  durationSeconds: number; // thời lượng tính bằng giây để mô phỏng
  thumbnail_emoji: string; // Dùng emoji thay thumbnail thật vì chưa có video
  thumbnail_color: string; // Màu nền card (pastel)
  video_url: string;       // PLACEHOLDER: "" (rỗng, sẽ implement sau)
  instructor: string;      // "Cô Hoa"
  reward_xp: number;
  views: number;
  tags: string[];
  keyTakeaways: string[];  // Các điểm rút ra của bài học
  status?: 'visible' | 'hidden'; // Trạng thái hiển thị (admin quản lý)
  isAssigned?: boolean;    // Phụ huynh đã assign cho bé chưa
  isWatched?: boolean;     // Bé đã xem xong chưa
  watchProgress?: number;  // % đã xem (0-100)
}

export interface VideoProgressRecord {
  videoId: string;
  videoTitle: string;
  watched: boolean;
  progress: number;        // % đã xem (0 - 100)
  reward_xp: number;
  completedAt?: string;
  lastWatchedAt?: string;
}
