const PDFDocument = require('pdfkit');
const { formatCurrency, formatDate } = require('../utils/formatting');

/**
 * Get tax label based on currency
 */
function getTaxLabel(currency) {
  const taxLabels = {
    INR: 'GST',
    USD: 'Sales Tax',
    EUR: 'VAT',
    GBP: 'VAT',
    JPY: 'Consumption Tax',
    AUD: 'GST',
  };
  return taxLabels[currency] || 'Tax';
}

class InvoicePDFService {
  /**
   * Generate PDF invoice
   */
  generateInvoicePDF(invoiceData, stream) {
    const { invoice, lineItems, payments } = invoiceData;
    
    const doc = new PDFDocument({ 
      size: 'A4', 
      margin: 50,
      info: {
        Title: `Invoice ${invoice.invoiceNumber}`,
        Author: 'Meru Technosoft Private Limited',
        Subject: `Invoice for ${invoice.customerName}`,
      }
    });

    doc.pipe(stream);

    // Header
    this.addHeader(doc, invoice);
    
    // Customer Details
    this.addCustomerDetails(doc, invoice);
    
    // Line Items Table
    this.addLineItemsTable(doc, lineItems, invoice);
    
    // Payment Information
    this.addPaymentInformation(doc, invoice, payments);
    
    // Footer
    this.addFooter(doc, invoice);

    doc.end();
  }

  addHeader(doc, invoice) {
    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('INVOICE', 50, 50);

    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`Invoice Number: ${invoice.invoiceNumber}`, 400, 55, { align: 'right' });

    doc
      .fontSize(9)
      .fillColor('#666666')
      .text(`Issue Date: ${formatDate(invoice.issueDate)}`, 400, 70, { align: 'right' })
      .text(`Due Date: ${formatDate(invoice.dueDate)}`, 400, 85, { align: 'right' });

    // Status Badge
    const statusY = 100;
    const statusX = 450;
    const statusColor = invoice.status === 'PAID' ? '#22c55e' : '#f59e0b';
    
    doc
      .rect(statusX, statusY, 90, 20)
      .fillAndStroke(statusColor, statusColor)
      .fillColor('#FFFFFF')
      .fontSize(10)
      .font('Helvetica-Bold')
      .text(invoice.status, statusX, statusY + 5, { width: 90, align: 'center' });

    // Reset color
    doc.fillColor('#000000');

    // Horizontal line
    doc
      .strokeColor('#cccccc')
      .lineWidth(1)
      .moveTo(50, 140)
      .lineTo(550, 140)
      .stroke();
  }

  addCustomerDetails(doc, invoice) {
    const startY = 160;

    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .fillColor('#000000')
      .text('Bill To:', 50, startY);

    doc
      .fontSize(10)
      .font('Helvetica')
      .text(invoice.customerName, 50, startY + 20)
      .text(invoice.customerEmail, 50, startY + 35);

    // Company Info (if you have it)
    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .text('From:', 350, startY);

    doc
      .fontSize(10)
      .font('Helvetica')
      .text('Meru Technosoft Private Limited', 350, startY + 20)
      .text('invoice@merufintech.com', 350, startY + 35);
  }

  addLineItemsTable(doc, lineItems, invoice) {
    const tableTop = 250;
    const itemCodeX = 50;
    const descriptionX = 100;
    const quantityX = 320;
    const unitPriceX = 380;
    const lineTotalX = 470;

    // Table Header
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#000000');

    doc
      .rect(50, tableTop, 500, 25)
      .fillAndStroke('#f3f4f6', '#cccccc');

    doc
      .fillColor('#000000')
      .text('#', itemCodeX + 5, tableTop + 8)
      .text('Description', descriptionX, tableTop + 8)
      .text('Qty', quantityX, tableTop + 8)
      .text('Unit Price', unitPriceX, tableTop + 8)
      .text('Total', lineTotalX, tableTop + 8);

    // Table Rows
    doc.font('Helvetica');
    let currentY = tableTop + 35;

    lineItems.forEach((item, index) => {
      if (currentY > 700) {
        doc.addPage();
        currentY = 50;
      }

      doc
        .fontSize(9)
        .text(index + 1, itemCodeX + 5, currentY)
        .text(item.description, descriptionX, currentY, { width: 200, lineBreak: false })
        .text(item.quantity.toString(), quantityX, currentY)
        .text(formatCurrency(item.unitPrice, invoice.currency, true), unitPriceX, currentY)
        .text(formatCurrency(item.lineTotal, invoice.currency, true), lineTotalX, currentY);

      // Horizontal line
      doc
        .strokeColor('#e5e7eb')
        .lineWidth(0.5)
        .moveTo(50, currentY + 20)
        .lineTo(550, currentY + 20)
        .stroke();

      currentY += 30;
    });

    // Totals Section
    currentY += 10;
    const totalsStartY = currentY;

    doc
      .fontSize(10)
      .font('Helvetica');

    // Subtotal (only show if tax exists)
    if (invoice.taxRate && invoice.taxRate > 0) {
      doc
        .text('Subtotal:', 380, currentY)
        .text(formatCurrency(invoice.subtotal || invoice.total, invoice.currency, true), 470, currentY);
      
      currentY += 20;

      // Tax
      const taxLabel = getTaxLabel(invoice.currency);
      doc
        .text(`${taxLabel} (${invoice.taxRate}%):`, 380, currentY)
        .text(formatCurrency(invoice.taxAmount || 0, invoice.currency, true), 470, currentY);
      
      currentY += 25;

      // Separator line
      doc
        .strokeColor('#cccccc')
        .lineWidth(1)
        .moveTo(380, currentY - 5)
        .lineTo(550, currentY - 5)
        .stroke();
    }

    // Total Amount (bold)
    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .text('Total Amount:', 380, currentY)
      .text(formatCurrency(invoice.total, invoice.currency, true), 470, currentY);
  }

  addPaymentInformation(doc, invoice, payments) {
    let currentY = doc.y + 30;

    // Payment Summary Box
    doc
      .rect(50, currentY, 250, 80)
      .fillAndStroke('#f9fafb', '#e5e7eb');

    doc
      .fillColor('#000000')
      .fontSize(11)
      .font('Helvetica-Bold')
      .text('Payment Summary', 60, currentY + 10);

    doc
      .fontSize(9)
      .font('Helvetica')
      .text(`Total Amount: ${formatCurrency(invoice.total, invoice.currency, true)}`, 60, currentY + 30)
      .text(`Amount Paid: ${formatCurrency(invoice.amountPaid, invoice.currency, true)}`, 60, currentY + 45);

    const balanceColor = invoice.balanceDue === 0 ? '#22c55e' : '#ef4444';
    doc
      .font('Helvetica-Bold')
      .fillColor(balanceColor)
      .text(`Balance Due: ${formatCurrency(invoice.balanceDue, invoice.currency, true)}`, 60, currentY + 60);

    doc.fillColor('#000000');

    // Payment History
    if (payments && payments.length > 0) {
      currentY += 100;

      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .text('Payment History', 50, currentY);

      currentY += 25;

      payments.forEach((payment) => {
        doc
          .fontSize(9)
          .font('Helvetica')
          .text(`• ${formatDate(payment.paymentDate)}`, 60, currentY)
          .text(formatCurrency(payment.amount, invoice.currency, true), 200, currentY);

        currentY += 18;
      });
    }
  }

  addFooter(doc, invoice) {
    // Notes section if available
    if (invoice.notes) {
      doc.moveDown(1.5);
      
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Notes:', 50);

      doc
        .fontSize(9)
        .font('Helvetica')
        .text(invoice.notes, 50, doc.y + 5);
    }

    // Add space before footer
    doc.moveDown(2);
    
    const footerY = doc.y;

    // Footer line
    doc
      .strokeColor('#cccccc')
      .lineWidth(1)
      .moveTo(50, footerY)
      .lineTo(550, footerY)
      .stroke();

    // Footer text - without width and align options to prevent page breaks
    doc
      .fontSize(8)
      .fillColor('#666666')
      .font('Helvetica');
    
    doc.text('Thank you for your business!', 50, footerY + 15);
    doc.text('Meru Technosoft Private Limited', 50, footerY + 30);
    doc.text(`Generated on ${formatDate(new Date())}`, 50, footerY + 45);
  }
}

module.exports = new InvoicePDFService();
