/**
 * Format currency for display
 */
export function formatCurrency(amount) {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  return `₹${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
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
