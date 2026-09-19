import { PET_SPECIES } from '../config/species.config';
import styles from './PetSpeciesSelectPage.module.css';

interface PetSpeciesSelectPageProps {
  onSelect: (speciesId: string) => void;
}

export function PetSpeciesSelectPage({ onSelect }: PetSpeciesSelectPageProps) {
  return (
    <div>
      <div className="web-page-header">
        <div>
          <h1>Chọn thú cưng của bé 🐾</h1>
          <p className="page-subtitle">Chọn 1 loài để bắt đầu nuôi và cho ăn mỗi ngày nhé!</p>
        </div>
      </div>

      <div className={styles.grid}>
        {PET_SPECIES.map((species) => (
          <div key={species.id} className={styles.card} onClick={() => onSelect(species.id)}>
            <img className={styles.thumb} src={`${species.imageBaseUrl}/stage-1.svg`} alt={species.name} />
            <div className={styles.name}>{species.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
