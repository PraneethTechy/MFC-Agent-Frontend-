/**
 * Authoritative Workforce Management Agent Architecture Registry
 * Grounded in verified project implementations:
 * - FastAPI REST APIs (Python 3.11)
 * - SQLAlchemy 2.x ORM
 * - Neon PostgreSQL Database
 * - LangChain Core Agent Orchestration
 * - Domo AI Text Generation API
 */

export const ARCHITECTURE_STAGES = [
  {
    id: "stage-sources",
    name: "Data Sources",
    theme: "blue",
    icon: "Database",
    status: "implemented",
    headerBg: "bg-blue-50/80 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800",
    items: [
      { id: "comp-employee-hr", label: "Employee & HR Data", icon: "Users", desc: "Master employee profiles, worker grades & designations" },
      { id: "comp-attendance-data", label: "Attendance Data", icon: "CalendarCheck", desc: "Shift punch records, biometric logs & absenteeism" },
      { id: "comp-shift-calendar", label: "Shift & Calendar", icon: "Calendar", desc: "Rotational shift schedules (Shift 1, 2, 3) & holiday masters" },
      { id: "comp-production-data", label: "Production Data", icon: "Activity", desc: "Hourly line output, target units & operator allocation" },
      { id: "comp-dept-section", label: "Department & Section", icon: "Layers", desc: "SMT, FAL, Quality & Maintenance section hierarchy" },
      { id: "comp-experience-plant", label: "Experience & Plant Data", icon: "MapPin", desc: "Skill certifications, vintage & plant facility mapping" },
    ]
  },
  {
    id: "stage-ingestion",
    name: "Data Ingestion & Validation",
    theme: "green",
    icon: "Cog",
    status: "implemented",
    headerBg: "bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800",
    items: [
      { id: "comp-csv-upload", label: "CSV / File Upload", icon: "CloudUpload", desc: "Streaming multipart upload with SHA-256 batch token" },
      { id: "comp-data-validation", label: "Data Validation", icon: "ShieldCheck", desc: "14 multi-pass integrity checks & null tolerance validation" },
      { id: "comp-transformation", label: "Transformation", icon: "RotateCw", desc: "Type coercion, shift duration & wage rate standardization" },
      { id: "comp-data-mapping", label: "Data Mapping", icon: "GitBranch", desc: "Fuzzy header matching against 40+ column synonyms" },
    ]
  },
  {
    id: "stage-platform",
    name: "Data Platform",
    theme: "blue",
    icon: "Database",
    status: "implemented",
    headerBg: "bg-blue-50/80 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800",
    items: [
      { id: "comp-workforce-tables", label: "Workforce Tables", icon: "Table", desc: "dim_employee, operator_skill_matrix & wage tiers" },
      { id: "comp-attendance-tables", label: "Attendance Tables", icon: "Table", desc: "fact_attendance_records & daily punch logs" },
      { id: "comp-shift-tables", label: "Shift Calendar Tables", icon: "Table", desc: "dim_shift_calendar & rotational rosters" },
      { id: "comp-production-tables", label: "Production Tables", icon: "Table", desc: "hourly_production_logs & line_cost_batches (127k+ rows)" },
      { id: "comp-master-tables", label: "Master Tables", icon: "Table", desc: "dim_plant, dim_line, dim_section & department maps" },
    ]
  },
  {
    id: "stage-agent",
    name: "Manufacturing Agent (AI Engine)",
    theme: "purple",
    icon: "Brain",
    status: "implemented",
    headerBg: "bg-purple-50/80 dark:bg-purple-950/40 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800",
    items: [
      { id: "comp-fastapi-backend", label: "FastAPI (Backend API)", icon: "Code2", desc: "Async REST endpoints & read-only SQLAlchemy sessions" },
      { id: "comp-langchain-agent", label: "LangChain (Agent Orchestration)", icon: "Workflow", desc: "Bounded tool invocation loop with de-duplication" },
      { id: "comp-deterministic-analytics", label: "Deterministic Analytics (SQL + Rules)", icon: "Cpu", desc: "Pure mathematical variance, FPY & labor productivity math" },
      { id: "comp-domo-ai", label: "Domo AI (Text Generation)", icon: "Sparkles", desc: "DomoTextLLM synthesizing 8 domain expert perspectives" },
    ]
  },
  {
    id: "stage-apps",
    name: "Business Applications",
    theme: "green",
    icon: "LayoutDashboard",
    status: "implemented",
    headerBg: "bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800",
    items: [
      { id: "comp-workforce-dashboard", label: "Workforce Dashboard", icon: "LayoutDashboard", desc: "Plant-wide attendance, headcounts & operational KPIs" },
      { id: "comp-attendance-absenteeism", label: "Attendance & Absenteeism", icon: "CalendarCheck", desc: "Shift-wise absence trends, unnotified leaves & impact" },
      { id: "comp-headcount-demographics", label: "Headcount & Demographics", icon: "Users", desc: "Contract vs permanent ratio, experience vintage & skill tiers" },
      { id: "comp-attrition-tenure", label: "Attrition & Tenure", icon: "LineChart", desc: "Line-level turnover analysis and rework correlation" },
      { id: "comp-shift-planning", label: "Shift Planning & Optimization", icon: "Clock", desc: "Dynamic shift re-balancing and bottleneck relief" },
      { id: "comp-ai-chat", label: "AI Assistance (Chat)", icon: "MessageSquareText", desc: "Interactive natural-language RCA chat drawer" },
    ]
  }
];

export const WORKFORCE_COMPONENTS = {
  // =========================================================================
  // CORE AI ENGINE (Default Active Selection)
  // =========================================================================
  "comp-ai-engine": {
    id: "comp-ai-engine",
    name: "Manufacturing Agent (AI Engine)",
    stageId: "stage-agent",
    stageName: "Manufacturing Agent (AI Engine)",
    status: "implemented",
    owner: "AI / Analytics Team",
    icon: "Brain",
    purpose: "Natural language workforce analytics & actionable insights",
    whatItDoes:
      "The core AI agent that understands workforce queries, analyzes manufacturing workforce data, and provides actionable insights for workforce planning, line balancing, and cost efficiency.",
    keyCapabilities: [
      "Natural language query understanding & intent parsing",
      "Workforce & shift planning recommendations with ROI",
      "Line-level attrition and rework correlation analysis",
      "Automated evidence-backed executive summaries"
    ],
    technologies: ["FastAPI", "LangChain Core", "Domo AI Services", "SQLAlchemy 2.x"],
    inputs: [
      "Structured data from Neon PostgreSQL (employees, attendance, shifts, production, masters)",
      "User queries from the application (conversational chat & analysis drawer)"
    ],
    outputs: [
      "Analytical insights and prioritized recommendations",
      "Trend charts, variance bridges, and workforce summaries",
      "Actionable responses for planning and shopfloor operations"
    ],
    howItWorksChain: [
      { step: 1, label: "User Query (Natural Language)" },
      { step: 2, label: "LangChain (Orchestrate)" },
      { step: 3, label: "Analytics (SQL + Rules)" },
      { step: 4, label: "Domo AI (Generate Insights)" },
      { step: 5, label: "Response (Insights / Charts)" }
    ],
    workflow: [
      "Receives natural-language workforce prompt via POST /api/investigation/ask.",
      "Parses inquiry into scope parameters (Plant, Line, Shift, Period).",
      "Dispatches deterministic analytical tools to fetch verified SQL facts.",
      "Executes Analysis of Competing Hypotheses (ACH) to falsify false correlations.",
      "Invokes DomoTextLLM to synthesize verified findings into actionable business prose."
    ],
    dataFlow: {
      incoming: "HTTP JSON payload with user prompt and session context",
      processing: "LangChain JSON-action execution loop bounded to max 5 steps",
      outgoing: "Structured JSON response with answer, evidence tables, and tool traces"
    },
    dependencies: [
      "Domo AI Services API (/api/ai/v1/text/generation)",
      "Neon PostgreSQL Fact Tables (127,386 operational records)",
      "Deterministic tools in backend/app/tools.py",
      "FastAPI router in backend/app/main.py"
    ],
    technicalDetails: {
      frontend: "ui/src/pages/AIInvestigationsPage.jsx",
      backend: "backend/app/agent.py & backend/app/domo_llm.py",
      api: "POST /api/investigation/ask",
      database: "public.conversations, public.messages, public.audit_events",
      aiTool: "DomoTextLLM (temperature=0.0)"
    }
  },

  // =========================================================================
  // DATA SOURCES
  // =========================================================================
  "comp-employee-hr": {
    id: "comp-employee-hr",
    name: "Employee & HR Master",
    stageId: "stage-sources",
    stageName: "Data Sources",
    status: "implemented",
    owner: "Human Resources / IT",
    icon: "Users",
    purpose: "Canonical employee master profiles and wage classifications",
    whatItDoes:
      "Captures demographic profiles, worker IDs, designations, pay tiers, department mappings, and contract vs permanent employment classifications.",
    keyCapabilities: [
      "Worker skill certification tracking (SMT, Soldering, Assembly)",
      "Department and section organizational hierarchy mapping",
      "Contract labor vendor allocation records",
      "Base hourly wage and overtime rate normalization"
    ],
    technologies: ["ERP / HRMS Export", "PostgreSQL", "Pydantic"],
    inputs: ["HRMS payroll master dumps", "Biometric enrollment logs", "Contractor agency manifests"],
    outputs: ["dim_employee master records", "Operator badge lookup tables"],
    howItWorksChain: [
      { step: 1, label: "HRMS Export" },
      { step: 2, label: "Worker ID Validation" },
      { step: 3, label: "Skill & Tier Tagging" },
      { step: 4, label: "dim_employee Commit" }
    ],
    workflow: [
      "Exports employee master records from enterprise HRMS.",
      "Validates employee badge uniqueness and active deployment status.",
      "Maps operators to assigned plants (IN-TS-01, 02, 03) and primary lines."
    ],
    dataFlow: {
      incoming: "CSV/Excel employee roster files",
      processing: "Deduplication and badge code indexing",
      outgoing: "Relational master records in Neon PostgreSQL"
    },
    dependencies: ["HRMS Active Directory", "Biometric Timeclocks"],
    technicalDetails: {
      frontend: "ui/src/pages/DataImportStudio.jsx",
      backend: "backend/app/models/operational_dimensions.py",
      api: "POST /api/import/upload",
      database: "public.dim_employee / master_data",
      aiTool: "correlate_shift_performance"
    }
  },

  "comp-attendance-data": {
    id: "comp-attendance-data",
    name: "Attendance & Biometric Records",
    stageId: "stage-sources",
    stageName: "Data Sources",
    status: "implemented",
    owner: "Shopfloor Operations",
    icon: "CalendarCheck",
    purpose: "Shift-wise biometric punch records and absenteeism tracking",
    whatItDoes:
      "Tracks scheduled vs actual present operators across Shift 1, Shift 2, and Shift 3, measuring unplanned absenteeism, tardiness, and overtime hours per production line.",
    keyCapabilities: [
      "Shift attendance percentage calculation per line",
      "Unplanned absenteeism spike alerts",
      "Overtime hours tracking vs standard shift duration",
      "Contract worker buffer staffing reconciliation"
    ],
    technologies: ["Biometric IoT Terminals", "FastAPI Ingestion", "SQLAlchemy 2.x"],
    inputs: ["Biometric turnstile entry/exit logs", "Supervisor shift muster sheets"],
    outputs: ["workforce_shift_records table", "Absentee rate metrics per shift"],
    howItWorksChain: [
      { step: 1, label: "Biometric Punch" },
      { step: 2, label: "Shift Match" },
      { step: 3, label: "Absence Calc" },
      { step: 4, label: "Shift Fact Update" }
    ],
    workflow: [
      "Streams daily turnstile punch logs into staging table.",
      "Aggregates scheduled vs present counts per line and shift.",
      "Calculates absentee rate % and overtime hours."
    ],
    dataFlow: {
      incoming: "Hourly shift attendance batches",
      processing: "Scheduled vs actual presence math",
      outgoing: "Committed workforce attendance facts"
    },
    dependencies: ["Shopfloor Turnstiles", "Staging Ingestion Buffer"],
    technicalDetails: {
      frontend: "ui/src/pages/DataImportStudio.jsx",
      backend: "backend/app/models/real_datasets.py",
      api: "POST /api/import/upload",
      database: "public.hourly_production_logs, workforce_shift_records",
      aiTool: "correlate_shift_performance"
    }
  },

  // =========================================================================
  // DATA INGESTION & VALIDATION
  // =========================================================================
  "comp-data-validation": {
    id: "comp-data-validation",
    name: "Data Ingestion & Validation Layer",
    stageId: "stage-ingestion",
    stageName: "Data Ingestion & Validation",
    status: "implemented",
    owner: "Data Platform Team",
    icon: "ShieldCheck",
    purpose: "14 multi-pass deterministic rules and atomic promotion",
    whatItDoes:
      "Validates uploaded workforce and manufacturing files against schema definitions, enforcing non-negative costs, valid dates, required identifiers, and zero orphan records before promotion.",
    keyCapabilities: [
      "14 multi-pass deterministic validation rules",
      "Fuzzy header synonym auto-matching across 40+ variants",
      "Strategy C pre-update fact archival in fact_record_history",
      "Data readiness scorecard and trust score calculation"
    ],
    technologies: ["Python 3.11", "StreamingInspector", "Pydantic v2", "SQLAlchemy 2.x"],
    inputs: ["Raw CSV/Excel upload streams", "Target table schema definitions"],
    outputs: ["Validated staging datasets", "data_quality_issues audit rows", "Promotion commit tokens"],
    howItWorksChain: [
      { step: 1, label: "Upload Stream" },
      { step: 2, label: "Header Auto-Map" },
      { step: 3, label: "14-Rule Validator" },
      { step: 4, label: "Atomic ACID Commit" }
    ],
    workflow: [
      "Inspects file stream and computes SHA-256 session hash.",
      "Matches columns to target schemas using normalized Levenshtein distance.",
      "Executes validation rules; logs row-level coordinate issues.",
      "Promotes clean records into Neon PostgreSQL operational facts."
    ],
    dataFlow: {
      incoming: "Multipart file chunks up to 100MB",
      processing: "Rule-based filtering, null checks, type coercion",
      outgoing: "Clean fact tables in Neon PostgreSQL"
    },
    dependencies: ["import_batches table", "stg_* staging tables"],
    technicalDetails: {
      frontend: "ui/src/pages/DataImportStudio.jsx",
      backend: "backend/app/services/ingestion/data_validator.py & promotion_service.py",
      api: "POST /api/import/upload, POST /api/import/promote/{batch_id}",
      database: "public.import_batches, public.data_quality_issues, public.fact_record_history",
      aiTool: "validate_cost_data"
    }
  },

  // =========================================================================
  // DATA PLATFORM
  // =========================================================================
  "comp-neon-db": {
    id: "comp-neon-db",
    name: "Neon PostgreSQL Data Platform",
    stageId: "stage-platform",
    stageName: "Data Platform",
    status: "implemented",
    owner: "Database Architecture",
    icon: "Database",
    purpose: "127k+ operational fact records and sub-second analytical views",
    whatItDoes:
      "Serverless PostgreSQL database storing 127,386 verified operational manufacturing and workforce records spanning August to December 2026, backed by pre-aggregated analytical views.",
    keyCapabilities: [
      "B-Tree indexed operational fact tables (line_cost_batches, hourly_production_logs)",
      "Pre-materialized views (v_cost_facts, v_variance_facts) for instant bridges",
      "Connection pooling with pool_pre_ping and keepalive tuning via psycopg 3",
      "Immutable snapshot storage for 457 historical investigation reports"
    ],
    technologies: ["Neon Serverless PostgreSQL", "SQLAlchemy 2.0.48", "Psycopg 3.3.3", "SSL Required"],
    inputs: ["Promoted batch commits from PromotionService", "Analytical tool queries from LangChain"],
    outputs: ["Verified fact records", "Sub-second SQL aggregations", "Durable report JSONs"],
    howItWorksChain: [
      { step: 1, label: "Promotion Write" },
      { step: 2, label: "WAL Commit" },
      { step: 3, label: "B-Tree Indexing" },
      { step: 4, label: "View Aggregation" },
      { step: 5, label: "Fast Query Return" }
    ],
    workflow: [
      "Maintains transactional operational tables across cost, production, and quality.",
      "Executes SQL variance aggregations with zero mathematical discrepancy.",
      "Persists investigation report JSON payloads for zero-recalculation historical reopening."
    ],
    dataFlow: {
      incoming: "ACID transactional inserts from promotion pipeline",
      processing: "Indexed relational joins, analytical aggregations",
      outgoing: "Fast query datasets consumed by FastAPI and AI tools"
    },
    dependencies: ["Neon Serverless AWS Infrastructure", "SQLAlchemy ORM"],
    technicalDetails: {
      frontend: "Direct SQL grounding across all pages",
      backend: "backend/app/db.py & backend/app/db_views.py",
      api: "SQLAlchemy 2.0 Engine",
      database: "neondb public schema (53 base tables, 2 views, 127,386 active facts)",
      aiTool: "All deterministic tools in tools.py"
    }
  },

  // =========================================================================
  // FASTAPI BACKEND
  // =========================================================================
  "comp-fastapi": {
    id: "comp-fastapi",
    name: "FastAPI REST API Layer",
    stageId: "stage-agent",
    stageName: "Manufacturing Agent (AI Engine)",
    status: "implemented",
    owner: "Backend Engineering",
    icon: "Code2",
    purpose: "High-performance async REST endpoints & SQLAlchemy sessions",
    whatItDoes:
      "Serves as the high-throughput asynchronous backend layer, exposing validated REST endpoints for data upload, analytical KPI retrieval, report history, and conversational AI investigations.",
    keyCapabilities: [
      "Asynchronous non-blocking route handling with Pydantic v2 validation",
      "Scoped database sessions with automatic rollback on exception",
      "CORS-configured middleware supporting React Vite frontend",
      "Direct integration with Domo AI Services and LangChain Core"
    ],
    technologies: ["FastAPI 0.115+", "Python 3.11", "Uvicorn", "Pydantic v2"],
    inputs: ["HTTP JSON requests from React UI", "Multipart streaming file uploads"],
    outputs: ["Standardized JSON responses", "Streaming SSE tokens for agent responses"],
    howItWorksChain: [
      { step: 1, label: "HTTP Request" },
      { step: 2, label: "Pydantic Validation" },
      { step: 3, label: "Service / Tool Call" },
      { step: 4, label: "DB Query" },
      { step: 5, label: "JSON Response" }
    ],
    workflow: [
      "Validates request headers and query parameters.",
      "Opens isolated SQLAlchemy database session.",
      "Dispatches query to InvestigationEngineService or LangChain Agent.",
      "Returns serializable JSON payload to UI."
    ],
    dataFlow: {
      incoming: "REST requests on port 8000",
      processing: "Route handlers, schema validation, analytical services",
      outgoing: "JSON API responses to React client"
    },
    dependencies: ["Uvicorn ASGI Server", "SQLAlchemy Sessionmaker"],
    technicalDetails: {
      frontend: "ui/src/services/apiCache.js",
      backend: "backend/app/main.py",
      api: "/api/overview, /api/import, /api/investigation, /api/reports",
      database: "Neon PostgreSQL",
      aiTool: "agent.py (run_agent)"
    }
  },

  // =========================================================================
  // BUSINESS APPLICATIONS
  // =========================================================================
  "comp-business-apps": {
    id: "comp-business-apps",
    name: "Workforce Business Applications",
    stageId: "stage-apps",
    stageName: "Business Applications",
    status: "implemented",
    owner: "Operations & HR Leadership",
    icon: "LayoutDashboard",
    purpose: "Interactive executive dashboards, planning tools & AI chat",
    whatItDoes:
      "Enterprise UI suite delivering operational workforce dashboards, absenteeism tracking, shift planning tools, and the conversational AI root-cause investigation sandbox.",
    keyCapabilities: [
      "Executive KPI pulse: Headcount, attendance %, yield, and cost per good unit",
      "Shift-wise absence and overtime trend heatmaps",
      "Automated Cost Improvement Plan with assigned owners and timelines",
      "Historical audit report viewer with instant snapshot reopening"
    ],
    technologies: ["React 18", "Vite", "Tailwind CSS", "Recharts", "Lucide Icons"],
    inputs: ["Aggregated KPI JSONs from FastAPI", "Investigation report snapshots"],
    outputs: ["Interactive charts", "Exportable audit reports", "Actionable engineering tasks"],
    howItWorksChain: [
      { step: 1, label: "API Fetch" },
      { step: 2, label: "React State" },
      { step: 3, label: "Recharts Render" },
      { step: 4, label: "User Action" },
      { step: 5, label: "Feedback Loop" }
    ],
    workflow: [
      "Renders responsive executive dashboard views.",
      "Allows plant managers to filter by facility, production line, and date range.",
      "Enables conversational drill-down into specific shift and cost anomalies."
    ],
    dataFlow: {
      incoming: "FastAPI REST API responses",
      processing: "Client-side sorting, charting, and state caching",
      outgoing: "User-initiated actions, report downloads, feedback tickets"
    },
    dependencies: ["FastAPI Backend", "React Router DOM v7"],
    technicalDetails: {
      frontend: "ui/src/pages/OverviewPage.jsx, ReportsPage.jsx, AIInvestigationsPage.jsx",
      backend: "backend/app/services/investigation/investigation_engine.py",
      api: "GET /api/overview/kpi-summary, GET /api/reports",
      database: "v_cost_facts, investigation_reports",
      aiTool: "AI Investigations Chat Drawer"
    }
  }
};
