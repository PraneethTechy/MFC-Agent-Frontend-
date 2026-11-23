import React from "react";
import { Clock, AlertTriangle, Flame, Layers, ShieldAlert, CheckCircle2 } from "lucide-react";
import { PROBLEMS_SOLVED } from "./pipelineStagesData";

const ICON_MAP = {
  Clock,
  AlertTriangle,
  Flame,
  Layers,
  ShieldAlert,
};

export default function ProblemsSolvedCard() {
  return (
    <div className="w-full bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 sm:p-5 shadow-2xs flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 flex items-center justify-center font-bold text-xs">
            <Flame className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-brand-navy dark:text-slate-100">
              Problems Solved by Agents
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">
              Autonomous manufacturing cost & variance detection
            </p>
          </div>
        </div>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900/60">
          5 CORE PROBLEMS
        </span>
      </div>

      {/* 5 Problem Alert Bars */}
      <div className="flex flex-col gap-2">
        {PROBLEMS_SOLVED.map((item) => {
          const Icon = ICON_MAP[item.icon] || AlertTriangle;
          return (
            <div
              key={item.id}
              className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 transition-all hover:scale-[1.01] ${item.color}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xs font-black tracking-wider shrink-0 font-mono">
                  {item.id}
                </span>
                <span className="text-xs font-black uppercase tracking-wider shrink-0">
                  {item.tag}
                </span>
                <span className="text-slate-400 dark:text-slate-500 font-light hidden sm:inline">•</span>
                <p className="text-[11px] font-medium leading-snug truncate">
                  {item.desc}
                </p>
              </div>

              <div className="shrink-0">
                <Icon className="w-3.5 h-3.5 opacity-80" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
