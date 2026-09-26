import { useEffect, useState } from 'react';
import type { Accessory, AccessoryCategory } from '../types';

/** Hiện tạm khi ảnh chưa được bỏ vào public/assets/pets/accessories (hoặc lỗi tải) */
const PLACEHOLDER: Record<AccessoryCategory, string> = {
  hat: '🎩',
  crown: '👑',
  halo: '😇',
  bow: '🎀',
  glasses: '🕶️',
  mask: '🎭',
  necklace: '📿',
  wings: '🪽',
};

interface AccessoryImageProps {
  accessory: Pick<Accessory, 'icon' | 'name' | 'category'>;
  className?: string;
}

/** Ảnh phụ kiện (`icon` = đường dẫn ảnh). Xem hướng dẫn đặt ảnh ở public/assets/pets/accessories/README.md */
export function AccessoryImage({ accessory, className }: AccessoryImageProps) {
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [accessory.icon]);

  if (broken) {
    return (
      <span className={className} title={`Chưa có ảnh: ${accessory.icon}`} style={{ opacity: 0.55 }}>
        {PLACEHOLDER[accessory.category]}
      </span>
    );
  }
  return (
    <img
      className={className}
      src={accessory.icon}
      alt={accessory.name}
      draggable={false}
      onError={() => setBroken(true)}
    />
  );
}
