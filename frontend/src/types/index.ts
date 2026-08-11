export type Role = 'ADMIN' | 'SALES' | 'WAREHOUSE' | 'ACCOUNTS';
export const Role = {
  ADMIN: 'ADMIN' as Role,
  SALES: 'SALES' as Role,
  WAREHOUSE: 'WAREHOUSE' as Role,
  ACCOUNTS: 'ACCOUNTS' as Role,
};

export type CustomerType = 'RETAIL' | 'WHOLESALE' | 'DISTRIBUTOR';
export const CustomerType = {
  RETAIL: 'RETAIL' as CustomerType,
  WHOLESALE: 'WHOLESALE' as CustomerType,
  DISTRIBUTOR: 'DISTRIBUTOR' as CustomerType,
};

export type CustomerStatus = 'LEAD' | 'ACTIVE' | 'INACTIVE';
export const CustomerStatus = {
  LEAD: 'LEAD' as CustomerStatus,
  ACTIVE: 'ACTIVE' as CustomerStatus,
  INACTIVE: 'INACTIVE' as CustomerStatus,
};

export type MovementType = 'IN' | 'OUT';
export const MovementType = {
  IN: 'IN' as MovementType,
  OUT: 'OUT' as MovementType,
};

export type ChallanStatus = 'DRAFT' | 'CONFIRMED' | 'CANCELLED';
export const ChallanStatus = {
  DRAFT: 'DRAFT' as ChallanStatus,
  CONFIRMED: 'CONFIRMED' as ChallanStatus,
  CANCELLED: 'CANCELLED' as ChallanStatus,
};

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  createdAt?: string;
}

export interface CustomerNote {
  id: string;
  customerId: string;
  createdBy: string;
  note: string;
  createdAt: string;
  author?: {
    id: string;
    fullName: string;
    role: Role;
  };
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email: string;
  businessName: string;
  gstNumber?: string | null;
  customerType: CustomerType;
  address: string;
  status: CustomerStatus;
  followUpDate?: string | null;
  createdAt: string;
  notes?: CustomerNote[];
  _count?: {
    salesChallans: number;
  };
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  currentStock: number;
  minStockAlert: number;
  location?: string | null;
  imageUrl?: string | null;
  createdAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  quantity: number;
  movementType: MovementType;
  reason: string;
  createdBy: string;
  createdAt: string;
  product?: {
    id: string;
    name: string;
    sku: string;
  };
  author?: {
    id: string;
    fullName: string;
    role: Role;
  };
}

export interface ChallanItem {
  id: string;
  salesChallanId: string;
  productId: string;
  snapshotProductName: string;
  snapshotSku: string;
  snapshotUnitPrice: number;
  quantity: number;
  lineTotal: number;
  product?: {
    id: string;
    name: string;
    sku: string;
    currentStock: number;
  };
}

export interface SalesChallan {
  id: string;
  challanNumber: string;
  customerId: string;
  status: ChallanStatus;
  totalAmount: number;
  totalQuantity: number;
  createdBy: string;
  createdAt: string;
  customer: Customer;
  author?: {
    id: string;
    fullName: string;
    role: Role;
  };
  items?: ChallanItem[];
  _count?: {
    items: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  error?: {
    code: string;
    message: string;
  } | null;
}
