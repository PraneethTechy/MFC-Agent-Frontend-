import React from "react";
import {
  Zap,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

export default function AIRCAEngineExplainer({ activeSelection }) {
  const title = activeSelection?.title || "AI Investigations & Root Cause Analysis";
  const badgeText = activeSelection?.badgeText || "STAGE 4 • RCA INTELLIGENCE ENGINE";
  const badgeColor =
    activeSelection?.badgeColor || "bg-blue-50 text-blue-700 border-blue-200";

  const whatItIs =
    activeSelection?.whatItIs ||
    activeSelection?.description ||
    "Investigates manufacturing cost movement using deterministic variance mathematics and AI explanations with business-ready recommendations.";

  const howItWorks = activeSelection?.howItWorks ||
    activeSelection?.whatHappensHere || [
      "Analyze cost change (total expenditure or cost per good unit) for the selected period vs comparison period.",
      "Decompose the variance by cost category (material, labour, machine, energy, scrap & rework).",
      "Investigate key drivers across product, plant, line, supplier and component.",
      "Quantify the financial impact and contribution of each driver.",
      "Provide confirmed causes, correlations and recommended corrective actions.",
    ];

  const informationUsed =
    activeSelection?.informationUsed ||
    activeSelection?.dataTables ||
    "line_cost_batches, hourly_production_logs, serialized_quality_inspections, bom_components, dim_products, dim_plants.";

  const managementGets =
    activeSelection?.managementGets ||
    "Itemized cost transparency, verified mathematical variance decomposition, and actionable plant operational playbooks.";

  const businessValue =
    activeSelection?.businessValue ||
    "Empowers plant leaders to identify why costs moved in minutes rather than spending weeks compiling manual variance spreadsheets.";

  return (
    <div className="w-full h-full bg-white rounded-[16px] border border-[#E3E6F3] p-3.5 xl:p-4 shadow-[0_2px_8px_rgba(40,40,100,0.06)] flex flex-col justify-between overflow-hidden">
      {/* 01. Top Header & What It Is */}
      <div className="pb-2 border-b border-[#F0F2FA] shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-[8px] bg-red-100 text-[#C8190F] flex items-center justify-center shrink-0 shadow-2xs">
            <Zap className="w-4 h-4 stroke-[2.4]" />
          </div>
          <h2 className="text-[14px] xl:text-[15px] font-bold text-[#1E1B3A] tracking-tight truncate">
            {title}
          </h2>
        </div>

        {/* 1. What it is */}
        <p className="text-[11px] xl:text-[11.5px] text-[#334155] mt-1.5 leading-relaxed">
          <span className="font-extrabold text-[#0F172A]">What it is: </span>
          {whatItIs}
        </p>
      </div>

      {/* 02. Middle: Content Area with Ample Height and Breathing Room */}
      <div
        className="flex-1 min-h-0 overflow-y-auto pr-1.5 pt-2 flex flex-col justify-between gap-2"
        style={{ scrollbarWidth: "thin" }}
      >
        {/* 2. Information Used */}
        <div className="bg-[#FAFBFD] rounded-[8px] border border-[#E2E8F0] px-3 py-1.5 text-[10.5px] xl:text-[11px] shrink-0 shadow-2xs">
          <span className="font-extrabold text-[#0F172A]">Information used: </span>
          <span className="text-[#475569] font-medium">{informationUsed}</span>
        </div>

        {/* 3. How it works (Numbered Steps) */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <div className="text-[11px] xl:text-[11.5px] font-bold text-[#0F172A]">
            How it works:
          </div>

          <div className="flex flex-col gap-1.5">
            {howItWorks.map((stepText, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-[10.5px] xl:text-[11px] text-[#334155] leading-snug"
              >
                <span className="w-4 h-4 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-[#4F46E5] text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  {idx + 1}
                </span>
                <span className="flex-1 font-medium">{stepText}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. What management gets & 5. Business value */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1.5 border-t border-[#F1F5F9] shrink-0 text-[10.5px] xl:text-[11px]">
          <div className="bg-[#F8FAFC] rounded-[8px] p-2.5 border border-[#E2E8F0]">
            <div className="font-bold text-[#0F172A] mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.4]" />
              <span>What management gets:</span>
            </div>
            <p className="text-[#475569] leading-relaxed font-medium">
              {managementGets}
            </p>
          </div>

          <div className="bg-[#F8FAFC] rounded-[8px] p-2.5 border border-[#E2E8F0]">
            <div className="font-bold text-[#0F172A] mb-1 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#2563EB] stroke-[2.4]" />
              <span>Business value:</span>
            </div>
            <p className="text-[#475569] leading-relaxed font-medium">
              {businessValue}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
