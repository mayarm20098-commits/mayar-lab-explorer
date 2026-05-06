import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Combine } from "lucide-react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function CollisionTypeLab({ onMiyarSay }: Props) {
  const [m1, setM1] = useState(2);
  const [v1, setV1] = useState(5);
  const [m2, setM2] = useState(3);
  const [v2, setV2] = useState(-2);
  const [type, setType] = useState<"elastic" | "inelastic">("elastic");

  let v1f = 0, v2f = 0;
  if (type === "elastic") {
    v1f = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
    v2f = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
  } else {
    v1f = v2f = (m1 * v1 + m2 * v2) / (m1 + m2);
  }
  const KEi = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
  const KEf = 0.5 * m1 * v1f * v1f + 0.5 * m2 * v2f * v2f;
  const Pi = m1 * v1 + m2 * v2;
  const Pf = m1 * v1f + m2 * v2f;

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-5 shadow-card min-h-[460px] relative overflow-hidden flex flex-col items-center justify-center gap-6">
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">قبل التصادم</div>
          <div className="flex items-center gap-8">
            <Ball m={m1} v={v1} color="primary" />
            <Ball m={m2} v={v2} color="accent" />
          </div>
        </div>
        <div className="text-3xl">⬇️</div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">بعد التصادم</div>
          <div className="flex items-center gap-8">
            <Ball m={m1} v={v1f} color="primary" />
            <Ball m={m2} v={v2f} color="accent" />
          </div>
        </div>
        <div className="absolute top-3 right-3 bg-card/90 rounded-xl px-3 py-2 text-[11px] font-mono space-y-0.5 shadow-soft">
          <div>P قبل = <b>{Pi.toFixed(2)}</b> | بعد = <b>{Pf.toFixed(2)}</b></div>
          <div>KE قبل = <b>{KEi.toFixed(2)}</b> | بعد = <b>{KEf.toFixed(2)} J</b></div>
          <div className={Math.abs(KEi - KEf) < 0.01 ? "text-primary" : "text-destructive"}>
            {type === "elastic" ? "✓ مرن: KE محفوظة" : `⚠️ غير مرن: فُقد ${(KEi - KEf).toFixed(2)} J`}
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-4">
        <h4 className="font-display font-extrabold text-foreground flex items-center gap-2">
          <Combine className="h-4 w-4 text-primary" /> أنواع التصادم
        </h4>
        <div className="flex gap-2">
          <button onClick={() => { setType("elastic"); sounds.click(); }} className={`flex-1 py-2 rounded-full text-xs font-bold ${type === "elastic" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>مرن</button>
          <button onClick={() => { setType("inelastic"); sounds.click(); }} className={`flex-1 py-2 rounded-full text-xs font-bold ${type === "inelastic" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>غير مرن</button>
        </div>
        <Ctrl label="m₁" unit="كغ" value={m1} min={1} max={10} step={0.5} onChange={(v) => { setM1(v); sounds.click(); }} />
        <Ctrl label="v₁" unit="م/ث" value={v1} min={-8} max={8} step={0.5} onChange={(v) => { setV1(v); sounds.click(); }} />
        <Ctrl label="m₂" unit="كغ" value={m2} min={1} max={10} step={0.5} onChange={(v) => { setM2(v); sounds.click(); }} />
        <Ctrl label="v₂" unit="م/ث" value={v2} min={-8} max={8} step={0.5} onChange={(v) => { setV2(v); sounds.click(); }} />

        <button
          onClick={() => { sounds.success(); onMiyarSay?.(`في التصادم المرن تُحفظ KE والزخم. في غير المرن يُحفظ الزخم فقط وتتحول KE إلى حرارة وتشوّه! 🎱`, "celebrate"); }}
          className="w-full bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm shadow-glow hover:scale-105 transition-transform"
        >
          ما القاعدة؟
        </button>
      </div>
    </div>
  );
}

function Ball({ m, v, color }: { m: number; v: number; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="rounded-full border-4 border-deep flex items-center justify-center text-white font-bold text-xs shadow-glow"
        style={{ width: 30 + m * 4, height: 30 + m * 4, background: `hsl(var(--${color}))` }}>{m}</div>
      <div className="text-[10px] font-mono">v = {v.toFixed(2)}</div>
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
