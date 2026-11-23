import React, { useState, useEffect, useMemo } from "react";
import {
  Activity,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Calendar,
  Layers,
  Box,
  BarChart3,
  ChevronRight,
  Filter,
  RefreshCw,
  Database,
  RotateCcw,
  Info,
  X,
  PieChart,
  Loader2,
} from "lucide-react";
import { apiCache } from "../services/apiCache";
import { useCachedAnalytics } from "../hooks/useCachedAnalytics";
import {
  UpdatingIndicator,
  PageSkeleton,
  ErrorBanner,
  EmptyFilteredState,
} from "./LoadingStates";

export default function ProductionQualityPage({
  apiBaseUrl = "/api",
  onNavigate,
  onOpenAIChat,
  routeParams = {},
  refreshKey = 0,
}) {
  // Restore persisted state from apiCache
  const persisted = useMemo(
    () =>
      apiCache.getPageState("production_quality", {
        activeTab: "production",
        selectedPeriod: routeParams?.period || "ALL",
        selectedPlant: routeParams?.plant || "All Plants",
      }),
    []
  );

  const [activeTab, setActiveTab] = useState(() => {
    const raw = routeParams?.tab || persisted.activeTab;
    if (raw === "quality" || raw === "defects" || raw === "rework") return "quality";
    return "production";
  });
  const [selectedPeriod, setSelectedPeriod] = useState(persisted.selectedPeriod);
  const [selectedPlant, setSelectedPlant] = useState(persisted.selectedPlant);

  // Sync state back to apiCache
  useEffect(() => {
    apiCache.setPageState("production_quality", {
      activeTab,
      selectedPeriod,
      selectedPlant,
    });
  }, [activeTab, selectedPeriod, selectedPlant]);

  // Options loaded from metadata
  const [periodOptions, setPeriodOptions] = useState([{ code: "ALL", label: "All Committed Periods" }]);
  const [plantOptions, setPlantOptions] = useState(["All Plants"]);

  // Line Drilldown Drawer
  const [selectedLineDetail, setSelectedLineDetail] = useState(null);

  // Load scope metadata (cached for 5 minutes)
  useEffect(() => {
    async function loadMetadata() {
      try {
        const result = await apiCache.fetchWithCache(`${apiBaseUrl}/analytics/scope-metadata`, {
          staleTime: 300000,
        });
        const json = result.data;
        if (json.periods && json.periods.length > 0) setPeriodOptions(json.periods);
        if (json.plants && json.plants.length > 0) setPlantOptions(json.plants);
      } catch (err) {
        console.error("Failed to load scope metadata:", err);
      }
    }
    loadMetadata();
  }, [apiBaseUrl]);

  // Query parameters for production quality
  const prodParams = useMemo(() => {
    const p = {};
    if (selectedPeriod && selectedPeriod !== "ALL") p.period_code = selectedPeriod;
    if (selectedPlant && selectedPlant !== "All Plants") p.plant_code = selectedPlant;
    return p;
  }, [selectedPeriod, selectedPlant]);

  // Load production quality analytics with cache and smooth updates
  const {
    data: productionData,
    loading: prodLoading,
    isUpdating,
    error,
    refetch,
  } = useCachedAnalytics(`${apiBaseUrl}/analytics/production-quality`, prodParams, {
    staleTime: 60000,
    refreshKey,
  });

  const handleResetFilters = () => {
    setSelectedPeriod("ALL");
    setSelectedPlant("All Plants");
  };

  // Computed aggregate KPIs from real line metrics
  const lineMetrics = productionData?.line_metrics || [];
  const defectBreakdown = productionData?.defect_breakdown || [];
  const reworkSummary = productionData?.rework_summary || {
    rework_quantity: 0,
    rework_hours: 0,
    total_rework_cost_inr: 0,
  };

  const totalPlanned = lineMetrics.reduce((acc, l) => acc + (l.planned_qty || 0), 0);
  const totalActual = lineMetrics.reduce((acc, l) => acc + (l.actual_qty || 0), 0);
  const totalGood = lineMetrics.reduce((acc, l) => acc + (l.good_qty || 0), 0);
  const totalReject = lineMetrics.reduce((acc, l) => acc + (l.reject_qty || 0), 0);
  const totalDowntime = lineMetrics.reduce((acc, l) => acc + (l.downtime_minutes || 0), 0);

  const aggregateYield = totalActual > 0 ? ((totalGood / totalActual) * 100).toFixed(2) : "0.00";
  const aggregateRejectRate = totalActual > 0 ? ((totalReject / totalActual) * 100).toFixed(2) : "0.00";

  // Total inspection volume from defect breakdown
  const totalInspectedDefects = defectBreakdown.reduce((acc, d) => acc + (d.count || 0), 0);

  const isFiltered = selectedPeriod !== "ALL" || selectedPlant !== "All Plants";

  return (
    <div className="w-full flex-1 flex flex-col space-y-4 select-none pb-8 font-sans text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
              Production &amp; Quality Intelligence
            </h1>
          </div>
          <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-0.5">
            Monitor production output, manufacturing yield, rejection patterns and quality performance.
          </p>
        </div>

        {/* Global Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="h-10 sm:h-11 bg-white border border-slate-200 text-slate-700 text-xs sm:text-[13px] font-semibold rounded-xl px-3 shadow-2xs focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
          >
            {periodOptions.map((p) => (
              <option key={p.code} value={p.code}>{p.label}</option>
            ))}
          </select>

          <select
            value={selectedPlant}
            onChange={(e) => setSelectedPlant(e.target.value)}
            className="h-10 sm:h-11 bg-white border border-slate-200 text-slate-700 text-xs sm:text-[13px] font-semibold rounded-xl px-3 shadow-2xs focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
          >
            {plantOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          {/* Background updating indicator */}
          {isUpdating && <UpdatingIndicator text="Updating telemetry..." />}

          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="h-10 sm:h-11 px-3 rounded-xl border border-purple-200 bg-purple-50/70 text-[#7c3aed] hover:bg-purple-100 transition-colors cursor-pointer flex items-center justify-center"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => refetch()}
            disabled={isUpdating || prodLoading}
            className="h-10 sm:h-11 w-10 sm:w-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs cursor-pointer flex items-center justify-center shrink-0"
            title="Refresh production & quality analytics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${(isUpdating || prodLoading) ? "animate-spin text-purple-600" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Production & Quality Analytics Body with Live Updating Loading State */}
      <div className={`space-y-4 transition-all duration-300 ${isUpdating ? "opacity-50 pointer-events-none cursor-wait" : "opacity-100"}`}>
        {/* KPI Cards Strip (5 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white rounded-2xl p-4 sm:p-5 min-h-[115px] border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Gross Production</span>
            <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
              {totalActual.toLocaleString()}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Target: {(totalPlanned || 0).toLocaleString()} units
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 min-h-[115px] border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Good Units Produced</span>
            <div className="text-2xl font-black text-emerald-700 mt-1 font-mono">
              {totalGood.toLocaleString()}
            </div>
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">
            Salable finished goods
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 min-h-[115px] border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Rejected Units</span>
            <div className="text-2xl font-black text-rose-700 mt-1 font-mono">
              {totalReject.toLocaleString()}
            </div>
          </div>
          <div className="text-[11px] text-rose-600 font-semibold mt-1">
            Total defect loss units
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 min-h-[115px] border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Yield Percentage</span>
            <div className="text-2xl font-black text-purple-900 mt-1 font-mono">
              {aggregateYield}%
            </div>
          </div>
          <div className="text-[11px] text-purple-700 font-bold mt-1">
            Good / Gross denominator
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 min-h-[115px] border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Rejection Rate</span>
            <div className="text-2xl font-black text-rose-900 mt-1 font-mono">
              {aggregateRejectRate}%
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Downtime: {Math.round(totalDowntime / 60)} hrs
          </div>
        </div>
      </div>

      {/* 2-Option Segmented Navigation Bar */}
      <div className="w-full bg-slate-100/75 p-1 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 w-full">
          <button
            onClick={() => setActiveTab("production")}
            className={`w-full h-10 sm:h-11 px-4 rounded-xl text-xs sm:text-[13.5px] font-bold transition-all cursor-pointer flex items-center justify-center text-center truncate ${
              activeTab === "production"
                ? "bg-[#7c3aed] text-white shadow-sm font-black"
                : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-white/70 font-semibold"
            }`}
          >
            Production Performance
          </button>
          <button
            onClick={() => setActiveTab("quality")}
            className={`w-full h-10 sm:h-11 px-4 rounded-xl text-xs sm:text-[13.5px] font-bold transition-all cursor-pointer flex items-center justify-center text-center truncate ${
              activeTab === "quality"
                ? "bg-[#7c3aed] text-white shadow-sm font-black"
                : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-white/70 font-semibold"
            }`}
          >
            Quality &amp; Defect Analysis
          </button>
        </div>
      </div>

      {prodLoading && !productionData && (
        <PageSkeleton cardCount={5} showChart={true} showTable={true} />
      )}

      {error && !productionData && (
        <ErrorBanner error={error} onRetry={refetch} title="Production Quality Analytics Error" />
      )}

      {productionData && (
        <>
          {error && (
            <div className="mb-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center justify-between">
              <span>Could not refresh recent data ({error}). Displaying cached metrics.</span>
              <button onClick={() => refetch()} className="font-bold underline ml-2 cursor-pointer">Retry</button>
            </div>
          )}

          {totalActual === 0 ? (
            <EmptyFilteredState
              title="No Production Runs Found"
              message={`No operational records matched the filter: Period (${selectedPeriod}), Plant (${selectedPlant}).`}
              onReset={handleResetFilters}
            />
          ) : (
            <>
          {/* OPTION 1: PRODUCTION PERFORMANCE */}
          {activeTab === "production" && (
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#7c3aed]" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase">
                    Production Performance by Line
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Click line for operational drill-down</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-3">Line Code</th>
                      <th className="py-3 px-3">Plant</th>
                      <th className="py-3 px-3 text-right">Target Qty</th>
                      <th className="py-3 px-3 text-right">Gross Output</th>
                      <th className="py-3 px-3 text-right">Good Qty</th>
                      <th className="py-3 px-3 text-right">Rejected Qty</th>
                      <th className="py-3 px-3 text-right">Yield %</th>
                      <th className="py-3 px-3 text-right">Rejection %</th>
                      <th className="py-3 pl-3 text-right">Downtime (min)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium">
                    {lineMetrics.map((l, idx) => {
                      const rejRate = l.actual_qty > 0 ? ((l.reject_qty / l.actual_qty) * 100).toFixed(2) : "0.00";
                      return (
                        <tr
                          key={`${l.plant || ''}-${l.line || ''}-${idx}`}
                          onClick={() => setSelectedLineDetail(l)}
                          className="hover:bg-purple-50/40 cursor-pointer transition-colors"
                        >
                          <td className="py-3.5 px-3 font-mono font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#7c3aed]" />
                            <span>{l.line}</span>
                          </td>
                          <td className="py-3.5 px-3 text-slate-600 font-semibold">{l.plant}</td>
                          <td className="py-3.5 px-3 text-right font-mono text-slate-500">
                            {(l.planned_qty || 0).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900">
                            {(l.actual_qty || 0).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono text-emerald-700 font-semibold">
                            {(l.good_qty || 0).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono text-rose-600 font-semibold">
                            {(l.reject_qty || 0).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-bold text-[#7c3aed]">
                            {l.yield_pct}%
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono text-rose-700 font-bold">
                            {rejRate}%
                          </td>
                          <td className="py-3.5 pl-3 text-right font-mono text-slate-600">
                            {(l.downtime_minutes || 0).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* OPTION 2: QUALITY & DEFECT ANALYSIS (Combines Rework Loss Governance + Pareto Defects) */}
          {activeTab === "quality" && (
            <div className="space-y-4">
              {/* Shopfloor Rework Analysis & Loss Governance */}
              <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#7c3aed]" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Shopfloor Rework Analysis &amp; Loss Governance
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-[#7c3aed] font-mono">
                    {reworkSummary.rework_quantity > 0 ? "Verified Rework Events" : "No Rework Events"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs text-slate-500 font-semibold">Total Rework Quantity</span>
                    <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
                      {reworkSummary.rework_quantity.toLocaleString()} units
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs text-slate-500 font-semibold">Rework Labor Hours</span>
                    <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
                      {reworkSummary.rework_hours.toLocaleString()} hrs
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
                    <span className="text-xs text-slate-500 font-semibold">Rework Expenditure</span>
                    <div className="text-2xl font-black text-purple-900 mt-1 font-mono">
                      ₹{(reworkSummary.total_rework_cost_inr || 0).toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Defect Pareto Distribution */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] space-y-4">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#7c3aed]" />
                    <h3 className="text-sm font-bold text-slate-900 uppercase">
                      Quality Inspection Defect Distribution (Pareto Ranking)
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {totalInspectedDefects.toLocaleString()} serialized defect records analyzed
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {defectBreakdown.map((d, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px] flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="font-mono font-black text-slate-900 text-sm">{d.defect_code}</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          {d.severity || "STANDARD"}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Defect Count:</span>
                          <span className="font-mono font-bold text-rose-700">{d.count.toLocaleString()} occurrences</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Defect Share %:</span>
                          <span className="font-mono font-bold text-slate-900">{d.share_pct}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Disposition:</span>
                          <span className="font-mono text-purple-700 font-semibold">{d.disposition || "SCRAP"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
            </>
          )}
        </>
      )}

      {/* Line Drilldown Modal */}
      {selectedLineDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Line Telemetry</span>
                <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                  {selectedLineDetail.line} ({selectedLineDetail.plant})
                </h3>
              </div>
              <button
                onClick={() => setSelectedLineDetail(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Gross Output:</span>
                <span className="font-mono font-bold text-slate-900">
                  {(selectedLineDetail.actual_qty || 0).toLocaleString()} units
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Good Units:</span>
                <span className="font-mono font-bold text-emerald-700">
                  {(selectedLineDetail.good_qty || 0).toLocaleString()} units
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Line Yield:</span>
                <span className="font-mono font-bold text-[#7c3aed]">{selectedLineDetail.yield_pct}%</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Downtime:</span>
                <span className="font-mono font-bold text-slate-800">
                  {(selectedLineDetail.downtime_minutes || 0).toLocaleString()} minutes
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedLineDetail(null)}
              className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-[#7c3aed] font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Close Telemetry
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
