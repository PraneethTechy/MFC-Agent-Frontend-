import React from "react";
import {
  Coins,
  Settings,
  Award,
  Clock,
  Zap,
  FlaskConical,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { MANUFACTURING_PROBLEMS } from "./homeData";

const ICON_COMPONENTS = {
  Coins: Coins,
  Settings: Settings,
  Award: Award,
  Clock: Clock,
  Zap: Zap,
  FlaskConical: FlaskConical,
};

export default function ManufacturingProblemsPanel({
  selectedProblemId,
  onSelectProblem,
}) {
  return (
    <div className="w-full h-full bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-2.5 sm:p-3 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6.5 h-6.5 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-[#6f3dba] dark:text-purple-300 flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
            <Sparkles className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
          <h3 className="text-xs sm:text-[13px] font-extrabold text-[#1f2f59] dark:text-slate-100 tracking-tight leading-tight">
            Manufacturing Problems
          </h3>
        </div>
      </div>

      {/* 6 Category Rows - Compact, Meaningful Width */}
      <div className="flex flex-col gap-1.5 my-1.5 flex-1 justify-evenly">
        {MANUFACTURING_PROBLEMS.map((item) => {
          const IconComp = ICON_COMPONENTS[item.icon] || Coins;
          const isSelected = selectedProblemId === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectProblem && onSelectProblem(item)}
              className={`w-full text-left px-2 py-1.5 rounded-lg border transition-all duration-150 flex items-center justify-between gap-2 cursor-pointer group ${
                isSelected
                  ? "bg-purple-50/90 dark:bg-purple-950/60 border-2 border-[#6f3dba] dark:border-purple-500 shadow-xs ring-1 ring-purple-500/30"
                  : "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/70 hover:bg-white dark:hover:bg-slate-800 hover:border-purple-300 hover:shadow-2xs"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div
                  className={`w-6 h-6 rounded-md ${item.bgIcon} ${item.iconColor} flex items-center justify-center shrink-0 border border-black/5 dark:border-white/5 transition-transform group-hover:scale-105`}
                >
                  <IconComp className="w-3 h-3 stroke-[2.2]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4
                    className={`text-[10.5px] font-bold leading-tight ${
                      isSelected
                        ? "text-[#6f3dba] dark:text-purple-300 font-extrabold"
                        : "text-slate-800 dark:text-slate-100 group-hover:text-purple-700 dark:group-hover:text-purple-300"
                    }`}
                  >
                    {item.title}
                  </h4>
                </div>
              </div>

              <ChevronRight
                className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                  isSelected
                    ? "text-[#6f3dba] dark:text-purple-400 translate-x-0.5 stroke-[2.5]"
                    : "text-slate-400 dark:text-slate-500 group-hover:text-purple-600 group-hover:translate-x-0.5 stroke-[2]"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
