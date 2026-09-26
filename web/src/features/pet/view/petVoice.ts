import { getSpeciesConfig } from '../config/species.config';
import { getCtx } from './sound';

/**
 * Tiếng kêu thật của từng loài, đọc từ file âm thanh:
 *   public/assets/pets/{id}/sounds/{event}.mp3   (hoặc .wav / .ogg)
 *
 * Chỉ phát khi bé CHẠM vào pet — event: tap (chạm) · happy (chạm nhanh nhiều lần).
 * Thiếu file riêng của event → dùng voice.mp3 (tiếng kêu chính của loài).
 * Không có file nào → trả về false để engine phát tiếng bíp tổng hợp như cũ.
 */
export type VoiceEvent = 'tap' | 'happy';

const EXTS = ['mp3', 'wav', 'ogg'];
/** Cắt tiếng dài quá mức này (có fade-out) để không lấn sang hành động sau */
const MAX_SECONDS = 1.6;
const VOLUME = 0.7;

/** url → buffer đã giải mã (null = không có file / không đọc được) */
const cache = new Map<string, Promise<AudioBuffer | null>>();
/** url → giá trị đã resolve, để lúc phát tra cứu đồng bộ (không trễ) */
const ready = new Map<string, AudioBuffer | null>();

function load(url: string): Promise<AudioBuffer | null> {
  let pending = cache.get(url);
  if (!pending) {
    pending = (async () => {
      const ctx = getCtx();
      if (!ctx) return null;
      try {
        const res = await fetch(url);
        // Dev server của Vite trả index.html (200) cho file không tồn tại → kiểm tra content-type
        if (!res.ok || !(res.headers.get('content-type') ?? '').startsWith('audio')) return null;
        return await ctx.decodeAudioData(await res.arrayBuffer());
      } catch {
        return null;
      }
    })();
    pending.then((buf) => ready.set(url, buf));
    cache.set(url, pending);
  }
  return pending;
}

const urlsFor = (base: string, name: string) => EXTS.map((ext) => `${base}/sounds/${name}.${ext}`);

export const VOICE_FILES = ['voice', 'tap', 'happy'] as const;

/** Tải trước toàn bộ tiếng của 1 loài (gọi khi hiển thị pet) để lúc phát không bị trễ. */
export function preloadVoices(speciesId: string) {
  const species = getSpeciesConfig(speciesId);
  if (!species) return;
  for (const name of VOICE_FILES) urlsFor(species.imageBaseUrl, name).forEach(load);
}

function findReady(base: string, name: string): AudioBuffer | null {
  for (const url of urlsFor(base, name)) {
    const buf = ready.get(url);
    if (buf) return buf;
  }
  return null;
}

/** Phát tiếng của loài cho 1 event. Trả về false nếu loài chưa có file phù hợp (hoặc chưa tải xong). */
export function playVoice(speciesId: string, event: VoiceEvent): boolean {
  const species = getSpeciesConfig(speciesId);
  const ctx = getCtx();
  if (!species || !ctx) return false;

  const buffer =
    findReady(species.imageBaseUrl, event) ?? findReady(species.imageBaseUrl, 'voice');
  if (!buffer) return false;

  const src = ctx.createBufferSource();
  src.buffer = buffer;
  // hơi đổi cao độ mỗi lần cho đỡ lặp lại nhàm; vui thì cao hơn chút
  src.playbackRate.value = (event === 'happy' ? 1.08 : 1) * (0.94 + Math.random() * 0.12);

  const gain = ctx.createGain();
  const t0 = ctx.currentTime;
  const length = Math.min(buffer.duration / src.playbackRate.value, MAX_SECONDS);
  gain.gain.setValueAtTime(VOLUME, t0);
  gain.gain.setValueAtTime(VOLUME, t0 + Math.max(0, length - 0.15));
  gain.gain.linearRampToValueAtTime(0.0001, t0 + length);

  src.connect(gain).connect(ctx.destination);
  src.start(t0);
  src.stop(t0 + length + 0.02);
  return true;
}
