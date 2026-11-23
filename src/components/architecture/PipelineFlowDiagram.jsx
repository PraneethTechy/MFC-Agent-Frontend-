import React from "react";
import { ArrowRight, ChevronRight, Sparkles, CheckCircle2 } from "lucide-react";
import { PIPELINE_STAGES } from "./pipelineStagesData";

export default function PipelineFlowDiagram({ selectedStageId, onSelectStage }) {
  return (
    <div className="w-full bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 sm:p-5 shadow-2xs flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 flex items-center justify-center font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-brand-navy dark:text-slate-100">
              System Architecture Pipeline
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">
              Click any stage card to inspect execution logic & database grounding below ↘
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">
          5-Stage Autonomous RCA Flow
        </span>
      </div>

      {/* 5-Stage Horizontal Flow with Arrows */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5 items-stretch relative">
        {PIPELINE_STAGES.map((stage, idx) => {
          const isSelected = selectedStageId === stage.id;
          return (
            <React.Fragment key={stage.id}>
              <div
                onClick={() => onSelectStage(stage.id)}
                className={`flex flex-col rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                  isSelected
                    ? "ring-3 ring-brand-purple/40 border-brand-purple dark:border-purple-500 shadow-md scale-[1.01]"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs hover:shadow-xs"
                }`}
              >
                {/* Stage Header Banner */}
                <div className={`p-2 ${stage.headerBg} ${stage.headerColor} flex flex-col justify-between`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider">
                      {stage.shortHeader}
                    </span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm bg-black/20 text-white/90">
                      S{stage.stageNum}
                    </span>
                  </div>
                  <span className="text-[9px] font-semibold opacity-85 block truncate mt-0.5">
                    {stage.tagline}
                  </span>
                </div>

                {/* Sub-cards Container */}
                <div className="p-2 bg-slate-50/60 dark:bg-slate-900/60 flex-1 flex flex-col gap-1.5">
                  {stage.subCards.map((sub, sIdx) => (
                    <div
                      key={sIdx}
                      className={`p-1.5 rounded-lg border text-left transition-colors ${
                        isSelected
                          ? "bg-white dark:bg-slate-800 border-purple-200 dark:border-purple-900/60 shadow-2xs"
                          : "bg-white/80 dark:bg-slate-800/80 border-slate-200/70 dark:border-slate-700/60"
                      }`}
                    >
                      <span className="text-[10px] font-bold text-slate-800 dark:text-slate-100 block leading-tight truncate">
                        {sub.label}
                      </span>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 block leading-tight truncate mt-0.5">
                        {sub.sub}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer Selection Indicator */}
                <div className={`p-1 text-center text-[9px] font-bold border-t ${
                  isSelected
                    ? "bg-purple-100/70 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200"
                    : "bg-slate-100/50 text-slate-400 border-slate-100 dark:bg-slate-900 dark:border-slate-800"
                }`}>
                  {isSelected ? "Active Inspection Focus" : "Click to Inspect"}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
