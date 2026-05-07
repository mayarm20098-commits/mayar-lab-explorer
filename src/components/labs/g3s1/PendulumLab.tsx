import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function PendulumLab({ onMiyarSay }: Props) {
  const [L, setL] = useState(1.0);
  const [g, setG] = useState(9.8);
  const [theta0, setTheta0] = useState(20);
  const [running, setRunning] = useState(true);
  const [angle, setAngle] = useState(theta0);
  const tRef = useRef(0);
  const lastRef = useRef(performance.now());

  const T = 2 * Math.PI * Math.sqrt(L / g);

  useEffect(() => {
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastRef.current) / 1000);
      lastRef.current = now;
      if (running) {
        tRef.current += dt;
        const omega = (2 * Math.PI) / T;
        setAngle(theta0 * Math.cos(omega * tRef.current));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [T, theta0, running]);

  const rad = (angle * Math.PI) / 180;
  const lengthPx = 60 + L * 140;
  const bobX = 200 + lengthPx * Math.sin(rad);
  const bobY = 30 + lengthPx * Math.cos(rad);

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-5 shadow-card min-h-[460px] relative overflow-hidden">
        <svg viewBox="0 0 400 380" className="w-full h-full">
          <line x1={120} y1={30} x2={280} y2={30} stroke="hsl(var(--deep))" strokeWidth={4} />
          <line x1={200} y1={30} x2={bobX} y2={bobY} stroke="hsl(var(--deep))" strokeWidth={2} />
          <circle cx={bobX} cy={bobY} r={20} fill="hsl(var(--primary))" stroke="hsl(var(--deep))" strokeWidth={2} />
          <path d={`M 200 130 A 100 100 0 0 ${angle > 0 ? 1 : 0} ${200 + 100 * Math.sin(rad)} ${30 + 100 * Math.cos(rad)}`} stroke="hsl(var(--primary))" strokeWidth={1} strokeDasharray="4 4" fill="none" opacity={0.5} />
        </svg>
        <div className="absolute bottom-3 left-3 right-3 bg-card/90 rounded-xl px-3 py-2 text-xs font-mono shadow-soft text-center">
          الزاوية الحالية: <b>{angle.toFixed(1)}°</b> • الزمن الدوري T = <b className="text-primary">{T.toFixed(2)} ث</b>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold">🕰️ البندول البسيط</h4>
        <Ctrl label="الطول L" unit="م" value={L} min={0.2} max={2} step={0.1} onChange={setL} />
        <Ctrl label="الجاذبية g" unit="م/ث²" value={g} min={1.6} max={24.8} step={0.1} onChange={setG} />
        <Ctrl label="الزاوية الابتدائية" unit="°" value={theta0} min={5} max={45} step={1} onChange={(v) => { setTheta0(v); setAngle(v); tRef.current = 0; }} />
        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs font-mono space-y-1">
          <div>T = 2π√(L/g)</div>
          <div>التردد f = 1/T = <b>{(1 / T).toFixed(2)} Hz</b></div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => { setRunning(!running); sounds.click(); }} className="bg-secondary text-secondary-foreground rounded-full py-2 font-bold text-sm">
            {running ? "إيقاف" : "تشغيل"}
          </button>
          <button onClick={() => { sounds.success(); onMiyarSay?.("الزمن الدوري يعتمد على الطول والجاذبية فقط، ولا يعتمد على الكتلة! 🕰️", "celebrate"); }} className="bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm shadow-glow">
            القاعدة؟
          </button>
        </div>
      </div>
    </div>
  );
}

function Ctrl({ label, unit, value, min, max, step, onChange }: { label: string; unit: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-bold">{label}</label>
        <span className="text-sm font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-md">{value} {unit}</span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => { onChange(v[0]); sounds.click(); }} dir="ltr" />
    </div>
  );
}
