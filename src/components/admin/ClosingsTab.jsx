import { useState, useEffect, useCallback } from "react";
import { metateApi } from "../../services/metateApi";
import { LoadingSpinner } from "../ui/Loading";
import { EmptyState } from "../ui/EmptyState";
import { ErrorState } from "../ui/ErrorState";

const PAYMENT_LABELS = { cash: "Efectivo", card: "Tarjeta", transfer: "Transferencia" };

export function ClosingsTab({ adminToken }) {
  const [closings, setClosings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadClosings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await metateApi.getClosings(adminToken);
      setClosings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => { loadClosings(); }, [loadClosings]);

  if (loading) return <LoadingSpinner message="Cargando cierres..." />;
  if (error) return <ErrorState message={error} onRetry={loadClosings} />;
  if (closings.length === 0) return <EmptyState icon="📁" title="Sin cierres" description="Aún no se ha registrado ningún cierre de turno." />;

  return (
    <div className="space-y-4">
      {closings.map((closing) => (
        <div key={closing.closingId} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-800">{closing.shiftDate}</h3>
              <p className="text-xs text-gray-400">Cierre: {new Date(closing.closedAt).toLocaleString("es-MX")}</p>
            </div>
            <span className="font-mono text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">{closing.closingId}</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Metric label="Pedidos" value={closing.totalOrders} />
            <Metric label="Ventas" value={`$${Number(closing.totalSales).toFixed(2)}`} />
            <Metric label="Propinas" value={`$${Number(closing.totalTips).toFixed(2)}`} />
            <Metric label="Cerrado por" value={closing.closedBy} />
          </div>
          {closing.paymentBreakdown && Object.keys(closing.paymentBreakdown).length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Desglose por pago</p>
              <div className="flex flex-wrap gap-3">
                {Object.entries(closing.paymentBreakdown).map(([method, amount]) => (
                  <div key={method} className="bg-gray-50 rounded-lg px-3 py-2 text-sm">
                    <span className="text-gray-500">{PAYMENT_LABELS[method] || method}: </span>
                    <span className="font-semibold">${Number(amount).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase">{label}</p>
      <p className="text-lg font-bold text-gray-800 mt-0.5">{value}</p>
    </div>
  );
}
