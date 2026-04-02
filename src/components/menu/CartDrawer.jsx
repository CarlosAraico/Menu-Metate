export function CartDrawer({ isOpen, onClose, items, removeItem, updateQuantity, total, onCheckout }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-sm bg-white h-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-bold">Tu pedido</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Tu carrito está vacío</p>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">${item.price} c/u</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">−</button>
                  <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center hover:bg-amber-200">+</button>
                </div>
                <span className="text-sm font-semibold w-16 text-right">${(item.price * item.quantity).toFixed(2)}</span>
                <button onClick={() => removeItem(item.productId)} className="text-gray-300 hover:text-red-400 ml-1">✕</button>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="p-5 border-t space-y-3">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span><span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Propina sugerida (15%)</span><span>${(total * 0.15).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total estimado</span><span>${(total * 1.15).toFixed(2)}</span>
            </div>
            <button onClick={onCheckout} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors">
              Proceder al pago
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
