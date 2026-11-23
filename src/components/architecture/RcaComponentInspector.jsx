import React, { useState } from "react";
import {
  Brain,
  Database,
  CheckCircle2,
  AlertTriangle,
  Clock,
  X,
  Code2,
  Cpu,
  Sparkles,
  Info,
  ListChecks,
  Layers,
  ArrowDownToLine,
  ArrowUpFromLine,
  Network,
  FileCode,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { ARCHITECTURE_COMPONENTS } from "./architectureData";

export default function RcaComponentInspector({
  selectedId = "engine-deterministic-variance",
  onSelectComponent,
  onReset,
  onNavigate,
}) {
  const [activeTab, setActiveTab] = useState("overview");

  // Get selected component or fallback to core engine
  const component = ARCHITECTURE_COMPONENTS[selectedId] || ARCHITECTURE_COMPONENTS["engine-deterministic-variance"];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "technical", label: "Technical Details" },
    { id: "connections", label: "Connections" },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "implemented":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Implemented
          </span>
        );
      case "partial":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Partial Implementation
          </span>
        );
      case "planned":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <Clock className="w-3 h-3 text-indigo-600" />
            Architecture Planned
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 shadow-2xs flex flex-col gap-3 h-full">
      {/* Header: Title + Category + Close/Reset Button */}
      <div className="flex items-start justify-between pb-2 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-brand-purple dark:bg-purple-950/60 dark:text-purple-300 flex items-center justify-center font-bold shadow-2xs shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-extrabold text-brand-navy dark:text-slate-100 leading-tight truncate">
              {component.name}
            </h3>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block truncate">
              {component.layerName || component.category}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {getStatusBadge(component.status)}
          {onReset && (
            <button
              onClick={onReset}
              className="w-6 h-6 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer ml-1"
              title="Reset to Core Deterministic Engine"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700 w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
              activeTab === tab.id
                ? "bg-brand-purple text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content (Scrollable) */}
      <div className="flex flex-col gap-3 text-xs overflow-y-auto max-h-[500px] pr-1">
        {/* =====================================================================
            TAB 1: OVERVIEW
            ===================================================================== */}
        {activeTab === "overview" && (
          <>
            {/* What It Does */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold">
                <Info className="w-3.5 h-3.5 text-brand-purple" />
                <span>What It Does</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/70 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 text-[11px]">
                {component.longDesc || component.shortDesc}
              </p>
            </div>

            {/* Inputs Received */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold">
                <ArrowDownToLine className="w-3.5 h-3.5 text-blue-500" />
                <span>Inputs Received</span>
              </div>
              <ul className="space-y-1 bg-slate-50/70 dark:bg-slate-900/40 p-2 rounded-xl border border-slate-200/70 dark:border-slate-800 text-[11px]">
                {(component.inputs || []).map((inp, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-slate-600 dark:text-slate-300 leading-tight">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1" />
                    <span>{inp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Processing & Deterministic Logic */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold">
                <Cpu className="w-3.5 h-3.5 text-brand-purple" />
                <span>Processing & Deterministic Logic</span>
              </div>
              <ul className="space-y-1 bg-purple-50/40 dark:bg-purple-950/20 p-2 rounded-xl border border-purple-200/60 dark:border-purple-800/40 text-[11px]">
                {(component.processing || []).map((proc, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300 leading-tight">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-purple shrink-0 mt-1" />
                    <span>{proc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Outputs Produced */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold">
                <ArrowUpFromLine className="w-3.5 h-3.5 text-emerald-500" />
                <span>Outputs Produced</span>
              </div>
              <ul className="space-y-1 bg-slate-50/70 dark:bg-slate-900/40 p-2 rounded-xl border border-slate-200/70 dark:border-slate-800 text-[11px]">
                {(component.outputs || []).map((out, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-slate-600 dark:text-slate-300 leading-tight">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1" />
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* =====================================================================
            TAB 2: TECHNICAL DETAILS
            ===================================================================== */}
        {activeTab === "technical" && (
          <div className="flex flex-col gap-2">
            <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Frontend Component File
              </span>
              <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-300 break-all">
                {component.techRef?.frontend || "ui/src/components/AIArchitecturePage.jsx"}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Backend Service & Model
              </span>
              <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300 break-all">
                {component.techRef?.backend || "backend/app/main.py"}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                API Endpoint & Method
              </span>
              <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 break-all">
                {component.techRef?.api || "POST /api/cost/summary"}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Database Grounding & Verified Facts
              </span>
              <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-300 break-all">
                {component.techRef?.db || "public.line_cost_batches (9,502 committed records)"}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                AI Tool & Evidence Governance
              </span>
              <span className="font-mono text-xs font-semibold text-brand-purple dark:text-purple-300 break-all">
                {component.techRef?.aiTool || "calculate_variance_bridge (PROVEN evidence)"}
              </span>
            </div>

            {component.route && onNavigate && (
              <button
                onClick={() => onNavigate(component.route)}
                className="mt-1 w-full py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Open {component.name} in App</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* =====================================================================
            TAB 3: CONNECTIONS (Interactive Navigation)
            ===================================================================== */}
        {activeTab === "connections" && (
          <div className="flex flex-col gap-3">
            {/* Upstream Dependencies */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold">
                <ArrowRight className="w-3.5 h-3.5 text-blue-500 rotate-180" />
                <span>Upstream Dependencies</span>
              </div>
              {(!component.upstreamIds || component.upstreamIds.length === 0) ? (
                <div className="p-2 text-slate-400 italic bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-200/60 dark:border-slate-800 text-[11px]">
                  Root data source — no upstream architecture dependencies.
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {component.upstreamIds.map((upId) => {
                    const upComp = ARCHITECTURE_COMPONENTS[upId];
                    if (!upComp) return null;
                    return (
                      <button
                        key={upId}
                        onClick={() => onSelectComponent(upId)}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-purple-50 dark:bg-slate-900/40 dark:hover:bg-purple-950/30 text-left flex items-center justify-between group transition-colors cursor-pointer"
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-[11px] text-slate-800 dark:text-slate-200 group-hover:text-brand-purple">
                            {upComp.name}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate">
                            {upComp.shortDesc}
                          </span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-purple shrink-0 ml-1" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Downstream Consumers */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold">
                <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />
                <span>Downstream Consumers</span>
              </div>
              {(!component.downstreamIds || component.downstreamIds.length === 0) ? (
                <div className="p-2 text-slate-400 italic bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-200/60 dark:border-slate-800 text-[11px]">
                  Terminal node / executive presentation consumer.
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {component.downstreamIds.map((downId) => {
                    const downComp = ARCHITECTURE_COMPONENTS[downId];
                    if (!downComp) return null;
                    return (
                      <button
                        key={downId}
                        onClick={() => onSelectComponent(downId)}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-purple-50 dark:bg-slate-900/40 dark:hover:bg-purple-950/30 text-left flex items-center justify-between group transition-colors cursor-pointer"
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-[11px] text-slate-800 dark:text-slate-200 group-hover:text-brand-purple">
                            {downComp.name}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate">
                            {downComp.shortDesc}
                          </span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-purple shrink-0 ml-1" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
