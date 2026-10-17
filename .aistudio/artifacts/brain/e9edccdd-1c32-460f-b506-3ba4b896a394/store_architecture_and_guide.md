# Remix Kananisa Store - System Architecture & Operations Guide

## 1. Overview
**Remix Kananisa Store** is an Ethiopian e-commerce platform tailored for local commerce in Addis Ababa and nationwide regional hubs. It features localized payment integrations (Commercial Bank of Ethiopia - CBE, Siinqee Bank, and Telebirr), real-time order tracking, client-persisted customer state, and a full-stack containerized production runtime.

---

## 2. Technical Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide React icons.
- **Backend & Serving**: Express server (`server.ts`) running Node 22 with ESM and native TypeScript support.
- **Build Tool**: Vite 8.
- **Storage / State**: LocalStorage persistence with structured initial datasets (`src/data/initialData.ts`).
- **Deployment**: Google Cloud Run ready, configured to bind to `0.0.0.0` with dynamic port handling (`process.env.PORT`).

---

## 3. Ethiopian Banking & Payment Workflows
The platform is built around Ethiopia's most prominent payment rails:

1. **Commercial Bank of Ethiopia (CBE)**:
   - Account Title: *Kananisa Store / Kananisa Gabre*
   - Direct account-to-account transfer via CBE Birr or CBE Mobile Banking.
   - Customers submit their transaction reference number upon checkout for verification.

2. **Siinqee Bank**:
   - Account Title: *Kananisa Store*
   - Supported for direct bank transfer and mobile banking payments.

3. **Telebirr**:
   - SuperApp mobile payment workflow with QR code and mobile transfer confirmation.

---

## 4. Key Features & Capabilities
- **Product Catalog**: Multi-category browsing (Flagship Smartphones, Audio & Smart Wearables, Authentic Ethiopian Habesha Fashion, Designer Footwear, Luxury Fragrances).
- **Product Detail & Customization**: Color/finish selection, size picking, and real-time stock counters.
- **Shopping Cart & Checkout**: Slide-out cart drawer with item counter, discount calculations, delivery fee calculation, and payment confirmation flow.
- **Live Order Tracker**: Multi-stage tracker (`Order Placed` -> `Payment Verified` -> `Packaging` -> `Out for Delivery` -> `Delivered`).
- **Store Manager Panel**:
  - Live inventory updates (stock count adjustments and price updates).
  - Order status management and fulfillment pipeline.
  - Adding new products with specifications and tags.
- **Account Dashboard**:
  - Customer order history with printable invoices/receipts.
  - Saved delivery addresses and contact information.

---

## 5. Deployment & Runtime Operations
- **Dev Mode**: `npm run dev` (Vite dev server on port 3000).
- **Production Build**: `npm run build` (outputs optimized bundle to `dist/`).
- **Production Execution**: `npm start` (executes `node server.ts` listening on `0.0.0.0:${PORT:-3000}`).
- **Health Check Route**: `GET /api/health` returns status `ok` and server timestamp.
