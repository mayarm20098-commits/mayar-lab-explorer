import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type MiyarMessage = {
  text: string;
  /** mood affects the avatar expression */
  mood?: "happy" | "thinking" | "celebrate" | "encourage";
};

type Props = {
  message?: MiyarMessage | null;
  /** persistently visible vs only when message present */
  alwaysVisible?: boolean;
};

const moodEmoji: Record<NonNullable<MiyarMessage["mood"]>, string> = {
  happy: "😊",
  thinking: "🤔",
  celebrate: "🎉",
  encourage: "💪",
};

export function MiyarAssistant({ message, alwaysVisible = true }: Props) {
  const [visibleMsg, setVisibleMsg] = useState<MiyarMessage | null>(message ?? null);
  const [show, setShow] = useState(Boolean(message));

  useEffect(() => {
    if (message) {
      setVisibleMsg(message);
      setShow(true);
    } else {
      setShow(false);
    }
  }, [message]);

  if (!alwaysVisible && !show) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-end gap-3 pointer-events-none">
      {/* Speech bubble */}
      {show && visibleMsg && (
        <div
          className="pointer-events-auto max-w-xs rounded-3xl rounded-bl-sm bg-card text-card-foreground p-4 shadow-deep border border-primary/20 animate-bubble"
          dir="rtl"
        >
          <div className="flex items-start gap-2">
            <span className="text-lg leading-none">{moodEmoji[visibleMsg.mood ?? "happy"]}</span>
            <p className="text-sm leading-relaxed font-medium">{visibleMsg.text}</p>
          </div>
        </div>
      )}

      {/* Avatar */}
      <div
        className={cn(
          "pointer-events-auto relative h-20 w-20 rounded-full bg-gradient-card shadow-glow flex items-center justify-center",
          "ring-4 ring-background animate-float cursor-pointer transition-transform hover:scale-110",
        )}
        onClick={() => setShow((s) => !s)}
        title="ميار"
      >
        {/* Face */}
        <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-sky to-primary-glow flex items-center justify-center text-3xl">
          <span aria-hidden>👩‍🔬</span>
        </div>
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full ring-2 ring-primary/40 animate-pulse-glow" />
        <span className="absolute -top-1 -left-1 text-xs bg-success text-white rounded-full px-2 py-0.5 font-bold shadow-soft">
          ميار
        </span>
      </div>
    </div>
  );
}
