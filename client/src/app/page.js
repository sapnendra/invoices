'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import InvoiceCard from '@/components/InvoiceCard';
import InvoicesGridSkeleton from '@/components/InvoicesGridSkeleton';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

function InvoicesGrid({ invoices, loading }) {
  if (loading) {
    return <InvoicesGridSkeleton />;
  }

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

function HomePage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const searchParams = useSearchParams();
  const authSuccess = searchParams.get('auth');

  useEffect(() => {
    if (authSuccess === 'success') {
      // Show success message
      const timer = setTimeout(() => {
        // Remove query param from URL
        window.history.replaceState({}, '', '/');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [authSuccess]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    try {
      const res = await fetch(`${API_URL}/api/invoices`, {
        credentials: 'include', // Include cookies for authentication
      });

      if (!res.ok) {
        throw new Error('Failed to fetch invoices');
      }

      const data = await res.json();
      setInvoices(data.data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with User Info and Logout */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text:lg sm:text-md font-bold text-gray-900 leading-none sm:leading-tight">Invoice <br /> Manager</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <>
                <div className="flex items-center gap-3">
                  <img 
                    src={user.picture} 
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-gray-200"
                  />
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200 font-medium text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Success Message */}
      {authSuccess === 'success' && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-green-800 font-medium">Successfully logged in!</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meru Technosoft Private Limited
            </h2>
            <p className="text-gray-600 mb-2">
              Welcome to the <strong><i>Invoice Details Module</i></strong>
            </p>
            <p className="text-sm text-gray-500">
              Manage your invoices with ease
            </p>
          </div>

          <InvoicesGrid invoices={invoices} loading={loading} />

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              💡 Click any invoice to view details and add payments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
}
