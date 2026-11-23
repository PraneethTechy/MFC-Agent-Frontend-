import React, { useState, useEffect } from "react";
import { Factory, Package, Layers, Truck, CheckCircle2, Search, ArrowRight } from "lucide-react";

export default function DataOverview({ apiBaseUrl }) {
  const [plants, setPlants] = useState([]);
  const [products, setProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("plants");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadMasterData() {
      setLoading(true);
      try {
        const [plantsRes, productsRes, materialsRes, suppliersRes] = await Promise.all([
          fetch(`${apiBaseUrl}/master-data/plants`).then((r) => r.json()),
          fetch(`${apiBaseUrl}/master-data/products`).then((r) => r.json()),
          fetch(`${apiBaseUrl}/master-data/materials`).then((r) => r.json()),
          fetch(`${apiBaseUrl}/master-data/suppliers`).then((r) => r.json()),
        ]);
        setPlants(plantsRes || []);
        setProducts(productsRes || []);
        setMaterials(materialsRes || []);
        setSuppliers(suppliersRes || []);
      } catch (err) {
        console.error("Failed to load master data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMasterData();
  }, [apiBaseUrl]);

  const costBuckets = [
    { name: "Material", desc: "BOM standards, batch consumption, landed costs (freight/duty/FX)", count: materials.length },
    { name: "Labour", desc: "Work centre hourly rates, shift postings, direct hours & overtime", count: "3 Shifts" },
    { name: "Machine", desc: "Work centre rates, setup time, operating run hours & downtime", count: "Ready" },
    { name: "Energy", desc: "Sub-meter logs, kWh consumption, peak/off-peak tariffs & idle loads", count: "Ready" },
    { name: "Scrap & Rework", desc: "Quality defect codes, scrap counts, rework hours & repair costs", count: "Ready" },
    { name: "Overhead", desc: "Cost centre pools, driver absorption (machine/labour hrs) & volume variance", count: "Ready" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* 6 Manufacturing Cost Buckets Status */}
      <div className="card-surface p-6 shadow-subtle border border-page-border">
        <h3 className="text-sm font-bold uppercase tracking-wider text-ink-secondary mb-3">
          Manufacturing Cost Foundation · Six Cost Categories
        </h3>
        <p className="text-xs text-ink-muted mb-4">
          All six categories have dedicated relational structures, standard vs actual models, and analytical views.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {costBuckets.map((bucket, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-page-bg border border-page-border flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-ink-primary">{bucket.name}</span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Schema Active
                  </span>
                </div>
                <p className="text-[11px] text-ink-secondary leading-relaxed">{bucket.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Master Data Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab("plants")}
          className={`card-surface p-4 cursor-pointer transition-all border ${
            activeTab === "plants" ? "border-brand-purple shadow-sm ring-1 ring-brand-purple" : "border-page-border hover:border-brand-purple/40"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-ink-secondary font-medium">Plants</span>
            <Factory className="w-4 h-4 text-brand-purple" />
          </div>
          <div className="text-2xl font-bold text-ink-primary">{plants.length}</div>
          <span className="text-[10px] text-ink-muted">Operating Facilities</span>
        </div>

        <div
          onClick={() => setActiveTab("products")}
          className={`card-surface p-4 cursor-pointer transition-all border ${
            activeTab === "products" ? "border-brand-blue shadow-sm ring-1 ring-brand-blue" : "border-page-border hover:border-brand-blue/40"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-ink-secondary font-medium">Products</span>
            <Package className="w-4 h-4 text-brand-blue" />
          </div>
          <div className="text-2xl font-bold text-ink-primary">{products.length}</div>
          <span className="text-[10px] text-ink-muted">Assemblies & Finished Goods</span>
        </div>

        <div
          onClick={() => setActiveTab("materials")}
          className={`card-surface p-4 cursor-pointer transition-all border ${
            activeTab === "materials" ? "border-brand-orange shadow-sm ring-1 ring-brand-orange" : "border-page-border hover:border-brand-orange/40"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-ink-secondary font-medium">Materials</span>
            <Layers className="w-4 h-4 text-brand-orange" />
          </div>
          <div className="text-2xl font-bold text-ink-primary">{materials.length}</div>
          <span className="text-[10px] text-ink-muted">Raw Materials & Components</span>
        </div>

        <div
          onClick={() => setActiveTab("suppliers")}
          className={`card-surface p-4 cursor-pointer transition-all border ${
            activeTab === "suppliers" ? "border-emerald-500 shadow-sm ring-1 ring-emerald-500" : "border-page-border hover:border-emerald-500/40"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-ink-secondary font-medium">Suppliers</span>
            <Truck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-ink-primary">{suppliers.length}</div>
          <span className="text-[10px] text-ink-muted">Approved Vendors</span>
        </div>
      </div>

      {/* Detail Table */}
      <div className="card-surface p-5 border border-page-border shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h4 className="font-semibold text-sm capitalize text-ink-primary">
            Master Data Directory: {activeTab}
          </h4>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-ink-muted" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-page-border bg-page-bg text-ink-primary focus:outline-none focus:ring-1 focus:ring-brand-purple w-full sm:w-60"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-ink-muted">Loading master data...</div>
        ) : (
          <div className="overflow-x-auto">
            {activeTab === "plants" && (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-page-border text-ink-secondary font-semibold">
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3">Currency</th>
                    <th className="py-2.5 px-3">Capacity (Hrs/Mo)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-page-border">
                  {plants
                    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.code.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((p) => (
                      <tr key={p.code} className="hover:bg-page-bg/50">
                        <td className="py-2.5 px-3 font-mono font-medium text-brand-purple">{p.code}</td>
                        <td className="py-2.5 px-3 font-medium text-ink-primary">{p.name}</td>
                        <td className="py-2.5 px-3 text-ink-secondary">{p.location}</td>
                        <td className="py-2.5 px-3 text-ink-muted">{p.currency}</td>
                        <td className="py-2.5 px-3 text-ink-secondary font-mono">{p.capacity_hours_month}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}

            {activeTab === "products" && (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-page-border text-ink-secondary font-semibold">
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Product Name</th>
                    <th className="py-2.5 px-3">Group</th>
                    <th className="py-2.5 px-3">UOM</th>
                    <th className="py-2.5 px-3">Batch Size</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-page-border">
                  {products
                    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.code.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((p) => (
                      <tr key={p.code} className="hover:bg-page-bg/50">
                        <td className="py-2.5 px-3 font-mono font-medium text-brand-blue">{p.code}</td>
                        <td className="py-2.5 px-3 font-medium text-ink-primary">{p.name}</td>
                        <td className="py-2.5 px-3 text-ink-secondary">{p.product_group}</td>
                        <td className="py-2.5 px-3 text-ink-muted">{p.uom}</td>
                        <td className="py-2.5 px-3 text-ink-secondary font-mono">{p.standard_batch_size}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}

            {activeTab === "materials" && (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-page-border text-ink-secondary font-semibold">
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Material Description</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">UOM</th>
                    <th className="py-2.5 px-3">Standard Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-page-border">
                  {materials
                    .filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.code.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((m) => (
                      <tr key={m.code} className="hover:bg-page-bg/50">
                        <td className="py-2.5 px-3 font-mono font-medium text-brand-orange">{m.code}</td>
                        <td className="py-2.5 px-3 font-medium text-ink-primary">{m.name}</td>
                        <td className="py-2.5 px-3 text-ink-secondary">{m.material_type}</td>
                        <td className="py-2.5 px-3 text-ink-muted">{m.base_uom}</td>
                        <td className="py-2.5 px-3 font-mono text-ink-primary">₹{m.standard_unit_price}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}

            {activeTab === "suppliers" && (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-page-border text-ink-secondary font-semibold">
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Supplier Name</th>
                    <th className="py-2.5 px-3">Country</th>
                    <th className="py-2.5 px-3">Terms</th>
                    <th className="py-2.5 px-3">Reliability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-page-border">
                  {suppliers
                    .filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((s) => (
                      <tr key={s.code} className="hover:bg-page-bg/50">
                        <td className="py-2.5 px-3 font-mono font-medium text-emerald-600">{s.code}</td>
                        <td className="py-2.5 px-3 font-medium text-ink-primary">{s.name}</td>
                        <td className="py-2.5 px-3 text-ink-secondary">{s.country}</td>
                        <td className="py-2.5 px-3 text-ink-muted">{s.payment_terms}</td>
                        <td className="py-2.5 px-3 font-mono text-emerald-600 font-semibold">{s.reliability_rating} / 5.0</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

