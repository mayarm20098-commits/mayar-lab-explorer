import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { sounds } from "@/lib/sounds";
import { toast } from "sonner";

export type LabProgressRow = {
  lab_id: string;
  completed: boolean;
  quiz_score: number;
  quiz_total: number;
  mistakes: number;
  points_earned: number;
};

export const BADGES: Record<string, { name: string; emoji: string; description: string }> = {
  first_lab: { name: "أول تجربة", emoji: "🌟", description: "أكملتِ تجربتك الأولى" },
  five_labs: { name: "مستكشفة", emoji: "🔬", description: "أكملتِ 5 تجارب" },
  ten_labs: { name: "عالمة صغيرة", emoji: "🏆", description: "أكملتِ 10 تجارب" },
  high_accuracy: { name: "دقّة عالية", emoji: "🎯", description: "نسبة إجاباتك فوق 90%" },
  perfect: { name: "أداء مميز", emoji: "💎", description: "أنهيتِ تجربة بدون أخطاء" },
  streak: { name: "نشاط مستمر", emoji: "🔥", description: "نشاط متواصل" },
};

export function useLabProgress(labId: string) {
  const { user, refreshProfile } = useAuth();
  const [progress, setProgress] = useState<LabProgressRow | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoaded(true);
      return;
    }
    supabase
      .from("lab_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("lab_id", labId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setProgress(data as LabProgressRow);
        setLoaded(true);
      });
  }, [user, labId]);

  const saveResult = useCallback(
    async (quizScore: number, quizTotal: number, mistakes: number) => {
      if (!user) {
        toast.error("سجّلي الدخول لحفظ نقاطك!");
        return;
      }
      const isPerfect = mistakes === 0 && quizScore === quizTotal;
      const points = 10 + quizScore * 2 + (isPerfect ? 5 : 0);

      // upsert
      const { data: existing } = await supabase
        .from("lab_progress")
        .select("id, completed")
        .eq("user_id", user.id)
        .eq("lab_id", labId)
        .maybeSingle();

      const isFirstCompletion = !existing?.completed;

      if (existing) {
        await supabase
          .from("lab_progress")
          .update({
            completed: true,
            quiz_score: quizScore,
            quiz_total: quizTotal,
            mistakes,
            points_earned: points,
            completed_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
      } else {
        await supabase.from("lab_progress").insert({
          user_id: user.id,
          lab_id: labId,
          completed: true,
          quiz_score: quizScore,
          quiz_total: quizTotal,
          mistakes,
          points_earned: points,
          completed_at: new Date().toISOString(),
        });
      }

      // bump profile total points only on first completion (or replace)
      if (isFirstCompletion) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("total_points")
          .eq("id", user.id)
          .maybeSingle();
        const newTotal = (prof?.total_points ?? 0) + points;
        await supabase.from("profiles").update({ total_points: newTotal }).eq("id", user.id);
      }

      sounds.celebrate();
      toast.success(`+${points} نقطة! 🎉`, { description: isPerfect ? "أداء مثالي بدون أخطاء!" : undefined });

      // award badges
      await checkAndAwardBadges(user.id, isPerfect, quizScore, quizTotal);
      await refreshProfile();

      setProgress({
        lab_id: labId,
        completed: true,
        quiz_score: quizScore,
        quiz_total: quizTotal,
        mistakes,
        points_earned: points,
      });
    },
    [user, labId, refreshProfile],
  );

  return { progress, loaded, saveResult };
}

async function checkAndAwardBadges(userId: string, isPerfect: boolean, score: number, total: number) {
  const { data: existingBadges } = await supabase
    .from("badges")
    .select("badge_key")
    .eq("user_id", userId);
  const owned = new Set((existingBadges ?? []).map((b: { badge_key: string }) => b.badge_key));

  const { count } = await supabase
    .from("lab_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("completed", true);
  const completedCount = count ?? 0;

  const toAward: string[] = [];
  if (completedCount >= 1 && !owned.has("first_lab")) toAward.push("first_lab");
  if (completedCount >= 5 && !owned.has("five_labs")) toAward.push("five_labs");
  if (completedCount >= 10 && !owned.has("ten_labs")) toAward.push("ten_labs");
  if (isPerfect && !owned.has("perfect")) toAward.push("perfect");
  if (total > 0 && score / total >= 0.9 && !owned.has("high_accuracy")) toAward.push("high_accuracy");

  for (const key of toAward) {
    await supabase.from("badges").insert({ user_id: userId, badge_key: key });
    sounds.badge();
    const meta = BADGES[key];
    toast.success(`${meta.emoji} شارة جديدة: ${meta.name}`, { description: meta.description });
  }
}
