// Small synthesized blips for hover and select: no audio files needed.
let ctx: AudioContext | null = null;
let enabled = true;
let lastHover = 0;

// Pentatonic steps so hovering across nodes sounds tuneful, not random.
const STEPS = [0, 2, 4, 7, 9, 12, 14];

export function setSoundEnabled(value: boolean) {
  enabled = value;
}

function tone(freq: number, duration: number, type: OscillatorType, peak: number) {
  if (!enabled || typeof window === "undefined") return;
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

export function playHover(index: number) {
  const now = performance.now();
  if (now - lastHover < 70) return;
  lastHover = now;
  tone(392 * 2 ** (STEPS[index % STEPS.length] / 12), 0.12, "sine", 0.035);
}

export function playSelect() {
  tone(261.6, 0.3, "triangle", 0.06);
  tone(392, 0.4, "sine", 0.04);
}
