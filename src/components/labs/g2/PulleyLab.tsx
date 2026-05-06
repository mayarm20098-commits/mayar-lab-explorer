import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Anchor } from "lucide-react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function PulleyLab({ onMiyarSay }: Props) {
  const [load, setLoad] = useState(100); // الحمل بالنيوتن
  const [n, setN] = useState(2); // عدد الحبال الداعمة
  const [eff, setEff] = useState(85); // الكفاءة %
  const IMA = n;
  const Fideal = load / IMA;
  const Factual = Fideal / (eff / 100);

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-5 shadow-card min-h-[460px] relative overflow-hidden flex items-center justify-center">
        <svg viewBox="-100 -20 200 260" className="w-full max-w-xs h-full">
          <rect x={-60} y={-20} width={120} height={10} fill="hsl(var(--deep))" />
          {[...Array(n)].map((_, i) => {
            const x = -30 + i * (60 / Math.max(1, n - 1) || 0);
            return <circle key={i} cx={n === 1 ? 0 : x} cy={10} r={12} fill="none" stroke="hsl(var(--primary))" strokeWidth={3} />;
          })}
          {/* حبل */}
          <line x1={-50} y1={10} x2={-50} y2={140} stroke="hsl(var(--accent))" strokeWidth={2} />
          <line x1={50} y1={10} x2={50} y2={140} stroke="hsl(var(--accent))" strokeWidth={2} />
          {/* الحمل */}
          <rect x={-30} y={140} width={60} height={50} fill="hsl(var(--primary))" rx={4} />
          <text x={0} y={170} textAnchor="middle" fontSize={11} fill="white" fontWeight="bold">{load} N</text>
          {/* الجهد */}
          <text x={-50} y={220} textAnchor="middle" fontSize={11} fill="hsl(var(--destructive))" fontWeight="bold">↓ F = {Factual.toFixed(0)} N</text>
        </svg>
        <div className="absolute top-3 right-3 bg-card/90 rounded-xl px-3 py-2 text-[11px] font-mono space-y-0.5 shadow-soft">
          <div>IMA = {IMA}</div>
          <div>F مثالي = <b>{Fideal.toFixed(1)} N</b></div>
          <div>F فعلي = <b className="text-destructive">{Factual.toFixed(1)} N</b></div>
          <div>كفاءة = {eff}%</div>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground flex items-center gap-2">
          <Anchor className="h-4 w-4 text-primary" /> البكرات
        </h4>
        <Ctrl label="الحمل" unit="N" value={load} min={20} max={300} step={10} onChange={(v) => { setLoad(v); sounds.click(); }} />
        <Ctrl label="عدد الحبال (IMA)" unit="" value={n} min={1} max={6} step={1} onChange={(v) => { setN(v); sounds.click(); }} />
        <Ctrl label="الكفاءة" unit="%" value={eff} min={50} max={100} step={5} onChange={(v) => { setEff(v); sounds.click(); }} />

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>IMA = عدد الحبال الداعمة</div>
          <div>F = الحمل / IMA</div>
        </div>

        <button
          onClick={() => { sounds.success(); onMiyarSay?.(`زيادة عدد الحبال تقلل القوة المطلوبة، لكن المسافة المقطوعة تزيد! ⚓`, "celebrate"); }}
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
