import * as XLSX from 'xlsx';
import { StockMovement, Customer, SalesChallan } from '../types';

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

/**
 * Utility to export complete Customer Financial Ledger Statement directly into native Microsoft Excel (.xlsx) format
 */
export function exportCustomerStatementToExcel(customer: Customer) {
  if (!customer) return;

  const salesChallans: SalesChallan[] = customer.salesChallans || [];
  const confirmedChallans = salesChallans.filter((c) => c.status === 'CONFIRMED');
  const totalBilled = confirmedChallans.reduce((sum, c) => sum + Number(c.totalAmount || 0), 0);

  // Sheet 1: Financial Ledger Statement Rows
  const ledgerData = salesChallans.map((ch) => ({
    'Date': new Date(ch.createdAt).toLocaleDateString(),
    'Challan / Invoice Number': ch.challanNumber,
    'Transaction Type': 'Sales Order Invoice',
    'Status': ch.status,
    'Items Count': ch.items?.length || ch._count?.items || 0,
    'Total Quantity (Pcs)': ch.totalQuantity || 0,
    'Debit Amount Billed (INR)': Number(ch.totalAmount || 0),
  }));

  const ledgerSheet = XLSX.utils.json_to_sheet(ledgerData);

  // Configure column widths for ledger sheet
  ledgerSheet['!cols'] = [
    { wch: 15 }, // Date
    { wch: 25 }, // Challan Number
    { wch: 24 }, // Transaction Type
    { wch: 15 }, // Status
    { wch: 14 }, // Items Count
    { wch: 20 }, // Total Quantity
    { wch: 25 }, // Debit Amount
  ];

  // Sheet 2: Master Profile Summary
  const profileSummary = [
    { 'Field': 'Business / Trade Name', 'Value': customer.businessName },
    { 'Field': 'Contact Person', 'Value': customer.name },
    { 'Field': 'Email Address', 'Value': customer.email },
    { 'Field': 'Phone / Mobile', 'Value': customer.mobile },
    { 'Field': 'GSTIN', 'Value': customer.gstNumber || 'N/A' },
    { 'Field': 'Customer Category', 'Value': customer.customerType },
    { 'Field': 'Account Status', 'Value': customer.status },
    { 'Field': 'Registered Address', 'Value': customer.address },
    { 'Field': 'Statement Export Date', 'Value': new Date().toLocaleDateString() },
    { 'Field': 'Total Lifetime Orders', 'Value': salesChallans.length },
    { 'Field': 'Confirmed Invoiced Amount (INR)', 'Value': totalBilled },
  ];

  const profileSheet = XLSX.utils.json_to_sheet(profileSummary);
  profileSheet['!cols'] = [{ wch: 30 }, { wch: 40 }];

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, ledgerSheet, 'Financial Ledger');
  XLSX.utils.book_append_sheet(workbook, profileSheet, 'Customer Profile');

  const sanitizeName = (customer.businessName || customer.name).replace(/[^a-zA-Z0-9_-]/g, '_');
  const dateStr = new Date().toISOString().split('T')[0];

  XLSX.writeFile(workbook, `Statement_${sanitizeName}_${dateStr}.xlsx`);
}
