import * as XLSX from 'xlsx';
import { StockMovement } from '../types';

/**
 * Utility to export Inventory Audit Trail logs directly into genuine Microsoft Excel (.xlsx) format
 */
export function exportInventoryAuditToExcel(movements: StockMovement[], filename = 'Inventory_Audit_Log') {
  if (!movements || movements.length === 0) {
    alert('No movement records available to export.');
    return;
  }

  // Format JSON records for SheetJS
  const data = movements.map((m) => ({
    'Timestamp': new Date(m.createdAt).toLocaleString(),
    'Movement Type': m.movementType,
    'Product Name': m.product?.name || 'Product',
    'SKU Code': m.product?.sku || 'N/A',
    'Quantity Changed': m.movementType === 'IN' ? `+${m.quantity}` : `-${m.quantity}`,
    'Reason / Description': m.reason || '',
    'Authorized By': m.author?.fullName || 'System User',
    'Role': m.author?.role || '',
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Configure custom column widths for clean Excel layout
  worksheet['!cols'] = [
    { wch: 22 }, // Timestamp
    { wch: 15 }, // Movement Type
    { wch: 30 }, // Product Name
    { wch: 18 }, // SKU Code
    { wch: 18 }, // Quantity Changed
    { wch: 42 }, // Reason / Description
    { wch: 22 }, // Authorized By
    { wch: 15 }, // Role
  ];

  // Create workbook and append sheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory Audit');

  // Trigger binary .xlsx download
  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `${filename}_${dateStr}.xlsx`);
}
