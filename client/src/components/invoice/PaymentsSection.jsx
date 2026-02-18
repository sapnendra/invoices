'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AddPaymentModal from './AddPaymentModal';
import { formatCurrency, formatDate } from '@/lib/utils';
import { addPayment } from '@/lib/api';

export default function PaymentsSection({ initialPayments, invoiceId, balanceDue, isArchived, currency = 'INR', onPaymentAdded }) {
  const [payments, setPayments] = useState(initialPayments || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Sync payments with initialPayments when they change (after refetch)
  useEffect(() => {
    setPayments(initialPayments || []);
  }, [initialPayments]);

  const handleAddPayment = async (paymentData) => {
    setIsSubmitting(true);
    setError('');

    try {
      await addPayment(invoiceId, paymentData);
      
      // Close modal
      setIsModalOpen(false);
      
      // Refetch invoice data to update totals, payments list, and payment order
      if (onPaymentAdded) {
        await onPaymentAdded();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Payments</h2>
        {balanceDue > 0 && !isArchived && (
          <Button onClick={() => setIsModalOpen(true)}>
            Add Payment
          </Button>
        )}
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-12">
          <svg 
            className="w-16 h-16 text-gray-300 mx-auto mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" 
            />
          </svg>
          <p className="text-gray-500 mb-2">No payments yet</p>
          {balanceDue > 0 && !isArchived && (
            <p className="text-sm text-gray-400">
              Click "Add Payment" to record a payment
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <div 
              key={payment._id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div>
                <p className="font-semibold text-gray-900">
                  {formatCurrency(payment.amount, currency)}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(payment.paymentDate)}
                </p>
              </div>
              <div className="text-green-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddPaymentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setError('');
        }}
        onSubmit={handleAddPayment}
        balanceDue={balanceDue}
        currency={currency}
        isSubmitting={isSubmitting}
        error={error}
      />
    </Card>
  );
}
