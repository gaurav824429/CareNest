import React, { useEffect, useState } from 'react';
import { CheckCircle2, IndianRupee, Star } from 'lucide-react';
import CompanionLayout from './CompanionLayout';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/client';
import { formatINR } from '../../utils/formatters';

export default function CompletedVisitsPage() {
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/companion/bookings')
      .then((res) => setCompleted(res.data.filter((b) => b.status === 'COMPLETED')))
      .finally(() => setLoading(false));
  }, []);

  const totalEarnings = completed.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <CompanionLayout title="Completed Visits & Earnings" subtitle="Review your completed companionship sessions and earnings summary.">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-8">
        <div className="card-warm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint-100 text-forest-700">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-forest-500">Total Completed Visits</p>
            <p className="font-display text-2xl font-bold text-forest-900">{completed.length}</p>
          </div>
        </div>
        <div className="card-warm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-peach-100 text-peach-500">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-forest-500">Total Earnings</p>
            <p className="font-display text-2xl font-bold text-forest-900">{formatINR(totalEarnings)}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-48 rounded-3xl bg-white animate-pulse" />
      ) : completed.length === 0 ? (
        <div className="card-warm text-center py-12 text-forest-600">No completed visits yet.</div>
      ) : (
        <div className="space-y-4">
          {completed.map((b) => (
            <div key={b.id} className="card-warm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-display text-lg font-bold text-forest-900">{b.serviceCategory?.name}</h3>
                  <StatusBadge status={b.status} />
                </div>
                <p className="text-sm text-forest-700 mt-0.5">
                  Elder: <strong>{b.elderProfile?.fullName}</strong> • {b.bookingDate} ({b.durationHours} hrs)
                </p>
                {b.ratingGiven && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-peach-500 font-semibold">
                    <Star className="h-3.5 w-3.5 fill-peach-300 text-peach-300" /> {b.ratingGiven}/5
                    {b.reviewComment && <span className="text-forest-600 font-normal">“{b.reviewComment}”</span>}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-display text-xl font-bold text-forest-800">+{formatINR(b.totalAmount)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </CompanionLayout>
  );
}
