"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Scale, Zap, BrainCircuit, HelpCircle, ArrowRight, Check } from "lucide-react";
import { getDictionary } from "@/lib/dictionaries";

const GOALS = [
  { id: "체중 관리", label: "Weight Management", icon: Scale },
  { id: "에너지 & 활력", label: "Energy & Vitality", icon: Zap },
  { id: "정신적 맑음", label: "Mental Clarity", icon: BrainCircuit },
];

export default function OnboardingPage({ params }: { params: Promise<{ lang: string }> }) {
  const router = useRouter();
  const [goal, setGoal] = useState("");
  const [baseline, setBaseline] = useState("");
  const [loading, setLoading] = useState(false);
  const [dict, setDict] = useState<any>(null);
  const [lang, setLang] = useState<string>("en");

  useEffect(() => {
    const init = async () => {
      const resolvedParams = await params;
      const dictionary = await getDictionary(resolvedParams.lang);
      setDict(dictionary);
      setLang(resolvedParams.lang);
    };
    init();
  }, [params]);

  const handleStart = async () => {
    if (!goal || !baseline) return;
    setLoading(true);

    try {
      localStorage.setItem("temp_goal", goal);
      localStorage.setItem("temp_baseline", baseline);
      
      router.push(`/${lang}/login`);
    } catch (error) {
      alert("Error saving progress.");
      setLoading(false);
    }
  };

  if (!dict) return <div className="min-h-screen bg-secondary flex items-center justify-center">Loading...</div>;

  const translatedGoals = [
    { id: "체중 관리", label: dict.onboarding?.weightManagement || "Weight Management", icon: Scale },
    { id: "에너지 & 활력", label: dict.onboarding?.energyVitality || "Energy & Vitality", icon: Zap },
    { id: "정신적 맑음", label: dict.onboarding?.mentalClarity || "Mental Clarity", icon: BrainCircuit },
  ];

  return (
    <div className="fixed inset-0 overflow-y-auto z-10 flex flex-col bg-secondary text-primary font-sans">
      {/* Top Header */}
      <header className="flex justify-between items-center px-6 py-5 border-b border-neutral/10 bg-secondary w-full">
        <div className="h-24">
          <img src="/mora-logo.png" alt="MORA" className="h-full object-contain" />
        </div>
        <button className="w-8 h-8 rounded-full bg-neutral/10 flex items-center justify-center text-primary/80 transition-colors hover:bg-neutral/20">
           <HelpCircle className="w-5 h-5" />
        </button>
      </header>
      
      <div className="flex-1 flex flex-col items-center w-full max-w-4xl mx-auto px-6 py-10 md:py-16 relative">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-10 w-full justify-center">
          <div className="h-1 w-12 bg-primary rounded-full"></div>
          <div className="h-1 w-12 bg-neutral/20 rounded-full"></div>
          <div className="h-1 w-12 bg-neutral/20 rounded-full"></div>
        </div>

        <div className="text-center mb-16 w-full fade-in">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">{dict.onboarding?.findingRhythm || "Finding your rhythm"}</h2>
          <p className="text-sm md:text-base text-primary/70 max-w-md mx-auto leading-relaxed" dangerouslySetInnerHTML={{ __html: (dict.onboarding?.tailorExperience || "We&apos;ll tailor your experience based on your current<br className=\"hidden md:block\"/> state and aspirations.") }} />
        </div>

        <div className="w-full space-y-12 fade-in delay-100 flex-1">
          {/* Goal Selection */}
          <div className="space-y-6">
            <h3 className="text-xl md:text-2xl font-serif font-bold text-primary text-center mb-6">{dict.onboarding?.primaryGoal || "What is your primary health goal?"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {translatedGoals.map((item) => {
                const isSelected = goal === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setGoal(item.id)}
                    className={`relative w-full p-8 rounded-2xl flex flex-col items-center justify-center transition-all bg-white 
                      ${isSelected 
                        ? "border-2 border-primary shadow-sm" 
                        : "border border-neutral/15 hover:border-neutral/30"
                      }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                        <Check className="w-3 h-3 text-white stroke-[3]" />
                      </div>
                    )}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                      isSelected ? "bg-primary text-white" : "bg-mint/50 text-primary"
                    }`}>
                      <item.icon className="w-8 h-8" />
                    </div>
                    <div className="text-center font-medium text-sm text-primary">
                      {item.label}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Baseline Condition */}
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-serif font-bold text-primary text-center mb-2">{dict.onboarding?.howCondition || "How is your general condition lately?"}</h3>
            <p className="text-xs md:text-sm text-center text-primary/70 italic max-w-sm mx-auto mb-6 leading-relaxed">{dict.onboarding?.shareAsMuch || "Share as much or as little as you like."}</p>
            <textarea 
              value={baseline}
              onChange={(e) => setBaseline(e.target.value)}
              className="w-full h-36 p-6 rounded-2xl bg-secondary border border-neutral/20 placeholder-neutral/50 text-primary focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none"
              placeholder={dict.onboarding?.placeholder || "Example: I've been feeling a bit sluggish in the mornings and finding it hard to focus after lunch..."}
            />
          </div>
        </div>

        <div className="mt-16 w-full max-w-sm flex flex-col items-center">
          <button
            onClick={handleStart}
            disabled={!goal || !baseline || loading}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-base transition-all hover:bg-opacity-90 active:scale-95 disabled:opacity-50"
          >
            {loading ? dict.onboarding?.configuring || "Configuring..." : (
              <>
                <span>{dict.onboarding?.startJourney || "Start Journey"}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
          
          <button className="mt-6 text-xs font-bold text-primary/70 hover:text-primary transition-colors cursor-pointer" onClick={() => router.push(`/${lang}`)}>
             {dict.onboarding?.skipForNow || "Skip for now"}
          </button>
          
          <div className="mt-16 text-[10px] text-neutral/60 tracking-wider">
             {dict.onboarding?.craftedFor || "© 2024 MORA. Crafted for your sanctuary."}
          </div>
        </div>
      </div>
    </div>
  );
}
