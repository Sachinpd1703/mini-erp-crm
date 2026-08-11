import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';
import { LoginPage } from '../modules/auth/LoginPage';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { DashboardPage } from '../modules/dashboard/DashboardPage';
import { CustomersPage } from '../modules/customers/CustomersPage';
import { CustomerDetailPage } from '../modules/customers/CustomerDetailPage';
import { ProductsPage } from '../modules/products/ProductsPage';
import { ProductDetailPage } from '../modules/products/ProductDetailPage';
import { InventoryPage } from '../modules/inventory/InventoryPage';
import { ChallansPage } from '../modules/challans/ChallansPage';
import { ChallanDetailPage } from '../modules/challans/ChallanDetailPage';
import { UsersPage } from '../modules/users/UsersPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFBF7] dark:bg-slate-950 flex items-center justify-center text-[#6B5542] dark:text-slate-400 text-xs">
        Verifying Authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <CustomersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customers/:id"
        element={
          <ProtectedRoute>
            <CustomerDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products/:id"
        element={
          <ProtectedRoute>
            <ProductDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <InventoryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/challans"
        element={
          <ProtectedRoute>
            <ChallansPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/challans/:id"
        element={
          <ProtectedRoute>
            <ChallanDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <UsersPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
