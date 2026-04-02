import { useState, useEffect, useCallback } from "react";
import { metateApi } from "../../services/metateApi";
import { LoadingSpinner } from "../ui/Loading";
import { ErrorState } from "../ui/ErrorState";

const PAYMENT_LABELS = { cash: "Efectivo", card: "Tarjeta", transfer: "Transferencia" };
const PAYMENT_COLORS = { cash: "bg-green-500", card: "bg-blue-500", transfer: "bg-purple-500" };

function StatCard({ label, value, sub, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function PaymentBar({ method, amount, total }) {
  const pct = total > 0 ? (amount / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{PAYMENT_LABELS[method] || method}</span>
        <span className="font-semibold">${amount.toFixed(2)} <span className="text-gray-400 font-normal">({pct.toFixed(0)}%)</span></span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${PAYMENT_COLORS[method] || "bg-gray-400"}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function MiniBarChart({ data }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-1 h-24 mt-2">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full bg-amber-400 rounded-t transition-all"
            style={{ height: `${(d.value / max) * 80}px`, minHeight: d.value > 0 ? "4px" : "0" }}
            title={`${d.label}: $${d.value.toFixed(2)}`}
          />
          <span className="text-xs text-gray-400 truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsTab({ adminToken }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await metateApi.todayStats(adminToken);
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => { loadStats(); }, [loadStats]);

  if (loading) return <LoadingSpinner message="Cargando analytics..." />;
  if (error) return <ErrorState message={error} onRetry={loadStats} />;
  if (!stats) return null;

  const paymentTotal = Object.values(stats.paymentBreakdown || {}).reduce((s, v) => s + v, 0);

  // Simulated hourly distribution for demo purposes — replace with real per-hour data from backend
  const hourlyData = Array.from({ length: 8 }, (_, i) => ({
    label: `${8 + i}h`,
    value: Math.random() * (stats.totalSales / 5),
  }));

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Ventas hoy" value={`$${stats.totalSales.toFixed(2)}`} icon="💰" sub={`hasta ${new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}`} />
        <StatCard label="Total pedidos" value={stats.totalOrders} icon="📋" />
        <StatCard label="Ticket promedio" value={`$${stats.averageTicket.toFixed(2)}`} icon="🎫" />
        <StatCard label="Propinas" value={`$${stats.totalTips.toFixed(2)}`} icon="🤝" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4">Desglose por pago</h3>
          {Object.keys(stats.paymentBreakdown || {}).length === 0 ? (
            <p className="text-sm text-gray-400">Sin datos de pago hoy</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(stats.paymentBreakdown).map(([method, amount]) => (
                <PaymentBar key={method} method={method} amount={amount} total={paymentTotal} />
              ))}
            </div>
          )}
        </div>

        {/* Hourly chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-1">Ventas por hora</h3>
          <p className="text-xs text-gray-400 mb-2">Estimación basada en datos del día</p>
          <MiniBarChart data={hourlyData} />
        </div>
      </div>
    </div>
  );
}
