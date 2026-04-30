import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function TransformerLab({ onMiyarSay }: Props) {
  const [vp, setVp] = useState(220);
  const [np, setNp] = useState(100);
  const [ns, setNs] = useState(50);

  const vs = (vp * ns) / np;
  const type = ns > np ? "رافع" : ns < np ? "خافض" : "متماثل";

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-6 shadow-card min-h-[460px] flex items-center justify-center">
        <div className="flex items-center gap-2">
          {/* Primary side */}
          <Side label="ابتدائي" v={vp} n={np} color="rose" />
          {/* Iron core */}
          <div className="w-8 h-40 bg-gradient-to-b from-deep to-deep-foreground/30 rounded-md shadow-deep flex flex-col items-center justify-center text-[10px] text-white/70 gap-1">
            <span>━</span><span>━</span><span>━</span>
          </div>
          {/* Secondary side */}
          <Side label="ثانوي" v={vs} n={ns} color="primary" />
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold">⚡ المحوّل</h4>
        <Ctrl label="جهد الابتدائي" unit="V" value={vp} min={10} max={500} step={10} onChange={setVp} />
        <Ctrl label="عدد لفّات الابتدائي" unit="لفّة" value={np} min={10} max={500} step={5} onChange={setNp} />
        <Ctrl label="عدد لفّات الثانوي" unit="لفّة" value={ns} min={10} max={500} step={5} onChange={setNs} />

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>Vs / Vp = Ns / Np</div>
          <div>Vs = <b>{vs.toFixed(1)} V</b></div>
          <div>النوع: <b>محوّل {type}</b></div>
        </div>

        <button
          onClick={() => {
            sounds.success();
            onMiyarSay?.(
              `${type === "رافع" ? "زيادة عدد لفات الثانوي ترفع الجهد" : type === "خافض" ? "تقليل عدد لفات الثانوي يخفض الجهد" : "إذا تساوى عدد اللفّات كان الجهدان متساويين"} 🔁`,
              "celebrate",
            );
          }}
          className="w-full bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm shadow-glow"
        >
          ما القاعدة؟
        </button>
      </div>
    </div>
  );
}

function Side({ label, v, n, color }: { label: string; v: number; n: number; color: "rose" | "primary" }) {
  const bg = color === "rose" ? "bg-rose-500/20 border-rose-500" : "bg-primary/20 border-primary";
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-28 h-40 ${bg} border-2 rounded-2xl flex flex-col items-center justify-center gap-1 p-2 shadow-soft`}>
        <div className="text-[10px] font-bold text-foreground">{label}</div>
        <div className="text-2xl font-display font-extrabold">{v.toFixed(0)}V</div>
        <div className="text-[10px] text-muted-foreground">{n} لفّة</div>
        <div className="flex flex-col gap-0.5 mt-1">
          {Array.from({ length: Math.min(8, Math.ceil(n / 30)) }).map((_, i) => (
            <div key={i} className="w-16 h-1 border border-current/40 rounded-full" />
          ))}
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
