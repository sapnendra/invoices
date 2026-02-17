const invoiceService = require('../services/invoice.service');
const { successResponse } = require('../utils/responseFormatter');
const { HTTP_STATUS } = require('../config/constants');

class InvoiceController {
  /**
   * Get invoice by ID
   * GET /api/invoices/:id
   */
  async getInvoice(req, res, next) {
    try {
      const { id } = req.params;
      const result = await invoiceService.getInvoiceById(id);
      
      res.status(HTTP_STATUS.OK).json(
        successResponse(result, 'Invoice retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Archive invoice
   * POST /api/invoices/:id/archive
   */
  async archiveInvoice(req, res, next) {
    try {
      const { id } = req.params;
      const invoice = await invoiceService.archiveInvoice(id);
      
      res.status(HTTP_STATUS.OK).json(
        successResponse(invoice, 'Invoice archived successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Restore archived invoice
   * POST /api/invoices/:id/restore
   */
  async restoreInvoice(req, res, next) {
    try {
      const { id } = req.params;
      const invoice = await invoiceService.restoreInvoice(id);
      
      res.status(HTTP_STATUS.OK).json(
        successResponse(invoice, 'Invoice restored successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InvoiceController();
