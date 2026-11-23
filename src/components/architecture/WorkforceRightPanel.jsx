import React, { useState } from "react";
import {
  Brain,
  Database,
  CheckCircle2,
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
  Network,
  FileCode,
} from "lucide-react";
import { WORKFORCE_COMPONENTS } from "./workforceArchitectureData";

export default function WorkforceRightPanel({
  selectedId = "comp-ai-engine",
  onClose,
}) {
  const [activeSubTab, setActiveSubTab] = useState("overview");

  // Get selected component or fallback to core AI Engine
  const component = WORKFORCE_COMPONENTS[selectedId] || WORKFORCE_COMPONENTS["comp-ai-engine"];

  const subTabs = [
    { id: "overview", label: "Overview" },
    { id: "technical", label: "Technical Details" },
    { id: "apis", label: "APIs & I/O" },
  ];

  return (
    <div className="w-full bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 shadow-2xs flex flex-col gap-3.5 h-full">
      {/* =========================================================================
          PANEL HEADER: ICON + TITLE + CLOSE BUTTON
          ========================================================================= */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-brand-purple dark:bg-purple-950/60 dark:text-purple-300 flex items-center justify-center font-bold shadow-2xs">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-brand-navy dark:text-slate-100 leading-tight">
              {component.name}
            </h3>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {component.stageName || "Core Intelligence"}
            </span>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            title="Reset to default component"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Status Badge */}
      <div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100/90 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          Implemented
        </span>
      </div>

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

      {/* =========================================================================
          TAB CONTENT
          ========================================================================= */}
      <div className="flex flex-col gap-3.5 text-xs overflow-y-auto max-h-[580px] pr-1">
        {/* SUBTAB 1: OVERVIEW */}
        {activeSubTab === "overview" && (
          <>
            {/* What It Does */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold">
                <Info className="w-3.5 h-3.5 text-brand-purple" />
                <span>What It Does</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/60 dark:bg-slate-900/30 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                {component.whatItDoes ||
                  "The core AI agent that understands workforce queries, analyzes manufacturing data, and provides actionable insights for workforce planning and operations."}
              </p>
            </div>

            {/* Key Capabilities */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold">
                <ListChecks className="w-3.5 h-3.5 text-brand-purple" />
                <span>Key Capabilities</span>
              </div>
              <ul className="space-y-1.5 bg-slate-50/60 dark:bg-slate-900/30 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                {(component.keyCapabilities || [
                  "Natural language query understanding",
                  "Workforce & shift planning recommendations",
                  "Attrition and trend analysis",
                  "Automated insights and summaries",
                ]).map((cap, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300 leading-tight">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-purple shrink-0 mt-1.5" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technologies Used */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold">
                <Cpu className="w-3.5 h-3.5 text-brand-purple" />
                <span>Technologies Used</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(component.technologies || [
                  { name: "FastAPI", icon: "</>" },
                  { name: "LangChain", icon: "🔗" },
                  { name: "Domo AI", icon: "✨" },
                ]).map((tech, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 border border-purple-200/70 dark:border-purple-800/60 font-bold text-xs shadow-2xs"
                  >
                    <span>{tech.icon}</span>
                    <span>{tech.name}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold">
                <ArrowDownToLine className="w-3.5 h-3.5 text-blue-500" />
                <span>Inputs</span>
              </div>
              <ul className="space-y-1 bg-slate-50/60 dark:bg-slate-900/30 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                {(component.inputs || [
                  "Structured data from Neon PostgreSQL (employees, attendance, shifts, production, masters)",
                  "User queries from the application (chat & analysis)",
                ]).map((inp, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300 leading-tight">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                    <span>{inp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Outputs */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold">
                <ArrowUpFromLine className="w-3.5 h-3.5 text-emerald-500" />
                <span>Outputs</span>
              </div>
              <ul className="space-y-1 bg-slate-50/60 dark:bg-slate-900/30 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                {(component.outputs || [
                  "Analytical insights and recommendations",
                  "Trend charts and workforce summaries",
                  "Actionable responses for planning and operations",
                ]).map((out, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300 leading-tight">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* SUBTAB 2: TECHNICAL DETAILS */}
        {activeSubTab === "technical" && (
          <div className="flex flex-col gap-2">
            <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Frontend Component
              </span>
              <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-300">
                {component.technicalDetails?.frontendComponent || "WorkforceArchitectureDiagram.jsx"}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Backend Service
              </span>
              <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
                {component.technicalDetails?.backendService || "backend/main.py (FastAPI App)"}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Database Tables
              </span>
              <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                {component.technicalDetails?.databaseTables?.join(", ") || "dim_employee, fact_attendance_records, dim_shift_calendar"}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                AI Engine & Model
              </span>
              <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                {component.technicalDetails?.aiTool || "DomoTextLLM via Domo AI Service API"}
              </span>
            </div>
          </div>
        )}

        {/* SUBTAB 3: APIS & I/O */}
        {activeSubTab === "apis" && (
          <div className="flex flex-col gap-2">
            <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                REST Endpoint
              </span>
              <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 block">
                POST /api/chat/workforce-rca
              </span>
              <span className="font-mono text-[11px] text-slate-500 block mt-0.5">
                GET /api/analytics/workforce-kpis
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Payload Format
              </span>
              <pre className="text-[10px] font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-950 p-2 rounded-lg overflow-x-auto border border-slate-200/60 dark:border-slate-800">
{`{
  "query": "Explain shift 2 attendance drop",
  "scope": { "plant": "PLT-01", "month": "2026-11" },
  "session_id": "uuid-v4"
}`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
