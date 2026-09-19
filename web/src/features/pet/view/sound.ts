/**
 * Âm thanh tổng hợp bằng WebAudio, không cần file audio rời (port từ docs/pet_demo.html).
 * Dùng chung cho mọi species vì chỉ là hiệu ứng phản hồi, không gắn với hình ảnh cụ thể.
 */
let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

function blip(freqs: number[], dur: number, type: OscillatorType = 'sine') {
  const ctx = getCtx();
  if (!ctx) return;
  const t0 = ctx.currentTime;
  freqs.forEach((f, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f, t0 + i * dur);
    gain.gain.setValueAtTime(0.0001, t0 + i * dur);
    gain.gain.linearRampToValueAtTime(0.12, t0 + i * dur + 0.02);
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
};
