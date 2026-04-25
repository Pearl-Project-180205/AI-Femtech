"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Activity, Calendar, User, LayoutDashboard, ListTodo, Users, LogOut, HelpCircle, Sparkles, Plus } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";

export function Navigation({ lang, dict }: { lang: string, dict: any }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === `/${lang}/onboarding`) return null;

  const PC_MENUS = [
    { name: dict.nav?.dashboard || "Dashboard", path: `/${lang}`, icon: LayoutDashboard },
    { name: dict.nav?.protocols || "Protocols", path: `#protocols`, icon: ListTodo },
    { name: dict.nav?.cycleTracking || "Cycle Tracking", path: `/${lang}/check`, icon: Calendar },
    { name: dict.nav?.community || "Community", path: `#community`, icon: Users },
  ];

  const MOBILE_MENUS = [
    { name: dict.nav?.today || "TODAY", path: `/${lang}`, icon: Calendar },
    { name: dict.nav?.rhythm || "RHYTHM", path: `/${lang}/check`, icon: Sparkles },
    { name: dict.nav?.log || "LOG", path: "LOG", icon: Plus }, // Special case
    { name: dict.nav?.me || "ME", path: `#profile`, icon: User },
  ];

  return (
    <>
      {/* PC Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white min-h-screen fixed left-0 top-0 border-r border-neutral/10 z-50">
        <div className="p-10 pb-6">
          <h1 className="text-3xl font-serif font-bold text-primary mb-10">For:M</h1>
          
          <div className="flex items-center space-x-4 mb-10">
            <div className="w-10 h-10 rounded-full bg-neutral/20 overflow-hidden flex-shrink-0">
               <img src="https://i.pravatar.cc/150?img=5" alt="Elena" className="w-full h-full object-cover" />
            </div>
            <div className="text-left overflow-hidden">
              <div className="text-xs text-neutral/70">{dict.nav?.welcomeBack || "Welcome back"}</div>
              <div className="text-xs font-bold text-primary truncate">{dict.nav?.rhythmSteady || "Your rhythm is steady"}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {PC_MENUS.map(menu => {
            const isActive = pathname === menu.path || (menu.path === `/${lang}/result` && pathname.startsWith(`/${lang}/result`));
            return (
              <button
                key={menu.name}
                onClick={() => menu.path.startsWith("/") && router.push(menu.path)}
                className={`w-full flex items-center space-x-4 px-10 py-4 transition-all relative ${
                  isActive 
                    ? "bg-[#F8F6F1] text-primary shadow-sm" 
                    : "text-neutral/70 hover:bg-neutral/5 hover:text-primary"
                }`}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />}
                <menu.icon className={`w-5 h-5 ${isActive ? "text-primary fill-primary" : "text-neutral/60"}`} />
                <span className={`text-sm ${isActive ? "font-bold" : "font-medium"}`}>{menu.name}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-6 mt-auto border-t border-neutral/10">
          <button onClick={() => router.push(`/${lang}/check`)} className="w-full bg-primary text-white py-3.5 rounded-md font-bold text-sm shadow-md hover:bg-opacity-90 transition-all mb-6 relative overflow-hidden">
             {dict.nav?.logActivity || "Log Activity"}
          </button>
          <div className="space-y-4 px-2">
             <button className="flex items-center space-x-4 text-xs font-bold text-neutral/70 hover:text-primary transition-colors focus:outline-none w-full">
               <HelpCircle className="w-4 h-4 fill-neutral/70 text-white" /><span className="flex-1 text-left">{dict.nav?.support || "Support"}</span>
             </button>
<button className="flex items-center space-x-4 text-xs font-bold text-neutral/70 hover:text-primary transition-colors focus:outline-none w-full mt-4 border-t border-neutral/10 pt-4">
               <LogOut className="w-4 h-4" /><span className="flex-1 text-left">{dict.nav?.logout || "Logout"}</span>
             </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral/10 pb-safe z-50 px-6 py-2 flex justify-between items-end h-[70px]">
        {MOBILE_MENUS.map(menu => {
          const isActive = pathname === menu.path;
          
          if (menu.name === dict.nav?.log || menu.name === "LOG") {
            return (
              <button
                key={menu.name}
                onClick={() => router.push(`/${lang}/check`)}
                className="relative -top-6 flex flex-col items-center justify-center transition-transform hover:scale-105 active:scale-95"
              >
                <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg border-4 border-[#F8F6F1]">
                  <menu.icon className="w-6 h-6" />
                </div>
                <span className="text-[9px] font-bold tracking-wider mt-1 text-neutral/70">{menu.name}</span>
              </button>
            )
          }

          return (
            <button
              key={menu.name}
              onClick={() => menu.path.startsWith("/") && router.push(menu.path)}
              className={`flex flex-col items-center p-2 mb-1 transition-all flex-1`}
            >
              <menu.icon className={`w-5 h-5 mb-1 stroke-[2.5] ${isActive ? "text-primary" : "text-neutral/40"}`} />
              <span className={`text-[9px] font-bold tracking-wider ${isActive ? "text-primary" : "text-neutral/50"}`}>{menu.name}</span>
            </button>
          )
        })}
      </nav>
    </>
  );
}
