# Master Product Requirement Document (PRD): Mini ERP + CRM Operations Portal

## 1. Executive Summary
The **Mini ERP + CRM Operations Portal** is an end-to-end operational software platform engineered for wholesale and distribution enterprises. The system integrates Customer Relationship Management (CRM), Product & Inventory Lifecycle Management, Stock Audit Movement Tracking, and Sales Order Fulfillment (Sales Challan generation) into a unified, secure, real-time portal.

The goal is to deliver an enterprise-grade, high-performance, modular full-stack solution with complete transaction safety, strict Role-Based Access Control (RBAC), and deployment readiness within a 48-hour timeline.

---

## 2. Business Objectives & Key Metrics
- **Order Processing Speed**: Reduce order creation to fulfillment cycle time by 60%.
- **Inventory Accuracy**: Zero stock discrepancies by recording immutable `IN` and `OUT` stock movement audit logs.
- **Transaction Safety**: 100% elimination of negative stock overselling through database row-level locking.
- **Customer Follow-Up Tracking**: Increase sales conversion by structured lead tracking and follow-up schedules.

---

## 3. High-Level System Architecture & Scope

```mermaid
graph TD
    User([Web Client / User Browser])
    
    subgraph Frontend Tier - React 18 + Vite
        ReactApp[React 18 Dashboard Application]
        StateMgmt[React Query / Auth Context]
        UIComponents[Tailwind CSS + Lucide Icons UI]
    end

    subgraph Backend API Tier - Express.js Node.js
        ExpressAPI[Express.js REST API Server]
        AuthMW[JWT & RBAC Guard Middleware]
        ZodVal[Zod Schema Request Validator]
        Services[Business Logic & Stock Lock Services]
        PrismaORM[Prisma ORM Layer]
    end

    subgraph Database Tier
        PostgresDB[(PostgreSQL Database)]
    end

    User -->|HTTP / REST API| ReactApp
    ReactApp --> StateMgmt
    StateMgmt --> UIComponents
    ReactApp -->|JSON Requests + JWT| AuthMW
    AuthMW --> ZodVal
    ZodVal --> Services
    Services --> PrismaORM
    PrismaORM -->|SQL Queries & Row Locks| PostgresDB
```

### Module Relationship & Core Business Flow

```mermaid
flowchart LR
    A[Sales / Admin Users] -->|1. Register / Lead Track| B(Customer CRM Module)
    C[Warehouse Users] -->|2. Manage Stock / Audit| D(Product & Inventory Module)
    B -->|3. Create Sales Order| E(Sales Challan Module)
    D -->|4. Stock Check & Snapshot| E
    E -->|5. On Confirmation| F[Atomic Stock Reduction & Audit Log]
    E -->|6. Generate Invoice| G[Accounts / Invoice PDF]
```

---

## 4. Operational Roles & Responsibilities Matrix

| Module | Admin | Sales | Warehouse | Accounts |
| :--- | :---: | :---: | :---: | :---: |
| **User & RBAC Management** | Full (CRUD) | None | None | None |
| **Customer CRM & Notes** | Full (CRUD) | Create/Edit/Search | Read-Only | Read-Only |
| **Product Catalog** | Full (CRUD) | Read-Only | Create/Edit/Search | Read-Only |
| **Inventory Stock Movements** | Full Audit | Read-Only | Create (IN/OUT) | Read-Only |
| **Sales Challans (Draft)** | Create/Edit | Create/Edit | Read-Only | Read-Only |
| **Sales Challans (Confirm)**| Confirm | Confirm | View Order | Audit/PDF |

---

## 5. Summary of PRD Modular Suite
This Master PRD serves as the entry point. Detailed subsystem specifications are divided into:
- [**02-auth-rbac-prd.md**](./02-auth-rbac-prd.md): User authentication, JWT tokens, password hashing, and middleware guards.
- [**03-customer-crm-prd.md**](./03-customer-crm-prd.md): Lead lifecycle, customer profiles, contact info, and follow-up note tracking.
- [**04-product-inventory-prd.md**](./04-product-inventory-prd.md): Product catalog management, SKU indexing, and stock movement logs.
- [**05-sales-challan-prd.md**](./05-sales-challan-prd.md): Multi-item sales orders, price & metadata snapshotting, atomic stock deduction.
- [**06-api-specification-prd.md**](./06-api-specification-prd.md): Complete RESTful API contracts, status codes, request/response formats.
- [**07-frontend-prd.md**](./07-frontend-prd.md): User interface design system, state management, pages, and interactive workflows.
- [**08-delivery-and-documentation-prd.md**](./08-delivery-and-documentation-prd.md): Testing, deployment strategies, seed data, and deliverable checklists.
