const invoiceService = require('../services/invoice.service');
const invoicePDFService = require('../services/invoice.pdf.service');
const { successResponse } = require('../utils/responseFormatter');
const { HTTP_STATUS } = require('../config/constants');

class InvoiceController {
  /**
   * Get all invoices
   * GET /api/invoices
   */
  async getAllInvoices(req, res, next) {
    try {
      const invoices = await invoiceService.getAllInvoices();
      
      res.status(HTTP_STATUS.OK).json(
        successResponse(invoices, 'Invoices retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

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

  /**
   * Download invoice as PDF
   * GET /api/invoices/:id/download-pdf
   */
  async downloadInvoicePDF(req, res, next) {
    try {
      const { id } = req.params;
      const invoiceData = await invoiceService.getInvoiceById(id);
      
      const { invoice } = invoiceData;
      const filename = `Invoice-${invoice.invoiceNumber}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      invoicePDFService.generateInvoicePDF(invoiceData, res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InvoiceController();
