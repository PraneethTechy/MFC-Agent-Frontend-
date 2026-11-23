import React from "react";
import { Loader2, AlertCircle, RefreshCw, Layers, RotateCcw } from "lucide-react";

/**
 * Polished, non-intrusive badge showing background data update in progress
 * while maintaining existing content on screen without flickering.
 */
export function UpdatingIndicator({ text = "Updating analytics..." }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50/90 border border-purple-200 text-purple-700 text-xs font-semibold shadow-2xs transition-all animate-pulse select-none">
      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7c3aed]" />
      <span>{text}</span>
    </div>
  );
}

/**
 * Shimmering skeleton for cold initial loads
 */
export function PageSkeleton({ cardCount = 4, showChart = true, showTable = true }) {
  return (
    <div className="w-full space-y-4 animate-pulse select-none">
      {/* Metric Cards Skeleton Strip */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(cardCount, 5)} gap-3.5`}>
        {Array.from({ length: cardCount }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-2.5">
            <div className="h-3 bg-slate-200 rounded w-2/3" />
            <div className="h-7 bg-slate-200 rounded w-1/2" />
            <div className="h-2.5 bg-slate-100 rounded w-4/5" />
          </div>
        ))}
      </div>

      {/* Main Chart / Content Skeleton */}
      {showChart && (
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-3 bg-slate-100 rounded w-1/6" />
          </div>
          <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
          </div>
        </div>
      )}

      {/* Table Skeleton */}
      {showTable && (
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs space-y-3">
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="space-y-2 pt-2">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="h-10 bg-slate-50 rounded-xl w-full" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Shimmering rows for tables
 */
export function TableSkeleton({ rows = 5, cols = 6 }) {
  return (
    <div className="w-full space-y-2 animate-pulse">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="grid grid-cols-6 gap-3 py-2.5 px-3 bg-slate-50/70 rounded-xl">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-3.5 bg-slate-200 rounded w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Resilient Error Alert Banner with Retry Action
 */
export function ErrorBanner({ error, onRetry, title = "Failed to load analytics" }) {
  return (
    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start justify-between gap-3 shadow-2xs">
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider">{title}</h4>
          <p className="text-xs text-rose-700 mt-0.5">{error}</p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-700 hover:bg-rose-100/50 font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}

/**
 * Polished Empty State for filter combinations returning zero records
 */
export function EmptyFilteredState({
  title = "No Manufacturing Records Found",
  message = "No records matched the selected period and scope filter combination.",
  onReset = null,
}) {
  return (
    <div className="py-14 px-4 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col items-center justify-center space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#7c3aed] flex items-center justify-center border border-purple-100">
        <Layers className="w-6 h-6" />
      </div>
      <div className="max-w-md">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{message}</p>
      </div>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 text-xs font-bold transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters to Default</span>
        </button>
      )}
    </div>
  );
}
