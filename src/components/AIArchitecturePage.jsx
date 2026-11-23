import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Sun,
  Workflow,
  GitBranch,
  Layers,
  Cpu,
  Table,
} from "lucide-react";

import ManufacturingCostDiagram from "./architecture/ManufacturingCostDiagram";
import ManufacturingCostRightPanel from "./architecture/ManufacturingCostRightPanel";
import ManufacturingCostComponentDetails from "./architecture/ManufacturingCostComponentDetails";
import RcaInvestigationWorkflow from "./architecture/RcaInvestigationWorkflow";
import RcaDataFlowView from "./architecture/RcaDataFlowView";
import RcaTechStackView from "./architecture/RcaTechStackView";
import RcaComponentsMappingView from "./architecture/RcaComponentsMappingView";

export default function AIArchitecturePage({ onNavigate }) {
  const navigate = useNavigate();

  // Active component selection across the architecture explorer
  const [selectedComponentId, setSelectedComponentId] = useState("comp-ai-engine");

  // Top navigation tabs: Architecture Overview, Investigation Workflow, Data Flow, Technology Stack, Components Mapping
  const [activeNavTab, setActiveNavTab] = useState("overview");

  // Search input query
  const [searchQuery, setSearchQuery] = useState("");

  const handleActionNavigate = (route) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      navigate(route);
    }
  };

  const navTabs = [
    { id: "overview", label: "Architecture Overview", icon: Workflow },
    { id: "workflow", label: "Investigation Workflow", icon: GitBranch },
    { id: "dataFlow", label: "Data Flow", icon: Layers },
    { id: "techStack", label: "Technology Stack", icon: Cpu },
    { id: "mapping", label: "Components Mapping", icon: Table },
  ];

  return (
    <div className="w-full pb-10 flex flex-col gap-3 font-sans animate-in fade-in duration-200">
      {/* =========================================================================
          TOP EXECUTIVE HEADER & BREADCRUMBS
          Manufacturing Cost RCA > System Architecture
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
        {/* Left: Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Manufacturing Cost RCA</span>
          <span className="text-slate-300 dark:text-slate-600 font-bold">&gt;</span>
          <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">
            System Architecture
          </span>
        </div>

        {/* Right: Search, Database Grounding, Theme Toggle, Avatar */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Grounding Badge */}
          <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-[#1e293b] px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs">
            <span>Grounding:</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">
              Neon PostgreSQL 127k+ Facts
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Zero Mock Data</span>
          </div>

          {/* Search Box */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple w-44 sm:w-52 transition-all shadow-2xs"
            />
          </div>

          {/* Theme Icon Button */}
          <button
            type="button"
            className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
            title="Toggle theme"
          >
            <Sun className="w-4 h-4 text-slate-600 dark:text-amber-400" />
          </button>

          {/* User Profile Avatar */}
          <div className="w-8 h-8 rounded-xl bg-brand-purple text-white text-xs font-black flex items-center justify-center shadow-xs cursor-pointer">
            JD
          </div>
        </div>
      </div>

      {/* =========================================================================
          PILL NAVIGATION TABS: Architecture Overview, Investigation Workflow...
          ========================================================================= */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeNavTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveNavTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                isActive
                  ? "bg-brand-purple text-white shadow-xs"
                  : "bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          VIEW SWITCHER BASED ON ACTIVE NAVIGATION TAB
          ========================================================================= */}

      {/* TAB 1: ARCHITECTURE OVERVIEW (Matches Reference Image 1 Layout Perfectly) */}
      {activeNavTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start w-full">
          {/* Left Column (~68% width): Diagram (Top) + Component Details (Bottom) */}
          <div className="lg:col-span-8 flex flex-col gap-3.5">
            {/* Upper Area A: Compact 5-Stage Architecture Diagram */}
            <ManufacturingCostDiagram
              selectedId={selectedComponentId}
              onSelectComponent={(id) => setSelectedComponentId(id)}
            />

            {/* Lower Area C: Selected Component Details (Overview, Workflow, Data Flow, Dependencies, Status) */}
            <ManufacturingCostComponentDetails
              selectedId={selectedComponentId}
              onSelectComponent={(id) => setSelectedComponentId(id)}
            />
          </div>

          {/* Right Column (~32% width): Area B Component Inspector Panel */}
          <div className="lg:col-span-4 sticky top-4">
            <ManufacturingCostRightPanel
              selectedId={selectedComponentId}
              onReset={() => setSelectedComponentId("comp-ai-engine")}
              onNavigate={handleActionNavigate}
            />
          </div>
        </div>
      )}

      {/* TAB 2: EIGHT-STAGE INVESTIGATION WORKFLOW */}
      {activeNavTab === "workflow" && (
        <RcaInvestigationWorkflow onNavigate={handleActionNavigate} />
      )}

      {/* TAB 3: END-TO-END DATA FLOW */}
      {activeNavTab === "dataFlow" && (
        <RcaDataFlowView
          onSelectComponent={(id) => {
            setSelectedComponentId(id);
            setActiveNavTab("overview");
          }}
        />
      )}

      {/* TAB 4: TECHNOLOGY STACK */}
      {activeNavTab === "techStack" && <RcaTechStackView />}

      {/* TAB 5: COMPONENTS MAPPING */}
      {activeNavTab === "mapping" && (
        <RcaComponentsMappingView
          onSelectComponent={(id) => {
            setSelectedComponentId(id);
            setActiveNavTab("overview");
          }}
          onNavigateToOverview={() => setActiveNavTab("overview")}
        />
      )}
    </div>
  );
}
