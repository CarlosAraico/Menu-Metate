import { useState, useEffect, useCallback } from "react";
import { metateApi } from "../../services/metateApi";
import { LoadingSpinner } from "../ui/Loading";
import { EmptyState } from "../ui/EmptyState";
import { ErrorState } from "../ui/ErrorState";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { OrderDetailModal } from "./OrderDetailModal";

const STATUS_LABELS = { pending: "Pendiente", preparing: "Preparando", ready: "Listo", delivered: "Entregado", cancelled: "Cancelado" };
const STATUS_VARIANTS = { pending: "warning", preparing: "info", ready: "amber", delivered: "success", cancelled: "danger" };
const SERVICE_LABELS = { "dine-in": "Mesa", takeout: "Para llevar", delivery: "Delivery" };
const PAYMENT_LABELS = { cash: "Efectivo", card: "Tarjeta", transfer: "Transferencia" };

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export function OrdersTab({ adminToken }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filters
  const [filterStatus, setFilterStatus] = useState("");
  const [filterServiceType, setFilterServiceType] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  // Pagination
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await metateApi.getOrders(adminToken, {
        status: filterStatus || undefined,
        serviceType: filterServiceType || undefined,
        dateFrom: filterDateFrom || undefined,
        dateTo: filterDateTo || undefined,
        sortBy,
        sortDir,
      });
      setOrders(data);
      setCurrentPage(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [adminToken, filterStatus, filterServiceType, filterDateFrom, filterDateTo, sortBy, sortDir]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  // Client-side pagination
  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize));
  const paginated = orders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (field) => {
    if (sortBy === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(field); setSortDir("desc"); }
  };

  const SortIcon = ({ field }) =>
    sortBy === field ? (sortDir === "asc" ? " ↑" : " ↓") : <span className="text-gray-300"> ↕</span>;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Filtros</h2>
        <div className="flex flex-wrap gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">Todos los estados</option>
            {Object.entries(STATUS_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>

          <select
            value={filterServiceType}
            onChange={(e) => setFilterServiceType(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">Todos los servicios</option>
            {Object.entries(SERVICE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>

          <input
            type="date"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <input
            type="date"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          <Button size="sm" variant="secondary" onClick={() => { setFilterStatus(""); setFilterServiceType(""); setFilterDateFrom(""); setFilterDateTo(""); }}>
            Limpiar
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">Pedidos <span className="text-gray-400 font-normal text-sm">({orders.length})</span></h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Mostrar:</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="px-2 py-1 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none"
            >
              {PAGE_SIZE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        {loading && <LoadingSpinner message="Cargando pedidos..." />}
        {error && <ErrorState message={error} onRetry={loadOrders} />}
        {!loading && !error && orders.length === 0 && (
          <EmptyState icon="📋" title="Sin pedidos" description="No hay pedidos con los filtros seleccionados." />
        )}

        {!loading && !error && orders.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700" onClick={() => toggleSort("date")}>
                      Fecha <SortIcon field="date" />
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cliente</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Servicio</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700" onClick={() => toggleSort("total")}>
                      Total <SortIcon field="total" />
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Pago</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((order) => (
                    <tr
                      key={order.orderId}
                      onClick={() => setSelectedOrder(order)}
                      className="hover:bg-amber-50 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-4 text-sm font-mono text-gray-600">{order.orderId}</td>
                      <td className="px-5 py-4 text-sm text-gray-700">
                        {new Date(order.createdAt).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}&nbsp;
                        <span className="text-gray-400">{new Date(order.createdAt).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">{order.customer?.name || "—"}</td>
                      <td className="px-5 py-4"><Badge variant={STATUS_VARIANTS[order.status]}>{STATUS_LABELS[order.status]}</Badge></td>
                      <td className="px-5 py-4 text-sm text-gray-600">{SERVICE_LABELS[order.serviceType] || order.serviceType}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-right text-gray-900">${order.total.toFixed(2)}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{order.payments?.map((p) => PAYMENT_LABELS[p.method] || p.method).join(", ") || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  Mostrando {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, orders.length)} de {orders.length}
                </span>
                <div className="flex gap-1">
                  <Button size="sm" variant="secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>«</Button>
                  <Button size="sm" variant="secondary" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>‹</Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    return (
                      <Button key={page} size="sm" variant={page === currentPage ? "primary" : "secondary"} onClick={() => setCurrentPage(page)}>
                        {page}
                      </Button>
                    );
                  })}
                  <Button size="sm" variant="secondary" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>›</Button>
                  <Button size="sm" variant="secondary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>»</Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}
