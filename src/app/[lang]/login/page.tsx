"use client";

import { use } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  
  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/${lang}/check`,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-[#FBF9F6] flex flex-col items-center justify-center p-6 text-center text-primary z-50">
       <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#8F5D4D]/10 mb-6">
         <span className="text-2xl">🔒</span>
       </div>
       <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4 leading-tight">지속적인 코칭을 위해<br/>데이터를 안전하게 보관하세요</h1>
       <p className="text-sm md:text-base text-primary/70 max-w-sm mb-12 flex flex-col space-y-2 leading-relaxed">
         <span>입력하신 목표와 체형 데이터를 기반으로</span>
         <span>정확한 AI 주기 추적과 분석 결과를 제공합니다.</span>
       </p>
       
       <button 
         onClick={handleGoogleLogin} 
         className="w-full max-w-sm bg-white border border-neutral/20 py-4 font-bold text-sm rounded-full shadow-sm hover:shadow-md transition-all flex items-center justify-center text-primary/80 active:scale-95"
       >
         <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-3" />
         Google로 계속하기
       </button>
       
       <div className="mt-8 text-[10px] text-neutral/50">
         로그인함으로써 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다.
       </div>
    </div>
  )
}
