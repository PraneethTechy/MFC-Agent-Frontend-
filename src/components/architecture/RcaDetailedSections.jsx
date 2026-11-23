import React, { useState } from "react";
import {
  Layers,
  Database,
  Cpu,
  Brain,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Code2,
  Table,
  Workflow,
  Sparkles,
  GitBranch,
  ArrowRight,
  Info,
  Server,
  Zap,
  Lock,
  Boxes,
  Activity,
  Coins,
  Truck,
  Wrench,
  Search,
  FileText,
} from "lucide-react";
import {
  ARCHITECTURE_COMPONENTS,
  OPERATIONAL_DATASET_FAMILIES,
  VERIFIED_LANGCHAIN_TOOLS,
} from "./architectureData";

export default function RcaDetailedSections({
  selectedId = "engine-deterministic-variance",
  onSelectComponent,
}) {
  const [activeTab, setActiveTab] = useState("overall");

  const component = ARCHITECTURE_COMPONENTS[selectedId] || ARCHITECTURE_COMPONENTS["engine-deterministic-variance"];

  const detailTabs = [
    { id: "overall", label: "A. System Architecture", icon: Server },
    { id: "dataflow", label: "B. End-to-End Data Flow", icon: Workflow },
    { id: "frontend", label: "C. Frontend Architecture", icon: Code2 },
    { id: "backend", label: "D. Backend & FastAPI", icon: Cpu },
    { id: "database", label: "E. Database & 7 Datasets", icon: Database },
    { id: "deterministic", label: "F. Deterministic Math & Tools", icon: Brain },
    { id: "ai-reasoning", label: "G. AI Reasoning & Governance", icon: Sparkles },
    { id: "apis", label: "H. API Registry", icon: GitBranch },
    { id: "status", label: "I. Implementation Status", icon: CheckCircle2 },
    { id: "gaps", label: "J. Architecture Gaps", icon: AlertTriangle },
  ];

  return (
    <div className="w-full bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 shadow-2xs flex flex-col gap-3">
      {/* Top Banner: Selected Component Context */}
      <div className="p-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
          <span className="text-xs text-purple-950 dark:text-purple-200 font-semibold">
            Active Inspection Focus:
          </span>
          <span className="text-xs font-extrabold text-brand-purple dark:text-purple-300">
            {component.name}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            ({component.id})
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 text-[11px]">Primary KPI:</span>
          <span className="font-extrabold text-slate-800 dark:text-slate-200 text-[11px] bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
            Manufacturing Cost per Good Smartphone
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs for Area C */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 bg-slate-100/70 dark:bg-slate-800/70 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700">
        {detailTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                isActive
                  ? "bg-brand-purple text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="pt-1 text-xs">
        {/* =====================================================================
            TAB A: OVERALL SYSTEM ARCHITECTURE
            ===================================================================== */}
        {activeTab === "overall" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 flex flex-col gap-1.5">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-blue-600" />
                1. Data Foundation & Ingestion
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                Ground-truth operational datasets from shopfloor MES, SAP ERP, and AOI inspection rigs stream into isolated staging tables (<code className="text-purple-600">stg_*</code>). Fourteen multi-pass deterministic integrity checks ensure non-negative costs, valid dates, and zero orphan batches before atomic ACID promotion into Neon PostgreSQL 16.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 flex flex-col gap-1.5">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-brand-purple" />
                2. Deterministic Calculation & Agent Loop
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                FastAPI routes queries to LangChain Core. The agent identifies the smartphone SKU and period, then dispatches 9 verified Python/SQL tools. Mathematical variance bridges, station-level defect Pareto (S01-S06), and First-Pass Yield are calculated deterministically without LLM arithmetic.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 flex flex-col gap-1.5">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                3. AI Evidence Evaluation & Action
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                DomoTextLLM synthesizes findings across 8 manufacturing domain perspectives, enforcing strict evidence governance: <strong className="text-emerald-600">PROVEN</strong>, <strong className="text-blue-600">OBSERVED_CORRELATION</strong>, <strong className="text-amber-600">HYPOTHESIS</strong>, and <strong className="text-red-500">UNAVAILABLE</strong>. Concrete playbooks with bounded savings opportunities (₹18.31 Cr) are delivered to plant leadership.
              </p>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB B: END-TO-END DATA FLOW
            ===================================================================== */}
        {activeTab === "dataflow" && (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
              {[
                { step: "1. Upload & Stream", desc: "Streaming multipart CSV/XLSX parser with SHA-256 batch token and 40+ synonym auto-mapping.", color: "border-blue-300 bg-blue-50/40 text-blue-900" },
                { step: "2. Staging & Checks", desc: "Raw records land in stg_* tables. 14 deterministic validation rules check null tolerances and cost boundaries.", color: "border-emerald-300 bg-emerald-50/40 text-emerald-900" },
                { step: "3. Neon Star Schema", desc: "Atomic commit promotes facts into line_cost_batches, hourly_production_logs with pre-update Strategy C archival.", color: "border-blue-300 bg-blue-50/40 text-blue-900" },
                { step: "4. Python/SQL Math", desc: "Pure algorithms compute Cost per Good Unit, First-Pass Yield, and standard vs actual variance bridges.", color: "border-purple-300 bg-purple-50/40 text-purple-900" },
                { step: "5. Domo AI Synthesis", desc: "DomoTextLLM classifies evidence into 4 gates, generates root-cause proof chains, and outputs ₹18.31 Cr playbooks.", color: "border-emerald-300 bg-emerald-50/40 text-emerald-900" },
              ].map((flow, idx) => (
                <div key={idx} className={`p-2.5 rounded-xl border ${flow.color} flex flex-col gap-1`}>
                  <span className="font-extrabold text-xs">{flow.step}</span>
                  <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">{flow.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB C: FRONTEND ARCHITECTURE
            ===================================================================== */}
        {activeTab === "frontend" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">React 18 + Vite + Tailwind CSS Modules</span>
              <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                <li><code className="text-purple-600 font-bold">AppSidebar.jsx</code>: 9 primary enterprise navigation sections + carved white surface routing.</li>
                <li><code className="text-purple-600 font-bold">OverviewPage.jsx</code>: Executive manufacturing KPI pulse, dynamic date range filter, and cost trend series.</li>
                <li><code className="text-purple-600 font-bold">DataImportStudio.jsx</code>: Drag-and-drop streaming ingestion workbench with SHA-256 pre-flight inspection.</li>
                <li><code className="text-purple-600 font-bold">InvestigationReport.jsx</code>: Dynamic variance waterfall, donut attribution, defect Pareto, and export engine.</li>
                <li><code className="text-purple-600 font-bold">AIInvestigationsPage.jsx</code>: Conversational agent workbench with message stream and proof citations.</li>
              </ul>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">State & Client Services Layer</span>
              <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                <li><strong>API Communication:</strong> Fetch / Axios async client communicating with FastAPI on port 8000.</li>
                <li><strong>Session & Scoping:</strong> Plant-level, line-level, and smartphone SKU filters stored in React state.</li>
                <li><strong>Visual System:</strong> Lucide React icons, GitHub-styled badges, responsive flex-grid layout.</li>
                <li><strong>No Mock Data:</strong> Zero synthetic hardcoding; all charts, waterfalls, and KPIs ground in verified API JSON responses.</li>
              </ul>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB D: BACKEND & FASTAPI ARCHITECTURE
            ===================================================================== */}
        {activeTab === "backend" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">FastAPI Architecture (Python 3.11)</span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Asynchronous REST API gateway powered by Starlette and Pydantic v2. Handles multi-part file uploads, schema validation, query parameter sanitization, and read-only database sessions via SQLAlchemy 2.x and Psycopg 3.
              </p>
              <div className="font-mono text-[10px] bg-slate-900 text-slate-200 p-2 rounded-lg overflow-x-auto">
                backend/app/main.py (2,700+ lines, 30+ endpoints)<br />
                backend/app/agent.py (LangChain loop & DomoTextLLM)<br />
                backend/app/tools.py (9 deterministic investigation tools)<br />
                backend/app/services/ingestion/promotion_service.py (Strategy C ACID promotion)
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">Key Backend Responsibilities</span>
              <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                <li><strong>Pre-flight Streaming Inspector:</strong> Checks CSV headers, row counts, and duplicate SHA-256 checksums in <code>streaming_inspector.py</code>.</li>
                <li><strong>Multi-Pass Validation Service:</strong> Enforces 14 deterministic integrity rules in <code>validation.py</code>.</li>
                <li><strong>Strategy C Atomic Promotion:</strong> Archives pre-update records into <code>fact_record_history</code> before transactional commit.</li>
                <li><strong>Cost Intelligence Service:</strong> Computes cost per good unit, variance bridges, and cost drivers in <code>services/cost_engine/</code>.</li>
              </ul>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB E: DATABASE & 7 DATASETS
            ===================================================================== */}
        {activeTab === "database" && (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Neon PostgreSQL 16: Seven Operational Dataset Families (127k+ Active Records)
              </span>
              <span className="text-[10px] font-bold text-emerald-600">Zero Synthetic Extrapolation</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {OPERATIONAL_DATASET_FAMILIES.map((fam) => (
                <div key={fam.id} className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200">{fam.name}</span>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded">
                      {fam.recordsCount}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-purple-700 dark:text-purple-300">
                    Table: {fam.operationalTable}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400">
                    Staging: {fam.stagingTable}
                  </div>
                  <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-1 leading-tight">
                    {fam.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB F: DETERMINISTIC ENGINE & 9 TOOLS
            ===================================================================== */}
        {activeTab === "deterministic" && (
          <div className="flex flex-col gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/60">
              <span className="font-bold text-xs text-brand-purple block mb-1">
                Deterministic Calculation Formula (Master Principle):
              </span>
              <code className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                Manufacturing Cost per Good Smartphone = Total Direct Costs / Total Good Units Produced
              </code>
              <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-1">
                Python and SQL calculate all financial numbers. Domo AI is strictly forbidden from performing arithmetic or estimating financial totals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {VERIFIED_LANGCHAIN_TOOLS.map((tool, idx) => (
                <div key={idx} className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs font-mono text-brand-purple">{tool.name}</span>
                    <span className="text-[9px] font-semibold text-slate-400">{tool.category}</span>
                  </div>
                  <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-tight">
                    {tool.purpose}
                  </p>
                  <span className="text-[9px] font-mono text-slate-400 mt-0.5 truncate">
                    File: {tool.file}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB G: AI REASONING & 4 EVIDENCE GATES
            ===================================================================== */}
        {activeTab === "ai-reasoning" && (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              {[
                { gate: "PROVEN", desc: "Directly supported by verified records and reproducible SQL calculations (e.g. actual direct costs from line_cost_batches).", color: "bg-emerald-50 text-emerald-800 border-emerald-300" },
                { gate: "OBSERVED_CORRELATION", desc: "A measurable relationship exists, but causality is unverified (e.g. standard vs actual variance, since engineering standards are unverified).", color: "bg-blue-50 text-blue-800 border-blue-300" },
                { gate: "HYPOTHESIS", desc: "A plausible explanation requiring additional empirical evidence (e.g. BOM differences causing cost variance, since purchase prices were missing).", color: "bg-amber-50 text-amber-800 border-amber-300" },
                { gate: "UNAVAILABLE", desc: "Required information is missing or unreliable in current schema (e.g. factory overhead allocation, price vs usage split).", color: "bg-red-50 text-red-800 border-red-300" },
              ].map((g, idx) => (
                <div key={idx} className={`p-2.5 rounded-xl border ${g.color} flex flex-col gap-1`}>
                  <span className="font-black text-xs">{g.gate}</span>
                  <p className="text-[10px] leading-relaxed text-slate-700 dark:text-slate-300">{g.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                Eight Manufacturing Domain Perspectives Synthesized by DomoTextLLM:
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                <span>1. Manufacturing Cost Engineer</span>
                <span>2. Production Engineer</span>
                <span>3. Quality Assurance Engineer</span>
                <span>4. Procurement & Supplier Analyst</span>
                <span>5. Inventory & WIP Analyst</span>
                <span>6. Industrial Engineer</span>
                <span>7. Maintenance Specialist</span>
                <span>8. Smartphone Testing Specialist</span>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB H: API & INTEGRATION MAPPING
            ===================================================================== */}
        {activeTab === "apis" && (
          <div className="flex flex-col gap-2">
            <div className="font-mono text-[10px] space-y-1.5 bg-slate-900 text-slate-200 p-3 rounded-xl overflow-x-auto max-h-[300px]">
              <div><span className="text-emerald-400 font-bold">POST</span> /api/import/inspect-stream <span className="text-slate-400"># SHA-256 pre-flight checksum & schema check</span></div>
              <div><span className="text-emerald-400 font-bold">POST</span> /api/import/upload <span className="text-slate-400"># Bulk upload streaming to stg_* tables</span></div>
              <div><span className="text-emerald-400 font-bold">POST</span> /api/import/&#123;batch_id&#125;/validate <span className="text-slate-400"># 14 multi-pass deterministic integrity checks</span></div>
              <div><span className="text-emerald-400 font-bold">POST</span> /api/import/&#123;batch_id&#125;/commit <span className="text-slate-400"># Strategy C ACID promotion into operational facts</span></div>
              <div><span className="text-blue-400 font-bold">GET</span>  /api/dashboard/overview <span className="text-slate-400"># Ground-truth KPIs, cost trends & breakdown</span></div>
              <div><span className="text-emerald-400 font-bold">POST</span> /api/cost/variance-bridge <span className="text-slate-400"># Python variance waterfall decomposition</span></div>
              <div><span className="text-emerald-400 font-bold">POST</span> /api/cost/investigate <span className="text-slate-400"># Defect Pareto & SMT/FAL station yield analysis</span></div>
              <div><span className="text-emerald-400 font-bold">POST</span> /api/chat <span className="text-slate-400"># LangChain agent + DomoTextLLM RCA interaction</span></div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB I: IMPLEMENTATION STATUS
            ===================================================================== */}
        {activeTab === "status" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
              <span className="font-bold text-xs text-emerald-800 dark:text-emerald-300 block mb-1">
                ✔ Implemented (Verified in Repo)
              </span>
              <ul className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
                <li>• 7 Operational Dataset Tables in Neon PostgreSQL</li>
                <li>• 14 Deterministic Validation Rules in validation.py</li>
                <li>• Strategy C Atomic Promotion Service</li>
                <li>• 9 LangChain Tools in tools.py</li>
                <li>• DomoTextLLM Text Generation Service</li>
                <li>• Executive Overview & Cost Waterfall Pages</li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              <span className="font-bold text-xs text-amber-800 dark:text-amber-300 block mb-1">
                ▲ Partial Implementation
              </span>
              <ul className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
                <li>• Standard vs Actual rate/usage split (standards unverified)</li>
                <li>• Operator Shift Correlation (biometric logs staged)</li>
                <li>• Live Machine Telemetry (simulated interval sensors)</li>
                <li>• Export to Excel (PDF currently prioritized)</li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800">
              <span className="font-bold text-xs text-indigo-800 dark:text-indigo-300 block mb-1">
                ⏱ Planned Capabilities
              </span>
              <ul className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
                <li>• Closed-loop automatic standard cost recalibration</li>
                <li>• ERP Webhook automated sync (SAP NetWeaver)</li>
                <li>• Multi-plant autonomous anomaly alerting bots</li>
                <li>• Energy tariff peak/off-peak dynamic weighting</li>
              </ul>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB J: ARCHITECTURE GAPS & ROADMAP
            ===================================================================== */}
        {activeTab === "gaps" && (
          <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Identified Architecture Gaps & Engineering Resolution Path
            </span>
            <div className="space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
              <div className="p-2 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                <strong className="text-amber-800 dark:text-amber-300">Gap 1 — Future-Dated Records (Nov 20 to Dec 31, 2026):</strong>
                <p className="mt-0.5">Resolved in validation pipeline: all records dated past current time (November 19, 2026) are tagged as staged/planned and strictly excluded from historical actuals comparison baselines.</p>
              </div>
              <div className="p-2 rounded-lg bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50">
                <strong className="text-purple-800 dark:text-purple-300">Gap 2 — Factory Overhead Pool Granularity:</strong>
                <p className="mt-0.5">Direct overheads are marked UNAVAILABLE in UI breakdowns to prevent false precision until GL overhead allocation tables are populated.</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">
                <strong className="text-blue-800 dark:text-blue-300">Gap 3 — Unverified Engineering Standards:</strong>
                <p className="mt-0.5">Standard costs in <code>product_standard_costs</code> lack revision timestamps; flagged under OBSERVED_CORRELATION rather than PROVEN until engineering sign-off.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
