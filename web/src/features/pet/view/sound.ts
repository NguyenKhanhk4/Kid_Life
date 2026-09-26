/**
 * Hiệu ứng âm thanh tổng hợp bằng WebAudio (chạm, ăn, tiến hoá, hành vi tự động…), không cần file.
 * Riêng lúc bé chạm vào pet: nếu loài có file tiếng kêu thật (xem petVoice.ts) thì phát file đó thay tiếng bíp.
 */
let audioCtx: AudioContext | null = null;

export function getCtx(): AudioContext | null {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  // Context tạo trước khi user tương tác (vd. lúc tải trước file tiếng kêu) sẽ bị trình duyệt để ở 'suspended'.
  // Gọi resume() mỗi lần phát để âm thanh chạy lại ngay khi user đã tap/click.
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function blip(freqs: number[], dur: number, type: OscillatorType = 'sine', volume = 0.12) {
  const ctx = getCtx();
  if (!ctx) return;
  const t0 = ctx.currentTime;
  freqs.forEach((f, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f, t0 + i * dur);
    gain.gain.setValueAtTime(0.0001, t0 + i * dur);
    gain.gain.linearRampToValueAtTime(volume, t0 + i * dur + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + i * dur + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0 + i * dur);
    osc.stop(t0 + i * dur + dur + 0.05);
  });
}

export const petSound = {
  tap: () => blip([500, 700], 0.06, 'triangle'),
  feed: () => blip([420, 560, 680], 0.08, 'sine'),
  evolve: () => blip([440, 554, 659, 880, 1108], 0.11, 'square'),
  /** Tiếng gừ gừ mèo — rung thấp liên tục */
  purr: () => blip([120, 110, 120, 110], 0.12, 'sawtooth'),
  bark: () => blip([520, 380], 0.07, 'square', 0.08),
  oink: () => blip([260, 200, 240], 0.07, 'sawtooth', 0.08),
  hoot: () => blip([380, 380, 300], 0.16, 'sine'),
  roar: () => blip([180, 140, 110, 90], 0.1, 'sawtooth', 0.1),
  breath: () => blip([220, 160], 0.14, 'sawtooth', 0.06),
  magic: () => blip([880, 1175, 1397, 1760], 0.07, 'sine', 0.08),
};

export type PetSoundName = keyof typeof petSound;
