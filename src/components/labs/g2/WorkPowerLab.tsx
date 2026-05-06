import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Wrench } from "lucide-react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function WorkPowerLab({ onMiyarSay }: Props) {
  const [F, setF] = useState(20);
  const [d, setD] = useState(5);
  const [theta, setTheta] = useState(30);
  const [t, setT] = useState(4);

  const W = F * d * Math.cos((theta * Math.PI) / 180);
  const P = W / t;

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-5 shadow-card min-h-[460px] relative overflow-hidden flex flex-col items-center justify-center gap-4">
        <svg viewBox="-180 -100 360 200" className="w-full max-w-md">
          <line x1={-150} y1={40} x2={150} y2={40} stroke="hsl(var(--deep))" strokeWidth={3} />
          <rect x={-30} y={0} width={60} height={40} fill="hsl(var(--primary))" rx={4} />
          {/* سهم القوة بزاوية */}
          <g transform={`translate(30, 20) rotate(${-theta})`}>
            <line x1={0} y1={0} x2={F * 2} y2={0} stroke="hsl(var(--destructive))" strokeWidth={3} markerEnd="url(#wp-arr)" />
            <text x={F + 10} y={-6} fontSize={11} fill="hsl(var(--destructive))" fontWeight="bold">F</text>
          </g>
          <text x={0} y={70} textAnchor="middle" fontSize={11} fill="hsl(var(--muted-foreground))">الإزاحة d = {d} م</text>
          <defs>
            <marker id="wp-arr" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
              <polygon points="0 0, 10 5, 0 10" fill="hsl(var(--destructive))" />
            </marker>
          </defs>
        </svg>
        <div className="bg-card/90 rounded-xl px-3 py-2 text-xs font-mono shadow-soft text-center">
          <div>الشغل W = F·d·cos(θ) = <b className="text-primary">{W.toFixed(1)} J</b></div>
          <div>القدرة P = W/t = <b className="text-accent">{P.toFixed(2)} W</b></div>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground flex items-center gap-2">
          <Wrench className="h-4 w-4 text-primary" /> الشغل والقدرة
        </h4>
        <Ctrl label="القوة F" unit="N" value={F} min={5} max={50} step={1} onChange={(v) => { setF(v); sounds.click(); }} />
        <Ctrl label="الإزاحة d" unit="م" value={d} min={1} max={20} step={0.5} onChange={(v) => { setD(v); sounds.click(); }} />
        <Ctrl label="الزاوية θ" unit="°" value={theta} min={0} max={90} step={5} onChange={(v) => { setTheta(v); sounds.click(); }} />
        <Ctrl label="الزمن t" unit="ث" value={t} min={1} max={20} step={0.5} onChange={(v) => { setT(v); sounds.click(); }} />

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>W = F·d·cos(θ)</div>
          <div>P = W / t</div>
        </div>

        <button
          onClick={() => { sounds.success(); onMiyarSay?.(`عند زاوية 90° لا يبذل شغل! القدرة هي معدل بذل الشغل لكل ثانية ⚡`, "celebrate"); }}
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
