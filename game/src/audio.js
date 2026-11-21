// audio.js — every sound is synthesized with WebAudio; no audio files.
// The context is created lazily on the first user gesture, as browsers require.

let context = null;

function audioContext() {
  if (!context) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    context = new AC();
  }
  if (context.state === 'suspended') context.resume();
  return context;
}

// One oscillator note with a quick attack and an exponential decay.
function note(freq, start, duration, type = 'sine', gain = 0.16) {
  const ctx = audioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  const t0 = ctx.currentTime + start;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.015);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(amp).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

// A bright two-note chime when a difference is found.
export function playFound() {
  note(1318.5, 0, 0.16, 'sine', 0.18);
  note(1760, 0.07, 0.24, 'sine', 0.18);
}

// A dull buzz for a wrong click.
export function playMiss() {
  note(138, 0, 0.18, 'square', 0.07);
  note(110, 0.02, 0.2, 'square', 0.06);
}

// A soft blip when a hint ring appears.
export function playHint() {
  note(880, 0, 0.12, 'triangle', 0.12);
  note(880, 0.16, 0.12, 'triangle', 0.12);
}

// A rising arpeggio when a level is completed.
export function playWin() {
  const scale = [523.25, 659.25, 783.99, 1046.5, 1318.5];
  scale.forEach((f, i) => note(f, i * 0.11, 0.3, 'sine', 0.16));
}

// A descending pair when time runs out.
export function playTimeUp() {
  note(392, 0, 0.25, 'triangle', 0.14);
  note(261.6, 0.2, 0.4, 'triangle', 0.14);
}
