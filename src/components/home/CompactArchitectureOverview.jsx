import React from "react";
import {
  Layers,
  Sparkles,
  ArrowRight,
  ArrowDown,
  Database,
  Cog,
  Monitor,
  Target,
  FileSpreadsheet,
  FileText,
  Check,
  Factory,
  BarChart2,
  Settings,
  Award,
  Code,
  ShieldCheck,
  ClipboardCheck,
  Box,
  Share2,
  Search,
  LineChart,
  TrendingUp,
  ClipboardList,
} from "lucide-react";

export default function CompactArchitectureOverview({
  selectedId,
  onSelect,
  onNavigate,
}) {
  return (
    <div className="w-full h-full bg-white rounded-[16px] border border-[#E3E6F3] p-3 xl:p-3.5 shadow-[0_2px_8px_rgba(40,40,100,0.06)] flex flex-col justify-between overflow-hidden">
      {/* 00. Panel Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#F0F2FA] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 xl:w-8.5 xl:h-8.5 rounded-[9px] bg-[#5B2BD6] text-white flex items-center justify-center shadow-xs shrink-0">
            <Layers className="w-4.5 h-4.5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-[15px] xl:text-[16.5px] font-bold text-[#1E1B3A] tracking-tight leading-tight">
              Manufacturing Intelligence Architecture
            </h2>
            <p className="text-[10.5px] xl:text-[11px] font-medium text-[#6B7280] leading-tight mt-0.5">
              End-to-End Data Flow for Manufacturing Analytics & Business Outcomes
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onNavigate && onNavigate("architecture")}
          className="px-3 py-1 rounded-full border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-[10.5px] xl:text-[11px] font-semibold text-[#1E1B3A] hover:text-[#5B2BD6] flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer shrink-0"
        >
          <Sparkles className="w-3 h-3 text-[#5B2BD6]" />
          <span>
            Click any layer to <span className="font-bold text-[#5B2BD6]">view details</span>
          </span>
          <ArrowRight className="w-3 h-3 text-[#5B2BD6] stroke-[2.2]" />
        </button>
      </div>

      {/* 01. 5 Columns Grid */}
      <div className="grid grid-cols-5 gap-2.5 xl:gap-3 flex-1 min-h-0 pt-1.5">
        {/* ================= COL 1: DATA INPUT ================= */}
        <div
          className={`w-full min-w-0 h-full flex flex-col rounded-[12px] border transition-all overflow-hidden ${
            selectedId === "stage-1"
              ? "border-[#DC2626] ring-2 ring-[#DC2626]/40 shadow-md"
              : "border-red-200 shadow-2xs hover:shadow-xs"
          } bg-[#FFFBFB]`}
        >
          {/* Header (Selectable Stage 1) */}
          <div
            onClick={() => onSelect && onSelect("stage-1")}
            className="bg-[#DC2626] hover:bg-red-700 text-white h-[40px] xl:h-[42px] px-2 flex items-center justify-between shrink-0 cursor-pointer transition-colors"
            title="Click to view Stage 1: Data Input Layer details"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-4.5 h-4.5 rounded-full bg-white text-[#DC2626] font-extrabold text-[9px] flex items-center justify-center shrink-0 shadow-2xs">
                01
              </span>
              <div className="text-[10.5px] xl:text-[11.5px] font-bold tracking-tight leading-[1.15]">
                <div>Data</div>
                <div>Input</div>
              </div>
            </div>
            <Database className="w-4 h-4 text-white/90 shrink-0" />
          </div>

          {/* Body */}
          <div className="p-1.5 flex-1 flex flex-col gap-1.5 min-h-0">
            {/* Top Upload Badges Card (Selectable) */}
            <div
              onClick={() => onSelect && onSelect("s1-upload")}
              className={`bg-white rounded-[9px] py-2 px-2 border flex flex-col items-center justify-center text-center shadow-2xs shrink-0 cursor-pointer transition-all ${
                selectedId === "s1-upload"
                  ? "border-[#DC2626] ring-2 ring-[#DC2626]/40 bg-red-50/50 shadow-xs"
                  : "border-red-100 hover:border-red-300"
              }`}
              title="Click to view Manufacturing Upload details"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-[6px] border border-emerald-300 text-[9.5px] xl:text-[10px] font-extrabold shadow-2xs">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 stroke-[2.2]" />
                  <span>XLS</span>
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 bg-sky-50 text-sky-700 rounded-[6px] border border-sky-300 text-[9.5px] xl:text-[10px] font-extrabold shadow-2xs">
                  <FileText className="w-3.5 h-3.5 text-sky-600 stroke-[2.2]" />
                  <span>CSV</span>
                </span>
              </div>
              <span className="text-[10.5px] xl:text-[11px] font-bold text-[#1E1B3A] leading-tight">
                Manufacturing Upload
              </span>
            </div>

            {/* Checklist with snug vertical gap (All Selectable) */}
            <div className="flex flex-col gap-1.5 flex-1 justify-center min-h-0">
              {[
                { name: "Production Output", key: "s1-prod", icon: Factory },
                { name: "Material Usage", key: "s1-mat", icon: BarChart2 },
                { name: "Direct Costing", key: "s1-cost", icon: Settings },
                { name: "Quality & QA Logs", key: "s1-qa", icon: Award },
                { name: "BOM Components", key: "s1-bom", icon: Code },
              ].map((item) => {
                const ItemIcon = item.icon;
                const isSelected = selectedId === item.key;
                return (
                  <div
                    key={item.key}
                    onClick={() => onSelect && onSelect(item.key)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-[8px] border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-red-100 border-[#DC2626] ring-2 ring-[#DC2626]/40 font-bold text-red-950 shadow-2xs"
                        : "bg-[#FFF1F2]/80 hover:bg-[#FFE4E6] border-red-100/80"
                    }`}
                    title={`Click to view ${item.name} details`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-1">
                      <div className="w-5.5 h-5.5 rounded-[6px] bg-white text-[#DC2626] border border-red-200 flex items-center justify-center shrink-0 shadow-2xs">
                        <ItemIcon className="w-3 h-3 text-[#DC2626]" />
                      </div>
                      <span className="text-[10px] xl:text-[10.5px] font-semibold text-[#1E1B3A] leading-tight min-w-0">
                        {item.name}
                      </span>
                    </div>
                    <Check className="w-3.5 h-3.5 text-[#DC2626] shrink-0 stroke-[2.5]" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= COL 2: PROCESSING & VALIDATION ================= */}
        <div
          className={`w-full min-w-0 h-full flex flex-col rounded-[12px] border transition-all overflow-hidden ${
            selectedId === "stage-2"
              ? "border-[#1D4ED8] ring-2 ring-[#1D4ED8]/40 shadow-md"
              : "border-blue-200 shadow-2xs hover:shadow-xs"
          } bg-[#F8FAFF]`}
        >
          {/* Header (Selectable Stage 2) */}
          <div
            onClick={() => onSelect && onSelect("stage-2")}
            className="bg-[#1D4ED8] hover:bg-blue-700 text-white h-[40px] xl:h-[42px] px-2 flex items-center justify-between shrink-0 cursor-pointer transition-colors"
            title="Click to view Stage 2: Processing & Validation details"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-4.5 h-4.5 rounded-full bg-white text-[#1D4ED8] font-extrabold text-[9px] flex items-center justify-center shrink-0 shadow-2xs">
                02
              </span>
              <div className="text-[10.5px] xl:text-[11.5px] font-bold tracking-tight leading-[1.15]">
                <div>Processing &</div>
                <div>Validation</div>
              </div>
            </div>
            <Cog className="w-4 h-4 text-white/90 shrink-0" />
          </div>

          {/* Body */}
          <div className="p-1.5 flex-1 flex flex-col justify-between gap-1 min-h-0">
            {/* Card 1 */}
            <div
              onClick={() => onSelect && onSelect("s2-load")}
              className={`flex-1 flex items-center gap-2.5 bg-white rounded-[9px] px-2.5 py-1.5 border shadow-2xs transition-all cursor-pointer ${
                selectedId === "s2-load"
                  ? "border-[#1D4ED8] ring-2 ring-[#1D4ED8]/40 bg-blue-50/70"
                  : "border-blue-100 hover:border-blue-300"
              }`}
              title="Click to view Load Staged Data details"
            >
              <div className="w-8 h-8 rounded-[8px] bg-blue-100 text-[#1D4ED8] flex items-center justify-center shrink-0 border border-blue-200 shadow-xs">
                <Database className="w-4.5 h-4.5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] xl:text-[11.5px] font-bold text-[#1E1B3A] leading-tight">
                  Load Staged Data
                </span>
                <span className="text-[8.5px] text-[#6B7280] font-medium leading-tight mt-0.5">
                  Ingest & structure
                </span>
              </div>
            </div>

            <div className="shrink-0 flex justify-center -my-0.5">
              <ArrowDown className="w-2.5 h-2.5 text-[#1D4ED8] stroke-[2.5]" />
            </div>

            {/* Card 2 */}
            <div
              onClick={() => onSelect && onSelect("s2-val")}
              className={`flex-1 flex items-center gap-2.5 bg-white rounded-[9px] px-2.5 py-1.5 border shadow-2xs transition-all cursor-pointer ${
                selectedId === "s2-val"
                  ? "border-[#1D4ED8] ring-2 ring-[#1D4ED8]/40 bg-blue-50/70"
                  : "border-blue-100 hover:border-blue-300"
              }`}
              title="Click to view Quality Validation details"
            >
              <div className="w-8 h-8 rounded-[8px] bg-blue-100 text-[#1D4ED8] flex items-center justify-center shrink-0 border border-blue-200 shadow-xs">
                <ShieldCheck className="w-4.5 h-4.5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] xl:text-[11.5px] font-bold text-[#1E1B3A] leading-tight">
                  Quality Validation
                </span>
                <span className="text-[8.5px] text-[#6B7280] font-medium leading-tight mt-0.5">
                  Cleanse & verify
                </span>
              </div>
            </div>

            <div className="shrink-0 flex justify-center -my-0.5">
              <ArrowDown className="w-2.5 h-2.5 text-[#1D4ED8] stroke-[2.5]" />
            </div>

            {/* Card 3 */}
            <div
              onClick={() => onSelect && onSelect("s2-app")}
              className={`flex-1 flex items-center gap-2.5 bg-white rounded-[9px] px-2.5 py-1.5 border shadow-2xs transition-all cursor-pointer ${
                selectedId === "s2-app"
                  ? "border-emerald-600 ring-2 ring-emerald-500/40 bg-emerald-50/70"
                  : "border-emerald-100 hover:border-emerald-300"
              }`}
              title="Click to view Approve & Commit details"
            >
              <div className="w-8 h-8 rounded-[8px] bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200 shadow-xs">
                <ClipboardCheck className="w-4.5 h-4.5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] xl:text-[11.5px] font-bold text-[#1E1B3A] leading-tight">
                  Approve & Commit
                </span>
                <span className="text-[8.5px] text-[#6B7280] font-medium leading-tight mt-0.5">
                  Finalize for use
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= COL 3: MANUFACTURING DATA LAYER ================= */}
        <div
          className={`w-full min-w-0 h-full flex flex-col rounded-[12px] border transition-all overflow-hidden ${
            selectedId === "stage-3"
              ? "border-[#6D28D9] ring-2 ring-[#6D28D9]/40 shadow-md"
              : "border-purple-200 shadow-2xs hover:shadow-xs"
          } bg-[#FAF5FF]`}
        >
          {/* Header (Selectable Stage 3) */}
          <div
            onClick={() => onSelect && onSelect("stage-3")}
            className="bg-[#6D28D9] hover:bg-purple-800 text-white h-[40px] xl:h-[42px] px-2 flex items-center justify-between shrink-0 cursor-pointer transition-colors"
            title="Click to view Stage 3: Manufacturing Data Layer details"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-4.5 h-4.5 rounded-full bg-white text-[#6D28D9] font-extrabold text-[9px] flex items-center justify-center shrink-0 shadow-2xs">
                03
              </span>
              <div className="text-[10.5px] xl:text-[11.5px] font-bold tracking-tight leading-[1.15]">
                <div>Manufacturing</div>
                <div>Data Layer</div>
              </div>
            </div>
            <Database className="w-4 h-4 text-white/90 shrink-0" />
          </div>

          {/* Body */}
          <div className="p-1.5 flex-1 flex flex-col justify-between gap-1.5 min-h-0">
            {/* Card 1: Staging Store */}
            <div
              onClick={() => onSelect && onSelect("s3-upload-store")}
              className={`flex-1 min-h-[68px] max-h-[82px] flex items-center gap-2.5 bg-[#FAF5FF] rounded-[10px] px-3 py-2 border shadow-2xs transition-all cursor-pointer ${
                selectedId === "s3-upload-store"
                  ? "border-[#6D28D9] ring-2 ring-[#6D28D9]/40 bg-purple-100/70"
                  : "border-purple-200 hover:border-purple-300"
              }`}
              title="Click to view Staging Store details"
            >
              <div className="w-9 h-9 rounded-[9px] bg-purple-100 text-[#6D28D9] flex items-center justify-center shrink-0 border border-purple-200 shadow-xs">
                <Database className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11.5px] xl:text-[12px] font-bold text-[#1E1B3A] leading-tight">
                  Staging Store
                </span>
                <span className="inline-flex self-start mt-0.5 text-[8.5px] font-bold text-[#92400E] bg-[#FEF3C7] px-2 py-0.5 rounded-full border border-amber-200 leading-none">
                  (Raw Data)
                </span>
              </div>
            </div>

            <div className="shrink-0 flex justify-center -my-0.5">
              <ArrowDown className="w-2.5 h-2.5 text-[#6D28D9] stroke-[2.5]" />
            </div>

            {/* Card 2: Global Store */}
            <div
              onClick={() => onSelect && onSelect("s3-global-store")}
              className={`flex-1 min-h-[68px] max-h-[82px] flex items-center gap-2.5 bg-[#F0FDF4] rounded-[10px] px-3 py-2 border shadow-2xs transition-all cursor-pointer ${
                selectedId === "s3-global-store"
                  ? "border-emerald-600 ring-2 ring-emerald-500/40 bg-emerald-100/70"
                  : "border-emerald-200 hover:border-emerald-300"
              }`}
              title="Click to view Global Store details"
            >
              <div className="w-9 h-9 rounded-[9px] bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200 shadow-xs">
                <Database className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11.5px] xl:text-[12px] font-bold text-[#1E1B3A] leading-tight">
                  Global Store
                </span>
                <span className="inline-flex self-start mt-0.5 text-[8.5px] font-bold text-[#065F46] bg-[#D1FAE5] px-2 py-0.5 rounded-full border border-emerald-200 leading-none">
                  (Curated Data)
                </span>
              </div>
            </div>

            {/* Bottom 3 Cards Row (Selectable) */}
            <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-dashed border-purple-200 shrink-0">
              <div
                onClick={() => onSelect && onSelect("s3-model")}
                className={`h-[56px] xl:h-[62px] bg-white rounded-[9px] p-1.5 border flex flex-col items-center justify-center transition-all shadow-2xs cursor-pointer ${
                  selectedId === "s3-model"
                    ? "border-[#6D28D9] ring-2 ring-[#6D28D9]/40 bg-purple-50"
                    : "border-purple-200 hover:border-purple-400 hover:bg-purple-50/50"
                }`}
                title="Click to view Integrated Manufacturing Model details"
              >
                <div className="w-7 h-7 xl:w-7.5 xl:h-7.5 rounded-[8px] bg-purple-100 text-[#6D28D9] flex items-center justify-center shrink-0 mb-1 border border-purple-200 shadow-2xs">
                  <Box className="w-4.5 h-4.5 text-[#6D28D9] stroke-[2.3]" />
                </div>
                <span className="text-[9px] xl:text-[9.5px] font-bold text-[#1E1B3A] leading-none">
                  Models
                </span>
              </div>
              <div
                onClick={() => onSelect && onSelect("s3-kpi")}
                className={`h-[56px] xl:h-[62px] bg-white rounded-[9px] p-1.5 border flex flex-col items-center justify-center transition-all shadow-2xs cursor-pointer ${
                  selectedId === "s3-kpi"
                    ? "border-sky-600 ring-2 ring-sky-500/40 bg-sky-50"
                    : "border-purple-200 hover:border-purple-400 hover:bg-purple-50/50"
                }`}
                title="Click to view Standardized KPIs & ETL details"
              >
                <div className="w-7 h-7 xl:w-7.5 xl:h-7.5 rounded-[8px] bg-sky-100 text-[#0284C7] flex items-center justify-center shrink-0 mb-1 border border-sky-200 shadow-2xs">
                  <Share2 className="w-4.5 h-4.5 text-[#0284C7] stroke-[2.3]" />
                </div>
                <span className="text-[9px] xl:text-[9.5px] font-bold text-[#1E1B3A] leading-none">
                  ETL
                </span>
              </div>
              <div
                onClick={() => onSelect && onSelect("s3-curated")}
                className={`h-[56px] xl:h-[62px] bg-white rounded-[9px] p-1.5 border flex flex-col items-center justify-center transition-all shadow-2xs cursor-pointer ${
                  selectedId === "s3-curated"
                    ? "border-indigo-600 ring-2 ring-indigo-500/40 bg-indigo-50"
                    : "border-purple-200 hover:border-purple-400 hover:bg-purple-50/50"
                }`}
                title="Click to view Curated Schemas details"
              >
                <div className="w-7 h-7 xl:w-7.5 xl:h-7.5 rounded-[8px] bg-indigo-100 text-[#4338CA] flex items-center justify-center shrink-0 mb-1 border border-indigo-200 shadow-2xs">
                  <Layers className="w-4.5 h-4.5 text-[#4338CA] stroke-[2.3]" />
                </div>
                <span className="text-[9px] xl:text-[9.5px] font-bold text-[#1E1B3A] leading-none">
                  Schemas
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= COL 4: INSIGHTS & ANALYTICS ================= */}
        <div
          className={`w-full min-w-0 h-full flex flex-col rounded-[12px] border transition-all overflow-hidden ${
            selectedId === "stage-4"
              ? "border-[#1D4ED8] ring-2 ring-[#1D4ED8]/40 shadow-md"
              : "border-blue-200 shadow-2xs hover:shadow-xs"
          } bg-[#F8FAFF]`}
        >
          {/* Header (Selectable Stage 4) */}
          <div
            onClick={() => onSelect && onSelect("stage-4")}
            className="bg-[#1D4ED8] hover:bg-blue-700 text-white h-[40px] xl:h-[42px] px-2 flex items-center justify-between shrink-0 cursor-pointer transition-colors"
            title="Click to view Stage 4: Insights & Analytics details"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-4.5 h-4.5 rounded-full bg-white text-[#1D4ED8] font-extrabold text-[9px] flex items-center justify-center shrink-0 shadow-2xs">
                04
              </span>
              <div className="text-[10.5px] xl:text-[11.5px] font-bold tracking-tight leading-[1.15]">
                <div>Insights &</div>
                <div>Analytics</div>
              </div>
            </div>
            <Monitor className="w-4 h-4 text-white/90 shrink-0" />
          </div>

          {/* Body */}
          <div className="p-1.5 flex-1 flex flex-col justify-between gap-1 min-h-0">
            {/* Card 1 */}
            <div
              onClick={() => onSelect && onSelect("s4-dash")}
              className={`flex-1 flex items-center gap-2.5 bg-white rounded-[9px] px-2.5 py-1.5 border shadow-2xs transition-all cursor-pointer ${
                selectedId === "s4-dash"
                  ? "border-[#1D4ED8] ring-2 ring-[#1D4ED8]/40 bg-blue-50/70"
                  : "border-blue-100 hover:border-blue-300"
              }`}
              title="Click to view Dashboards & Reports details"
            >
              <div className="w-8 h-8 rounded-[8px] bg-sky-100 text-[#0284C7] flex items-center justify-center shrink-0 border border-sky-200 shadow-xs">
                <BarChart2 className="w-4.5 h-4.5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="text-[11px] xl:text-[11.5px] font-bold text-[#1E1B3A] leading-tight">
                  Dashboards & Reports
                </div>
                <span className="text-[8.5px] text-[#6B7280] font-medium leading-tight mt-0.5">
                  Real-time metrics
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div
              onClick={() => onSelect && onSelect("s4-rca")}
              className={`flex-1 flex items-center gap-2.5 bg-white rounded-[9px] px-2.5 py-1.5 border shadow-2xs transition-all cursor-pointer ${
                selectedId === "s4-rca"
                  ? "border-[#1D4ED8] ring-2 ring-[#1D4ED8]/40 bg-blue-50/70"
                  : "border-blue-100 hover:border-blue-300"
              }`}
              title="Click to view Root Cause Analysis details"
            >
              <div className="w-8 h-8 rounded-[8px] bg-blue-100 text-[#1D4ED8] flex items-center justify-center shrink-0 border border-blue-200 shadow-xs">
                <Search className="w-4.5 h-4.5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="text-[11px] xl:text-[11.5px] font-bold text-[#1E1B3A] leading-tight">
                  Root Cause Analysis
                </div>
                <span className="text-[8.5px] text-[#6B7280] font-medium leading-tight mt-0.5">
                  Identify issues
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div
              onClick={() => onSelect && onSelect("s4-analytics")}
              className={`flex-1 flex items-center gap-2.5 bg-white rounded-[9px] px-2.5 py-1.5 border shadow-2xs transition-all cursor-pointer ${
                selectedId === "s4-analytics"
                  ? "border-[#1D4ED8] ring-2 ring-[#1D4ED8]/40 bg-blue-50/70"
                  : "border-blue-100 hover:border-blue-300"
              }`}
              title="Click to view Self-Service Analytics details"
            >
              <div className="w-8 h-8 rounded-[8px] bg-indigo-100 text-[#4338CA] flex items-center justify-center shrink-0 border border-indigo-200 shadow-xs">
                <LineChart className="w-4.5 h-4.5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="text-[11px] xl:text-[11.5px] font-bold text-[#1E1B3A] leading-tight">
                  Self-Service Analytics
                </div>
                <span className="text-[8.5px] text-[#6B7280] font-medium leading-tight mt-0.5">
                  Explore & share
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= COL 5: BUSINESS OUTCOMES ================= */}
        <div
          className={`w-full min-w-0 h-full flex flex-col rounded-[12px] border transition-all overflow-hidden ${
            selectedId === "stage-5"
              ? "border-[#EA580C] ring-2 ring-[#EA580C]/40 shadow-md"
              : "border-orange-200 shadow-2xs hover:shadow-xs"
          } bg-[#FFFBF5]`}
        >
          {/* Header (Selectable Stage 5) */}
          <div
            onClick={() => onSelect && onSelect("stage-5")}
            className="bg-[#EA580C] hover:bg-orange-700 text-white h-[40px] xl:h-[42px] px-2 flex items-center justify-between shrink-0 cursor-pointer transition-colors"
            title="Click to view Stage 5: Business Outcomes details"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-4.5 h-4.5 rounded-full bg-white text-[#EA580C] font-extrabold text-[9px] flex items-center justify-center shrink-0 shadow-2xs">
                05
              </span>
              <div className="text-[10.5px] xl:text-[11.5px] font-bold tracking-tight leading-[1.15]">
                <div>Business</div>
                <div>Outcomes</div>
              </div>
            </div>
            <Target className="w-4 h-4 text-white/90 shrink-0" />
          </div>

          {/* Body */}
          <div className="p-1.5 flex-1 flex flex-col justify-between gap-1 min-h-0">
            {/* Card 1 */}
            <div
              onClick={() => onSelect && onSelect("s5-decisions")}
              className={`flex-1 flex items-center gap-2.5 bg-[#FFF9E6] rounded-[9px] px-2.5 py-1.5 border shadow-2xs transition-all cursor-pointer ${
                selectedId === "s5-decisions"
                  ? "ring-2 ring-amber-400 border-amber-400 bg-amber-100/60"
                  : "border-[#FDE68A] hover:border-amber-400"
              }`}
              title="Click to view Data-Driven Decisions details"
            >
              <div className="w-8 h-8 rounded-[8px] bg-amber-100 text-[#D97706] flex items-center justify-center shrink-0 border border-amber-300 shadow-xs">
                <TrendingUp className="w-4.5 h-4.5 stroke-[2.4]" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="text-[11px] xl:text-[11.5px] font-bold text-[#1E1B3A] leading-tight">
                  Data-Driven Decisions
                </div>
                <span className="text-[8.5px] text-[#6B7280] font-medium leading-tight mt-0.5">
                  Faster actions
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div
              onClick={() => onSelect && onSelect("s5-playbooks")}
              className={`flex-1 flex items-center gap-2.5 bg-[#FFF9E6] rounded-[9px] px-2.5 py-1.5 border shadow-2xs transition-all cursor-pointer ${
                selectedId === "s5-playbooks" || selectedId === "s5-alerts"
                  ? "ring-2 ring-orange-400 border-orange-400 bg-orange-100/60"
                  : "border-[#FDE68A] hover:border-orange-400"
              }`}
              title="Click to view Action Playbooks details"
            >
              <div className="w-8 h-8 rounded-[8px] bg-orange-100 text-[#EA580C] flex items-center justify-center shrink-0 border border-orange-300 shadow-xs">
                <ClipboardList className="w-4.5 h-4.5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="text-[11px] xl:text-[11.5px] font-bold text-[#1E1B3A] leading-tight">
                  Action Playbooks
                </div>
                <span className="text-[8.5px] text-[#6B7280] font-medium leading-tight mt-0.5">
                  Targeted steps
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div
              onClick={() => onSelect && onSelect("s5-actions")}
              className={`flex-1 flex items-center gap-2.5 bg-[#F0FDFA] rounded-[9px] px-2.5 py-1.5 border shadow-2xs transition-all cursor-pointer ${
                selectedId === "s5-actions"
                  ? "ring-2 ring-teal-400 border-teal-400 bg-teal-100/60"
                  : "border-[#99F6E4] hover:border-teal-400"
              }`}
              title="Click to view Process Optimization details"
            >
              <div className="w-8 h-8 rounded-[8px] bg-teal-100 text-[#0D9488] flex items-center justify-center shrink-0 border border-teal-300 shadow-xs">
                <Settings className="w-4.5 h-4.5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="text-[11px] xl:text-[11.5px] font-bold text-[#1E1B3A] leading-tight">
                  Process Optimization
                </div>
                <span className="text-[8.5px] text-[#6B7280] font-medium leading-tight mt-0.5">
                  Improve output
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
