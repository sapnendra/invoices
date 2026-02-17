import { notFound } from 'next/navigation';
import Container from '@/components/layout/Container';
import InvoiceHeader from '@/components/invoice/InvoiceHeader';
import LineItemsTable from '@/components/invoice/LineItemsTable';
import TotalsSection from '@/components/invoice/TotalsSection';
import PaymentsSection from '@/components/invoice/PaymentsSection';
import { getInvoiceById } from '@/lib/api';

async function getInvoice(id) {
  try {
    const response = await getInvoiceById(id);
    return response.data;
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return null;
  }
}

export default async function InvoiceDetailsPage({ params }) {
  const { id } = await params;
  const data = await getInvoice(id);

  if (!data) {
    notFound();
  }

  const { invoice, lineItems, payments } = data;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        {/* Back Button */}
        <div className="mb-6">
          <a
            href="/"
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
          </a>
        </div>

        {/* Invoice Header */}
        <InvoiceHeader invoice={invoice} />

        {/* Main Content Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Line Items & Payments */}
          <div className="lg:col-span-2 space-y-6">
            <LineItemsTable lineItems={lineItems} />
            <PaymentsSection 
              initialPayments={payments} 
              invoiceId={invoice._id}
              balanceDue={invoice.balanceDue}
              isArchived={invoice.isArchived}
            />
          </div>

          {/* Right Column - Totals Summary */}
          <div>
            <TotalsSection 
              total={invoice.total}
              amountPaid={invoice.amountPaid}
              balanceDue={invoice.balanceDue}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { id } = await params;
  const data = await getInvoice(id);
  
  if (!data) {
    return {
      title: 'Invoice Not Found',
    };
  }

  return {
    title: `Invoice ${data.invoice.invoiceNumber} - ${data.invoice.customerName}`,
    description: `View details for invoice ${data.invoice.invoiceNumber}`,
  };
}
