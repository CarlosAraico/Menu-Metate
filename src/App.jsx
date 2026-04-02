import { useState } from "react";
import { MenuPage } from "./components/menu/MenuPage";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { useAdmin } from "./hooks/useAdmin";

export default function App() {
  const { adminToken, isAuthenticated, login, logout } = useAdmin();
  const [view, setView] = useState("menu"); // menu | admin

  if (view === "admin") {
    if (!isAuthenticated) {
      return <AdminLogin onLogin={login} />;
    }
    return <AdminDashboard adminToken={adminToken} onLogout={() => { logout(); }} />;
  }

  return (
    <div>
      <MenuPage />
      {/* Admin access button - subtle */}
      <button
        onClick={() => setView("admin")}
        className="fixed bottom-4 right-4 text-xs text-gray-300 hover:text-gray-400 bg-white/50 hover:bg-white/80 px-3 py-1.5 rounded-lg transition-all shadow-sm z-30"
      >
        Admin
      </button>
    </div>
  );
}
