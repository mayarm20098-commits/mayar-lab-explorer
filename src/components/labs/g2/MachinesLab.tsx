import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Wrench } from "lucide-react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function MachinesLab({ onMiyarSay }: Props) {
  const [Fr, setFr] = useState(1700); // قوة المقاومة (N)
  const [de, setDe] = useState(0.20); // مسافة الجهد (م)
  const [dr, setDr] = useState(0.05); // مسافة المقاومة (م)
  const [Fe, setFe] = useState(1100); // قوة الجهد المطبقة (N)

  const IMA = de / dr;
  const MA = Fr / Fe;
  const efficiency = (MA / IMA) * 100;

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-5 shadow-card min-h-[460px] relative overflow-hidden flex items-center justify-center">
        {/* رافعة */}
        <svg viewBox="0 0 400 300" className="w-full h-full max-w-lg">
          {/* المحور */}
          <polygon points="180,250 220,250 200,200" fill="hsl(var(--deep))" />
          {/* الذراع */}
          <line x1={20} y1={200} x2={380} y2={200} stroke="hsl(var(--primary))" strokeWidth={8} strokeLinecap="round" />
          {/* الحمل */}
          <rect x={340} y={170 - dr * 200} width={50} height={30} fill="hsl(var(--destructive))" stroke="hsl(var(--deep))" strokeWidth={2} rx={4} />
          <text x={365} y={160 - dr * 200} fontSize={11} fill="hsl(var(--deep))" textAnchor="middle" fontWeight="bold">{Fr}N</text>
          {/* الجهد */}
          <line x1={40} y1={200 - de * 200} x2={40} y2={200} stroke="hsl(var(--success))" strokeWidth={3} markerEnd="url(#a)" />
          <defs>
            <marker id="a" markerWidth="10" markerHeight="10" refX="5" refY="9" orient="auto">
              <polygon points="0 0, 10 0, 5 10" fill="hsl(var(--success))" />
            </marker>
          </defs>
          <text x={40} y={195 - de * 200} fontSize={11} fill="hsl(var(--success))" textAnchor="middle" fontWeight="bold">{Fe}N</text>
          <text x={200} y={285} fontSize={12} fill="hsl(var(--muted-foreground))" textAnchor="middle">رافعة بسيطة</text>
        </svg>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-4">
        <h4 className="font-display font-extrabold text-foreground flex items-center gap-2">
          <Wrench className="h-4 w-4 text-primary" /> الفائدة الميكانيكية
        </h4>
        <Ctrl label="قوة الحمل F_r" unit="N" value={Fr} min={100} max={5000} step={100} onChange={(v) => { setFr(v); sounds.click(); }} />
        <Ctrl label="قوة الجهد F_e" unit="N" value={Fe} min={50} max={3000} step={50} onChange={(v) => { setFe(v); sounds.click(); }} />
        <Ctrl label="مسافة الجهد d_e" unit="م" value={de} min={0.05} max={1} step={0.05} onChange={(v) => { setDe(v); sounds.click(); }} />
        <Ctrl label="مسافة الحمل d_r" unit="م" value={dr} min={0.02} max={0.5} step={0.01} onChange={(v) => { setDr(v); sounds.click(); }} />

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>IMA = d_e/d_r = <b>{IMA.toFixed(2)}</b></div>
          <div>MA = F_r/F_e = <b>{MA.toFixed(2)}</b></div>
          <div className="text-base mt-1">الكفاءة = <b>{efficiency.toFixed(1)}%</b></div>
        </div>

        <button
          onClick={() => {
            sounds.success();
            onMiyarSay?.(`الكفاءة = (MA/IMA)×100. الآلات الحقيقية تفقد جزءاً من الشغل بسبب الاحتكاك! ⚙️`, "celebrate");
          }}
          className="w-full bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm shadow-glow"
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
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-bold">{label}</label>
        <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-md">{value} {unit}</span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0])} dir="ltr" />
    </div>
  );
}
