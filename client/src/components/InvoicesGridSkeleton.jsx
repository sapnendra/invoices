import InvoiceCardSkeleton from './InvoiceCardSkeleton';

export default function InvoicesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, index) => (
        <InvoiceCardSkeleton key={index} />
      ))}
    </div>
  );
}
