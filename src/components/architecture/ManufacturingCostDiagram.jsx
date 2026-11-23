import React from "react";
import {
  Database,
  Coins,
  Activity,
  Boxes,
  Truck,
  Layers,
  ShieldCheck,
  Wrench,
  Cog,
  CloudUpload,
  RotateCw,
  GitBranch,
  Brain,
  Code2,
  Workflow,
  Cpu,
  Sparkles,
  LayoutDashboard,
  BarChart3,
  Box,
  MessageSquareText,
  Table,
} from "lucide-react";

export default function ManufacturingCostDiagram({
  selectedId = "comp-ai-engine",
  onSelectComponent,
}) {
  return (
    <div className="w-full bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-3 sm:p-3.5 shadow-2xs flex flex-col gap-2 relative">
      {/* =========================================================================
          TOP HEADER OF DIAGRAM BOX
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800 gap-1.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 flex items-center justify-center font-bold">
            <Cog className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-extrabold text-brand-navy dark:text-slate-100 leading-tight">
              Manufacturing Cost RCA Agent – System Architecture
            </h2>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
              Primary KPI: <span className="font-bold text-slate-700 dark:text-slate-300">Cost per Good Smartphone</span> • SMT & FAL Lines
            </p>
          </div>
        </div>

        {/* Status Legend */}
        <div className="flex items-center gap-2.5 text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Implemented</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            <span>Partial</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
            <span>Planned</span>
          </span>
        </div>
      </div>

      {/* =========================================================================
          FIVE-STAGE HORIZONTAL ARCHITECTURE FLOW
          ========================================================================= */}
      <div className="relative grid grid-cols-1 sm:grid-cols-5 gap-2 items-stretch pt-1 pb-1">
        <div className="hidden sm:flex absolute left-[19.2%] top-[46%] z-10 w-5 h-5 -ml-2.5 rounded-full bg-blue-600 border-2 border-white items-center justify-center text-white shadow-sm pointer-events-none">
          <span className="block w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-white ml-0.5" />
        </div>
        <div className="hidden sm:flex absolute left-[39.2%] top-[46%] z-10 w-5 h-5 -ml-2.5 rounded-full bg-blue-600 border-2 border-white items-center justify-center text-white shadow-sm pointer-events-none">
          <span className="block w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-white ml-0.5" />
        </div>
        <div className="hidden sm:flex absolute left-[59.2%] top-[46%] z-10 w-5 h-5 -ml-2.5 rounded-full bg-purple-600 border-2 border-white items-center justify-center text-white shadow-sm pointer-events-none">
          <span className="block w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-white ml-0.5" />
        </div>
        <div className="hidden sm:flex absolute left-[79.2%] top-[46%] z-10 w-5 h-5 -ml-2.5 rounded-full bg-purple-600 border-2 border-white items-center justify-center text-white shadow-sm pointer-events-none">
          <span className="block w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-white ml-0.5" />
        </div>
        {/* STAGE 1: DATA SOURCES */}
        <div
          onClick={() => onSelectComponent("comp-manufacturing-cost")}
          className="min-w-0 rounded-xl border border-blue-200 bg-blue-50/60 p-2.5 shadow-[0_2px_8px_rgba(37,99,235,0.05)] cursor-pointer"
        >
          <div className="flex items-center gap-2 pb-2 mb-2 border-b border-blue-200/70 text-blue-900">
            <Database className="w-4 h-4 text-blue-600 shrink-0" />
            <h3 className="text-[11px] font-black">Data Sources</h3>
          </div>
          <div className="flex flex-col gap-1.5">
            {[
              ["comp-manufacturing-cost", "Manufacturing Data", Coins],
              ["comp-hourly-production", "Hourly Production", Activity],
              ["comp-bom-components", "BOM Standards", Boxes],
              ["comp-material-procurement", "Material & POs", Truck],
              ["comp-quality-inspection", "Quality Inspection", ShieldCheck],
            ].map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                onClick={(event) => { event.stopPropagation(); onSelectComponent(id); }}
                className={`w-full min-h-[32px] px-2 py-1.5 rounded-md border bg-white/90 text-left flex items-center gap-2 transition-all ${
                  selectedId === id
                    ? "border-blue-500 text-blue-900 shadow-sm ring-1 ring-blue-300"
                    : "border-blue-100 text-slate-700 hover:border-blue-300"
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="text-[10px] font-semibold leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* STAGE 2: INGESTION & VALIDATION */}
        <div
          onClick={() => onSelectComponent("comp-data-validation")}
          className="min-w-0 rounded-xl border border-emerald-200 bg-emerald-50/70 p-2.5 shadow-[0_2px_8px_rgba(16,185,129,0.05)] cursor-pointer"
        >
          <div className="flex items-center gap-2 pb-2 mb-2 border-b border-emerald-200/70 text-emerald-900">
            <Cog className="w-4 h-4 text-emerald-600 shrink-0" />
            <h3 className="text-[11px] font-black">Data Ingestion &amp; Validation</h3>
          </div>
          <div className="flex flex-col gap-2.5">
            {[
              ["comp-csv-upload", "CSV / File Upload", CloudUpload],
              ["comp-data-validation", "Validation Rules", ShieldCheck],
              ["comp-transformation", "Data Normalization", RotateCw],
              ["comp-data-mapping", "Synonym Mapping", GitBranch],
            ].map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                onClick={(event) => { event.stopPropagation(); onSelectComponent(id); }}
                className={`w-full min-h-[32px] px-2 py-1.5 rounded-md border bg-white/90 text-left flex items-center gap-2 transition-all ${
                  selectedId === id
                    ? "border-emerald-500 text-emerald-900 shadow-sm ring-1 ring-emerald-300"
                    : "border-emerald-100 text-slate-700 hover:border-emerald-300"
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-[10px] font-semibold leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* STAGE 3: DATA PLATFORM */}
        <div
          onClick={() => onSelectComponent("comp-neon-postgresql")}
          className="min-w-0 rounded-xl border border-blue-200 bg-blue-50/60 p-2.5 shadow-[0_2px_8px_rgba(37,99,235,0.05)] cursor-pointer"
        >
          <div className="flex items-center gap-2 pb-2 mb-2 border-b border-blue-200/70 text-blue-900">
            <Database className="w-4 h-4 text-blue-600 shrink-0" />
            <h3 className="text-[11px] font-black">Data Platform</h3>
          </div>
          <button
            type="button"
            onClick={(event) => { event.stopPropagation(); onSelectComponent("comp-neon-postgresql"); }}
            className="w-full mb-2 min-h-[34px] px-2 rounded-lg border border-blue-500 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm flex items-center justify-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="text-[10px] font-extrabold">Neon PostgreSQL</span>
          </button>
          <div className="flex flex-col gap-1.5">
            {[
              ["comp-tbl-line-cost", "line_cost_batches"],
              ["comp-tbl-hourly-prod", "hourly_production"],
              ["comp-bom-components", "bom_component records"],
              ["comp-quality-inspection", "serialized_inspection records"],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={(event) => { event.stopPropagation(); onSelectComponent(id); }}
                className={`w-full min-h-[30px] px-2 rounded-md border bg-white/90 text-left flex items-center gap-1.5 transition-all ${
                  selectedId === id
                    ? "border-blue-500 text-blue-900 shadow-sm"
                    : "border-blue-100 text-slate-700 hover:border-blue-300"
                }`}
              >
                <Table className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="text-[9.5px] font-semibold leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* STAGE 4: RCA AGENT */}
        <div
          onClick={() => onSelectComponent("comp-ai-engine")}
          className="min-w-0 rounded-xl border-2 border-purple-400 bg-purple-50/80 p-2.5 shadow-[0_3px_10px_rgba(147,51,234,0.10)] cursor-pointer"
        >
          <div className="flex items-center gap-2 pb-2 mb-2 border-b border-purple-200 text-purple-900">
            <Brain className="w-4 h-4 text-purple-600 shrink-0" />
            <h3 className="text-[11px] font-black">RCA Agent (AI Engine)</h3>
          </div>
          <div className="flex flex-col gap-2.5">
            {[
              ["comp-fastapi-backend", "FastAPI Backend", Code2],
              ["comp-langchain-agent", "LangChain Orchestration", GitBranch],
              ["comp-deterministic-analytics", "Deterministic Math / SQL", Cpu],
              ["comp-domo-ai", "Domo AI (TextLLM)", Sparkles],
            ].map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                onClick={(event) => { event.stopPropagation(); onSelectComponent(id); }}
                className={`w-full min-h-[34px] px-2 py-1.5 rounded-md border bg-white/90 text-left flex items-center gap-2 transition-all ${
                  selectedId === id || (selectedId === "comp-ai-engine" && id === "comp-deterministic-analytics")
                    ? "border-purple-500 text-purple-900 shadow-sm ring-1 ring-purple-300"
                    : "border-purple-100 text-slate-700 hover:border-purple-300"
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span className="text-[10px] font-semibold leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* STAGE 5: BUSINESS APPLICATIONS */}
        <div
          onClick={() => onSelectComponent("comp-cost-overview")}
          className="min-w-0 rounded-xl border border-emerald-200 bg-emerald-50/70 p-2.5 shadow-[0_2px_8px_rgba(16,185,129,0.05)] cursor-pointer"
        >
          <div className="flex items-center gap-2 pb-2 mb-2 border-b border-emerald-200/70 text-emerald-900">
            <LayoutDashboard className="w-4 h-4 text-emerald-600 shrink-0" />
            <h3 className="text-[11px] font-black">Business Applications</h3>
          </div>
          <div className="flex flex-col gap-1.5">
            {[
              ["comp-cost-overview", "Cost Overview & Trends", LayoutDashboard],
              ["comp-investigation-result", "Investigation Results", BarChart3],
              ["comp-product-analysis", "Product & SKU Cost", Box],
              ["comp-component-analysis", "BOM Component Analysis", Layers],
              ["comp-ai-investigator", "AI Cost Investigation", MessageSquareText],
            ].map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                onClick={(event) => { event.stopPropagation(); onSelectComponent(id); }}
                className={`w-full min-h-[32px] px-2 py-1.5 rounded-md border bg-white/90 text-left flex items-center gap-2 transition-all ${
                  selectedId === id
                    ? "border-emerald-500 text-emerald-900 shadow-sm ring-1 ring-emerald-300"
                    : "border-emerald-100 text-slate-700 hover:border-emerald-300"
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-[10px] font-semibold leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom closed-loop feedback bar */}
      <div className="relative w-full h-9 mt-0.5 flex items-center justify-center">
        <div className="absolute left-[4%] right-[4%] top-[18px] border-t-2 border-purple-400" />
        <div className="absolute left-[3.5%] top-[12px] w-3 h-3 border-l-2 border-b-2 border-purple-500 -rotate-45 bg-white" />
        <div className="absolute right-[3.5%] top-[12px] w-3 h-3 border-r-2 border-b-2 border-purple-500 rotate-45 bg-white" />
        <button
          type="button"
          onClick={() => onSelectComponent("comp-feedback-loop")}
          className={`w-full max-w-2xl py-1.5 px-4 rounded-full border flex items-center justify-center gap-2 text-[11px] font-bold transition-all shadow-sm ${
            selectedId === "comp-feedback-loop"
              ? "bg-purple-100 text-purple-900 border-purple-500 ring-2 ring-purple-300"
              : "bg-purple-50/80 text-purple-900 border-purple-200 hover:bg-purple-100"
          }`}
        >
          <RotateCw className="w-3.5 h-3.5 text-purple-600" />
          <span>Feedback Loop (Remediation Tracking &amp; Standard Baseline Recalibration)</span>
        </button>
      </div>

      {/* Original grid retained below only for fallback compatibility; visually disabled */}
      <div className="hidden">
        {/* STAGE 1: DATA SOURCES (Blue) */}
        <div
          onClick={() => onSelectComponent("comp-manufacturing-cost")}
          className={`flex flex-col rounded-xl border p-2 transition-all duration-150 cursor-pointer ${
            selectedId === "comp-manufacturing-cost" ||
            selectedId === "comp-hourly-production" ||
            selectedId === "comp-bom-components" ||
            selectedId === "comp-material-procurement" ||
            selectedId === "comp-quality-inspection"
              ? "bg-blue-50/70 border-blue-400 dark:bg-blue-950/30 dark:border-blue-700 shadow-xs ring-2 ring-blue-400/30"
              : "bg-blue-50/25 dark:bg-blue-950/15 border-blue-200/80 dark:border-blue-900/40 hover:border-blue-300"
          }`}
        >
          <div className="flex items-center gap-1.5 pb-1 mb-1.5 border-b border-blue-200/60 dark:border-blue-900/60 text-blue-800 dark:text-blue-300">
            <Database className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <h3 className="text-[11px] font-black uppercase tracking-wider">
              Data Sources
            </h3>
          </div>

          <div className="flex flex-col gap-1 my-auto">
            {[
              { id: "comp-manufacturing-cost", label: "Manufacturing Cost", sub: "9.5k", icon: Coins },
              { id: "comp-hourly-production", label: "Hourly Production", sub: "13.3k", icon: Activity },
              { id: "comp-bom-components", label: "BOM Standards", sub: "246", icon: Boxes },
              { id: "comp-material-procurement", label: "Material & POs", sub: "996", icon: Truck },
              { id: "comp-quality-inspection", label: "Quality Inspection", sub: "16k", icon: ShieldCheck },
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
                  className={`p-1.5 rounded-lg border text-left flex items-center justify-between gap-1 transition-all ${
                    isItemActive
                      ? "bg-white dark:bg-slate-800 border-blue-500 shadow-2xs font-bold text-blue-900 dark:text-blue-200 ring-1 ring-blue-400/30"
                      : "bg-white/80 dark:bg-slate-800/80 border-blue-100 dark:border-blue-900/40 text-slate-700 dark:text-slate-300 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Icon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="text-[10px] font-semibold leading-tight truncate">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono shrink-0">
                    {item.sub}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STAGE 2: DATA INGESTION & VALIDATION (Green) */}
        <div
          onClick={() => onSelectComponent("comp-data-validation")}
          className={`flex flex-col rounded-xl border p-2 transition-all duration-150 cursor-pointer ${
            selectedId === "comp-csv-upload" ||
            selectedId === "comp-data-validation" ||
            selectedId === "comp-transformation" ||
            selectedId === "comp-data-mapping"
              ? "bg-emerald-50/70 border-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-700 shadow-xs ring-2 ring-emerald-400/30"
              : "bg-emerald-50/25 dark:bg-emerald-950/15 border-emerald-200/80 dark:border-emerald-900/40 hover:border-emerald-300"
          }`}
        >
          <div className="flex items-center gap-1.5 pb-1 mb-1.5 border-b border-emerald-200/60 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300">
            <Cog className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <h3 className="text-[11px] font-black uppercase tracking-wider truncate">
              Ingestion & Validation
            </h3>
          </div>

          <div className="flex flex-col gap-1.5 my-auto">
            {[
              { id: "comp-csv-upload", label: "CSV / File Upload", icon: CloudUpload },
              { id: "comp-data-validation", label: "14 Validation Rules", icon: ShieldCheck },
              { id: "comp-transformation", label: "Data Normalization", icon: RotateCw },
              { id: "comp-data-mapping", label: "Synonym Mapping", icon: GitBranch },
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
                  className={`p-1.5 rounded-lg border text-left flex items-center gap-1.5 transition-all ${
                    isItemActive
                      ? "bg-white dark:bg-slate-800 border-emerald-500 shadow-2xs font-bold text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-400/30"
                      : "bg-white/80 dark:bg-slate-800/80 border-emerald-100 dark:border-emerald-900/40 text-slate-700 dark:text-slate-300 hover:bg-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-[10px] font-semibold leading-tight truncate">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STAGE 3: DATA PLATFORM (Blue) */}
        <div
          onClick={() => onSelectComponent("comp-neon-postgresql")}
          className={`flex flex-col rounded-xl border p-2 transition-all duration-150 cursor-pointer ${
            selectedId === "comp-neon-postgresql" || selectedId.startsWith("comp-tbl-")
              ? "bg-blue-50/70 border-blue-400 dark:bg-blue-950/30 dark:border-blue-700 shadow-xs ring-2 ring-blue-400/30"
              : "bg-blue-50/25 dark:bg-blue-950/15 border-blue-200/80 dark:border-blue-900/40 hover:border-blue-300"
          }`}
        >
          <div className="flex items-center gap-1.5 pb-1 mb-1.5 border-b border-blue-200/60 dark:border-blue-900/60 text-blue-800 dark:text-blue-300">
            <Database className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <h3 className="text-[11px] font-black uppercase tracking-wider">
              Data Platform
            </h3>
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelectComponent("comp-neon-postgresql");
            }}
            className="my-0.5 py-1 px-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg flex items-center justify-center gap-1.5 shadow-2xs hover:opacity-95 transition-opacity"
          >
            <Database className="w-3 h-3" />
            <span className="text-[10px] font-extrabold tracking-wide">
              Neon PostgreSQL
            </span>
          </div>

          <div className="flex flex-col gap-1 mt-1 my-auto">
            {[
              { id: "comp-tbl-line-cost", label: "line_cost_batches (9.5k)" },
              { id: "comp-tbl-hourly-prod", label: "hourly_production_logs" },
              { id: "comp-bom-components", label: "bom_component_records" },
              { id: "comp-quality-inspection", label: "serialized_inspections" },
            ].map((tbl) => {
              const isTblActive = selectedId === tbl.id;
              return (
                <div
                  key={tbl.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectComponent(tbl.id);
                  }}
                  className={`py-1 px-1.5 rounded-md border text-[10px] font-semibold flex items-center gap-1.5 transition-all ${
                    isTblActive
                      ? "bg-white dark:bg-slate-800 border-blue-500 text-blue-900 dark:text-blue-200 font-bold"
                      : "bg-white/80 dark:bg-slate-800/80 border-blue-100 dark:border-blue-900/40 text-slate-700 dark:text-slate-300 hover:bg-white"
                  }`}
                >
                  <Table className="w-3 h-3 text-blue-500 shrink-0" />
                  <span className="truncate">{tbl.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STAGE 4: MANUFACTURING RCA AGENT (Purple - Core Focus) */}
        <div
          onClick={() => onSelectComponent("comp-ai-engine")}
          className={`flex flex-col rounded-xl border-2 p-2 transition-all duration-150 cursor-pointer ${
            selectedId === "comp-ai-engine" ||
            selectedId === "comp-fastapi-backend" ||
            selectedId === "comp-langchain-agent" ||
            selectedId === "comp-deterministic-analytics" ||
            selectedId === "comp-domo-ai"
              ? "bg-purple-50/90 border-brand-purple dark:bg-purple-950/40 dark:border-purple-500 shadow-md ring-3 ring-purple-500/25 scale-[1.01]"
              : "bg-purple-50/35 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800/80 hover:border-purple-400 shadow-2xs"
          }`}
        >
          <div className="flex items-center gap-1.5 pb-1 mb-1.5 border-b border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200">
            <Brain className="w-3.5 h-3.5 text-brand-purple shrink-0" />
            <h3 className="text-[11px] font-black uppercase tracking-wider truncate">
              RCA Agent (AI Engine)
            </h3>
          </div>

          <div className="flex flex-col gap-1.5 my-auto">
            {[
              { id: "comp-fastapi-backend", label: "FastAPI (Backend API)", code: "</>" },
              { id: "comp-langchain-agent", label: "LangChain (Orchestration)", code: "🔗" },
              { id: "comp-deterministic-analytics", label: "Deterministic Math (SQL)", code: "⚙️" },
              { id: "comp-domo-ai", label: "Domo AI (TextLLM & Evaluator)", code: "✨" },
            ].map((item) => {
              const isItemActive = selectedId === item.id || (selectedId === "comp-ai-engine" && item.id === "comp-deterministic-analytics");
              return (
                <div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectComponent(item.id);
                  }}
                  className={`p-1.5 rounded-lg border text-left flex items-center gap-1.5 transition-all ${
                    isItemActive
                      ? "bg-white dark:bg-slate-800 border-purple-500 shadow-2xs font-bold text-purple-900 dark:text-purple-200 ring-1 ring-purple-400/30"
                      : "bg-white/80 dark:bg-slate-800/80 border-purple-100 dark:border-purple-900/40 text-slate-700 dark:text-slate-300 hover:bg-white"
                  }`}
                >
                  <span className="text-xs shrink-0">{item.code}</span>
                  <span className="text-[10px] font-semibold leading-tight truncate">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STAGE 5: BUSINESS APPLICATIONS (Green) */}
        <div
          onClick={() => onSelectComponent("comp-cost-overview")}
          className={`flex flex-col rounded-xl border p-2 transition-all duration-150 cursor-pointer ${
            selectedId === "comp-cost-overview" ||
            selectedId === "comp-investigation-result" ||
            selectedId === "comp-product-analysis" ||
            selectedId === "comp-component-analysis" ||
            selectedId === "comp-ai-investigator"
              ? "bg-emerald-50/70 border-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-700 shadow-xs ring-2 ring-emerald-400/30"
              : "bg-emerald-50/25 dark:bg-emerald-950/15 border-emerald-200/80 dark:border-emerald-900/40 hover:border-emerald-300"
          }`}
        >
          <div className="flex items-center gap-1.5 pb-1 mb-1.5 border-b border-emerald-200/60 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300">
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <h3 className="text-[11px] font-black uppercase tracking-wider">
              Applications
            </h3>
          </div>

          <div className="flex flex-col gap-1 my-auto">
            {[
              { id: "comp-cost-overview", label: "Cost Overview & Trends", icon: LayoutDashboard },
              { id: "comp-investigation-result", label: "Investigation Results", icon: BarChart3 },
              { id: "comp-product-analysis", label: "Product & SKU Cost", icon: Box },
              { id: "comp-component-analysis", label: "BOM Component Pricing", icon: Layers },
              { id: "comp-ai-investigator", label: "AI Cost Investigator (Chat)", icon: MessageSquareText },
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
                  className={`p-1.5 rounded-lg border text-left flex items-center gap-1.5 transition-all ${
                    isItemActive
                      ? "bg-white dark:bg-slate-800 border-emerald-500 shadow-2xs font-bold text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-400/30"
                      : "bg-white/80 dark:bg-slate-800/80 border-emerald-100 dark:border-emerald-900/40 text-slate-700 dark:text-slate-300 hover:bg-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-[10px] font-semibold leading-tight truncate">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="hidden" />
    </div>
  );
}
