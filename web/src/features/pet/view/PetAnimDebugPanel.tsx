import { useEffect, useState } from 'react';
import type { MotionSpec } from './behavior.config';
import { getVoiceStatus } from './petVoice';
import type { PetAnimator } from './usePetAnimator';
import styles from './PetDebug.module.css';

interface PetAnimDebugPanelProps {
  animator: PetAnimator;
  speciesId: string;
  hasEyes: boolean;
  showEyes: boolean;
  onShowEyesChange: (show: boolean) => void;
  onBlink: () => void;
  timeScale: number;
  onTimeScaleChange: (scale: number) => void;
}

/** Tốc độ hẹn giờ nhanh: hành vi tự động 30s → 3s */
const FAST_SCALE = 0.1;

function describeTrigger(spec: MotionSpec, extra: string) {
  return `${spec.motion} · ${spec.duration}ms${extra ? ` · ${extra}` : ''}`;
}

/**
 * Chỉ render ở môi trường dev (import.meta.env.DEV): bấm thử từng animation của loài hiện tại
 * mà không cần chờ timer hay đổi dữ liệu pet.
 */
export function PetAnimDebugPanel({
  animator,
  speciesId,
  hasEyes,
  showEyes,
  onShowEyesChange,
  onBlink,
  timeScale,
  onTimeScaleChange,
}: PetAnimDebugPanelProps) {
  const b = animator.behavior;
  const [voices, setVoices] = useState<Record<string, string | null>>({});
  useEffect(() => {
    let alive = true;
    getVoiceStatus(speciesId).then((v) => alive && setVoices(v));
    return () => {
      alive = false;
    };
  }, [speciesId]);

  const entries: { spec: MotionSpec; trigger: string }[] = [
    { spec: b.tap, trigger: 'tap' },
    ...(b.tapHighStage ? [{ spec: b.tapHighStage, trigger: `tap khi stage ≥ ${b.tapHighStage.minStage}` }] : []),
    ...(b.multiTap ? [{ spec: b.multiTap, trigger: `${b.multiTap.count} tap / ${b.multiTap.windowMs / 1000}s` }] : []),
    { spec: b.feed, trigger: 'cho ăn' },
    { spec: b.evolve, trigger: 'lên stage' },
    ...b.randomIdles.map((r) => ({
      spec: r,
      trigger: `tự động ${Math.round((r.minMs * timeScale) / 1000)}–${Math.round((r.maxMs * timeScale) / 1000)}s`,
    })),
  ];

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <strong>🛠 Debug animation</strong>
        <span className={styles.current}>Đang chạy: {animator.currentLabel}</span>
      </div>

      <div className={styles.grid}>
        {entries.map(({ spec, trigger }, i) => (
          <button key={`${spec.label}-${i}`} className={styles.item} onClick={() => animator.debugPlay(spec)}>
            <span className={styles.itemLabel}>{spec.label}</span>
            <span className={styles.itemMeta}>{describeTrigger(spec, trigger)}</span>
          </button>
        ))}
      </div>

      <div className={styles.section}>
        <strong>Tiếng kêu</strong> <span className={styles.itemMeta}>(public/assets/pets/{speciesId}/sounds/)</span>:{' '}
        {Object.entries(voices).map(([name, ext]) => (
          <span key={name} style={{ marginRight: 10 }}>
            {ext ? '✅' : '⬜'} {name}
            {ext ? `.${ext}` : ''}
          </span>
        ))}
      </div>

      <div className={styles.section}>
        <strong>Chớp mắt:</strong>{' '}
        {hasEyes ? (
          <>
            đang bật · mắt: {animator.eyesClosed ? 'nhắm' : 'mở'}
            <div className={styles.row}>
              <button className={styles.chip} onClick={onBlink}>
                Chớp mắt ngay
              </button>
              <label className={styles.toggle} style={{ marginTop: 0 }}>
                <input type="checkbox" checked={showEyes} onChange={(e) => onShowEyesChange(e.target.checked)} />
                Hiện khung mắt
              </label>
            </div>
          </>
        ) : (
          <span className={styles.itemMeta}>ảnh này không khai báo mắt (eyes.data.json)</span>
        )}
      </div>


      <label className={styles.toggle}>
        <input
          type="checkbox"
          checked={timeScale !== 1}
          onChange={(e) => onTimeScaleChange(e.target.checked ? FAST_SCALE : 1)}
        />
        Hẹn giờ nhanh ×10 (test hành vi tự động)
      </label>
    </div>
  );
}
