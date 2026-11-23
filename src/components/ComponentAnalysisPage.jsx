import React, { useState, useEffect, useMemo } from "react";
import {
  Layers,
  Box,
  TrendingUp,
  TrendingDown,
  Cpu,
  ShieldCheck,
  Search,
  Filter,
  DollarSign,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Database,
  RotateCcw,
  X,
  Info,
  Package,
  Loader2,
  FileQuestion,
} from "lucide-react";
import { apiCache } from "../services/apiCache";
import { useCachedAnalytics } from "../hooks/useCachedAnalytics";
import {
  UpdatingIndicator,
  PageSkeleton,
  ErrorBanner,
  EmptyFilteredState,
} from "./LoadingStates";
import { API_BASE_URL } from "../config/api";

export default function ComponentAnalysisPage({
  apiBaseUrl = API_BASE_URL,
  onNavigate,
  onOpenAIChat,
  routeParams = {},
  refreshKey = 0,
}) {
  // Restore persisted state from apiCache
  const persisted = useMemo(
    () =>
      apiCache.getPageState("component_analysis", {
        activeTab: "ranking",
        selectedProduct: routeParams?.product || "All Products",
        searchQuery: routeParams?.component || "",
        sortField: "material_code",
        sortAsc: true,
      }),
    []
  );

  const [activeTab, setActiveTab] = useState(persisted.activeTab); // ranking, bom, purchases
  const [selectedProduct, setSelectedProduct] = useState(routeParams?.product || persisted.selectedProduct);
  const [searchQuery, setSearchQuery] = useState(routeParams?.component || persisted.searchQuery);
  const [selectedComponent, setSelectedComponent] = useState(null);

  // Sorting for components table
  const [sortField, setSortField] = useState(persisted.sortField);
  const [sortAsc, setSortAsc] = useState(persisted.sortAsc);

  // Sync state back to apiCache
  useEffect(() => {
    apiCache.setPageState("component_analysis", {
      activeTab,
      selectedProduct,
      searchQuery,
      sortField,
      sortAsc,
    });
  }, [activeTab, selectedProduct, searchQuery, sortField, sortAsc]);

  // Filter options loaded from metadata
  const [productOptions, setProductOptions] = useState(["All Products"]);

  // Load scope metadata (cached for 5 minutes)
  useEffect(() => {
    async function loadMetadata() {
      try {
        const result = await apiCache.fetchWithCache(`${apiBaseUrl}/analytics/scope-metadata`, {
          staleTime: 300000,
        });
        const json = result.data;
        if (json.products && json.products.length > 0) {
          setProductOptions(json.products);
        }
      } catch (err) {
        console.error("Failed to load scope metadata:", err);
      }
    }
    loadMetadata();
  }, [apiBaseUrl]);

  // Query parameters for components
  const componentParams = useMemo(() => {
    const p = {};
    if (selectedProduct && selectedProduct !== "All Products") {
      p.product_code = selectedProduct;
    }
    return p;
  }, [selectedProduct]);

  // Load components data with cache
  const {
    data: compApiData,
    loading: compLoading,
    isUpdating,
    error,
    refetch,
  } = useCachedAnalytics(`${apiBaseUrl}/analytics/components`, componentParams, {
    staleTime: 60000,
    refreshKey,
  });

  const componentsData = useMemo(() => compApiData?.components || [], [compApiData]);

  // Load material intelligence with cache
  const { data: materialIntelligence } = useCachedAnalytics(
    `${apiBaseUrl}/analytics/material-intelligence`,
    componentParams,
    { staleTime: 60000, refreshKey }
  );

  // Merge BOM records with Material Intelligence
  const enrichedComponents = useMemo(() => {
    const matItems = materialIntelligence?.components || [];
    if (matItems.length > 0) {
      return matItems;
    }
    // Fallback mapping from raw BOM components if intelligence endpoint fails
    const byMat = {};
    componentsData.forEach((b) => {
      if (!byMat[b.material_code]) {
        byMat[b.material_code] = {
          material_code: b.material_code,
          material_name: `Component ${b.material_code}`,
          category: "Standard BOM Component",
          used_in_products: [],
          revisions: [],
          bom_required_qty_per_unit: b.component_qty || 1.0,
          theoretical_consumption_qty: null,
          actual_consumption_qty: null,
          actual_consumption_status: "NOT_AVAILABLE",
          weighted_avg_landed_cost: b.avg_landed_unit_cost || null,
          estimated_expenditure_inr: null,
          is_pareto_key_driver: false,
        };
      }
      if (!byMat[b.material_code].used_in_products.includes(b.product_code)) {
        byMat[b.material_code].used_in_products.push(b.product_code);
      }
      if (!byMat[b.material_code].revisions.includes(b.revision)) {
        byMat[b.material_code].revisions.push(b.revision);
      }
    });
    return Object.values(byMat);
  }, [materialIntelligence, componentsData]);

  // Search & Sorting Filtered list
  const filteredComponents = useMemo(() => {
    let list = [...enrichedComponents];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.material_code.toLowerCase().includes(q) ||
          (c.material_name && c.material_name.toLowerCase().includes(q)) ||
          (c.category && c.category.toLowerCase().includes(q)) ||
          (c.used_in_products && c.used_in_products.some((p) => p.toLowerCase().includes(q)))
      );
    }

    list.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;
      if (typeof valA === "string") {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? (valA || 0) - (valB || 0) : (valB || 0) - (valA || 0);
    });

    return list;
  }, [enrichedComponents, searchQuery, sortField, sortAsc]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleResetFilters = () => {
    setSelectedProduct("All Products");
    setSearchQuery("");
  };

  // Summary Metrics
  const totalComponentsCount = enrichedComponents.length;
  const isSpendAvailable = materialIntelligence?.expenditure_status === "VERIFIED" && materialIntelligence?.total_component_expenditure_cr !== null;
  const totalSpendCr = isSpendAvailable ? `₹${materialIntelligence.total_component_expenditure_cr} Cr` : "NOT_AVAILABLE";
  const highestSpendItem = isSpendAvailable && materialIntelligence?.highest_expenditure_component ? materialIntelligence.highest_expenditure_component : null;

  const linkedProductsCount = useMemo(() => {
    const s = new Set();
    enrichedComponents.forEach((c) => {
      (c.used_in_products || []).forEach((p) => s.add(p));
    });
    return s.size;
  }, [enrichedComponents]);

  const isFiltered = selectedProduct !== "All Products" || searchQuery.trim() !== "";

  return (
    <div className="w-full flex-1 flex flex-col space-y-4 select-none pb-8 font-sans text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
              Component Cost &amp; Consumption Analysis
            </h1>
          </div>
          <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-0.5">
            Analyze component-level costs, BOM requirements, material usage and purchasing patterns.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center h-10 sm:h-11 bg-white border border-slate-200 rounded-xl px-3 shadow-2xs focus-within:ring-2 focus-within:ring-purple-400">
            <span className="text-xs font-bold text-slate-400 mr-2 shrink-0">Product:</span>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="bg-transparent text-slate-800 text-xs sm:text-[13px] font-semibold focus:outline-none cursor-pointer"
            >
              {productOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Background updating indicator */}
          {isUpdating && <UpdatingIndicator text="Updating components..." />}

          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="h-10 sm:h-11 px-3 rounded-xl border border-purple-200 bg-purple-50/70 text-[#7c3aed] hover:bg-purple-100 transition-colors cursor-pointer flex items-center justify-center"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => refetch()}
            disabled={isUpdating || compLoading}
            className="h-10 sm:h-11 w-10 sm:w-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs cursor-pointer flex items-center justify-center shrink-0"
            title="Refresh component data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${(isUpdating || compLoading) ? "animate-spin text-purple-600" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Component Analytics Body with Live Updating Loading State */}
      <div className={`space-y-4 transition-all duration-300 ${isUpdating ? "opacity-50 pointer-events-none cursor-wait" : "opacity-100"}`}>
        {/* KPI Overview Strip (4 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl p-4 sm:p-5 min-h-[115px] border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Components Analyzed</span>
            <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
              {totalComponentsCount} Items
            </div>
          </div>
          <div className="text-[11px] text-purple-700 font-semibold mt-1">
            48 committed BOM specifications
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 min-h-[115px] border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Component Spend</span>
            <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
              {totalSpendCr}
            </div>
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">
            Purchase prices uncommitted in Store A
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 min-h-[115px] border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Highest Expenditure Item</span>
            <div className="text-2xl font-black text-slate-900 mt-1 font-mono truncate" title={highestSpendItem?.material_name || "NOT_AVAILABLE"}>
              {highestSpendItem ? highestSpendItem.material_code : "NOT_AVAILABLE"}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 truncate mt-1">
            {highestSpendItem ? highestSpendItem.material_name : "Requires purchase price records"}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 min-h-[115px] border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Products Linked</span>
            <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
              {linkedProductsCount} SKUs
            </div>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            SPH-PRO-256, SPH-A15-256, SPH-A15-128
          </div>
        </div>
      </div>

      {/* Loading and Error States */}
      {compLoading && componentsData.length === 0 && (
        <PageSkeleton cardCount={4} showChart={true} showTable={true} />
      )}

      {error && componentsData.length === 0 && (
        <ErrorBanner error={error} onRetry={refetch} title="Component Analytics Error" />
      )}

      {componentsData.length === 0 && !compLoading && !error && (
        <EmptyFilteredState
          title="No Components Found"
          message={`No component records matched the filter: Product (${selectedProduct}).`}
          onReset={handleResetFilters}
        />
      )}

      {componentsData.length > 0 && (
        <>
          {error && (
            <div className="mb-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center justify-between">
              <span>Could not refresh recent data ({error}). Displaying cached metrics.</span>
              <button onClick={() => refetch()} className="font-bold underline ml-2 cursor-pointer">Retry</button>
            </div>
          )}
          {/* Component Inventory & Specifications (Single Dedicated View) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#7c3aed]" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase">
                  Committed Component Inventory &amp; Specifications ({filteredComponents.length})
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Click row for full engineering inspection</span>
            </div>

            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse table-auto">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] text-slate-400 uppercase tracking-wider font-semibold bg-slate-50/80">
                    <th
                      className="py-3 px-3.5 w-[26%] cursor-pointer hover:text-slate-700"
                      onClick={() => handleSort("material_code")}
                    >
                      Component Specification {sortField === "material_code" ? (sortAsc ? "▲" : "▼") : ""}
                    </th>
                    <th className="py-3 px-3 w-[18%]">Classification</th>
                    <th className="py-3 px-3 w-[20%]">Linked Products</th>
                    <th
                      className="py-3 px-3 w-[12%] text-right cursor-pointer hover:text-slate-700"
                      onClick={() => handleSort("actual_consumption_qty")}
                    >
                      Actual Consumption {sortField === "actual_consumption_qty" ? (sortAsc ? "▲" : "▼") : ""}
                    </th>
                    <th
                      className="py-3 px-3 w-[12%] text-right cursor-pointer hover:text-slate-700"
                      onClick={() => handleSort("weighted_avg_landed_cost")}
                    >
                      Landed Unit Cost {sortField === "weighted_avg_landed_cost" ? (sortAsc ? "▲" : "▼") : ""}
                    </th>
                    <th
                      className="py-3 px-3.5 w-[12%] text-right cursor-pointer hover:text-slate-700"
                      onClick={() => handleSort("estimated_expenditure_inr")}
                    >
                      Total Spend {sortField === "estimated_expenditure_inr" ? (sortAsc ? "▲" : "▼") : ""}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium bg-white">
                  {filteredComponents.map((c) => {
                    return (
                      <tr
                        key={c.material_code}
                        onClick={() => setSelectedComponent(c)}
                        className="cursor-pointer hover:bg-purple-50/40 transition-colors"
                      >
                        <td className="py-3.5 px-3.5">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#7c3aed] shrink-0" />
                            <div className="min-w-0">
                              <div className="font-mono font-bold text-slate-900 text-xs truncate">
                                {c.material_code}
                              </div>
                              {c.material_name && (
                                <div className="text-[10px] text-slate-400 font-normal truncate max-w-[200px]">
                                  {c.material_name}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                            {c.category || "Standard BOM Item"}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex flex-wrap gap-1">
                            {(c.used_in_products || []).map((p) => (
                              <span
                                key={p}
                                className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-mono font-semibold"
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono text-slate-700 font-semibold tabular-nums">
                          {c.actual_consumption_qty !== null ? (
                            c.actual_consumption_qty.toLocaleString()
                          ) : (
                            <span className="text-[11px] font-semibold text-slate-400" title="Shopfloor material issuance logs are uncommitted in Store A">
                              NOT_AVAILABLE
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono text-slate-700 font-semibold tabular-nums">
                          {c.weighted_avg_landed_cost !== null && c.weighted_avg_landed_cost > 0 ? (
                            `₹${c.weighted_avg_landed_cost.toLocaleString("en-IN")}`
                          ) : (
                            <span className="text-[11px] font-semibold text-slate-400" title="Purchase orders uncommitted in Store A">
                              NOT_AVAILABLE
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3.5 text-right font-mono font-bold text-slate-900 tabular-nums">
                          {c.estimated_expenditure_inr !== null ? (
                            `₹${((c.estimated_expenditure_inr) / 1e7).toFixed(2)} Cr`
                          ) : (
                            <span className="text-[11px] font-semibold text-slate-400" title="Requires component purchase price records">
                              NOT_AVAILABLE
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Component Detail Modal */}
      {selectedComponent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                  Component Engineering Inspection
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-0.5">{selectedComponent.material_code}</h3>
                <div className="text-xs text-slate-500 font-medium">{selectedComponent.material_name}</div>
              </div>
              <button
                onClick={() => setSelectedComponent(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Subsystem Classification:</span>
                <span className="font-bold text-[#7c3aed]">{selectedComponent.category || "Standard BOM Item"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">BOM Required Quantity:</span>
                <span className="font-mono font-bold text-slate-900">1.0 pc / unit (Scrap: 0.50%)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Actual Consumption:</span>
                <span className="font-mono font-bold text-slate-500">
                  {selectedComponent.actual_consumption_qty !== null ? (
                    selectedComponent.actual_consumption_qty.toLocaleString()
                  ) : (
                    "NOT_AVAILABLE"
                  )}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Landed Unit Cost:</span>
                <span className="font-mono font-bold text-slate-500">
                  {selectedComponent.weighted_avg_landed_cost !== null && selectedComponent.weighted_avg_landed_cost > 0 ? (
                    `₹${selectedComponent.weighted_avg_landed_cost.toLocaleString("en-IN")}`
                  ) : (
                    "NOT_AVAILABLE"
                  )}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Related Product SKUs:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {(selectedComponent.used_in_products || []).join(", ") || "All Products"}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Data Origin Governance:</span>
                <span className="font-bold text-purple-700">Global Dataset</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedComponent(null)}
              className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-[#7c3aed] font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
