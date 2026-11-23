import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import gwcLogoCollapsed from "../assets/gwc-logo-collapsed.png";
import {
  TrendingUp,
  Home,
  LayoutDashboard,
  BarChart3,
  Box,
  Layers,
  FlaskConical,
  Share2,
  Settings,
  ChevronRight,
  ChevronLeft,
  X,
  Search,
  Activity,
  Sliders,
  Database,
  ShieldCheck,
  Upload,
} from "lucide-react";

export default function AppSidebar({
  activeTab,
  setActiveTab,
  mobileOpen = false,
  setMobileOpen,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  // Expanded by default to match Command Center visual authority (Reference Image 5 & 8)
  const [expanded, setExpanded] = useState(() => {
    const saved = localStorage.getItem("gwc_sidebar_expanded");
    return saved !== null ? saved === "true" : true;
  });

  const toggleExpanded = (val) => {
    setExpanded(val);
    try {
      localStorage.setItem("gwc_sidebar_expanded", String(val));
    } catch (e) {
      // ignore
    }
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 50);
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 320);
  };



  // Determine active item id from current URL pathname
  const currentPath = location.pathname.toLowerCase();
  let currentActiveId = "home";
  if (currentPath === "/" || currentPath.startsWith("/home")) {
    currentActiveId = "home";
  } else if (currentPath.startsWith("/overview")) {
    currentActiveId = "overview";
  } else if (currentPath.startsWith("/upload") || currentPath.startsWith("/import")) {
    currentActiveId = "upload";
  } else if (currentPath.startsWith("/investigations") || currentPath.startsWith("/investigation")) {
    currentActiveId = "investigations";
  } else if (
    currentPath.startsWith("/cost-analysis") ||
    currentPath.startsWith("/cost-engine") ||
    currentPath.startsWith("/variance-analysis")
  ) {
    currentActiveId = "cost-analysis";
  } else if (currentPath.startsWith("/product-analysis")) {
    currentActiveId = "product-analysis";
  } else if (currentPath.startsWith("/component-analysis")) {
    currentActiveId = "component-analysis";
  } else if (
    currentPath.startsWith("/production-quality") ||
    currentPath.startsWith("/quality")
  ) {
    currentActiveId = "production-quality";
  } else if (currentPath.startsWith("/reports")) {
    currentActiveId = "reports";
  } else if (
    currentPath.startsWith("/connectors") ||
    currentPath.startsWith("/data-connectors")
  ) {
    currentActiveId = "connectors";
  } else if (activeTab) {
    currentActiveId = activeTab === "import" ? "upload" : activeTab;
  }

  // Active tab that the white carved surface points to (only active page, not on hover)
  const targetTab = currentActiveId;

  // Navigation sections: exactly the finalized options matching Master Task specification
  const navSections = [
    {
      heading: "",
      items: [
        {
          id: "home",
          label: "Home",
          path: "/home",
          icon: Home,
        },
        {
          id: "overview",
          label: "Overview",
          path: "/overview",
          icon: LayoutDashboard,
        },
        {
          id: "upload",
          label: "Data Upload",
          path: "/upload",
          icon: Upload,
        },
        {
          id: "investigations",
          label: "AI Investigations",
          path: "/investigations",
          icon: Search,
        },
        {
          id: "cost-analysis",
          label: "Cost Analysis",
          path: "/cost-analysis",
          icon: BarChart3,
        },
        {
          id: "product-analysis",
          label: "Product Analysis",
          path: "/product-analysis",
          icon: Box,
        },
        {
          id: "component-analysis",
          label: "Component Analysis",
          path: "/component-analysis",
          icon: Layers,
        },
        {
          id: "production-quality",
          label: "Production & Quality",
          path: "/production-quality",
          icon: Activity,
        },
        {
          id: "reports",
          label: "Reports",
          path: "/reports",
          icon: TrendingUp,
        },
        {
          id: "connectors",
          label: "Data Connectors",
          path: "/connectors",
          icon: Database,
        },
      ],
    },
  ];

  const handleItemClick = (item) => {
    if (setActiveTab) {
      setActiveTab(item.path);
    } else {
      navigate(item.path);
    }
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Desktop Left Navigation: Floating Full-Height Pod with Margins */}
      <div
        className={`hidden lg:flex shrink-0 z-20 flex-col h-screen select-none transition-all duration-300 ease-in-out bg-[#F5F7FA] p-2.5 ${
          expanded ? "w-[260px]" : "w-[76px]"
        }`}
      >
        <aside
          className="flex-1 min-h-0 w-full rounded-[24px] bg-gradient-to-b from-[#251545] via-[#21143f] to-[#1a0e33] border border-purple-500/25 shadow-2xl shadow-purple-950/40 flex flex-col justify-between relative overflow-hidden"
        >
          {/* Top Header: Brand Logo Inside Sidebar + Navigation Control */}
          <div className="flex flex-col w-full">
            {expanded ? (
              /* EXPANDED HEADER: Full Width GWC Brand Card with Integrated Collapse Control */
              <div className="relative px-3 pt-3 pb-3 border-b border-purple-800/30 shrink-0">
                <div
                  className="w-full flex items-center justify-between bg-white pl-3 pr-1.5 py-1.5 h-11 rounded-xl shadow-xs border border-white/30 transition-all hover:shadow-md group"
                >
                  <div
                    onClick={() => handleItemClick({ id: "home", path: "/home" })}
                    className="flex-1 flex items-center cursor-pointer h-full"
                    title="GWC DATA.AI - Solution Matters"
                  >
                    <img
                      src="/gwc-logo.png"
                      alt="GWC DATA.AI - Solution Matters"
                      className="h-7.5 w-auto max-w-[150px] object-contain"
                    />
                  </div>
                  <div className="h-4 w-px bg-slate-200/80 mx-1 shrink-0" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpanded(false);
                    }}
                    aria-label="Collapse sidebar"
                    className="shrink-0 w-7 h-7 rounded-lg text-slate-400 hover:text-purple-700 hover:bg-purple-50 flex items-center justify-center transition-colors cursor-pointer"
                    title="Collapse sidebar"
                  >
                    <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            ) : (
              /* COLLAPSED HEADER: Dedicated GWC Network Monogram Brand Logo + Expand Control */
              <div className="flex flex-col items-center pt-3 pb-2.5 border-b border-purple-800/30 shrink-0 gap-2">
                <div
                  onClick={() => handleItemClick({ id: "home", path: "/home" })}
                  className="w-11 h-11 rounded-xl bg-white flex items-center justify-center cursor-pointer hover:shadow-md hover:scale-105 transition-all p-1 shadow-xs border border-white/25"
                  title="GWC DATA.AI - Solution Matters"
                >
                  <img
                    src={gwcLogoCollapsed}
                    alt="GWC DATA.AI"
                    className="h-full w-full object-contain"
                  />
                </div>
                <button
                  onClick={() => toggleExpanded(true)}
                  aria-label="Expand sidebar"
                  className="w-6 h-6 rounded-lg text-purple-300/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer focus:outline-none focus-visible:outline-none"
                  title="Expand navigation"
                >
                  <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
                </button>
              </div>
            )}

            {/* Navigation Items Stack (Matches Reference Image 1 with floating rounded pills) */}
            <nav className="relative flex flex-col w-full px-3 pt-2 pb-1 gap-1.5">
              {navSections.map((section, sIdx) => (
                <div key={section.heading || sIdx} className="w-full flex flex-col gap-1.5">
                  {/* Section header in expanded mode */}
                  {expanded && section.heading && (
                    <div className="px-3.5 pt-2 pb-1 text-[9px] font-bold text-purple-300/50 uppercase tracking-widest truncate">
                      {section.heading}
                    </div>
                  )}

                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isCurrent = currentActiveId === item.id;

                    return (
                      <div
                        key={item.id}
                        data-nav-id={item.id}
                        data-nav-active={isCurrent ? "true" : "false"}
                        className="group relative w-full flex items-center justify-center"
                      >
                        <button
                          onClick={() => handleItemClick(item)}
                          aria-label={item.label}
                          className={`w-full rounded-2xl flex items-center select-none cursor-pointer transition-all duration-200 group ${
                            expanded
                              ? "h-11 sm:h-12 px-3.5 gap-3.5 justify-start"
                              : "h-11 w-11 justify-center px-0 mx-auto"
                          } ${
                            isCurrent
                              ? "bg-white text-[#1f2f59] shadow-md font-bold"
                              : "text-purple-200/85 hover:text-white hover:bg-white/20 font-semibold"
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 shrink-0 transition-all duration-200 ${
                              isCurrent
                                ? "stroke-[2.2] text-[#6f3dba]"
                                : "stroke-[1.8] text-purple-300/85 group-hover:text-white group-hover:stroke-[2.2] group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.85)]"
                            }`}
                          />
                          {expanded && (
                            <span
                              className={`text-[13px] leading-none truncate tracking-tight transition-all duration-200 ${
                                isCurrent
                                  ? "font-bold text-[#1f2f59]"
                                  : "font-semibold text-purple-200/90 group-hover:text-white group-hover:font-bold"
                              }`}
                            >
                              {item.label}
                            </span>
                          )}
                        </button>

                        {/* Tooltip in collapsed mode */}
                        {!expanded && (
                          <div className="absolute left-[68px] top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg bg-[#1f1539] text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-2xl border border-purple-500/30">
                            {item.label}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </nav>
          </div>

          {/* System & Context Status Pod (Matches Reference Image) */}
          {expanded && (
            <div className="px-3.5 py-3 mx-3 my-2.5 rounded-2xl bg-purple-950/60 border border-purple-800/40 text-xs flex items-center gap-3 shadow-inner shrink-0">
              <div className="w-9 h-9 rounded-xl bg-purple-800/70 border border-purple-600/40 text-purple-200 flex items-center justify-center shrink-0 shadow-2xs">
                <BarChart3 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-bold text-white leading-tight truncate">
                  Manufacturing
                </div>
                <div className="text-[11px] font-semibold text-purple-200/90 leading-tight truncate">
                  Intelligence Platform
                </div>
                <div className="text-[10px] font-mono font-medium text-purple-300/80 leading-tight">
                  v2.4 Enterprise
                </div>
              </div>
            </div>
          )}

          {/* Minimal Clean Bottom Status Line (Replaces previous artificial factory asset) */}
          <div className="w-full px-4 py-3.5 border-t border-purple-800/20 shrink-0 flex items-center justify-between">
            {expanded ? (
              <>
                <span className="text-xs font-bold text-purple-300/60 uppercase tracking-wider">
                  GWC Cost AI
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                  <span className="text-xs font-mono font-semibold text-purple-200/90">Connected</span>
                </span>
              </>
            ) : (
              <div className="w-full flex justify-center py-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" title="Connected" />
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Mobile Drawer (Preserved for small viewports) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileOpen && setMobileOpen(false)}
          />
          <div className="relative z-10 w-64 h-full bg-gradient-to-b from-[#251545] via-[#21143f] to-[#1a0e33] flex flex-col justify-between py-4 px-3 shadow-2xl">
            <div className="flex items-center justify-between mb-4 px-1">
              <div
                onClick={() => handleItemClick({ id: "home", path: "/home" })}
                className="cursor-pointer bg-white px-2.5 py-1 rounded-xl shadow-xs"
              >
                <img
                  src="/gwc-logo.png"
                  alt="GWC DATA.AI"
                  className="h-6 w-auto object-contain"
                />
              </div>
              <button
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className="p-1.5 rounded-full bg-purple-800/40 text-purple-200 hover:text-white hover:bg-purple-800/60 transition-colors"
                title="Close Navigation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="flex flex-col gap-1 w-full">
              {navSections.flatMap((s) => s.items).map((item) => {
                const Icon = item.icon;
                const isActive = currentActiveId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`w-full h-11 px-3.5 rounded-xl flex items-center gap-3 transition-all ${
                      isActive
                        ? "bg-white text-[#21143f] shadow-md font-bold"
                        : "text-purple-200/80 hover:text-white hover:bg-purple-800/40 font-medium"
                    }`}
                  >
                    <Icon className="w-5 h-5 stroke-[2] shrink-0" />
                    <span className="text-xs truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 text-center text-[10px] text-purple-300/60">
              Manufacturing Cost Agent
            </div>
          </div>
        </div>
      )}
    </>
  );
}
