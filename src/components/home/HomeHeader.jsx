import React from "react";
import { Smartphone, Factory, Network } from "lucide-react";

export default function HomeHeader() {
  return (
    <div className="w-full bg-gradient-to-r from-purple-50/70 via-white to-purple-50/40 dark:from-slate-800/80 dark:via-slate-850 dark:to-purple-950/30 rounded-2xl border border-slate-200/90 dark:border-slate-800 px-5 py-4 sm:px-6 sm:py-5 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden select-none">
      {/* Background ambient decorative glow */}
      <div className="absolute -top-12 left-1/3 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-1/4 w-48 h-48 bg-indigo-400/10 rounded-full blur-2xl pointer-events-none" />

      {/* Left: Innovation Usecase Branding & Purpose */}
      <div className="flex flex-col items-start gap-1 z-10 max-w-2xl">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold bg-purple-100 dark:bg-purple-950/70 text-[#6f3dba] dark:text-purple-300 tracking-wider uppercase border border-purple-200/80 dark:border-purple-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6f3dba] dark:bg-purple-400" />
            GWC DATA.AI • AI Innovation Showcase
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#1f2f59] dark:text-slate-100 tracking-tight leading-tight">
          Manufacturing Cost RCA — Architecture & Intelligence
        </h1>
      </div>

      {/* Right: 3 Metric Cards */}
      <div className="flex items-center gap-3 z-10 w-full sm:w-auto justify-end">
        {/* Metric 1: 4 Products */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-4 py-2.5 shadow-2xs">
          <div className="w-9 h-9 rounded-lg bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0 border border-pink-100 dark:border-pink-900/40">
            <Smartphone className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black text-slate-800 dark:text-slate-100 leading-tight">
              4
            </span>
            <span className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
              Products
            </span>
          </div>
        </div>

        {/* Metric 2: 2 Plants */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-4 py-2.5 shadow-2xs">
          <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-[#6f3dba] dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-100 dark:border-purple-900/40">
            <Factory className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black text-slate-800 dark:text-slate-100 leading-tight">
              2
            </span>
            <span className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
              Plants
            </span>
          </div>
        </div>

        {/* Metric 3: 12 Production Lines */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-4 py-2.5 shadow-2xs">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/40">
            <Network className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black text-slate-800 dark:text-slate-100 leading-tight">
              12
            </span>
            <span className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
              Production Lines
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
