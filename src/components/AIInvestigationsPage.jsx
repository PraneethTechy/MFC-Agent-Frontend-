import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Sparkles,
  Calendar,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Layers,
  Box,
  Factory,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Download,
  Bookmark,
  RefreshCw,
  Lightbulb,
  FileText,
  BarChart3,
  Check,
  Target,
  ChevronDown,
  ChevronUp,
  X,
  Info,
  Database,
  HelpCircle,
  SlidersHorizontal,
  RotateCcw,
  DollarSign,
  ClipboardList,
  CheckSquare,
  Eye,
  Building2,
  ClipboardCheck,
} from "lucide-react";
import InvestigationReportView from "./InvestigationReportView";

const PROBLEM_CATEGORIES = [
  "Manufacturing cost increase",
  "Cost per good unit increase",
  "Scrap / rework increase",
  "Quality / rejection increase",
  "Production output decrease",
  "Labour productivity issue",
  "Energy consumption increase",
  "Material consumption / inventory variance",
  "Supplier / procurement issue",
  "Equipment downtime / efficiency issue",
  "Other operational issue",
];

const INVESTIGATION_OBJECTIVES = [
  "Identify root cause and recommend actions",
  "Decompose cost variance drivers",
  "Quantify yield fallout and scrap impact",
  "Verify supplier warranty liability",
  "Assess operational downtime and line efficiency",
  "Evaluate labor productivity losses",
  "General diagnostic inquiry",
];

const KPI_OPTIONS = [
  "Cost per good unit",
  "Total Manufacturing Cost",
  "Display Defect Rate",
  "First Pass Yield (FPY)",
  "Production Output",
  "Purchase Price Variance (PPV)",
  "Overall Equipment Effectiveness (OEE)",
  "Labor Cost per Unit",
  "Other Metric",
];

const FORM_PRESETS = [
  {
    label: "OLED Display Panel Scrap Spike",
    title: "OLED Display Panel Scrap Spike on Line 2",
    category: "Scrap / rework increase",
    description: "OLED display module fallout spiked to 10.40% across 153 inspection runs in Nov 2026, driving scrap spend variance of ₹5.17 Cr over baseline.",
    objective: "Identify root cause of display defects, verify vendor warranty debit liability, and recommend containment actions.",
    kpi: "Display Defect Rate",
    observed: "10.40% fallout",
    target: "< 0.80% fallout",
    financialImpact: "51700000",
    component: "OLED Display Panel 6.7\" (DSP-61)",
    reference: "SUP-104 (OptoTech Display), PO-9812",
    shiftOrDate: "Shift 1 & 2, Nov 13-25, 2026",
    suspectedCause: "Cleanroom bonding temperature fluctuation at vendor OptoTech facility",
    actionsTaken: "Quarantined incoming lot SUP-104-B8, issued initial SCAR notice",
    comments: "Urgent: Line 2 throughput affected",
    product: "PHX-PRO",
    plant: "PLT-01 (Chennai)",
    line: "Line 2",
  },
  {
    label: "Finished Unit Cost Uplift",
    title: "Excess Cost per Good Unit on Flagship Smartphone",
    category: "Cost per good unit increase",
    description: "Good-unit manufacturing cost increased significantly over standard allowance, with yield drop compounding unit conversion overhead.",
    objective: "Decompose unit cost uplift into material scrap, test rework, and line yield penalty across assembly stages.",
    kpi: "Cost Per Good Unit",
    observed: "₹1,842 / unit",
    target: "₹1,520 / unit",
    financialImpact: "32000000",
    component: "Main PCBA & SoC Assembly",
    reference: "Batch LOT-2026-11",
    shiftOrDate: "November 2026 Production",
    suspectedCause: "SMT testing fallout driving repeat secondary test passes",
    actionsTaken: "Conducted preliminary SMT stencil inspection",
    comments: "Reviewing daily tier 2 meeting logs",
    product: "PHX-PRO",
    plant: "All Plants",
    line: "All Lines",
  },
  {
    label: "Assembly Line 3 Rejection Rate",
    title: "Line 3 Final Assembly Rejection Spike",
    category: "Quality / rejection increase",
    description: "Production Line 3 records elevated rejection rates compared to factory benchmark, resulting in testing rework backlog.",
    objective: "Analyze defect taxonomy by station, isolate machine calibration drift, and recommend tooling maintenance.",
    kpi: "First Pass Yield (FPY)",
    observed: "85.9% FPY",
    target: "95.8% FPY",
    financialImpact: "15900000",
    component: "Camera & Sensor Module",
    reference: "Work Order WO-4491",
    shiftOrDate: "Shift 2 & 3",
    suspectedCause: "Optical alignment fixture wear on station QA-03",
    actionsTaken: "Recalibrated laser sensor on station QA-03",
    comments: "Station audit scheduled for Friday",
    product: "All Products",
    plant: "PLT-01 (Chennai)",
    line: "Line 3",
  },
];

import { API_BASE_URL } from "../config/api";

export default function AIInvestigationsPage({
  apiBaseUrl = API_BASE_URL,
  onNavigate,
  onOpenAIChat,
  routeParams = {},
}) {
  // Mode: "GLOBAL" (Authoritative Global Manufacturing Store) | "UPLOAD_SESSION" (Staged Upload Session)
  const [investigationMode, setInvestigationMode] = useState("GLOBAL");

  // Dynamic Scope Metadata fetched from active session or database
  const [scopeMetadata, setScopeMetadata] = useState(null);
  const [loadingMetadata, setLoadingMetadata] = useState(true);

  // SECTION A: Problem Context (Required)
  const [formTitle, setFormTitle] = useState("");
  const [problemCategory, setProblemCategory] = useState("Manufacturing cost increase");
  const [problemDescription, setProblemDescription] = useState("");
  const [objective, setObjective] = useState("Identify root cause and recommend actions");

  // SECTION B: Scope Filters
  const [selectedPeriod, setSelectedPeriod] = useState("ALL");
  const [selectedProduct, setSelectedProduct] = useState("All Products");
  const [selectedPlant, setSelectedPlant] = useState("All Plants");
  const [selectedLine, setSelectedLine] = useState("All Lines");

  // SECTION C: Observed Impact (Optional)
  const [observedKpi, setObservedKpi] = useState("Cost per good unit");
  const [observedValue, setObservedValue] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [financialImpact, setFinancialImpact] = useState("");
  const [affectedComponent, setAffectedComponent] = useState("");
  const [operationalReference, setOperationalReference] = useState("");
  const [shiftOrDate, setShiftOrDate] = useState("");

  // SECTION D: Additional Context (Optional)
  const [additionalInfo, setAdditionalInfo] = useState("");

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Validation errors map
  const [validationErrors, setValidationErrors] = useState({});

  // Investigation execution states
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [investigationError, setInvestigationError] = useState(null);

  // Active investigation report view (null = form view, object = report view)
  const [activeReport, setActiveReport] = useState(null);

  // Saved indicator feedback for "Save" button
  const [isSaved, setIsSaved] = useState(false);
  const [presetNotice, setPresetNotice] = useState(null);

  // Active session ID state
  const activeSessionId = useMemo(() => {
    if (investigationMode === "GLOBAL") return "GLOBAL";
    return (
      routeParams?.session_id ||
      routeParams?.staged_batch_id ||
      localStorage.getItem("active_upload_session_id") ||
      scopeMetadata?.session_id ||
      ""
    );
  }, [investigationMode, routeParams?.session_id, routeParams?.staged_batch_id, scopeMetadata?.session_id]);

  // 1. Fetch dynamic scope metadata (dimensions, dependent lines, active dataset status)
  const fetchScopeMetadata = async (mode = investigationMode) => {
    try {
      setLoadingMetadata(true);
      const targetSid =
        mode === "GLOBAL"
          ? "GLOBAL"
          : (routeParams?.session_id ||
             routeParams?.staged_batch_id ||
             localStorage.getItem("active_upload_session_id") ||
             "");
      const url = `${apiBaseUrl}/investigation/scope-metadata${
        targetSid ? `?session_id=${encodeURIComponent(targetSid)}` : ""
      }`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setScopeMetadata(data);

        // Pre-select "ALL" (All Available Periods) or preserve existing valid period selection
        if (data?.dimensions?.periods?.[0]?.id) {
          setSelectedPeriod((prev) => {
            if (prev && data.dimensions.periods.some((p) => p.id === prev)) {
              return prev;
            }
            return data.dimensions.periods[0].id;
          });
        }
      }
    } catch (err) {
      console.warn("Failed to fetch investigation scope metadata:", err);
    } finally {
      setLoadingMetadata(false);
    }
  };

  const handleModeChange = (newMode) => {
    setInvestigationMode(newMode);
    fetchScopeMetadata(newMode);
  };

  useEffect(() => {
    fetchScopeMetadata();
  }, [apiBaseUrl, routeParams?.session_id, routeParams?.staged_batch_id]);

  // Pre-fill form from incoming routeParams (e.g. from Product Comparison)
  useEffect(() => {
    if (routeParams?.title) {
      setFormTitle(routeParams.title);
    }
    if (routeParams?.description) {
      setProblemDescription(routeParams.description);
    } else if (routeParams?.question) {
      setProblemDescription(routeParams.question);
    }
    if (routeParams?.problemCategory || routeParams?.problem_category) {
      setProblemCategory(routeParams.problemCategory || routeParams.problem_category);
    }
    if (routeParams?.product && routeParams.product !== "All Products") {
      setSelectedProduct(routeParams.product);
    }
  }, [routeParams]);

  // Dynamic filter options based on backend metadata
  const periodOptions = useMemo(() => {
    return (
      scopeMetadata?.dimensions?.periods || [
        { id: "ALL", label: "All Available Periods" },
      ]
    );
  }, [scopeMetadata]);

  const productOptions = useMemo(() => {
    return scopeMetadata?.dimensions?.products || [
      { id: "All Products", label: "All Products" },
    ];
  }, [scopeMetadata]);

  const plantOptions = useMemo(() => {
    return scopeMetadata?.dimensions?.plants || [
      { id: "All Plants", label: "All Plants" },
    ];
  }, [scopeMetadata]);

  // Dependent Production Line options: filter lines by selected plant
  const lineOptions = useMemo(() => {
    const allLines = scopeMetadata?.dimensions?.lines || [
      { id: "All Lines", label: "All Lines" },
    ];
    if (selectedPlant === "All Plants" || !scopeMetadata?.dimensions?.plant_lines_map) {
      return allLines;
    }
    const allowed = scopeMetadata.dimensions.plant_lines_map[selectedPlant] || [];
    const filtered = allLines.filter(
      (l) => l.id === "All Lines" || allowed.includes(l.id)
    );
    return filtered.length > 1 ? filtered : allLines;
  }, [selectedPlant, scopeMetadata]);

  // Dynamic component options from scope metadata or default BOM catalog
  const componentOptions = useMemo(() => {
    return (
      scopeMetadata?.dimensions?.components || [
        { id: "ALL", label: "Select component or material" },
        { id: "MAT-DSP-005", label: "OLED Display Panel 6.7\" (DSP-61 / MAT-DSP-005)" },
        { id: "MAT-SOC-001", label: "Main SoC & Processor (MAT-SOC-001)" },
        { id: "MAT-CAM-007", label: "Quad Camera Module Primary (MAT-CAM-007)" },
        { id: "MAT-CAM-008", label: "Front Camera Sensor (MAT-CAM-008)" },
        { id: "MAT-BAT-006", label: "Lithium-Ion Battery 5000mAh (MAT-BAT-006)" },
        { id: "MAT-PCB-004", label: "Multi-Layer Main PCBA (MAT-PCB-004)" },
        { id: "MAT-HSG-009", label: "CNC Aluminum Enclosure (MAT-HSG-009)" },
        { id: "MAT-GLS-010", label: "Gorilla Glass Front Shield (MAT-GLS-010)" },
        { id: "MAT-ANT-012", label: "5G Sub-6 Antenna Array (MAT-ANT-012)" },
        { id: "MAT-NAND-003", label: "UFS 4.0 Storage Flash 256GB (MAT-NAND-003)" },
        { id: "MAT-MEM-002", label: "LPDDR5X RAM Module 12GB (MAT-MEM-002)" },
      ]
    );
  }, [scopeMetadata]);

  // Dynamic unit badge based on selected KPI
  const selectedUnit = useMemo(() => {
    const k = (observedKpi || "").toLowerCase();
    if (k.includes("rate") || k.includes("yield") || k.includes("oee") || k.includes("%")) {
      return "%";
    }
    if (k.includes("output") || k.includes("units")) {
      return "Units";
    }
    return "INR";
  }, [observedKpi]);

  const handlePlantChange = (newPlant) => {
    setSelectedPlant(newPlant);
    if (newPlant !== "All Plants" && scopeMetadata?.dimensions?.plant_lines_map) {
      const allowed = scopeMetadata.dimensions.plant_lines_map[newPlant] || [];
      if (selectedLine !== "All Lines" && !allowed.includes(selectedLine)) {
        setSelectedLine("All Lines");
      }
    }
  };

  // Pre-fill form from preset scenario
  const handleApplyPreset = (preset) => {
    setFormTitle(preset.title);
    setProblemCategory(preset.category);
    setProblemDescription(preset.description);
    setObjective(preset.objective);
    setObservedKpi(preset.kpi);
    setObservedValue(preset.observed);
    setTargetValue(preset.target);
    setFinancialImpact(preset.financialImpact);
    setAffectedComponent(preset.component);
    setOperationalReference(preset.reference);
    setShiftOrDate(preset.shiftOrDate);
    setAdditionalInfo(preset.additionalInfo || preset.suspectedCause || preset.comments || "");
    if (preset.product) setSelectedProduct(preset.product);
    if (preset.plant) setSelectedPlant(preset.plant);
    if (preset.line) setSelectedLine(preset.line);
    setValidationErrors({});
    setPresetNotice(`Loaded scenario: "${preset.label}"`);
    setTimeout(() => setPresetNotice(null), 4000);
  };

  // Reset all form fields
  const handleResetForm = () => {
    setFormTitle("");
    setProblemCategory("Manufacturing cost increase");
    setProblemDescription("");
    setObjective("Identify root cause and recommend actions");
    setObservedKpi("Cost per good unit");
    setObservedValue("");
    setTargetValue("");
    setFinancialImpact("");
    setAffectedComponent("");
    setOperationalReference("");
    setShiftOrDate("");
    setAdditionalInfo("");
    setValidationErrors({});
    setInvestigationError(null);
    setShowReviewModal(false);
  };

  // Validate required fields
  const validateForm = () => {
    const errors = {};
    if (!formTitle.trim()) {
      errors.formTitle = "Investigation title is required";
    }
    if (!problemCategory.trim()) {
      errors.problemCategory = "Please select a problem category";
    }
    if (!problemDescription.trim()) {
      errors.problemDescription = "Problem description is required (what happened, where, and concern)";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open review modal after validation
  const handleOpenReviewModal = () => {
    if (!validateForm()) {
      const firstErrorKey = Object.keys(validationErrors)[0] || "formTitle";
      const el = document.getElementById(firstErrorKey);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setShowReviewModal(true);
  };

  // Execute investigation via backend endpoint
  const handleExecuteInvestigation = async (parentReportId = null) => {
    if (!validateForm()) {
      const firstErrorKey = Object.keys(validationErrors)[0] || "formTitle";
      const el = document.getElementById(firstErrorKey);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (isInvestigating) return;

    setIsInvestigating(true);
    setInvestigationError(null);
    setIsSaved(false);

    try {
      const finNum = financialImpact ? parseFloat(financialImpact.replace(/[^0-9.-]+/g, "")) : null;

      const payload = {
        title: formTitle.trim(),
        problem_category: problemCategory,
        problem_description: problemDescription.trim(),
        objective: null,
        reporting_period: selectedPeriod,
        product_code: selectedProduct,
        plant_code: selectedPlant,
        line_code: selectedLine,
        mode: investigationMode,
        session_id: investigationMode === "GLOBAL" ? "GLOBAL" : activeSessionId,
        data_origin: investigationMode === "GLOBAL" ? "REAL_COMMITTED_STORE" : (scopeMetadata?.data_origin || "SYNTHETIC_TEST"),
        parent_report_id: parentReportId || null,
        observed_kpi: observedKpi.trim() || null,
        observed_value: observedValue.trim() || null,
        target_value: targetValue.trim() || null,
        financial_impact_inr: isNaN(finNum) ? null : finNum,
        affected_component: affectedComponent.trim() || null,
        operational_reference: operationalReference.trim() || null,
        shift_or_date: shiftOrDate.trim() || null,
        suspected_cause: additionalInfo.trim() || null,
        actions_already_taken: null,
        additional_comments: additionalInfo.trim() || null,
      };

      const res = await fetch(`${apiBaseUrl}/investigation/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.detail || `Investigation request failed: HTTP ${res.status}`);
      }

      const reportData = await res.json();
      setActiveReport(reportData);
    } catch (err) {
      console.error("AI Investigation Error:", err);
      setInvestigationError(err.message || "Failed to complete AI investigation.");
    } finally {
      setIsInvestigating(false);
    }
  };

  // Download investigation report as markdown file
  const handleDownloadReport = () => {
    if (!activeReport) return;

    const drilldownLines = (activeReport.drilldowns || []).length > 0
      ? activeReport.drilldowns.map((d) => `| ${d.dimension || ""} | ${d.value || ""} | ${d.secondary || ""} | ${d.tag || ""} |`).join("\n")
      : "_No drilldown items available._";

    const drilldownTable = (activeReport.drilldowns || []).length > 0
      ? `| Dimension | Value | Secondary | Status |\n|:---|:---|:---|:---|\n${drilldownLines}`
      : "_No drilldown items available._";

    const content = `# MANUFACTURING INVESTIGATION REPORT
# ${activeReport.title}

- **Report ID:** \`${activeReport.report_id}\`
- **Problem Category:** ${activeReport.problem_category || "Manufacturing Analytics"}
- **Reporting Period:** ${activeReport.reporting_period}
- **Scope:** ${activeReport.scope_label}
- **Status:** ${activeReport.status}
- **Generated At:** ${activeReport.generated_at}
- **Data Origin:** ${activeReport.data_origin} (${activeReport.is_synthetic ? "Synthetic Test Session" : "Authoritative Production Store"})

---

## MANUFACTURER PROBLEM CONTEXT
- **Description:** ${activeReport.problem_description || "N/A"}
- **Objective:** ${activeReport.objective || "N/A"}
${activeReport.observed_impact ? `
### Observed Telemetry:
- **KPI:** ${activeReport.observed_impact.kpi || "N/A"}
- **Observed Value:** ${activeReport.observed_impact.observed_value || "N/A"}
- **Expected Target:** ${activeReport.observed_impact.target_value || "N/A"}
- **Financial Impact (INR):** ${activeReport.observed_impact.financial_impact_inr ? `₹${(activeReport.observed_impact.financial_impact_inr / 1e7).toFixed(2)} Cr` : "N/A"}
- **Component:** ${activeReport.observed_impact.affected_component || "N/A"}
- **Reference:** ${activeReport.observed_impact.operational_reference || "N/A"}
` : ""}
${activeReport.user_context ? `
### User-Supplied Hypotheses (Unverified):
- **Suspected Cause:** ${activeReport.user_context.suspected_cause || "None"}
- **Actions Taken:** ${activeReport.user_context.actions_already_taken || "None"}
` : ""}

---

## 1. EXECUTIVE SUMMARY
${activeReport.executive_summary}

---

## 2. DETAILED FINDINGS
${(activeReport.detailed_findings || []).map((f) => `### ${f.index || "•"} ${f.title} [${f.evidence_classification || f.impact || "PROVEN"}]\n${f.narrative || f.explanation || ""}\n`).join("\n")}

---

## 3. EVIDENCE SUMMARY
${(activeReport.evidence || []).map((e) => `- ${e}`).join("\n")}

---

## 4. WHAT WE CANNOT CONCLUDE YET
${(activeReport.what_we_cannot_conclude_yet || []).map((l) => `- ${l}`).join("\n")}

---

## 5. RECOMMENDED ACTIONS
${(activeReport.recommended_actions || []).map((a, i) => `${i + 1}. **${a.action || a.title || ""}** (Owner: ${a.owner || "Operations Team"}, Urgency: ${a.urgency || "Medium"})`).join("\n")}

---
*Report generated by GWC DATA.AI Manufacturing Intelligence Platform*
`;

    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Investigation_Report_${activeReport.report_id}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle Save button
  const handleSaveReport = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="w-full flex-1 flex flex-col space-y-4 select-none pb-8 font-sans text-slate-800 bg-white min-h-[calc(100vh-80px)]">
      {/* =========================================================================
          VIEW A: STRUCTURED NEW INVESTIGATION WORKSPACE
          ========================================================================= */}
      {!activeReport && (
        <div className="w-full space-y-4 animate-in fade-in duration-150">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7c3aed] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 stroke-[2.2]" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  AI Investigations
                </h1>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-500 font-medium pl-10.5">
                Investigate manufacturing costs, production performance and quality issues using evidence-backed AI analysis.
              </p>
            </div>

            {/* Direct Header Action: View Reports History in Reports Page */}
            <div className="flex items-center gap-2 self-start sm:self-auto pl-10.5 sm:pl-0">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate("reports")}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7c3aed] text-xs font-bold border border-purple-200/80 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-98"
                title="View All Persisted Investigation Reports in Unified Reports Centre"
              >
                <Clock className="w-3.5 h-3.5 stroke-[2.2]" />
                <span>View Reports History</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {investigationError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <div className="flex-1">
                <strong className="font-bold">Investigation Error: </strong>
                {investigationError}
              </div>
              <button
                type="button"
                onClick={() => setInvestigationError(null)}
                className="text-rose-500 hover:text-rose-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* =========================================================================
              INVESTIGATION SCOPE (FILTERS) — AT THE TOP
              ========================================================================= */}
          <div className="w-full bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3.5">
            {/* Header Line */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <SlidersHorizontal className="w-4.5 h-4.5 text-[#7c3aed] stroke-[2.2] shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                    Investigation Scope (Filters)
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Define the data scope for this investigation.
                  </p>
                </div>
              </div>

              {/* Store Selector (Radio buttons matching reference image) */}
              <div className="flex items-center gap-4 text-xs font-semibold select-none self-start sm:self-auto">
                <label
                  onClick={() => handleModeChange("GLOBAL")}
                  className="flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                      investigationMode === "GLOBAL"
                        ? "border-emerald-600 bg-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {investigationMode === "GLOBAL" && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    )}
                  </span>
                  <span className={investigationMode === "GLOBAL" ? "font-bold text-slate-900" : "text-slate-600"}>
                    Global Store
                  </span>
                </label>

                <label
                  onClick={() => handleModeChange("UPLOAD_SESSION")}
                  className="flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                      investigationMode === "UPLOAD_SESSION"
                        ? "border-[#7c3aed] bg-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {investigationMode === "UPLOAD_SESSION" && (
                      <span className="w-2 h-2 rounded-full bg-[#7c3aed]" />
                    )}
                  </span>
                  <span className={investigationMode === "UPLOAD_SESSION" ? "font-bold text-slate-900" : "text-slate-600"}>
                    Current Dataset
                  </span>
                </label>
              </div>
            </div>

            {/* 4-column Dropdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
              {/* Filter 1: Reporting Period */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Reporting Period <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full h-11 pl-10 pr-8 bg-white border border-slate-200/90 rounded-xl text-xs sm:text-[13px] font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/25 focus:border-[#7c3aed] cursor-pointer appearance-none truncate shadow-2xs"
                  >
                    {periodOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Filter 2: Product */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Product <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Box className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full h-11 pl-10 pr-8 bg-white border border-slate-200/90 rounded-xl text-xs sm:text-[13px] font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/25 focus:border-[#7c3aed] cursor-pointer appearance-none truncate shadow-2xs"
                  >
                    {productOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Filter 3: Plant */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Plant <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={selectedPlant}
                    onChange={(e) => handlePlantChange(e.target.value)}
                    className="w-full h-11 pl-10 pr-8 bg-white border border-slate-200/90 rounded-xl text-xs sm:text-[13px] font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/25 focus:border-[#7c3aed] cursor-pointer appearance-none truncate shadow-2xs"
                  >
                    {plantOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Filter 4: Production Line */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Production Line <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Layers className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={selectedLine}
                    onChange={(e) => setSelectedLine(e.target.value)}
                    className="w-full h-11 pl-10 pr-8 bg-white border border-slate-200/90 rounded-xl text-xs sm:text-[13px] font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/25 focus:border-[#7c3aed] cursor-pointer appearance-none truncate shadow-2xs"
                  >
                    {lineOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              CARD 1: 1 DESCRIBE THE INVESTIGATION
              ========================================================================= */}
          <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#7c3aed] text-white text-xs font-black flex items-center justify-center shrink-0">
                1
              </span>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Describe the Investigation
              </h2>
            </div>

            {/* Row 1: 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Field 1: Title */}
              <div className="space-y-1.5">
                <label htmlFor="formTitle" className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Investigation Title <strong className="text-rose-600">*</strong></span>
                  {validationErrors.formTitle && (
                    <span className="text-rose-600 font-medium text-[11px]">{validationErrors.formTitle}</span>
                  )}
                </label>
                <input
                  id="formTitle"
                  type="text"
                  value={formTitle}
                  onChange={(e) => {
                    setFormTitle(e.target.value);
                    if (validationErrors.formTitle) setValidationErrors((prev) => ({ ...prev, formTitle: null }));
                  }}
                  placeholder="e.g. Higher manufacturing cost in Line 2"
                  className={`w-full h-11 px-3.5 bg-slate-50/50 hover:bg-white focus:bg-white border rounded-xl text-xs sm:text-[13px] font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all ${
                    validationErrors.formTitle
                      ? "border-rose-400 ring-2 ring-rose-100"
                      : "border-slate-200/90 focus:ring-2 focus:ring-[#7c3aed]/25 focus:border-[#7c3aed]"
                  }`}
                />
              </div>

              {/* Field 2: Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Investigation Category <strong className="text-rose-600">*</strong>
                </label>
                <div className="relative">
                  <select
                    value={problemCategory}
                    onChange={(e) => setProblemCategory(e.target.value)}
                    className="w-full h-11 px-3.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200/90 rounded-xl text-xs sm:text-[13px] font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/25 focus:border-[#7c3aed] cursor-pointer appearance-none truncate pr-8"
                  >
                    {PROBLEM_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Row 2: Problem Description */}
            <div className="space-y-1.5">
              <label htmlFor="problemDescription" className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Problem Description <strong className="text-rose-600">*</strong></span>
                {validationErrors.problemDescription && (
                  <span className="text-rose-600 font-medium text-[11px]">{validationErrors.problemDescription}</span>
                )}
              </label>
              <div className="relative">
                <textarea
                  id="problemDescription"
                  value={problemDescription}
                  onChange={(e) => {
                    setProblemDescription(e.target.value.slice(0, 500));
                    if (validationErrors.problemDescription) setValidationErrors((prev) => ({ ...prev, problemDescription: null }));
                  }}
                  rows={3}
                  maxLength={500}
                  placeholder="Describe what happened, where it occurred, and when you noticed it (e.g. cost increased by 12% in Line 2 during Sep 2026)"
                  className={`w-full p-3.5 pb-6 text-xs sm:text-[13px] bg-slate-50/50 hover:bg-white focus:bg-white border rounded-xl font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all resize-none leading-relaxed ${
                    validationErrors.problemDescription
                      ? "border-rose-400 ring-2 ring-rose-100"
                      : "border-slate-200/90 focus:ring-2 focus:ring-[#7c3aed]/25 focus:border-[#7c3aed]"
                  }`}
                />
                <span className="absolute right-3 bottom-2 text-[10.5px] font-semibold text-slate-400 pointer-events-none">
                  {problemDescription.length}/500
                </span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              CARD 2: 2 OBSERVED IMPACT (OPTIONAL)
              ========================================================================= */}
          <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#7c3aed] text-white text-xs font-black flex items-center justify-center shrink-0">
                2
              </span>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Observed Impact
              </h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-[#7c3aed] border border-purple-200/70">
                Optional
              </span>
            </div>

            {/* Row 1: 4 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* KPI */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Key Performance Indicator (KPI)
                </label>
                <div className="relative">
                  <select
                    value={observedKpi}
                    onChange={(e) => setObservedKpi(e.target.value)}
                    className="w-full h-11 px-3.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200/90 rounded-xl text-xs sm:text-[13px] font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/25 focus:border-[#7c3aed] cursor-pointer appearance-none truncate pr-8"
                  >
                    {KPI_OPTIONS.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Observed Value */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Observed Value
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={observedValue}
                    onChange={(e) => setObservedValue(e.target.value)}
                    placeholder="₹17,228"
                    className="w-full h-11 pl-3.5 pr-12 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200/90 rounded-xl text-xs sm:text-[13px] font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/25 focus:border-[#7c3aed]"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 pointer-events-none">
                    {selectedUnit}
                  </span>
                </div>
              </div>

              {/* Expected / Target Value */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Expected / Target Value
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    placeholder="₹15,730"
                    className="w-full h-11 pl-3.5 pr-12 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200/90 rounded-xl text-xs sm:text-[13px] font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/25 focus:border-[#7c3aed]"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 pointer-events-none">
                    {selectedUnit}
                  </span>
                </div>
              </div>

              {/* Estimated Financial Impact */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Estimated Financial Impact
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={financialImpact}
                    onChange={(e) => setFinancialImpact(e.target.value)}
                    placeholder="₹1.50 Cr"
                    className="w-full h-11 pl-3.5 pr-12 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200/90 rounded-xl text-xs sm:text-[13px] font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/25 focus:border-[#7c3aed]"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 pointer-events-none">
                    INR
                  </span>
                </div>
              </div>
            </div>

            {/* Row 2: 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Affected Component / Material */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Affected Component / Material
                </label>
                <div className="relative">
                  <select
                    value={affectedComponent}
                    onChange={(e) => setAffectedComponent(e.target.value)}
                    className="w-full h-11 px-3.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200/90 rounded-xl text-xs sm:text-[13px] font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/25 focus:border-[#7c3aed] cursor-pointer appearance-none truncate pr-8"
                  >
                    <option value="">Select component or material</option>
                    {componentOptions.map((c) => (
                      <option key={c.id} value={c.label}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Supplier / Batch Reference */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Supplier / Batch Reference
                </label>
                <input
                  type="text"
                  value={operationalReference}
                  onChange={(e) => setOperationalReference(e.target.value)}
                  placeholder="e.g. SUP-1023, BATCH-4587 (optional)"
                  className="w-full h-11 px-3.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200/90 rounded-xl text-xs sm:text-[13px] font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/25 focus:border-[#7c3aed]"
                />
              </div>
            </div>
          </div>

          {/* =========================================================================
              CARD 3: 3 ADDITIONAL CONTEXT (OPTIONAL)
              ========================================================================= */}
          <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#7c3aed] text-white text-xs font-black flex items-center justify-center shrink-0">
                3
              </span>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Additional Context
              </h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-[#7c3aed] border border-purple-200/70">
                Optional
              </span>
            </div>

            {/* Single Textarea Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Additional Information
              </label>
              <div className="relative">
                <textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value.slice(0, 500))}
                  rows={3}
                  maxLength={500}
                  placeholder="e.g. Higher material price, machine downtime, quality variation, adjustments made, or vendor notes..."
                  className="w-full p-3.5 pb-6 text-xs sm:text-[13px] bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200/90 rounded-xl font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/25 focus:border-[#7c3aed] resize-none leading-relaxed transition-all"
                />
                <span className="absolute right-3 bottom-2 text-[10.5px] font-semibold text-slate-400 pointer-events-none">
                  {additionalInfo.length}/500
                </span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              BOTTOM NOTICE & ACTION BAR
              ========================================================================= */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium px-1">
              <Info className="w-4 h-4 text-purple-600 shrink-0" />
              <span>
                You can leave optional fields blank. The agent will analyse relevant data, identify key drivers and provide actionable recommendations.
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {/* Primary Run AI Investigation Button */}
              <button
                type="button"
                onClick={() => handleExecuteInvestigation()}
                disabled={isInvestigating}
                className="h-11 px-6 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs sm:text-[13.5px] font-bold shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed flex items-center gap-2 active:scale-98"
              >
                {isInvestigating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Investigating with AI &amp; Telemetry...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 stroke-[2.2]" />
                    <span>Run AI Investigation</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>

              {/* Clear Form Button */}
              <button
                type="button"
                onClick={handleResetForm}
                disabled={isInvestigating}
                className="h-11 px-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs sm:text-[13px] font-bold transition-all cursor-pointer flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5 stroke-[2.2]" />
                <span>Clear Form</span>
              </button>

              {/* Review Investigation Button */}
              <button
                type="button"
                onClick={handleOpenReviewModal}
                disabled={isInvestigating}
                className="h-11 px-5 rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100 text-[#7c3aed] text-xs sm:text-[13px] font-bold transition-all cursor-pointer flex items-center gap-2 ml-auto sm:ml-0"
              >
                <ClipboardCheck className="w-4 h-4 stroke-[2.2]" />
                <span>Review Investigation</span>
              </button>
            </div>
          </div>

          {/* =========================================================================
              REVIEW INVESTIGATION MODAL
              ========================================================================= */}
          {showReviewModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
              <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7c3aed] flex items-center justify-center font-bold">
                      <ClipboardCheck className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">Review Investigation Parameters</h3>
                      <p className="text-xs text-slate-500 font-medium">Verify your problem details, telemetry values and scope filters before running AI analysis.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scope Grid */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Scope &amp; Data Source</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div><span className="text-slate-400 block text-[10px] font-bold">PERIOD</span><span className="font-semibold text-slate-800">{periodOptions.find(p => p.id === selectedPeriod)?.label || selectedPeriod}</span></div>
                    <div><span className="text-slate-400 block text-[10px] font-bold">PRODUCT</span><span className="font-semibold text-slate-800">{selectedProduct}</span></div>
                    <div><span className="text-slate-400 block text-[10px] font-bold">PLANT</span><span className="font-semibold text-slate-800">{selectedPlant}</span></div>
                    <div><span className="text-slate-400 block text-[10px] font-bold">LINE</span><span className="font-semibold text-slate-800">{selectedLine}</span></div>
                  </div>
                  <div className="pt-1 text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${investigationMode === "GLOBAL" ? "bg-emerald-500" : "bg-[#7c3aed]"}`} />
                    <span>Data Source: <strong>{investigationMode === "GLOBAL" ? "Global Store (Committed Facts)" : "Current Dataset"}</strong></span>
                  </div>
                </div>

                {/* Problem Details */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Problem Context</span>
                  <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2 text-xs">
                    <div><span className="text-slate-400 block text-[10px] font-bold">INVESTIGATION TITLE</span><p className="font-bold text-slate-900">{formTitle}</p></div>
                    <div><span className="text-slate-400 block text-[10px] font-bold">CATEGORY</span><span className="font-semibold text-purple-900">{problemCategory}</span></div>
                    <div><span className="text-slate-400 block text-[10px] font-bold">DESCRIPTION</span><p className="text-slate-700 font-medium leading-relaxed">{problemDescription}</p></div>
                  </div>
                </div>

                {/* Observed Impact (if filled) */}
                {(observedValue || targetValue || financialImpact || affectedComponent || operationalReference) && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Observed Telemetry</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                      {observedKpi && <div><span className="text-slate-400 block text-[10px] font-bold">KPI</span><span className="font-semibold text-slate-800">{observedKpi}</span></div>}
                      {observedValue && <div><span className="text-slate-400 block text-[10px] font-bold">OBSERVED</span><span className="font-bold text-rose-700">{observedValue} {selectedUnit}</span></div>}
                      {targetValue && <div><span className="text-slate-400 block text-[10px] font-bold">TARGET</span><span className="font-semibold text-emerald-700">{targetValue} {selectedUnit}</span></div>}
                      {financialImpact && <div><span className="text-slate-400 block text-[10px] font-bold">EST. IMPACT</span><span className="font-bold text-purple-900">₹{financialImpact}</span></div>}
                      {affectedComponent && <div><span className="text-slate-400 block text-[10px] font-bold">COMPONENT</span><span className="font-semibold text-slate-800">{affectedComponent}</span></div>}
                      {operationalReference && <div><span className="text-slate-400 block text-[10px] font-bold">REFERENCE</span><span className="font-semibold text-slate-800">{operationalReference}</span></div>}
                    </div>
                  </div>
                )}

                {/* Additional Information (if filled) */}
                {additionalInfo && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Additional Information</span>
                    <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-xs text-slate-800">
                      <p className="font-medium whitespace-pre-wrap">{additionalInfo}</p>
                    </div>
                  </div>
                )}

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
                  >
                    ← Back to Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewModal(false);
                      handleExecuteInvestigation();
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-2 active:scale-98"
                  >
                    <Sparkles className="w-4 h-4 stroke-[2.2]" />
                    <span>Confirm &amp; Run Investigation</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW B: INVESTIGATION RESPONSE REPORT
          ========================================================================= */}
      {activeReport && (
        <div className="w-full space-y-6 animate-in fade-in duration-200">
          <InvestigationReportView
            report={activeReport}
            onBack={() => setActiveReport(null)}
            onNavigate={onNavigate}
            onDownload={handleDownloadReport}
            onRerun={() => handleExecuteInvestigation()}
            isInvestigating={isInvestigating}
            isSaved={isSaved}
          />
        </div>
      )}
    </div>
  );
}
