import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, MessageSquareHeart, Star, X, Plus } from 'lucide-react';
import FamilyLayout from './FamilyLayout';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import api, { getErrorMessage } from '../../api/client';
import { formatINR, formatDateIN } from '../../utils/formatters';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [updatesModal, setUpdatesModal] = useState({ open: false, booking: null, updates: [] });
  const [reviewModal, setReviewModal] = useState({ open: false, booking: null, rating: 5, comment: '' });

  const loadBookings = () => {
    setLoading(true);
    api.get('/family/bookings')
      .then((res) => setBookings(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const filtered = bookings.filter((b) => {
    if (filter === 'ALL') return true;
    if (filter === 'UPCOMING') return ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(b.status);
    return b.status === filter;
  });

  const handleCancel = async () => {
    if (!cancelTarget) return;
    try {
      await api.patch(`/family/bookings/${cancelTarget.id}/cancel`);
      setCancelTarget(null);
      loadBookings();
    } catch (err) {
      alert(getErrorMessage(err));
      setCancelTarget(null);
    }
  };

  const openUpdates = async (booking) => {
    const res = await api.get(`/family/bookings/${booking.id}/updates`);
    setUpdatesModal({ open: true, booking, updates: res.data });
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/family/bookings/${reviewModal.booking.id}/review`, {
        rating: reviewModal.rating,
        comment: reviewModal.comment,
      });
      setReviewModal({ open: false, booking: null, rating: 5, comment: '' });
      loadBookings();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <FamilyLayout
      title="My Bookings"
      subtitle="Track upcoming visits, read companion updates, and review completed sessions."
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {['ALL', 'UPCOMING', 'COMPLETED', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                filter === tab
                  ? 'bg-forest-600 text-white'
                  : 'bg-white border border-cream-300 text-forest-700 hover:bg-mint-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <Link to="/family/book" className="btn-primary py-2.5 px-5 text-sm">
          <Plus className="h-4 w-4" /> New Booking
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-36 rounded-3xl bg-white animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-warm text-center py-14">
          <CalendarDays className="mx-auto h-10 w-10 text-forest-400" />
          <h3 className="mt-4 font-display text-xl font-bold text-forest-900">No bookings in this view</h3>
          <Link to="/family/book" className="btn-primary mt-5">Book a Companionship Visit</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => (
            <div key={b.id} className="card-warm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-display text-lg font-bold text-forest-900">
                      {b.serviceCategory?.name}
                    </h3>
                    <StatusBadge status={b.status} />
                    {b.occasionType && (
                      <span className="rounded-full bg-peach-100 px-3 py-0.5 text-xs font-semibold text-peach-500">
                        {b.occasionType}: {b.occasionTitle || 'Celebration'}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-forest-700">
                    For <strong>{b.elderProfile?.fullName}</strong> • Companion: <strong>{b.companionProfile?.user?.fullName}</strong>
                  </p>
                  <p className="text-xs text-forest-600">
                    {formatDateIN(b.bookingDate)} at {b.startTime?.slice(0, 5)} • {b.durationHours} hrs • Total: <strong>{formatINR(b.totalAmount)}</strong>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={() => openUpdates(b)} className="btn-outline px-3.5 py-2 text-xs">
                    <MessageSquareHeart className="h-3.5 w-3.5" /> Visit Updates
                  </button>
                  {['PENDING', 'CONFIRMED'].includes(b.status) && (
                    <button
                      onClick={() => setCancelTarget(b)}
                      className="rounded-full border border-red-200 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      Cancel
                    </button>
                  )}
                  {b.status === 'COMPLETED' && !b.ratingGiven && (
                    <button
                      onClick={() => setReviewModal({ open: true, booking: b, rating: 5, comment: '' })}
                      className="btn-peach px-4 py-2 text-xs"
                    >
                      <Star className="h-3.5 w-3.5" /> Leave Review
                    </button>
                  )}
                </div>
              </div>

              {b.visitUpdateNote && (
                <div className="mt-4 rounded-2xl bg-mint-50 border border-mint-100 p-3.5 text-xs text-forest-800">
                  <strong>Latest Note:</strong> {b.visitUpdateNote}
                </div>
              )}

              {b.ratingGiven && (
                <div className="mt-3 flex items-center gap-2 text-xs text-forest-600">
                  <span className="flex items-center gap-1 font-semibold text-peach-500">
                    <Star className="h-3.5 w-3.5 fill-peach-300 text-peach-300" /> {b.ratingGiven}/5
                  </span>
                  {b.reviewComment && <span>“{b.reviewComment}”</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Visit Updates Modal */}
      {updatesModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-elevated">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold text-forest-900">Visit Updates</h3>
              <button onClick={() => setUpdatesModal({ open: false, booking: null, updates: [] })} className="rounded-full p-1.5 hover:bg-cream-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            {updatesModal.updates.length === 0 ? (
              <p className="text-sm text-forest-600 py-6 text-center">No timeline updates posted yet for this visit.</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {updatesModal.updates.map((u) => (
                  <div key={u.id} className="rounded-2xl bg-cream-50 border border-cream-200 p-4">
                    <div className="flex justify-between text-xs text-forest-500">
                      <span className="font-semibold text-forest-800">{u.authorName}</span>
                      <span className="rounded-full bg-mint-100 px-2.5 py-0.5 text-forest-700 font-medium">{u.moodStatus}</span>
                    </div>
                    <p className="mt-2 text-sm text-forest-800">{u.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/40 backdrop-blur-sm p-4">
          <form onSubmit={submitReview} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-elevated space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-forest-900">Rate This Visit</h3>
              <button type="button" onClick={() => setReviewModal({ open: false, booking: null, rating: 5, comment: '' })} className="rounded-full p-1.5 hover:bg-cream-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-forest-700 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewModal({ ...reviewModal, rating: star })}
                    className={`rounded-xl p-2 border ${reviewModal.rating >= star ? 'bg-peach-100 border-peach-300 text-peach-500' : 'border-cream-300 text-gray-400'}`}
                  >
                    <Star className={`h-5 w-5 ${reviewModal.rating >= star ? 'fill-peach-300' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-forest-700 mb-1">Your Review</label>
              <textarea
                rows={3}
                className="input-warm"
                placeholder="How did your parent enjoy the visit?"
                value={reviewModal.comment}
                onChange={(e) => setReviewModal({ ...reviewModal, comment: e.target.value })}
              />
            </div>
            <button type="submit" className="btn-primary w-full justify-center">Submit Review</button>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={!!cancelTarget}
        danger
        title="Cancel Booking"
        message="Are you sure you want to cancel this scheduled companionship visit?"
        confirmLabel="Yes, Cancel Visit"
        onConfirm={handleCancel}
        onCancel={() => setCancelTarget(null)}
      />
    </FamilyLayout>
  );
}
