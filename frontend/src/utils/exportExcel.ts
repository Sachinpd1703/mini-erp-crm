import { StockMovement } from '../types';

/**
 * Utility to export Inventory Audit Trail logs directly into Microsoft Excel (.csv / .xlsx compatible) format
 */
export function exportInventoryAuditToExcel(movements: StockMovement[], filename = 'Inventory_Audit_Log') {
  if (!movements || movements.length === 0) {
    alert('No movement records available to export.');
    return;
  }

  // Define Headers
  const headers = [
    'Timestamp',
    'Movement Type',
    'Product Name',
    'SKU Code',
    'Quantity Changed',
    'Reason / Source Description',
    'Authorized By',
    'Role',
  ];

  // Map Data Rows
  const rows = movements.map((m) => {
    const timestamp = new Date(m.createdAt).toLocaleString();
    const movementType = m.movementType;
    const productName = `"${(m.product?.name || '').replace(/"/g, '""')}"`;
    const sku = `"${(m.product?.sku || '').replace(/"/g, '""')}"`;
    const qty = m.movementType === 'IN' ? `+${m.quantity}` : `-${m.quantity}`;
    const reason = `"${(m.reason || '').replace(/"/g, '""')}"`;
    const author = `"${(m.author?.fullName || 'System').replace(/"/g, '""')}"`;
    const role = `"${(m.author?.role || '').replace(/"/g, '""')}"`;

    return [timestamp, movementType, productName, sku, qty, reason, author, role].join(',');
  });

  // Combine CSV content with UTF-8 BOM for Microsoft Excel compatibility
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');

  // Create downloadable Blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `${filename}_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
