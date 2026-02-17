import Card from '@/components/ui/Card';
import { formatCurrency, calculatePercentagePaid } from '@/lib/utils';
import { getTaxLabel } from '@/lib/currencies';

export default function TotalsSection({ 
  subtotal = 0, 
  taxRate = 0, 
  taxAmount = 0, 
  total, 
  amountPaid, 
  balanceDue, 
  currency = 'INR' 
}) {
  const percentagePaid = calculatePercentagePaid(total, amountPaid);
  const taxLabel = getTaxLabel(currency);
  const showTaxBreakdown = taxRate > 0;

  return (
    <Card className="sticky top-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Summary</h2>
      
      <div className="space-y-4">
        {/* Subtotal */}
        {showTaxBreakdown && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(subtotal, currency)}
            </span>
          </div>
        )}
        
        {/* Tax */}
        {showTaxBreakdown && (
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <span className="text-sm text-gray-600">
              {taxLabel} ({taxRate}%)
            </span>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(taxAmount, currency)}
            </span>
          </div>
        )}
        
        {/* Total */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <span className="text-sm font-semibold text-gray-900">Total</span>
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(total, currency)}
          </span>
        </div>
        
        {/* Amount Paid */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Amount Paid</span>
          <span className="text-sm font-medium text-green-600">
            {formatCurrency(amountPaid, currency)}
          </span>
        </div>
        
        {/* Balance Due */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <span className="text-sm text-gray-600">Balance Due</span>
          <span className={`text-sm font-medium ${balanceDue > 0 ? 'text-orange-600' : 'text-green-600'}`}>
            {formatCurrency(balanceDue, currency)}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="pt-2">
          <div className="flex justify-between text-xs text-gray-600 mb-2">
            <span>Payment Progress</span>
            <span>{percentagePaid}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${percentagePaid}%` }}
            />
          </div>
        </div>
        
        {/* Status Message */}
        {balanceDue === 0 ? (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium text-center">
              ✓ Fully Paid
            </p>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800 font-medium text-center">
              Pending Payment
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
