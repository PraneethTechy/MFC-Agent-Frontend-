import React, { useState } from "react";
import {
  UploadCloud,
  BarChart3,
  Scale,
  Search,
  Target,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  Database,
  Workflow,
  FileText,
  Boxes,
  Coins,
  Activity,
  GitCompare,
  TrendingDown,
  Compass,
  Check,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";

// =========================================================================
// FIVE CANONICAL STAGES OF THE MANUFACTURING AI AGENT JOURNEY
// =========================================================================
export const AGENT_STAGES = [
  {
    step: "01",
    id: "data-ingestion",
    stageNumber: "STAGE 01",
    stageOf: "STAGE 01 OF 05",
    title: "Data Ingestion",
    shortTitle: "Ingestion",
    category: "Data Integrity & Staging",
    keyCapability: "SHA-256 Batch Hashing",
    icon: UploadCloud,
    tagline: "Securely ingests, audits, and prepares manufacturing records into a verified staging layer.",
    narrativeTitle: "Ingesting & Verifying Multi-Source Factory Data",
    narrative:
      "The agent begins by securely ingesting raw manufacturing data packages from ERP systems, shopfloor MES counters, and quality stations. Before any financial calculations occur, the agent cryptographically audits every record, validates schemas, verifies column mappings, and flags uncosted operational shifts to ensure zero corrupt data enters downstream analysis.",
    activities: [
      {
        icon: Database,
        title: "Multi-Source Dataset Identification",
        description:
          "Identifies and categorizes incoming manufacturing datasets: line cost batches, hourly MES telemetry, engineering BOMs, and quality defect logs.",
      },
      {
        icon: ShieldCheck,
        title: "File & Schema Integrity Validation",
        description:
          "Performs multi-pass validation checking column headers, data types, null boundaries, and foreign key relationships with zero silent assumptions.",
      },
      {
        icon: CheckCircle2,
        title: "Data Quality & Cleanliness Auditing",
        description:
          "Computes SHA-256 batch checksums, audits currency ranges, standardizes calendar timestamps, and isolates corrupt or malformed rows.",
      },
      {
        icon: Boxes,
        title: "Staged Investigation Preparation",
        description:
          "Stages verified records inside an isolated session store, keeping experimental or monthly uploads strictly separated from enterprise baseline facts.",
      },
    ],
    deterministicProcessing: {
      title: "Deterministic Engine (Python & SQL)",
      description:
        "FastAPI multipart streaming ingestion, Pandas vectorized type coercion, cryptographic SHA-256 checksums, and strict relational foreign key verification.",
      techPills: ["FastAPI Ingest", "Pandas Validation", "SHA-256 Hashing", "SQLite Staging"],
    },
    aiIntelligence: {
      title: "AI Context & Intent Resolution (Domo AI Services)",
      description:
        "Extracts manufacturing entities (plants, production lines, product codes) from user queries, maps analytical intent, and identifies data boundaries.",
      techPills: ["Domo AI Services", "Entity Extraction", "Intent Mapping", "Scope Resolver"],
    },
    outputs: [
      {
        title: "Verified Transaction Matrix",
        desc: "Staged records with certified schema and row-level lineage.",
      },
      {
        title: "Data Quality & Coverage Profile",
        desc: "Itemized audit report disclosing costed vs uncosted production runs.",
      },
      {
        title: "Cryptographic Provenance Token",
        desc: "Unique ingestion fingerprint linking dataset to permanent report lineage.",
      },
    ],
    handoff: {
      headline: "How This Fuels Stage 02 — Manufacturing Analysis",
      text: "Cleaned, cryptographically verified transactional records are handed off to the Manufacturing Analysis stage, ensuring core financial and operational KPI calculations execute on reliable, zero-corrupt data.",
      nextTitle: "Stage 02 — Manufacturing Analysis",
    },
    disclosures: [
      "Direct costs are captured from committed batches; enterprise overhead allocations remain excluded if unlogged.",
      "Hourly production runs without direct cost records are flagged as uncosted operational runs.",
    ],
  },
  {
    step: "02",
    id: "manufacturing-analysis",
    stageNumber: "STAGE 02",
    stageOf: "STAGE 02 OF 05",
    title: "Manufacturing Analysis",
    shortTitle: "Analysis",
    category: "Performance Metrics",
    keyCapability: "Zero-Residual Calculations",
    icon: BarChart3,
    tagline: "Computes deterministic cost allocations, unit economics, output volumes, and quality yield.",
    narrativeTitle: "Calculating Operational & Financial Performance Metrics",
    narrative:
      "Once data is verified, the agent executes rigorous mathematical calculations to determine total manufacturing expenditure, cost per good unit, and assembly yield. By aggregating shopfloor logs and cost ledgers, it builds a complete financial and operational baseline across all plants, product models, and production lines.",
    activities: [
      {
        icon: Coins,
        title: "Direct Expenditure Decomposition",
        description:
          "Deterministically aggregates total spend across five core cost elements: Direct Material, Labor, Machine, Energy, and Scrap with zero arithmetic residual.",
      },
      {
        icon: Activity,
        title: "Unit Cost Economics Calculation",
        description:
          "Computes cost per gross produced unit and cost per good unit by dividing direct expenditures by verified salable shopfloor output.",
      },
      {
        icon: Boxes,
        title: "Component & Material Consumption",
        description:
          "Evaluates component-level material usage, correlating Bill of Materials requirements against actual factory floor consumption ledgers.",
      },
      {
        icon: CheckCircle2,
        title: "Production Output & Assembly Yield",
        description:
          "Reconciles gross produced units against good units from MES counters to calculate first-pass assembly yield and line scrap rejection rates.",
      },
    ],
    deterministicProcessing: {
      title: "Deterministic Engine (Python & SQL)",
      description:
        "Python cost_engine.py and SQLAlchemy analytical core perform 100% of arithmetic calculations. Strict zero-residual assertion: Sum(Sub-Elements) == Total Expenditure.",
      techPills: ["Python cost_engine", "SQLAlchemy Core", "NumPy Vectorized", "Zero-Residual Rule"],
    },
    aiIntelligence: {
      title: "AI Context & Dimensional Synthesis (Domo AI Services)",
      description:
        "Contextualizes performance dimensions, comparing operational throughput patterns across facilities to format structured analytical envelopes.",
      techPills: ["Domo AI Services", "Metric Packaging", "Dimensional Context", "Narrative Grounding"],
    },
    outputs: [
      {
        title: "Total Expenditure & Category Ledgers",
        desc: "Deterministic breakdown of Material, Labor, Machine, Energy, and Scrap.",
      },
      {
        title: "Unit Cost & Salable Yield Metrics",
        desc: "Certified cost per good unit and first-pass assembly yield percentages.",
      },
      {
        title: "Operational Plant Performance Vectors",
        desc: "Throughput, cost share, and efficiency rankings across manufacturing sites.",
      },
    ],
    handoff: {
      headline: "How This Fuels Stage 03 — Variance Detection",
      text: "Validated manufacturing performance metrics establish the authoritative baseline facts needed by the Variance Detection stage to identify abnormal financial and quality movements.",
      nextTitle: "Stage 03 — Variance Detection",
    },
    disclosures: [
      "All numerical calculations are executed deterministically by Python and SQL; language models never compute arithmetic.",
      "Cost per good unit strictly incorporates quality rejection losses from matched shopfloor runs.",
    ],
  },
  {
    step: "03",
    id: "variance-detection",
    stageNumber: "STAGE 03",
    stageOf: "STAGE 03 OF 05",
    title: "Variance Detection",
    shortTitle: "Variance",
    category: "Anomaly Detection",
    keyCapability: "Normalized Period Bridges",
    icon: Scale,
    tagline: "Compares actual performance against established baselines and isolates significant cost deviations.",
    narrativeTitle: "Benchmarking Performance & Isolating Anomaly Windows",
    narrative:
      "In this stage, the agent benchmarks current operational results against historical baselines (e.g. Q3 baseline vs Q4, or October vs November). Using normalized time horizons to avoid period-span distortion, it identifies exact cost deltas, flags anomaly windows, and ranks product models experiencing unusual cost inflation.",
    activities: [
      {
        icon: GitCompare,
        title: "Normalized Period Comparison",
        description:
          "Normalizes calendar day windows (e.g. 25 days vs 25 days) to ensure comparisons are mathematically equitable and free of span-length skew.",
      },
      {
        icon: TrendingDown,
        title: "Cost Deviation & Waterfall Detection",
        description:
          "Decomposes period-over-period cost movements into multi-element variance bridges, isolating favorable and unfavorable financial shifts.",
      },
      {
        icon: Boxes,
        title: "Product & Component Cost Variance",
        description:
          "Ranks the entire product portfolio (e.g. SPH-PRO-256 vs standard models) to pinpoint exactly which models drove expenditure variance.",
      },
      {
        icon: AlertTriangle,
        title: "Anomaly Window & Movement Isolation",
        description:
          "Detects temporal inflection spikes, identifying discrete calendar windows (e.g. Nov 19 to Nov 28) where costs deviated from expected baselines.",
      },
    ],
    deterministicProcessing: {
      title: "Deterministic Engine (Python & SQL)",
      description:
        "Vectorized period delta math, mathematical normalization routines, statistical standard deviation calculations, and temporal anomaly window detection.",
      techPills: ["Delta Mathematics", "Period Normalizer", "Waterfall Engine", "Anomaly Boundary"],
    },
    aiIntelligence: {
      title: "AI Pattern & Movement Recognition (Domo AI Services)",
      description:
        "Analyzes whether detected movements represent seasonal patterns, single-day operational disruptions, or systemic multi-week supply shocks.",
      techPills: ["Domo AI Services", "Trend Patterning", "Anomaly Framing", "Deviation Classifier"],
    },
    outputs: [
      {
        title: "Multi-Element Variance Bridge",
        desc: "Itemized INR deltas for Material, Labor, Machine, Energy, and Scrap.",
      },
      {
        title: "Portfolio Cost Variance Ranking",
        desc: "Product models ordered by unit cost deviation percentage vs portfolio average.",
      },
      {
        title: "Flagged Anomaly Movement Windows",
        desc: "Isolated timeframes and peak expenditure dates marked for evidence drilling.",
      },
    ],
    handoff: {
      headline: "How This Fuels Stage 04 — Root Cause Investigation",
      text: "Isolated cost deviations and anomaly windows focus the Root Cause Investigation stage on high-impact areas backed by concrete data rather than vague speculation.",
      nextTitle: "Stage 04 — Root Cause Investigation",
    },
    disclosures: [
      "Comparisons enforce identical calendar day lengths or disclose period-span differences explicitly.",
      "Baseline facts remain isolated in PostgreSQL to prevent session-staged cross-contamination.",
    ],
  },
  {
    step: "04",
    id: "root-cause-investigation",
    stageNumber: "STAGE 04",
    stageOf: "STAGE 04 OF 05",
    title: "Root Cause Investigation",
    shortTitle: "Root Cause",
    category: "Multi-Factor Analytics",
    keyCapability: "Evidence & BOM Proof",
    icon: Search,
    tagline: "Drills down into BOMs, invoices, scrap tickets, and line telemetry to establish proof of causality.",
    narrativeTitle: "Investigating Operational Drivers with Supporting Evidence",
    narrative:
      "Rather than guessing why costs fluctuated, the agent investigates the physical and operational drivers behind each variance. It separates material price changes from component consumption rates, correlates line scrap tickets with defect Pareto codes, and rigorously distinguishes confirmed causality from mere correlation.",
    activities: [
      {
        icon: Coins,
        title: "Material Price (PPV) vs Usage Variance",
        description:
          "Disentangles supplier invoice purchase price variance (PPV) from shopfloor material usage efficiency (MUV) to determine if cost was external or internal.",
      },
      {
        icon: Boxes,
        title: "Component Pareto Concentration",
        description:
          "Analyzes Bill of Materials component lines to isolate the top sub-assemblies (e.g. Display Modules, Processors) responsible for 80%+ of material drift.",
      },
      {
        icon: Activity,
        title: "Labor, Machine & Downtime Telemetry",
        description:
          "Cross-references machine maintenance records and shift changeovers to evaluate fixed-cost absorption and machine operating efficiency.",
      },
      {
        icon: ShieldCheck,
        title: "Quality Defect & Scrap Analysis",
        description:
          "Correlates scrap write-offs with defect tickets (e.g. solder bridges, optical alignment) to prove whether yield loss drove unit cost inflation.",
      },
    ],
    deterministicProcessing: {
      title: "Deterministic Engine (Python & SQL)",
      description:
        "Component Pareto distribution algorithms, supplier invoice pricing delta calculation, scrap ledger cross-tabulation, and timestamp correlation.",
      techPills: ["Pareto Analyzer", "PPV / MUV Splitter", "Defect Correlation", "Evidence Audit"],
    },
    aiIntelligence: {
      title: "AI Causality & Evidence Reasoning (Domo AI Services)",
      description:
        "Evaluates whether transactional timestamps match cost spikes, tagging findings as PROVEN, LIKELY_CORRELATED, or INSUFFICIENT_EVIDENCE.",
      techPills: ["Domo AI Services", "Causal Reasoning", "Evidence Tagger", "Boundary Discloser"],
    },
    outputs: [
      {
        title: "Ranked Cost Driver Lineage",
        desc: "Verified primary and secondary drivers with quantified financial impacts.",
      },
      {
        title: "Causality Proof Certification",
        desc: "Each finding classified as PROVEN, LIKELY_CORRELATED, or INSUFFICIENT.",
      },
      {
        title: "Analytical Boundary Statement",
        desc: "Explicit disclosure of 'What We Cannot Conclude Yet' for unmeasured parameters.",
      },
    ],
    handoff: {
      headline: "How This Fuels Stage 05 — Insights & Cost Optimization",
      text: "Proven causal drivers and verified financial impacts are passed to Insights & Cost Optimization to generate grounded, realistic cost-reduction recommendations.",
      nextTitle: "Stage 05 — Insights & Cost Optimization",
    },
    disclosures: [
      "Causality is only labeled PROVEN when supported by matching transactional timestamps and physical records.",
      "Where supplier contracts or detailed machine logs are unavailable, the agent explicitly documents data limitations.",
    ],
  },
  {
    step: "05",
    id: "insights-cost-optimization",
    stageNumber: "STAGE 05",
    stageOf: "STAGE 05 OF 05",
    title: "Insights & Cost Optimization",
    shortTitle: "Insights",
    category: "Executive Action & ROI",
    keyCapability: "Audited 9-Section Reports",
    icon: Target,
    tagline: "Synthesizes an executive investigation report and delivers prioritized cost-reduction actions.",
    narrativeTitle: "Delivering Evidence-Backed Findings & Prioritized Actions",
    narrative:
      "In the final stage, the agent transforms verified findings into a structured, executive-ready investigation report. It formulates prioritized, realistic cost-reduction steps—each bounded by verified financial savings, assigned to specific operational owners, and backed by transactional evidence.",
    activities: [
      {
        icon: FileText,
        title: "Canonical 9-Section Report Assembly",
        description:
          "Compiles an immutable investigation report following the standard 9-section structure: Scope, Findings, Evidence, Boundaries, and Next Steps.",
      },
      {
        icon: Lightbulb,
        title: "Prioritized Cost Reduction Actions",
        description:
          "Synthesizes actionable operational steps (e.g. supplier price renegotiation, SMT stencil recalibration) directly targeted at proven cost drivers.",
      },
      {
        icon: Coins,
        title: "Financial Impact & Savings Bounds",
        description:
          "Estimates realistic, conservative cost recovery figures strictly bounded by actual verified variance data (zero inflated projections).",
      },
      {
        icon: ShieldCheck,
        title: "Operational Ownership & Governance",
        description:
          "Assigns clear operational accountability (Procurement Lead, Quality Manager, Plant Supervisor) and archives an immutable audit snapshot.",
      },
    ],
    deterministicProcessing: {
      title: "Deterministic Engine (Python & SQL)",
      description:
        "Canonical report data serialization, KaTeX mathematical formula rendering, atomic persistence into PostgreSQL investigation_reports JSONB store.",
      techPills: ["Report Archival", "PostgreSQL JSONB", "KaTeX Rendering", "Immutable Snapshot"],
    },
    aiIntelligence: {
      title: "AI Synthesis & Narrative Generation (Domo AI Services)",
      description:
        "Transforms structured variance data and causal findings into clear, executive-ready business explanations and tailored recommendation playbooks.",
      techPills: ["Domo AI Services", "Executive Synthesis", "Playbook Generator", "Advisory Safeguards"],
    },
    outputs: [
      {
        title: "Published 9-Section Investigation Report",
        desc: "Complete executive report with full evidence lineage and boundary disclosures.",
      },
      {
        title: "Prioritized Operational Action Plan",
        desc: "Clear cost-reduction steps with assigned department owners and urgency levels.",
      },
      {
        title: "Immutable Historical Audit Archive",
        desc: "Archived snapshot in PostgreSQL ensuring instant historical replay without recalculation.",
      },
    ],
    handoff: {
      headline: "Investigation Complete — Executive Action Enabled",
      text: "The agent journey completes by delivering verified, actionable manufacturing intelligence directly to plant leadership and CFOs for immediate operational execution.",
      nextTitle: "Investigation Complete",
    },
    disclosures: [
      "Projected savings are conservative and strictly bounded by validated variance figures; no inflated ROI claims.",
      "All recommendations remain advisory until reviewed and approved through human operational governance.",
    ],
  },
];

export default function AgentFlowSection() {
  const [selectedStageIdx, setSelectedStageIdx] = useState(0);

  const activeStage = AGENT_STAGES[selectedStageIdx];
  const ActiveIcon = activeStage.icon;

  const handleSelectStage = (idx) => {
    setSelectedStageIdx(idx);
  };

  const handlePrev = () => {
    if (selectedStageIdx > 0) {
      setSelectedStageIdx(selectedStageIdx - 1);
    }
  };

  const handleNext = () => {
    if (selectedStageIdx < AGENT_STAGES.length - 1) {
      setSelectedStageIdx(selectedStageIdx + 1);
    }
  };

  // Progress percentage (Stage 1 = 20%, Stage 5 = 100%)
  const progressPct = ((selectedStageIdx + 1) / AGENT_STAGES.length) * 100;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200 font-sans text-slate-800">
      {/* =========================================================================
          SECTION 1: STORYTELLING HERO HEADER & PROGRESSION BAR
          ========================================================================= */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 shadow-2xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Manufacturing Cost Investigation — Agent Journey
              </h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Enterprise AI Architecture</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
              Follow how our AI agent transforms uploaded manufacturing data into evidence-backed insights and practical cost-saving recommendations.
            </p>
          </div>

          {/* Stepper Status Pill */}
          <div className="flex items-center gap-3 shrink-0 self-start sm:self-center bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl shadow-2xs">
            <Workflow className="w-4 h-4 text-purple-600" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Focus</span>
              <span className="text-xs font-black text-slate-900">{activeStage.stageOf}</span>
            </div>
          </div>
        </div>

        {/* Global Journey Progress Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-3">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
            Journey Progress:
          </div>
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="text-xs font-black text-purple-700 shrink-0 font-mono">
            {Math.round(progressPct)}%
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: FIVE-STAGE JOURNEY CARDS (BALANCED FULL-WIDTH INTERACTIVE TRACK)
          ========================================================================= */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              The 5-Stage Agent Journey
            </h3>
          </div>
          <span className="text-xs font-medium text-slate-500 hidden sm:inline">
            Select a stage below to explore its operational narrative and deterministic intelligence
          </span>
        </div>

        {/* 5-Card Full-Width Track */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 sm:gap-4 relative">
          {AGENT_STAGES.map((stg, idx) => {
            const isSelected = selectedStageIdx === idx;
            const isCompleted = idx < selectedStageIdx;
            const Icon = stg.icon;
            const isLast = idx === AGENT_STAGES.length - 1;

            return (
              <div key={stg.id} className="relative flex flex-col">
                <button
                  type="button"
                  onClick={() => handleSelectStage(idx)}
                  className={`w-full text-left rounded-2xl p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between h-full min-h-[235px] sm:min-h-[245px] relative group overflow-hidden ${
                    isSelected
                      ? "bg-gradient-to-b from-purple-50/70 via-purple-50/20 to-white border-2 border-purple-600 ring-4 ring-purple-100/80 shadow-md transform -translate-y-1"
                      : isCompleted
                      ? "bg-white border-slate-200/90 hover:border-emerald-300 hover:bg-slate-50/40 shadow-xs hover:shadow-md hover:-translate-y-0.5"
                      : "bg-white border-slate-200/90 hover:border-purple-300 hover:bg-purple-50/15 shadow-xs hover:shadow-md hover:-translate-y-0.5"
                  }`}
                >
                  {/* Top Edge Indicator Bar */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 transition-colors ${
                      isSelected
                        ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600"
                        : isCompleted
                        ? "bg-emerald-500"
                        : "bg-slate-200 group-hover:bg-purple-300"
                    }`}
                  />

                  {/* Top Bar: Stage Number + Prominent Icon */}
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-md border tracking-wider transition-colors ${
                          isSelected
                            ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                            : isCompleted
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200 group-hover:border-purple-200 group-hover:bg-purple-50 group-hover:text-purple-700"
                        }`}
                      >
                        {stg.stageNumber}
                      </span>

                      {/* Distinctive Lucide icon with soft gradient container */}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-200 ${
                          isSelected
                            ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-transparent shadow-md shadow-purple-500/25 scale-105"
                            : isCompleted
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-2xs group-hover:scale-105"
                            : "bg-purple-50/80 text-purple-600 border-purple-100/90 shadow-2xs group-hover:border-purple-300 group-hover:bg-purple-100/90 group-hover:text-purple-700 group-hover:scale-105"
                        }`}
                      >
                        <Icon className="w-5 h-5 stroke-[2.2]" />
                      </div>
                    </div>

                    {/* Stage Title */}
                    <h4
                      className={`text-sm sm:text-[14.5px] font-bold leading-tight transition-colors ${
                        isSelected
                          ? "text-purple-950 font-extrabold"
                          : "text-slate-900 group-hover:text-purple-700"
                      }`}
                    >
                      {stg.title}
                    </h4>

                    {/* Key Capability Micro-Badge */}
                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[9.5px] font-bold px-2 py-0.5 rounded-md border tracking-tight transition-colors ${
                          isSelected
                            ? "bg-purple-100/90 text-purple-800 border-purple-200"
                            : isCompleted
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100/80 text-slate-600 border-slate-200 group-hover:bg-purple-50 group-hover:text-purple-700 group-hover:border-purple-200"
                        }`}
                      >
                        {stg.keyCapability}
                      </span>
                    </div>

                    {/* Concise, readable tagline */}
                    <p className="text-[11.5px] text-slate-500 group-hover:text-slate-600 leading-relaxed mt-2.5">
                      {stg.tagline}
                    </p>
                  </div>

                  {/* Bottom Progression & Action Indicator */}
                  <div className="flex items-center justify-between pt-3.5 mt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      {isSelected ? (
                        <>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                            Active Focus
                          </span>
                        </>
                      ) : isCompleted ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                            Completed
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-purple-400 transition-colors" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-purple-600 transition-colors">
                            Upcoming
                          </span>
                        </>
                      )}
                    </div>

                    {/* Hover Interactive Affordance */}
                    <div className="flex items-center text-[10.5px] font-semibold transition-colors">
                      {isSelected ? (
                        <span className="text-purple-700 flex items-center gap-0.5 font-bold">
                          Selected
                          <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>
                      ) : (
                        <span className="text-slate-400 group-hover:text-purple-600 flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-all">
                          Select
                          <ChevronRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                {/* Desktop Connecting Arrow between cards */}
                {!isLast && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                    <div
                      className={`w-6 h-6 rounded-full bg-white border shadow-xs flex items-center justify-center transition-all ${
                        isCompleted
                          ? "border-emerald-300 text-emerald-600 bg-emerald-50/50"
                          : "border-slate-200 text-slate-400"
                      }`}
                    >
                      <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: EDITORIAL SELECTED-STAGE EXPERIENCE
          ========================================================================= */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 shadow-2xs flex flex-col gap-6">
        {/* A. STAGE HEADER BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <ActiveIcon className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200 tracking-wider">
                  {activeStage.stageOf}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {activeStage.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                {activeStage.tagline}
              </p>
            </div>
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <button
              type="button"
              onClick={handlePrev}
              disabled={selectedStageIdx === 0}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-35 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Stage</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={selectedStageIdx === AGENT_STAGES.length - 1}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold disabled:opacity-35 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <span>Next Stage</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* B. MAIN STORY NARRATIVE SECTION */}
        <div className="p-5 sm:p-6 rounded-2xl bg-purple-50/40 border-l-4 border-purple-600 border border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <Compass className="w-4 h-4 text-purple-600" />
            <h4 className="text-sm font-bold text-purple-950 uppercase tracking-wider">
              {activeStage.narrativeTitle}
            </h4>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed font-normal">
            {activeStage.narrative}
          </p>
        </div>

        {/* C. WHAT THE AGENT DOES (4 MODERN MINI-CARDS) */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Core Operational Responsibilities
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {activeStage.activities.map((act, idx) => {
              const ActIcon = act.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-3.5 hover:border-purple-200 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                    <ActIcon className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 leading-snug">
                      {act.title}
                    </h5>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">
                      {act.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* D. PROCESSING ARCHITECTURE & INTELLIGENCE SPLIT (DETERMINISTIC VS AI) */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4 text-purple-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Processing Engine & Intelligence Governance
            </h4>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Deterministic Calculations Card */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-blue-600" />
                    <span>{activeStage.deterministicProcessing.title}</span>
                  </span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    100% Deterministic Math
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeStage.deterministicProcessing.description}
                </p>
              </div>

              {/* Tech Pills */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-200/70">
                {activeStage.deterministicProcessing.techPills.map((pill, pIdx) => (
                  <span
                    key={pIdx}
                    className="text-[10px] font-mono font-medium bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md"
                  >
                    • {pill}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Narrative & Interpretation Card */}
            <div className="p-4 sm:p-5 rounded-xl bg-purple-50/40 border border-purple-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>{activeStage.aiIntelligence.title}</span>
                  </span>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-100 border border-purple-200 px-2 py-0.5 rounded">
                    Context & Synthesis
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeStage.aiIntelligence.description}
                </p>
              </div>

              {/* Tech Pills */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-purple-200/60">
                {activeStage.aiIntelligence.techPills.map((pill, pIdx) => (
                  <span
                    key={pIdx}
                    className="text-[10px] font-mono font-medium bg-white text-purple-800 border border-purple-200 px-2 py-0.5 rounded-md"
                  >
                    • {pill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* E. EXPECTED OUTPUTS (DELIVERABLES) */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Verified Stage Deliverables
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {activeStage.outputs.map((out, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <h5 className="text-xs font-bold text-slate-900">{out.title}</h5>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{out.desc}</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md self-start mt-3">
                  Audit Certified
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* F. CONTINUOUS STORYTELLING CONNECTION TO NEXT STAGE */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50/70 via-indigo-50/40 to-slate-50 border border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                {activeStage.handoff.headline}
              </h5>
              <p className="text-xs text-slate-700 mt-1 max-w-2xl leading-relaxed">
                {activeStage.handoff.text}
              </p>
            </div>
          </div>

          {selectedStageIdx < AGENT_STAGES.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-2xs self-end sm:self-auto hover:border-purple-300"
            >
              <span>Explore {activeStage.handoff.nextTitle}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold shrink-0 self-end sm:self-auto">
              <CheckCircle2 className="w-4 h-4" />
              <span>Full Investigation Workflow Verified</span>
            </div>
          )}
        </div>

        {/* G. DATA GOVERNANCE & TRANSPARENCY BOUNDARIES */}
        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80">
          <div className="flex items-center gap-1.5 mb-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <h5 className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
              Data Governance & Operational Transparency
            </h5>
          </div>
          <ul className="space-y-1 text-xs text-amber-900/90 pl-1">
            {activeStage.disclosures.map((disc, idx) => (
              <li key={idx} className="flex items-start gap-1.5 leading-snug">
                <span className="font-bold text-amber-700">•</span>
                <span>{disc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
