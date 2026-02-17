const mongoose = require('mongoose');
const Invoice = require('../models/Invoice.model');
const InvoiceLine = require('../models/InvoiceLine.model');
const Payment = require('../models/Payment.model');
const { NotFoundError } = require('../utils/errors');
const { calculateBalanceDue } = require('../utils/calculations');

class InvoiceService {
  /**
   * Get all invoices with summary information
   */
  async getAllInvoices() {
    const invoices = await Invoice.find()
      .sort({ createdAt: -1 })
      .lean();

    return invoices;
  }

  /**
   * Get invoice by ID with line items and payments
   */
  async getInvoiceById(invoiceId) {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      throw new NotFoundError('Invalid invoice ID');
    }

    const invoice = await Invoice.findById(invoiceId);
    
    if (!invoice) {
      throw new NotFoundError('Invoice not found');
    }

    // Fetch related data
    const lineItems = await InvoiceLine.find({ invoiceId }).sort({ createdAt: 1 });
    const payments = await Payment.find({ invoiceId }).sort({ paymentDate: -1 });

    // Recalculate totals for verification
    const calculatedTotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const calculatedAmountPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const calculatedBalanceDue = calculateBalanceDue(calculatedTotal, calculatedAmountPaid);

    return {
      invoice: invoice.toObject(),
      lineItems: lineItems.map(item => item.toObject()),
      payments: payments.map(payment => payment.toObject()),
      calculated: {
        total: calculatedTotal,
        amountPaid: calculatedAmountPaid,
        balanceDue: calculatedBalanceDue,
      },
    };
  }

  /**
   * Archive an invoice
   */
  async archiveInvoice(invoiceId) {
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      throw new NotFoundError('Invalid invoice ID');
    }

    const invoice = await Invoice.findById(invoiceId);
    
    if (!invoice) {
      throw new NotFoundError('Invoice not found');
    }

    invoice.isArchived = true;
    invoice.updatedAt = new Date();
    await invoice.save();

    return invoice.toObject();
  }

  /**
   * Restore an archived invoice
   */
  async restoreInvoice(invoiceId) {
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      throw new NotFoundError('Invalid invoice ID');
    }

    const invoice = await Invoice.findById(invoiceId);
    
    if (!invoice) {
      throw new NotFoundError('Invoice not found');
    }

    if (!invoice.isArchived) {
      throw new Error('Invoice is not archived');
    }

    invoice.isArchived = false;
    invoice.updatedAt = new Date();
    await invoice.save();

    return invoice.toObject();
  }
}

module.exports = new InvoiceService();
