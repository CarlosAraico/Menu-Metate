// metateApi.js - Unified API service layer
// Switches between mock backend (development) and real Google Apps Script (production)

import { mockBackend } from "../mock/mockBackend";

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";
const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL || "";

async function postToScript(action, payload) {
  const response = await fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...payload }),
  });
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data;
}

export const metateApi = {
  // ── Public endpoints ──────────────────────────────────────────────────────
  getPublicCatalog: () =>
    USE_MOCK ? mockBackend.getPublicCatalog() : postToScript("getPublicCatalog", {}),

  createOrder: (payload) =>
    USE_MOCK ? mockBackend.createOrder(payload) : postToScript("createOrder", payload),

  // ── Admin endpoints (require adminToken) ──────────────────────────────────
  getFullCatalog: (adminToken) =>
    USE_MOCK ? mockBackend.getFullCatalog(adminToken) : postToScript("getFullCatalog", { adminToken }),

  getOrders: (adminToken, filters = {}) =>
    USE_MOCK ? mockBackend.getOrders(adminToken, filters) : postToScript("getOrders", { adminToken, ...filters }),

  getClosings: (adminToken) =>
    USE_MOCK ? mockBackend.getClosings(adminToken) : postToScript("getClosings", { adminToken }),

  todayStats: (adminToken) =>
    USE_MOCK ? mockBackend.todayStats(adminToken) : postToScript("todayStats", { adminToken }),

  dailySummary: (adminToken, date) =>
    USE_MOCK ? mockBackend.dailySummary(adminToken, date) : postToScript("dailySummary", { adminToken, date }),

  updateProduct: (adminToken, productId, updates) =>
    USE_MOCK ? mockBackend.updateProduct(adminToken, productId, updates) : postToScript("updateProduct", { adminToken, productId, updates }),

  closeShift: (adminToken) =>
    USE_MOCK ? mockBackend.closeShift(adminToken) : postToScript("closeShift", { adminToken }),
};
