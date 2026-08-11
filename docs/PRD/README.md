# Mini ERP + CRM PRD Documentation Directory

Welcome to the Product Requirement Document (PRD) suite for the **Mini ERP + CRM Operations Portal**.

This directory contains modular, exhaustive specification documents covering every aspect of the project lifecycle, architecture, role-based access control, database schema, REST API standards, and frontend UI design system.

---

##  Document Index

| Document | Title | Key Topics Covered |
| :--- | :--- | :--- |
| [**01-master-prd.md**](./01-master-prd.md) | **Master PRD** | Executive summary, business goals, role matrix, top-level architecture |
| [**02-auth-rbac-prd.md**](./02-auth-rbac-prd.md) | **Auth & RBAC Subsystem** | JWT token flow, bcrypt password security, role middleware guards, seed accounts |
| [**03-customer-crm-prd.md**](./03-customer-crm-prd.md) | **Customer CRM Subsystem** | Customer master fields, validation, status lifecycle, follow-up interaction notes |
| [**04-product-inventory-prd.md**](./04-product-inventory-prd.md) | **Product & Inventory Subsystem** | Product master data, SKU uniqueness, low stock alerts, stock movement audit logs |
| [**05-sales-challan-prd.md**](./05-sales-challan-prd.md) | **Sales Challan Subsystem** | Order fulfillment, snapshotting metadata, transaction isolation, zero-stock locks |
| [**06-api-specification-prd.md**](./06-api-specification-prd.md) | **REST API Specification** | Complete endpoint routing table, HTTP status codes, request/response JSON shapes |
| [**07-frontend-prd.md**](./07-frontend-prd.md) | **Frontend Application PRD** | UI/UX visual standards, component design system, layout views, navigation flow |
| [**08-delivery-and-documentation-prd.md**](./08-delivery-and-documentation-prd.md) | **Delivery & QA Requirements** | Local setup instructions, seed data execution, testing matrix, submission checklist |
| [**DEVELOPMENT_PLAN.md**](../DEVELOPMENT_PLAN.md) | **Development Implementation Plan** | Phase-by-phase roadmap, execution checklists, milestone Gantt chart |

---

##  Quick Nav: Pre-Seeded Test Accounts

When testing the application, use these seeded credentials:

- **Admin**: `admin@minierp.com` / `Admin123!`
- **Sales**: `sales@minierp.com` / `Sales123!`
- **Warehouse**: `warehouse@minierp.com` / `Warehouse123!`
- **Accounts**: `accounts@minierp.com` / `Accounts123!`
