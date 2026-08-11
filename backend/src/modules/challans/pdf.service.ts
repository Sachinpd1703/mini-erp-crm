import PDFDocument from 'pdfkit';

export class PdfService {
  static generateChallanPdf(challan: any): any {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // 1. Header & Branding
    doc
      .fillColor('#0f172a')
      .fontSize(22)
      .text('MINI ERP DISTRIBUTION CO.', { align: 'left' })
      .fontSize(10)
      .fillColor('#475569')
      .text('100 Industrial Business Parkway, Suite 400')
      .text('Phone: +91 (022) 555-0199 | GSTIN: 27AAAAA1234A1Z5')
      .moveDown();

    doc
      .strokeColor('#cbd5e1')
      .lineWidth(1)
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke()
      .moveDown();

    // 2. Invoice Metadata Block
    const metaTop = doc.y;
    doc
      .fontSize(14)
      .fillColor('#0284c7')
      .text('SALES CHALLAN / INVOICE', 50, metaTop)
      .fontSize(10)
      .fillColor('#334155')
      .text(`Challan Number: ${challan.challanNumber}`, 50, metaTop + 20)
      .text(`Date: ${new Date(challan.createdAt).toLocaleDateString()}`, 50, metaTop + 35)
      .text(`Status: ${challan.status}`, 50, metaTop + 50);

    // Customer Billing Block
    doc
      .fontSize(11)
      .fillColor('#0f172a')
      .text('BILL TO:', 320, metaTop)
      .fontSize(10)
      .fillColor('#334155')
      .text(`${challan.customer.businessName}`, 320, metaTop + 18)
      .text(`Attn: ${challan.customer.name}`, 320, metaTop + 32)
      .text(`Email: ${challan.customer.email}`, 320, metaTop + 46)
      .text(`Mobile: ${challan.customer.mobile}`, 320, metaTop + 60)
      .text(`GSTIN: ${challan.customer.gstNumber || 'N/A'}`, 320, metaTop + 74)
      .moveDown(3);

    // 3. Line Items Table Header
    const tableTop = 240;
    doc
      .fillColor('#0f172a')
      .fontSize(10)
      .text('#', 50, tableTop)
      .text('Product Description / SKU', 80, tableTop)
      .text('Unit Price', 310, tableTop, { width: 70, align: 'right' })
      .text('Qty', 390, tableTop, { width: 50, align: 'right' })
      .text('Line Total (INR)', 450, tableTop, { width: 95, align: 'right' });

    doc
      .strokeColor('#0284c7')
      .lineWidth(1.5)
      .moveTo(50, tableTop + 15)
      .lineTo(545, tableTop + 15)
      .stroke();

    // 4. Table Line Items
    let position = tableTop + 25;
    challan.items.forEach((item: any, index: number) => {
      doc
        .fillColor('#334155')
        .fontSize(9)
        .text((index + 1).toString(), 50, position)
        .text(`${item.snapshotProductName}\n[SKU: ${item.snapshotSku}]`, 80, position, { width: 220 })
        .text(`Rs. ${Number(item.snapshotUnitPrice).toFixed(2)}`, 310, position, { width: 70, align: 'right' })
        .text(item.quantity.toString(), 390, position, { width: 50, align: 'right' })
        .text(`Rs. ${Number(item.lineTotal).toFixed(2)}`, 450, position, { width: 95, align: 'right' });

      position += 30;
    });

    doc
      .strokeColor('#e2e8f0')
      .lineWidth(1)
      .moveTo(50, position + 5)
      .lineTo(545, position + 5)
      .stroke();

    // 5. Grand Totals Summary
    const totalTop = position + 15;
    doc
      .fontSize(11)
      .fillColor('#0f172a')
      .text(`Total Quantity: ${challan.totalQuantity} Units`, 50, totalTop)
      .fontSize(12)
      .fillColor('#0284c7')
      .text(`Grand Total: INR ${Number(challan.totalAmount).toFixed(2)}`, 320, totalTop, { width: 225, align: 'right' });

    // 6. Sign-off Footer
    doc
      .fontSize(9)
      .fillColor('#64748b')
      .text('This is a computer-generated Sales Challan invoice. Issued by authorized distributor.', 50, 750, { align: 'center' });

    return doc;
  }
}
