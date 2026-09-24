import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiEffectProps {
  show: boolean;
  onFinish?: () => void;
}

const COLORS = ['#FFD166', '#EF476F', '#06D6A0', '#118AB2', '#8338EC', '#FF6B6B', '#4ECDC4'];
const PARTICLES = Array.from({ length: 45 }).map((_, i) => ({
  id: i,
  x: (Math.random() - 0.5) * 600,
  y: Math.random() * -400 - 100,
  rotation: Math.random() * 720 - 360,
  scale: Math.random() * 0.8 + 0.6,
  color: COLORS[i % COLORS.length],
  shape: i % 3 === 0 ? 'circle' : i % 3 === 1 ? 'square' : 'strip',
  size: Math.random() * 8 + 8,
  delay: Math.random() * 0.2,
}));

export default function ConfettiEffect({ show, onFinish }: ConfettiEffectProps) {
  React.useEffect(() => {
    if (show && onFinish) {
      const timer = setTimeout(onFinish, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onFinish]);

  return (
    <AnimatePresence>
      {show && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 999999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                opacity: 1,
                x: 0,
                y: 0,
                rotate: 0,
                scale: 0,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: p.x,
                y: [0, p.y * 0.6, p.y + 600],
                rotate: p.rotation,
                scale: [0, p.scale, p.scale * 0.8, 0],
              }}
              transition={{
                duration: 2.2,
                delay: p.delay,
                ease: [0.25, 1, 0.5, 1],
              }}
              style={{
                position: 'absolute',
                width: p.shape === 'strip' ? p.size * 2 : p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'strip' ? 3 : 2,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
