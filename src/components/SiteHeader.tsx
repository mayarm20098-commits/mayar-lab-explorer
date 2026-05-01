import { Link } from "@tanstack/react-router";
import { ArrowRight, User, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function SiteHeader() {
  const { user, profile } = useAuth();
  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-card shadow-soft flex items-center justify-center text-xl">
            ⚛️
          </div>
          <div className="text-right">
            <div className="font-display font-extrabold text-foreground leading-none text-base">
              مختبر ميار
            </div>
            <div className="text-[10px] text-muted-foreground leading-none mt-0.5">
              الفيزياء التفاعلية
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {user && profile ? (
            <Link to="/profile" className="flex items-center gap-2 bg-card border border-border hover:border-primary px-3 py-1.5 rounded-full text-sm font-bold transition-colors">
              <span className="text-base">{profile.avatar_emoji}</span>
              <span className="hidden sm:inline">{profile.total_points} نقطة</span>
            </Link>
          ) : (
            <Link to="/auth" className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-sm font-bold shadow-soft">
              <LogIn className="h-3.5 w-3.5" /> دخول
            </Link>
          )}
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
