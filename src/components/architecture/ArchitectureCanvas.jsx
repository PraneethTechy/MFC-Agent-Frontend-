import React from "react";
import {
  Coins,
  Activity,
  Boxes,
  Truck,
  Layers,
  ShieldCheck,
  Wrench,
  Zap,
  CloudUpload,
  Database,
  Search,
  CheckCircle2,
  Lock,
  FileText,
  BarChart3,
  Target,
  Cpu,
  ShieldAlert,
  Brain,
  Sparkles,
  LayoutDashboard,
  LineChart,
  MessageSquareText,
  RotateCw,
  Cog,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  GitBranch,
  Flame,
  ArrowDownRight,
  CornerDownRight,
} from "lucide-react";
import { ARCHITECTURE_COMPONENTS } from "./architectureData";

const ICON_MAP = {
  Coins,
  Activity,
  Boxes,
  Truck,
  Layers,
  ShieldCheck,
  Wrench,
  Zap,
  CloudUpload,
  Database,
  Search,
  CheckCircle2,
  Lock,
  FileText,
  BarChart3,
  Target,
  Cpu,
  ShieldAlert,
  Brain,
  Sparkles,
  LayoutDashboard,
  LineChart,
  MessageSquareText,
  RotateCw,
  Cog,
};

export default function ArchitectureCanvas({
  selectedId,
  onSelectComponent,
  selectedLayer,
  selectedStatus,
  searchQuery,
  zoomLevel,
}) {
  const selectedNode = selectedId ? ARCHITECTURE_COMPONENTS[selectedId] : null;

  const getNodeRelationship = (nodeId) => {
    if (!selectedNode) return "normal";
    if (selectedId === nodeId) return "selected";
    if (selectedNode.upstreamIds?.includes(nodeId)) return "upstream";
    if (selectedNode.downstreamIds?.includes(nodeId)) return "downstream";
    return "dimmed";
  };

  const isNodeVisible = (node) => {
    if (selectedLayer !== "all" && node.layer !== selectedLayer) return false;
    if (selectedStatus !== "all" && node.status !== selectedStatus) return false;
    if (searchQuery && searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      return (
        node.name.toLowerCase().includes(q) ||
        node.shortDesc.toLowerCase().includes(q) ||
        node.category.toLowerCase().includes(q) ||
        node.techRef?.db?.toLowerCase().includes(q) ||
        node.techRef?.backend?.toLowerCase().includes(q) ||
        node.techRef?.aiTool?.toLowerCase().includes(q)
      );
    }
    return true;
  };

  // Node renderer with generous spacing, readable typography (no ugly truncation)
  const renderCard = (nodeId, extraWrapperClass = "") => {
    const node = ARCHITECTURE_COMPONENTS[nodeId];
    if (!node) return null;

    const visible = isNodeVisible(node);
    const rel = getNodeRelationship(nodeId);
    const IconComponent = ICON_MAP[node.icon] || Layers;

    let containerStyle =
      "bg-white dark:bg-[#1e293b] border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs hover:shadow-xs";
    let iconStyle = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";
    let ringClass = "";

    if (rel === "selected") {
      containerStyle =
        "bg-purple-50/90 dark:bg-purple-950/50 border-brand-purple dark:border-purple-500 shadow-md scale-[1.01] z-20";
      iconStyle = "bg-brand-purple text-white shadow-xs";
      ringClass = "ring-4 ring-brand-purple/25";
    } else if (rel === "upstream") {
      containerStyle =
        "bg-cyan-50/80 dark:bg-cyan-950/40 border-cyan-400 dark:border-cyan-500/80 shadow-xs z-10";
      iconStyle = "bg-cyan-500 text-white shadow-xs";
      ringClass = "ring-2 ring-cyan-400/50";
    } else if (rel === "downstream") {
      containerStyle =
        "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-500/80 shadow-xs z-10";
      iconStyle = "bg-emerald-500 text-white shadow-xs";
      ringClass = "ring-2 ring-emerald-400/50";
    } else if (rel === "dimmed" || !visible) {
      containerStyle += " opacity-35 grayscale-[30%] hover:opacity-80 hover:grayscale-0";
    }

    const statusBadge =
      node.status === "implemented" ? (
        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 px-1.5 py-0.5 rounded-md shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active
        </span>
      ) : node.status === "partial" ? (
        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 px-1.5 py-0.5 rounded-md shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Partial
        </span>
      ) : (
        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded-md shrink-0">
          Planned
        </span>
      );

    return (
      <button
        key={node.id}
        onClick={() => onSelectComponent(node.id)}
        className={`w-full text-left rounded-xl p-3 transition-all duration-200 border cursor-pointer flex flex-col justify-between gap-2 ${containerStyle} ${ringClass} ${extraWrapperClass}`}
      >
        {/* Top: Icon + Title + Category + Status */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${iconStyle}`}>
              <IconComponent className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {node.name}
              </h4>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wide block mt-0.5">
                {node.category}
              </span>
            </div>
          </div>
          {statusBadge}
        </div>

        {/* Middle: Short Description (Readable prose, no ugly truncation) */}
        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {node.shortDesc}
        </p>

        {/* Bottom Metadata Pill: Table name / Service Reference */}
        <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
          {node.techRef?.db ? (
            <span className="font-mono text-slate-500 dark:text-slate-400 truncate max-w-[170px]">
              {node.techRef.db.split(" ")[0]}
            </span>
          ) : node.techRef?.aiTool ? (
            <span className="font-mono text-purple-600 dark:text-purple-400 truncate max-w-[170px]">
              {node.techRef.aiTool.split(",")[0]}
            </span>
          ) : (
            <span className="text-slate-400">Verified Service</span>
          )}

          {rel === "selected" ? (
            <span className="font-bold text-brand-purple dark:text-purple-300 flex items-center gap-0.5">
              Inspecting <ChevronRight className="w-3 h-3" />
            </span>
          ) : (
            <span className="text-slate-400 group-hover:text-slate-600 dark:hover:text-slate-200">
              Details →
            </span>
          )}
        </div>
      </button>
    );
  };

  return (
    <div
      className="w-full flex flex-col gap-6 transition-transform origin-top-left"
      style={{
        transform: `scale(${zoomLevel / 100})`,
        width: `${(100 * 100) / zoomLevel}%`,
      }}
    >
      {/* =========================================================================
          HORIZONTAL MULTI-STAGE ARCHITECTURE PIPELINE
          Uses min-w-[1360px] to guarantee every stage has full, comfortable readability
          with zero text truncation!
          ========================================================================= */}
      <div className="min-w-[1360px] flex items-stretch gap-3 relative pb-2">
        {/* =====================================================================
            STAGE 1: MANUFACTURING DATA SOURCES
            ===================================================================== */}
        <div className="w-[250px] shrink-0 flex flex-col gap-3 bg-gradient-to-b from-blue-50/60 to-slate-50/30 dark:from-blue-950/25 dark:to-slate-900/30 border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-3.5 shadow-2xs">
          {/* Stage Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-blue-200/60 dark:border-blue-900/60">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-extrabold text-xs shadow-2xs">
                1
              </div>
              <div>
                <h3 className="text-xs font-black text-blue-950 dark:text-blue-200 uppercase tracking-wider">
                  Data Sources
                </h3>
                <p className="text-[10px] text-blue-700 dark:text-blue-300 font-medium">
                  Shopfloor & ERP Feeds
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
              7 Active
            </span>
          </div>

          {/* Cards */}
          <div className="flex flex-col gap-2.5">
            {renderCard("source-cost-batches")}
            {renderCard("source-hourly-production")}
            {renderCard("source-bom-components")}
            {renderCard("source-material-procurement")}
            {renderCard("source-material-consumption")}
            {renderCard("source-quality-inspection")}
            {renderCard("source-quality-rework")}
            {renderCard("source-energy-telemetry")}
          </div>
        </div>

        {/* CONNECTOR 1 -> 2 */}
        <div className="w-8 shrink-0 flex flex-col items-center justify-center gap-2 text-cyan-600 dark:text-cyan-400">
          <div className="w-full h-0.5 bg-gradient-to-r from-blue-300 to-cyan-400 dark:from-blue-800 dark:to-cyan-600" />
          <div className="w-7 h-7 rounded-full bg-white dark:bg-[#1e293b] border border-cyan-300 dark:border-cyan-700 shadow-xs flex items-center justify-center text-cyan-600">
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <div className="w-full h-0.5 bg-gradient-to-r from-blue-300 to-cyan-400 dark:from-blue-800 dark:to-cyan-600" />
        </div>

        {/* =====================================================================
            STAGE 2: DATA INGESTION & INTEGRATION
            ===================================================================== */}
        <div className="w-[250px] shrink-0 flex flex-col gap-3 bg-gradient-to-b from-cyan-50/60 to-slate-50/30 dark:from-cyan-950/25 dark:to-slate-900/30 border border-cyan-200/80 dark:border-cyan-900/50 rounded-2xl p-3.5 shadow-2xs">
          {/* Stage Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-cyan-200/60 dark:border-cyan-900/60">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-extrabold text-xs shadow-2xs">
                2
              </div>
              <div>
                <h3 className="text-xs font-black text-cyan-950 dark:text-cyan-200 uppercase tracking-wider">
                  Ingestion
                </h3>
                <p className="text-[10px] text-cyan-700 dark:text-cyan-300 font-medium">
                  Validate • Map • Promote
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-200 border border-cyan-200 dark:border-cyan-800">
              ACID Upsert
            </span>
          </div>

          {/* Cards */}
          <div className="flex flex-col gap-2.5">
            {renderCard("ingest-file-upload")}
            {renderCard("ingest-connectors")}
            {renderCard("ingest-schema-validator")}
            {renderCard("ingest-multi-validator")}
            {renderCard("ingest-atomic-promotion")}
          </div>

          <div className="mt-auto p-2.5 rounded-xl bg-cyan-100/50 dark:bg-cyan-950/50 border border-cyan-200/70 dark:border-cyan-800/60 text-[11px] text-cyan-900 dark:text-cyan-200 leading-relaxed">
            <strong>Strategy C Lineage:</strong> Prior fact states are archived into <code className="font-mono text-[10px] bg-white/70 dark:bg-slate-900/70 px-1 py-0.5 rounded">fact_record_history</code> before overwrite.
          </div>
        </div>

        {/* CONNECTOR 2 -> 3 */}
        <div className="w-8 shrink-0 flex flex-col items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400">
          <div className="w-full h-0.5 bg-gradient-to-r from-cyan-400 to-indigo-400 dark:from-cyan-600 dark:to-indigo-600" />
          <div className="w-7 h-7 rounded-full bg-white dark:bg-[#1e293b] border border-indigo-300 dark:border-indigo-700 shadow-xs flex items-center justify-center text-indigo-600">
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <div className="w-full h-0.5 bg-gradient-to-r from-cyan-400 to-indigo-400 dark:from-cyan-600 dark:to-indigo-600" />
        </div>

        {/* =====================================================================
            STAGE 3: DATA PLATFORM & GOVERNANCE
            ===================================================================== */}
        <div className="w-[250px] shrink-0 flex flex-col gap-3 bg-gradient-to-b from-indigo-50/60 to-slate-50/30 dark:from-indigo-950/25 dark:to-slate-900/30 border border-indigo-200/80 dark:border-indigo-900/50 rounded-2xl p-3.5 shadow-2xs">
          {/* Stage Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-indigo-200/60 dark:border-indigo-900/60">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-extrabold text-xs shadow-2xs">
                3
              </div>
              <div>
                <h3 className="text-xs font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-wider">
                  Platform
                </h3>
                <p className="text-[10px] text-indigo-700 dark:text-indigo-300 font-medium">
                  PostgreSQL Core Facts
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800">
              127k+ Rows
            </span>
          </div>

          {/* Cards */}
          <div className="flex flex-col gap-2.5">
            {renderCard("platform-staging-isolation")}
            {renderCard("platform-postgres-facts")}
            {renderCard("platform-master-views")}
            {renderCard("platform-sql-views")}
            {renderCard("platform-audit-ledger")}
            {renderCard("platform-report-durability")}
          </div>
        </div>

        {/* CONNECTOR 3 -> 4 */}
        <div className="w-8 shrink-0 flex flex-col items-center justify-center gap-2 text-purple-600 dark:text-purple-400">
          <div className="w-full h-0.5 bg-gradient-to-r from-indigo-400 to-purple-500 dark:from-indigo-600 dark:to-purple-500" />
          <div className="w-7 h-7 rounded-full bg-white dark:bg-[#1e293b] border border-purple-400 dark:border-purple-600 shadow-sm flex items-center justify-center text-purple-600">
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <div className="w-full h-0.5 bg-gradient-to-r from-indigo-400 to-purple-500 dark:from-indigo-600 dark:to-purple-500" />
        </div>

        {/* =====================================================================
            STAGE 4: MANUFACTURING INTELLIGENCE & INVESTIGATION CORE (HERO)
            Wider column (310px) to properly display the 4 sub-disciplines
            ===================================================================== */}
        <div className="w-[310px] shrink-0 flex flex-col gap-3 bg-gradient-to-b from-purple-100/70 via-purple-50/40 to-indigo-50/50 dark:from-purple-950/40 dark:via-purple-950/20 dark:to-indigo-950/30 border-2 border-purple-400/90 dark:border-purple-600 rounded-2xl p-3.5 shadow-sm ring-4 ring-purple-100/70 dark:ring-purple-950/50 relative">
          {/* Hero Banner Pill */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white font-black text-[10px] tracking-wider uppercase shadow-xs flex items-center gap-1.5 whitespace-nowrap">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Agent Core & Analytical Engine</span>
          </div>

          {/* Stage Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-purple-200/90 dark:border-purple-800 pt-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-brand-purple text-white flex items-center justify-center font-extrabold text-xs shadow-2xs">
                4
              </div>
              <div>
                <h3 className="text-xs font-black text-purple-950 dark:text-purple-100 uppercase tracking-wider">
                  Intelligence Core
                </h3>
                <p className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold">
                  Deterministic Math + Domo AI
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-200/70 text-purple-900 dark:bg-purple-900/80 dark:text-purple-200 border border-purple-300 dark:border-purple-700">
              Dual Engine
            </span>
          </div>

          {/* 4 Architectural Sub-Clusters */}
          <div className="flex flex-col gap-3">
            {/* 4A. Planning */}
            <div className="bg-white/90 dark:bg-slate-900/70 rounded-xl p-2.5 border border-purple-200 dark:border-purple-900/60 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold text-purple-800 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3 h-3 text-purple-600" /> 4A. Scope & Baselines
                </span>
                <span className="text-[9px] font-semibold text-slate-400">Context</span>
              </div>
              {renderCard("engine-investigation-planning")}
            </div>

            {/* 4B. Deterministic Engine (Python / SQL) */}
            <div className="bg-white/90 dark:bg-slate-900/70 rounded-xl p-2.5 border border-indigo-200 dark:border-indigo-900/60 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-3 h-3 text-indigo-600" /> 4B. Deterministic Math (Python/SQL)
                </span>
                <span className="text-[9px] font-semibold text-emerald-600 font-mono">±₹0.00 Error</span>
              </div>
              <div className="flex flex-col gap-2">
                {renderCard("engine-deterministic-variance")}
                {renderCard("engine-quality-defect-engine")}
              </div>
            </div>

            {/* 4C. AI Reasoning Engine (Domo AI Services) */}
            <div className="bg-white/90 dark:bg-slate-900/70 rounded-xl p-2.5 border border-purple-200 dark:border-purple-900/60 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold text-purple-800 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain className="w-3 h-3 text-brand-purple" /> 4C. AI Reasoning & ACH (Domo AI)
                </span>
                <span className="text-[9px] font-semibold text-purple-600">8 Personas</span>
              </div>
              {renderCard("engine-ai-reasoning")}
            </div>

            {/* 4D. Action & Savings Plan */}
            <div className="bg-white/90 dark:bg-slate-900/70 rounded-xl p-2.5 border border-emerald-200 dark:border-emerald-900/60 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-emerald-600" /> 4D. Action & Savings Plan
                </span>
                <span className="text-[9px] font-semibold text-emerald-600">ROI Guard</span>
              </div>
              {renderCard("engine-recommendation-gen")}
            </div>
          </div>
        </div>

        {/* CONNECTOR 4 -> 5 */}
        <div className="w-8 shrink-0 flex flex-col items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
          <div className="w-full h-0.5 bg-gradient-to-r from-purple-500 to-emerald-400 dark:from-purple-600 dark:to-emerald-600" />
          <div className="w-7 h-7 rounded-full bg-white dark:bg-[#1e293b] border border-emerald-300 dark:border-emerald-700 shadow-xs flex items-center justify-center text-emerald-600">
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <div className="w-full h-0.5 bg-gradient-to-r from-purple-500 to-emerald-400 dark:from-purple-600 dark:to-emerald-600" />
        </div>

        {/* =====================================================================
            STAGE 5: BUSINESS APPLICATIONS & OUTPUTS
            ===================================================================== */}
        <div className="w-[250px] shrink-0 flex flex-col gap-3 bg-gradient-to-b from-emerald-50/60 to-slate-50/30 dark:from-emerald-950/25 dark:to-slate-900/30 border border-emerald-200/80 dark:border-emerald-900/50 rounded-2xl p-3.5 shadow-2xs">
          {/* Stage Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-emerald-200/60 dark:border-emerald-900/60">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-extrabold text-xs shadow-2xs">
                5
              </div>
              <div>
                <h3 className="text-xs font-black text-emerald-950 dark:text-emerald-200 uppercase tracking-wider">
                  Applications
                </h3>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium">
                  Executive Outcomes & Actions
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
              Operational
            </span>
          </div>

          {/* Cards */}
          <div className="flex flex-col gap-2.5">
            {renderCard("app-cost-overview")}
            {renderCard("app-investigation-result")}
            {renderCard("app-ai-sandbox")}
            {renderCard("app-improvement-plan")}
            {renderCard("app-report-history")}
          </div>

          <div className="mt-auto p-2.5 rounded-xl bg-emerald-100/50 dark:bg-emerald-950/50 border border-emerald-200/70 dark:border-emerald-800/60 text-[11px] text-emerald-900 dark:text-emerald-200 leading-relaxed">
            <strong>Target Metric:</strong> Cost per Good Smartphone Unit, with confirmed root-cause proof chains.
          </div>
        </div>
      </div>

      {/* =========================================================================
          STAGE 6: CLOSED-LOOP CONTINUOUS LEARNING & CALIBRATION (Full-Width Bottom Loop)
          ========================================================================= */}
      <div className="min-w-[1360px] bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 text-white rounded-2xl p-5 border border-purple-500/40 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center shrink-0 shadow-xs">
            <RotateCw className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wider">
                Stage 6 — Closed Loop
              </span>
              <span className="text-xs text-purple-200/90 font-semibold">Continuous Recalibration</span>
            </div>
            <h3 className="text-base font-extrabold text-white mt-1">
              Remediation Feedback Loop to Investigation Baselines
            </h3>
            <p className="text-xs text-purple-200/80 mt-0.5 max-w-2xl leading-relaxed">
              When corrective engineering actions are implemented on the shopfloor, subsequent batch uploads are analyzed to evaluate realized vs projected savings, refining standard BOM tolerances for future investigations.
            </p>
          </div>
        </div>

        {/* Feedback Cards */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-[280px]">
            {renderCard(
              "feedback-outcome-tracker",
              "!bg-slate-900/90 !text-white !border-purple-400/40 hover:!border-purple-300"
            )}
          </div>
          <div className="w-[280px]">
            {renderCard(
              "feedback-baseline-calibration",
              "!bg-slate-900/90 !text-white !border-purple-400/40 hover:!border-purple-300"
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
