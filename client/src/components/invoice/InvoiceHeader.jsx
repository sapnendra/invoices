'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

export default function InvoiceHeader({ invoice }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/invoices/${invoice._id}/download-pdf`, {
        credentials: 'include', // Include authentication cookies
      });
      
      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice-${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

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

      {/* Download PDF Button */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="inline-flex items-center"
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
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          {isDownloading ? 'Generating PDF...' : 'Download PDF'}
        </Button>
      </div>
    </Card>
  );
}
