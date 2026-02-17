const mongoose = require('mongoose');
const { INVOICE_STATUS, CURRENCIES, DEFAULT_CURRENCY } = require('../config/constants');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: [true, 'Invoice number is required'],
    unique: true,
    trim: true,
    index: true,
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
  },
  currency: {
    type: String,
    enum: Object.keys(CURRENCIES),
    default: DEFAULT_CURRENCY,
    required: true,
  },
  issueDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
  },
  status: {
    type: String,
    enum: Object.values(INVOICE_STATUS),
    default: INVOICE_STATUS.DRAFT,
    index: true,
  },
  total: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Total cannot be negative'],
  },
  amountPaid: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Amount paid cannot be negative'],
  },
  balanceDue: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Balance due cannot be negative'],
  },
  isArchived: {
    type: Boolean,
    default: false,
    index: true,
  },
}, {
  timestamps: true,
});

// Compound index for common queries
invoiceSchema.index({ isArchived: 1, status: 1 });

module.exports = mongoose.model('Invoice', invoiceSchema);
