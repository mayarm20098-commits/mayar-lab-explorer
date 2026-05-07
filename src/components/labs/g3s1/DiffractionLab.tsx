import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function DiffractionLab({ onMiyarSay }: Props) {
  const [lambdaNm, setLambdaNm] = useState(550); // nm
  const [d, setD] = useState(0.05); // mm slit separation
  const [L, setL] = useState(1.5); // m to screen
  // bright fringe spacing: y = mλL/d
  const lambda = lambdaNm * 1e-9;
  const dM = d * 1e-3;
  const fringeSpacing = (lambda * L) / dM * 1000; // mm

  // build intensity profile across 60 mm
  const wavelengthHz = lambdaNm; // for color
  const color = wavelengthToHsl(wavelengthHz);

  const samples = 200;
  const widthMM = 60;
  const intensities = Array.from({ length: samples }, (_, i) => {
    const y = ((i / (samples - 1)) - 0.5) * widthMM * 1e-3; // m
    const sinTheta = y / Math.sqrt(L * L + y * y);
    const phase = (Math.PI * dM * sinTheta) / lambda;
    const I = Math.cos(phase) ** 2;
    return I;
  });

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-4 shadow-card min-h-[460px] flex flex-col items-center justify-center gap-3">
        <div className="text-xs font-bold text-deep">نمط هدب يونغ على الشاشة</div>
        <div className="bg-black rounded-2xl w-full max-w-[480px] h-32 relative overflow-hidden border-2 border-deep">
          {intensities.map((I, i) => (
            <div key={i} className="absolute top-0 bottom-0" style={{ left: `${(i / samples) * 100}%`, width: `${100 / samples + 0.2}%`, background: color, opacity: I }} />
          ))}
        </div>
        <svg viewBox="0 0 480 60" className="w-full max-w-[480px] h-14">
          <polyline points={intensities.map((I, i) => `${(i / (samples - 1)) * 480},${55 - I * 50}`).join(" ")} fill="none" stroke="hsl(var(--primary))" strokeWidth={1.5} />
          <line x1={0} y1={55} x2={480} y2={55} stroke="hsl(var(--deep))" />
        </svg>
        <div className="bg-card/90 rounded-xl px-3 py-2 text-xs font-mono shadow-soft">
          المسافة بين هدبين Δy = <b className="text-primary">{fringeSpacing.toFixed(2)} مم</b>
        </div>
      </div>
      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold">✨ تجربة يونغ — التداخل والحيود</h4>
        <Ctrl label="الطول الموجي λ" unit="nm" value={lambdaNm} min={400} max={700} step={10} onChange={setLambdaNm} />
        <Ctrl label="فجوة الشقّين d" unit="مم" value={d} min={0.01} max={0.3} step={0.01} onChange={setD} />
        <Ctrl label="بُعد الشاشة L" unit="م" value={L} min={0.5} max={3} step={0.1} onChange={setL} />
        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs font-mono space-y-1">
          <div>y_m = m·λ·L / d</div>
          <div>d sinθ = m·λ (الهدب المضيء)</div>
        </div>
        <button onClick={() => { sounds.success(); onMiyarSay?.("زيادة الطول الموجي أو بُعد الشاشة تباعد الهدب، وتقليل المسافة بين الشقوق يفعل ذلك أيضاً! ✨", "celebrate"); }} className="w-full bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm shadow-glow">القاعدة؟</button>
      </div>
    </div>
  );
}

function wavelengthToHsl(nm: number) {
  // approximate visible spectrum: 400 (violet/280) -> 700 (red/0)
  const hue = 280 - ((nm - 400) / 300) * 280;
  return `hsl(${hue} 90% 60%)`;
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
