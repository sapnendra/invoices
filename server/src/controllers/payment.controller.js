const paymentService = require('../services/payment.service');
const { successResponse } = require('../utils/responseFormatter');
const { HTTP_STATUS } = require('../config/constants');

class PaymentController {
  /**
   * Add payment to invoice
   * POST /api/invoices/:id/payments
   */
  async addPayment(req, res, next) {
    try {
      const { id } = req.params;
      const paymentData = req.body;
      
      const result = await paymentService.addPayment(id, paymentData);
      
      res.status(HTTP_STATUS.CREATED).json(
        successResponse(result, 'Payment added successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get payments for an invoice
   * GET /api/invoices/:id/payments
   */
  async getPayments(req, res, next) {
    try {
      const { id } = req.params;
      const payments = await paymentService.getPaymentsByInvoiceId(id);
      
      res.status(HTTP_STATUS.OK).json(
        successResponse({ payments }, 'Payments retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaymentController();
