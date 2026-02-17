const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    required: [true, 'Invoice ID is required'],
    index: true,
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0.01, 'Payment amount must be greater than 0'],
  },
  paymentDate: {
    type: Date,
    required: [true, 'Payment date is required'],
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Payment', paymentSchema);
