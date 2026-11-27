import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', onConfirm, onCancel, danger = false }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-elevated animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${danger ? 'bg-red-50 text-red-600' : 'bg-peach-100 text-peach-500'}`}>
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-semibold text-forest-900">{title}</h3>
          </div>
          <button onClick={onCancel} className="rounded-full p-1.5 text-forest-500 hover:bg-cream-200">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-forest-700">{message}</p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button onClick={onCancel} className="btn-outline px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-full px-5 py-2 text-sm font-semibold text-white transition ${
              danger ? 'bg-red-600 hover:bg-red-700' : 'bg-forest-600 hover:bg-forest-700'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
