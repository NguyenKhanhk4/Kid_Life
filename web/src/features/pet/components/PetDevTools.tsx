import { EVOLUTION_CONFIG } from '../config/evolution.config';
import { PET_SPECIES } from '../config/species.config';
import type { Pet, PetStage } from '../types';
import styles from '../view/PetDebug.module.css';

interface PetDevToolsProps {
  pet: Pet;
  onSelectSpecies: (speciesId: string) => void;
  onSetStage: (stage: PetStage) => void;
  onFeed: () => void;
  onResetFeeds: () => void;
  onReset: () => void;
}

const STAGES = Array.from({ length: EVOLUTION_CONFIG.maxStage }, (_, i) => (i + 1) as PetStage);

/**
 * Chỉ render ở môi trường dev: đổi loài / nhảy stage / reset để test view nhanh.
 * Đổi stage lên cao hơn sẽ chạy animation tiến hoá như thật.
 */
export function PetDevTools({ pet, onSelectSpecies, onSetStage, onFeed, onResetFeeds, onReset }: PetDevToolsProps) {
  return (
    <div className={styles.panel} style={{ margin: '16px auto 0' }}>
      <div className={styles.header}>
        <strong>🧪 Debug dữ liệu pet</strong>
        <span className={styles.current}>
          {pet.speciesId} · stage {pet.currentStage} · {pet.currentExp} EXP · đã ăn {pet.feedsToday} lần ({pet.lastFedDate ?? 'chưa'})
        </span>
      </div>

      <div className={styles.row}>
        Loài:
        <select className={styles.select} value={pet.speciesId} onChange={(e) => onSelectSpecies(e.target.value)}>
          {PET_SPECIES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.id})
            </option>
          ))}
        </select>
        <button className={styles.chip} onClick={onFeed}>
          +{EVOLUTION_CONFIG.expPerFeed} EXP (không animation)
        </button>
        <button className={styles.chip} onClick={onResetFeeds}>
          Trả lại lượt ăn hôm nay
        </button>
        <button className={`${styles.chip} ${styles.danger}`} onClick={onReset}>
          Xoá pet
        </button>
      </div>

      <div className={styles.row}>
        Stage:
        {STAGES.map((s) => (
          <button
            key={s}
            className={`${styles.chip} ${s === pet.currentStage ? styles.chipActive : ''}`}
            onClick={() => onSetStage(s)}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
