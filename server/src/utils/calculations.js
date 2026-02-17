/**
 * Calculate invoice subtotal from line items
 */
const calculateInvoiceSubtotal = (lineItems) => {
  if (!lineItems || lineItems.length === 0) return 0;
  
  return lineItems.reduce((total, item) => {
    const lineTotal = item.quantity * item.unitPrice;
    return total + lineTotal;
  }, 0);
};

/**
 * Calculate tax amount based on subtotal and tax rate
 */
const calculateTaxAmount = (subtotal, taxRate) => {
  if (!taxRate || taxRate === 0) return 0;
  return roundCurrency((subtotal * taxRate) / 100);
};

/**
 * Calculate invoice total (subtotal + tax)
 */
const calculateInvoiceTotal = (subtotal, taxAmount) => {
  return roundCurrency(subtotal + taxAmount);
};

/**
 * Calculate balance due
 */
const calculateBalanceDue = (total, amountPaid) => {
  const balance = total - amountPaid;
  return Math.max(0, balance); // Ensure non-negative
};

/**
 * Format currency for display
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

/**
 * Round to 2 decimal places for currency
 */
const roundCurrency = (amount) => {
  return Math.round(amount * 100) / 100;
};

module.exports = {
  calculateInvoiceSubtotal,
  calculateTaxAmount,
  calculateInvoiceTotal,
  calculateBalanceDue,
  formatCurrency,
  roundCurrency,
};
