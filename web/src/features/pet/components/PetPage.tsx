import { usePet } from '../hooks/usePet';
import { PetDevTools } from './PetDevTools';
import { PetScreen } from './PetScreen';
import { PetSpeciesSelectPage } from './PetSpeciesSelectPage';

export default function PetPage() {
  const { pet, selectSpecies, feedPet, tapPet, resetPet, debugSetStage, debugResetFeeds } = usePet();

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

      {import.meta.env.DEV && (
        <PetDevTools
          pet={pet}
          onSelectSpecies={selectSpecies}
          onSetStage={debugSetStage}
          onFeed={feedPet}
          onResetFeeds={debugResetFeeds}
          onReset={resetPet}
        />
      )}
    </div>
  );
}
