import { useState, useCallback } from "react";

const STORAGE_KEY = "metate_admin_token";
const DEV_TOKEN = "admin-token-dev";

export function useAdmin() {
  const [adminToken, setAdminToken] = useState(() => sessionStorage.getItem(STORAGE_KEY) || "");
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!sessionStorage.getItem(STORAGE_KEY));

  const login = useCallback((token) => {
    sessionStorage.setItem(STORAGE_KEY, token);
    setAdminToken(token);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAdminToken("");
    setIsAuthenticated(false);
  }, []);

  const devLogin = useCallback(() => login(DEV_TOKEN), [login]);

  return { adminToken, isAuthenticated, login, logout, devLogin };
}
