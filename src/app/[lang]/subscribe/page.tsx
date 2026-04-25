"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export default function SubscribePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    setLoading(plan);
    const deviceId = localStorage.getItem("device_id");

    if (!deviceId) {
      alert("Device ID not found. Please complete input first.");
      setLoading(null);
      return;
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_id: deviceId, plan })
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to initiate checkout: " + data.error);
        setLoading(null);
      }
    } catch (e: any) {
      alert("Error: " + e.message);
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen py-12 px-6 max-w-lg mx-auto bg-[#FBF9F6] items-center justify-center">
      <h1 className="text-3xl font-serif text-primary text-center font-bold mb-2">프리미엄 코칭 시작하기</h1>
      <p className="text-center text-primary/70 mb-8">매일의 행동 코칭과 상세 패턴 분석을 통해<br/>더 나은 리듬을 찾아보세요.</p>

      <div className="bg-white border border-neutral/15 w-full rounded-2xl p-6 shadow-sm mb-6">
        <h3 className="font-bold text-lg text-primary mb-4 flex items-center">
          <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-xs mr-2 border border-orange-200">Premium</span>
          구독 혜택
        </h3>
        <ul className="space-y-3 mb-6">
          <li className="flex items-start text-sm text-primary/80">
            <Check className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0" />
            증상에 대한 상세 원인 분석
          </li>
          <li className="flex items-start text-sm text-primary/80">
            <Check className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0" />
            나에게 딱 맞는 3가지 맞춤 행동
          </li>
          <li className="flex items-start text-sm text-primary/80">
            <Check className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0" />
            최근 3일 및 주간/월간 패턴 분석
          </li>
        </ul>
      </div>

      <div className="w-full space-y-4">
        <button 
          onClick={() => handleSubscribe('monthly')}
          disabled={loading !== null}
          className="w-full bg-white border-2 border-[#8F5D4D] rounded-2xl p-5 flex justify-between items-center transition-all hover:bg-orange-50 disabled:opacity-50"
        >
          <div className="text-left">
            <div className="font-bold text-lg text-primary">월간 플랜</div>
            <div className="text-sm text-primary/60">가볍게 시작해보세요</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-xl text-[#8F5D4D]">₩6,900</div>
            <div className="text-xs text-primary/60">/ 월</div>
          </div>
        </button>

        <button 
          onClick={() => handleSubscribe('yearly')}
          disabled={loading !== null}
          className="w-full bg-[#8F5D4D] border-2 border-[#8F5D4D] text-white rounded-2xl p-5 flex justify-between items-center transition-all hover:opacity-90 shadow-lg disabled:opacity-50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">28% 할인</div>
          <div className="text-left">
            <div className="font-bold text-lg">연간 플랜</div>
            <div className="text-sm opacity-80">꾸준한 관리를 위한 최적의 선택</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-xl">₩59,000</div>
            <div className="text-xs opacity-80">/ 년</div>
          </div>
        </button>
      </div>

      <button onClick={() => router.back()} className="mt-6 text-sm text-primary/50 underline">돌아가기</button>
    </div>
  );
}
