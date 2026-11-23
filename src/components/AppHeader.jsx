import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  User,
  Settings,
  Moon,
  Sun,
  Menu,
  Database,
  ShieldCheck,
} from "lucide-react";

export default function AppHeader({
  theme,
  toggleTheme,
  onNavigate,
  onOpenAIChat,
  setMobileOpen,
  userName = "Praneeth",
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileContainerRef = useRef(null);

  // Click outside to dismiss profile dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileContainerRef.current && !profileContainerRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-[64px] sm:h-[68px] px-5 sm:px-7 w-full flex items-center justify-between border-b border-slate-100 bg-white shrink-0 z-40 select-none shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* =========================================================================
          GROUP A: BRAND LOGO (Left)
          ========================================================================= */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileOpen && setMobileOpen(true)}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
          title="Open Navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* GWC DATA.AI Official Brand Logo */}
        <div
          className="flex items-center cursor-pointer hover:opacity-90 transition-opacity py-1"
          onClick={() => onNavigate && onNavigate("overview")}
          title="GWC DATA.AI - Solution Matters"
        >
          <img
            src="/gwc-logo.png"
            alt="GWC DATA.AI - Solution Matters"
            className="h-9 sm:h-10 lg:h-[42px] w-auto max-w-[190px] sm:max-w-[230px] object-contain drop-shadow-2xs"
          />
        </div>
      </div>

      {/* =========================================================================
          GROUP B: AI CHAT BUTTON & PROFILE AVATAR (Right)
          ========================================================================= */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
        {/* Single Prominent AI Chat Button */}
        <button
          onClick={() => onOpenAIChat && onOpenAIChat()}
          className="bg-gradient-to-r from-[#6f3dba] to-[#8b5cf6] hover:from-[#5e299e] hover:to-[#7a48e0] text-white shadow-md shadow-purple-600/20 hover:shadow-lg rounded-full px-4 py-2 flex items-center gap-2 cursor-pointer transition-all active:scale-98 select-none"
          title="Open Manufacturing AI Assistant"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-4 h-4 stroke-[2]" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 ring-1 ring-[#6f3dba]" />
          </div>
          <span className="text-xs font-bold tracking-tight hidden sm:inline">
            AI Chat
          </span>
        </button>

        {/* Profile Avatar with Polished Dropdown */}
        <div ref={profileContainerRef} className="relative">
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="w-9 h-9 rounded-full bg-[#6f3dba] text-white font-bold text-xs sm:text-[13px] flex items-center justify-center shadow-sm select-none cursor-pointer hover:ring-2 hover:ring-purple-300 transition-all"
            title={`${userName} (Lead Manufacturing Cost Controller)`}
          >
            {userName.charAt(0)}
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100 text-xs">
              {/* User Header */}
              <div className="px-3 py-2">
                <div className="font-bold text-slate-900 leading-tight">
                  {userName}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Lead Cost Controller
                </div>
                <div className="text-[9px] text-[#6f3dba] font-mono mt-0.5">
                  neondb_owner
                </div>
              </div>

              {/* Menu Actions */}
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onNavigate && onNavigate("overview");
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-slate-700 hover:bg-purple-50 hover:text-[#6f3dba] flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    toggleTheme && toggleTheme();
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-slate-700 hover:bg-purple-50 hover:text-[#6f3dba] flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {theme === "dark" ? (
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                    ) : (
                      <Moon className="w-3.5 h-3.5 text-slate-600" />
                    )}
                    <span>Theme</span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400">
                    {theme}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onNavigate && onNavigate("connectors");
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-slate-700 hover:bg-purple-50 hover:text-[#6f3dba] flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Data Connectors</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onNavigate && onNavigate("settings");
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-slate-700 hover:bg-purple-50 hover:text-[#6f3dba] flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Settings &amp; Info</span>
                </button>
              </div>

              {/* System Audit Line */}
              <div className="px-3 py-2 text-[10px] text-slate-400">
                <div className="flex items-center gap-1 font-semibold text-slate-600">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Neon PostgreSQL Active</span>
                </div>
                <p className="mt-0.5">5,000 Promoted Batches</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
