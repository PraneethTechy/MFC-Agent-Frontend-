import React, { useState } from "react";
import { Sparkles, CheckCircle2, RefreshCw, AlertCircle, Database, HelpCircle } from "lucide-react";
import { API_BASE_URL } from "../config/api";

export default function SyntheticDataModal({ apiBaseUrl = API_BASE_URL, onGenerated }) {
  const [generating, setGenerating] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch(`${apiBaseUrl}/synthetic-data/generate`, {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to generate benchmark data`);
      }
      const data = await res.json();
      setSummary(data.summary);
      if (onGenerated) onGenerated();
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const scenarios = [
    { id: 1, title: "Supplier Price Hike (+20.8%)", desc: "Alloy Steel (MAT-STEEL-01) from SUP-TATA jumps from ₹65 to ₹78.50 in Month 4." },
    { id: 2, title: "Copper Usage Variance (+8.0%)", desc: "Motor stamping scrap on Product PRD-MOTOR-01 wastes excess copper in Month 3." },
    { id: 3, title: "CNC Tool Wear Scrap Spike", desc: "Work Centre WC-CNC-01 experiences tool insert wear in Month 5 (+₹1.45L scrap & rework)." },
    { id: 4, title: "Shift 2 Overtime Surge", desc: "Urgent customer orders in Month 2 incur 180 overtime hours at 2.0x premium rate." },
    { id: 5, title: "Furnace Idle-Load Spike", desc: "Plant Beta furnace records 45 kWh/hr off-shift idle load spike in Month 4." },
    { id: 6, title: "Unabsorbed Overhead Volume Variance", desc: "Plant Gamma output drops 25% in Month 6, leaving ₹4.80L unabsorbed fixed overhead." },
  ];

  return (
    <div className="card-surface p-6 border border-page-border shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold badge-peach mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Development & Testing Sandbox</span>
          </div>
          <h3 className="text-base font-bold text-ink-primary">Deterministic Manufacturing Benchmark</h3>
          <p className="text-xs text-ink-secondary">
            Seeds a 3-plant, 6-month historical dataset covering all 6 cost categories and 6 controlled variance scenarios.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="btn-primary text-xs flex items-center gap-2 py-2 px-4 cursor-pointer disabled:opacity-50"
        >
          {generating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Generating Benchmark...</span>
            </>
          ) : (
            <>
              <Database className="w-3.5 h-3.5" />
              <span>Generate Benchmark Dataset</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {summary && (
        <div className="mb-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-xs">
          <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Benchmark Dataset Successfully Loaded!</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] text-ink-secondary font-mono">
            <div>Plants: <span className="font-bold text-ink-primary">{summary.plants}</span></div>
            <div>Periods: <span className="font-bold text-ink-primary">{summary.calendar_periods}</span></div>
            <div>Products: <span className="font-bold text-ink-primary">{summary.products}</span></div>
            <div>Materials: <span className="font-bold text-ink-primary">{summary.materials}</span></div>
            <div>Suppliers: <span className="font-bold text-ink-primary">{summary.suppliers}</span></div>
          </div>
        </div>
      )}

      {/* Scenarios Overview */}
      <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
        Embedded Investigation Scenarios (Deterministically Calibrated)
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {scenarios.map((sc) => (
          <div key={sc.id} className="p-3 rounded-lg bg-page-bg border border-page-border">
            <div className="font-semibold text-xs text-brand-purple mb-1">
              Scenario {sc.id}: {sc.title}
            </div>
            <p className="text-[11px] text-ink-secondary">{sc.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

