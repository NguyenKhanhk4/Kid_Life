import { getSpeciesConfig } from '../config/species.config';
import { PetView } from '../view/PetView';
import type { Pet, PetMood, WornAccessories } from '../types';
import styles from './PetScreen.module.css';

interface PetScreenProps {
  pet: Pet;
  /** Số XP thật trong ví của bé */
  xpBalance: number;
  /** Phụ kiện đang mặc / mặc thử */
  accessories?: WornAccessories;
  onTap: () => void;
  onFeed: () => void;
}

const MOOD_LABEL: Record<PetMood, string> = {
  excited: 'Siêu vui 🤩',
  happy: 'Vui vẻ 😊',
  neutral: 'Bình thường 🙂',
  sad: 'Đang đói 🥺',
};

export function PetScreen({ pet, xpBalance, accessories, onTap, onFeed }: PetScreenProps) {
  const species = getSpeciesConfig(pet.speciesId);
  const maxed = pet.expToNextStage === null;
  const percentage = maxed ? 100 : Math.min(100, (pet.exp / (pet.expToNextStage as number)) * 100);
  const notEnoughXp = xpBalance < pet.feedXpCost;

  return (
    <div className={styles.container}>
      <h2 className={styles.speciesName}>{species?.name ?? pet.speciesId}</h2>
      <p className={styles.stageLabel}>
        Giai đoạn {pet.stage} / {pet.maxStage} · {MOOD_LABEL[pet.mood]}
      </p>

      <div className={styles.stats}>
        <span className={styles.stat}>⭐ {xpBalance.toLocaleString()} XP</span>
        <span className={styles.stat}>🍎 {pet.feedXpCost} XP / lần ăn</span>
        <span className={styles.stat}>🔥 {pet.streakDays} ngày liên tiếp</span>
      </div>

      <PetView
        key={pet.speciesId}
        speciesId={pet.speciesId}
        stage={pet.stage}
        feedsLeft={pet.feedsLeftToday}
        accessories={accessories}
        blockedLabel={notEnoughXp ? `Cần ${pet.feedXpCost} XP để cho ăn — làm nhiệm vụ nhé! 💪` : undefined}
        onTap={onTap}
        onFeed={onFeed}
      />

      <div className={styles.expBarRow}>
        <div className={styles.expBarLabel}>
          <span>EXP</span>
          <span>{maxed ? 'Đã tối đa!' : `${pet.exp} / ${pet.expToNextStage}`}</span>
        </div>
        <div className={styles.expBarTrack}>
          <div className={styles.expBarFill} style={{ width: `${percentage}%` }} />
        </div>
      </div>
    </div>
  );
}
