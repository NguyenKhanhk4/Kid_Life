import { useEffect, useRef, useState } from 'react';
import { getSpeciesConfig } from '../config/species.config';
import { EVOLUTION_CONFIG } from '../config/evolution.config';
import type { PetStage } from '../types';
import { ParticleLayer, type ParticleLayerHandle } from './ParticleLayer';
import { petSound } from './sound';
import styles from './PetView.module.css';

type AnimState = 'idle' | 'onTap' | 'onFeed' | 'onEvolve';

export interface PetViewProps {
  speciesId: string;
  stage: PetStage;
  /** Gọi lên khi user tap vào pet (view đã tự chạy animation phản hồi, đây chỉ là thông báo). */
  onTap: () => void;
  /** Gọi lên khi user bấm cho ăn (view đã tự chạy animation phản hồi, đây chỉ là thông báo). */
  onFeed: () => void;
}

// TODO: khi nâng cấp Rive, thay phần render bên dưới bằng
// <RiveComponent stateMachine tap feed stage={stage} />, giữ nguyên props đầu vào
// (speciesId, stage, onTap, onFeed) để logic + dữ liệu user đã lưu không phải sửa gì.
export function PetView({ speciesId, stage, onTap, onFeed }: PetViewProps) {
  const [animState, setAnimState] = useState<AnimState>('idle');
  const busyRef = useRef(false);
  const particleRef = useRef<ParticleLayerHandle>(null);
  const prevStageRef = useRef(stage);

  const species = getSpeciesConfig(speciesId);
  const imageSrc = species ? `${species.imageBaseUrl}/stage-${stage}.svg` : undefined;
  const scale = EVOLUTION_CONFIG.stageScale[stage];

  const playAnim = (name: AnimState, duration: number) => {
    busyRef.current = true;
    setAnimState(name);
    setTimeout(() => {
      setAnimState('idle');
      busyRef.current = false;
    }, duration);
  };

  const handleTapClick = () => {
    if (busyRef.current) return;
    playAnim('onTap', 500);
    particleRef.current?.burst('heart');
    petSound.tap();
    onTap();
  };

  const handleFeedClick = () => {
    if (busyRef.current) return;
    playAnim('onFeed', 900);
    particleRef.current?.burst('crumb');
    petSound.feed();
    onFeed();
  };

  // "onEvolve" không phải callback từ ngoài — tự phát hiện khi prop stage tăng lên,
  // giống hệt cách Rive sẽ nhận input số "stage" và tự chuyển state machine.
  useEffect(() => {
    if (stage > prevStageRef.current) {
      playAnim('onEvolve', 1100);
      particleRef.current?.burst('confetti');
      petSound.evolve();
    }
    prevStageRef.current = stage;
  }, [stage]);

  return (
    <div className={styles.card}>
      <div
        className={styles.stageWrap}
        style={{ transform: `scale(${scale})` }}
      >
        <div
          className={`${styles.avatar} ${animState !== 'idle' ? styles[animState] : ''}`}
          onClick={handleTapClick}
        >
          {imageSrc && <img className={styles.avatarImg} src={imageSrc} alt={species?.name ?? speciesId} />}
          <ParticleLayer ref={particleRef} />
        </div>
      </div>

      <button className={styles.feedButton} onClick={handleFeedClick}>
        Cho ăn 🍎
      </button>
    </div>
  );
}
