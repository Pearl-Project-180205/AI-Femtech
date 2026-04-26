"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Lock } from "lucide-react";

function ResultContent({ lang }: { lang: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [log, setLog] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchLogAndStatus = async () => {
      const deviceId = localStorage.getItem("device_id") || "";
      
      const { data: logData } = await supabase
        .from("daily_logs")
        .select("*")
        .eq("id", id)
        .single();
      
      if (logData) {
        setLog(logData);
      }

      // Hardcoded to false for MVP mockup without real Stripe/subscriptions
      setIsPremium(false);

      setLoading(false);
    };
    fetchLogAndStatus();
  }, [id]);

  if (loading) return <div className="p-10 text-center font-bold text-primary">Loading Result...</div>;
  if (!log) return <div className="p-10 text-center">Log not found.</div>;

  return (
    <div className="flex flex-col min-h-screen pb-24 md:pb-8 w-full max-w-4xl bg-secondary text-left">
      {/* Top Banner (Free Summary) */}
      <div className="bg-white rounded-b-[40px] px-6 md:px-12 pt-12 pb-10 shadow-sm relative overflow-hidden">
        <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4">오늘의 핵심 요약</h4>
        
        <p className="text-2xl md:text-3xl font-serif text-primary leading-relaxed font-bold">
          {log.free_summary || "수면이 부족하여 피로가 발생할 수 있습니다."}
        </p>
      </div>

      <div className="px-6 md:px-12 py-10 flex-1">
        {!isPremium ? (
          <div className="relative overflow-hidden rounded-3xl border border-neutral/10 bg-white shadow-md p-8 text-center mt-2">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-6">나만의 맞춤 코칭 받기</h2>
            
            {/* Blurred background mock */}
            <div className="absolute inset-x-0 bottom-0 top-32 bg-white/70 backdrop-blur-[4px] z-10 flex flex-col items-center justify-center pt-8">
              <Lock className="w-10 h-10 text-[#8F5D4D] mb-4" />
              <button 
                onClick={() => alert("준비 중인 프리미엄 기능입니다.")}
                className="bg-[#8F5D4D] text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform"
              >
                프리미엄 시작하기
              </button>
            </div>

            <div className="space-y-4 mb-4 text-left filter blur-[3px] opacity-60 relative z-0 pointer-events-none select-none">
               <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-start space-x-3">
                 <div className="text-xl">🔍</div>
                 <div>
                   <div className="font-bold mb-1 text-sm text-primary">상세 원인 분석 (Cause)</div>
                   <div className="text-sm text-primary/80">수면 부족과 함께 황체기 호르몬 변화가...</div>
                 </div>
               </div>
               <div className="p-4 bg-[#F5F7F5] border border-emerald-100 rounded-xl flex items-start space-x-3">
                 <div className="text-xl">🎯</div>
                 <div>
                   <div className="font-bold mb-1 text-sm text-primary">3가지 맞춤 행동 추천</div>
                   <div className="text-sm text-primary/80">단맛 대신 물 한 잔 마시기 외 2개 코칭</div>
                 </div>
               </div>
               <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start space-x-3">
                 <div className="text-xl">📊</div>
                 <div>
                   <div className="font-bold mb-1 text-sm text-primary">최근 3일 패턴 분석</div>
                   <div className="text-sm text-primary/80">활동량이 급격히 감소했습니다. 에너지 레벨이 떨어질 때마다 단 음식 섭취...</div>
                 </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 mt-2">
             {/* Premium Content */}
             <div className="bg-[#F5F7F5] border border-emerald-100 rounded-2xl p-6 shadow-sm">
                <div className="text-sm font-bold text-primary mb-3 flex items-center">
                  <span className="text-xl mr-2">🔍</span> 파고드는 원인 분석
                </div>
                <div className="text-primary/90 leading-relaxed font-medium">
                  {log.paid_result || "데이터가 충분하지 않습니다."}
                </div>
             </div>

             <div>
                <h4 className="text-xs font-bold text-neutral uppercase tracking-widest mb-2">오늘의 프로토콜</h4>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-6">당신을 위한 3가지 맞춤 행동</h2>
                
                <div className="space-y-3">
                  {(log.actions || ["충분한 휴식을 취하세요"]).map((action: string, idx: number) => (
                    <div key={idx} className="w-full p-5 rounded-2xl bg-white shadow-sm border border-neutral/10 flex items-center space-x-4">
                      <div className="w-8 h-8 rounded-full bg-[#8F5D4D]/10 text-[#8F5D4D] flex items-center justify-center font-bold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <span className="font-bold text-primary text-lg">
                        {action}
                      </span>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 md:pb-8 bg-gradient-to-t from-secondary via-secondary to-transparent z-40 pointer-events-none md:pl-64">
        <div className="w-full max-w-4xl pointer-events-auto flex justify-start">
          <button
            onClick={() => router.push(`/${lang}`)}
            className="w-full md:w-auto md:px-12 bg-[#5F3D36] text-white py-4 rounded-full font-bold text-lg shadow-xl shadow-primary/20 disabled:opacity-70 transition-all hover:opacity-90 active:scale-95 flex items-center justify-center space-x-2"
          >
            메인으로 돌아가기
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
