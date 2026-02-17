import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

export default function InvoiceCard({ invoice }) {
  const getStatusBadge = (status) => {
    if (invoice.isArchived) {
      return <span className="badge-archived text-xs">ARCHIVED</span>;
    }
    return status === 'PAID' ? (
      <span className="badge-paid text-xs">PAID</span>
    ) : (
      <span className="badge-draft text-xs">DRAFT</span>
    );
  };

  const getBalanceText = () => {
    if (invoice.balanceDue === 0) {
      return <p className="text-green-600 font-medium">Fully Paid ✓</p>;
    }
    if (invoice.amountPaid === 0) {
      return <p className="text-red-600 font-medium">No Payment Yet</p>;
    }
    return (
      <p className="text-orange-600 font-medium">
        Balance: {formatCurrency(invoice.balanceDue, invoice.currency)}
      </p>
    );
  };

  return (
    <Link
      href={`/invoices/${invoice._id}`}
      className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-900">
          {invoice.invoiceNumber}
        </span>
        {getStatusBadge(invoice.status)}
      </div>
      <p className="text-sm text-gray-600 mb-2">{invoice.customerName}</p>
      <div className="text-xs text-gray-500">
        <p>Total: {formatCurrency(invoice.total, invoice.currency)}</p>
        {getBalanceText()}
      </div>
    </Link>
  );
}
