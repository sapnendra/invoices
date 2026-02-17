import Card from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';

export default function LineItemsTable({ lineItems, currency = 'INR' }) {
  if (!lineItems || lineItems.length === 0) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Line Items</h2>
        <p className="text-gray-500 text-center py-8">No line items found</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Line Items</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Description
              </th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                Quantity
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                Unit Price
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item, index) => (
              <tr 
                key={item._id || index}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-4 text-sm text-gray-900">
                  {item.description}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600 text-center">
                  {item.quantity}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600 text-right">
                  {formatCurrency(item.unitPrice, currency)}
                </td>
                <td className="py-4 px-4 text-sm font-semibold text-gray-900 text-right">
                  {formatCurrency(item.lineTotal, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
