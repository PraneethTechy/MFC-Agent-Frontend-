import React from "react";
import {
  Coins,
  Activity,
  Boxes,
  Truck,
  Layers,
  ShieldCheck,
  Wrench,
  CloudUpload,
  Database,
  Search,
  CheckCircle2,
  Lock,
  FileText,
  BarChart3,
  Cpu,
  Brain,
  Sparkles,
  LayoutDashboard,
  LineChart,
  RotateCw,
  ArrowRight,
  TrendingDown,
  Scale,
  GitBranch,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { ARCHITECTURE_COMPONENTS } from "./architectureData";

export default function RcaArchitectureDiagram({
  selectedId = "engine-deterministic-variance",
  onSelectComponent,
}) {
  return (
    <div className="w-full bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 shadow-2xs flex flex-col gap-3 relative">
      {/* Top Header of Diagram Box */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-purple-100 text-brand-purple dark:bg-purple-950/60 dark:text-purple-300 flex items-center justify-center font-bold">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-brand-navy dark:text-slate-100 leading-tight">
              Manufacturing Cost RCA Agent – Technical System Architecture
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Primary KPI: <span className="font-bold text-slate-700 dark:text-slate-300">Manufacturing Cost per Good Smartphone</span> • SMT & FAL Lines
            </p>
          </div>
        </div>

        {/* Status Legend */}
        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Implemented</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            <span>Partial</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" />
            <span>Planned</span>
          </span>
        </div>
      </div>

      {/* 5-Stage Connected Pipeline Grid (Upper Architecture Canvas) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5 items-stretch relative pt-0.5">
        {/* =====================================================================
            STAGE 1: MANUFACTURING DATA SOURCES (Blue)
            ===================================================================== */}
        <div
          onClick={() => onSelectComponent("source-cost-batches")}
          className={`flex flex-col rounded-xl border p-2 transition-all duration-150 cursor-pointer ${
            selectedId.startsWith("source-")
              ? "bg-blue-50/70 border-blue-400 dark:bg-blue-950/30 dark:border-blue-700 shadow-xs ring-2 ring-blue-400/30"
              : "bg-blue-50/25 dark:bg-blue-950/15 border-blue-200/70 dark:border-blue-900/40 hover:border-blue-300"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-blue-200/60 dark:border-blue-900/60 text-blue-900 dark:text-blue-300">
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              <h3 className="text-[11px] font-black uppercase tracking-wider">
                1. Data Sources
              </h3>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-blue-100 dark:bg-blue-900/50 rounded text-blue-700 dark:text-blue-300">
              7 Sets
            </span>
          </div>

          {/* Items */}
          <div className="flex flex-col gap-1">
            {[
              { id: "source-cost-batches", label: "Manufacturing Cost", sub: "9.5k batches", icon: Coins },
              { id: "source-hourly-production", label: "Hourly Production", sub: "13.3k logs", icon: Activity },
              { id: "source-bom-components", label: "BOM Specifications", sub: "246 items", icon: Boxes },
              { id: "source-material-procurement", label: "Material Procurement", sub: "996 POs", icon: Truck },
              { id: "source-material-consumption", label: "Material Consumption", sub: "14.8k issues", icon: Layers },
              { id: "source-quality-inspection", label: "Quality Inspection", sub: "16k AOI tests", icon: ShieldCheck },
              { id: "source-quality-rework", label: "Quality Rework", sub: "3.4k events", icon: Wrench },
            ].map((item) => {
              const Icon = item.icon;
              const isItemActive = selectedId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectComponent(item.id);
                  }}
                  className={`p-1 rounded-md border text-left flex items-center justify-between gap-1 transition-all ${
                    isItemActive
                      ? "bg-white dark:bg-slate-800 border-blue-500 shadow-2xs font-bold text-blue-900 dark:text-blue-200"
                      : "bg-white/85 dark:bg-slate-800/80 border-blue-100/90 dark:border-blue-900/40 text-slate-700 dark:text-slate-300 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Icon className="w-3 h-3 text-blue-600 shrink-0" />
                    <span className="text-[10px] font-semibold truncate leading-tight">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 shrink-0">
                    {item.sub}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* =====================================================================
            STAGE 2: INGESTION & VALIDATION (Green)
            ===================================================================== */}
        <div
          onClick={() => onSelectComponent("ingest-multi-validator")}
          className={`flex flex-col rounded-xl border p-2 transition-all duration-150 cursor-pointer ${
            selectedId.startsWith("ingest-")
              ? "bg-emerald-50/70 border-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-700 shadow-xs ring-2 ring-emerald-400/30"
              : "bg-emerald-50/25 dark:bg-emerald-950/15 border-emerald-200/70 dark:border-emerald-900/40 hover:border-emerald-300"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-emerald-200/60 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <h3 className="text-[11px] font-black uppercase tracking-wider">
                2. Ingestion Gateway
              </h3>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-900/50 rounded text-emerald-700 dark:text-emerald-300">
              ACID
            </span>
          </div>

          {/* Items */}
          <div className="flex flex-col gap-1.5 my-auto">
            {[
              { id: "ingest-file-upload", label: "Streaming File Upload", sub: "SHA-256 Checksum", icon: CloudUpload },
              { id: "ingest-schema-validator", label: "Schema & Synonym Mapping", sub: "40+ Header Dicts", icon: GitBranch },
              { id: "ingest-multi-validator", label: "Multi-Pass Validation", sub: "14 Integrity Rules", icon: ShieldCheck },
              { id: "ingest-atomic-promotion", label: "Atomic ACID Promotion", sub: "Strategy C Commit", icon: CheckCircle2 },
            ].map((item) => {
              const Icon = item.icon;
              const isItemActive = selectedId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectComponent(item.id);
                  }}
                  className={`p-1.5 rounded-lg border text-left flex flex-col gap-0.5 transition-all ${
                    isItemActive
                      ? "bg-white dark:bg-slate-800 border-emerald-500 shadow-2xs font-bold text-emerald-900 dark:text-emerald-200"
                      : "bg-white/85 dark:bg-slate-800/80 border-emerald-100/90 dark:border-emerald-900/40 text-slate-700 dark:text-slate-300 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="text-[10px] font-semibold truncate leading-tight">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 pl-4.5">
                    {item.sub}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* =====================================================================
            STAGE 3: DATA PLATFORM (Neon PostgreSQL 16) (Blue)
            ===================================================================== */}
        <div
          onClick={() => onSelectComponent("platform-postgres-facts")}
          className={`flex flex-col rounded-xl border p-2 transition-all duration-150 cursor-pointer ${
            selectedId.startsWith("platform-")
              ? "bg-blue-50/70 border-blue-400 dark:bg-blue-950/30 dark:border-blue-700 shadow-xs ring-2 ring-blue-400/30"
              : "bg-blue-50/25 dark:bg-blue-950/15 border-blue-200/70 dark:border-blue-900/40 hover:border-blue-300"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-blue-200/60 dark:border-blue-900/60 text-blue-900 dark:text-blue-300">
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              <h3 className="text-[11px] font-black uppercase tracking-wider">
                3. Data Platform
              </h3>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-blue-100 dark:bg-blue-900/50 rounded text-blue-700 dark:text-blue-300">
              127k+ Rows
            </span>
          </div>

          {/* Central Neon PostgreSQL Badge */}
          <div className="mb-1 py-1 px-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg flex items-center justify-center gap-1.5 shadow-2xs">
            <Database className="w-3 h-3" />
            <span className="text-[10px] font-extrabold tracking-wide">
              Neon PostgreSQL 16
            </span>
          </div>

          {/* Platform Nodes */}
          <div className="flex flex-col gap-1">
            {[
              { id: "platform-staging-isolation", label: "Staging Buffer", sub: "stg_* isolated tables", icon: Lock },
              { id: "platform-postgres-facts", label: "Operational Facts", sub: "line_cost_batches, etc.", icon: Database },
              { id: "platform-master-views", label: "Star Dimensions", sub: "plants, lines, SKUs", icon: Layers },
              { id: "platform-sql-views", label: "Analytical Views", sub: "v_cost_facts, v_variance", icon: BarChart3 },
              { id: "platform-audit-ledger", label: "Immutable Audit", sub: "fact_record_history", icon: FileText },
            ].map((item) => {
              const Icon = item.icon;
              const isItemActive = selectedId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectComponent(item.id);
                  }}
                  className={`p-1 rounded-md border text-left flex items-center justify-between gap-1 transition-all ${
                    isItemActive
                      ? "bg-white dark:bg-slate-800 border-blue-500 shadow-2xs font-bold text-blue-900 dark:text-blue-200"
                      : "bg-white/85 dark:bg-slate-800/80 border-blue-100/90 dark:border-blue-900/40 text-slate-700 dark:text-slate-300 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Icon className="w-3 h-3 text-blue-600 shrink-0" />
                    <span className="text-[10px] font-semibold truncate leading-tight">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 shrink-0 truncate max-w-[70px]">
                    {item.sub}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* =====================================================================
            STAGE 4: INTELLIGENCE CORE (Purple - Highlighted)
            ===================================================================== */}
        <div
          onClick={() => onSelectComponent("engine-deterministic-variance")}
          className={`flex flex-col rounded-xl border-2 p-2 transition-all duration-150 cursor-pointer ${
            selectedId.startsWith("engine-")
              ? "bg-purple-50/90 border-brand-purple dark:bg-purple-950/40 dark:border-purple-500 shadow-md ring-3 ring-purple-500/25 scale-[1.01]"
              : "bg-purple-50/35 dark:bg-purple-950/20 border-purple-300/80 dark:border-purple-800/70 hover:border-purple-400 shadow-2xs"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200">
            <div className="flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-brand-purple" />
              <h3 className="text-[11px] font-black uppercase tracking-wider">
                4. Intelligence Core
              </h3>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-brand-purple text-white rounded">
              Dual Engine
            </span>
          </div>

          {/* 4 Core Pillars */}
          <div className="flex flex-col gap-1.5 my-auto">
            {[
              { id: "engine-investigation-planning", label: "FastAPI Routing", sub: "Pydantic & Scoping", code: "</>", icon: Cpu },
              { id: "engine-ai-reasoning", label: "LangChain Core", sub: "Tool Loop & De-duplication", code: "🔗", icon: Brain },
              { id: "engine-deterministic-variance", label: "Deterministic Engine", sub: "Python/SQL Variance Math", code: "⚙️", icon: Scale },
              { id: "engine-recommendation-gen", label: "DomoTextLLM", sub: "Strict 4-Gate Governance", code: "✨", icon: Sparkles },
            ].map((item) => {
              const isItemActive = selectedId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectComponent(item.id);
                  }}
                  className={`p-1.5 rounded-lg border text-left flex items-center gap-1.5 transition-all ${
                    isItemActive
                      ? "bg-white dark:bg-slate-800 border-purple-500 shadow-2xs font-bold text-purple-900 dark:text-purple-200"
                      : "bg-white/85 dark:bg-slate-800/80 border-purple-100 dark:border-purple-900/40 text-slate-700 dark:text-slate-300 hover:bg-white"
                  }`}
                >
                  <span className="text-xs shrink-0">{item.code}</span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-bold leading-tight truncate">
                      {item.label}
                    </span>
                    <span className="text-[9px] text-slate-500 truncate leading-tight">
                      {item.sub}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =====================================================================
            STAGE 5: BUSINESS APPLICATIONS & ACTIONS (Green)
            ===================================================================== */}
        <div
          onClick={() => onSelectComponent("app-investigation-result")}
          className={`flex flex-col rounded-xl border p-2 transition-all duration-150 cursor-pointer ${
            selectedId.startsWith("app-")
              ? "bg-emerald-50/70 border-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-700 shadow-xs ring-2 ring-emerald-400/30"
              : "bg-emerald-50/25 dark:bg-emerald-950/15 border-emerald-200/70 dark:border-emerald-900/40 hover:border-emerald-300"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-emerald-200/60 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-300">
            <div className="flex items-center gap-1.5">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <h3 className="text-[11px] font-black uppercase tracking-wider">
                5. Applications
              </h3>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-900/50 rounded text-emerald-700 dark:text-emerald-300">
              Outcomes
            </span>
          </div>

          {/* Items */}
          <div className="flex flex-col gap-1">
            {[
              { id: "app-cost-overview", label: "Executive Cost Overview", sub: "Plant KPI Pulse", icon: LayoutDashboard },
              { id: "app-investigation-result", label: "Investigation Results", sub: "Variance Waterfall", icon: BarChart3 },
              { id: "app-ai-sandbox", label: "AI Investigation Chat", sub: "Conversational QA", icon: Search },
              { id: "app-improvement-plan", label: "Cost Improvement Plan", sub: "₹18.31 Cr Playbooks", icon: Sparkles },
              { id: "app-report-history", label: "Durable Report Store", sub: "Exportable Audit Evidence", icon: FileText },
            ].map((item) => {
              const Icon = item.icon;
              const isItemActive = selectedId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectComponent(item.id);
                  }}
                  className={`p-1 rounded-md border text-left flex items-center justify-between gap-1 transition-all ${
                    isItemActive
                      ? "bg-white dark:bg-slate-800 border-emerald-500 shadow-2xs font-bold text-emerald-900 dark:text-emerald-200"
                      : "bg-white/85 dark:bg-slate-800/80 border-emerald-100/90 dark:border-emerald-900/40 text-slate-700 dark:text-slate-300 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Icon className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="text-[10px] font-semibold truncate leading-tight">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 shrink-0 truncate max-w-[65px]">
                    {item.sub}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================================
          STAGE 6: BOTTOM CLOSED-LOOP FEEDBACK BAR (Curved connector loop)
          ========================================================================= */}
      <div className="w-full pt-0.5 flex items-center justify-center">
        <div
          onClick={() => onSelectComponent("feedback-baseline-calibration")}
          className={`w-full max-w-2xl py-1 px-4 rounded-full border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer shadow-2xs ${
            selectedId.startsWith("feedback-")
              ? "bg-purple-100 dark:bg-purple-900/60 text-purple-900 dark:text-purple-100 border-brand-purple ring-2 ring-purple-400/30"
              : "bg-purple-50/70 dark:bg-purple-950/40 border-purple-200/80 dark:border-purple-800/60 text-purple-900 dark:text-purple-200 hover:bg-purple-100/80"
          }`}
        >
          <RotateCw className="w-3.5 h-3.5 text-brand-purple" />
          <span>Closed-Loop Feedback: Remediation Outcome Tracking & Standard Baseline Recalibration</span>
        </div>
      </div>
    </div>
  );
}
