import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export function RelativeVelocityLab() {
  const [vBoat, setVBoat] = useState(5);
  const [vCurrent, setVCurrent] = useState(2);
  const [opposing, setOpposing] = useState(false);
  const [pos, setPos] = useState(0);
  const lastRef = useRef(performance.now());

  const effective = opposing ? vBoat - vCurrent : vBoat + vCurrent;

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const now = performance.now();
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      setPos((p) => {
        const next = p + effective * dt * 8;
        if (next > 380 || next < -10) return 0;
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [effective]);

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky p-6 min-h-[460px] flex flex-col shadow-card border border-border">
        <div className="text-sm font-bold text-foreground mb-2">قارب يتحرك مع/ضد التيار</div>
        <div className="relative h-44 bg-card rounded-2xl border border-border overflow-hidden">
          {/* water */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-100 to-sky-300" />
          {/* current arrows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="absolute text-2xl text-sky-700/70" style={{ top: 20 + i * 25, left: ((Date.now() / 30) % 380) - 30 }}>
              {opposing ? "←" : "→"}
            </div>
          ))}
          {/* boat */}
          <div className="absolute bottom-6 text-4xl transition-none" style={{ left: pos }}>
            ⛵
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Stat label="سرعة القارب" value={`${vBoat} م/ث`} />
          <Stat label="سرعة التيار" value={`${vCurrent} م/ث`} />
          <Stat label="السرعة الفعلية" value={`${effective} م/ث`} />
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground">🎛️ التحكم</h4>
        <Ctl label="سرعة القارب" unit="م/ث" value={vBoat} min={0} max={15} step={1} onChange={setVBoat} />
        <Ctl label="سرعة التيار" unit="م/ث" value={vCurrent} min={0} max={10} step={1} onChange={setVCurrent} />
        <div className="flex items-center justify-between bg-muted/50 rounded-2xl p-3">
          <div className="text-sm font-bold text-foreground">عكس التيار</div>
          <Switch checked={opposing} onCheckedChange={setOpposing} />
        </div>
        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs">
          <div className="font-bold mb-1">📐 السرعة النسبية</div>
          <div>مع التيار: v = vقارب + vتيار</div>
          <div>عكسه: v = vقارب − vتيار</div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card rounded-2xl p-3 text-center shadow-soft">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-bold text-foreground text-sm">{value}</div>
    </div>
  );
}

function Ctl({ label, unit, value, min, max, step, onChange }: { label: string; unit: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-bold text-foreground">{label}</label>
        <span className="text-sm font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-md">{value} {unit}</span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0])} dir="ltr" />
    </div>
  );
}
