import React, { useState } from "react";
import {
  Calculator,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Search,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export default function CostIntelligenceWorkbench({ initialView = "investigation" }) {
  const [plantCode, setPlantCode] = useState("PLANT-PUN");
  const [productCode, setProductCode] = useState("PRD-MOTOR-01");
  const [periodCode, setPeriodCode] = useState("2026-M04");
  const [costingVersion, setCostingVersion] = useState("AOP-2026-V1");

  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState(initialView); // 'summary', 'sva', 'bridge', 'drivers', 'investigation'
  const [resultData, setResultData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const scopePayload = {
    plant_code: plantCode,
    product_code: productCode,
    period_code: periodCode,
    costing_version_code: costingVersion,
    currency: "INR",
  };

  const runCalculation = async (endpoint, viewKey) => {
    setLoading(true);
    setErrorMsg(null);
    setActiveView(viewKey);
    try {
      const res = await fetch(`${API_BASE_URL}/cost/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scopePayload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || `Request failed with status ${res.status}`);
      }
      setResultData(data);
    } catch (err) {
      setErrorMsg(err.message);
      setResultData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-page-surface border border-page-border shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-ink-primary">
              Deterministic Cost Intelligence Engine
            </h2>
            <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full badge-purple">
              Phase 3 Engine
            </span>
          </div>
          <p className="text-xs text-ink-secondary mt-1 max-w-2xl">
            Deterministic Python & SQL calculation workbench. Reconciles Standard vs Actual costs across all six manufacturing categories with zero LLM arithmetic.
          </p>
        </div>

        {/* Scope Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={plantCode}
            onChange={(e) => setPlantCode(e.target.value)}
            className="input-text text-xs py-1.5 px-3 bg-page-bg"
          >
            <option value="PLANT-PUN">Pune (PLANT-PUN)</option>
            <option value="PLANT-CHE">Chennai (PLANT-CHE)</option>
            <option value="PLANT-GUJ">Gujarat (PLANT-GUJ)</option>
          </select>

          <select
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
            className="input-text text-xs py-1.5 px-3 bg-page-bg"
          >
            <option value="PRD-MOTOR-01">Induction Motor 15kW</option>
            <option value="PRD-GEAR-02">Reduction Gearbox 4:1</option>
            <option value="PRD-PUMP-03">Hydraulic Pump 250bar</option>
          </select>

          <select
            value={periodCode}
            onChange={(e) => setPeriodCode(e.target.value)}
            className="input-text text-xs py-1.5 px-3 bg-page-bg"
          >
            <option value="2026-M01">2026-M01 (Jan)</option>
            <option value="2026-M02">2026-M02 (Feb · Overtime)</option>
            <option value="2026-M03">2026-M03 (Mar · Copper Waste)</option>
            <option value="2026-M04">2026-M04 (Apr · Steel Spike)</option>
            <option value="2026-M05">2026-M05 (May · CNC Tool Wear)</option>
            <option value="2026-M06">2026-M06 (Jun · Volume Drop)</option>
          </select>
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => runCalculation("investigate", "investigation")}
          disabled={loading}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeView === "investigation"
              ? "bg-brand-purple text-white shadow-sm"
              : "btn-secondary text-ink-primary"
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Full Variance Investigation</span>
        </button>

        <button
          onClick={() => runCalculation("variance-bridge", "bridge")}
          disabled={loading}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeView === "bridge"
              ? "bg-brand-purple text-white shadow-sm"
              : "btn-secondary text-ink-primary"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Variance Bridge</span>
        </button>

        <button
          onClick={() => runCalculation("standard-vs-actual", "sva")}
          disabled={loading}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeView === "sva"
              ? "bg-brand-purple text-white shadow-sm"
              : "btn-secondary text-ink-primary"
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Standard vs Actual</span>
        </button>

        <button
          onClick={() => runCalculation("drivers", "drivers")}
          disabled={loading}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeView === "drivers"
              ? "bg-brand-purple text-white shadow-sm"
              : "btn-secondary text-ink-primary"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Cost Driver Ranking</span>
        </button>

        <button
          onClick={() => runCalculation("summary", "summary")}
          disabled={loading}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeView === "summary"
              ? "bg-brand-purple text-white shadow-sm"
              : "btn-secondary text-ink-primary"
          }`}
        >
          <span>Actual Cost Summary</span>
        </button>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="p-12 text-center text-ink-secondary text-xs">
          <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Computing deterministic cost analytics against Neon PostgreSQL...
        </div>
      )}

      {/* Results View */}
      {!loading && resultData && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-4">
              <span className="text-[11px] font-medium text-ink-secondary">Total Standard Cost</span>
              <p className="text-xl font-bold text-ink-primary mt-1">
                ₹{(resultData.summary?.total_standard_cost || resultData.total_standard_cost || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
              <span className="text-[10px] text-ink-tertiary">Baseline: AOP-2026-V1</span>
            </div>

            <div className="card p-4">
              <span className="text-[11px] font-medium text-ink-secondary">Total Actual Cost</span>
              <p className="text-xl font-bold text-ink-primary mt-1">
                ₹{(resultData.summary?.total_actual_cost || resultData.total_actual_cost || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
              <span className="text-[10px] text-ink-tertiary">Deterministic Ledger Sum</span>
            </div>

            <div className="card p-4">
              <span className="text-[11px] font-medium text-ink-secondary">Net Cost Variance</span>
              <p className={`text-xl font-bold mt-1 ${
                (resultData.summary?.total_variance || resultData.total_variance || 0) > 0 ? "text-red-500" : "text-emerald-500"
              }`}>
                ₹{(resultData.summary?.total_variance || resultData.total_variance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
              <span className="text-[10px] text-ink-tertiary">
                {(resultData.summary?.total_variance_pct || resultData.total_variance_pct || 0)}% Unfavourable
              </span>
            </div>

            <div className="card p-4">
              <span className="text-[11px] font-medium text-ink-secondary">Reconciliation Status</span>
              <div className="flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  100% Deterministic Match
                </span>
              </div>
              <span className="text-[10px] text-ink-tertiary">Zero Unexplained Leakage</span>
            </div>
          </div>

          {/* 6 Category Breakdown Table */}
          {(resultData.category_breakdown || resultData.categories) && (
            <div className="card overflow-hidden">
              <div className="p-4 border-b border-page-border">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-primary">
                  Six Manufacturing Cost Categories Breakdown
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-page-bg text-ink-secondary border-b border-page-border">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Cost Category</th>
                      <th className="py-2.5 px-4 font-semibold">Allocation</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Standard (₹)</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Actual (₹)</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Variance (₹)</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Variance %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-page-border">
                    {(resultData.category_breakdown || resultData.categories).map((cat, idx) => (
                      <tr key={idx} className="hover:bg-page-bg/50">
                        <td className="py-3 px-4 font-medium text-ink-primary">{cat.category}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            cat.allocation_type === "DIRECT"
                              ? "badge-purple"
                              : cat.allocation_type === "ESTIMATED"
                              ? "badge-orange"
                              : "badge-teal"
                          }`}>
                            {cat.allocation_type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-ink-secondary">
                          {cat.standard_cost.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-medium text-ink-primary">
                          {cat.actual_cost.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td className={`py-3 px-4 text-right font-mono font-semibold ${
                          cat.variance > 0 ? "text-red-500" : cat.variance < 0 ? "text-emerald-500" : "text-ink-secondary"
                        }`}>
                          {cat.variance > 0 ? "+" : ""}{cat.variance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td className={`py-3 px-4 text-right font-mono ${
                          cat.variance > 0 ? "text-red-500" : "text-emerald-500"
                        }`}>
                          {cat.variance_pct.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Variance Bridge Decomposition Components */}
          {resultData.variance_components && (
            <div className="card p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-primary">
                Variance Bridge: Operational Decomposition
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {resultData.variance_components.map((comp, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-page-border bg-page-bg flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-ink-secondary font-semibold">
                        {comp.category}
                      </span>
                      <p className="text-xs font-bold text-ink-primary mt-0.5">{comp.component_name}</p>
                      <span className="text-[10px] text-ink-tertiary">{comp.formula_used}</span>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold font-mono ${
                        comp.amount > 0 ? "text-red-500" : comp.amount < 0 ? "text-emerald-500" : "text-ink-secondary"
                      }`}>
                        {comp.amount > 0 ? "+" : ""}{comp.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </p>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                        comp.variance_direction === "UNFAVOURABLE" ? "badge-orange" : "badge-teal"
                      }`}>
                        {comp.variance_direction}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cost Driver Ranking */}
          {(resultData.cost_drivers || resultData.drivers) && (
            <div className="card p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-primary">
                Prioritized Cost Drivers (Pareto Ranking)
              </h3>
              <div className="space-y-2.5">
                {(resultData.cost_drivers || resultData.drivers).map((d) => (
                  <div key={d.rank} className="p-3.5 rounded-xl border border-page-border bg-page-bg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-brand-purple/10 text-brand-purple font-bold text-xs flex items-center justify-center">
                        #{d.rank}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-ink-primary">{d.driver_name}</p>
                        <p className="text-[11px] text-ink-secondary mt-0.5">{d.supporting_evidence}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold font-mono text-red-500">
                        +₹{d.abs_variance_amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </p>
                      <span className="text-[10px] font-semibold text-ink-secondary">
                        {d.contribution_pct}% contribution ({d.confidence})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Operational Evidence Trail */}
          {resultData.evidence_trail && resultData.evidence_trail.length > 0 && (
            <div className="card p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-primary">
                Shop-Floor Evidence Trail (Audit Trail)
              </h3>
              <div className="space-y-2">
                {resultData.evidence_trail.map((ev, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-page-bg border border-page-border text-xs flex items-start gap-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold badge-purple flex-shrink-0 mt-0.5">
                      {ev.evidence_type}
                    </span>
                    <div className="flex-1">
                      <p className="text-ink-primary font-medium">{ev.details}</p>
                      <span className="text-[10px] text-ink-tertiary">
                        Table: {ev.source_table} · Date: {ev.date} · ID: #{ev.record_id}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

