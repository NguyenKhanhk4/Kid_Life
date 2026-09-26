import type { KeyboardEvent } from 'react';
import { getSpeciesConfig, getStageImageUrl } from '../config/species.config';
import { STAGE_SCALE } from '../config/evolution.config';
import type { PetStage, WornAccessories } from '../types';
import { ParticleLayer } from './ParticleLayer';
import { PetFigure } from './PetFigure';
import { getStageEyes } from './eyes.config';
import { usePetAnimator } from './usePetAnimator';
import styles from './PetView.module.css';

export interface PetViewProps {
  speciesId: string;
  stage: PetStage;
  /** Số lần còn được cho ăn hôm nay; 0 → khoá nút cho ăn (pet "no rồi") */
  feedsLeft: number;
  /** Có giá trị → khoá nút cho ăn và hiện lý do (vd. không đủ XP) */
  blockedLabel?: string;
  /** Phụ kiện đang mặc / mặc thử (vẽ đè lên pet) */
  accessories?: WornAccessories;
  /** Gọi lên khi user tap vào pet (view đã tự chạy animation phản hồi, đây chỉ là thông báo). */
  onTap: () => void;
  /** Gọi lên khi user bấm cho ăn và view chấp nhận (không bị khoá vì đang ăn/tiến hoá). */
  onFeed: () => void;
}

// TODO: khi nâng cấp Rive, thay phần render bên dưới bằng
// <RiveComponent stateMachine tap feed stage={stage} />, giữ nguyên props đầu vào
// (speciesId, stage, feedsLeft, onTap, onFeed) để logic + dữ liệu user đã lưu không phải sửa gì.
export function PetView({ speciesId, stage, feedsLeft, blockedLabel, accessories, onTap, onFeed }: PetViewProps) {
  const animator = usePetAnimator({ speciesId, stage });
  const { behavior, displayStage } = animator;

  const species = getSpeciesConfig(speciesId);
  const scale = STAGE_SCALE[displayStage];

  const imageSrc = species ? getStageImageUrl(species, displayStage) : undefined;
  // Vị trí mắt trên ảnh stage hiện tại → chớp mắt (không cần thêm ảnh)
  const eyes = getStageEyes(speciesId, displayStage);

  const handleTap = () => {
    animator.tap();
    onTap();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTap();
    }
  };

  const handleFeed = () => {
    if (feedsLeft <= 0 || blockedLabel) return;
    if (animator.feed()) onFeed();
  };

  const avatarVars = {
    '--pet-dur': `${animator.duration}ms`,
    '--amp': behavior.idle.amp,
    '--rot': behavior.idle.rot,
  } as React.CSSProperties;

  return (
    <div className={styles.card}>
      <div className={styles.stageWrap} style={{ '--stage-scale': scale } as React.CSSProperties}>
        <div
          className={`${styles.avatar} ${styles[animator.motion]}`}
          style={avatarVars}
          role="button"
          tabIndex={0}
          aria-label={`Chạm vào ${species?.name ?? 'thú cưng'}`}
          onClick={handleTap}
          onKeyDown={handleKeyDown}
        >
          {imageSrc && (
            <PetFigure
              // key theo stage: đổi stage thì dựng lại mí mắt cho ảnh mới
              key={displayStage}
              src={imageSrc}
              eyes={eyes}
              alt={species?.name ?? speciesId}
              glow={behavior.idle.glow}
              eyesClosed={animator.eyesClosed}
              accessories={accessories}
              speciesId={speciesId}
              stage={displayStage}
            />
          )}
        </div>
        {/* Particle nằm ngoài avatar để không bị lắc/làm tối theo animation của pet */}
        <ParticleLayer ref={animator.particleRef} />
      </div>

      <button className={styles.feedButton} onClick={handleFeed} disabled={animator.feedLocked || feedsLeft <= 0 || !!blockedLabel}>
        {feedsLeft <= 0 ? 'No rồi 😋 Mai ăn tiếp nhé!' : (blockedLabel ?? `Cho ăn 🍎 (còn ${feedsLeft} lần hôm nay)`)}
      </button>
    </div>
  );
}
