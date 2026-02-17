/**
 * Format number as Indian Rupee currency
 * Using "Rs." prefix instead of ₹ symbol for PDF compatibility
 */
const formatCurrency = (amount) => {
  const formattedAmount = amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `Rs. ${formattedAmount}`;
};

/**
 * Format date to DD/MM/YYYY
 */
const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

module.exports = {
  formatCurrency,
  formatDate,
};
