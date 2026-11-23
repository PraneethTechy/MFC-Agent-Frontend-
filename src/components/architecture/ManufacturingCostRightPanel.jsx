import React, { useState } from "react";
import {
  Brain,
  Database,
  CheckCircle2,
  AlertTriangle,
  Clock,
  X,
  Code2,
  Workflow,
  Sparkles,
  Info,
  ListChecks,
  Cpu,
  Layers,
  ArrowDownToLine,
  ArrowUpFromLine,
  Table,
  Coins,
  Activity,
  Boxes,
  Truck,
  Wrench,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { MANUFACTURING_RCA_COMPONENTS } from "./manufacturingCostArchitectureData";

const ICON_MAP = {
  Brain,
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

export default function ManufacturingCostRightPanel({
  selectedId = "comp-ai-engine",
  onReset,
  onNavigate,
}) {
  const [activeSubTab, setActiveSubTab] = useState("overview");

  // Get selected component or fallback to core AI Engine
  const component =
    MANUFACTURING_RCA_COMPONENTS[selectedId] ||
    MANUFACTURING_RCA_COMPONENTS["comp-ai-engine"];

  const subTabs = [
    { id: "overview", label: "Overview" },
    { id: "technical", label: "Technical Details" },
    { id: "apis", label: "APIs & I/O" },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "implemented":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Implemented
          </span>
        );
      case "partial":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40 shadow-2xs">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Partial Implementation
          </span>
        );
      case "planned":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Planned
          </span>
        );
    }
  };

  const ComponentIcon = ICON_MAP[component.icon] || Brain;

  return (
    <div className="w-full bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-3 sm:p-3.5 shadow-2xs flex flex-col gap-2.5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-purple-100 text-brand-purple dark:bg-purple-950/60 dark:text-purple-300 flex items-center justify-center font-bold shadow-2xs shrink-0">
            <ComponentIcon className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-extrabold text-brand-navy dark:text-slate-100 leading-tight truncate">
              {component.name}
            </h3>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block truncate">
              {component.layerName || "Manufacturing RCA Platform"}
            </span>
          </div>
        </div>

        {onReset && (
          <button
            onClick={onReset}
            className="w-6 h-6 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-1"
            title="Reset to Core AI Engine"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Status Badge */}
      <div>{getStatusBadge(component.status)}</div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700 w-full">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
              activeSubTab === tab.id
                ? "bg-brand-purple text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="flex flex-col gap-2.5 text-xs">
        {/* SUBTAB 1: OVERVIEW */}
        {activeSubTab === "overview" && (
          <>
            {/* What It Does */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold text-[11px]">
                <Info className="w-3.5 h-3.5 text-brand-purple" />
                <span>What It Does</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/70 dark:bg-slate-900/40 p-2 rounded-xl border border-slate-200/70 dark:border-slate-800 text-[11px]">
                {component.shortDesc || component.purpose}
              </p>
            </div>

            {/* Key Capabilities */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold text-[11px]">
                <ListChecks className="w-3.5 h-3.5 text-brand-purple" />
                <span>Key Capabilities</span>
              </div>
              <ul className="space-y-1 bg-slate-50/70 dark:bg-slate-900/40 p-2 rounded-xl border border-slate-200/70 dark:border-slate-800 text-[10px]">
                {(component.keyCapabilities || []).slice(0, 3).map((cap, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-slate-600 dark:text-slate-300 leading-tight">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-purple shrink-0 mt-1" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technologies Used */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold text-[11px]">
                <Cpu className="w-3.5 h-3.5 text-brand-purple" />
                <span>Technologies</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {(component.technologies || [
                  { name: "FastAPI", icon: "</>" },
                  { name: "PostgreSQL 16", icon: "🐘" },
                  { name: "Python 3.11", icon: "🐍" },
                ]).slice(0, 3).map((tech, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-50/80 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 border border-purple-200/70 dark:border-purple-800/60 font-bold text-[10px]"
                  >
                    <span>{tech.icon}</span>
                    <span>{tech.name}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Compact Inputs & Outputs (Side-by-side grid) */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200 font-bold text-[10px]">
                  <ArrowDownToLine className="w-3 h-3 text-blue-500" />
                  <span>Inputs</span>
                </div>
                <ul className="space-y-0.5 bg-slate-50/70 dark:bg-slate-900/40 p-1.5 rounded-xl border border-slate-200/70 dark:border-slate-800 text-[9px]">
                  {(component.inputs || []).slice(0, 2).map((inp, idx) => (
                    <li key={idx} className="flex items-start gap-1 text-slate-600 dark:text-slate-300 leading-tight">
                      <span className="w-1 h-1 rounded-full bg-blue-500 shrink-0 mt-1" />
                      <span className="truncate">{inp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200 font-bold text-[10px]">
                  <ArrowUpFromLine className="w-3 h-3 text-emerald-500" />
                  <span>Outputs</span>
                </div>
                <ul className="space-y-0.5 bg-slate-50/70 dark:bg-slate-900/40 p-1.5 rounded-xl border border-slate-200/70 dark:border-slate-800 text-[9px]">
                  {(component.outputs || []).slice(0, 2).map((out, idx) => (
                    <li key={idx} className="flex items-start gap-1 text-slate-600 dark:text-slate-300 leading-tight">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0 mt-1" />
                      <span className="truncate">{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {/* SUBTAB 2: TECHNICAL DETAILS */}
        {activeSubTab === "technical" && (
          <div className="flex flex-col gap-1.5">
            <div className="p-2 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Frontend Component File
              </span>
              <span className="font-mono text-[10px] font-bold text-purple-700 dark:text-purple-300 break-all">
                {component.techRef?.frontend || "ui/src/components/InvestigationReport.jsx"}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Backend Service
              </span>
              <span className="font-mono text-[10px] font-bold text-blue-700 dark:text-blue-300 break-all">
                {component.techRef?.backend || "backend/app/main.py"}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                API Endpoint
              </span>
              <span className="font-mono text-[10px] font-bold text-slate-800 dark:text-slate-200 break-all">
                {component.techRef?.api || "POST /api/cost/variance-bridge"}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Database Grounding
              </span>
              <span className="font-mono text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 break-all">
                {component.techRef?.db || "public.line_cost_batches"}
              </span>
            </div>
          </div>
        )}

        {/* SUBTAB 3: APIS & I/O */}
        {activeSubTab === "apis" && (
          <div className="flex flex-col gap-1.5">
            <div className="p-2 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                REST Endpoint
              </span>
              <span className="font-mono text-[10px] font-bold text-slate-800 dark:text-slate-200 block">
                {component.techRef?.api || "POST /api/cost/variance-bridge"}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Sample Payload
              </span>
              <pre className="text-[9px] font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-950 p-1.5 rounded-lg overflow-x-auto border border-slate-200/60 dark:border-slate-800">
{`{
  "product": "SPH-A15-128",
  "period": "2026-11",
  "baseline": "2026-10"
}`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
