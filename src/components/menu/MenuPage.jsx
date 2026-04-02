import { useState, useEffect, useCallback } from "react";
import { metateApi } from "../../services/metateApi";
import { useCart } from "../../hooks/useCart";
import { LoadingSpinner } from "../ui/Loading";
import { ErrorState } from "../ui/ErrorState";
import { Button } from "../ui/Button";
import { CartDrawer } from "./CartDrawer";
import { CheckoutModal } from "../checkout/CheckoutModal";

export function MenuPage() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const { items, addItem, removeItem, updateQuantity, clearCart, total, itemCount } = useCart();

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await metateApi.getPublicCatalog();
      setCatalog(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCatalog(); }, [loadCatalog]);

  const categories = ["all", ...new Set(catalog.map((p) => p.category))];
  const filtered = activeCategory === "all" ? catalog : catalog.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <header className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">🌮 Metate</h1>
            <p className="text-amber-100 mt-1 text-sm">Cocina tradicional mexicana</p>
          </div>
          {itemCount > 0 && (
            <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-white transition-all">
              <span className="text-xl">🛒</span>
              <span className="font-semibold">${total.toFixed(2)}</span>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{itemCount}</span>
            </button>
          )}
        </div>
      </header>

      {/* Category tabs */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-1 py-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? "bg-amber-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}
              >
                {cat === "all" ? "Todo" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {loading && <LoadingSpinner message="Cargando menú..." />}
        {error && <ErrorState message={error} onRetry={loadCatalog} />}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((product) => {
              const cartItem = items.find((i) => i.productId === product.productId);
              return (
                <div key={product.productId} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
                  <div>
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-bold text-amber-600">${product.price}</span>
                    {cartItem ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(product.productId, cartItem.quantity - 1)} className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold hover:bg-amber-200">−</button>
                        <span className="font-semibold w-4 text-center">{cartItem.quantity}</span>
                        <button onClick={() => addItem(product)} className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold hover:bg-amber-600">+</button>
                      </div>
                    ) : (
                      <Button size="sm" onClick={() => addItem(product)}>Agregar</Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating cart button */}
      {itemCount > 0 && !cartOpen && (
        <div className="fixed bottom-6 inset-x-4 z-40 max-w-sm mx-auto">
          <button onClick={() => setCartOpen(true)} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-2xl shadow-xl flex items-center justify-between px-5 transition-all">
            <span className="bg-white/20 px-2 py-0.5 rounded-lg text-sm">{itemCount} artículos</span>
            <span>Ver carrito</span>
            <span className="font-bold">${total.toFixed(2)}</span>
          </button>
        </div>
      )}

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={items}
        removeItem={removeItem}
        updateQuantity={updateQuantity}
        total={total}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={items}
        cartTotal={total}
        onSuccess={() => { clearCart(); setCheckoutOpen(false); }}
      />
    </div>
  );
}
