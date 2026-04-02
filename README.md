# 🌮 Metate — Restaurant POS & Menu System

A production-ready restaurant web application built with React 18 + Vite 5 + Tailwind CSS v3.

## Features

### Public Menu
- Catalog browsing with category tabs
- Add-to-cart with quantity controls
- Cart drawer with subtotal and suggested tip
- Checkout modal: customer info, service type (dine-in / takeout / delivery), tip selector, payment method
- Order confirmation with order ID

### Admin Panel
Accessible via the subtle **Admin** button in the bottom-right corner of the menu page.
- **Orders tab** — filterable (status, service type, date range), sortable, paginated orders table with detail modal
- **Analytics tab** — today's KPI cards (sales, orders, avg ticket, tips), payment breakdown bars, hourly sales chart
- **Closings tab** — shift close history with payment breakdown
- **Catalog tab** — inline product editing (name, description, price, availability)

## Tech Stack
- **React 18** + **Vite 5** (JSX, no TypeScript)
- **Tailwind CSS v3**
- No Redux, no heavy charting libraries

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) for the public menu.

### Admin access (development)
Click the **Admin** button → use the **"Acceso de desarrollo (dev)"** link, or enter `admin-token-dev` as the token.

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
# Use mock backend (default: true)
VITE_USE_MOCK=true

# Google Apps Script URL (only used when VITE_USE_MOCK=false)
VITE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

## Architecture

```
src/
├── mock/mockBackend.js      # In-memory mock simulating Google Apps Script + Sheets
├── services/metateApi.js    # API layer (mock ↔ real GAS endpoint switcher)
├── hooks/
│   ├── useAdmin.js          # Admin auth via sessionStorage
│   └── useCart.js           # Cart state management
└── components/
    ├── ui/                  # Button, Modal, Badge, Loading, EmptyState, ErrorState
    ├── menu/                # MenuPage, CartDrawer
    ├── checkout/            # CheckoutModal
    └── admin/               # AdminLogin, AdminDashboard, OrdersTab,
                             #   OrderDetailModal, AnalyticsTab, ClosingsTab, CatalogTab
```

## Build

```bash
npm run build   # ~239 KB JS (71 KB gzipped), ~19 KB CSS
npm run lint
```
