import React, { useState } from "react";
import {
  Workflow,
  Search,
  Filter,
  CheckCircle,
  TrendingDown,
  ArrowRight,
  Database,
  Cpu,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { INVESTIGATION_WORKFLOW_STAGES } from "./homeData";

const STAGE_ICONS = {
  1: Database,
  2: Filter,
  3: Search,
  4: ShieldCheck,
  5: TrendingDown,
};

export default function InvestigationWorkflow() {
  const [activeStageIndex, setActiveStageIndex] = useState(4); // Default to Stage 5 to match Reference Screenshot 2 or let user browse
  const activeStage = INVESTIGATION_WORKFLOW_STAGES[activeStageIndex];

  return (
    <div className="w-full bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 sm:p-5 shadow-2xs flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-[#6f3dba] dark:text-purple-300 flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
            <Workflow className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-[#1f2f59] dark:text-slate-100 tracking-tight">
              Manufacturing Cost Investigation Workflow
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none mt-0.5">
              How the agent moves from cost variation to evidence-backed root causes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-[10px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
            5 CONNECTED STAGES
          </span>
        </div>
      </div>

      {/* 5-Stage Stepper Header */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {INVESTIGATION_WORKFLOW_STAGES.map((stage, idx) => {
          const isActive = idx === activeStageIndex;
          const StageIcon = STAGE_ICONS[stage.stageNum] || CheckCircle;

          return (
            <button
              key={stage.id}
              onClick={() => setActiveStageIndex(idx)}
              className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative group ${
                isActive
                  ? "bg-purple-50/80 dark:bg-purple-950/40 border-[#6f3dba] dark:border-purple-500 shadow-xs ring-1 ring-purple-500/30"
                  : "bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/70 hover:bg-white dark:hover:bg-slate-800 hover:border-purple-200"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                    isActive
                      ? "bg-[#6f3dba] text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {stage.stageNum}
                </span>
                <StageIcon
                  className={`w-3.5 h-3.5 ${
                    isActive ? "text-[#6f3dba] dark:text-purple-300" : "text-slate-400 dark:text-slate-500"
                  }`}
                />
              </div>

              <div>
                <p
                  className={`text-[11px] font-bold leading-tight ${
                    isActive ? "text-[#1f2f59] dark:text-white" : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {stage.name}
                </p>
                <p className="text-[9.5px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 line-clamp-1">
                  {stage.tagline}
                </p>
              </div>

              {idx < INVESTIGATION_WORKFLOW_STAGES.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Stage Detailed Card (Matching Reference Screenshot 2 format) */}
      <div className="rounded-xl border border-purple-200/80 dark:border-purple-900/60 bg-gradient-to-br from-white via-purple-50/20 to-slate-50/50 dark:from-slate-800/90 dark:via-purple-950/20 dark:to-slate-900/60 p-4 sm:p-5 flex flex-col gap-3 shadow-2xs">
        {/* Stage Header & Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-purple-100 dark:border-purple-900/40">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-purple-100 dark:bg-purple-900/60 text-[#6f3dba] dark:text-purple-300">
              <Sparkles className="w-4 h-4" />
            </span>
            <h4 className="text-sm font-extrabold text-[#1f2f59] dark:text-slate-100">
              Stage {activeStage.stageNum}. {activeStage.name}
            </h4>
          </div>
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-200 border border-purple-300 dark:border-purple-800 self-start sm:self-auto">
            {activeStage.badge}
          </span>
        </div>

        {/* Narrative Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          {activeStage.description}
        </p>

        {/* Technical Grounding: Protocols & Database Tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs py-1">
          <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/70 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">
              PROTOCOLS & LOGIC ENGINE
            </span>
            <span className="font-mono text-[11px] font-semibold text-slate-800 dark:text-slate-200">
              {activeStage.protocols}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/70 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">
              DATABASE GROUNDING TABLES
            </span>
            <span className="font-mono text-[11px] font-semibold text-[#6f3dba] dark:text-purple-300">
              {activeStage.dbTables}
            </span>
          </div>
        </div>

        {/* Step-by-Step Execution Logic */}
        <div className="flex flex-col gap-1.5 pt-1">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Execution Logic & Operational Flow:
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            {activeStage.logic.map((step, sIdx) => (
              <div
                key={sIdx}
                className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-200 leading-snug"
              >
                <span className="text-[#6f3dba] dark:text-purple-400 font-black font-mono text-[11px] shrink-0 mt-0.5">
                  {sIdx + 1}
                </span>
                <p className="font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Inputs & Outputs Contract */}
        <div className="pt-2 border-t border-purple-100 dark:border-purple-900/40 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-slate-400 font-bold uppercase text-[9px] shrink-0">Inputs:</span>
            <span className="text-slate-600 dark:text-slate-400 truncate font-mono text-[10px]">
              {activeStage.inputs}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-slate-400 font-bold uppercase text-[9px]">Outputs:</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold font-mono text-[10px]">
              {activeStage.outputs}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
