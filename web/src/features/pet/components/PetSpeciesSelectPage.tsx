import { PET_SPECIES, getStageImageUrl } from '../config/species.config';
import styles from './PetSpeciesSelectPage.module.css';

interface PetSpeciesSelectPageProps {
  /** Danh sách loài backend cho phép (GET /api/pet/config) */
  speciesIds: string[];
  childName?: string;
  onSelect: (speciesId: string) => void;
}

export function PetSpeciesSelectPage({ speciesIds, childName, onSelect }: PetSpeciesSelectPageProps) {
  const species = PET_SPECIES.filter((s) => speciesIds.includes(s.id));

  return (
    <div>
      <div className="web-page-header">
        <div>
          <h1>Chọn thú cưng {childName ? `cho ${childName}` : 'của bé'} 🐾</h1>
          <p className="page-subtitle">Chọn 1 loài để bắt đầu nuôi và cho ăn mỗi ngày nhé!</p>
        </div>
      </div>

      <div className={styles.grid}>
        {species.map((s) => (
          <div key={s.id} className={styles.card} onClick={() => onSelect(s.id)}>
            <img className={styles.thumb} src={getStageImageUrl(s, 1)} alt={s.name} />
            <div className={styles.name}>{s.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
