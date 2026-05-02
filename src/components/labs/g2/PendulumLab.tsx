import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Activity } from "lucide-react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function PendulumLab({ onMiyarSay }: Props) {
  const [length, setLength] = useState(1); // م
  const [gravity, setGravity] = useState(9.8); // م/ث²
  const [amplitude, setAmplitude] = useState(20); // درجة
  const [running, setRunning] = useState(true);
  const [angle, setAngle] = useState(amplitude);
  const tRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const period = 2 * Math.PI * Math.sqrt(length / gravity);
  const omega = (2 * Math.PI) / period;

  useEffect(() => {
    if (!running) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      tRef.current += dt;
      setAngle(amplitude * Math.cos(omega * tRef.current));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [running, omega, amplitude]);

  const pivotX = 200;
  const pivotY = 40;
  const lenPx = 60 + length * 200;
  const rad = (angle * Math.PI) / 180;
  const bobX = pivotX + lenPx * Math.sin(rad);
  const bobY = pivotY + lenPx * Math.cos(rad);

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-5 shadow-card min-h-[460px] relative overflow-hidden">
        <svg viewBox="0 0 400 460" className="w-full h-full">
          {/* السقف */}
          <line x1={140} y1={pivotY} x2={260} y2={pivotY} stroke="hsl(var(--deep))" strokeWidth={4} strokeLinecap="round" />
          <line x1={150} y1={pivotY} x2={155} y2={pivotY - 14} stroke="hsl(var(--deep))" strokeWidth={2} />
          <line x1={170} y1={pivotY} x2={175} y2={pivotY - 14} stroke="hsl(var(--deep))" strokeWidth={2} />
          <line x1={190} y1={pivotY} x2={195} y2={pivotY - 14} stroke="hsl(var(--deep))" strokeWidth={2} />
          <line x1={210} y1={pivotY} x2={215} y2={pivotY - 14} stroke="hsl(var(--deep))" strokeWidth={2} />
          <line x1={230} y1={pivotY} x2={235} y2={pivotY - 14} stroke="hsl(var(--deep))" strokeWidth={2} />
          <line x1={250} y1={pivotY} x2={255} y2={pivotY - 14} stroke="hsl(var(--deep))" strokeWidth={2} />

          {/* قوس مرجعي */}
          <path
            d={`M ${pivotX - lenPx * 0.4} ${pivotY + lenPx * 0.92} A ${lenPx} ${lenPx} 0 0 1 ${pivotX + lenPx * 0.4} ${pivotY + lenPx * 0.92}`}
            stroke="hsl(var(--primary) / 0.3)"
            strokeWidth={2}
            strokeDasharray="4 4"
            fill="none"
          />

          {/* الخيط */}
          <line x1={pivotX} y1={pivotY} x2={bobX} y2={bobY} stroke="hsl(var(--deep))" strokeWidth={2} />
          {/* المحور */}
          <circle cx={pivotX} cy={pivotY} r={5} fill="hsl(var(--deep))" />
          {/* الكرة */}
          <circle cx={bobX} cy={bobY} r={22} fill="hsl(var(--primary))" stroke="hsl(var(--deep))" strokeWidth={2} />
          <circle cx={bobX - 6} cy={bobY - 6} r={6} fill="hsl(var(--primary-glow) / 0.7)" />
        </svg>

        <div className="absolute top-3 right-3 bg-card/90 rounded-xl px-3 py-2 text-[11px] font-mono space-y-0.5 shadow-soft">
          <div>الزمن الدوري T = <b>{period.toFixed(2)} ث</b></div>
          <div>التردد f = <b>{(1 / period).toFixed(2)} هرتز</b></div>
          <div>الزاوية الحالية: <b>{angle.toFixed(1)}°</b></div>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" /> البندول البسيط
        </h4>

        <Ctrl label="طول الخيط L" unit="م" value={length} min={0.2} max={2} step={0.05} onChange={(v) => { setLength(v); sounds.click(); }} />
        <Ctrl label="الجاذبية g" unit="م/ث²" value={gravity} min={1.6} max={25} step={0.1} onChange={(v) => { setGravity(v); sounds.click(); }} />
        <Ctrl label="السعة" unit="°" value={amplitude} min={5} max={45} step={1} onChange={(v) => { setAmplitude(v); sounds.click(); }} />

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>T = 2π · √(L / g)</div>
          <div>T لا يعتمد على الكتلة!</div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => { setRunning((r) => !r); sounds.click(); }}
            className="flex-1 bg-secondary rounded-full py-2 font-bold text-sm hover:scale-105 transition-transform"
          >
            {running ? "إيقاف" : "تشغيل"}
          </button>
          <button
            onClick={() => {
              sounds.success();
              onMiyarSay?.(
                `كلّما زاد طول البندول ⇧، زاد الزمن الدوري. والجاذبية الأقوى تجعل الاهتزاز أسرع! ⏱️`,
                "celebrate",
              );
            }}
            className="flex-1 bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm shadow-glow hover:scale-105 transition-transform"
          >
            ما العلاقة؟
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
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0])} dir="ltr" />
    </div>
  );
}
