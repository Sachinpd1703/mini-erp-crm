# Subsystem PRD: Sales Challan Module

## 1. Module Scope & Business Goal
The Sales Challan Module governs the creation, confirmation, stock allocation, and invoice generation for customer sales orders. It ensures strict inventory integrity through historical metadata snapshotting and atomic database transaction locks.

---

## 2. Core Functional Requirements

### 2.1 Sales Challan Lifecycle State Machine

```mermaid
stateDiagram-v2
    [*] --> Draft: Order Form Submitted
    Draft --> Confirmed: Action: Confirm Challan
    Draft --> Cancelled: Action: Cancel Order
    
    state Confirmed {
        [*] --> AcquireLock: Open prisma.$transaction
        AcquireLock --> SelectForUpdate: SELECT FOR UPDATE on Products
        SelectForUpdate --> ValidateStock: Check currentStock >= qty
        ValidateStock --> DeductStock: Subtract stock
        DeductStock --> LogMovement: Create StockMovement(OUT)
        LogMovement --> CommitTransaction: Set status = CONFIRMED
    }

    ValidateStock --> RollbackTransaction: Stock < qty (Insufficient)
    RollbackTransaction --> Draft: Return 400 Bad Request Error
    CommitTransaction --> [*]
```

### 2.2 Product Snapshot & Concurrency Flowchart

```mermaid
flowchart TD
    A[Sales User Clicks Confirm Challan] --> B[Open DB Isolated Transaction]
    B --> C[Fetch Products with Row Locks: SELECT FOR UPDATE]
    C --> D[Snapshot Product metadata: Name, SKU, Unit Price]
    D --> E{Check Stock for All Line Items}
    
    E -->|Stock Sufficient| F[Update Product.currentStock = currentStock - quantity]
    F --> G[Insert StockMovement log: OUT]
    G --> H[Create ChallanItem records with snapshot details]
    H --> I[Update SalesChallan status to CONFIRMED]
    I --> J[Commit DB Transaction & Return 200 OK]

    E -->|Stock Insufficient| K[Rollback Transaction]
    K --> L[Return HTTP 400 Insufficient Stock Error JSON]
```

### 2.3 Product Snapshot Business Rule
**Critical Requirement**: When a Sales Challan is created or confirmed, product details (`name`, `sku`, `unitPrice`) MUST be snapshotted into `ChallanItem`. 
*Rationale*: Future price updates or changes to product catalog names must never retroactively modify past sales orders or historical invoices.

---

## 3. Concurrency & Negative Stock Protection

To guarantee that inventory is never reduced below zero when multiple sales agents submit orders simultaneously:

1. **Transaction Isolation**: Confirmation runs inside a `prisma.$transaction`.
2. **Row Locking**: Row-level locks (`SELECT ... FOR UPDATE`) lock target product rows.
3. **Validation & Atomic Rollback**:
   - For each requested line item, system checks: `if (product.currentStock < item.quantity)`.
   - If stock is insufficient, transaction aborts immediately with `HTTP 400 Bad Request`.
   - Error response contains SKU and available vs requested quantities.
   - If stock is sufficient:
     - Decrements `product.currentStock`.
     - Creates `StockMovement` log with `movementType: OUT`.
     - Updates Challan status to `CONFIRMED`.

---

## 4. Data Model

```prisma
enum ChallanStatus {
  DRAFT
  CONFIRMED
  CANCELLED
}

model SalesChallan {
  id            String        @id @default(uuid())
  challanNumber String        @unique
  customerId    String
  status        ChallanStatus @default(DRAFT)
  totalAmount   Decimal       @db.Decimal(10, 2)
  totalQuantity Int
  createdBy     String
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  customer Customer      @relation(fields: [customerId], references: [id])
  author   User          @relation(fields: [createdBy], references: [id])
  items    ChallanItem[]

  @@map("sales_challans")
}

model ChallanItem {
  id                  String       @id @default(uuid())
  salesChallanId      String
  productId           String
  snapshotProductName String
  snapshotSku         String
  snapshotUnitPrice   Decimal      @db.Decimal(10, 2)
  quantity            Int
  lineTotal           Decimal      @db.Decimal(10, 2)

  salesChallan SalesChallan @relation(fields: [salesChallanId], references: [id], onDelete: Cascade)
  product      Product      @relation(fields: [productId], references: [id])

  @@map("challan_items")
}
```

---

## 5. Challan Number Generation Rule
- Automatically generated sequential code format: `CH-YYYYMM-XXXX` (e.g., `CH-202608-0001`).
- Ensured unique via database unique constraint and transaction incrementing.
