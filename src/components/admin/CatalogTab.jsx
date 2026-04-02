import { useState, useEffect, useCallback } from "react";
import { metateApi } from "../../services/metateApi";
import { LoadingSpinner } from "../ui/Loading";
import { EmptyState } from "../ui/EmptyState";
import { ErrorState } from "../ui/ErrorState";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

export function CatalogTab({ adminToken }) {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await metateApi.getFullCatalog(adminToken);
      setCatalog(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => { loadCatalog(); }, [loadCatalog]);

  const startEdit = (product) => {
    setEditingId(product.productId);
    setEditForm({ name: product.name, description: product.description, price: product.price, available: product.available });
  };

  const cancelEdit = () => { setEditingId(null); setEditForm({}); };

  const saveEdit = async (productId) => {
    setSaving(true);
    try {
      await metateApi.updateProduct(adminToken, productId, { ...editForm, price: Number(editForm.price) });
      setCatalog((prev) => prev.map((p) => p.productId === productId ? { ...p, ...editForm, price: Number(editForm.price) } : p));
      setEditingId(null);
    } catch (err) {
      alert("Error al guardar: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Cargando catálogo..." />;
  if (error) return <ErrorState message={error} onRetry={loadCatalog} />;
  if (catalog.length === 0) return <EmptyState icon="🍽️" title="Catálogo vacío" description="No hay productos en el catálogo." />;

  const categories = [...new Set(catalog.map((p) => p.category))];

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-700">{category}</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {catalog.filter((p) => p.category === category).map((product) =>
              editingId === product.productId ? (
                <div key={product.productId} className="p-5 bg-amber-50">
                  <div className="grid grid-cols-1 gap-3">
                    <input
                      value={editForm.name}
                      onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="Nombre"
                    />
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                      rows={2}
                      placeholder="Descripción"
                    />
                    <div className="flex gap-3">
                      <input
                        type="number"
                        value={editForm.price}
                        onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value }))}
                        className="w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                        placeholder="Precio"
                        min="0"
                      />
                      <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={editForm.available}
                          onChange={(e) => setEditForm((f) => ({ ...f, available: e.target.checked }))}
                          className="rounded"
                        />
                        Disponible
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="success" loading={saving} onClick={() => saveEdit(product.productId)}>Guardar</Button>
                    <Button size="sm" variant="secondary" onClick={cancelEdit}>Cancelar</Button>
                  </div>
                </div>
              ) : (
                <div key={product.productId} className="flex items-center gap-4 p-5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-800 truncate">{product.name}</p>
                      {!product.available && <Badge variant="danger">No disponible</Badge>}
                    </div>
                    <p className="text-sm text-gray-400 truncate mt-0.5">{product.description}</p>
                  </div>
                  <span className="text-lg font-bold text-amber-600">${product.price}</span>
                  <Button size="sm" variant="secondary" onClick={() => startEdit(product)}>Editar</Button>
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
