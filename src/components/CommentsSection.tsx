import { useEffect, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { sounds } from "@/lib/sounds";
import { toast } from "sonner";

type Comment = {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
};

export function CommentsSection() {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("comments")
      .select("id, author_name, content, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setComments(data as Comment[]);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit() {
    if (!user || !profile) {
      toast.error("سجّلي الدخول لإضافة تعليق");
      return;
    }
    if (!text.trim()) return;
    setLoading(true);
    sounds.click();
    const { error } = await supabase.from("comments").insert({
      user_id: user.id,
      author_name: profile.scientist_name,
      content: text.trim(),
    });
    setLoading(false);
    if (error) {
      toast.error("تعذّر إرسال التعليق");
      return;
    }
    sounds.success();
    setText("");
    toast.success("تم نشر تعليقكِ!");
    load();
  }

  return (
    <section className="rounded-3xl bg-card border border-border p-6 shadow-card">
      <h3 className="text-lg font-display font-extrabold text-foreground flex items-center gap-2 mb-4">
        <MessageCircle className="h-5 w-5 text-primary" /> آراء الطالبات
      </h3>

      {user ? (
        <div className="flex gap-2 mb-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="شاركي تجربتكِ مع الموقع..."
            maxLength={300}
            className="flex-1 rounded-full border-2 border-border bg-background px-4 py-2 text-sm"
          />
          <button
            onClick={submit}
            disabled={loading}
            className="bg-primary text-primary-foreground rounded-full p-2.5 shadow-soft hover:bg-primary/90 disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="text-center text-sm text-muted-foreground mb-4 bg-muted/40 p-3 rounded-2xl">
          سجّلي الدخول لإضافة تعليق
        </div>
      )}

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {comments.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-6">كوني أول من يعلّق! 💬</div>
        )}
        {comments.map((c) => (
          <div key={c.id} className="rounded-2xl bg-secondary/50 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-primary">👩‍🔬 {c.author_name}</span>
              <span className="text-[10px] text-muted-foreground">
                {new Date(c.created_at).toLocaleDateString("ar-SA")}
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{c.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
