import React, { useState } from "react";
import {
  BarChart3,
  Coins,
  Flame,
  Activity,
  Box,
  Cpu,
  Zap,
  Users,
  ShoppingCart,
  Package,
  Gauge,
  Layers,
  Scan,
  CheckCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { MANUFACTURING_CAPABILITIES } from "./homeData";

const CAP_ICONS = {
  BarChart3,
  Coins,
  Flame,
  Activity,
  Box,
  Cpu,
  Zap,
  Users,
  ShoppingCart,
  Package,
  Gauge,
  Layers,
  Scan,
};

const CATEGORIES = ["All", "Cost & Finance", "Operations", "Quality & Yield", "Supply Chain"];

export default function ManufacturingCapabilities() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredCapabilities =
    selectedCategory === "All"
      ? MANUFACTURING_CAPABILITIES
      : MANUFACTURING_CAPABILITIES.filter((c) => c.category === selectedCategory);

  return (
    <div className="w-full bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-[#6f3dba] dark:text-purple-300 flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
            <Sparkles className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-[#1f2f59] dark:text-slate-100 tracking-tight">
              Manufacturing Intelligence Capabilities
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none mt-0.5">
              Foundational investigation dimensions across smartphone lifecycle
            </p>
          </div>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
            13 CAPABILITIES
          </span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2 shrink-0 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold tracking-tight whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-[#6f3dba] text-white shadow-2xs"
                : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 13 Capabilities Compact List / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-1 max-h-[360px] overflow-y-auto pr-1">
        {filteredCapabilities.map((cap) => {
          const Icon = CAP_ICONS[cap.icon] || BarChart3;
          const isImplemented = cap.status === "Implemented";

          return (
            <div
              key={cap.id}
              className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/70 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-purple-200 transition-all flex flex-col justify-between gap-1 shadow-2xs group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-white dark:bg-slate-700/70 border border-slate-200/80 dark:border-slate-600/60 flex items-center justify-center shrink-0 text-[#6f3dba] dark:text-purple-300 shadow-2xs">
                    <Icon className="w-3.5 h-3.5 stroke-[2]" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug truncate">
                    {cap.name}
                  </h4>
                </div>

                {/* Status Badge */}
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 border ${
                    isImplemented
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                      : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                  }`}
                >
                  {cap.status}
                </span>
              </div>

              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">
                {cap.desc}
              </p>

              <div className="flex items-center justify-between text-[9px] text-slate-400 dark:text-slate-400 pt-0.5 border-t border-slate-100 dark:border-slate-700/40 font-mono">
                <span>{cap.category}</span>
                <span className="text-slate-400 group-hover:text-purple-500 transition-colors">
                  {isImplemented ? "Neon Verified" : "Connector Planned"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          <span>Implemented (10)</span>
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block ml-1" />
          <span>Partial Telemetry (3)</span>
        </span>
        <span className="font-mono text-[9px] text-slate-400">Zero Mock Data Policy</span>
      </div>
    </div>
  );
}
