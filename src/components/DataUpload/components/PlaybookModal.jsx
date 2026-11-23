import React from "react";
import {
  X,
  Sparkles,
  CheckCircle2,
  Clock,
  Target,
  ShieldCheck,
  Building2,
  Layers,
  TrendingDown,
  Coins,
  Package,
  Factory,
  ArrowRight,
  ChevronRight,
  AlertTriangle,
  FileCheck,
} from "lucide-react";

/**
 * PlaybookModal — Executive-Grade Two-Column Action Playbook
 * 
 * Features:
 * - Refined sequence badge (#01, #02, etc.)
 * - High-impact 4-metric executive summary strip
 * - Consolidated Left Pane (Governance, Scope matrix, Business Context, and high-contrast Target KPI Comparison)
 * - Elevated Right Pane (Tactical Implementation Roadmap with crisp 01..04 step indicators and milestone timeline)
 * - Cleaned up redundant makeup text and duplicated target descriptions
 */
export default function PlaybookModal({ playbook, onClose, onAskAI }) {
  if (!playbook) return null;

  // Normalized identifiers & sequence
  const seqNum = String(playbook.seqStr || playbook.num || "01").padStart(2, "0");
  const priorityText = playbook.priority || playbook.badge || "High Priority";
  const isHighPri = priorityText.toUpperCase().includes("HIGH");
  const badgeStyleClass = isHighPri
    ? "bg-rose-50 text-rose-700 border-rose-200"
    : "bg-amber-50 text-amber-700 border-amber-200";

  const categoryText = playbook.category || "Operational Playbook";
  const titleText = playbook.title || "Cost Optimization Action Playbook";

  // Executive Metrics
  const savingsText =
    playbook.savingsDisplay ||
    playbook.estimated_savings_display ||
    playbook.savings ||
    "₹8.28 Cr";

  const unitImpactText =
    playbook.unitImpact ||
    playbook.unit_cost_impact_display ||
    "-₹750.65 / unit";

  const timeframeText =
    playbook.timeframe ||
    playbook.implementation_timeframe ||
    "Immediate (1 - 2 Weeks)";

  const confidenceText =
    playbook.confidence ||
    "PROVEN (100% Reconciled)";

  // Operational Governance
  const ownerText =
    playbook.owner ||
    "Strategic Sourcing & Quality Engineering";

  // Accurate Root Cause mapping based on sequence / recommendation
  const rootCauseText =
    playbook.rootCause ||
    playbook.root_cause ||
    (seqNum === "01"
      ? "Supplier SUP-104 Display Panel Lot Defect Fallout"
      : seqNum === "02"
      ? "Unbudgeted +4.8% Purchase Price Variance on Qualcomm SoCs"
      : "Line 2 SMT Feeder Misalignment & Reflow Conveyor Downtime");

  // Supporting Problem Statement / Context
  const contextText =
    playbook.problemStatement ||
    playbook.problem_statement ||
    playbook.desc ||
    playbook.shortDesc ||
    "Identified operational variance impacting production unit costs.";

  // Target KPI & Success Thresholds
  const currentMeasuredVal =
    playbook.currentMeasuredVal ||
    playbook.current_measured_value ||
    (seqNum === "01"
      ? "10.40% fallout (12,849 defective panels across 153 runs)"
      : seqNum === "02"
      ? "+4.8% PPV (₹8,594 vs ₹8,200 contracted rate across 28,500 units)"
      : "91.65 hrs downtime (28 mechanical stoppage incidents)");

  const proposedTarget =
    playbook.proposedTarget ||
    playbook.proposed_target ||
    (seqNum === "01"
      ? "< 0.80% fallout (FPY ≥ 99.2% standard)"
      : seqNum === "02"
      ? "Contracted MSA price cap of ₹8,200.00 / unit (0.0% PPV)"
      : "< 25.0 hrs total downtime (Availability ≥ 96.5%)");

  const verificationMethod =
    playbook.verificationMethod ||
    playbook.verification_method ||
    (seqNum === "01"
      ? "Receiving QA 100% incoming lot screening & formal SCAR warranty debit audit"
      : seqNum === "02"
      ? "Master Service Agreement invoice price audit & volume rebate reconciliation"
      : "Shift-level OEE telemetry logging & weekly preventive overhaul verification");

  // Scope entities
  const targetComponents =
    playbook.components ||
    playbook.targetComponents ||
    (playbook.compLine ? [playbook.compLine] : ['OLED Display Panel 6.7" (DSP-01)']);

  const affectedProducts =
    playbook.products ||
    playbook.affectedProducts ||
    ["PHX-PRO", "PHX-128", "PHX-256"];

  const affectedPlants =
    playbook.plants ||
    ["PLT-01 (Chennai)"];

  const affectedLines =
    playbook.lines ||
    ["Line 1", "Line 2", "Line 3"];

  const affectedSuppliers =
    playbook.suppliers ||
    (seqNum === "01"
      ? ["SUP-104 (OptoTech Display)"]
      : seqNum === "02"
      ? ["SUP-102 (Qualcomm Technologies)"]
      : ["ASM / Fuji SMT Maintenance"]);

  // Format line chip helper
  const formatLine = (lStr) => {
    if (!lStr) return "";
    const m = String(lStr).match(/\b(?:Line\s*(\d+)|L(\d+))\b/i);
    return m ? `L${m[1] || m[2]}` : lStr;
  };

  // Tactical Implementation Roadmap Steps
  const defaultPhases = [
    { phase: "Immediate Containment", timing: "Week 1" },
    { phase: "Commercial Recovery", timing: "Week 1 - 2" },
    { phase: "Root-Cause Prevention", timing: "Week 2 - 3" },
    { phase: "Governance & Quality Gate", timing: "Week 3 - 4" },
  ];

  const rawSteps =
    playbook.implementationSteps ||
    playbook.implementation_steps ||
    playbook.playbookSteps ||
    playbook.playbook_steps ||
    (seqNum === "01"
      ? [
          { phase: "Immediate Containment", text: "Enforce 100% incoming lot screening at Receiving QA for component shipments.", timing: "Week 1" },
          { phase: "Commercial Recovery", text: "Issue formal SCAR debit note covering verified scrapped units and rework labor.", timing: "Week 1 - 2" },
          { phase: "Root-Cause Prevention", text: "Audit supplier cleanroom bonding line and optical touch lamination parameters.", timing: "Week 2 - 3" },
          { phase: "Governance & Quality Gate", text: "Establish escrow retention terms on future shipments until 3 consecutive zero-defect lots pass.", timing: "Week 3 - 4" }
        ]
      : seqNum === "02"
      ? [
          { phase: "Contract Audit", text: "Audit vendor invoice price spreads against global master purchase agreements for critical SoCs.", timing: "Week 1" },
          { phase: "Rebate Clawback", text: "Enforce contracted volume rebate tier thresholds to claw back unapproved price surcharges.", timing: "Week 1 - 2" },
          { phase: "Commercial Tension", text: "Validate second-source SoC foundry packaging to maintain competitive commercial tension.", timing: "Week 2 - 3" },
          { phase: "Allocation Lock", text: "Lock next-quarter rolling volume allocations subject to strict pricing compliance.", timing: "Week 3 - 4" }
        ]
      : [
          { phase: "Mechanical Overhaul", text: "Execute complete mechanical overhaul of high-speed tape feeders and vacuum nozzles on Line 2.", timing: "Week 1" },
          { phase: "Drive Replacement", text: "Replace worn conveyor drive motor bearings on Line 2 reflow oven to eliminate mechanical jamming.", timing: "Week 1 - 2" },
          { phase: "Predictive Monitoring", text: "Establish shift-level vibration monitoring and automated preventative maintenance triggers.", timing: "Week 2 - 3" },
          { phase: "Standardized Handover", text: "Implement 15-minute standardized pre-flight calibration checks prior to daily shift handover.", timing: "Week 3 - 4" }
        ]);

  const stepsList = (Array.isArray(rawSteps) ? rawSteps : []).map((s, idx) => {
    let rawPhase = typeof s === "object" && s !== null && s.phase ? s.phase : defaultPhases[idx % defaultPhases.length].phase;
    // Strip leading "Phase X:" prefix if present for clean display
    const cleanPhase = String(rawPhase).replace(/^Phase\s*\d+\s*:\s*/i, "").trim();
    const phaseText = typeof s === "object" && s !== null && s.text ? s.text : String(s);
    const timingText = typeof s === "object" && s !== null && s.timing ? s.timing : defaultPhases[idx % defaultPhases.length].timing;

    return {
      phase: cleanPhase,
      text: phaseText,
      timing: timingText,
    };
  });

  // Expected Outcome Callout
  const outcomeText =
    playbook.outcome ||
    playbook.expected_outcome ||
    (seqNum === "01"
      ? `Enforce vendor accountability, recover ${savingsText} in scrap warranty debits, and restore line assembly yields to 99.2% FPY.`
      : seqNum === "02"
      ? `Recover unapproved price premiums, claim volume rebates, and capture ${savingsText} in savings.`
      : `Eliminate unplanned feeder jamming, recover capacity, and capture ${savingsText} in overhead recovery.`);

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[960px] max-h-[calc(100vh-40px)] bg-white rounded-2xl border border-purple-100 shadow-[0_25px_60px_rgba(15,23,42,0.25)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. PINNED CLEAN HEADER */}
        <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between gap-3 shrink-0 bg-white">
          <div className="flex items-center gap-3 min-w-0">
            {/* Redesigned Serial Number Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#5914df] to-[#7c3aed] text-white shadow-sm shadow-purple-900/15 shrink-0 select-none">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">PLAYBOOK</span>
              <span className="font-mono font-black text-sm text-white">#{seqNum}</span>
            </div>

            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate tracking-tight">
                {titleText}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Close Playbook"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. EXECUTIVE 4-METRIC IMPACT STRIP */}
        <div className="px-5 py-2.5 sm:px-6 sm:py-3 bg-purple-50/40 border-b border-purple-100/60 shrink-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
            {/* Metric 1: Financial Opportunity */}
            <div className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-purple-100/80 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center shrink-0">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
                  Savings Opportunity
                </span>
                <span className="text-xs sm:text-sm font-mono font-black text-emerald-700 truncate block">
                  {savingsText}
                </span>
              </div>
            </div>

            {/* Metric 2: Unit-Cost Improvement */}
            <div className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-purple-100/80 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#7c3aed] border border-purple-200/60 flex items-center justify-center shrink-0">
                <Coins className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
                  Unit-Cost Impact
                </span>
                <span className="text-xs sm:text-sm font-mono font-black text-[#7c3aed] truncate block">
                  {unitImpactText}
                </span>
              </div>
            </div>

            {/* Metric 3: Estimated Horizon */}
            <div className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-purple-100/80 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 border border-sky-200/60 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
                  Estimated Horizon
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 truncate block">
                  {timeframeText}
                </span>
              </div>
            </div>

            {/* Metric 4: Audit Confidence */}
            <div className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-purple-100/80 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200/60 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
                  Audit Confidence
                </span>
                <span className="text-xs sm:text-sm font-bold text-indigo-900 truncate block">
                  {confidenceText}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. MAIN BODY — BALANCED 2-COLUMN LAYOUT */}
        <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 items-start">
            
            {/* LEFT COLUMN: Governance, Scope & Performance Target (5 / 12) */}
            <div className="md:col-span-5 space-y-3">
              
              {/* Card 1: Operational Governance & Investigation Scope */}
              <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-3">
                {/* Owner & Root Cause Pair */}
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[9.5px] uppercase font-bold tracking-wider mb-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Operational Owner</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {ownerText}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[9.5px] uppercase font-bold tracking-wider mb-1">
                      <Target className="w-3.5 h-3.5 text-[#7c3aed]" />
                      <span>Addresses Root Cause</span>
                    </div>
                    <div className="bg-purple-50 text-[#7c3aed] border border-purple-200/70 px-2.5 py-1 rounded-lg text-xs font-bold leading-tight">
                      {rootCauseText}
                    </div>
                  </div>
                </div>

                {/* Scope Matrix */}
                <div className="pt-2.5 border-t border-slate-200/60 space-y-2">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[9.5px] uppercase font-bold tracking-wider">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>Investigation Scope</span>
                  </div>

                  {/* Scope Details Grid */}
                  <div className="space-y-1.5 text-xs">
                    {/* Products */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-400 font-medium">Products:</span>
                      {affectedProducts.map((prod) => (
                        <span
                          key={prod}
                          className="text-[10px] font-mono font-bold bg-purple-100/80 text-[#7c3aed] px-2 py-0.5 rounded"
                        >
                          {prod}
                        </span>
                      ))}
                    </div>

                    {/* Plant & Lines */}
                    <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                      <span className="text-slate-400 font-medium">Plant:</span>
                      {affectedPlants.map((plt) => (
                        <span key={plt} className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                          {plt}
                        </span>
                      ))}
                      <span className="text-slate-300 mx-0.5">•</span>
                      <span className="text-slate-400 font-medium">Lines:</span>
                      {affectedLines.map((line) => (
                        <span key={line} className="font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {formatLine(line)}
                        </span>
                      ))}
                    </div>

                    {/* Component & Supplier */}
                    <div className="pt-1 border-t border-slate-100 space-y-1 text-[11px]">
                      <div className="flex items-start gap-1.5">
                        <span className="text-slate-400 text-[10px] shrink-0 mt-0.5">Component:</span>
                        <span className="font-semibold text-amber-950 bg-amber-50/80 px-2 py-0.5 rounded border border-amber-200/70 leading-tight">
                          {targetComponents.join(", ")}
                        </span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="text-slate-400 text-[10px] shrink-0 mt-0.5">Supplier:</span>
                        <span className="font-semibold text-sky-950 bg-sky-50/80 px-2 py-0.5 rounded border border-sky-200/70 leading-tight">
                          {affectedSuppliers.join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Business Context & Target Thresholds */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
                {/* Context narrative */}
                <div className="space-y-1">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-purple-700 block">
                    Supporting Business Context
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {contextText}
                  </p>
                </div>

                {/* High-Contrast Target Comparison */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <span className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider block">
                    Recovery Targets
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Current Measured */}
                    <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/80 space-y-0.5">
                      <span className="text-[9px] uppercase font-black text-rose-600 tracking-wider block">
                        Current Measured
                      </span>
                      <span className="text-xs font-bold text-rose-900 leading-snug block">
                        {currentMeasuredVal}
                      </span>
                    </div>

                    {/* Proposed Target */}
                    <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-0.5">
                      <span className="text-[9px] uppercase font-black text-emerald-700 tracking-wider block">
                        Proposed Target
                      </span>
                      <span className="text-xs font-bold text-emerald-900 leading-snug block">
                        {proposedTarget}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verification & Audit Protocol */}
                <div className="pt-2 border-t border-slate-100 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">
                      Verification &amp; Audit Protocol
                    </span>
                    <span className="text-[11px] text-slate-700 font-medium leading-tight block mt-0.5">
                      {verificationMethod}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Tactical Implementation Roadmap (7 / 12) */}
            <div className="md:col-span-7 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.2]" />
                  <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">
                    Tactical Implementation Roadmap
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200/60">
                  {stepsList.length} Action Steps
                </span>
              </div>

              {/* Phased Action Cards with Clean Step Indicators */}
              <div className="space-y-2.5">
                {stepsList.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200/80 bg-white hover:border-purple-200 hover:shadow-2xs transition-all space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Redesigned, Non-Stretched Serial Number Badge */}
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#6d20e7] to-[#8b5cf6] text-white font-mono font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                        <span className="text-xs sm:text-[13px] font-bold text-slate-900 truncate">
                          Phase {idx + 1}: {step.phase}
                        </span>
                      </div>

                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/70 shrink-0">
                        {step.timing}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium pl-8.5">
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Target Outcome & Recovery Callout */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50/90 to-teal-50/70 border border-emerald-200/90 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-900 text-xs font-extrabold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Target Operational Outcome</span>
                </div>
                <p className="text-xs text-emerald-950 font-medium leading-relaxed pl-5.5">
                  {outcomeText}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* 4. PINNED ACTION FOOTER */}
        <div className="px-5 py-3 sm:px-6 sm:py-3.5 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <button
            onClick={() => {
              if (onAskAI) onAskAI(titleText);
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6d20e7] to-[#8b5cf6] hover:from-[#5914df] hover:to-[#7c3aed] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm shadow-purple-900/15 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask AI to Simulate ROI</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer text-center"
          >
            Close Playbook
          </button>
        </div>
      </div>
    </div>
  );
}
