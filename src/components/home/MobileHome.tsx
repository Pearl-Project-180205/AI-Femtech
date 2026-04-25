"use client";

import { useRouter } from "next/navigation";
import { format, isSameDay } from "date-fns";
import { Bell, Calendar, Check, User, Settings, Zap, Droplets, Lock } from "lucide-react";
import { UserStats, DailyLog } from "@/lib/types";

export interface HomeProps {
  lang: string;
  dict: any;
  stats: UserStats | null;
  weekDays: Date[];
  weeklyLogs: DailyLog[];
  todayLog: DailyLog | null;
  completed: number[];
  toggleAction: (index: number) => Promise<void>;
}

export function MobileHome({
  lang,
  dict,
  stats,
  weekDays,
  weeklyLogs,
  todayLog,
  completed,
  toggleAction,
}: HomeProps) {
  const router = useRouter();
  const today = new Date();

  return (
    <div className="flex flex-col min-h-screen px-6 py-8 w-full md:hidden bg-[#FBF9F6]">
      <div className="w-full flex-1 flex flex-col pt-4 max-w-lg mx-auto">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-6 w-full px-2">
          <h1 className="text-xl font-serif text-primary tracking-wide">For:M</h1>
          <div className="flex items-center space-x-4">
            <Bell className="w-5 h-5 text-neutral/70" />
            <Settings className="w-5 h-5 text-neutral/70" />
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center overflow-hidden">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </header>

        {/* Greeting & Streak */}
        <div className="px-2 mb-4 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-serif text-primary font-bold mb-1">{dict.home?.welcomeBack || "Welcome back"}</h2>
            <p className="text-primary/70 text-sm">{dict.nav?.rhythmSteady || "Your rhythm is steady today."}</p>
          </div>
          <div className="flex flex-col items-center bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100 shadow-sm mt-1">
            <span className="text-xl font-bold text-orange-600">🔥 {stats?.streak_days || 12}</span>
            <span className="text-[10px] font-bold text-orange-600/80 tracking-tight whitespace-nowrap">{dict.home?.streakText || "일 연속 코칭 참여 중!"}</span>
          </div>
        </div>

        {/* Yesterday's Feedback */}
        <div className="px-2 mb-6">
          <div className="bg-[#F5F7F5] border border-emerald-100 p-3.5 rounded-[16px] flex items-start space-x-3 shadow-sm">
            <div className="bg-emerald-100 text-emerald-600 p-1 rounded-full mt-0.5 flex-shrink-0">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <p className="text-sm text-primary/80 font-medium leading-snug">
              {dict.home?.yesterdayFeedback || "어제 제안드린 행동 중 2가지를 완수하셨네요! 오늘도 좋은 리듬을 이어가요."}
            </p>
          </div>
        </div>

        {/* Hero Card */}
        <div className="mb-4 relative overflow-hidden bg-white border border-neutral/15 rounded-[20px] p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 inline-block px-2.5 py-1 rounded-full mb-3">AI COACHING</div>
              <h3 className="text-2xl font-serif font-bold text-primary">{dict.home?.coachingHero || "나만의 맞춤 코칭"}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center -mt-1">
              <div className="w-3 h-3 bg-primary rounded-tr-[8px] rounded-bl-[8px] rounded-tl-sm rounded-br-sm -rotate-45" />
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2 text-primary">
              <span>{dict.home?.lutealPhase || "Luteal Phase"}</span>
              <span>{dict.home?.percentOptimal || "78% Optimal"}</span>
            </div>
            <div className="w-full bg-neutral/10 h-2 rounded-full overflow-hidden">
              <div className="bg-[#8F5D4D] w-[78%] h-full rounded-full"></div>
            </div>
          </div>
          
          <p className="text-primary/80 italic text-sm border-l-2 border-emerald-500 pl-3">
             {dict.home?.quote || "\"Take gentle movements today; your body is preparing for rest.\""}
          </p>
        </div>

        {/* Quick Actions (Cards) */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button onClick={() => router.push(`/${lang}/check`)} className="bg-white p-5 rounded-[20px] border border-neutral/15 shadow-sm text-left group">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
              <Droplets className="w-5 h-5 text-orange-600" />
            </div>
            <h4 className="text-primary font-serif mb-1 font-bold leading-tight" dangerouslySetInnerHTML={{ __html: (dict.home?.hormoneTracking || "Hormone Tracking").replace(" ", "<br/>") }} />
            <span className="text-xs text-neutral">{dict.home?.loggedAgo || "Logged 2h ago"}</span>
          </button>
          <button onClick={() => router.push(`/${lang}/result`)} className="bg-white p-5 rounded-[20px] border border-neutral/15 shadow-sm text-left group">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <h4 className="text-primary font-serif mb-1 font-bold leading-tight" dangerouslySetInnerHTML={{ __html: (dict.home?.rhythmCalendar || "Rhythm Calendar").replace(" ", "<br/>") }} />
            <span className="text-xs text-neutral">{dict.home?.nextState || "Next: Flow State"}</span>
          </button>
        </div>

        {/* Today's Protocol */}
        <h3 className="font-bold text-primary/80 text-[10px] tracking-widest uppercase mb-3 mt-4 px-1">{dict.home?.todaysProtocol || "Today's Protocol"}</h3>
        <div className="bg-white rounded-[20px] shadow-sm border border-neutral/15 mb-8 overflow-hidden divide-y divide-neutral/10">
          {[
            { title: dict.home?.tasks?.t1_title || "Morning Walk", sub: dict.home?.tasks?.t1_sub || "20 minutes outdoors for cortisol regulation", done: true },
            { title: dict.home?.tasks?.t2_title || "Hydration Target", sub: dict.home?.tasks?.t2_sub || "2.5L with electrolyte support", done: false },
            { title: dict.home?.tasks?.t3_title || "Sleep Quality Log", sub: dict.home?.tasks?.t3_sub || "Track REM and Deep Sleep cycles", done: false },
          ].map((task, idx) => (
            <button key={idx} className="w-full p-4 flex items-center text-left hover:bg-neutral/5 transition-colors">
              <div className={`w-5 h-5 rounded-[4px] mr-4 flex items-center justify-center border transition-colors ${task.done ? "bg-primary border-primary text-white" : "border-neutral/30"}`}>
                {task.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <div className="flex-1">
                <div className={`font-medium text-sm ${task.done ? "text-neutral line-through" : "text-primary"}`}>{task.title}</div>
                <div className="text-sm text-neutral/70 mt-0.5">{task.sub}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Activity Record & Premium Lock */}
        <div className="flex justify-between items-end mb-4 px-1 mt-8">
          <h3 className="font-bold text-primary/80 text-[10px] tracking-widest uppercase mb-1">{dict.home?.premiumInsight || "Premium Insight"}</h3>
          <button className="flex items-center text-xs text-[#8F5D4D] font-bold hover:underline mb-1 bg-orange-50 px-2 py-1 rounded-md transition-colors hover:bg-orange-100">
            <Lock className="w-3 h-3 mr-1" />
            {dict.home?.monthlyTrend || "월간 호르몬 트렌드 리포트"}
          </button>
        </div>
        
        <div className="flex justify-between pb-4">
          {weekDays.map(day => {
            const isT = isSameDay(day, today);
            const isPast = day < today;
            
            if (isT) {
              return (
                <div key="today" className="w-[52px] h-[72px] rounded-[26px] bg-primary flex flex-col items-center justify-center text-white shadow-lg border-2 border-primary/20 scale-105 mx-1">
                  <span className="text-xs font-medium mb-1">{format(day, "EE")[0]}</span>
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-primary mt-1">
                    <Zap className="w-4 h-4 fill-primary" />
                  </div>
                </div>
              )
            }

            return (
              <div key={day.toISOString()} className="w-[46px] h-[64px] rounded-[23px] border border-[#C6C4BC] flex flex-col items-center justify-center">
                <span className="text-xs text-primary/70 mb-2">{format(day, "EE")[0]}</span>
                {isPast ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center text-primary">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral/30" />
                )}
              </div>
            )
          })}
        </div>
      </div>

    </div>
  );
}
