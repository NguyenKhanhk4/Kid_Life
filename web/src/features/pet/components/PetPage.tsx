import { usePet } from '../hooks/usePet';
import { PetScreen } from './PetScreen';
import { PetSpeciesSelectPage } from './PetSpeciesSelectPage';

export default function PetPage() {
  const { pet, selectSpecies, feedPet, tapPet } = usePet();

  if (!pet) {
    return <PetSpeciesSelectPage onSelect={selectSpecies} />;
  }

  return (
    <div>
      <div className="web-page-header">
        <div>
          <h1>Thú Cưng Của Bé 🐾</h1>
          <p className="page-subtitle">Cùng lớn lên với từng nhiệm vụ</p>
        </div>
      </div>

      <PetScreen pet={pet} onTap={tapPet} onFeed={feedPet} />
    </div>
  );
}
