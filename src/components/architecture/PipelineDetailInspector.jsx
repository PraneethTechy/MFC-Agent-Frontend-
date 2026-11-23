import React from "react";
import {
  Cpu,
  Layers,
  Database,
  CheckCircle2,
  Code2,
  Server,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { PIPELINE_STAGES } from "./pipelineStagesData";

export default function PipelineDetailInspector({ selectedStageId, onNavigate }) {
  const stage =
    PIPELINE_STAGES.find((s) => s.id === selectedStageId) || PIPELINE_STAGES[1]; // Default to Stage 2 or selected

  return (
    <div className="w-full bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 sm:p-5 shadow-2xs flex flex-col gap-4 text-left animate-in fade-in duration-150">
      {/* Title & Stage Badge */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand-purple text-white flex items-center justify-center font-black text-xs shadow-xs shrink-0">
            {stage.stageNum}
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-brand-navy dark:text-slate-100 leading-snug">
              {stage.stageNum}. {stage.name}
            </h3>
            <span className="text-[10px] text-slate-400 font-medium block">
              Autonomous Manufacturing Cost Investigation Pipeline
            </span>
          </div>
        </div>

        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${stage.badgeBg}`}>
          STAGE {stage.stageNum} • {stage.tagline}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
        {stage.description}
      </p>

      {/* 2-Column Technical Protocols & Database Grounding Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 text-xs">
        {/* Left: Protocols & Engine */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Server className="w-3 h-3 text-blue-500" /> PROTOCOLS & ENGINES:
          </span>
          <span className="font-mono text-[11px] text-slate-800 dark:text-slate-200 leading-snug">
            {stage.protocols}
          </span>
        </div>

        {/* Right: Database Grounding */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Database className="w-3 h-3 text-cyan-500" /> DATABASE TABLES & VIEWS:
          </span>
          <span className="font-mono text-[11px] text-cyan-700 dark:text-cyan-300 leading-snug">
            {stage.dbTables}
          </span>
        </div>
      </div>

      {/* Numbered Execution Logic & Operational Flow */}
      <div className="flex flex-col gap-2">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-brand-purple" /> Execution Logic & Operational Flow:
        </h4>
        <div className="flex flex-col gap-2">
          {stage.steps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
            >
              <span className="w-5 h-5 rounded-full bg-purple-100 text-brand-purple dark:bg-purple-950 dark:text-purple-300 font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
