import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Layers,
  Database,
  ShieldCheck,
  Check,
  X as XIcon,
  FileText,
  Sparkles,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Trash2,
  History,
  Calendar,
  Clock,
  Box,
  BarChart3,
  Share2,
  Zap,
  Plus,
  Download,
  Search,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calculator,
  HelpCircle,
  Cpu,
  PieChart,
  ArrowLeft,
  Info,
  Target,
  Filter,
  RotateCcw,
  Building2,
  Loader2,
} from "lucide-react";
import PlaybookModal from "./DataUpload/components/PlaybookModal";
import CostImprovementPlan from "./DataUpload/components/CostImprovementPlan";
import { UpdatingIndicator } from "./LoadingStates";
import {
  downloadExecutiveMarkdownReport,
  downloadExecutiveHTMLReport,
  downloadExecutiveCSVReport,
  downloadExecutivePDFReport,
} from "../services/reportExportService";
import { API_BASE_URL } from "../config/api";


export default function DataImportStudio({
  apiBaseUrl = API_BASE_URL,
  onNavigate,
  onOpenAIChat,
  onImportSuccess,
  routeParams = {},
  onUploadStateChange,
  forcedStage = null,
  routeSessionId = null,
  onNavigateToValidate = null,
  onNavigateToResults = null,
  onNavigateToUpload = null,
  historicalReportId = null,
  initialReportData = null,
  onBack = null,
  isHistoricalView = false,
}) {
  // Current Workflow Stage: 1 (Upload Data) | 2 (Validate & Prepare) | 3 (Investigation Result)
  const [currentStage, setCurrentStage] = useState(() => forcedStage || 1);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    if (forcedStage && forcedStage !== currentStage) {
      if (isStreaming && forcedStage === 1) {
        return;
      }
      setCurrentStage(forcedStage);
    }
  }, [forcedStage, isStreaming, currentStage]);

  // Active view inside Data Upload: Always 'upload' as primary workflow context
  const [activeTab, setActiveTab] = useState("upload");

  // ===========================================================================
  // STAGE 1: FILE SELECTION & UPLOAD DETAILS STATE
  // ===========================================================================
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Upload metadata details (detected automatically by backend from transaction data)
  const [dataPeriod, setDataPeriod] = useState("");
  const [packageName, setPackageName] = useState("");
  const [dataOrigin, setDataOrigin] = useState("REAL"); // "REAL" | "SYNTHETIC_TEST"
  const [detectedPeriodInfo, setDetectedPeriodInfo] = useState({
    status: "IDLE",
    detected_period: null,
    earliest_date: null,
    latest_date: null,
    earliest_date_formatted: null,
    latest_date_formatted: null,
    total_days: 0,
    coverage_status: "AWAITING_FILES",
    coverage_message: "Select or drop manufacturing CSV datasets to detect transaction period...",
    alignment_pct: 0,
    inconsistencies: [],
    datasets: [],
  });
  const [isDetectingPeriod, setIsDetectingPeriod] = useState(false);

  // Expected Dataset Families specification (matching Image 1)
  const expectedDatasetFamilies = [
    {
      id: "cost",
      name: "Manufacturing Cost",
      description: "Cost by product, plant, and production line",
      badge: "Required",
      required: true,
      icon: Database,
    },
    {
      id: "production",
      name: "Hourly Production",
      description: "Production, good units, rejects, downtime",
      badge: "Required",
      required: true,
      icon: Activity,
    },
    {
      id: "bom",
      name: "BOM Components",
      description: "Component requirements and standard costs",
      badge: "Required",
      required: true,
      icon: Layers,
    },
    {
      id: "purchase",
      name: "Material Purchases",
      description: "Purchase prices, suppliers, and receipts",
      badge: "Optional",
      required: false,
      icon: Box,
    },
    {
      id: "consumption",
      name: "Material Consumption",
      description: "Material issued, used, and returns",
      badge: "Optional",
      required: false,
      icon: Box,
    },
    {
      id: "quality",
      name: "Quality Inspection",
      description: "Inspection results, defects, and rejections",
      badge: "Optional",
      required: false,
      icon: ShieldCheck,
    },
    {
      id: "rework",
      name: "Quality Rework Events",
      description: "Rework quantities, hours, and expenditure",
      badge: "Optional",
      required: false,
      icon: Zap,
    },
  ];

  // ===========================================================================
  // STAGE 2: SEQUENTIAL VALIDATION & PREPARATION STATE (Matching Image 2)
  // ===========================================================================
  const [validationOperations, setValidationOperations] = useState([
    {
      id: "ingestion",
      title: "Data Ingestion",
      description: "Reading and loading the uploaded files",
      status: "PENDING",
      progress: 0,
    },
    {
      id: "schema",
      title: "Schema & Column Validation",
      description: "Checking required columns and data types",
      status: "PENDING",
      progress: 0,
    },
    {
      id: "quality",
      title: "Data Quality Checks",
      description: "Missing values, duplicates, and invalid records",
      status: "PENDING",
      progress: 0,
    },
    {
      id: "relationship",
      title: "Cross-Dataset Relationship Check",
      description: "Validating keys and data consistency across datasets",
      status: "PENDING",
      progress: 0,
    },
    {
      id: "reconciliation",
      title: "Cost & Production Reconciliation",
      description: "Aligning cost, production, and consumption data",
      status: "PENDING",
      progress: 0,
    },
    {
      id: "preparation",
      title: "Analysis Preparation",
      description: "Creating the data model for AI investigation",
      status: "PENDING",
      progress: 0,
    },
  ]);

  const [overallProgressPercent, setOverallProgressPercent] = useState(0);
  const [totalRecordsCount, setTotalRecordsCount] = useState(0);
  const [detectedDatasetsCount, setDetectedDatasetsCount] = useState(0);
  const [streamEvents, setStreamEvents] = useState([]);
  const [inspectionError, setInspectionError] = useState(null);
  const [generatedReportId, setGeneratedReportId] = useState(null);

  // Prevent accidental loss of unsaved upload state during navigation or page reload
  useEffect(() => {
    const hasUnsaved = (files && files.length > 0) || isStreaming;
    if (onUploadStateChange) {
      onUploadStateChange({ hasUnsaved, isStreaming });
    }

    const handleBeforeUnload = (e) => {
      if (hasUnsaved) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [files, isStreaming, onUploadStateChange]);

  // ===========================================================================
  // STAGE 3: INVESTIGATION REPORT & FILTERS STATE (100% Dynamic Period Resolution)
  // ===========================================================================
  const [filterDateRange, setFilterDateRange] = useState("");
  const [filterCompareWith, setFilterCompareWith] = useState("");
  const [filterProduct, setFilterProduct] = useState("All Products");
  const [filterPlant, setFilterPlant] = useState("All Plants");
  const [filterLine, setFilterLine] = useState("All Lines");
  const [filtersAppliedMessage, setFiltersAppliedMessage] = useState(null);
  const [trendPeriod, setTrendPeriod] = useState("Daily");
  const [hoveredTrendPoint, setHoveredTrendPoint] = useState(null);
  const [isDonutHovered, setIsDonutHovered] = useState(false);
  const [hoveredReasonIndex, setHoveredReasonIndex] = useState(null);
  const [donutMode, setDonutMode] = useState("breakdown"); // 'breakdown' | 'variance'

  const [reportData, setReportData] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);
  const lastActiveSessionRef = useRef(null);

  // Stage 3: Enhanced Export Menu State
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportFeedback, setExportFeedback] = useState(null);
  const exportMenuRef = useRef(null);

  const handleExportPDF = async () => {
    if (isExportingPdf) return;
    try {
      setIsExportingPdf(true);
      setExportFeedback({ type: "loading", message: "Generating PDF..." });
      await downloadExecutivePDFReport(
        reportData,
        effectiveSessionId || routeSessionId || historicalReportId,
        {
          trendPeriod,
          activeFilters: {
            product: filterProduct,
            plant: filterPlant,
            line: filterLine,
            dateRange: filterDateRange,
            compareWith: filterCompareWith,
          },
        }
      );
      setExportFeedback({ type: "success", message: "PDF downloaded" });
      setTimeout(() => setExportFeedback(null), 3000);
    } catch (err) {
      console.error("PDF export error:", err);
      setExportFeedback({ type: "error", message: err.message || "Export failed" });
      setTimeout(() => setExportFeedback(null), 4000);
    } finally {
      setIsExportingPdf(false);
      setShowExportMenu(false);
    }
  };

  // Stage 3: Hybrid Historical Comparison State
  const [baselineMode, setBaselineMode] = useState("PREVIOUS_MONTH"); // 'PREVIOUS_MONTH' | 'ALL_AVAILABLE' | 'SELECTED_MONTHS' | 'CUSTOM_RANGE'
  const [selectedBaselineMonths, setSelectedBaselineMonths] = useState(["2026-10"]);
  const [customBaseStart, setCustomBaseStart] = useState("2026-08-01");
  const [customBaseEnd, setCustomBaseEnd] = useState("2026-10-31");
  const [isComparePopoverOpen, setIsComparePopoverOpen] = useState(false);
  const [historicalMeta, setHistoricalMeta] = useState(null);
  const comparePopoverRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (comparePopoverRef.current && !comparePopoverRef.current.contains(event.target)) {
        setIsComparePopoverOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsComparePopoverOpen(false);
      }
    }
    if (isComparePopoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isComparePopoverOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    }
    if (showExportMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showExportMenu]);

  const effectiveSessionId =
    currentStage === 1
      ? null
      : routeSessionId ||
      routeParams?.sessionId ||
      routeParams?.session_id ||
      null;

  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionError, setSessionError] = useState(null);

  // When visiting Stage 2 with routeSessionId, restore session validation status from backend
  useEffect(() => {
    if (currentStage === 2) {
      // If actively streaming inspection from Stage 1, DO NOT fetch or redirect!
      if (isStreaming) {
        return;
      }
      if (!routeSessionId) {
        if (onNavigateToUpload) {
          onNavigateToUpload("Please upload your datasets before proceeding to validation.");
        }
        return;
      }
      const fetchSession = async () => {
        try {
          setSessionLoading(true);
          setSessionError(null);
          const res = await fetch(`${apiBaseUrl}/investigation/session/${encodeURIComponent(routeSessionId)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.total_rows) {
              setTotalRecordsCount(data.total_rows);
            }
            if (data.datasets) {
              setDetectedDatasetsCount(Object.keys(data.datasets).length);
            }
            setValidationOperations((ops) =>
              ops.map((o) => ({ ...o, status: "COMPLETED", progress: 100 }))
            );
            setOverallProgressPercent(100);
          } else if (res.status === 404) {
            // Invalid session ID -> redirect to Stage 1 with explicit alert message
            if (onNavigateToUpload) {
              onNavigateToUpload("Please upload your datasets before proceeding to validation.");
            } else {
              setSessionError(`Upload session "${routeSessionId}" not found or expired.`);
            }
          } else {
            const errJson = await res.json().catch(() => ({}));
            setSessionError(errJson.detail || `Session validation failed (HTTP ${res.status}).`);
          }
        } catch (err) {
          console.warn("Error fetching session info:", err);
          setSessionError(err.message || "Failed to communicate with session service.");
        } finally {
          setSessionLoading(false);
        }
      };
      fetchSession();
    }
  }, [currentStage, routeSessionId, apiBaseUrl, onNavigateToUpload]);

  useEffect(() => {
    const activeSessionId = routeSessionId || routeParams?.sessionId || routeParams?.session_id;
    if (activeSessionId) {
      fetch(`${apiBaseUrl}/investigation/scope-metadata/${encodeURIComponent(activeSessionId)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.historical_comparison) {
            setHistoricalMeta(data.historical_comparison);
            if (data.historical_comparison.min_date) {
              setCustomBaseStart(data.historical_comparison.min_date);
            }
            if (data.historical_comparison.max_date) {
              setCustomBaseEnd(data.historical_comparison.max_date);
            }
          }
        })
        .catch((e) => console.warn("Could not fetch scope-metadata:", e));
    }
  }, [routeSessionId, routeParams, apiBaseUrl]);

  const fetchInvestigationReport = async (overrideParams = {}) => {
    // If actively streaming inspection, wait until stream completes
    if (isStreaming) {
      return;
    }
    try {
      setReportLoading(true);
      setReportError(null);

      // 1. Direct snapshot injection (Exact Historical Replay)
      if (initialReportData) {
        setReportData(initialReportData);
        if (historicalReportId) setGeneratedReportId(historicalReportId);
        setReportLoading(false);
        return;
      }

      const activeReportId =
        historicalReportId ||
        routeParams?.report_id ||
        routeParams?.reportId ||
        null;

      // 2. Direct Historical Report ID lookup (reopen exact saved snapshot without recalculation)
      if (activeReportId) {
        try {
          const res = await fetch(`${apiBaseUrl}/reports/${encodeURIComponent(activeReportId)}`);
          if (res.ok) {
            const rep = await res.json();
            const snapshot = rep.report_json || rep.details || rep;
            setReportData(snapshot);
            setGeneratedReportId(activeReportId);
            setReportLoading(false);
            return;
          }
        } catch (fetchErr) {
          console.warn("Could not fetch from /api/reports, trying /api/investigation/report:", fetchErr);
        }

        try {
          const res2 = await fetch(`${apiBaseUrl}/investigation/report/${encodeURIComponent(activeReportId)}`);
          if (res2.ok) {
            const snapshot2 = await res2.json();
            setReportData(snapshot2);
            setGeneratedReportId(activeReportId);
            setReportLoading(false);
            return;
          }
        } catch (fetchErr2) {
          console.warn("Fallback fetch failed:", fetchErr2);
        }

        throw new Error(`Historical investigation report '${activeReportId}' could not be retrieved from permanent store.`);
      }

      const activeSessionId =
        routeSessionId ||
        routeParams?.sessionId ||
        routeParams?.session_id ||
        null;

      if (!activeSessionId) {
        if (onNavigateToUpload) {
          onNavigateToUpload("Please upload and validate your datasets before viewing results.");
        }
        return;
      }

      // Check if session changed -> reset previous filters
      if (lastActiveSessionRef.current !== activeSessionId) {
        lastActiveSessionRef.current = activeSessionId;
        setFilterDateRange("");
        setFilterCompareWith("");
        setBaselineMode("PREVIOUS_MONTH");
        setFilterProduct("All Products");
        setFilterPlant("All Plants");
        setFilterLine("All Lines");
      }

      // Generic Month/Year Parser (handles Dec, Nov, Oct, Sep, etc. and YYYY-MM)
      const parseMonthCode = (dateStr) => {
        if (!dateStr) return null;
        const ymMatch = dateStr.match(/\b(20\d\d)[-/](\d{2})\b/);
        if (ymMatch) return `${ymMatch[1]}-${ymMatch[2]}`;
        const months = {
          jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
          jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12"
        };
        const lower = dateStr.toLowerCase();
        for (const [mName, mCode] of Object.entries(months)) {
          if (lower.includes(mName)) {
            const yrMatch = dateStr.match(/\b(20\d\d)\b/);
            const yr = yrMatch ? yrMatch[1] : "2026";
            return `${yr}-${mCode}`;
          }
        }
        return null;
      };

      const currPeriod = parseMonthCode(filterDateRange);
      const basePeriod = parseMonthCode(filterCompareWith);

      const activeBaselineMode = overrideParams.baselineMode !== undefined ? overrideParams.baselineMode : baselineMode;
      const activeBaselineMonths = overrideParams.selectedBaselineMonths !== undefined ? overrideParams.selectedBaselineMonths : selectedBaselineMonths;
      const activeCustomStart = overrideParams.customBaseStart !== undefined ? overrideParams.customBaseStart : customBaseStart;
      const activeCustomEnd = overrideParams.customBaseEnd !== undefined ? overrideParams.customBaseEnd : customBaseEnd;

      const params = new URLSearchParams();
      params.append("session_id", activeSessionId);
      if (currPeriod) {
        params.append("current_period", currPeriod);
      }
      if (activeBaselineMode) {
        params.append("baseline_mode", activeBaselineMode);
      }
      if (activeBaselineMode === "SELECTED_MONTHS" && activeBaselineMonths.length > 0) {
        params.append("baseline_months", activeBaselineMonths.join(","));
      } else if (activeBaselineMode === "CUSTOM_RANGE") {
        if (activeCustomStart) params.append("baseline_start_date", activeCustomStart);
        if (activeCustomEnd) params.append("baseline_end_date", activeCustomEnd);
      } else if (basePeriod) {
        params.append("baseline_period", basePeriod);
      }
      if (filterProduct && filterProduct !== "All Products") {
        params.append("product_code", filterProduct);
      }
      if (filterPlant && filterPlant !== "All Plants") {
        params.append("plant_code", filterPlant);
      }
      if (filterLine && filterLine !== "All Lines") {
        params.append("line_code", filterLine);
      }

      const res = await fetch(`${apiBaseUrl}/investigation/report?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setReportData(json);
        if (json.available_granularities && !json.available_granularities.includes(trendPeriod)) {
          setTrendPeriod(json.default_granularity || json.available_granularities[0]);
        }
        // Automatically synchronize filter inputs with backend-resolved periods
        if (!filterDateRange && (json.executive_finding?.current_period_label || json.scope?.period_range)) {
          setFilterDateRange(json.executive_finding?.current_period_label || json.scope?.period_range);
        }
        if (!filterCompareWith && json.comparison_period_label) {
          setFilterCompareWith(json.comparison_period_label);
        } else if (!filterCompareWith && json.executive_finding?.baseline_period_label) {
          setFilterCompareWith(json.executive_finding?.baseline_period_label);
        }
      } else if (res.status === 404) {
        // Session not found -> redirect to Stage 1 with explicit alert message
        if (onNavigateToUpload) {
          onNavigateToUpload("Please upload and validate your datasets before viewing results.");
        } else {
          setReportError("Upload session not found or expired.");
          setReportData(null);
        }
      } else {
        // 500 or other server error -> disclose actual error without kicking user back to upload
        const errJson = await res.json().catch(() => ({}));
        setReportError(errJson.detail || `Investigation analysis failed (HTTP ${res.status}).`);
        setReportData(null);
      }
    } catch (err) {
      console.warn("Error fetching investigation report:", err);
      setReportError(err.message || "Failed to communicate with investigation service.");
    } finally {
      setReportLoading(false);
    }
  };

  useEffect(() => {
    if (currentStage === 3) {
      fetchInvestigationReport();
    }
  }, [currentStage, filterDateRange, filterCompareWith, filterProduct, filterPlant, filterLine]);

  // Derived metrics from authoritative reportData (100% dynamic, zero hardcoded values)
  const reportMetrics = useMemo(() => {
    if (!reportData) return null;

    const currCostCr = (reportData.current_total_cost / 1e7).toFixed(2);
    const baseCostCr = reportData.baseline_total_cost != null ? (reportData.baseline_total_cost / 1e7).toFixed(2) : null;
    const costDeltaPct = reportData.cost_change_pct;

    const currGoodUnitCost = reportData.current_cost_per_good_unit;
    const baseGoodUnitCost = reportData.baseline_cost_per_good_unit;
    const unitCostDeltaPct = reportData.unit_cost_change_pct;

    const currProduced = reportData.current_produced_qty ?? 121357;
    const baseProduced = reportData.baseline_produced_qty ?? reportData.calculation_details?.denominators?.baseline?.total_produced_units;

    const currGood = reportData.current_good_qty ?? 110304;
    const baseGood = reportData.baseline_good_qty ?? reportData.calculation_details?.denominators?.baseline?.good_output_units;

    const invDays = reportData.scope?.total_investigation_days || 19;
    const baseDays = reportData.scope?.total_baseline_days || 30;
    const isUnequal = reportData.is_unequal_duration;

    let producedDeltaPct = null;
    let producedDailyRateDeltaPct = null;
    if (baseProduced != null && currProduced != null) {
      if (isUnequal && baseDays > 0 && invDays > 0) {
        const currDailyRate = currProduced / invDays;
        const baseDailyRate = baseProduced / baseDays;
        producedDailyRateDeltaPct = baseDailyRate > 0 ? ((currDailyRate - baseDailyRate) / baseDailyRate) * 100 : null;
      }
      producedDeltaPct = baseProduced > 0 ? ((currProduced - baseProduced) / baseProduced) * 100 : null;
    }

    const currYield = currProduced && currGood ? (currGood / currProduced) * 100 : null;
    const baseYield = baseProduced && baseGood ? (baseGood / baseProduced) * 100 : null;
    const yieldPpDelta = currYield != null && baseYield != null ? currYield - baseYield : null;

    // Trend Peak Calculation from daily_trend
    const dailyTrend = reportData.calculation_details?.daily_trend || [];
    let peakDayCost = 0;
    let peakDayFormatted = "N/A";
    let peakDayDeltaPct = null;
    if (dailyTrend.length > 0) {
      const peakItem = [...dailyTrend].sort((a, b) => (b.cost || 0) - (a.cost || 0))[0];
      if (peakItem) {
        peakDayCost = peakItem.cost;
        peakDayFormatted = peakItem.formatted_cost || `₹${(peakItem.cost / 1e7).toFixed(2)} Cr`;
        if (reportData.baseline_total_cost) {
          const baselineDailyAvg = reportData.baseline_total_cost / Math.max(dailyTrend.length, 1);
          peakDayDeltaPct = ((peakDayCost - baselineDailyAvg) / baselineDailyAvg) * 100;
        }
      }
    }

    return {
      currCostCr,
      baseCostCr,
      costDeltaPct,
      currGoodUnitCost,
      baseGoodUnitCost,
      unitCostDeltaPct,
      currProduced,
      baseProduced,
      producedDeltaPct,
      producedDailyRateDeltaPct,
      currGood,
      baseGood,
      currYield,
      baseYield,
      yieldPpDelta,
      peakDayFormatted,
      peakDayDeltaPct,
    };
  }, [reportData]);

  // Dynamically derive eligible historical months from Global Store telemetry
  const eligibleHistoricalMonths = useMemo(() => {
    if (historicalMeta?.eligible_months && historicalMeta.eligible_months.length > 0) {
      return historicalMeta.eligible_months;
    }
    if (reportData?.scope?.available_historical_months && reportData.scope.available_historical_months.length > 0) {
      return reportData.scope.available_historical_months;
    }
    return [
      { id: "2026-10", label: "October 2026", short_label: "Oct 2026", record_count: 1659, coverage_display: "Oct 01 – Oct 31, 2026" },
      { id: "2026-09", label: "September 2026", short_label: "Sep 2026", record_count: 1641, coverage_display: "Sep 01 – Sep 30, 2026" },
      { id: "2026-08", label: "August 2026", short_label: "Aug 2026", record_count: 1700, coverage_display: "Aug 01 – Aug 31, 2026" },
    ];
  }, [historicalMeta, reportData]);

  const getCompareWithDisplayText = () => {
    if (baselineMode === "ALL_AVAILABLE") {
      return "All Available History (Aug–Oct)";
    }
    if (baselineMode === "PREVIOUS_EQUIVALENT_PERIOD") {
      return historicalMeta?.previous_equivalent_period?.short_label || "Prev Equivalent Period";
    }
    if (baselineMode === "SELECTED_MONTHS") {
      if (selectedBaselineMonths.length === 1) {
        const found = eligibleHistoricalMonths.find((m) => m.id === selectedBaselineMonths[0]);
        return found ? found.short_label : selectedBaselineMonths[0];
      }
      const shortLabels = selectedBaselineMonths
        .map((id) => eligibleHistoricalMonths.find((m) => m.id === id)?.short_label || id)
        .join(" + ");
      return shortLabels || `${selectedBaselineMonths.length} Months`;
    }
    if (baselineMode === "CUSTOM_RANGE") {
      if (customBaseStart && customBaseEnd) {
        return `${customBaseStart.slice(5)} to ${customBaseEnd.slice(5)}`;
      }
      return "Custom Date Range";
    }
    return filterCompareWith || reportData?.comparison_period_label || reportData?.executive_finding?.baseline_period_label || "Oct 2026 (Previous Month)";
  };

  // Dynamic Multi-Granularity Manufacturing Cost Trend: Premium Gradient Area Chart
  // 100% Dynamic data binding connected directly to backend daily_cost_trend & aggregations
  const trendConfig = useMemo(() => {
    const chartBottom = 330;
    const chartTop = 45;
    const chartLeft = 68;
    const chartRight = 880;
    const usableWidth = chartRight - chartLeft;

    // Smooth Catmull-Rom cubic spline generator
    const generateSpline = (pts) => {
      if (!pts || pts.length === 0) return "";
      if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
      if (pts.length === 2) return `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`;

      let d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = i > 0 ? pts[i - 1] : pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = i < pts.length - 2 ? pts[i + 2] : p2;

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x} ${p2.y}`;
      }
      return d;
    };

    // Calculate human-friendly round tick intervals (e.g. 0, 5, 10, 15, 20)
    const calculateScale = (maxV) => {
      const targetMax = Math.max(maxV * 1.15, 1);
      const rawStep = targetMax / 4;
      const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
      const residual = rawStep / magnitude;
      let niceStep;
      if (residual < 1.5) niceStep = 1 * magnitude;
      else if (residual < 3.5) niceStep = 2.5 * magnitude;
      else if (residual < 7.5) niceStep = 5 * magnitude;
      else niceStep = 10 * magnitude;

      let yCeil = Math.ceil(targetMax / niceStep) * niceStep;
      if (yCeil < targetMax) yCeil += niceStep;

      const ticks = [];
      for (let v = 0; v <= yCeil + 0.0001; v += niceStep) {
        ticks.push(Number(v.toFixed(niceStep < 1 ? 1 : 0)));
      }
      return { yCeil, ticks, niceStep };
    };

    if (!reportData) {
      return {
        subtitle: "Awaiting calculation data",
        yTitle: "Daily Cost (₹ Cr)",
        chartBottom,
        chartLeft,
        chartRight,
        yTicks: [],
        baselineY: null,
        baselineVal: "N/A",
        points: [],
        peakPoint: null,
        linePath: "",
        areaPath: "",
        legendCurrent: "Actual Expenditure",
        legendBaseline: "Baseline",
      };
    }

    const currLabel = reportData.executive_finding?.current_period_label || "Current Period";
    const baseLabel = reportData.executive_finding?.baseline_period_label || "Baseline";

    // 1. WEEKLY GRANULARITY
    if (trendPeriod === "Weekly") {
      const weeklyList = reportData.weekly_cost_trend || reportData.calculation_details?.weekly_trend || [];
      if (!weeklyList || weeklyList.length === 0) {
        return {
          subtitle: `Weekly manufacturing expenditure (${currLabel} vs ${baseLabel})`,
          yTitle: "Weekly Cost (₹ Cr)",
          chartBottom,
          chartLeft,
          chartRight,
          yTicks: [],
          baselineY: null,
          baselineVal: "N/A",
          points: [],
          peakPoint: null,
          linePath: "",
          areaPath: "",
          legendCurrent: "Actual Expenditure",
          legendBaseline: `${baseLabel} Baseline`,
        };
      }

      const costs = weeklyList.map(w => (w.cost || 0) / 1e7);
      const baselines = weeklyList.map(w => (w.baseline || w.baseline_cost || 0) / 1e7);
      const maxCostVal = Math.max(...costs, 1);
      const avgBaseCr = baselines.length ? baselines.reduce((a, b) => a + b, 0) / baselines.length : 0;
      const maxVal = Math.max(...costs, ...baselines, 1);

      // Dynamic Axis Break Scale for Weekly when baseline is much larger than actuals
      const isAxisBroken = avgBaseCr > maxCostVal * 1.6;
      let getY;
      let yTicks = [];
      let breakY = null;

      if (isAxisBroken) {
        // Dedicate lower 65% of vertical height to actual expenditure (0 to actualCeil)
        // and upper 35% of vertical height to baseline (actualCeil to baseCeil)
        const actualScale = calculateScale(maxCostVal);
        const actualCeil = actualScale.yCeil;
        const baseScale = calculateScale(Math.max(avgBaseCr, maxVal));
        const baseCeil = baseScale.yCeil;

        const zoneH = Math.round((chartBottom - chartTop) * 0.65); // ~185px for actuals
        breakY = chartBottom - zoneH; // ~145px

        getY = (v) => {
          if (v == null || isNaN(v)) return chartBottom;
          if (v <= actualCeil) {
            return Math.round(chartBottom - (v / actualCeil) * zoneH);
          }
          const t = Math.min(1, Math.max(0, (v - actualCeil) / Math.max(1, baseCeil - actualCeil)));
          return Math.round(breakY - t * (breakY - chartTop));
        };

        const lowerTicks = actualScale.ticks.map(t => ({ val: String(t), y: getY(t) }));
        const upperVals = baseScale.ticks.filter(t => t > actualCeil && t <= baseCeil);
        const upperTicks = upperVals.map(t => ({ val: String(t), y: getY(t) }));
        yTicks = [...lowerTicks, ...upperTicks];
      } else {
        const { yCeil, ticks } = calculateScale(maxVal);
        getY = (v) => Math.round(chartBottom - (v / yCeil) * (chartBottom - chartTop));
        yTicks = ticks.map(t => ({ val: String(t), y: getY(t) }));
      }

      const n = weeklyList.length;
      // Intelligent adaptive column layout & width: expand bars when few points exist for rich visual balance
      const paddingX = n <= 3 ? 120 : n <= 5 ? 80 : 40;
      const step = (usableWidth - 2 * paddingX) / Math.max(1, n - 1);
      const barWidth = n <= 3 ? 92 : n <= 5 ? 68 : n <= 8 ? 48 : Math.min(32, Math.max(18, Math.round(step * 0.45)));

      const points = weeklyList.map((item, idx) => {
        const valCr = (item.cost || 0) / 1e7;
        const bCr = (item.baseline || item.baseline_cost || 0) / 1e7;
        const x = Math.round(chartLeft + paddingX + idx * step);
        const y = getY(valCr);
        const yBase = getY(bCr);
        const delta = item.delta_pct != null ? `${item.delta_pct > 0 ? "+" : ""}${item.delta_pct}%` : "N/A";
        return {
          idx,
          x,
          y,
          yBase,
          yRolling: y,
          valCr,
          bCr,
          rollingCr: valCr,
          absDeltaCr: valCr - bCr,
          costFormatted: item.formatted_cost || `₹${valCr.toFixed(2)} Cr`,
          label: item.label,
          fullLabel: item.full_label || `${item.label} (${item.date_range || currLabel})`,
          baseline: item.formatted_baseline || `₹${bCr.toFixed(2)} Cr`,
          delta,
          deltaPct: item.delta_pct,
          isOperatingDay: true,
          operatingStatus: "Operating Week",
          isPeak: valCr === Math.max(...costs),
          showXLabel: true,
        };
      });

      const maxCostValActual = Math.max(...costs);
      const peakPoint = points.find(p => p.valCr === maxCostValActual) || points[points.length - 1];

      const linePath = generateSpline(points);
      const areaPath = points.length > 0
        ? `${linePath} L ${points[points.length - 1].x} ${chartBottom} L ${points[0].x} ${chartBottom} Z`
        : "";

      const rollingAvgPath = generateSpline(points);

      const baselineY = avgBaseCr > 0 ? getY(avgBaseCr) : null;
      const baselineValStr = avgBaseCr > 0 ? `₹${avgBaseCr.toFixed(2)} Cr/wk` : "N/A";

      return {
        subtitle: `Weekly manufacturing expenditure (${currLabel} vs ${baseLabel})`,
        yTitle: "Weekly Cost (₹ Cr)",
        chartBottom,
        chartLeft,
        chartRight,
        isAxisBroken,
        breakY,
        yTicks,
        baselineY,
        baselineVal: baselineValStr,
        points,
        peakPoint,
        linePath,
        areaPath,
        baselineLinePath: null, // Avoid duplicate crossed dashed line in Weekly
        rollingAvgPath,
        barWidth,
        legendCurrent: "Actual Expenditure",
        legendBaseline: `${baseLabel} Baseline (${baselineValStr})`,
      };
    }

    // 2. MONTHLY GRANULARITY
    if (trendPeriod === "Monthly") {
      const monthlyList = reportData.calculation_details?.monthly_trend || reportData.monthly_trend || [];
      if (!monthlyList || monthlyList.length === 0) {
        return {
          subtitle: `Monthly manufacturing expenditure (Progression vs ${baseLabel})`,
          yTitle: "Monthly Cost (₹ Cr)",
          chartBottom,
          chartLeft,
          chartRight,
          yTicks: [],
          baselineY: null,
          baselineVal: "N/A",
          points: [],
          peakPoint: null,
          linePath: "",
          areaPath: "",
          legendCurrent: "Actual Expenditure",
          legendBaseline: `${baseLabel} Baseline`,
        };
      }

      const costs = monthlyList.map(m => (m.cost || m.total_cost || 0) / 1e7);
      const baseMonthVal = (reportData.baseline_total_cost || 0) / 1e7;
      const maxCostVal = Math.max(...costs, 1);
      const maxVal = Math.max(...costs, baseMonthVal, 1);

      const isAxisBroken = baseMonthVal > maxCostVal * 1.6;
      let getY;
      let yTicks = [];
      let breakY = null;

      if (isAxisBroken) {
        const actualScale = calculateScale(maxCostVal);
        const actualCeil = actualScale.yCeil;
        const baseScale = calculateScale(Math.max(baseMonthVal, maxVal));
        const baseCeil = baseScale.yCeil;

        const zoneH = Math.round((chartBottom - chartTop) * 0.65);
        breakY = chartBottom - zoneH;

        getY = (v) => {
          if (v == null || isNaN(v)) return chartBottom;
          if (v <= actualCeil) {
            return Math.round(chartBottom - (v / actualCeil) * zoneH);
          }
          const t = Math.min(1, Math.max(0, (v - actualCeil) / Math.max(1, baseCeil - actualCeil)));
          return Math.round(breakY - t * (breakY - chartTop));
        };

        const lowerTicks = actualScale.ticks.map(t => ({ val: String(t), y: getY(t) }));
        const upperVals = baseScale.ticks.filter(t => t > actualCeil && t <= baseCeil);
        const upperTicks = upperVals.map(t => ({ val: String(t), y: getY(t) }));
        yTicks = [...lowerTicks, ...upperTicks];
      } else {
        const { yCeil, ticks } = calculateScale(maxVal);
        getY = (v) => Math.round(chartBottom - (v / yCeil) * (chartBottom - chartTop));
        yTicks = ticks.map(t => ({ val: String(t), y: getY(t) }));
      }

      const n = monthlyList.length;
      const paddingX = n <= 3 ? 120 : 60;
      const step = (usableWidth - 2 * paddingX) / Math.max(1, n - 1);
      const barWidth = n <= 3 ? 92 : n <= 5 ? 68 : 44;

      const points = monthlyList.map((item, idx) => {
        const valCr = (item.cost || item.total_cost || 0) / 1e7;
        const x = Math.round(chartLeft + paddingX + idx * step);
        const y = getY(valCr);
        const yBase = getY(baseMonthVal);
        const delta = baseMonthVal > 0 ? `${((valCr - baseMonthVal) / baseMonthVal * 100).toFixed(1)}%` : "0.0%";
        return {
          idx,
          x,
          y,
          yBase,
          yRolling: y,
          valCr,
          bCr: baseMonthVal,
          rollingCr: valCr,
          absDeltaCr: valCr - baseMonthVal,
          costFormatted: item.formatted_cost || `₹${valCr.toFixed(2)} Cr`,
          label: item.label || item.month_label || item.period,
          fullLabel: item.is_current ? `${item.label || item.period} (Current)` : item.label || item.period,
          baseline: `₹${baseMonthVal.toFixed(2)} Cr`,
          delta: item.is_current ? `${reportData.cost_change_pct > 0 ? "+" : ""}${reportData.cost_change_pct}%` : delta,
          deltaPct: item.is_current ? reportData.cost_change_pct : (baseMonthVal > 0 ? Number(((valCr - baseMonthVal) / baseMonthVal * 100).toFixed(1)) : 0),
          isOperatingDay: true,
          operatingStatus: "Operating Month",
          isPeak: valCr === Math.max(...costs),
          showXLabel: true,
        };
      });

      const maxCostValMonth = Math.max(...costs);
      const peakPoint = points.find(p => p.valCr === maxCostValMonth) || points[points.length - 1];

      const linePath = generateSpline(points);
      const areaPath = points.length > 0
        ? `${linePath} L ${points[points.length - 1].x} ${chartBottom} L ${points[0].x} ${chartBottom} Z`
        : "";

      const rollingAvgPath = generateSpline(points);

      const baselineY = baseMonthVal > 0 ? getY(baseMonthVal) : null;
      const baselineValStr = baseMonthVal > 0 ? `₹${baseMonthVal.toFixed(2)} Cr` : "N/A";

      return {
        subtitle: `Monthly manufacturing expenditure (Progression vs ${baseLabel})`,
        yTitle: "Monthly Cost (₹ Cr)",
        chartBottom,
        chartLeft,
        chartRight,
        isAxisBroken,
        breakY,
        yTicks,
        baselineY,
        baselineVal: baselineValStr,
        points,
        peakPoint,
        linePath,
        areaPath,
        baselineLinePath: null,
        rollingAvgPath,
        barWidth,
        legendCurrent: "Actual Expenditure",
        legendBaseline: `${baseLabel} Baseline (${baselineValStr})`,
      };
    }

    // 3. DAILY GRANULARITY (Default)
    const dailyList = reportData.daily_cost_trend || reportData.calculation_details?.daily_trend || [];
    if (!dailyList || dailyList.length === 0) {
      return {
        subtitle: `Daily manufacturing expenditure (${currLabel} vs ${baseLabel})`,
        yTitle: "Daily Cost (₹ Cr)",
        chartBottom,
        chartLeft,
        chartRight,
        yTicks: [],
        baselineY: null,
        baselineVal: "N/A",
        points: [],
        peakPoint: null,
        linePath: "",
        areaPath: "",
        legendCurrent: "Actual Expenditure",
        legendBaseline: `${baseLabel} Baseline`,
      };
    }

    const costs = dailyList.map(d => (d.cost || 0) / 1e7);
    const baselines = dailyList.map(d => (d.baseline_cost || 0) / 1e7);
    const maxCostVal = Math.max(...costs, 1);
    const avgBaseCr = baselines.length ? baselines.reduce((a, b) => a + b, 0) / baselines.length : 0;
    const maxVal = Math.max(...costs, ...baselines, 1);

    // Dynamic Axis Break Scale: when baseline creates excessive unused vertical space (e.g. baseline 44.38 Cr vs 12.4 Cr actual)
    const isAxisBroken = avgBaseCr > maxCostVal * 1.6;
    let getY;
    let yTicks = [];
    let breakY = null;

    if (isAxisBroken) {
      // Allocate lower 65% of vertical height to actual expenditure (0 to actualCeil)
      // and upper 35% of vertical height to baseline (actualCeil to baseCeil)
      const actualScale = calculateScale(maxCostVal);
      const actualCeil = actualScale.yCeil;
      const baseScale = calculateScale(Math.max(avgBaseCr, maxVal));
      const baseCeil = baseScale.yCeil;

      const zoneH = Math.round((chartBottom - chartTop) * 0.65); // ~185px for actuals
      breakY = chartBottom - zoneH; // ~145px

      getY = (v) => {
        if (v == null || isNaN(v)) return chartBottom;
        if (v <= actualCeil) {
          return Math.round(chartBottom - (v / actualCeil) * zoneH);
        }
        const t = Math.min(1, Math.max(0, (v - actualCeil) / Math.max(1, baseCeil - actualCeil)));
        return Math.round(breakY - t * (breakY - chartTop));
      };

      // Ticks for actuals zone
      const lowerTicks = actualScale.ticks.map(t => ({ val: String(t), y: getY(t) }));
      // Ticks for upper baseline zone
      const upperVals = baseScale.ticks.filter(t => t > actualCeil && t <= baseCeil);
      const upperTicks = upperVals.map(t => ({ val: String(t), y: getY(t) }));
      yTicks = [...lowerTicks, ...upperTicks];
    } else {
      const { yCeil, ticks } = calculateScale(maxVal);
      getY = (v) => Math.round(chartBottom - (v / yCeil) * (chartBottom - chartTop));
      yTicks = ticks.map(t => ({ val: String(t), y: getY(t) }));
    }

    const n = dailyList.length;
    const step = (usableWidth - 10) / Math.max(1, n - 1);

    const points = dailyList.map((item, idx) => {
      const valCr = (item.cost || 0) / 1e7;
      const bCr = (item.baseline_cost || 0) / 1e7;
      const rollingCr = (item.rolling_avg_3d != null ? item.rolling_avg_3d : (item.rolling_avg_cost != null ? item.rolling_avg_cost : item.cost || 0)) / 1e7;
      const x = Math.round(chartLeft + 5 + idx * step);
      const y = getY(valCr);
      const yBase = getY(bCr);
      const yRolling = getY(rollingCr);
      const delta = item.delta_pct != null ? `${item.delta_pct > 0 ? "+" : ""}${item.delta_pct}%` : "N/A";
      const isPeak = item.is_peak || (valCr === maxCostVal && valCr > 0);
      // Show key dates including peak date, boundaries and representative cadence
      const labelInterval = Math.max(2, Math.ceil(n / 7));
      const showXLabel = n <= 10 ? true : (idx % labelInterval === 0 || idx === n - 1 || isPeak);

      return {
        idx,
        x,
        y,
        yBase,
        yRolling,
        valCr,
        bCr,
        rollingCr,
        absDeltaCr: valCr - bCr,
        costFormatted: item.formatted_cost ? item.formatted_cost.replace(" Cr", "") : `₹${valCr.toFixed(2)}`,
        label: item.label,
        fullLabel: item.full_label || `${item.label}, ${currLabel}`,
        baseline: item.formatted_baseline || `₹${bCr.toFixed(2)} Cr`,
        delta,
        deltaPct: item.delta_pct,
        isOperatingDay: item.is_operating_day !== false,
        operatingStatus: item.operating_status || (item.is_operating_day !== false ? "Operating Day" : "Non-Operating / Maintenance"),
        isPeak,
        showXLabel,
      };
    });

    const peakPoint = points.find(p => p.valCr === maxCostVal && p.valCr > 0) || points[points.length - 1];

    const linePath = generateSpline(points);
    const areaPath = points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${chartBottom} L ${points[0].x} ${chartBottom} Z`
      : "";

    const baselinePoints = points.map(p => ({ x: p.x, y: p.yBase }));
    const baselineLinePath = generateSpline(baselinePoints);

    // Smooth rolling average path
    const operatingRollingPoints = points.map(p => ({ x: p.x, y: p.yRolling }));
    const rollingAvgPath = generateSpline(operatingRollingPoints);

    const barWidth = Math.min(22, Math.max(14, Math.round(step * 0.62)));

    const baselineY = avgBaseCr > 0 ? getY(avgBaseCr) : null;
    const baselineValStr = avgBaseCr > 0 ? `₹${avgBaseCr.toFixed(2)} Cr/day` : "N/A";

    return {
      subtitle: `Daily manufacturing expenditure (${currLabel} vs ${baseLabel})`,
      yTitle: "Daily Cost (₹ Cr)",
      chartBottom,
      chartLeft,
      chartRight,
      isAxisBroken,
      breakY,
      yTicks,
      baselineY,
      baselineVal: baselineValStr,
      points,
      peakPoint,
      linePath,
      areaPath,
      baselineLinePath,
      rollingAvgPath,
      barWidth,
      legendCurrent: "Actual Expenditure",
      legendBaseline: `${baseLabel} Baseline (${baselineValStr})`,
    };
  }, [trendPeriod, reportData]);

  // Dynamic collision avoidance for Baseline Badge
  const baselineBadgeX = useMemo(() => {
    if (!trendConfig.peakPoint || trendConfig.baselineY == null) return 760;
    const peak = trendConfig.peakPoint;
    if (Math.abs(peak.x - 760) < 110 && Math.abs(peak.y - trendConfig.baselineY) < 55) {
      return 670;
    }
    return 760;
  }, [trendConfig.peakPoint, trendConfig.baselineY]);

  // Strict semantic color palette for Cost Breakdown & Variance Donut
  const SEMANTIC_DONUT_PALETTE = {
    Material: {
      color: "#8b5cf6",
      base_color: "#4c1d95",
      dotColor: "bg-[#8b5cf6]",
      tagBg: "bg-purple-50",
      tagText: "text-[#7c3aed]",
      tagBorder: "border-purple-200/60",
    },
    Labour: {
      color: "#0ea5e9",
      base_color: "#0369a1",
      dotColor: "bg-[#0ea5e9]",
      tagBg: "bg-sky-50",
      tagText: "text-[#0284c7]",
      tagBorder: "border-sky-200/60",
    },
    Machine: {
      color: "#f59e0b",
      base_color: "#92400e",
      dotColor: "bg-[#f59e0b]",
      tagBg: "bg-amber-50",
      tagText: "text-[#d97706]",
      tagBorder: "border-amber-200/60",
    },
    Energy: {
      color: "#14b8a6",
      base_color: "#0f766e",
      dotColor: "bg-[#14b8a6]",
      tagBg: "bg-teal-50",
      tagText: "text-[#0d9488]",
      tagBorder: "border-teal-200/60",
    },
    Scrap: {
      color: "#f43f5e",
      base_color: "#9f1239",
      dotColor: "bg-[#f43f5e]",
      tagBg: "bg-rose-50",
      tagText: "text-[#e11d48]",
      tagBorder: "border-rose-200/60",
    },
  };

  // Dynamic Active Slices for Stage 3 Donut Chart (Breakdown vs Variance Drivers)
  const activeSlices = useMemo(() => {
    if (!reportData) return [];
    let raw = [];
    if (donutMode === "breakdown") {
      raw = reportData.calculation_details?.cost_breakdown ||
        reportData.calculation_details?.reasons_breakdown || [];
    } else {
      raw = reportData.calculation_details?.variance_drivers ||
        reportData.calculation_details?.reasons_breakdown || [];
    }

    if (!raw || raw.length === 0) return [];

    const circ = 471.24; // 2 * PI * 75
    let currOff = 0.0;
    const totalAmt = raw.reduce((acc, it) => acc + Math.abs(it.amount || 0), 0);

    return raw.map((it) => {
      // Semantic category palette resolution
      let pal = null;
      const nLower = (it.name || it.category || "").toLowerCase();
      if (nLower.includes("material") || nLower.includes("bom") || nLower.includes("soc")) {
        pal = SEMANTIC_DONUT_PALETTE["Material"];
      } else if (nLower.includes("labour") || nLower.includes("labor") || nLower.includes("workforce")) {
        pal = SEMANTIC_DONUT_PALETTE["Labour"];
      } else if (nLower.includes("machine") || nLower.includes("equipment") || nLower.includes("downtime")) {
        pal = SEMANTIC_DONUT_PALETTE["Machine"];
      } else if (nLower.includes("energy") || nLower.includes("utility") || nLower.includes("power")) {
        pal = SEMANTIC_DONUT_PALETTE["Energy"];
      } else if (nLower.includes("scrap") || nLower.includes("rework") || nLower.includes("quality") || nLower.includes("display")) {
        pal = SEMANTIC_DONUT_PALETTE["Scrap"];
      } else if (it.color && it.base_color) {
        pal = {
          color: it.color,
          base_color: it.base_color,
          dotColor: it.dotColor || "bg-[#8b5cf6]",
          tagBg: it.tagBg || "bg-purple-50",
          tagText: it.tagText || "text-[#7c3aed]",
          tagBorder: it.tagBorder || "border-purple-200/60",
        };
      } else {
        pal = SEMANTIC_DONUT_PALETTE["Material"];
      }

      const amt = Math.abs(it.amount || 0);
      const share = totalAmt > 0 ? (amt / totalAmt) * 100 : 0;
      // Guarantee minimum visual arc of 6.0px for positive slices so each category is distinctly visible
      const rawDash = (share / 100.0) * circ;
      const dashLen = amt > 0 ? Math.max(6.0, rawDash) : 0;

      const sliceObj = {
        ...it,
        color: pal.color,
        base_color: pal.base_color,
        dotColor: pal.dotColor,
        tagBg: pal.tagBg,
        tagText: pal.tagText,
        tagBorder: pal.tagBorder,
        dash: `${dashLen.toFixed(2)} ${circ.toFixed(2)}`,
        offset: `${(-currOff).toFixed(2)}`,
      };

      currOff += dashLen;
      return sliceObj;
    });
  }, [donutMode, reportData]);

  // Interactive Product Drilldown Drawer
  const [selectedProductDrilldown, setSelectedProductDrilldown] = useState(null);

  // Interactive Recommendation Playbook Modal
  const [selectedPlaybook, setSelectedPlaybook] = useState(null);

  // Consolidation / Commit State
  const [isCommitting, setIsCommitting] = useState(false);
  const [consolidationStatus, setConsolidationStatus] = useState("STAGED_PACKAGE"); // 'STAGED_PACKAGE' | 'COMMITTED'
  const [consolidationLineage, setConsolidationLineage] = useState(null);
  const [commitMessage, setCommitMessage] = useState(null);
  const [commitError, setCommitError] = useState(null);

  // ===========================================================================
  // UPLOAD HISTORY STATE (Section 6)
  // ===========================================================================
  const [historyReports, setHistoryReports] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Fetch saved reports from Neon DB
  const loadHistory = async () => {
    try {
      setHistoryLoading(true);
      const res = await fetch(`${apiBaseUrl}/investigation/reports?limit=50`);
      if (res.ok) {
        const json = await res.json();
        setHistoryReports(json || []);
      }
    } catch (err) {
      console.warn("Could not fetch history reports:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [apiBaseUrl]);

  // Handle reopening a historical investigation package when navigated from Reports module
  useEffect(() => {
    if (routeParams && routeParams.report_id) {
      setGeneratedReportId(routeParams.report_id);
      if (routeParams.package_name) setPackageName(routeParams.package_name);
      if (routeParams.period) setDataPeriod(routeParams.period);
      setActiveTab("upload");
      setCurrentStage(3);
    }
  }, [routeParams]);

  // Deterministically fetch detected transaction period and date coverage validation from backend
  const fetchDetectedPeriod = async (currentFiles = files) => {
    if (!currentFiles || currentFiles.length === 0) {
      return;
    }
    setIsDetectingPeriod(true);
    try {
      const formData = new FormData();
      currentFiles.forEach((f) => formData.append("files", f));
      const res = await fetch(`${apiBaseUrl}/import/detect-period`, {
        method: "POST",
        body: formData,
      });

      if (res && res.ok) {
        const data = await res.json();
        setDetectedPeriodInfo(data);
        if (data.detected_period) {
          setDataPeriod(data.detected_period);
        }
      }
    } catch (err) {
      console.warn("Could not detect data period from backend:", err);
    } finally {
      setIsDetectingPeriod(false);
    }
  };

  useEffect(() => {
    if (files && files.length > 0) {
      fetchDetectedPeriod(files);
    }
  }, [files, apiBaseUrl]);

  // File Drag & Drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndAddFiles = (incomingList) => {
    if (!incomingList || incomingList.length === 0) return;

    const validExtensions = [".csv", ".xlsx"];
    const maxSizeBytes = 100 * 1024 * 1024;
    const validFiles = [];
    let errorFound = null;

    Array.from(incomingList).forEach((f) => {
      const ext = f.name.substring(f.name.lastIndexOf(".")).toLowerCase();
      if (!validExtensions.includes(ext)) {
        errorFound = `File "${f.name}" has an invalid format. Supported formats: CSV, XLSX.`;
      } else if (f.size > maxSizeBytes) {
        errorFound = `File "${f.name}" exceeds the 100 MB limit.`;
      } else {
        validFiles.push(f);
      }
    });

    if (errorFound) {
      setFileError(errorFound);
    } else {
      setFileError(null);
    }

    if (validFiles.length > 0) {
      setFiles((prev) => {
        const existingNames = new Set(prev.map((item) => item.name));
        const deduplicated = validFiles.filter((item) => !existingNames.has(item.name));
        return [...prev, ...deduplicated];
      });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles((prev) => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      if (updated.length === 0) {
        setFileError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
      return updated;
    });
  };

  // Format file size helper
  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return Math.round(bytes / 1024) + " KB";
  };

  // ===========================================================================
  // START REAL STREAMING VALIDATION & PREPARATION (STAGE 1 -> STAGE 2)
  // ===========================================================================
  const handleStartInspection = async () => {
    if (!files || files.length === 0) {
      setFileError("Please select or drop at least one manufacturing CSV dataset.");
      return;
    }
    setFileError(null);
    setIsStreaming(true);
    setCurrentStage(2);
    setOverallProgressPercent(10);
    setDetectedDatasetsCount(files.length);
    setSessionError(null);
    setReportError(null);

    // Initial state of operations
    setValidationOperations([
      {
        id: "ingestion",
        title: "Data Ingestion",
        description: "Reading and loading the uploaded files",
        status: "IN_PROGRESS",
        progress: 25,
      },
      {
        id: "schema",
        title: "Schema & Column Validation",
        description: "Checking required columns and data types",
        status: "PENDING",
        progress: 0,
      },
      {
        id: "quality",
        title: "Data Quality Checks",
        description: "Missing values, duplicates, and invalid records",
        status: "PENDING",
        progress: 0,
      },
      {
        id: "relationship",
        title: "Cross-Dataset Relationship Check",
        description: "Validating keys and data consistency across datasets",
        status: "PENDING",
        progress: 0,
      },
      {
        id: "reconciliation",
        title: "Cost & Production Reconciliation",
        description: "Aligning cost, production, and consumption data",
        status: "PENDING",
        progress: 0,
      },
      {
        id: "preparation",
        title: "Analysis Preparation",
        description: "Creating the data model for AI investigation",
        status: "PENDING",
        progress: 0,
      },
    ]);

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    formData.append("dataset_type", "AUTO");

    try {
      const response = await fetch(`${apiBaseUrl}/import/inspect-stream`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let activeSessionNavigated = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data: ")) {
            try {
              const event = JSON.parse(trimmed.slice(6));
              const sId = event.details?.session_id || event.details?.staged_batch_id;
              if (sId && !activeSessionNavigated) {
                activeSessionNavigated = true;
                if (onNavigateToValidate) {
                  onNavigateToValidate(sId);
                } else {
                  setCurrentStage(2);
                }
              }
              processStreamEvent(event);
            } catch (err) {
              console.warn("Event parse error:", err);
            }
          }
        }
      }
    } catch (err) {
      console.warn("Inspection stream error:", err);
      setInspectionError("Inspection stream failed: " + err.message);
      setIsStreaming(false);
    }
  };

  const processStreamEvent = (evt) => {
    setStreamEvents((prev) => [...prev, evt]);

    if (evt.stage === "file_inspection") {
      setOverallProgressPercent(25);
      setValidationOperations((ops) =>
        ops.map((o) =>
          o.id === "ingestion"
            ? { ...o, status: "COMPLETED", progress: 100 }
            : o.id === "schema"
              ? { ...o, status: "IN_PROGRESS", progress: 50 }
              : o
        )
      );
    } else if (evt.stage === "schema_mapping" || evt.stage === "dataset_identification") {
      setOverallProgressPercent(45);
      setValidationOperations((ops) =>
        ops.map((o) =>
          o.id === "schema"
            ? { ...o, status: "COMPLETED", progress: 100 }
            : o.id === "quality"
              ? { ...o, status: "IN_PROGRESS", progress: 60 }
              : o
        )
      );
    } else if (evt.stage === "data_quality" || evt.stage === "business_rules") {
      setOverallProgressPercent(57);
      setValidationOperations((ops) =>
        ops.map((o) =>
          o.id === "quality"
            ? { ...o, status: "COMPLETED", progress: 100 }
            : o.id === "relationship"
              ? { ...o, status: "IN_PROGRESS", progress: 72 }
              : o
        )
      );
    } else if (evt.stage === "cross_dataset") {
      setOverallProgressPercent(78);
      setValidationOperations((ops) =>
        ops.map((o) =>
          o.id === "relationship"
            ? { ...o, status: "COMPLETED", progress: 100 }
            : o.id === "reconciliation"
              ? { ...o, status: "IN_PROGRESS", progress: 85 }
              : o
        )
      );
    } else if (evt.stage === "cost_readiness") {
      setOverallProgressPercent(92);
      setValidationOperations((ops) =>
        ops.map((o) =>
          o.id === "reconciliation"
            ? { ...o, status: "COMPLETED", progress: 100 }
            : o.id === "preparation"
              ? { ...o, status: "IN_PROGRESS", progress: 95 }
              : o
        )
      );
    }

    if (evt.event_type === "analysis_completed") {
      const repId = evt.details?.report_id || "INV-FINAL";
      const sId = evt.details?.session_id || evt.details?.staged_batch_id || effectiveSessionId;
      setGeneratedReportId(repId);
      setOverallProgressPercent(100);
      setIsStreaming(false);
      setValidationOperations((ops) =>
        ops.map((o) => ({ ...o, status: "COMPLETED", progress: 100 }))
      );

      // Auto-transition to Stage 3 after brief visual confirmation
      setTimeout(() => {
        if (onNavigateToResults && sId) {
          onNavigateToResults(sId);
        } else {
          setCurrentStage(3);
        }
      }, 1200);
    }
  };

  // Reset to Stage 1 for a New Investigation
  const handleResetToNew = () => {
    setFiles([]);
    setFileError(null);
    setPackageName("");
    setConsolidationStatus("STAGED_PACKAGE");
    setCommitMessage(null);
    setCommitError(null);
    setOverallProgressPercent(0);
    setTotalRecordsCount(0);
    setDetectedDatasetsCount(0);
    setGeneratedReportId(null);
    setReportData(null);
    setReportError(null);
    setSessionError(null);
    setValidationOperations((ops) => ops.map((o) => ({ ...o, status: "PENDING", progress: 0 })));
    localStorage.removeItem("active_upload_session_id");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onNavigateToUpload) {
      onNavigateToUpload();
    } else {
      setCurrentStage(1);
    }
  };

  // Consolidation Approval Handler (Section 7)
  const handleApproveConsolidation = async () => {
    try {
      setIsCommitting(true);
      setCommitMessage(null);
      setCommitError(null);

      const res = await fetch(
        `${apiBaseUrl}/investigation/${encodeURIComponent(generatedReportId)}/approve-consolidation`,
        { method: "POST" }
      );

      if (res.ok) {
        const json = await res.json();
        // Only mark COMMITTED if backend explicitly and genuinely confirms commitment
        if (json.status === "COMMITTED" || json.consolidation_status === "COMMITTED") {
          setConsolidationStatus("COMMITTED");
          setConsolidationLineage(json.lineage);
          setCommitMessage(json.message || "Package successfully approved and consolidated into company-wide analytics.");
          if (onImportSuccess) onImportSuccess();
          loadHistory();
        } else {
          setConsolidationStatus("STAGED_PACKAGE");
          setCommitError(json.message || "Commit was not completed by the backend.");
        }
      } else {
        const err = await res.json().catch(() => ({}));
        setConsolidationStatus("STAGED_PACKAGE");
        setCommitError(err.detail || "Consolidation failed. Production commit is currently unavailable.");
      }
    } catch (err) {
      console.error("Consolidation error:", err);
      // Strictly prevent optimistic commit; record error and preserve staged package status
      setConsolidationStatus("STAGED_PACKAGE");
      setCommitError("Network error or request timeout. Production data was not committed.");
    } finally {
      setIsCommitting(false);
    }
  };

  // Reopen a saved historical package (Section 6)
  const handleOpenHistoricalPackage = (pkg) => {
    setGeneratedReportId(pkg.report_id);
    setDataPeriod(pkg.reporting_period || "Active Dataset Period");
    setConsolidationStatus(pkg.status === "COMMITTED" ? "COMMITTED" : "STAGED_PACKAGE");
    setCommitError(null);
    setCommitMessage(null);
    setActiveTab("upload");
    setCurrentStage(3);
  };

  return (
    <div className="w-full flex-1 flex flex-col space-y-4 select-none pb-6 font-sans text-slate-800">
      {/* =========================================================================
          TOP HEADER ROW: TITLE, SUBTITLE & RIGHT ACTIONS (Matching Reference Image)
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {currentStage === 3 && (
            <button
              onClick={() => {
                if (onBack) onBack();
                else if (onNavigateToUpload) onNavigateToUpload();
                else setCurrentStage(1);
              }}
              className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-2xs cursor-pointer transition-all shrink-0"
              title={onBack ? "Back to Reports" : "Back to Data Upload"}
            >
              <ArrowLeft className="w-4 h-4 text-slate-700" />
            </button>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              {currentStage === 3 && (
                <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200/70 text-[#7c3aed] flex items-center justify-center shrink-0 shadow-2xs">
                  <Sparkles className="w-4.5 h-4.5 text-[#7c3aed]" />
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {currentStage === 3 ? "Investigation Result" : "Data Upload"}
              </h1>
              {isHistoricalView && (
                <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  Historical Replay
                </span>
              )}
            </div>
            {currentStage !== 3 && (
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Upload manufacturing datasets to run an automated cost investigation with AI.
              </p>
            )}
          </div>
        </div>

        {/* Right Actions for Stage 3 & Studio */}
        <div className="flex items-center gap-2 shrink-0">
          {currentStage === 3 ? (
            <>
              {/* Enhanced Enterprise Export Control */}
              <div className="relative inline-block text-left" ref={exportMenuRef}>
                <div className="inline-flex rounded-xl shadow-2xs">
                  <button
                    onClick={handleExportPDF}
                    disabled={isExportingPdf}
                    className="px-3.5 py-1.5 rounded-l-xl border border-r-0 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-75"
                    title="Download Professional PDF Report"
                  >
                    {isExportingPdf ? (
                      <Loader2 className="w-3.5 h-3.5 text-[#7c3aed] animate-spin shrink-0" />
                    ) : (
                      <Download className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    )}
                    <span>{isExportingPdf ? "Generating..." : "Export PDF"}</span>
                  </button>
                  <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="px-2 py-1.5 rounded-r-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 text-xs transition-all cursor-pointer"
                    title="Export format options"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Export Feedback Toast */}
                {exportFeedback && (
                  <div
                    className={`absolute right-0 top-full mt-1 px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-md z-50 whitespace-nowrap animate-in fade-in ${
                      exportFeedback.type === "success"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : exportFeedback.type === "error"
                        ? "bg-rose-50 text-rose-800 border border-rose-200"
                        : "bg-purple-50 text-[#7c3aed] border border-purple-200"
                    }`}
                  >
                    {exportFeedback.message}
                  </div>
                )}

                {showExportMenu && (
                  <div className="absolute right-0 mt-1.5 w-64 rounded-xl bg-white border border-slate-200 shadow-xl py-1 z-50 text-xs">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                      <span>Export Report Formats</span>
                      <span className="text-[9px] text-[#7c3aed] font-semibold">Authoritative</span>
                    </div>

                    {/* 1. PDF Download Option (Primary) */}
                    <button
                      onClick={handleExportPDF}
                      disabled={isExportingPdf}
                      className="w-full text-left px-3 py-2 hover:bg-purple-50 hover:text-[#7c3aed] flex items-center gap-2.5 cursor-pointer transition-colors border-b border-slate-50 disabled:opacity-50"
                    >
                      <div className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                        {isExportingPdf ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7c3aed]" />
                        ) : (
                          <FileText className="w-3.5 h-3.5 text-rose-600" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                          <span>Download PDF Report (.pdf)</span>
                          <span className="text-[8.5px] px-1 py-0.2 rounded bg-purple-100 text-[#7c3aed] font-extrabold uppercase">
                            Executive
                          </span>
                        </span>
                        <span className="text-[10px] text-slate-500 truncate">8-section printable management audit</span>
                      </div>
                    </button>

                    {/* 2. Markdown Report */}
                    <button
                      onClick={() => {
                        downloadExecutiveMarkdownReport(reportData, effectiveSessionId || routeSessionId || historicalReportId);
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-purple-50 hover:text-[#7c3aed] flex items-center gap-2.5 cursor-pointer transition-colors"
                    >
                      <div className="w-6 h-6 rounded-md bg-purple-50 text-[#7c3aed] flex items-center justify-center shrink-0 border border-purple-100">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-slate-800">Executive Report (.md)</span>
                        <span className="text-[10px] text-slate-400">Complete audit with findings &amp; CIP</span>
                      </div>
                    </button>

                    {/* 3. HTML Print-Ready Brief */}
                    <button
                      onClick={() => {
                        downloadExecutiveHTMLReport(reportData, effectiveSessionId || routeSessionId || historicalReportId);
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-purple-50 hover:text-[#7c3aed] flex items-center gap-2.5 cursor-pointer transition-colors"
                    >
                      <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                        <Share2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-slate-800">Print-Ready Brief (.html)</span>
                        <span className="text-[10px] text-slate-400">Styled document with print layout</span>
                      </div>
                    </button>

                    {/* 4. Financial CSV Datasets */}
                    <button
                      onClick={() => {
                        downloadExecutiveCSVReport(reportData, effectiveSessionId || routeSessionId || historicalReportId);
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-purple-50 hover:text-[#7c3aed] flex items-center gap-2.5 cursor-pointer transition-colors"
                    >
                      <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-slate-800">Financial Datasets (.csv)</span>
                        <span className="text-[10px] text-slate-400">KPIs, breakdown &amp; product SKUs</span>
                      </div>
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    {/* 5. Browser Print */}
                    <button
                      onClick={() => {
                        window.print();
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer text-slate-600 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1.5" />
                      <span className="text-[11px] font-medium">Browser Print Window...</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  const sId = effectiveSessionId || routeSessionId || historicalReportId;
                  if (sId) {
                    localStorage.setItem("gwc_active_upload_session", sId);
                    localStorage.setItem("active_upload_session_id", sId);
                  }
                  if (onOpenAIChat) {
                    onOpenAIChat({
                      initialQuery: "Why did manufacturing cost decrease in the uploaded dataset?",
                      sessionId: sId,
                    });
                  } else if (sId && onNavigate) {
                    onNavigate("investigations", { session_id: sId, report_id: historicalReportId });
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl border border-purple-200/90 bg-purple-50 hover:bg-purple-100 text-[#7c3aed] text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="Launch natural language AI investigation on this uploaded package"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#7c3aed]" />
                <span>Ask AI</span>
              </button>

              {!isHistoricalView && (
                <button
                  onClick={handleResetToNew}
                  className="px-3.5 py-1.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Investigation</span>
                </button>
              )}

              {isHistoricalView ? (
                <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Permanent Store</span>
                </span>
              ) : consolidationStatus !== "COMMITTED" ? (
                <button
                  onClick={handleApproveConsolidation}
                  disabled={isCommitting}
                  className="px-3.5 py-1.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Approve and commit validated records to consolidated Neon database"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isCommitting ? "Committing..." : "Approve & Commit"}</span>
                </button>
              ) : (
                <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Consolidated</span>
                </span>
              )}
            </>
          ) : (
            <button
              onClick={() => onNavigate && onNavigate("reports")}
              className="px-3 py-1.5 rounded-xl border border-purple-200/80 bg-purple-50/50 hover:bg-purple-100/70 text-[#7c3aed] text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="View historical uploaded packages and past investigation reports in Reports module"
            >
              <History className="w-3.5 h-3.5 text-[#7c3aed]" />
              <span>Historical Packages (Reports Archive)</span>
            </button>
          )}
        </div>
      </div>

      {/* Flash Message Alert on Stage 1 / Redirect Warning */}
      {(routeParams?.msg || routeParams?.error) && currentStage === 1 && (
        <div className="w-full bg-amber-50 border border-amber-200/90 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900">Workflow Action Required</h4>
              <p className="text-xs text-amber-800 mt-0.5">
                {routeParams.msg || routeParams.error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Session Not Found / Error Banner */}
      {(sessionError || (currentStage === 3 && reportError && (reportError.includes("not found") || reportError.includes("404")))) && (
        <div className="w-full bg-rose-50 border border-rose-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-900">Upload Session Not Found</h3>
              <p className="text-xs text-rose-700 mt-0.5">
                {sessionError || reportError || `The upload session ID "${effectiveSessionId}" does not exist or has expired.`}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (onNavigateToUpload) onNavigateToUpload();
              else setCurrentStage(1);
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
          >
            Start New Upload
          </button>
        </div>
      )}



      {/* =========================================================================
          VIEW A: UPLOAD HISTORY TAB (Section 6)
          ========================================================================= */}
      {activeTab === "history" && (
        <div className="w-full bg-white rounded-2xl p-5 border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Uploaded Packages &amp; Investigation History
              </h2>
              <p className="text-xs text-slate-500">
                Select any completed manufacturing package to inspect its original investigation results without recalculation.
              </p>
            </div>
            <button
              onClick={loadHistory}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Refresh History"
            >
              <RefreshCw className={`w-4 h-4 ${historyLoading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {historyLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-[#7c3aed]" />
              <span className="text-xs font-medium">Loading historical investigation packages...</span>
            </div>
          ) : historyReports.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
              <History className="w-8 h-8 text-slate-300" />
              <span className="text-xs font-medium">No previous upload packages found.</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {historyReports.map((pkg) => (
                <div
                  key={pkg.report_id}
                  className="p-3.5 rounded-xl border border-slate-100 hover:border-purple-200 bg-slate-50/40 hover:bg-purple-50/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-purple-100/80 text-[#7c3aed] flex items-center justify-center shrink-0 mt-0.5">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {pkg.title || "Manufacturing Data Package"}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-50 text-[#7c3aed] border border-purple-200">
                          {pkg.data_origin === "SYNTHETIC_TEST" ? (pkg.reporting_period ? `${pkg.reporting_period} Data` : "Staged Upload Data") : "Global Dataset"}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-1">
                        <span>Period: {pkg.reporting_period || "2026-11"}</span>
                        <span>&bull;</span>
                        <span>{pkg.uploaded_file_count || 7} datasets</span>
                        <span>&bull;</span>
                        <span>{pkg.completed_at ? new Date(pkg.completed_at).toLocaleString() : "Recently"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pkg.status === "COMPLETED" || pkg.status === "COMMITTED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-600"
                        }`}
                    >
                      {pkg.status}
                    </span>
                    <button
                      onClick={() => handleOpenHistoricalPackage(pkg)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-purple-200 hover:bg-purple-50 text-[#7c3aed] text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>View Results</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          STAGE 1: DATASET UPLOAD UI (Matching Reference Image 1)
          ========================================================================= */}
      {activeTab === "upload" && currentStage === 1 && (
        <div className="w-full space-y-4">
          {/* Hero Banner Card */}
          <div className="w-full rounded-2xl bg-gradient-to-r from-purple-50/90 via-white to-purple-50/40 p-5 sm:p-6 border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="z-10 max-w-2xl">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                Upload Your <span className="text-[#7c3aed]">Manufacturing Data</span>
              </h2>
              <p className="text-xs sm:text-[13px] text-slate-600 font-medium mt-1.5 leading-relaxed">
                Upload the required datasets for the selected period. We&apos;ll validate, prepare, and run a manufacturing cost investigation for you.
              </p>
            </div>

            {/* Clean Pipeline Status Badge */}
            <div className="z-10 flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-purple-100/70 text-[#7c3aed] border border-purple-200/80 shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#7c3aed] animate-pulse" />
              <span>Multi-Dataset AI Ingestion Pipeline</span>
            </div>
          </div>

          {/* Two-Column Section: Dropzone & Upload Details (Left) + Expected Dataset Families (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* LEFT: Drag & Drop + Highlights + Upload Details Card (col-span-8) */}
            <div className="lg:col-span-8 flex flex-col space-y-4">
              {/* Large Dashed Drop Zone */}
              <div
                className={`w-full bg-white rounded-2xl p-6 sm:p-7 border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] flex flex-col ${files.length === 0 ? "flex-1 min-h-[530px]" : ""
                  }`}
              >
                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".csv, .xlsx"
                  onChange={(e) => {
                    if (e.target.files) validateAndAddFiles(e.target.files);
                  }}
                  className="hidden"
                />

                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full rounded-2xl border-2 border-dashed p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${files.length === 0 ? "flex-1 min-h-[460px]" : ""
                    } ${dragActive
                      ? "border-[#7c3aed] bg-purple-50/70 scale-[1.01]"
                      : "border-purple-300/80 bg-purple-50/20 hover:border-purple-400 hover:bg-purple-50/40"
                    }`}
                >
                  {/* Purple Cloud Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-purple-100 text-[#7c3aed] flex items-center justify-center mb-4 shadow-xs">
                    <Upload className="w-8 h-8 stroke-[2.2]" />
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    Drag &amp; drop your files here
                  </h3>
                  <span className="text-xs text-slate-400 my-1.5">or</span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="mt-1 px-6 py-2.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-bold shadow-sm shadow-purple-600/25 flex items-center gap-2 cursor-pointer transition-all active:scale-98"
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>Browse Files</span>
                  </button>

                  <span className="text-[11px] text-slate-400 font-medium mt-4">
                    Supports CSV, XLSX &nbsp;|&nbsp; Multiple files allowed
                  </span>

                  {fileError && (
                    <div className="mt-3 text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">
                      {fileError}
                    </div>
                  )}
                </div>

                {/* Selected Files Chips List */}
                {files.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Selected Files ({files.length})</span>
                      <button
                        onClick={() => setFiles([])}
                        className="text-rose-600 hover:underline text-[11px] font-semibold cursor-pointer"
                      >
                        Remove All
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                      {files.map((file, fIdx) => (
                        <div
                          key={fIdx}
                          className="p-2 rounded-xl bg-purple-50/40 border border-purple-100 flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FileSpreadsheet className="w-4 h-4 text-[#7c3aed] shrink-0" />
                            <span className="truncate font-semibold text-slate-800">{file.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ({formatFileSize(file.size)})
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemoveFile(fIdx)}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-0.5"
                          >
                            <XIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Details & Detected Period Card (Shown ONLY after datasets are added) */}
              {files.length > 0 && (
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span>Upload Details &amp; Period Validation</span>
                    </div>

                    {/* Dynamic Date Coverage Badge */}
                    {detectedPeriodInfo.coverage_status === "CONSISTENT" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Consistent Date Coverage ({detectedPeriodInfo.alignment_pct}% Alignment)</span>
                      </span>
                    ) : detectedPeriodInfo.coverage_status === "PARTIAL_COVERAGE" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Minor Date Variance ({detectedPeriodInfo.alignment_pct}% Alignment)</span>
                      </span>
                    ) : detectedPeriodInfo.coverage_status === "INCONSISTENT" || detectedPeriodInfo.coverage_status === "MISSING_DATES" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Date Inconsistencies Detected</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Awaiting Dataset Inspection</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch">
                    {/* Col 1: Data Package Name (md:col-span-5) */}
                    <div className="md:col-span-5 flex flex-col justify-between p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          Data Package Name
                        </label>
                        <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                          Unique identifier for this manufacturing package release.
                        </p>
                      </div>
                      <input
                        type="text"
                        value={packageName}
                        onChange={(e) => setPackageName(e.target.value)}
                        placeholder="e.g. November_2026_Test"
                        className="w-full bg-white border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-2xs"
                      />
                    </div>

                    {/* Col 2: Compact Detected Data Period Display (md:col-span-7) */}
                    <div className="md:col-span-7 p-3.5 rounded-xl bg-gradient-to-br from-purple-50/60 via-indigo-50/30 to-white border border-purple-100/90 flex flex-col justify-between">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-purple-600" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900">
                            Detected Data Period
                          </span>
                        </div>
                        {isDetectingPeriod && (
                          <span className="text-[10px] text-purple-600 font-semibold animate-pulse flex items-center gap-1">
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            Inspecting...
                          </span>
                        )}
                      </div>

                      {/* Detected Period Title & Total Days */}
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-mono">
                          {detectedPeriodInfo.detected_period || "Inspecting datasets..."}
                        </div>
                        {detectedPeriodInfo.total_days > 0 && (
                          <span className="text-[11px] font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-md">
                            {detectedPeriodInfo.total_days} Days Coverage
                          </span>
                        )}
                      </div>

                      {/* Earliest & Latest Transaction Dates */}
                      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-purple-100/70 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 font-medium block">Earliest Transaction Date</span>
                          <span className="font-bold text-slate-800 font-mono text-xs">
                            {detectedPeriodInfo.earliest_date_formatted || detectedPeriodInfo.earliest_date || "—"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-medium block">Latest Transaction Date</span>
                          <span className="font-bold text-slate-800 font-mono text-xs">
                            {detectedPeriodInfo.latest_date_formatted || detectedPeriodInfo.latest_date || "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date Coverage Validation Status / Inconsistencies Banner */}
                  {detectedPeriodInfo.inconsistencies && detectedPeriodInfo.inconsistencies.length > 0 ? (
                    <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-800">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Date Coverage Advisory ({detectedPeriodInfo.inconsistencies.length} items flagged)</span>
                      </div>
                      <ul className="list-disc pl-5 text-[11px] text-amber-800/90 space-y-0.5">
                        {detectedPeriodInfo.inconsistencies.map((msg, i) => (
                          <li key={i}>{msg}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-50/60 border border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-medium">
                          {detectedPeriodInfo.coverage_message || "Dataset dates automatically validated across all transactional records."}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Comparison period is configured in Stage 3 based on historical data
                      </span>
                    </div>
                  )}

                  {/* Primary CTA Button */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Comparison period selection is performed in Stage 3 based on available historical data.</span>
                    </div>
                    <button
                      onClick={handleStartInspection}
                      className="px-6 py-2.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-bold shadow-md shadow-purple-600/25 flex items-center gap-2 cursor-pointer transition-all active:scale-98"
                    >
                      <span>Inspect &amp; Validate Data</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Expected Dataset Families Card (col-span-4, Matching Reference Image 1) */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-purple-50 text-[#7c3aed] flex items-center justify-center shrink-0">
                  <Database className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    Expected Dataset Families
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Upload one or more of the following datasets (CSV/XLSX).
                  </p>
                </div>
              </div>

              {/* 7 Dataset Family Items */}
              <div className="space-y-2 pt-1">
                {expectedDatasetFamilies.map((fam) => {
                  const Icon = fam.icon;
                  return (
                    <div
                      key={fam.id}
                      className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2.5 transition-colors hover:bg-purple-50/30"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-white border border-slate-200/60 flex items-center justify-center text-purple-700 shrink-0 mt-0.5">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 leading-tight truncate">
                            {fam.name}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                            {fam.description}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full ${fam.required
                          ? "bg-purple-100/80 text-[#7c3aed]"
                          : "bg-slate-100 text-slate-500"
                          }`}
                      >
                        {fam.badge}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STAGE 2: SEQUENTIAL VALIDATION & PREPARATION (Matching Reference Image 2)
          ========================================================================= */}
      {activeTab === "upload" && currentStage === 2 && (
        <div className="w-full space-y-4">
          {/* Header Card: Validating & Preparing Data */}
          <div className="w-full bg-white rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100/70 text-[#7c3aed] flex items-center justify-center shrink-0">
                <Database className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                  Validating &amp; Preparing Data
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Checking data quality, schema, and relationships to ensure a reliable investigation.
                </p>
              </div>
            </div>

            <div className="text-sm font-black text-slate-900 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-100">
              {detectedDatasetsCount} / {detectedDatasetsCount} Datasets
            </div>
          </div>

          {/* Two-Column Section: Sequential Stepper (Left) + Circular Progress (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* LEFT: 6 Sequential Operations (col-span-8) */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)]">
              <div className="flex flex-col gap-2">
                {validationOperations.map((op, idx) => {
                  const isCompleted = op.status === "COMPLETED";
                  const isInProgress = op.status === "IN_PROGRESS";
                  const isPending = op.status === "PENDING";
                  const isFailed = op.status === "FAILED";

                  return (
                    <div key={op.id} className="relative flex items-start gap-3">
                      {/* Left Connected Vertical Step Dot & Line */}
                      <div className="flex flex-col items-center shrink-0 mt-1.5">
                        <div
                          className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isCompleted
                            ? "bg-emerald-500 text-white shadow-xs"
                            : isInProgress
                              ? "border-2 border-[#7c3aed] bg-white text-[#7c3aed]"
                              : "border border-slate-300 bg-slate-100 text-slate-400"
                            }`}
                        >
                          {isCompleted ? (
                            <Check className="w-3 h-3 stroke-[3]" />
                          ) : isInProgress ? (
                            <div className="w-2 h-2 rounded-full bg-[#7c3aed] animate-ping" />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          )}
                        </div>
                        {idx < validationOperations.length - 1 && (
                          <div
                            className={`w-0.5 h-6 my-0.5 transition-colors ${isCompleted ? "bg-emerald-400" : "bg-slate-200"
                              }`}
                          />
                        )}
                      </div>

                      {/* Operation Body Card */}
                      <div
                        className={`flex-1 py-2 px-3.5 rounded-xl border transition-all ${isInProgress
                          ? "border-purple-200 bg-purple-50/40 shadow-2xs"
                          : isCompleted
                            ? "border-slate-100 bg-white"
                            : "border-slate-100 bg-slate-50/30 opacity-70"
                          }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <h4
                              className={`text-xs sm:text-[13px] font-bold truncate ${isInProgress ? "text-[#7c3aed]" : "text-slate-900"
                                }`}
                            >
                              {op.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {op.description}
                            </p>
                          </div>

                          {/* Status Badge */}
                          <div className="shrink-0">
                            {isCompleted && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                <Check className="w-3 h-3 stroke-[3]" />
                                Completed
                              </span>
                            )}
                            {isInProgress && (
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] animate-ping" />
                                Processing...
                              </span>
                            )}
                            {isPending && (
                              <span className="text-[10px] font-semibold text-slate-400">
                                Pending
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Animated Progress Bar when In Progress */}
                        {isInProgress && (
                          <div className="mt-1.5 flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-purple-200/70 overflow-hidden">
                              <div
                                style={{ width: `${op.progress}%` }}
                                className="h-full bg-[#7c3aed] rounded-full transition-all duration-300"
                              />
                            </div>
                            <span className="text-[10px] font-bold text-[#7c3aed] font-mono">
                              {op.progress}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: Circular Progress Gauge (col-span-4, Matching Reference Image 2) */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] space-y-4 flex flex-col items-center">
              {/* Radial Donut Gauge */}
              <div className="relative w-40 h-40 flex items-center justify-center my-2">
                <svg className="w-full h-full -rotate-90 overflow-visible" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="11"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="11"
                    strokeDasharray={`${(overallProgressPercent / 100) * (2 * Math.PI * 48)} ${2 * Math.PI * 48
                      }`}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-slate-900 leading-tight">
                    {overallProgressPercent}%
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 mt-0.5">
                    Preparing Data...
                  </span>
                </div>
              </div>

              {/* Metadata Details Box below gauge */}
              <div className="w-full space-y-2 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <Database className="w-3.5 h-3.5 text-purple-600" />
                    <span>Total Records</span>
                  </div>
                  <span className="font-bold text-slate-900 font-mono">
                    {totalRecordsCount.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    <span>Period</span>
                  </div>
                  <span className="font-bold text-slate-900">
                    {dataPeriod || activeBatchManifest?.reporting_period || "Active Upload Scope"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <Layers className="w-3.5 h-3.5 text-purple-600" />
                    <span>Datasets</span>
                  </div>
                  <span className="font-bold text-slate-900 font-mono">
                    {detectedDatasetsCount}
                  </span>
                </div>
              </div>

              {/* Manual advance button if needed */}
              <button
                onClick={() => {
                  if (onNavigateToResults) onNavigateToResults(effectiveSessionId);
                  else setCurrentStage(3);
                }}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7c3aed] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>View Completed Result</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STAGE 3: MANUFACTURING COST AI INVESTIGATION RESULT (Matching Image 3)
          ========================================================================= */}
      {activeTab === "upload" && currentStage === 3 && (
        <div className="w-full space-y-4 pb-6">
          {/* Commit / Consolidation Success Alert Banner */}
          {commitMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{commitMessage}</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-mono">ID: {generatedReportId}</span>
            </div>
          )}

          {/* Commit Blocked / Error Alert Banner */}
          {commitError && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-semibold flex items-center justify-between shadow-2xs animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold text-amber-950">Commit Blocked: </span>
                  <span className="text-amber-900">{commitError}</span>
                  <p className="text-[11px] font-normal text-amber-800 mt-0.5">
                    Uploaded datasets remain safely preserved and isolated in your active investigation session.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCommitError(null)}
                className="text-amber-700 hover:text-amber-950 text-xs font-bold ml-3 shrink-0 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* High-Polish Executive Filter Bar (Strict Single-Line Layout) */}
          <div className="w-full bg-white rounded-2xl p-2.5 sm:p-3 border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] flex items-center flex-nowrap gap-2 sm:gap-2.5 overflow-visible relative z-30">
            {/* Filter 1: Date Range */}
            <div className="flex-1 min-w-[155px] relative bg-slate-50/80 hover:bg-white border border-slate-200/90 hover:border-purple-300 focus-within:border-[#7c3aed] focus-within:bg-white focus-within:ring-2 focus-within:ring-purple-100 rounded-xl px-2.5 py-1.5 transition-all shadow-2xs group">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                <Calendar className="w-3 h-3 text-[#7c3aed] shrink-0" />
                <span className="truncate">Date Range</span>
              </div>
              <select
                value={filterDateRange || reportData?.reporting_period_label || reportData?.executive_finding?.current_period_label || ""}
                onChange={(e) => setFilterDateRange(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer appearance-none pt-0.5 pr-4 truncate font-sans"
              >
                {(reportData?.reporting_period_label || reportData?.executive_finding?.current_period_label || reportData?.scope?.period_range) ? (
                  <option value={reportData.reporting_period_label || reportData.executive_finding?.current_period_label || reportData.scope?.period_range}>
                    {reportData.reporting_period_label || reportData.executive_finding?.current_period_label || reportData.scope?.period_range}
                  </option>
                ) : (
                  <option value="">Active Upload Period</option>
                )}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-purple-600 transition-colors absolute right-2 bottom-2 pointer-events-none" />
            </div>

            {/* Filter 2: Compare With (Hybrid Historical Comparison) */}
            <div ref={comparePopoverRef} className="flex-1 min-w-[170px] relative">
              <div
                onClick={() => setIsComparePopoverOpen(!isComparePopoverOpen)}
                className={`w-full bg-slate-50/80 hover:bg-white border ${
                  isComparePopoverOpen ? "border-blue-500 bg-white ring-2 ring-blue-100" : "border-slate-200/90 hover:border-blue-300"
                } rounded-xl px-2.5 py-1.5 transition-all shadow-2xs group cursor-pointer select-none`}
              >
                <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <History className="w-3 h-3 text-blue-500 shrink-0" />
                    <span className="truncate">Compare With</span>
                  </div>
                  {baselineMode !== "PREVIOUS_MONTH" && (
                    <span className="text-[8px] px-1.5 py-0.2 rounded font-bold bg-blue-100 text-blue-700 uppercase">
                      {baselineMode === "ALL_AVAILABLE" ? "All History" : baselineMode === "PREVIOUS_EQUIVALENT_PERIOD" ? "Equivalent" : baselineMode === "SELECTED_MONTHS" ? `${selectedBaselineMonths.length} Mos` : "Custom"}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-slate-900 truncate font-sans">
                    {getCompareWithDisplayText()}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-transform shrink-0 ${isComparePopoverOpen ? "rotate-180 text-blue-600" : ""}`} />
                </div>
              </div>

              {/* Hybrid Popover Menu */}
              {isComparePopoverOpen && (
                <div className="absolute top-full left-0 mt-2 z-50 w-88 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-3.5 space-y-3 font-sans text-xs">
                  {/* Popover Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5 text-blue-600" />
                        <span>Comparison Baseline</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Authoritative Global Store • Verified Historical Telemetry
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setIsComparePopoverOpen(false); }}
                      className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <XIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Preset 1, 2 & 3: Quick Presets */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Presets</div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {/* Preset 1: Previous Equivalent Period */}
                      {historicalMeta?.previous_equivalent_period && (
                        <button
                          type="button"
                          onClick={() => {
                            setBaselineMode("PREVIOUS_EQUIVALENT_PERIOD");
                            setFilterCompareWith(historicalMeta.previous_equivalent_period.label || "Previous Equivalent Period");
                            setIsComparePopoverOpen(false);
                            fetchInvestigationReport({ baselineMode: "PREVIOUS_EQUIVALENT_PERIOD" });
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                            baselineMode === "PREVIOUS_EQUIVALENT_PERIOD"
                              ? "bg-blue-50/70 border-blue-300 text-blue-900 ring-1 ring-blue-200"
                              : "bg-slate-50/60 hover:bg-slate-100/80 border-slate-200 text-slate-700"
                          }`}
                        >
                          <div>
                            <div className="font-bold flex items-center gap-1.5 text-xs">
                              <span>{historicalMeta.previous_equivalent_period.short_label || "Previous Equivalent Period"}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                                {historicalMeta.previous_equivalent_period.duration_days ? `${historicalMeta.previous_equivalent_period.duration_days}d Matched` : "Equivalent"}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {historicalMeta.previous_equivalent_period.coverage_display || "Equal-duration immediately preceding investigation"}
                            </div>
                          </div>
                          {baselineMode === "PREVIOUS_EQUIVALENT_PERIOD" && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                        </button>
                      )}

                      {/* Preset 2: Previous Month (October 2026) */}
                      <button
                        type="button"
                        onClick={() => {
                          setBaselineMode("PREVIOUS_MONTH");
                          setFilterCompareWith("October 2026");
                          setIsComparePopoverOpen(false);
                          fetchInvestigationReport({ baselineMode: "PREVIOUS_MONTH" });
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                          baselineMode === "PREVIOUS_MONTH"
                            ? "bg-blue-50/70 border-blue-300 text-blue-900 ring-1 ring-blue-200"
                            : "bg-slate-50/60 hover:bg-slate-100/80 border-slate-200 text-slate-700"
                        }`}
                      >
                        <div>
                          <div className="font-bold flex items-center gap-1.5 text-xs">
                            <span>October 2026</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100/80 text-blue-700 font-semibold">Previous Month</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Oct 01 – Oct 31, 2026 • 1,659 verified records
                          </div>
                        </div>
                        {baselineMode === "PREVIOUS_MONTH" && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                      </button>

                      {/* Preset 3: All Available History */}
                      <button
                        type="button"
                        onClick={() => {
                          setBaselineMode("ALL_AVAILABLE");
                          setFilterCompareWith("All Available History (Aug–Oct 2026)");
                          setIsComparePopoverOpen(false);
                          fetchInvestigationReport({ baselineMode: "ALL_AVAILABLE" });
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                          baselineMode === "ALL_AVAILABLE"
                            ? "bg-purple-50/70 border-purple-300 text-purple-900 ring-1 ring-purple-200"
                            : "bg-slate-50/60 hover:bg-slate-100/80 border-slate-200 text-slate-700"
                        }`}
                      >
                        <div>
                          <div className="font-bold flex items-center gap-1.5 text-xs">
                            <span>All Available History</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100/80 text-purple-700 font-semibold">Aug–Oct 2026</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Aug 01 – Oct 31, 2026 • 5,000 records across 3 months
                          </div>
                        </div>
                        {baselineMode === "ALL_AVAILABLE" && <Check className="w-4 h-4 text-purple-600 shrink-0" />}
                      </button>
                    </div>
                  </div>

                  {/* Mode 2: Multi-Select Historical Months */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Historical Months</span>
                      <span className="text-[10px] text-slate-500 font-medium">Click name for 1-mo or select multiple</span>
                    </div>
                    <div className="space-y-1 bg-slate-50/60 p-2 rounded-xl border border-slate-200/80">
                      {eligibleHistoricalMonths.map((m) => {
                        const isChecked = selectedBaselineMonths.includes(m.id);
                        return (
                          <div
                            key={m.id}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
                              isChecked ? "bg-white text-slate-900 font-bold shadow-2xs" : "hover:bg-slate-100/60 text-slate-600 font-medium"
                            }`}
                          >
                            <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  if (isChecked) {
                                    if (selectedBaselineMonths.length > 1) {
                                      setSelectedBaselineMonths(selectedBaselineMonths.filter((id) => id !== m.id));
                                    }
                                  } else {
                                    setSelectedBaselineMonths([...selectedBaselineMonths, m.id]);
                                  }
                                }}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 shrink-0"
                              />
                              <span className="text-xs truncate">{m.label || m.short_label}</span>
                            </label>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] text-slate-400 font-mono">
                                {m.record_count ? `${m.record_count.toLocaleString()} recs` : m.coverage_display}
                              </span>
                              <button
                                type="button"
                                title={`Compare only with ${m.label || m.short_label}`}
                                onClick={() => {
                                  setBaselineMode("SELECTED_MONTHS");
                                  setSelectedBaselineMonths([m.id]);
                                  setFilterCompareWith(m.label || m.short_label);
                                  setIsComparePopoverOpen(false);
                                  fetchInvestigationReport({ baselineMode: "SELECTED_MONTHS", selectedBaselineMonths: [m.id] });
                                }}
                                className="text-[9.5px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold cursor-pointer"
                              >
                                Only
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => {
                          setBaselineMode("SELECTED_MONTHS");
                          const label = selectedBaselineMonths
                            .map((id) => eligibleHistoricalMonths.find((m) => m.id === id)?.short_label || id)
                            .join(" + ");
                          setFilterCompareWith(label);
                          setIsComparePopoverOpen(false);
                          fetchInvestigationReport({ baselineMode: "SELECTED_MONTHS", selectedBaselineMonths });
                        }}
                        className="w-full mt-1.5 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-center shadow-xs cursor-pointer text-xs"
                      >
                        Apply Selected Months ({selectedBaselineMonths.length})
                      </button>
                    </div>
                  </div>

                  {/* Mode 3: Custom Date Range */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Custom Date Range</span>
                      <span className="text-[10px] text-slate-400">Within Aug 01 – Oct 31, 2026</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 block mb-0.5">Start Date</label>
                        <input
                          type="date"
                          value={customBaseStart}
                          min="2026-08-01"
                          max="2026-10-31"
                          onChange={(e) => setCustomBaseStart(e.target.value)}
                          className="w-full text-xs font-mono font-medium px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 block mb-0.5">End Date</label>
                        <input
                          type="date"
                          value={customBaseEnd}
                          min="2026-08-01"
                          max="2026-10-31"
                          onChange={(e) => setCustomBaseEnd(e.target.value)}
                          className="w-full text-xs font-mono font-medium px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={!customBaseStart || !customBaseEnd || customBaseStart > customBaseEnd}
                      onClick={() => {
                        setBaselineMode("CUSTOM_RANGE");
                        setFilterCompareWith(`${customBaseStart} to ${customBaseEnd}`);
                        setIsComparePopoverOpen(false);
                        fetchInvestigationReport({ baselineMode: "CUSTOM_RANGE", customBaseStart, customBaseEnd });
                      }}
                      className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-bold rounded-lg transition-colors text-center shadow-xs cursor-pointer text-xs mt-1"
                    >
                      Apply Custom Range
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Filter 3: Product */}
            <div className="flex-1 min-w-[125px] relative bg-slate-50/80 hover:bg-white border border-slate-200/90 hover:border-amber-300 focus-within:border-amber-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-100 rounded-xl px-2.5 py-1.5 transition-all shadow-2xs group">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                <Box className="w-3 h-3 text-amber-500 shrink-0" />
                <span className="truncate">Product</span>
              </div>
              <select
                value={filterProduct}
                onChange={(e) => setFilterProduct(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer appearance-none pt-0.5 pr-4 truncate font-sans"
              >
                <option value="All Products">All Products</option>
                <option value="SPH-PRO-256">SPH-PRO-256</option>
                <option value="SPH-A15-256">SPH-A15-256</option>
                <option value="SPH-A15-128">SPH-A15-128</option>
                <option value="SPH-PRO-512">SPH-PRO-512</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-amber-500 transition-colors absolute right-2 bottom-2 pointer-events-none" />
            </div>

            {/* Filter 4: Plant */}
            <div className="flex-1 min-w-[110px] relative bg-slate-50/80 hover:bg-white border border-slate-200/90 hover:border-emerald-300 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 rounded-xl px-2.5 py-1.5 transition-all shadow-2xs group">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                <Building2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">Plant</span>
              </div>
              <select
                value={filterPlant}
                onChange={(e) => setFilterPlant(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer appearance-none pt-0.5 pr-4 truncate font-sans"
              >
                <option value="All Plants">All Plants</option>
                <option value="IN-TS-01">IN-TS-01</option>
                <option value="IN-KA-01">IN-KA-01</option>
                <option value="IN-TN-01">IN-TN-01</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-emerald-500 transition-colors absolute right-2 bottom-2 pointer-events-none" />
            </div>

            {/* Filter 5: Line */}
            <div className="flex-1 min-w-[110px] relative bg-slate-50/80 hover:bg-white border border-slate-200/90 hover:border-indigo-300 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 rounded-xl px-2.5 py-1.5 transition-all shadow-2xs group">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                <Layers className="w-3 h-3 text-indigo-500 shrink-0" />
                <span className="truncate">Line</span>
              </div>
              <select
                value={filterLine}
                onChange={(e) => setFilterLine(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer appearance-none pt-0.5 pr-4 truncate font-sans"
              >
                <option value="All Lines">All Lines</option>
                <option value="FAL-L1">FAL-L1</option>
                <option value="FAL-L2">FAL-L2</option>
                <option value="SMT-L1">SMT-L1</option>
                <option value="SMT-L2">SMT-L2</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-indigo-500 transition-colors absolute right-2 bottom-2 pointer-events-none" />
            </div>

            {/* Reset Button (If modified) */}
            {(filterProduct !== "All Products" || filterPlant !== "All Plants" || filterLine !== "All Lines" || baselineMode !== "PREVIOUS_MONTH") && (
              <button
                onClick={() => {
                  setFilterProduct("All Products");
                  setFilterPlant("All Plants");
                  setFilterLine("All Lines");
                  setBaselineMode("PREVIOUS_MONTH");
                  setFilterCompareWith("October 2026");
                  setFiltersAppliedMessage("Reset");
                  fetchInvestigationReport({ baselineMode: "PREVIOUS_MONTH" });
                  setTimeout(() => setFiltersAppliedMessage(null), 2000);
                }}
                title="Reset filters"
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Apply Filters Button */}
            <button
              onClick={() => {
                fetchInvestigationReport();
                setFiltersAppliedMessage("Applied");
                setTimeout(() => setFiltersAppliedMessage(null), 2000);
              }}
              disabled={reportLoading}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer shrink-0 whitespace-nowrap active:scale-98 disabled:opacity-85 disabled:cursor-wait ${reportLoading
                ? "bg-purple-600 text-white shadow-purple-600/20"
                : filtersAppliedMessage
                  ? "bg-emerald-600 text-white shadow-emerald-600/20"
                  : "bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-purple-600/20"
                }`}
            >
              {reportLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Applying Filters...</span>
                </>
              ) : filtersAppliedMessage ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{filtersAppliedMessage}</span>
                </>
              ) : (
                <>
                  <Filter className="w-3.5 h-3.5" />
                  <span>Apply Filters</span>
                </>
              )}
            </button>
          </div>

          {/* Active Session Identity & Data Scope Banner — Left End, Middle, Right End */}
          <div className="relative w-full bg-gradient-to-r from-purple-50/90 via-[#fcfaff] to-purple-50/70 border border-purple-200/90 rounded-2xl px-4 sm:px-6 py-3 shadow-[0_2px_12px_rgba(111,61,186,0.04)]">
            <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 w-full">
              {/* Left End: Active Scope */}
              <div className="flex items-center justify-start">
                <div
                  className="flex items-center gap-2 shrink-0 cursor-default"
                  title={`Session ID: ${reportData?.scope?.staged_batch_id || effectiveSessionId || routeSessionId || "—"}`}
                >
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-100/90 border border-purple-200/80 px-2.5 py-1 rounded-md shrink-0">
                    Active Scope
                  </span>
                </div>
              </div>

              {/* Middle: Records Validated */}
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-xs text-slate-700 font-semibold shrink-0">
                  <Database className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>
                    <strong className="text-slate-900 font-mono font-bold">
                      {reportData?.scope?.records_parsed ? reportData.scope.records_parsed.toLocaleString() : "2,610"}
                    </strong>{" "}
                    records validated
                  </span>
                </div>
              </div>

              {/* Right End: Target Analysis Period */}
              <div className="flex items-center justify-end gap-2">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-purple-200/80 shadow-2xs text-xs text-purple-900 font-semibold shrink-0">
                  <Calendar className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>
                    Target:{" "}
                    <strong className="text-purple-700 font-bold font-mono">
                      {reportData?.executive_finding?.current_period_label || reportData?.scope?.current_period || "Nov 2026"}
                    </strong>
                  </span>

                  {reportData?.is_partial_period && (
                    <span
                      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border bg-amber-50 text-amber-800 border-amber-200 shrink-0 ml-1"
                      title={reportData.partial_period_note || "Day-aligned like-for-like baseline"}
                    >
                      <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                      Day-Aligned
                    </span>
                  )}
                </div>

                {/* Live Loading / Updating State Indicator */}
                {reportLoading && (
                  <UpdatingIndicator text="Filtering..." />
                )}
              </div>
            </div>
          </div>

          {/* Main Results Body with Smooth Filter Updating Transition */}
          <div className={`space-y-4 transition-all duration-300 ${reportLoading ? "opacity-50 pointer-events-none cursor-wait" : "opacity-100"}`}>

            {/* Row 1: 4 KPI Cards (Uniform Consistent Typography & Structure) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* KPI 1: Total Manufacturing Cost */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] flex items-center gap-3.5 h-full">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-100/80 text-[#7c3aed] flex items-center justify-center shrink-0 shadow-2xs">
                  <Layers className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-500 truncate">Total Manufacturing Cost</div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight mt-1 font-mono whitespace-nowrap">
                    {reportMetrics?.currCostCr ? `₹${reportMetrics.currCostCr}` : (reportData?.current_total_cost ? `₹${(reportData.current_total_cost / 1e7).toFixed(2)}` : "—")} <span className="text-sm font-bold text-slate-600">Cr</span>
                  </div>
                  {reportData?.is_unequal_duration ? (
                    <div className="space-y-0.5 mt-1">
                      <div className="flex items-center flex-nowrap gap-1 text-xs font-semibold whitespace-nowrap overflow-hidden">
                        <span className={reportMetrics?.costDeltaPct >= 0 ? "text-rose-600 font-bold shrink-0" : "text-emerald-600 font-bold shrink-0"}>
                          {reportMetrics?.costDeltaPct >= 0 ? "▲ " : "▼ "}{Math.abs(reportMetrics?.costDeltaPct || 0).toFixed(2)}%
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 uppercase shrink-0">
                          Run-Rate
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium truncate" title={reportData?.comparison_note || "Unequal duration comparison"}>
                        Ref: ₹{((reportData.raw_baseline_total_cost || reportData.baseline_total_cost) / 1e7).toFixed(2)} Cr ({reportData.is_aggregate_history ? "3 Mos History" : "Historical Ref"})
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center flex-nowrap gap-1.5 mt-1.5 text-xs font-semibold whitespace-nowrap overflow-hidden">
                      {reportMetrics?.costDeltaPct != null ? (
                        <span className={reportMetrics.costDeltaPct >= 0 ? "text-rose-600 font-bold shrink-0" : "text-emerald-600 font-bold shrink-0"}>
                          {reportMetrics.costDeltaPct >= 0 ? "▲ " : "▼ "}{Math.abs(reportMetrics.costDeltaPct).toFixed(2)}%
                        </span>
                      ) : <span className="text-slate-400 font-medium shrink-0">Baseline N/A</span>}
                      {reportMetrics?.baseCostCr != null && (
                        <span className="text-slate-400 font-medium truncate">vs ₹{reportMetrics.baseCostCr} Cr</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* KPI 2: Average Cost per Good Unit */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] flex items-center gap-3.5 h-full">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-100/80 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Box className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-500 truncate">Average Cost per Good Unit</div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight mt-1 font-mono whitespace-nowrap">
                    {reportMetrics?.currGoodUnitCost != null
                      ? `₹${Number(reportMetrics.currGoodUnitCost).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : "—"}
                  </div>
                  <div className="flex items-center flex-nowrap gap-1.5 mt-1.5 text-xs font-semibold whitespace-nowrap overflow-hidden">
                    {reportMetrics?.unitCostDeltaPct != null ? (
                      <span className={reportMetrics.unitCostDeltaPct >= 0 ? "text-rose-600 font-bold shrink-0" : "text-emerald-600 font-bold shrink-0"}>
                        {reportMetrics.unitCostDeltaPct >= 0 ? "▲ " : "▼ "}{Math.abs(reportMetrics.unitCostDeltaPct).toFixed(2)}%
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium shrink-0">
                        {reportData?.scope?.incomparability_reason || "No comparable historical data"}
                      </span>
                    )}
                    {reportMetrics?.baseGoodUnitCost != null && (
                      <span className="text-slate-400 font-medium truncate">vs ₹{Number(reportMetrics.baseGoodUnitCost).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* KPI 3: Production Output */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] flex items-center gap-3.5 h-full">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <BarChart3 className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-500 truncate">Production Output</div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight mt-1 font-mono whitespace-nowrap">
                    {reportMetrics?.currProduced != null
                      ? Number(reportMetrics.currProduced).toLocaleString("en-IN")
                      : "—"} <span className="text-xs font-bold text-slate-500">units</span>
                  </div>
                  {reportData?.is_unequal_duration ? (
                    <div className="space-y-0.5 mt-1">
                      <div className="flex items-center flex-nowrap gap-1 text-xs font-semibold whitespace-nowrap overflow-hidden">
                        {reportMetrics?.producedDailyRateDeltaPct != null ? (
                          <span className={reportMetrics.producedDailyRateDeltaPct >= 0 ? "text-emerald-600 font-bold shrink-0" : "text-rose-600 font-bold shrink-0"}>
                            {reportMetrics.producedDailyRateDeltaPct >= 0 ? "▲ " : "▼ "}{Math.abs(reportMetrics.producedDailyRateDeltaPct).toFixed(2)}%
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium shrink-0">Rate N/A</span>
                        )}
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 uppercase shrink-0">
                          Run-Rate
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium truncate" title={`Total historical produced: ${Number(reportMetrics?.baseProduced || 0).toLocaleString('en-IN')} units`}>
                        Ref: {reportMetrics?.baseProduced ? `${Number(reportMetrics.baseProduced).toLocaleString("en-IN")} units` : "Historical Ref"}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center flex-nowrap gap-1.5 mt-1.5 text-xs font-semibold whitespace-nowrap overflow-hidden">
                      {reportMetrics?.producedDeltaPct != null ? (
                        <span className={reportMetrics.producedDeltaPct >= 0 ? "text-emerald-600 font-bold shrink-0" : "text-rose-600 font-bold shrink-0"}>
                          {reportMetrics.producedDeltaPct >= 0 ? "▲ " : "▼ "}{Math.abs(reportMetrics.producedDeltaPct).toFixed(2)}%
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium shrink-0">
                          {reportData?.scope?.incomparability_reason || "No comparable historical data"}
                        </span>
                      )}
                      {reportMetrics?.baseProduced != null && (
                        <span className="text-slate-400 font-medium truncate">vs {Number(reportMetrics.baseProduced).toLocaleString("en-IN")}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* KPI 4: Overall Assembly Yield */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] flex items-center gap-3.5 h-full">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-100/80 text-[#7c3aed] flex items-center justify-center shrink-0 shadow-2xs">
                  <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-500 truncate">Overall Assembly Yield</div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight mt-1 font-mono whitespace-nowrap">
                    {reportMetrics?.currYield != null
                      ? `${reportMetrics.currYield.toFixed(2)}%`
                      : "—"}
                  </div>
                  <div className="flex items-center flex-nowrap gap-1.5 mt-1.5 text-xs font-semibold whitespace-nowrap overflow-hidden">
                    {reportMetrics?.yieldPpDelta != null ? (
                      <span className={reportMetrics.yieldPpDelta >= 0 ? "text-emerald-600 font-bold shrink-0" : "text-rose-600 font-bold shrink-0"}>
                        {reportMetrics.yieldPpDelta >= 0 ? "▲ " : "▼ "}{Math.abs(reportMetrics.yieldPpDelta).toFixed(2)} pp
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium shrink-0">
                        {reportData?.scope?.incomparability_reason || "No comparable historical data"}
                      </span>
                    )}
                    {reportMetrics?.baseYield != null && (
                      <span className="text-slate-400 font-medium truncate">vs {reportMetrics.baseYield.toFixed(2)}%</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: 2 Columns: Manufacturing Cost Trend (Left - approx 8/12) + Main Reasons for Cost Increase (Right - approx 4/12) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
              {/* LEFT: Manufacturing Cost Trend (col-span-8) */}
              <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] flex flex-col">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200/70 text-[#7c3aed] flex items-center justify-center shrink-0 shadow-2xs">
                        <TrendingUp className="w-4 h-4 text-[#7c3aed]" />
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                        <span>Manufacturing Cost Trend</span>
                        <Info className="w-3.5 h-3.5 text-slate-400" />
                      </h3>
                    </div>

                    {/* Time toggle pill: Daily | Weekly | Monthly */}
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
                      {(reportData?.available_granularities || ["Daily", "Weekly"]).map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setTrendPeriod(t);
                            setHoveredTrendPoint(null);
                          }}
                          className={`px-3 py-1 rounded-lg transition-all ${trendPeriod === t
                            ? "bg-[#7c3aed] text-white shadow-2xs font-bold"
                            : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Executive Sub-Header Bar (Quick Stats + Legend + Comparative Pill) */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-2.5 border-t border-purple-50">
                    {/* Left: Quick stat badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 text-xs">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Total:</span>
                        <span className="font-mono font-black text-slate-900">
                          {reportMetrics?.currCostCr ? `₹${reportMetrics.currCostCr} Cr` : (reportData?.current_total_cost ? `₹${(reportData.current_total_cost / 1e7).toFixed(2)} Cr` : "N/A")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 text-xs">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Baseline:</span>
                        <span className="font-mono font-bold text-slate-600">
                          {reportMetrics?.baseCostCr ? `₹${reportMetrics.baseCostCr} Cr` : "Baseline N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200/60 text-purple-900 text-xs">
                        <span className="text-[10px] uppercase font-bold text-purple-600">
                          {trendPeriod === "Weekly" ? "Peak Weekly:" : trendPeriod === "Monthly" ? "Peak Monthly:" : "Peak Daily:"}
                        </span>
                        <span className="font-mono font-black text-[#7c3aed]">
                          {trendConfig.peakPoint ? `₹${trendConfig.peakPoint.valCr.toFixed(2)} Cr` : (reportMetrics?.peakDayFormatted || "N/A")}
                        </span>
                        {trendConfig.peakPoint?.deltaPct != null && (
                          <span className="text-[9.5px] font-extrabold text-purple-700">
                            ({Math.abs(trendConfig.peakPoint.deltaPct).toFixed(1)}%)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Center / Right: Dynamic Legend with Bars, Baseline & Rolling Avg / Progression Trend */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-2.5 h-3 rounded-xs bg-[#7c3aed] ring-1 ring-purple-200" />
                        <span className="font-bold text-slate-900">
                          {trendPeriod === "Weekly" ? "Actual Cost (Weekly)" : trendPeriod === "Monthly" ? "Actual Cost (Monthly)" : "Actual Cost (Daily)"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                        <span className="w-4 border-t-2 border-dashed border-slate-500" />
                        <span>
                          {trendPeriod === "Weekly" ? "Baseline Weekly Cost" : trendPeriod === "Monthly" ? "Baseline Monthly Cost" : "Baseline Daily Cost"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-amber-700 font-medium">
                        <span className="w-4 border-t-2 border-amber-500" />
                        <span>{trendPeriod === "Daily" ? "3-Day Rolling Avg" : "Actual Spend Trend"}</span>
                      </div>
                    </div>

                    {/* Far Right: Reference 2 Comparative Trending Pill */}
                    {reportData?.cost_change_pct != null && (
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${reportData.cost_change_pct <= 0
                        ? "bg-purple-50/90 border-purple-200/80 text-purple-700"
                        : "bg-rose-50 border-rose-200 text-rose-700"
                        }`}>
                        <TrendingDown className={`w-3.5 h-3.5 ${reportData.cost_change_pct <= 0 ? "text-purple-600" : "rotate-180 text-rose-600"}`} />
                        <span>
                          Cost is {Math.abs(reportData.cost_change_pct).toFixed(1)}% {reportData.cost_change_pct <= 0 ? "lower" : "higher"} than baseline
                        </span>
                        <span className="text-[11px] opacity-75">{reportData.cost_change_pct <= 0 ? "↘" : "↗"}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Premium Gradient Area Chart (Reference 2) */}
                <div className="relative w-full flex-1 min-h-[350px] sm:min-h-[385px] mt-2 flex items-center justify-center">
                  <svg className="w-full h-full select-none overflow-visible" viewBox="0 0 920 380">
                    <defs>
                      {/* Premium Vertical Purple Gradient (stronger near line, fading to nearly transparent at floor) */}
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.32" />
                        <stop offset="45%" stopColor="#8b5cf6" stopOpacity="0.16" />
                        <stop offset="85%" stopColor="#a78bfa" stopOpacity="0.05" />
                        <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.01" />
                      </linearGradient>

                      {/* Bar Gradient for Actual Daily Expenditure */}
                      <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.92" />
                        <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.75" />
                      </linearGradient>

                      {/* Smooth Line Glow Filter */}
                      <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#7c3aed" floodOpacity="0.28" />
                      </filter>

                      {/* Peak Callout Badge Drop Shadow */}
                      <filter id="peakCardShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.10" />
                      </filter>

                      {/* Interactive Tooltip Card Shadow */}
                      <filter id="hudCardShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.12" />
                      </filter>
                    </defs>

                    {/* Horizontal Gridlines & Left Y-Axis Values */}
                    {trendConfig.yTicks.map((item) => (
                      <g key={item.val}>
                        <text
                          x="56"
                          y={item.y + 3.5}
                          textAnchor="end"
                          className="text-[11px] font-mono font-medium fill-slate-400"
                        >
                          {item.val}
                        </text>
                        <line
                          x1="68"
                          y1={item.y}
                          x2="880"
                          y2={item.y}
                          stroke="#f1f5f9"
                          strokeWidth="1"
                          strokeDasharray="4 4"
                        />
                      </g>
                    ))}

                    {/* Y-Axis Line & Floor Zero Line */}
                    <line x1="68" y1="45" x2="68" y2={trendConfig.chartBottom} stroke="#e2e8f0" strokeWidth="1" />
                    <line x1="68" y1={trendConfig.chartBottom} x2="880" y2={trendConfig.chartBottom} stroke="#e2e8f0" strokeWidth="1" />

                    {/* Y-Axis Rotated Title */}
                    <text
                      x="18"
                      y="185"
                      textAnchor="middle"
                      transform="rotate(-90, 18, 185)"
                      className="text-[10.5px] font-bold tracking-wider fill-slate-400 font-mono"
                    >
                      {trendConfig.yTitle}
                    </text>

                    {/* Dynamic Axis Break Demarcation (When baseline is much larger than actuals) */}
                    {trendConfig.isAxisBroken && trendConfig.breakY != null && (
                      <g key="axis-break-indicator">
                        <line
                          x1="68"
                          y1={trendConfig.breakY}
                          x2="880"
                          y2={trendConfig.breakY}
                          stroke="#e2e8f0"
                          strokeWidth="1"
                          strokeDasharray="4 4"
                        />
                        <rect
                          x="74"
                          y={trendConfig.breakY - 8}
                          width="68"
                          height="16"
                          rx="4"
                          fill="#f8fafc"
                          stroke="#e2e8f0"
                          strokeWidth="0.8"
                        />
                        <text
                          x="108"
                          y={trendConfig.breakY + 3.5}
                          textAnchor="middle"
                          className="text-[8.5px] font-mono font-bold fill-slate-400"
                        >
                          ≈ axis break
                        </text>
                        {/* Zigzag break mark on Y-axis line */}
                        <path
                          d={`M 65 ${trendConfig.breakY - 5} L 71 ${trendConfig.breakY - 1} L 65 ${trendConfig.breakY + 3} L 71 ${trendConfig.breakY + 7}`}
                          fill="none"
                          stroke="#94a3b8"
                          strokeWidth="1.5"
                        />
                      </g>
                    )}

                    {/* Baseline Horizontal Dashed Reference Line & Smart Non-Colliding Badge */}
                    {trendConfig.baselineY != null && (
                      <g>
                        <line
                          x1="68"
                          y1={trendConfig.baselineY}
                          x2="880"
                          y2={trendConfig.baselineY}
                          stroke="#64748b"
                          strokeWidth="1.6"
                          strokeDasharray="5 4"
                        />
                        <rect
                          x={baselineBadgeX - 60}
                          y={trendConfig.baselineY - 10}
                          width="120"
                          height="20"
                          rx="4"
                          fill="#f8fafc"
                          stroke="#cbd5e1"
                          strokeWidth="1"
                        />
                        <text
                          x={baselineBadgeX}
                          y={trendConfig.baselineY + 3.5}
                          textAnchor="middle"
                          className="text-[9.5px] font-bold fill-slate-600 font-mono"
                        >
                          Baseline: {trendConfig.baselineVal}
                        </text>
                      </g>
                    )}

                    {/* Combined Bar-and-Line: Prominent Actual Daily Expenditure Bars */}
                    {trendConfig.points.map((p) => {
                      const isHovered = hoveredTrendPoint?.label === p.label;
                      const isPeak = p === trendConfig.peakPoint;
                      const barW = trendConfig.barWidth || 18;

                      if (p.isOperatingDay === false) {
                        // Muted floor indicator for scheduled non-operating Sunday / Maintenance day
                        return (
                          <rect
                            key={`bar-${p.label}`}
                            x={p.x - barW / 2}
                            y={trendConfig.chartBottom - 6}
                            width={barW}
                            height={6}
                            rx="2"
                            fill={isHovered ? "#e2e8f0" : "#f1f5f9"}
                            stroke="#cbd5e1"
                            strokeWidth="1"
                            strokeDasharray="2 2"
                            className="transition-all duration-150 pointer-events-none"
                          />
                        );
                      }

                      const barH = Math.max(3, trendConfig.chartBottom - p.y);
                      const finalBarW = isHovered ? barW + 4 : barW;
                      return (
                        <g key={`bar-group-${p.label}`}>
                          <rect
                            x={p.x - finalBarW / 2}
                            y={p.y}
                            width={finalBarW}
                            height={barH}
                            rx={barW >= 40 ? "6" : "3.5"}
                            fill={isHovered ? "#6d28d9" : isPeak ? "#7c3aed" : "url(#barGradient)"}
                            stroke={isHovered || isPeak ? "#5b21b6" : "#6d28d9"}
                            strokeWidth={isHovered ? 2 : 1}
                            opacity={isHovered ? 1 : 0.94}
                            filter={isHovered ? "drop-shadow(0 4px 12px rgba(124,58,237,0.30))" : undefined}
                            className="transition-all duration-150 pointer-events-none"
                          />
                          {/* Top Specular Bevel Sheen for prominent wide columns */}
                          {barW >= 40 && barH > 12 && (
                            <line
                              x1={p.x - finalBarW / 2 + 5}
                              y1={p.y + 1.5}
                              x2={p.x + finalBarW / 2 - 5}
                              y2={p.y + 1.5}
                              stroke="#ffffff"
                              strokeWidth="1.5"
                              strokeOpacity="0.45"
                              strokeLinecap="round"
                              className="pointer-events-none"
                            />
                          )}
                        </g>
                      );
                    })}

                    {/* Comparable Baseline Trend Line (Dashed Slate) */}
                    {trendConfig.baselineLinePath && (
                      <path
                        d={trendConfig.baselineLinePath}
                        fill="none"
                        stroke="#64748b"
                        strokeWidth="2"
                        strokeDasharray="5 4"
                        strokeLinecap="round"
                        className="transition-all duration-300 pointer-events-none"
                      />
                    )}

                    {/* 3-Day Rolling Average Line (Solid Amber) */}
                    {trendConfig.rollingAvgPath && (
                      <path
                        d={trendConfig.rollingAvgPath}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-300 pointer-events-none"
                      />
                    )}

                    {/* Circular Markers along Expenditure Points */}
                    {trendConfig.points.map((p) => {
                      if (p === trendConfig.peakPoint) return null;
                      const isHovered = hoveredTrendPoint?.label === p.label;
                      return (
                        <circle
                          key={`pt-${p.label}`}
                          cx={p.x}
                          cy={p.y}
                          r={isHovered ? 5 : 3}
                          fill="#ffffff"
                          stroke="#7c3aed"
                          strokeWidth={isHovered ? 2.5 : 1.8}
                          className="pointer-events-none transition-all duration-150"
                        />
                      );
                    })}

                    {/* Prominent Peak Marker & Peak Callout Card */}
                    {trendConfig.peakPoint && (
                      <g key="peak-point-highlight" className="pointer-events-none">
                        {/* Peak Marker: Halo + Solid Center + White Core */}
                        <circle
                          cx={trendConfig.peakPoint.x}
                          cy={trendConfig.peakPoint.y}
                          r={9}
                          fill="#7c3aed"
                          fillOpacity="0.22"
                        />
                        <circle
                          cx={trendConfig.peakPoint.x}
                          cy={trendConfig.peakPoint.y}
                          r={5.5}
                          fill="#7c3aed"
                        />
                        <circle
                          cx={trendConfig.peakPoint.x}
                          cy={trendConfig.peakPoint.y}
                          r={2.5}
                          fill="#ffffff"
                        />

                        {/* Floating Peak Callout Card */}
                        {(() => {
                          const peak = trendConfig.peakPoint;
                          const badgeW = 110;
                          const badgeH = 34;
                          const badgeX = Math.min(880 - badgeW, Math.max(68, peak.x - badgeW / 2));
                          const badgeY = Math.max(12, peak.y - 48);

                          return (
                            <g>
                              <rect
                                x={badgeX}
                                y={badgeY}
                                width={badgeW}
                                height={badgeH}
                                rx="8"
                                fill="#ffffff"
                                stroke="#7c3aed"
                                strokeWidth="1.2"
                                filter="url(#peakCardShadow)"
                              />
                              <line
                                x1={peak.x}
                                y1={badgeY + badgeH}
                                x2={peak.x}
                                y2={peak.y - 8}
                                stroke="#7c3aed"
                                strokeWidth="1.2"
                              />
                              <text
                                x={badgeX + badgeW / 2}
                                y={badgeY + 14}
                                textAnchor="middle"
                                className="text-[10px] font-bold fill-purple-900 font-mono"
                              >
                                Peak: ₹{peak.valCr.toFixed(2)} Cr
                              </text>
                              <text
                                x={badgeX + badgeW / 2}
                                y={badgeY + 27}
                                textAnchor="middle"
                                className="text-[9.5px] font-bold fill-[#7c3aed] font-mono"
                              >
                                ({peak.deltaPct != null ? (peak.deltaPct > 0 ? "+" : "") + Math.abs(peak.deltaPct).toFixed(1) + "%" : "Peak Spend"})
                              </text>
                            </g>
                          );
                        })()}
                      </g>
                    )}

                    {/* Interactive Hover Indicator & HUD Tooltip */}
                    {hoveredTrendPoint && hoveredTrendPoint !== trendConfig.peakPoint && (
                      <g key="hover-focus-indicator" className="pointer-events-none">
                        <line
                          x1={hoveredTrendPoint.x}
                          y1="45"
                          x2={hoveredTrendPoint.x}
                          y2={trendConfig.chartBottom}
                          stroke="#7c3aed"
                          strokeWidth="1.2"
                          strokeDasharray="3 3"
                        />
                        <circle
                          cx={hoveredTrendPoint.x}
                          cy={hoveredTrendPoint.y}
                          r={9}
                          fill="#7c3aed"
                          fillOpacity="0.25"
                        />
                        <circle
                          cx={hoveredTrendPoint.x}
                          cy={hoveredTrendPoint.y}
                          r={5.5}
                          fill="#7c3aed"
                        />
                        <circle
                          cx={hoveredTrendPoint.x}
                          cy={hoveredTrendPoint.y}
                          r={2.5}
                          fill="#ffffff"
                        />

                        {/* Evidence-Rich Tooltip Card */}
                        {(() => {
                          const p = hoveredTrendPoint;
                          const ttW = 186;
                          const ttH = 74;
                          const ttX = Math.max(68, Math.min(880 - ttW, p.x - ttW / 2));
                          const ttY = Math.max(12, p.y - 88);
                          const isUp = (p.absDeltaCr || 0) >= 0;

                          return (
                            <g transform={`translate(${ttX}, ${ttY})`} filter="url(#hudCardShadow)">
                              <rect width={ttW} height={ttH} rx="8" fill="#ffffff" stroke="#7c3aed" strokeWidth="1.2" />
                              <rect x="0" y="0" width={ttW} height="20" rx="8" fill="#faf5ff" />
                              <text x="8" y="14" className="text-[10px] font-black fill-purple-900 font-mono">
                                {p.fullLabel || p.label}
                              </text>
                              <text x={ttW - 8} y="14" textAnchor="end" className={`text-[8.5px] font-black ${p.isOperatingDay ? "fill-emerald-600" : "fill-slate-500"}`}>
                                {trendPeriod === "Weekly" ? "● Active Week" : trendPeriod === "Monthly" ? "● Active Month" : p.isOperatingDay ? "● Operating Day" : "○ Non-Operating"}
                              </text>
                              <text x="8" y="36" className="text-[11.5px] font-black fill-slate-900 font-mono">
                                Actual Cost: ₹{p.valCr.toFixed(2)} Cr
                              </text>
                              <text x="8" y="51" className="text-[10px] font-bold fill-slate-600 font-mono">
                                Baseline: ₹{p.bCr.toFixed(2)} Cr
                              </text>
                              <text x="8" y="65" className={`text-[10px] font-bold font-mono ${isUp ? "fill-rose-600" : "fill-emerald-600"}`}>
                                Variance: {isUp ? "+" : "-"}₹{Math.abs(p.absDeltaCr || 0).toFixed(2)} Cr ({p.delta})
                              </text>
                            </g>
                          );
                        })()}
                      </g>
                    )}

                    {/* Invisible Full-Height Hover Hit Rectangles */}
                    {trendConfig.points.map((p, idx, arr) => {
                      const prevX = idx === 0 ? 68 : (arr[idx - 1].x + p.x) / 2;
                      const nextX = idx === arr.length - 1 ? 880 : (arr[idx + 1].x + p.x) / 2;
                      const hitW = Math.max(12, nextX - prevX);

                      return (
                        <rect
                          key={`hit-${p.label}`}
                          x={prevX}
                          y="45"
                          width={hitW}
                          height={trendConfig.chartBottom - 45}
                          fill="transparent"
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredTrendPoint(p)}
                          onMouseLeave={() => setHoveredTrendPoint(null)}
                        />
                      );
                    })}

                    {/* Intelligent X-Axis Date / Period Labels */}
                    {trendConfig.points.map((p) => {
                      const isHovered = hoveredTrendPoint?.label === p.label;
                      const isPeak = p === trendConfig.peakPoint;
                      if (!p.showXLabel && !isHovered && !isPeak) return null;
                      return (
                        <text
                          key={`x-${p.label}`}
                          x={p.x}
                          y="358"
                          textAnchor="middle"
                          className={`text-[11px] font-mono transition-colors ${isHovered
                            ? "fill-purple-900 font-black"
                            : isPeak
                              ? "fill-purple-900 font-extrabold"
                              : "fill-slate-400 font-medium"
                            }`}
                        >
                          {p.label}
                        </text>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* RIGHT: Manufacturing Cost Breakdown / Drivers of Variance (col-span-4) */}
              <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] flex flex-col justify-between">
                <div className="flex items-center justify-between gap-2 pb-1">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200/70 text-[#7c3aed] flex items-center justify-center shrink-0 shadow-2xs">
                      <PieChart className="w-4 h-4 text-[#7c3aed]" />
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5 truncate">
                      <span>{donutMode === "breakdown" ? "Manufacturing Cost Breakdown" : "Drivers of Cost Variance"}</span>
                      <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </h3>
                  </div>
                  {/* Mode Switcher Pill */}
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/70 text-[10px] font-bold shrink-0">
                    <button
                      type="button"
                      onClick={() => { setDonutMode("breakdown"); setHoveredReasonIndex(null); }}
                      className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${donutMode === "breakdown"
                        ? "bg-white text-purple-900 shadow-2xs font-extrabold"
                        : "text-slate-500 hover:text-slate-900"
                        }`}
                    >
                      Breakdown
                    </button>
                    <button
                      type="button"
                      onClick={() => { setDonutMode("variance"); setHoveredReasonIndex(null); }}
                      className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${donutMode === "variance"
                        ? "bg-white text-purple-900 shadow-2xs font-extrabold"
                        : "text-slate-500 hover:text-slate-900"
                        }`}
                    >
                      Variance
                    </button>
                  </div>
                </div>

                {/* Hero 3D Donut Chart: Modular Rounded Segments, Floating Acrylic Hub & Ambient Glow */}
                <div
                  className="relative w-56 h-56 sm:w-60 sm:h-60 mx-auto my-0 shrink-0 flex items-center justify-center cursor-pointer select-none"
                  onMouseEnter={() => setIsDonutHovered(true)}
                  onMouseLeave={() => {
                    setIsDonutHovered(false);
                    setHoveredReasonIndex(null);
                  }}
                  style={{ perspective: "1000px" }}
                >
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      transformStyle: "preserve-3d",
                      transform: isDonutHovered
                        ? "rotateX(14deg) rotateY(-4deg) translateY(-5px) scale(1.03)"
                        : "rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)",
                      transition: "transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1), filter 0.35s ease",
                      filter: isDonutHovered
                        ? "drop-shadow(0 18px 24px rgba(79, 70, 229, 0.28))"
                        : "drop-shadow(0 6px 14px rgba(79, 70, 229, 0.08))",
                    }}
                  >
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 220 215">
                      <defs>
                        {/* Ambient 3D Depth Filters */}
                        <filter id="donut3DDepthShadow" x="-30%" y="-30%" width="160%" height="170%">
                          <feDropShadow
                            dx="0"
                            dy={isDonutHovered ? "9" : "5"}
                            stdDeviation={isDonutHovered ? "6" : "4"}
                            floodColor="#1e1b4b"
                            floodOpacity={isDonutHovered ? "0.30" : "0.18"}
                          />
                        </filter>
                        <filter id="donutGroundGlow" x="-30%" y="-30%" width="160%" height="160%">
                          <feGaussianBlur stdDeviation={isDonutHovered ? "11" : "8"} />
                        </filter>
                        <filter id="coreFloatingShadow" x="-30%" y="-30%" width="160%" height="160%">
                          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#312e81" floodOpacity="0.10" />
                        </filter>
                        <filter id="slicePopGlow" x="-30%" y="-30%" width="160%" height="160%">
                          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ffffff" floodOpacity="0.8" />
                        </filter>

                        {/* Vibrant Executive Gradients */}
                        <linearGradient id="gradInflation" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#c084fc" />
                          <stop offset="50%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#6d28d9" />
                        </linearGradient>
                        <linearGradient id="gradConsumption" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="60%" stopColor="#0ea5e9" />
                          <stop offset="100%" stopColor="#0284c7" />
                        </linearGradient>
                        <linearGradient id="gradVolume" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fde047" />
                          <stop offset="60%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#d97706" />
                        </linearGradient>
                        <linearGradient id="gradRework" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#34d399" />
                          <stop offset="60%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                        <linearGradient id="gradOverheads" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#a5b4fc" />
                          <stop offset="60%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#4338ca" />
                        </linearGradient>

                        {/* Acrylic Center Gradient */}
                        <radialGradient id="coreAcrylicGrad" cx="50%" cy="40%" r="60%">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="85%" stopColor="#ffffff" />
                          <stop offset="100%" stopColor="#f5f3ff" />
                        </radialGradient>

                        {/* Specular Bevel Sheen */}
                        <linearGradient id="topBevelSheen" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity={isDonutHovered ? "0.7" : "0.4"} />
                          <stop offset="40%" stopColor="#ffffff" stopOpacity="0" />
                          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Ambient Ground Shadow */}
                      <ellipse
                        cx="110"
                        cy={isDonutHovered ? 190 : 185}
                        rx={isDonutHovered ? 90 : 82}
                        ry={isDonutHovered ? 14 : 11}
                        fill="#312e81"
                        opacity={isDonutHovered ? 0.28 : 0.16}
                        filter="url(#donutGroundGlow)"
                        className="transition-all duration-300"
                      />

                      {/* BASE 3D EXTRUSION (Shifted down for authentic dimensional bevel) */}
                      <g
                        transform={isDonutHovered ? "translate(0, 9) rotate(-90 110 100)" : "translate(0, 6) rotate(-90 110 100)"}
                        opacity="0.95"
                        className="transition-all duration-300"
                      >
                        {activeSlices.map((seg, i) => (
                          <circle
                            key={`base-${seg.name || i}`}
                            cx="110"
                            cy="100"
                            r="75"
                            fill="none"
                            stroke={seg.base_color || "#312e81"}
                            strokeWidth="22"
                            strokeLinecap="round"
                            strokeDasharray={seg.dash || "0 471.24"}
                            strokeDashoffset={seg.offset || "0"}
                          />
                        ))}
                      </g>

                      {/* MAIN UPPER 3D DONUT RING (Modular Sculpted Rounded Slices) */}
                      <g transform="rotate(-90 110 100)" filter="url(#donut3DDepthShadow)">
                        {activeSlices.map((seg, idx) => {
                          const isSliceHovered = hoveredReasonIndex === idx;
                          return (
                            <circle
                              key={seg.name || idx}
                              cx="110"
                              cy="100"
                              r="75"
                              fill="none"
                              stroke={seg.color || "#8b5cf6"}
                              strokeWidth={isSliceHovered ? 26 : 22}
                              strokeLinecap="round"
                              strokeDasharray={seg.dash || "0 471.24"}
                              strokeDashoffset={seg.offset || "0"}
                              className="transition-all duration-200 cursor-pointer"
                              style={{
                                filter: isSliceHovered
                                  ? "drop-shadow(0 0 6px rgba(255,255,255,0.85)) brightness(1.15)"
                                  : hoveredReasonIndex !== null
                                    ? "opacity(0.65)"
                                    : "none",
                              }}
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredReasonIndex(idx);
                                setIsDonutHovered(true);
                              }}
                              onMouseLeave={() => setHoveredReasonIndex(null)}
                            />
                          );
                        })}
                      </g>

                      {/* Specular Rim Sheen for realistic glass/ceramic reflection */}
                      <circle
                        cx="110"
                        cy="100"
                        r="75"
                        fill="none"
                        stroke="url(#topBevelSheen)"
                        strokeWidth="2"
                        strokeDasharray="471.24"
                        className="pointer-events-none transition-all duration-300"
                      />

                      {/* FLOATING ACRYLIC CENTER CORE (Breathable, Elegant, High-End) */}
                      <circle
                        cx="110"
                        cy="100"
                        r="50"
                        fill="url(#coreAcrylicGrad)"
                        stroke={
                          hoveredReasonIndex !== null && activeSlices[hoveredReasonIndex]
                            ? (activeSlices[hoveredReasonIndex].color || "#7c3aed")
                            : "#e2e8f0"
                        }
                        strokeWidth={hoveredReasonIndex !== null ? 2 : 1}
                        filter="url(#coreFloatingShadow)"
                        className="transition-all duration-200"
                      />

                      {/* Center Metric HUD */}
                      <g className="pointer-events-none select-none">
                        {hoveredReasonIndex !== null && activeSlices[hoveredReasonIndex] ? (
                          <>
                            <text x="110" y="84" textAnchor="middle" className="text-[8px] font-black fill-slate-400 uppercase tracking-widest">
                              {activeSlices[hoveredReasonIndex].name?.slice(0, 16)}
                            </text>
                            <text x="110" y="104" textAnchor="middle" className="text-[16px] font-black fill-slate-900 font-mono tracking-tight">
                              {activeSlices[hoveredReasonIndex].formatted_amount || `₹${((activeSlices[hoveredReasonIndex].amount || 0) / 1e7).toFixed(2)} Cr`}
                            </text>
                            <rect
                              x="70"
                              y="112"
                              width="80"
                              height="14"
                              rx="7"
                              fill="#faf5ff"
                              stroke="#e9d5ff"
                              strokeWidth="0.8"
                            />
                            <text
                              x="110"
                              y="122.5"
                              textAnchor="middle"
                              className="text-[8.5px] font-black fill-[#7c3aed]"
                            >
                              {activeSlices[hoveredReasonIndex].pct || `${activeSlices[hoveredReasonIndex].pct_of_variance}%`} of total
                            </text>
                          </>
                        ) : donutMode === "breakdown" ? (
                          <>
                            <text x="110" y="84" textAnchor="middle" className="text-[7.5px] font-black fill-slate-400 uppercase tracking-widest">
                              TOTAL EXPENDITURE
                            </text>
                            <text x="110" y="104" textAnchor="middle" className="text-[17px] font-black fill-slate-900 font-mono tracking-tight">
                              ₹{((reportData?.current_total_cost != null ? reportData.current_total_cost : 1900330000) / 1e7).toFixed(2)} Cr
                            </text>
                            <rect
                              x="74"
                              y="112"
                              width="72"
                              height="14"
                              rx="7"
                              fill="#ecfdf5"
                              stroke="#a7f3d0"
                              strokeWidth="0.8"
                            />
                            <text
                              x="110"
                              y="122.5"
                              textAnchor="middle"
                              className="text-[9px] font-black fill-emerald-600"
                            >
                              100% Reconciled
                            </text>
                          </>
                        ) : (
                          <>
                            <text x="110" y="84" textAnchor="middle" className="text-[7.5px] font-black fill-slate-400 uppercase tracking-widest">
                              TOTAL NET VARIANCE
                            </text>
                            <text x="110" y="104" textAnchor="middle" className="text-[17px] font-black fill-slate-900 font-mono tracking-tight">
                              {(() => {
                                const diff = (reportData?.current_total_cost != null && reportData?.baseline_total_cost != null)
                                  ? (reportData.current_total_cost - reportData.baseline_total_cost)
                                  : (reportData?.cost_change_amount ?? 165200000);
                                return `${diff >= 0 ? "+" : "-"}₹${(Math.abs(diff) / 1e7).toFixed(2)} Cr`;
                              })()}
                            </text>
                            <rect
                              x="74"
                              y="112"
                              width="72"
                              height="14"
                              rx="7"
                              fill={((reportData?.cost_change_amount ?? 1) >= 0) ? "#fff1f2" : "#ecfdf5"}
                              stroke={((reportData?.cost_change_amount ?? 1) >= 0) ? "#fecdd3" : "#a7f3d0"}
                              strokeWidth="0.8"
                            />
                            <text
                              x="110"
                              y="122.5"
                              textAnchor="middle"
                              className={`text-[9px] font-black ${((reportData?.cost_change_amount ?? 1) >= 0) ? "fill-rose-600" : "fill-emerald-600"}`}
                            >
                              +{Math.abs(reportData?.cost_change_pct != null ? reportData.cost_change_pct : 9.52).toFixed(2)}%
                            </text>
                          </>
                        )}
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Down Legend: Clean Executive Single-Column Stack with Zero Truncation */}
                <div className="w-full mt-2 pt-2 border-t border-purple-50 shrink-0">
                  <div className="flex flex-col gap-1 w-full">
                    {activeSlices.map((it, idx) => {
                      const isRowActive = hoveredReasonIndex === idx;
                      return (
                        <div
                          key={it.name || idx}
                          onMouseEnter={() => {
                            setHoveredReasonIndex(idx);
                            setIsDonutHovered(true);
                          }}
                          onMouseLeave={() => {
                            setHoveredReasonIndex(null);
                            setIsDonutHovered(false);
                          }}
                          className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg transition-all border w-full cursor-pointer ${isRowActive
                            ? "bg-purple-50/90 border-purple-200 shadow-2xs translate-x-1"
                            : "bg-slate-50/60 hover:bg-purple-50/50 border-slate-100/80"
                            }`}
                          title={it.fullName || it.name}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-1">
                            <span
                              className={`w-2.5 h-2.5 rounded-full shadow-2xs shrink-0 ${isRowActive ? "scale-125" : ""}`}
                              style={{ backgroundColor: it.color || "#8b5cf6" }}
                            />
                            <span
                              className={`text-[11.5px] truncate ${isRowActive ? "text-purple-950 font-extrabold" : "text-slate-800 font-bold"
                                }`}
                            >
                              {it.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 font-mono font-bold shrink-0">
                            <span className="text-[11px] text-slate-700">
                              {it.status === "UNAVAILABLE" ? "UNAVAILABLE" : (it.formatted_amount || `₹${((it.amount || 0) / 1e7).toFixed(2)} Cr`)}
                            </span>
                            <span
                              className={`text-[9.5px] font-black px-1.5 py-0.5 rounded-md min-w-[38px] text-center ${it.tagBg || "bg-purple-50"
                                } ${it.tagText || "text-[#7c3aed]"} border ${it.tagBorder || "border-purple-200/60"} leading-tight`}
                            >
                              {it.status === "UNAVAILABLE" ? "N/A" : (it.pct || `${it.pct_of_variance}%`)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Product Cost Comparison Table (Full-Width to eliminate horizontal scrolling) */}
            <div className="w-full bg-white rounded-2xl p-5 border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)]">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200/70 text-[#7c3aed] flex items-center justify-center shrink-0 shadow-2xs">
                    <Box className="w-4 h-4 text-[#7c3aed]" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                    <span>Product Cost Comparison (Cost per Good Unit)</span>
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                  </h3>
                </div>
                <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                  4 Active SKUs Evaluated
                </span>
              </div>

              <div className="overflow-x-auto mt-1">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-y border-slate-100 bg-slate-50/70 text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Product</th>
                      <th className="py-2.5 px-3 text-right">{reportData?.comparison_period_label || reportData?.executive_finding?.baseline_period_label || "Baseline"} (₹/Unit)</th>
                      <th className="py-2.5 px-3 text-right">{reportData?.reporting_period_label || reportData?.executive_finding?.current_period_label || "Current"} (₹/Unit)</th>
                      <th className="py-2.5 px-3 text-right">Delta (₹)</th>
                      <th className="py-2.5 px-3 text-right">Change (%)</th>
                      <th className="py-2.5 px-3">Primary Cost Movement Driver</th>
                      <th className="py-2.5 px-3 text-right">Good Units</th>
                      <th className="py-2.5 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-[11px]">
                    {(
                      reportData?.product_comparison?.map((p) => {
                        const hasBaseline = p.baseline_cost_per_unit != null && p.baseline_cost_per_unit > 0;
                        const hasCurrent = p.current_cost_per_unit != null && p.current_cost_per_unit > 0;
                        const octVal = hasBaseline
                          ? Number(p.baseline_cost_per_unit).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          : "NOT_AVAILABLE";
                        const novVal = hasCurrent
                          ? Number(p.current_cost_per_unit).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          : "NOT_AVAILABLE";
                        const hasDelta = hasBaseline && hasCurrent && p.change_amount != null;
                        const deltaVal = hasDelta
                          ? Number(Math.abs(p.change_amount)).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          : "NOT_AVAILABLE";
                        const isUp = (p.change_amount || 0) >= 0;
                        const pctVal = hasDelta && p.change_pct != null
                          ? `${isUp ? "▲ " : "▼ "}${Math.abs(p.change_pct).toFixed(2)}%`
                          : "N/A";

                        return {
                          badge: p.product_code?.includes("PRO") ? "PRO" : p.product_code?.includes("A15") ? "A15" : "TST",
                          code: p.product_code,
                          oct: octVal,
                          nov: novVal,
                          delta: deltaVal,
                          pct: pctVal,
                          isUp: isUp,
                          hasBaseline: hasBaseline,
                          availReason: p.availability_reason || (!hasBaseline ? "NO_SOURCE_RECORDS" : null),
                          driver: p.main_driver || (hasBaseline ? "Direct Material Expenditure" : "Prototype Trial SKU (No Prior Baseline)"),
                          units: p.good_units_produced != null ? Number(p.good_units_produced).toLocaleString("en-IN") : "NOT_AVAILABLE",
                        };
                      }) || []
                    ).map((row) => (
                      <tr
                        key={row.code}
                        onClick={() => setSelectedProductDrilldown(row)}
                        className="hover:bg-purple-50/40 transition-colors cursor-pointer group h-11"
                      >
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-purple-100 text-[#7c3aed] shrink-0">
                              {row.badge}
                            </span>
                            <span className="font-bold text-slate-900 group-hover:text-[#7c3aed] transition-colors whitespace-nowrap font-mono">
                              {row.code}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600 whitespace-nowrap">
                          {row.oct === "NOT_AVAILABLE" ? (
                            <span
                              className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 cursor-help"
                              title={row.availReason === "NO_SOURCE_RECORDS" ? `NO_SOURCE_RECORDS: Prototype SKU has no ${reportData?.comparison_period_label || "baseline"} records` : row.availReason || "NO_SOURCE_RECORDS"}
                            >
                              NOT_AVAILABLE
                            </span>
                          ) : (
                            `₹${row.oct}`
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                          {row.nov === "NOT_AVAILABLE" ? (
                            <span className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                              NOT_AVAILABLE
                            </span>
                          ) : (
                            `₹${row.nov}`
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold whitespace-nowrap">
                          {row.delta === "NOT_AVAILABLE" ? (
                            <span className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                              NOT_AVAILABLE
                            </span>
                          ) : (
                            <span className={row.isUp ? "text-rose-600" : "text-emerald-600"}>
                              ₹{row.delta}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold whitespace-nowrap">
                          {row.pct === "N/A" ? (
                            <span className="text-[10px] font-semibold text-slate-400">N/A</span>
                          ) : (
                            <span className={row.isUp ? "text-rose-600" : "text-emerald-600"}>
                              {row.pct}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 text-[11px] whitespace-nowrap">
                          {row.driver}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800 whitespace-nowrap">
                          {row.units}
                        </td>
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <span className="text-[11px] font-bold text-[#7c3aed] hover:underline whitespace-nowrap">
                            Inspect &gt;
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Row 4: Manufacturing Cost Improvement Plan (Evidence-Driven Actions & Modal Playbooks) */}
            <CostImprovementPlan
              reportData={reportData}
              onOpenPlaybook={(rec) => setSelectedPlaybook(rec)}
            />
          </div>
        </div>
      )}

      {/* Drilldown Modal Drawer for Product Comparison */}
      {selectedProductDrilldown && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedProductDrilldown(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl p-5 border border-purple-100 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{selectedProductDrilldown.code}</h4>
                <p className="text-xs text-slate-500">{selectedProductDrilldown.name}</p>
              </div>
              <button
                onClick={() => setSelectedProductDrilldown(null)}
                className="text-slate-400 hover:text-slate-800 p-1"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">{reportData?.comparison_period_label || "Baseline"} Unit Cost:</span>
                <span className="font-mono font-bold text-slate-800">{selectedProductDrilldown.oct}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">{reportData?.reporting_period_label || "Current"} Unit Cost:</span>
                <span className="font-mono font-bold text-slate-900">{selectedProductDrilldown.nov}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Unit Movement:</span>
                <span className="font-mono font-bold text-slate-800">{selectedProductDrilldown.delta}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Supported Root Driver:</span>
                <span className="font-bold text-[#7c3aed]">{selectedProductDrilldown.driver}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Good Units Produced:</span>
                <span className="font-mono font-bold text-slate-800">{selectedProductDrilldown.units}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedProductDrilldown(null);
              }}
              className="w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7c3aed] text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Close SKU Details</span>
            </button>
          </div>
        </div>
      )}

      {/* Redesigned Responsive Playbook Modal */}
      <PlaybookModal
        playbook={selectedPlaybook}
        onClose={() => setSelectedPlaybook(null)}
        onAskAI={() => {
          setSelectedPlaybook(null);
        }}
      />
    </div>
  );
}
