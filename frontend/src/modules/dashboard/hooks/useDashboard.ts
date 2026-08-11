import { useState, useEffect } from 'react';
import { Product, SalesChallan } from '../../../types';
import { clientCache, getCachedData } from '../../../services/apiCache';

export function useDashboard() {
  const [loading, setLoading] = useState(true);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [inventoryOverview, setInventoryOverview] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    totalStockUnits: 0,
  });
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [recentChallans, setRecentChallans] = useState<SalesChallan[]>([]);

  const fetchDashboardData = async (forceRefresh = false) => {
    if (forceRefresh) {
      clientCache.invalidate('/customers');
      clientCache.invalidate('/inventory');
      clientCache.invalidate('/products');
      clientCache.invalidate('/challans');
    }

    const cachedCust = clientCache.get<any>('/customers', { limit: 1 });
    const cachedInv = clientCache.get<any>('/inventory/overview');
    const cachedLow = clientCache.get<any>('/products', { lowStockOnly: true, limit: 5 });
    const cachedChal = clientCache.get<any>('/challans', { limit: 5 });

    const hasFullCache = cachedCust && cachedInv && cachedLow && cachedChal;

    if (hasFullCache && !forceRefresh) {
      setTotalCustomers(cachedCust.meta?.total || 0);
      setInventoryOverview(cachedInv.data || cachedInv);
      setLowStockProducts(cachedLow.data || []);
      setRecentChallans(cachedChal.data || []);
      setLoading(false);
      return;
    }

    if (!hasFullCache) {
      setLoading(true);
    }

    try {
      const [custRes, invRes, lowStockRes, challanRes] = await Promise.all([
        getCachedData('/customers', { limit: 1 }),
        getCachedData('/inventory/overview'),
        getCachedData('/products', { lowStockOnly: true, limit: 5 }),
        getCachedData('/challans', { limit: 5 }),
      ]);

      if (custRes.data.success) setTotalCustomers(custRes.data.meta?.total || 0);
      if (invRes.data.success) setInventoryOverview(invRes.data.data);
      if (lowStockRes.data.success) setLowStockProducts(lowStockRes.data.data);
      if (challanRes.data.success) setRecentChallans(challanRes.data.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    loading,
    totalCustomers,
    inventoryOverview,
    lowStockProducts,
    recentChallans,
    fetchDashboardData,
  };
}
