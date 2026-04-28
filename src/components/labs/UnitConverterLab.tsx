import { useState } from "react";
import { sounds } from "@/lib/sounds";

const units: Record<string, { label: string; toBase: number; base: string }[]> = {
  length: [
    { label: "ملم", toBase: 0.001, base: "متر" },
    { label: "سم", toBase: 0.01, base: "متر" },
    { label: "متر", toBase: 1, base: "متر" },
    { label: "كم", toBase: 1000, base: "متر" },
  ],
  mass: [
    { label: "ملغ", toBase: 0.000001, base: "كجم" },
    { label: "غ", toBase: 0.001, base: "كجم" },
    { label: "كجم", toBase: 1, base: "كجم" },
    { label: "طن", toBase: 1000, base: "كجم" },
  ],
  time: [
    { label: "ميلي ث", toBase: 0.001, base: "ث" },
    { label: "ث", toBase: 1, base: "ث" },
    { label: "د", toBase: 60, base: "ث" },
    { label: "ساعة", toBase: 3600, base: "ث" },
  ],
};

export function UnitConverterLab() {
  const [category, setCategory] = useState<keyof typeof units>("length");
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState(2);
  const [to, setTo] = useState(0);

  const list = units[category];
  const num = parseFloat(value) || 0;
  const baseValue = num * list[from].toBase;
  const result = baseValue / list[to].toBase;

  // scientific notation
  const sci = result === 0 ? "0" : result.toExponential(3);

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky p-6 min-h-[460px] flex flex-col justify-center items-center text-center shadow-card border border-border">
        <div className="text-6xl mb-4">📐</div>
        <div className="bg-card rounded-2xl p-6 shadow-soft w-full max-w-md">
          <div className="text-sm text-muted-foreground mb-1">القيمة الأصلية</div>
          <div className="text-2xl font-bold text-foreground mb-4">
            {num} <span className="text-primary">{list[from].label}</span>
          </div>
          <div className="h-px bg-border my-3" />
          <div className="text-sm text-muted-foreground mb-1">النتيجة</div>
          <div className="text-3xl font-display font-extrabold text-primary mb-2">
            {result.toLocaleString("en-US", { maximumFractionDigits: 6 })}
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-bold">{list[to].label}</span>
          </div>
          <div className="mt-4 p-3 rounded-xl bg-muted/50 font-mono text-sm">
            ترميز علمي: {sci}
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-4">
        <h4 className="font-display font-extrabold text-foreground">🎛️ التحكم</h4>

        <div>
          <label className="text-sm font-bold text-foreground block mb-1.5">الفئة</label>
          <select
            value={category}
            onChange={(e) => {
              sounds.click();
              setCategory(e.target.value as keyof typeof units);
              setFrom(0);
              setTo(0);
            }}
            className="w-full rounded-xl border-2 border-border bg-background p-2.5 font-medium"
          >
            <option value="length">الطول</option>
            <option value="mass">الكتلة</option>
            <option value="time">الزمن</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-bold text-foreground block mb-1.5">القيمة</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-xl border-2 border-border bg-background p-2.5 font-mono"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-foreground block mb-1.5">من</label>
          <select
            value={from}
            onChange={(e) => {
              sounds.click();
              setFrom(parseInt(e.target.value));
            }}
            className="w-full rounded-xl border-2 border-border bg-background p-2.5"
          >
            {list.map((u, i) => (
              <option key={i} value={i}>{u.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-bold text-foreground block mb-1.5">إلى</label>
          <select
            value={to}
            onChange={(e) => {
              sounds.click();
              setTo(parseInt(e.target.value));
            }}
            className="w-full rounded-xl border-2 border-border bg-background p-2.5"
          >
            {list.map((u, i) => (
              <option key={i} value={i}>{u.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
