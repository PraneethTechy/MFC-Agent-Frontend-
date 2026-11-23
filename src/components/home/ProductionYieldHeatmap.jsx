import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Calendar,
  ChevronDown,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

export default function ProductionYieldHeatmap() {
  const [selectedPeriod, setSelectedPeriod] = useState("3_months");
  const [heatmapData, setHeatmapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const PERIOD_OPTIONS = [
    { value: "3_months", label: "Last 3 Months" },
    { value: "6_months", label: "Last 6 Months" },
    { value: "12_months", label: "Last 12 Months" },
    { value: "all", label: "All Available History" },
  ];

  const fetchHeatmapData = async (period) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/home/production-yield-heatmap?period=${period}`);
      if (res.ok) {
        const json = await res.json();
        setHeatmapData(json);
      } else {
        console.error("Failed to load production yield heatmap data:", res.statusText);
      }
    } catch (err) {
      console.error("Error fetching heatmap data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHeatmapData(selectedPeriod);
  }, [selectedPeriod]);

  const getYieldBadgeClass = (yieldPct) => {
    if (!yieldPct || yieldPct === 0) {
      return "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400";
    }
    if (yieldPct < 97.5) {
      return "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900/60 font-bold";
    }
    if (yieldPct < 98.5) {
      return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900/60 font-bold";
    }
    return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900/60 font-bold";
  };

  const currentPeriodLabel =
    PERIOD_OPTIONS.find((p) => p.value === selectedPeriod)?.label || "Last 3 Months";

  return (
    <div className="w-full h-full bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between select-none">
      {/* Header with Title & Period Selector */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-[#6f3dba] dark:text-purple-300 flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
            <BarChart3 className="w-4 h-4 stroke-[2.2]" />
          </div>
          <h3 className="text-xs sm:text-sm font-extrabold text-[#1f2f59] dark:text-slate-100 tracking-tight">
            Production Progress & Yield Heatmap
          </h3>
        </div>

        {/* Period Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
          >
            <span>{currentPeriodLabel}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 stroke-[2.5]" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg py-1 z-30">
              {PERIOD_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSelectedPeriod(opt.value);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                    selectedPeriod === opt.value
                      ? "bg-purple-50 text-[#6f3dba] dark:bg-purple-950/60 dark:text-purple-300 font-bold"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750"
                  }`}
                >
                  <span>{opt.label}</span>
                  {selectedPeriod === opt.value && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6f3dba] dark:text-purple-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Heatmap Table */}
      <div className="my-auto py-1 flex-1 overflow-x-auto flex flex-col justify-center">
        {isLoading ? (
          <div className="flex items-center justify-center py-8 gap-2 text-slate-400 text-xs font-medium">
            <RefreshCw className="w-4 h-4 animate-spin text-[#6f3dba]" />
            <span>Loading committed production telemetry...</span>
          </div>
        ) : heatmapData && heatmapData.rows ? (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200/90 dark:border-slate-700/80 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                <th className="pb-2 pl-1 font-bold text-slate-600 dark:text-slate-300">
                  Plant / Line
                </th>
                {heatmapData.month_labels.map((mLabel, idx) => (
                  <th key={idx} colSpan={2} className="pb-2 px-1 text-center font-bold">
                    <span className="text-[10.5px] text-slate-700 dark:text-slate-200 font-bold">{mLabel}</span>
                    <div className="grid grid-cols-2 gap-1 text-[8.5px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                      <span className="text-right pr-1">Prod</span>
                      <span className="text-center">Yield</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {heatmapData.rows.map((row, rIdx) => {
                const dotColor =
                  rIdx === 0
                    ? "bg-emerald-500"
                    : rIdx === 1
                    ? "bg-blue-500"
                    : rIdx === 2
                    ? "bg-emerald-500"
                    : "bg-amber-500";

                return (
                  <tr key={rIdx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 pl-1 pr-2 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${dotColor} shrink-0`} />
                      <span className="text-[11px] whitespace-nowrap">{row.label}</span>
                    </td>

                    {heatmapData.month_keys.map((mKey, mIdx) => {
                      const mData = row.months[mKey] || { prod: 0, yield_pct: 0 };
                      const prodFormatted = mData.prod > 0 ? mData.prod.toLocaleString() : "—";
                      const yieldFormatted = mData.yield_pct > 0 ? `${mData.yield_pct}%` : "—";
                      const badgeClass = getYieldBadgeClass(mData.yield_pct);

                      return (
                        <React.Fragment key={mIdx}>
                          <td className="py-2.5 px-1 text-right font-mono text-[10.5px] text-slate-700 dark:text-slate-300">
                            {prodFormatted}
                          </td>
                          <td className="py-2.5 px-1 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-md text-[10px] border font-mono tracking-tight shadow-2xs ${badgeClass}`}
                            >
                              {yieldFormatted}
                            </span>
                          </td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-xs text-slate-400">
            No committed production records available for selected period.
          </div>
        )}
      </div>

      {/* Target & Status Legend Footer */}
      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs gap-2 shrink-0">
        {/* Next Target Indicator */}
        <div className="flex items-center gap-1.5 bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-900/50 px-2.5 py-1 rounded-lg">
          <Calendar className="w-3.5 h-3.5 text-[#6f3dba] dark:text-purple-400 stroke-[2.2] shrink-0" />
          <span className="text-[10px] font-bold text-[#1f2f59] dark:text-purple-200 whitespace-nowrap">
            Next Target: {heatmapData?.target?.target_month || "Oct 2026"} ≥{" "}
            {heatmapData?.target?.target_yield || 98.5}% Yield (All Lines)
          </span>
        </div>

        {/* Threshold Status Legend matching Reference Screenshot */}
        <div className="flex items-center gap-2 text-[9.5px] text-slate-500 dark:text-slate-400 font-medium">
          <span className="text-slate-400 text-[9.5px] font-bold">Yield:</span>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-100 border border-rose-300 dark:bg-rose-950/60 dark:border-rose-800" />
            <span className="text-slate-700 dark:text-slate-300 text-[9.5px] font-mono font-semibold">
              &lt; 97.5%
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-100 border border-amber-300 dark:bg-amber-950/60 dark:border-amber-800" />
            <span className="text-slate-700 dark:text-slate-300 text-[9.5px] font-mono font-semibold">
              97.5 - 98.4%
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-100 border border-emerald-300 dark:bg-emerald-950/60 dark:border-emerald-800" />
            <span className="text-slate-700 dark:text-slate-300 text-[9.5px] font-mono font-semibold">
              ≥ 98.5%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
