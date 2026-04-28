import { useState } from "react";
import { sounds } from "@/lib/sounds";

export function MeasurementLab() {
  const trueLength = 12.45; // hidden true value in cm
  const [reading, setReading] = useState("");
  const [readings, setReadings] = useState<number[]>([]);

  function addReading() {
    const v = parseFloat(reading);
    if (isNaN(v)) return;
    sounds.pop();
    setReadings([...readings, v]);
    setReading("");
  }

  function reset() {
    sounds.click();
    setReadings([]);
  }

  const mean = readings.length ? readings.reduce((a, b) => a + b, 0) / readings.length : 0;
  const accuracy = readings.length ? 100 - Math.abs((mean - trueLength) / trueLength) * 100 : 0;
  const variance = readings.length
    ? readings.reduce((s, r) => s + (r - mean) ** 2, 0) / readings.length
    : 0;
  const precision = readings.length ? 100 - Math.sqrt(variance) * 20 : 0;

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky p-6 min-h-[460px] flex flex-col items-center justify-center shadow-card border border-border">
        <div className="text-6xl mb-2">📏</div>
        <div className="text-sm text-muted-foreground mb-4">قيسي طول القلم بالمسطرة وأدخلي قراءتك</div>

        {/* SVG ruler with pen */}
        <svg viewBox="0 0 400 100" className="w-full max-w-md mb-4">
          <rect x="20" y="60" width="360" height="20" fill="oklch(0.92 0.06 230)" stroke="oklch(0.55 0.20 252)" strokeWidth="2" rx="4" />
          {Array.from({ length: 16 }).map((_, i) => (
            <g key={i}>
              <line x1={40 + i * 22} y1="60" x2={40 + i * 22} y2={i % 5 === 0 ? 50 : 55} stroke="oklch(0.22 0.10 255)" strokeWidth="1.5" />
              {i % 5 === 0 && <text x={40 + i * 22} y="48" fontSize="10" textAnchor="middle" fill="oklch(0.22 0.10 255)">{i}</text>}
            </g>
          ))}
          {/* pen */}
          <rect x="40" y="30" width={trueLength * 22} height="14" fill="oklch(0.55 0.20 252)" rx="3" />
          <polygon points={`${40 + trueLength * 22},37 ${40 + trueLength * 22 + 12},30 ${40 + trueLength * 22 + 12},44`} fill="oklch(0.22 0.10 255)" />
        </svg>

        <div className="bg-card rounded-2xl p-4 shadow-soft w-full max-w-md">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>عدد القراءات: <span className="font-bold">{readings.length}</span></div>
            <div>المتوسط: <span className="font-bold">{mean.toFixed(2)} سم</span></div>
            <div>الدقة: <span className="font-bold text-success">{accuracy.toFixed(1)}%</span></div>
            <div>الضبط: <span className="font-bold text-primary">{Math.max(0, precision).toFixed(1)}%</span></div>
          </div>
          {readings.length > 0 && (
            <div className="mt-2 text-xs text-muted-foreground">
              قراءاتك: {readings.map(r => r.toFixed(2)).join("، ")}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-4">
        <h4 className="font-display font-extrabold text-foreground">📋 لوحة القياس</h4>

        <div>
          <label className="text-sm font-bold text-foreground block mb-1.5">قراءتك (سم)</label>
          <input
            type="number"
            step="0.01"
            value={reading}
            onChange={(e) => setReading(e.target.value)}
            placeholder="مثال: 12.4"
            className="w-full rounded-xl border-2 border-border bg-background p-2.5 font-mono"
          />
        </div>

        <button
          onClick={addReading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-full font-bold shadow-soft"
        >
          أضيفي القراءة
        </button>
        <button
          onClick={reset}
          className="w-full bg-muted text-foreground py-2 rounded-full font-bold text-sm"
        >
          إعادة
        </button>

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1">
          <div className="font-bold mb-1">💡 ملاحظة</div>
          <div>الدقة = القرب من القيمة الحقيقية</div>
          <div>الضبط = اتساق القراءات المتكررة</div>
        </div>
      </div>
    </div>
  );
}
