import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePet } from '../hooks/usePet';
import { usePetWardrobe } from '../hooks/usePetWardrobe';
import { PetScreen } from './PetScreen';
import { PetSpeciesSelectPage } from './PetSpeciesSelectPage';
import { PetWardrobe } from './PetWardrobe';
import styles from './PetScreen.module.css';

export default function PetPage() {
  const navigate = useNavigate();
  const {
    child,
    childStatus,
    pet,
    xpBalance,
    config,
    loading,
    loadError,
    notice,
    reload,
    selectSpecies,
    feedPet,
    tapPet,
    token,
    setXpBalance,
  } = usePet();
  const wardrobe = usePetWardrobe({ token, childId: child?._id ?? null, onXpBalance: setXpBalance });
  const [wardrobeOpen, setWardrobeOpen] = useState(false);

  if (childStatus === 'no-auth') {
    return (
      <div className={styles.statusBox}>
        Bố mẹ cần đăng nhập để bé chăm thú cưng nhé 🔐
        <div style={{ marginTop: 14 }}>
          <button className="kl-btn kl-btn-primary kl-btn-sm" onClick={() => navigate('/login')}>
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }
  if (childStatus === 'no-child') {
    return (
      <div className={styles.statusBox}>
        Chưa có hồ sơ bé nào. Bố mẹ hãy tạo hồ sơ bé trước nhé 🧒
        <div style={{ marginTop: 14 }}>
          <button className="kl-btn kl-btn-primary kl-btn-sm" onClick={() => navigate('/parent/account')}>
            Tạo hồ sơ bé
          </button>
        </div>
      </div>
    );
  }
  if (loading) {
    return <div className={styles.statusBox}>Đang gọi thú cưng… 🐾</div>;
  }
  if (childStatus === 'error' || loadError || !config) {
    return (
      <div className={styles.statusBox}>
        Không tải được thú cưng: {loadError ?? 'lỗi kết nối'} 😢
        <div style={{ marginTop: 14 }}>
          <button className="kl-btn kl-btn-primary kl-btn-sm" onClick={() => void reload()}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const message = notice ?? wardrobe.notice;
  const noticeBox = message && <div className={styles.notice}>{message}</div>;

  if (!pet) {
    return (
      <>
        {noticeBox}
        <PetSpeciesSelectPage speciesIds={config.speciesIds} childName={child?.name} onSelect={selectSpecies} />
      </>
    );
  }

  return (
    <div>
      <div className="web-page-header">
        <div>
          <h1>Thú Cưng Của {child?.name ?? 'Bé'} 🐾</h1>
          <p className="page-subtitle">Cùng lớn lên với từng nhiệm vụ</p>
        </div>
        <motion.button
          className="kl-btn kl-btn-primary kl-btn-sm"
          whileTap={{ scale: 0.92 }}
          onClick={() => setWardrobeOpen(true)}
        >
          👗 Tủ đồ
        </motion.button>
      </div>

      {noticeBox}

      <PetScreen pet={pet} xpBalance={xpBalance} accessories={wardrobe.worn} onTap={tapPet} onFeed={feedPet} />

      <PetWardrobe
        open={wardrobeOpen}
        onClose={() => {
          setWardrobeOpen(false);
          wardrobe.resetPreview(); // chưa bấm "Mặc luôn" thì không giữ đồ mặc thử
        }}
        accessories={wardrobe.accessories}
        loading={wardrobe.loading}
        xpBalance={xpBalance}
        preview={wardrobe.preview}
        busyId={wardrobe.busyId}
        onTryOn={wardrobe.tryOn}
        onCancelTryOn={wardrobe.cancelTryOn}
        onBuy={wardrobe.buy}
        onEquip={wardrobe.equip}
        onUnequip={wardrobe.unequip}
      />
    </div>
  );
}
