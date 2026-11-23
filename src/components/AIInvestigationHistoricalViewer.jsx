import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ArrowLeft,
  Calendar,
  Box,
  Database,
  ShieldCheck,
  CheckCircle2,
  FileText,
  BarChart3,
  Layers,
  AlertTriangle,
  Target,
  Download,
  Check,
  SlidersHorizontal,
} from "lucide-react";
import { PageSkeleton } from "./LoadingStates";
import InvestigationReportView from "./InvestigationReportView";

/**
 * Dedicated Canonical AI Investigation Historical Viewer
 * Reuses the EXACT visual presentation, sections, badges, and layout of completed AI Investigations.
 * Replays the original saved snapshot directly from Neon PostgreSQL without re-running or recalculating.
 */
export default function AIInvestigationHistoricalViewer({
  apiBaseUrl = "/api",
  reportId,
  initialData = null,
  onBack,
  onNavigate,
  onOpenAIChat,
}) {
  const [activeReport, setActiveReport] = useState(initialData?.report_json || initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setActiveReport(initialData.report_json || initialData.details || initialData);
      setLoading(false);
      return;
    }

    let mounted = true;
    const fetchSavedAIReport = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Primary retrieval: /api/investigation/query/{report_id} serves exact raw DynamicInvestigationResponse
        const qRes = await fetch(`${apiBaseUrl}/investigation/query/${encodeURIComponent(reportId)}`);
        if (qRes.ok) {
          const rawPayload = await qRes.json();
          if (mounted) {
            setActiveReport(rawPayload);
            return;
          }
        }

        // 2. Secondary retrieval: /api/reports/{report_id}
        const repRes = await fetch(`${apiBaseUrl}/reports/${encodeURIComponent(reportId)}`);
        if (repRes.ok) {
          const repJson = await repRes.json();
          const snapshot = repJson.report_json || repJson.details || repJson;
          if (mounted) {
            setActiveReport(snapshot);
            return;
          }
        }

        throw new Error(`Report '${reportId}' not found in Neon PostgreSQL permanent store.`);
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to load saved AI investigation.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (reportId) {
      fetchSavedAIReport();
    }

    return () => {
      mounted = false;
    };
  }, [apiBaseUrl, reportId, initialData]);

  // Download investigation report as markdown file (identical to AIInvestigationsPage)
  const handleDownloadReport = () => {
    if (!activeReport) return;

    const drilldownLines = (activeReport.drilldowns || []).length > 0
      ? activeReport.drilldowns.map((d) => `| ${d.dimension || ""} | ${d.value || ""} | ${d.secondary || ""} | ${d.tag || ""} |`).join("\n")
      : "_No drilldown items available._";

    const drilldownTable = (activeReport.drilldowns || []).length > 0
      ? `| Dimension | Value | Secondary | Status |\n|:---|:---|:---|:---|\n${drilldownLines}`
      : "_No drilldown items available._";

    const content = `# MANUFACTURING INVESTIGATION REPORT
# ${activeReport.title}

- **Report ID:** \`${activeReport.report_id || reportId}\`
- **Question:** ${activeReport.question || activeReport.title}
- **Reporting Period:** ${activeReport.reporting_period}
- **Scope:** ${activeReport.scope_label}
- **Status:** ${activeReport.status}
- **Generated At:** ${activeReport.generated_at}
- **Data Origin:** ${activeReport.data_origin} (${activeReport.is_synthetic ? "Synthetic Test Session" : "Authoritative Production Store"})

---

## 1. EXECUTIVE SUMMARY
${activeReport.executive_summary}

---

## 2. DETAILED FINDINGS
${(activeReport.detailed_findings || []).map((f) => `### ${f.index || "•"} ${f.title} [${f.evidence_classification || f.impact || "PROVEN"}]\n${f.narrative || f.explanation || ""}\n`).join("\n")}

---

## 3. EVIDENCE SUMMARY
${(activeReport.evidence || []).map((e) => `- ${e}`).join("\n")}

---

## 4. DRILLDOWN ANALYSIS
${drilldownTable}

---

## 5. WHAT WE CANNOT CONCLUDE YET
${(activeReport.what_we_cannot_conclude_yet || []).map((l) => `- ${l}`).join("\n")}

---

## 6. RECOMMENDED ACTIONS
${(activeReport.recommended_actions || []).map((r, i) => `${r.step || i + 1}. ${typeof r === "string" ? r : `${r.action}${r.owner ? ` (Owner: ${r.owner})` : ""}`}`).join("\n")}

---
*Report archived durably in Neon PostgreSQL. Reopened without re-execution.*
`;

    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Investigation_Report_${activeReport.report_id || reportId}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="w-full flex-1 flex flex-col space-y-4 pb-8 font-sans text-slate-800">
        <PageSkeleton cardCount={3} showChart={false} showTable={true} />
      </div>
    );
  }

  if (error || !activeReport) {
    return (
      <div className="w-full flex-1 flex flex-col space-y-4 pb-8 font-sans text-slate-800">
        <div className="bg-white rounded-2xl p-8 border border-rose-200 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Unable to Retrieve Saved AI Investigation
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              {error || `Record '${reportId}' not found in Neon PostgreSQL permanent store.`}
            </p>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Reports List</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200 font-sans text-slate-800 pb-8">
      <InvestigationReportView
        report={activeReport}
        onBack={onBack}
        onNavigate={onNavigate}
        onDownload={handleDownloadReport}
        isSaved={true}
      />

      {/* Follow-up Exploration Chips */}
      {activeReport.follow_up_suggestions && activeReport.follow_up_suggestions.length > 0 && (
        <div className="w-full bg-gradient-to-r from-purple-50/80 via-indigo-50/40 to-purple-50/80 rounded-2xl border border-purple-200/90 shadow-2xs p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#7c3aed] stroke-[2.2]" />
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Recommended Follow-up Investigations
            </h3>
          </div>
          <p className="text-xs text-slate-600">
            Select a suggested inquiry to continue exploring with inherited scope:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {activeReport.follow_up_suggestions.map((suggestion, sIdx) => (
              <button
                key={sIdx}
                onClick={() => {
                  if (onOpenAIChat) {
                    onOpenAIChat(suggestion);
                  } else if (onNavigate) {
                    onNavigate("investigations", {
                      question: suggestion,
                      parent_report_id: activeReport.report_id || reportId,
                    });
                  }
                }}
                className="group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-purple-200 hover:border-purple-400 hover:bg-purple-50/50 text-slate-800 text-xs font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer text-left"
              >
                <span className="text-[#7c3aed] font-bold group-hover:translate-x-0.5 transition-transform">→</span>
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
