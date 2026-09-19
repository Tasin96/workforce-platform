// Futuristic 2026 Web Audio API Synthesizer
// Zero external audio files, pure browser-native procedural sound generation

let audioCtx = null;
let muted = false;
const listeners = new Set();

// Try restoring sound preference
try {
  const saved = localStorage.getItem('wf_cyber_audio_muted');
  if (saved !== null) {
    muted = saved === 'true';
  }
} catch {
  muted = false;
}

function getContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const isMuted = () => muted;

export const toggleMute = () => {
  muted = !muted;
  try {
    localStorage.setItem('wf_cyber_audio_muted', String(muted));
  } catch {}
  listeners.forEach((fn) => fn(muted));
  if (!muted) {
    playBlip();
  }
  return muted;
};

export const onMuteChange = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

// Subtle crisp futuristic UI blip
export const playBlip = (frequency = 1400) => {
  if (muted) return;
  try {
    const ctx = getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.3, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.045);
  } catch {}
};

// Resonant tactical sci-fi engage / launch sound
export const playEngage = () => {
  if (muted) return;
  try {
    const ctx = getContext();
    if (!ctx) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(140, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(560, ctx.currentTime + 0.22);

    osc2.frequency.setValueAtTime(280, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1120, ctx.currentTime + 0.22);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.24);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.25);
    osc2.stop(ctx.currentTime + 0.25);
  } catch {}
};

// Harmonic quantum chime for dispatch confirmed / success
export const playSuccess = () => {
  if (muted) return;
  try {
    const ctx = getContext();
    if (!ctx) return;

    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.05);

      gain.gain.setValueAtTime(0.05, ctx.currentTime + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.05 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.05);
      osc.stop(ctx.currentTime + i * 0.05 + 0.38);
    });
  } catch {}
};

// Subtle mechanical glass tactile click
export const playClick = () => {
  if (muted) return;
  try {
    const ctx = getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.02);

    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.03);
  } catch {}
};
