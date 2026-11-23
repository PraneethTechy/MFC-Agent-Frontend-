import React from "react";
import {
  Target,
  FileText,
  Cog,
  ArrowRight,
  Zap,
} from "lucide-react";

export default function AIRCAEngineExplainer({ activeSelection }) {
  // Default title and fields strictly set to AI RCA Intelligence Engine — How It Works
  const title = activeSelection?.title || "AI RCA Intelligence Engine — How It Works";
  const badge = activeSelection?.badgeLabel || "Selected from Architecture";
  const subtitle =
    activeSelection?.subtitle ||
    "Finding and explaining the reasons behind manufacturing cost and operational changes";
  const whatItDoes =
    activeSelection?.whatItDoes ||
    "Investigates manufacturing problems by analyzing relevant cost, production, material, quality, equipment, workforce and supplier information to identify evidence-backed root causes.";
  const whatHappensHere = activeSelection?.whatHappensHere || [
    "Calculates manufacturing cost, production and operational performance using deterministic calculations.",
    "Identifies which RCA dimensions are relevant to the reported problem.",
    "Examines relevant records across available datasets and time periods.",
    "Connects supporting evidence and distinguishes confirmed findings from correlations or possible explanations.",
    "Quantifies the impact where the available data supports it and prioritizes corrective actions.",
  ];
  const inputs =
    activeSelection?.inputs ||
    "Available manufacturing data, investigation period, selected filters and the problem described by the user.";
  const outputs =
    activeSelection?.outputs ||
    "Prioritized root-cause findings, supporting evidence, quantified impact where possible, and recommended corrective actions.";
  const businessValue =
    activeSelection?.businessValue ||
    "Helps management move beyond identifying that a cost or production metric has changed to understanding what contributed to the change and where corrective action may be needed.";

  return (
    <div className="w-full h-full bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-2xs flex flex-col justify-between gap-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800 gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-[#6f3dba] dark:text-purple-300 flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
            <Target className="w-4 h-4 stroke-[2.2]" />
          </div>
          <h3 className="text-xs sm:text-sm font-extrabold text-[#1f2f59] dark:text-slate-100 tracking-tight">
            {title}
          </h3>
        </div>

        {/* Contextual Indicator Badge */}
        <span className="text-[10.5px] font-bold px-2.5 py-1 rounded-lg bg-purple-50 text-[#6f3dba] dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/60 self-start sm:self-auto shrink-0 shadow-2xs">
          {badge}
        </span>
      </div>

      {/* Main Body: What It Does & What Happens Here */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch flex-1">
        {/* Area 1: What It Does (~40% width) */}
        <div className="md:col-span-5 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/70 p-3.5 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100">
            <FileText className="w-4 h-4 text-[#6f3dba] dark:text-purple-400 stroke-[2.2]" />
            <span>What It Does</span>
          </div>
          <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {whatItDoes}
          </p>
        </div>

        {/* Area 2: What Happens Here (~60% width) */}
        <div className="md:col-span-7 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/70 p-3.5 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100">
            <Cog className="w-4 h-4 text-[#6f3dba] dark:text-purple-400 stroke-[2.2]" />
            <span>What Happens Here</span>
          </div>

          <div className="flex flex-col gap-1.5">
            {whatHappensHere.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-700 dark:text-slate-200 leading-snug">
                <span className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-900/60 text-[#6f3dba] dark:text-purple-300 text-[9.5px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="font-medium">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Area 3: Three Cards side-by-side (Inputs -> Outputs -> Business Value) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-0.5">
        {/* Card 1: Inputs */}
        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/70 dark:border-emerald-800/50 p-3 flex flex-col gap-1 shadow-2xs">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-900/50 px-2 py-0.5 rounded flex items-center gap-1 font-mono">
              <ArrowRight className="w-2.5 h-2.5" /> Inputs
            </span>
          </div>
          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 leading-snug font-medium">
            {inputs}
          </p>
        </div>

        {/* Card 2: Outputs */}
        <div className="bg-purple-50/50 dark:bg-purple-950/20 rounded-xl border border-purple-200/70 dark:border-purple-800/50 p-3 flex flex-col gap-1 shadow-2xs">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-100/70 dark:bg-purple-900/50 px-2 py-0.5 rounded flex items-center gap-1 font-mono">
              <ArrowRight className="w-2.5 h-2.5" /> Outputs
            </span>
          </div>
          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 leading-snug font-medium">
            {outputs}
          </p>
        </div>

        {/* Card 3: Business Value */}
        <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/70 dark:border-amber-800/50 p-3 flex flex-col gap-1 shadow-2xs">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-900/50 px-2 py-0.5 rounded flex items-center gap-1 font-mono">
              <Zap className="w-2.5 h-2.5" /> Business Value
            </span>
          </div>
          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 leading-snug font-medium">
            {businessValue}
          </p>
        </div>
      </div>
    </div>
  );
}
