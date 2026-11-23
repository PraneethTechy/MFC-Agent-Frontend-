import React from "react";
import {
  Code2,
  Cpu,
  Database,
  Brain,
  ShieldCheck,
  Server,
  Zap,
  Layers,
  Sparkles,
} from "lucide-react";

export default function RcaTechStackView() {
  const stackLayers = [
    {
      title: "Frontend Application Layer",
      icon: Code2,
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/60",
      technologies: [
        { name: "React 18", role: "Component hierarchy, virtual DOM reconciliation, stateful drawers & modaled dashboards." },
        { name: "Vite 5.4", role: "Lightning-fast HMR bundler with Rollup-optimized production chunks." },
        { name: "Tailwind CSS", role: "Utility-first responsive design system adhering strictly to the enterprise purple-and-white theme." },
        { name: "Lucide React", role: "Consistent, accessible SVG icon library providing crisp operational telemetry visuals." },
        { name: "React Router v6", role: "Declarative SPA routing across Overview, Upload, Investigations, and Architecture." },
      ],
    },
    {
      title: "Backend & API Gateway Layer",
      icon: Cpu,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/60",
      technologies: [
        { name: "Python 3.11+", role: "High-performance async runtime with typing enhancements and sub-interpreter parallelism." },
        { name: "FastAPI", role: "Modern, high-throughput asynchronous REST API framework powered by Starlette." },
        { name: "Pydantic v2", role: "Strict JSON schema validation, input sanitization, and response serialization." },
        { name: "SQLAlchemy 2.x", role: "Modern mapped-column ORM with Core SQL expression language for complex analytic joins." },
        { name: "Psycopg 3", role: "High-performance asynchronous PostgreSQL adapter with native server-side cursors." },
      ],
    },
    {
      title: "Data Platform & Governance Layer",
      icon: Database,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60",
      technologies: [
        { name: "Neon PostgreSQL 16", role: "Serverless, branching cloud database providing atomic ACID transaction isolation." },
        { name: "Staging Buffer (stg_*)", role: "Isolated pre-commit quarantine tables protecting operational facts from unvalidated inputs." },
        { name: "Strategy C Archival", role: "Transactional pre-update fact archival into fact_record_history for auditability." },
        { name: "Star Schema Views", role: "Pre-indexed views (v_cost_facts, v_variance_bridge) for sub-second analytical aggregations." },
      ],
    },
    {
      title: "AI Intelligence & Orchestration Layer",
      icon: Brain,
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/60",
      technologies: [
        { name: "LangChain Core", role: "Agent loop with strict JSON action parsing, tool de-duplication, and iteration safeguards." },
        { name: "DomoTextLLM", role: "Domo AI text generation service synthesizing 8 manufacturing domain expert perspectives." },
        { name: "Deterministic Tool Suite", role: "9 verified Python/SQL tools computing math, yield, and defect Pareto without LLM hallucinations." },
        { name: "Evidence Governance Gate", role: "Enforces 4 strict tiers: PROVEN, OBSERVED_CORRELATION, HYPOTHESIS, and UNAVAILABLE." },
      ],
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4 font-sans animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-brand-purple dark:bg-purple-950/60 dark:text-purple-300 flex items-center justify-center font-bold">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-brand-navy dark:text-slate-100 leading-tight">
              Manufacturing Cost RCA – Technology Stack Architecture
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Enterprise-grade, verified full-stack technologies powering the intelligence platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 text-[11px]">Primary Core:</span>
          <span className="font-bold text-brand-purple bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-200 dark:border-purple-800">
            FastAPI + Neon PostgreSQL + Domo AI
          </span>
        </div>
      </div>

      {/* Grid of Stack Layers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stackLayers.map((layer, idx) => {
          const Icon = layer.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 shadow-2xs flex flex-col gap-3"
            >
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className={`w-8 h-8 rounded-xl ${layer.color} flex items-center justify-center font-bold`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {layer.title}
                </h3>
              </div>

              <div className="flex flex-col gap-2">
                {layer.technologies.map((t, tIdx) => (
                  <div
                    key={tIdx}
                    className="p-2 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800 flex flex-col gap-0.5"
                  >
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      {t.name}
                    </span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {t.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
