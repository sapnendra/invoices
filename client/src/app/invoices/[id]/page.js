'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import InvoiceHeader from '@/components/invoice/InvoiceHeader';
import LineItemsTable from '@/components/invoice/LineItemsTable';
import TotalsSection from '@/components/invoice/TotalsSection';
import PaymentsSection from '@/components/invoice/PaymentsSection';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getInvoiceById } from '@/lib/api';

function InvoiceDetailsPageContent() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvoice = async () => {
    try {
      const response = await getInvoiceById(params.id);
      setData(response.data);
      return response.data;
    } catch (error) {
      setError(error.message);
    }
  };

  const updateTotalsOptimistically = (paymentAmount) => {
    if (data) {
      setData(prevData => ({
        ...prevData,
        invoice: {
          ...prevData.invoice,
          amountPaid: prevData.invoice.amountPaid + paymentAmount,
          balanceDue: prevData.invoice.balanceDue - paymentAmount,
          status: prevData.invoice.balanceDue - paymentAmount <= 0 ? 'PAID' : prevData.invoice.status,
        },
      }));
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchInvoice().then(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Invoice Not Found</h2>
          <p className="text-gray-600">{error || 'The invoice you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const { invoice, lineItems, payments } = data;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg 
              className="w-4 h-4 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Back to Home
          </button>
        </div>

        {/* Invoice Header */}
        <InvoiceHeader invoice={invoice} />

        {/* Main Content Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Line Items & Payments */}
          <div className="lg:col-span-2 space-y-6">
            <LineItemsTable lineItems={lineItems} currency={invoice.currency} />
            <PaymentsSection 
              initialPayments={payments} 
              invoiceId={invoice._id}
              balanceDue={invoice.balanceDue}
              currency={invoice.currency}
              isArchived={invoice.isArchived}
              onPaymentAdded={fetchInvoice}
              onUpdateTotals={updateTotalsOptimistically}
            />
          </div>

          {/* Right Column - Totals Summary */}
          <div>
            <TotalsSection 
              subtotal={invoice.subtotal || invoice.total}
              taxRate={invoice.taxRate || 0}
              taxAmount={invoice.taxAmount || 0}
              total={invoice.total}
              amountPaid={invoice.amountPaid}
              balanceDue={invoice.balanceDue}
              currency={invoice.currency}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function InvoiceDetailsPage() {
  return (
    <ProtectedRoute>
      <InvoiceDetailsPageContent />
    </ProtectedRoute>
  );
}
