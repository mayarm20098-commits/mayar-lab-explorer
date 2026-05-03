import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { RotateCw } from "lucide-react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function RotationLab({ onMiyarSay }: Props) {
  const [force, setForce] = useState(10); // N
  const [arm, setArm] = useState(0.5); // m (ذراع العزم)
  const [angle, setAngle] = useState(0);
  const rafRef = useRef<number | null>(null);
  const I = 2; // عزم القصور الذاتي ثابت
  const torque = force * arm;
  const alpha = torque / I; // التسارع الزاوي

  useEffect(() => {
    let last = performance.now();
    let omega = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      omega += alpha * dt * 0.3;
      omega = Math.min(omega, 4);
      setAngle((a) => a + omega * dt * 60);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [alpha]);

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-5 shadow-card min-h-[460px] relative overflow-hidden flex items-center justify-center">
        <svg viewBox="-150 -150 300 300" className="w-full max-w-md h-full">
          <circle cx={0} cy={0} r={120} fill="hsl(var(--card))" stroke="hsl(var(--deep))" strokeWidth={4} />
          <g transform={`rotate(${angle})`}>
            <line x1={0} y1={0} x2={arm * 200} y2={0} stroke="hsl(var(--primary))" strokeWidth={6} strokeLinecap="round" />
            <circle cx={arm * 200} cy={0} r={12} fill="hsl(var(--primary))" />
            {/* سهم القوة */}
            <line x1={arm * 200} y1={0} x2={arm * 200} y2={-force * 3} stroke="hsl(var(--destructive))" strokeWidth={3} markerEnd="url(#arr)" />
          </g>
          <defs>
            <marker id="arr" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
              <polygon points="0 0, 10 5, 0 10" fill="hsl(var(--destructive))" />
            </marker>
          </defs>
          <circle cx={0} cy={0} r={6} fill="hsl(var(--deep))" />
        </svg>

        <div className="absolute top-3 right-3 bg-card/90 rounded-xl px-3 py-2 text-[11px] font-mono space-y-0.5 shadow-soft">
          <div>τ = r · F = <b>{torque.toFixed(2)} N·م</b></div>
          <div>α = τ / I = <b>{alpha.toFixed(2)} rad/s²</b></div>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground flex items-center gap-2">
          <RotateCw className="h-4 w-4 text-primary" /> العزم والدوران
        </h4>
        <Ctrl label="القوة F" unit="N" value={force} min={1} max={30} step={1} onChange={(v) => { setForce(v); sounds.click(); }} />
        <Ctrl label="ذراع العزم r" unit="م" value={arm} min={0.1} max={1} step={0.05} onChange={(v) => { setArm(v); sounds.click(); }} />

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>τ = r × F</div>
          <div>كلما زاد الذراع زاد العزم</div>
        </div>

        <button
          onClick={() => {
            sounds.success();
            onMiyarSay?.(
              `العزم τ يساوي القوة مضروبة في طول الذراع. لذلك مفك البراغي الطويل أسهل! 🔧`,
              "celebrate",
            );
          }}
          className="w-full bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm shadow-glow hover:scale-105 transition-transform"
        >
          ما القاعدة؟
        </button>
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
