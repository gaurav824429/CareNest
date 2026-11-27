import React, { useEffect, useState } from 'react';
import { Check, X, Inbox } from 'lucide-react';
import CompanionLayout from './CompanionLayout';
import StatusBadge from '../../components/StatusBadge';
import api, { getErrorMessage } from '../../api/client';
import { formatINR, formatDateIN } from '../../utils/formatters';

export default function BookingRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = () => {
    setLoading(true);
    api.get('/companion/bookings')
      .then((res) => setRequests(res.data.filter((b) => b.status === 'PENDING')))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await api.patch(`/companion/bookings/${id}/status`, {
        status,
        visitUpdateNote: status === 'CONFIRMED' ? 'Accepted! Looking forward to this visit.' : 'Unable to accommodate this time slot.',
      });
      loadRequests();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <CompanionLayout
      title="Booking Requests"
      subtitle="Review incoming family requests and elder preferences before accepting."
    >
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => <div key={i} className="h-40 rounded-3xl bg-white animate-pulse" />)}
        </div>
      ) : requests.length === 0 ? (
        <div className="card-warm text-center py-14">
          <Inbox className="mx-auto h-10 w-10 text-forest-400" />
          <h3 className="mt-4 font-display text-xl font-bold text-forest-900">All Caught Up!</h3>
          <p className="mt-2 text-sm text-forest-600">You have no pending booking requests at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((b) => (
            <div key={b.id} className="card-warm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-display text-lg font-bold text-forest-900">{b.serviceCategory?.name}</h3>
                    <StatusBadge status={b.status} />
                    {b.occasionType && (
                      <span className="rounded-full bg-peach-100 px-3 py-0.5 text-xs font-semibold text-peach-500">
                        {b.occasionType}: {b.occasionTitle}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-forest-700">
                    Elder: <strong>{b.elderProfile?.fullName}</strong> ({b.elderProfile?.age} yrs, {b.elderProfile?.city}) • Family: {b.familyUser?.fullName}
                  </p>
                  <p className="text-xs text-forest-600">
                    {formatDateIN(b.bookingDate)} at {b.startTime?.slice(0, 5)} • {b.durationHours} hrs • Earnings: <strong>{formatINR(b.totalAmount)}</strong>
                  </p>
                  {b.elderProfile?.hobbies && (
                    <p className="text-xs text-forest-600"><strong>Hobbies:</strong> {b.elderProfile.hobbies}</p>
                  )}
                  {b.specialNotes && (
                    <p className="mt-2 rounded-xl bg-cream-50 p-3 text-xs text-forest-800 border border-cream-200">
                      <strong>Family Note:</strong> {b.specialNotes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => handleAction(b.id, 'CONFIRMED')}
                    className="btn-primary px-5 py-2.5 text-xs"
                  >
                    <Check className="h-4 w-4" /> Accept
                  </button>
                  <button
                    onClick={() => handleAction(b.id, 'REJECTED')}
                    className="rounded-full border border-red-200 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1"
                  >
                    <X className="h-4 w-4" /> Decline
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </CompanionLayout>
  );
}
