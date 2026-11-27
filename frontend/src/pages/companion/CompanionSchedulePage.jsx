import React, { useEffect, useState } from 'react';
import { CalendarClock, Play, CheckCircle2, MessageSquarePlus, X } from 'lucide-react';
import CompanionLayout from './CompanionLayout';
import StatusBadge from '../../components/StatusBadge';
import api, { getErrorMessage } from '../../api/client';

export default function CompanionSchedulePage() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateModal, setUpdateModal] = useState({ open: false, booking: null, moodStatus: 'Joyful & Engaged', message: '' });

  const loadVisits = () => {
    setLoading(true);
    api.get('/companion/bookings')
      .then((res) => setVisits(res.data.filter((b) => ['CONFIRMED', 'IN_PROGRESS'].includes(b.status))))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadVisits();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/companion/bookings/${id}/status`, { status });
      loadVisits();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const submitVisitUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/companion/bookings/${updateModal.booking.id}/updates`, {
        moodStatus: updateModal.moodStatus,
        message: updateModal.message,
      });
      setUpdateModal({ open: false, booking: null, moodStatus: 'Joyful & Engaged', message: '' });
      loadVisits();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <CompanionLayout
      title="Upcoming Schedule & Active Visits"
      subtitle="Start visits, share warm updates with families, and mark visits complete."
    >
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => <div key={i} className="h-36 rounded-3xl bg-white animate-pulse" />)}
        </div>
      ) : visits.length === 0 ? (
        <div className="card-warm text-center py-14">
          <CalendarClock className="mx-auto h-10 w-10 text-forest-400" />
          <h3 className="mt-4 font-display text-xl font-bold text-forest-900">No Upcoming Visits</h3>
          <p className="mt-2 text-sm text-forest-600">Accepted bookings will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visits.map((b) => (
            <div key={b.id} className="card-warm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-display text-lg font-bold text-forest-900">{b.serviceCategory?.name}</h3>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="text-sm text-forest-700">
                    Elder: <strong>{b.elderProfile?.fullName}</strong> • {b.elderProfile?.address || b.elderProfile?.city}
                  </p>
                  <p className="text-xs text-forest-600">
                    {b.bookingDate} at {b.startTime?.slice(0, 5)} • {b.durationHours} hrs
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setUpdateModal({ open: true, booking: b, moodStatus: 'Joyful & Engaged', message: '' })}
                    className="btn-outline px-4 py-2 text-xs"
                  >
                    <MessageSquarePlus className="h-3.5 w-3.5" /> Post Update
                  </button>
                  {b.status === 'CONFIRMED' && (
                    <button onClick={() => updateStatus(b.id, 'IN_PROGRESS')} className="btn-secondary px-4 py-2 text-xs">
                      <Play className="h-3.5 w-3.5" /> Start Visit
                    </button>
                  )}
                  <button onClick={() => updateStatus(b.id, 'COMPLETED')} className="btn-primary px-4 py-2 text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Complete Visit
                  </button>
                </div>
              </div>
              {b.visitUpdateNote && (
                <div className="mt-3 rounded-xl bg-mint-50 p-3 text-xs text-forest-800 border border-mint-100">
                  <strong>Latest Update:</strong> {b.visitUpdateNote}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {updateModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/40 backdrop-blur-sm p-4">
          <form onSubmit={submitVisitUpdate} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-elevated space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-forest-900">Share Visit Update</h3>
              <button type="button" onClick={() => setUpdateModal({ open: false, booking: null, moodStatus: 'Joyful & Engaged', message: '' })} className="rounded-full p-1.5 hover:bg-cream-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-forest-700 mb-1.5">Mood / Energy</label>
              <select
                className="input-warm"
                value={updateModal.moodStatus}
                onChange={(e) => setUpdateModal({ ...updateModal, moodStatus: e.target.value })}
              >
                <option>Joyful & Engaged</option>
                <option>Peaceful & Happy</option>
                <option>Energetic & Chatty</option>
                <option>Quiet & Relaxed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-forest-700 mb-1.5">Note for the Family</label>
              <textarea
                rows={4}
                className="input-warm"
                placeholder="Share what you did together today..."
                value={updateModal.message}
                onChange={(e) => setUpdateModal({ ...updateModal, message: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full justify-center">Send Update to Family</button>
          </form>
        </div>
      )}
    </CompanionLayout>
  );
}
