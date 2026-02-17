/**
 * Calculate invoice total from line items
 */
const calculateInvoiceTotal = (lineItems) => {
  if (!lineItems || lineItems.length === 0) return 0;
  
  return lineItems.reduce((total, item) => {
    const lineTotal = item.quantity * item.unitPrice;
    return total + lineTotal;
  }, 0);
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
  calculateInvoiceTotal,
  calculateBalanceDue,
  formatCurrency,
  roundCurrency,
};
