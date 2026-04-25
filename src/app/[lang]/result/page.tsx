"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { DailyLog } from "@/lib/types";
import { updateActionCompletion } from "@/app/actions";
import { Sparkles, CheckCircle2, Circle, Lock } from "lucide-react";

function ResultContent({ lang }: { lang: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [log, setLog] = useState<DailyLog | null>(null);
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    if (!id) return;
    const fetchLog = async () => {
      const { data, error } = await supabase
        .from("daily_logs")
        .select("*")
        .eq("id", id)
        .single();
      
      if (data) {
        setLog(data);
        setCompleted(data.completed_actions || []);
      }
      setLoading(false);
    };
    fetchLog();
  }, [id]);

  const toggleAction = async (index: number) => {
    if (!log) return;
    
    let newCompleted;
    if (completed.includes(index)) {
      newCompleted = completed.filter(i => i !== index);
    } else {
      newCompleted = [...completed, index];
    }
    
    setCompleted(newCompleted);

    // Calculate score (0, 33, 67, 100)
    const score = Math.round((newCompleted.length / 3) * 100);
    setLog({ ...log, score });

    await updateActionCompletion(log.id!, newCompleted, score);
  };

  if (loading) return <div className="p-10 text-center font-bold text-primary">Loading Result...</div>;
  if (!log) return <div className="p-10 text-center">Log not found.</div>;

  return (
    <div className="flex flex-col min-h-screen pb-24 md:pb-8 w-full max-w-5xl md:mx-auto md:ml-64 bg-secondary">
      {/* Top Banner & Analysis */}
      <div className="bg-white rounded-b-[40px] px-6 md:px-12 pt-12 pb-10 shadow-sm relative overflow-hidden">
        <h4 className="text-xs font-bold text-neutral uppercase tracking-widest mb-4">오늘의 분석</h4>
        
        <p className="text-2xl md:text-3xl font-serif text-primary leading-relaxed mb-6">
          {log.ai_result || "패턴을 분석했습니다."}
        </p>

        <div className="flex items-center space-x-3 mt-4">
          <div className="bg-primary text-white p-2 rounded-full">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-neutral tracking-wider">Coach Insight</div>
            <div className="text-sm font-bold text-primary">개인 맞춤형 조언</div>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 py-10 flex-1">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h4 className="text-xs font-bold text-neutral uppercase tracking-widest mb-1">오늘의 프로토콜</h4>
            <h2 className="text-3xl md:text-4xl font-serif text-primary font-bold">당신을 위한 3가지 행동</h2>
          </div>
          <div className="bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-bold">
            {completed.length} / 3 완료
          </div>
        </div>

        <div className="space-y-4">
          {log.actions?.map((action, idx) => {
            const isDone = completed.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => toggleAction(idx)}
                className={`w-full p-5 md:p-6 rounded-2xl border-2 flex items-center justify-between text-left transition-all ${
                  isDone 
                    ? "bg-primary/5 border-primary text-primary" 
                    : "bg-white border-white shadow-sm text-primary"
                }`}
              >
                <div className="flex items-center space-x-4">
                  {isDone ? (
                    <CheckCircle2 className="w-8 h-8 text-primary flex-shrink-0" />
                  ) : (
                    <Circle className="w-8 h-8 text-neutral/30 flex-shrink-0" />
                  )}
                  <span className={`font-bold text-lg md:text-xl ${isDone ? "opacity-60 line-through" : ""}`}>
                    {action}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Premium Hook Section */}
        <div className="mt-16 mb-8 relative">
          <div className="bg-white/40 p-8 rounded-3xl border border-white backdrop-blur-sm relative overflow-hidden text-center">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90 z-10" />
            
            <h3 className="text-xl font-serif font-bold text-primary mb-2 opacity-40">이번 주 패턴 분석 리포트</h3>
            <p className="text-base text-primary opacity-30 mb-4 whitespace-nowrap overflow-hidden">최근 7일간의 컨디션 사이클을 분석하여...</p>
            
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
              <Lock className="w-8 h-8 text-primary mb-3" />
              <button 
                onClick={() => alert("프리미엄 기능입니다.")}
                className="bg-primary text-white px-8 py-3 rounded-full font-bold text-sm shadow-xl hover:scale-105 transition-transform"
              >
                주간 리포트 언락하기
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 md:pb-8 bg-gradient-to-t from-secondary via-secondary to-transparent z-40 pointer-events-none md:ml-64">
        <div className="max-w-4xl mx-auto pointer-events-auto flex justify-end md:justify-end">
          <button
            onClick={() => router.push(`/${lang}`)}
            className="w-full md:w-auto md:px-12 bg-[#5F3D36] text-white py-4 rounded-full font-bold text-lg shadow-xl disabled:opacity-70 transition-all hover:opacity-90 active:scale-95 flex items-center justify-center space-x-2"
          >
            내일의 기록을 위해 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

import { use } from "react";

export default function ResultPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  return (
    <Suspense fallback={<div className="p-10 text-center font-bold">Loading...</div>}>
      <ResultContent lang={lang} />
    </Suspense>
  );
}
