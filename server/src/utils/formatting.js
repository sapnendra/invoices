const { CURRENCIES, DEFAULT_CURRENCY } = require('../config/constants');

/**
 * Format number as currency based on currency code
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - Currency code (INR, USD, EUR, etc.)
 * @param {boolean} forPDF - Use PDF-safe symbol instead of unicode
 */
const formatCurrency = (amount, currencyCode = DEFAULT_CURRENCY, forPDF = false) => {
  const currency = CURRENCIES[currencyCode] || CURRENCIES[DEFAULT_CURRENCY];
  
  const formattedAmount = amount.toLocaleString(currency.locale, {
    minimumFractionDigits: currencyCode === 'JPY' ? 0 : 2,
    maximumFractionDigits: currencyCode === 'JPY' ? 0 : 2,
  });
  
  const symbol = forPDF ? currency.pdfSymbol : currency.symbol;
  return `${symbol} ${formattedAmount}`;
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
