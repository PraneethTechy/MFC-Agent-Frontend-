import React, { useState } from "react";
import CompactArchitectureOverview from "./CompactArchitectureOverview";
import ManufacturingProblemsPanel from "./ManufacturingProblemsPanel";
import AIRCAEngineExplainer from "./AIRCAEngineExplainer";
import ProductionYieldHeatmap from "./ProductionYieldHeatmap";
import {
  ARCHITECTURE_DETAILS,
  DEFAULT_INITIAL_SELECTION,
} from "./homeData";

export default function HomePage({ onNavigate, onOpenAIChat }) {
  // Centralized selection state initialized to Stage 4 - Insights & Analytics (RCA Engine)
  const [selectedId, setSelectedId] = useState("s4-rca");

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  const activeSelection =
    ARCHITECTURE_DETAILS[selectedId] || DEFAULT_INITIAL_SELECTION;

  return (
    <div className="w-full min-h-full flex flex-col gap-3.5 font-sans animate-in fade-in duration-200 select-none pb-14 pr-1">
      {/* 01. ROW A: [Architecture ~75%] [Manufacturing Problems ~25%] (Untouched) */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch min-h-[375px] lg:h-[390px] xl:h-[405px] shrink-0">
        {/* Top-Left: System Architecture Pipeline */}
        <div className="flex-1 min-w-0 flex flex-col h-full">
          <CompactArchitectureOverview
            selectedId={selectedId}
            onSelect={handleSelect}
            onNavigate={onNavigate}
          />
        </div>

        {/* Top-Right: Manufacturing Problems Panel */}
        <div className="w-full lg:w-[250px] xl:w-[265px] shrink-0 flex flex-col h-full">
          <ManufacturingProblemsPanel
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </div>
      </div>

      {/* 02. ROW B: [Information Workspace ~50%] [Heatmap ~50%] (Height increased for spacious layout and natural scrollability) */}
      <div className="flex flex-col lg:flex-row gap-3.5 items-stretch min-h-[420px] lg:h-[445px] xl:h-[460px] shrink-0">
        {/* Bottom-Left: Dynamic Management Information Workspace */}
        <div className="flex-1 min-w-0 flex flex-col h-full">
          <AIRCAEngineExplainer activeSelection={activeSelection} />
        </div>

        {/* Bottom-Right: Production Progress & Yield Heatmap */}
        <div className="flex-1 min-w-0 flex flex-col h-full">
          <ProductionYieldHeatmap />
        </div>
      </div>
    </div>
  );
}
