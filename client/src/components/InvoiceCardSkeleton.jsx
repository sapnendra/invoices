export default function InvoiceCardSkeleton() {
  return (
    <div className="card p-4 animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-5 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
      <div className="space-y-1">
        <div className="h-3 bg-gray-200 rounded w-28"></div>
        <div className="h-3 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
}
