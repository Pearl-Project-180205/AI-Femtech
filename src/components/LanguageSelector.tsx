"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { useState } from "react";

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "ko", name: "한국어" },
  { code: "ja", name: "日本語" },
  { code: "zh-CN", name: "简体中文" },
  { code: "zh-TW", name: "繁體中文" },
  { code: "th", name: "ไทย" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "de", name: "Deutsch" },
  { code: "fr", name: "Français" },
];

interface LanguageSelectorProps {
  currentLang: string;
  dict: any;
  floating?: boolean;
}

export function LanguageSelector({ currentLang, dict, floating = false }: LanguageSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (newLang: string) => {
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`;
    const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
    setIsOpen(false);
    router.push(newPath || `/${newLang}`);
  };

  const currentLabel = SUPPORTED_LANGUAGES.find(l => l.code === currentLang)?.name || "Language";

  if (floating) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-white border border-neutral/15 shadow-md rounded-full px-3 py-2 text-xs font-bold text-neutral/70 hover:text-primary hover:border-primary/30 transition-all focus:outline-none"
        >
          <Globe className="w-4 h-4" />
          <span>{currentLabel}</span>
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute right-0 bottom-10 max-h-64 overflow-y-auto w-44 bg-white rounded-xl shadow-lg border border-neutral/10 z-50 py-2 origin-bottom-right">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    currentLang === lang.code
                      ? "bg-primary/5 text-primary font-bold"
                      : "text-neutral hover:bg-neutral/5"
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-xs font-bold text-neutral/70 hover:text-primary transition-colors focus:outline-none w-full"
      >
        <Globe className="w-4 h-4 fill-neutral/70" />
        <span className="flex-1 text-left">{dict.nav?.language || "Language"} ({currentLabel})</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 bottom-8 max-h-64 overflow-y-auto mb-2 w-48 bg-white rounded-xl shadow-lg border border-neutral/10 z-50 py-2 origin-bottom-left">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  currentLang === lang.code
                    ? "bg-primary/5 text-primary font-bold"
                    : "text-neutral hover:bg-neutral/5"
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
