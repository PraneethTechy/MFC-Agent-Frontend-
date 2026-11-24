import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Sparkles,
  Send,
  X,
  Minus,
  RotateCcw,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Bot,
  MessageSquare,
  HelpCircle,
  ArrowRight,
  Database,
  Layers,
} from "lucide-react";

/**
 * Enterprise Floating AI Chatbot for GWC Manufacturing Intelligence Platform
 * Connected directly to /api/investigation/ask with session awareness,
 * deterministic evidence grounding, multi-turn context preservation,
 * and zero leading + / - symbol regression.
 */
const cleanSymbols = (str) => {
  if (!str) return "";
  let s = String(str);
  // Remove leading plus or minus directly attached to currency symbol
  s = s.replace(/[\+\-\–\—]\s*([₹$€])/g, "$1");
  // Remove leading plus or minus inside parentheses e.g. (+₹9.69 Cr) -> (₹9.69 Cr), (+5.2%) -> (5.2%)
  s = s.replace(/\([\+\-\–\—]\s*/g, "(");
  // Remove leading plus or minus before digits when preceded by space, paren, or start of string
  s = s.replace(/(^|[\s\(])[\+\-\–\—]\s*(?=\d)/g, "$1");
  // Remove trailing plus or minus if any before %
  s = s.replace(/[\+\-\–\—]\s*%/g, "%");
  return s;
};

const sanitizeFinding = (f) => {
  if (!f) return f;
  if (typeof f === "string") return cleanSymbols(f);
  return {
    ...f,
    key_finding: cleanSymbols(f.key_finding || f.finding || f.title || ""),
    evidence: cleanSymbols(f.evidence || f.narrative || f.detail || ""),
    detail: cleanSymbols(f.detail || ""),
  };
};

import { API_BASE_URL } from "../config/api";
import {
  buildApplicationContext,
  getStarterQuestions,
  getPageTitle,
} from "../services/chatbotContextService";

export default function FloatingAIChatbot({
  isOpen: propIsOpen,
  onClose,
  onOpen,
  initialQuery = "",
  onClearInitialQuery,
  sessionId = null,
  reportData = null,
  investigationMode: defaultMode = "UPLOAD_SESSION_WITH_GLOBAL_COMPARISON",
  dataOrigin = "CROSS_STORE (Session vs Global)",
  reportingPeriod = null,
  currentPage = "",
  apiBaseUrl = API_BASE_URL,
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen;

  // Resolve active upload session dynamically from URL, props, or persistent storage
  const effectiveSessionId = useMemo(() => {
    const match = (currentPage || (typeof window !== "undefined" ? window.location?.pathname : "") || "").match(/^\/upload\/(?:results|validate)\/([^/]+)/);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
    if (sessionId && sessionId !== "GLOBAL") {
      return sessionId;
    }
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gwc_active_upload_session") || localStorage.getItem("active_upload_session_id");
      if (saved && saved !== "GLOBAL") {
        return saved;
      }
    }
    return "83bc61af-e690-4c01-8386-5e8313147008";
  }, [sessionId, currentPage]);

  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastReportId, setLastReportId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeMode, setActiveMode] = useState(defaultMode);

  // Sync defaultMode when changed from parent
  useEffect(() => {
    if (defaultMode) {
      setActiveMode(defaultMode);
    }
  }, [defaultMode]);

  // Load scope metadata dynamically for current session
  const [scopeMeta, setScopeMeta] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchMetadata = async () => {
      try {
        const url = `${apiBaseUrl || "/api"}/investigation/scope-metadata${effectiveSessionId ? `?session_id=${encodeURIComponent(effectiveSessionId)}` : ""}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setScopeMeta(data);
        }
      } catch (err) {
        console.warn("Could not load scope metadata:", err);
      }
    };
    fetchMetadata();
    return () => { cancelled = true; };
  }, [effectiveSessionId, apiBaseUrl]);

  // Compute dynamic labels for scope selector
  const sessionPeriodLabel = useMemo(() => {
    if (scopeMeta?.session_period_label) return scopeMeta.session_period_label;
    if (scopeMeta?.dimensions?.periods?.length > 1) {
      return scopeMeta.dimensions.periods[1].label;
    }
    return reportingPeriod?.includes("Dec") ? "December 2026" : (reportingPeriod || "December 2026");
  }, [scopeMeta, reportingPeriod]);

  const crossPeriodLabel = useMemo(() => {
    if (sessionPeriodLabel.toLowerCase().includes("dec")) {
      return "Cross-Period Analysis (Dec 2026 vs Oct 2026)";
    }
    if (sessionPeriodLabel.toLowerCase().includes("nov")) {
      return "Cross-Period Analysis (Nov 2026 vs Oct 2026)";
    }
    return `Cross-Period Analysis (${sessionPeriodLabel} vs Baseline)`;
  }, [sessionPeriodLabel]);

  const currentDatasetLabel = useMemo(() => {
    return `Current Dataset (${sessionPeriodLabel})`;
  }, [sessionPeriodLabel]);

  // Persistent conversation history scoped by active session
  const storageKey = `gwc_floating_chat_${effectiveSessionId || "global"}`;

  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Re-sync messages and state when session changes
  useEffect(() => {
    try {
      const key = `gwc_floating_chat_${effectiveSessionId || "global"}`;
      const saved = sessionStorage.getItem(key);
      setMessages(saved ? JSON.parse(saved) : []);
      setLastReportId(null);
      setErrorMessage(null);
    } catch {
      setMessages([]);
    }
  }, [effectiveSessionId]);

  useEffect(() => {
    try {
      const key = `gwc_floating_chat_${effectiveSessionId || "global"}`;
      sessionStorage.setItem(key, JSON.stringify(messages));
    } catch (e) {
      console.warn("Could not persist chat history:", e);
    }
  }, [messages, effectiveSessionId]);

  // Handle external initialQuery (e.g. from table or drawer Ask AI buttons)
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      setInputMessage(initialQuery.trim());
      if (!isOpen) {
        if (onOpen) onOpen();
        else setInternalIsOpen(true);
      }
      setIsMinimized(false);
      if (onClearInitialQuery) onClearInitialQuery();
    }
  }, [initialQuery]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom on message update
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen, isMinimized]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Resolve unified application context across routes
  const appContext = useMemo(() => {
    return buildApplicationContext({
      pathname: currentPage || (typeof window !== "undefined" ? window.location?.pathname : ""),
      search: typeof window !== "undefined" ? window.location?.search : "",
      sessionId: effectiveSessionId,
      reportData,
      activeMode,
    });
  }, [currentPage, effectiveSessionId, reportData, activeMode]);

  const starterQuestions = useMemo(() => {
    return getStarterQuestions(appContext.page_id);
  }, [appContext.page_id]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    setErrorMessage(null);
    setInputMessage("");

    // Add user message to state
    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const endpoint = `${apiBaseUrl || "/api"}/investigation/ask`;

      // Extract conversation history for memory (last 6 turns)
      const recentHistory = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content || m.headline || "",
      }));

      const payload = {
        question: query,
        session_id: activeMode === "GLOBAL_ONLY" ? "GLOBAL" : effectiveSessionId,
        investigation_mode: activeMode,
        parent_report_id: lastReportId,
        page_context: appContext,
        conversation_history: recentHistory,
        reporting_period: appContext.reporting_period || "ALL",
        product_code: appContext.product_code || "All Products",
        plant_code: appContext.plant_code || "All Plants",
        line_code: appContext.line_code || "All Lines",
        data_origin: appContext.data_mode === "PRODUCTION" ? "REAL_COMMITTED_STORE" : "SYNTHETIC_TEST",
        scope_filters: {
          plant_code: appContext.plant_code || reportData?.scope?.plant_code,
          line_code: appContext.line_code || reportData?.scope?.line_code,
          product_code: appContext.product_code || reportData?.scope?.product_code,
          ...appContext.active_filters,
        },
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Server error (${response.status})`);
      }

      const data = await response.json();

      setLastReportId(data.report_id || null);

      // Deterministically sync UI mode with backend effective routing
      if (data.effective_mode) {
        setActiveMode(data.effective_mode);
      } else if (data.data_origin === "REAL_COMMITTED_STORE") {
        setActiveMode("GLOBAL_ONLY");
      } else if (data.data_origin === "SYNTHETIC_TEST") {
        setActiveMode("UPLOAD_SESSION_ONLY");
      } else if (data.data_origin && data.data_origin.includes("CROSS_STORE")) {
        setActiveMode("UPLOAD_SESSION_WITH_GLOBAL_COMPARISON");
      }

      const aiMsg = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        headline: cleanSymbols(data.headline || data.title),
        content: cleanSymbols(data.executive_summary || "Investigation completed."),
        findings: (data.findings || data.detailed_findings || []).map(sanitizeFinding),
        followUps: (data.follow_up_suggestions || []).map(cleanSymbols),
        intent: data.intent,
        dataOrigin: data.data_origin || dataOrigin,
        sourceMetadata: data.source_metadata || null,
        reportId: data.report_id,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Floating AI Chat error:", err);
      setErrorMessage(err.message || "Failed to reach AI investigator. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    setLastReportId(null);
    setErrorMessage(null);
    try {
      const key = `gwc_floating_chat_${effectiveSessionId || "global"}`;
      sessionStorage.removeItem(key);
      sessionStorage.removeItem("gwc_floating_chat_history");
    } catch { }
  };

  const handleToggleOpen = () => {
    if (isOpen) {
      if (onClose) onClose();
      else setInternalIsOpen(false);
    } else {
      if (onOpen) onOpen();
      else setInternalIsOpen(true);
      setIsMinimized(false);
    }
  };

  return (
    <aside aria-label="GWC Manufacturing AI Assistant" className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Chat Window */}
      {isOpen && !isMinimized && (
        <section
          aria-label="Chat conversation window"
          className="mb-3 w-[440px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[84vh] bg-white rounded-2xl shadow-[0_12px_40px_rgba(79,70,229,0.25)] border border-purple-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <header className="bg-gradient-to-r from-[#581c87] via-[#6f3dba] to-[#7c3aed] text-white px-4 py-3 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/20 shadow-2xs shrink-0">
                <Sparkles className="w-4 h-4 text-purple-200" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black tracking-tight truncate">GWC Manufacturing AI</h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Connected" />
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <select
                    value={activeMode}
                    onChange={(e) => setActiveMode(e.target.value)}
                    className="text-[9.5px] font-bold bg-white/15 hover:bg-white/25 text-purple-100 rounded px-1.5 py-0.5 border border-white/20 focus:outline-none cursor-pointer"
                    title="Select Investigation Routing Mode"
                  >
                    <option value="UPLOAD_SESSION_WITH_GLOBAL_COMPARISON" className="text-slate-800">
                      {crossPeriodLabel}
                    </option>
                    <option value="UPLOAD_SESSION_ONLY" className="text-slate-800">
                      {currentDatasetLabel}
                    </option>
                    <option value="GLOBAL_ONLY" className="text-slate-800">
                      Global Store (Historical Baseline)
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/80">
              <button
                onClick={handleResetChat}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Minimize chat"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleToggleOpen}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Close chat"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </header>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-purple-50/20 to-white">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col justify-between py-2">
                <div className="text-center space-y-2 mt-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#7c3aed] flex items-center justify-center mx-auto shadow-inner">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-800">
                    Manufacturing Intelligence Copilot
                  </h4>
                  <p className="text-xs text-slate-500 max-w-[280px] mx-auto leading-relaxed">
                    Ask questions grounded in committed fact tables and staged upload sessions.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                    {appContext.page_title} — Suggested Questions:
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {starterQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSendMessage(q)}
                        className="text-left py-2 px-3 rounded-xl bg-white hover:bg-purple-50 border border-slate-200/80 hover:border-purple-200 text-slate-700 hover:text-[#7c3aed] text-[11px] font-medium shadow-2xs transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <span className="truncate pr-2">{q}</span>
                        <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-[#7c3aed] shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
                >
                  {m.role === "user" ? (
                    <div className="max-w-[85%] p-3 rounded-2xl rounded-br-xs bg-[#7c3aed] text-white text-[11.5px] font-medium shadow-2xs leading-relaxed">
                      {cleanSymbols(m.content)}
                    </div>
                  ) : (
                    <div className="max-w-[94%] p-3.5 rounded-2xl rounded-bl-xs bg-white border border-purple-100 text-slate-800 text-[11.5px] shadow-2xs leading-relaxed space-y-2">
                      {m.headline && (
                        <div className="font-extrabold text-[#581c87] text-[12px] border-b border-purple-50 pb-1 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#7c3aed] shrink-0" />
                          <span>{cleanSymbols(m.headline)}</span>
                        </div>
                      )}

                      <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {cleanSymbols(m.content)}
                      </div>

                      {/* Itemized Findings if available */}
                      {m.findings && m.findings.length > 0 && (
                        <div className="space-y-1.5 pt-1 border-t border-purple-50">
                          {m.findings.map((f, idx) => (
                            <div key={idx} className="p-2 rounded-lg bg-purple-50/50 border border-purple-100/60 text-[11px]">
                              <p className="font-bold text-purple-950">{cleanSymbols(f.key_finding || f.finding || f.title)}</p>
                              {(f.evidence || f.narrative || f.detail) && (
                                <p className="text-[10px] text-slate-600 mt-0.5">{cleanSymbols(f.evidence || f.narrative || f.detail)}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Certified Origin & Store Metadata */}
                      <div className="flex flex-col gap-1 pt-1.5 border-t border-slate-100 text-[9.5px]">
                        <div className="flex items-center justify-between font-mono text-slate-400">
                          <span className="truncate pr-2 font-medium text-purple-700">
                            Certified: {m.sourceMetadata?.source_store || m.dataOrigin}
                          </span>
                          <span className="shrink-0">{m.timestamp}</span>
                        </div>
                        {m.sourceMetadata && (
                          <div className="flex flex-wrap items-center gap-1.5 text-[9px] text-slate-500 bg-slate-50 p-1.5 rounded-md border border-slate-100 font-mono">
                            {m.sourceMetadata.reporting_period && (
                              <span className="bg-purple-100/60 text-purple-800 px-1 py-0.5 rounded font-sans">
                                {m.sourceMetadata.reporting_period}
                              </span>
                            )}
                            {m.sourceMetadata.data_freshness && (
                              <span className="bg-emerald-50 text-emerald-700 px-1 py-0.5 rounded font-sans">
                                Freshness: {m.sourceMetadata.data_freshness}
                              </span>
                            )}
                            {m.sourceMetadata.calculation_method && (
                              <span className="bg-slate-100 text-slate-600 px-1 py-0.5 rounded font-sans truncate">
                                {m.sourceMetadata.calculation_method}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Follow-up suggestions */}
                      {m.followUps && m.followUps.length > 0 && (
                        <div className="pt-2 border-t border-purple-50/80 space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Suggested Follow-up:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {m.followUps.slice(0, 3).map((fQ) => (
                              <button
                                key={fQ}
                                onClick={() => handleSendMessage(fQ)}
                                className="px-2 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-[#7c3aed] text-[10.5px] font-semibold border border-purple-200/60 transition-all text-left truncate max-w-full cursor-pointer"
                              >
                                {cleanSymbols(fQ)}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <span className="text-[9px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
                </div>
              ))
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-purple-100 shadow-2xs max-w-[85%] self-start text-xs text-purple-900">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#7c3aed]" />
                <span className="font-medium text-[11px]">Computing deterministic evidence...</span>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] self-stretch">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">{errorMessage}</p>
                  <button
                    onClick={() => handleSendMessage()}
                    className="mt-1 text-[10.5px] font-bold text-rose-700 underline hover:text-rose-900 cursor-pointer"
                  >
                    Retry Question
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <footer className="p-3 border-t border-purple-100 bg-white">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask about costs, products, lines, yield..."
                disabled={isLoading}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1.5 focus:ring-[#7c3aed] focus:bg-white transition-all disabled:opacity-50"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                className="w-9 h-9 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-40 text-white flex items-center justify-center shadow-xs transition-all cursor-pointer shrink-0"
                title="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </footer>
        </section>
      )}

      {/* Minimized Pill Bar */}
      {isOpen && isMinimized && (
        <div
          onClick={() => setIsMinimized(false)}
          className="mb-3 px-3 py-2 rounded-2xl bg-gradient-to-r from-[#6f3dba] to-[#7c3aed] text-white shadow-xl flex items-center gap-2.5 cursor-pointer hover:shadow-2xl transition-all animate-in fade-in"
        >
          <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
          <span className="text-xs font-bold">GWC Manufacturing AI (Active)</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>
      )}

      {/* Fixed Circular Launcher Button */}
      <button
        onClick={handleToggleOpen}
        className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#581c87] via-[#6f3dba] to-[#7c3aed] hover:from-[#4c1d95] hover:to-[#6d28d9] text-white shadow-[0_6px_24px_rgba(111,61,186,0.38)] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group"
        title="Ask GWC AI"
      >
        {isOpen && !isMinimized ? (
          <X className="w-6 h-6 stroke-[2.2]" />
        ) : (
          <>
            <Bot className="w-7 h-7 stroke-[2] transition-transform duration-300 group-hover:rotate-6" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
            </span>
          </>
        )}
      </button>
    </aside>
  );
}
