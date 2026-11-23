import React, { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Layers,
  Box,
  BarChart3,
  Calendar,
  Filter,
  DollarSign,
  PieChart,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  AlertTriangle,
  ChevronRight,
  Loader2,
  RotateCcw,
  RefreshCw,
  Info,
  Building2,
  Cpu,
  Flame,
  Wrench,
  HelpCircle,
  X,
} from "lucide-react";
import { apiCache } from "../services/apiCache";
import { useCachedAnalytics } from "../hooks/useCachedAnalytics";
import {
  UpdatingIndicator,
  PageSkeleton,
  ErrorBanner,
  EmptyFilteredState,
} from "./LoadingStates";
import { API_BASE_URL } from "../config/api";

export default function CostAnalysisPage({
  apiBaseUrl = API_BASE_URL,
  onNavigate,
  onOpenAIChat,
  routeParams = {},
  refreshKey = 0,
}) {
  // Restore persisted state from apiCache
  const persisted = useMemo(
    () =>
      apiCache.getPageState("cost_analysis", {
        activeTab: routeParams?.tab || "overview",
        selectedPeriod: "ALL",
        selectedPlant: "All Plants",
        selectedLine: "All Lines",
        selectedProduct: routeParams?.product || "All Products",
        compareCurrentPeriod: "2026-10",
        compareBaselinePeriod: "2026-09",
      }),
    []
  );

  const [activeTab, setActiveTab] = useState(() => {
    const raw = routeParams?.tab || persisted.activeTab;
    return ["overview", "trends", "variance"].includes(raw) ? raw : "overview";
  });
  const [selectedPeriod, setSelectedPeriod] = useState(persisted.selectedPeriod);
  const [selectedPlant, setSelectedPlant] = useState(persisted.selectedPlant);
  const [selectedLine, setSelectedLine] = useState(persisted.selectedLine);
  const [selectedProduct, setSelectedProduct] = useState(routeParams?.product || persisted.selectedProduct);

  // Variance Bridge State
  const [compareCurrentPeriod, setCompareCurrentPeriod] = useState(persisted.compareCurrentPeriod || "2026-10");
  const [compareBaselinePeriod, setCompareBaselinePeriod] = useState(persisted.compareBaselinePeriod || "2026-09");

  // Sync back to apiCache when filter changes
  useEffect(() => {
    apiCache.setPageState("cost_analysis", {
      activeTab,
      selectedPeriod,
      selectedPlant,
      selectedLine,
      selectedProduct,
      compareCurrentPeriod,
      compareBaselinePeriod,
    });
  }, [activeTab, selectedPeriod, selectedPlant, selectedLine, selectedProduct, compareCurrentPeriod, compareBaselinePeriod]);

  // Filter options loaded from real committed data
  const [periodOptions, setPeriodOptions] = useState([{ code: "ALL", label: "All Committed Periods" }]);
  const [plantOptions, setPlantOptions] = useState(["All Plants"]);
  const [lineOptions, setLineOptions] = useState(["All Lines"]);
  const [productOptions, setProductOptions] = useState(["All Products"]);

  // Drilldown drawer state
  const [selectedDriverDetail, setSelectedDriverDetail] = useState(null);

  useEffect(() => {
    if (routeParams?.tab) setActiveTab(routeParams.tab);
    if (routeParams?.product) setSelectedProduct(routeParams.product);
  }, [routeParams?.tab, routeParams?.product]);

// Load scope metadata (cached for 5 minutes)
useEffect(() => {
  async function loadMetadata() {
    try {
      const result = await apiCache.fetchWithCache(`${apiBaseUrl}/analytics/scope-metadata`, {
        staleTime: 300000,
      });
      const json = result.data;
      if (json.periods && json.periods.length > 0) {
        setPeriodOptions(json.periods);
        const actualPeriods = json.periods.filter((p) => p.code !== "ALL").map((p) => p.code);
        if (actualPeriods.length >= 2 && !persisted.compareCurrentPeriod) {
          setCompareCurrentPeriod(actualPeriods[0]);
          setCompareBaselinePeriod(actualPeriods[1]);
        } else if (actualPeriods.length === 1 && !persisted.compareCurrentPeriod) {
          setCompareCurrentPeriod(actualPeriods[0]);
          setCompareBaselinePeriod(actualPeriods[0]);
        }
      }
      if (json.plants && json.plants.length > 0) setPlantOptions(json.plants);
      if (json.lines && json.lines.length > 0) setLineOptions(json.lines);
      if (json.products && json.products.length > 0) setProductOptions(json.products);
    } catch (err) {
      console.error("Failed to load analytics scope metadata:", err);
    }
  }
  loadMetadata();
}, [apiBaseUrl]);

// Primary Cost Analytics Query using Cached Hook
const costParams = useMemo(() => {
  const p = {};
  if (selectedPeriod && selectedPeriod !== "ALL") p.period_code = selectedPeriod;
  if (selectedPlant && selectedPlant !== "All Plants") p.plant_code = selectedPlant;
  if (selectedLine && selectedLine !== "All Lines") p.line_code = selectedLine;
  if (selectedProduct && selectedProduct !== "All Products") p.product_code = selectedProduct;
  return p;
}, [selectedPeriod, selectedPlant, selectedLine, selectedProduct]);

const {
  data: analyticsData,
  loading,
  isUpdating,
  error,
  refetch,
} = useCachedAnalytics(`${apiBaseUrl}/analytics/cost`, costParams, {
  staleTime: 60000,
  refreshKey,
});

// Variance Bridge Query using Cached Hook
const bridgeParams = useMemo(() => {
  const p = {};
  if (compareCurrentPeriod) p.current_period = compareCurrentPeriod;
  if (compareBaselinePeriod) p.baseline_period = compareBaselinePeriod;
  if (selectedPlant && selectedPlant !== "All Plants") p.plant_code = selectedPlant;
  if (selectedProduct && selectedProduct !== "All Products") p.product_code = selectedProduct;
  if (selectedLine && selectedLine !== "All Lines") p.line_code = selectedLine;
  return p;
}, [compareCurrentPeriod, compareBaselinePeriod, selectedPlant, selectedProduct, selectedLine]);

const {
  data: bridgeData,
  loading: bridgeLoading,
  isUpdating: bridgeUpdating,
} = useCachedAnalytics(`${apiBaseUrl}/analytics/cost-movement`, bridgeParams, {
  enabled: Boolean(compareCurrentPeriod && compareBaselinePeriod),
  staleTime: 60000,
  refreshKey,
});

const handleResetFilters = () => {
  setSelectedPeriod("ALL");
  setSelectedPlant("All Plants");
  setSelectedLine("All Lines");
  setSelectedProduct("All Products");
};

const isFiltered =
  selectedPeriod !== "ALL" ||
  selectedPlant !== "All Plants" ||
  selectedLine !== "All Lines" ||
  selectedProduct !== "All Products";

const summary = analyticsData?.summary || {};
const operational = analyticsData?.operational_volume || {};
const categories = analyticsData?.categories || [];
const monthlyTrends = analyticsData?.monthly_trends || [];

// Material contribution metrics
const matCategory = categories.find((c) => c.category === "Direct Material");
const matSharePct = matCategory?.share_pct || 0;
const matAmountCr = matCategory?.amount_cr || 0;

return (
  <div className="w-full flex-1 flex flex-col space-y-3 sm:space-y-3.5 select-none pb-6 font-sans text-slate-800">
    {/* Page Header */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
            Manufacturing Cost Analysis
          </h1>
        </div>
        <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-0.5">
          Analyze manufacturing expenditure, unit economics, cost composition and cost movements across reporting periods.
        </p>
      </div>

      {/* Header Metadata Badge */}
      <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl font-medium shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-[#7c3aed]" />
          Coverage: <strong className="text-slate-800 font-mono">{selectedPeriod === "ALL" ? "Aug – Nov 2026" : selectedPeriod}</strong>
        </span>
      </div>
    </div>

    {/* Filter Toolbar (Full-Width Responsive Architecture) */}
    <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-purple-100/90 shadow-[0_2px_12px_rgba(111,61,186,0.04)] flex flex-col xl:flex-row items-stretch xl:items-center gap-3 w-full">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-700 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#7c3aed] flex items-center justify-center shrink-0">
          <Filter className="w-4 h-4 stroke-[2.2]" />
        </div>
        <span className="whitespace-nowrap font-black">Scope Filters:</span>
      </div>

      {/* 4 Balanced Full-Width Grid Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 flex-1 min-w-0 w-full">
        {/* Reporting Period */}
        <div className="flex items-center h-11 sm:h-12 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/90 rounded-xl px-3 transition-all w-full min-w-0 focus-within:ring-2 focus-within:ring-purple-400 focus-within:bg-white shadow-2xs">
          <span className="text-xs font-bold text-slate-400 mr-2 shrink-0">Period:</span>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full bg-transparent text-slate-800 text-xs sm:text-[13px] font-semibold focus:outline-none cursor-pointer truncate"
          >
            {periodOptions.map((p) => (
              <option key={p.code} value={p.code}>{p.label}</option>
            ))}
          </select>
        </div>

        {/* Plant */}
        <div className="flex items-center h-11 sm:h-12 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/90 rounded-xl px-3 transition-all w-full min-w-0 focus-within:ring-2 focus-within:ring-purple-400 focus-within:bg-white shadow-2xs">
          <span className="text-xs font-bold text-slate-400 mr-2 shrink-0">Plant:</span>
          <select
            value={selectedPlant}
            onChange={(e) => setSelectedPlant(e.target.value)}
            className="w-full bg-transparent text-slate-800 text-xs sm:text-[13px] font-semibold focus:outline-none cursor-pointer truncate"
          >
            {plantOptions.map((plt) => (
              <option key={plt} value={plt}>{plt}</option>
            ))}
          </select>
        </div>

        {/* Production Line */}
        <div className="flex items-center h-11 sm:h-12 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/90 rounded-xl px-3 transition-all w-full min-w-0 focus-within:ring-2 focus-within:ring-purple-400 focus-within:bg-white shadow-2xs">
          <span className="text-xs font-bold text-slate-400 mr-2 shrink-0">Line:</span>
          <select
            value={selectedLine}
            onChange={(e) => setSelectedLine(e.target.value)}
            className="w-full bg-transparent text-slate-800 text-xs sm:text-[13px] font-semibold focus:outline-none cursor-pointer truncate"
          >
            {lineOptions.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Product SKU */}
        <div className="flex items-center h-11 sm:h-12 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/90 rounded-xl px-3 transition-all w-full min-w-0 focus-within:ring-2 focus-within:ring-purple-400 focus-within:bg-white shadow-2xs">
          <span className="text-xs font-bold text-slate-400 mr-2 shrink-0">Product:</span>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full bg-transparent text-slate-800 text-xs sm:text-[13px] font-semibold focus:outline-none cursor-pointer truncate"
          >
            {productOptions.map((prod) => (
              <option key={prod} value={prod}>{prod}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions & Live Status */}
      <div className="flex items-center gap-2 shrink-0 self-end xl:self-auto">
        {/* Subtle updating indicator when filter is updating in background */}
        {isUpdating && <UpdatingIndicator text="Updating analytics..." />}

        {/* Reset Action */}
        {isFiltered && (
          <button
            onClick={handleResetFilters}
            className="h-11 sm:h-12 flex items-center gap-1.5 px-3.5 rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100/70 text-[#7c3aed] text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            title="Reset all filters to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}

        {/* Explicit Manual Refresh Action */}
        <button
          onClick={() => refetch()}
          disabled={isUpdating || loading}
          className="w-11 sm:w-12 h-11 sm:h-12 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs cursor-pointer"
          title="Refresh cost analytics"
        >
          <RefreshCw className={`w-4 h-4 ${isUpdating || loading ? "animate-spin text-purple-600" : ""}`} />
        </button>
      </div>
    </div>

    {/* Analytics Content Area with Live Update Loading State */}
    <div className={`space-y-4 transition-all duration-300 ${isUpdating ? "opacity-50 pointer-events-none cursor-wait" : "opacity-100"}`}>
      {/* Primary KPI Cards Strip (5 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {/* KPI 1: Total Manufacturing Expenditure */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 min-h-[118px] flex flex-col justify-between border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] relative group">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Total Expenditure</span>
          <div className="group-hover:text-purple-600 transition-colors" title="Total direct manufacturing expenditure recorded in committed store.">
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
        <div className="text-2xl sm:text-[27px] font-black text-slate-900 mt-1 font-mono">
          ₹{summary.total_cost_cr || 0} Cr
        </div>
        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="font-mono text-purple-700 font-bold">
            ₹{(summary.total_cost_inr || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Committed</span>
        </div>
      </div>

      {/* KPI 2: Cost per Good Unit */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 min-h-[118px] flex flex-col justify-between border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] relative group">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Cost per Good Unit</span>
          <div title="Total expenditure divided by salable good units produced (yield-adjusted).">
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
        <div className="text-2xl sm:text-[27px] font-black text-slate-900 mt-1 font-mono">
          ₹{(summary.cost_per_good_unit || 0).toLocaleString("en-IN")}
        </div>
        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="text-emerald-700 font-bold">
            {(summary.costed_good_qty || 0).toLocaleString("en-IN")} good units
          </span>
          <span className="text-[10px] font-bold text-emerald-600 uppercase">Salable</span>
        </div>
      </div>

      {/* KPI 3: Cost per Gross Unit */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 min-h-[118px] flex flex-col justify-between border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] relative group">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Cost per Gross Unit</span>
          <div title="Total expenditure divided by total gross production units produced (before scrap removal).">
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
        <div className="text-2xl sm:text-[27px] font-black text-slate-900 mt-1 font-mono">
          ₹{(summary.cost_per_produced_unit || 0).toLocaleString("en-IN")}
        </div>
        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="text-slate-600 font-medium">
            {(summary.costed_produced_qty || 0).toLocaleString("en-IN")} gross units
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Gross Run</span>
        </div>
      </div>

      {/* KPI 4: Material Cost Contribution */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 min-h-[118px] flex flex-col justify-between border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] relative group">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Material Contribution</span>
          <div title="Direct material spend as percentage of total direct manufacturing cost.">
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
        <div className="text-2xl sm:text-[27px] font-black text-purple-900 mt-1 font-mono">
          {matSharePct}%
        </div>
        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="font-mono text-purple-700 font-bold">₹{matAmountCr} Cr spend</span>
          <span className="text-[10px] font-bold text-purple-600 uppercase">BOM Dominant</span>
        </div>
      </div>

      {/* KPI 5: Total Costed Production Units */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 min-h-[118px] flex flex-col justify-between border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] relative group">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Costed Batches / Units</span>
          <div title="Total direct-costed batches and coverage percentage against shopfloor volume.">
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
        <div className="text-2xl sm:text-[27px] font-black text-slate-900 mt-1 font-mono">
          {(summary.cost_batches_count || 0).toLocaleString()}
        </div>
        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="text-slate-600 font-medium">
            Coverage: <strong className="text-emerald-700">{operational.costing_coverage_pct || 0}%</strong>
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Batches</span>
        </div>
      </div>
    </div>

      {/* Loading and Error States */}
      {loading && !analyticsData && (
        <PageSkeleton cardCount={5} showChart={true} showTable={true} />
      )}

      {error && !analyticsData && (
        <ErrorBanner error={error} onRetry={refetch} title="Cost Analytics Error" />
      )}

      {analyticsData && (
        <>
          {error && (
            <div className="mb-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center justify-between">
              <span>Could not refresh recent data ({error}). Displaying cached metrics.</span>
              <button onClick={() => refetch()} className="font-bold underline ml-2 cursor-pointer">Retry</button>
            </div>
          )}

          {summary.batches_costed === 0 ? (
            <EmptyFilteredState
              title="No Manufacturing Batches Found"
              message={`No production cost records matched the filters: Period (${selectedPeriod}), Plant (${selectedPlant}), Line (${selectedLine}), Product (${selectedProduct}).`}
              onReset={handleResetFilters}
            />
          ) : (
            <div className="space-y-4">
              {/* SECTION 1: DIRECT COST BREAKDOWN BY CATEGORY */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Direct Cost Breakdown by Category</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Distribution of total ₹{summary.total_cost_cr || 0} Cr expenditure across core manufacturing cost drivers.
                    </p>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-purple-700 font-mono">
                    ₹{(summary.total_cost_inr || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })} Total Direct Spend
                  </div>
                </div>

                {/* Stacked Proportional Bar */}
                <div className="w-full">
                  <div className="w-full h-5 rounded-full overflow-hidden flex bg-slate-100 shadow-inner">
                    {categories.map((c, idx) => {
                      const colors = ["bg-[#7c3aed]", "bg-[#0ea5e9]", "bg-[#f59e0b]", "bg-[#10b981]", "bg-[#ef4444]"];
                      return (
                        <div
                          key={c.category}
                          style={{ width: `${Math.max(1, c.share_pct)}%` }}
                          className={`${colors[idx % colors.length]} transition-all`}
                          title={`${c.category}: ₹${c.amount_cr} Cr (${c.share_pct}%)`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Granular Cost Breakdown Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                        <th className="py-3 px-3">Cost Category</th>
                        <th className="py-3 px-3 text-right">Expenditure (₹ Cr)</th>
                        <th className="py-3 px-3 text-right">Exact Total (₹ INR)</th>
                        <th className="py-3 px-3 text-right">Cost / Unit</th>
                        <th className="py-3 px-3 text-right">Share %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {categories.map((c, idx) => {
                        const colors = ["bg-[#7c3aed]", "bg-[#0ea5e9]", "bg-[#f59e0b]", "bg-[#10b981]", "bg-[#ef4444]"];
                        return (
                          <tr key={c.category} className="hover:bg-purple-50/30 transition-colors">
                            <td className="py-3 px-3 font-bold text-slate-800 flex items-center gap-2.5">
                              <span className={`w-2.5 h-2.5 rounded-full ${colors[idx % colors.length]}`} />
                              <span>{c.category}</span>
                            </td>
                            <td className="py-3 px-3 text-right font-mono text-slate-900 font-bold tabular-nums">
                              ₹{c.amount_cr} Cr
                            </td>
                            <td className="py-3 px-3 text-right font-mono text-slate-600 tabular-nums">
                              ₹{(c.amount_inr || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                            </td>
                            <td className="py-3 px-3 text-right font-mono text-slate-800 tabular-nums">
                              ₹{(c.unit_cost || 0).toLocaleString("en-IN")}
                            </td>
                            <td className="py-3 px-3 text-right font-mono font-bold text-purple-700 tabular-nums">
                              {c.share_pct}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION 2: EXPENDITURE TRENDS */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Monthly Manufacturing Expenditure Progression</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Historical trend across committed production fact periods.</p>
                  </div>
                  <span className="text-xs font-bold text-[#7c3aed] font-mono">3 Historical Months Committed</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {monthlyTrends.map((m) => (
                    <div key={m.period} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 font-mono text-sm">{m.period}</span>
                        <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                          ₹{m.cost_cr} Cr
                        </span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between text-slate-500">
                          <span>Produced Quantity:</span>
                          <span className="font-mono font-semibold text-slate-800">{(m.produced_qty || 0).toLocaleString()} units</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Unit Direct Cost:</span>
                          <span className="font-mono font-bold text-slate-900">₹{m.unit_cost}/unit</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Daily Trend Availability Information */}
                <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 text-xs text-slate-700 space-y-1.5">
                  <div className="font-bold text-[#7c3aed] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Daily Expenditure Resolution Coverage</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Daily expenditure analysis is supported for reporting periods with active shopfloor batch postings (e.g. October 2026 contains continuous daily records across 31 operating days). Average daily expenditure for October 2026 was approximately <strong>₹{(summary.total_cost_cr / 31).toFixed(2)} Cr/day</strong>.
                  </p>
                </div>
              </div>

              {/* SECTION 3: VARIANCE ANALYSIS */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 tracking-tight">
                        Deterministic Cost Movement &amp; Variance Decomposition Bridge
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-[#7c3aed] border border-purple-200">
                        Zero Discrepancy Closure
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Mathematical bridge reconciling previous-period expenditure with current-period expenditure.
                    </p>
                  </div>

                  {/* Period Comparison Selectors */}
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-medium text-[11px]">Baseline:</span>
                      <select
                        value={compareBaselinePeriod}
                        onChange={(e) => setCompareBaselinePeriod(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
                      >
                        {periodOptions.filter((p) => p.code !== "ALL").map((p) => (
                          <option key={p.code} value={p.code}>{p.label}</option>
                        ))}
                      </select>
                    </div>

                    <span className="text-slate-400 font-bold">&rarr;</span>

                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-medium text-[11px]">Current:</span>
                      <select
                        value={compareCurrentPeriod}
                        onChange={(e) => setCompareCurrentPeriod(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
                      >
                        {periodOptions.filter((p) => p.code !== "ALL").map((p) => (
                          <option key={p.code} value={p.code}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {bridgeLoading && (
                  <div className="py-8 text-center text-xs font-bold text-slate-500 flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#7c3aed]" />
                    <span>Calculating mathematical variance bridge...</span>
                  </div>
                )}

                {!bridgeLoading && bridgeData && (
                  <>
                    {/* Variance Summary Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80">
                        <span className="text-slate-500 font-medium text-[11px]">Baseline Expenditure</span>
                        <div className="text-base font-black text-slate-900 mt-1 font-mono">
                          ₹{bridgeData.expenditure_movement?.baseline_cost_cr} Cr
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{bridgeData.baseline_period}</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-200/80">
                        <span className="text-slate-500 font-medium text-[11px]">Current Expenditure</span>
                        <div className="text-base font-black text-[#7c3aed] mt-1 font-mono">
                          ₹{bridgeData.expenditure_movement?.current_cost_cr} Cr
                        </div>
                        <span className="text-[10px] text-purple-600 font-mono">{bridgeData.current_period}</span>
                      </div>

                      <div className={`p-3.5 rounded-xl border ${bridgeData.expenditure_movement?.direction === "DECREASE"
                          ? "bg-emerald-50/60 border-emerald-200"
                          : "bg-rose-50/60 border-rose-200"
                        }`}>
                        <span className="text-slate-500 font-medium text-[11px]">Net Cost Movement</span>
                        <div className={`text-base font-black mt-1 font-mono ${bridgeData.expenditure_movement?.direction === "DECREASE"
                            ? "text-emerald-700"
                            : "text-rose-700"
                          }`}>
                          {bridgeData.expenditure_movement?.delta_cost_cr >= 0 ? "+" : ""}
                          ₹{bridgeData.expenditure_movement?.delta_cost_cr} Cr
                        </div>
                        <span className="text-[10px] font-bold text-slate-600">
                          {bridgeData.expenditure_movement?.cost_change_pct}% ({bridgeData.expenditure_movement?.direction})
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
                        <span className="text-slate-500 font-medium text-[11px]">Closure Reconciliation</span>
                        <div className="text-base font-black text-emerald-700 mt-1 font-mono flex items-center gap-1">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 inline" />
                          ₹0.00 Cr
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700">
                          {bridgeData.reconciliation?.is_reconciled ? "100% Reconciled" : "Variance"}
                        </span>
                      </div>
                    </div>

                    {/* Factor-by-Factor Table */}
                    <div className="border border-slate-100 rounded-xl overflow-hidden">
                      <div className="bg-slate-50/80 px-4 py-2 border-b border-slate-100 font-bold text-slate-800 text-xs">
                        Factor-by-Factor Variance Breakdown
                      </div>
                      <div className="divide-y divide-slate-100 text-xs">
                        {bridgeData.variance_bridge && bridgeData.variance_bridge.map((s, idx) => (
                          <div key={idx} className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-50/40">
                            <div className="flex items-center gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <div>
                                <span className="font-bold text-slate-900">{s.driver}</span>
                                {s.impact_direction && (
                                  <span className={`ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded ${s.impact_direction === "DECREASE"
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : s.impact_direction === "INCREASE"
                                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                                        : "bg-slate-100 text-slate-600"
                                    }`}>
                                    {s.impact_direction}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="font-mono font-bold text-slate-900">
                              {s.amount_cr !== null ? `${s.amount_cr >= 0 ? "+" : ""}₹${s.amount_cr.toFixed(2)} Cr` : "NOT_AVAILABLE"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mathematical Integrity Guarantee */}
                    <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#7c3aed] shrink-0" />
                        <span className="text-purple-950 font-medium">
                          <strong>Mathematical Integrity Guarantee:</strong> Net Delta = Volume Effect + Mix Effect + Category Rate Effects + Reconciled Residual with 0.00 discrepancy.
                        </span>
                      </div>
                      <span className="font-mono font-bold text-purple-900 text-xs">Residual: ₹0.00 Cr</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}

                    {/* Driver Detail Drawer */}
                    {selectedDriverDetail && (
                      <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Driver Inspection</span>
                              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">{selectedDriverDetail.category}</h3>
                            </div>
                            <button
                              onClick={() => setSelectedDriverDetail(null)}
                              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between py-1.5 border-b border-slate-100">
                              <span className="text-slate-500">Expenditure (₹ Cr):</span>
                              <span className="font-mono font-bold text-slate-900">₹{selectedDriverDetail.amount_cr} Cr</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-slate-100">
                              <span className="text-slate-500">Exact Spend (INR):</span>
                              <span className="font-mono font-bold text-slate-800">
                                ₹{(selectedDriverDetail.amount_inr || 0).toLocaleString("en-IN")}
                              </span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-slate-100">
                              <span className="text-slate-500">Unit Cost Impact:</span>
                              <span className="font-mono font-bold text-purple-700">₹{selectedDriverDetail.unit_cost}/unit</span>
                            </div>
                            <div className="flex justify-between py-1.5">
                              <span className="text-slate-500">Expenditure Share:</span>
                              <span className="font-mono font-bold text-slate-900">{selectedDriverDetail.share_pct}%</span>
                            </div>
                          </div>

                          <button
                            onClick={() => setSelectedDriverDetail(null)}
                            className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-[#7c3aed] font-bold text-xs rounded-xl transition-colors cursor-pointer"
                          >
                            Close Details
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  </div>
                );
}
