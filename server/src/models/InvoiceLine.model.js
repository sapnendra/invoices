const mongoose = require('mongoose');

const invoiceLineSchema = new mongoose.Schema({
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    required: [true, 'Invoice ID is required'],
    index: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Unit price cannot be negative'],
  },
  lineTotal: {
    type: Number,
    required: true,
    min: [0, 'Line total cannot be negative'],
  },
}, {
  timestamps: true,
});

// Pre-save hook to calculate lineTotal
invoiceLineSchema.pre('save', function(next) {
  this.lineTotal = this.quantity * this.unitPrice;
  next();
});

module.exports = mongoose.model('InvoiceLine', invoiceLineSchema);
