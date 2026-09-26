import type { PetStage } from '../types';
import type { ParticleKind } from './ParticleLayer';
import type { PetSoundName } from './sound';
import type { VoiceEvent } from './petVoice';

/**
 * Hành vi/animation của từng loài — CHỈ LÀ DATA, engine (usePetAnimator) đọc config này để chạy.
 * Mỗi `motion` là tên 1 class trong PetView.module.css. Thời lượng timer lấy từ `duration`
 * và cũng được truyền xuống CSS qua biến --pet-dur, nên 2 bên luôn khớp nhau.
 * Nguồn mô tả hành vi: docs/pet-animations.md.
 */

export type IdleMotion = 'idleBob' | 'idleSway' | 'idleFloat';
export type ActionMotion =
  | 'tapBounce' | 'tapHopTwice' | 'tapTilt' | 'tapFlip' | 'tapTurn' | 'tapPuff' | 'tapJump'
  | 'feedShake' | 'feedNibble' | 'feedNodSlow' | 'feedNodBig' | 'feedHeadTilt' | 'feedHops' | 'feedSway'
  | 'evolvePulse' | 'evolveSpin' | 'evolveRoll' | 'evolveRoar' | 'evolveBinky' | 'evolveHoot' | 'evolveFlip'
  | 'purr' | 'sniff' | 'breath' | 'scratch' | 'curious'
  | 'headTurn' | 'hug' | 'snort' | 'magic' | 'pop' | 'pounce' | 'wingFlap';
export type PetMotion = IdleMotion | ActionMotion;

export interface MotionSpec {
  /** Tên hiển thị trong debug panel */
  label: string;
  motion: ActionMotion;
  duration: number;
  particle?: ParticleKind | ParticleKind[];
  /** Hiệu ứng âm thanh tổng hợp (bíp, nhai, tiến hoá…) */
  sound?: PetSoundName;
  /** Tiếng kêu thật của loài (file trong assets/pets/{id}/sounds/) — chỉ khai báo cho hành vi chạm;
   *  có file thì phát THAY cho `sound`, không có thì phát `sound` như thường */
  voice?: VoiceEvent;
  /** Nhắm mắt trong lúc chạy (cần khai báo mắt trong eyes.data.json) — vd. gừ gừ */
  eyesClosed?: boolean;
}

export interface IdleSpec {
  motion: IdleMotion;
  /** Thời gian 1 chu kỳ (ms) */
  duration: number;
  /** Biên độ nhún (px) */
  amp: number;
  /** Biên độ nghiêng (deg) */
  rot: number;
  /** Viền phát sáng đổi màu liên tục (kỳ lân) */
  glow?: boolean;
}

export interface RandomIdleSpec extends MotionSpec {
  /** Khoảng ngẫu nhiên giữa 2 lần tự chạy (ms) */
  minMs: number;
  maxMs: number;
}

export interface MultiTapSpec extends MotionSpec {
  /** Số lần tap trong `windowMs` để kích hoạt */
  count: number;
  windowMs: number;
}

export interface PetBehavior {
  idle: IdleSpec;
  tap: MotionSpec;
  /** Thay thế `tap` khi pet đạt stage >= minStage */
  tapHighStage?: MotionSpec & { minStage: PetStage };
  multiTap?: MultiTapSpec;
  feed: MotionSpec;
  evolve: MotionSpec;
  randomIdles: RandomIdleSpec[];
}

// ─── Mẫu dùng chung ─────────────────────────────────────────────────────────
const TAP: MotionSpec = { label: 'Chạm', motion: 'tapBounce', duration: 500, particle: 'heart', sound: 'tap', voice: 'tap' };
const FEED: MotionSpec = { label: 'Cho ăn', motion: 'feedShake', duration: 1200, particle: 'crumb', sound: 'feed' };
const EVOLVE: MotionSpec = { label: 'Tiến hoá', motion: 'evolvePulse', duration: 1100, particle: 'confetti', sound: 'evolve' };

const DEFAULT_BEHAVIOR: PetBehavior = {
  idle: { motion: 'idleBob', duration: 2600, amp: 9, rot: 2 },
  tap: TAP,
  feed: FEED,
  evolve: EVOLVE,
  randomIdles: [],
};

type BehaviorOverride = Partial<PetBehavior>;

const SPECIES_BEHAVIORS: Record<string, BehaviorOverride> = {
  cat: {
    multiTap: { label: 'Gừ gừ (tap 3 lần)', motion: 'purr', duration: 1000, voice: 'happy', particle: 'music', sound: 'purr', eyesClosed: true, count: 3, windowMs: 2000 },
  },
  bunny: {
    idle: { motion: 'idleBob', duration: 2000, amp: 12, rot: 2 },
    tap: { ...TAP, label: 'Nhảy 2 nhịp', motion: 'tapHopTwice', duration: 700 },
    feed: { ...FEED, label: 'Gặm cỏ', motion: 'feedNibble' },
    evolve: { ...EVOLVE, label: 'Binky', motion: 'evolveBinky', duration: 1200, particle: ['confetti', 'sparkle'] },
    randomIdles: [
      { label: 'Rung mũi', motion: 'sniff', duration: 700, sound: 'oink', minMs: 50_000, maxMs: 70_000 },
    ],
  },
  dragon: {
    idle: { motion: 'idleFloat', duration: 3000, amp: 14, rot: 3 },
    tap: { ...TAP, label: 'Nảy xoay', motion: 'tapTilt', duration: 550 },
    tapHighStage: { label: 'Vỗ cánh (stage 3+)', motion: 'wingFlap', duration: 900, voice: 'tap', sound: 'tap', minStage: 3 },
    evolve: { ...EVOLVE, label: 'Gầm', motion: 'evolveRoar', duration: 1300, particle: ['confetti', 'fire'], sound: 'roar' },
    randomIdles: [{ label: 'Thở lửa', motion: 'breath', duration: 1200, particle: 'fire', sound: 'breath', minMs: 35_000, maxMs: 45_000 }],
  },
  bear: {
    idle: { motion: 'idleBob', duration: 3400, amp: 6, rot: 1.5 },
    tap: { ...TAP, label: 'Phình người', motion: 'tapPuff', duration: 600 },
    multiTap: { label: 'Ôm (tap 3 lần)', motion: 'hug', duration: 1000, voice: 'happy', particle: ['heart', 'heart'], sound: 'purr', count: 3, windowMs: 2000 },
    feed: { ...FEED, label: 'Gật đầu mạnh', motion: 'feedNodBig' },
    evolve: { ...EVOLVE, label: 'Lăn tròn', motion: 'evolveRoll', duration: 1400 },
    randomIdles: [{ label: 'Gãi đầu', motion: 'scratch', duration: 900, minMs: 45_000, maxMs: 55_000 }],
  },
  dog: {
    idle: { motion: 'idleBob', duration: 1600, amp: 10, rot: 3 },
    tap: { ...TAP, label: 'Nhảy cẫng', motion: 'tapJump', duration: 550 },
    multiTap: { label: 'Sủa (tap 2 lần)', motion: 'pop', duration: 500, voice: 'happy', sound: 'bark', count: 2, windowMs: 1200 },
    feed: { ...FEED, label: 'Nhảy 3 lần', motion: 'feedHops' },
  },
  fox: {
    idle: { motion: 'idleBob', duration: 2200, amp: 8, rot: 3 },
    tap: { ...TAP, label: 'Nảy nghiêng', motion: 'tapTilt', duration: 600 },
    tapHighStage: { label: 'Vồ (stage 3+)', motion: 'pounce', duration: 800, voice: 'tap', particle: 'heart', sound: 'tap', minStage: 3 },
    feed: { ...FEED, label: 'Nghiêng đầu', motion: 'feedHeadTilt' },
    evolve: { ...EVOLVE, label: 'Xoáy lốc', motion: 'evolveSpin' },
    randomIdles: [{ label: 'Tò mò', motion: 'curious', duration: 1300, minMs: 30_000, maxMs: 40_000 }],
  },
  monkey: {
    idle: { motion: 'idleSway', duration: 2000, amp: 6, rot: 8 },
    tap: { ...TAP, label: 'Nhào lộn', motion: 'tapFlip', duration: 800 },
    feed: { ...FEED, label: 'Gật đầu 3 lần', motion: 'feedNibble', duration: 800 },
    evolve: { ...EVOLVE, label: 'Lộn vòng', motion: 'evolveFlip', duration: 1300 },
    randomIdles: [{ label: 'Gãi đầu', motion: 'scratch', duration: 900, minMs: 20_000, maxMs: 30_000 }],
  },
  owl: {
    idle: { motion: 'idleBob', duration: 3800, amp: 5, rot: 1 },
    tap: { ...TAP, label: 'Ngoảnh đầu', motion: 'tapTurn', duration: 700 },
    feed: { ...FEED, label: 'Gật chậm', motion: 'feedNodSlow', duration: 1200 },
    evolve: { ...EVOLVE, label: 'Hú', motion: 'evolveHoot', duration: 1300, particle: ['confetti', 'sparkle'], sound: 'hoot' },
    randomIdles: [
      { label: 'Xoay đầu', motion: 'headTurn', duration: 1800, sound: 'hoot', minMs: 40_000, maxMs: 50_000 },
    ],
  },
  panda: {
    idle: { motion: 'idleBob', duration: 3400, amp: 6, rot: 2 },
    tap: { ...TAP, label: 'Lắc người', motion: 'tapPuff', duration: 600 },
    feed: { ...FEED, label: 'Nhai tre', motion: 'feedNibble', duration: 1000 },
    evolve: { ...EVOLVE, label: 'Lăn tròn', motion: 'evolveRoll', duration: 1400 },
    randomIdles: [{ label: 'Ăn tre', motion: 'feedNodSlow', duration: 1400, minMs: 25_000, maxMs: 35_000 }],
  },
  pig: {
    idle: { motion: 'idleBob', duration: 2600, amp: 7, rot: 2 },
    tap: { ...TAP, label: 'Phình bụng', motion: 'tapPuff', duration: 600 },
    multiTap: { label: 'Ủn ỉn (tap 2 lần)', motion: 'pop', duration: 500, voice: 'happy', sound: 'oink', count: 2, windowMs: 1200 },
    feed: { ...FEED, label: 'Ăn ngấu nghiến', motion: 'feedNibble', particle: 'feast' },
    randomIdles: [
      { label: 'Ủn mõm', motion: 'snort', duration: 700, sound: 'oink', minMs: 25_000, maxMs: 35_000 },
    ],
  },
  unicron: {
    idle: { motion: 'idleFloat', duration: 3200, amp: 16, rot: 2, glow: true },
    tap: { ...TAP, label: 'Nảy lấp lánh', particle: 'star' },
    feed: { ...FEED, label: 'Xoay cầu vồng', motion: 'feedSway', particle: 'rainbow' },
    evolve: { ...EVOLVE, label: 'Xoay phép thuật', motion: 'evolveSpin', duration: 1300, particle: ['confetti', 'sparkle'], sound: 'magic' },
    randomIdles: [{ label: 'Phép thuật', motion: 'magic', duration: 1600, particle: 'sparkle', sound: 'magic', minMs: 25_000, maxMs: 35_000 }],
  },
};

export function getPetBehavior(speciesId: string): PetBehavior {
  return { ...DEFAULT_BEHAVIOR, ...SPECIES_BEHAVIORS[speciesId] };
}
