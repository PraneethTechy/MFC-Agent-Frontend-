/**
 * Manufacturing Cost RCA Home Page Data Specifications & Interactive Intelligence Registry
 * Grounded in actual GWC DATA.AI Manufacturing Intelligence Platform architecture.
 * Contains domain explanations for all 5 stages, internal cards, dataset families, and 5 manufacturing problems.
 */

export const ARCHITECTURE_STAGES = [
  {
    id: "stage-1",
    num: 1,
    title: "1. DATA INPUT",
    badgeText: "STAGE 1 • DATA INPUT",
    color: "#DC2626",
    headerBg: "bg-red-600",
  },
  {
    id: "stage-2",
    num: 2,
    title: "2. DATA PROCESSING & VALIDATION",
    badgeText: "STAGE 2 • PROCESSING & VALIDATION",
    color: "#1D4ED8",
    headerBg: "bg-blue-600",
  },
  {
    id: "stage-3",
    num: 3,
    title: "3. MANUFACTURING DATA LAYER",
    badgeText: "STAGE 3 • MANUFACTURING DATA LAYER",
    color: "#6D28D9",
    headerBg: "bg-purple-700",
  },
  {
    id: "stage-4",
    num: 4,
    title: "4. INSIGHTS & ANALYTICS",
    badgeText: "STAGE 4 • INSIGHTS & ANALYTICS",
    color: "#1D4ED8",
    headerBg: "bg-blue-700",
  },
  {
    id: "stage-5",
    num: 5,
    title: "5. BUSINESS OUTCOMES",
    badgeText: "STAGE 5 • BUSINESS OUTCOMES",
    color: "#EA580C",
    headerBg: "bg-orange-600",
  },
];

export const MANUFACTURING_PROBLEMS = [
  {
    id: "prob-01",
    num: "01",
    title: "Manufacturing Cost Increases",
    desc: "Unexplained expenditure growth across batches, products, or production lines",
    icon: "TrendingUp",
    color: "text-red-500",
    badgeText: "PROBLEM 01 • COST INCREASES",
  },
  {
    id: "prob-02",
    num: "02",
    title: "Material Cost & Procurement Variances",
    desc: "BOM component over-consumption, scrap waste, and supplier purchase price drift",
    icon: "Boxes",
    color: "text-amber-500",
    badgeText: "PROBLEM 02 • MATERIAL & PROCUREMENT",
  },
  {
    id: "prob-03",
    num: "03",
    title: "Yield, Scrap & Quality Losses",
    desc: "Elevated defect rates, inspection failures, and scrap-induced unit cost uplift",
    icon: "ShieldAlert",
    color: "text-purple-600",
    badgeText: "PROBLEM 03 • YIELD & QUALITY LOSSES",
  },
  {
    id: "prob-04",
    num: "04",
    title: "Production Inefficiencies & Downtime",
    desc: "Throughput bottlenecks, uncosted production runs, and shift productivity gaps",
    icon: "Cog",
    color: "text-sky-500",
    badgeText: "PROBLEM 04 • PRODUCTION INEFFICIENCIES",
  },
  {
    id: "prob-05",
    num: "05",
    title: "Testing & Inspection Losses",
    desc: "Test station fallout, calibration drifts, functional test failures, and burn-in losses",
    icon: "FlaskConical",
    color: "text-rose-500",
    badgeText: "PROBLEM 05 • TESTING & INSPECTION",
  },
];

/**
 * MASTER INTELLIGENCE REGISTRY
 * Structured for Manufacturing Management, Operations Heads, Finance & Quality Leaders.
 */
export const ARCHITECTURE_DETAILS = {
  // ================= STAGE 1 & SUB-ELEMENTS =================
  "stage-1": {
    id: "stage-1",
    type: "stage",
    title: "Stage 01: Data Input Layer",
    badgeText: "STAGE 1 • DATA INGESTION",
    badgeColor: "bg-red-50 text-red-700 border-red-200",
    accentColor: "text-red-600",
    whatItIs:
      "The front door of factory intelligence. Ingests operational production files, ERP cost accounting sheets, and shopfloor inspection records across multiple file formats without requiring manual data formatting.",
    howItWorks: [
      "Plant operators and financial analysts upload standard production spreadsheets (.xlsx, .csv) via drag-and-drop.",
      "The system inspects file headers, verifies column structures, and confirms accounting dates and plant identification codes.",
      "Validates file checksums (SHA-256) to ensure data authenticity and guard against corrupted or altered uploads.",
      "Incoming batches are segregated into a secure staging zone, leaving operational databases intact.",
      "Prepares ingestion manifests and alerts downstream validation rules that new factory data has arrived.",
    ],
    informationUsed:
      "Raw Excel (.xlsx) workbooks, CSV operational extracts, ERP batch exports, MES production runs, shopfloor QA logs.",
    managementGets:
      "Single-window visibility of incoming factory records, elimination of manual data entry errors, and a clear audit trail of every uploaded file.",
    businessValue:
      "Prevents manual spreadsheet errors, unites fragmented plant data, and establishes an auditable foundation for cost and yield analysis.",
  },

  "s1-upload": {
    id: "s1-upload",
    type: "dataset",
    title: "Manufacturing Upload Workflow",
    badgeText: "STAGE 1 • INGESTION WORKFLOW",
    badgeColor: "bg-red-50 text-red-700 border-red-200",
    accentColor: "text-red-600",
    whatItIs:
      "The standard upload gateway that enables operations and finance teams to submit factory Excel and CSV datasets through an intuitive self-service interface.",
    howItWorks: [
      "Select or drag-and-drop manufacturing files directly into the Data Upload portal.",
      "The platform parses worksheet tabs, detects plant codes (Plant A, Plant B), and identifies reporting timeframes.",
      "Checks file integrity and generates a unique tracking session ID for the uploaded batch.",
      "Stages the raw records in temporary memory for automated validation before any database write occurs.",
      "Provides instant feedback on row counts, file size, and upload completeness.",
    ],
    informationUsed:
      "Multi-sheet Excel workbooks (.xlsx), CSV data files, ERP monthly expenditure batches, and MES hourly output logs.",
    managementGets:
      "Effortless self-service data submission without IT bottlenecks, immediate confirmation of file reception, and end-to-end upload tracking.",
    businessValue:
      "Reduces data collection cycle times from days to seconds while eliminating transcription mistakes and lost spreadsheets.",
  },

  "s1-prod": {
    id: "s1-prod",
    type: "dataset",
    title: "Production Output Records",
    badgeText: "STAGE 1 • DATASET FAMILY",
    badgeColor: "bg-red-50 text-red-700 border-red-200",
    accentColor: "text-red-600",
    whatItIs:
      "Comprehensive shopfloor production declarations detailing gross quantities produced, compliant finished units, and station-level rejections across shifts and manufacturing lines.",
    howItWorks: [
      "Captures unit quantities produced by line, machine station, and production shift.",
      "Classifies finished goods into first-time good units, units requiring rework, and scrapped items.",
      "Matches produced quantities against open production orders and scheduled shift capacity.",
      "Records cycle times, line operating hours, and standard run-rate pacing metrics.",
      "Provides the volume baseline necessary to calculate accurate unit costs and operational throughput.",
    ],
    informationUsed:
      "Hourly MES production logs, line completion declarations, work-order actuals, shift timecards, line run-rate summaries.",
    managementGets:
      "Real-time insight into actual factory output versus planned targets, early notice of throughput slowdowns, and plant-level volume comparisons.",
    businessValue:
      "Enables proactive line pacing, eliminates hidden factory volume deficits, and ensures fixed factory overhead is accurately absorbed.",
  },

  "s1-mat": {
    id: "s1-mat",
    type: "dataset",
    title: "Material Usage & Consumption",
    badgeText: "STAGE 1 • DATASET FAMILY",
    badgeColor: "bg-red-50 text-red-700 border-red-200",
    accentColor: "text-red-600",
    whatItIs:
      "Detailed inventory disbursement and shopfloor consumption logs tracking exact quantities of raw materials, silicon components, and subassemblies issued to active production lines.",
    howItWorks: [
      "Records material requisition tickets, warehouse issues, and lot numbers released to each job order.",
      "Tracks physical consumption on the assembly line against standard theoretical BOM consumption.",
      "Identifies unreturned raw materials, line-side shrinkage, and material handling scrap.",
      "Links component usage directly to specific product models, manufacturing lines, and shift teams.",
      "Highlights variances between purchase order costs and standard inventory values.",
    ],
    informationUsed:
      "Material issue slips, warehouse consumption logs, lot tracking records, inventory disbursement ledgers, scrap vouchers.",
    managementGets:
      "Instant visibility into excess material usage, component-level consumption variances, and line-side material waste hotspots.",
    businessValue:
      "Cuts high-value component leakage, enforces warehouse discipline, and protects direct material gross margins.",
  },

  "s1-cost": {
    id: "s1-cost",
    type: "dataset",
    title: "Direct Costing Records",
    badgeText: "STAGE 1 • DATASET FAMILY",
    badgeColor: "bg-red-50 text-red-700 border-red-200",
    accentColor: "text-red-600",
    whatItIs:
      "Financial manufacturing cost batches providing granular expenditure breakdowns across direct materials, factory labour, machine operating charges, and energy overhead.",
    howItWorks: [
      "Ingests factory cost accounting batches allocated to specific production runs and lines.",
      "Decomposes expenditure into standard cost categories: direct material, direct labour, machine depreciation, energy, and rework.",
      "Reconciles general ledger spend totals against operational shopfloor declarations.",
      "Calculates gross manufacturing expenditure and per-unit manufacturing cost baselines.",
      "Feeds the mathematical variance decomposition engine used in cost root cause investigations.",
    ],
    informationUsed:
      "Line cost batches, ERP cost center ledgers, shopfloor utility statements, direct labour time allocations, machine hourly rate schedules.",
    managementGets:
      "Itemized cost transparency per assembly line and product SKU, eliminating unexplained budget overruns and cost surprises.",
    businessValue:
      "Pinpoints exact cost inflation drivers, controls line-level overtime and energy waste, and protects product gross profit margins.",
  },

  "s1-qa": {
    id: "s1-qa",
    type: "dataset",
    title: "Quality & QA Logs",
    badgeText: "STAGE 1 • DATASET FAMILY",
    badgeColor: "bg-red-50 text-red-700 border-red-200",
    accentColor: "text-red-600",
    whatItIs:
      "Inspection results, serialized defect classifications, and station rework tickets capturing every quality anomaly and component failure across the assembly line.",
    howItWorks: [
      "Records pass, fail, and re-test outcomes from automated optical inspection (AOI) and manual quality stations.",
      "Catalogs specific defect codes (e.g., solder bridging, component misalignment, calibration drift).",
      "Tracks units routed to rework stations alongside associated technician repair labor hours.",
      "Maintains complete serial-number traceability from initial board build through final pack-out.",
      "Calculates First Pass Yield (FPY %) and station fallout rates across production lines.",
    ],
    informationUsed:
      "Serialized quality inspection logs, AOI test scan files, functional test records, rework timecards, defect taxonomy ledgers.",
    managementGets:
      "Root-cause defect pareto charts, identification of faulty workstations, and full traceability of non-conforming batches.",
    businessValue:
      "Drives assembly yield back toward the corporate 98.5% benchmark, slashes rework labor, and protects brand reputation.",
  },

  "s1-bom": {
    id: "s1-bom",
    type: "dataset",
    title: "BOM Components & Specifications",
    badgeText: "STAGE 1 • DATASET FAMILY",
    badgeColor: "bg-red-50 text-red-700 border-red-200",
    accentColor: "text-red-600",
    whatItIs:
      "The engineering Bill of Materials (BOM) master file defining the approved component structure, approved vendor list, and theoretical material consumption limits for each product SKU.",
    howItWorks: [
      "Defines parent-child relationships between finished assemblies, subassemblies, and discrete components.",
      "Specifies engineering-approved quantity multipliers (e.g., exactly 1 display, 2 memory chips, 1 battery per unit).",
      "Establishes standard purchase pricing and baseline component valuation.",
      "Serves as the benchmark against which actual warehouse consumption is compared during variance analysis.",
      "Supports revision tracking to verify that engineering change orders (ECOs) are followed on the floor.",
    ],
    informationUsed:
      "Engineering BOM master tables, component specifications, approved manufacturer lists (AML), standard cost cards.",
    managementGets:
      "Clear standard requirements for every manufactured SKU, enabling immediate detection of material over-consumption or component substitutions.",
    businessValue:
      "Ensures design compliance, prevents unauthorized component substitutions, and forms the mathematical basis for material usage variance.",
  },

  // ================= STAGE 2 & SUB-ELEMENTS =================
  "stage-2": {
    id: "stage-2",
    type: "stage",
    title: "Stage 02: Processing & Validation Layer",
    badgeText: "STAGE 2 • QUALITY GATES",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    accentColor: "text-blue-600",
    whatItIs:
      "The automated quality gate and staging pipeline. Sanitizes, validates, and standardizes newly uploaded factory datasets before they can be committed to permanent reporting ledgers.",
    howItWorks: [
      "Ingests raw uploads into an isolated temporary staging memory store without modifying live databases.",
      "Executes schema checks, null-value checks, and numeric range validations against manufacturing thresholds.",
      "Reconciles production dates, plant hierarchies, and component codes against verified business standards.",
      "Generates an actionable data quality scorecard highlighting missing rows, unexpected codes, or duplicate entries.",
      "Requires explicit administrative review before data can be promoted into certified reporting stores.",
    ],
    informationUsed:
      "Staged raw file extracts, plant calendar definitions, product master codes, validation rule libraries, and data error logs.",
    managementGets:
      "100% confidence in data integrity, prevention of corrupt uploads, and transparent scorecards of data cleanliness before business reviews.",
    businessValue:
      "Protects executive reporting from bad data, prevents flawed financial conclusions, and ensures audit-grade accounting compliance.",
  },

  "s2-load": {
    id: "s2-load",
    type: "processing",
    title: "Load Staged Data (Current Upload Store)",
    badgeText: "STAGE 2 • DATA STAGING",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    accentColor: "text-blue-600",
    whatItIs:
      "The staging mechanism that loads uploaded factory files into an isolated working memory environment (Current Upload Store) completely partitioned from corporate historical records.",
    howItWorks: [
      "Structures raw spreadsheet rows into normalized in-memory tables.",
      "Maintains session-level isolation so working analysts can explore new datasets safely.",
      "Indexes records by plant code, production line, product SKU, and accounting period.",
      "Prepares the staged records for automated validation checks and exploratory root cause queries.",
      "Ensures that unverified or erroneous data cannot contaminate certified executive dashboards.",
    ],
    informationUsed:
      "Temporary upload caches, session memory tables, structured staging schemas, ingestion manifests.",
    managementGets:
      "A risk-free working sandbox where new monthly data can be reviewed, verified, and analyzed before permanent commitment.",
    businessValue:
      "Eliminates the danger of test or draft files overwriting historical reporting, maintaining strict financial and operational governance.",
  },

  "s2-val": {
    id: "s2-val",
    type: "processing",
    title: "Quality Validation & Business Rules",
    badgeText: "STAGE 2 • AUTOMATED VALIDATION",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    accentColor: "text-blue-600",
    whatItIs:
      "An automated validation engine that screens incoming factory records for structural integrity, completeness, and adherence to physical manufacturing logic.",
    howItWorks: [
      "Performs mandatory-field validation to ensure essential columns (units, costs, dates, lines) are populated.",
      "Executes duplicate detection to prevent double-counting of production shifts or expense vouchers.",
      "Applies statistical bounds checks to flag extreme outliers (e.g., negative scrap, unit costs exceeding 3 standard deviations).",
      "Validates referential integrity to ensure every product SKU and line code matches approved plant masters.",
      "Produces a detailed validation scorecard with clear error descriptions and remediation guidance.",
    ],
    informationUsed:
      "Staged data records, validation schema rules, allowable parameter thresholds, master data lookup tables.",
    managementGets:
      "Instant detection of spreadsheet anomalies, clear error reporting for plant data coordinators, and verified data hygiene.",
    businessValue:
      "Stops errors at the source, avoids hours of troubleshooting reconciliations, and ensures leadership acts on verified facts.",
  },

  "s2-app": {
    id: "s2-app",
    type: "processing",
    title: "Approve & Commit Governance",
    badgeText: "STAGE 2 • GOVERNANCE & PROMOTION",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    accentColor: "text-emerald-600",
    whatItIs:
      "The formal administrative control gate where verified staged datasets are officially authorized for promotion into the permanent Global Store.",
    howItWorks: [
      "Presents a comprehensive reconciliation preview summarizing total units, net spend, and quality metrics.",
      "Requires explicit user authorization before triggering database promotion—uploading or investigating never auto-commits.",
      "Transfers validated records from temporary staging memory into PostgreSQL production star schemas.",
      "Updates dimensional cross-references and refreshes certified historical analytical cubes.",
      "Logs an immutable audit entry with timestamp, user credentials, and record counts for governance compliance.",
    ],
    informationUsed:
      "Validation scorecards, reconciliation summary ledgers, authorization security tokens, promotion audit logs.",
    managementGets:
      "Strict control over certified data releases, complete traceability of who committed what dataset, and zero accidental ledger contamination.",
    businessValue:
      "Enforces corporate governance standards (SOX/ISO compliance) and ensures full financial accountability across all manufacturing plants.",
  },

  // ================= STAGE 3 & SUB-ELEMENTS =================
  "stage-3": {
    id: "stage-3",
    type: "stage",
    title: "Stage 03: Manufacturing Data Layer",
    badgeText: "STAGE 3 • DATA ARCHITECTURE",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    accentColor: "text-purple-600",
    whatItIs:
      "The enterprise data foundation. Maintains dual-store architecture providing trusted historical data in PostgreSQL alongside isolated staging memory, organized in a high-performance star schema.",
    howItWorks: [
      "Maintains the Current Upload Store for uncommitted data exploration and the Global Store for certified records.",
      "Models manufacturing facts across costs, production output, serialized inspections, and BOM components.",
      "Establishes dimensional conformity across plants, assembly lines, product families, suppliers, and dates.",
      "Calculates standard factory KPIs such as Cost per Good Unit, First Pass Yield (FPY), and Availability.",
      "Delivers optimized analytical schemas for sub-second multidimensional drill-down.",
    ],
    informationUsed:
      "Committed PostgreSQL fact tables, dimension master tables, temporary session SQLite stores, pre-aggregated analytics cubes.",
    managementGets:
      "A unified, trustworthy view of factory performance across all operational departments, free from conflicting spreadsheet versions.",
    businessValue:
      "Creates a single source of truth across operations, finance, and engineering, accelerating executive decision-making.",
  },

  "s3-upload-store": {
    id: "s3-upload-store",
    type: "store",
    title: "Current Upload Store (Staging Store)",
    badgeText: "STAGE 3 • STAGING ENVIRONMENT",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    accentColor: "text-purple-700",
    whatItIs:
      "A temporary, session-scoped working store that houses newly uploaded factory data during review and active investigation without affecting historical corporate baselines.",
    howItWorks: [
      "Isolates incoming monthly batches in lightweight in-memory storage (SQLite/session context).",
      "Allows analysts to run what-if scenarios, preliminary variance checks, and RCA investigations on uncommitted data.",
      "Restricts data visibility to the active session until explicit management promotion occurs.",
      "Enables comparing uploaded figures against historical benchmarks stored in the Global Store.",
      "Can be refreshed, cleared, or reloaded at any time without compromising historical databases.",
    ],
    informationUsed:
      "Staged manufacturing files, active session parameters, temporary indexing tables, validation exception logs.",
    managementGets:
      "The agility to investigate new factory periods immediately without the delay or risk of premature database publishing.",
    businessValue:
      "Accelerates time-to-insight for plant managers while safeguarding historical reporting integrity.",
  },

  "s3-global-store": {
    id: "s3-global-store",
    type: "store",
    title: "Global Store (Curated Production History)",
    badgeText: "STAGE 3 • ENTERPRISE STORE",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    accentColor: "text-emerald-600",
    whatItIs:
      "The authoritative corporate data repository running on PostgreSQL 16. Houses all certified, approved manufacturing records from past operational periods.",
    howItWorks: [
      "Stores verified historical records across manufacturing cost batches, production logs, and inspection runs.",
      "Maintains dimensional star schemas with enforced foreign key referential integrity.",
      "Serves as the benchmark foundation against which all current period variances and trends are calculated.",
      "Enforces role-based data security, encryption, and automated point-in-time recovery.",
      "Supplies certified data feeds to executive reporting dashboards, audit reports, and AI models.",
    ],
    informationUsed:
      "Committed fact_line_cost_batches, fact_hourly_production, fact_serialized_inspections, dim_products, dim_plants.",
    managementGets:
      "An uncompromised historical repository for year-over-year trend analysis, long-term benchmarking, and certified board reporting.",
    businessValue:
      "Guarantees financial auditability, supports historical trend forecasting, and eliminates conflicting versions of corporate performance.",
  },

  "s3-model": {
    id: "s3-model",
    type: "model",
    title: "Integrated Manufacturing Model (Models)",
    badgeText: "STAGE 3 • UNIFIED STAR SCHEMA",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    accentColor: "text-purple-600",
    whatItIs:
      "The relational model that bridges operational shopfloor data with financial cost accounting, linking units, hours, defects, and dollars into one unified representation.",
    howItWorks: [
      "Connects shopfloor production declarations to financial ledger cost batches via shared plant, line, and period keys.",
      "Maps serialized defect logs directly to product SKUs, BOM components, and specific assembly workstations.",
      "Aligns warehouse material consumption with theoretical engineering limits defined in the product BOM.",
      "Structures data into clean fact and dimension tables optimized for fast multi-dimensional slicing.",
      "Eliminates data silos between plant operations and financial controlling teams.",
    ],
    informationUsed:
      "Cross-domain dimensional relationships: Plant hierarchy, Line configuration, SKU catalog, Supplier directory, Shift calendar.",
    managementGets:
      "Seamless correlation between operational events (downtime, defects) and financial impact (cost spikes, scrap penalties).",
    businessValue:
      "Breaks down departmental silos, allowing operations and finance to speak the same language and solve cost problems cooperatively.",
  },

  "s3-kpi": {
    id: "s3-kpi",
    type: "model",
    title: "Standardized KPIs & ETL Transformations (ETL)",
    badgeText: "STAGE 3 • STANDARDIZED METRICS",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    accentColor: "text-sky-600",
    whatItIs:
      "Certified mathematical transformation pipelines that calculate standardized manufacturing metrics such as Cost per Good Unit, First Pass Yield, and Net Spend uniformly across all plants.",
    howItWorks: [
      "Executes standardized formulas: Net Manufacturing Spend = Direct Material + Labour + Machine + Energy + Scrap.",
      "Calculates Cost per Good Unit = Total Incurred Spend / (Gross Produced Units × First Pass Yield %).",
      "Computes First Pass Yield (FPY) = Defect-Free Units / Total Units Inspected × 100.",
      "Pre-aggregates performance indices across shifts, lines, and calendar months for instant retrieval.",
      "Eliminates conflicting metric definitions between different plant sites and corporate headquarters.",
    ],
    informationUsed:
      "Raw production counts, scrap totals, line expense batches, standardized metric definition libraries.",
    managementGets:
      "Consistent, comparable performance indicators across all manufacturing facilities, enabling genuine benchmarking.",
    businessValue:
      "Ensures apples-to-apples performance comparisons, drives competitive excellence across lines, and eliminates debate over metrics.",
  },

  "s3-curated": {
    id: "s3-curated",
    type: "model",
    title: "Curated Analytical Schemas (Schemas)",
    badgeText: "STAGE 3 • ANALYTICAL SCHEMAS",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    accentColor: "text-indigo-600",
    whatItIs:
      "Specialized, denormalized data schemas pre-indexed for high-speed multi-dimensional queries, instant filtering, and period-over-period variance bridges.",
    howItWorks: [
      "Organizes data into pre-joined dimensional cubes covering Product, Plant, Line, Shift, and Time dimensions.",
      "Pre-calculates delta variances (ΔCost, ΔYield, ΔVolume) between selected periods.",
      "Optimizes query execution to deliver sub-second responses for interactive dashboards and AI investigation prompts.",
      "Maintains data integrity through automated consistency checks against underlying fact tables.",
      "Provides clean semantic data views designed specifically for executive reporting and self-service analytics.",
    ],
    informationUsed:
      "Indexed fact views, materialized analytical rollups, dimensional hierarchies, historical variance cubes.",
    managementGets:
      "Zero-wait exploratory analytics with instant slicing by plant, line, supplier, or product model.",
    businessValue:
      "Transforms sluggish batch reporting into live, interactive decision workspaces for executive leadership.",
  },

  // ================= STAGE 4 & SUB-ELEMENTS (DEFAULT SELECTION) =================
  "stage-4": {
    id: "stage-4",
    type: "stage",
    title: "Stage 04: Insights & Analytics Layer",
    badgeText: "STAGE 4 • INSIGHTS & ANALYTICS",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    accentColor: "text-blue-600",
    whatItIs:
      "The intelligence core of the platform. Combines mathematical variance decomposition with AI root cause investigations to uncover why manufacturing costs and yields changed.",
    howItWorks: [
      "Analyzes cost and yield movements between the current reporting period and baseline benchmarks.",
      "Decomposes cost variances mathematically into Volume Effect, Operational Rate/Usage, and Yield Loss.",
      "Explores all manufacturing dimensions (Plant, Line, Product SKU, Supplier, Component) to isolate primary drivers.",
      "Ranks each driver by quantified financial dollar impact with zero unexplained residual.",
      "Delivers clear executive findings and prioritized corrective actions grounded in concrete data.",
    ],
    informationUsed:
      "Committed line cost batches, hourly MES logs, serialized inspection records, BOM cost standards, supplier catalogs.",
    managementGets:
      "Instant answers to why costs rose or yield fell, complete mathematical certainty without guesswork, and clear operational recommendations.",
    businessValue:
      "Replaces weeks of manual spreadsheet investigation with instant, mathematically verified root causes that protect factory profitability.",
  },

  "s4-dash": {
    id: "s4-dash",
    type: "analytics",
    title: "Manufacturing Dashboards & Reports",
    badgeText: "STAGE 4 • EXECUTIVE VISIBILITY",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    accentColor: "text-sky-600",
    whatItIs:
      "Executive visual command centers that track total manufacturing spend, line pacing, first pass yield, and operational efficiency across all plants in real time.",
    howItWorks: [
      "Visualizes factory performance trends through interactive cost waterfalls, yield heatmaps, and category breakdowns.",
      "Enables plant managers to filter by facility (Plant A, Plant B), assembly line, product family, and calendar period.",
      "Highlights lines falling below the corporate 98.5% yield target with automated color-coded alerts.",
      "Tracks month-over-month cost trajectories across Material, Labour, Machine, Energy, and Scrap.",
      "Generates standardized PDF and digital executive summary decks for leadership operational reviews.",
    ],
    informationUsed:
      "Pre-aggregated factory fact cubes, plant targets, monthly cost summaries, line efficiency indices.",
    managementGets:
      "Immediate high-level situational awareness across all manufacturing assets, with intuitive drill-down into specific problem areas.",
    businessValue:
      "Keeps operations and executive leadership aligned on real factory performance, accelerating monthly review cycles.",
  },

  "s4-rca": {
    id: "s4-rca",
    type: "analytics",
    title: "AI Investigations & Root Cause Analysis",
    badgeText: "STAGE 4 • RCA INTELLIGENCE ENGINE",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    accentColor: "text-blue-600",
    whatItIs:
      "An intelligent root cause investigation engine that analyzes manufacturing cost movement using deterministic variance mathematics and AI explanations with business-ready recommendations.",
    howItWorks: [
      "Calculates exact net cost movement (total spend or cost per good unit) between selected periods.",
      "Decomposes variances across core cost categories (material, labour, machine, energy, scrap & rework).",
      "Investigates key drivers across product, plant, line, supplier, and BOM component dimensions.",
      "Quantifies the precise financial dollar impact and percentage contribution of each driver.",
      "Synthesizes confirmed causes, correlations, and recommended corrective action playbooks.",
    ],
    informationUsed:
      "line_cost_batches, hourly_production_logs, serialized_quality_inspections, bom_components, dim_products, dim_plants.",
    managementGets:
      "A complete, mathematically verified variance bridge that explains exactly what caused cost increases, backed by actionable recommendations.",
    businessValue:
      "Empowers plant leaders to identify why costs moved in minutes rather than spending weeks compiling manual variance spreadsheets.",
  },

  "s4-analytics": {
    id: "s4-analytics",
    type: "analytics",
    title: "Self-Service Analytics & Deep Exploration",
    badgeText: "STAGE 4 • SELF-SERVICE EXPLORATION",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    accentColor: "text-indigo-600",
    whatItIs:
      "An interactive exploratory environment enabling engineers, quality specialists, and plant controllers to slice, dice, compare, and investigate operational records freely.",
    howItWorks: [
      "Allows multidimensional cross-filtering by product SKU, assembly line, workstation, supplier, and shift.",
      "Enables flexible side-by-side period comparisons (e.g., November MTD vs October baseline).",
      "Performs correlation analysis between machine maintenance events and subsequent inspection failure spikes.",
      "Provides ad-hoc table exports and granular transaction-level drill-down capabilities.",
      "Supports what-if simulation to estimate cost savings from prospective yield recoveries or supplier renegotiations.",
    ],
    informationUsed:
      "Granular shopfloor event logs, component-level issue tickets, workstation sensor readings, supplier invoice batches.",
    managementGets:
      "Unrestricted analytical freedom for domain specialists to validate hypotheses without requiring custom database queries.",
    businessValue:
      "Fosters a culture of proactive, data-led problem solving among shopfloor engineers and operational supervisors.",
  },

  // ================= STAGE 5 & SUB-ELEMENTS =================
  "stage-5": {
    id: "stage-5",
    type: "stage",
    title: "Stage 05: Business Outcomes Layer",
    badgeText: "STAGE 5 • BUSINESS IMPACT",
    badgeColor: "bg-orange-50 text-orange-700 border-orange-200",
    accentColor: "text-orange-600",
    whatItIs:
      "The business impact layer. Translates verified diagnostic findings into prioritized management decisions, proactive factory alerts, and continuous operational improvement playbooks.",
    howItWorks: [
      "Synthesizes complex analytical findings into executive decision briefs and assignable action playbooks.",
      "Triggers proactive early warnings when line defect rates or cost variances breach defined thresholds.",
      "Prioritizes corrective actions (P1 Critical, P2 High, P3 Medium) based on financial recovery potential.",
      "Monitors post-remediation factory batches to verify that implemented fixes actually recover margin.",
      "Tracks progress toward corporate operational targets, including the 98.5% First Pass Yield benchmark.",
    ],
    informationUsed:
      "Investigation findings, plant cost targets, alert ledgers, corrective action tracking records, historical baselines.",
    managementGets:
      "Clear, prioritized action roadmaps that link operational corrections directly to verified dollar savings on the factory floor.",
    businessValue:
      "Closes the loop from problem identification to financial recovery, ensuring cost reductions appear in financial statements.",
  },

  "s5-decisions": {
    id: "s5-decisions",
    type: "outcome",
    title: "Data-Driven Manufacturing Decisions",
    badgeText: "STAGE 5 • EXECUTIVE ALIGNMENT",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    accentColor: "text-amber-600",
    whatItIs:
      "Executive decision frameworks that replace intuition with verified facts, providing leadership with mathematically reconciled evidence for operational choices.",
    howItWorks: [
      "Consolidates complex multi-line performance data into clear executive summaries.",
      "Provides verified financial evidence supporting capital investment, tooling replacement, or vendor changes.",
      "Aligns plant managers, quality directors, and finance controllers around a single set of audited figures.",
      "Evaluates trade-offs between overtime production costs and outsourced manufacturing alternatives.",
      "Documents decision rationales with linked analytical evidence for governance and auditability.",
    ],
    informationUsed:
      "Executive decision reports, variance reconciliation waterfalls, line profitability rankings, capacity studies.",
    managementGets:
      "High-confidence operational consensus, reduced debate over numbers, and faster execution on cost reduction initiatives.",
    businessValue:
      "Accelerates leadership decision cycles, eliminates costly misdirected investments, and secures factory competitiveness.",
  },

  "s5-alerts": {
    id: "s5-alerts",
    type: "outcome",
    title: "Proactive Alerting & Anomaly Detection",
    badgeText: "STAGE 5 • EARLY WARNINGS",
    badgeColor: "bg-orange-50 text-orange-700 border-orange-200",
    accentColor: "text-orange-600",
    whatItIs:
      "An automated early-warning monitoring system that flags emerging quality slips, scrap spikes, and machine cycle slowdowns before they compound into major losses.",
    howItWorks: [
      "Continuously monitors incoming batch telemetry against Statistical Process Control (SPC) upper limits.",
      "Identifies early defect clusters (e.g., solder bridging rising above 1.5% on Line 3).",
      "Dispatches real-time alerts to line supervisors and plant quality leads with specific workstation context.",
      "Monitors uncosted operational run accumulations to prevent month-end financial surprises.",
      "Tracks recurrent anomalies to identify chronic equipment or supplier quality drift.",
    ],
    informationUsed:
      "Real-time inspection telemetry, hourly production declarations, upper and lower control limits, historical alert logs.",
    managementGets:
      "Early warning of factory anomalies, enabling immediate containment before entire production batches are scrapped.",
    businessValue:
      "Prevents large-scale batch write-offs, curbs scrap expenditure, and maintains assembly line continuity.",
  },

  "s5-actions": {
    id: "s5-actions",
    type: "outcome",
    title: "Process Optimization & Corrective Playbooks",
    badgeText: "STAGE 5 • OPERATIONAL RECOVERY",
    badgeColor: "bg-teal-50 text-teal-800 border-teal-200",
    accentColor: "text-teal-600",
    whatItIs:
      "Actionable engineering and maintenance playbooks that guide factory teams through specific corrective steps to eliminate bottlenecks, recover yield, and reduce manufacturing costs.",
    howItWorks: [
      "Generates targeted recommendations (e.g., optical sensor recalibration, line rebalancing, vendor price audit).",
      "Assigns prioritized playbooks with designated department ownership and target completion dates.",
      "Calculates projected dollar savings and return-on-investment for each recommended remediation.",
      "Verifies post-implementation performance by comparing subsequent production runs against pre-fix baselines.",
      "Builds an organizational knowledge base of proven corrective solutions for recurring plant challenges.",
    ],
    informationUsed:
      "Corrective action ledgers, equipment maintenance history, engineering change logs, post-audit savings verification records.",
    managementGets:
      "A structured, accountable mechanism to convert analytical insights into verified operational and financial improvements.",
    businessValue:
      "Delivers sustained cost reduction, elevates First Pass Yield toward 98.5%, and drives continuous manufacturing excellence.",
  },

  // ================= 5 MANUFACTURING PROBLEMS =================
  "prob-01": {
    id: "prob-01",
    type: "problem",
    title: "Problem 01: Manufacturing Cost Increases",
    badgeText: "PROBLEM 01 • COST INCREASES",
    badgeColor: "bg-red-50 text-red-700 border-red-200",
    accentColor: "text-red-600",
    whatItIs:
      "Investigates unexplained expenditure growth across production batches, factory lines, or product models, separating volume effects from true operational cost inflation.",
    howItWorks: [
      "Compares total manufacturing expenditure and cost per good unit between the active period and baseline.",
      "Decomposes variance into Production Volume Effect vs Operational Rate and Usage Variances.",
      "Isolates cost inflation across direct material, direct labour, machine depreciation, energy, and scrap/rework.",
      "Pinpoints specific product SKUs (e.g., SPH-PRO-256) and manufacturing plants driving the bulk of budget drift.",
      "Synthesizes an exact financial reconciliation bridge with zero unexplained residual.",
    ],
    informationUsed:
      "line_cost_batches, fact_manufacturing_cost, hourly_production_logs, standard unit cost cards, dim_products.",
    managementGets:
      "Complete transparency into whether cost increases were caused by higher sales volume or operational waste, backed by verified dollar figures.",
    businessValue:
      "Eliminates budget surprises, ensures department accountability, and protects gross profit margins across high-volume product lines.",
  },

  "prob-02": {
    id: "prob-02",
    type: "problem",
    title: "Problem 02: Material Cost & Procurement Variances",
    badgeText: "PROBLEM 02 • MATERIAL & PROCUREMENT",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    accentColor: "text-amber-600",
    whatItIs:
      "Audits actual shopfloor component consumption against engineering BOM requirements, separating shopfloor scrap from vendor purchase price increases.",
    howItWorks: [
      "Reconciles physical component issuance against theoretical quantities permitted by the product Bill of Materials.",
      "Identifies over-consumed components (e.g., OLED displays, microcontrollers, sensor packages).",
      "Separates shopfloor Material Usage Variance from supplier Purchase Price Variance (PPV).",
      "Ranks component cost impacts by total financial loss and percentage deviation from contract price.",
      "Generates actionable supplier renegotiation targets and inventory reconciliation recommendations.",
    ],
    informationUsed:
      "bom_components, material_consumption_logs, purchase_invoices, warehouse issuance records, dim_suppliers.",
    managementGets:
      "Clear distinction between line-side material waste and procurement price increases, highlighting exact supplier and component drivers.",
    businessValue:
      "Stops high-value component leakage, supports aggressive vendor contract negotiations, and protects bill-of-material margins.",
  },

  "prob-03": {
    id: "prob-03",
    type: "problem",
    title: "Problem 03: Yield, Scrap & Quality Losses",
    badgeText: "PROBLEM 03 • YIELD & QUALITY LOSSES",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    accentColor: "text-purple-600",
    whatItIs:
      "Identifies workstations, assembly lines, and product models where defect rates and inspection failures trigger excessive scrap costs and unit cost penalties.",
    howItWorks: [
      "Calculates First Pass Yield (FPY %) and overall scrap percentages across all active assembly lines.",
      "Identifies underperforming lines operating below the corporate 98.5% yield benchmark.",
      "Analyzes serialized defect pareto classifications (e.g., solder bridging, surface scratches, alignment errors).",
      "Quantifies direct scrap expenditure and unit cost uplift incurred by manufacturing non-conforming units.",
      "Recommends targeted fixture recalibration, optical sensor tuning, and station inspection protocols.",
    ],
    informationUsed:
      "serialized_quality_inspections, quality_rework_events, dim_defect_taxonomy, line_cost_batches.",
    managementGets:
      "Itemized defect pareto analysis, station-level scrap attribution, and the exact dollar penalty added to unit production costs.",
    businessValue:
      "Recovers good units from reworkable batches, reduces scrap write-offs, and lifts plant yield toward the corporate benchmark.",
  },

  "prob-04": {
    id: "prob-04",
    type: "problem",
    title: "Problem 04: Production Inefficiencies & Downtime",
    badgeText: "PROBLEM 04 • PRODUCTION INEFFICIENCIES",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    accentColor: "text-sky-600",
    whatItIs:
      "Examines hourly factory pacing, equipment downtime, and uncosted operational production runs to bridge the gap between MES factory declarations and ERP financials.",
    howItWorks: [
      "Evaluates gross produced units against rated line capacities across 24-hour shift rotations.",
      "Detects cycle time slowdowns, bottleneck assembly stations, and unscheduled micro-stoppages.",
      "Reconciles MES hourly operational logs against financial cost accounting batches.",
      "Audits costing coverage gaps between operational units and ERP costed batches (e.g., uncosted units).",
      "Proposes line rebalancing and shift optimization playbooks to sustain planned manufacturing throughput.",
    ],
    informationUsed:
      "hourly_production_logs, machine_runtime_telemetry, shift_schedules, work_order_completion_ledgers, dim_lines.",
    managementGets:
      "Clear identification of production bottlenecks, uncosted volume discrepancies, and shift productivity variances.",
    businessValue:
      "Maximizes machine asset utilization, eliminates hidden factory downtime, and ensures 100% financial costing coverage.",
  },

  "prob-05": {
    id: "prob-05",
    type: "problem",
    title: "Problem 05: Testing & Inspection Losses",
    badgeText: "PROBLEM 05 • TESTING & INSPECTION",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    accentColor: "text-rose-600",
    whatItIs:
      "Pinpoints high-fallout test stations, sensor calibration drift, functional test failures, and false-rejections that cause unnecessary component scrapping.",
    howItWorks: [
      "Tracks end-of-line functional test pass rates and diagnostic measurements across test fixtures.",
      "Distinguishes true physical component failures from test equipment false-rejects (Alpha risk).",
      "Audits automated optical inspection (AOI) false-call rates against physical rework inspection results.",
      "Quantifies diagnostic cycle time overhead and testing station scrap cost impact.",
      "Recommends automated test fixture recalibration and preventative fixture maintenance procedures.",
    ],
    informationUsed:
      "serialized_quality_inspections, test_station_telemetry, calibration_logs, scrap_ledgers, station_maintenance_records.",
    managementGets:
      "Clear separation of true component defects from test fixture errors, preventing compliant assemblies from being discarded.",
    businessValue:
      "Saves thousands of compliant units from being scrapped unnecessarily and optimizes functional testing throughput.",
  },
};

/**
 * DEFAULT INITIAL SELECTION:
 * Stage 4 — Insights & Analytics with introduction to the Manufacturing Cost RCA engine.
 */
export const DEFAULT_INITIAL_SELECTION = ARCHITECTURE_DETAILS["s4-rca"];

// Fallback for Heatmap component
export const HEATMAP_STATIC_FALLBACK = [
  {
    plant: "Plant A",
    line: "Line 1",
    lineFull: "Plant A - Line 1",
    totalUnits: "503,120 units",
    dotColor: "bg-emerald-500",
    aug: { yieldPct: "98.1%", yield_pct: "98.1%", units: "241,048", tier: "low" },
    sep: { yieldPct: "98.1%", yield_pct: "98.1%", units: "231,350", tier: "mid" },
    oct: { yieldPct: "98.1%", yield_pct: "98.1%", units: "238,396", tier: "mid" },
    nov: { yieldPct: "98.5%", yield_pct: "98.5%", units: "240,112", tier: "high" },
    target: "≥ 98.5%",
  },
  {
    plant: "Plant A",
    line: "Line 2",
    lineFull: "Plant A - Line 2",
    totalUnits: "408,560 units",
    dotColor: "bg-blue-500",
    aug: { yieldPct: "98.2%", yield_pct: "98.2%", units: "166,327", tier: "mid" },
    sep: { yieldPct: "98.1%", yield_pct: "98.1%", units: "161,539", tier: "mid" },
    oct: { yieldPct: "98.1%", yield_pct: "98.1%", units: "167,711", tier: "mid" },
    nov: { yieldPct: "98.4%", yield_pct: "98.4%", units: "168,905", tier: "mid" },
    target: "≥ 98.5%",
  },
  {
    plant: "Plant B",
    line: "Line 1",
    lineFull: "Plant B - Line 1",
    totalUnits: "483,618 units",
    dotColor: "bg-emerald-500",
    aug: { yieldPct: "98.1%", yield_pct: "98.1%", units: "241,783", tier: "low" },
    sep: { yieldPct: "98.1%", yield_pct: "98.1%", units: "236,091", tier: "mid" },
    oct: { yieldPct: "98.1%", yield_pct: "98.1%", units: "242,464", tier: "mid" },
    nov: { yieldPct: "98.6%", yield_pct: "98.6%", units: "244,071", tier: "high" },
    target: "≥ 98.5%",
  },
  {
    plant: "Plant B",
    line: "Line 2",
    lineFull: "Plant B - Line 2",
    totalUnits: "334,475 units",
    dotColor: "bg-amber-500",
    aug: { yieldPct: "98.2%", yield_pct: "98.2%", units: "166,863", tier: "mid" },
    sep: { yieldPct: "98.2%", yield_pct: "98.2%", units: "162,991", tier: "mid" },
    oct: { yieldPct: "98.2%", yield_pct: "98.2%", units: "167,621", tier: "mid" },
    nov: { yieldPct: "98.5%", yield_pct: "98.5%", units: "168,930", tier: "high" },
    target: "≥ 98.5%",
  },
];
