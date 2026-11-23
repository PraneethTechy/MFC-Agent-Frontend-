import React from "react";
import {
  Search,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
} from "lucide-react";
import { LAYERS, STATUS_FILTERS } from "./architectureData";

export default function ArchitectureToolbar({
  searchQuery,
  onSearchChange,
  selectedLayer,
  onLayerChange,
  selectedStatus,
  onStatusChange,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onResetSelection,
  hasSelection,
  componentCounts,
}) {
  return (
    <div className="w-full bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-3.5 sm:p-4 shadow-2xs flex flex-col gap-3">
      {/* Row 1: Search + Status Filter Legend + Zoom + Clear Focus */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search component, table (e.g. line_cost_batches), or analytical tool..."
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-md"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Pills + Zoom + Clear */}
        <div className="flex items-center gap-2 flex-wrap justify-between lg:justify-end">
          {/* Status Quick Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            {STATUS_FILTERS.map((sf) => {
              const isSelected = selectedStatus === sf.id;
              const count = componentCounts?.[sf.id] ?? 0;
              return (
                <button
                  key={sf.id}
                  onClick={() => onStatusChange(sf.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-white dark:bg-[#26334d] text-brand-navy dark:text-white shadow-2xs font-bold"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  {sf.id === "implemented" && <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />}
                  {sf.id === "partial" && <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />}
                  {sf.id === "planned" && <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />}
                  <span>{sf.label}</span>
                  <span className="text-[10px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={onZoomOut}
              disabled={zoomLevel <= 70}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer hover:bg-white dark:hover:bg-slate-700 transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onZoomReset}
              className="px-2 py-1 rounded-lg text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              title="Reset Zoom (100%)"
            >
              {zoomLevel}%
            </button>
            <button
              onClick={onZoomIn}
              disabled={zoomLevel >= 130}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer hover:bg-white dark:hover:bg-slate-700 transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Clear Focus */}
          {hasSelection && (
            <button
              onClick={onResetSelection}
              className="px-3 py-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 hover:bg-purple-100/80 dark:bg-purple-950/50 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              title="Reset component selection"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Focus</span>
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Pipeline Stage Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 dark:border-slate-800 pt-2.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Focus Stage:
        </span>
        {LAYERS.map((layer) => {
          const isSelected = selectedLayer === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => onLayerChange(layer.id)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0 border ${
                isSelected
                  ? "bg-brand-purple text-white border-brand-purple shadow-xs font-bold ring-2 ring-purple-500/20"
                  : "bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {layer.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
