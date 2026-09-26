import { AnimatePresence, motion } from 'framer-motion';
import type { PetStage, WornAccessories } from '../types';
import { AccessoryImage } from './AccessoryImage';
import { BEHIND_DRAW_ORDER, FRONT_DRAW_ORDER, getAccessoryPlacement } from './accessory.config';
import styles from './PetView.module.css';

interface AccessoryLayerProps {
  worn: WornAccessories;
  speciesId: string;
  stage: PetStage;
  /** "behind" = vẽ trước ảnh pet (cánh sau lưng), "front" = vẽ sau ảnh pet */
  layer: 'behind' | 'front';
}

/** Vẽ phụ kiện lên ảnh pet; nằm trong .figure nên nhún/lắc cùng pet. */
export function AccessoryLayer({ worn, speciesId, stage, layer }: AccessoryLayerProps) {
  const order = layer === 'behind' ? BEHIND_DRAW_ORDER : FRONT_DRAW_ORDER;
  return (
    <AnimatePresence>
      {order.map((category) => {
        const acc = worn[category];
        if (!acc) return null;
        const p = getAccessoryPlacement(speciesId, stage, category, acc.icon);
        const lift = `-${p.originY * 100}%`;
        return (
          <motion.div
            key={`${category}-${acc.id}`}
            className={styles.accessory}
            // điểm (giữa, originY) của ảnh phụ kiện đặt đúng vào điểm neo, xoay quanh điểm đó
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.width}%`,
              fontSize: `${p.width * 0.8}cqw`, // cỡ icon tạm khi ảnh chưa có
              transformOrigin: `50% ${p.originY * 100}%`,
            }}
            initial={{ opacity: 0, scale: 0.4, x: '-50%', y: lift, rotate: p.rotate }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: lift, rotate: p.rotate }}
            exit={{ opacity: 0, scale: 0.4 }}
            transition={{ type: 'spring', stiffness: 380, damping: 20 }}
            aria-label={acc.name}
          >
            <AccessoryImage accessory={acc} />
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
}
