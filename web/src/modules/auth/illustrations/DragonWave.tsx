/**
 * DragonWave — Rồng con vẫy tay, flat illustration phong cách vector.
 *
 * Đổi màu qua CSS variables:
 *   --dragon-body:  màu thân chính (mặc định #A78BFA tím)
 *   --dragon-belly: màu bụng sáng hơn (mặc định #DDD6FE)
 *   --dragon-eye:   màu mắt (mặc định #3A3355)
 *
 * Props:
 *   className — thêm class để kiểm soát animation từ CSS bên ngoài
 *   mood — 'happy' (mặc định) | 'sad' | 'excited'
 */

interface DragonWaveProps {
  className?: string;
  mood?: 'happy' | 'sad' | 'excited';
  width?: number;
  height?: number;
}

export default function DragonWave({
  className = '',
  mood = 'happy',
  width = 220,
  height = 220,
}: DragonWaveProps) {
  // Biểu cảm mắt theo mood
  const eyeShape =
    mood === 'sad'
      ? 'M 0 -3 Q 5 2 10 -3' // mắt buồn (cong xuống)
      : mood === 'excited'
      ? 'M 0 2 Q 5 -4 10 2'  // mắt phấn khích (cong lên nhiều)
      : 'M 0 1 Q 5 -3 10 1'; // mắt bình thường

  const mouthPath =
    mood === 'sad'
      ? 'M 88 152 Q 110 145 132 152' // miệng cong xuống
      : 'M 88 148 Q 110 162 132 148'; // miệng cười

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 220 220"
      width={width}
      height={height}
      className={`dragon-wave-svg ${className}`}
      aria-label="Rồng con linh vật KidLife"
      role="img"
    >
      <defs>
        {/* Bóng đổ nhẹ cho chiều sâu */}
        <filter id="dragon-drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="rgba(58,51,85,0.18)" />
        </filter>
      </defs>

      {/* ── Đuôi rồng ────────────────────────────────────────────── */}
      <path
        d="M 165 170 Q 195 185 200 160 Q 210 130 180 125 Q 170 123 168 135 Q 182 138 178 155 Q 175 165 165 170 Z"
        fill="var(--dragon-body, #A78BFA)"
        stroke="var(--dragon-body, #A78BFA)"
        strokeWidth="2"
      />
      {/* Mấu đuôi nhọn */}
      <path
        d="M 165 170 Q 175 178 185 190 Q 178 192 168 180 Z"
        fill="var(--dragon-body, #A78BFA)"
      />

      {/* ── Thân chính ───────────────────────────────────────────── */}
      <ellipse
        cx="110"
        cy="145"
        rx="62"
        ry="52"
        fill="var(--dragon-body, #A78BFA)"
        filter="url(#dragon-drop-shadow)"
      />

      {/* Bụng sáng */}
      <ellipse
        cx="110"
        cy="152"
        rx="38"
        ry="30"
        fill="var(--dragon-belly, #DDD6FE)"
      />

      {/* ── Cánh trái ────────────────────────────────────────────── */}
      <path
        d="M 60 120 Q 20 80 35 55 Q 50 35 70 65 Q 80 80 72 108 Z"
        fill="var(--dragon-body, #A78BFA)"
        opacity="0.85"
      />
      <path
        d="M 63 118 Q 30 90 40 68 Q 50 50 65 75 Z"
        fill="var(--dragon-belly, #DDD6FE)"
        opacity="0.6"
      />

      {/* ── Cánh phải ────────────────────────────────────────────── */}
      <path
        d="M 160 120 Q 200 80 185 55 Q 170 35 150 65 Q 140 80 148 108 Z"
        fill="var(--dragon-body, #A78BFA)"
        opacity="0.85"
      />
      <path
        d="M 157 118 Q 190 90 180 68 Q 170 50 155 75 Z"
        fill="var(--dragon-belly, #DDD6FE)"
        opacity="0.6"
      />

      {/* ── Đầu rồng ─────────────────────────────────────────────── */}
      <circle
        cx="110"
        cy="90"
        r="50"
        fill="var(--dragon-body, #A78BFA)"
        filter="url(#dragon-drop-shadow)"
      />

      {/* Má hồng dễ thương */}
      <ellipse cx="85" cy="105" rx="12" ry="8" fill="#FF9BB5" opacity="0.5" />
      <ellipse cx="135" cy="105" rx="12" ry="8" fill="#FF9BB5" opacity="0.5" />

      {/* ── Mắt trái ─────────────────────────────────────────────── */}
      <circle cx="92" cy="85" r="12" fill="white" />
      <circle cx="95" cy="87" r="7" fill="var(--dragon-eye, #3A3355)" />
      <circle cx="97" cy="84" r="2.5" fill="white" />
      {/* Lông mày / biểu cảm */}
      <path
        d={`M ${eyeShape.startsWith('M 0 -3') ? '84 70 Q 92 66 100 70' :
             eyeShape.startsWith('M 0 2') ? '84 68 Q 92 62 100 68' :
             '84 70 Q 92 66 100 70'}`}
        stroke="var(--dragon-eye, #3A3355)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        className={mood === 'sad' ? 'dragon-brow-sad' : ''}
      />

      {/* ── Mắt phải ─────────────────────────────────────────────── */}
      <circle cx="128" cy="85" r="12" fill="white" />
      <circle cx="131" cy="87" r="7" fill="var(--dragon-eye, #3A3355)" />
      <circle cx="133" cy="84" r="2.5" fill="white" />
      <path
        d={`M ${eyeShape.startsWith('M 0 -3') ? '120 70 Q 128 66 136 70' :
             eyeShape.startsWith('M 0 2') ? '120 68 Q 128 62 136 68' :
             '120 70 Q 128 66 136 70'}`}
        stroke="var(--dragon-eye, #3A3355)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── Miệng ────────────────────────────────────────────────── */}
      <path
        d={mouthPath}
        stroke="var(--dragon-eye, #3A3355)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {mood !== 'sad' && (
        /* Lưỡi dễ thương khi vui */
        <ellipse cx="110" cy="158" rx="8" ry="5" fill="#FF6B9D" />
      )}

      {/* ── Sừng nhỏ ─────────────────────────────────────────────── */}
      <path d="M 95 42 Q 90 22 100 18 Q 105 28 102 42 Z" fill="var(--dragon-body, #A78BFA)" />
      <path d="M 125 42 Q 130 22 120 18 Q 115 28 118 42 Z" fill="var(--dragon-body, #A78BFA)" />

      {/* Mấu sừng */}
      <circle cx="100" cy="19" r="5" fill="var(--dragon-sun, #FFD93D)" />
      <circle cx="120" cy="19" r="5" fill="var(--dragon-sun, #FFD93D)" />

      {/* ── Tay vẫy (bên phải — tay trên cao) ───────────────────── */}
      <path
        className="dragon-arm"
        d="M 150 130 Q 175 110 182 90 Q 186 78 178 72 Q 170 68 164 80 Q 158 95 155 120 Z"
        fill="var(--dragon-body, #A78BFA)"
      />
      {/* Ngón tay */}
      <circle cx="178" cy="72" r="8" fill="var(--dragon-body, #A78BFA)" />
      <circle cx="188" cy="78" r="7" fill="var(--dragon-body, #A78BFA)" />
      <circle cx="184" cy="64" r="6.5" fill="var(--dragon-body, #A78BFA)" />

      {/* ── Tay trái ─────────────────────────────────────────────── */}
      <path
        d="M 70 130 Q 50 118 44 135 Q 40 148 54 152 Q 65 155 72 140 Z"
        fill="var(--dragon-body, #A78BFA)"
      />

      {/* ── Chân ─────────────────────────────────────────────────── */}
      <path d="M 85 188 Q 78 200 88 205 Q 98 208 102 195 Q 100 185 90 183 Z" fill="var(--dragon-body, #A78BFA)" />
      <path d="M 135 188 Q 142 200 132 205 Q 122 208 118 195 Q 120 185 130 183 Z" fill="var(--dragon-body, #A78BFA)" />

      {/* ── Vảy lưng trang trí ───────────────────────────────────── */}
      <path d="M 100 95 Q 95 75 105 70 Q 115 75 110 95 Z" fill="var(--dragon-sun, #FFD93D)" opacity="0.9" />
      <path d="M 115 90 Q 110 70 122 67 Q 130 73 124 90 Z" fill="var(--dragon-sun, #FFD93D)" opacity="0.75" />
      <path d="M 88 92 Q 80 74 92 68 Q 100 73 96 92 Z" fill="var(--dragon-sun, #FFD93D)" opacity="0.75" />

      {/* ── Hiệu ứng lấp lánh trang trí ─────────────────────────── */}
      <circle cx="40" cy="55" r="4" fill="var(--dragon-sun, #FFD93D)" opacity="0.8" />
      <circle cx="50" cy="40" r="2.5" fill="var(--dragon-sun, #FFD93D)" opacity="0.6" />
      <circle cx="180" cy="45" r="3" fill="var(--dragon-sun, #FFD93D)" opacity="0.8" />
      <circle cx="190" cy="60" r="2" fill="var(--dragon-sun, #FFD93D)" opacity="0.5" />
    </svg>
  );
}
