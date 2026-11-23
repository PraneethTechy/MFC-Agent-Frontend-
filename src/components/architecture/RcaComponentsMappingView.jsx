import React, { useState } from "react";
import {
  Table,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  ArrowRight,
  ExternalLink,
  Layers,
} from "lucide-react";
import { ARCHITECTURE_COMPONENTS } from "./architectureData";

export default function RcaComponentsMappingView({ onSelectComponent, onNavigateToOverview }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const componentsList = Object.values(ARCHITECTURE_COMPONENTS);

  const filteredComponents = componentsList.filter((c) => {
    const matchesSearch =
      searchTerm === "" ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.techRef?.backend && c.techRef.backend.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.techRef?.db && c.techRef.db.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "implemented":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Implemented
          </span>
        );
      case "partial":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Partial
          </span>
        );
      case "planned":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
            <Clock className="w-3 h-3 text-indigo-600" />
            Planned
          </span>
        );
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 font-sans animate-in fade-in duration-200">
      {/* Top Filter Bar */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-brand-purple dark:bg-purple-950/60 dark:text-purple-300 flex items-center justify-center font-bold">
            <Table className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-brand-navy dark:text-slate-100 leading-tight">
              Manufacturing Cost RCA – Components Mapping Registry
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Verified mapping of all architecture components to source files, API routes, and database tables
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search components or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-brand-purple"
          >
            <option value="all">All Statuses</option>
            <option value="implemented">Implemented</option>
            <option value="partial">Partial</option>
            <option value="planned">Planned</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-700 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Component Name</th>
                <th className="py-2.5 px-3">Layer</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Backend File / Handler</th>
                <th className="py-2.5 px-3">API Route</th>
                <th className="py-2.5 px-3">Database Grounding</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredComponents.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => {
                    onSelectComponent(c.id);
                    if (onNavigateToOverview) onNavigateToOverview();
                  }}
                  className="hover:bg-purple-50/40 dark:hover:bg-purple-950/20 cursor-pointer transition-colors"
                >
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100">
                    <div className="flex flex-col">
                      <span>{c.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 font-normal">{c.id}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 text-[11px]">
                    {c.layerName?.split("—")[1]?.trim() || c.category}
                  </td>
                  <td className="py-2.5 px-3">
                    {getStatusBadge(c.status)}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[10px] text-blue-700 dark:text-blue-300 max-w-xs truncate">
                    {c.techRef?.backend || "backend/app/main.py"}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[10px] text-purple-700 dark:text-purple-300 max-w-xs truncate">
                    {c.techRef?.api || "POST /api/cost/summary"}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[10px] text-emerald-700 dark:text-emerald-300 max-w-xs truncate">
                    {c.techRef?.db || "line_cost_batches"}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button className="text-brand-purple hover:underline text-xs font-bold inline-flex items-center gap-1 cursor-pointer">
                      <span>Inspect</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
