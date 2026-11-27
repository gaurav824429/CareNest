import React from 'react';

const STATUS_STYLES = {
  PENDING: 'bg-peach-100 text-peach-500 border-peach-200',
  CONFIRMED: 'bg-mint-100 text-forest-700 border-mint-200',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
  COMPLETED: 'bg-forest-600 text-white border-forest-600',
  CANCELLED: 'bg-gray-100 text-gray-600 border-gray-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
  APPROVED: 'bg-mint-100 text-forest-700 border-mint-200',
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  const label = (status || '').replace('_', ' ');
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide capitalize ${style}`}>
      {label.toLowerCase()}
    </span>
  );
}
