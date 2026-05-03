import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Globe2 } from "lucide-react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function GravityLab({ onMiyarSay }: Props) {
  const [m1, setM1] = useState(8);
  const [m2, setM2] = useState(6);
  const [r, setR] = useState(2);
  const G = 6.674e-11;
  const F = (G * m1 * m2) / (r * r);

  const r1 = 20 + Math.cbrt(m1) * 6;
  const r2 = 20 + Math.cbrt(m2) * 6;
  const gap = 60 + r * 40;

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-5 shadow-card min-h-[460px] relative overflow-hidden flex items-center justify-center">
        <div className="flex items-center" style={{ gap: `${gap}px` }}>
          <div
            className="rounded-full bg-gradient-to-br from-amber-400 to-orange-600 border-4 border-deep flex items-center justify-center text-xs font-bold text-white shadow-glow transition-all duration-500"
            style={{ width: r1 * 2, height: r1 * 2 }}
          >
            m₁
          </div>
          <div className="flex flex-col items-center text-xs font-mono text-deep">
            <span>← F →</span>
            <span className="bg-card/90 rounded px-1.5 py-0.5 mt-1">{F.toExponential(2)} N</span>
            <span className="bg-card/70 rounded px-1.5 py-0.5 mt-0.5 text-[10px]">r = {r.toFixed(1)} م</span>
          </div>
          <div
            className="rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 border-4 border-deep flex items-center justify-center text-xs font-bold text-white shadow-glow transition-all duration-500"
            style={{ width: r2 * 2, height: r2 * 2 }}
          >
            m₂
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground flex items-center gap-2">
          <Globe2 className="h-4 w-4 text-primary" /> قانون الجاذبية
        </h4>
        <Ctrl label="كتلة m₁" unit="كغ" value={m1} min={1} max={100} step={1} onChange={(v) => { setM1(v); sounds.click(); }} />
        <Ctrl label="كتلة m₂" unit="كغ" value={m2} min={1} max={100} step={1} onChange={(v) => { setM2(v); sounds.click(); }} />
        <Ctrl label="المسافة r" unit="م" value={r} min={0.5} max={10} step={0.1} onChange={(v) => { setR(v); sounds.click(); }} />

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>F = G · m₁ · m₂ / r²</div>
          <div>G = 6.67×10⁻¹¹ N·م²/كغ²</div>
          <div className="text-base mt-1">F = <b>{F.toExponential(3)}</b> N</div>
        </div>

        <button
          onClick={() => {
            sounds.success();
            onMiyarSay?.(
              `قوة الجاذبية تتناسب طردياً مع حاصل ضرب الكتلتين، وعكسياً مع مربع المسافة. كلّما ابتعدنا قلّت القوة بسرعة! 🪐`,
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
