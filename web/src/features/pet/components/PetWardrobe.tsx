import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { isImageIcon } from '../view/accessory.config';
import type { Accessory, AccessoryCategory } from '../types';
import styles from './PetWardrobe.module.css';

export const CATEGORY_LABEL: Record<AccessoryCategory, string> = {
  hat: '🎩 Mũ',
  glasses: '🕶️ Kính',
  crown: '👑 Vương miện',
  cape: '🧣 Khăn & nơ',
};
const CATEGORIES = Object.keys(CATEGORY_LABEL) as AccessoryCategory[];

interface PetWardrobeProps {
  open: boolean;
  onClose: () => void;
  accessories: Accessory[];
  loading: boolean;
  xpBalance: number;
  /** category → id món đang mặc thử */
  preview: Partial<Record<AccessoryCategory, string>>;
  busyId: string | null;
  onTryOn: (acc: Accessory) => void;
  onCancelTryOn: (category: AccessoryCategory) => void;
  onBuy: (acc: Accessory) => void;
  onEquip: (acc: Accessory) => void;
  onUnequip: (acc: Accessory) => void;
}

export function PetWardrobe(props: PetWardrobeProps) {
  const { open, onClose, accessories, loading, xpBalance, preview } = props;
  const [tab, setTab] = useState<AccessoryCategory>('hat');
  const items = accessories.filter((a) => a.category === tab);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className={styles.backdrop}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            className={styles.drawer}
            role="dialog"
            aria-label="Tủ đồ thú cưng"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            <header className={styles.header}>
              <div>
                <h3 className={styles.title}>Tủ đồ của pet 👗</h3>
                <span className={styles.xp}>⭐ {xpBalance.toLocaleString()} XP</span>
              </div>
              <button className={styles.close} onClick={onClose} aria-label="Đóng tủ đồ">
                ✕
              </button>
            </header>

            <nav className={styles.tabs}>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  className={`${styles.tab} ${tab === c ? styles.tabActive : ''}`}
                  onClick={() => setTab(c)}
                >
                  {CATEGORY_LABEL[c]}
                </button>
              ))}
            </nav>

            {loading ? (
              <p className={styles.empty}>Đang mở tủ đồ…</p>
            ) : items.length === 0 ? (
              <p className={styles.empty}>Chưa có phụ kiện loại này</p>
            ) : (
              <motion.div
                key={tab}
                className={styles.grid}
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.04 } } }}
              >
                {items.map((acc) => (
                  <WardrobeItem
                    key={acc.id}
                    acc={acc}
                    trying={preview[acc.category] === acc.id}
                    {...props}
                  />
                ))}
              </motion.div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function WardrobeItem({
  acc,
  trying,
  xpBalance,
  busyId,
  onTryOn,
  onCancelTryOn,
  onBuy,
  onEquip,
  onUnequip,
}: PetWardrobeProps & { acc: Accessory; trying: boolean }) {
  const busy = busyId === acc.id;
  const canAfford = xpBalance >= acc.costXp;

  let status: string;
  let actions: ReactNode;
  if (!acc.isOwned) {
    status = canAfford ? `${acc.costXp} XP` : `🔒 ${acc.costXp} XP`;
    actions = (
      <>
        <Btn onClick={() => (trying ? onCancelTryOn(acc.category) : onTryOn(acc))} disabled={busy} ghost>
          {trying ? 'Bỏ thử' : 'Mặc thử'}
        </Btn>
        <Btn onClick={() => onBuy(acc)} disabled={busy || !canAfford}>
          {canAfford ? 'Mua' : 'Chưa đủ XP'}
        </Btn>
      </>
    );
  } else if (acc.isEquipped && !trying) {
    status = 'Đang mặc ✓';
    actions = (
      <Btn onClick={() => onUnequip(acc)} disabled={busy} ghost>
        Tháo ra
      </Btn>
    );
  } else if (trying) {
    status = 'Đang mặc thử';
    actions = (
      <>
        <Btn onClick={() => onCancelTryOn(acc.category)} disabled={busy} ghost>
          Bỏ
        </Btn>
        <Btn onClick={() => onEquip(acc)} disabled={busy}>
          Mặc luôn ✓
        </Btn>
      </>
    );
  } else {
    status = 'Đã có';
    actions = (
      <Btn onClick={() => onTryOn(acc)} disabled={busy} ghost>
        Mặc thử
      </Btn>
    );
  }

  return (
    <motion.div
      className={`${styles.item} ${acc.isEquipped ? styles.itemEquipped : ''} ${trying ? styles.itemTrying : ''}`}
      variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
    >
      <div className={styles.icon}>{isImageIcon(acc.icon) ? <img src={acc.icon} alt="" /> : acc.icon}</div>
      <div className={styles.name}>{acc.name}</div>
      <div className={`${styles.status} ${!acc.isOwned && !canAfford ? styles.locked : ''}`}>{status}</div>
      <div className={styles.actions}>{actions}</div>
    </motion.div>
  );
}

function Btn({ children, ghost, ...rest }: { children: ReactNode; ghost?: boolean; onClick: () => void; disabled?: boolean }) {
  return (
    <motion.button whileTap={{ scale: 0.9 }} className={`${styles.btn} ${ghost ? styles.btnGhost : ''}`} {...rest}>
      {children}
    </motion.button>
  );
}
