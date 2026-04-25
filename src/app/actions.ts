"use server";

import { supabase } from "@/lib/supabase";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a health coach for women in their 40s.
Your job is to:
- Analyze daily condition based on today's data and past 3 days patterns.
- Give a short 1 sentence summary (free_summary).
- Give a detailed cause analysis (paid_result).
- Give exactly 3 simple actionable recommendations (actions).

Rules:
- Keep language simple
- No medical diagnosis
- All outputs must be in Korean.
- Return ONLY valid JSON, no other text

Return JSON strictly in this format:
{
  "free_summary": "1 short summary sentence",
  "paid_result": "Detailed cause analysis based on patterns",
  "actions": ["action 1", "action 2", "action 3"]
}`;

export async function analyzeCondition(payload: {
  device_id: string;
  sleep: string;
  condition: string[];
  weight?: number | null;
  menstrual: string;
  activity: string;
}) {
  const { device_id, sleep, condition, weight, menstrual, activity } = payload;

  // 1. Fetch user profile
  const { data: userProfile, error: userError } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("device_id", device_id)
    .single();

  if (userError || !userProfile) {
    throw new Error("User profile not found. Please complete onboarding.");
  }

  // 2. Fetch last 3 days logs for pattern context
  const { data: pastLogs } = await supabase
    .from("daily_logs")
    .select("date, sleep, condition, menstrual, activity, score")
    .eq("user_id", userProfile.id)
    .order("date", { ascending: false })
    .limit(3);

  const pastLogsText =
    pastLogs && pastLogs.length > 0
      ? pastLogs
          .map(
            (log) =>
              `- ${log.date}: Sleep(${log.sleep}), Condition(${log.condition.join(",")}), Menstrual(${log.menstrual}), Score(${log.score}%)`
          )
          .join("\n")
      : "No past data available.";

  const userPrompt = `User Goal: ${userProfile.goal}
User Baseline: ${userProfile.baseline_condition}

[Past 3 Days Data]
${pastLogsText}

[Today's Data]
Sleep: ${sleep}
Condition: ${condition.join(", ")}
Weight: ${weight || "N/A"}
Menstrual: ${menstrual}
Activity: ${activity}`;

  // 3. Call Claude API
  try {
    const response = await anthropic.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userPrompt }],
    });

    const raw =
      response.content[0].type === "text" ? response.content[0].text : "{}";
    const resultText = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
    const aiResult = JSON.parse(resultText);

    // 4. Save to db
    const today = new Date().toISOString().split("T")[0];

    const { data: newLog, error: insertError } = await supabase
      .from("daily_logs")
      .insert({
        user_id: userProfile.id,
        device_id: device_id,
        date: today,
        sleep,
        condition,
        weight,
        menstrual,
        activity,
        free_summary: aiResult.free_summary || "수면부족으로 피로가 발생할 수 있습니다.",
        paid_result: aiResult.paid_result || "상세 패턴 분석 중입니다.",
        actions: aiResult.actions || [
          "물을 마시세요",
          "휴식하세요",
          "스트레칭 하세요",
        ]
      })
      .select()
      .single();

    if (insertError) {
      console.error("Failed to save log:", insertError.message, insertError.code);
      throw new Error("Failed to save log");
    }

    // 5. Update user stats total_logs
    const { data: stats } = await supabase
      .from("user_stats")
      .select("total_logs")
      .eq("user_id", userProfile.id)
      .single();

    if (stats) {
      await supabase
        .from("user_stats")
        .update({ total_logs: (stats.total_logs || 0) + 1 })
        .eq("user_id", userProfile.id);
    } else {
      await supabase
        .from("user_stats")
        .insert({ user_id: userProfile.id, total_logs: 1, streak_days: 1, avg_score: 0 });
    }

    return { success: true, logId: newLog.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("AI Analysis error:", message);
    throw new Error(`Failed to analyze condition: ${message}`);
  }
}

export async function updateActionCompletion(
  logId: string,
  completedIndices: number[],
  score: number
) {
  const { error } = await supabase
    .from("daily_logs")
    .update({
      completed_actions: completedIndices,
      score: score,
    })
    .eq("id", logId);

  if (error) {
    console.error("Failed to update actions:", error.message, error.code);
    return { success: false };
  }
  return { success: true };
}
