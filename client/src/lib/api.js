const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Fetch invoice by ID
 */
export async function getInvoiceById(id) {
  const response = await fetch(`${API_BASE_URL}/api/invoices/${id}`, {
    cache: 'no-store',
    credentials: 'include', // Include authentication cookies
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch invoice');
  }

  return response.json();
}

/**
 * Add payment to invoice
 */
export async function addPayment(invoiceId, paymentData) {
  const response = await fetch(`${API_BASE_URL}/api/invoices/${invoiceId}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include authentication cookies
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to add payment');
  }

  return response.json();
}

/**
 * Archive invoice
 */
export async function archiveInvoice(invoiceId) {
  const response = await fetch(`${API_BASE_URL}/api/invoices/${invoiceId}/archive`, {
    method: 'POST',
    credentials: 'include', // Include authentication cookies
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to archive invoice');
  }

  return response.json();
}

/**
 * Restore invoice
 */
export async function restoreInvoice(invoiceId) {
  const response = await fetch(`${API_BASE_URL}/api/invoices/${invoiceId}/restore`, {
    method: 'POST',
    credentials: 'include', // Include authentication cookies
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to restore invoice');
  }

  return response.json();
}
