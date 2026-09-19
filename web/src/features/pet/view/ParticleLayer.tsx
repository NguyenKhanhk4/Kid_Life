import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import styles from './PetView.module.css';

type ParticleKind = 'heart' | 'crumb' | 'confetti';

interface Particle {
  id: number;
  kind: ParticleKind;
  dx: number;
  dy: number;
  rot: number;
  dur: number;
  content?: string;
  color?: string;
}

export interface ParticleLayerHandle {
  burst: (kind: ParticleKind) => void;
}

/**
 * Hiệu ứng hạt dùng chung cho mọi species (tim khi tap, vụn khi feed, confetti khi evolve).
 * Không phụ thuộc ảnh pet nên không cần đo toạ độ riêng cho từng loài.
 */
export const ParticleLayer = forwardRef<ParticleLayerHandle>((_props, ref) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const nextId = useRef(0);

  useImperativeHandle(ref, () => ({
    burst(kind: ParticleKind) {
      const count = kind === 'confetti' ? 16 : kind === 'crumb' ? 8 : 6;
      const created: Particle[] = Array.from({ length: count }, () => {
        const id = nextId.current++;
        if (kind === 'heart') {
          const angle = ((Math.random() * 140 - 70) * Math.PI) / 180;
          const dist = 45 + Math.random() * 35;
          return {
            id,
            kind,
            dx: Math.sin(angle) * dist,
            dy: -Math.cos(angle) * dist - 25,
            rot: Math.random() * 40 - 20,
            dur: 700 + Math.random() * 400,
            content: Math.random() > 0.5 ? '💗' : '✨',
          };
        }
        if (kind === 'crumb') {
          const angle = Math.random() * Math.PI - Math.PI / 2;
          const dist = 16 + Math.random() * 28;
          return {
            id,
            kind,
            dx: Math.sin(angle) * dist,
            dy: 14 + Math.random() * 20,
            rot: Math.random() * 200 - 100,
            dur: 500 + Math.random() * 300,
            color: Math.random() > 0.5 ? '#FFD166' : '#F4A261',
          };
        }
        const angle = Math.random() * Math.PI * 2;
        const dist = 50 + Math.random() * 70;
        return {
          id,
          kind,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist - 15,
          rot: Math.random() * 500 - 250,
          dur: 800 + Math.random() * 450,
          color: ['#FF7FB0', '#FFD166', '#8DE9C0', '#8EC4FF', '#ffffff'][
            Math.floor(Math.random() * 5)
          ],
        };
      });

      setParticles((prev) => [...prev, ...created]);
      created.forEach((p) => {
        setTimeout(() => {
          setParticles((prev) => prev.filter((x) => x.id !== p.id));
        }, p.dur + 50);
      });
    },
  }));

  return (
    <div className={styles.particleLayer}>
      {particles.map((p) => (
        <div
          key={p.id}
          className={
            p.kind === 'heart'
              ? styles.heartParticle
              : p.kind === 'crumb'
                ? styles.crumbParticle
                : styles.confettiParticle
          }
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
