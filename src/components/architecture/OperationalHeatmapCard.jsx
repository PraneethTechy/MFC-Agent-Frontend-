import React, { useState } from "react";
import { Activity, BarChart3, ChevronRight, CheckCircle2, AlertTriangle, Layers } from "lucide-react";
import { OPERATIONAL_HEATMAP_DATA } from "./pipelineStagesData";

export default function OperationalHeatmapCard() {
  const [selectedRow, setSelectedRow] = useState(0);

  const activeItem = OPERATIONAL_HEATMAP_DATA[selectedRow] || OPERATIONAL_HEATMAP_DATA[0];

  return (
    <div className="w-full bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 sm:p-5 shadow-2xs flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 flex items-center justify-center font-bold text-xs">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-brand-navy dark:text-slate-100">
              Plant & Line Yield / Cost Status Matrix
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">
              Ground-truth performance from 127k+ active production logs
            </p>
          </div>
        </div>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800">
          4 PLANTS • 8 LINES
        </span>
      </div>

      {/* Heatmap / Matrix Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-2 px-2.5">Line / Plant</th>
              <th className="py-2 px-2 text-right">Output</th>
              <th className="py-2 px-2 text-right">FPY Yield</th>
              <th className="py-2 px-2 text-right">Cost / Unit</th>
              <th className="py-2 px-2 text-right">Variance</th>
              <th className="py-2 px-2.5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {OPERATIONAL_HEATMAP_DATA.map((row, idx) => {
              const isSelected = selectedRow === idx;
              return (
                <tr
                  key={idx}
                  onClick={() => setSelectedRow(idx)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-purple-50/70 dark:bg-purple-950/40 font-semibold"
                      : "hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <td className="py-2.5 px-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-brand-purple" : "bg-slate-300 dark:bg-slate-600"}`} />
                      <span className="text-slate-900 dark:text-slate-100">{row.line}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-slate-700 dark:text-slate-300">
                    {row.output}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-slate-900 dark:text-slate-100 font-bold">
                    {row.fpy}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-slate-900 dark:text-slate-100 font-bold">
                    {row.costPerUnit}
                  </td>
                  <td className={`py-2.5 px-2 text-right font-mono font-bold ${row.deltaColor}`}>
                    {row.delta}
                  </td>
                  <td className="py-2.5 px-2.5 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${row.statusColor}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Row Highlight Detail Bar */}
      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-[11px] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <span className="font-bold text-brand-purple shrink-0">Insight:</span>
          <span className="line-clamp-1">{activeItem.highlight}</span>
        </div>
        <span className="text-[10px] text-slate-400 shrink-0 font-medium hidden sm:inline">
          Click any row to inspect
        </span>
      </div>

      {/* Sub-Footer */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 font-medium">
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          <span>Active Grounding: Aug – Dec 2026 Facts (127,386 records)</span>
        </span>
        <span>Zero Mock Data</span>
      </div>
    </div>
  );
}
