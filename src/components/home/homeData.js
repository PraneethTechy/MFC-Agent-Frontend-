/**
 * Manufacturing Cost RCA Home Page Data Specifications
 * Grounded in actual GWC DATA.AI Manufacturing Cost Root-Cause Analysis Agent architecture.
 * Explanatory, domain-rich content with zero fabricated numerical KPIs or mock data.
 */

export const SYSTEM_ARCHITECTURE_LAYERS = [
  {
    id: "layer-1-sources",
    layerNum: 1,
    name: "Data Sources",
    title: "1. Data Sources",
    shortName: "1 Data Sources",
    subtitle: "Manufacturing information from across the factory",
    tagline: "Manufacturing information from across the factory",
    headerBg: "bg-blue-600",
    circleBg: "bg-blue-500 text-white",
    iconType: "factory",
    cardBorder: "border-blue-200 dark:border-blue-900/60",
    badge: "STAGE 1 • DATA SOURCES",
    items: [
      { name: "Manufacturing Cost", sub: "Line Cost Batches" },
      { name: "Hourly Production", sub: "MES Output Logs" },
      { name: "BOM & Components", sub: "Standard Specs" },
      { name: "Quality Inspection", sub: "Defect Pareto Logs" },
      { name: "Material & Inventory", sub: "PO & Consumption" },
      { name: "More (5)", sub: "Workforce & Machine" },
    ],
    whatItDoes:
      "Brings together manufacturing information from different operations so the business can understand production costs, output, material usage, equipment performance and product quality in one place.",
    whatHappensHere: [
      "Collects manufacturing cost and production records from factory operations.",
      "Brings together product, component and Bill of Materials (BOM) information.",
      "Captures material consumption, inventory and supplier-related information.",
      "Includes equipment performance, energy usage and workforce information where available.",
      "Connects quality inspection and smartphone testing records to manufacturing activities.",
    ],
    inputs:
      "Manufacturing cost, production records, BOM, material and inventory data, supplier information, equipment, workforce and quality records.",
    outputs:
      "A consolidated view of the available manufacturing information, ready for validation and analysis.",
    businessValue:
      "Gives management a broader view of factory operations instead of relying on disconnected reports and spreadsheets.",
  },
  {
    id: "layer-2-ingestion",
    layerNum: 2,
    name: "Data Ingestion",
    title: "2. Data Ingestion & Validation",
    shortName: "2 Data Ingestion",
    subtitle: "Preparing manufacturing data for reliable analysis",
    tagline: "Preparing manufacturing data for reliable analysis",
    headerBg: "bg-purple-600",
    circleBg: "bg-purple-600 text-white",
    iconType: "cloud",
    cardBorder: "border-purple-200 dark:border-purple-900/60",
    badge: "STAGE 2 • INGESTION & PIPELINE",
    items: [
      { name: "File Upload", sub: "Streaming Chunk Ingest" },
      { name: "Schema Validation", sub: "Pydantic v2 Type Check" },
      { name: "Data Quality Checks", sub: "14 Integrity Rules" },
      { name: "Standardization", sub: "Currency & Unit Align" },
      { name: "Dataset Mapping", sub: "40+ Synonym Matcher" },
      { name: "Staging & Validation", sub: "Safe Ingestion Sandbox" },
    ],
    whatItDoes:
      "Checks and prepares incoming manufacturing data so that information from different sources can be consistently understood and used by the RCA engine.",
    whatHappensHere: [
      "Accepts manufacturing data uploaded by users.",
      "Checks whether the required information and fields are available.",
      "Identifies missing, inconsistent, duplicate or invalid records.",
      "Standardizes dates, units, formats and field names where applicable.",
      "Prepares validated records for investigation while keeping unapproved uploads separate from committed business data.",
    ],
    inputs:
      "Uploaded CSV and Excel files and other supported manufacturing data sources.",
    outputs:
      "Validated and standardized manufacturing records, with data-quality issues identified for review.",
    businessValue:
      "Reduces the risk of incorrect conclusions caused by incomplete, inconsistent or poorly prepared data.",
  },
  {
    id: "layer-3-intelligence",
    layerNum: 3,
    name: "RCA Intelligence Engine",
    title: "3. AI RCA Intelligence Engine",
    shortName: "3 RCA Intelligence Engine",
    subtitle: "Finding and explaining the reasons behind manufacturing cost and operational changes",
    tagline: "Finding and explaining the reasons behind manufacturing cost and operational changes",
    headerBg: "bg-[#4c1d95]",
    circleBg: "bg-purple-500 text-white",
    isCentralStage: true,
    iconType: "chip",
    cardBorder: "border-purple-500 shadow-purple-500/20",
    badge: "STAGE 3 • RCA INTELLIGENCE ENGINE",
    items: [
      { name: "Deterministic Calculations", sub: "Zero-Residual Variance" },
      { name: "Dynamic Investigation", sub: "Intelligent Pathway Scoping" },
      { name: "RCA Dimension Selection", sub: "Multi-factor Scoring" },
      { name: "Evidence Analysis", sub: "4-Tier ACH Verification" },
      { name: "Domo AI Explanation", sub: "Executive Synthesis" },
      { name: "Root-Cause Prioritization", sub: "Impact-Weighted Ranking" },
    ],
    whatItDoes:
      "Investigates manufacturing problems by analyzing relevant cost, production, material, quality, equipment, workforce and supplier information to identify evidence-backed root causes.",
    whatHappensHere: [
      "Calculates manufacturing cost, production and operational performance using deterministic calculations.",
      "Identifies which RCA dimensions are relevant to the reported problem.",
      "Examines relevant records across available datasets and time periods.",
      "Connects supporting evidence and distinguishes confirmed findings from correlations or possible explanations.",
      "Quantifies the impact where the available data supports it and prioritizes corrective actions.",
    ],
    inputs:
      "Available manufacturing data, investigation period, selected filters and the problem described by the user.",
    outputs:
      "Prioritized root-cause findings, supporting evidence, quantified impact where possible, and recommended corrective actions.",
    businessValue:
      "Helps management move beyond identifying that a cost or production metric has changed to understanding what contributed to the change and where corrective action may be needed.",
  },
  {
    id: "layer-4-governance",
    layerNum: 4,
    name: "Governance",
    title: "4. Governance & Data Platform",
    shortName: "4 Governance",
    subtitle: "Protecting the reliability and traceability of manufacturing information",
    tagline: "Protecting the reliability and traceability of manufacturing information",
    headerBg: "bg-blue-600",
    circleBg: "bg-blue-600 text-white",
    iconType: "database",
    cardBorder: "border-blue-200 dark:border-blue-900/60",
    badge: "STAGE 4 • GOVERNANCE & PLATFORM",
    items: [
      { name: "Approve & Commit", sub: "Dual-Signoff Gate" },
      { name: "Global Store", sub: "Neon PostgreSQL DB" },
      { name: "Current Upload Store", sub: "Staging Sandbox" },
      { name: "Data Provenance", sub: "Full Lineage Tracking" },
      { name: "Audit & Traceability", sub: "Immutable Change Logs" },
    ],
    whatItDoes:
      "Maintains a clear separation between newly uploaded data and approved business data, while preserving the origin and history of information used in investigations.",
    whatHappensHere: [
      "Keeps newly uploaded records in the Current Upload Store until approval.",
      "Maintains committed manufacturing records in the Global Store.",
      "Requires explicit approval through Approve & Commit before promoting eligible uploaded data.",
      "Tracks where data comes from and whether it is committed, staged or synthetic test data.",
      "Maintains traceability for data changes and investigation results through the existing system controls.",
    ],
    inputs:
      "Validated uploads, committed manufacturing records, approval decisions and data-origin information.",
    outputs:
      "Clearly separated staged and committed data, with traceable data sources and approval status.",
    businessValue:
      "Helps management trust investigation results by making it clear which data was used, where it came from and whether it was approved for business use.",
  },
  {
    id: "layer-5-applications",
    layerNum: 5,
    name: "Business Applications",
    title: "5. Business Applications",
    shortName: "5 Business Applications",
    subtitle: "Turning investigation findings into business decisions",
    tagline: "Turning investigation findings into business decisions",
    headerBg: "bg-emerald-600",
    circleBg: "bg-emerald-600 text-white",
    iconType: "chart",
    cardBorder: "border-emerald-200 dark:border-emerald-900/60",
    badge: "STAGE 5 • BUSINESS APPLICATIONS",
    items: [
      { name: "Overview", sub: "Executive KPI Cockpit" },
      { name: "Cost Analysis", sub: "Variance Waterfall & Bridge" },
      { name: "Product Analysis", sub: "SKU Unit Economics" },
      { name: "Component Analysis", sub: "PPV & Supplier Scoring" },
      { name: "Production & Quality", sub: "FPY & Defect Heatmaps" },
      { name: "AI Investigations", sub: "Ad-Hoc Conversational RCA" },
      { name: "Reports", sub: "Immutable Audit Snapshots" },
    ],
    whatItDoes:
      "Presents manufacturing performance, cost analysis and RCA findings through the application's business-facing dashboards, analysis pages and reports.",
    whatHappensHere: [
      "Presents manufacturing cost, production and quality performance.",
      "Helps users explore cost changes across products, plants, lines and components.",
      "Provides access to AI-assisted investigations for specific manufacturing problems.",
      "Displays root causes, supporting evidence and recommended improvement actions.",
      "Keeps investigation reports available for management review and follow-up.",
    ],
    inputs:
      "Committed manufacturing data, investigation parameters and RCA findings.",
    outputs:
      "Manufacturing dashboards, cost and operational analysis, investigation reports and prioritized improvement recommendations.",
    businessValue:
      "Enables management to understand factory performance, investigate emerging problems and make better-informed operational decisions.",
  },
];

export const MANUFACTURING_PROBLEMS = [
  {
    id: "prob-cost-increases",
    title: "Manufacturing Cost Increases",
    desc: "Understand why manufacturing cost per good smartphone increased across specific production runs, isolating overhead under-absorption vs spending increases.",
    icon: "Coins",
    iconColor: "text-amber-500",
    bgIcon: "bg-amber-100 dark:bg-amber-950/60",
    whatItDoes:
      "Decomposes sudden or sustained surges in cost per good smartphone into distinct spending, volume under-absorption, and scrap components.",
    whatHappensHere: [
      "Calculates exact batch cost delta against standard costing baselines.",
      "Separates fixed plant overhead under-absorption from direct material and labor surges.",
      "Identifies anomalous production runs exceeding ±2 standard deviations.",
      "Correlates cost jumps with line stoppage logs and cycle time slowdowns.",
      "Quantifies total financial exposure in Lakhs / Crores INR.",
    ],
    inputs: "Line cost batches, ERP standard cost ledgers, production order actuals.",
    outputs: "Root-cause cost bridge, volume vs spending split, quantified exposure.",
    businessValue: "Pinpoints exact drivers of gross margin compression without guesswork.",
  },
  {
    id: "prob-material-variances",
    title: "Material Consumption & Procurement Variances",
    desc: "Investigate component purchase price increases (PPV), excess line consumption, dispense creep, and engineering BOM scrap factor deviations.",
    icon: "Settings",
    iconColor: "text-purple-500",
    bgIcon: "bg-purple-100 dark:bg-purple-950/60",
    whatItDoes:
      "Isolates Purchase Price Variances (PPV) from shopfloor dispense excess, component shrinkage, and engineering BOM revisions.",
    whatHappensHere: [
      "Compares actual PO purchase unit prices against negotiated standard contract prices.",
      "Tracks physical component consumption against engineering BOM standard usage.",
      "Isolates dispense losses, reel feeder errors, and component shrinkage.",
      "Flags supplier-specific lots exhibiting abnormal scrap or consumption rates.",
      "Computes net PPV savings opportunity from supplier contract enforcement.",
    ],
    inputs: "PO invoices, BOM component records, material pick & dispense logs.",
    outputs: "PPV decomposition, BOM deviation flags, supplier penalty claims.",
    businessValue: "Eliminates material waste and recovers vendor procurement overcharges.",
  },
  {
    id: "prob-yield-scrap",
    title: "Yield, Scrap & Quality Losses",
    desc: "Identify scrap, component rejection, rework bay labor spikes, and first-pass yield (FPY) deterioration across SMT and FAL assembly stations.",
    icon: "Award",
    iconColor: "text-blue-500",
    bgIcon: "bg-blue-100 dark:bg-blue-950/60",
    whatItDoes:
      "Identifies root causes of first-pass yield (FPY) decay, component write-offs, and rework bay labor accumulation across assembly lines.",
    whatHappensHere: [
      "Builds defect Pareto distributions across stations S01 through S06 (SMT to FAL).",
      "Pinpoints top defect signatures (DEF-002 solder bridging, DEF-005 optical misalign).",
      "Measures rework loop time, technician hours, and component replacement costs.",
      "Evaluates incoming component batch quality against downstream rejection rates.",
      "Recommends specific machine calibration and feeder replacement steps.",
    ],
    inputs: "Quality inspection logs, defect Pareto tables, rework repair tickets.",
    outputs: "Station defect Pareto, yield recovery curve, station-level remediation.",
    businessValue: "Recovers lost line capacity and reduces expensive secondary rework.",
  },
  {
    id: "prob-production-inefficiencies",
    title: "Production Inefficiencies & Downtime",
    desc: "Investigate line performance, production output shortfalls, capacity constraints, micro-stoppages, and machine cycle efficiency where data exists.",
    icon: "Clock",
    iconColor: "text-cyan-500",
    bgIcon: "bg-cyan-100 dark:bg-cyan-950/60",
    whatItDoes:
      "Investigates hourly line throughput drops, micro-stoppages, unscheduled downtime, and cycle time degradation.",
    whatHappensHere: [
      "Analyzes hourly output logs against rated line nameplate capacity (units/hour).",
      "Categorizes downtime causes (feeder jams, nozzle clogs, changeover delays).",
      "Calculates Overall Equipment Effectiveness (OEE) and availability indices.",
      "Determines hourly productivity loss and overhead penalty per hour down.",
      "Proposes line balancing and preventive maintenance schedule optimizations.",
    ],
    inputs: "MES hourly telemetry, machine event logs, maintenance work orders.",
    outputs: "Downtime root cause ranking, OEE loss attribution, maintenance playbooks.",
    businessValue: "Maximizes machine availability and boosts good unit output per shift.",
  },
  {
    id: "prob-workforce-energy",
    title: "Workforce, Energy & Labour Productivity",
    desc: "Analyze operator team shifts, overtime premiums incurred during catch-up runs, and reflow oven power consumption across manufacturing runs.",
    icon: "Zap",
    iconColor: "text-amber-500",
    bgIcon: "bg-amber-100 dark:bg-amber-950/60",
    whatItDoes:
      "Analyzes operator shift productivity, overtime cost premiums, and reflow oven energy spikes across manufacturing runs.",
    whatHappensHere: [
      "Measures standard labor hours vs actual logged hours per production batch.",
      "Evaluates overtime premiums incurred during weekend or catch-up shifts.",
      "Correlates operator team shifts with station quality and throughput rates.",
      "Tracks kilowatt-hour (kWh) power consumption for SMT reflow and nitrogen lines.",
      "Identifies energy waste during idle standby and unoptimized shift changeovers.",
    ],
    inputs: "Labor timecards, shift logs, sub-meter power readings, utility bills.",
    outputs: "Labor efficiency variance, overtime penalty report, energy reduction plan.",
    businessValue: "Reduces unbudgeted overtime and lowers plant carbon and energy costs.",
  },
  {
    id: "prob-testing-inspection",
    title: "Smartphone Testing & Inspection Losses",
    desc: "Investigate smartphone functional testing failures, RF/audio calibration drift, camera test false-rejects, and inspection station bottlenecks.",
    icon: "FlaskConical",
    iconColor: "text-rose-500",
    bgIcon: "bg-rose-100 dark:bg-rose-950/60",
    whatItDoes:
      "Investigates automated optical inspection (AOI) false rejects, RF calibration drift, display test dropouts, and final testing bottlenecks.",
    whatHappensHere: [
      "Tracks test station failure rates across RF, Audio, Camera, and Display test bays.",
      "Distinguishes true functional defects from test jig and calibration drift.",
      "Measures re-test cycle times and secondary confirmation queue bottlenecks.",
      "Correlates test failures with firmware flashing versions and ambient test conditions.",
      "Optimizes test jig calibration intervals to prevent unnecessary rework routing.",
    ],
    inputs: "AOI test logs, RF calibration station data, functional test results.",
    outputs: "False-reject diagnostic, test jig drift timeline, calibration guide.",
    businessValue: "Eliminates testing bottlenecks and avoids re-inspecting good smartphones.",
  },
];
