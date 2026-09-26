import { useState, type KeyboardEvent } from 'react';
import { getSpeciesConfig, getStageImageUrl } from '../config/species.config';
import { EVOLUTION_CONFIG } from '../config/evolution.config';
import type { PetStage } from '../types';
import { ParticleLayer } from './ParticleLayer';
import { PetAnimDebugPanel } from './PetAnimDebugPanel';
import { PetFigure } from './PetFigure';
import { getStageEyes } from './eyes.config';
import { usePetAnimator } from './usePetAnimator';
import styles from './PetView.module.css';

export interface PetViewProps {
  speciesId: string;
  stage: PetStage;
  /** Số lần còn được cho ăn hôm nay; 0 → khoá nút cho ăn (pet "no rồi") */
  feedsLeft: number;
  /** Gọi lên khi user tap vào pet (view đã tự chạy animation phản hồi, đây chỉ là thông báo). */
  onTap: () => void;
  /** Gọi lên khi user bấm cho ăn và view chấp nhận (không bị khoá vì đang ăn/tiến hoá). */
  onFeed: () => void;
}

// TODO: khi nâng cấp Rive, thay phần render bên dưới bằng
// <RiveComponent stateMachine tap feed stage={stage} />, giữ nguyên props đầu vào
// (speciesId, stage, feedsLeft, onTap, onFeed) để logic + dữ liệu user đã lưu không phải sửa gì.
export function PetView({ speciesId, stage, feedsLeft, onTap, onFeed }: PetViewProps) {
  const [timeScale, setTimeScale] = useState(1);
  const [showEyes, setShowEyes] = useState(false);
  const [blinkSignal, setBlinkSignal] = useState(0);
  const animator = usePetAnimator({ speciesId, stage, timeScale });
  const { behavior, displayStage } = animator;

  const species = getSpeciesConfig(speciesId);
  const scale = EVOLUTION_CONFIG.stageScale[displayStage];

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
    if (feedsLeft <= 0) return;
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
              showEyes={showEyes}
              blinkSignal={blinkSignal}
            />
          )}
        </div>
        {/* Particle nằm ngoài avatar để không bị lắc/làm tối theo animation của pet */}
        <ParticleLayer ref={animator.particleRef} />
      </div>

      <button className={styles.feedButton} onClick={handleFeed} disabled={animator.feedLocked || feedsLeft <= 0}>
        {feedsLeft > 0 ? `Cho ăn 🍎 (còn ${feedsLeft} lần hôm nay)` : 'No rồi 😋 Mai ăn tiếp nhé!'}
      </button>

      {import.meta.env.DEV && (
        <PetAnimDebugPanel
          animator={animator}
          speciesId={speciesId}
          hasEyes={eyes.length > 0}
          showEyes={showEyes}
          onShowEyesChange={setShowEyes}
          onBlink={() => setBlinkSignal((n) => n + 1)}
          timeScale={timeScale}
          onTimeScaleChange={setTimeScale}
        />
      )}
    </div>
  );
}
