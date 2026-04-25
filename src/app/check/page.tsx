"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { analyzeCondition } from "@/app/actions";
import { Moon, Activity as ActivityIcon, Droplet, Plus } from "lucide-react";

const CONDITIONS = [
  "브레인 포그", "근육 긴장", "소화 불량/가스", "평온함", "두통", "기타"
];

const SLEEP_OPTIONS = [
  { id: "부족함", desc: "가끔 깨거나 얕은 수면" },
  { id: "보통", desc: "어느 정도 휴식됨" },
  { id: "깊은 수면", desc: "푹 자고 상쾌하게 일어남" },
];

const MENSTRUAL_OPTIONS = ["없음", "생리 전", "생리 중", "생리 후"];
const ACTIVITY_OPTIONS = ["낮음", "보통", "높음"];

export default function CheckPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [sleep, setSleep] = useState("");
  const [condition, setCondition] = useState<string[]>([]);
  const [weight, setWeight] = useState("");
  const [menstrual, setMenstrual] = useState("");
  const [activity, setActivity] = useState("");

  const toggleCondition = (c: string) => {
    setCondition(prev => 
      prev.includes(c) ? prev.filter(i => i !== c) : [...prev, c]
    );
  };

  const handleSubmit = async () => {
    if (!sleep || !menstrual || !activity || condition.length === 0) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    setLoading(true);
    const deviceId = localStorage.getItem("device_id") || "";
    
    try {
      const res = await analyzeCondition({
        device_id: deviceId,
        sleep,
        condition,
        weight: weight ? parseFloat(weight) : null,
        menstrual,
        activity
      });

      if (res.success) {
        router.push(`/result?id=${res.logId}`);
      }
    } catch (err) {
      console.error("Failed to analyze condition:", err instanceof Error ? err.message : err);
      alert("분석 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full py-8 md:py-12 pb-32 px-6 md:px-12 md:ml-64 max-w-5xl md:mx-auto w-full">
      <div className="mb-8">
        <h4 className="text-xs font-bold text-neutral uppercase tracking-widest mb-1">DAILY CHECK-IN</h4>
        <h2 className="text-3xl md:text-4xl font-serif text-primary">당신의 컨디션 기록</h2>
      </div>

      <div className="space-y-10">
        
        {/* Conditions */}
        <section>
          <h3 className="text-xl md:text-2xl font-serif text-primary mb-4">불편하거나 특징적인 징후가 있나요?</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CONDITIONS.map(c => (
              <button
                key={c}
                onClick={() => toggleCondition(c)}
                className={`p-4 rounded-2xl flex items-center justify-center space-x-2 font-bold transition-all border-2 ${
                  condition.includes(c) 
                    ? "bg-primary text-white border-primary" 
                    : "bg-white text-primary border-neutral/10"
                }`}
              >
                {c === "기타" && <Plus className="w-4 h-4 opacity-70" />}
                <span>{c}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Sleep */}
        <section>
          <h3 className="text-xl md:text-2xl font-serif text-primary mb-4">수면의 질은 어떠셨나요?</h3>
          <div className="space-y-3">
            {SLEEP_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => setSleep(opt.id)}
                className={`w-full p-4 md:p-6 flex items-center justify-between rounded-2xl border-2 transition-all ${
                  sleep === opt.id 
                    ? "bg-primary text-white border-primary" 
                    : "bg-white text-primary border-neutral/10"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${sleep === opt.id ? "bg-white/20" : "bg-secondary"}`}>
                    <Moon className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-lg md:text-xl">{opt.id}</div>
                    <div className={`text-sm md:text-base ${sleep === opt.id ? "text-white/80" : "text-neutral"}`}>{opt.desc}</div>
                  </div>
                </div>
                {sleep === opt.id && <div className="w-3 h-3 bg-white rounded-full" />}
              </button>
            ))}
          </div>
        </section>

        {/* Menstrual & Activity */}
        <section className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg md:text-xl font-serif text-primary mb-3">생리 주기</h3>
            <div className="flex flex-col space-y-2">
              {MENSTRUAL_OPTIONS.map(m => (
                <button
                  key={m}
                  onClick={() => setMenstrual(m)}
                  className={`p-3 md:p-4 rounded-xl border-2 font-bold text-sm md:text-base transition-all ${
                    menstrual === m ? "bg-primary text-white border-primary" : "bg-white border-neutral/10"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg md:text-xl font-serif text-primary mb-3">활동량</h3>
            <div className="flex flex-col space-y-2">
              {ACTIVITY_OPTIONS.map(a => (
                <button
                  key={a}
                  onClick={() => setActivity(a)}
                  className={`p-3 md:p-4 rounded-xl border-2 font-bold text-sm md:text-base transition-all ${
                    activity === a ? "bg-primary text-white border-primary" : "bg-white border-neutral/10"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Weight */}
        <section>
          <h3 className="text-lg md:text-xl font-serif text-primary mb-3">체중 (선택 사항)</h3>
          <input 
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="kg"
            className="w-full p-4 md:p-5 rounded-xl bg-white border-2 border-neutral/10 focus:border-primary focus:outline-none"
          />
        </section>

      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 md:pb-8 bg-gradient-to-t from-secondary via-secondary to-transparent z-40 pointer-events-none md:ml-64">
        <div className="max-w-4xl mx-auto pointer-events-auto flex justify-end md:justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full md:w-auto md:px-12 bg-[#2D4B43] text-white py-4 rounded-full font-bold text-lg shadow-xl shadow-primary/20 disabled:opacity-70 transition-all hover:opacity-90 active:scale-95 flex items-center justify-center space-x-2"
          >
            {loading ? <span>AI 분석 중...</span> : <span>오늘의 컨디션 분석하기 ✨</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
