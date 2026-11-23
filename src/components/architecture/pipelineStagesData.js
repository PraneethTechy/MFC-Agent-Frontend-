/**
 * Authoritative Pipeline Stages & Operational Metadata
 * Configured to match the enterprise 5-stage architecture pipeline
 * Grounded in live Neon PostgreSQL facts (127,386 records) and Domo AI Services.
 */

export const PIPELINE_STAGES = [
  {
    id: "stage-1-sources",
    stageNum: 1,
    name: "Source Systems",
    shortHeader: "1. SOURCE SYSTEMS",
    tagline: "7 Enterprise Sets",
    headerBg: "bg-gradient-to-r from-rose-700 to-red-800",
    headerColor: "text-white",
    cardBorder: "border-rose-200 dark:border-rose-900/60",
    badgeBg: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
    description:
      "Captures operational shopfloor telemetry, ERP batch expenditure postings, and engineering specifications across smartphone manufacturing plants (IN-TS-01, IN-TS-02, IN-TS-03, PLT-01).",
    protocols: "ERP / SAP GL Postings • MES Modbus Telemetry • PLM Engineering BOMs • IQC Quality Logs",
    dbTables: "line_cost_batches (9,502) • hourly_production_logs (13,332) • bom_component_records (246)",
    steps: [
      "Pulls transactional general ledger batch records across material, labor, machine, and energy.",
      "Streams automated MES counter telemetry and hourly downtime stoppage logs from SMT and FAL lines.",
      "Synchronizes engineering BOM structures and scrap allowances for active smartphone SKUs (A15-128, A15-256, PRO-256).",
      "Logs incoming supplier receipts, purchase prices, and defect classifications across 11 vendors."
    ],
    subCards: [
      { id: "src-cost", label: "ERP & Cost Ledgers", sub: "SAP / GL Batch Accounts", status: "Active" },
      { id: "src-mes", label: "MES Production Logs", sub: "Hourly Output & Stoppages", status: "Active" },
      { id: "src-qms", label: "QMS & Testing Gates", sub: "AOI Rejection & FPY", status: "Active" },
    ]
  },
  {
    id: "stage-2-gateway",
    stageNum: 2,
    name: "API Gateway & Ingestion",
    shortHeader: "2. INGESTION GATEWAY",
    tagline: "FastAPI Engine",
    headerBg: "bg-gradient-to-r from-blue-700 to-indigo-800",
    headerColor: "text-white",
    cardBorder: "border-blue-200 dark:border-blue-900/60",
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
    description:
      "High-throughput asynchronous ingestion gateway enforcing cryptographic SHA-256 batch hashing, 40+ synonym header auto-mapping, and 14 multi-pass data validation rules before database promotion.",
    protocols: "FastAPI [Python 3.11] • Port 8000 • HTTP/2 • Multipart Streaming • Pydantic v2 Schemas",
    dbTables: "stg_manufacturing_cost (26k) • stg_hourly_production (39k) • import_batches (43)",
    steps: [
      "Validates all incoming file uploads and connector payloads through strict Pydantic v2 schemas.",
      "Executes fuzzy header matching against 40+ manufacturing synonym dictionaries to auto-map columns.",
      "Enforces 14 deterministic integrity rules (non-negative costs, valid dates, zero orphan logs) in isolated staging.",
      "Executes atomic ACID promotion into Neon PostgreSQL with Strategy C pre-update fact archival."
    ],
    subCards: [
      { id: "ing-fastapi", label: "FastAPI Engine", sub: "Async Ingestion & SSL", status: "Active" },
      { id: "ing-validator", label: "Multi-Pass Validator", sub: "14 Integrity & Null Rules", status: "Active" },
      { id: "ing-promo", label: "Promotion Service", sub: "Strategy C ACID Commit", status: "Active" },
    ]
  },
  {
    id: "stage-3-intelligence",
    stageNum: 3,
    name: "Multi-Agent & Analytical Core",
    shortHeader: "3. INTELLIGENCE CORE",
    tagline: "Deterministic + Domo AI",
    headerBg: "bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800",
    headerColor: "text-white",
    cardBorder: "border-purple-300 dark:border-purple-700",
    badgeBg: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
    description:
      "Dual-engine analytical core separating 100% deterministic mathematical calculations (Python/SQL) from contextual domain reasoning and hypothesis falsification via Domo AI Services.",
    protocols: "Domo AI Services [Text Generation] • LangChain Core • Zero-Hallucination Guardrails",
    dbTables: "v_cost_facts • v_variance_facts • material_consumption_records (73k) • quality_rework (4.3k)",
    steps: [
      "Executes deterministic waterfall variance bridges: Total Variance = Material + Labor + Machine + Energy + Scrap.",
      "Calculates exact SKU Cost per Good Unit and volume-vs-spending absorption splits with ±₹0.00 residual.",
      "Domo AI synthesizes 8 manufacturing expert perspectives (Cost, Production, Quality, Sourcing, Maintenance).",
      "Executes Analysis of Competing Hypotheses (ACH) to falsify unproven correlations and detect root causes."
    ],
    subCards: [
      { id: "ai-math", label: "Deterministic Engine", sub: "Waterfall Bridge ±₹0.00", status: "Active" },
      { id: "ai-domo", label: "Domo AI Services", sub: "8-Persona Contextual RCA", status: "Active" },
      { id: "ai-pareto", label: "Defect Pareto Engine", sub: "Station S01-S06 FPY Math", status: "Active" },
    ]
  },
  {
    id: "stage-4-governance",
    stageNum: 4,
    name: "Governance & Evidence Gate",
    shortHeader: "4. GOVERNANCE & AUDIT",
    tagline: "Evidence Verification",
    headerBg: "bg-gradient-to-r from-slate-800 to-indigo-900",
    headerColor: "text-white",
    cardBorder: "border-slate-300 dark:border-slate-700",
    badgeBg: "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
    description:
      "Enterprise evidence governance enforcing strict classification of findings (PROVEN vs OBSERVED_CORRELATION vs HYPOTHESIS), cryptographic audit logging, and durable report snapshot preservation.",
    protocols: "Strict Evidence Classification • Cryptographic Audit Trail • Zero Extrapolation Policy",
    dbTables: "fact_record_history (2) • audit_events (31) • investigation_reports (457 snapshots)",
    steps: [
      "Classifies every analytical finding into PROVEN (verified facts) or HYPOTHESIS (unverified standard).",
      "Preserves pre-correction historical records in fact_record_history to guarantee full audit traceability.",
      "Stores complete investigation snapshots as durable JSON in investigation_reports for instant reopening.",
      "Prevents AI from hallucinatory financial assertions by binding all metrics to deterministic tool outputs."
    ],
    subCards: [
      { id: "gov-class", label: "Strict Evidence Gate", sub: "PROVEN vs HYPOTHESIS", status: "Active" },
      { id: "gov-audit", label: "Immutable Ledger", sub: "fact_record_history", status: "Active" },
      { id: "gov-snapshot", label: "Report Snapshots", sub: "457 Durable Records", status: "Active" },
    ]
  },
  {
    id: "stage-5-actions",
    stageNum: 5,
    name: "Closed-Loop Actions & ROI",
    shortHeader: "5. CLOSED-LOOP ROI",
    tagline: "Action & Dispatch",
    headerBg: "bg-gradient-to-r from-emerald-700 to-teal-800",
    headerColor: "text-white",
    cardBorder: "border-emerald-200 dark:border-emerald-900/60",
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    description:
      "Converts verified root causes into prioritized, actionable engineering interventions with non-double-counted financial savings estimation and continuous standard cost recalibration.",
    protocols: "Non-Double-Counting ROI Engine • P&L Direct Savings vs Avoidance • Closed-Loop Feedback",
    dbTables: "investigation_reports.cost_improvement_plan • recommendations table",
    steps: [
      "Generates dynamic Cost Improvement Plan cards with designated owners and implementation timelines.",
      "Calculates quantified savings opportunities (e.g. ₹22.39 Cr) using conservative engineering recovery formulas.",
      "Dispatches actionable tickets to Strategic Procurement, Quality Engineering, and Shopfloor Operations.",
      "Feeds realized remediation outcomes back into Stage 4 to dynamically recalibrate standard BOM tolerances."
    ],
    subCards: [
      { id: "act-plan", label: "Cost Improvement Plan", sub: "₹22.39 Cr Opportunity", status: "Active" },
      { id: "act-dispatch", label: "Corrective Dispatch", sub: "Owner & Timeline Sizing", status: "Active" },
      { id: "act-loop", label: "Baseline Recalibration", sub: "Continuous Feedback Loop", status: "Active" },
    ]
  }
];

export const PROBLEMS_SOLVED = [
  {
    id: "01",
    tag: "COST SPIKES",
    title: "Unexplained Batch Cost Variances",
    desc: "Isolates why smartphone unit costs jumped by +₹1,450 / unit between consecutive production runs.",
    icon: "Clock",
    color: "bg-rose-50/90 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60",
    badge: "border-rose-300 text-rose-700 dark:text-rose-300",
  },
  {
    id: "02",
    tag: "BLINDSPOTS",
    title: "Component Price Inflation (PPV)",
    desc: "Detects hidden vendor contract price increases across 67 BOM items before ERP accounts reconcile.",
    icon: "AlertTriangle",
    color: "bg-amber-50/90 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60",
    badge: "border-amber-300 text-amber-700 dark:text-amber-300",
  },
  {
    id: "03",
    tag: "YIELD LOSSES",
    title: "Station S01-S06 Quality Rejections",
    desc: "Pins down exact defect codes (DEF-002 Solder Bridging) driving 82% of rework bay labor expenditures.",
    icon: "Flame",
    color: "bg-purple-50/90 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/60",
    badge: "border-purple-300 text-purple-700 dark:text-purple-300",
  },
  {
    id: "04",
    tag: "BOTTLENECKS",
    title: "Overhead Under-Absorption",
    desc: "Identifies line starvation and machine downtime that concentrates fixed plant overhead on fewer units.",
    icon: "Layers",
    color: "bg-cyan-50/90 text-cyan-800 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-900/60",
    badge: "border-cyan-300 text-cyan-700 dark:text-cyan-300",
  },
  {
    id: "05",
    tag: "UNVERIFIED STANDARDS",
    title: "BOM Tolerance Overages",
    desc: "Flags component dispense creep and scrap factor deviations before they distort standard margins.",
    icon: "ShieldAlert",
    color: "bg-emerald-50/90 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60",
    badge: "border-emerald-300 text-emerald-700 dark:text-emerald-300",
  },
];

export const OPERATIONAL_HEATMAP_DATA = [
  {
    line: "SMT-L1 (IN-TS-01)",
    plant: "Plant 01 (Telangana)",
    output: "86,400",
    fpy: "97.45%",
    status: "Alert",
    statusColor: "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300",
    costPerUnit: "₹14,890",
    delta: "+6.8%",
    deltaColor: "text-rose-600 dark:text-rose-400",
    highlight: "Solder bridging defect DEF-002 detected on Station S02."
  },
  {
    line: "SMT-L2 (IN-TS-01)",
    plant: "Plant 01 (Telangana)",
    output: "91,200",
    fpy: "98.82%",
    status: "Optimal",
    statusColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300",
    costPerUnit: "₹13,920",
    delta: "-1.4%",
    deltaColor: "text-emerald-600 dark:text-emerald-400",
    highlight: "Operating at Six-Sigma benchmark with 24h nozzle maintenance."
  },
  {
    line: "FAL-L1 (IN-TS-02)",
    plant: "Plant 02 (Telangana)",
    output: "74,150",
    fpy: "98.15%",
    status: "Normal",
    statusColor: "bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300",
    costPerUnit: "₹15,260",
    delta: "+2.1%",
    deltaColor: "text-rose-600 dark:text-rose-400",
    highlight: "Final assembly yield stable; packaging labor within budget."
  },
  {
    line: "FAL-L2 (IN-TS-03)",
    plant: "Plant 03 (Telangana)",
    output: "82,300",
    fpy: "99.10%",
    status: "Optimal",
    statusColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300",
    costPerUnit: "₹14,110",
    delta: "-3.2%",
    deltaColor: "text-emerald-600 dark:text-emerald-400",
    highlight: "Top performing line across Q3/Q4 2026."
  },
  {
    line: "LINE-01 (PLT-01)",
    plant: "Pilot Plant (NPI)",
    output: "8,143",
    fpy: "94.20%",
    status: "Trial SKU",
    statusColor: "bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300",
    costPerUnit: "₹17,560",
    delta: "N/A",
    deltaColor: "text-slate-500",
    highlight: "Prototype pilot batch (SPH-TST-X1) — high initial scrap."
  }
];
