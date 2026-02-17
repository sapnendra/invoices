import { getStatusBadgeClass } from '@/lib/utils';

export default function Badge({ children, status, className = '' }) {
  const statusClass = status ? getStatusBadgeClass(status) : 'badge-draft';
  
  return (
    <span className={`${statusClass} ${className}`}>
      {children}
    </span>
  );
}
