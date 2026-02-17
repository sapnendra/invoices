import { CURRENCIES, DEFAULT_CURRENCY } from './currencies';

/**
 * Format currency for display with multi-currency support
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - Currency code (INR, USD, EUR, etc.)
 */
export function formatCurrency(amount, currencyCode = DEFAULT_CURRENCY) {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  
  const currency = CURRENCIES[currencyCode] || CURRENCIES[DEFAULT_CURRENCY];
  
  // JPY doesn't use decimal places
  const decimals = currencyCode === 'JPY' ? 0 : 2;
  
  const formattedAmount = amount.toLocaleString(currency.locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  return `${currency.symbol} ${formattedAmount}`;
}

/**
 * Format date for display
 */
export function formatDate(date) {
  const d = new Date(date);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/**
 * Format date for input field
 */
export function formatDateForInput(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get status badge class
 */
export function getStatusBadgeClass(status) {
  const classes = {
    DRAFT: 'badge-draft',
    PAID: 'badge-paid',
  };
  return classes[status] || 'badge-draft';
}

/**
 * Calculate percentage paid
 */
export function calculatePercentagePaid(total, amountPaid) {
  if (total === 0) return 0;
  return Math.round((amountPaid / total) * 100);
}
