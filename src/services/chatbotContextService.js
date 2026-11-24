import { apiCache } from "./apiCache";

/**
 * Chatbot Context Service
 * Resolves application page awareness, active filters, store selections,
 * and page-tailored starter questions dynamically.
 */

export const PAGE_IDENTIFIERS = {
  DATA_UPLOAD_STAGE_1: "DATA_UPLOAD_STAGE_1",
  DATA_UPLOAD_STAGE_2: "DATA_UPLOAD_STAGE_2",
  DATA_UPLOAD_STAGE_3: "DATA_UPLOAD_STAGE_3",
  OVERVIEW: "OVERVIEW",
  AI_INVESTIGATIONS: "AI_INVESTIGATIONS",
  COST_ANALYSIS: "COST_ANALYSIS",
  PRODUCT_ANALYSIS: "PRODUCT_ANALYSIS",
  COMPONENT_ANALYSIS: "COMPONENT_ANALYSIS",
  PRODUCTION_QUALITY: "PRODUCTION_QUALITY",
  REPORTS: "REPORTS",
  DATA_CONNECTORS: "DATA_CONNECTORS",
  ARCHITECTURE: "ARCHITECTURE",
  HOME: "HOME",
};

/**
 * Resolves current page identifier from pathname
 */
export function getPageIdFromPath(pathname = "") {
  const path = (pathname || "").toLowerCase().trim();
  if (path.startsWith("/upload/results/")) return PAGE_IDENTIFIERS.DATA_UPLOAD_STAGE_3;
  if (path.startsWith("/upload/validate/")) return PAGE_IDENTIFIERS.DATA_UPLOAD_STAGE_2;
  if (path === "/upload" || path === "/import") return PAGE_IDENTIFIERS.DATA_UPLOAD_STAGE_1;
  if (path === "/overview") return PAGE_IDENTIFIERS.OVERVIEW;
  if (path.startsWith("/investigations/report/") || path.startsWith("/reports/")) return PAGE_IDENTIFIERS.REPORTS;
  if (path === "/investigations" || path === "/investigation") return PAGE_IDENTIFIERS.AI_INVESTIGATIONS;
  if (path === "/cost-analysis" || path === "/cost-engine" || path === "/variance-analysis") return PAGE_IDENTIFIERS.COST_ANALYSIS;
  if (path === "/product-analysis") return PAGE_IDENTIFIERS.PRODUCT_ANALYSIS;
  if (path === "/component-analysis") return PAGE_IDENTIFIERS.COMPONENT_ANALYSIS;
  if (path === "/production-quality" || path === "/quality") return PAGE_IDENTIFIERS.PRODUCTION_QUALITY;
  if (path === "/reports") return PAGE_IDENTIFIERS.REPORTS;
  if (path === "/connectors" || path === "/data-connectors") return PAGE_IDENTIFIERS.DATA_CONNECTORS;
  if (path === "/architecture" || path === "/ai-architecture") return PAGE_IDENTIFIERS.ARCHITECTURE;
  return PAGE_IDENTIFIERS.HOME;
}

/**
 * Human-readable page title
 */
export function getPageTitle(pageId) {
  switch (pageId) {
    case PAGE_IDENTIFIERS.DATA_UPLOAD_STAGE_1:
      return "Data Upload (Stage 1 — Select Datasets)";
    case PAGE_IDENTIFIERS.DATA_UPLOAD_STAGE_2:
      return "Data Upload (Stage 2 — Validate & Prepare)";
    case PAGE_IDENTIFIERS.DATA_UPLOAD_STAGE_3:
      return "Data Upload (Stage 3 — Investigation Results)";
    case PAGE_IDENTIFIERS.OVERVIEW:
      return "Plant Overview Dashboard";
    case PAGE_IDENTIFIERS.AI_INVESTIGATIONS:
      return "AI Root Cause Investigations";
    case PAGE_IDENTIFIERS.COST_ANALYSIS:
      return "Manufacturing Cost Analysis";
    case PAGE_IDENTIFIERS.PRODUCT_ANALYSIS:
      return "Product SKU Intelligence";
    case PAGE_IDENTIFIERS.COMPONENT_ANALYSIS:
      return "BOM & Component Analysis";
    case PAGE_IDENTIFIERS.PRODUCTION_QUALITY:
      return "Production Throughput & Quality";
    case PAGE_IDENTIFIERS.REPORTS:
      return "Investigation Reports Library";
    case PAGE_IDENTIFIERS.DATA_CONNECTORS:
      return "Enterprise Data Connectors";
    case PAGE_IDENTIFIERS.ARCHITECTURE:
      return "System Architecture & Pipeline";
    default:
      return "Manufacturing Cost Intelligence Platform";
  }
}

/**
 * Returns contextual starter questions tailored to the active page
 */
export function getStarterQuestions(pageId) {
  switch (pageId) {
    case PAGE_IDENTIFIERS.DATA_UPLOAD_STAGE_1:
      return [
        "What file formats and columns are supported for upload?",
        "What is the difference between Upload Store and Global Store?",
        "How does the 3-stage upload and validation workflow work?",
        "What validation checks are performed on uploaded CSVs?",
      ];
    case PAGE_IDENTIFIERS.DATA_UPLOAD_STAGE_2:
      return [
        "What is the validation status of my uploaded dataset?",
        "Are there any quarantined records or missing required columns?",
        "Why can't records be promoted directly without validation?",
        "How do I resolve validation errors in the staging table?",
      ];
    case PAGE_IDENTIFIERS.DATA_UPLOAD_STAGE_3:
      return [
        "Why did manufacturing cost decrease in this upload?",
        "What is the cost per good unit and how did yield affect it?",
        "Is this uploaded dataset already in the Global Store?",
        "What happens if I click Approve & Commit versus leaving it unapproved?",
      ];
    case PAGE_IDENTIFIERS.OVERVIEW:
      return [
        "Why did manufacturing cost increase in November?",
        "Which month had the highest cost per good unit?",
        "Which plant contributes most to total manufacturing cost?",
        "What is the difference between Production and Demo mode?",
      ];
    case PAGE_IDENTIFIERS.AI_INVESTIGATIONS:
      return [
        "How do I structure a root cause investigation?",
        "What are the 18 manufacturing dimensions analyzed?",
        "How does the AI verify user suspected causes against evidence?",
        "Explain the difference between proven facts and hypotheses.",
      ];
    case PAGE_IDENTIFIERS.COST_ANALYSIS:
      return [
        "Explain the Volume, Mix, and Rate variance bridge.",
        "Which cost category (material, labour, machine, energy) had the largest variance?",
        "How is the zero-residual variance calculated?",
        "What is driving the direct cost deviation?",
      ];
    case PAGE_IDENTIFIERS.PRODUCT_ANALYSIS:
      return [
        "Which smartphone model is the most expensive to manufacture?",
        "Why is SPH-PRO-256 cost per unit higher than SPH-A15-256?",
        "What is the yield and good unit output per product model?",
        "How has product mix affected total manufacturing cost?",
      ];
    case PAGE_IDENTIFIERS.COMPONENT_ANALYSIS:
      return [
        "Which component contributes most to total material expenditure?",
        "Are NAND flash and OLED display prices creating purchase price variance?",
        "Is actual material consumption exceeding BOM allowance?",
        "Which supplier has the largest pricing variance?",
      ];
    case PAGE_IDENTIFIERS.PRODUCTION_QUALITY:
      return [
        "Which production line has the highest defect or scrap rate?",
        "What are the primary inspection failure stations (S01-S06)?",
        "What is our overall assembly yield and first pass yield?",
        "How much is scrap and rework costing the plant?",
      ];
    case PAGE_IDENTIFIERS.REPORTS:
      return [
        "Summarize the primary findings and root causes of this report.",
        "What are the highest impact recommended corrective actions?",
        "What was the date coverage and provenance of this investigation?",
        "Explain the mathematical reconciliation in this report.",
      ];
    case PAGE_IDENTIFIERS.DATA_CONNECTORS:
      return [
        "Which enterprise data connectors are currently configured?",
        "How do MES and ERP connectors sync into the Global Store?",
        "How are connector credentials securely masked and encrypted?",
        "How frequently do telemetry ingestion jobs execute?",
      ];
    case PAGE_IDENTIFIERS.ARCHITECTURE:
      return [
        "Explain the end-to-end data pipeline from CSV upload to Global Store.",
        "How does the dual-store isolation guarantee uncommitted upload safety?",
        "What deterministic engines power the cost variance calculations?",
        "How does Domo AI synthesize evidence without inventing numbers?",
      ];
    default:
      return [
        "Why did manufacturing cost decrease in November?",
        "Which products contributed most to the cost movement?",
        "Which production line has the highest rejection rate?",
        "Summarize the most important findings across operations",
      ];
  }
}

/**
 * Builds the comprehensive structured application context object to transmit with every chat message
 */
export function buildApplicationContext({
  pathname = (typeof window !== "undefined" ? window.location?.pathname : ""),
  search = (typeof window !== "undefined" ? window.location?.search : ""),
  sessionId = null,
  reportData = null,
  activeMode = "UPLOAD_SESSION_WITH_GLOBAL_COMPARISON",
}) {
  const pageId = getPageIdFromPath(pathname);
  const pageTitle = getPageTitle(pageId);

  // Extract query parameters
  const searchParams = new URLSearchParams(search || "");
  const qSessionId = searchParams.get("session_id") || searchParams.get("sessionId");
  const qReportId = searchParams.get("report_id") || searchParams.get("reportId");

  // Resolve session ID from URL path, query, props, or persistent storage
  let resolvedSessionId = sessionId;
  const stage2Match = pathname.match(/^\/upload\/validate\/([^/]+)/);
  const stage3Match = pathname.match(/^\/upload\/results\/([^/]+)/);
  if (stage3Match && stage3Match[1]) {
    resolvedSessionId = decodeURIComponent(stage3Match[1]);
  } else if (stage2Match && stage2Match[1]) {
    resolvedSessionId = decodeURIComponent(stage2Match[1]);
  } else if (qSessionId) {
    resolvedSessionId = qSessionId;
  } else if (!resolvedSessionId && typeof window !== "undefined") {
    if (pageId.startsWith("DATA_UPLOAD")) {
      const saved = localStorage.getItem("gwc_active_upload_session") || localStorage.getItem("active_upload_session_id");
      if (saved && saved !== "GLOBAL") resolvedSessionId = saved;
    } else {
      resolvedSessionId = "GLOBAL";
    }
  }

  // Resolve report ID
  let resolvedReportId = qReportId;
  const reportRouteMatch = pathname.match(/^\/(?:investigations\/report|reports)\/([^/]+)/);
  if (reportRouteMatch && reportRouteMatch[1]) {
    resolvedReportId = decodeURIComponent(reportRouteMatch[1]);
  } else if (reportData?.report_id) {
    resolvedReportId = reportData.report_id;
  }

  // Extract page-specific state from apiCache
  let pageState = {};
  try {
    switch (pageId) {
      case PAGE_IDENTIFIERS.OVERVIEW:
        pageState = apiCache.getPageState("overview", {});
        break;
      case PAGE_IDENTIFIERS.COST_ANALYSIS:
        pageState = apiCache.getPageState("cost-analysis", {});
        break;
      case PAGE_IDENTIFIERS.PRODUCT_ANALYSIS:
        pageState = apiCache.getPageState("product-analysis", {});
        break;
      case PAGE_IDENTIFIERS.COMPONENT_ANALYSIS:
        pageState = apiCache.getPageState("component-analysis", {});
        break;
      case PAGE_IDENTIFIERS.PRODUCTION_QUALITY:
        pageState = apiCache.getPageState("production-quality", {});
        break;
      default:
        pageState = {};
    }
  } catch {
    pageState = {};
  }

  // Determine active data store and provenance
  let primaryStore = "GLOBAL_STORE";
  if (pageId === PAGE_IDENTIFIERS.DATA_UPLOAD_STAGE_1) {
    primaryStore = (resolvedSessionId && resolvedSessionId !== "GLOBAL") ? "CURRENT_UPLOAD_STORE" : "NONE_PREPARATION";
  } else if (pageId === PAGE_IDENTIFIERS.DATA_UPLOAD_STAGE_2) {
    primaryStore = "CURRENT_UPLOAD_STORE";
  } else if (pageId === PAGE_IDENTIFIERS.DATA_UPLOAD_STAGE_3) {
    primaryStore = activeMode === "GLOBAL_ONLY" ? "GLOBAL_STORE" : "CURRENT_UPLOAD_STORE_WITH_BASELINE";
  } else if (activeMode === "UPLOAD_SESSION_ONLY") {
    primaryStore = "CURRENT_UPLOAD_STORE";
  } else if (pageId === PAGE_IDENTIFIERS.HOME || pageId === PAGE_IDENTIFIERS.OVERVIEW) {
    primaryStore = "GLOBAL_STORE";
  }

  const dataMode = pageState.dataMode || (typeof window !== "undefined" ? localStorage.getItem("gwc_data_mode") : "PRODUCTION") || "PRODUCTION";
  const reportingPeriod = pageState.selectedPeriod || reportData?.scope?.reporting_period || reportData?.reporting_period || searchParams.get("period") || null;
  const comparePeriod = reportData?.scope?.compare_with || searchParams.get("compare") || null;
  const productCode = pageState.selectedProduct || reportData?.scope?.product_code || searchParams.get("product") || null;
  const plantCode = pageState.selectedPlant || reportData?.scope?.plant_code || searchParams.get("plant") || null;
  const lineCode = pageState.selectedLine || reportData?.scope?.line_code || searchParams.get("line") || null;

  return {
    page_id: pageId,
    page_title: pageTitle,
    pathname: pathname,
    session_id: resolvedSessionId,
    report_id: resolvedReportId,
    primary_store: primaryStore,
    data_mode: dataMode,
    reporting_period: reportingPeriod,
    compare_period: comparePeriod,
    product_code: productCode,
    plant_code: plantCode,
    line_code: lineCode,
    active_filters: {
      ...pageState,
      customStartDate: pageState.customStartDate,
      customEndDate: pageState.customEndDate,
      isCustomMode: pageState.isCustomMode,
    },
    report_metadata: reportData ? {
      title: reportData.title,
      headline: reportData.headline,
      total_cost: reportData.financial_impact?.headline,
      scope: reportData.scope,
    } : null,
  };
}
