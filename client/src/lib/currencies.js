/**
 * Currency configurations
 */
export const CURRENCIES = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    locale: 'en-IN',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    locale: 'de-DE',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    locale: 'en-GB',
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    locale: 'ja-JP',
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    locale: 'en-AU',
  },
};

export const DEFAULT_CURRENCY = 'INR';

/**
 * Get tax label for a given currency
 * @param {string} currency - Currency code
 * @returns {string} Tax label (e.g., "GST", "VAT", "Sales Tax")
 */
export function getTaxLabel(currency) {
  const taxLabels = {
    INR: 'GST',
    USD: 'Sales Tax',
    EUR: 'VAT',
    GBP: 'VAT',
    JPY: 'Consumption Tax',
    AUD: 'GST',
  };
  return taxLabels[currency] || 'Tax';
}
