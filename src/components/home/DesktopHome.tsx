"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Bell, Settings, User, Check, ChevronRight, Download, Plus, Flame } from "lucide-react";
import { UserStats, DailyLog } from "@/lib/types";

export interface HomeProps {
  stats: UserStats | null;
  weekDays: Date[];
  weeklyLogs: DailyLog[];
  todayLog: DailyLog | null;
  completed: number[];
  toggleAction: (index: number) => Promise<void>;
}

export function DesktopHome({
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
    <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col min-h-screen px-10 py-6">
      {/* Top Header */}
      <header className="flex justify-end items-center mb-10 w-full">
        <div className="flex items-center space-x-6">
           <Bell className="w-5 h-5 text-neutral" />
           <Settings className="w-5 h-5 text-neutral" />
           <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center overflow-hidden shadow-sm">
             <User className="w-5 h-5 text-white" />
           </div>
        </div>
      </header>

      {/* Greeting and Streak */}
      <div className="flex justify-between items-end mb-8 w-full">
        <div>
          <h2 className="text-2xl font-serif text-primary font-bold mb-2">Good morning, Elena.</h2>
          <p className="text-neutral text-sm">Today is a high-energy day in your cycle. Embrace the movement.</p>
        </div>
        <div className="bg-peach px-5 py-2.5 rounded-full flex items-center font-bold text-sm text-[#8F5D4D] shadow-sm">
          <Flame className="w-4 h-4 fill-[#8F5D4D] mr-2" />
          <span>{stats?.streak_days || 12} DAYS IN A ROW</span>
        </div>
      </div>

      {/* Top Area: 2 Columns */}
      <div className="grid grid-cols-[1fr_320px] gap-8 mb-8">
        
        {/* Left Column: Protocols */}
        <div className="bg-white rounded-[24px] border border-neutral/10 shadow-sm p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif text-lg font-bold text-primary">Today's Protocol</h3>
            <span className="text-xs text-neutral tracking-wide uppercase font-bold">{format(today, "MMMM d, yyyy")}</span>
          </div>
          
          <div className="flex-1 flex flex-col gap-3">
            {[
              { title: "Morning Walk", sub: "20 minutes outdoors for cortisol regulation", done: false },
              { title: "Hydration Target", sub: "2.5L with electrolyte support", done: false },
              { title: "Sleep Quality Log", sub: "Track REM and Deep Sleep cycles", done: true },
            ].map((task, idx) => (
              <button key={idx} className={`w-full p-5 rounded-2xl flex items-center text-left transition-all ${task.done ? "bg-[#F3F9F8] border border-mint/50" : "bg-neutral/5 border border-transparent hover:border-neutral/20"}`}>
                <div className={`w-5 h-5 rounded-[4px] mr-5 flex flex-shrink-0 items-center justify-center border transition-colors ${task.done ? "bg-mint/40 border-mint/0 text-primary" : "border-neutral/40 bg-white"}`}>
                   {task.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div className="flex-1">
                  <div className={`font-medium text-sm ${task.done ? "text-neutral line-through opacity-70" : "text-primary"}`}>{task.title}</div>
                  <div className={`text-xs mt-0.5 ${task.done ? "text-neutral/50 line-through" : "text-neutral/80"}`}>{task.sub}</div>
                </div>
                {task.done ? (
                   <Check className="w-5 h-5 stroke-[3] text-primary" />
                ) : (
                   <ChevronRight className="w-5 h-5 text-neutral/50" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Weekly Rhythm Sync */}
        <div className="bg-white rounded-[24px] border border-neutral/10 shadow-sm p-8 flex flex-col items-center">
          <h3 className="font-serif text-base font-bold text-primary w-full mb-8">Weekly Rhythm</h3>
          
          {/* Donut Chart Mock */}
          <div className="relative w-40 h-40 mb-10">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#F8F6F1" strokeWidth="8" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#8F5D4D" strokeWidth="8" strokeDasharray="282.7" strokeDashoffset="70.675" className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-primary">75%</span>
              <span className="text-[10px] tracking-widest text-neutral font-bold mt-1">SYNCED</span>
            </div>
          </div>
          
          {/* Energy Bar */}
          <div className="w-full mt-auto">
            <div className="flex justify-between text-[10px] font-bold text-neutral tracking-widest mb-2 uppercase">
              <span>Energy Level</span>
              <span className="text-primary">Optimal</span>
            </div>
            <div className="w-full h-2 bg-neutral/10 rounded-full overflow-hidden">
              <div className="w-[85%] h-full bg-[#8F5D4D] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Area: Premium Insight Full Width Card */}
      <div className="w-full bg-primary rounded-[32px] overflow-hidden flex shadow-lg relative min-h-[300px]">
        {/* Left Side: Content */}
        <div className="flex-1 p-12 flex flex-col justify-center z-10">
          <div className="mb-6">
            <span className="border border-white/20 text-white/80 py-1.5 px-4 rounded-full text-xs tracking-wider uppercase font-medium">
              Premium Insight
            </span>
          </div>
          <h3 className="text-2xl font-serif font-bold text-white mb-4">Monthly Hormonal Trend Report</h3>
          <p className="text-white/70 text-sm leading-relaxed max-w-lg mb-8">
            We've analyzed your past 30 days of activity and biometric data.
            Your follicular phase is showing significant improvement in
            resting heart rate variability.
          </p>
          <button className="bg-[#8F5D4D] text-white py-3.5 px-6 rounded-md font-bold text-sm tracking-wide shadow-md hover:bg-[#8F5D4D]/90 transition-colors flex items-center space-x-3 w-max">
            <span>VIEW FULL REPORT</span>
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* Right Side: Graphic Data Art */}
        <div className="w-[450px] relative flex items-center justify-center p-8 bg-[#1B352E]/30 border-l border-white/5">
          <div className="w-full h-full bg-[#0d1614] rounded-2xl border border-white/10 overflow-hidden relative shadow-inner">
             <div className="absolute inset-0 flex flex-col gap-2 justify-center opacity-70 mix-blend-screen px-4">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-24 stroke-peach fill-none opacity-50">
                  <path d="M0,50 Q25,20 50,50 T100,50" strokeWidth="2" />
                  <path d="M0,60 Q30,10 60,60 T100,60" strokeWidth="1" />
                </svg>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-24 stroke-mint fill-none opacity-50">
                  <path d="M0,40 Q25,80 50,40 T100,40" strokeWidth="2" />
                  <path d="M0,30 Q30,90 60,30 T100,30" strokeWidth="1" />
                </svg>
             </div>
          </div>
          
          <button className="absolute bottom-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/20 shadow-lg">
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
