"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { UserStats, DailyLog } from "@/lib/types";
import { updateActionCompletion } from "@/app/actions";
import { startOfWeek, addDays, format } from "date-fns";

import { MobileHome } from "@/components/home/MobileHome";
import { DesktopHome } from "@/components/home/DesktopHome";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats | null>(null);
  
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [weeklyLogs, setWeeklyLogs] = useState<DailyLog[]>([]);
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    const deviceId = localStorage.getItem("device_id");
    if (!deviceId) {
      router.push("/onboarding");
      return;
    }

    const loadData = async () => {
      try {
        // 1. Fetch User Profile
        const { data: user } = await supabase
          .from("user_profiles")
          .select("id")
          .eq("device_id", deviceId)
          .single();

        if (!user) {
          localStorage.removeItem("device_id");
          router.push("/onboarding");
          return;
        }

        // 2. Fetch User Stats
        const { data: userStats } = await supabase
          .from("user_stats")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (userStats) setStats(userStats);

        // 3. Generate Week Days (Mon to Sun)
        const today = new Date();
        const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday
        const days = Array.from({ length: 7 }).map((_, i) => addDays(start, i));
        setWeekDays(days);
        
        const startStr = format(days[0], "yyyy-MM-dd");
        const endStr = format(addDays(days[6], 1), "yyyy-MM-dd"); // up to next monday bounding

        // 4. Fetch Weekly Logs
        const { data: logs } = await supabase
          .from("daily_logs")
          .select("*")
          .eq("user_id", user.id)
          .gte("date", startStr)
          .lt("date", endStr);
          
        if (logs) {
          setWeeklyLogs(logs);
          const tLog = logs.find(l => l.date === format(today, "yyyy-MM-dd"));
          if (tLog) {
            setTodayLog(tLog);
            setCompleted(tLog.completed_actions || []);
          }
        }

      } catch (err) {
        console.error("Failed to load home data:", err instanceof Error ? err.message : err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const toggleAction = async (index: number) => {
    if (!todayLog) return;
    
    let newCompleted;
    if (completed.includes(index)) {
      newCompleted = completed.filter(i => i !== index);
    } else {
      newCompleted = [...completed, index];
    }
    
    setCompleted(newCompleted);

    // Calculate score (0, 33, 67, 100)
    const score = Math.round((newCompleted.length / 3) * 100);
    setTodayLog({ ...todayLog, score });

    await updateActionCompletion(todayLog.id!, newCompleted, score);
  };

  if (loading) return <div className="p-10 text-center text-primary font-bold">리듬 확인 중...</div>;

  return (
    <>
      {/* Mobile Template */}
      <MobileHome
        stats={stats}
        weekDays={weekDays}
        weeklyLogs={weeklyLogs}
        todayLog={todayLog}
        completed={completed}
        toggleAction={toggleAction}
      />

      {/* Desktop Template */}
      <DesktopHome
        stats={stats}
        weekDays={weekDays}
        weeklyLogs={weeklyLogs}
        todayLog={todayLog}
        completed={completed}
        toggleAction={toggleAction}
      />
    </>
  );
}
