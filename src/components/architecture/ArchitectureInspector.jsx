import React from "react";
import {
  X,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Database,
  Cpu,
  Code2,
  Server,
  Zap,
  Sparkles,
  Info,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { ARCHITECTURE_COMPONENTS } from "./architectureData";

export default function ArchitectureInspector({
  selectedId,
  onSelectComponent,
  onClearSelection,
  onNavigate,
}) {
  const component = selectedId ? ARCHITECTURE_COMPONENTS[selectedId] : null;

  if (!component) {
    return (
      <div className="w-full bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-6 shadow-2xs flex flex-col items-center justify-center text-center gap-3 min-h-[400px]">
        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-300 flex items-center justify-center border border-purple-200/60 dark:border-purple-800/60">
          <Layers className="w-6 h-6 stroke-[1.8]" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Architecture Inspector
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs leading-relaxed">
            Click any component on the architecture canvas to inspect its data flow, deterministic logic, and verified code references.
          </p>
        </div>
        <button
          onClick={() => onSelectComponent("engine-deterministic-variance")}
          className="mt-2 px-3.5 py-1.5 rounded-xl bg-brand-purple text-white text-xs font-bold shadow-xs hover:bg-purple-700 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Inspect Core Engine</span>
        </button>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "implemented":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3" /> Implemented
          </span>
        );
      case "partial":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
            <AlertTriangle className="w-3 h-3" /> Partial
          </span>
        );
      case "planned":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
            <Clock className="w-3 h-3" /> Planned
          </span>
        );
    }
  };

  const getLayerColor = (layer) => {
    switch (layer) {
      case "layer-1":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800";
      case "layer-2":
        return "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800";
      case "layer-3":
        return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800";
      case "layer-4":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800";
      case "layer-5":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800";
      case "layer-6":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 sm:p-5 shadow-sm flex flex-col gap-4 text-left animate-in fade-in duration-150">
      {/* Header: Title + Badges + Close */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${getLayerColor(component.layer)}`}>
              {component.category}
            </span>
            {getStatusBadge(component.status)}
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-brand-navy dark:text-slate-100 leading-snug">
            {component.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {component.shortDesc}
          </p>
        </div>

        <button
          onClick={onClearSelection}
          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
          title="Clear Selection"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* A. What It Does */}
      <div className="flex flex-col gap-1.5">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-brand-purple" /> What It Does
        </h4>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
          {component.longDesc}
        </p>
      </div>

      {/* B. Inputs Received */}
      <div className="flex flex-col gap-1.5">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <ArrowRight className="w-3.5 h-3.5 text-blue-500" /> Inputs Received
        </h4>
        <div className="flex flex-col gap-1.5">
          {component.inputs.map((inp, idx) => (
            <div
              key={idx}
              className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 bg-slate-50/70 dark:bg-slate-900/40 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800/80"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
              <span className="leading-snug">{inp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* C. Processing & Internal Logic */}
      <div className="flex flex-col gap-1.5">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-purple-500" /> Processing & Deterministic Logic
        </h4>
        <div className="flex flex-col gap-1.5">
          {component.processing.map((proc, idx) => (
            <div
              key={idx}
              className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 bg-purple-50/40 dark:bg-purple-950/20 px-2.5 py-1.5 rounded-lg border border-purple-100 dark:border-purple-900/40"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-purple shrink-0 mt-1.5" />
              <span className="leading-snug">{proc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* D. Outputs Produced */}
      <div className="flex flex-col gap-1.5">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Outputs Produced
        </h4>
        <div className="flex flex-col gap-1.5">
          {component.outputs.map((out, idx) => (
            <div
              key={idx}
              className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 bg-emerald-50/40 dark:bg-emerald-950/20 px-2.5 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/40"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
              <span className="leading-snug">{out}</span>
            </div>
          ))}
        </div>
      </div>

      {/* E. Connected Components (Interactive Upstream & Downstream Pills) */}
      <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Connected Pipeline Nodes
        </h4>
        
        {/* Upstream */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
            <ArrowLeft className="w-3 h-3 text-cyan-600" /> Upstream Feeds ({component.upstreamIds.length}):
          </span>
          <div className="flex flex-wrap gap-1">
            {component.upstreamIds.length === 0 ? (
              <span className="text-[11px] text-slate-400 italic">None (Root Data Source)</span>
            ) : (
              component.upstreamIds.map((uId) => {
                const target = ARCHITECTURE_COMPONENTS[uId];
                if (!target) return null;
                return (
                  <button
                    key={uId}
                    onClick={() => onSelectComponent(uId)}
                    className="px-2 py-1 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-cyan-100/70 dark:bg-slate-800 dark:hover:bg-cyan-950/60 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-cyan-400 transition-all flex items-center gap-1 cursor-pointer"
                    title={`Inspect ${target.name}`}
                  >
                    <span>{target.name}</span>
                    <ChevronRight className="w-2.5 h-2.5 opacity-50" />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Downstream */}
        <div className="flex flex-col gap-1 mt-1">
          <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
            <ArrowRight className="w-3 h-3 text-purple-600" /> Downstream Consumers ({component.downstreamIds.length}):
          </span>
          <div className="flex flex-wrap gap-1">
            {component.downstreamIds.length === 0 ? (
              <span className="text-[11px] text-slate-400 italic">None (Terminal Output Node)</span>
            ) : (
              component.downstreamIds.map((dId) => {
                const target = ARCHITECTURE_COMPONENTS[dId];
                if (!target) return null;
                return (
                  <button
                    key={dId}
                    onClick={() => onSelectComponent(dId)}
                    className="px-2 py-1 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-purple-100/70 dark:bg-slate-800 dark:hover:bg-purple-950/60 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-purple-400 transition-all flex items-center gap-1 cursor-pointer"
                    title={`Inspect ${target.name}`}
                  >
                    <span>{target.name}</span>
                    <ChevronRight className="w-2.5 h-2.5 opacity-50" />
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* F. Technical Implementation (Verified Codebase References) */}
      <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-indigo-500" /> Verified Codebase References
        </h4>
        <div className="flex flex-col gap-1.5 text-[11px] font-mono bg-slate-50 dark:bg-slate-900/90 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
          {component.techRef.frontend && (
            <div className="flex items-start gap-1.5">
              <span className="text-slate-400 font-sans font-semibold shrink-0">UI:</span>
              <span className="text-purple-600 dark:text-purple-400 truncate">{component.techRef.frontend}</span>
            </div>
          )}
          {component.techRef.backend && (
            <div className="flex items-start gap-1.5">
              <span className="text-slate-400 font-sans font-semibold shrink-0">Backend:</span>
              <span className="text-blue-600 dark:text-blue-400 truncate">{component.techRef.backend}</span>
            </div>
          )}
          {component.techRef.api && (
            <div className="flex items-start gap-1.5">
              <span className="text-slate-400 font-sans font-semibold shrink-0">API:</span>
              <span className="text-emerald-600 dark:text-emerald-400 truncate">{component.techRef.api}</span>
            </div>
          )}
          {component.techRef.db && (
            <div className="flex items-start gap-1.5">
              <span className="text-slate-400 font-sans font-semibold shrink-0">Database:</span>
              <span className="text-cyan-600 dark:text-cyan-400 truncate">{component.techRef.db}</span>
            </div>
          )}
          {component.techRef.aiTool && (
            <div className="flex items-start gap-1.5">
              <span className="text-slate-400 font-sans font-semibold shrink-0">AI Tool:</span>
              <span className="text-amber-600 dark:text-amber-400 truncate">{component.techRef.aiTool}</span>
            </div>
          )}
        </div>
      </div>

      {/* G. Direct Platform Action */}
      {component.route && (
        <div className="pt-2">
          <button
            onClick={() => onNavigate(component.route)}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <span>Open in Application</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
