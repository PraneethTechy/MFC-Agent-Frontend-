import React, { useState } from "react";
import {
  Compass,
  History,
  TrendingUp,
  GitFork,
  Cpu,
  ShieldAlert,
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers,
  FileText,
  Workflow,
  ExternalLink,
} from "lucide-react";
import { INVESTIGATION_WORKFLOW_STAGES } from "./architectureData";

const ICON_MAP = {
  Compass,
  History,
  TrendingUp,
  GitFork,
  Cpu,
  ShieldAlert,
  Target,
  Sparkles,
};

export default function RcaInvestigationWorkflow({ onNavigate }) {
  const [selectedStageNumber, setSelectedStageNumber] = useState(1);

  const stage =
    INVESTIGATION_WORKFLOW_STAGES.find((s) => s.stageNumber === selectedStageNumber) ||
    INVESTIGATION_WORKFLOW_STAGES[0];

  const StageIcon = ICON_MAP[stage.icon] || Workflow;

  return (
    <div className="w-full flex flex-col gap-4 font-sans animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-brand-purple dark:bg-purple-950/60 dark:text-purple-300 flex items-center justify-center font-bold">
            <Workflow className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-brand-navy dark:text-slate-100 leading-tight">
              Manufacturing Cost RCA – Eight-Stage Investigation Workflow
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Autonomous, evidence-backed problem solving for smartphone manufacturing cost anomalies
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 text-[11px]">Dynamic Scoping:</span>
          <span className="font-bold text-brand-purple bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-200 dark:border-purple-800">
            Dimension Scoping (Not Blind Brute-Force)
          </span>
        </div>
      </div>

      {/* Main Two-Column Workflow Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start w-full">
        {/* Left Column (5 cols): The 8 Interactive Stages */}
        <div className="lg:col-span-5 flex flex-col gap-2">
          {INVESTIGATION_WORKFLOW_STAGES.map((s) => {
            const IconComponent = ICON_MAP[s.icon] || Workflow;
            const isSelected = s.stageNumber === selectedStageNumber;
            return (
              <div
                key={s.stageNumber}
                onClick={() => setSelectedStageNumber(s.stageNumber)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? "bg-purple-50/90 border-brand-purple dark:bg-purple-950/50 dark:border-purple-500 shadow-xs ring-2 ring-purple-500/20"
                    : "bg-white dark:bg-[#1e293b] border-slate-200/80 dark:border-slate-700 hover:border-purple-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-brand-purple text-white shadow-xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    0{s.stageNumber}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span
                      className={`text-xs font-bold truncate leading-tight ${
                        isSelected
                          ? "text-brand-purple dark:text-purple-300"
                          : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {s.title}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate leading-tight mt-0.5">
                      {s.tagline}
                    </span>
                  </div>
                </div>

                <IconComponent
                  className={`w-4 h-4 shrink-0 ${
                    isSelected ? "text-brand-purple" : "text-slate-400"
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Right Column (7 cols): Detailed Stage Inspector */}
        <div className="lg:col-span-7 bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-5 shadow-2xs flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-brand-purple dark:bg-purple-950/60 dark:text-purple-300 flex items-center justify-center font-bold shadow-2xs shrink-0">
                <StageIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-brand-purple uppercase tracking-wider block">
                  Stage 0{stage.stageNumber} of 08
                </span>
                <h3 className="text-base font-extrabold text-brand-navy dark:text-slate-100 leading-tight">
                  {stage.title}
                </h3>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-brand-purple dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800">
              {stage.responsibleLayer}
            </span>
          </div>

          {/* Objective */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Stage Objective
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/70 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
              {stage.objective}
            </p>
          </div>

          {/* Deterministic Actions */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-brand-purple" />
              Deterministic Calculation Actions (SQL & Python)
            </span>
            <ul className="space-y-1.5 bg-purple-50/30 dark:bg-purple-950/20 p-3 rounded-xl border border-purple-200/60 dark:border-purple-800/40 text-xs text-slate-700 dark:text-slate-300">
              {stage.deterministicActions.map((action, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-purple shrink-0 mt-1.5" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Reasoning Role */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
              AI Reasoning Role (DomoTextLLM)
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/70 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
              {stage.aiReasoningRole}
            </p>
          </div>

          {/* Footer Metadata: Tools, Evidence Gate, Output Artifact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                LangChain Tools Used
              </span>
              <div className="flex flex-wrap gap-1">
                {stage.toolsUsed.map((tool, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-200/60 dark:border-purple-800/60"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Evidence Gate
              </span>
              <span className="font-bold text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {stage.evidenceGate}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Output Artifact
              </span>
              <span className="font-bold text-[11px] text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <FileText className="w-3 h-3 text-blue-500" />
                {stage.outputArtifact}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
