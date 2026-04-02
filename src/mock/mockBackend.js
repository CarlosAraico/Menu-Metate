// Mock backend simulating Google Apps Script + Google Sheets behavior
// All prices/calculations are authoritative on the "server" side

const MOCK_ADMIN_TOKEN = "admin-token-dev";

const catalog = [
  { productId: "P001", name: "Taco de Bistec", description: "Taco con bistec asado, cebolla y cilantro", price: 35, category: "Tacos", available: true },
  { productId: "P002", name: "Taco de Pollo", description: "Taco con pollo a la plancha y guacamole", price: 32, category: "Tacos", available: true },
  { productId: "P003", name: "Taco de Pastor", description: "Taco al pastor con piña y salsa roja", price: 33, category: "Tacos", available: true },
  { productId: "P004", name: "Quesadilla de Queso", description: "Quesadilla con queso Oaxaca derretido", price: 55, category: "Quesadillas", available: true },
  { productId: "P005", name: "Quesadilla de Pollo", description: "Quesadilla con pollo, queso y champiñones", price: 65, category: "Quesadillas", available: true },
  { productId: "P006", name: "Burrito de Bistec", description: "Burrito con bistec, frijoles, arroz y guacamole", price: 85, category: "Burritos", available: true },
  { productId: "P007", name: "Agua de Jamaica", description: "Agua fresca de jamaica natural", price: 25, category: "Bebidas", available: true },
  { productId: "P008", name: "Agua de Horchata", description: "Horchata tradicional con canela", price: 25, category: "Bebidas", available: true },
  { productId: "P009", name: "Refresco", description: "Refresco de lata 355ml", price: 20, category: "Bebidas", available: true },
  { productId: "P010", name: "Pozole Rojo", description: "Pozole rojo con cerdo, garnachas y tostadas", price: 95, category: "Especiales", available: true },
];

const orders = [
  {
    orderId: "ORD-001",
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    customer: { name: "Juan Pérez", phone: "555-0101" },
    serviceType: "dine-in",
    status: "delivered",
    items: [
      { productId: "P001", name: "Taco de Bistec", quantity: 3, unitPrice: 35, lineTotal: 105 },
      { productId: "P007", name: "Agua de Jamaica", quantity: 2, unitPrice: 25, lineTotal: 50 },
    ],
    subtotal: 155,
    tip: 23.25,
    total: 178.25,
    payments: [{ method: "cash", amount: 178.25 }],
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1.5 * 3600000).toISOString(),
  },
  {
    orderId: "ORD-002",
    timestamp: new Date(Date.now() - 1.5 * 3600000).toISOString(),
    customer: { name: "María García", phone: "555-0102" },
    serviceType: "takeout",
    status: "delivered",
    items: [
      { productId: "P004", name: "Quesadilla de Queso", quantity: 2, unitPrice: 55, lineTotal: 110 },
      { productId: "P008", name: "Agua de Horchata", quantity: 1, unitPrice: 25, lineTotal: 25 },
    ],
    subtotal: 135,
    tip: 0,
    total: 135,
    payments: [{ method: "card", amount: 135 }],
    createdAt: new Date(Date.now() - 1.5 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
  {
    orderId: "ORD-003",
    timestamp: new Date(Date.now() - 0.5 * 3600000).toISOString(),
    customer: { name: "Carlos López", phone: "555-0103" },
    serviceType: "delivery",
    status: "preparing",
    items: [
      { productId: "P006", name: "Burrito de Bistec", quantity: 1, unitPrice: 85, lineTotal: 85 },
      { productId: "P002", name: "Taco de Pollo", quantity: 2, unitPrice: 32, lineTotal: 64 },
      { productId: "P009", name: "Refresco", quantity: 2, unitPrice: 20, lineTotal: 40 },
    ],
    subtotal: 189,
    tip: 28.35,
    total: 217.35,
    payments: [{ method: "transfer", amount: 217.35 }],
    createdAt: new Date(Date.now() - 0.5 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 0.25 * 3600000).toISOString(),
  },
  {
    orderId: "ORD-004",
    timestamp: new Date(Date.now() - 0.1 * 3600000).toISOString(),
    customer: { name: "Ana Martínez", phone: "555-0104" },
    serviceType: "dine-in",
    status: "pending",
    items: [
      { productId: "P010", name: "Pozole Rojo", quantity: 1, unitPrice: 95, lineTotal: 95 },
      { productId: "P003", name: "Taco de Pastor", quantity: 2, unitPrice: 33, lineTotal: 66 },
    ],
    subtotal: 161,
    tip: 24.15,
    total: 185.15,
    payments: [{ method: "cash", amount: 185.15 }],
    createdAt: new Date(Date.now() - 0.1 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 0.05 * 3600000).toISOString(),
  },
];

const closings = [
  {
    closingId: "CLO-001",
    shiftDate: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    closedAt: new Date(Date.now() - 86400000 + 8 * 3600000).toISOString(),
    totalOrders: 45,
    totalSales: 8750.5,
    totalTips: 1312.58,
    paymentBreakdown: { cash: 3500, card: 4200.5, transfer: 1050 },
    closedBy: "admin",
  },
];

// Server-side price calculation (authoritative)
function calculateOrderTotals(items) {
  const productMap = Object.fromEntries(catalog.map((p) => [p.productId, p]));
  const resolvedItems = items.map((item) => {
    const product = productMap[item.productId];
    if (!product || !product.available) throw new Error(`Product ${item.productId} not available`);
    const qty = Math.max(1, parseInt(item.quantity, 10));
    const unitPrice = product.price;
    return { productId: item.productId, name: product.name, quantity: qty, unitPrice, lineTotal: unitPrice * qty };
  });
  const subtotal = resolvedItems.reduce((sum, i) => sum + i.lineTotal, 0);
  const tipRate = 0.15;
  const tip = Math.round(subtotal * tipRate * 100) / 100;
  const total = subtotal + tip;
  return { resolvedItems, subtotal, tip, total };
}

function verifyAdmin(token) {
  return token === MOCK_ADMIN_TOKEN;
}

let orderCounter = orders.length;

export const mockBackend = {
  // Public endpoint - no cost exposed
  getPublicCatalog: async () => {
    await delay(200);
    return catalog
      .filter((p) => p.available)
      .map(({ productId, name, description, price, category, available }) => ({
        productId, name, description, price, category, available,
      }));
  },

  // Public endpoint - create order
  createOrder: async (payload) => {
    await delay(300);
    const { items, customer, serviceType, tipOverride } = payload;
    if (!items || !items.length) throw new Error("No items provided");
    const { resolvedItems, subtotal, tip: autoTip } = calculateOrderTotals(items);
    const tip = tipOverride !== undefined ? Math.round(tipOverride * 100) / 100 : autoTip;
    const total = subtotal + tip;
    const newOrder = {
      orderId: `ORD-${String(++orderCounter).padStart(3, "0")}`,
      timestamp: new Date().toISOString(),
      customer: customer || { name: "Anónimo", phone: "" },
      serviceType: serviceType || "dine-in",
      status: "pending",
      items: resolvedItems,
      subtotal,
      tip,
      total,
      payments: payload.payments || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    orders.push(newOrder);
    return { success: true, orderId: newOrder.orderId, total };
  },

  // Admin endpoints
  getFullCatalog: async (adminToken) => {
    await delay(200);
    if (!verifyAdmin(adminToken)) throw new Error("Unauthorized");
    return catalog;
  },

  getOrders: async (adminToken, filters = {}) => {
    await delay(250);
    if (!verifyAdmin(adminToken)) throw new Error("Unauthorized");
    let result = [...orders];
    if (filters.status) result = result.filter((o) => o.status === filters.status);
    if (filters.serviceType) result = result.filter((o) => o.serviceType === filters.serviceType);
    if (filters.dateFrom) result = result.filter((o) => new Date(o.createdAt) >= new Date(filters.dateFrom));
    if (filters.dateTo) result = result.filter((o) => new Date(o.createdAt) <= new Date(filters.dateTo + "T23:59:59"));
    if (filters.sortBy === "total") result.sort((a, b) => filters.sortDir === "asc" ? a.total - b.total : b.total - a.total);
    else result.sort((a, b) => filters.sortDir === "asc" ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt));
    return result;
  },

  getClosings: async (adminToken) => {
    await delay(200);
    if (!verifyAdmin(adminToken)) throw new Error("Unauthorized");
    return closings;
  },

  todayStats: async (adminToken) => {
    await delay(200);
    if (!verifyAdmin(adminToken)) throw new Error("Unauthorized");
    const today = new Date().toISOString().split("T")[0];
    const todayOrders = orders.filter((o) => o.createdAt.startsWith(today));
    const totalSales = todayOrders.reduce((sum, o) => sum + o.total, 0);
    const totalTips = todayOrders.reduce((sum, o) => sum + o.tip, 0);
    const paymentBreakdown = todayOrders.reduce((acc, o) => {
      o.payments.forEach((p) => { acc[p.method] = (acc[p.method] || 0) + p.amount; });
      return acc;
    }, {});
    return {
      totalOrders: todayOrders.length,
      totalSales: Math.round(totalSales * 100) / 100,
      totalTips: Math.round(totalTips * 100) / 100,
      averageTicket: todayOrders.length ? Math.round((totalSales / todayOrders.length) * 100) / 100 : 0,
      paymentBreakdown,
      date: today,
    };
  },

  dailySummary: async (adminToken, date) => {
    await delay(200);
    if (!verifyAdmin(adminToken)) throw new Error("Unauthorized");
    const targetDate = date || new Date().toISOString().split("T")[0];
    const dayOrders = orders.filter((o) => o.createdAt.startsWith(targetDate));
    const totalSales = dayOrders.reduce((sum, o) => sum + o.total, 0);
    const paymentBreakdown = dayOrders.reduce((acc, o) => {
      o.payments.forEach((p) => { acc[p.method] = (acc[p.method] || 0) + p.amount; });
      return acc;
    }, {});
    return { date: targetDate, totalOrders: dayOrders.length, totalSales, paymentBreakdown, orders: dayOrders };
  },

  updateProduct: async (adminToken, productId, updates) => {
    await delay(200);
    if (!verifyAdmin(adminToken)) throw new Error("Unauthorized");
    const idx = catalog.findIndex((p) => p.productId === productId);
    if (idx === -1) throw new Error("Product not found");
    Object.assign(catalog[idx], updates);
    return { success: true, product: catalog[idx] };
  },

  closeShift: async (adminToken) => {
    await delay(400);
    if (!verifyAdmin(adminToken)) throw new Error("Unauthorized");
    const today = new Date().toISOString().split("T")[0];
    const todayOrders = orders.filter((o) => o.createdAt.startsWith(today) && o.status === "delivered");
    const totalSales = todayOrders.reduce((sum, o) => sum + o.total, 0);
    const totalTips = todayOrders.reduce((sum, o) => sum + o.tip, 0);
    const paymentBreakdown = todayOrders.reduce((acc, o) => {
      o.payments.forEach((p) => { acc[p.method] = (acc[p.method] || 0) + p.amount; });
      return acc;
    }, {});
    const closing = {
      closingId: `CLO-${String(closings.length + 1).padStart(3, "0")}`,
      shiftDate: today,
      closedAt: new Date().toISOString(),
      totalOrders: todayOrders.length,
      totalSales: Math.round(totalSales * 100) / 100,
      totalTips: Math.round(totalTips * 100) / 100,
      paymentBreakdown,
      closedBy: "admin",
    };
    closings.push(closing);
    return { success: true, closing };
  },
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
