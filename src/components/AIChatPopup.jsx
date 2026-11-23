import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  User,
  X,
  Minus,
  Maximize2,
  Send,
  Sparkles,
  Plus,
  Clock,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  RefreshCw,
  Search,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Layers,
  ShieldCheck,
} from "lucide-react";

export default function AIChatPopup({
  isOpen,
  onClose,
  initialQuery = "",
  onClearInitialQuery,
  apiBaseUrl = "/api",
}) {
  const [minimized, setMinimized] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [historySearch, setHistorySearch] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const [expandedTraces, setExpandedTraces] = useState({});
  const [domoStatus, setDomoStatus] = useState("checking"); // 'ready', 'unconfigured', 'checking'

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const popupRef = useRef(null);

  // Scroll to bottom whenever messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, showHistory]);

  // Focus input when opened and not minimized
  useEffect(() => {
    if (isOpen && !minimized && !showHistory) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, minimized, showHistory]);

  // Check backend health for verified Domo status
  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch(`${apiBaseUrl}/health`);
        if (res.ok) {
          const data = await res.json();
          if (data?.domo?.configured) {
            setDomoStatus("ready");
          } else {
            setDomoStatus("unconfigured");
          }
        }
      } catch (e) {
        setDomoStatus("unconfigured");
      }
    }
    checkHealth();
  }, [apiBaseUrl]);

  // Load conversation history list from backend
  const fetchConversations = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/chat/conversations`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data || []);
      }
    } catch (err) {
      console.warn("Failed to load conversations:", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen]);

  // Load specific conversation messages
  const loadConversation = async (convId) => {
    setActiveConversationId(convId);
    setShowHistory(false);
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${apiBaseUrl}/chat/conversations/${convId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      } else {
        throw new Error("Failed to load conversation history");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Start fresh conversation
  const handleNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
    setError(null);
    setShowHistory(false);
    setInputMessage("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Handle prefilled query from global search
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      setMinimized(false);
      sendMessage(initialQuery.trim());
      if (onClearInitialQuery) onClearInitialQuery();
    }
  }, [initialQuery]);

  // Send message to AI Agent
  const sendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setInputMessage("");
    setError(null);

    // Optimistic user message
    const tempUserMsg = {
      id: Date.now(),
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      const res = await fetch(`${apiBaseUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: activeConversationId,
          message: text,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Server returned ${res.status}`);
      }

      const data = await res.json();
      setActiveConversationId(data.conversation_id);

      const assistantMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.message,
        steps: data.tool_traces,
        metadata: data.metadata,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      fetchConversations();
    } catch (err) {
      setError(err.message || "Failed to reach Manufacturing AI Agent.");
      // Keep user message in draft for retry
      setInputMessage(text);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
    if (e.key === "Escape" && !showHistory) {
      onClose();
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const toggleTrace = (key) => {
    setExpandedTraces((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Supported Suggested Questions
  const suggestedQuestions = [
    "Give me the overall manufacturing cost summary.",
    "Which product has the highest material expenditure?",
    "Compare manufacturing costs across products.",
    "Investigate the major contributors to material cost.",
    "Show me the uncosted production records.",
    "Explain the current cost coverage.",
  ];

  // Filter conversations for search in history drawer
  const filteredConversations = conversations.filter((c) =>
    (c.title || "").toLowerCase().includes(historySearch.toLowerCase())
  );

  if (!isOpen) return null;

  // MINIMIZED STATE: Sleek floating pill at bottom-right
  if (minimized) {
    return (
      <div
        onClick={() => setMinimized(false)}
        className="fixed bottom-4 right-4 sm:right-6 w-72 h-12 rounded-2xl bg-gradient-to-r from-[#251545] to-[#1a0e33] text-white shadow-2xl border border-purple-500/30 flex items-center justify-between px-3.5 z-50 cursor-pointer hover:scale-102 transition-all select-none"
        title="Restore AI Assistant"
      >
        <div className="flex items-center gap-2.5 truncate">
          <div className="w-6 h-6 rounded-lg bg-white/15 flex items-center justify-center text-white">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold tracking-tight truncate">
            Manufacturing AI Assistant
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-purple-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMinimized(false);
            }}
            className="p-1 rounded-md hover:bg-white/10 hover:text-white transition-colors"
            title="Restore window"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1 rounded-md hover:bg-white/10 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // EXPANDED POPUP STATE
  return (
    <div
      ref={popupRef}
      className="fixed inset-x-2 bottom-2 top-16 sm:inset-auto sm:top-16 sm:right-6 w-auto sm:w-[460px] h-[calc(100vh-5rem)] max-h-[640px] bg-white rounded-2xl shadow-2xl border border-purple-100 flex flex-col z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 select-none"
    >
      {/* 1. CHAT POPUP HEADER */}
      <div className="px-4 py-3 bg-gradient-to-r from-[#251545] via-[#21143f] to-[#1a0e33] text-white flex items-center justify-between shrink-0 shadow-sm">
        {/* Left: AI Icon & Brand Header */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-white shrink-0 shadow-inner">
            <Bot className="w-4.5 h-4.5 stroke-[2]" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold tracking-tight text-white leading-tight">
                Manufacturing AI Assistant
              </h3>
              {/* Verified Status Pill */}
              <span
                className={`w-2 h-2 rounded-full ${
                  domoStatus === "ready"
                    ? "bg-emerald-400"
                    : domoStatus === "checking"
                    ? "bg-amber-400 animate-pulse"
                    : "bg-slate-400"
                }`}
                title={
                  domoStatus === "ready"
                    ? "Domo AI Text Generation Ready"
                    : "Connecting to Domo AI Services"
                }
              />
            </div>
            <p className="text-[10px] text-purple-200/80 truncate leading-none mt-0.5">
              Your manufacturing cost intelligence partner
            </p>
          </div>
        </div>

        {/* Right: Window Controls */}
        <div className="flex items-center gap-1 shrink-0 text-purple-200">
          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
            title="Start new investigation"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* History Drawer Toggle */}
          <button
            onClick={() => setShowHistory((prev) => !prev)}
            className={`p-1.5 rounded-lg transition-colors ${
              showHistory
                ? "bg-white/20 text-white"
                : "hover:bg-white/10 hover:text-white"
            }`}
            title="Investigation history"
          >
            <Clock className="w-4 h-4" />
          </button>

          {/* Minimize Button */}
          <button
            onClick={() => setMinimized(true)}
            className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
            title="Minimize popup"
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
            title="Close popup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. CHAT BODY CONTAINER (Conversation or History Drawer) */}
      <div className="flex-1 min-h-0 relative flex overflow-hidden bg-white">
        {/* =====================================================================
            CONVERSATION HISTORY DRAWER (Slides over or switches view)
            ===================================================================== */}
        {showHistory ? (
          <div className="absolute inset-0 bg-white z-20 flex flex-col animate-in fade-in slide-in-from-left-4 duration-150">
            {/* History Header & Search */}
            <div className="p-3 border-b border-purple-100 flex items-center justify-between gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Search past investigations..."
                  className="w-full pl-8 pr-3 py-1 text-xs bg-slate-50 border border-purple-100/70 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400"
                />
              </div>
              <button
                onClick={handleNewChat}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#6f3dba] text-white hover:bg-[#5e299e] transition-colors shrink-0 flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3 h-3" />
                <span>New</span>
              </button>
            </div>

            {/* Conversation List from Neon PostgreSQL */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-50">
              {filteredConversations.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  <p>No past conversations found.</p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isActive = conv.id === activeConversationId;
                  const dateStr = conv.created_at
                    ? new Date(conv.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "";

                  return (
                    <button
                      key={conv.id}
                      onClick={() => loadConversation(conv.id)}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex flex-col gap-0.5 cursor-pointer ${
                        isActive
                          ? "bg-purple-50/80 border border-purple-200/80 text-[#6f3dba]"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold truncate">
                          {conv.title || "Manufacturing Cost Investigation"}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {dateStr}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span>{conv.message_count || 0} messages</span>
                        {isActive && (
                          <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-700 font-semibold text-[9px]">
                            Active
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Close History Drawer Footer */}
            <div className="p-2 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowHistory(false)}
                className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Back to Chat
              </button>
            </div>
          </div>
        ) : null}

        {/* =====================================================================
            MAIN CONVERSATION MESSAGE AREA
            ===================================================================== */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 select-text">
          {/* Welcome State when conversation is empty */}
          {messages.length === 0 ? (
            <div className="py-4 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-[#6f3dba] shadow-inner">
                <Bot className="w-6 h-6 stroke-[2]" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                  Hello! I'm your Manufacturing AI Assistant.
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
                  I can help you understand manufacturing costs, investigate
                  variances, identify cost drivers and explore improvement
                  opportunities.
                </p>
              </div>

              {/* Supported Suggested Questions */}
              <div className="w-full space-y-1.5 pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left px-1">
                  Suggested Investigations
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(q)}
                      className="text-left p-2.5 rounded-xl border border-purple-100/80 bg-white hover:bg-purple-50/60 hover:border-purple-300 text-xs text-slate-700 font-medium transition-all shadow-xs flex items-center justify-between group cursor-pointer"
                    >
                      <span className="truncate pr-2">{q}</span>
                      <Sparkles className="w-3.5 h-3.5 text-purple-400 group-hover:text-[#6f3dba] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg, i) => {
              const isUser = msg.role === "user";
              const traceKey = `trace-${msg.id || i}`;
              const isTraceExpanded = expandedTraces[traceKey];

              return (
                <div
                  key={msg.id || i}
                  className={`flex flex-col ${
                    isUser ? "items-end" : "items-start"
                  } space-y-1`}
                >
                  {/* Sender label & avatar indicator */}
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 px-1">
                    {isUser ? (
                      <>
                        <span>You</span>
                        <User className="w-3 h-3 text-purple-600" />
                      </>
                    ) : (
                      <>
                        <Bot className="w-3 h-3 text-[#6f3dba]" />
                        <span className="font-semibold text-slate-600">
                          AI Investigator
                        </span>
                      </>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[88%] rounded-2xl text-xs sm:text-[13px] leading-relaxed p-3.5 shadow-xs relative group ${
                      isUser
                        ? "bg-[#6f3dba] text-white rounded-tr-xs shadow-purple-600/10 font-medium"
                        : "bg-white border border-purple-100/80 text-slate-800 rounded-tl-xs shadow-xs"
                    }`}
                  >
                    {/* Render content cleanly with paragraph breaks */}
                    <div className="whitespace-pre-wrap break-words leading-relaxed">
                      {msg.content}
                    </div>

                    {/* Copy action for assistant response */}
                    {!isUser && (
                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="text-[9px]">
                          Evidence-backed analysis
                        </span>
                        <button
                          onClick={() => copyToClipboard(msg.content, msg.id || i)}
                          className="hover:text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                          title="Copy response"
                        >
                          {copiedMsgId === (msg.id || i) ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600 font-semibold">
                                Copied
                              </span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Tool Execution Transparency Pill */}
                  {!isUser && msg.steps && msg.steps.length > 0 && (
                    <div className="w-[88%] mt-1">
                      <button
                        onClick={() => toggleTrace(traceKey)}
                        className="px-2 py-1 rounded-md bg-purple-50/80 hover:bg-purple-100/70 border border-purple-100 text-[10px] font-semibold text-purple-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-purple-600" />
                        <span>Analysis Steps ({msg.steps.length})</span>
                        {isTraceExpanded ? (
                          <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ChevronRight className="w-3 h-3" />
                        )}
                      </button>

                      {/* Expanded Analysis Steps Details */}
                      {isTraceExpanded && (
                        <div className="mt-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-700 space-y-1.5 animate-in fade-in duration-100">
                          {msg.steps.map((st, sIdx) => (
                            <div
                              key={sIdx}
                              className="p-1.5 rounded-lg bg-white border border-slate-100 text-[10px]"
                            >
                              <div className="flex items-center justify-between font-bold text-purple-900">
                                <span className="font-mono">
                                  {st.tool || st.action || "Cost Engine Tool"}
                                </span>
                                <span className="text-emerald-600 font-semibold text-[9px]">
                                  Completed
                                </span>
                              </div>
                              {st.tool_input && (
                                <p className="text-slate-500 font-mono text-[9px] mt-0.5 truncate">
                                  Args: {JSON.stringify(st.tool_input)}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Thinking / Loading indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs py-2 px-1">
              <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center text-[#6f3dba] animate-pulse">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium animate-pulse text-[11px]">
                Investigating manufacturing cost ledger...
              </span>
            </div>
          )}

          {/* Error Banner with Retry */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{error}</p>
                <button
                  onClick={() => sendMessage()}
                  className="mt-1 text-[11px] font-bold text-rose-800 underline hover:no-underline cursor-pointer"
                >
                  Retry Request
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 3. CHAT MESSAGE COMPOSER */}
      <div className="p-3 border-t border-slate-100 bg-white shrink-0">
        <div className="relative flex items-end gap-2 bg-slate-50 border border-slate-200/90 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-purple-400/30 focus-within:bg-white focus-within:border-purple-400 transition-all">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about manufacturing costs..."
            rows={1}
            disabled={isLoading}
            className="flex-1 max-h-24 resize-none bg-transparent text-xs sm:text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none p-1 leading-normal"
          />

          <button
            onClick={() => sendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
              inputMessage.trim() && !isLoading
                ? "bg-[#6f3dba] hover:bg-[#5e299e] text-white shadow-sm shadow-purple-600/30 scale-102"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
            title="Send message (Enter)"
          >
            <Send className="w-3.5 h-3.5 stroke-[2.2]" />
          </button>
        </div>

        {/* Governance Disclaimer */}
        <p className="text-[9px] text-slate-400 text-center mt-1.5 leading-tight">
          AI-generated analysis should be reviewed against supporting evidence.
        </p>
      </div>
    </div>
  );
}

