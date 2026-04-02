import { Modal } from "../ui/Modal";
import { Badge } from "../ui/Badge";

const STATUS_LABELS = { pending: "Pendiente", preparing: "Preparando", ready: "Listo", delivered: "Entregado", cancelled: "Cancelado" };
const STATUS_VARIANTS = { pending: "warning", preparing: "info", ready: "amber", delivered: "success", cancelled: "danger" };
const SERVICE_LABELS = { "dine-in": "🍽️ Mesa", takeout: "🥡 Para llevar", delivery: "🛵 Delivery" };
const PAYMENT_LABELS = { cash: "💵 Efectivo", card: "💳 Tarjeta", transfer: "📲 Transferencia" };

function fmt(amount) { return `$${Number(amount).toFixed(2)}`; }
function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-MX", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function OrderDetailModal({ order, onClose }) {
  if (!order) return null;
  return (
    <Modal isOpen={!!order} onClose={onClose} title={`Pedido ${order.orderId}`} size="lg">
      <div className="space-y-6">
        {/* Header info */}
        <div className="grid grid-cols-2 gap-4">
          <InfoBlock label="Estado"><Badge variant={STATUS_VARIANTS[order.status]}>{STATUS_LABELS[order.status]}</Badge></InfoBlock>
          <InfoBlock label="Servicio">{SERVICE_LABELS[order.serviceType] || order.serviceType}</InfoBlock>
          <InfoBlock label="Cliente">{order.customer?.name || "Anónimo"}</InfoBlock>
          <InfoBlock label="Teléfono">{order.customer?.phone || "—"}</InfoBlock>
          <InfoBlock label="Creado">{fmtDate(order.createdAt)}</InfoBlock>
          <InfoBlock label="Actualizado">{fmtDate(order.updatedAt)}</InfoBlock>
        </div>

        {/* Items */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2 text-sm">Artículos</h3>
          <div className="bg-gray-50 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Producto</th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Cant.</th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Unit.</th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(order.items || []).map((item, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 text-gray-800">{item.name}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{fmt(item.unitPrice)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-800">{fmt(item.lineTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="bg-amber-50 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>{fmt(order.subtotal)}</span></div>
          <div className="flex justify-between text-sm text-gray-600"><span>Propina</span><span>{fmt(order.tip)}</span></div>
          <div className="flex justify-between font-bold text-gray-900 text-base border-t border-amber-200 pt-2 mt-2"><span>Total</span><span>{fmt(order.total)}</span></div>
        </div>

        {/* Payments */}
        {order.payments && order.payments.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-2 text-sm">Pagos</h3>
            <div className="space-y-2">
              {order.payments.map((p, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-2 text-sm">
                  <span className="text-gray-600">{PAYMENT_LABELS[p.method] || p.method}</span>
                  <span className="font-semibold">{fmt(p.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

function InfoBlock({ label, children }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-sm text-gray-800">{children}</p>
    </div>
  );
}
