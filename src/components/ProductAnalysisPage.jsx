import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Box,
  TrendingUp,
  TrendingDown,
  Layers,
  Activity,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Calendar,
  X,
  ArrowRight,
  Filter,
  Loader2,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  Search,
  CheckSquare,
  Square,
  BarChart3,
  Check,
  Info,
  Scale,
  Tag,
  Gem,
  Factory,
  CheckCircle2,
  XCircle,
  Percent,
  Clock,
  SlidersHorizontal,
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

export default function ProductAnalysisPage({
  apiBaseUrl = API_BASE_URL,
  onNavigate,
  onOpenAIChat,
  routeParams = {},
  refreshKey = 0,
}) {
  // Restore persisted state from apiCache
  const persisted = useMemo(
    () =>
      apiCache.getPageState("product_analysis", {
        selectedPeriod: "ALL",
        selectedPlant: "All Plants",
        searchQuery: routeParams?.product || "",
        selectedSkus: [],
        productPeriods: {},
      }),
    []
  );

  const [selectedPeriod, setSelectedPeriod] = useState(persisted.selectedPeriod);
  const [selectedPlant, setSelectedPlant] = useState(persisted.selectedPlant);
  const [searchQuery, setSearchQuery] = useState(routeParams?.product || persisted.searchQuery);
  const [selectedSkus, setSelectedSkus] = useState(persisted.selectedSkus || []);

  // Dynamic period filter presets derived from committed Global Store records
  const [periodPresets, setPeriodPresets] = useState([]);
  const [minAvailableDate, setMinAvailableDate] = useState("");
  const [maxAvailableDate, setMaxAvailableDate] = useState("");

  // Independent reporting period filter per selected product:
  // { [sku]: { presetId, startDate, endDate, displayRange, isCustom, customStart, customEnd, customError } }
  const [productPeriods, setProductPeriods] = useState(() => {
    return persisted.productPeriods || {};
  });

  // Sync state back to apiCache
  useEffect(() => {
    apiCache.setPageState("product_analysis", {
      selectedPeriod,
      selectedPlant,
      searchQuery,
      selectedSkus,
      productPeriods,
    });
  }, [selectedPeriod, selectedPlant, searchQuery, selectedSkus, productPeriods]);

  // Options loaded from metadata
  const [periodOptions, setPeriodOptions] = useState([{ code: "ALL", label: "All Committed Periods" }]);
  const [plantOptions, setPlantOptions] = useState(["All Plants"]);

  // Sorting
  const [sortField, setSortField] = useState("cost_cr");
  const [sortAsc, setSortAsc] = useState(false);

  // Detail Drilldown Modal
  const [drilldownProduct, setDrilldownProduct] = useState(null);
  const [productComponents, setProductComponents] = useState([]);
  const [componentsLoading, setComponentsLoading] = useState(false);

  useEffect(() => {
    if (routeParams?.product) {
      setSearchQuery(routeParams.product);
    }
  }, [routeParams?.product]);

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
        console.error("Failed to load analytics metadata:", err);
      }
    }
    loadMetadata();
  }, [apiBaseUrl]);

  // Load dynamic period options and bounds derived strictly from committed DB records
  useEffect(() => {
    async function loadPeriodOptions() {
      try {
        const res = await fetch(`${apiBaseUrl}/analytics/product-period-options`);
        if (res.ok) {
          const json = await res.json();
          if (json.presets && json.presets.length > 0) {
            setPeriodPresets(json.presets);
          }
          if (json.min_date) setMinAvailableDate(json.min_date);
          if (json.max_date) setMaxAvailableDate(json.max_date);
        }
      } catch (err) {
        console.warn("Failed to load product comparison period presets:", err);
      }
    }
    loadPeriodOptions();
  }, [apiBaseUrl]);

  // Default preset (All Available History or first preset)
  const defaultPreset = useMemo(() => {
    if (periodPresets.length > 0) return periodPresets[0];
    return {
      id: "ALL_HISTORY",
      name: "All Available History",
      start_date: "2026-08-01",
      end_date: "2026-10-31",
      display_range: "Aug 01 – Oct 31, 2026",
    };
  }, [periodPresets]);

  // Ensure every selected product has its independent period initialized
  useEffect(() => {
    if (selectedSkus.length === 0 || !defaultPreset) return;
    setProductPeriods((prev) => {
      let next = { ...prev };
      let changed = false;
      selectedSkus.forEach((sku) => {
        if (!next[sku]) {
          next[sku] = {
            presetId: defaultPreset.id,
            startDate: defaultPreset.start_date,
            endDate: defaultPreset.end_date,
            displayRange: defaultPreset.display_range,
            isCustom: false,
            customStart: defaultPreset.start_date,
            customEnd: defaultPreset.end_date,
            customError: null,
          };
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [selectedSkus, defaultPreset]);

  // Query parameters for products ranking table
  const productParams = useMemo(() => {
    const p = {};
    if (selectedPeriod && selectedPeriod !== "ALL") p.period_code = selectedPeriod;
    if (selectedPlant && selectedPlant !== "All Plants") p.plant_code = selectedPlant;
    return p;
  }, [selectedPeriod, selectedPlant]);

  // Load products data with cache and non-flicker updating
  const {
    data: productApiData,
    loading: prodLoading,
    isUpdating,
    error,
    refetch,
  } = useCachedAnalytics(`${apiBaseUrl}/analytics/products`, productParams, {
    staleTime: 60000,
    refreshKey,
  });

  const products = useMemo(() => productApiData?.products || [], [productApiData]);

  // Load product intelligence with cache
  const { data: intelligenceData } = useCachedAnalytics(
    `${apiBaseUrl}/analytics/product-intelligence`,
    productParams,
    { staleTime: 60000, refreshKey }
  );

  // Initialize default two products for comparison on first arrival (if none persisted)
  const initializedSelectionRef = useRef(false);
  useEffect(() => {
    if (!initializedSelectionRef.current && products.length >= 2) {
      initializedSelectionRef.current = true;
      if (!persisted.selectedSkus || persisted.selectedSkus.length === 0) {
        setSelectedSkus([products[0].code, products[1].code]);
      }
    }
  }, [products, persisted.selectedSkus]);

  // Fetch BOM components for drilldown product
  useEffect(() => {
    if (!drilldownProduct) {
      setProductComponents([]);
      return;
    }
    async function fetchBOM() {
      try {
        setComponentsLoading(true);
        const res = await fetch(`${apiBaseUrl}/analytics/components?product_code=${drilldownProduct.code}`);
        if (res.ok) {
          const json = await res.json();
          setProductComponents(json.components || []);
        }
      } catch (err) {
        console.error("Failed to fetch product BOM components:", err);
      } finally {
        setComponentsLoading(false);
      }
    }
    fetchBOM();
  }, [apiBaseUrl, drilldownProduct]);

  // Handle Sort in Ranking Table
  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Filtered & Sorted products list for ranking table
  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.code.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          (p.segment && p.segment.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === "string") {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? (valA || 0) - (valB || 0) : (valB || 0) - (valA || 0);
    });

    return list;
  }, [products, searchQuery, sortField, sortAsc]);

  // Aggregated KPIs
  const totalProductsCount = products.length;
  const totalExpenditureCr = products.reduce((acc, p) => acc + (p.cost_cr || 0), 0);
  const totalProductionGross = products.reduce((acc, p) => acc + (p.produced_qty || 0), 0);
  const totalGoodUnits = products.reduce((acc, p) => acc + (p.good_qty || 0), 0);
  const avgCostPerGood = totalGoodUnits > 0 ? (totalExpenditureCr * 1e7) / totalGoodUnits : 0;

  // Toggle selection for comparison
  const toggleSkuComparison = (code) => {
    if (selectedSkus.includes(code)) {
      setSelectedSkus(selectedSkus.filter((c) => c !== code));
    } else {
      setSelectedSkus([...selectedSkus, code]);
    }
  };

  // Independent period handlers
  const handleProductPresetChange = (productCode, presetId) => {
    if (presetId === "CUSTOM") {
      setProductPeriods((prev) => ({
        ...prev,
        [productCode]: {
          ...(prev[productCode] || {}),
          presetId: "CUSTOM",
          isCustom: true,
          customStart: prev[productCode]?.startDate || minAvailableDate || "2026-08-01",
          customEnd: prev[productCode]?.endDate || maxAvailableDate || "2026-10-31",
          customError: null,
        },
      }));
      return;
    }

    const preset = periodPresets.find((p) => p.id === presetId);
    if (!preset) return;

    setProductPeriods((prev) => ({
      ...prev,
      [productCode]: {
        presetId: preset.id,
        startDate: preset.start_date,
        endDate: preset.end_date,
        displayRange: preset.display_range,
        isCustom: false,
        customStart: preset.start_date,
        customEnd: preset.end_date,
        customError: null,
      },
    }));
  };

  const handleCustomDateChange = (productCode, field, value) => {
    setProductPeriods((prev) => {
      const current = prev[productCode] || {};
      const newStart = field === "start" ? value : current.customStart;
      const newEnd = field === "end" ? value : current.customEnd;

      let error = null;
      if (newStart && newEnd && newStart > newEnd) {
        error = "Start date must be on or before end date";
      }

      const isValid = newStart && newEnd && newStart <= newEnd;
      return {
        ...prev,
        [productCode]: {
          ...current,
          presetId: "CUSTOM",
          isCustom: true,
          customStart: newStart,
          customEnd: newEnd,
          customError: error,
          startDate: isValid ? newStart : current.startDate,
          endDate: isValid ? newEnd : current.endDate,
          displayRange: isValid
            ? `${newStart} – ${newEnd}`
            : current.displayRange,
        },
      };
    });
  };

  // Real-time comparison metrics fetched strictly from committed Global Store records in Neon
  const [comparisonResults, setComparisonResults] = useState({});
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [comparisonMeta, setComparisonMeta] = useState({
    periodsDiffer: false,
    coverageNote: null,
    stats: null,
  });

  useEffect(() => {
    if (selectedSkus.length === 0) {
      setComparisonResults({});
      setComparisonMeta({ periodsDiffer: false, coverageNote: null, stats: null });
      return;
    }

    let isMounted = true;
    async function fetchComparison() {
      try {
        setComparisonLoading(true);
        const payload = {
          products: selectedSkus.map((sku) => {
            const pState = productPeriods[sku];
            return {
              product_code: sku,
              start_date: pState?.startDate || defaultPreset?.start_date || "2026-08-01",
              end_date: pState?.endDate || defaultPreset?.end_date || "2026-10-31",
              period_preset_id: pState?.presetId || "ALL_HISTORY",
            };
          }),
        };

        const res = await fetch(`${apiBaseUrl}/analytics/compare-products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const json = await res.json();
          if (!isMounted) return;
          const map = {};
          (json.products || []).forEach((p) => {
            map[p.product_code] = p;
          });
          setComparisonResults(map);
          setComparisonMeta({
            periodsDiffer: Boolean(json.periods_differ),
            coverageNote: json.coverage_note,
            stats: json.stats,
          });
        }
      } catch (err) {
        console.error("Failed to fetch product comparison data:", err);
      } finally {
        if (isMounted) setComparisonLoading(false);
      }
    }

    fetchComparison();
    return () => {
      isMounted = false;
    };
  }, [selectedSkus, productPeriods, apiBaseUrl, defaultPreset]);

  // Combined product objects for comparison table
  const comparisonProducts = useMemo(() => {
    return selectedSkus.map((code) => {
      const base = products.find((p) => p.code === code) || { code, name: code };
      const comp = comparisonResults[code];
      const periodState = productPeriods[code];

      if (comp) {
        return {
          ...base,
          ...comp,
          periodState,
        };
      }
      return {
        ...base,
        cost_cr: base.cost_cr || 0,
        produced_qty: base.produced_qty || 0,
        good_qty: base.good_qty || 0,
        yield_pct: base.yield_pct || 0,
        cost_per_produced_unit: base.cost_per_produced_unit || 0,
        cost_per_good_unit: base.cost_per_good_unit || 0,
        periodState,
      };
    });
  }, [selectedSkus, products, comparisonResults, productPeriods]);

  const PRODUCT_DOT_COLORS = [
    "bg-[#7c3aed]",
    "bg-[#0ea5e9]",
    "bg-[#f59e0b]",
    "bg-[#10b981]",
    "bg-[#ec4899]",
    "bg-[#8b5cf6]",
  ];

  // Dynamic comparison stats (min/max highlights)
  const comparisonStats = useMemo(() => {
    if (comparisonMeta.stats) return comparisonMeta.stats;
    if (comparisonProducts.length < 2) return null;

    const goodCosts = comparisonProducts.map((p) => p.cost_per_good_unit || 0);
    const grossCosts = comparisonProducts.map((p) => p.cost_per_produced_unit || 0);
    const rejectQtys = comparisonProducts.map(
      (p) => Math.max(0, (p.produced_qty || 0) - (p.good_qty || 0))
    );
    const yields = comparisonProducts.map((p) => Number(p.yield_pct) || 0);

    return {
      minGoodCost: Math.min(...goodCosts),
      maxGoodCost: Math.max(...goodCosts),
      minGrossCost: Math.min(...grossCosts),
      maxGrossCost: Math.max(...grossCosts),
      minReject: Math.min(...rejectQtys),
      maxReject: Math.max(...rejectQtys),
      minYield: Math.min(...yields),
      maxYield: Math.max(...yields),
    };
  }, [comparisonMeta.stats, comparisonProducts]);

  // Integration with AI Cost Investigation flow
  const handleInvestigateCostDifferences = () => {
    if (comparisonProducts.length < 2) return;

    const skuDetails = comparisonProducts
      .map((p) => {
        const pState = productPeriods[p.code];
        const range =
          p.display_range ||
          pState?.displayRange ||
          (pState?.startDate && pState?.endDate
            ? `${pState.startDate} to ${pState.endDate}`
            : "All History");
        const costStr = `₹${(p.cost_cr || 0).toFixed(2)} Cr`;
        const unitCost = `₹${(p.cost_per_good_unit || 0).toLocaleString("en-IN")}/good unit`;
        const dailySpend = p.daily_cost_cr ? `₹${p.daily_cost_cr.toFixed(4)} Cr/day` : "N/A";
        const dailyOut = p.daily_output_units ? `${Math.round(p.daily_output_units).toLocaleString()} units/day` : "N/A";

        return `• ${p.code}: Period [${range}] | Total Spend: ${costStr} | Daily Spend: ${dailySpend} | Unit Cost: ${unitCost} | Factory Yield: ${p.yield_pct}% | Daily Output: ${dailyOut}`;
      })
      .join("\n");

    const skuNames = comparisonProducts.map((p) => p.code).join(" vs ");
    const title = `Cost & Yield Variance Investigation: ${skuNames}`;
    const question = `Investigate manufacturing unit cost variance, BOM discrepancies, and quality yield differences between ${skuNames} across their selected reporting periods:\n\n${skuDetails}\n\nIdentify the primary cost contributors, line assembly differences, and actionable recommendations to align unit economics.`;

    if (onOpenAIChat) {
      onOpenAIChat(question);
    }
    if (onNavigate) {
      onNavigate("investigation", {
        title,
        question,
        description: question,
        problem_category: "Cost per good unit increase",
        product: comparisonProducts[0]?.code || "All Products",
      });
    }
  };

  const handleResetFilters = () => {
    setSelectedPeriod("ALL");
    setSelectedPlant("All Plants");
    setSearchQuery("");
  };

  const isFiltered = selectedPeriod !== "ALL" || selectedPlant !== "All Plants" || searchQuery.trim() !== "";

  return (
    <div className="w-full flex-1 flex flex-col space-y-4 select-none pb-8 font-sans text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
              Product Performance Analysis
            </h1>
          </div>
          <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-0.5">
            Compare product-level manufacturing costs, output, unit economics and quality performance.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
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
            {plantOptions.map((plt) => (
              <option key={plt} value={plt}>{plt}</option>
            ))}
          </select>

          {/* Background updating indicator */}
          {isUpdating && <UpdatingIndicator text="Updating products..." />}

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
            title="Refresh product data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${(isUpdating || prodLoading) ? "animate-spin text-purple-600" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Product Analytics Body with Live Updating Loading State */}
      <div className={`space-y-4 transition-all duration-300 ${isUpdating ? "opacity-50 pointer-events-none cursor-wait" : "opacity-100"}`}>
        {/* KPI Overview Strip (4 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-white rounded-2xl p-4 sm:p-5 min-h-[115px] border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Products Analyzed</span>
              <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
                {totalProductsCount} SKUs
              </div>
            </div>
            <div className="text-[11px] text-purple-700 font-semibold mt-1">
              Active committed smartphone lines
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 min-h-[115px] border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Total Portfolio Expenditure</span>
              <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
                ₹{totalExpenditureCr.toFixed(2)} Cr
              </div>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-1">
              Committed direct spend
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 min-h-[115px] border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Total Production Output</span>
              <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
                {totalProductionGross.toLocaleString()}
              </div>
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">
              {totalGoodUnits.toLocaleString()} salable good units
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 min-h-[115px] border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Average Cost per Good Unit</span>
              <div className="text-2xl font-black text-purple-900 mt-1 font-mono">
                ₹{Math.round(avgCostPerGood).toLocaleString("en-IN")}
              </div>
            </div>
            <div className="text-[11px] text-slate-500 font-semibold mt-1">
              Portfolio weighted average
            </div>
          </div>
        </div>

        {prodLoading && products.length === 0 && (
          <PageSkeleton cardCount={4} showChart={true} showTable={true} />
        )}

        {error && products.length === 0 && (
          <ErrorBanner error={error} onRetry={refetch} title="Product Analytics Error" />
        )}

        {products.length === 0 && !prodLoading && !error && (
          <EmptyFilteredState
            title="No Product Records Found"
            message={`No products matched the filter: Period (${selectedPeriod}), Plant (${selectedPlant}).`}
            onReset={handleResetFilters}
          />
        )}

        {products.length > 0 && (
          <>
            {error && (
              <div className="mb-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center justify-between">
                <span>Could not refresh recent data ({error}). Displaying cached metrics.</span>
                <button onClick={() => refetch()} className="font-bold underline ml-2 cursor-pointer">Retry</button>
              </div>
            )}

            {/* 1. Product Performance Ranking Table (First) */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-[#7c3aed]" />
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase">
                    Product Performance Ranking
                  </h3>
                  {selectedSkus.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-[#7c3aed] border border-purple-200">
                      <span>{selectedSkus.length}</span>
                      <span>selected for comparison</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {selectedSkus.length > 0 ? (
                    <button
                      onClick={() => setSelectedSkus([])}
                      className="text-[11px] text-purple-700 hover:text-purple-900 font-bold underline cursor-pointer"
                    >
                      Clear Selection
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">
                      Check boxes to select products for comparison below · Click row to inspect BOM
                    </span>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-3 w-8">Compare</th>
                      <th
                        className="py-3 pr-3 cursor-pointer hover:text-slate-700"
                        onClick={() => handleSort("code")}
                      >
                        Product SKU {sortField === "code" ? (sortAsc ? "▲" : "▼") : ""}
                      </th>
                      <th
                        className="py-3 px-3 text-right cursor-pointer hover:text-slate-700"
                        onClick={() => handleSort("cost_cr")}
                      >
                        Expenditure (₹ Cr) {sortField === "cost_cr" ? (sortAsc ? "▲" : "▼") : ""}
                      </th>
                      <th
                        className="py-3 px-3 text-right cursor-pointer hover:text-slate-700"
                        onClick={() => handleSort("produced_qty")}
                      >
                        Gross Prod {sortField === "produced_qty" ? (sortAsc ? "▲" : "▼") : ""}
                      </th>
                      <th
                        className="py-3 px-3 text-right cursor-pointer hover:text-slate-700"
                        onClick={() => handleSort("good_qty")}
                      >
                        Good Prod {sortField === "good_qty" ? (sortAsc ? "▲" : "▼") : ""}
                      </th>
                      <th className="py-3 px-3 text-right">Rejected Qty</th>
                      <th
                        className="py-3 px-3 text-right cursor-pointer hover:text-slate-700"
                        onClick={() => handleSort("cost_per_produced_unit")}
                      >
                        Cost / Gross Unit {sortField === "cost_per_produced_unit" ? (sortAsc ? "▲" : "▼") : ""}
                      </th>
                      <th
                        className="py-3 px-3 text-right cursor-pointer hover:text-slate-700"
                        onClick={() => handleSort("cost_per_good_unit")}
                      >
                        Cost / Good Unit {sortField === "cost_per_good_unit" ? (sortAsc ? "▲" : "▼") : ""}
                      </th>
                      <th
                        className="py-3 px-3 text-right cursor-pointer hover:text-slate-700"
                        onClick={() => handleSort("yield_pct")}
                      >
                        Yield % {sortField === "yield_pct" ? (sortAsc ? "▲" : "▼") : ""}
                      </th>
                      <th className="py-3 pl-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium">
                    {filteredProducts.map((p) => {
                      const isSelected = selectedSkus.includes(p.code);
                      const rejectQty = Math.max(0, (p.produced_qty || 0) - (p.good_qty || 0));
                      const intellProd = intelligenceData?.products?.find((ip) => ip.product_code === p.code);
                      const anomalies = intellProd?.anomalies || [];

                      return (
                        <tr
                          key={p.code}
                          onClick={() => setDrilldownProduct(p)}
                          className="cursor-pointer hover:bg-purple-50/40 transition-colors"
                        >
                          <td
                            className="py-3.5 px-3"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSkuComparison(p.code);
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                            />
                          </td>
                          <td className="py-3.5 pr-3 font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#7c3aed]" />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span>{p.code}</span>
                                {anomalies.map((anom, i) => (
                                  <span
                                    key={i}
                                    title={anom.description}
                                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200"
                                  >
                                    <AlertTriangle className="w-2.5 h-2.5" />
                                    {anom.type === "ELEVATED_REJECTION_RATE" ? "High Reject" : "Cost Anomaly"}
                                  </span>
                                ))}
                              </div>
                              <div className="text-[10px] text-slate-400 font-normal">{p.name}</div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-black text-slate-900">
                            ₹{p.cost_cr} Cr
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono text-slate-600">
                            {(p.produced_qty || 0).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono text-emerald-700 font-semibold">
                            {(p.good_qty || 0).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono text-rose-600 font-semibold">
                            {rejectQty.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono text-slate-700">
                            ₹{(p.cost_per_produced_unit || 0).toLocaleString("en-IN")}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-bold text-[#7c3aed]">
                            ₹{(p.cost_per_good_unit || 0).toLocaleString("en-IN")}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900">
                            {p.yield_pct}%
                          </td>
                          <td className="py-3.5 pl-3 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDrilldownProduct(p);
                              }}
                              className="text-[11px] font-bold text-[#7c3aed] hover:underline inline-flex items-center gap-1 cursor-pointer"
                            >
                              <span>Inspect</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. Compare Products Section (Independent Reporting Period Filters Per Product) */}
            {comparisonProducts.length >= 1 ? (
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] space-y-4">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7c3aed] border border-purple-200/60 flex items-center justify-center shrink-0">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-slate-900 tracking-tight leading-tight">
                          Compare Products
                        </h3>
                        {comparisonLoading && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7c3aed] bg-purple-50 px-2 py-0.5 rounded-full">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Updating...</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Compare manufacturing economics with independent reporting periods per product.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-[#7c3aed] border border-purple-200/70">
                      {comparisonProducts.length} product{comparisonProducts.length === 1 ? "" : "s"} selected
                    </span>
                    <button
                      onClick={() => setSelectedSkus([])}
                      className="h-9 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Clear Selection</span>
                    </button>
                    <button
                      onClick={handleInvestigateCostDifferences}
                      disabled={comparisonProducts.length < 2}
                      className={`h-9 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors ${
                        comparisonProducts.length >= 2
                          ? "bg-[#7c3aed] hover:bg-[#6d28d9] text-white cursor-pointer"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                      title={
                        comparisonProducts.length < 2
                          ? "Select at least 2 products to investigate cost differences"
                          : "Launch AI Investigation comparing these products and periods"
                      }
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>Investigate Cost Differences</span>
                    </button>
                  </div>
                </div>

                {/* Caveat / Coverage Limitation Disclosure Banner when periods differ */}
                {comparisonMeta.periodsDiffer && (
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Independent Reporting Periods Active: </span>
                      <span className="text-amber-800">
                        {comparisonMeta.coverageNote ||
                          "Comparing non-identical timeframes across selected products. Normalized daily run-rates (Daily Spend and Daily Output) are displayed alongside actual totals to provide an accurate, balanced comparison across differing date spans."}
                      </span>
                    </div>
                  </div>
                )}

                {/* Side-by-Side Comparison Table (Metrics as Rows, Products as Columns) */}
                <div className="overflow-x-auto -mx-1 px-1">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 align-top">
                        <th className="py-3 px-3 text-xs font-bold text-slate-500 w-60 min-w-[220px]">
                          Metric
                        </th>
                        {comparisonProducts.map((cp, idx) => {
                          const pState = cp.periodState || {};
                          const isCustom = Boolean(pState.isCustom);

                          return (
                            <th key={cp.code} className="py-3 px-3 min-w-[260px] max-w-[320px]">
                              {/* Product Header */}
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span
                                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                      PRODUCT_DOT_COLORS[idx % PRODUCT_DOT_COLORS.length]
                                    }`}
                                  />
                                  <span className="font-mono font-bold text-slate-900 text-sm truncate">
                                    {cp.code}
                                  </span>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100/70 text-[#7c3aed] border border-purple-200/50 shrink-0">
                                  {cp.segment || cp.name}
                                </span>
                              </div>

                              {/* Independent Reporting Period Filter directly under Product */}
                              <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1.5 text-left">
                                <div className="flex items-center justify-between">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-[#7c3aed]" />
                                    <span>Reporting Period</span>
                                  </label>
                                  {cp.days_in_period && (
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      {cp.days_in_period} days
                                    </span>
                                  )}
                                </div>

                                <select
                                  value={pState.presetId || "ALL_HISTORY"}
                                  onChange={(e) => handleProductPresetChange(cp.code, e.target.value)}
                                  className="w-full text-xs font-semibold bg-white border border-purple-200/80 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-2xs cursor-pointer hover:border-purple-300 transition-colors"
                                >
                                  {periodPresets.length > 0 ? (
                                    periodPresets.map((pr) => (
                                      <option key={pr.id} value={pr.id}>
                                        {pr.name}
                                      </option>
                                    ))
                                  ) : (
                                    <>
                                      <option value="ALL_HISTORY">All Available History</option>
                                      <option value="CURRENT_MONTH">Current Month</option>
                                      <option value="PREVIOUS_MONTH">Previous Month</option>
                                      <option value="LAST_30_DAYS">Last 30 Days</option>
                                      <option value="LAST_90_DAYS">Last 90 Days</option>
                                      <option value="CUSTOM">Custom Date Range...</option>
                                    </>
                                  )}
                                </select>

                                {/* Date Range Pill */}
                                <div
                                  className="text-[10px] font-mono font-semibold text-purple-800 bg-purple-50/90 px-2 py-0.5 rounded border border-purple-100 truncate"
                                  title={cp.display_range || pState.displayRange}
                                >
                                  {cp.display_range || pState.displayRange || "All Committed History"}
                                </div>

                                {/* Custom Date Range Picker (shown when Custom is selected) */}
                                {isCustom && (
                                  <div className="pt-1.5 space-y-1.5 bg-slate-50/80 p-2 rounded-lg border border-slate-200 text-[11px] animate-in fade-in duration-100">
                                    <div>
                                      <span className="text-[10px] text-slate-500 font-medium">Start Date:</span>
                                      <input
                                        type="date"
                                        min={minAvailableDate || "2026-08-01"}
                                        max={maxAvailableDate || "2026-10-31"}
                                        value={pState.customStart || ""}
                                        onChange={(e) => handleCustomDateChange(cp.code, "start", e.target.value)}
                                        className="w-full mt-0.5 bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                      />
                                    </div>
                                    <div>
                                      <span className="text-[10px] text-slate-500 font-medium">End Date:</span>
                                      <input
                                        type="date"
                                        min={pState.customStart || minAvailableDate || "2026-08-01"}
                                        max={maxAvailableDate || "2026-10-31"}
                                        value={pState.customEnd || ""}
                                        onChange={(e) => handleCustomDateChange(cp.code, "end", e.target.value)}
                                        className="w-full mt-0.5 bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                      />
                                    </div>
                                    {pState.customError && (
                                      <div className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                                        <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                                        <span>{pState.customError}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/80 font-medium">
                      {/* Notice if any product has zero data */}
                      {comparisonProducts.some((cp) => cp.has_data === false) && (
                        <tr>
                          <td colSpan={comparisonProducts.length + 1} className="py-2 px-3 bg-rose-50/60 border-y border-rose-100">
                            <div className="flex items-center gap-2 text-rose-800 text-[11px] font-semibold">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                              <span>One or more products have no committed records in their selected date range. Displaying zeroed metrics without mock data.</span>
                            </div>
                          </td>
                        </tr>
                      )}

                      {/* 1. Total Expenditure */}
                      <tr className="hover:bg-purple-50/20 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-700 flex items-center gap-2.5">
                          <Layers className="w-4 h-4 text-[#7c3aed] shrink-0" />
                          <span>Total Expenditure</span>
                        </td>
                        {comparisonProducts.map((cp) => (
                          <td key={cp.code} className="py-2 px-3">
                            <div className="px-3 py-1.5 font-mono font-bold text-slate-900">
                              {cp.has_data === false ? (
                                <span className="text-slate-400">₹0.00 Cr (No data)</span>
                              ) : (
                                `₹${(cp.cost_cr || 0).toFixed(2)} Cr`
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* 2. Cost per Good Unit (Lower is Better) */}
                      <tr className="hover:bg-purple-50/20 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-700 flex items-center gap-2.5">
                          <Tag className="w-4 h-4 text-[#7c3aed] shrink-0" />
                          <span>Cost per Good Unit</span>
                        </td>
                        {comparisonProducts.map((cp) => {
                          const val = cp.cost_per_good_unit || 0;
                          const isMin =
                            comparisonStats &&
                            comparisonStats.minGoodCost !== comparisonStats.maxGoodCost &&
                            val === comparisonStats.minGoodCost &&
                            val > 0;
                          const isMax =
                            comparisonStats &&
                            comparisonStats.minGoodCost !== comparisonStats.maxGoodCost &&
                            val === comparisonStats.maxGoodCost &&
                            val > 0;
                          const highlightClass = isMin
                            ? "bg-emerald-50 text-emerald-700 font-bold"
                            : isMax
                            ? "bg-rose-50 text-rose-700 font-bold"
                            : "text-slate-800 font-bold";

                          return (
                            <td key={cp.code} className="py-2 px-3">
                              <div className={`px-3 py-1.5 rounded-lg font-mono ${highlightClass}`}>
                                {cp.has_data === false ? (
                                  <span className="text-slate-400">₹0.00</span>
                                ) : (
                                  `₹${val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>

                      {/* 3. Cost per Gross Unit (Lower is Better) */}
                      <tr className="hover:bg-purple-50/20 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-700 flex items-center gap-2.5">
                          <Gem className="w-4 h-4 text-[#7c3aed] shrink-0" />
                          <span>Cost per Gross Unit</span>
                        </td>
                        {comparisonProducts.map((cp) => {
                          const val = cp.cost_per_produced_unit || 0;
                          const isMin =
                            comparisonStats &&
                            comparisonStats.minGrossCost !== comparisonStats.maxGrossCost &&
                            val === comparisonStats.minGrossCost &&
                            val > 0;
                          const isMax =
                            comparisonStats &&
                            comparisonStats.minGrossCost !== comparisonStats.maxGrossCost &&
                            val === comparisonStats.maxGrossCost &&
                            val > 0;
                          const highlightClass = isMin
                            ? "bg-emerald-50 text-emerald-700 font-bold"
                            : isMax
                            ? "bg-rose-50 text-rose-700 font-bold"
                            : "text-slate-800 font-bold";

                          return (
                            <td key={cp.code} className="py-2 px-3">
                              <div className={`px-3 py-1.5 rounded-lg font-mono ${highlightClass}`}>
                                {cp.has_data === false ? (
                                  <span className="text-slate-400">₹0.00</span>
                                ) : (
                                  `₹${val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>

                      {/* 4. Gross Production */}
                      <tr className="hover:bg-purple-50/20 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-700 flex items-center gap-2.5">
                          <Factory className="w-4 h-4 text-[#7c3aed] shrink-0" />
                          <span>Gross Production</span>
                        </td>
                        {comparisonProducts.map((cp) => (
                          <td key={cp.code} className="py-2 px-3">
                            <div className="px-3 py-1.5 font-mono font-semibold text-slate-800">
                              {(cp.produced_qty || 0).toLocaleString()}
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* 5. Good Production */}
                      <tr className="hover:bg-purple-50/20 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-700 flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#7c3aed] shrink-0" />
                          <span>Good Production</span>
                        </td>
                        {comparisonProducts.map((cp) => (
                          <td key={cp.code} className="py-2 px-3">
                            <div className="px-3 py-1.5 font-mono font-semibold text-slate-800">
                              {(cp.good_qty || 0).toLocaleString()}
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* 6. Rejected Quantity (Lower is Better) */}
                      <tr className="hover:bg-purple-50/20 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-700 flex items-center gap-2.5">
                          <XCircle className="w-4 h-4 text-[#7c3aed] shrink-0" />
                          <span>Rejected Quantity</span>
                        </td>
                        {comparisonProducts.map((cp) => {
                          const rejectQty =
                            typeof cp.rejected_qty !== "undefined"
                              ? cp.rejected_qty
                              : Math.max(0, (cp.produced_qty || 0) - (cp.good_qty || 0));
                          const isMin =
                            comparisonStats &&
                            comparisonStats.minReject !== comparisonStats.maxReject &&
                            rejectQty === comparisonStats.minReject &&
                            cp.has_data !== false;
                          const isMax =
                            comparisonStats &&
                            comparisonStats.minReject !== comparisonStats.maxReject &&
                            rejectQty === comparisonStats.maxReject &&
                            cp.has_data !== false;
                          const highlightClass = isMin
                            ? "bg-emerald-50 text-emerald-700 font-bold"
                            : isMax
                            ? "bg-rose-50 text-rose-700 font-bold"
                            : "text-slate-800 font-bold";

                          return (
                            <td key={cp.code} className="py-2 px-3">
                              <div className={`px-3 py-1.5 rounded-lg font-mono ${highlightClass}`}>
                                {rejectQty.toLocaleString()}
                              </div>
                            </td>
                          );
                        })}
                      </tr>

                      {/* 7. Factory Yield (Higher is Better) */}
                      <tr className="hover:bg-purple-50/20 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-700 flex items-center gap-2.5">
                          <Percent className="w-4 h-4 text-[#7c3aed] shrink-0" />
                          <span>Factory Yield</span>
                        </td>
                        {comparisonProducts.map((cp) => {
                          const yieldVal = Number(cp.yield_pct) || 0;
                          const isBest =
                            comparisonStats &&
                            comparisonStats.minYield !== comparisonStats.maxYield &&
                            yieldVal === comparisonStats.maxYield &&
                            cp.has_data !== false;
                          const isWorst =
                            comparisonStats &&
                            comparisonStats.minYield !== comparisonStats.maxYield &&
                            yieldVal === comparisonStats.minYield &&
                            cp.has_data !== false;
                          const highlightClass = isBest
                            ? "bg-emerald-50 text-emerald-700 font-bold"
                            : isWorst
                            ? "bg-rose-50 text-rose-700 font-bold"
                            : "text-slate-800 font-bold";

                          return (
                            <td key={cp.code} className="py-2 px-3">
                              <div className={`px-3 py-1.5 rounded-lg font-mono ${highlightClass}`}>
                                {cp.yield_pct}%
                              </div>
                            </td>
                          );
                        })}
                      </tr>

                      {/* Normalized Daily Run-Rates Section (Shown when reporting periods differ or on custom) */}
                      {comparisonMeta.periodsDiffer && (
                        <>
                          <tr className="bg-purple-50/30">
                            <td
                              colSpan={comparisonProducts.length + 1}
                              className="py-1.5 px-3 text-[10px] font-bold text-purple-900 uppercase tracking-wider"
                            >
                              Normalized Comparable Run-Rates (Per Day)
                            </td>
                          </tr>

                          {/* Normalized Daily Spend */}
                          <tr className="hover:bg-purple-50/20 transition-colors bg-purple-50/10">
                            <td className="py-2 px-3 font-bold text-purple-900 flex items-center gap-2.5 pl-6">
                              <Clock className="w-3.5 h-3.5 text-[#7c3aed] shrink-0" />
                              <span>Average Daily Spend</span>
                            </td>
                            {comparisonProducts.map((cp) => (
                              <td key={cp.code} className="py-2 px-3">
                                <div className="px-3 py-1 font-mono font-bold text-purple-900">
                                  {cp.has_data === false ? (
                                    <span className="text-slate-400">₹0.00 Cr / day</span>
                                  ) : (
                                    `₹${(cp.daily_cost_cr || 0).toFixed(4)} Cr / day`
                                  )}
                                </div>
                              </td>
                            ))}
                          </tr>

                          {/* Normalized Daily Output */}
                          <tr className="hover:bg-purple-50/20 transition-colors bg-purple-50/10">
                            <td className="py-2 px-3 font-bold text-purple-900 flex items-center gap-2.5 pl-6">
                              <Activity className="w-3.5 h-3.5 text-[#7c3aed] shrink-0" />
                              <span>Average Daily Output</span>
                            </td>
                            {comparisonProducts.map((cp) => (
                              <td key={cp.code} className="py-2 px-3">
                                <div className="px-3 py-1 font-mono font-semibold text-slate-800">
                                  {cp.has_data === false ? (
                                    <span className="text-slate-400">0 units / day</span>
                                  ) : (
                                    `${Math.round(cp.daily_output_units || 0).toLocaleString()} units / day`
                                  )}
                                </div>
                              </td>
                            ))}
                          </tr>
                        </>
                      )}

                      {/* Footer Row: Inspect BOM Details Action */}
                      <tr>
                        <td className="pt-3.5 pb-1 px-3"></td>
                        {comparisonProducts.map((cp) => (
                          <td key={cp.code} className="pt-3.5 pb-1 px-3">
                            <button
                              onClick={() => setDrilldownProduct(cp)}
                              className="w-full py-2 px-3 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 text-[#7c3aed] text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                            >
                              <Box className="w-3.5 h-3.5 text-[#7c3aed]" />
                              <span>Inspect BOM Details</span>
                              <ChevronRight className="w-3.5 h-3.5 text-[#7c3aed]" />
                            </button>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Helpful note if only 1 product selected */}
                {comparisonProducts.length === 1 && (
                  <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl text-xs text-purple-800 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-[#7c3aed] shrink-0" />
                      <span>Select at least 1 more product from the ranking table above to view side-by-side comparative economics.</span>
                    </span>
                    <button
                      onClick={() => setSelectedSkus([])}
                      className="text-[11px] text-purple-700 hover:text-purple-900 font-bold underline cursor-pointer shrink-0 ml-3"
                    >
                      Clear Selection
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-purple-50/40 border border-purple-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-100/70 text-[#7c3aed] flex items-center justify-center shrink-0">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">
                      Compare Products (Side-by-Side Comparison)
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Select 2 or more products using the checkboxes in the ranking table above to compare unit economics, output, and BOM variance with independent reporting periods.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cross-SKU Comparison Governance Disclosure */}
            <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-2xl text-xs text-slate-700 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-purple-900">
                <ShieldCheck className="w-4 h-4 text-[#7c3aed] shrink-0" />
                <span>Cross-SKU Unit Cost Governance Standard</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Variance in unit costs between product lines (e.g. SPH-PRO-256 vs SPH-A15 Series) reflects verified bill-of-materials differences (such as AMOLED 120Hz displays, 12GB LPDDR5X RAM, and Snapdragon 8-Gen processors) rather than line assembly inefficiency. Direct cross-model unit cost comparisons must only be conducted on equivalent BOM complexity tiers.
              </p>
            </div>
          </>
        )}

        {/* Product Detail Modal / Drawer */}
        {drilldownProduct && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                    Detailed SKU Economics Drill-Down
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-0.5">
                    {drilldownProduct.code} — {drilldownProduct.name}
                  </h3>
                </div>
                <button
                  onClick={() => setDrilldownProduct(null)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick KPI Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium text-[11px]">Total Expenditure:</span>
                  <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">₹{drilldownProduct.cost_cr} Cr</div>
                </div>
                <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100">
                  <span className="text-slate-500 font-medium text-[11px]">Good Unit Cost:</span>
                  <div className="font-mono font-bold text-[#7c3aed] text-sm mt-0.5">
                    ₹{(drilldownProduct.cost_per_good_unit || 0).toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium text-[11px]">Gross Output:</span>
                  <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                    {(drilldownProduct.produced_qty || 0).toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <span className="text-slate-500 font-medium text-[11px]">Factory Yield:</span>
                  <div className="font-mono font-bold text-emerald-700 text-sm mt-0.5">{drilldownProduct.yield_pct}%</div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Cost Breakdown by Dimension
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100">
                    <span className="text-slate-500 font-medium text-[10px]">Material</span>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">
                      ₹{((drilldownProduct.breakdown?.material_inr || 0) / 1e7).toFixed(2)} Cr
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100">
                    <span className="text-slate-500 font-medium text-[10px]">Labour</span>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">
                      ₹{((drilldownProduct.breakdown?.labour_inr || 0) / 1e7).toFixed(2)} Cr
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                    <span className="text-slate-500 font-medium text-[10px]">Machine</span>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">
                      ₹{((drilldownProduct.breakdown?.machine_inr || 0) / 1e7).toFixed(2)} Cr
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                    <span className="text-slate-500 font-medium text-[10px]">Energy</span>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">
                      ₹{((drilldownProduct.breakdown?.energy_inr || 0) / 1e7).toFixed(2)} Cr
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100">
                    <span className="text-slate-500 font-medium text-[10px]">Scrap</span>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">
                      ₹{((drilldownProduct.breakdown?.scrap_inr || 0) / 1e7).toFixed(2)} Cr
                    </div>
                  </div>
                </div>
              </div>

              {/* BOM Components Traceability */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Associated BOM Components ({productComponents.length} Items)
                  </h4>
                  {componentsLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />}
                </div>
                <div className="border border-slate-100 rounded-xl overflow-hidden max-h-40 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[10px] text-slate-400 font-semibold uppercase sticky top-0">
                      <tr>
                        <th className="py-2 px-3">Material Code</th>
                        <th className="py-2 px-2 text-right">Required Qty</th>
                        <th className="py-2 px-2 text-right">Scrap Factor</th>
                        <th className="py-2 pr-3 text-right">Revision</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-mono text-[11px]">
                      {productComponents.map((c, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="py-1.5 px-3 font-semibold text-slate-800">{c.material_code}</td>
                          <td className="py-1.5 px-2 text-right text-slate-600">{c.component_qty}</td>
                          <td className="py-1.5 px-2 text-right text-slate-600">{c.scrap_factor}</td>
                          <td className="py-1.5 pr-3 text-right text-purple-700 font-bold">{c.revision}</td>
                        </tr>
                      ))}
                      {productComponents.length === 0 && !componentsLoading && (
                        <tr>
                          <td colSpan={4} className="py-4 text-center text-slate-400 text-xs">
                            No direct BOM component linkages found for this SKU.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                onClick={() => setDrilldownProduct(null)}
                className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-[#7c3aed] font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close Product Inspection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
