import React, { useState } from "react";
import { Layers, LayoutGrid, Search } from "lucide-react";

export default function HomeHeader({ onNavigate }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  const toggleDarkMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 select-none shrink-0">
      {/* Row 1: Breadcrumbs, Global Search, Dark Mode Toggle & Admin Badge */}
      <div className="w-full flex items-center justify-between gap-4 py-0.5 border-b border-slate-100 dark:border-slate-800">
        {/* Left: Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="font-semibold text-slate-500 dark:text-slate-400">
            Manufacturing Intelligence
          </span>
          <span className="text-slate-400 dark:text-slate-600">/</span>
          <span className="font-bold text-slate-900 dark:text-slate-100">
            Home
          </span>
        </div>

        {/* Center/Right Controls */}
        <div className="flex items-center gap-4">
          {/* Search Box */}
          <div className="relative hidden md:flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none stroke-[2]" />
            <input
              type="text"
              readOnly
              placeholder="Search products, plants, production lines..."
              className="w-[280px] lg:w-[350px] pl-9 pr-3 py-1.5 rounded-lg border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none shadow-2xs cursor-pointer"
              onClick={() => onNavigate && onNavigate("investigations")}
            />
          </div>

          {/* Dark Mode Switch */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleDarkMode}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isDarkMode ? "bg-[#6f3dba]" : "bg-slate-300 dark:bg-slate-600"
                }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${isDarkMode ? "translate-x-4" : "translate-x-0"
                  }`}
              />
            </button>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Dark Mode
            </span>
          </div>

          {/* ADMIN Badge */}
          <div className="px-3 py-1 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-[#6f3dba] dark:text-purple-300 font-extrabold text-[11px] tracking-wider uppercase border border-purple-200/60 dark:border-purple-800/60">
            ADMIN
          </div>
        </div>
      </div>

      {/* Row 2: Secondary Command Tabs + Database Grounding & Production Data Status */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-0.5">
        {/* Left: Two Tabs */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 h-[42px] rounded-[8px] text-[15px] font-bold text-white bg-[#5B2BD6] shadow-xs cursor-default transition-all"
          >
            <Layers className="w-4 h-4 text-purple-200" />
            <span>Application Architecture & Operations Command</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate && onNavigate("overview")}
            className="inline-flex items-center gap-2 px-4 h-[42px] rounded-[8px] text-[15px] font-semibold text-[#1E1B3A] bg-white border border-[#E3E6F3] hover:bg-slate-50 shadow-[0_2px_8px_rgba(40,40,100,0.06)] transition-all cursor-pointer"
          >
            <LayoutGrid className="w-4 h-4 text-slate-500" />
            <span>Executive Overview & Analytics</span>
          </button>
        </div>

        {/* Right: Database Grounding & Production Data Status */}
        <div className="flex items-center gap-4 text-[14px] w-full sm:w-auto justify-end">
          <span className="text-[#1E1B3A] font-medium">
            Database Grounding:{" "}
            <strong className="text-[#1E3FBF] font-bold">
              Neon PostgreSQL 16 Star Schema
            </strong>
          </span>
          <span className="inline-flex items-center gap-1.5 font-bold text-[#16A34A] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
            Production Data
          </span>
        </div>
      </div>
    </div>
  );
}
