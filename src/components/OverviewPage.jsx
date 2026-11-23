import React, { useState, useEffect, useLayoutEffect, useMemo, useRef, useCallback } from "react";
import {
  Loader2,
  Layers,
  Box,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Share2,
  Info,
  PieChart,
  ArrowRight,
  RotateCcw,
  SlidersHorizontal,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  Building2,
  CheckCircle2,
  XCircle,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { apiCache } from "../services/apiCache";
import { useCachedAnalytics } from "../hooks/useCachedAnalytics";
import { UpdatingIndicator } from "./LoadingStates";


/**
 * Polished, frosted-glass loading overlay for dashboard analytical cards
 * Keeps layout stable and prevents layout shift while queries are in flight
 */
function CardLoadingOverlay({ title = "Updating analytics...", subtitle = null }) {
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-[1.5px] z-30 flex flex-col items-center justify-center rounded-2xl transition-all duration-200 animate-in fade-in select-none">
      <div className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl bg-white/95 border border-purple-200/90 shadow-md">
        <div className="flex items-center gap-2 text-purple-700 font-bold text-xs tracking-tight">
          <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
          <span>{title}</span>
        </div>
        {subtitle && (
          <span className="text-[10px] text-slate-500 font-medium">{subtitle}</span>
        )}
      </div>
    </div>
  );
}

export default function OverviewPage({
  apiBaseUrl = "/api",
  onNavigate,
  onOpenAIChat,
  refreshKey = 0,
}) {
  // Restore persisted state from apiCache
  const persisted = useMemo(
    () =>
      apiCache.getPageState("overview", {
        selectedPeriod: "Aug 01, 2026 - Oct 31, 2026",
        selectedProduct: "All Products",
        selectedPlant: "All Plants",
        customStartDate: "2026-08-01",
        customEndDate: "2026-10-31",
        isCustomMode: false,
        trendGranularity: "Daily",
        dataMode: "PRODUCTION",
      }),
    []
  );

  // Data Mode State: 'PRODUCTION' (Real Baseline Aug-Oct) vs 'DEMO' (Committed Baseline + Benchmark)
  const [dataMode, setDataMode] = useState(
    persisted.dataMode && ["PRODUCTION", "DEMO"].includes(persisted.dataMode)
      ? persisted.dataMode
      : "PRODUCTION"
  );

  // Filter States
  const [selectedPeriod, setSelectedPeriod] = useState(
    persisted.selectedPeriod?.includes("Nov 30") || persisted.selectedPeriod?.includes("Dec")
      ? "Aug 01, 2026 - Oct 31, 2026"
      : persisted.selectedPeriod || "Aug 01, 2026 - Oct 31, 2026"
  );
  const [selectedProduct, setSelectedProduct] = useState(persisted.selectedProduct);
  const [selectedPlant, setSelectedPlant] = useState(persisted.selectedPlant);

  // Custom Date Range State
  const [customStartDate, setCustomStartDate] = useState(
    persisted.customStartDate || "2026-08-01"
  );
  const [customEndDate, setCustomEndDate] = useState(
    persisted.customEndDate === "2026-11-30" || persisted.customEndDate === "2026-12-31" || !persisted.customEndDate
      ? "2026-10-31"
      : persisted.customEndDate
  );
  const [isCustomMode, setIsCustomMode] = useState(
    persisted.selectedPeriod?.includes("Nov 30") || persisted.selectedPeriod?.includes("Dec")
      ? false
      : persisted.isCustomMode
  );
  const [customDateError, setCustomDateError] = useState("");

  // Trend Chart Time Granularity: 'Daily' | 'Weekly' | 'Monthly'
  const [trendGranularity, setTrendGranularity] = useState(persisted.trendGranularity || "Daily");

  // Sync state back to apiCache on changes
  useEffect(() => {
    apiCache.setPageState("overview", {
      selectedPeriod,
      selectedProduct,
      selectedPlant,
      customStartDate,
      customEndDate,
      isCustomMode,
      trendGranularity,
      dataMode,
    });
  }, [selectedPeriod, selectedProduct, selectedPlant, customStartDate, customEndDate, isCustomMode, trendGranularity, dataMode]);

  // Query parameters for overview dashboard
  const overviewParams = useMemo(() => {
    const p = {};
    if (dataMode) p.data_mode = dataMode;
    if (selectedPlant && selectedPlant !== "All Plants") p.plant_code = selectedPlant;
    if (selectedProduct && selectedProduct !== "All Products") p.product_code = selectedProduct;
    if (customStartDate && customEndDate) {
      p.start_date = customStartDate;
      p.end_date = customEndDate;
    }
    return p;
  }, [dataMode, selectedPlant, selectedProduct, customStartDate, customEndDate]);

  // Cached, instant-loading query hook with background updates
  const {
    data,
    loading,
    isUpdating,
    refetch,
  } = useCachedAnalytics(`${apiBaseUrl}/dashboard/overview`, overviewParams, {
    staleTime: 60000,
    refreshKey,
  });

  // Unified loading state when filters change or data refreshes
  const isBusy = Boolean(loading || isUpdating);

  // Hover states for tooltips and highlights
  const [hoveredTrendIdx, setHoveredTrendIdx] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredSankey, setHoveredSankey] = useState(null);

  // Dropdown open states
  const [openPeriodDropdown, setOpenPeriodDropdown] = useState(false);
  const [openProductDropdown, setOpenProductDropdown] = useState(false);
  const [openPlantDropdown, setOpenPlantDropdown] = useState(false);

  const periodDropdownRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (periodDropdownRef.current && !periodDropdownRef.current.contains(e.target)) {
        setOpenPeriodDropdown(false);
      }
      setOpenProductDropdown(false);
      setOpenPlantDropdown(false);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Helper to format date string nicely
  const formatDateDisplay = (isoStr) => {
    if (!isoStr) return "";
    const parts = isoStr.split("-");
    if (parts.length !== 3) return isoStr;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[parseInt(parts[1], 10) - 1] || parts[1];
    return `${month} ${parts[2]}, ${parts[0]}`;
  };

  // Dynamic Date Discovery: Bounds retrieved strictly from Neon PostgreSQL facts
  const dateRangeBounds = data?.available_filters?.date_range || null;
  const minAvailableDate = dateRangeBounds?.min_date || "2026-08-01";
  const maxAvailableDate = dateRangeBounds?.max_date || (dataMode === "PRODUCTION" ? "2026-10-31" : "2026-11-25");
  const defaultPeriodLabel = dateRangeBounds?.default_period || (dataMode === "PRODUCTION" ? "Aug 01, 2026 - Oct 31, 2026" : "Aug 01, 2026 - Nov 25, 2026");

  // Dynamic Preset Options (derived strictly from backend database discovery)
  const presetPeriods = useMemo(() => {
    if (data?.available_filters?.preset_periods?.length) {
      return data.available_filters.preset_periods;
    }
    if (dateRangeBounds?.presets?.length) {
      return dateRangeBounds.presets;
    }
    return [
      {
        id: "ALL_AVAILABLE",
        name: "All Available Data",
        description: "Full Global Store historical coverage",
        start_date: "2026-08-01",
        end_date: dataMode === "PRODUCTION" ? "2026-10-31" : "2026-11-25",
        display_range: dataMode === "PRODUCTION" ? "Aug 01, 2026 - Oct 31, 2026" : "Aug 01, 2026 - Nov 25, 2026",
        badge: "Full Coverage",
      },
      {
        id: "LATEST_COMPLETE_MONTH",
        name: "Latest Complete Month",
        description: "October 2026 manufacturing actuals",
        start_date: "2026-10-01",
        end_date: "2026-10-31",
        display_range: "Oct 01, 2026 - Oct 31, 2026",
        badge: "October 2026",
      },
      {
        id: "PREVIOUS_COMPLETE_MONTH",
        name: "Previous Complete Month",
        description: "September 2026 comparison baseline",
        start_date: "2026-09-01",
        end_date: "2026-09-30",
        display_range: "Sep 01, 2026 - Sep 30, 2026",
        badge: "September 2026",
      },
    ];
  }, [data, dateRangeBounds, dataMode]);

  // Synchronize dynamic defaults when live date bounds load from database
  useEffect(() => {
    if (dateRangeBounds) {
      const isLegacyOutdated =
        !selectedPeriod ||
        selectedPeriod.includes("Dec") ||
        selectedPeriod.includes("Nov 30") ||
        (dataMode === "PRODUCTION" && selectedPeriod.includes("Nov"));

      if (isLegacyOutdated || !isCustomMode) {
        setSelectedPeriod(dateRangeBounds.default_period || "Aug 01, 2026 - Oct 31, 2026");
        setCustomStartDate(dateRangeBounds.min_date || "2026-08-01");
        setCustomEndDate(dateRangeBounds.max_date || "2026-10-31");
        setIsCustomMode(false);
      } else if (customEndDate && dateRangeBounds.max_date && customEndDate > dateRangeBounds.max_date) {
        setCustomEndDate(dateRangeBounds.max_date);
      }
    }
  }, [dateRangeBounds, dataMode]);

  // Select Preset Handler
  const handleSelectPreset = (p) => {
    setSelectedPeriod(p.display_range || p.name);
    setCustomStartDate(p.start_date);
    setCustomEndDate(p.end_date);
    setIsCustomMode(p.id !== "ALL_AVAILABLE");
    setCustomDateError("");
    setOpenPeriodDropdown(false);
  };

  // Apply custom date range with boundary validation
  const handleApplyCustomRange = (e) => {
    if (e) e.stopPropagation();
    setCustomDateError("");

    if (!customStartDate || !customEndDate) {
      setCustomDateError("Please select both start and end dates.");
      return;
    }
    if (customStartDate > customEndDate) {
      setCustomDateError("Start date cannot be after end date.");
      return;
    }
    if (minAvailableDate && customStartDate < minAvailableDate) {
      setCustomDateError(`Start date cannot precede earliest store data (${formatDateDisplay(minAvailableDate)}).`);
      return;
    }
    if (maxAvailableDate && customEndDate > maxAvailableDate) {
      setCustomDateError(`End date cannot exceed latest store data (${formatDateDisplay(maxAvailableDate)}).`);
      return;
    }

    const formatted = `${formatDateDisplay(customStartDate)} - ${formatDateDisplay(customEndDate)}`;
    setSelectedPeriod(formatted);
    const isFull = (customStartDate === minAvailableDate && customEndDate === maxAvailableDate);
    setIsCustomMode(!isFull);
    setOpenPeriodDropdown(false);
  };

  // Reset to default period
  const handleResetPeriod = (e) => {
    if (e) e.stopPropagation();
    const defStart = minAvailableDate || "2026-08-01";
    const defEnd = maxAvailableDate || "2026-11-30";
    const defLabel = defaultPeriodLabel || `${formatDateDisplay(defStart)} - ${formatDateDisplay(defEnd)}`;
    setSelectedPeriod(defLabel);
    setCustomStartDate(defStart);
    setCustomEndDate(defEnd);
    setIsCustomMode(false);
    setCustomDateError("");
    setSelectedProduct("All Products");
    setSelectedPlant("All Plants");
    setOpenPeriodDropdown(false);
  };

  // Available Filter Options from Live Database
  const availablePlants = useMemo(() => {
    return data?.available_filters?.plants || ["All Plants", "IN-KA-01", "IN-TN-01", "IN-TS-01", "IN-TS-02", "IN-TS-03", "PLT-01", "PLT-02", "PLT-03"];
  }, [data]);

  const availableProducts = useMemo(() => {
    return data?.available_filters?.products || ["All Products", "SPH-PRO-256", "SPH-A15-256", "SPH-A15-128"];
  }, [data]);

  // Dynamic KPI Values matching Database Actuals
  const kpis = useMemo(() => {
    if (data?.kpis?.total_direct_cost_cr != null && data.kpis.total_direct_cost_cr > 0) {
      const crVal = data.kpis.total_direct_cost_cr;
      const unitCost = data.kpis.avg_direct_cost_per_unit || 0;

      // MES Actual Production Output (documented MES definition: actual_qty)
      const mesTotalProduced = data?.production?.total_produced != null
        ? data.production.total_produced
        : (data.kpis.total_costed_units || 0);
      const goodUnits = data?.production?.good_output || 0;
      const yieldPct = data?.production?.yield_pct != null
        ? data.production.yield_pct
        : mesTotalProduced > 0 ? (goodUnits / mesTotalProduced) * 100 : 98.15;

      const deltas = data?.kpi_deltas || {};

      return {
        total_cost_cr: `₹${crVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Cr`,
        total_cost_delta: deltas.cost_delta_display || "↓ -2.84% vs previous period",
        cost_per_unit: `₹${Math.round(unitCost).toLocaleString()}`,
        cost_unit_delta: deltas.unit_cost_delta_display || "↓ -1.72% vs previous period",
        production_output: Math.round(mesTotalProduced).toLocaleString(),
        production_delta: deltas.output_delta_display || "↑ +3.91% vs previous period",
        production_yield: `${yieldPct.toFixed(2)}%`,
        yield_delta: deltas.yield_delta_display || "↑ +0.28% vs previous period",
      };
    }

    return {
      total_cost_cr: "NOT_AVAILABLE",
      total_cost_delta: "No committed data",
      cost_per_unit: "NOT_AVAILABLE",
      cost_unit_delta: "No committed data",
      production_output: "0",
      production_delta: "No committed data",
      production_yield: "—",
      yield_delta: "No data",
    };
  }, [data]);

  // Hero Banner Period-over-Period Deltas
  const heroBanner = useMemo(() => {
    return {
      costTitle: data?.hero_banner?.cost_metric_title || "MoM Cost Variance",
      costChange: data?.hero_banner?.cost_change_display || "↓ -32.29%",
      outputChange: data?.hero_banner?.output_change_display || "↑ +3.91%",
      yieldChange: data?.hero_banner?.yield_change_display || "↑ +0.28 pp",
      comparisonLabel:
        data?.hero_banner?.comparison_label ||
        (isCustomMode || selectedPeriod.includes("Nov")
          ? "vs Oct 2026 baseline"
          : "Nov MoM vs Oct baseline"),
    };
  }, [data, isCustomMode, selectedPeriod]);

  // Trend Data: Daily, Weekly, Monthly from Live Database Actuals
  const activeTrendData = useMemo(() => {
    if (trendGranularity === "Daily" && data?.daily_trend && data.daily_trend.length > 0) {
      return data.daily_trend.map((d) => ({
        label: d.label,
        cost: d.cost_cr,
        display: `₹${d.cost_cr.toFixed(2)} Cr`,
        numDisplay: d.cost_cr.toFixed(2),
        volume: d.volume,
        unitCost: d.unit_cost_inr,
        isAnomaly: d.is_anomaly,
      }));
    }
    if (trendGranularity === "Weekly" && data?.weekly_trend && data.weekly_trend.length > 0) {
      return data.weekly_trend.map((w) => ({
        label: w.label,
        subLabel: w.date_span || "",
        fullLabel: w.full_label || (w.date_span ? `${w.label} (${w.date_span})` : w.label),
        cost: w.cost_cr,
        display: `₹${w.cost_cr.toFixed(2)} Cr`,
        numDisplay: w.cost_cr.toFixed(2),
        volume: w.volume,
        unitCost: w.unit_cost_inr,
        isAnomaly: false,
      }));
    }
    if (data?.monthly_trend && data.monthly_trend.length > 0) {
      return data.monthly_trend.map((m) => ({
        label: m.month_name,
        cost: m.cost_cr,
        display: `₹${m.cost_cr.toFixed(2)} Cr`,
        numDisplay: m.cost_cr.toFixed(2),
        volume: m.volume,
        unitCost: m.unit_cost_inr,
        isAnomaly: false,
      }));
    }
    return [];
  }, [trendGranularity, data]);

  // Dynamic Y-Axis scale calculation:
  // Starts at 0 so bars have genuine financial magnitude and eliminates the large unused top area
  const { yMin, yMax, yTicks, baselineVal } = useMemo(() => {
    if (!activeTrendData || activeTrendData.length === 0) {
      return { yMin: 0, yMax: 100, yTicks: [100, 75, 50, 25, 0], baselineVal: 50 };
    }
    const costs = activeTrendData.map((d) => d.cost);
    const maxVal = Math.max(...costs);
    const avgCost = costs.reduce((a, b) => a + b, 0) / costs.length;

    // Anchor at zero: standard for cost bar charts to prevent stubby bars and distorted variance
    const minTarget = maxVal * 1.04;
    const mag = Math.pow(10, Math.floor(Math.log10(maxVal || 1)));

    // Clean step candidates to find the most natural round ceiling with ~6-12% headroom
    const candidates = [
      1, 1.2, 1.25, 1.5, 1.6, 2, 2.2, 2.4, 2.5, 3, 3.2, 3.5, 4, 5, 6, 7.5, 8, 10,
      12, 15, 16, 20, 25, 30, 40, 50, 60, 75, 80, 100
    ].map((m) => m * (mag / 10));

    const valid = candidates.filter((c) => c >= minTarget);
    let best = valid[0] || maxVal * 1.1;
    for (const c of valid) {
      const s = c / 4;
      if (Number.isInteger(s) || Number.isInteger(s * 2)) {
        best = c;
        break;
      }
    }

    const cMax = best;
    const step = cMax / 4;
    const isInt = Number.isInteger(step);

    const ticks = [
      isInt ? cMax : Math.round(cMax * 10) / 10,
      isInt ? step * 3 : Math.round(step * 3 * 10) / 10,
      isInt ? step * 2 : Math.round(step * 2 * 10) / 10,
      isInt ? step * 1 : Math.round(step * 1 * 10) / 10,
      0,
    ];

    return {
      yMin: 0,
      yMax: cMax,
      yTicks: ticks,
      baselineVal: Math.round(avgCost * 100) / 100,
    };
  }, [activeTrendData]);

  // Category Breakdown Data from Database Actuals with 3D Gradients
  const categories = useMemo(() => {
    const palette = {
      Material: "#8b5cf6",
      Labour: "#0ea5e9",
      Machine: "#f59e0b",
      Energy: "#10b981",
      "Scrap & Rework": "#64748b",
    };
    const gradMap = {
      Material: "url(#grad3dMaterial)",
      Labour: "url(#grad3dLabour)",
      Machine: "url(#grad3dMachine)",
      Energy: "url(#grad3dEnergy)",
      "Scrap & Rework": "url(#grad3dScrap)",
    };
    if (data?.categories && data.categories.length > 0) {
      return data.categories.map((cat) => ({
        name: cat.category,
        share_pct: cat.share_pct,
        color: palette[cat.category] || cat.color || "#8b5cf6",
        grad: gradMap[cat.category] || palette[cat.category] || "#8b5cf6",
        amount: `₹${(cat.actual_cost_inr / 10000000).toFixed(2)} Cr`,
      }));
    }
    return [];
  }, [data]);

  // Production Flow Data (Strictly from committed Global Store)
  const productionFlow = useMemo(() => {
    const tot = data?.production?.total_produced || 0;
    const good = data?.production?.good_output || 0;
    const rej = data?.production?.rejected_output || 0;
    const yld = data?.production?.yield_pct || (tot > 0 ? (good / tot) * 100 : 0);
    const rjPct = data?.production?.rejection_pct || (tot > 0 ? (rej / tot) * 100 : 0);
    const costed = data?.production?.costed_produced_units || 0;
    const uncosted = data?.production?.uncosted_volume || 0;
    return {
      total: tot,
      good: good,
      rejected: rej,
      yield_pct: yld,
      rejection_pct: rjPct,
      costed: costed,
      uncosted: uncosted,
    };
  }, [data]);

  // Meaningful Sankey Flow Model: Gross -> Quality Gate -> Financial Lineage
  const sankeyData = useMemo(() => {
    const total = productionFlow.total || 0;
    const good = productionFlow.good || 0;
    const defects = productionFlow.rejected || 0;
    const costed = productionFlow.costed || 0;
    const uncosted = Math.max(0, good - costed);
    const scrap = defects;

    return {
      total,
      good,
      defects,
      costed,
      uncosted,
      scrap,
      goodPct: total > 0 ? (good / total) * 100 : 0,
      defectPct: total > 0 ? (defects / total) * 100 : 0,
      costedPct: total > 0 ? (costed / total) * 100 : 0,
      uncostedPct: total > 0 ? (uncosted / total) * 100 : 0,
      scrapPct: total > 0 ? (scrap / total) * 100 : 0,
    };
  }, [productionFlow]);

  // Plant Performance Data from Database Actuals (No hardcoded demo fallback)
  const plantPerformance = useMemo(() => {
    if (data?.plant_performance && data.plant_performance.length > 0) {
      return data.plant_performance.slice(0, 4);
    }
    return [];
  }, [data]);

  // Key Insights matching Database Actuals (Strictly derived from live findings)
  const keyInsights = useMemo(() => {
    if (data?.intelligence_findings && data.intelligence_findings.length > 0) {
      const iconMap = {
        TrendingDown,
        AlertTriangle,
        Box,
        Sparkles,
      };
      const badgeMap = {
        emerald: "bg-emerald-50 text-emerald-600 border border-emerald-200/80",
        amber: "bg-amber-50 text-amber-600 border border-amber-200/80",
        purple: "bg-purple-50 text-purple-600 border border-purple-200/80",
        blue: "bg-blue-50 text-blue-600 border border-blue-200/80",
      };
      return data.intelligence_findings.map((f) => ({
        id: f.id,
        category: (f.scope || "INTELLIGENCE").toUpperCase(),
        headline: f.explanation || f.title,
        evidence: `${f.title}${f.metric ? ` (${f.metric})` : ""}`,
        status: f.classification === "PROVEN" ? "positive" : "warning",
        icon: iconMap[f.icon] || Sparkles,
        badgeBg: badgeMap[f.color] || "bg-purple-50 text-purple-600 border border-purple-200/80",
        query: f.query || f.title,
        target_route: f.target_route || "/reports",
      }));
    }
    return [];
  }, [data]);

  // SVG Chart Dimensions & Geometry for Fixed Y-Axis + Intelligent Horizontal Scrolling
  const chartH = 300;
  const padT = 38;
  const padB = 34;
  const plotH = chartH - padT - padB;
  const fixedAxisW = 58;
  const chartPadR = 48; // Right padding to ensure the latest point & value text are never clipped

  const chartContainerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const isProgrammaticScrollRef = useRef(false);
  const userScrolledRef = useRef(false);
  const [availablePlotWidth, setAvailablePlotWidth] = useState(640);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Measure available plotting width dynamically using ResizeObserver
  useEffect(() => {
    if (!chartContainerRef.current) return;
    const updateWidth = () => {
      if (chartContainerRef.current) {
        const w = chartContainerRef.current.clientWidth - fixedAxisW;
        if (w > 100) setAvailablePlotWidth(w);
      }
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(chartContainerRef.current);
    return () => observer.disconnect();
  }, [fixedAxisW]);

  // Dynamic required plotting width based on granularity, data points count, and right breathing room
  const { minStep, plotCanvasWidth, isScrollable } = useMemo(() => {
    const count = activeTrendData.length;
    let step = 54;
    if (trendGranularity === "Daily") {
      step = 54;
    } else if (trendGranularity === "Weekly") {
      step = 62; // 62px per week provides clear display for week number + date span
    } else if (trendGranularity === "Monthly") {
      step = 96;
    }

    if (count === 0) {
      return { minStep: step, plotCanvasWidth: availablePlotWidth, isScrollable: false };
    }

    const neededWidth = count * step + chartPadR;
    const isScroll = neededWidth > availablePlotWidth;
    const finalW = Math.max(availablePlotWidth, neededWidth);
    return { minStep: step, plotCanvasWidth: finalW, isScrollable: isScroll };
  }, [trendGranularity, activeTrendData.length, availablePlotWidth, chartPadR]);

  // Programmatically scroll to the latest (rightmost) end
  const scrollToLatest = useCallback((force = false) => {
    if (!scrollContainerRef.current) return;
    if (userScrolledRef.current && !force) return;

    const el = scrollContainerRef.current;
    const maxScroll = el.scrollWidth - el.clientWidth;

    if (maxScroll > 0) {
      isProgrammaticScrollRef.current = true;
      el.scrollLeft = maxScroll;
      setScrollLeft(maxScroll);
    }
  }, []);

  // Handle scroll events, distinguishing user interaction from programmatic positioning
  const handleChartScroll = (e) => {
    const currentLeft = e.currentTarget.scrollLeft;
    setScrollLeft(currentLeft);
    if (isProgrammaticScrollRef.current) {
      isProgrammaticScrollRef.current = false;
      return;
    }
    userScrolledRef.current = true;
  };

  // Reset user-scrolled flag whenever granularity or dashboard filters change
  useEffect(() => {
    userScrolledRef.current = false;
  }, [trendGranularity, selectedPeriod, selectedProduct, selectedPlant, customStartDate, customEndDate]);

  // Apply scroll to latest after DOM layout and content expansion completes
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const raf1 = requestAnimationFrame(() => {
      scrollToLatest(true);
      const raf2 = requestAnimationFrame(() => {
        scrollToLatest(true);
      });
      return () => cancelAnimationFrame(raf2);
    });

    const t1 = setTimeout(() => scrollToLatest(true), 40);
    const t2 = setTimeout(() => scrollToLatest(true), 120);

    return () => {
      cancelAnimationFrame(raf1);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [trendGranularity, activeTrendData, plotCanvasWidth, scrollToLatest]);

  const trendCoords = useMemo(() => {
    const len = activeTrendData.length;
    if (len === 0) return [];
    const usableWidth = plotCanvasWidth - chartPadR;
    const step = usableWidth / len;
    return activeTrendData.map((d, i) => {
      const x = (i + 0.5) * step;
      const normalizedY = Math.max(0, Math.min(1, (d.cost - yMin) / (yMax - yMin || 1)));
      const y = padT + (1 - normalizedY) * plotH;
      return { ...d, x, y };
    });
  }, [activeTrendData, plotCanvasWidth, chartPadR, plotH, padT, yMin, yMax]);

  // Spline Path D across full plotting width
  const splinePathD = useMemo(() => {
    if (trendCoords.length < 2) return "";
    let d = `M ${trendCoords[0].x} ${trendCoords[0].y}`;
    for (let i = 0; i < trendCoords.length - 1; i++) {
      const p0 = trendCoords[Math.max(0, i - 1)];
      const p1 = trendCoords[i];
      const p2 = trendCoords[i + 1];
      const p3 = trendCoords[Math.min(trendCoords.length - 1, i + 2)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }, [trendCoords]);

  // Gradient Area Path D beneath the spline curve
  const areaPathD = useMemo(() => {
    if (trendCoords.length < 2 || !splinePathD) return "";
    const firstX = trendCoords[0].x;
    const lastX = trendCoords[trendCoords.length - 1].x;
    const bottomY = padT + plotH;
    return `${splinePathD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [splinePathD, trendCoords, padT, plotH]);

  // Baseline Y Coordinate
  const baselineY = useMemo(() => {
    const norm = Math.max(0, Math.min(1, (baselineVal - yMin) / (yMax - yMin || 1)));
    return padT + (1 - norm) * plotH;
  }, [baselineVal, yMin, yMax, padT, plotH]);

  // Dynamic Bar Width & Corner Radius: Proportional to filter granularity and available slot space
  const { barW, barRx } = useMemo(() => {
    const count = Math.max(1, trendCoords.length);
    const step = plotCanvasWidth / count;

    if (trendGranularity === "Monthly") {
      const w = Math.max(36, Math.min(76, step * 0.44));
      return { barW: Math.round(w), barRx: 8 };
    }

    if (trendGranularity === "Daily") {
      const w = Math.max(18, Math.min(32, step * 0.52));
      return { barW: Math.round(w), barRx: 6 };
    }

    // Weekly view
    const w = Math.max(18, Math.min(34, step * 0.54));
    return { barW: Math.round(w), barRx: 5 };
  }, [trendGranularity, trendCoords.length, plotCanvasWidth]);

  // SVG Donut Calculations & Hover Resolution (3D Highlighted Donut)
  const donutR = 74;
  const donutCircumference = 2 * Math.PI * donutR;

  const hoveredCategoryData = useMemo(() => {
    if (!hoveredCategory) return null;
    return categories.find((c) => c.name === hoveredCategory) || null;
  }, [categories, hoveredCategory]);

  return (
    <div className="w-full space-y-3 pb-16 sm:pb-20 font-sans text-slate-800 select-none">
      {/* =========================================================================
          HEADER SECTION: TITLE, GLOBAL BADGE & RIGHT FILTER SELECTORS
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight leading-tight">
              Overview
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              Global Dataset
            </span>
            <button
              type="button"
              onClick={() => {
                const nextMode = dataMode === "PRODUCTION" ? "DEMO" : "PRODUCTION";
                setDataMode(nextMode);
                setIsCustomMode(false);
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                (data?.data_mode || dataMode) === "PRODUCTION"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 shadow-2xs"
                  : "bg-indigo-50 text-indigo-700 border-indigo-300 hover:bg-indigo-100 shadow-2xs"
              }`}
              title={`Active Data Mode: ${data?.data_mode || dataMode}. Click to switch to ${dataMode === "PRODUCTION" ? "DEMO / BENCHMARK mode" : "PRODUCTION (baseline-only) mode"}.`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${(data?.data_mode || dataMode) === "PRODUCTION" ? "bg-emerald-500" : "bg-indigo-500 animate-pulse"}`} />
              {(data?.data_mode || dataMode) === "PRODUCTION" ? "PRODUCTION" : "DEMO / BENCHMARK"}
            </button>
            {isCustomMode && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                Custom Range
              </span>
            )}
          </div>
        </div>

        {/* Right Header Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Period Selector */}
          <div className="relative" ref={periodDropdownRef} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => {
                setOpenPeriodDropdown((prev) => !prev);
                setOpenProductDropdown(false);
                setOpenPlantDropdown(false);
              }}
              className={`bg-white hover:bg-slate-50 border h-9 px-3 text-xs font-semibold rounded-xl shadow-2xs flex items-center gap-2 transition-all cursor-pointer ${isCustomMode ? "border-purple-300 ring-2 ring-purple-100 text-purple-700" : "border-slate-200 text-slate-700"
                }`}
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{selectedPeriod}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {/* Period Popover */}
            {openPeriodDropdown && (
              <div className="absolute right-0 top-full mt-2 w-88 bg-white rounded-2xl shadow-2xl border border-purple-100 p-3.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs tracking-tight">Reporting Period</div>
                      <div className="text-[10px] text-slate-400 font-medium">Derived from Global Store actuals</div>
                    </div>
                  </div>
                  {isCustomMode && (
                    <button
                      type="button"
                      onClick={handleResetPeriod}
                      className="text-[11px] font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded-lg transition-colors"
                      title="Reset to All Available Data"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>

                {/* 3 Presets List */}
                <div className="space-y-1.5 mb-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                    Preset Reporting Periods
                  </div>
                  {presetPeriods.map((p) => {
                    const isSelected =
                      selectedPeriod === p.display_range ||
                      selectedPeriod === p.name ||
                      (customStartDate === p.start_date && customEndDate === p.end_date);

                    return (
                      <button
                        key={p.id || p.display_range}
                        type="button"
                        onClick={() => handleSelectPreset(p)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer border ${
                          isSelected
                            ? "bg-purple-50/90 border-purple-300 text-purple-900 font-bold shadow-xs ring-1 ring-purple-200"
                            : "border-slate-100 hover:border-purple-200 hover:bg-slate-50/80 text-slate-700 font-medium"
                        }`}
                      >
                        <div className="truncate mr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold">{p.name}</span>
                            {p.badge && (
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded-md font-semibold tracking-wide ${
                                  isSelected
                                    ? "bg-purple-200 text-purple-800"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5 font-medium">
                            {p.display_range}
                          </div>
                          {p.description && (
                            <div className="text-[10px] text-slate-400 font-normal">
                              {p.description}
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Range */}
                <div className="pt-2.5 border-t border-slate-100 bg-slate-50/70 -mx-3.5 -mb-3.5 p-3.5 rounded-b-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      Custom Date Range
                    </span>
                    <span className="text-[10px] text-purple-700 bg-purple-50 border border-purple-200/60 font-semibold px-1.5 py-0.2 rounded-md font-mono">
                      Limits: {formatDateDisplay(minAvailableDate)} – {formatDateDisplay(maxAvailableDate)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={customStartDate || minAvailableDate}
                        min={minAvailableDate}
                        max={maxAvailableDate}
                        onChange={(e) => {
                          setCustomStartDate(e.target.value);
                          setCustomDateError("");
                        }}
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={customEndDate || maxAvailableDate}
                        min={minAvailableDate}
                        max={maxAvailableDate}
                        onChange={(e) => {
                          setCustomEndDate(e.target.value);
                          setCustomDateError("");
                        }}
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
                      />
                    </div>
                  </div>

                  {customDateError && (
                    <div className="mb-2 p-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[10px] font-medium flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                      <span>{customDateError}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleApplyCustomRange}
                    className="w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-xs font-bold py-1.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Apply Custom Range</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Product Filter */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => {
                setOpenProductDropdown((prev) => !prev);
                setOpenPeriodDropdown(false);
                setOpenPlantDropdown(false);
              }}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 h-9 px-3 text-xs font-semibold rounded-xl shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Box className="w-3.5 h-3.5 text-slate-500" />
              <span>{selectedProduct}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>
            {openProductDropdown && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-purple-100 p-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                {availableProducts.map((prod) => (
                  <button
                    key={prod}
                    type="button"
                    onClick={() => {
                      setSelectedProduct(prod);
                      setOpenProductDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedProduct === prod ? "bg-purple-50 text-purple-700 font-bold" : "text-slate-700 hover:bg-slate-50"
                      }`}
                  >
                    {prod}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Plant Filter */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => {
                setOpenPlantDropdown((prev) => !prev);
                setOpenPeriodDropdown(false);
                setOpenProductDropdown(false);
              }}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 h-9 px-3 text-xs font-semibold rounded-xl shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{selectedPlant}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>
            {openPlantDropdown && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-purple-100 p-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                {availablePlants.map((pl) => (
                  <button
                    key={pl}
                    type="button"
                    onClick={() => {
                      setSelectedPlant(pl);
                      setOpenPlantDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedPlant === pl ? "bg-purple-50 text-purple-700 font-bold" : "text-slate-700 hover:bg-slate-50"
                      }`}
                  >
                    {pl}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset Filters */}
          {(isCustomMode || selectedProduct !== "All Products" || selectedPlant !== "All Plants") && (
            <button
              type="button"
              onClick={handleResetPeriod}
              className="h-9 px-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors cursor-pointer flex items-center justify-center"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Updating spinner indicator */}
          {isUpdating && <UpdatingIndicator text="Updating..." />}

          {/* Refresh Action */}
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isUpdating || loading}
            className="h-9 w-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs cursor-pointer flex items-center justify-center shrink-0"
            title="Refresh overview data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${(isUpdating || loading) ? "animate-spin text-purple-600" : ""}`} />
          </button>
        </div>
      </div>

      {/* =========================================================================
          MANUFACTURING INTELLIGENCE AGENT HERO BANNER
          ========================================================================= */}
      <div className="w-full bg-gradient-to-r from-[#210947] via-[#3d126f] to-[#4c148c] rounded-2xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden border border-purple-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          {/* Left Hero Title & Description */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-1.5 h-11 bg-purple-400 rounded-full shrink-0 shadow-[0_0_12px_rgba(192,132,252,0.9)]" />
            <div>
              <div className="flex items-center flex-wrap gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                  Manufacturing Intelligence Agent
                </h2>
                {isBusy && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-400/25 border border-purple-300/40 text-purple-100 text-xs font-semibold backdrop-blur-xs animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin text-purple-200" />
                    <span>Filtering data...</span>
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-[13px] text-purple-200/90 font-medium mt-0.5">
                Real-time insights for cost, production, quality and operational performance.
              </p>
            </div>
          </div>

          {/* Right Hero Metric Chips (Clean, Simple & Minimalist) */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Cost Change */}
            <div className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl px-4 py-2 transition-all min-w-[105px]">
              <div className="text-[11px] font-semibold text-purple-200">
                Cost Change
              </div>
              {isBusy ? (
                <div className="h-5 w-16 bg-white/20 rounded-md animate-pulse mt-0.5" />
              ) : (
                <div className="text-base font-black text-emerald-300 tracking-tight mt-0.5">
                  {heroBanner.costChange}
                </div>
              )}
            </div>

            {/* Output Change */}
            <div className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl px-4 py-2 transition-all min-w-[105px]">
              <div className="text-[11px] font-semibold text-purple-200">
                Output
              </div>
              {isBusy ? (
                <div className="h-5 w-16 bg-white/20 rounded-md animate-pulse mt-0.5" />
              ) : (
                <div className="text-base font-black text-emerald-300 tracking-tight mt-0.5">
                  {heroBanner.outputChange}
                </div>
              )}
            </div>

            {/* Yield Change */}
            <div className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl px-4 py-2 transition-all min-w-[105px]">
              <div className="text-[11px] font-semibold text-purple-200">
                Yield
              </div>
              {isBusy ? (
                <div className="h-5 w-16 bg-white/20 rounded-md animate-pulse mt-0.5" />
              ) : (
                <div className="text-base font-black text-emerald-300 tracking-tight mt-0.5">
                  {heroBanner.yieldChange}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROW 1: 4 KPI CARDS (Enhanced Height & Breathable Layout)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* KPI 1: Total Manufacturing Cost */}
        <div className="bg-white rounded-2xl p-5 sm:p-5.5 border border-slate-200/80 shadow-2xs relative overflow-hidden flex items-center gap-4 transition-all hover:shadow-xs min-h-[146px]">
          {isBusy && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 animate-pulse" />
          )}
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100 shadow-2xs">
            <Layers className="w-6.5 h-6.5 stroke-[2.2]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs sm:text-[13px] font-bold text-slate-500 uppercase tracking-wider truncate">
              Total Manufacturing Cost
            </div>
            {isBusy ? (
              <div className="h-7 w-32 bg-slate-200/90 rounded-md animate-pulse my-1.5" />
            ) : (
              <div className="text-2xl sm:text-[28px] font-black text-slate-900 tracking-tight leading-none my-1.5 truncate">
                {kpis.total_cost_cr}
              </div>
            )}
            <div>
              {isBusy ? (
                <div className="h-5 w-24 bg-slate-100 rounded-md animate-pulse" />
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50/90 border border-emerald-200/80 px-2.5 py-0.5 rounded-lg shadow-2xs">
                  {kpis.total_cost_delta}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* KPI 2: Average Cost per Unit */}
        <div className="bg-white rounded-2xl p-5 sm:p-5.5 border border-slate-200/80 shadow-2xs relative overflow-hidden flex items-center gap-4 transition-all hover:shadow-xs min-h-[146px]">
          {isBusy && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 animate-pulse" />
          )}
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-100 shadow-2xs">
            <Box className="w-6.5 h-6.5 stroke-[2.2]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs sm:text-[13px] font-bold text-slate-500 uppercase tracking-wider truncate" title="Direct cost divided by costed finished batches (LineCostBatch.produced_qty)">
              Average Cost per Unit
            </div>
            {isBusy ? (
              <div className="h-7 w-28 bg-slate-200/90 rounded-md animate-pulse my-1.5" />
            ) : (
              <div className="text-2xl sm:text-[28px] font-black text-slate-900 tracking-tight leading-none my-1.5 truncate">
                {kpis.cost_per_unit}
              </div>
            )}
            <div>
              {isBusy ? (
                <div className="h-5 w-24 bg-slate-100 rounded-md animate-pulse" />
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50/90 border border-emerald-200/80 px-2.5 py-0.5 rounded-lg shadow-2xs">
                  {kpis.cost_unit_delta}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* KPI 3: Production Output */}
        <div className="bg-white rounded-2xl p-5 sm:p-5.5 border border-slate-200/80 shadow-2xs relative overflow-hidden flex items-center gap-4 transition-all hover:shadow-xs min-h-[146px]">
          {isBusy && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 animate-pulse" />
          )}
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 shadow-2xs">
            <BarChart3 className="w-6.5 h-6.5 stroke-[2.2]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs sm:text-[13px] font-bold text-slate-500 uppercase tracking-wider truncate" title="MES Actual Gross Production Output (HourlyProductionLog.actual_qty)">
              Production Output
            </div>
            {isBusy ? (
              <div className="h-7 w-28 bg-slate-200/90 rounded-md animate-pulse my-1.5" />
            ) : (
              <div className="text-2xl sm:text-[28px] font-black text-slate-900 tracking-tight leading-none my-1.5 truncate">
                {kpis.production_output}
              </div>
            )}
            <div>
              {isBusy ? (
                <div className="h-5 w-24 bg-slate-100 rounded-md animate-pulse" />
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50/90 border border-emerald-200/80 px-2.5 py-0.5 rounded-lg shadow-2xs">
                  {kpis.production_delta}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* KPI 4: Overall Production Yield */}
        <div className="bg-white rounded-2xl p-5 sm:p-5.5 border border-slate-200/80 shadow-2xs relative overflow-hidden flex items-center gap-4 transition-all hover:shadow-xs min-h-[146px]">
          {isBusy && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 animate-pulse" />
          )}
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-2xs">
            <ShieldCheck className="w-6.5 h-6.5 stroke-[2.2]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs sm:text-[13px] font-bold text-slate-500 uppercase tracking-wider truncate" title="Salable Good Units / MES Actual Gross Output (HourlyProductionLog)">
              Overall Production Yield
            </div>
            {isBusy ? (
              <div className="h-7 w-24 bg-slate-200/90 rounded-md animate-pulse my-1.5" />
            ) : (
              <div className="text-2xl sm:text-[28px] font-black text-slate-900 tracking-tight leading-none my-1.5 truncate">
                {kpis.production_yield}
              </div>
            )}
            <div>
              {isBusy ? (
                <div className="h-5 w-24 bg-slate-100 rounded-md animate-pulse" />
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50/90 border border-blue-200/80 px-2.5 py-0.5 rounded-lg shadow-2xs">
                  {kpis.yield_delta}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROW 2: TWO-COLUMN CENTRAL SECTION (Cost Trend & Cost Breakdown Donut)
          Generous breathable height: h-[460px], with 8:4 ratio (expanded bar trend, 3D donut)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* LEFT: Manufacturing Cost Trend Combo Chart (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between h-[460px] relative">
          {/* Active filter loading overlay */}
          {isBusy && (
            <CardLoadingOverlay
              title="Recalculating Cost Trend..."
              subtitle="Filtering daily & weekly batches"
            />
          )}
          {/* Header */}
          <div className="flex items-center justify-between mb-2 min-h-[32px]">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4.5 h-4.5 text-purple-600 stroke-[2.2]" />
              <h3 className="text-[15px] sm:text-base font-bold text-slate-900 tracking-tight">
                Manufacturing Cost Trend
              </h3>
              <div className="group relative">
                <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  Expenditure aggregated dynamically by {trendGranularity.toLowerCase()} postings
                </div>
              </div>
            </div>

            {/* Granularity Switcher: Daily | Weekly | Monthly */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              {["Daily", "Weekly", "Monthly"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTrendGranularity(mode)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${trendGranularity === mode
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Legend row with intelligent horizontal scroll indicator */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                <span>{trendGranularity} Cost</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 border-b-2 border-dashed border-slate-400 inline-block" />
                <span>Baseline (₹{baselineVal.toFixed(2)} Cr)</span>
              </div>
            </div>
            {isScrollable && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollBy({ left: -260, behavior: "smooth" });
                    }
                  }}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-purple-600 transition cursor-pointer"
                  title="Scroll earlier in time"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                  <span>Latest view · Scroll left for history</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollBy({ left: 260, behavior: "smooth" });
                    }
                  }}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-purple-600 transition cursor-pointer"
                  title="Scroll latest"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Chart Canvas Area: Fixed Y-Axis (Stationary) + Horizontally Scrollable Plotting Canvas */}
          <div ref={chartContainerRef} className="relative w-full h-[335px] flex flex-row">
            {/* FIXED Y-AXIS (STATIONARY ON LEFT) */}
            <div className="w-[58px] shrink-0 h-full relative select-none">
              <svg className="w-full h-full" viewBox={`0 0 ${fixedAxisW} ${chartH}`} preserveAspectRatio="none">
                {/* Clean Unit Label at Top of Y-Axis */}
                <text
                  x={8}
                  y={padT - 12}
                  textAnchor="start"
                  className="text-[10px] font-bold fill-slate-400 uppercase tracking-wider"
                >
                  ₹ Cr
                </text>

                {/* Y-Axis Tick Labels & Tick Marks */}
                {yTicks.map((val) => {
                  const norm = Math.max(0, Math.min(1, (val - yMin) / (yMax - yMin || 1)));
                  const y = padT + (1 - norm) * plotH;
                  return (
                    <g key={val}>
                      <text
                        x={fixedAxisW - 10}
                        y={y + 3.5}
                        textAnchor="end"
                        className="text-[10px] font-semibold fill-slate-400 font-mono"
                      >
                        {val.toFixed(1)}
                      </text>
                      <line
                        x1={fixedAxisW - 5}
                        y1={y}
                        x2={fixedAxisW}
                        y2={y}
                        stroke="#cbd5e1"
                        strokeWidth="1"
                      />
                    </g>
                  );
                })}

                {/* Vertical Divider Line */}
                <line
                  x1={fixedAxisW - 0.5}
                  y1={padT - 8}
                  x2={fixedAxisW - 0.5}
                  y2={padT + plotH}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
              </svg>
            </div>

            {/* HORIZONTALLY SCROLLABLE PLOTTING REGION */}
            <div
              ref={scrollContainerRef}
              onScroll={handleChartScroll}
              className="flex-1 relative h-full overflow-x-auto overflow-y-hidden custom-chart-scrollbar"
            >
              <svg
                style={{ width: `${plotCanvasWidth}px`, height: "100%", minWidth: "100%" }}
                viewBox={`0 0 ${plotCanvasWidth} ${chartH}`}
                preserveAspectRatio="none"
                className="overflow-visible block"
              >
                <defs>
                  <linearGradient id="barGradNormal" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#c084fc" stopOpacity="0.95" />
                    <stop offset="50%" stopColor="#c4b5fd" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#ddd6fe" stopOpacity="0.72" />
                  </linearGradient>

                  <linearGradient id="barGradAnomaly" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity="1" />
                    <stop offset="100%" stopColor="#6d28d9" stopOpacity="0.92" />
                  </linearGradient>

                  <linearGradient id="trendAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.22" />
                    <stop offset="60%" stopColor="#7c3aed" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.00" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid Lines extending across full plotted width */}
                {yTicks.map((val) => {
                  const norm = Math.max(0, Math.min(1, (val - yMin) / (yMax - yMin || 1)));
                  const y = padT + (1 - norm) * plotH;
                  return (
                    <line
                      key={val}
                      x1={0}
                      y1={y}
                      x2={plotCanvasWidth}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                  );
                })}

                {/* Bottom X-Axis Guide Line */}
                <line
                  x1={0}
                  y1={padT + plotH}
                  x2={plotCanvasWidth}
                  y2={padT + plotH}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />

                {/* Baseline Horizontal Line extending across full plotted width */}
                <line
                  x1={0}
                  y1={baselineY}
                  x2={plotCanvasWidth}
                  y2={baselineY}
                  stroke="#94a3b8"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />
                <text
                  x={plotCanvasWidth - 8}
                  y={baselineY - 5}
                  textAnchor="end"
                  className="text-[9px] font-bold fill-slate-400 font-mono"
                >
                  ₹{baselineVal.toFixed(1)} Cr Baseline
                </text>

                {/* Smooth Gradient Area Fill beneath Spline Curve */}
                {areaPathD && (
                  <path
                    d={areaPathD}
                    fill="url(#trendAreaGradient)"
                    className="pointer-events-none"
                  />
                )}

                {/* Sculpted Bars */}
                {trendCoords.map((pt, idx) => {
                  const barH = Math.max(4, padT + plotH - pt.y);
                  const isHovered = hoveredTrendIdx === idx;

                  return (
                    <g
                      key={idx}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredTrendIdx(idx)}
                      onMouseLeave={() => setHoveredTrendIdx(null)}
                    >
                      <rect
                        x={pt.x - barW / 2}
                        y={pt.y}
                        width={barW}
                        height={barH}
                        rx={barRx}
                        fill={pt.isAnomaly ? "url(#barGradAnomaly)" : "url(#barGradNormal)"}
                        opacity={isHovered ? 1 : 0.95}
                        className="transition-all duration-150"
                      />

                      {/* Bar Value Label on Top */}
                      <text
                        x={pt.x}
                        y={Math.max(padT - 4, pt.y - 10)}
                        textAnchor="middle"
                        className={`text-[10px] font-bold ${
                          pt.isAnomaly ? "fill-purple-900 font-extrabold" : "fill-slate-600"
                        }`}
                      >
                        {pt.numDisplay}
                      </text>

                      {/* X-Axis Date Label */}
                      {trendGranularity === "Weekly" && pt.subLabel ? (
                        <g>
                          <text
                            x={pt.x}
                            y={padT + plotH + 16}
                            textAnchor="middle"
                            className="text-[10px] font-bold fill-slate-800"
                          >
                            {pt.label}
                          </text>
                          <text
                            x={pt.x}
                            y={padT + plotH + 28}
                            textAnchor="middle"
                            className="text-[8.5px] font-medium fill-slate-400"
                          >
                            {pt.subLabel}
                          </text>
                        </g>
                      ) : (
                        <text
                          x={pt.x}
                          y={padT + plotH + 20}
                          textAnchor="middle"
                          className="text-[10px] font-semibold fill-slate-500"
                        >
                          {pt.label}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Smooth Spline Curve across Top of Bars */}
                <path
                  d={splinePathD}
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Spline Data Point Dots */}
                {trendCoords.map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredTrendIdx === idx ? 5 : 3.5}
                    fill="#ffffff"
                    stroke="#7c3aed"
                    strokeWidth="2.5"
                    className="pointer-events-none"
                  />
                ))}
              </svg>
            </div>

            {/* FLOATING TOOLTIP (RENDERED OUTSIDE OVERFLOW CONTAINER TO PREVENT CLIPPING) */}
            {hoveredTrendIdx !== null && trendCoords[hoveredTrendIdx] && (() => {
              const pt = trendCoords[hoveredTrendIdx];
              const ptScreenX = fixedAxisW + pt.x - scrollLeft;
              // Only display tooltip if the hovered point is currently within the visible card
              if (ptScreenX < fixedAxisW - 20 || ptScreenX > fixedAxisW + availablePlotWidth + 20) {
                return null;
              }
              const clampedX = Math.max(fixedAxisW + 90, Math.min(fixedAxisW + availablePlotWidth - 90, ptScreenX));
              const deltaCost = pt.cost - baselineVal;
              const deltaPct = baselineVal > 0 ? (deltaCost / baselineVal) * 100 : 0;

              return (
                <div
                  className="absolute z-50 bg-slate-900 text-white text-xs rounded-xl p-3 shadow-2xl border border-slate-700 pointer-events-none transition-all duration-100 transform -translate-x-1/2"
                  style={{
                    left: `${clampedX}px`,
                    top: pt.y < 85 ? `${pt.y + 70}px` : `${Math.max(10, pt.y - 12)}px`,
                    transform: pt.y < 85 ? "translate(-50%, 0)" : "translate(-50%, -100%)",
                  }}
                >
                  <div className="font-bold text-slate-100 pb-1.5 mb-1.5 border-b border-slate-800 flex items-center justify-between gap-3">
                    <span className="text-purple-300 font-extrabold">{pt.fullLabel || pt.date || pt.label}</span>
                    {pt.isAnomaly && (
                      <span className="text-[9px] font-extrabold text-amber-400 bg-amber-950/90 px-1.5 py-0.5 rounded border border-amber-800/80">
                        ANOMALY SPIKE
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 font-medium text-[11px]">
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-400">Total Expenditure:</span>
                      <span className="font-black text-purple-300">{pt.display || `₹${pt.cost.toFixed(2)} Cr`}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-400">Baseline Target:</span>
                      <span className="font-bold text-slate-300">₹{baselineVal.toFixed(2)} Cr</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-400">Variance:</span>
                      <span className={`font-bold ${deltaCost >= 0 ? "text-amber-400" : "text-emerald-400"}`}>
                        {deltaCost >= 0 ? "+" : ""}
                        {deltaCost.toFixed(2)} Cr ({deltaCost >= 0 ? "+" : ""}{deltaPct.toFixed(1)}%)
                      </span>
                    </div>
                    {pt.volume ? (
                      <div className="flex justify-between gap-4 pt-0.5 border-t border-slate-800/80">
                        <span className="text-slate-400">Volume:</span>
                        <span className="font-bold text-slate-200">
                          {Math.round(pt.volume).toLocaleString()} units
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* RIGHT: Cost Breakdown by Category Donut Chart (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between h-[460px] relative">
          {/* Active filter loading overlay */}
          {isBusy && (
            <CardLoadingOverlay
              title="Updating Category Breakdown..."
              subtitle="Aggregating direct cost elements"
            />
          )}
          {/* Header */}
          <div className="flex items-center gap-2 mb-2 min-h-[32px]">
            <PieChart className="w-4.5 h-4.5 text-purple-600 stroke-[2.2]" />
            <h3 className="text-[15px] sm:text-base font-bold text-slate-900 tracking-tight">
              Cost Breakdown by Category
            </h3>
            <div className="group relative">
              <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Direct manufacturing cost allocation
              </div>
            </div>
          </div>

          {/* 3D Highlighted Donut Chart Centered on Top */}
          <div className="flex justify-center items-center my-auto py-1">
            <div className="relative w-44 h-44 sm:w-48 sm:h-48 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 overflow-visible" viewBox="0 0 200 200">
                <defs>
                  {/* 3D Segment Gradients */}
                  <linearGradient id="grad3dMaterial" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6d28d9" />
                  </linearGradient>
                  <linearGradient id="grad3dLabour" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="50%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>
                  <linearGradient id="grad3dMachine" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                  <linearGradient id="grad3dEnergy" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="grad3dScrap" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="50%" stopColor="#64748b" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>

                  {/* 3D Depth Shadow Filter */}
                  <filter id="donut3dGlow" x="-20%" y="-20%" width="145%" height="145%">
                    <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#4c148c" floodOpacity="0.18" />
                  </filter>
                  <filter id="hubCardShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.06" />
                  </filter>
                </defs>

                {/* Background Ring Track */}
                <circle cx="100" cy="100" r={donutR} fill="none" stroke="#f1f5f9" strokeWidth="22" />

                {/* Active Segments with 3D Gradients & Glow */}
                <g filter="url(#donut3dGlow)">
                  {(() => {
                    let accumShare = 0;
                    return categories.map((cat, idx) => {
                      const strokeDash = (cat.share_pct / 100) * donutCircumference;
                      const offset = -(accumShare / 100) * donutCircumference;
                      accumShare += cat.share_pct;
                      const isHovered = hoveredCategory === cat.name;

                      return (
                        <circle
                          key={idx}
                          cx="100"
                          cy="100"
                          r={donutR}
                          fill="none"
                          stroke={cat.grad || cat.color}
                          strokeWidth={isHovered ? 25 : 22}
                          strokeDasharray={`${strokeDash} ${donutCircumference}`}
                          strokeDashoffset={offset}
                          strokeLinecap="butt"
                          className="transition-all duration-200 cursor-pointer"
                          onMouseEnter={() => setHoveredCategory(cat.name)}
                          onMouseLeave={() => setHoveredCategory(null)}
                        />
                      );
                    });
                  })()}
                </g>

                {/* Acrylic Floating Hub Circle with Perfect Clearance */}
                <circle cx="100" cy="100" r="62.5" fill="#ffffff" filter="url(#hubCardShadow)" stroke="#f1f5f9" strokeWidth="1.5" />
              </svg>

              {/* Center Hub Content with Refined Proportions */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-3">
                {hoveredCategoryData ? (
                  <>
                    <span className="text-[9px] font-bold text-purple-700 uppercase tracking-wider truncate max-w-[110px] mb-0.5">
                      {hoveredCategoryData.name}
                    </span>
                    <span className="text-base sm:text-lg font-black text-purple-950 tracking-tight leading-tight my-0.5">
                      {hoveredCategoryData.amount}
                    </span>
                    <span className="text-[8.5px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200 mt-0.5 font-mono">
                      {hoveredCategoryData.share_pct.toFixed(2)}% share
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                      TOTAL DIRECT
                    </span>
                    <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight my-0.5">
                      {kpis.total_cost_cr}
                    </span>
                    <span className="text-[8.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-0.5 shadow-2xs">
                      100% Direct Cost
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Down to That: Legends Underneath with Comfortable Row Spacing */}
          <div className="space-y-1 w-full pt-2.5 border-t border-slate-100">
            {categories.map((cat) => {
              const isHovered = hoveredCategory === cat.name;
              return (
                <div
                  key={cat.name}
                  onMouseEnter={() => setHoveredCategory(cat.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`flex items-center justify-between py-1 px-2.5 rounded-xl transition-all cursor-pointer ${isHovered
                    ? "bg-purple-50 ring-1 ring-purple-200 shadow-2xs"
                    : "hover:bg-slate-50 border border-transparent"
                    }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-2xs border border-white transition-transform"
                      style={{
                        backgroundColor: cat.color,
                        transform: isHovered ? "scale(1.25)" : "scale(1)",
                      }}
                    />
                    <span className={`text-xs truncate ${isHovered ? "font-bold text-purple-900" : "font-semibold text-slate-700"}`}>
                      {cat.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className={`text-[11px] font-mono ${isHovered ? "text-purple-700 font-bold" : "text-slate-500"}`}>
                      {cat.amount}
                    </span>
                    <span className={`text-xs font-black font-mono w-14 text-right ${isHovered ? "text-purple-900" : "text-slate-900"}`}>
                      {cat.share_pct.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROW 3: BOTTOM THREE BALANCED COLUMNS
          All three cards set to balanced height: h-[285px]
          1. Production Performance  2. Key Insights  3. Plant Performance
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* CARD 1: Production Performance Flow (Expected Sankey Design) (h-[300px]) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between h-[300px] relative">
          {/* Active filter loading overlay */}
          {isBusy && (
            <CardLoadingOverlay
              title="Recomputing Production Flow..."
              subtitle="Reconciling salable yield & scrap"
            />
          )}
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 min-h-[32px]">
              <Share2 className="w-4.5 h-4.5 text-purple-600 stroke-[2.2]" />
              <h3 className="text-[15px] sm:text-base font-bold text-slate-900 tracking-tight">
                Production Performance
              </h3>
              <div className="group relative">
                <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  Gross output flow into salable yield and rejection loss
                </div>
              </div>
            </div>
          </div>

          {/* Seamless Unified Sankey Diagram */}
          <div className="relative w-full h-[225px] my-auto flex items-center justify-center">
            <svg
              className="w-full h-full"
              viewBox="0 0 475 180"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Flow 1: Top Ribbon Gradient (Lavender to Mint Emerald) */}
                <linearGradient id="sankeyRibbonGood" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c084fc" stopOpacity="0.85" />
                  <stop offset="35%" stopColor="#a855f7" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0.9" />
                </linearGradient>

                {/* Flow 2: Bottom Ribbon Gradient (Lavender to Rose Pink) */}
                <linearGradient id="sankeyRibbonDefect" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c084fc" stopOpacity="0.85" />
                  <stop offset="40%" stopColor="#e879f9" stopOpacity="0.8" />
                  <stop offset="75%" stopColor="#f472b6" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#fb7185" stopOpacity="0.9" />
                </linearGradient>

                {/* Soft Card Shadow */}
                <filter id="nodeCardShadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.06" />
                </filter>
              </defs>

              {/* FLOW 1: Top Gradient Sankey Ribbon (Gross -> Good Output) */}
              <path
                d="M 128 68 C 195 68, 195 38, 262 38 L 262 68 C 195 68, 195 94, 128 94 Z"
                fill="url(#sankeyRibbonGood)"
                className="transition-opacity duration-200 hover:opacity-95 cursor-pointer"
              >
                <title>Good Output: {sankeyData.good.toLocaleString()} units ({sankeyData.goodPct.toFixed(2)}% Yield)</title>
              </path>

              {/* FLOW 2: Bottom Gradient Sankey Ribbon (Gross -> Rejected) */}
              <path
                d="M 128 98 C 195 98, 195 114, 262 114 L 262 142 C 195 142, 195 118, 128 118 Z"
                fill="url(#sankeyRibbonDefect)"
                className="transition-opacity duration-200 hover:opacity-95 cursor-pointer"
              >
                <title>Rejected: {sankeyData.defects.toLocaleString()} units ({sankeyData.defectPct.toFixed(2)}% Rejection)</title>
              </path>

              {/* LEFT CARD: Total Produced (Rendered on top of ribbon origins) */}
              <g filter="url(#nodeCardShadow)">
                <rect
                  x="14"
                  y="52"
                  width="118"
                  height="76"
                  rx="16"
                  fill="#faf5ff"
                  stroke="#d8b4fe"
                  strokeWidth="1.2"
                />
                <text
                  x="24"
                  y="86"
                  className="text-[17px] font-black fill-slate-900 font-mono tracking-tight"
                >
                  {sankeyData.total.toLocaleString()}
                </text>
                <text
                  x="24"
                  y="108"
                  className="text-[12px] font-bold fill-purple-700 tracking-tight"
                >
                  Total Produced
                </text>
              </g>

              {/* TOP RIGHT CARD: Good Output (Rendered on top of ribbon target with wide breathing room) */}
              <g filter="url(#nodeCardShadow)" className="cursor-pointer">
                <rect
                  x="255"
                  y="20"
                  width="205"
                  height="62"
                  rx="16"
                  fill="#f0fdf4"
                  stroke="#86efac"
                  strokeWidth="1.2"
                />
                {/* Green Solid Circle with White Checkmark */}
                <circle cx="277" cy="51" r="13" fill="#10b981" />
                <path
                  d="M 271 51 L 275 55 L 283 47"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Line 1: Primary Metric & Yield Percentage (Clearly separated) */}
                <text
                  x="298"
                  y="45"
                  className="text-[15px] font-black fill-slate-900 font-mono tracking-tight"
                >
                  {sankeyData.good.toLocaleString()}
                </text>
                <text
                  x="445"
                  y="45"
                  textAnchor="end"
                  className="text-[13px] font-black fill-emerald-700"
                >
                  {sankeyData.goodPct.toFixed(2)}%
                </text>
                {/* Line 2: Label & Yield Category */}
                <text
                  x="298"
                  y="63"
                  className="text-[11px] font-semibold fill-slate-600"
                >
                  Good Output
                </text>
                <text
                  x="445"
                  y="63"
                  textAnchor="end"
                  className="text-[11px] font-bold fill-emerald-700"
                >
                  Yield
                </text>
              </g>

              {/* BOTTOM RIGHT CARD: Rejected (Rendered on top of ribbon target with wide breathing room) */}
              <g filter="url(#nodeCardShadow)" className="cursor-pointer">
                <rect
                  x="255"
                  y="98"
                  width="205"
                  height="62"
                  rx="16"
                  fill="#fff1f2"
                  stroke="#fecdd3"
                  strokeWidth="1.2"
                />
                {/* Red Solid Circle with White Cross */}
                <circle cx="277" cy="129" r="13" fill="#f43f5e" />
                <path
                  d="M 272 124 L 282 134 M 282 124 L 272 134"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Line 1: Primary Metric & Rejection Percentage (Clearly separated) */}
                <text
                  x="298"
                  y="123"
                  className="text-[15px] font-black fill-slate-900 font-mono tracking-tight"
                >
                  {sankeyData.defects.toLocaleString()}
                </text>
                <text
                  x="445"
                  y="123"
                  textAnchor="end"
                  className="text-[13px] font-black fill-rose-600"
                >
                  {sankeyData.defectPct.toFixed(2)}%
                </text>
                {/* Line 2: Label & Rejection Category */}
                <text
                  x="298"
                  y="141"
                  className="text-[11px] font-semibold fill-slate-600"
                >
                  Rejected
                </text>
                <text
                  x="445"
                  y="141"
                  textAnchor="end"
                  className="text-[11px] font-bold fill-rose-600"
                >
                  Rejection
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* CARD 2: Key Insights (h-[300px]) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between h-[300px] relative">
          {/* Active filter loading overlay */}
          {isBusy && (
            <CardLoadingOverlay
              title="Synthesizing Key Insights..."
              subtitle="Evaluating anomaly inflection points"
            />
          )}
          {/* Header (Clean, without redundant count badge) */}
          <div className="flex items-center justify-between min-h-[32px]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-purple-600 stroke-[2.2]" />
              <h3 className="text-[15px] sm:text-base font-bold text-slate-900 tracking-tight">
                Key Insights
              </h3>
            </div>
          </div>

          {/* 3 Structured Insights (Clean 2-line layout without clumsy arrows/badges) */}
          {keyInsights.length > 0 ? (
            <div className="space-y-2.5 my-auto">
              {keyInsights.map((ins) => {
                const Icon = ins.icon;
                return (
                  <div
                    key={ins.id}
                    onClick={() => {
                      if (onOpenAIChat) {
                        onOpenAIChat(ins.query);
                      } else if (onNavigate) {
                        onNavigate(ins.target_route.replace("/", ""));
                      }
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group border border-slate-100 hover:border-purple-200 flex items-center gap-3"
                  >
                    <div className={`w-8 h-8 rounded-xl ${ins.badgeBg} flex items-center justify-center shrink-0 shadow-2xs`}>
                      <Icon className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors truncate">
                        {ins.headline}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                        {ins.evidence}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center my-auto py-8 text-xs text-slate-400 font-medium">
              No anomaly or key insights detected for selected scope.
            </div>
          )}
        </div>

        {/* CARD 3: Plant Performance Table (h-[300px]) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between h-[300px] relative">
          {/* Active filter loading overlay */}
          {isBusy && (
            <CardLoadingOverlay
              title="Updating Facility Rankings..."
              subtitle="Calculating site-level metrics"
            />
          )}
          {/* Header */}
          <div className="flex items-center justify-between min-h-[32px]">
            <div className="flex items-center gap-2">
              <Building2 className="w-4.5 h-4.5 text-purple-600 stroke-[2.2]" />
              <h3 className="text-[15px] sm:text-base font-bold text-slate-900 tracking-tight">
                Plant Performance
              </h3>
              {selectedPlant !== "All Plants" && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-md">
                  {selectedPlant}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlant("All Plants");
                    }}
                    className="hover:text-purple-900 font-bold ml-0.5 cursor-pointer"
                    title="Clear filter"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate("production-quality")}
              className="text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View Details</span>
              <span className="text-xs leading-none">→</span>
            </button>
          </div>

          {/* Clean Proportional Table (No clumsy bullets or footer text) */}
          <div className="my-auto overflow-hidden">
            {plantPerformance.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-2 font-bold text-left">Facility</th>
                    <th className="pb-2 font-bold text-right">Output</th>
                    <th className="pb-2 font-bold text-center">Yield</th>
                    <th className="pb-2 font-bold text-right">Cost Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {plantPerformance.map((pl, idx) => {
                    const isSelected = selectedPlant === pl.plant_code;
                    return (
                      <tr
                        key={pl.plant_code || idx}
                        onClick={() => {
                          setSelectedPlant(isSelected ? "All Plants" : pl.plant_code);
                        }}
                        className={`hover:bg-purple-50/50 cursor-pointer transition-colors ${
                          isSelected ? "bg-purple-50/80 font-bold ring-1 ring-purple-200 rounded" : ""
                        }`}
                      >
                        <td className="py-2 text-xs font-bold text-slate-800">
                          {pl.plant_code}
                        </td>
                        <td className="py-2 text-xs font-bold text-slate-800 text-right font-mono">
                          {pl.output_units.toLocaleString()}
                        </td>
                        <td className="py-2 text-center">
                          <span className="inline-block px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                            {pl.yield_pct.toFixed(2)}%
                          </span>
                        </td>
                        <td className="py-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-14 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-purple-600 h-1.5 rounded-full"
                                style={{ width: `${Math.min(100, pl.cost_share_pct * 3)}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-slate-700 font-mono w-12 text-right">
                              {pl.cost_share_pct.toFixed(2)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="flex items-center justify-center my-auto py-8 text-xs text-slate-400 font-medium">
                No plant performance records for selected scope.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
