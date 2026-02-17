import { Suspense } from 'react';
import InvoiceCard from '@/components/InvoiceCard';
import InvoicesGridSkeleton from '@/components/InvoicesGridSkeleton';

async function getInvoices() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  
  try {
    const res = await fetch(`${API_URL}/api/invoices`, {
      cache: 'no-store', // Always fetch fresh data
    });

    if (!res.ok) {
      throw new Error('Failed to fetch invoices');
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
}

async function InvoicesGrid() {
  const invoices = await getInvoices();

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No invoices found. Run the seed script to create sample data.</p>
        <code className="text-sm bg-gray-100 px-3 py-1 rounded mt-2 inline-block">
          cd server && npm run seed
        </code>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {invoices.map((invoice) => (
        <InvoiceCard key={invoice._id} invoice={invoice} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Invoice Management System
          </h1>
          <p className="text-gray-600 mb-2">
            Welcome to the Invoice Details Module
          </p>
          <p className="text-sm text-gray-500">
            12 sample invoices with various payment statuses
          </p>
        </div>

        <Suspense fallback={<InvoicesGridSkeleton />}>
          <InvoicesGrid />
        </Suspense>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            💡 Click any invoice to view details and add payments
          </p>
        </div>
      </div>
    </div>
  );
}
