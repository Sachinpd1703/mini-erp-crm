# Subsystem PRD: Delivery, Testing & Documentation Requirements

## 1. Setup & Environment Guidelines

### 1.1 Local Run Instructions
- **Database**: PostgreSQL instance running locally or via cloud host (Neon, Supabase, Render).
- **Backend Setup**:
  1. Navigate to `/backend`
  2. Copy `.env.example` to `.env` and set `DATABASE_URL` and `JWT_SECRET`.
  3. Execute `npm install`
  4. Run Prisma database migrations: `npx prisma migrate dev`
  5. Seed database with initial roles & demo data: `npx prisma db seed`
  6. Launch API server: `npm run dev` (Port 5000)
- **Frontend Setup**:
  1. Navigate to `/frontend`
  2. Execute `npm install`
  3. Launch development client: `npm run dev` (Port 3000)

---

## 2. Testing & Quality Assurance

### 2.1 Backend Automated Tests
Unit and integration test suite organized in `/backend/tests`:
- `auth/`: JWT issuance and unauthorized access prevention.
- `customers/`: Customer validation, search filtering, and note creation.
- `products/`: Product CRUD and stock movement calculations.
- `inventory/`: Manual stock adjustments and audit log generation.
- `challans/`: Multi-item challan creation, stock locking, and insufficient stock rejection.

---

## 3. Submission Deliverables Checklist

- [x] Comprehensive PRD suite in `docs/PRD/`
- [ ] Working local project setup for Backend API and Frontend UI
- [ ] Database migration and seed script (`prisma/seed.ts`)
- [ ] Postman collection file (`postman/mini-erp-crm.postman_collection.json`)
- [ ] Full README.md with clear setup instructions, role credentials, and architecture explanation.
