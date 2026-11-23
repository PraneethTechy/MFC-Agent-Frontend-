import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  ShieldCheck,
  Download,
  Upload,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
  CheckCircle2,
  HelpCircle,
  Layers,
  Box,
  Factory,
  Cpu,
  Database,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Activity,
  Calendar,
  Calculator,
  Clock,
} from "lucide-react";
import VarianceWaterfall from "./VarianceWaterfall";
import FindingDetailDrawer from "./FindingDetailDrawer";
import { API_BASE_URL } from "../config/api";

export default function InvestigationReport({
  apiBaseUrl = API_BASE_URL,
  onNavigate,
  onOpenAIChat,
  reportId: propReportId,
  inspectionId: propInspectionId,
}) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [calculationDetailsOpen, setCalculationDetailsOpen] = useState(false);

  // Selected finding for side drawer
  const [selectedFinding, setSelectedFinding] = useState(null);

  // Controls for period selection
  const [baselinePeriod, setBaselinePeriod] = useState("2026-09");
  const [currentPeriod, setCurrentPeriod] = useState("2026-10");

  const getHashParam = (key) => {
    if (typeof window === "undefined") return null;
    const searchPart = window.location.search.replace(/^\?/, "");
    const hashPart = window.location.hash.split("?")[1] || "";
    const params = new URLSearchParams(searchPart || hashPart);
    return params.get(key);
  };

  const activeReportId = propReportId || getHashParam("report_id");
  const activeInspectionId = propInspectionId || getHashParam("inspection_id");

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsNotFound(false);

      let url;
      if (activeReportId) {
        // Direct fetch by exact durable report ID
        url = `${apiBaseUrl}/investigation/report/${encodeURIComponent(activeReportId)}`;
      } else if (activeInspectionId) {
        url = `${apiBaseUrl}/investigation/report?inspection_id=${encodeURIComponent(activeInspectionId)}`;
      } else {
        const queryParams = new URLSearchParams();
        queryParams.append("baseline_period", baselinePeriod);
        queryParams.append("current_period", currentPeriod);
        url = `${apiBaseUrl}/investigation/report?${queryParams.toString()}`;
      }

      const res = await fetch(url);
      if (res.status === 404) {
        setIsNotFound(true);
        throw new Error(
          activeReportId
            ? `Investigation report '${activeReportId}' was not found in permanent store.`
            : "Investigation report not found."
        );
      }
      if (!res.ok) {
        throw new Error(`Failed to load investigation report: HTTP ${res.status}`);
      }
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error("Investigation report fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [activeReportId, activeInspectionId, baselinePeriod, currentPeriod]);

  const formatAmount = (val) => {
    const num = Math.abs(val || 0);
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e7) return `${(num / 1e7).toFixed(2)}Cr`;
    if (num >= 1e5) return `${(num / 1e5).toFixed(1)}L`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const getBadgeStyle = (classification) => {
    switch (classification) {
      case "PROVEN":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "OBSERVED":
      case "OBSERVED_CORRELATION":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "HYPOTHESIS":
        return "bg-sky-100 text-sky-800 border-sky-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  if (loading && !report) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500 space-y-3">
        <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold">Running root-cause variance investigation...</p>
        <p className="text-xs text-slate-400">Comparing {baselinePeriod} vs {currentPeriod} across Neon ledger facts</p>
      </div>
    );
  }

  if (isNotFound && !report) {
    return (
      <div className="p-8 text-center space-y-4 max-w-lg mx-auto bg-white rounded-3xl border border-purple-100 shadow-sm my-12 animate-in fade-in">
        <FileText className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-base font-bold text-slate-900">Investigation Report Not Found</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          The requested investigation report <code className="bg-slate-100 px-1.5 py-0.5 rounded text-purple-800 font-mono">{activeReportId}</code> was not found in permanent store. It may have been cleared or not yet generated.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate && onNavigate("investigations")}
            className="px-4 py-2 bg-purple-50 text-[#6f3dba] rounded-xl text-xs font-bold hover:bg-purple-100 cursor-pointer transition-colors"
          >
            &larr; Back to AI Investigations
          </button>
          <button
            onClick={() => onNavigate && onNavigate("investigations")}
            className="px-4 py-2 bg-[#6f3dba] text-white rounded-xl text-xs font-bold hover:bg-purple-700 cursor-pointer transition-colors shadow-xs"
          >
            Load Current Period Actuals
          </button>
        </div>
      </div>
    );
  }

  if (error && !report) {
    return (
      <div className="p-8 text-center space-y-4 max-w-md mx-auto">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-900">Failed to Load Investigation</h3>
        <p className="text-xs text-slate-500">{error}</p>
        <button
          onClick={fetchReport}
          className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold hover:bg-purple-700 cursor-pointer"
        >
          Retry Investigation
        </button>
      </div>
    );
  }

  const ef = report.executive_finding;
  const scope = report.scope;

  // Donut SVG circumference calculation
  const donutRadius = 38;
  const donutCircumference = 2 * Math.PI * donutRadius;
  let accumulatedOffset = 0;

  // Trend line points
  const hasUnitTrend = report.monthly_trend?.some((m) => m.cost_per_good_unit != null);
  const trendValues = hasUnitTrend
    ? (report.monthly_trend || []).map((m) => m.cost_per_good_unit ?? 0)
    : (report.monthly_trend || []).map((m) => m.total_cost ?? 0);

  const trendMax = Math.max(...trendValues, 1);
  const trendMin = Math.min(...trendValues, 0);
  const trendRange = trendMax - trendMin || 1;

  const trendPoints = trendValues
    .map((val, idx) => {
      const x = 30 + idx * 95;
      const y = 80 - ((val - trendMin) / trendRange) * 50;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="flex-1 space-y-4 pb-12 animate-in fade-in duration-200 max-w-[1600px] mx-auto w-full">
      {/* 1. Page Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <span
              onClick={() => onNavigate && onNavigate("import")}
              className="hover:text-purple-600 cursor-pointer transition-colors"
            >
              Data Upload
            </span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-purple-700 font-semibold">Investigation Report</span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 mt-0.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Manufacturing Cost Investigation
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wide">
              {report.status || "COMPLETED"}
            </span>
            {report.data_origin && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                  report.data_origin === "REAL"
                    ? "bg-purple-100 text-purple-800 border-purple-200"
                    : "bg-amber-100 text-amber-800 border-amber-200"
                }`}
              >
                {report.data_origin}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
            <span>AI-powered root-cause analysis of your manufacturing datasets</span>
            {report.created_at && (
              <>
                <span>&bull;</span>
                <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Generated {new Date(report.created_at).toLocaleString()}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Action Buttons matching Reference Image */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenAIChat && onOpenAIChat("Explain the Oct 2026 manufacturing cost variance")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 text-purple-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Ask AI About This
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 text-purple-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export Report
          </button>
          <button
            onClick={() => onNavigate && onNavigate("import")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            Import Validated Data
          </button>
        </div>
      </div>

      {/* 2. Key Answer Hero (Purple Gradient Banner matching Reference Image) */}
      <div className="rounded-2xl bg-gradient-to-r from-[#201140] via-[#3b1d60] to-[#201140] text-white p-5 sm:p-6 shadow-md relative overflow-hidden">
        {/* Decorative factory silhouette */}
        <div className="absolute right-6 bottom-0 opacity-15 pointer-events-none hidden md:block">
          <Factory className="w-48 h-48 -mb-8 -mr-8 text-white" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/40 text-purple-200 text-[10px] font-bold tracking-wider uppercase border border-purple-400/30">
                KEY ANSWER
              </span>
              {report.report_id && (
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-purple-200 text-[10px] font-mono border border-white/10">
                  {report.report_id}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-2 text-white tracking-tight">
              {ef.headline}
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/90 mt-1.5 leading-relaxed">
              {ef.sub_headline}
            </p>
          </div>

          {/* Right side summary cards */}
          <div className="flex items-center gap-6 sm:gap-8 pt-3 lg:pt-0 border-t lg:border-t-0 border-purple-500/20">
            <div>
              <span className="text-[11px] text-purple-300 font-medium block">
                Total Cost ({ef.baseline_period_label})
              </span>
              <span className="text-lg sm:text-xl font-black text-white mt-0.5 block">
                ₹{formatAmount(report.baseline_total_cost)}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-purple-300 font-medium block">
                Total Cost ({ef.current_period_label})
              </span>
              <span className="text-lg sm:text-xl font-black text-white mt-0.5 block">
                ₹{formatAmount(report.current_total_cost)}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-white/10">
              <span className="text-[10px] text-purple-300 uppercase tracking-wider block font-semibold">
                Change
              </span>
              <span
                className={`text-sm sm:text-base font-black flex items-center gap-1 mt-0.5 ${
                  ef.is_increase ? "text-rose-300" : "text-emerald-300"
                }`}
              >
                {ef.is_increase ? "▲" : "▼"} {Math.abs(ef.change_pct)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Core Investigation Grid (Scope | Waterfall | Root-Cause Findings) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Analysis Scope */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-purple-100 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-purple-50">
              <Layers className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Analysis Scope
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" /> Uploaded Files
                </span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  {scope.uploaded_files_count || (scope.uploaded_files ? Array.from(new Set(scope.uploaded_files)).length : 1)}{" "}
                  {(scope.uploaded_files_count || (scope.uploaded_files ? Array.from(new Set(scope.uploaded_files)).length : 1)) === 1 ? "file" : "files"}
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" /> Dataset Types
                </span>
                <span className="font-semibold text-slate-800">
                  {scope.dataset_types_count || (scope.dataset_types ? scope.dataset_types.length : 1)}{" "}
                  {(scope.dataset_types_count || (scope.dataset_types ? scope.dataset_types.length : 1)) === 1 ? "family" : "families"}
                </span>
              </div>

              {scope.duplicate_files_detected && scope.duplicate_files_detected.length > 0 && (
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[10px] text-amber-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Duplicate skipped: {scope.duplicate_files_detected.join(", ")}</span>
                </div>
              )}

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Period
                </span>
                <span className="font-semibold text-slate-800">{scope.period_range}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5 text-slate-400" /> Products
                </span>
                <span className="font-semibold text-slate-800">{scope.products_count}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Factory className="w-3.5 h-3.5 text-slate-400" /> Plants
                </span>
                <span className="font-semibold text-slate-800">{scope.plants_count}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-slate-400" /> Production Lines
                </span>
                <span className="font-semibold text-slate-800">{scope.lines_count}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-slate-400" /> Cost Records
                </span>
                <span className="font-semibold text-slate-800">
                  {scope.cost_records_count.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 pt-2 border-t border-purple-50">
                <span className="text-slate-500">Matched Production</span>
                <span
                  className={`font-bold flex items-center gap-1 ${
                    scope.matched_production_label?.toLowerCase().includes("unavailable")
                      ? "text-slate-500 text-[11px] font-normal"
                      : "text-emerald-700"
                  }`}
                >
                  {scope.matched_production_label}
                  {!scope.matched_production_label?.toLowerCase().includes("unavailable") && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </span>
              </div>

              {scope.file_manifest && scope.file_manifest.length > 0 ? (
                <div className="pt-2 mt-2 border-t border-purple-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-purple-700 font-bold uppercase tracking-wider block">
                      Session Files ({scope.file_manifest.length}):
                    </span>
                    <span className="text-[9px] text-slate-500 font-medium">
                      {scope.dataset_types_count || scope.dataset_types?.length} families
                    </span>
                  </div>
                  <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                    {scope.file_manifest.map((mf, idx) => (
                      <div key={idx} className="text-[10px] bg-purple-50/50 rounded p-1.5 border border-purple-100/60 flex items-center justify-between gap-1.5">
                        <div className="truncate mr-1 font-mono text-slate-700 min-w-0" title={mf.filename}>
                          {mf.filename}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="font-mono text-slate-600 font-bold text-[9px]">
                            {mf.total_rows?.toLocaleString()} rows
                          </span>
                          <span className="px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded text-[9px] font-bold uppercase shrink-0">
                            {mf.dataset_type?.replace(/_/g, " ")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-1.5 mt-1 border-t border-purple-100/60 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                    <span>Total Source Records:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {scope.file_manifest.reduce((acc, m) => acc + (m.total_rows || 0), 0).toLocaleString()} rows
                    </span>
                  </div>
                </div>
              ) : (
                scope.uploaded_files && scope.uploaded_files.length > 0 && (
                  <div className="pt-2 mt-2 border-t border-purple-50">
                    <span className="text-[10px] text-purple-700 font-bold uppercase tracking-wider block mb-1">
                      Uploaded Session Files:
                    </span>
                    <div className="space-y-1">
                      {Array.from(new Set(scope.uploaded_files)).map((fn, idx) => (
                        <div key={idx} className="text-[11px] text-slate-600 truncate bg-purple-50/50 rounded px-1.5 py-0.5 font-mono">
                          &bull; {fn}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="mt-4 p-2.5 rounded-xl bg-purple-50/50 border border-purple-100 text-[11px] text-purple-900">
            <span className="font-bold">Session Boundary:</span>{" "}
            {scope.uploaded_files && scope.uploaded_files.length > 0
              ? "Analysis isolated strictly to uploaded session files."
              : "Certified against Neon PostgreSQL ledger."}
          </div>
        </div>

        {/* Center: Cost Increase Breakdown (Variance Waterfall) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-purple-100 p-4 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-purple-50">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Cost Increase Breakdown ({ef.baseline_period_label} → {ef.current_period_label})
              </h3>
            </div>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              +{formatAmount(report.cost_change_amount)} (+{report.cost_change_pct}%)
            </span>
          </div>

          <div className="flex-1 min-h-[260px]">
            <VarianceWaterfall steps={report.bridge.steps} currency="₹" />
          </div>
        </div>

        {/* Right: Root-Cause Findings */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-purple-100 p-4 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-purple-50">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Root-Cause Findings
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {report.findings.length} findings
            </span>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[300px] pr-1">
            {report.findings.map((f) => (
              <div
                key={f.finding_id}
                onClick={() => setSelectedFinding(f)}
                className="p-3 rounded-xl border border-slate-200/80 hover:border-purple-300 hover:bg-purple-50/30 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                        {f.title}
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase border ${getBadgeStyle(
                          f.evidence_classification
                        )}`}
                      >
                        {f.evidence_classification}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {f.short_explanation}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-slate-900 block">
                      {f.financial_impact_amount >= 0 ? "+" : "-"}₹
                      {formatAmount(f.financial_impact_amount)}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        f.financial_impact_amount >= 0
                          ? "text-rose-600"
                          : "text-emerald-600"
                      }`}
                    >
                      ({f.financial_impact_amount >= 0 ? "+" : ""}
                      {f.financial_impact_pct}%)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Supporting Metrics Row (Data Reliability | Key Cost Metrics | Cost Trend | Cost Composition) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Data Reliability */}
        <div className="bg-white rounded-2xl border border-purple-100 p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-purple-50">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Data Reliability
            </h3>
          </div>

          {/* Verification Indicators Strip */}
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            <div className="p-2 rounded-xl bg-purple-50/60 border border-purple-100/80">
              <span className="text-[10px] text-slate-500 font-medium block">Coverage</span>
              <span className="text-xs font-bold text-purple-900 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {report.data_reliability?.matching_coverage_pct ?? 100}% Matched
              </span>
            </div>
            <div className="p-2 rounded-xl bg-purple-50/60 border border-purple-100/80">
              <span className="text-[10px] text-slate-500 font-medium block">Records Evaluated</span>
              <span className="text-xs font-bold text-slate-900 font-mono mt-0.5 block">
                {(report.data_reliability?.total_records_evaluated || report.scope?.cost_records_count || 0).toLocaleString()} rows
              </span>
            </div>
            <div className="p-2 rounded-xl bg-purple-50/60 border border-purple-100/80">
              <span className="text-[10px] text-slate-500 font-medium block">Rejected</span>
              <span className="text-xs font-bold text-emerald-700 mt-0.5 block">
                {report.data_reliability?.rejected_records_count ?? 0} errors
              </span>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[10px] text-emerald-700 font-medium block">Status</span>
              <span className="text-xs font-bold text-emerald-800 mt-0.5 block truncate">
                {report.data_reliability?.reconciliation_status || "RECONCILED"}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-[11px] max-h-[160px] overflow-y-auto pr-0.5">
            {report.data_reliability?.checks?.map((chk, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-slate-600 py-0.5 border-b border-purple-50/50 last:border-b-0">
                {chk.status === "PASS" ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                )}
                <div className="min-w-0">
                  <span className="font-semibold text-slate-800 block truncate">{chk.title}</span>
                  <span className="text-[10px] text-slate-500 line-clamp-1">{chk.details}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Cost Metrics */}
        <div className="bg-white rounded-2xl border border-purple-100 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-purple-50">
              <Activity className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Key Cost Metrics
              </h3>
            </div>

            <div className="space-y-2.5">
              {report.current_cost_per_good_unit != null ? (
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">Average Cost per Good Unit</span>
                    <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">
                      Net Good
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-lg font-black text-slate-900">
                      ₹{report.current_cost_per_good_unit.toLocaleString()}
                    </span>
                    {report.unit_cost_change_pct != null && (
                      <span className={`text-xs font-bold ${report.unit_cost_change_pct >= 0 ? "text-rose-600" : "text-emerald-600"}`}>
                        {report.unit_cost_change_pct >= 0 ? "▲" : "▼"} {Math.abs(report.unit_cost_change_pct)}%
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    {report.baseline_cost_per_good_unit != null ? `(₹${report.baseline_cost_per_good_unit.toLocaleString()} in ${ef.baseline_period_label}) • ` : ""}
                    {report.current_good_qty != null ? `${report.current_good_qty.toLocaleString()} good units` : ""}
                  </span>
                </div>
              ) : (
                <div className="p-3 bg-purple-50/50 rounded-xl border border-dashed border-purple-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">Unit Cost Metrics</span>
                    <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                      Needs Production Data
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 leading-relaxed">
                    Hourly production logs were not uploaded in this session. Upload <code>fact_hourly_production.csv</code> to unlock net unit cost and yield metrics.
                  </p>
                </div>
              )}

              {report.current_cost_per_produced_unit != null && (
                <div className="pt-2 border-t border-purple-50">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">Cost per Produced Unit</span>
                    <span className="text-[9px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      Gross Produced
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-sm font-black text-slate-800">
                      ₹{report.current_cost_per_produced_unit.toLocaleString()}
                    </span>
                    {report.produced_unit_cost_change_pct != null && (
                      <span className={`text-[11px] font-bold ${report.produced_unit_cost_change_pct >= 0 ? "text-rose-600" : "text-emerald-600"}`}>
                        {report.produced_unit_cost_change_pct >= 0 ? "▲" : "▼"} {Math.abs(report.produced_unit_cost_change_pct)}%
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    {report.current_produced_qty != null ? `${report.current_produced_qty.toLocaleString()} gross produced units` : ""}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-purple-50">
                <div>
                  <span className="text-[10px] text-slate-500 block">Total Produced</span>
                  <span className="text-xs font-bold text-slate-900">
                    {report.current_produced_qty != null ? report.current_produced_qty.toLocaleString() : "Not uploaded"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Good Units</span>
                  <span className="text-xs font-bold text-emerald-700">
                    {report.current_good_qty != null ? report.current_good_qty.toLocaleString() : "Not uploaded"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 mt-2">
            {report.current_good_qty != null ? "Directly costed output only • Both denominators audited" : "Direct manufacturing cost analysis"}
          </div>
        </div>

        {/* Cost Trend (per Good Unit or Total Cost) - SVG line graph */}
        <div className="bg-white rounded-2xl border border-purple-100 p-4 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-purple-50">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {hasUnitTrend ? "Cost Trend (per Good Unit)" : "Total Cost Trend (₹ Cr)"}
            </h3>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <svg viewBox="0 0 250 100" className="w-full h-24">
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <polygon
                points={`30,80 ${trendPoints} 220,80`}
                fill="url(#trendGrad)"
              />
              <polyline
                fill="none"
                stroke="#7c3aed"
                strokeWidth="2.5"
                points={trendPoints}
              />
              {(report.monthly_trend || []).map((m, idx) => {
                const val = hasUnitTrend ? (m.cost_per_good_unit ?? 0) : (m.total_cost ?? 0);
                const x = 30 + idx * 95;
                const y = 80 - ((val - trendMin) / trendRange) * 50;
                return (
                  <g key={idx}>
                    <circle cx={x} cy={y} r="3.5" fill="#7c3aed" />
                    <text
                      x={x}
                      y={y - 8}
                      textAnchor="middle"
                      className="text-[9px] font-bold fill-slate-700"
                    >
                      {hasUnitTrend ? `₹${Math.round(val).toLocaleString()}` : `₹${formatAmount(val)}`}
                    </text>
                    <text
                      x={x}
                      y="95"
                      textAnchor="middle"
                      className="text-[8.5px] font-medium fill-slate-400"
                    >
                      {m.month_label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Cost Composition - SVG Donut */}
        <div className="bg-white rounded-2xl border border-purple-100 p-4 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-purple-50">
            <Layers className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Cost Composition ({ef.current_period_label})
            </h3>
          </div>

          <div className="flex items-center gap-2 flex-1">
            <div className="w-24 h-24 shrink-0 relative flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {report.cost_composition.map((c, i) => {
                  const strokeDash = (c.pct / 100) * donutCircumference;
                  const strokeOffset = accumulatedOffset;
                  accumulatedOffset += strokeDash;

                  return (
                    <circle
                      key={c.name}
                      cx="50"
                      cy="50"
                      r={donutRadius}
                      fill="none"
                      stroke={c.color}
                      strokeWidth="14"
                      strokeDasharray={`${strokeDash} ${donutCircumference}`}
                      strokeDashoffset={-strokeOffset}
                    />
                  );
                })}
              </svg>
              <div className="absolute text-center">
                <span className="text-[10px] font-black text-slate-900 block leading-tight">
                  ₹{formatAmount(report.current_total_cost)}
                </span>
                <span className="text-[8px] text-slate-400 block">Total</span>
              </div>
            </div>

            <div className="flex-1 space-y-1 text-[10px]">
              {report.cost_composition.map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                    <span className="truncate">{c.name}</span>
                  </span>
                  <span className="font-bold text-slate-900 shrink-0">{c.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Product Cost Comparison Table */}
      <div className="bg-white rounded-2xl border border-purple-100 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-purple-50">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Product Cost Comparison (Cost per Good Unit)
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">All direct actuals</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-purple-100 text-slate-400 font-semibold text-[10px] uppercase">
                <th className="py-2.5">Product</th>
                <th className="py-2.5">{ef.baseline_period_label}</th>
                <th className="py-2.5">{ef.current_period_label}</th>
                <th className="py-2.5">Unit Delta</th>
                <th className="py-2.5">Change %</th>
                <th className="py-2.5">Main Driver</th>
                <th className="py-2.5 text-right">Good Units</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {report.product_comparison.map((prod) => (
                <tr key={prod.product_code} className="hover:bg-purple-50/30">
                  <td className="py-2.5 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <div>
                      <span>{prod.product_code}</span>
                      <span className="text-[10px] text-slate-400 block font-normal">
                        {prod.product_name}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5">
                    {prod.baseline_cost_per_unit != null
                      ? `₹${prod.baseline_cost_per_unit.toLocaleString()}`
                      : `₹${formatAmount(prod.baseline_total_cost)} (Total)`}
                  </td>
                  <td className="py-2.5 font-bold text-slate-900">
                    {prod.current_cost_per_unit != null
                      ? `₹${prod.current_cost_per_unit.toLocaleString()}`
                      : `₹${formatAmount(prod.current_total_cost)} (Total)`}
                  </td>
                  <td className="py-2.5">
                    {prod.change_amount != null
                      ? `${prod.change_amount >= 0 ? "+" : ""}₹${prod.change_amount}`
                      : `${(prod.current_total_cost - prod.baseline_total_cost) >= 0 ? "+" : ""}₹${formatAmount(prod.current_total_cost - prod.baseline_total_cost)}`}
                  </td>
                  <td className="py-2.5">
                    {prod.change_pct != null ? (
                      <span
                        className={`font-bold ${
                          prod.change_pct >= 0 ? "text-rose-600" : "text-emerald-600"
                        }`}
                      >
                        {prod.change_pct >= 0 ? "▲" : "▼"} {Math.abs(prod.change_pct)}%
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono text-[10px]">-</span>
                    )}
                  </td>
                  <td className="py-2.5 text-slate-600">{prod.main_driver}</td>
                  <td className="py-2.5 text-right font-mono font-medium text-slate-900">
                    {prod.good_units_produced != null
                      ? prod.good_units_produced.toLocaleString()
                      : "Unavailable"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Limitations & Recommended Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* What We Couldn't Establish (Limitations) */}
        <div className="bg-white rounded-2xl border border-purple-100 p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-purple-50">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              What We Couldn't Establish (Governance Disclosures)
            </h3>
          </div>

          <ul className="space-y-2 text-xs text-slate-600">
            {report.limitations.map((lim, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{lim}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Next Steps */}
        <div className="bg-white rounded-2xl border border-purple-100 p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-purple-50">
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Recommended Next Steps
            </h3>
          </div>

          <div className="space-y-2.5">
            {report.recommended_steps.map((step) => (
              <div key={step.step_number} className="flex items-start gap-3 text-xs">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  {step.step_number}
                </span>
                <div>
                  <p className="font-bold text-slate-900">{step.action}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{step.rationale}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Calculation Details (Expandable Reconciliation & Denominator Audit Accordion) */}
      <div className="bg-white rounded-2xl border border-purple-100 shadow-xs overflow-hidden transition-all">
        <button
          onClick={() => setCalculationDetailsOpen((prev) => !prev)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-purple-50/30 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-[#6f3dba]">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Calculation Details &amp; Denominator Audit
              </h3>
              <p className="text-[11px] text-slate-500">
                Deterministic mathematical formulas, production denominators, and waterfall reconciliation proof
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider hidden sm:inline-block ${
                report.bridge?.reconciled
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                  : "bg-amber-100 text-amber-800 border-amber-200"
              }`}
            >
              {report.bridge?.reconciled ? "100% Reconciled" : "Variance Residual"} (₹{Math.abs(report.bridge?.unexplained_remainder || 0).toLocaleString()} Unexplained)
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-slate-200">
              {calculationDetailsOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </div>
        </button>

        {calculationDetailsOpen && (
          <div className="p-4 sm:p-5 border-t border-purple-100/70 bg-purple-50/20 space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Box 1: Mathematical Formulas */}
              <div className="p-4 rounded-xl bg-white border border-purple-100 space-y-2">
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                  1. Mathematical Formulas
                </span>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="p-2 rounded bg-slate-50 font-mono text-[11px] text-purple-950">
                    &Delta;Cost = Cost<sub>{ef.current_period_label}</sub> - Cost<sub>{ef.baseline_period_label}</sub> = {report.cost_change_amount >= 0 ? "+" : "-"}₹{formatAmount(report.cost_change_amount)}
                  </div>
                  <div className="p-2 rounded bg-slate-50 font-mono text-[11px] text-purple-950">
                    Cost / Good Unit = Expenditure / Net Good Units
                  </div>
                  <div className="p-2 rounded bg-slate-50 font-mono text-[11px] text-purple-950">
                    Cost / Produced Unit = Expenditure / Gross Units
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed pt-1">
                  Rejection and rework deductions isolate good finished output from gross plant cycle times.
                </p>
              </div>

              {/* Box 2: Denominator Audit */}
              <div className="p-4 rounded-xl bg-white border border-purple-100 space-y-2">
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                  2. Production Denominators
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between pb-1 border-b border-slate-100">
                    <span className="text-slate-500">Gross Units Produced</span>
                    <span className="font-mono font-bold text-slate-900">
                      {report.current_produced_qty ? report.current_produced_qty.toLocaleString() : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between pb-1 border-b border-slate-100">
                    <span className="text-slate-500">Net Good Output</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {report.current_good_qty ? report.current_good_qty.toLocaleString() : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between pb-1 border-b border-slate-100">
                    <span className="text-slate-500">Scrap / Rejections</span>
                    <span className="font-mono font-bold text-rose-600">
                      {(Math.max(0, (report.current_produced_qty || 0) - (report.current_good_qty || 0))).toLocaleString()}{" "}
                      ({report.current_produced_qty ? (((Math.max(0, (report.current_produced_qty || 0) - (report.current_good_qty || 0))) / report.current_produced_qty) * 100).toFixed(2) : "0"}%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Uncosted MES Runs</span>
                    <span className="font-mono text-amber-700 font-semibold">
                      {report.data_reliability?.uncosted_runs != null
                        ? `${report.data_reliability.uncosted_runs.toLocaleString()} runs disclosed`
                        : "Not recorded (requires production dataset)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Box 3: Reconciliation Proof */}
              <div className="p-4 rounded-xl bg-white border border-purple-100 space-y-2">
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                  3. Reconciliation Proof
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between pb-1 border-b border-slate-100">
                    <span className="text-slate-500">Baseline ({ef.baseline_period_label})</span>
                    <span className="font-mono font-semibold text-slate-800">
                      ₹{formatAmount(report.baseline_total_cost)}
                    </span>
                  </div>
                  <div className="flex justify-between pb-1 border-b border-slate-100">
                    <span className="text-slate-500">Total Explained Variance</span>
                    <span className="font-mono font-bold text-purple-700">
                      {report.bridge?.total_explained >= 0 ? "+" : "-"}₹{formatAmount(report.bridge?.total_explained)}
                    </span>
                  </div>
                  <div className="flex justify-between pb-1 border-b border-slate-100">
                    <span className="text-slate-500">Unexplained Residual</span>
                    <span className={`font-mono font-bold ${report.bridge?.reconciled ? "text-emerald-700" : "text-amber-700"}`}>
                      ₹{report.bridge?.unexplained_remainder != null ? report.bridge.unexplained_remainder.toLocaleString() : "0.00"} {report.bridge?.reconciled ? "(Reconciled)" : "(Unexplained)"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Certified ({ef.current_period_label}) Total</span>
                    <span className="font-mono font-black text-slate-900">
                      ₹{formatAmount(report.current_total_cost)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-100/50 border border-purple-200/60 text-[11px] text-purple-900 flex items-center justify-between">
              <span className="font-medium">
                Certified against Neon PostgreSQL ledger <code>line_cost_batches</code> &bull; Period datasets and operational actuals strictly validated
              </span>
              <span className="font-mono font-bold text-[10px] bg-white px-2 py-0.5 rounded text-purple-800">
                Audit Trail ID: {report.report_id}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 7. Slide-over Finding Detail Drawer */}
      <FindingDetailDrawer
        finding={selectedFinding}
        onClose={() => setSelectedFinding(null)}
        onAskAI={onOpenAIChat}
        currency="₹"
      />
    </div>
  );
}
