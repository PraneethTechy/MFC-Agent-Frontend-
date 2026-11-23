import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  AlertCircle,
  PlusCircle,
  Clock,
  Layers,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export default function ManufacturingChat() {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedTraces, setExpandedTraces] = useState({});

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load conversation list on mount
  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/chat/conversations`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
        if (data.length > 0 && !activeConversationId) {
          loadConversation(data[0].id);
        }
      }
    } catch (err) {
      console.warn("Failed to load conversations:", err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Load messages for a conversation
  const loadConversation = async (convId) => {
    setActiveConversationId(convId);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/chat/conversations/${convId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      setError("Failed to load conversation history.");
    }
  };

  // Start a new investigation conversation
  const startNewConversation = () => {
    setActiveConversationId(null);
    setMessages([]);
    setError(null);
  };

  // Send question to agent
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    setInputMessage("");
    setError(null);

    // Optimistically add user message
    const tempUserMsg = {
      id: Date.now(),
      role: "user",
      content: userText,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: activeConversationId,
          message: userText,
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
      setError(err.message || "Failed to reach AI Cost Investigator.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTrace = (msgId, stepIdx) => {
    const key = `${msgId}-${stepIdx}`;
    setExpandedTraces((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const samplePrompts = [
    "What is our total actual manufacturing cost across all plants?",
    "Why is material cost our largest cost contributor?",
    "Compare standard versus actual costs and show our variance breakdown.",
    "Perform a variance investigation for plant IN-KA-01.",
    "Validate our manufacturing datasets and disclose cost coverage.",
  ];

  return (
    <div className="flex h-[calc(100vh-140px)] border border-page-border rounded-xl bg-page-surface shadow-subtle overflow-hidden">
      {/* Left Sidebar: Conversations */}
      <aside className="w-72 border-r border-page-border bg-page-bg/40 flex flex-col shrink-0">
        <div className="p-3 border-b border-page-border flex items-center justify-between">
          <span className="text-xs font-bold text-ink-primary uppercase tracking-wider">
            Investigations
          </span>
          <button
            onClick={startNewConversation}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-brand-purple text-white hover:opacity-90 cursor-pointer shadow-sm transition-all"
            title="Start new investigation"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-xs text-ink-secondary">
              No previous investigations.
            </div>
          ) : (
            conversations.map((c) => {
              const isActive = c.id === activeConversationId;
              return (
                <button
                  key={c.id}
                  onClick={() => loadConversation(c.id)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex flex-col gap-1 cursor-pointer ${
                    isActive
                      ? "bg-brand-purple/10 border border-brand-purple/30 text-brand-purple font-semibold shadow-xs"
                      : "hover:bg-page-bg text-ink-secondary hover:text-ink-primary border border-transparent"
                  }`}
                >
                  <div className="truncate font-medium text-ink-primary">
                    {c.title || "Untitled Session"}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-ink-secondary/70">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(c.created_at).toLocaleDateString()}
                    </span>
                    <span>{c.message_count} msg</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Accounting governance footer badge */}
        <div className="p-3 border-t border-page-border bg-page-surface/60 text-[10px] text-ink-secondary space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-ink-primary">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-purple" />
            <span>Accounting Controls</span>
          </div>
          <div>Overhead: <strong className="text-amber-500">NOT_AVAILABLE</strong></div>
          <div>Standards: <strong className="text-amber-500">UNVERIFIED</strong></div>
          <div>Quality: <strong className="text-amber-500">UNRESOLVED_LINEAGE</strong></div>
        </div>
      </aside>

      {/* Right Main Area: Chat & Traces */}
      <main className="flex-1 flex flex-col bg-page-surface overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto py-12">
              <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mb-4 shadow-subtle">
                <Sparkles className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-ink-primary mb-1">
                Manufacturing Cost AI Investigator
              </h2>
              <p className="text-xs text-ink-secondary mb-6 leading-relaxed">
                Ask analytical questions across Material, Labour, Machine, Energy, and Scrap & Rework.
                Backed by 5,000 live Neon cost batches and deterministic Python financial models.
              </p>

              <div className="w-full space-y-2 text-left">
                <span className="text-[11px] font-bold text-ink-secondary uppercase tracking-wider block">
                  Suggested Investigations:
                </span>
                {samplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputMessage(prompt);
                    }}
                    className="w-full p-2.5 rounded-lg border border-page-border hover:border-brand-purple/40 bg-page-bg/50 hover:bg-page-bg text-xs text-ink-primary text-left transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <span>{prompt}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-brand-purple transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, idx) => {
            const isUser = m.role === "user";
            return (
              <div
                key={m.id || idx}
                className={`flex gap-3.5 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-brand-purple text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-3xl space-y-2 ${isUser ? "items-end" : "items-start"}`}>
                  <div
                    className={`p-4 rounded-xl text-xs leading-relaxed ${
                      isUser
                        ? "bg-brand-purple text-white shadow-sm"
                        : "bg-page-bg border border-page-border text-ink-primary shadow-xs"
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans">{m.content}</div>
                  </div>

                  {/* Render Tool Trace Steps for Assistant Messages */}
                  {!isUser && m.steps && m.steps.length > 0 && (
                    <div className="w-full border border-page-border rounded-lg bg-page-bg/60 p-2.5 text-[11px] space-y-1.5">
                      <div className="flex items-center justify-between text-ink-secondary font-semibold">
                        <span className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-brand-purple" />
                          Deterministic Tool Executions ({m.steps.length})
                        </span>
                        <span className="text-[10px] text-emerald-600 font-mono">
                          Python Engine Verified
                        </span>
                      </div>

                      {m.steps.map((trace, sIdx) => {
                        const isExpanded = !!expandedTraces[`${m.id}-${sIdx}`];
                        return (
                          <div
                            key={sIdx}
                            className="border border-page-border/70 rounded bg-page-surface p-2 text-[11px]"
                          >
                            <button
                              onClick={() => toggleTrace(m.id, sIdx)}
                              className="w-full flex items-center justify-between font-mono font-semibold text-ink-primary cursor-pointer hover:text-brand-purple"
                            >
                              <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                Step {trace.step || sIdx + 1}: {trace.tool}
                              </span>
                              {isExpanded ? (
                                <ChevronDown className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {isExpanded && (
                              <div className="mt-2 pt-2 border-t border-page-border font-mono text-[10px] text-ink-secondary space-y-1 overflow-x-auto">
                                <div>
                                  <strong className="text-ink-primary">Input:</strong>{" "}
                                  {JSON.stringify(trace.input || {})}
                                </div>
                                <div>
                                  <strong className="text-ink-primary">Result:</strong>
                                  <pre className="p-2 mt-1 rounded bg-page-bg overflow-x-auto text-ink-primary">
                                    {JSON.stringify(trace.result || {}, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-page-bg border border-page-border text-ink-primary flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3.5 items-start">
              <div className="w-8 h-8 rounded-lg bg-brand-purple text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-xl bg-page-bg border border-page-border text-xs text-ink-secondary flex items-center gap-2.5">
                <Loader2 className="w-4 h-4 animate-spin text-brand-purple" />
                <span>Investigating Neon datasets with Domo AI & Python cost engine...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-page-border bg-page-surface">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask a manufacturing cost question (e.g. 'What is our total actual cost across all plants?')..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-page-border bg-page-bg text-ink-primary focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="px-4 py-2.5 rounded-xl bg-brand-purple text-white font-semibold text-xs flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Investigate</span>
            </button>
          </form>
          <div className="mt-2 text-[10px] text-ink-secondary text-center">
            Python computes all financial totals · Domo AI analyzes evidence · Overhead: NOT_AVAILABLE
          </div>
        </div>
      </main>
    </div>
  );
}

