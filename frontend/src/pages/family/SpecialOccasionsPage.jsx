import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PartyPopper, CalendarPlus, Sparkles } from 'lucide-react';
import FamilyLayout from './FamilyLayout';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/client';
import { formatDateIN } from '../../utils/formatters';

export default function SpecialOccasionsPage() {
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/family/bookings')
      .then((res) => {
        setOccasions(res.data.filter((b) => b.occasionType && b.occasionType.trim() !== ''));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <FamilyLayout
      title="Special Occasions & Celebrations"
      subtitle="Plan birthdays, anniversaries, and cultural celebrations so your parents feel cherished even from afar."
    >
      <div className="rounded-3xl bg-gradient-to-r from-forest-700 to-forest-600 p-8 text-white shadow-card mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-mint-100">
            <Sparkles className="h-3.5 w-3.5 text-peach-300" /> Celebrate Together
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold">Make Every Milestone Unforgettable</h2>
          <p className="text-sm text-mint-100/90">
            Our companions help with flowers, cake, festive music, photos, and setting up family video calls so you’re right there in spirit.
          </p>
        </div>
        <Link to="/family/book?occasion=true" className="btn-peach shrink-0">
          <CalendarPlus className="h-4 w-4" /> Plan a Celebration
        </Link>
      </div>

      {loading ? (
        <div className="h-48 rounded-3xl bg-white animate-pulse" />
      ) : occasions.length === 0 ? (
        <div className="card-warm text-center py-14">
          <PartyPopper className="mx-auto h-10 w-10 text-peach-400" />
          <h3 className="mt-4 font-display text-xl font-bold text-forest-900">No Celebrations Scheduled Yet</h3>
          <p className="mt-2 text-sm text-forest-600">Plan a birthday, anniversary, or festival visit for your parents.</p>
          <Link to="/family/book?occasion=true" className="btn-primary mt-5">Schedule Celebration</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {occasions.map((b) => (
            <div key={b.id} className="card-warm border-peach-200/70">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-peach-100 text-peach-500">
                    <PartyPopper className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-peach-500">{b.occasionType}</span>
                    <h3 className="font-display text-lg font-bold text-forest-900">{b.occasionTitle || b.serviceCategory?.name}</h3>
                  </div>
                </div>
                <StatusBadge status={b.status} />
              </div>
              <div className="mt-4 space-y-1 text-sm text-forest-700">
                <p>For <strong>{b.elderProfile?.fullName}</strong> with <strong>{b.companionProfile?.user?.fullName}</strong></p>
                <p className="text-xs text-forest-600">{formatDateIN(b.bookingDate)} at {b.startTime?.slice(0, 5)} ({b.durationHours} hrs)</p>
                {b.specialNotes && <p className="mt-2 rounded-xl bg-cream-50 p-3 text-xs text-forest-700">{b.specialNotes}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </FamilyLayout>
  );
}
