import { useMemo, useState } from "react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

const COLORS = [
  { name: "أسود", hex: "#0a0a0a", digit: 0, mult: 1 },
  { name: "بني", hex: "#7a3b13", digit: 1, mult: 10 },
  { name: "أحمر", hex: "#dc2626", digit: 2, mult: 100 },
  { name: "برتقالي", hex: "#f97316", digit: 3, mult: 1_000 },
  { name: "أصفر", hex: "#facc15", digit: 4, mult: 10_000 },
  { name: "أخضر", hex: "#16a34a", digit: 5, mult: 100_000 },
  { name: "أزرق", hex: "#2563eb", digit: 6, mult: 1_000_000 },
  { name: "بنفسجي", hex: "#7c3aed", digit: 7, mult: 10_000_000 },
  { name: "رمادي", hex: "#6b7280", digit: 8, mult: 100_000_000 },
  { name: "أبيض", hex: "#f3f4f6", digit: 9, mult: 1_000_000_000 },
];

export function ResistorColorLab({ onMiyarSay }: Props) {
  const [b1, setB1] = useState(2); // red
  const [b2, setB2] = useState(7); // violet
  const [b3, setB3] = useState(2); // x100

  const value = useMemo(() => (COLORS[b1].digit * 10 + COLORS[b2].digit) * COLORS[b3].mult, [b1, b2, b3]);

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-6 shadow-card flex flex-col items-center justify-center min-h-[460px]">
        {/* Resistor body */}
        <div className="relative w-72 h-24 bg-[#e9c897] rounded-2xl shadow-deep flex items-center justify-center gap-3 border-4 border-[#b58450]">
          <div className="absolute -right-10 w-10 h-1.5 bg-deep" />
          <div className="absolute -left-10 w-10 h-1.5 bg-deep" />
          <Band color={COLORS[b1].hex} />
          <Band color={COLORS[b2].hex} />
          <Band color={COLORS[b3].hex} />
          <Band color="#c9a84c" />
        </div>
        <div className="mt-6 text-3xl font-display font-extrabold text-deep">{format(value)} Ω</div>
        <div className="text-xs text-muted-foreground mt-1">القيمة الحقيقية للمقاومة</div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-4">
        <h4 className="font-display font-extrabold flex items-center gap-2">🎨 ألوان الحلقات</h4>
        <Picker label="الحلقة 1" value={b1} onChange={(v) => { setB1(v); sounds.pop(); }} />
        <Picker label="الحلقة 2" value={b2} onChange={(v) => { setB2(v); sounds.pop(); }} />
        <Picker label="الحلقة 3 (المضاعف)" value={b3} onChange={(v) => { setB3(v); sounds.pop(); }} />

        <button
          onClick={() => {
            sounds.success();
            onMiyarSay?.(
              `قراءة المقاومة: الرقم الأول × 10 + الرقم الثاني، ثم الضرب في معامل اللون الثالث. النتيجة: ${format(value)} Ω`,
              "celebrate",
            );
          }}
          className="w-full bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm shadow-glow"
        >
          كيف أقرأ المقاومة؟
        </button>
      </div>
    </div>
  );
}

function Band({ color }: { color: string }) {
  return <div className="w-5 h-full" style={{ background: color }} />;
}

function Picker({ label, value, onChange }: { label: string; value: number; onChange: (i: number) => void }) {
  return (
    <div>
      <div className="text-xs font-bold mb-2">{label}</div>
      <div className="grid grid-cols-5 gap-1.5">
        {COLORS.map((c, i) => (
          <button
            key={c.name}
            onClick={() => onChange(i)}
            title={c.name}
            className={`h-8 rounded-md border-2 transition-all ${value === i ? "border-primary scale-110 shadow-glow" : "border-border"}`}
            style={{ background: c.hex }}
          />
        ))}
      </div>
    </div>
  );
}

function format(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}
