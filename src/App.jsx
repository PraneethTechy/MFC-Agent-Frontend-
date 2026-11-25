import React, { useState, useEffect, useRef } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Menu } from "lucide-react";
import AppSidebar from "./components/AppSidebar";
import HomePage from "./components/home/HomePage";
import OverviewPage from "./components/OverviewPage";
import ManufacturingChat from "./components/ManufacturingChat";
import DataImportStudio from "./components/DataImportStudio";
import UploadPage from "./components/DataUpload/pages/UploadPage";
import ValidationPage from "./components/DataUpload/pages/ValidationPage";
import InvestigationResultPage from "./components/DataUpload/pages/InvestigationResultPage";
import DataOverview from "./components/DataOverview";
import SyntheticDataModal from "./components/SyntheticDataModal";
import FloatingAIChatbot from "./components/FloatingAIChatbot";
import InvestigationReport from "./components/InvestigationReport";
import AIInvestigationsPage from "./components/AIInvestigationsPage";
import CostAnalysisPage from "./components/CostAnalysisPage";
import ProductAnalysisPage from "./components/ProductAnalysisPage";
import ComponentAnalysisPage from "./components/ComponentAnalysisPage";
import ProductionQualityPage from "./components/ProductionQualityPage";
import ReportsPage from "./components/ReportsPage";
import DataConnectorsPage from "./components/DataConnectorsPage";
import AIArchitecturePage from "./components/AIArchitecturePage";
import AIInvestigationHistoricalViewer from "./components/AIInvestigationHistoricalViewer";
import { PageSkeleton } from "./components/LoadingStates";
import { apiCache } from "./services/apiCache";
import { API_BASE_URL, getApiUrl } from "./config/api";

/**
 * Unified Route wrapper for Data Upload 3-Stage Workflow (/upload, /upload/validate/:sessionId, /upload/results/:sessionId)
 * Keeps DataImportStudio mounted across stages so live SSE streams, uploaded files,
 * and background processing are not severed during route transitions.
 */
function DataUploadWorkflowWrapper({
  apiBaseUrl,
  onNavigate,
  onOpenAIChat,
  onImportSuccess,
  onUploadStateChange,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const routeParams = Object.fromEntries(searchParams.entries());

  let stage = 1;
  let sessionId = null;

  const validateMatch = location.pathname.match(/^\/upload\/validate\/([^/]+)/);
  const resultsMatch = location.pathname.match(/^\/upload\/results\/([^/]+)/);

  if (validateMatch) {
    stage = 2;
    sessionId = decodeURIComponent(validateMatch[1]);
  } else if (resultsMatch) {
    stage = 3;
    sessionId = decodeURIComponent(resultsMatch[1]);
  }

  return (
    <DataImportStudio
      apiBaseUrl={apiBaseUrl}
      onNavigate={onNavigate}
      onOpenAIChat={onOpenAIChat}
      onImportSuccess={onImportSuccess}
      onUploadStateChange={onUploadStateChange}
      routeParams={routeParams}
      forcedStage={stage}
      routeSessionId={sessionId}
      onNavigateToValidate={(sid) => {
        navigate(`/upload/validate/${encodeURIComponent(sid)}`);
      }}
      onNavigateToResults={(sid) => {
        navigate(`/upload/results/${encodeURIComponent(sid)}`);
      }}
      onNavigateToUpload={(msg) => {
        navigate(msg ? `/upload?msg=${encodeURIComponent(msg)}` : "/upload");
      }}
    />
  );
}

/**
 * Route wrapper for AI Investigations (/investigations)
 * Handles query parameter forwarding (e.g. ?question=... or ?report_id=...)
 * Redirects ?report_id= to canonical /investigations/report/:reportId.
 */
function AIInvestigationsRouteWrapper({ apiBaseUrl, onNavigate, onOpenAIChat }) {
  const [searchParams] = useSearchParams();
  const routeParams = Object.fromEntries(searchParams.entries());

  if (routeParams.report_id) {
    return (
      <Navigate
        to={`/investigations/report/${encodeURIComponent(routeParams.report_id)}`}
        replace
      />
    );
  }

  return (
    <AIInvestigationsPage
      apiBaseUrl={apiBaseUrl}
      onNavigate={onNavigate}
      onOpenAIChat={onOpenAIChat}
      routeParams={routeParams}
    />
  );
}

/**
 * Parameterized Route wrapper for Investigation Report (/investigations/report/:reportId)
 * Authoritative dual historical router:
 * - DATA_UPLOAD_INVESTIGATION -> Exact original DataImportStudio Stage 3
 * - AI_INVESTIGATION -> Dedicated AIInvestigationHistoricalViewer
 */
function InvestigationReportRouteWrapper({
  apiBaseUrl,
  onNavigate,
  onOpenAIChat,
}) {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [reportType, setReportType] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`${apiBaseUrl}/reports/${encodeURIComponent(reportId)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Report not found");
        return res.json();
      })
      .then((data) => {
        if (mounted) {
          setReportData(data);
          const t = data.record_type || data.type;
          const isUpload =
            t === "DATA_UPLOAD_INVESTIGATION" || t === "upload";
          setReportType(isUpload ? "DATA_UPLOAD_INVESTIGATION" : "AI_INVESTIGATION");
        }
      })
      .catch(() => {
        if (mounted) {
          const isUpload = reportId && reportId.startsWith("insp_");
          setReportType(isUpload ? "DATA_UPLOAD_INVESTIGATION" : "AI_INVESTIGATION");
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [apiBaseUrl, reportId]);

  if (loading || !reportType) {
    return (
      <div className="w-full flex-1 flex flex-col space-y-4 pb-8 font-sans text-slate-800">
        <PageSkeleton cardCount={3} showChart={false} showTable={true} />
      </div>
    );
  }

  if (reportType === "DATA_UPLOAD_INVESTIGATION") {
    return (
      <DataImportStudio
        apiBaseUrl={apiBaseUrl}
        onNavigate={onNavigate}
        onOpenAIChat={onOpenAIChat}
        forcedStage={3}
        historicalReportId={reportId}
        isHistoricalView={true}
        onBack={() => navigate("/reports")}
      />
    );
  }

  return (
    <AIInvestigationHistoricalViewer
      apiBaseUrl={apiBaseUrl}
      reportId={reportId}
      initialData={reportData}
      onBack={() => navigate("/reports")}
      onNavigate={onNavigate}
      onOpenAIChat={onOpenAIChat}
    />
  );
}

/**
 * Generic query params wrapper for analysis pages
 */
function PageWithParamsWrapper({
  Component,
  apiBaseUrl,
  onNavigate,
  onOpenAIChat,
  refreshKey = 0,
}) {
  const [searchParams] = useSearchParams();
  const routeParams = Object.fromEntries(searchParams.entries());

  return (
    <Component
      apiBaseUrl={apiBaseUrl}
      onNavigate={onNavigate}
      onOpenAIChat={onOpenAIChat}
      routeParams={routeParams}
      refreshKey={refreshKey}
    />
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [unsavedUploadState, setUnsavedUploadState] = useState({
    hasUnsaved: false,
    isStreaming: false,
  });
  const mainRef = useRef(null);

  // Invalidate cache and trigger global metric synchronization across all modules on commit
  const handleImportSuccess = () => {
    apiCache.invalidate();
    setRefreshKey((k) => k + 1);
  };

  // Scroll main container to top on route change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location.pathname]);

  // Seamless legacy hash migration support (e.g. #/cost-analysis -> /cost-analysis)
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const raw = window.location.hash.replace(/^#\/?/, "");
      if (raw) {
        const [hashPath, queryPart] = raw.split("?");
        let targetRoute = hashPath === "import" ? "/upload" : `/${hashPath}`;
        if (targetRoute === "/data-connectors") targetRoute = "/connectors";
        if (targetRoute === "/investigation") targetRoute = "/investigations";
        const destination = queryPart ? `${targetRoute}?${queryPart}` : targetRoute;
        window.history.replaceState(null, "", destination);
        navigate(destination, { replace: true });
      }
    }
  }, []);

  // Floating AI Chat Popup state
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [aiChatInitialQuery, setAiChatInitialQuery] = useState("");

  // Global active session state preserved across sidebar and route transitions
  const [activeSessionId, setActiveSessionId] = useState(() => {
    const match = typeof window !== "undefined" ? window.location.pathname.match(/^\/upload\/(?:results|validate)\/([^/]+)/) : null;
    if (match && match[1]) {
      const sid = decodeURIComponent(match[1]);
      localStorage.setItem("gwc_active_upload_session", sid);
      localStorage.setItem("active_upload_session_id", sid);
      return sid;
    }
    return (typeof window !== "undefined" && window.location.pathname.startsWith("/upload"))
      ? (localStorage.getItem("gwc_active_upload_session") || "GLOBAL")
      : "GLOBAL";
  });

  useEffect(() => {
    const match = location.pathname.match(/^\/upload\/(?:results|validate)\/([^/]+)/);
    const searchParams = new URLSearchParams(location.search);
    const qSid = searchParams.get("session_id");
    const sid = match && match[1] ? decodeURIComponent(match[1]) : qSid;
    if (sid && sid !== "GLOBAL") {
      setActiveSessionId(sid);
      localStorage.setItem("gwc_active_upload_session", sid);
      localStorage.setItem("active_upload_session_id", sid);
    }
  }, [location.pathname, location.search]);

  const handleOpenAIChat = (opts = "") => {
    if (typeof opts === "string") {
      setAiChatInitialQuery(opts);
    } else if (opts && typeof opts === "object") {
      if (opts.initialQuery) setAiChatInitialQuery(opts.initialQuery);
      if (opts.sessionId && opts.sessionId !== "GLOBAL") {
        setActiveSessionId(opts.sessionId);
        localStorage.setItem("gwc_active_upload_session", opts.sessionId);
        localStorage.setItem("active_upload_session_id", opts.sessionId);
      }
    }
    setIsAIChatOpen(true);
  };

  /**
   * Universal onNavigate dispatcher
   * Adapts legacy tab string triggers ("overview", "import", "investigations", etc.)
   * and parameterized routes without causing full-page reloads.
   */
  const handleNavigate = (target, params = {}) => {
    if (!target) return;
    let path = target;

    // Canonical route mappings
    if (target === "overview") path = "/overview";
    else if (target === "import" || target === "upload") path = "/upload";
    else if (target === "investigations" || target === "investigation") {
      const reportId = params?.report_id || params?.reportId;
      if (reportId) {
        navigate(`/investigations/report/${encodeURIComponent(reportId)}`);
        return;
      }
      path = "/investigations";
    } else if (
      target === "cost-analysis" ||
      target === "cost-engine" ||
      target === "variance-analysis"
    ) {
      path = "/cost-analysis";
    } else if (target === "product-analysis") path = "/product-analysis";
    else if (target === "component-analysis") path = "/component-analysis";
    else if (
      target === "production-quality" ||
      target === "quality"
    ) {
      path = "/production-quality";
    } else if (target === "reports") path = "/reports";
    else if (
      target === "connectors" ||
      target === "data-connectors"
    ) {
      path = "/connectors";
    } else if (target === "settings") path = "/settings";
    else if (!path.startsWith("/")) path = `/${path}`;

    // Guard against accidental loss of active unsaved upload files
    if (
      unsavedUploadState.hasUnsaved &&
      location.pathname.startsWith("/upload") &&
      !path.startsWith("/upload")
    ) {
      const confirmLeave = window.confirm(
        "You have an upload in progress. Navigating away will discard unsaved files. Are you sure you want to leave?"
      );
      if (!confirmLeave) return;
      setUnsavedUploadState({ hasUnsaved: false, isStreaming: false });
    }

    const queryStr =
      params && Object.keys(params).length > 0
        ? new URLSearchParams(params).toString()
        : "";
    const destination = queryStr ? `${path}?${queryStr}` : path;
    navigate(destination);
  };

  // Synchronize theme with document root
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col lg:flex-row bg-white font-sans antialiased text-slate-800 m-0 p-0 select-none relative">
      {/* Mobile Top Bar (Only visible on small viewports < lg) */}
      <div className="lg:hidden h-14 px-4 w-full flex items-center justify-between border-b border-slate-100 bg-white shrink-0 z-30">
        <div
          onClick={() => handleNavigate("/overview")}
          className="flex items-center cursor-pointer py-1"
          title="GWC DATA.AI - Solution Matters"
        >
          <img
            src="/gwc-logo.png"
            alt="GWC DATA.AI - Solution Matters"
            className="h-8 w-auto max-w-[180px] object-contain drop-shadow-2xs"
          />
        </div>
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
          title="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop Persistent Left Navigation */}
      <AppSidebar
        setActiveTab={handleNavigate}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Persistent Content Area with Client-Side Routes */}
      <main
        ref={mainRef}
        className={`flex-1 h-full min-w-0 flex flex-col ${
          location.pathname === "/" || location.pathname.startsWith("/home")
            ? "bg-[#F6F7FD] overflow-y-auto px-3.5 py-2.5 sm:px-5 sm:py-3"
            : "bg-white overflow-y-auto px-4 py-2.5 sm:px-6 sm:py-3.5"
        }`}
      >
        <Routes>
          {/* 00. HOME LANDING DASHBOARD */}
          <Route
            path="/home"
            element={
              <HomePage
                onNavigate={handleNavigate}
                onOpenAIChat={handleOpenAIChat}
              />
            }
          />

          {/* 01. OVERVIEW */}
          <Route
            path="/overview"
            element={
              <OverviewPage
                apiBaseUrl={API_BASE_URL}
                onNavigate={handleNavigate}
                onOpenAIChat={handleOpenAIChat}
                refreshKey={refreshKey}
              />
            }
          />

          {/* 02. DATA UPLOAD THREE-STAGE WORKFLOW */}
          {/* Stage 1: Dataset Upload */}
          <Route
            path="/upload"
            element={
              <DataUploadWorkflowWrapper
                apiBaseUrl={API_BASE_URL}
                onNavigate={handleNavigate}
                onOpenAIChat={handleOpenAIChat}
                onImportSuccess={handleImportSuccess}
                onUploadStateChange={setUnsavedUploadState}
              />
            }
          />

          {/* Stage 2: Validation & Processing */}
          <Route
            path="/upload/validate/:sessionId"
            element={
              <DataUploadWorkflowWrapper
                apiBaseUrl={API_BASE_URL}
                onNavigate={handleNavigate}
                onOpenAIChat={handleOpenAIChat}
                onImportSuccess={handleImportSuccess}
                onUploadStateChange={setUnsavedUploadState}
              />
            }
          />
          <Route
            path="/upload/validate"
            element={
              <Navigate
                to="/upload?msg=Please+upload+your+datasets+before+proceeding+to+validation."
                replace
              />
            }
          />

          {/* Stage 3: Investigation Results */}
          <Route
            path="/upload/results/:sessionId"
            element={
              <DataUploadWorkflowWrapper
                apiBaseUrl={API_BASE_URL}
                onNavigate={handleNavigate}
                onOpenAIChat={handleOpenAIChat}
                onImportSuccess={handleImportSuccess}
                onUploadStateChange={setUnsavedUploadState}
              />
            }
          />
          <Route
            path="/upload/results"
            element={
              <Navigate
                to="/upload?msg=Please+upload+and+validate+your+datasets+before+viewing+results."
                replace
              />
            }
          />

          {/* Legacy import alias */}
          <Route path="/import" element={<Navigate to="/upload" replace />} />

          {/* 03. AI INVESTIGATIONS */}
          <Route
            path="/investigations"
            element={
              <AIInvestigationsRouteWrapper
                apiBaseUrl={API_BASE_URL}
                onNavigate={handleNavigate}
                onOpenAIChat={handleOpenAIChat}
              />
            }
          />
          {/* Investigation Parameterized Route */}
          <Route
            path="/investigations/report/:reportId"
            element={
              <InvestigationReportRouteWrapper
                apiBaseUrl={API_BASE_URL}
                onNavigate={handleNavigate}
                onOpenAIChat={handleOpenAIChat}
              />
            }
          />
          <Route path="/investigation" element={<Navigate to="/investigations" replace />} />

          {/* 04. COST ANALYSIS */}
          <Route
            path="/cost-analysis"
            element={
              <PageWithParamsWrapper
                Component={CostAnalysisPage}
                apiBaseUrl={API_BASE_URL}
                onNavigate={handleNavigate}
                onOpenAIChat={handleOpenAIChat}
                refreshKey={refreshKey}
              />
            }
          />
          <Route path="/cost-engine" element={<Navigate to="/cost-analysis" replace />} />
          <Route path="/variance-analysis" element={<Navigate to="/cost-analysis" replace />} />

          {/* 05. PRODUCT ANALYSIS */}
          <Route
            path="/product-analysis"
            element={
              <PageWithParamsWrapper
                Component={ProductAnalysisPage}
                apiBaseUrl={API_BASE_URL}
                onNavigate={handleNavigate}
                onOpenAIChat={handleOpenAIChat}
                refreshKey={refreshKey}
              />
            }
          />

          {/* 06. COMPONENT ANALYSIS */}
          <Route
            path="/component-analysis"
            element={
              <PageWithParamsWrapper
                Component={ComponentAnalysisPage}
                apiBaseUrl={API_BASE_URL}
                onNavigate={handleNavigate}
                onOpenAIChat={handleOpenAIChat}
                refreshKey={refreshKey}
              />
            }
          />

          {/* 07. PRODUCTION & QUALITY */}
          <Route
            path="/production-quality"
            element={
              <PageWithParamsWrapper
                Component={ProductionQualityPage}
                apiBaseUrl={API_BASE_URL}
                onNavigate={handleNavigate}
                onOpenAIChat={handleOpenAIChat}
                refreshKey={refreshKey}
              />
            }
          />
          <Route path="/quality" element={<Navigate to="/production-quality" replace />} />

          {/* 08. REPORTS */}
          <Route
            path="/reports"
            element={
              <ReportsPage
                apiBaseUrl={API_BASE_URL}
                onNavigate={handleNavigate}
                onOpenAIChat={handleOpenAIChat}
                refreshKey={refreshKey}
              />
            }
          />

          {/* 09. DATA CONNECTORS */}
          <Route
            path="/connectors"
            element={
              <DataConnectorsPage
                apiBaseUrl={API_BASE_URL}
                onNavigate={handleNavigate}
                onOpenAIChat={handleOpenAIChat}
              />
            }
          />
          <Route path="/data-connectors" element={<Navigate to="/connectors" replace />} />

          {/* 10. AI ARCHITECTURE */}
          <Route
            path="/architecture"
            element={
              <AIArchitecturePage
                onNavigate={handleNavigate}
              />
            }
          />
          <Route path="/ai-architecture" element={<Navigate to="/architecture" replace />} />

          {/* AUXILIARY & SYSTEM ROUTES */}
          <Route
            path="/agent-chat"
            element={
              <div className="bg-white rounded-xl p-4 border border-purple-100 shadow-xs flex-1 min-h-[600px] overflow-y-auto">
                <ManufacturingChat />
              </div>
            }
          />
          <Route
            path="/master-data"
            element={
              <div className="bg-white rounded-xl p-4 border border-purple-100 shadow-xs flex-1 min-h-[600px] overflow-y-auto">
                <DataOverview apiBaseUrl={API_BASE_URL} />
              </div>
            }
          />
          <Route
            path="/scenario-simulator"
            element={
              <div className="bg-white rounded-xl p-4 border border-purple-100 shadow-xs flex-1 min-h-[600px] overflow-y-auto space-y-4">
                <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/40 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Scenario Simulator & Benchmark Sandbox
                    </h3>
                    <p className="text-xs text-slate-500">
                      Run what-if scenario analyses and generate controlled manufacturing benchmarks without affecting live Neon actuals.
                    </p>
                  </div>
                </div>
                <SyntheticDataModal
                  apiBaseUrl={API_BASE_URL}
                  onGenerated={() => setRefreshKey((k) => k + 1)}
                />
              </div>
            }
          />
          <Route
            path="/settings"
            element={
              <div className="bg-white rounded-xl p-5 border border-purple-100 shadow-xs max-w-xl">
                <h2 className="text-sm font-bold text-slate-900 mb-1">
                  System Preferences & Integrations
                </h2>
                <p className="text-[11px] text-slate-500 mb-4">
                  Manufacturing Cost Agent environment variables and connected data sources.
                </p>

                <div className="space-y-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-800">Neon PostgreSQL</span>
                      <p className="text-slate-500 text-[10px]">
                        Analytical ledger with promoted cost batches
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Connected
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-800">Domo AI Text Generation</span>
                      <p className="text-slate-500 text-[10px]">
                        Natural language query parsing and evidence explanations
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Configured
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-800">Active Theme</span>
                      <p className="text-slate-500 text-[10px]">
                        Currently displaying {theme} enterprise theme
                      </p>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className="px-2.5 py-1 rounded border border-purple-200 text-purple-700 bg-white hover:bg-purple-50 font-semibold cursor-pointer text-xs"
                    >
                      Toggle to {theme === "light" ? "Dark" : "Light"}
                    </button>
                  </div>
                </div>
              </div>
            }
          />

          {/* Root and Unknown Routes Fallback */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>

      {/* Enterprise Floating AI Chatbot accessible across all application routes */}
      <FloatingAIChatbot
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        onOpen={() => setIsAIChatOpen(true)}
        initialQuery={aiChatInitialQuery}
        onClearInitialQuery={() => setAiChatInitialQuery("")}
        sessionId={location.pathname.startsWith("/upload") ? activeSessionId : "GLOBAL"}
        investigationMode={location.pathname.startsWith("/upload") ? "UPLOAD_SESSION_WITH_GLOBAL_COMPARISON" : "GLOBAL_ONLY"}
        currentPage={location.pathname}
        apiBaseUrl={API_BASE_URL}
      />
    </div>
  );
}
