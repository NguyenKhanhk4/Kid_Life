import { getSpeciesConfig } from '../config/species.config';
import { EVOLUTION_CONFIG } from '../config/evolution.config';
import { isMaxStage } from '../logic/petLogic';
import { PetView } from '../view/PetView';
import type { Pet } from '../types';
import styles from './PetScreen.module.css';

interface PetScreenProps {
  pet: Pet;
  onTap: () => void;
  onFeed: () => void;
}

export function PetScreen({ pet, onTap, onFeed }: PetScreenProps) {
  const species = getSpeciesConfig(pet.speciesId);
  const maxed = isMaxStage(pet);
  const expNeeded = EVOLUTION_CONFIG.expToNextStage[pet.currentStage];
  const percentage = maxed ? 100 : Math.min(100, (pet.currentExp / expNeeded) * 100);

  return (
    <div className={styles.container}>
      <h2 className={styles.speciesName}>{species?.name ?? pet.speciesId}</h2>
      <p className={styles.stageLabel}>
        Giai đoạn {pet.currentStage} / {EVOLUTION_CONFIG.maxStage}
      </p>

      <PetView speciesId={pet.speciesId} stage={pet.currentStage} onTap={onTap} onFeed={onFeed} />

      <div className={styles.expBarRow}>
        <div className={styles.expBarLabel}>
          <span>EXP</span>
          <span>{maxed ? 'Đã tối đa!' : `${pet.currentExp} / ${expNeeded}`}</span>
        </div>
        <div className={styles.expBarTrack}>
          <div className={styles.expBarFill} style={{ width: `${percentage}%` }} />
        </div>
      </div>
    </div>
  );
}
