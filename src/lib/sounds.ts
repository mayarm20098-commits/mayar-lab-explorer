// Lightweight WebAudio sound system — no external files, generated on the fly.
// Provides click/success/error/launch/celebrate sounds for the whole app.

let ctx: AudioContext | null = null;
let enabled = true;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
    } catch {
      return null;
    }
  }
  // Resume on user gesture (browsers suspend by default)
  if (ctx && ctx.state === "suspended") {
    void ctx.resume();
  }
  return ctx;
}

export function setSoundEnabled(v: boolean) {
  enabled = v;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("miyar.sound", v ? "1" : "0");
    } catch {
      /* ignore */
    }
  }
}

export function isSoundEnabled(): boolean {
  if (typeof window !== "undefined") {
    try {
      const v = localStorage.getItem("miyar.sound");
      if (v !== null) enabled = v === "1";
    } catch {
      /* ignore */
    }
  }
  return enabled;
}

function tone(freq: number, duration: number, type: OscillatorType = "sine", gain = 0.08, when = 0) {
  if (!isSoundEnabled()) return;
  const ac = getCtx();
  if (!ac) return;
  const t0 = ac.currentTime + when;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

export const sounds = {
  click() {
    tone(620, 0.06, "triangle", 0.05);
  },
  hover() {
    tone(880, 0.04, "sine", 0.025);
  },
  success() {
    tone(523, 0.12, "triangle", 0.08, 0);
    tone(659, 0.12, "triangle", 0.08, 0.1);
    tone(784, 0.18, "triangle", 0.08, 0.2);
  },
  error() {
    tone(220, 0.18, "sawtooth", 0.06, 0);
    tone(180, 0.22, "sawtooth", 0.05, 0.06);
  },
  launch() {
    if (!isSoundEnabled()) return;
    const ac = getCtx();
    if (!ac) return;
    const t0 = ac.currentTime;
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(140, t0);
    osc.frequency.exponentialRampToValueAtTime(620, t0 + 0.25);
    g.gain.setValueAtTime(0.001, t0);
    g.gain.linearRampToValueAtTime(0.07, t0 + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.3);
    osc.connect(g).connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + 0.32);
  },
  impact() {
    if (!isSoundEnabled()) return;
    const ac = getCtx();
    if (!ac) return;
    const t0 = ac.currentTime;
    // noise burst
    const buffer = ac.createBuffer(1, ac.sampleRate * 0.15, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = ac.createBufferSource();
    src.buffer = buffer;
    const g = ac.createGain();
    g.gain.value = 0.12;
    src.connect(g).connect(ac.destination);
    src.start(t0);
  },
  celebrate() {
    tone(523, 0.1, "sine", 0.06, 0);
    tone(659, 0.1, "sine", 0.06, 0.08);
    tone(784, 0.1, "sine", 0.06, 0.16);
    tone(1046, 0.22, "sine", 0.07, 0.24);
  },
  badge() {
    tone(880, 0.08, "triangle", 0.07, 0);
    tone(1175, 0.08, "triangle", 0.07, 0.07);
    tone(1568, 0.22, "triangle", 0.08, 0.14);
  },
  pop() {
    tone(440, 0.05, "square", 0.04);
  },
};

// Initialize from localStorage on import (client-only)
if (typeof window !== "undefined") {
  isSoundEnabled();
}
