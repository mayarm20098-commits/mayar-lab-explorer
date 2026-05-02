import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Waves } from "lucide-react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function PressureLab({ onMiyarSay }: Props) {
  const [depth, setDepth] = useState(2); // m
  const [density, setDensity] = useState(1000); // kg/m³ (water)
  const g = 9.8;
  const pressure = density * g * depth; // Pa
  const kPa = pressure / 1000;

  const fillPercent = Math.min(100, (depth / 10) * 100);

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-5 shadow-card min-h-[460px] relative overflow-hidden">
        {/* container */}
        <div className="absolute inset-x-8 top-6 bottom-6 rounded-b-2xl border-4 border-deep border-t-0 overflow-hidden bg-card/30">
          {/* water */}
          <div
            className="absolute bottom-0 left-0 right-0 transition-all duration-500"
            style={{
              height: "100%",
              background: `linear-gradient(180deg, hsl(200 80% ${Math.max(40, 80 - density / 50)}%) 0%, hsl(220 80% ${Math.max(20, 50 - density / 50)}%) 100%)`,
              opacity: 0.85,
            }}
          />
          {/* depth marker (diver) */}
          <div
            className="absolute left-1/2 -translate-x-1/2 transition-all duration-500 text-4xl"
            style={{ top: `${Math.min(85, fillPercent)}%` }}
          >
            🤿
          </div>
          {/* depth scale on right */}
          <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-between py-2 text-[10px] font-mono text-deep">
            {[0, 2, 4, 6, 8, 10].map((d) => (
              <div key={d} className="bg-card/80 px-1 rounded">{d}م</div>
            ))}
          </div>
          {/* pressure arrows around diver */}
          <div
            className="absolute left-1/2 -translate-x-1/2 transition-all duration-500"
            style={{ top: `calc(${Math.min(85, fillPercent)}% + 12px)` }}
          >
            <div className="flex items-center gap-1 bg-card/90 rounded-full px-2 py-1 text-[10px] font-bold text-primary shadow-soft whitespace-nowrap">
              ⬇️ {kPa.toFixed(1)} kPa
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground flex items-center gap-2">
          <Waves className="h-4 w-4 text-primary" /> الضغط في السائل
        </h4>

        <Ctrl label="العمق h" unit="م" value={depth} min={0} max={10} step={0.1} onChange={(v) => { setDepth(v); sounds.click(); }} />
        <Ctrl label="كثافة السائل ρ" unit="كغ/م³" value={density} min={600} max={13600} step={100} onChange={(v) => { setDensity(v); sounds.click(); }} />

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>P = ρ · g · h</div>
          <div>P = <b>{pressure.toFixed(0)} باسكال</b></div>
          <div>= <b>{kPa.toFixed(2)} كيلوباسكال</b></div>
        </div>

        <button
          onClick={() => {
            sounds.success();
            onMiyarSay?.(
              `الضغط يزداد طردياً مع العمق وكثافة السائل! لذلك يشعر الغوّاص بضغط أكبر كلّما نزل أعمق 🌊`,
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
