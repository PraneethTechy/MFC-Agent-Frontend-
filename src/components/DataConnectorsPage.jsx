import React, { useState, useEffect, useMemo } from "react";
import {
  Database,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  Server,
  Lock,
  Eye,
  EyeOff,
  Table,
  Check,
  ChevronDown,
  X,
  Search,
  ExternalLink,
  Activity,
  Cpu,
  Boxes,
  HelpCircle,
  Trash2,
  Zap,
} from "lucide-react";

// The 7 canonical manufacturing data families defined in the system
const MANUFACTURING_FAMILIES = [
  {
    id: "MANUFACTURING_COST",
    label: "Manufacturing Cost Batches",
    description: "Direct batch costs, material/labor/machine breakdown, output quantities",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: "HOURLY_PRODUCTION",
    label: "Hourly Production Logs",
    description: "Operational shopfloor output, actual/target quantities, operational status",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "BOM_COMPONENT",
    label: "BOM & Component Standards",
    description: "Bill of materials, standard quantities per unit, component specifications",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    id: "MATERIAL_PURCHASE",
    label: "Material Purchases & Invoices",
    description: "PO line items, supplier contracted prices, invoice unit rates",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: "MATERIAL_CONSUMPTION",
    label: "Material Consumption Actuals",
    description: "Actual component issuance, lot usage vs standard BOM tolerances",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    id: "QUALITY_INSPECTION",
    label: "Quality Inspection Logs",
    description: "First-pass inspection results, defect classification, pass/fail yields",
    badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
  },
  {
    id: "QUALITY_REWORK_EVENTS",
    label: "Quality Rework & Scrap Events",
    description: "Defect disposition, rework cost hours, scrapped assembly records",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    id: "UNMAPPED",
    label: "Unmapped / Auxiliary Table",
    description: "Non-manufacturing auxiliary table or system audit log",
    badgeColor: "bg-slate-100 text-slate-600 border-slate-200",
  },
];

const DEFAULT_CATALOG = [
  {
    id: "postgresql",
    name: "PostgreSQL",
    connector_type: "POSTGRESQL",
    status: "AVAILABLE",
    is_available: true,
    description:
      "Connect directly to on-premises or cloud PostgreSQL databases, including AWS RDS, Aurora, Neon, Azure Database for PostgreSQL, and GCP Cloud SQL.",
  },
  {
    id: "sqlserver",
    name: "Microsoft SQL Server",
    connector_type: "SQLSERVER",
    status: "AVAILABLE",
    is_available: true,
    description:
      "Connect to enterprise Microsoft SQL Server and Azure SQL instances for shopfloor telemetry and ERP sync.",
  },
  {
    id: "mysql",
    name: "MySQL",
    connector_type: "MYSQL",
    status: "AVAILABLE",
    is_available: true,
    description:
      "Connect to MySQL and MariaDB transactional manufacturing replicas and MES databases.",
  },
  {
    id: "snowflake",
    name: "Snowflake",
    connector_type: "SNOWFLAKE",
    status: "AVAILABLE",
    is_available: true,
    description:
      "Connect to cloud data warehouse storage in Snowflake for enterprise-wide analytical modeling.",
  },
];

export default function DataConnectorsPage({
  apiBaseUrl = "/api",
  onNavigate,
  onOpenAIChat,
}) {
  // State for connectors list
  const [connectors, setConnectors] = useState([]);
  const [catalog, setCatalog] = useState(DEFAULT_CATALOG);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Testing status map by connector id: { [id]: { testing: bool, latency: number, message: string, success: bool } }
  const [testStatusMap, setTestStatusMap] = useState({});

  // Add Data Source Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newConnectorType, setNewConnectorType] = useState("postgresql");
  const [newFormData, setNewFormData] = useState({
    name: "",
    host: "",
    port: 5432,
    database_name: "",
    username: "",
    password: "",
    ssl_mode: "require",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [modalTesting, setModalTesting] = useState(false);
  const [modalTestResult, setModalTestResult] = useState(null);
  const [modalSaving, setModalSaving] = useState(false);
  const [modalError, setModalError] = useState(null);

  // Schema & Mapping Discovery Drawer/Modal state
  const [selectedConnectorForMapping, setSelectedConnectorForMapping] = useState(null);
  const [schemas, setSchemas] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState("public");
  const [discoveredTables, setDiscoveredTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const [tableSearch, setTableSearch] = useState("");
  const [tableFilter, setTableFilter] = useState("all"); // 'all' | 'mapped' | 'unmapped'
  const [draftMappings, setDraftMappings] = useState({});
  const [savingMappings, setSavingMappings] = useState(false);

  // Column inspection modal state
  const [inspectingTable, setInspectingTable] = useState(null);
  const [tableColumns, setTableColumns] = useState([]);
  const [loadingColumns, setLoadingColumns] = useState(false);

  // Show auto-dismiss notifications
  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  // 1. Fetch connectors and catalog
  const fetchData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const [connRes, catRes] = await Promise.all([
        fetch(`${apiBaseUrl}/connectors`),
        fetch(`${apiBaseUrl}/connectors/catalog`),
      ]);

      if (!connRes.ok) throw new Error(`Failed to load connectors (${connRes.status})`);
      if (!catRes.ok) throw new Error(`Failed to load connector catalog (${catRes.status})`);

      const connData = await connRes.json();
      const catData = await catRes.json();

      setConnectors(Array.isArray(connData) ? connData : []);
      setCatalog(Array.isArray(catData) ? catData : []);
    } catch (err) {
      console.error("Error loading connectors:", err);
      setError(err.message || "Failed to load data connectors.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiBaseUrl]);

  // 2. Test an existing connector
  const handleTestExistingConnector = async (connectorId) => {
    setTestStatusMap((prev) => ({
      ...prev,
      [connectorId]: { testing: true, latency: null, message: null, success: null },
    }));

    try {
      const res = await fetch(`${apiBaseUrl}/connectors/${connectorId}/test`);
      const result = await res.json();

      setTestStatusMap((prev) => ({
        ...prev,
        [connectorId]: {
          testing: false,
          latency: result.latency_ms,
          message: result.message,
          success: result.success,
        },
      }));

      // Update the connector's local status badge
      setConnectors((prev) =>
        prev.map((c) =>
          c.id === connectorId
            ? {
                ...c,
                status: result.status,
                last_tested_at: result.tested_at,
                last_error: result.success ? null : result.message,
              }
            : c
        )
      );

      if (result.success) {
        showToast(
          `Connection verified (${result.latency_ms} ms) • ${result.server_version || "PostgreSQL Ready"}`,
          "success"
        );
      } else {
        showToast(`Connection failed: ${result.message}`, "error");
      }
    } catch (err) {
      setTestStatusMap((prev) => ({
        ...prev,
        [connectorId]: {
          testing: false,
          latency: null,
          message: err.message,
          success: false,
        },
      }));
      showToast(`Ping failed: ${err.message}`, "error");
    }
  };

  // 3. Test form credentials before saving in Add Modal
  const handleTestModalConnection = async () => {
    setModalTesting(true);
    setModalTestResult(null);
    setModalError(null);

    try {
      const payload = {
        connector_type: newConnectorType,
        host: newFormData.host.trim(),
        port: parseInt(newFormData.port, 10) || 5432,
        database_name: newFormData.database_name.trim(),
        username: newFormData.username.trim(),
        password: newFormData.password,
        ssl_mode: newFormData.ssl_mode,
      };

      const res = await fetch(`${apiBaseUrl}/connectors/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      setModalTestResult(result);

      if (!result.success) {
        setModalError(result.message);
      }
    } catch (err) {
      setModalError(err.message || "Failed to reach backend test endpoint.");
    } finally {
      setModalTesting(false);
    }
  };

  // 4. Save new connector
  const handleSaveConnector = async (e) => {
    e.preventDefault();
    if (!newFormData.name.trim() || !newFormData.host.trim() || !newFormData.database_name.trim()) {
      setModalError("Please provide Connection Name, Host, and Database Name.");
      return;
    }

    setModalSaving(true);
    setModalError(null);

    try {
      const payload = {
        name: newFormData.name.trim(),
        connector_type: newConnectorType,
        host: newFormData.host.trim(),
        port: parseInt(newFormData.port, 10) || 5432,
        database_name: newFormData.database_name.trim(),
        username: newFormData.username.trim(),
        password: newFormData.password,
        ssl_mode: newFormData.ssl_mode,
        is_active: true,
      };

      const res = await fetch(`${apiBaseUrl}/connectors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || `Failed to create connector (${res.status})`);
      }

      const created = await res.json();
      showToast(`Connector "${created.name}" created and encrypted successfully!`, "success");
      setIsAddModalOpen(false);
      resetAddForm();
      fetchData(true);
    } catch (err) {
      setModalError(err.message || "Failed to save connector.");
    } finally {
      setModalSaving(false);
    }
  };

  const resetAddForm = (typeId = "postgresql") => {
    const defaultPorts = {
      postgresql: 5432,
      sqlserver: 1433,
      mysql: 3306,
      snowflake: 443,
    };
    setNewConnectorType(typeId);
    setNewFormData({
      name: "",
      host: "",
      port: defaultPorts[typeId] || 5432,
      database_name: "",
      username: "",
      password: "",
      ssl_mode: "require",
    });
    setModalTestResult(null);
    setModalError(null);
  };

  // 5. Delete custom connector
  const handleDeleteConnector = async (connectorId, connectorName) => {
    if (!window.confirm(`Are you sure you want to disconnect and delete "${connectorName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`${apiBaseUrl}/connectors/${connectorId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || "Failed to delete connector.");
      }
      showToast(`Connector "${connectorName}" deleted.`, "success");
      setConnectors((prev) => prev.filter((c) => c.id !== connectorId));
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // 6. Open Schema & Table Mapping Drawer
  const handleOpenMapping = async (connector) => {
    setSelectedConnectorForMapping(connector);
    setLoadingTables(true);
    setDraftMappings({});

    try {
      // 1. Fetch schemas
      const schemaRes = await fetch(`${apiBaseUrl}/connectors/${connector.id}/schemas`);
      const schemaData = await schemaRes.json();
      const rawList = Array.isArray(schemaData) && schemaData.length > 0 ? schemaData : ["public"];
      const schemaList = rawList.map((s) => (typeof s === "object" && s !== null ? s.schema_name : s));
      setSchemas(schemaList);

      const activeSchema = schemaList.includes("public") ? "public" : schemaList[0];
      setSelectedSchema(activeSchema);

      // 2. Fetch tables for that schema
      await fetchTablesForSchema(connector.id, activeSchema);
    } catch (err) {
      showToast(`Failed to discover schema: ${err.message}`, "error");
    } finally {
      setLoadingTables(false);
    }
  };

  const fetchTablesForSchema = async (connectorId, schemaName) => {
    setLoadingTables(true);
    try {
      const res = await fetch(
        `${apiBaseUrl}/connectors/${connectorId}/tables?schema=${encodeURIComponent(schemaName)}`
      );
      if (!res.ok) throw new Error(`Table discovery failed (${res.status})`);
      const tables = await res.json();
      setDiscoveredTables(Array.isArray(tables) ? tables : []);

      // Initialize draft mappings from existing mappings or suggested families
      const initialDraft = {};
      if (Array.isArray(tables)) {
        tables.forEach((t) => {
          if (t.suggested_family) {
            initialDraft[t.table_name] = t.suggested_family;
          }
        });
      }
      setDraftMappings(initialDraft);
    } catch (err) {
      showToast(`Failed to fetch tables for schema ${schemaName}: ${err.message}`, "error");
    } finally {
      setLoadingTables(false);
    }
  };

  // 7. Save Mappings
  const handleSaveMappings = async () => {
    if (!selectedConnectorForMapping) return;
    setSavingMappings(true);

    try {
      const res = await fetch(
        `${apiBaseUrl}/connectors/${selectedConnectorForMapping.id}/mappings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ table_mappings: draftMappings }),
        }
      );

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || "Failed to save table mappings.");
      }

      showToast("Manufacturing table mappings saved successfully!", "success");
      // Refresh tables view
      await fetchTablesForSchema(selectedConnectorForMapping.id, selectedSchema);
      // Refresh main connector list to update mapped_tables_count
      fetchData(true);
    } catch (err) {
      showToast(`Save failed: ${err.message}`, "error");
    } finally {
      setSavingMappings(false);
    }
  };

  // 8. Inspect Table Columns
  const handleInspectColumns = async (tableName) => {
    if (!selectedConnectorForMapping) return;
    setInspectingTable(tableName);
    setLoadingColumns(true);
    try {
      const res = await fetch(
        `${apiBaseUrl}/connectors/${selectedConnectorForMapping.id}/tables/${encodeURIComponent(
          tableName
        )}/columns?schema=${encodeURIComponent(selectedSchema)}`
      );
      if (!res.ok) throw new Error(`Failed to load columns (${res.status})`);
      const cols = await res.json();
      setTableColumns(Array.isArray(cols) ? cols : []);
    } catch (err) {
      showToast(`Failed to load columns: ${err.message}`, "error");
      setTableColumns([]);
    } finally {
      setLoadingColumns(false);
    }
  };

  // Filtered tables for discovery view
  const filteredDiscoveredTables = useMemo(() => {
    return discoveredTables.filter((t) => {
      const matchesSearch =
        !tableSearch ||
        t.table_name.toLowerCase().includes(tableSearch.toLowerCase()) ||
        (t.suggested_family && t.suggested_family.toLowerCase().includes(tableSearch.toLowerCase()));

      const mappingVal = draftMappings[t.table_name];
      const isMapped = mappingVal && mappingVal !== "UNMAPPED";

      if (tableFilter === "mapped") return matchesSearch && isMapped;
      if (tableFilter === "unmapped") return matchesSearch && !isMapped;
      return matchesSearch;
    });
  }, [discoveredTables, tableSearch, tableFilter, draftMappings]);

  // Overall summary metrics
  const totalMappedTables = useMemo(() => {
    return connectors.reduce((acc, c) => acc + (c.mapped_tables_count || 0), 0);
  }, [connectors]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white font-sans text-slate-800 relative">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all animate-in fade-in slide-in-from-top-2 ${
            notification.type === "error"
              ? "bg-rose-50 text-rose-800 border-rose-200"
              : "bg-emerald-50 text-emerald-800 border-emerald-200"
          }`}
        >
          {notification.type === "error" ? (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          )}
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SECTION A: PAGE HEADER */}
      <div className="border-b border-slate-200/80 bg-white px-6 py-5 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shadow-2xs">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  Data Connectors
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    Live Engine
                  </span>
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Connect and manage your company's manufacturing data sources.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs disabled:opacity-50"
              title="Refresh connection status and catalogs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-purple-600" : ""}`} />
              <span>{refreshing ? "Checking..." : "Refresh"}</span>
            </button>

            <button
              onClick={() => {
                resetAddForm();
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-xl transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Data Source</span>
            </button>
          </div>
        </div>

        {/* Operational Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Active Sources</p>
              <p className="text-sm font-bold text-slate-900">
                {connectors.filter((c) => c.status === "CONNECTED").length} of {connectors.length} Connected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-xs font-bold border border-purple-100">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Primary System</p>
              <p className="text-sm font-bold text-slate-900 truncate max-w-[170px]" title="Neon PostgreSQL Cloud Engine">
                Neon PostgreSQL
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold border border-indigo-100">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Manufacturing Mappings</p>
              <p className="text-sm font-bold text-slate-900">
                {totalMappedTables} Core Tables Mapped
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-xs font-bold border border-teal-100">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Credential Security</p>
              <p className="text-sm font-bold text-slate-900">HMAC-SHA256 Encrypted</p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN SCROLLABLE WORKSPACE */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 bg-white">
        {/* Loading / Error States */}
        {loading && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">Connecting to manufacturing database registry...</p>
          </div>
        )}

        {error && !loading && (
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/70 text-rose-800 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Unable to load configured connectors</p>
              <p className="text-xs text-rose-700 mt-0.5">{error}</p>
              <button
                onClick={() => fetchData()}
                className="mt-2 text-xs font-semibold underline hover:text-rose-900"
              >
                Try reconnecting
              </button>
            </div>
          </div>
        )}

        {/* SECTION B: CONNECTED DATA SOURCES */}
        {!loading && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-600" />
                  Configured Data Sources ({connectors.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Active database connections feeding transactional batches, production yields, and BOM cost models.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {connectors.map((conn) => {
                const testState = testStatusMap[conn.id] || {};
                const isTesting = testState.testing;
                const isPrimary = conn.is_primary;

                return (
                  <div
                    key={conn.id}
                    className={`bg-white rounded-2xl border transition-all duration-150 p-5 shadow-2xs hover:shadow-xs relative flex flex-col justify-between ${
                      isPrimary
                        ? "border-purple-200 ring-1 ring-purple-100"
                        : "border-slate-200/80 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      {/* Top Row: Name, Status Badge, Primary Pill */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-bold text-slate-900">{conn.name}</h3>
                            {isPrimary && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                                <Zap className="w-3 h-3 text-purple-600" />
                                Primary Application DB
                              </span>
                            )}
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                              {conn.connector_type.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Engine: PostgreSQL 16.x • SSL: {conn.ssl_mode || "require"}
                          </p>
                        </div>

                        {/* Live Health Badge */}
                        <div className="shrink-0">
                          {conn.status === "CONNECTED" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              CONNECTED
                            </span>
                          ) : conn.status === "CONNECTION_FAILED" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              <span className="w-2 h-2 rounded-full bg-rose-500" />
                              FAILED
                            </span>
                          ) : conn.status === "AUTHENTICATION_FAILED" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <span className="w-2 h-2 rounded-full bg-amber-500" />
                              AUTH FAILED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                              <span className="w-2 h-2 rounded-full bg-slate-400" />
                              NOT TESTED
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Connection Spec Box (Masked) */}
                      <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/60 font-mono text-xs text-slate-700 space-y-1.5 my-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Host:</span>
                          <span className="font-semibold text-slate-800 select-all">{conn.host_masked || conn.host}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Port / DB:</span>
                          <span>
                            {conn.port} / <strong className="text-slate-800">{conn.database_name}</strong>
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">User / Secret:</span>
                          <span>
                            {conn.username_masked || conn.username} • <span className="text-slate-400">•••••••• (Encrypted)</span>
                          </span>
                        </div>
                      </div>

                      {/* Live Test Error Message (if any) */}
                      {conn.last_error && (
                        <div className="mb-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                          <strong className="font-semibold">Last Error:</strong> {conn.last_error}
                        </div>
                      )}

                      {/* Metadata row */}
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            Last ping:{" "}
                            {conn.last_tested_at
                              ? new Date(conn.last_tested_at).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                })
                              : "Recently initialized"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium text-slate-700">
                          <Table className="w-3.5 h-3.5 text-purple-600" />
                          <span>{conn.mapped_tables_count || 0} tables mapped</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTestExistingConnector(conn.id)}
                          disabled={isTesting}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? "animate-spin text-purple-600" : ""}`} />
                          <span>{isTesting ? "Pinging..." : "Test Ping"}</span>
                        </button>

                        {testState.latency !== null && testState.latency !== undefined && (
                          <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            {testState.latency} ms
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenMapping(conn)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors"
                        >
                          <Table className="w-3.5 h-3.5 text-purple-600" />
                          <span>Schema & Mappings</span>
                        </button>

                        {!isPrimary && (
                          <button
                            onClick={() => handleDeleteConnector(conn.id, conn.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Disconnect and delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SECTION C: AVAILABLE CONNECTORS CATALOG */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Boxes className="w-4 h-4 text-purple-600" />
                Available Connector Adapters
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Native manufacturing protocol adapters for relational databases, enterprise ERPs, and cloud data warehouses.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {catalog.map((item) => {
              // As requested: keep all connector adapters available for presentation on this page
              const isAvailable = true;
              const cleanDesc = (item.description || "")
                .replace(/\s*\(Planned for upcoming release\)\.?/gi, "")
                .trim();

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all duration-150 border-purple-200 shadow-2xs hover:shadow-xs hover:border-purple-300"
                >
                  <div>
                    {/* Header: Icon + Status Pill */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm bg-purple-50 text-purple-700 border border-purple-200">
                        {(item.id === "postgresql" || item.icon === "postgresql") && (
                          <Database className="w-5 h-5 text-purple-600" />
                        )}
                        {(item.id === "sqlserver" || item.id === "microsoftsql" || item.icon === "microsoftsql") && (
                          <Server className="w-5 h-5 text-blue-600" />
                        )}
                        {(item.id === "mysql" || item.icon === "mysql") && (
                          <Server className="w-5 h-5 text-amber-600" />
                        )}
                        {(item.id === "snowflake" || item.icon === "snowflake") && (
                          <Cpu className="w-5 h-5 text-teal-600" />
                        )}
                      </div>

                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Available
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">
                      {cleanDesc}
                    </p>

                    {/* Supported Features list */}
                    {item.supported_features && item.supported_features.length > 0 ? (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Features</p>
                        <div className="flex flex-wrap gap-1">
                          {item.supported_features.map((feat, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200/60"
                            >
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Capabilities</p>
                        <div className="flex flex-wrap gap-1">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-100 font-medium">
                            Read-Only Discovery
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-100 font-medium">
                            Schema Mapping
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200/60 font-medium">
                            SSL Encrypted
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Connect Action */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => {
                        resetAddForm(item.id);
                        setIsAddModalOpen(true);
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Connect {item.name}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION G: ARCHITECTURAL & SECURITY REFERENCE */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">
                Manufacturing Data Privacy & Safe Read-Only Discovery
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
                All connected sources operate strictly in <strong>read-only discovery</strong> mode via{" "}
                <code className="text-slate-700 bg-slate-100 px-1 py-0.5 rounded text-[11px]">
                  information_schema
                </code>
                . Sensitive credentials (passwords and API tokens) are encrypted at rest using server-side
                HMAC-SHA256 authenticated symmetric ciphers and are never emitted in API responses or client logs.
                Data mapping enables automatic reconciliation with the 7 manufacturing core tables without modifying
                your source database schemas.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* =========================================================================
          SECTION D: ADD DATA SOURCE MODAL
          ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center">
                  {(newConnectorType === "postgresql" || newConnectorType === "postgres") && (
                    <Database className="w-4 h-4 text-purple-600" />
                  )}
                  {(newConnectorType === "sqlserver" || newConnectorType === "microsoftsql") && (
                    <Server className="w-4 h-4 text-blue-600" />
                  )}
                  {newConnectorType === "mysql" && <Server className="w-4 h-4 text-amber-600" />}
                  {newConnectorType === "snowflake" && <Cpu className="w-4 h-4 text-teal-600" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Add {catalog.find((c) => c.id === newConnectorType)?.name || "Database"} Data Source
                  </h3>
                  <p className="text-xs text-slate-500">Configure connection to manufacturing database</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveConnector} className="flex-1 overflow-y-auto p-6 space-y-4">
              {modalError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{modalError}</span>
                </div>
              )}

              {modalTestResult && modalTestResult.success && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">
                      Connection Verified! ({modalTestResult.latency_ms} ms)
                    </p>
                    <p className="text-emerald-700 text-[11px] mt-0.5">
                      {modalTestResult.server_version || "Database Ready"} • Discovered schemas:{" "}
                      {modalTestResult.discovered_schemas?.join(", ") || "public"}
                    </p>
                  </div>
                </div>
              )}

              {/* Source Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Connection Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    newConnectorType === "sqlserver"
                      ? "e.g. Line 1 Shopfloor SQL Server"
                      : newConnectorType === "mysql"
                      ? "e.g. Line 2 Shopfloor MySQL"
                      : newConnectorType === "snowflake"
                      ? "e.g. Corporate Snowflake Analytics"
                      : "e.g. Line 2 Shopfloor Postgres"
                  }
                  value={newFormData.name}
                  onChange={(e) => setNewFormData({ ...newFormData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              {/* Host and Port */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Host / Endpoint <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      newConnectorType === "sqlserver"
                        ? "e.g. sqlserver.factory.internal"
                        : newConnectorType === "mysql"
                        ? "e.g. mysql.factory.internal"
                        : newConnectorType === "snowflake"
                        ? "e.g. org-account.snowflakecomputing.com"
                        : "e.g. postgres.factory.internal"
                    }
                    value={newFormData.host}
                    onChange={(e) => setNewFormData({ ...newFormData, host: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Port</label>
                  <input
                    type="number"
                    value={newFormData.port}
                    onChange={(e) => setNewFormData({ ...newFormData, port: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  />
                </div>
              </div>

              {/* Database Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Database Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. manufacturing_prod"
                  value={newFormData.database_name}
                  onChange={(e) => setNewFormData({ ...newFormData, database_name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              {/* Username and Password */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Username <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. pg_reader"
                    value={newFormData.username}
                    onChange={(e) => setNewFormData({ ...newFormData, username: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={newFormData.password}
                      onChange={(e) => setNewFormData({ ...newFormData, password: e.target.value })}
                      className="w-full px-3 py-2 pr-9 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* SSL Mode */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">SSL Mode</label>
                <select
                  value={newFormData.ssl_mode}
                  onChange={(e) => setNewFormData({ ...newFormData, ssl_mode: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                >
                  <option value="require">Require (Recommended for Cloud/SSL)</option>
                  <option value="prefer">Prefer</option>
                  <option value="disable">Disable (Local development only)</option>
                </select>
              </div>

              {/* Test Connection Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleTestModalConnection}
                  disabled={modalTesting || !newFormData.host || !newFormData.database_name}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${modalTesting ? "animate-spin text-purple-600" : ""}`} />
                  <span>{modalTesting ? "Testing live connection..." : "Test Connection Parameters"}</span>
                </button>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConnector}
                disabled={modalSaving || !newFormData.name || !newFormData.host || !newFormData.database_name}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors shadow-xs disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{modalSaving ? "Encrypting & Saving..." : "Save & Encrypt"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION E & F: SCHEMA & TABLE DISCOVERY + MANUFACTURING MAPPING DRAWER
          ========================================================================= */}
      {selectedConnectorForMapping && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-4xl h-full shadow-2xl flex flex-col border-l border-slate-200">
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-slate-200/80 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center">
                  <Table className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    Schema & Manufacturing Mappings
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {selectedConnectorForMapping.name}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Map discovered tables to the 7 core manufacturing data families for cost intelligence.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedConnectorForMapping(null)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter and Schema Selector Strip */}
            <div className="px-6 py-3.5 bg-slate-50/70 border-b border-slate-200/70 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                {/* Schema selector */}
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Schema:
                  </label>
                  <select
                    value={selectedSchema}
                    onChange={(e) => {
                      setSelectedSchema(e.target.value);
                      fetchTablesForSchema(selectedConnectorForMapping.id, e.target.value);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    {schemas.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filter tabs */}
                <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-xs">
                  <button
                    onClick={() => setTableFilter("all")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      tableFilter === "all" ? "bg-purple-600 text-white" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    All ({discoveredTables.length})
                  </button>
                  <button
                    onClick={() => setTableFilter("mapped")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      tableFilter === "mapped"
                        ? "bg-purple-600 text-white"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Mapped
                  </button>
                  <button
                    onClick={() => setTableFilter("unmapped")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      tableFilter === "unmapped"
                        ? "bg-purple-600 text-white"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Unmapped
                  </button>
                </div>
              </div>

              {/* Table search input */}
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter tables..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>

            {/* Discovered Tables List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {loadingTables ? (
                <div className="p-12 text-center">
                  <RefreshCw className="w-7 h-7 text-purple-600 animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-600">Discovering tables and column structures in {selectedSchema}...</p>
                </div>
              ) : filteredDiscoveredTables.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs">
                  No tables matched the current search or filter criteria.
                </div>
              ) : (
                filteredDiscoveredTables.map((t) => {
                  const currentMapping = draftMappings[t.table_name] || "UNMAPPED";
                  const mappedFamily = MANUFACTURING_FAMILIES.find((f) => f.id === currentMapping);

                  return (
                    <div
                      key={t.table_name}
                      className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-slate-900">
                            {t.table_name}
                          </span>
                          <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            {t.row_count.toLocaleString()} rows
                          </span>
                          <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            {t.column_count} columns
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Schema: <code className="text-slate-700">{t.schema_name}</code>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* View Columns trigger */}
                        <button
                          onClick={() => handleInspectColumns(t.table_name)}
                          className="text-xs font-semibold text-purple-700 hover:text-purple-900 hover:underline px-2 py-1"
                        >
                          View Columns
                        </button>

                        {/* Manufacturing Family Dropdown */}
                        <div className="w-64">
                          <select
                            value={currentMapping}
                            onChange={(e) =>
                              setDraftMappings({
                                ...draftMappings,
                                [t.table_name]: e.target.value,
                              })
                            }
                            className={`w-full px-3 py-1.5 text-xs font-semibold rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
                              mappedFamily ? mappedFamily.badgeColor : "border-slate-300 bg-white"
                            }`}
                          >
                            {MANUFACTURING_FAMILIES.map((fam) => (
                              <option key={fam.id} value={fam.id} className="bg-white text-slate-900 font-normal">
                                {fam.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="px-6 py-4 border-t border-slate-200/80 bg-white flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500">
                Changes will update manufacturing batch routing and cost intelligence models.
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedConnectorForMapping(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveMappings}
                  disabled={savingMappings}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors shadow-xs disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{savingMappings ? "Saving Mappings..." : "Save Table Mappings"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          COLUMN INSPECTION MODAL
          ========================================================================= */}
      {inspectingTable && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center">
                  <Table className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Table Columns: <code className="font-mono text-purple-700">{inspectingTable}</code>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Read-only schema inspection from information_schema.columns
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectingTable(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loadingColumns ? (
                <div className="p-8 text-center">
                  <RefreshCw className="w-6 h-6 text-purple-600 animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-600">Inspecting columns...</p>
                </div>
              ) : tableColumns.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No columns discovered.</p>
              ) : (
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Column Name</th>
                      <th className="py-2.5 px-3">Data Type</th>
                      <th className="py-2.5 px-3">Primary Key</th>
                      <th className="py-2.5 px-3">Nullable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {tableColumns.map((col) => (
                      <tr key={col.column_name} className="hover:bg-slate-50/60">
                        <td className="py-2 px-3 font-bold text-slate-800">{col.column_name}</td>
                        <td className="py-2 px-3 text-purple-700">{col.data_type}</td>
                        <td className="py-2 px-3 font-sans">
                          {col.is_primary_key ? (
                            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                              PK
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="py-2 px-3 font-sans">
                          {col.is_nullable ? (
                            <span className="text-slate-500">YES</span>
                          ) : (
                            <span className="font-semibold text-slate-700">NO</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setInspectingTable(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
