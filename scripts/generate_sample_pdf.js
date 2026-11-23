import fs from "fs";
import path from "path";
import { generateInvestigationPDF } from "../src/services/pdfReportService.js";

const sampleReportData = {
  investigation_id: "c46d5d63-db1c-4a39-a96d-74d32a0c6489",
  session_id: "c46d5d63-db1c-4a39-a96d-74d32a0c6489",
  report_id: "c46d5d63-db1c-4a39-a96d-74d32a0c6489",
  generated_at: "2026-11-22T21:00:00Z",
  status: "Completed",
  data_origin: "REAL_COMMITTED_STORE",
  reporting_period_label: "November 2026",
  comparison_period_label: "October 2026 Baseline",

  scope: {
    staged_batch_id: "c46d5d63-db1c-4a39-a96d-74d32a0c6489",
    current_period: "Nov 02 - Nov 20, 2026",
    baseline_period: "Oct 2026 (Monthly Standard)",
    selected_product: "All Products (PHX Series)",
    selected_plant: "PLT-01 (Chennai)",
    selected_line: "All Lines",
    records_validated: 1710,
    records_parsed: 1710,
    is_reconciled: true,
    reconciliation_status: "100% Mathematically Reconciled",
    disclosed_limitations: "Governance Notice & Operational Scope Limitations: This investigation evaluates committed manufacturing cost ledgers, quality inspection logs, and BOM procurement records. Incomparability adjustments (e.g. day-aligned partial period normalizations) are explicitly isolated to prevent run-rate skew. Unverified physical supplier machine wear requires on-site technical inspection."
  },

  // Authoritative Core Financial & Production KPIs
  current_total_cost: 614200000,
  baseline_total_cost: 588500000,
  cost_change_amount: 25700000,
  cost_change_pct: 4.37,

  current_cost_per_good_unit: 23623.08,
  baseline_cost_per_good_unit: 20649.12,
  unit_cost_change_pct: 14.40,

  current_produced_qty: 26000,
  baseline_produced_qty: 28500,
  produced_delta_pct: -8.77,

  current_good_qty: 25488,
  baseline_good_qty: 28272,
  current_yield_pct: 98.03,
  baseline_yield_pct: 99.20,

  current_scrap_cost: 150400000,
  baseline_scrap_cost: 98700000,

  current_rework_cost: 32000000,
  baseline_rework_cost: 21500000,

  current_downtime_hours: 91.65,
  baseline_downtime_hours: 24.50,

  current_oee: 78.4,
  baseline_oee: 86.5,

  executive_finding: {
    current_period_label: "Nov 02 - Nov 20, 2026",
    baseline_period_label: "Oct 2026 Baseline",
    headline: "Unfavorable Manufacturing Cost Variance Driven by Component Defect Fallout & Unplanned Downtime",
    sub_headline: "Total manufacturing spend increased by Rs. 2.57 Cr (+4.37%) against baseline, driven primarily by scrap fallout in high-value OLED displays and reflow oven conveyor jamming.",
    conclusion: "Immediate supplier remediation and containment screening required for SUP-104. SMT Line 2 conveyor drive motor overhaul scheduled to eliminate unplanned mechanical stoppages."
  },

  // Authoritative Cost Composition Variance
  category_breakdown: [
    { category_name: "Direct Materials (BOM)", baseline_amount: 365200000, current_amount: 382450000, variance_amount: 17250000, variance_pct: 4.72, variance_share_pct: 62.3, primary_driver: "Unbudgeted +4.8% Purchase Price Variance on Qualcomm SoCs" },
    { category_name: "Scrap & Quality Loss", baseline_amount: 98700000, current_amount: 150400000, variance_amount: 51700000, variance_pct: 52.38, variance_share_pct: 24.5, primary_driver: "Supplier SUP-104 OLED lot defect fallout (12,849 defective units)" },
    { category_name: "Direct Labor & Rework", baseline_amount: 42100000, current_amount: 48600000, variance_amount: 6500000, variance_pct: 15.44, variance_share_pct: 7.9, primary_driver: "Extended testing and rework shifts for touch panel alignment" },
    { category_name: "Manufacturing Overhead & Maintenance", baseline_amount: 82500000, current_amount: 32750000, variance_amount: -49750000, variance_pct: -60.30, variance_share_pct: 5.3, primary_driver: "Reduced production run volume offsetting fixed plant utility allocation" }
  ],

  // Product SKU Performance Benchmarks
  product_comparison: [
    { product_code: "PHX-PRO", product_name: "Phoenix Pro 5G Flagship", baseline_cost_per_unit: 25200.00, current_cost_per_unit: 28450.00, variance_cost_per_unit: 3250.00, variance_pct: 12.90, good_units_produced: 10400, primary_cost_movement_driver: "High OLED display scrap rate on Line 1 & Line 3" },
    { product_code: "PHX-256", product_name: "Phoenix Standard 256GB", baseline_cost_per_unit: 21850.00, current_cost_per_unit: 24120.00, variance_cost_per_unit: 2270.00, variance_pct: 10.39, good_units_produced: 8200, primary_cost_movement_driver: "Flash memory price increase and reflow thermal solder bridging" },
    { product_code: "PHX-128", product_name: "Phoenix Value 128GB", baseline_cost_per_unit: 16900.00, current_cost_per_unit: 18300.00, variance_cost_per_unit: 1400.00, variance_pct: 8.28, good_units_produced: 7400, primary_cost_movement_driver: "SMT feeder mechanical misalignment downtime on Line 2" }
  ],

  // Daily Cost Trend
  daily_cost_trend: [
    { date: "11/02", cost: 18400000, baseline_cost: 19600000 },
    { date: "11/05", cost: 19200000, baseline_cost: 19600000 },
    { date: "11/08", cost: 24800000, baseline_cost: 19600000 },
    { date: "11/12", cost: 28900000, baseline_cost: 19600000 },
    { date: "11/15", cost: 22100000, baseline_cost: 19600000 },
    { date: "11/18", cost: 20500000, baseline_cost: 19600000 },
    { date: "11/20", cost: 19800000, baseline_cost: 19600000 }
  ],

  // Root Cause & Evidence Findings
  key_findings: [
    {
      title: "Supplier SUP-104 Display Panel Lot Defect Fallout",
      evidence_classification: "VERIFIED",
      cost_impact: 15040000,
      plant: "PLT-01 (Chennai)",
      affected_line: "Lines 1, 2, 3",
      affected_component: "OLED Display Panel 6.7\" (DSP-01)",
      affected_supplier: "SUP-104 (OptoTech Display)",
      finding_narrative: "Batch lot #OPTO-2026-W45 exhibited a 10.4% defect rate during incoming and in-line assembly at Plant PLT-01. Micro-cracking and touch sensor delamination resulted in 12,849 scrapped units and Rs. 1.50 Cr in net quality scrap loss.",
      supporting_evidence: [
        "Receiving QA lot inspection logged 12,849 defective panels across 153 inspection runs.",
        "Line 1 first-pass yield dropped from 99.2% to 94.8% during week 45 production run.",
        "Visual inspection confirmed micro-crack delamination along edge busbars."
      ],
      corrective_mandate: "Enforce 100% incoming lot screening at Receiving QA; issue formal SCAR debit note to OptoTech Display for Rs. 1.50 Cr warranty recovery."
    },
    {
      title: "Line 2 SMT Feeder Misalignment & Reflow Conveyor Downtime",
      evidence_classification: "VERIFIED",
      cost_impact: 7200000,
      plant: "PLT-01 (Chennai)",
      affected_line: "Line 2",
      affected_component: "SMT Feeder Nozzles & Heller Oven",
      affected_supplier: "ASM / Fuji SMT Maintenance",
      finding_narrative: "Surface Mount Technology line 2 experienced 91.65 hours of unplanned mechanical stoppage due to high-speed tape feeder jams and reflow conveyor drive motor bearing degradation.",
      supporting_evidence: [
        "OEE telemetry showed Line 2 availability plummeted to 76.2% against 92.0% standard.",
        "Maintenance work orders logged 28 separate mechanical stoppage events across 18 operational shifts.",
        "Thermal imaging revealed 15°C overheating on conveyor drive motor bearings."
      ],
      corrective_mandate: "Execute complete mechanical overhaul of feeder nozzles and replace conveyor drive bearings during scheduled weekend maintenance window."
    },
    {
      title: "Unbudgeted +4.8% Purchase Price Variance on Qualcomm SoCs",
      evidence_classification: "INDICATED",
      cost_impact: 3460000,
      plant: "Global Procurement",
      affected_line: "All Lines",
      affected_component: "Snapdragon 8 Gen 3 SoC (PRC-01)",
      affected_supplier: "SUP-102 (Qualcomm Technologies)",
      finding_narrative: "Invoiced unit cost for application processor chipsets exceeded contracted master service agreement caps by Rs. 394/unit across 28,500 delivered components.",
      supporting_evidence: [
        "ERP purchase order matching flagged Rs. 8,594 invoice rate against contracted Rs. 8,200 cap.",
        "Global logistics surcharge accounted for Rs. 140/unit of the variance.",
        "Volume tier 2 rebate was not applied to November delivery tranche."
      ],
      corrective_mandate: "Finance and Procurement to initiate invoice audit and enforce MSA volume tier rebate clawback on next payment cycle."
    }
  ],

  // Prioritized Corrective Action Plan
  cost_improvement_plan: {
    recommendations: [
      {
        step_number: 1,
        title: "Supplier Quality Remediation & Display Panel Warranty Recovery",
        category: "Scrap & Quality Recovery",
        priority: "High Priority",
        owner: "Strategic Sourcing & Quality Engineering",
        implementation_timeframe: "Immediate (1 - 2 Weeks)",
        target_metric: "Display Fallout < 0.80% (FPY >= 99.2%)",
        verification_method: "Receiving QA 100% incoming lot screening & SCAR debit audit",
        estimated_savings_display: "Rs. 8.28 Cr",
        unit_cost_impact_display: "-Rs. 750.65 / unit",
        action_mandate: "Enforce vendor accountability on SUP-104 for defective OLED displays, execute warranty chargeback debit notes, and institute pre-assembly optical screening to eliminate line fallout."
      },
      {
        step_number: 2,
        title: "Line 2 SMT Feeder Overhaul & Reflow Conveyor Maintenance",
        category: "Equipment Reliability",
        priority: "Medium Priority",
        owner: "Plant Maintenance & Operations Engineering",
        implementation_timeframe: "Medium Term (2 - 4 Weeks)",
        target_metric: "Line 2 Downtime < 25.0 hrs (Availability >= 96.5%)",
        verification_method: "Shift-level OEE telemetry logging & preventive overhaul verification",
        estimated_savings_display: "Rs. 1.05 Cr",
        unit_cost_impact_display: "-Rs. 95.20 / unit",
        action_mandate: "Rebuild feeder tape mechanisms, replace worn conveyor drive motor bearings, and introduce automated vibration monitoring sensors to eliminate recurring line stoppages."
      },
      {
        step_number: 3,
        title: "SoC Contract MSA Price Enforcement & Volume Rebate Clawback",
        category: "Procurement Commercials",
        priority: "Medium Priority",
        owner: "Global Direct Procurement & Finance",
        implementation_timeframe: "Short Term (1 - 3 Weeks)",
        target_metric: "Contracted MSA Price Cap Rs. 8,200.00 / unit (0.0% PPV)",
        verification_method: "MSA invoice price audit & volume rebate reconciliation",
        estimated_savings_display: "Rs. 0.63 Cr",
        unit_cost_impact_display: "-Rs. 57.10 / unit",
        action_mandate: "Audit procurement price invoices against contracted MSA volume tier benchmarks and deduct unapproved price surcharges from upcoming vendor settlements."
      }
    ]
  }
};

const doc = await generateInvestigationPDF(sampleReportData, "c46d5d63-db1c-4a39-a96d-74d32a0c6489", {
  noSave: true,
  trendPeriod: "1M",
  activeFilters: {
    product: "All Products (PHX Series)",
    plant: "PLT-01 (Chennai)",
    line: "All Lines",
    dateRange: "Nov 02 - Nov 20, 2026",
    compareWith: "Oct 2026 Baseline"
  }
});

const outputPath = path.resolve("C:/Users/gwc/Downloads/Manufacturing_RCA_Report_Verified_Sample.pdf");
const pdfArrayBuffer = doc.output("arraybuffer");
fs.writeFileSync(outputPath, Buffer.from(pdfArrayBuffer));
console.log("Successfully generated verified sample PDF at:", outputPath);
console.log("Total pages in generated PDF:", doc.getNumberOfPages());
