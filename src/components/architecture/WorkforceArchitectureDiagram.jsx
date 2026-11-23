import React from "react";
import {
  Database,
  Users,
  CalendarCheck,
  Calendar,
  Activity,
  Layers,
  MapPin,
  Cog,
  CloudUpload,
  ShieldCheck,
  RotateCw,
  GitBranch,
  Brain,
  Code2,
  Workflow,
  Cpu,
  Sparkles,
  LayoutDashboard,
  LineChart,
  Clock,
  MessageSquareText,
  ArrowRight,
  CheckCircle2,
  Table,
} from "lucide-react";
import { ARCHITECTURE_STAGES } from "./workforceArchitectureData";

const ICON_MAP = {
  Database,
  Users,
  CalendarCheck,
  Calendar,
  Activity,
  Layers,
  MapPin,
  Cog,
  CloudUpload,
  ShieldCheck,
  RotateCw,
  GitBranch,
  Brain,
  Code2,
  Workflow,
  Cpu,
  Sparkles,
  LayoutDashboard,
  LineChart,
  Clock,
  MessageSquareText,
  Table,
};

export default function WorkforceArchitectureDiagram({
  selectedId,
  onSelectComponent,
}) {
  return (
    <div className="w-full bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 shadow-2xs flex flex-col gap-3 relative">
      {/* Top Header of Diagram Box */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 flex items-center justify-center font-bold">
            <Cog className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-brand-navy dark:text-slate-100 leading-tight">
              Manufacturing Workforce Management Agent – System Architecture
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              End-to-end architecture for AI-powered workforce management in manufacturing
            </p>
          </div>
        </div>

        {/* Status Legend */}
        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Implemented</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            <span>Partial</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
            <span>Planned</span>
          </span>
        </div>
      </div>

      {/* 5-Stage Connected Pipeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5 items-stretch relative pt-1">
        {/* =====================================================================
            STAGE 1: DATA SOURCES (Blue)
            ===================================================================== */}
        <div
          onClick={() => onSelectComponent("comp-employee-hr")}
          className={`flex flex-col rounded-xl border p-2.5 transition-all duration-150 cursor-pointer ${
            selectedId.includes("sources") || selectedId === "comp-employee-hr" || selectedId === "comp-attendance-data"
              ? "bg-blue-50/70 border-blue-400 dark:bg-blue-950/30 dark:border-blue-700 shadow-xs ring-2 ring-blue-400/30"
              : "bg-blue-50/30 dark:bg-blue-950/20 border-blue-200/80 dark:border-blue-900/50 hover:border-blue-300"
          }`}
        >
          {/* Box Header */}
          <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-blue-200/60 dark:border-blue-900/60 text-blue-800 dark:text-blue-300">
            <Database className="w-3.5 h-3.5" />
            <h3 className="text-xs font-black uppercase tracking-wider">
              Data Sources
            </h3>
          </div>

          {/* Items */}
          <div className="flex flex-col gap-1.5">
            {[
              { id: "comp-employee-hr", label: "Employee & HR Data", icon: Users },
              { id: "comp-attendance-data", label: "Attendance Data", icon: CalendarCheck },
              { id: "comp-shift-calendar", label: "Shift & Calendar", icon: Calendar },
              { id: "comp-production-data", label: "Production Data", icon: Activity },
              { id: "comp-dept-section", label: "Department & Section", icon: Layers },
              { id: "comp-experience-plant", label: "Experience & Plant Data", icon: MapPin },
            ].map((item) => {
              const Icon = item.icon;
              const isItemActive = selectedId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectComponent(item.id);
                  }}
                  className={`p-1.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                    isItemActive
                      ? "bg-white dark:bg-slate-800 border-blue-500 shadow-2xs font-bold text-blue-900 dark:text-blue-200"
                      : "bg-white/80 dark:bg-slate-800/80 border-blue-100 dark:border-blue-900/40 text-slate-700 dark:text-slate-300 hover:bg-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="text-[11px] font-semibold leading-tight truncate">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* =====================================================================
            STAGE 2: DATA INGESTION & VALIDATION (Green)
            ===================================================================== */}
        <div
          onClick={() => onSelectComponent("comp-data-validation")}
          className={`flex flex-col rounded-xl border p-2.5 transition-all duration-150 cursor-pointer ${
            selectedId.includes("ingestion") || selectedId === "comp-data-validation"
              ? "bg-emerald-50/70 border-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-700 shadow-xs ring-2 ring-emerald-400/30"
              : "bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/50 hover:border-emerald-300"
          }`}
        >
          {/* Box Header */}
          <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-emerald-200/60 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300">
            <Cog className="w-3.5 h-3.5" />
            <h3 className="text-xs font-black uppercase tracking-wider">
              Data Ingestion & Validation
            </h3>
          </div>

          {/* Items */}
          <div className="flex flex-col gap-1.5">
            {[
              { id: "comp-csv-upload", label: "CSV / File Upload", icon: CloudUpload },
              { id: "comp-data-validation", label: "Data Validation", icon: ShieldCheck },
              { id: "comp-transformation", label: "Transformation", icon: RotateCw },
              { id: "comp-data-mapping", label: "Data Mapping", icon: GitBranch },
            ].map((item) => {
              const Icon = item.icon;
              const isItemActive = selectedId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectComponent(item.id);
                  }}
                  className={`p-1.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                    isItemActive
                      ? "bg-white dark:bg-slate-800 border-emerald-500 shadow-2xs font-bold text-emerald-900 dark:text-emerald-200"
                      : "bg-white/80 dark:bg-slate-800/80 border-emerald-100 dark:border-emerald-900/40 text-slate-700 dark:text-slate-300 hover:bg-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-[11px] font-semibold leading-tight truncate">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* =====================================================================
            STAGE 3: DATA PLATFORM (Blue with Neon PostgreSQL Core)
            ===================================================================== */}
        <div
          onClick={() => onSelectComponent("comp-neon-db")}
          className={`flex flex-col rounded-xl border p-2.5 transition-all duration-150 cursor-pointer ${
            selectedId.includes("platform") || selectedId === "comp-neon-db"
              ? "bg-blue-50/70 border-blue-400 dark:bg-blue-950/30 dark:border-blue-700 shadow-xs ring-2 ring-blue-400/30"
              : "bg-blue-50/30 dark:bg-blue-950/20 border-blue-200/80 dark:border-blue-900/50 hover:border-blue-300"
          }`}
        >
          {/* Box Header */}
          <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-blue-200/60 dark:border-blue-900/60 text-blue-800 dark:text-blue-300">
            <Database className="w-3.5 h-3.5" />
            <h3 className="text-xs font-black uppercase tracking-wider">
              Data Platform
            </h3>
          </div>

          {/* Central Neon PostgreSQL Badge */}
          <div className="my-1 py-1.5 px-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg flex items-center justify-center gap-2 shadow-2xs">
            <Database className="w-3.5 h-3.5" />
            <span className="text-[11px] font-extrabold tracking-wide">
              Neon PostgreSQL
            </span>
          </div>

          {/* Tables List */}
          <div className="flex flex-col gap-1 mt-1">
            {[
              "Workforce Tables",
              "Attendance Tables",
              "Shift Calendar Tables",
              "Production Tables",
              "Master Tables",
            ].map((tbl, idx) => (
              <div
                key={idx}
                className="py-1 px-1.5 rounded-md bg-white/80 dark:bg-slate-800/80 border border-blue-100 dark:border-blue-900/40 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <Table className="w-3 h-3 text-blue-500 shrink-0" />
                <span className="truncate">{tbl}</span>
              </div>
            ))}
          </div>
        </div>

        {/* =====================================================================
            STAGE 4: MANUFACTURING AGENT (AI ENGINE) (Purple - Core Focus)
            ===================================================================== */}
        <div
          onClick={() => onSelectComponent("comp-ai-engine")}
          className={`flex flex-col rounded-xl border-2 p-2.5 transition-all duration-150 cursor-pointer ${
            selectedId === "comp-ai-engine" || selectedId === "comp-fastapi"
              ? "bg-purple-50/90 border-brand-purple dark:bg-purple-950/40 dark:border-purple-500 shadow-md ring-3 ring-purple-500/25 scale-[1.01]"
              : "bg-purple-50/40 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800/80 hover:border-purple-400 shadow-2xs"
          }`}
        >
          {/* Box Header */}
          <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200">
            <Brain className="w-3.5 h-3.5 text-brand-purple" />
            <h3 className="text-xs font-black uppercase tracking-wider">
              Manufacturing Agent (AI Engine)
            </h3>
          </div>

          {/* Items */}
          <div className="flex flex-col gap-1.5">
            {[
              { id: "comp-fastapi", label: "FastAPI (Backend API)", icon: Code2, code: "</>" },
              { id: "comp-langchain", label: "LangChain (Agent Orchestration)", icon: Workflow, code: "🔗" },
              { id: "comp-analytics", label: "Deterministic Analytics (SQL + Rules)", icon: Cpu, code: "⚙️" },
              { id: "comp-domo", label: "Domo AI (Text Generation)", icon: Sparkles, code: "✨" },
            ].map((item) => {
              const isItemActive = selectedId === item.id || (selectedId === "comp-ai-engine" && item.id === "comp-langchain");
              return (
                <div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectComponent("comp-ai-engine");
                  }}
                  className={`p-1.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                    isItemActive
                      ? "bg-white dark:bg-slate-800 border-purple-500 shadow-2xs font-bold text-purple-900 dark:text-purple-200"
                      : "bg-white/80 dark:bg-slate-800/80 border-purple-100 dark:border-purple-900/40 text-slate-700 dark:text-slate-300 hover:bg-white"
                  }`}
                >
                  <span className="text-xs">{item.code}</span>
                  <span className="text-[11px] font-semibold leading-tight truncate">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* =====================================================================
            STAGE 5: BUSINESS APPLICATIONS (Green)
            ===================================================================== */}
        <div
          onClick={() => onSelectComponent("comp-business-apps")}
          className={`flex flex-col rounded-xl border p-2.5 transition-all duration-150 cursor-pointer ${
            selectedId.includes("apps") || selectedId === "comp-business-apps"
              ? "bg-emerald-50/70 border-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-700 shadow-xs ring-2 ring-emerald-400/30"
              : "bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/50 hover:border-emerald-300"
          }`}
        >
          {/* Box Header */}
          <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-emerald-200/60 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <h3 className="text-xs font-black uppercase tracking-wider">
              Business Applications
            </h3>
          </div>

          {/* Items */}
          <div className="flex flex-col gap-1.5">
            {[
              { id: "app-dashboard", label: "Workforce Dashboard", icon: LayoutDashboard },
              { id: "app-attendance", label: "Attendance & Absenteeism", icon: CalendarCheck },
              { id: "app-headcount", label: "Headcount & Demographics", icon: Users },
              { id: "app-attrition", label: "Attrition & Tenure", icon: LineChart },
              { id: "app-shift", label: "Shift Planning & Optimization", icon: Clock },
              { id: "app-chat", label: "AI Assistance (Chat)", icon: MessageSquareText },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectComponent("comp-business-apps");
                  }}
                  className="p-1.5 rounded-lg border text-left flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 border-emerald-100 dark:border-emerald-900/40 text-slate-700 dark:text-slate-300 hover:bg-white transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-[11px] font-semibold leading-tight truncate">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================================
          STAGE 6: BOTTOM CLOSED-LOOP FEEDBACK BAR (Curved connector loop)
          ========================================================================= */}
      <div className="w-full pt-1 flex items-center justify-center">
        <div className="w-full max-w-2xl py-1.5 px-4 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-200 shadow-2xs">
          <RotateCw className="w-3.5 h-3.5 text-brand-purple animate-spin-slow" />
          <span>Feedback Loop (User Feedback & Continuous Improvement)</span>
        </div>
      </div>
    </div>
  );
}
