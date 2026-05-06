import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Ruler } from "lucide-react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

const materials: Record<string, number> = {
  "ألومنيوم": 24e-6,
  "نحاس": 17e-6,
  "حديد": 12e-6,
  "زجاج": 9e-6,
};

export function ThermalExpansionLab({ onMiyarSay }: Props) {
  const [mat, setMat] = useState("ألومنيوم");
  const [L0, setL0] = useState(2);
  const [dT, setDT] = useState(50);
  const alpha = materials[mat];
  const dL = alpha * L0 * dT;
  const Lf = L0 + dL;

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-5 shadow-card min-h-[460px] relative overflow-hidden flex flex-col items-center justify-center gap-6">
        <div className="w-full max-w-md space-y-3">
          <div>
            <div className="text-xs text-muted-foreground mb-1">الطول الأصلي L₀</div>
            <div className="h-6 bg-primary rounded" style={{ width: `${L0 * 30}%` }} />
          </div>
          <div>
            <div className="text-xs text-destructive mb-1">بعد التسخين Lf</div>
            <div className="h-6 bg-destructive rounded transition-all" style={{ width: `${Lf * 30}%` }} />
          </div>
          <div className="text-center text-5xl">{dT > 0 ? "🔥" : "❄️"}</div>
        </div>
        <div className="bg-card/90 rounded-xl px-3 py-2 text-xs font-mono shadow-soft text-center">
          ΔL = α·L₀·ΔT = <b className="text-primary">{(dL * 1000).toFixed(3)} mm</b>
          <div>الطول النهائي = <b>{Lf.toFixed(5)} م</b></div>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground flex items-center gap-2">
          <Ruler className="h-4 w-4 text-primary" /> التمدد الحراري
        </h4>
        <div>
          <label className="text-sm font-bold mb-1.5 block">المادة</label>
          <div className="grid grid-cols-2 gap-1.5">
            {Object.keys(materials).map((m) => (
              <button key={m} onClick={() => { setMat(m); sounds.click(); }}
                className={`text-xs py-1.5 rounded-full font-bold ${mat === m ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                {m}
              </button>
            ))}
          </div>
        </div>
        <Ctrl label="الطول L₀" unit="م" value={L0} min={0.5} max={5} step={0.1} onChange={(v) => { setL0(v); sounds.click(); }} />
        <Ctrl label="فرق الحرارة ΔT" unit="°C" value={dT} min={-50} max={200} step={5} onChange={(v) => { setDT(v); sounds.click(); }} />

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>ΔL = α · L₀ · ΔT</div>
          <div>α({mat}) = {(alpha * 1e6).toFixed(0)}×10⁻⁶</div>
        </div>

        <button
          onClick={() => { sounds.success(); onMiyarSay?.(`المعادن أكثر تمدداً من الزجاج! لذلك توضع فواصل تمدد في القضبان والجسور 🌉`, "celebrate"); }}
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
