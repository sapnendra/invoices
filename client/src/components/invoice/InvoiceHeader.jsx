import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export default function InvoiceHeader({ invoice }) {
  return (
    <Card>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {invoice.invoiceNumber}
            </h1>
            <Badge status={invoice.status}>
              {invoice.status}
            </Badge>
            {invoice.isArchived && (
              <Badge className="badge-archived">
                ARCHIVED
              </Badge>
            )}
          </div>
          <p className="text-lg text-gray-700 font-medium">
            {invoice.customerName}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 text-sm">
          <div>
            <p className="text-gray-500 mb-1">Issue Date</p>
            <p className="font-semibold text-gray-900">
              {formatDate(invoice.issueDate)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Due Date</p>
            <p className="font-semibold text-gray-900">
              {formatDate(invoice.dueDate)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
