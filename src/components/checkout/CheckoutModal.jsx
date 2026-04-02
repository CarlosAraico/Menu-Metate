import { useState } from "react";
import { metateApi } from "../../services/metateApi";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

export function CheckoutModal({ isOpen, onClose, cartItems, cartTotal, onSuccess }) {
  const [step, setStep] = useState("info"); // info | payment | confirm | success
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [serviceType, setServiceType] = useState("dine-in");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [tip, setTip] = useState(cartTotal * 0.15);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const total = cartTotal + tip;

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await metateApi.createOrder({
        items: cartItems.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        customer,
        serviceType,
        tipOverride: tip,
        payments: [{ method: paymentMethod, amount: total }],
      });
      setOrderId(result.orderId);
      setStep("success");
      setTimeout(onSuccess, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tipOptions = [
    { label: "Sin propina", value: 0 },
    { label: "10%", value: cartTotal * 0.10 },
    { label: "15%", value: cartTotal * 0.15 },
    { label: "20%", value: cartTotal * 0.20 },
  ];

  if (step === "success") {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="¡Pedido enviado!">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-green-700">¡Gracias!</h3>
          <p className="text-gray-500 mt-2">Tu pedido <span className="font-bold text-gray-700">#{orderId}</span> ha sido recibido.</p>
          <p className="text-sm text-gray-400 mt-4">Cerrando en unos segundos...</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Finalizar pedido">
      <div className="space-y-6">
        {/* Customer info */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700">Datos del cliente</h3>
          <input
            type="text"
            placeholder="Nombre"
            value={customer.name}
            onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <input
            type="tel"
            placeholder="Teléfono (opcional)"
            value={customer.phone}
            onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Service type */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700">Tipo de servicio</h3>
          <div className="grid grid-cols-3 gap-2">
            {[["dine-in", "🍽️ Mesa"], ["takeout", "🥡 Para llevar"], ["delivery", "🛵 Delivery"]].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setServiceType(val)}
                className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${serviceType === val ? "border-amber-500 bg-amber-50 text-amber-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tip */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700">Propina</h3>
          <div className="grid grid-cols-4 gap-2">
            {tipOptions.map(({ label, value }) => (
              <button
                key={label}
                onClick={() => setTip(value)}
                className={`py-2 px-2 rounded-lg border text-xs font-medium transition-colors ${Math.abs(tip - value) < 0.01 ? "border-amber-500 bg-amber-50 text-amber-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Payment method */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700">Método de pago</h3>
          <div className="grid grid-cols-3 gap-2">
            {[["cash", "💵 Efectivo"], ["card", "💳 Tarjeta"], ["transfer", "📲 Transferencia"]].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setPaymentMethod(val)}
                className={`py-2 px-2 rounded-lg border text-sm font-medium transition-colors ${paymentMethod === val ? "border-amber-500 bg-amber-50 text-amber-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <h3 className="font-semibold text-gray-700 text-sm">Resumen</h3>
          {cartItems.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm text-gray-600">
              <span>{item.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-2 space-y-1">
            <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm text-gray-500"><span>Propina</span><span>${tip.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

        <Button variant="primary" size="lg" className="w-full" loading={loading} onClick={handleSubmit}>
          Confirmar pedido — ${total.toFixed(2)}
        </Button>
      </div>
    </Modal>
  );
}
