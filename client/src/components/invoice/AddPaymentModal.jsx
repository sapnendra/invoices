'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { formatCurrency, formatDateForInput } from '@/lib/utils';
import { CURRENCIES, DEFAULT_CURRENCY } from '@/lib/currencies';

export default function AddPaymentModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  balanceDue,
  currency = DEFAULT_CURRENCY,
  isSubmitting,
  error 
}) {
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(formatDateForInput(new Date()));
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    // Validate amount
    const amountNum = parseFloat(amount);
    
    if (!amount || isNaN(amountNum)) {
      setValidationError('Please enter a valid amount');
      return;
    }

    if (amountNum <= 0) {
      setValidationError('Amount must be greater than 0');
      return;
    }

    if (amountNum > balanceDue) {
      setValidationError(`Amount cannot exceed balance due (${formatCurrency(balanceDue, currency)})`);
      return;
    }

    // Validate date
    if (!paymentDate) {
      setValidationError('Please select a payment date');
      return;
    }

    const selectedDate = new Date(paymentDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (selectedDate > today) {
      setValidationError('Payment date cannot be in the future');
      return;
    }

    // Submit
    onSubmit({
      amount: amountNum,
      paymentDate: new Date(paymentDate),
    });
  };

  const handleClose = () => {
    setAmount('');
    setPaymentDate(formatDateForInput(new Date()));
    setValidationError('');
    onClose();
  };

  const handleQuickAmount = (percentage) => {
    const quickAmount = (balanceDue * percentage).toFixed(2);
    setAmount(quickAmount);
  };

  const displayError = validationError || error;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Payment">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Balance Due Info */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Balance Due:</span> {formatCurrency(balanceDue, currency)}
            </p>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Payment Amount *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                {CURRENCIES[currency]?.symbol || '₹'}
              </span>
              <input
                type="number"
                id="amount"
                step="0.01"
                min="0.01"
                max={balanceDue}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="0.00"
                disabled={isSubmitting}
              />
            </div>
            
            {/* Quick Amount Buttons */}
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleQuickAmount(0.25)}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                disabled={isSubmitting}
              >
                25%
              </button>
              <button
                type="button"
                onClick={() => handleQuickAmount(0.5)}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                disabled={isSubmitting}
              >
                50%
              </button>
              <button
                type="button"
                onClick={() => handleQuickAmount(1)}
                className="text-xs px-2 py-1 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded transition-colors"
                disabled={isSubmitting}
              >
                Full Amount
              </button>
            </div>
          </div>

          {/* Payment Date */}
          <div>
            <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700 mb-1">
              Payment Date *
            </label>
            <input
              type="date"
              id="paymentDate"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              max={formatDateForInput(new Date())}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Error Message */}
          {displayError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{displayError}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Processing...' : 'Add Payment'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
