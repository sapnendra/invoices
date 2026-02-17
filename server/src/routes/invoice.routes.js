const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');
const paymentController = require('../controllers/payment.controller');
const { validate, paymentSchema } = require('../middleware/validator');

// Invoice routes
router.get('/', invoiceController.getAllInvoices);
router.get('/:id', invoiceController.getInvoice);
router.get('/:id/download-pdf', invoiceController.downloadInvoicePDF);
router.post('/:id/archive', invoiceController.archiveInvoice);
router.post('/:id/restore', invoiceController.restoreInvoice);

// Payment routes (nested under invoice)
router.post('/:id/payments', validate(paymentSchema), paymentController.addPayment);
router.get('/:id/payments', paymentController.getPayments);

module.exports = router;
