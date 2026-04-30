import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function SeriesParallelLab({ onMiyarSay }: Props) {
  const [mode, setMode] = useState<"series" | "parallel">("series");
  const [v, setV] = useState(12);
  const [r1, setR1] = useState(4);
  const [r2, setR2] = useState(6);

  const { rTotal, i1, i2, brightness1, brightness2 } = useMemo(() => {
    if (mode === "series") {
      const rT = r1 + r2;
      const i = v / rT;
      return { rTotal: rT, i1: i, i2: i, brightness1: i, brightness2: i };
    }
    const rT = (r1 * r2) / (r1 + r2);
    const i1 = v / r1;
    const i2 = v / r2;
    return { rTotal: rT, i1, i2, brightness1: i1, brightness2: i2 };
  }, [mode, v, r1, r2]);

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-6 shadow-card min-h-[460px] flex flex-col items-center justify-center gap-6">
        <div className="flex gap-2 bg-card rounded-full p-1 shadow-soft">
          <Tab active={mode === "series"} onClick={() => { setMode("series"); sounds.click(); }}>توالي</Tab>
          <Tab active={mode === "parallel"} onClick={() => { setMode("parallel"); sounds.click(); }}>توازي</Tab>
        </div>

        {mode === "series" ? (
          <div className="flex items-center gap-3">
            <Battery v={v} />
            <Wire />
            <Bulb b={brightness1} label={`R1=${r1}Ω`} />
            <Wire />
            <Bulb b={brightness2} label={`R2=${r2}Ω`} />
            <Wire />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Battery v={v} />
            <div className="flex gap-10 mt-2">
              <Bulb b={brightness1} label={`R1=${r1}Ω · ${i1.toFixed(2)}A`} />
              <Bulb b={brightness2} label={`R2=${r2}Ω · ${i2.toFixed(2)}A`} />
            </div>
          </div>
        )}

        <div className="bg-deep text-deep-foreground rounded-2xl px-4 py-2 text-sm font-mono">
          R_eq = {rTotal.toFixed(2)} Ω · I_total = {(mode === "series" ? i1 : i1 + i2).toFixed(2)} A
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold">⚡ متغيرات الدائرة</h4>
        <Ctrl label="الجهد" unit="V" value={v} min={3} max={24} step={1} onChange={setV} />
        <Ctrl label="مقاومة 1" unit="Ω" value={r1} min={1} max={20} step={1} onChange={setR1} />
        <Ctrl label="مقاومة 2" unit="Ω" value={r2} min={1} max={20} step={1} onChange={setR2} />

        <button
          onClick={() => {
            sounds.success();
            onMiyarSay?.(
              mode === "series"
                ? `في التوالي: المقاومة الكلية = R1 + R2، والتيار نفسه في كل مكان.`
                : `في التوازي: 1/R = 1/R1 + 1/R2، والجهد نفسه على كل فرع.`,
              "celebrate",
            );
          }}
          className="w-full bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm shadow-glow"
        >
          القاعدة العلمية
        </button>
      </div>
    </div>
  );
}

function Tab({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${active ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground"}`}
    >
      {children}
    </button>
  );
}

function Battery({ v }: { v: number }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-10 bg-card border-2 border-deep rounded-md flex items-center justify-center text-xs font-bold">{v}V</div>
      <div className="text-[10px] text-muted-foreground mt-1">بطارية</div>
    </div>
  );
}

function Wire() { return <div className="h-1 w-8 bg-deep" />; }

function Bulb({ b, label }: { b: number; label: string }) {
  const intensity = Math.min(1, b / 3);
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
        style={{
          background: `radial-gradient(circle, rgba(253,224,71,${intensity}), transparent)`,
          boxShadow: intensity > 0.1 ? `0 0 ${20 * intensity}px rgba(253,224,71,0.8)` : "none",
        }}
      >
        💡
      </div>
      <div className="text-[10px] mt-1 bg-card/80 px-2 py-0.5 rounded-full">{label}</div>
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
