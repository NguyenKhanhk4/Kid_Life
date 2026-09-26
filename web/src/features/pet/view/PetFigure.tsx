import { useEffect, useState } from 'react';
import type { WornAccessories } from '../types';
import { AccessoryLayer } from './AccessoryLayer';
import type { EyeRig } from './eyes.config';
import styles from './PetView.module.css';

interface PetFigureProps {
  src: string;
  eyes: EyeRig[];
  alt: string;
  glow?: boolean;
  eyesClosed: boolean;
  /** Phụ kiện đang mặc / mặc thử */
  accessories?: WornAccessories;
}

const BLINK_MS = 180;
/** Vùng mí to hơn mắt bao nhiêu lần (để phủ kín viền mắt) */
const EYE_PAD = 1.35;

type Timer = ReturnType<typeof setTimeout>;

/** Chớp mắt ngẫu nhiên mỗi 2,5–6s, thỉnh thoảng chớp 2 lần liền. */
function useBlink(enabled: boolean) {
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const timers: Timer[] = [];
    const blinkOnce = (delay: number) => {
      timers.push(setTimeout(() => setBlinking(true), delay));
      timers.push(setTimeout(() => setBlinking(false), delay + BLINK_MS));
    };
    const loop = () => {
      timers.push(
        setTimeout(() => {
          blinkOnce(0);
          if (Math.random() < 0.2) blinkOnce(BLINK_MS + 120);
          loop();
        }, 2500 + Math.random() * 3500),
      );
    };
    loop();
    return () => timers.forEach(clearTimeout);
  }, [enabled]);

  return blinking;
}

/**
 * Vẽ pet từ 1 ảnh stage + mí mắt phủ lên để chớp mắt (ảnh không bị cắt tách).
 * Mọi chuyển động của cả con (nhún, lắc…) do phần tử cha (.avatar) đảm nhận.
 */
export function PetFigure({ src, eyes, alt, glow, eyesClosed, accessories }: PetFigureProps) {
  const blinking = useBlink(eyes.length > 0 && !eyesClosed);

  return (
    <div className={`${styles.figure} ${glow ? styles.glow : ''}`}>
      <img className={styles.avatarImg} src={src} alt={alt} draggable={false} />

      {eyes.map((eye, i) => {
        // Vùng mí rộng hơn mắt 1 chút + mép làm mờ (mask) để hoà vào lông xung quanh
        const w = eye.w * EYE_PAD, h = eye.h * EYE_PAD;
        const left = eye.x - w / 2, top = eye.y - h / 2;
        // Mí = mảng lông ngay trên (hoặc dưới) mắt, trượt xuống che mắt
        const srcTop = top + (eye.lidFrom ?? -1) * h;
        return (
          <div key={i} className={styles.eye} style={{ left: `${left}%`, top: `${top}%`, width: `${w}%`, height: `${h}%` }}>
            <div className={`${styles.lid} ${eyesClosed ? styles.lidClosed : blinking ? styles.lidBlink : ''}`}>
              <img
                className={styles.lidImg}
                src={src}
                alt=""
                draggable={false}
                style={{
                  width: `${(100 / w) * 100}%`,
                  height: `${(100 / h) * 100}%`,
                  left: `${(-left / w) * 100}%`,
                  top: `${(-srcTop / h) * 100}%`,
                }}
              />
              {/* đường mí khép "‿" */}
              <svg className={styles.lidLine} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <path d="M18 52 Q50 74 82 52" />
              </svg>
            </div>
          </div>
        );
      })}

      {accessories && <AccessoryLayer worn={accessories} eyes={eyes} />}
    </div>
  );
}
