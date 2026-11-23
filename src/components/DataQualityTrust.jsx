import React, { useState, useEffect } from "react";
import { ShieldCheck, AlertCircle, AlertTriangle, XCircle, Info, RefreshCw, CheckCircle2 } from "lucide-react";

export default function DataQualityTrust({ apiBaseUrl }) {
  const [summary, setSummary] = useState(null);
  const [issues, setIssues] = useState([]);
  const [filterSeverity, setFilterSeverity] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const loadQualityData = async () => {
    setLoading(true);
    try {
      const [sumRes, issRes] = await Promise.all([
        fetch(`${apiBaseUrl}/data-quality/summary`).then((r) => r.json()),
        fetch(`${apiBaseUrl}/data-quality/issues`).then((r) => r.json()),
      ]);
      setSummary(sumRes);
      setIssues(issRes || []);
    } catch (e) {
      console.error("Failed to load data quality info", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQualityData();
  }, [apiBaseUrl]);

  const filteredIssues = issues.filter((i) => {
    if (filterSeverity === "ALL") return true;
    return i.severity === filterSeverity;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Trust Score Header Banner */}
      <div className="card-surface p-6 border border-page-border shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative w-24 h-24 flex items-center justify-center rounded-2xl bg-gradient-to-br from-brand-purple-soft to-brand-blue-soft border border-brand-purple/20 shadow-inner">
            <div className="text-center">
              <span className="text-3xl font-extrabold text-brand-purple">
                {summary?.overall_trust_score ?? 88.5}
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                Grade {summary?.grade ?? "B"}
              </span>
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold badge-purple mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Transparent Data Trust Assessment</span>
            </div>
            <h3 className="text-lg font-bold text-ink-primary">
              Enterprise Data Reliability Index
            </h3>
            <p className="text-xs text-ink-secondary max-w-xl">
              Weighted composite evaluation across 6 critical operational dimensions. Ensures AI investigations and cost variances remain strictly factual.
            </p>
          </div>
        </div>

        <button
          onClick={loadQualityData}
          className="btn-secondary text-xs flex items-center gap-2 py-2 px-3 self-start md:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Audit</span>
        </button>
      </div>

      {/* 6 Dimensions Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {summary?.dimensions &&
          Object.entries(summary.dimensions).map(([key, val]) => (
            <div key={key} className="card-surface p-3.5 border border-page-border flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider truncate">
                  {key.replace("_", " ")}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="text-xl font-bold text-ink-primary mb-1">{val}%</div>
              <div className="w-full bg-page-bg h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-brand-purple h-full rounded-full transition-all duration-500"
                  style={{ width: `${val}%` }}
                />
              </div>
            </div>
          ))}
      </div>

      {/* Methodology Explainer */}
      <div className="p-4 rounded-xl bg-brand-blue-soft/50 border border-brand-blue/20 text-xs text-ink-secondary flex items-start gap-3">
        <Info className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-brand-navy dark:text-brand-white">Audit Formula Methodology: </span>
          <span>{summary?.methodology || "Weighted: Validity (30%), Completeness (20%), Consistency (15%), Integrity (15%), Freshness (10%), Coverage (10%)."}</span>
          <p className="mt-1 text-[11px] text-ink-muted">
            Blocking errors prevent posting execution. Operational warnings (e.g. unstated downtime reasons or excess scrap rates) are accepted but penalize consistency.
          </p>
        </div>
      </div>

      {/* Issues Log Table */}
      <div className="card-surface p-6 border border-page-border shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-sm font-bold text-ink-primary">Audited Issues & Integrity Exceptions</h4>
            <p className="text-xs text-ink-muted">Detailed log of detected validation warnings and errors.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterSeverity("ALL")}
              className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                filterSeverity === "ALL" ? "badge-purple font-bold" : "text-ink-secondary hover:bg-page-bg"
              }`}
            >
              All ({issues.length})
            </button>
            <button
              onClick={() => setFilterSeverity("ERROR")}
              className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                filterSeverity === "ERROR" ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 font-bold" : "text-ink-secondary hover:bg-page-bg"
              }`}
            >
              Errors ({issues.filter((i) => i.severity === "ERROR").length})
            </button>
            <button
              onClick={() => setFilterSeverity("WARNING")}
              className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                filterSeverity === "WARNING" ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-bold" : "text-ink-secondary hover:bg-page-bg"
              }`}
            >
              Warnings ({issues.filter((i) => i.severity === "WARNING").length})
            </button>
          </div>
        </div>

        {filteredIssues.length === 0 ? (
          <div className="py-8 text-center text-xs text-ink-muted border border-dashed border-page-border rounded-lg">
            No issues flagged under this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-page-border text-ink-secondary font-semibold">
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Rule Code</th>
                  <th className="py-2.5 px-3">Identifier</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-page-border">
                {filteredIssues.map((iss, idx) => (
                  <tr key={idx} className="hover:bg-page-bg/40">
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          iss.severity === "ERROR"
                            ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {iss.severity === "ERROR" ? (
                          <XCircle className="w-3 h-3" />
                        ) : (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        {iss.severity}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] font-medium text-brand-purple">
                      {iss.rule_code}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-ink-muted">
                      {iss.record_identifier}
                    </td>
                    <td className="py-2.5 px-3 text-ink-primary max-w-md">{iss.message}</td>
                    <td className="py-2.5 px-3 text-ink-secondary text-[11px]">{iss.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

