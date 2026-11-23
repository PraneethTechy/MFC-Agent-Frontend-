import React from "react";
import {
  CloudUpload,
  ShieldCheck,
  Database,
  Cpu,
  Brain,
  Sparkles,
  LayoutDashboard,
  ArrowRight,
  Layers,
  FileCheck,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function RcaDataFlowView({ onSelectComponent }) {
  const steps = [
    {
      num: "01",
      name: "File Upload & Streaming",
      layer: "Ingestion Gateway",
      icon: CloudUpload,
      color: "blue",
      details: [
        "Shopfloor MES & ERP CSV/XLSX files received via multipart streaming.",
        "SHA-256 cryptographic hash calculated on arrival to ensure strict idempotency.",
        "40+ synonym header auto-mapping matches vendor column variants without manual reformatting.",
      ],
      tables: "ingestion_file_registry (SHA-256 tracked)",
      nodeId: "ingest-file-upload",
    },
    {
      num: "02",
      name: "Staging Isolation & 14-Pass Validation",
      layer: "Data Ingestion & Quality",
      icon: ShieldCheck,
      color: "emerald",
      details: [
        "Raw batches stream directly into isolated stg_* tables preventing database pollution.",
        "14 deterministic integrity rules enforce non-negative unit costs, valid calendar bounds, and zero orphans.",
        "Future-dated records (> Nov 19, 2026) segregated as staged/planned to prevent historical baseline distortion.",
      ],
      tables: "stg_manufacturing_cost, stg_hourly_production",
      nodeId: "ingest-multi-validator",
    },
    {
      num: "03",
      name: "Strategy C Atomic ACID Promotion",
      layer: "Neon PostgreSQL 16",
      icon: Database,
      color: "blue",
      details: [
        "Atomic transaction commits staged rows into operational target tables.",
        "Strategy C pre-update fact archival copies existing records into fact_record_history for full audit compliance.",
        "Star schema indexes refreshed across dim_plant, dim_lines, dim_products, and materials.",
      ],
      tables: "line_cost_batches (9.5k), hourly_production_logs (13.3k)",
      nodeId: "platform-postgres-facts",
    },
    {
      num: "04",
      name: "Deterministic Python & SQL Math",
      layer: "Deterministic Engine",
      icon: Cpu,
      color: "purple",
      details: [
        "Pure algorithms execute variance bridge calculations, First-Pass Yield (FPY), and defect Pareto.",
        "Unit cost formula strictly enforced: Total Direct Spend / Good Production Output Units.",
        "9 LangChain tools invoke deterministic calculation handlers without LLM arithmetic estimation.",
      ],
      tables: "v_cost_facts, v_variance_bridge",
      nodeId: "engine-deterministic-variance",
    },
    {
      num: "05",
      name: "AI Evidence Evaluation & Governance",
      layer: "LangChain + DomoTextLLM",
      icon: Sparkles,
      color: "purple",
      details: [
        "DomoTextLLM synthesizes verified mathematical outputs across 8 manufacturing domain perspectives.",
        "Every claim strictly governed into PROVEN, OBSERVED_CORRELATION, HYPOTHESIS, or UNAVAILABLE.",
        "Formulates prioritized corrective action playbooks with ₹18.31 Cr estimated actionable savings.",
      ],
      tables: "recommendations, investigation_reports",
      nodeId: "engine-recommendation-gen",
    },
    {
      num: "06",
      name: "Executive Presentation & Feedback",
      layer: "Business Applications",
      icon: LayoutDashboard,
      color: "emerald",
      details: [
        "Dynamic waterfall charts, SKU comparison tables, and defect Pareto delivered to React UI.",
        "Audit report PDF generation with full cryptographic lineage and citation proof chains.",
        "Remediation outcomes track actual savings to recalibrate future standard cost tolerances.",
      ],
      tables: "Durable PDF reports & UI dashboard",
      nodeId: "app-investigation-result",
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4 font-sans animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-brand-navy dark:text-slate-100 leading-tight">
              Manufacturing Cost RCA – End-to-End Data Lifecycle
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Lineage tracking from shopfloor MES & ERP files to verified executive root-cause insights
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 text-[11px]">Database Volume:</span>
          <span className="font-bold text-blue-700 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
            127k+ Active Records Grounded
          </span>
        </div>
      </div>

      {/* Vertical Data Flow Chain */}
      <div className="flex flex-col gap-3">
        {steps.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div
              key={st.num}
              onClick={() => onSelectComponent && onSelectComponent(st.nodeId)}
              className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 shadow-2xs hover:border-brand-purple transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-brand-purple flex items-center justify-center font-black text-sm shrink-0 border border-purple-200/60 dark:border-purple-800/60">
                  {st.num}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-brand-purple">
                      {st.layer}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {st.name}
                    </h3>
                  </div>
                  <ul className="mt-1 space-y-0.5 text-xs text-slate-600 dark:text-slate-300">
                    {st.details.map((d, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-1.5 leading-tight">
                        <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-mono text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded border border-purple-200/60 dark:border-purple-800/60">
                  {st.tables}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <span>Inspect Component</span>
                  <ArrowRight className="w-3 h-3 text-brand-purple" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
