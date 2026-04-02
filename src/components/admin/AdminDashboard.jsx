import { useState } from "react";
import { metateApi } from "../../services/metateApi";
import { Button } from "../ui/Button";
import { OrdersTab } from "./OrdersTab";
import { AnalyticsTab } from "./AnalyticsTab";
import { ClosingsTab } from "./ClosingsTab";
import { CatalogTab } from "./CatalogTab";

const TABS = [
  { id: "orders", label: "📋 Pedidos" },
  { id: "analytics", label: "📊 Analytics" },
  { id: "closings", label: "📁 Cierres" },
  { id: "catalog", label: "🍽️ Catálogo" },
];

export function AdminDashboard({ adminToken, onLogout }) {
  const [activeTab, setActiveTab] = useState("orders");
  const [closingLoading, setClosingLoading] = useState(false);

  const handleCloseShift = async () => {
    if (!confirm("¿Seguro que deseas cerrar el turno? Esta acción no se puede deshacer.")) return;
    setClosingLoading(true);
    try {
      await metateApi.closeShift(adminToken);
      alert("Turno cerrado exitosamente.");
    } catch (err) {
      alert("Error al cerrar turno: " + err.message);
    } finally {
      setClosingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌮</span>
          <div>
            <h1 className="font-bold text-lg leading-tight">Metate Admin</h1>
            <p className="text-gray-400 text-xs">Panel de administración</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="danger" size="sm" loading={closingLoading} onClick={handleCloseShift}>
            Cerrar turno
          </Button>
          <Button variant="ghost" size="sm" onClick={onLogout} className="text-gray-300 hover:text-white hover:bg-gray-700">
            Salir
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? "border-amber-500 text-amber-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "orders" && <OrdersTab adminToken={adminToken} />}
        {activeTab === "analytics" && <AnalyticsTab adminToken={adminToken} />}
        {activeTab === "closings" && <ClosingsTab adminToken={adminToken} />}
        {activeTab === "catalog" && <CatalogTab adminToken={adminToken} />}
      </main>
    </div>
  );
}
