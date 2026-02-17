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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Partial Payment Examples */}
          <a
            href="/invoices/699456682ce7e48234def28b"
            className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">INV-2026-001</span>
              <span className="badge-draft text-xs">DRAFT</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Acme Enterprise</p>
            <div className="text-xs text-gray-500">
              <p>Total: ₹85,000</p>
              <p className="text-orange-600 font-medium">Balance: ₹50,000</p>
            </div>
          </a>

          <a
            href="/invoices/6994566a2ce7e48234def292"
            className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">INV-2026-004</span>
              <span className="badge-draft text-xs">DRAFT</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Quantum Systems</p>
            <div className="text-xs text-gray-500">
              <p>Total: ₹2,50,000</p>
              <p className="text-orange-600 font-medium">Balance: ₹1,50,000</p>
            </div>
          </a>

          <a
            href="/invoices/6994566b2ce7e48234def296"
            className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">INV-2026-006</span>
              <span className="badge-draft text-xs">DRAFT</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Digital Marketing</p>
            <div className="text-xs text-gray-500">
              <p>Total: ₹67,500</p>
              <p className="text-orange-600 font-medium">Balance: ₹7,500</p>
            </div>
          </a>

          {/* Fully Paid Examples */}
          <a
            href="/invoices/699456682ce7e48234def28e"
            className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">INV-2026-002</span>
              <span className="badge-paid text-xs">PAID</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Tech Solutions Inc</p>
            <div className="text-xs text-gray-500">
              <p>Total: ₹1,25,000</p>
              <p className="text-green-600 font-medium">Fully Paid ✓</p>
            </div>
          </a>

          <a
            href="/invoices/6994566b2ce7e48234def29a"
            className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">INV-2026-008</span>
              <span className="badge-paid text-xs">PAID</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Consulting Group</p>
            <div className="text-xs text-gray-500">
              <p>Total: ₹95,000</p>
              <p className="text-green-600 font-medium">Fully Paid ✓</p>
            </div>
          </a>

          {/* Unpaid Example */}
          <a
            href="/invoices/699456692ce7e48234def290"
            className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">INV-2026-003</span>
              <span className="badge-draft text-xs">DRAFT</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Global Innovations</p>
            <div className="text-xs text-gray-500">
              <p>Total: ₹45,000</p>
              <p className="text-red-600 font-medium">No Payment Yet</p>
            </div>
          </a>

          {/* Large Projects */}
          <a
            href="/invoices/6994566b2ce7e48234def298"
            className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">INV-2026-007</span>
              <span className="badge-draft text-xs">DRAFT</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Enterprise Corp</p>
            <div className="text-xs text-gray-500">
              <p>Total: ₹3,50,000</p>
              <p className="text-orange-600 font-medium">Balance: ₹1,75,000</p>
            </div>
          </a>

          <a
            href="/invoices/6994566c2ce7e48234def2a2"
            className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">INV-2026-012</span>
              <span className="badge-paid text-xs">PAID</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Agile Works Ltd</p>
            <div className="text-xs text-gray-500">
              <p>Total: ₹1,40,000</p>
              <p className="text-green-600 font-medium">Fully Paid ✓</p>
            </div>
          </a>

          {/* Archived Example */}
          <a
            href="/invoices/6994566b2ce7e48234def29c"
            className="card p-4 hover:shadow-md transition-shadow cursor-pointer border-gray-300"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">INV-2025-099</span>
              <span className="badge-archived text-xs">ARCHIVED</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Legacy Systems</p>
            <div className="text-xs text-gray-500">
              <p>Total: ₹78,000</p>
              <p className="text-green-600 font-medium">Fully Paid ✓</p>
            </div>
          </a>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            💡 Click any invoice to view details and add payments
          </p>
        </div>
      </div>
    </div>
  )
}
