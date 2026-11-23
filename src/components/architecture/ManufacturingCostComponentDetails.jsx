import React, { useState } from "react";
import {
  Brain,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Workflow,
  ArrowRight,
  Database,
  Cpu,
  Sparkles,
  Layers,
  Coins,
  Activity,
  Boxes,
  Truck,
  Wrench,
  ShieldCheck,
  Code2,
  Table,
  GitBranch,
  Info,
  ListChecks,
  Scale,
} from "lucide-react";
import { MANUFACTURING_RCA_COMPONENTS } from "./manufacturingCostArchitectureData";

const ICON_MAP = {
  Brain,
  FileText,
  Database,
  Cpu,
  Sparkles,
  Layers,
  Coins,
  Activity,
  Boxes,
  Truck,
  Wrench,
  ShieldCheck,
  Code2,
  Table,
};

export default function ManufacturingCostComponentDetails({
  selectedId = "comp-ai-engine",
  onSelectComponent,
}) {
  const [activeTab, setActiveTab] = useState("overview");

  // Get selected component or fallback to core AI Engine
  const component =
    MANUFACTURING_RCA_COMPONENTS[selectedId] ||
    MANUFACTURING_RCA_COMPONENTS["comp-ai-engine"];

  const tabs = [
    { id: "overview", label: "Component Overview" },
    { id: "workflow", label: "Execution Logic" },
    { id: "dataFlow", label: "Data Flow & Contracts" },
    { id: "dependencies", label: "Dependencies" },
    { id: "status", label: "Implementation Status" },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "implemented":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Implemented
          </span>
        );
      case "partial":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Partial Implementation
          </span>
        );
      case "planned":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <Clock className="w-3.5 h-3.5 text-purple-600" />
            Planned
          </span>
        );
    }
  };

  const ComponentIcon = ICON_MAP[component.icon] || Brain;

  return (
    <div className="w-full bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 shadow-2xs flex flex-col gap-3.5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-brand-purple dark:bg-purple-950/60 dark:text-purple-300 flex items-center justify-center font-bold shadow-2xs shrink-0">
            <ComponentIcon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-brand-navy dark:text-slate-100 leading-tight truncate">
                {component.name}
              </h2>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-md">
                {component.layerName}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
              {component.purpose}
            </p>
          </div>
        </div>

        <div className="shrink-0">{getStatusBadge(component.status)}</div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-brand-purple text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pt-1">
        {/* =====================================================================
            TAB 1: COMPONENT OVERVIEW
            Clean, structured two-column layout with real technical content
            ===================================================================== */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
            {/* Left Card (~60%): Functional Scope & Manufacturing Relevance */}
            <div className="lg:col-span-7 bg-slate-50/70 dark:bg-slate-900/40 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 pb-2 mb-2.5 border-b border-slate-200/60 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                  <Info className="w-4 h-4 text-brand-purple" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Functional Scope & Operational Context
                  </h4>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {component.whatItDoes || component.longDesc || component.shortDesc}
                </p>

                {/* Key Capabilities */}
                <div className="mt-3">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                    Core Capabilities in Manufacturing RCA
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {(component.keyCapabilities || []).map((cap, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-tight">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-purple shrink-0 mt-1.5" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Business Impact Footer */}
              <div className="pt-2.5 border-t border-slate-200/60 dark:border-slate-800 flex items-start gap-2 text-xs">
                <Scale className="w-3.5 h-3.5 text-brand-purple shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  <strong className="text-slate-800 dark:text-slate-200">RCA Value: </strong>
                  {component.businessRelevance}
                </p>
              </div>
            </div>

            {/* Right Card (~40%): Technical Grounding & Data Lineage */}
            <div className="lg:col-span-5 bg-slate-50/70 dark:bg-slate-900/40 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 pb-2 mb-2.5 border-b border-slate-200/60 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                  <Database className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Technical Grounding
                  </h4>
                </div>

                <div className="flex flex-col gap-2 text-xs">
                  {/* Database Table */}
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                      Database Grounding Table
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 block truncate">
                      {component.techRef?.db || "public.line_cost_batches"}
                    </span>
                  </div>

                  {/* Backend Handler */}
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                      Backend Handler / Model
                    </span>
                    <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400 block truncate">
                      {component.techRef?.backend || "backend/app/main.py"}
                    </span>
                  </div>

                  {/* API Endpoint */}
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                      REST API Endpoint
                    </span>
                    <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-400 block truncate">
                      {component.techRef?.api || "POST /api/cost/variance-bridge"}
                    </span>
                  </div>

                  {/* AI Tool */}
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                      Deterministic AI Tool
                    </span>
                    <span className="font-mono text-xs font-bold text-brand-purple dark:text-purple-300 block truncate">
                      {component.techRef?.aiTool || "calculate_variance_bridge (PROVEN)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Responsible Owner */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">Responsible Owner:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                  {component.owner}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 2: EXECUTION LOGIC (Numbered Steps Flow)
            ===================================================================== */}
        {activeTab === "workflow" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(component.workflow || []).map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 flex gap-3 items-start"
              >
                <span className="w-6 h-6 rounded-full bg-purple-100 text-brand-purple text-xs font-extrabold flex items-center justify-center shrink-0">
                  {step.step || idx + 1}
                </span>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =====================================================================
            TAB 3: DATA FLOW & CONTRACTS
            ===================================================================== */}
        {activeTab === "dataFlow" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-900/40 flex flex-col gap-1.5">
              <span className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider block">
                Ingress / Input Contracts
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {component.dataFlow?.ingress || "Operational records from shopfloor MES, SAP ERP, or user parameters."}
              </p>
              <div className="mt-2 pt-2 border-t border-blue-200/60 dark:border-blue-900/40">
                <span className="text-[10px] font-bold text-blue-700 uppercase block mb-1">Incoming Feeds:</span>
                <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                  {(component.inputs || []).map((inp, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                      <span>{inp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200/70 dark:border-purple-900/40 flex flex-col gap-1.5">
              <span className="text-xs font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wider block">
                Processing & Mathematical Logic
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {component.dataFlow?.processing || "FastAPI execution engine + SQLAlchemy 2.x ORM running deterministic Python calculations."}
              </p>
              <div className="mt-2 pt-2 border-t border-purple-200/60 dark:border-purple-900/40">
                <span className="text-[10px] font-bold text-purple-700 uppercase block mb-1">Execution Pipeline:</span>
                <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                  {(component.processing || []).map((proc, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-brand-purple shrink-0 mt-1.5" />
                      <span>{proc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/40 flex flex-col gap-1.5">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                Egress / Output Artifacts
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {component.dataFlow?.egress || "Structured JSON response payload streamed to React frontend widgets."}
              </p>
              <div className="mt-2 pt-2 border-t border-emerald-200/60 dark:border-emerald-900/40">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block mb-1">Delivered Outputs:</span>
                <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                  {(component.outputs || []).map((out, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 4: DEPENDENCIES (Clickable Upstream & Downstream Pills)
            ===================================================================== */}
        {activeTab === "dependencies" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5 text-xs">
                <ArrowRight className="w-3.5 h-3.5 text-blue-500 rotate-180" />
                Upstream Dependencies (Feeds & Triggers)
              </h4>
              {(!component.upstreamIds || component.upstreamIds.length === 0) ? (
                <p className="text-slate-400 italic text-xs">Root architecture node — no upstream dependencies.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {component.upstreamIds.map((upId) => {
                    const upComp = MANUFACTURING_RCA_COMPONENTS[upId];
                    if (!upComp) return null;
                    return (
                      <button
                        key={upId}
                        onClick={() => onSelectComponent && onSelectComponent(upId)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>{upComp.name}</span>
                        <ArrowRight className="w-3 h-3 text-blue-500" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5 text-xs">
                <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />
                Downstream Consumers (Analyses & Views)
              </h4>
              {(!component.downstreamIds || component.downstreamIds.length === 0) ? (
                <p className="text-slate-400 italic text-xs">Terminal consumer / executive presentation node.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {component.downstreamIds.map((downId) => {
                    const downComp = MANUFACTURING_RCA_COMPONENTS[downId];
                    if (!downComp) return null;
                    return (
                      <button
                        key={downId}
                        onClick={() => onSelectComponent && onSelectComponent(downId)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>{downComp.name}</span>
                        <ArrowRight className="w-3 h-3 text-emerald-500" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 5: IMPLEMENTATION STATUS
            ===================================================================== */}
        {activeTab === "status" && (
          <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <span className="font-semibold text-slate-500 block mb-0.5 text-xs">Production Status</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Production Ready (v2.4)
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block mb-0.5 text-xs">Ground-Truth Fact Base</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                  Neon PostgreSQL 16 (127,386 rows)
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block mb-0.5 text-xs">Zero Mock Data</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 text-xs">
                  100% Live Python/SQL Engine
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
