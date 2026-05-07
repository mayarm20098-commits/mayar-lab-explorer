import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function SoundWaveLab({ onMiyarSay }: Props) {
  const [vSource, setVSource] = useState(20); // m/s, +ve toward observer
  const [f0, setF0] = useState(440); // Hz emitted
  const v = 343; // sound speed
  const fObs = (f0 * v) / (v - vSource);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0; let last = performance.now();
    const W = canvas.width, H = canvas.height;
    const wavefronts: { x: number; y: number; r: number; born: number }[] = [];
    let nextEmit = 0;
    const tick = (now: number) => {
      const dt = (now - last) / 1000; last = now; tRef.current += dt;
      ctx.clearRect(0, 0, W, H);
      // background
      ctx.fillStyle = "rgba(255,255,255,0)"; ctx.fillRect(0, 0, W, H);
      // emit wavefront
      nextEmit -= dt;
      const sourceX = (W / 2) + vSource * tRef.current * 8;
      const sourceY = H / 2;
      if (nextEmit <= 0) {
        wavefronts.push({ x: sourceX, y: sourceY, r: 0, born: tRef.current });
        nextEmit = 1 / (f0 / 60); // visual rate
      }
      // draw wavefronts
      ctx.strokeStyle = "hsl(220 70% 50%)"; ctx.lineWidth = 1.5;
      for (let i = wavefronts.length - 1; i >= 0; i--) {
        const w = wavefronts[i];
        w.r = (tRef.current - w.born) * 80;
        if (w.r > Math.max(W, H)) { wavefronts.splice(i, 1); continue; }
        ctx.beginPath(); ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2); ctx.stroke();
      }
      // source
      ctx.fillStyle = "hsl(0 70% 55%)"; ctx.beginPath(); ctx.arc(sourceX, sourceY, 10, 0, Math.PI * 2); ctx.fill();
      // observer
      ctx.fillStyle = "hsl(160 60% 40%)"; ctx.beginPath(); ctx.arc(W - 30, sourceY, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#000"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("🔊", sourceX, sourceY + 4);
      ctx.fillText("👂", W - 30, sourceY + 4);
      if (sourceX > W - 60) { tRef.current = 0; wavefronts.length = 0; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [vSource, f0]);

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-3 shadow-card min-h-[460px] flex flex-col items-center justify-center gap-2">
        <canvas ref={canvasRef} width={520} height={380} className="bg-card rounded-2xl border border-border w-full max-w-full" />
        <div className="bg-card/90 rounded-xl px-3 py-2 text-xs font-mono shadow-soft text-center">
          التردد المُرسَل f₀ = <b>{f0} Hz</b> • التردد المسموع f' = <b className="text-primary">{fObs.toFixed(1)} Hz</b>
        </div>
      </div>
      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold">🔊 الموجات الصوتية وأثر دوبلر</h4>
        <Ctrl label="سرعة المصدر" unit="م/ث" value={vSource} min={-60} max={60} step={5} onChange={setVSource} />
        <Ctrl label="تردد المصدر" unit="Hz" value={f0} min={200} max={1200} step={20} onChange={setF0} />
        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs font-mono space-y-1">
          <div>f' = f₀ · v/(v − vₛ)</div>
          <div>v_sound = 343 م/ث</div>
        </div>
        <button onClick={() => { sounds.success(); onMiyarSay?.("اقتراب المصدر يرفع التردد (حادّ)، وابتعاده يخفضه (غليظ). هذا أثر دوبلر! 🚓", "celebrate"); }} className="w-full bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm shadow-glow">القاعدة؟</button>
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
