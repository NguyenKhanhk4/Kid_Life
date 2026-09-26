import { useEffect, useMemo, useRef, useState } from 'react';
import { getSpeciesConfig, getStageImageUrl } from '../config/species.config';
import type { PetStage } from '../types';
import { getPetBehavior, type MotionSpec, type PetBehavior, type PetMotion } from './behavior.config';
import type { ParticleLayerHandle } from './ParticleLayer';
import { petSound } from './sound';
import { playVoice, preloadVoices } from './petVoice';

/**
 * Engine animation dùng chung cho mọi loài: chỉ đọc PetBehavior (data) rồi quyết định
 * đang chạy motion nào. Không có nhánh if theo speciesId.
 *
 * Luật ưu tiên: animation mới chỉ ngắt được animation đang chạy khi có priority CAO HƠN.
 * Vd. feed ngắt được tap, tap không ngắt được feed; evolve đợi feed chạy xong rồi mới chạy.
 */
const PRIORITY = { random: 0, tap: 1, multiTap: 2, feed: 3, evolve: 4 } as const;
type PlayKind = keyof typeof PRIORITY;

interface Playing {
  spec: MotionSpec;
  kind: PlayKind;
}

type Timer = ReturnType<typeof setTimeout>;

/** Thời điểm đổi ảnh sang stage mới, tính theo % thời lượng evolve (lúc pet sáng nhất). */
const EVOLVE_SWAP_AT = 0.3;

function preloadStage(speciesId: string, stage: PetStage) {
  const species = getSpeciesConfig(speciesId);
  if (species) new Image().src = getStageImageUrl(species, stage);
}

export interface UsePetAnimatorOptions {
  speciesId: string;
  stage: PetStage;
}

export function usePetAnimator({ speciesId, stage }: UsePetAnimatorOptions) {
  const behavior = useMemo(() => getPetBehavior(speciesId), [speciesId]);
  const particleRef = useRef<ParticleLayerHandle>(null);

  const [playing, setPlaying] = useState<Playing | null>(null);
  const [displayStage, setDisplayStage] = useState<PetStage>(stage);

  // Ref song song với state để các timer luôn đọc được giá trị mới nhất.
  const behaviorRef = useRef<PetBehavior>(behavior);
  behaviorRef.current = behavior;
  const stageRef = useRef(stage);
  stageRef.current = stage;

  const playingRef = useRef<Playing | null>(null);
  const pendingEvolveRef = useRef<PetStage | null>(null);
  const tapTimesRef = useRef<number[]>([]);

  const animTimer = useRef<Timer | null>(null);
  const evolveSwapTimer = useRef<Timer | null>(null);
  const randomTimers = useRef<Timer[]>([]);

  const api = useMemo(() => {
    const canInterrupt = (kind: PlayKind) => {
      const cur = playingRef.current;
      return !cur || PRIORITY[kind] > PRIORITY[cur.kind];
    };

    const play = (spec: MotionSpec, kind: PlayKind) => {
      if (animTimer.current) clearTimeout(animTimer.current);
      const next = { spec, kind };
      playingRef.current = next;
      setPlaying(next);
      if (spec.particle) particleRef.current?.burst(spec.particle);
      // Hành vi chạm: phát tiếng kêu thật của loài nếu có file, không thì hiệu ứng tổng hợp.
      // Các hành vi khác (ăn, tiến hoá…) luôn phát hiệu ứng tổng hợp.
      const voiced = spec.voice ? playVoice(speciesId, spec.voice) : false;
      if (!voiced && spec.sound) petSound[spec.sound]();
      animTimer.current = setTimeout(() => {
        playingRef.current = null;
        setPlaying(null);
        const pending = pendingEvolveRef.current;
        if (pending !== null) {
          pendingEvolveRef.current = null;
          startEvolve(pending);
        }
      }, spec.duration);
    };

    const startEvolve = (target: PetStage) => {
      const evolve = behaviorRef.current.evolve;
      play(evolve, 'evolve');
      if (evolveSwapTimer.current) clearTimeout(evolveSwapTimer.current);
      evolveSwapTimer.current = setTimeout(() => setDisplayStage(target), evolve.duration * EVOLVE_SWAP_AT);
    };

    const scheduleRandomIdles = () => {
      randomTimers.current.forEach(clearTimeout);
      randomTimers.current = [];
      behaviorRef.current.randomIdles.forEach((spec, idx) => {
        const loop = () => {
          const delay = (spec.minMs + Math.random() * (spec.maxMs - spec.minMs));
          randomTimers.current[idx] = setTimeout(() => {
            if (!playingRef.current) play(spec, 'random');
            loop();
          }, delay);
        };
        loop();
      });
    };

    const clearSchedules = () => {
      randomTimers.current.forEach(clearTimeout);
      randomTimers.current = [];
    };

    const clearAll = () => {
      clearSchedules();
      if (animTimer.current) clearTimeout(animTimer.current);
      if (evolveSwapTimer.current) clearTimeout(evolveSwapTimer.current);
    };

    const tap = () => {
      const b = behaviorRef.current;

      // Đếm tap TRƯỚC khi xét bận, để tap nhanh liên tục vẫn kích hoạt được multi-tap.
      const multi = b.multiTap;
      if (multi) {
        const now = Date.now();
        tapTimesRef.current = [...tapTimesRef.current.filter((t) => now - t < multi.windowMs), now];
        if (tapTimesRef.current.length >= multi.count && canInterrupt('multiTap')) {
          tapTimesRef.current = [];
          play(multi, 'multiTap');
          return;
        }
      }

      if (!canInterrupt('tap')) return;
      const high = b.tapHighStage;
      play(high && stageRef.current >= high.minStage ? high : b.tap, 'tap');
    };

    /** Trả về false nếu đang bận (đang ăn / đang tiến hoá) — khi đó view không báo feed lên logic. */
    const feed = (): boolean => {
      if (!canInterrupt('feed')) return false;
      play(behaviorRef.current.feed, 'feed');
      return true;
    };

    const onStageChange = (prev: PetStage, next: PetStage) => {
      if (next < prev) {
        // stage giảm (dữ liệu được sửa từ phía server) — đổi ảnh ngay, không animation
        pendingEvolveRef.current = null;
        setDisplayStage(next);
        return;
      }
      preloadStage(speciesId, next);
      const cur = playingRef.current;
      if (cur && PRIORITY[cur.kind] >= PRIORITY.feed) {
        pendingEvolveRef.current = next; // đợi animation ăn chạy xong rồi mới tiến hoá
      } else {
        startEvolve(next);
      }
    };

    return { tap, feed, onStageChange, scheduleRandomIdles, clearSchedules, clearAll };
    // Tạo 1 lần: mọi giá trị thay đổi đều đọc qua ref. speciesId không đổi trong vòng đời
    // component vì PetScreen render PetView với key={speciesId}.
  }, []);

  // Hẹn giờ random idle; chạy lại khi đổi loài.
  useEffect(() => {
    api.scheduleRandomIdles();
    return api.clearSchedules;
  }, [api, behavior]);

  useEffect(() => api.clearAll, [api]);

  // Tải trước tiếng kêu của loài để lúc chạm phát ngay, không trễ
  useEffect(() => preloadVoices(speciesId), [speciesId]);

  // Phát hiện đổi stage (tiến hoá)
  const prevStageRef = useRef(stage);
  useEffect(() => {
    const prev = prevStageRef.current;
    prevStageRef.current = stage;
    if (prev !== stage) api.onStageChange(prev, stage);
  }, [api, stage]);

  const motion: PetMotion = playing?.spec.motion ?? behavior.idle.motion;
  const duration = playing?.spec.duration ?? behavior.idle.duration;

  return {
    behavior,
    particleRef,
    motion,
    duration,
    /** Hành vi có eyesClosed (vd. gừ gừ) → nhắm mắt */
    eyesClosed: !!playing?.spec.eyesClosed,
    displayStage,
    /** Nút cho ăn tạm khoá khi đang ăn/tiến hoá */
    feedLocked: !!playing && PRIORITY[playing.kind] >= PRIORITY.feed,
    tap: api.tap,
    feed: api.feed,
  };
}

export type PetAnimator = ReturnType<typeof usePetAnimator>;
