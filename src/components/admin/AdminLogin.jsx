import { useState } from "react";
import { Button } from "../ui/Button";

export function AdminLogin({ onLogin, devMode = true }) {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token.trim()) { setError("Ingresa el token de administrador"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    onLogin(token.trim());
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔐</div>
          <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
          <p className="text-gray-400 mt-1">Metate Restaurant</p>
        </div>
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Token de administrador</label>
              <input
                type="password"
                value={token}
                onChange={(e) => { setToken(e.target.value); setError(""); }}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
              Ingresar
            </Button>
            {devMode && (
              <button
                type="button"
                onClick={() => onLogin("admin-token-dev")}
                className="w-full text-xs text-gray-500 hover:text-gray-400 py-2 transition-colors"
              >
                Acceso de desarrollo (dev)
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
