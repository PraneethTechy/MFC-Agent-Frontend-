import React, { useState } from "react";
import HomeHeader from "./HomeHeader";
import CompactArchitectureOverview from "./CompactArchitectureOverview";
import ManufacturingProblemsPanel from "./ManufacturingProblemsPanel";
import AIRCAEngineExplainer from "./AIRCAEngineExplainer";
import ProductionYieldHeatmap from "./ProductionYieldHeatmap";

export default function HomePage({ onNavigate, onOpenAIChat }) {
  // Default strictly to Stage 3 (AI RCA Intelligence Engine) matching specifications
  const [activeSelection, setActiveSelection] = useState({
    type: "ARCH",
    id: "layer-3-intelligence",
    title: "AI RCA Intelligence Engine — How It Works",
    badgeLabel: "Selected from Architecture",
    subtitle:
      "Finding and explaining the reasons behind manufacturing cost and operational changes",
    whatItDoes:
      "Investigates manufacturing problems by analyzing relevant cost, production, material, quality, equipment, workforce and supplier information to identify evidence-backed root causes.",
    whatHappensHere: [
      "Calculates manufacturing cost, production and operational performance using deterministic calculations.",
      "Identifies which RCA dimensions are relevant to the reported problem.",
      "Examines relevant records across available datasets and time periods.",
      "Connects supporting evidence and distinguishes confirmed findings from correlations or possible explanations.",
      "Quantifies the impact where the available data supports it and prioritizes corrective actions.",
    ],
    inputs:
      "Available manufacturing data, investigation period, selected filters and the problem described by the user.",
    outputs:
      "Prioritized root-cause findings, supporting evidence, quantified impact where possible, and recommended corrective actions.",
    businessValue:
      "Helps management move beyond identifying that a cost or production metric has changed to understanding what contributed to the change and where corrective action may be needed.",
  });

  const handleSelectLayer = (layer) => {
    setActiveSelection({
      type: "ARCH",
      id: layer.id,
      title: `${layer.name} — How It Works`,
      badgeLabel: "Selected from Architecture",
      subtitle: layer.subtitle || layer.tagline,
      whatItDoes: layer.whatItDoes,
      whatHappensHere: layer.whatHappensHere,
      inputs: layer.inputs,
      outputs: layer.outputs,
      businessValue: layer.businessValue,
    });
  };

  const handleSelectProblem = (problem) => {
    setActiveSelection({
      type: "PROBLEM",
      id: problem.id,
      title: `${problem.title} — RCA Investigation Logic`,
      badgeLabel: "Selected Problem",
      subtitle: problem.desc,
      whatItDoes: problem.whatItDoes,
      whatHappensHere: problem.whatHappensHere,
      inputs: problem.inputs,
      outputs: problem.outputs,
      businessValue: problem.businessValue,
    });
  };

  return (
    <div className="w-full pb-8 flex flex-col gap-3.5 font-sans animate-in fade-in duration-200">
      {/* 00. Top Branding & KPI Header */}
      <HomeHeader />

      {/* 01. ROW 1: System Architecture Pipeline (expands) & Manufacturing Problems (meaningfully compact width) */}
      <div className="flex flex-col lg:flex-row gap-3.5 items-stretch">
        {/* Top-Left: System Architecture Pipeline (Flex-1 fills all remaining width) */}
        <div className="flex-1 min-w-0 flex flex-col">
          <CompactArchitectureOverview
            selectedLayerId={activeSelection.type === "ARCH" ? activeSelection.id : null}
            onSelectLayer={handleSelectLayer}
            onNavigate={onNavigate}
          />
        </div>

        {/* Top-Right: Manufacturing Problems We Investigate (Meaningfully compact width) */}
        <div className="w-full lg:w-[230px] xl:w-[245px] shrink-0 flex flex-col">
          <ManufacturingProblemsPanel
            selectedProblemId={activeSelection.type === "PROBLEM" ? activeSelection.id : null}
            onSelectProblem={handleSelectProblem}
          />
        </div>
      </div>

      {/* 02. ROW 2: AI RCA Intelligence Engine Explainer & Heatmap (Balanced 7 / 5 Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* Bottom-Left: AI RCA Engine – How It Works (Slightly decreased width: 7 cols) */}
        <div className="lg:col-span-7 flex flex-col min-h-0">
          <AIRCAEngineExplainer activeSelection={activeSelection} />
        </div>

        {/* Bottom-Right: Production Progress & Yield Heatmap (Expanded width: 5 cols to relieve congestion) */}
        <div className="lg:col-span-5 flex flex-col min-h-0">
          <ProductionYieldHeatmap />
        </div>
      </div>
    </div>
  );
}
