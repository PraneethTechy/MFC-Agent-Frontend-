/**
 * Authoritative Architecture Component Registry
 * Contains verified metadata, data lineage, and code references for the
 * GWC DATA.AI Manufacturing Intelligence Platform.
 * 
 * Statuses:
 * - 'implemented': Fully operational in codebase & live Neon PostgreSQL
 * - 'partial': Operational in backend or calculation, but partial UI/tool exposure
 * - 'planned': Architecture-ready design, pending data ingestion or migration
 */

export const LAYERS = [
  { id: "all", label: "All Layers", color: "text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-300" },
  { id: "layer-1", label: "1. Data Sources", color: "text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300" },
  { id: "layer-2", label: "2. Ingestion & Integration", color: "text-cyan-700 bg-cyan-50 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300" },
  { id: "layer-3", label: "3. Data Platform & Governance", color: "text-indigo-700 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300" },
  { id: "layer-4", label: "4. Intelligence & Investigation Core", color: "text-purple-700 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300" },
  { id: "layer-5", label: "5. Business Applications", color: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300" },
  { id: "layer-6", label: "6. Feedback Loop", color: "text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300" },
];

export const STATUS_FILTERS = [
  { id: "all", label: "All Statuses" },
  { id: "implemented", label: "Implemented", badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800" },
  { id: "partial", label: "Partial", badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800" },
  { id: "planned", label: "Planned", badge: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700" },
];

export const ARCHITECTURE_COMPONENTS = {
  // =========================================================================
  // LAYER 1: MANUFACTURING DATA SOURCES
  // =========================================================================
  "source-cost-batches": {
    id: "source-cost-batches",
    layer: "layer-1",
    layerName: "Layer 1 — Manufacturing Data Sources",
    name: "Manufacturing Cost Batches",
    shortDesc: "Batch-level production expenditure ledgers",
    status: "implemented",
    category: "Cost Accounting",
    icon: "Coins",
    longDesc: "Captures transactional shopfloor expenditure records across direct material, shift labor, machine runtime, factory power, and quality defect scrap per production batch.",
    inputs: [
      "ERP General Ledger batch postings (SAP / Oracle)",
      "Shopfloor work-center cost allocations (CSV / Excel)",
      "Standard cost versions & exchange rates"
    ],
    processing: [
      "Ingestion via streaming file parser with SHA-256 batch checksum",
      "Cost element decomposition (Material, Labor, Machine, Energy, Scrap)",
      "Currency standardization and timestamp indexing"
    ],
    outputs: [
      "line_cost_batches fact table (9,502 rows)",
      "Batch-level unit cost baselines",
      "Direct cost category totals"
    ],
    upstreamIds: [],
    downstreamIds: ["ingest-file-upload", "ingest-schema-validator"],
    techRef: {
      frontend: "ui/src/pages/DataImportStudio.jsx",
      backend: "backend/app/models/real_datasets.py (LineCostBatchRecord)",
      api: "POST /api/import/upload",
      db: "public.line_cost_batches (9,502 committed records)",
      aiTool: "get_cost_summary, rank_cost_drivers"
    },
    route: "/upload"
  },

  "source-hourly-production": {
    id: "source-hourly-production",
    layer: "layer-1",
    layerName: "Layer 1 — Manufacturing Data Sources",
    name: "Hourly Production Logs",
    shortDesc: "Shopfloor MES hourly throughput & downtime",
    status: "implemented",
    category: "MES Telemetry",
    icon: "Activity",
    longDesc: "Tracks hourly operational manufacturing telemetry from SMT and Final Assembly (FAL) lines, logging target vs actual output, good units, reject counts, and downtime minutes.",
    inputs: [
      "MES automated counter telemetry feeds",
      "Shift operator hourly production logs (Shift 1, 2, 3)",
      "Line runtime status signals & stoppage codes"
    ],
    processing: [
      "Hourly timestamp alignment and line synchronization",
      "Target velocity vs actual output calculation",
      "Stoppage duration aggregation and reject rate tracking"
    ],
    outputs: [
      "hourly_production_logs fact table (13,332 rows)",
      "Line throughput actuals by plant and line code",
      "Uncosted operational run gap alerts"
    ],
    upstreamIds: [],
    downstreamIds: ["ingest-file-upload", "ingest-schema-validator"],
    techRef: {
      frontend: "ui/src/pages/DataImportStudio.jsx",
      backend: "backend/app/models/real_datasets.py (HourlyProductionLogRecord)",
      api: "POST /api/import/upload",
      db: "public.hourly_production_logs (13,332 committed records)",
      aiTool: "calculate_variance_bridge, analyze_cost_movement"
    },
    route: "/upload"
  },

  "source-bom-components": {
    id: "source-bom-components",
    layer: "layer-1",
    layerName: "Layer 1 — Manufacturing Data Sources",
    name: "BOM Specifications & Revisions",
    shortDesc: "Engineering bill-of-materials and component standards",
    status: "implemented",
    category: "Engineering / PLM",
    icon: "Boxes",
    longDesc: "Maintains engineering bill-of-materials structures for smartphone SKUs (SPH-A15-128, SPH-A15-256, SPH-PRO-256), component quantities, scrap factors, and revision lifecycles.",
    inputs: [
      "PLM engineering release specifications",
      "Active standard BOM cost rollups",
      "Component parent-child relationship matrices"
    ],
    processing: [
      "Multi-level BOM tree decomposition",
      "Standard component quantity tolerance validation",
      "Effective date range matching for active revisions"
    ],
    outputs: [
      "bom_component_records fact table (246 rows)",
      "Target component usage per smartphone unit",
      "Active revision specification baselines"
    ],
    upstreamIds: [],
    downstreamIds: ["ingest-file-upload", "ingest-schema-validator"],
    techRef: {
      frontend: "ui/src/pages/DataImportStudio.jsx",
      backend: "backend/app/models/real_datasets.py (BomComponentRecord)",
      api: "POST /api/import/upload",
      db: "public.bom_component_records (246 committed records)",
      aiTool: "inspect_bom_components"
    },
    route: "/upload"
  },

  "source-material-procurement": {
    id: "source-material-procurement",
    layer: "layer-1",
    layerName: "Layer 1 — Manufacturing Data Sources",
    name: "Material Procurement & POs",
    shortDesc: "Supplier purchase orders, prices and incoming lots",
    status: "implemented",
    category: "Supply Chain",
    icon: "Truck",
    longDesc: "Records purchase order receipts across 11 suppliers, tracking purchase prices, reference contract prices, landed unit costs, received quantities, and incoming rejection rates.",
    inputs: [
      "ERP Procurement PO receipts & supplier invoices",
      "Incoming quality gate inspection records (IQC)",
      "Duty and freight logistics cost postings"
    ],
    processing: [
      "Purchase price vs reference contract price matching",
      "Landed cost reconciliation (duty + freight + unit price)",
      "Incoming supplier rejection rate tallying"
    ],
    outputs: [
      "material_purchase_records fact table (996 rows)",
      "Purchase Price Variance (PPV) baselines",
      "Supplier quality scorecards"
    ],
    upstreamIds: [],
    downstreamIds: ["ingest-file-upload", "ingest-schema-validator"],
    techRef: {
      frontend: "ui/src/pages/DataImportStudio.jsx",
      backend: "backend/app/models/real_datasets.py (MaterialPurchaseRecord)",
      api: "POST /api/import/upload",
      db: "public.material_purchase_records (996 committed records)",
      aiTool: "Target: inspect_purchase_price_variance"
    },
    route: "/upload"
  },

  "source-material-consumption": {
    id: "source-material-consumption",
    layer: "layer-1",
    layerName: "Layer 1 — Manufacturing Data Sources",
    name: "Material Consumption Records",
    shortDesc: "Floor-level component issues, returns & actual scrap",
    status: "implemented",
    category: "Shopfloor Inventory",
    icon: "Layers",
    longDesc: "Tracks actual floor-level component issues and consumption across 67 BOM items, comparing issued quantities, returned unused stock, and net scrap against engineering allowances.",
    inputs: [
      "Warehouse pick lists and inventory issue dockets",
      "Line return dockets for unused materials",
      "Line scrap disposal logs"
    ],
    processing: [
      "Net consumed calculation: issued - returned quantity",
      "Variance against BOM allowed quantity per good unit",
      "Dispense over-usage and lot scrap quantification"
    ],
    outputs: [
      "material_consumption_records fact table (73,350 rows)",
      "Material Usage Variance (MUV) drivers",
      "Component-level scrap loss metrics"
    ],
    upstreamIds: [],
    downstreamIds: ["ingest-file-upload", "ingest-schema-validator"],
    techRef: {
      frontend: "ui/src/pages/DataImportStudio.jsx",
      backend: "backend/app/models/real_datasets.py (MaterialConsumptionRecord)",
      api: "POST /api/import/upload",
      db: "public.material_consumption_records (73,350 committed records)",
      aiTool: "Target: inspect_bom_consumption_variance"
    },
    route: "/upload"
  },

  "source-quality-inspection": {
    id: "source-quality-inspection",
    layer: "layer-1",
    layerName: "Layer 1 — Manufacturing Data Sources",
    name: "Quality Gate Inspections",
    shortDesc: "Serialized optical, functional & test inspection results",
    status: "implemented",
    category: "Quality Assurance",
    icon: "ShieldCheck",
    longDesc: "Captures serialized device-level inspection events across stations S01 through S06 (AOI, Functional, Display, RF, Final QC), tracking defect codes DEF-001 through DEF-010.",
    inputs: [
      "Automated Optical Inspection (AOI) machines",
      "End-of-line functional test stations",
      "Serialized device barcode scans"
    ],
    processing: [
      "First-Pass Yield (FPY) determination per line",
      "Defect code classification (Solder bridge, alignment, display)",
      "Pass / Fail / Scrap disposition logging"
    ],
    outputs: [
      "serialized_quality_inspections fact table (25,562 rows)",
      "Station-level First-Pass Yield metrics",
      "Defect Pareto distribution"
    ],
    upstreamIds: [],
    downstreamIds: ["ingest-file-upload", "ingest-schema-validator"],
    techRef: {
      frontend: "ui/src/pages/DataImportStudio.jsx",
      backend: "backend/app/models/real_datasets.py (QualityInspectionRecord)",
      api: "POST /api/import/upload",
      db: "public.serialized_quality_inspections (25,562 committed records)",
      aiTool: "Target: inspect_quality_defect_pareto"
    },
    route: "/upload"
  },

  "source-quality-rework": {
    id: "source-quality-rework",
    layer: "layer-1",
    layerName: "Layer 1 — Manufacturing Data Sources",
    name: "Quality Rework & Repairs",
    shortDesc: "Rework labor hours, repair costs & component replacement",
    status: "implemented",
    category: "Rework Operations",
    icon: "Wrench",
    longDesc: "Tracks offline rework actions performed on rejected smartphones, recording technician rework hours, replacement component costs, labor charges, and final disposition.",
    inputs: [
      "Rework station repair tickets",
      "Replacement component issue slips",
      "Technician touch-up labor hours"
    ],
    processing: [
      "Total rework cost aggregation (Labor + Material + Scrap)",
      "Correlation between initial defect code and rework labor time",
      "Secondary scrap identification"
    ],
    outputs: [
      "quality_rework_event_records fact table (4,398 rows)",
      "Line rework cost concentration metrics",
      "Repair turnaround time analytics"
    ],
    upstreamIds: [],
    downstreamIds: ["ingest-file-upload", "ingest-schema-validator"],
    techRef: {
      frontend: "ui/src/pages/DataImportStudio.jsx",
      backend: "backend/app/models/real_datasets.py (QualityReworkEventRecord)",
      api: "POST /api/import/upload",
      db: "public.quality_rework_event_records (4,398 committed records)",
      aiTool: "calculate_variance_bridge (Scrap & Rework category)"
    },
    route: "/upload"
  },

  "source-energy-telemetry": {
    id: "source-energy-telemetry",
    layer: "layer-1",
    layerName: "Layer 1 — Manufacturing Data Sources",
    name: "Energy & Utility Telemetry",
    shortDesc: "Line-level kWh meters, N2 gas and peak power draw",
    status: "planned",
    category: "Utilities & Facilities",
    icon: "Zap",
    longDesc: "Planned smart meter telemetry capturing real-time electricity consumption (kWh), peak demand tariffs, compressed air, and nitrogen (N2) gas flow for SMT reflow ovens.",
    inputs: [
      "Substation smart energy meters (IoT / Modbus)",
      "SMT reflow oven N2 gas mass flow meters",
      "Compressed air centralized compressor telemetry"
    ],
    processing: [
      "Hourly kWh allocation per active production line",
      "Peak vs off-peak tariff cost calculation",
      "Idle power draw detection during line stoppages"
    ],
    outputs: [
      "energy_consumption_records planned fact table",
      "Energy cost per good smartphone metric",
      "Off-peak shift optimization recommendations"
    ],
    upstreamIds: [],
    downstreamIds: ["ingest-file-upload"],
    techRef: {
      frontend: "Planned in Phase 3",
      backend: "backend/app/models/operational_dimensions.py (Planned)",
      api: "POST /api/import/upload (ENERGY_TELEMETRY)",
      db: "energy_consumption_records (Schema drafted in audit)",
      aiTool: "Planned: inspect_energy_telemetry"
    },
    route: "/upload"
  },

  // =========================================================================
  // LAYER 2: DATA INGESTION & INTEGRATION
  // =========================================================================
  "ingest-file-upload": {
    id: "ingest-file-upload",
    layer: "layer-2",
    layerName: "Layer 2 — Data Ingestion & Integration",
    name: "File Upload Studio",
    shortDesc: "Streaming multi-file ingestion with cryptographic hashing",
    status: "implemented",
    category: "Ingestion Pipeline",
    icon: "CloudUpload",
    longDesc: "Handles high-throughput multipart streaming uploads of CSV/Excel manufacturing datasets up to 100MB per batch, generating cryptographic SHA-256 session tokens.",
    inputs: [
      "Source data files (Cost, Production, BOM, Consumption, Purchase, Quality)",
      "User session metadata & target facility identifiers"
    ],
    processing: [
      "Streaming file inspection with encoding & delimiter detection",
      "Instant file signature validation",
      "Temporary staging session creation in import_batches"
    ],
    outputs: [
      "Session-isolated staging records in stg_* tables",
      "import_batches tracking record with UPLOADED status"
    ],
    upstreamIds: [
      "source-cost-batches",
      "source-hourly-production",
      "source-bom-components",
      "source-material-procurement",
      "source-material-consumption",
      "source-quality-inspection",
      "source-quality-rework"
    ],
    downstreamIds: ["ingest-schema-validator", "ingest-connectors"],
    techRef: {
      frontend: "ui/src/pages/DataImportStudio.jsx",
      backend: "backend/app/services/ingestion/streaming_inspector.py",
      api: "POST /api/import/upload",
      db: "public.import_batches (43 batch records)",
      aiTool: "validate_cost_data"
    },
    route: "/upload"
  },

  "ingest-connectors": {
    id: "ingest-connectors",
    layer: "layer-2",
    layerName: "Layer 2 — Data Ingestion & Integration",
    name: "Direct Database Connectors",
    shortDesc: "Enterprise SQL connectors for automated ERP sync",
    status: "partial",
    category: "Connector Framework",
    icon: "Database",
    longDesc: "Direct connector framework supporting PostgreSQL, SQL Server, MySQL, and Snowflake. Ingestion is configured; automated cron-sync pipeline is in final hardening.",
    inputs: [
      "Enterprise database credentials (SSL required)",
      "Target schema query specifications and sync schedules"
    ],
    processing: [
      "SSL-secured connection pooling",
      "Incremental delta queries based on last sync timestamp",
      "Direct staging buffer population"
    ],
    outputs: [
      "Directly staged operational records",
      "data_connectors configuration records"
    ],
    upstreamIds: ["source-cost-batches", "source-hourly-production"],
    downstreamIds: ["ingest-schema-validator"],
    techRef: {
      frontend: "ui/src/pages/DataConnectorsPage.jsx",
      backend: "backend/app/services/connectors/connector_service.py",
      api: "GET /api/connectors/test",
      db: "public.data_connectors",
      aiTool: "N/A"
    },
    route: "/connectors"
  },

  "ingest-schema-validator": {
    id: "ingest-schema-validator",
    layer: "layer-2",
    layerName: "Layer 2 — Data Ingestion & Integration",
    name: "Schema & Header Matcher",
    shortDesc: "Fuzzy synonym matching across 40+ column variants",
    status: "implemented",
    category: "Schema Alignment",
    icon: "Search",
    longDesc: "Executes fuzzy header matching against 40+ manufacturing synonym dictionaries to automatically align ERP/MES export columns to canonical target schemas.",
    inputs: [
      "Raw staged CSV/Excel column headers",
      "Master schema definitions in DATASET_SCHEMAS"
    ],
    processing: [
      "Levenshtein distance & normalized token matching",
      "Confidence scoring per matched column (e.g. 'Qty' -> 'produced_qty')",
      "Ambiguity resolution prompt for operator confirmation"
    ],
    outputs: [
      "Resolved column mapping dictionary stored in import_batches",
      "Mapped staging records ready for validation"
    ],
    upstreamIds: ["ingest-file-upload", "ingest-connectors"],
    downstreamIds: ["ingest-multi-validator"],
    techRef: {
      frontend: "ui/src/pages/DataImportStudio.jsx (ColumnMappingModal)",
      backend: "backend/app/services/ingestion/schema_matcher.py",
      api: "POST /api/import/confirm-mapping",
      db: "public.import_batches.column_mapping",
      aiTool: "validate_cost_data"
    },
    route: "/upload"
  },

  "ingest-multi-validator": {
    id: "ingest-multi-validator",
    layer: "layer-2",
    layerName: "Layer 2 — Data Ingestion & Integration",
    name: "Multi-Pass Data Validator",
    shortDesc: "14 deterministic rules checking integrity & null tolerances",
    status: "implemented",
    category: "Data Quality",
    icon: "ShieldCheck",
    longDesc: "Executes 14 multi-pass deterministic validation rules including non-negative cost checks, valid ISO dates, foreign key existence, and zero orphan logs before commit.",
    inputs: [
      "Mapped staging records in stg_* tables",
      "Data validation threshold specifications"
    ],
    processing: [
      "Rule 1–5: Structural integrity (null keys, invalid data types)",
      "Rule 6–10: Financial bounds (negative unit costs, zero produced with positive cost)",
      "Rule 11–14: Relational integrity (BOM parent exists, supplier code exists)"
    ],
    outputs: [
      "data_quality_issues itemized failure records",
      "Calculated Data Trust Score (0% – 100%)",
      "Validation scorecard on UI"
    ],
    upstreamIds: ["ingest-schema-validator"],
    downstreamIds: ["ingest-atomic-promotion"],
    techRef: {
      frontend: "ui/src/pages/DataImportStudio.jsx (ValidationCard)",
      backend: "backend/app/services/ingestion/data_validator.py",
      api: "GET /api/import/validate/{batch_id}",
      db: "public.data_quality_issues",
      aiTool: "validate_cost_data"
    },
    route: "/upload"
  },

  "ingest-atomic-promotion": {
    id: "ingest-atomic-promotion",
    layer: "layer-2",
    layerName: "Layer 2 — Data Ingestion & Integration",
    name: "Atomic Batch Promotion",
    shortDesc: "ACID transactional promotion with Strategy C audit backup",
    status: "implemented",
    category: "Data Promotion",
    icon: "CheckCircle2",
    longDesc: "Executes atomic promotion of validated staging records into production fact tables. Pre-existing records are safely archived in fact_record_history (Strategy C).",
    inputs: [
      "Validated batch authorization token",
      "Cleaned staging records in stg_* tables"
    ],
    processing: [
      "SQLAlchemy transaction with row-level upsert locks",
      "Copy replaced facts into fact_record_history ledger",
      "Promotion of 100% valid records into operational fact tables"
    ],
    outputs: [
      "Committed production facts in 7 operational tables",
      "import_batches status updated to COMMITTED",
      "Trigger event dispatched to Investigation Engine"
    ],
    upstreamIds: ["ingest-multi-validator"],
    downstreamIds: ["platform-postgres-facts", "platform-audit-ledger"],
    techRef: {
      frontend: "ui/src/pages/DataImportStudio.jsx (Approve & Commit Button)",
      backend: "backend/app/services/ingestion/promotion_service.py",
      api: "POST /api/import/promote/{batch_id}",
      db: "public.fact_record_history, public.import_batches",
      aiTool: "N/A"
    },
    route: "/upload"
  },

  // =========================================================================
  // LAYER 3: DATA PLATFORM & GOVERNANCE
  // =========================================================================
  "platform-staging-isolation": {
    id: "platform-staging-isolation",
    layer: "layer-3",
    layerName: "Layer 3 — Data Platform & Governance",
    name: "Staging Table Isolation",
    shortDesc: "Dedicated stg_* buffer tables preventing unverified pollution",
    status: "implemented",
    category: "Data Quarantine",
    icon: "Layers",
    longDesc: "Seven dedicated staging tables (stg_manufacturing_cost, stg_hourly_production, etc.) holding raw uploads in strict isolation from production analytics.",
    inputs: [
      "Unverified file upload batches",
      "Raw connector sync feeds"
    ],
    processing: [
      "String-based raw row preservation",
      "Batch ID partitioning",
      "Automated cleanup of abandoned staging sessions"
    ],
    outputs: [
      "221,879 staged records awaiting promotion",
      "Zero unverified data leakage into core reports"
    ],
    upstreamIds: ["ingest-file-upload"],
    downstreamIds: ["ingest-multi-validator"],
    techRef: {
      frontend: "ui/src/pages/DataImportStudio.jsx",
      backend: "backend/app/models/real_datasets.py (Staging models)",
      api: "Internal ORM Session",
      db: "public.stg_* (7 tables, 221,879 rows)",
      aiTool: "validate_cost_data"
    },
    route: "/upload"
  },

  "platform-postgres-facts": {
    id: "platform-postgres-facts",
    layer: "layer-3",
    layerName: "Layer 3 — Data Platform & Governance",
    name: "Neon PostgreSQL Facts",
    shortDesc: "127,386 committed operational records across 7 core fact tables",
    status: "implemented",
    category: "Relational Storage",
    icon: "Database",
    longDesc: "High-performance serverless PostgreSQL instance storing 127,386 verified operational manufacturing records spanning August 1 to December 25, 2026.",
    inputs: [
      "Atomic batch promotions from PromotionService",
      "Validated operational events"
    ],
    processing: [
      "B-Tree indexing on (plant_code, line_code, posting_ts, product_code)",
      "Foreign key constraint enforcement",
      "SSL-encrypted connection pooling via psycopg 3"
    ],
    outputs: [
      "Authoritative operational facts for all 18 dimensions",
      "Historical period baselines (Aug, Sep, Oct, Nov, Dec 2026)"
    ],
    upstreamIds: ["ingest-atomic-promotion"],
    downstreamIds: ["platform-sql-views", "platform-master-views", "engine-deterministic-variance"],
    techRef: {
      frontend: "N/A (Database Core)",
      backend: "backend/app/db.py (Engine with connection pooling)",
      api: "SQLAlchemy 2.0 ORM Session",
      db: "public.line_cost_batches, hourly_production_logs, etc. (127,386 rows)",
      aiTool: "All deterministic tools"
    },
    route: "/overview"
  },

  "platform-master-views": {
    id: "platform-master-views",
    layer: "layer-3",
    layerName: "Layer 3 — Data Platform & Governance",
    name: "Master Dimension Views",
    shortDesc: "Canonical dimension views (dim_plant, dim_product, dim_component)",
    status: "partial",
    category: "Data Modeling",
    icon: "Boxes",
    longDesc: "Consolidates facility identifiers (IN-TS-01, IN-TS-02, IN-TS-03, PLT-01), product models (A15-128, A15-256, PRO-256), and 67 BOM components into unified dimension views.",
    inputs: [
      "Operational fact distinct codes",
      "Legacy master tables (plants, products, materials)"
    ],
    processing: [
      "Discrepancy reconciliation between legacy and active plant codes",
      "Standard product attribute mapping (Series, Memory Tier, Color)",
      "Component classification (SoC, Display, Camera, Battery, Passive)"
    ],
    outputs: [
      "Unified dimension attributes for multi-dimensional drilldown",
      "Clean join paths for AI investigation tools"
    ],
    upstreamIds: ["platform-postgres-facts"],
    downstreamIds: ["engine-investigation-planning", "engine-deterministic-variance"],
    techRef: {
      frontend: "Filter dropdown bindings across all pages",
      backend: "backend/app/db_views.py (Master Dimension Views)",
      api: "Internal SQL / SQLAlchemy",
      db: "public.dim_* views (In progress)",
      aiTool: "get_cost_summary, inspect_bom_components"
    },
    route: "/overview"
  },

  "platform-sql-views": {
    id: "platform-sql-views",
    layer: "layer-3",
    layerName: "Layer 3 — Data Platform & Governance",
    name: "Analytical SQL Views",
    shortDesc: "Pre-materialized views (v_cost_facts, v_variance_facts)",
    status: "implemented",
    category: "Analytical Acceleration",
    icon: "BarChart3",
    longDesc: "Pre-aggregated analytical database views combining cost batches with production throughput to support sub-second variance waterfall queries and instant dashboard loading.",
    inputs: [
      "line_cost_batches",
      "hourly_production_logs"
    ],
    processing: [
      "SQL joins linking cost batches to production volume",
      "Unit cost calculation: total_cost / good_units",
      "Zero-division protection and null coalescing"
    ],
    outputs: [
      "v_cost_facts consolidated analytical view",
      "v_variance_facts baseline comparison view"
    ],
    upstreamIds: ["platform-postgres-facts"],
    downstreamIds: ["engine-deterministic-variance", "app-cost-overview"],
    techRef: {
      frontend: "ui/src/pages/OverviewPage.jsx",
      backend: "backend/app/db_views.py (v_cost_facts, v_variance_facts)",
      api: "GET /api/overview/kpi-summary",
      db: "public.v_cost_facts, public.v_variance_facts",
      aiTool: "get_cost_summary, calculate_variance_bridge"
    },
    route: "/overview"
  },

  "platform-audit-ledger": {
    id: "platform-audit-ledger",
    layer: "layer-3",
    layerName: "Layer 3 — Data Platform & Governance",
    name: "Immutable Audit Ledger",
    shortDesc: "Pre-correction fact backups (Strategy C) & audit events",
    status: "implemented",
    category: "Audit & Compliance",
    icon: "Lock",
    longDesc: "Maintains an unalterable audit trail of data modifications, archiving pre-correction fact records in fact_record_history and logging upload authorization events in audit_events.",
    inputs: [
      "Promotion replacement events",
      "User validation and confirmation timestamps"
    ],
    processing: [
      "Cryptographic audit event generation",
      "Strategy C pre-update fact preservation",
      "Row-level lineage tracking"
    ],
    outputs: [
      "fact_record_history table",
      "audit_events log table (31 system events)",
      "Compliance verification reports"
    ],
    upstreamIds: ["ingest-atomic-promotion"],
    downstreamIds: ["platform-report-durability"],
    techRef: {
      frontend: "ui/src/pages/ReportsPage.jsx",
      backend: "backend/app/services/ingestion/promotion_service.py",
      api: "Internal Audit Logger",
      db: "public.audit_events, public.fact_record_history",
      aiTool: "validate_cost_data"
    },
    route: "/reports"
  },

  "platform-report-durability": {
    id: "platform-report-durability",
    layer: "layer-3",
    layerName: "Layer 3 — Data Platform & Governance",
    name: "Durable Report Snapshots",
    shortDesc: "457 persisted investigation reports in investigation_reports",
    status: "implemented",
    category: "Snapshot Persistence",
    icon: "FileText",
    longDesc: "Stores complete calculation snapshots, variance bridges, and AI recommendation structures as durable JSON payloads in investigation_reports for instant historical reopening.",
    inputs: [
      "Completed investigation payloads from InvestigationEngineService",
      "Target batch IDs and date filters"
    ],
    processing: [
      "JSON serialization of full report payload",
      "UUID primary key generation and indexing",
      "Zero-recalculation retrieval on reopen"
    ],
    outputs: [
      "457 durable report records in investigation_reports",
      "Historical reopening without AI token consumption"
    ],
    upstreamIds: ["engine-recommendation-gen", "platform-audit-ledger"],
    downstreamIds: ["app-report-history"],
    techRef: {
      frontend: "ui/src/pages/ReportsPage.jsx",
      backend: "backend/app/services/investigation/investigation_engine.py",
      api: "GET /api/reports/{report_id}",
      db: "public.investigation_reports (457 snapshots)",
      aiTool: "N/A"
    },
    route: "/reports"
  },

  // =========================================================================
  // LAYER 4: MANUFACTURING INTELLIGENCE & INVESTIGATION CORE (HERO)
  // =========================================================================
  "engine-investigation-planning": {
    id: "engine-investigation-planning",
    layer: "layer-4",
    layerName: "Layer 4 — Manufacturing Intelligence & Investigation Core",
    name: "Investigation Planning & Scope",
    shortDesc: "Dynamic 20-vector scoping and baseline resolution",
    status: "implemented",
    category: "4A. Investigation Planning",
    icon: "Target",
    longDesc: "Resolves analytical scope (Plant, Line, Product SKU, Period), selects appropriate historical baselines (e.g. October 2026), and dynamically determines which investigative vectors to explore.",
    inputs: [
      "User investigation inquiry or upload event",
      "Available operational periods from fact tables",
      "Target product model and facility code"
    ],
    processing: [
      "Temporal scope resolution and temporal boundary enforcement",
      "Baseline period pairing (Current vs Preceding Month / Quarter)",
      "Investigation vector scoping: identifies relevant areas and logs exclusion rationale"
    ],
    outputs: [
      "Validated investigation scope context",
      "Target investigation parameters passed to Deterministic Engine"
    ],
    upstreamIds: ["platform-master-views", "platform-sql-views"],
    downstreamIds: ["engine-deterministic-variance"],
    techRef: {
      frontend: "ui/src/pages/AIInvestigationsPage.jsx",
      backend: "backend/app/services/investigation/investigation_engine.py",
      api: "POST /api/investigation/ask",
      db: "Queries date bounds from line_cost_batches",
      aiTool: "Domo AI Planner Stage"
    },
    route: "/investigations"
  },

  "engine-deterministic-variance": {
    id: "engine-deterministic-variance",
    layer: "layer-4",
    layerName: "Layer 4 — Manufacturing Intelligence & Investigation Core",
    name: "Deterministic Cost Engine",
    shortDesc: "Python & SQL variance bridge, SKU unit costs and yield math",
    status: "implemented",
    category: "4B. Deterministic Investigation",
    icon: "Cpu",
    longDesc: "The core mathematical powerhouse. Executes deterministic Python and SQL calculations: variance waterfall bridges, Cost per Good Unit, BOM usage variance, and zero-residual reconciliations.",
    inputs: [
      "line_cost_batches",
      "hourly_production_logs",
      "bom_component_records",
      "Scope parameters from Investigation Planning"
    ],
    processing: [
      "Mathematical Waterfall Bridge: Delta = Material + Labor + Machine + Energy + Scrap",
      "Volume vs Spending Variance decomposition",
      "SKU-level Cost per Good Unit: Total Direct Cost / Good Produced Units",
      "Pareto ranking of top cost driver categories"
    ],
    outputs: [
      "Exact mathematical variance breakdown (±₹0.00 discrepancy)",
      "Unit cost delta table across all active smartphone SKUs",
      "Verified evidence facts passed to AI Reasoning Engine"
    ],
    upstreamIds: ["platform-postgres-facts", "platform-sql-views", "engine-investigation-planning"],
    downstreamIds: ["engine-ai-reasoning", "app-cost-overview"],
    techRef: {
      frontend: "ui/src/components/InvestigationReport.jsx",
      backend: "backend/app/services/investigation/investigation_engine.py",
      api: "GET /api/overview/kpi-summary",
      db: "public.line_cost_batches, hourly_production_logs",
      aiTool: "calculate_variance_bridge, get_cost_summary, rank_cost_drivers"
    },
    route: "/overview"
  },

  "engine-quality-defect-engine": {
    id: "engine-quality-defect-engine",
    layer: "layer-4",
    layerName: "Layer 4 — Manufacturing Intelligence & Investigation Core",
    name: "Defect Pareto & Station Analysis",
    shortDesc: "First-Pass Yield and station-level defect isolation",
    status: "implemented",
    category: "4B. Deterministic Investigation",
    icon: "ShieldAlert",
    longDesc: "Deterministically aggregates 25,562 quality inspection logs and 4,398 rework records to isolate defect codes (DEF-001 through DEF-010) across stations S01 to S06.",
    inputs: [
      "serialized_quality_inspections",
      "quality_rework_event_records"
    ],
    processing: [
      "First-Pass Yield % calculation: (Passed Inspections / Total Inspections) * 100",
      "Station defect Pareto ranking (Station S02 Solder Bridging accounts for 82% rework)",
      "Rework labor cost and scrap component loss tallies"
    ],
    outputs: [
      "Verified First-Pass Yield by production line",
      "Defect Pareto distribution table",
      "Scrap & Rework cost decomposition facts"
    ],
    upstreamIds: ["platform-postgres-facts"],
    downstreamIds: ["engine-ai-reasoning"],
    techRef: {
      frontend: "ui/src/pages/AIInvestigationsPage.jsx",
      backend: "backend/app/services/investigation/investigation_engine.py",
      api: "POST /api/investigation/ask",
      db: "public.serialized_quality_inspections, quality_rework_event_records",
      aiTool: "Target: inspect_quality_defect_pareto"
    },
    route: "/investigations"
  },

  "engine-ai-reasoning": {
    id: "engine-ai-reasoning",
    layer: "layer-4",
    layerName: "Layer 4 — Manufacturing Intelligence & Investigation Core",
    name: "AI Reasoning & ACH Evaluator",
    shortDesc: "Domo AI Services contextual reasoning over verified facts",
    status: "implemented",
    category: "4C. AI Reasoning",
    icon: "Brain",
    longDesc: "Domo AI Services integration executing natural language domain reasoning. Synthesizes 8 expert perspectives, formulates competing hypotheses, and falsifies unproven correlations using verified facts.",
    inputs: [
      "Verified deterministic evidence from Deterministic Cost Engine",
      "Defect Pareto & station facts",
      "User natural language investigation inquiry"
    ],
    processing: [
      "DomoTextLLM execution via Domo AI Services API (temperature=0.0)",
      "Analysis of Competing Hypotheses (ACH): tests competing explanations against evidence",
      "Chronology check: validates cause precedes effect",
      "Strict non-hallucination guardrail: numbers cited directly from tool payloads"
    ],
    outputs: [
      "Evidence-Hypothesis Matrix (EHM)",
      "Strictly classified findings (PROVEN, CONTRIBUTOR, RULED_OUT, UNAVAILABLE)",
      "Natural language analytical narrative"
    ],
    upstreamIds: ["engine-deterministic-variance", "engine-quality-defect-engine"],
    downstreamIds: ["engine-recommendation-gen", "app-ai-sandbox"],
    techRef: {
      frontend: "ui/src/pages/AIInvestigationsPage.jsx (Chat Drawer)",
      backend: "backend/app/agent.py & backend/app/domo_llm.py",
      api: "POST /api/investigation/ask",
      db: "Reads tool outputs in memory",
      aiTool: "DomoTextLLM, LangChain Core agent_chain"
    },
    route: "/investigations"
  },

  "engine-recommendation-gen": {
    id: "engine-recommendation-gen",
    layer: "layer-4",
    layerName: "Layer 4 — Manufacturing Intelligence & Investigation Core",
    name: "Dynamic Action & Savings Engine",
    shortDesc: "Non-double-counted savings estimation and assigned actions",
    status: "implemented",
    category: "4D. Action Generation",
    icon: "Sparkles",
    longDesc: "Converts proven root causes into prioritized, actionable recommendations. Calculates conservative financial savings (P&L direct cash vs cost avoidance) with zero double-counting.",
    inputs: [
      "Classified findings from AI Reasoning Engine",
      "Verified component purchase prices and scrap quantities",
      "Target production volumes"
    ],
    processing: [
      "Deterministic savings calculation formulas (Contract renegotiation, SMT defect elimination)",
      "Priority assignment (High, Medium, Low) based on financial impact & urgency",
      "Owner assignment (Strategic Procurement, Quality Engineering, Operations)",
      "Implementation horizon estimation (2–4 weeks, 1–2 months)"
    ],
    outputs: [
      "Manufacturing Cost Improvement Plan data payload",
      "Total Quantified Improvement Opportunity metric (e.g. ₹22.39 Cr)",
      "Itemized key evidence comparison tables"
    ],
    upstreamIds: ["engine-ai-reasoning"],
    downstreamIds: ["platform-report-durability", "app-improvement-plan", "app-investigation-result"],
    techRef: {
      frontend: "ui/src/components/DataUpload/components/CostImprovementPlan.jsx",
      backend: "backend/app/services/investigation/investigation_engine.py (_build_cost_improvement_plan)",
      api: "POST /api/import/promote (generates plan)",
      db: "Persisted in investigation_reports.summary_json",
      aiTool: "get_management_recommendations"
    },
    route: "/reports"
  },

  // =========================================================================
  // LAYER 5: BUSINESS APPLICATIONS & OUTPUTS
  // =========================================================================
  "app-cost-overview": {
    id: "app-cost-overview",
    layer: "layer-5",
    layerName: "Layer 5 — Business Applications & Outputs",
    name: "Executive Overview Dashboard",
    shortDesc: "Plant-wide KPI pulse, cost waterfall & monthly trends",
    status: "implemented",
    category: "Executive Reporting",
    icon: "LayoutDashboard",
    longDesc: "Executive command center displaying Total Manufacturing Cost, Cost per Good Unit, Net Production Output, Assembly Yield %, daily expenditure trends, and cost-category waterfall charts.",
    inputs: [
      "v_cost_facts analytical SQL view",
      "Historical monthly aggregations from line_cost_batches"
    ],
    processing: [
      "Month-over-month percentage delta computation",
      "Recharts interactive daily cost trend visualization",
      "Cost category distribution donut chart rendering"
    ],
    outputs: [
      "Interactive executive dashboard (/overview)",
      "Facility-level performance scorecards"
    ],
    upstreamIds: ["platform-sql-views", "engine-deterministic-variance"],
    downstreamIds: ["feedback-outcome-tracker"],
    techRef: {
      frontend: "ui/src/pages/OverviewPage.jsx",
      backend: "backend/app/services/investigation/investigation_engine.py",
      api: "GET /api/overview/kpi-summary",
      db: "public.v_cost_facts, line_cost_batches",
      aiTool: "get_cost_summary"
    },
    route: "/overview"
  },

  "app-investigation-result": {
    id: "app-investigation-result",
    layer: "layer-5",
    layerName: "Layer 5 — Business Applications & Outputs",
    name: "Investigation Results Studio",
    shortDesc: "Instant post-upload investigation results and SKU variance",
    status: "implemented",
    category: "Upload Analytics",
    icon: "LineChart",
    longDesc: "Full investigation result screen generated immediately following dataset upload and promotion, presenting the cost waterfall bridge, product comparison table, and action plan.",
    inputs: [
      "Newly promoted import batch",
      "Investigation engine execution results"
    ],
    processing: [
      "Real-time rendering of SKU unit-cost deltas",
      "Display of primary cost movement drivers per product",
      "Interactive date and facility filter controls"
    ],
    outputs: [
      "Upload result page (/upload/results/:id)",
      "Direct link to exportable reports"
    ],
    upstreamIds: ["engine-recommendation-gen"],
    downstreamIds: ["app-improvement-plan", "app-report-history"],
    techRef: {
      frontend: "ui/src/components/InvestigationReport.jsx",
      backend: "backend/app/services/investigation/investigation_engine.py",
      api: "GET /api/investigation/results/{batch_id}",
      db: "public.investigation_reports",
      aiTool: "calculate_variance_bridge, analyze_cost_movement"
    },
    route: "/reports"
  },

  "app-ai-sandbox": {
    id: "app-ai-sandbox",
    layer: "layer-5",
    layerName: "Layer 5 — Business Applications & Outputs",
    name: "AI Investigation Sandbox",
    shortDesc: "Natural language root-cause drawer with Domo AI agent",
    status: "implemented",
    category: "Agent Interaction",
    icon: "MessageSquareText",
    longDesc: "Conversational investigation drawer allowing plant managers and cost analysts to ask natural language questions ('Why did SMT-L1 rejection rise?'), powered by Domo AI and deterministic tools.",
    inputs: [
      "User natural language queries",
      "Active investigation context & period filters"
    ],
    processing: [
      "Prompt parsing and deterministic tool selection in agent.py",
      "Observation scratchpad construction and tool deduplication",
      "Strict evidence governance: returns PROVEN vs HYPOTHESIS labels"
    ],
    outputs: [
      "Conversational answers with embedded evidence tables",
      "Itemized tool execution traces"
    ],
    upstreamIds: ["engine-ai-reasoning"],
    downstreamIds: ["feedback-outcome-tracker"],
    techRef: {
      frontend: "ui/src/pages/AIInvestigationsPage.jsx",
      backend: "backend/app/agent.py & backend/app/tools.py",
      api: "POST /api/investigation/ask",
      db: "public.conversations, public.messages",
      aiTool: "DomoTextLLM (9 deterministic tools)"
    },
    route: "/investigations"
  },

  "app-improvement-plan": {
    id: "app-improvement-plan",
    layer: "layer-5",
    layerName: "Layer 5 — Business Applications & Outputs",
    name: "Cost Improvement Plan UI",
    shortDesc: "Evidence-backed recommendation cards with ROI and scope",
    status: "implemented",
    category: "Operational Decisions",
    icon: "Sparkles",
    longDesc: "Dedicated enterprise recommendation UI featuring numbered recommendation cards, Problem Identified summaries, Key Evidence comparison tables, Affected Scope, and Expected Business Impact.",
    inputs: [
      "Dynamic recommendations from Recommendation Engine",
      "Verified component prices and defect statistics"
    ],
    processing: [
      "Interactive expand/collapse card rendering",
      "Estimated savings badge formatting (e.g. ₹22.39 Cr)",
      "Direct link to evidence inspection details"
    ],
    outputs: [
      "Interactive Cost Improvement Plan component",
      "Actionable engineering tasks for plant leadership"
    ],
    upstreamIds: ["engine-recommendation-gen", "app-investigation-result"],
    downstreamIds: ["feedback-outcome-tracker"],
    techRef: {
      frontend: "ui/src/components/DataUpload/components/CostImprovementPlan.jsx",
      backend: "backend/app/services/investigation/investigation_engine.py",
      api: "Embedded in investigation result response",
      db: "investigation_reports.summary_json.cost_improvement_plan",
      aiTool: "get_management_recommendations"
    },
    route: "/reports"
  },

  "app-report-history": {
    id: "app-report-history",
    layer: "layer-5",
    layerName: "Layer 5 — Business Applications & Outputs",
    name: "Historical Reports & Audit",
    shortDesc: "Reopenable archive of 457 stored investigation snapshots",
    status: "implemented",
    category: "Historical Audit",
    icon: "FileText",
    longDesc: "Audit repository displaying all historical investigation runs with exact date scopes, product filters, record validity counts, and one-click reopening of original results.",
    inputs: [
      "investigation_reports database records",
      "Historical batch metadata"
    ],
    processing: [
      "Pagination and search across historical investigations",
      "Instant snapshot deserialization without re-running calculations",
      "Audit trail verification"
    ],
    outputs: [
      "Historical Reports ledger page (/reports)",
      "Zero-latency report re-inspection"
    ],
    upstreamIds: ["platform-report-durability", "app-investigation-result"],
    downstreamIds: ["feedback-outcome-tracker"],
    techRef: {
      frontend: "ui/src/pages/ReportsPage.jsx",
      backend: "backend/app/services/investigation/investigation_engine.py",
      api: "GET /api/reports",
      db: "public.investigation_reports (457 snapshots)",
      aiTool: "N/A"
    },
    route: "/reports"
  },

  // =========================================================================
  // LAYER 6: FEEDBACK & CONTINUOUS IMPROVEMENT
  // =========================================================================
  "feedback-outcome-tracker": {
    id: "feedback-outcome-tracker",
    layer: "layer-6",
    layerName: "Layer 6 — Feedback & Continuous Improvement",
    name: "Remediation Outcome Tracker",
    shortDesc: "Compares realized post-intervention savings against AI estimates",
    status: "partial",
    category: "Closed-Loop Governance",
    icon: "RotateCw",
    longDesc: "Tracks the real-world operational execution of approved recommendations. Evaluates whether post-intervention batch uploads reflect the projected ₹22.39 Cr savings and yield improvements.",
    inputs: [
      "Approved recommendation milestones from Cost Improvement Plan",
      "Subsequent month operational fact uploads (e.g. Dec 2026 actuals)"
    ],
    processing: [
      "Delta tracking: Realized cost reduction vs Projected savings estimate",
      "Variance gap attribution (Execution delay vs Market price change)",
      "Logging of confirmed remediation outcomes"
    ],
    outputs: [
      "Remediation outcome scorecards",
      "Calibrated baseline expectations for future investigations"
    ],
    upstreamIds: ["app-improvement-plan", "app-cost-overview", "app-ai-sandbox"],
    downstreamIds: ["engine-investigation-planning", "feedback-baseline-calibration"],
    techRef: {
      frontend: "Feedback modal in ReportsPage.jsx",
      backend: "backend/app/services/analytics/outcome_tracker.py (In progress)",
      api: "POST /api/investigation/action-feedback",
      db: "public.recommendations (Status tracking)",
      aiTool: "Planned: track_remediation_outcome"
    },
    route: "/reports"
  },

  "feedback-baseline-calibration": {
    id: "feedback-baseline-calibration",
    layer: "layer-6",
    layerName: "Layer 6 — Feedback & Continuous Improvement",
    name: "Standard Baseline Recalibration",
    shortDesc: "Automated standard cost & engineering tolerance refinement",
    status: "planned",
    category: "Closed-Loop Governance",
    icon: "Cog",
    longDesc: "Planned closed-loop capability to automatically propose updated standard costs, scrap factors, and machine cycle time benchmarks based on verified operational actuals.",
    inputs: [
      "Verified multi-period actual cost distributions",
      "Engineering change orders (ECO) and supplier contract updates"
    ],
    processing: [
      "Statistical baseline recalibration (rolling 90-day trimmed mean)",
      "Outlier-adjusted standard unit cost recommendations",
      "BOM scrap factor adjustment proposals for PLM engineering approval"
    ],
    outputs: [
      "Updated standard_cost_items versions in PostgreSQL",
      "Self-calibrating variance thresholds"
    ],
    upstreamIds: ["feedback-outcome-tracker"],
    downstreamIds: ["engine-investigation-planning"],
    techRef: {
      frontend: "Planned in Phase 5",
      backend: "backend/app/services/costing/calibration_service.py (Planned)",
      api: "POST /api/costing/recalibrate",
      db: "public.standard_cost_items, costing_versions",
      aiTool: "Planned: propose_standard_recalibration"
    },
    route: "/overview"
  }
};

// =============================================================================
// EIGHT-STAGE MANUFACTURING RCA INVESTIGATION WORKFLOW
// Grounded strictly in Master Prompt requirements and agent.py / tools.py
// =============================================================================
export const INVESTIGATION_WORKFLOW_STAGES = [
  {
    stageNumber: 1,
    id: "stage-understand",
    title: "Understand Manufacturing Situation",
    icon: "Compass",
    tagline: "Scoping plant, lines, product SKUs, and active time horizons",
    objective: "Parse analytical request, establish plant facility scope (IN-TS-01, IN-TS-02), active SMT/FAL lines, and targeted smartphone SKUs (SPH-A15-128, SPH-A15-256, SPH-PRO-256, SPH-TST-X1).",
    responsibleLayer: "Agent Core & Dynamic Scoping",
    deterministicActions: [
      "Query dim_plant and dim_production_lines to validate facility operational status",
      "Resolve target smartphone product codes and BOM active revision dates",
      "Verify calendar bounds and ensure future-dated entries (> Nov 19, 2026) are segregated as planned/staged",
    ],
    aiReasoningRole: "Understands user natural language query, identifies targeted smartphone SKU and plant boundaries, and formulates analytical framing.",
    toolsUsed: ["validate_cost_data", "get_cost_summary"],
    evidenceGate: "PROVEN (Direct metadata from master tables)",
    outputArtifact: "Active Investigation Scope Matrix (Facility + SKU + Line + Horizon)",
  },
  {
    stageNumber: 2,
    id: "stage-baseline",
    title: "Establish Comparison Baseline",
    icon: "History",
    tagline: "Retrieving ground-truth previous periods and standard engineering benchmarks",
    objective: "Establish historical comparison baseline (e.g. October 2026 actuals ₹463.01 Cr / ₹5,782.04 per unit) and engineering standard cost baselines from PostgreSQL.",
    responsibleLayer: "Deterministic Calculation Engine (SQL / Python)",
    deterministicActions: [
      "Calculate baseline cost per good unit: Total Direct Costs / Total Good Units Produced",
      "Extract standard BOM component cost rollups from product_standard_costs",
      "Load station-level standard cycle times and scrap allowance benchmarks",
    ],
    aiReasoningRole: "Evaluates baseline consistency, checks for product mix shifts between baseline and comparison periods, and flags unverified standard assumptions.",
    toolsUsed: ["get_cost_summary", "get_standard_vs_actual"],
    evidenceGate: "PROVEN for historical actuals; OBSERVED_CORRELATION for standards",
    outputArtifact: "Baseline Benchmark Vector (Historical Unit Cost vs Standard Cost)",
  },
  {
    stageNumber: 3,
    id: "stage-variance",
    title: "Identify Cost Variations",
    icon: "TrendingUp",
    tagline: "Decomposing total cost movements into discrete cost buckets",
    objective: "Calculate overall cost delta (-₹149.52 Cr / -32.29%) and unit cost movement (+₹9,477.88 / +163.92% per unit) across 5 core elements: Material, Labor, Machine, Energy, Scrap.",
    responsibleLayer: "Deterministic Calculation Engine (Python / SQL)",
    deterministicActions: [
      "Compute total variance = Comparison Period Spend - Baseline Spend",
      "Perform mathematical element decomposition across Material (₹143.84 Cr), Labor (₹6.91 Cr), Machine (₹2.40 Cr), Energy (₹0.98 Cr), Scrap (₹0.20 Cr)",
      "Flag counter-intuitive variance: Total spend dropped by 32.3%, but Cost per Good Unit spiked by 163.92% due to 74.5% output drop",
    ],
    aiReasoningRole: "Identifies mathematical anomaly: overall manufacturing expenditure decreased due to low production volume, but unit cost surged dramatically.",
    toolsUsed: ["calculate_variance_bridge", "analyze_cost_movement"],
    evidenceGate: "PROVEN (Exact SQL aggregations from line_cost_batches)",
    outputArtifact: "Mathematical Variance Bridge & Element Attribution Table",
  },
  {
    stageNumber: 4,
    id: "stage-select-dimensions",
    title: "Select Relevant Investigations",
    icon: "GitFork",
    tagline: "Dynamically scoping relevant investigation paths based on variance signals",
    objective: "Dynamically select specific investigation dimensions (e.g., BOM Revisions, Defect Solder Bridging, Vendor Pricing, Line Starvation) instead of running a blind brute-force check.",
    responsibleLayer: "Investigation Planner (LangChain Core)",
    deterministicActions: [
      "Check variance thresholds (> 5% deviation activates deep dive)",
      "Correlate cost drivers with shopfloor operational signals (yield drop vs material spend jump)",
      "Construct targeted parameter payloads for station-level Pareto and component inspection",
    ],
    aiReasoningRole: "Acts like a Chief Manufacturing Engineer: determines whether cost spike is driven by procurement price jumps, assembly line scrap, or volume absorption.",
    toolsUsed: ["rank_cost_drivers", "inspect_bom_components"],
    evidenceGate: "HYPOTHESIS generation based on mathematical signals",
    outputArtifact: "Prioritized Investigation Vector (Targeted Dimensions & Hypotheses)",
  },
  {
    stageNumber: 5,
    id: "stage-deterministic",
    title: "Deterministic Investigation",
    icon: "Cpu",
    tagline: "Executing pure Python math and SQL queries across 127k+ operational records",
    objective: "Execute pure Python algorithms and parameterized PostgreSQL queries to extract unarguable empirical facts without AI approximation.",
    responsibleLayer: "Deterministic Engine & LangChain Tools",
    deterministicActions: [
      "Run SQL queries on serialized_quality_inspections (16,000 logs) to calculate SMT-L1 FPY (97.45%) and station S02 defect frequency",
      "Match material_purchase_records against contract PO pricing to isolate ₹1,450/unit price increase on OLED display CMP-001",
      "Aggregate hourly_production_logs (13,332 logs) to calculate downtime minutes and line starvation duration",
    ],
    aiReasoningRole: "Strictly forbidden from calculating or inventing arithmetic; passively receives verified calculation dictionaries from tool executions.",
    toolsUsed: ["investigate_variance", "inspect_bom_components", "rank_cost_drivers"],
    evidenceGate: "PROVEN (Direct PostgreSQL records with zero synthetic extrapolation)",
    outputArtifact: "Structured Empirical Fact Pack (JSON proof dictionaries)",
  },
  {
    stageNumber: 6,
    id: "stage-evidence-eval",
    title: "AI Evidence Evaluation",
    icon: "ShieldAlert",
    tagline: "Applying strict 4-level evidence governance and chronological validation",
    objective: "DomoTextLLM evaluates verified facts against hypotheses, classifying every insight into strict evidence tiers and eliminating ungrounded speculation.",
    responsibleLayer: "AI Intelligence Core (DomoTextLLM + Domo AI Services)",
    deterministicActions: [
      "Check fact timestamps to verify chronological causality (did price hike precede cost spike?)",
      "Classify findings into PROVEN, OBSERVED_CORRELATION, HYPOTHESIS, UNAVAILABLE",
      "Cross-examine alternative explanations (e.g. was yield drop caused by operator skill or defective incoming PCB lots?)",
    ],
    aiReasoningRole: "Enforces Master Prompt 4.2 evidence governance rules. Rejects unverified assumptions and clearly flags UNAVAILABLE data (e.g., factory overhead allocation).",
    toolsUsed: ["investigate_variance", "analyze_cost_movement"],
    evidenceGate: "Strict Evidence Classification Governance Gate",
    outputArtifact: "Validated Evidence Chain with Confidence Ratings & Proof Citations",
  },
  {
    stageNumber: 7,
    id: "stage-root-cause",
    title: "Root-Cause Findings",
    icon: "Target",
    tagline: "Synthesizing definitive root causes across 8 manufacturing domain perspectives",
    objective: "Synthesize the primary verified root causes explaining the unit cost surge, linking component prices, line defects, and throughput drops.",
    responsibleLayer: "Executive Synthesizer (DomoTextLLM)",
    deterministicActions: [
      "Isolate Root Cause 1: Display Module CMP-001 contract pricing increase (+₹1,450 / unit, accounting for 62% of material variance)",
      "Isolate Root Cause 2: SMT-L1 Station S02 solder bridging defects (DEF-002) causing 2.55% yield loss and ₹0.20 Cr scrap rework cost",
      "Isolate Root Cause 3: Line starvation and volume drop (2.07L vs 8.16L units) causing fixed machine costs to be absorbed over fewer units",
    ],
    aiReasoningRole: "Combines 8 domain expert perspectives (Cost Engineer, Production, Quality, Procurement, Inventory, Industrial Engineer, Maintenance, Smartphone Tester).",
    toolsUsed: ["investigate_variance", "get_management_recommendations"],
    evidenceGate: "PROVEN (Corroborated by dual deterministic calculation + chronological proof)",
    outputArtifact: "Definitive Root-Cause Proof Matrix & Pareto Waterfall",
  },
  {
    stageNumber: 8,
    id: "stage-recommendations",
    title: "Recommendations & Savings",
    icon: "Sparkles",
    tagline: "Generating evidence-backed corrective playbooks with estimated ROI",
    objective: "Formulate concrete, actionable remediation playbooks for plant operations and procurement directors with mathematically bounded savings opportunities.",
    responsibleLayer: "Action & Recommendation Engine",
    deterministicActions: [
      "Calculate estimated savings opportunity: ₹18.31 Cr total actionable recovery across 3 prioritized playbooks",
      "Action 1 (High): Renegotiate CMP-001 OLED contract pricing or dual-source via Supplier SUP-02 (Est. ₹11.2 Cr savings)",
      "Action 2 (High): Recalibrate SMT solder paste stencil aperture & temperature on Station S02 (Est. ₹4.8 Cr rework reduction)",
      "Action 3 (Medium): Re-balance FAL assembly line buffer to eliminate line starvation idle runtime (Est. ₹2.31 Cr capacity recovery)",
    ],
    aiReasoningRole: "Drafts executive remediation playbooks with clear owners, timelines, and monitoring milestones; maintains distinction between potential and realized savings.",
    toolsUsed: ["get_management_recommendations"],
    evidenceGate: "PROVEN potential savings calculated via verified SQL volume multipliers",
    outputArtifact: "Cost Improvement Plan (₹18.31 Cr Actionable Savings Portfolio)",
  },
];

// =============================================================================
// SEVEN OPERATIONAL DATASET FAMILIES (Neon PostgreSQL 16)
// =============================================================================
export const OPERATIONAL_DATASET_FAMILIES = [
  {
    id: "family-manufacturing-cost",
    name: "Manufacturing Cost",
    icon: "Coins",
    operationalTable: "line_cost_batches",
    stagingTable: "stg_manufacturing_cost",
    recordsCount: "9,502 committed rows",
    keyColumns: ["batch_id", "plant_id", "line_id", "product_code", "material_cost", "direct_labor_cost", "machine_cost", "energy_cost", "scrap_cost"],
    description: "Captures batch-level financial ledger expenditures allocated across 5 cost components for each production run.",
    activeSources: "SAP ERP Cost Accounting / Shopfloor MES",
    status: "implemented",
  },
  {
    id: "family-hourly-production",
    name: "Hourly Production",
    icon: "Activity",
    operationalTable: "hourly_production_logs",
    stagingTable: "stg_hourly_production",
    recordsCount: "13,332 committed rows",
    keyColumns: ["log_id", "plant_id", "line_id", "shift_id", "target_units", "actual_units", "good_units", "reject_units", "downtime_minutes"],
    description: "Logs hourly manufacturing throughput, operator shifts, good output counts, reject units, and machine stoppage durations.",
    activeSources: "MES Shopfloor Automated Counters",
    status: "implemented",
  },
  {
    id: "family-bom-components",
    name: "BOM Components",
    icon: "Boxes",
    operationalTable: "bom_component_records",
    stagingTable: "stg_bom_component",
    recordsCount: "246 committed rows",
    keyColumns: ["bom_id", "product_code", "component_code", "component_name", "standard_qty", "unit_cost", "scrap_factor_pct", "revision"],
    description: "Engineering bill of materials specifying standard component consumption, reference pricing, and engineering revisions.",
    activeSources: "PLM Engineering Release / SAP MM",
    status: "implemented",
  },
  {
    id: "family-material-procurement",
    name: "Material Procurement",
    icon: "Truck",
    operationalTable: "material_purchase_records",
    stagingTable: "stg_material_purchases",
    recordsCount: "996 committed rows",
    keyColumns: ["po_number", "supplier_id", "component_code", "order_qty", "received_qty", "contract_unit_price", "actual_unit_price", "ppv_variance"],
    description: "Purchase order receipts, invoice matching, supplier unit pricing, and purchase price variance (PPV) tracking.",
    activeSources: "SAP MM / Procurement Invoices",
    status: "implemented",
  },
  {
    id: "family-material-consumption",
    name: "Material Consumption",
    icon: "Layers",
    operationalTable: "material_consumption_records",
    stagingTable: "stg_material_consumption",
    recordsCount: "14,820 committed rows",
    keyColumns: ["issue_id", "batch_id", "component_code", "issued_qty", "consumed_qty", "scrap_qty", "variance_qty"],
    description: "Actual shopfloor component dispensing, floor-stock issues, component scrap, and bill-of-materials usage variance.",
    activeSources: "Warehouse WMS & SMT Component Feeders",
    status: "implemented",
  },
  {
    id: "family-quality-inspection",
    name: "Quality Inspection",
    icon: "ShieldCheck",
    operationalTable: "serialized_quality_inspections",
    stagingTable: "stg_quality_inspection",
    recordsCount: "16,000 committed rows",
    keyColumns: ["serial_number", "station_id", "inspection_type", "test_result", "defect_code", "defect_desc", "inspection_timestamp"],
    description: "Unit-level serialized optical and functional test records across stations S01 to S06 with defect classifications.",
    activeSources: "AOI (Automated Optical Inspection) & Functional Test Rigs",
    status: "implemented",
  },
  {
    id: "family-quality-rework",
    name: "Quality Rework",
    icon: "Wrench",
    operationalTable: "quality_rework_event_records",
    stagingTable: "stg_quality_rework_events",
    recordsCount: "3,480 committed rows",
    keyColumns: ["rework_id", "serial_number", "defect_code", "rework_station", "rework_action", "technician_id", "parts_replaced_cost", "rework_duration_min"],
    description: "Offline technician rework events, repair actions, component replacement costs, and post-rework re-test verification.",
    activeSources: "Quality Rework Station MES Terminals",
    status: "implemented",
  },
];

// =============================================================================
// NINE VERIFIED LANGCHAIN TOOLS (backend/app/tools.py)
// =============================================================================
export const VERIFIED_LANGCHAIN_TOOLS = [
  {
    name: "validate_cost_data",
    signature: "validate_cost_data(dataset_name: Optional[str] = None) -> dict",
    file: "backend/app/tools.py:76",
    purpose: "Executes 14 deterministic validation rules across staging or operational datasets before analysis.",
    parameters: ["dataset_name: Optional[str] (e.g. 'manufacturing_cost', 'production')"],
    returns: "Dict containing status, validation_passed, total_rows_checked, violation_counts, and critical_null_count.",
    category: "Integrity & Pre-flight",
  },
  {
    name: "get_cost_summary",
    signature: "get_cost_summary(plant_id, line_id, product_code, start_date, end_date) -> dict",
    file: "backend/app/tools.py:134",
    purpose: "Calculates total manufacturing cost, good unit count, cost per good smartphone unit, and 5-element breakdown.",
    parameters: ["plant_id: Optional[str]", "line_id: Optional[str]", "product_code: Optional[str]", "start_date: str", "end_date: str"],
    returns: "Dict with total_manufacturing_cost, cost_per_good_unit, good_units, material_cost, labor_cost, machine_cost, energy_cost, scrap_cost.",
    category: "Financial Aggregation",
  },
  {
    name: "get_standard_vs_actual",
    signature: "get_standard_vs_actual(product_code, plant_id, line_id, start_date, end_date) -> dict",
    file: "backend/app/tools.py:243",
    purpose: "Compares actual cost per good unit against engineering standard cost, isolating rate and usage variances.",
    parameters: ["product_code: str", "plant_id: Optional[str]", "line_id: Optional[str]", "start_date: str", "end_date: str"],
    returns: "Dict with standard_unit_cost, actual_unit_cost, variance_amount, variance_pct, element_variances.",
    category: "Standard Costing",
  },
  {
    name: "calculate_variance_bridge",
    signature: "calculate_variance_bridge(product_code, baseline_period, comparison_period, plant_id, line_id) -> dict",
    file: "backend/app/tools.py:298",
    purpose: "Constructs a mathematical variance bridge decomposing cost delta into price, volume, yield, and efficiency drivers.",
    parameters: ["product_code: Optional[str]", "baseline_period: str", "comparison_period: str", "plant_id: Optional[str]", "line_id: Optional[str]"],
    returns: "Dict with baseline_total, comparison_total, variance_bridge: [material_variance, labor_variance, machine_variance, energy_variance, scrap_variance].",
    category: "Variance Analytics",
  },
  {
    name: "rank_cost_drivers",
    signature: "rank_cost_drivers(product_code, comparison_period, baseline_period, plant_id, line_id) -> dict",
    file: "backend/app/tools.py:403",
    purpose: "Ranks top manufacturing cost movement drivers by absolute financial impact and variance percentage.",
    parameters: ["product_code: Optional[str]", "comparison_period: str", "baseline_period: str", "plant_id: Optional[str]", "line_id: Optional[str]"],
    returns: "Dict with ranked_drivers: [{rank, element, absolute_impact, pct_contribution, direction}].",
    category: "Pareto Prioritization",
  },
  {
    name: "inspect_bom_components",
    signature: "inspect_bom_components(product_code: str) -> dict",
    file: "backend/app/tools.py:486",
    purpose: "Extracts multi-level BOM components, standard quantities, scrap factors, and component cost hierarchy for a SKU.",
    parameters: ["product_code: str (e.g. 'SPH-A15-128', 'SPH-A15-256', 'SPH-PRO-256')"],
    returns: "Dict with product_code, total_components_count, total_standard_bom_cost, components: [{code, name, std_qty, unit_cost, scrap_pct}].",
    category: "Engineering Analysis",
  },
  {
    name: "investigate_variance",
    signature: "investigate_variance(product_code, period, baseline_period, plant_id, line_id) -> dict",
    file: "backend/app/tools.py:539",
    purpose: "Deep-dive investigation integrating cost batches, hourly MES telemetry, and station-level defect Pareto.",
    parameters: ["product_code: Optional[str]", "period: str", "baseline_period: str", "plant_id: Optional[str]", "line_id: Optional[str]"],
    returns: "Dict with primary_driver, operational_evidence, defect_pareto, yield_impact, and hypothesis_verdict.",
    category: "Root-Cause Investigation",
  },
  {
    name: "analyze_cost_movement",
    signature: "analyze_cost_movement(period, baseline_period, product_code, plant_id, line_id) -> dict",
    file: "backend/app/tools.py:645",
    purpose: "Evaluates multi-day operational trend movements, daily cost peaks, and correlation with production stoppages.",
    parameters: ["period: str", "baseline_period: str", "product_code: Optional[str]", "plant_id: Optional[str]", "line_id: Optional[str]"],
    returns: "Dict with daily_trend_series, peak_daily_cost, anomaly_days, and correlation_summary.",
    category: "Trend Diagnostics",
  },
  {
    name: "get_management_recommendations",
    signature: "get_management_recommendations(investigation_findings: dict, product_code: Optional[str] = None) -> dict",
    file: "backend/app/tools.py:673",
    purpose: "Generates prioritized corrective action playbooks with estimated savings opportunity based on empirical findings.",
    parameters: ["investigation_findings: dict", "product_code: Optional[str]"],
    returns: "Dict with total_savings_opportunity, recommendations: [{title, priority, area, estimated_savings, action_steps, owner}].",
    category: "Remediation & Action",
  },
];

