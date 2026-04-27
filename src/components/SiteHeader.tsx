import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-card shadow-soft flex items-center justify-center text-xl">
            ⚛️
          </div>
          <div className="text-right">
            <div className="font-display font-extrabold text-foreground leading-none text-base">
              مختبر مِيار
            </div>
            <div className="text-[10px] text-muted-foreground leading-none mt-0.5">
              الفيزياء التفاعلية
            </div>
          </div>
        </Link>
        <Link
          to="/"
          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          الرئيسية <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
