import { AnimatePresence, motion } from 'framer-motion';
import type { WornAccessories } from '../types';
import { ACCESSORY_DRAW_ORDER, getAccessoryAnchor, isImageIcon } from './accessory.config';
import type { EyeRig } from './eyes.config';
import styles from './PetView.module.css';

interface AccessoryLayerProps {
  worn: WornAccessories;
  eyes: EyeRig[];
}

/** Vẽ phụ kiện đè lên ảnh pet; nằm trong .figure nên nhún/lắc cùng pet. */
export function AccessoryLayer({ worn, eyes }: AccessoryLayerProps) {
  return (
    <AnimatePresence>
      {ACCESSORY_DRAW_ORDER.map((category) => {
        const acc = worn[category];
        if (!acc) return null;
        const a = getAccessoryAnchor(category, eyes);
        return (
          <motion.div
            key={`${category}-${acc.id}`}
            className={styles.accessory}
            style={{ left: `${a.x}%`, top: `${a.y}%`, width: `${a.size}%`, fontSize: `${a.size * 0.85}cqw` }}
            initial={{ opacity: 0, scale: 0.3, x: '-50%', y: '-80%', rotate: a.rotate }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%', rotate: a.rotate }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{ type: 'spring', stiffness: 380, damping: 18 }}
            aria-label={acc.name}
          >
            {isImageIcon(acc.icon) ? <img src={acc.icon} alt="" draggable={false} /> : acc.icon}
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
}
