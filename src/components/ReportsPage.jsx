import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FileText,
  Download,
  Calendar,
  Sparkles,
  TrendingUp,
  Search,
  Filter,
  Check,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Box,
  Layers,
  ArrowRight,
  ArrowLeft,
  Clock,
  Database,
  Upload,
  X,
  AlertTriangle,
  RotateCcw,
  Eye,
  SlidersHorizontal,
  Bookmark,
  CheckCircle2,
  Printer,
  FileCode,
} from "lucide-react";
import { apiCache } from "../services/apiCache";
import { useCachedAnalytics } from "../hooks/useCachedAnalytics";
import { UpdatingIndicator, PageSkeleton, ErrorBanner } from "./LoadingStates";
import DataImportStudio from "./DataImportStudio";
import AIInvestigationHistoricalViewer from "./AIInvestigationHistoricalViewer";

const isDuplicateSummary = (title, summary) => {
  if (!summary) return true;
  const t = (title || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const s = (summary || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (t === s) return true;
  if (s.length >= 20 && t.includes(s.slice(0, 30))) return true;
  if (t.length >= 20 && s.includes(t.slice(0, 30))) return true;
  return false;
};

const isCleanDatasetRef = (ref) => {
  if (!ref || ref === "GLOBAL" || ref === "Global Store") return false;
  // Exclude raw UUIDs or session IDs like 'edc311ee-4a7e-416b-86c0-227a5705968d'
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ref)) return false;
  if (/^[0-9a-f]{32}$/i.test(ref)) return false;
  if (ref.startsWith("session_") && !ref.includes(".")) return false;
  return true;
};

/**
 * Manufacturing Intelligence Reports - Investigation History & Retrieval Centre
 * Reopens exact, original saved investigation results for:
 * 1. Data Upload Investigations (via DataImportStudio Stage 3)
 * 2. AI Investigations (via AIInvestigationHistoricalViewer)
 */
export default function ReportsPage({
  apiBaseUrl = "/api",
  onNavigate,
  onOpenAIChat,
  refreshKey = 0,
}) {
  // Sync with URL query param ?report_id=... for direct linking and bookmarking
  const getUrlReportId = () => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get("report_id");
  };

  const [selectedReportId, setSelectedReportId] = useState(getUrlReportId);
  const [selectedReportType, setSelectedReportType] = useState(null);

  // Filter toolbar state
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'upload' | 'ai'
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest"); // 'newest' | 'oldest'

  // Update URL search param when report selection changes without full reload
  const updateUrlReportId = useCallback((repId) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (repId) {
      url.searchParams.set("report_id", repId);
    } else {
      url.searchParams.delete("report_id");
    }
    window.history.pushState({}, "", url.toString());
  }, []);

  const handleSelectReport = (report) => {
    setSelectedReportId(report.id);
    const recType = report.record_type || report.type;
    setSelectedReportType(recType);
    updateUrlReportId(report.id);
  };

  const handleBackToList = () => {
    setSelectedReportId(null);
    setSelectedReportType(null);
    setResolvedReportType(null);
    updateUrlReportId(null);
  };

  // 1. Fetch Authoritative Summary KPI Counts from Neon PostgreSQL
  const {
    data: summaryData,
    loading: summaryLoading,
    refetch: refetchSummary,
  } = useCachedAnalytics(`${apiBaseUrl}/reports/summary`, null, {
    staleTime: 30000,
    refreshKey,
    initialData: null,
  });

  // 2. Fetch Authoritative List of Persisted Investigation Records
  const listParams = useMemo(() => {
    const p = { limit: 150, sort_order: sortOrder };
    if (activeTab && activeTab !== "all") p.type = activeTab;
    if (selectedPeriod && selectedPeriod !== "all") p.period = selectedPeriod;
    if (searchQuery.trim()) p.search = searchQuery.trim();
    return p;
  }, [activeTab, selectedPeriod, searchQuery, sortOrder]);

  const {
    data: reportsList,
    loading: reportsLoading,
    isUpdating,
    error: reportsError,
    refetch: refetchReports,
  } = useCachedAnalytics(`${apiBaseUrl}/reports/list`, listParams, {
    staleTime: 30000,
    refreshKey,
    initialData: null,
  });

  const reports = useMemo(() => reportsList || [], [reportsList]);

  // Combined refresh
  const handleRefresh = () => {
    apiCache.invalidate();
    refetchSummary();
    refetchReports();
  };

  // Available periods list
  const availablePeriods = useMemo(() => {
    return summaryData?.available_periods || ["2026-11", "2026-10", "2026-09", "2026-08"];
  }, [summaryData]);

  const isFiltered = activeTab !== "all" || selectedPeriod !== "all" || searchQuery.trim() !== "" || sortOrder !== "newest";

  const handleResetFilters = () => {
    setActiveTab("all");
    setSelectedPeriod("all");
    setSearchQuery("");
    setSortOrder("newest");
  };

  // Explicit Record-Type Resolution for Historical Replay
  const [resolvedReportType, setResolvedReportType] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    if (!selectedReportId) {
      setResolvedReportType(null);
      return;
    }

    if (selectedReportType) {
      const isUpload =
        selectedReportType === "DATA_UPLOAD_INVESTIGATION" ||
        selectedReportType === "upload";
      setResolvedReportType(isUpload ? "DATA_UPLOAD_INVESTIGATION" : "AI_INVESTIGATION");
      return;
    }

    // Check in loaded reports list
    const match = reports.find((r) => r.id === selectedReportId);
    if (match) {
      const matchType = match.record_type || match.type;
      const isUpload =
        matchType === "DATA_UPLOAD_INVESTIGATION" || matchType === "upload";
      setResolvedReportType(isUpload ? "DATA_UPLOAD_INVESTIGATION" : "AI_INVESTIGATION");
      return;
    }

    // Otherwise fetch report metadata directly to resolve record type accurately
    let mounted = true;
    setReportLoading(true);
    fetch(`${apiBaseUrl}/reports/${encodeURIComponent(selectedReportId)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Report not found");
        return res.json();
      })
      .then((data) => {
        if (mounted) {
          const recType = data.record_type || data.type;
          const isUpload =
            recType === "DATA_UPLOAD_INVESTIGATION" || recType === "upload";
          setResolvedReportType(isUpload ? "DATA_UPLOAD_INVESTIGATION" : "AI_INVESTIGATION");
        }
      })
      .catch(() => {
        if (mounted) {
          const isUpload = selectedReportId.startsWith("insp_");
          setResolvedReportType(isUpload ? "DATA_UPLOAD_INVESTIGATION" : "AI_INVESTIGATION");
        }
      })
      .finally(() => {
        if (mounted) setReportLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [selectedReportId, selectedReportType, reports, apiBaseUrl]);

  // =========================================================================
  // VIEW: REOPEN SAVED INVESTIGATION RESULT (PART 5)
  // =========================================================================
  if (selectedReportId) {
    if (reportLoading || !resolvedReportType) {
      return (
        <div className="w-full flex-1 flex flex-col space-y-4 pb-8 font-sans text-slate-800">
          <PageSkeleton cardCount={3} showChart={false} showTable={true} />
        </div>
      );
    }

    return (
      <div className="w-full flex-1 flex flex-col space-y-4 select-none pb-8 font-sans text-slate-800">
        {resolvedReportType === "DATA_UPLOAD_INVESTIGATION" ? (
          // Exact Original Data Upload Investigation View (Reuses DataImportStudio Stage 3)
          <DataImportStudio
            apiBaseUrl={apiBaseUrl}
            onNavigate={onNavigate}
            onOpenAIChat={onOpenAIChat}
            forcedStage={3}
            historicalReportId={selectedReportId}
            isHistoricalView={true}
            onBack={handleBackToList}
          />
        ) : (
          // Dedicated Historical AI Investigation View
          <AIInvestigationHistoricalViewer
            apiBaseUrl={apiBaseUrl}
            reportId={selectedReportId}
            onBack={handleBackToList}
            onNavigate={onNavigate}
            onOpenAIChat={onOpenAIChat}
          />
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW: MAIN INVESTIGATION HISTORY LIST & RETRIEVAL CENTRE
  // =========================================================================
  const totalUploads = summaryData?.total_upload_investigations ?? reports.filter((r) => r.type === "upload").length;
  const totalAI = summaryData?.total_ai_investigations ?? reports.filter((r) => r.type === "ai").length;
  const totalAll = summaryData?.total_saved_reports ?? (totalUploads + totalAI);
  const latestActivity = summaryData?.latest_activity;

  return (
    <div className="w-full flex-1 flex flex-col space-y-4 select-none pb-8 font-sans text-slate-800">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            Manufacturing Intelligence Reports
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-0.5">
            Access your saved dataset investigations and AI-generated manufacturing analyses in one place.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(isUpdating || reportsLoading || summaryLoading) && (
            <UpdatingIndicator text="Syncing investigation history..." />
          )}

          <button
            onClick={handleRefresh}
            disabled={isUpdating || reportsLoading || summaryLoading}
            className="h-10 sm:h-11 w-10 sm:w-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs cursor-pointer flex items-center justify-center shrink-0"
            title="Refresh history"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                isUpdating || reportsLoading || summaryLoading ? "animate-spin text-purple-600" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Part 2.A: Summary Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Total Upload Investigations */}
        <div
          onClick={() => setActiveTab("upload")}
          className={`bg-white rounded-2xl p-4 sm:p-5 min-h-[115px] border cursor-pointer transition-all ${
            activeTab === "upload"
              ? "border-purple-400 shadow-md ring-2 ring-purple-100"
              : "border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] hover:border-purple-200"
          } flex flex-col justify-between`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Upload Investigations</span>
              <Upload className="w-4 h-4 text-[#7c3aed]" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
              {totalUploads.toLocaleString()}
            </div>
          </div>
          <div className="text-[11px] text-[#7c3aed] font-semibold mt-1">
            Persisted batch cost &amp; yield analyses
          </div>
        </div>

        {/* Card 2: Total AI Investigations */}
        <div
          onClick={() => setActiveTab("ai")}
          className={`bg-white rounded-2xl p-4 sm:p-5 min-h-[115px] border cursor-pointer transition-all ${
            activeTab === "ai"
              ? "border-purple-400 shadow-md ring-2 ring-purple-100"
              : "border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] hover:border-purple-200"
          } flex flex-col justify-between`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total AI Investigations</span>
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-indigo-900 mt-1 font-mono">
              {totalAI.toLocaleString()}
            </div>
          </div>
          <div className="text-[11px] text-indigo-700 font-semibold mt-1">
            Autonomous root-cause inquiry records
          </div>
        </div>

        {/* Card 3: Total Saved Investigations */}
        <div
          onClick={() => setActiveTab("all")}
          className={`bg-white rounded-2xl p-4 sm:p-5 min-h-[115px] border cursor-pointer transition-all ${
            activeTab === "all"
              ? "border-purple-400 shadow-md ring-2 ring-purple-100"
              : "border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] hover:border-purple-200"
          } flex flex-col justify-between`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Saved Reports</span>
              <Database className="w-4 h-4 text-slate-500" />
            </div>
            <div className="text-2xl font-black text-purple-900 mt-1 font-mono">
              {totalAll.toLocaleString()}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Durable Neon PostgreSQL permanent store
          </div>
        </div>

        {/* Card 4: Latest Activity */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 min-h-[115px] border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Latest Investigation Date</span>
              <Clock className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-lg font-black text-slate-900 mt-1 font-mono truncate">
              {latestActivity?.date || "2026-11-16"}
            </div>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 truncate" title={latestActivity?.title}>
            {latestActivity?.title || "Active Manufacturing Archive"}
          </div>
        </div>
      </div>

      {/* Part 2.B: Main Navigation Tabs (Only 3 Tabs) */}
      <div className="w-full bg-slate-100/75 p-1 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 w-full">
          <button
            onClick={() => setActiveTab("all")}
            className={`w-full h-10 sm:h-11 px-4 rounded-xl text-xs sm:text-[13.5px] font-bold transition-all cursor-pointer flex items-center justify-center gap-2 text-center truncate ${
              activeTab === "all"
                ? "bg-[#7c3aed] text-white shadow-sm font-black"
                : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-white/70 font-semibold"
            }`}
          >
            <span>All Investigations</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                activeTab === "all" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
              }`}
            >
              {totalAll}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("upload")}
            className={`w-full h-10 sm:h-11 px-4 rounded-xl text-xs sm:text-[13.5px] font-bold transition-all cursor-pointer flex items-center justify-center gap-2 text-center truncate ${
              activeTab === "upload"
                ? "bg-[#7c3aed] text-white shadow-sm font-black"
                : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-white/70 font-semibold"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Dataset Upload Investigations</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                activeTab === "upload" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
              }`}
            >
              {totalUploads}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={`w-full h-10 sm:h-11 px-4 rounded-xl text-xs sm:text-[13.5px] font-bold transition-all cursor-pointer flex items-center justify-center gap-2 text-center truncate ${
              activeTab === "ai"
                ? "bg-[#7c3aed] text-white shadow-sm font-black"
                : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-white/70 font-semibold"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Investigations</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                activeTab === "ai" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
              }`}
            >
              {totalAI}
            </span>
          </button>
        </div>
      </div>

      {/* Part 2.C: Investigation History Toolbar */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, investigation ID, or summary..."
            className="w-full pl-9 pr-3 h-10 sm:h-11 bg-slate-50/70 border border-slate-200 text-slate-800 text-xs sm:text-[13px] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 focus:bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Reporting Period Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase hidden sm:inline">Period:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="h-10 sm:h-11 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
            >
              <option value="all">All Reporting Periods</option>
              {availablePeriods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Date Sort */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="h-10 sm:h-11 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="h-10 sm:h-11 px-3 rounded-xl border border-purple-200 bg-purple-50/70 text-[#7c3aed] hover:bg-purple-100 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}

          {/* Real-time Filter Updating Indicator */}
          {isUpdating && <UpdatingIndicator text="Searching..." />}
        </div>
      </div>

      {/* Loading Skeleton */}
      {(reportsLoading || reportsList === null) && reports.length === 0 && (
        <PageSkeleton cardCount={4} showChart={false} showTable={true} />
      )}

      {/* Error State */}
      {reportsError && reports.length === 0 && (
        <ErrorBanner
          error={reportsError}
          onRetry={handleRefresh}
          title="Investigation History Retrieval Error"
        />
      )}

      {/* Part 7: Empty States */}
      {!reportsLoading && reportsList !== null && reports.length === 0 && (
        <div className="bg-white rounded-2xl p-10 border border-purple-100 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#7c3aed] flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900">
              {activeTab === "upload"
                ? "No dataset investigations saved yet."
                : activeTab === "ai"
                ? "No AI investigations saved yet."
                : isFiltered
                ? "No investigations match your filter criteria."
                : "No saved investigations found."}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {activeTab === "upload"
                ? "Upload manufacturing data packages in Data Upload to generate deterministic cost variance investigations."
                : activeTab === "ai"
                ? "Run natural-language cost inquiries in AI Investigations to generate structured analytical reports."
                : "Try clearing your search query or period filter to view saved records."}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            {isFiltered ? (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-purple-50 text-[#7c3aed] font-bold text-xs hover:bg-purple-100 border border-purple-200 transition-colors"
              >
                Clear Filters
              </button>
            ) : activeTab === "upload" ? (
              <button
                onClick={() => onNavigate && onNavigate("import")}
                className="px-4 py-2 rounded-xl bg-[#7c3aed] text-white font-bold text-xs hover:bg-purple-700 transition-colors shadow-sm"
              >
                Go to Data Upload
              </button>
            ) : activeTab === "ai" ? (
              <button
                onClick={() => onNavigate && onNavigate("investigations")}
                className="px-4 py-2 rounded-xl bg-[#7c3aed] text-white font-bold text-xs hover:bg-purple-700 transition-colors shadow-sm"
              >
                Go to AI Investigations
              </button>
            ) : null}
          </div>
        </div>
      )}

      {/* Part 2.D: Investigation History Cards */}
      {reports.length > 0 && (
        <div className={`space-y-3 transition-all duration-300 ${isUpdating ? "opacity-50 pointer-events-none cursor-wait" : "opacity-100"}`}>
          {/* Header Info */}
          <div className="px-2 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>
              Showing <strong className="text-slate-900 font-bold">{reports.length}</strong> saved investigations
            </span>
            <span className="text-[11px] text-slate-400">Click any card to reopen original results</span>
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {reports.map((report) => {
              const isDuplicate = isDuplicateSummary(report.title, report.summary);
              const showDataset = isCleanDatasetRef(report.datasetRef);

              return (
                <div
                  key={report.id}
                  onClick={() => handleSelectReport(report)}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-purple-300 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between gap-3 relative"
                >
                  {/* Row 1: Badges & Action Button */}
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Investigation Type Badge */}
                      {report.record_type === "DATA_UPLOAD_INVESTIGATION" || report.type === "DATA_UPLOAD_INVESTIGATION" || report.type === "upload" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-[#7c3aed] border border-purple-200/70">
                          <Upload className="w-3.5 h-3.5 text-[#7c3aed]" />
                          <span>Data Upload</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span>AI Investigation</span>
                        </span>
                      )}

                      {/* Period Badge */}
                      {report.period && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{report.period}</span>
                        </span>
                      )}

                      {/* Provenance Badge */}
                      {report.provenance && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{report.provenance}</span>
                        </span>
                      )}
                    </div>

                    {/* View Details Action Button */}
                    <div className="shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectReport(report);
                        }}
                        className="px-4 py-1.5 rounded-xl bg-purple-50 text-[#7c3aed] group-hover:bg-[#7c3aed] group-hover:text-white transition-all text-xs font-bold border border-purple-200 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Row 2: Investigation Title */}
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#7c3aed] transition-colors leading-snug">
                    {report.title}
                  </h3>

                  {/* Row 3: Unique Summary (Only if not duplicate of title) */}
                  {!isDuplicate && report.summary && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {report.summary}
                    </p>
                  )}

                  {/* Row 4: Clean Footer Metadata */}
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-medium pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Created: {report.createdDate}</span>
                    </span>

                    {showDataset && (
                      <span className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px] truncate max-w-sm">
                        <Box className="w-3.5 h-3.5 text-purple-500" />
                        <span>Source: {report.datasetRef}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
