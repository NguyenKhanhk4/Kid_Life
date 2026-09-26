import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import styles from './PetView.module.css';

export type ParticleKind =
  | 'heart'
  | 'crumb'
  | 'feast'
  | 'confetti'
  | 'music'
  | 'fire'
  | 'star'
  | 'sparkle'
  | 'rainbow';

/** Cách các hạt bay ra — mỗi pattern tính toạ độ đích (dx, dy) khác nhau. */
type Pattern = 'fan' | 'fall' | 'burst' | 'spread';

interface ParticleStyle {
  count: number;
  pattern: Pattern;
  className: 'emoji' | 'crumb' | 'confetti' | 'float';
  contents?: string[];
  colors?: string[];
}

/**
 * Bảng cấu hình hạt. Thêm hiệu ứng mới = thêm 1 dòng ở đây, không cần viết thêm nhánh if.
 */
const PARTICLES: Record<ParticleKind, ParticleStyle> = {
  heart:    { count: 6,  pattern: 'fan',    className: 'emoji',    contents: ['💗', '✨'] },
  crumb:    { count: 8,  pattern: 'fall',   className: 'crumb',    colors: ['#FFD166', '#F4A261'] },
  feast:    { count: 14, pattern: 'fall',   className: 'crumb',    colors: ['#FFD166', '#F4A261', '#E76F51'] },
  confetti: { count: 16, pattern: 'burst',  className: 'confetti', colors: ['#FF7FB0', '#FFD166', '#8DE9C0', '#8EC4FF', '#ffffff'] },
  music:    { count: 5,  pattern: 'spread', className: 'float',    contents: ['♪', '♫'] },
  fire:     { count: 7,  pattern: 'fan',    className: 'emoji',    contents: ['🔥'] },
  star:     { count: 6,  pattern: 'fan',    className: 'emoji',    contents: ['⭐', '✨'] },
  sparkle:  { count: 10, pattern: 'burst',  className: 'emoji',    contents: ['✨', '🌟'] },
  rainbow:  { count: 5,  pattern: 'fan',    className: 'emoji',    contents: ['🌈', '✨'] },
};

const CLASS_BY_TYPE: Record<ParticleStyle['className'], string> = {
  emoji: styles.heartParticle,
  crumb: styles.crumbParticle,
  confetti: styles.confettiParticle,
  float: styles.musicParticle,
};

interface Particle {
  id: number;
  className: string;
  dx: number;
  dy: number;
  rot: number;
  dur: number;
  content?: string;
  color?: string;
}

export interface ParticleLayerHandle {
  burst: (kind: ParticleKind | ParticleKind[]) => void;
}

const pick = <T,>(list: T[], i: number) => list[i % list.length];

function makeTarget(pattern: Pattern, i: number) {
  switch (pattern) {
    case 'fan': {
      const angle = ((Math.random() * 140 - 70) * Math.PI) / 180;
      const dist = 45 + Math.random() * 35;
      return { dx: Math.sin(angle) * dist, dy: -Math.cos(angle) * dist - 25, rot: Math.random() * 40 - 20, dur: 700 + Math.random() * 400 };
    }
    case 'fall': {
      const angle = Math.random() * Math.PI - Math.PI / 2;
      const dist = 16 + Math.random() * 28;
      return { dx: Math.sin(angle) * dist, dy: 14 + Math.random() * 20, rot: Math.random() * 200 - 100, dur: 500 + Math.random() * 300 };
    }
    case 'spread': {
      const angle = ((Math.random() * 300 - 150) * Math.PI) / 180;
      const dist = 30 + Math.random() * 30;
      return { dx: Math.sin(angle) * dist, dy: -Math.cos(angle) * dist - 10, rot: Math.random() * 30 - 15, dur: 800 + Math.random() * 400 };
    }
    case 'burst':
    default: {
      const angle = Math.random() * Math.PI * 2;
      const dist = 50 + Math.random() * 70;
      return { dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist - 15, rot: Math.random() * 500 - 250, dur: 800 + Math.random() * 450 };
    }
  }
}

/**
 * Hiệu ứng hạt dùng chung cho mọi species. Không phụ thuộc ảnh pet nên không cần đo toạ độ riêng cho từng loài.
 */
export const ParticleLayer = forwardRef<ParticleLayerHandle>((_props, ref) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  useImperativeHandle(ref, () => ({
    burst(kinds) {
      const list = Array.isArray(kinds) ? kinds : [kinds];
      const created: Particle[] = list.flatMap((kind) => {
        const cfg = PARTICLES[kind];
        return Array.from({ length: cfg.count }, (_, i) => ({
          id: nextId.current++,
          className: CLASS_BY_TYPE[cfg.className],
          ...makeTarget(cfg.pattern, i),
          content: cfg.contents ? pick(cfg.contents, Math.floor(Math.random() * 100)) : undefined,
          color: cfg.colors ? pick(cfg.colors, Math.floor(Math.random() * 100)) : undefined,
        }));
      });

      setParticles((prev) => [...prev, ...created]);
      created.forEach((p) => {
        const t = setTimeout(() => {
          timers.current.delete(t);
          setParticles((prev) => prev.filter((x) => x.id !== p.id));
        }, p.dur + 50);
        timers.current.add(t);
      });
    },
  }));

  return (
    <div className={styles.particleLayer}>
      {particles.map((p) => (
        <div
          key={p.id}
          className={p.className}
          style={
            {
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
              '--rot': `${p.rot}deg`,
              '--dur': `${p.dur}ms`,
              background: p.color,
            } as React.CSSProperties
          }
        >
          {p.content}
        </div>
      ))}
    </div>
  );
});

ParticleLayer.displayName = 'ParticleLayer';
