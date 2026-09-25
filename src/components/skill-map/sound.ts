// System sounds, synthesized with the Web Audio API so there are no audio files
// to load. Off until the Learner turns them on.

export type SystemSound = "open" | "click" | "levelUp" | "rankUp" | "job";

const KEY = "betshaped:sound";
let ctx: AudioContext | null = null;
let enabled = false;

export function loadSoundSetting(): boolean {
  try {
    enabled = window.localStorage.getItem(KEY) === "on";
  } catch {
    enabled = false;
  }
  return enabled;
}

export function setSoundEnabled(on: boolean) {
  enabled = on;
  try {
    window.localStorage.setItem(KEY, on ? "on" : "off");
  } catch {}
}

function audio() {
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** One note: a frequency (optionally sliding to another) with a quick attack and fade. */
function tone(
  freq: number,
  at: number,
  length: number,
  opts: { type?: OscillatorType; gain?: number; to?: number } = {},
) {
  const a = audio();
  const start = a.currentTime + at;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = opts.type ?? "sine";
  osc.frequency.setValueAtTime(freq, start);
  if (opts.to) osc.frequency.exponentialRampToValueAtTime(opts.to, start + length);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(opts.gain ?? 0.06, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  osc.connect(gain).connect(a.destination);
  osc.start(start);
  osc.stop(start + length + 0.05);
}

const SOUNDS: Record<SystemSound, () => void> = {
  // The System "ding" when a window appears.
  open: () => {
    tone(1318, 0, 0.18, { type: "triangle" });
    tone(1760, 0.07, 0.25, { type: "triangle" });
  },
  click: () => tone(1400, 0, 0.05, { type: "square", gain: 0.02 }),
  levelUp: () => {
    tone(330, 0, 0.6, { type: "sawtooth", gain: 0.03, to: 1320 });
    [784, 988, 1318, 1568].forEach((f, i) => tone(f, 0.35 + i * 0.08, 0.6, { type: "triangle", gain: 0.05 }));
  },
  rankUp: () => {
    [523, 659, 784, 1046].forEach((f) => tone(f, 0, 1.4, { type: "triangle", gain: 0.04 }));
    tone(2093, 0.25, 1.2, { gain: 0.03 });
  },
  job: () => {
    tone(110, 0, 1.1, { type: "sawtooth", gain: 0.04, to: 55 });
    tone(880, 0.5, 0.8, { type: "triangle", gain: 0.04 });
  },
};

export function play(sound: SystemSound) {
  if (!enabled) return;
  try {
    SOUNDS[sound]();
  } catch {
    // Audio can be unavailable (autoplay rules, old browsers); the page works without it.
  }
}
