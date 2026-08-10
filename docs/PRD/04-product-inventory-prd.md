# Subsystem PRD: Product Catalog & Inventory Module

## 1. Module Scope & Goal
The Product Catalog & Inventory Module manages product master data, unit pricing, warehouse stocking, low-stock alerts, and detailed audit trail logs for all stock movements (`IN` / `OUT`).

---

## 2. Core Specifications

### 2.1 Inventory Audit Movement Flowchart

```mermaid
flowchart TD
    A[Inventory Action Event] --> B{Movement Type}
    
    B -->|IN: Purchase / Return| C[Stock Inflow Flow]
    C --> D[Add stock to Product.currentStock]
    D --> E[Insert StockMovement log: Type IN]

    B -->|OUT: Sales Order / Damaged| F[Stock Outflow Flow]
    F --> G{Is stock >= requested qty?}
    G -->|Yes| H[Deduct stock from Product.currentStock]
    H --> I[Insert StockMovement log: Type OUT]
    G -->|No| J[Reject Request: Insufficient Stock Error]

    E --> K{Check low stock alert}
    I --> K
    K -->|currentStock <= minStockAlert| L[Flag Low Stock Alert Badge]
    K -->|currentStock > minStockAlert| M[Normal Stock Level]
```

### 2.2 Product & Inventory ERD

```mermaid
erDiagram
    PRODUCTS ||--o{ STOCK_MOVEMENTS : "tracks"
    PRODUCTS ||--o{ CHALLAN_ITEMS : "referenced in"
    USERS ||--o{ STOCK_MOVEMENTS : "creates"

    PRODUCTS {
        uuid id PK
        string name
        string sku UK
        string category
        decimal unit_price
        int current_stock
        int min_stock_alert
        string location
        string image_url
    }

    STOCK_MOVEMENTS {
        uuid id PK
        uuid product_id FK
        int quantity
        string movement_type "IN | OUT"
        string reason
        uuid created_by FK
        datetime created_at
    }
```

### 2.3 Product Catalog Fields

| Field Name | Type | Description / Constraints | Required |
| :--- | :--- | :--- | :---: |
| `name` | String | Product title / description | Yes |
| `sku` | String | Unique Stock Keeping Unit (Unique index) | Yes |
| `category` | String | Product group / classification | Yes |
| `unitPrice` | Decimal | Base sales price (2 decimal precision) | Yes |
| `currentStock` | Integer | Total units on hand (Non-negative) | Yes (Default: 0) |
| `minStockAlert` | Integer | Minimum threshold triggering low-stock alert | Yes (Default: 5) |
| `location` | String | Warehouse aisle / bin designation (e.g. `Rack-A4`) | No |
| `imageUrl` | String | AWS S3 image URL or asset link | No |

---

### 2.2 Stock Movement Log (Audit Trail)
To maintain complete accountability, manual inventory changes and order fulfillment deductions create immutable `StockMovement` records:

- `productId`: FK to target Product.
- `quantity`: Positive integer quantity added or removed.
- `movementType`: Enum (`IN` for stock additions, `OUT` for order fulfillment or removals).
- `reason`: Explanation (e.g., `"Initial Purchase Stock"`, `"Sales Challan CH-202608-0001"`, `"Damaged Goods Adjustment"`).
- `createdBy`: FK to User who authorized the movement.
- `createdAt`: Auto timestamp.

---

## 3. Data Model

```prisma
enum MovementType {
  IN
  OUT
}

model Product {
  id            String   @id @default(uuid())
  name          String
  sku           String   @unique
  category      String
  unitPrice     Decimal  @db.Decimal(10, 2)
  currentStock  Int      @default(0)
  minStockAlert Int      @default(5)
  location      String?
  imageUrl      String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  stockMovements StockMovement[]
  challanItems   ChallanItem[]

  @@map("products")
}

model StockMovement {
  id           String       @id @default(uuid())
  productId    String
  quantity     Int
  movementType MovementType
  reason       String
  createdBy    String
  createdAt    DateTime     @default(now())

  product Product @relation(fields: [productId], references: [id])
  author  User    @relation(fields: [createdBy], references: [id])

  @@map("stock_movements")
}
```

---

## 4. Key Business Logic & Alerting
- **Low Stock Indicator**: Products where `currentStock <= minStockAlert` are flagged with a low-stock alert badge on the frontend UI and backend API filters.
- **Stock Audit Integrity**: Every automated deduction (Sales Challan confirmation) or manual adjustment triggers a single transaction creating a `StockMovement` row and updating `Product.currentStock`.
