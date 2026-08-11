# Mini ERP + CRM Operations Portal

An enterprise-grade, high-performance operational web application engineered for wholesale and distribution companies. The system integrates Customer Relationship Management (CRM), Product Catalog & Stock Movement Auditing, and Sales Order Fulfillment (Sales Challans) into a unified, secure portal with strict Role-Based Access Control (RBAC) and atomic transaction safety.

---

## Documentation Index

All architectural and product requirements documents are organized under [`docs/`](./docs):

- [**Product Requirements Document (PRD) Suite**](./docs/PRD/README.md)
  - [`01-master-prd.md`](./docs/PRD/01-master-prd.md): System architecture, role matrix, and core module overview.
  - [`02-auth-rbac-prd.md`](./docs/PRD/02-auth-rbac-prd.md): Security architecture, JWT token flow, bcrypt hashing, and role guards.
  - [`03-customer-crm-prd.md`](./docs/PRD/03-customer-crm-prd.md): Customer demographic fields, lead status state machine, and follow-up interaction notes.
  - [`04-product-inventory-prd.md`](./docs/PRD/04-product-inventory-prd.md): Product catalog data, SKU indexing, low-stock threshold alerting, and stock audit movement logs (`IN`/`OUT`).
  - [`05-sales-challan-prd.md`](./docs/PRD/05-sales-challan-prd.md): Order status workflow (`DRAFT` ➔ `CONFIRMED`), historical item metadata snapshotting, atomic stock deduction (`prisma.$transaction`), and concurrency row locks.
  - [`06-api-specification-prd.md`](./docs/PRD/06-api-specification-prd.md): Complete RESTful API endpoint routing table and JSON response formats.
  - [`07-frontend-prd.md`](./docs/PRD/07-frontend-prd.md): React dashboard visual standards, router diagram, and component hierarchy tree.
  - [`08-delivery-and-documentation-prd.md`](./docs/PRD/08-delivery-and-documentation-prd.md): Testing matrix and delivery checklist.
- [**Development Implementation Plan**](./docs/DEVELOPMENT_PLAN.md): Phase-by-phase implementation roadmap and Gantt chart.

---

## Pre-Seeded Test Credentials

The system seed script automatically provisions pre-configured accounts for evaluator testing:

| Role | Email | Password | Allowed Capabilities |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@minierp.com` | `Admin123!` | Full system governance, user management, audit logs, catalog CRUD. |
| **SALES** | `sales@minierp.com` | `Sales123!` | Create/edit customers, log follow-ups, create & confirm Sales Challans. |
| **WAREHOUSE** | `warehouse@minierp.com` | `Warehouse123!` | Product catalog management, manual stock adjustments (`IN`/`OUT`), inventory audit log. |
| **ACCOUNTS** | `accounts@minierp.com` | `Accounts123!` | Audit order summaries, review customer profiles, stream Invoice PDFs. |

> **Evaluator Tip**: The Login screen includes one-click **Quick-Fill Demo Role Buttons** to quickly switch between roles without typing credentials!

---

## Required Tech Stack

- **Backend API**: Node.js, TypeScript, Express.js, Prisma ORM, PostgreSQL, JWT (`jsonwebtoken`), bcryptjs, Zod validation, PDFKit.
- **Frontend App**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React icons, Axios.
- **Database**: PostgreSQL (Local or Cloud host like Supabase, Neon, Render).

---

## Quick Start Guide

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL database instance running locally or hosted online.

---

### Step 1: Backend Setup (`/backend`)

1. Open terminal and navigate to backend:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Copy `.env.example` to `.env` and set your PostgreSQL connection string:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL="postgresql://user:password@localhost:5432/minierp_db?schema=public"
   JWT_SECRET="mini_erp_super_secret_jwt_key_2026"
   CORS_ORIGIN="http://localhost:3000"
   ```

4. Run Database Migrations & Seed Script:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

5. Launch Backend Server:
   ```bash
   npm run dev
   ```
   *The server will launch at `http://localhost:5000`.*

---

### Step 2: Frontend Setup (`/frontend`)

1. Open a new terminal and navigate to frontend:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch Development Web Client:
   ```bash
   npm run dev
   ```
   *The web client will launch at `http://localhost:3000`.*

---

## Core Business Features & Concurrency Protection

1. **Atomic Stock Locking & Zero-Stock Protection**:
   When a Sales Challan is confirmed (`PATCH /api/v1/challans/:id/status`), the system opens an isolated `prisma.$transaction` block. If requested line item quantity exceeds available inventory, the transaction aborts with HTTP `400 Bad Request` returning line-item stock levels, preventing negative inventory overselling.

2. **Metadata Snapshotting**:
   When creating or confirming sales orders, product names, SKUs, and prices are snapshotted into `ChallanItem`. Future price changes in product catalog do not retroactively alter historical invoices.

3. **Dynamic PDF Invoice Streaming**:
   Client & backend stream computer-generated PDF invoices with company header, client GSTIN details, line item snapshots, and GST summaries via `/api/v1/challans/:id/pdf`.

4. **Postman API Collection**:
   Pre-configured API requests are located at [`postman/mini-erp-crm.postman_collection.json`](./postman/mini-erp-crm.postman_collection.json).
