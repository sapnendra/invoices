const mongoose = require('mongoose');
const Invoice = require('../models/Invoice.model');
const Payment = require('../models/Payment.model');
const { BusinessRuleError, NotFoundError } = require('../utils/errors');
const { INVOICE_STATUS } = require('../config/constants');
const { roundCurrency } = require('../utils/calculations');

class PaymentService {
  /**
   * Add payment to invoice with transaction support
   */
  async addPayment(invoiceId, paymentData) {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      throw new NotFoundError('Invalid invoice ID');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Fetch invoice
      const invoice = await Invoice.findById(invoiceId).session(session);
      
      if (!invoice) {
        throw new NotFoundError('Invoice not found');
      }

      if (invoice.isArchived) {
        throw new BusinessRuleError('Cannot add payment to archived invoice');
      }

      // Round payment amount to 2 decimal places
      const paymentAmount = roundCurrency(paymentData.amount);

      // Validate overpayment
      if (paymentAmount > invoice.balanceDue) {
        throw new BusinessRuleError(
          `Payment amount (₹${paymentAmount}) exceeds balance due (₹${invoice.balanceDue})`
        );
      }

      // Check if invoice is already fully paid
      if (invoice.balanceDue === 0) {
        throw new BusinessRuleError('Invoice is already fully paid');
      }

      // Create payment
      const payment = await Payment.create([{
        invoiceId,
        amount: paymentAmount,
        paymentDate: paymentData.paymentDate || new Date(),
      }], { session });

      // Update invoice
      const newAmountPaid = roundCurrency(invoice.amountPaid + paymentAmount);
      const newBalanceDue = roundCurrency(invoice.total - newAmountPaid);
      const newStatus = newBalanceDue === 0 ? INVOICE_STATUS.PAID : invoice.status;

      invoice.amountPaid = newAmountPaid;
      invoice.balanceDue = newBalanceDue;
      invoice.status = newStatus;
      invoice.updatedAt = new Date();
      
      await invoice.save({ session });
      await session.commitTransaction();

      return {
        payment: payment[0].toObject(),
        invoice: invoice.toObject(),
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Get all payments for an invoice
   */
  async getPaymentsByInvoiceId(invoiceId) {
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      throw new NotFoundError('Invalid invoice ID');
    }

    const payments = await Payment.find({ invoiceId })
      .sort({ paymentDate: -1 })
      .lean();

    return payments;
  }
}

module.exports = new PaymentService();
