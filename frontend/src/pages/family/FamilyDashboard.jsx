import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, CalendarClock, CheckCircle2, PartyPopper, ArrowRight, MessageSquareHeart, Plus
} from 'lucide-react';
import FamilyLayout from './FamilyLayout';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { formatINR, formatDateIN } from '../../utils/formatters';

export default function FamilyDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/family/dashboard')
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Elder Profiles', value: data?.eldersCount ?? 0, icon: Users, color: 'bg-mint-100 text-forest-700' },
    { label: 'Upcoming Visits', value: data?.upcomingBookingsCount ?? 0, icon: CalendarClock, color: 'bg-peach-100 text-peach-500' },
    { label: 'Completed Visits', value: data?.completedBookingsCount ?? 0, icon: CheckCircle2, color: 'bg-forest-50 text-forest-600' },
    { label: 'Special Occasions', value: data?.specialOccasionsCount ?? 0, icon: PartyPopper, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <FamilyLayout
      title={`Welcome, ${user?.fullName?.split(' ')[0] || 'Family'}`}
      subtitle="Stay connected with your parents’ visits, companions, and upcoming moments."
    >
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-3xl bg-white animate-pulse border border-cream-200" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="card-warm flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${s.color}`}>
                  <s.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-forest-500">{s.label}</p>
                  <p className="font-display text-2xl font-bold text-forest-900">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Link to="/family/book" className="btn-primary">
              <Plus className="h-4 w-4" /> Book a Visit
            </Link>
            <Link to="/family/companions" className="btn-secondary">
              Browse Companions
            </Link>
            <Link to="/family/elders" className="btn-outline">
              Manage Elder Profiles
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Recent Bookings */}
            <div className="lg:col-span-7 card-warm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl font-bold text-forest-900">Recent & Upcoming Visits</h2>
                <Link to="/family/bookings" className="text-xs font-semibold text-forest-600 hover:underline">
                  View all →
                </Link>
              </div>

              {data?.recentBookings?.length === 0 ? (
                <div className="rounded-2xl bg-cream-100 p-8 text-center">
                  <p className="text-sm text-forest-700">No bookings yet. Schedule your first companionship visit!</p>
                  <Link to="/family/book" className="btn-primary mt-4">Book Now</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {data?.recentBookings?.map((b) => (
                    <div key={b.id} className="rounded-2xl border border-cream-200 bg-cream-50/70 p-4 transition hover:bg-white">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-forest-900">
                            {b.serviceCategory?.name} {b.occasionTitle ? `— ${b.occasionTitle}` : ''}
                          </p>
                          <p className="text-xs text-forest-600 mt-0.5">
                            For <span className="font-semibold">{b.elderProfile?.fullName}</span> with{' '}
                            <span className="font-semibold">{b.companionProfile?.user?.fullName}</span>
                          </p>
                        </div>
                        <StatusBadge status={b.status} />
                      </div>
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-forest-600">
                        <span>{formatDateIN(b.bookingDate)} • {b.startTime?.slice(0, 5)} ({b.durationHours} hrs)</span>
                        <span className="font-bold text-forest-800">{formatINR(b.totalAmount)}</span>
                      </div>
                      {b.visitUpdateNote && (
                        <div className="mt-3 flex items-start gap-2 rounded-xl bg-mint-50 p-3 text-xs text-forest-800 border border-mint-100">
                          <MessageSquareHeart className="h-4 w-4 text-forest-600 shrink-0 mt-0.5" />
                          <span>{b.visitUpdateNote}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Elder Profiles Summary */}
            <div className="lg:col-span-5 card-warm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl font-bold text-forest-900">Your Loved Ones</h2>
                <Link to="/family/elders" className="text-xs font-semibold text-forest-600 hover:underline">
                  Manage →
                </Link>
              </div>
              {data?.elders?.length === 0 ? (
                <div className="rounded-2xl bg-cream-100 p-6 text-center">
                  <p className="text-sm text-forest-700">Add your parent’s profile to get started.</p>
                  <Link to="/family/elders" className="btn-secondary mt-3">Add Elder Profile</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {data?.elders?.map((elder) => (
                    <div key={elder.id} className="flex items-center gap-3.5 rounded-2xl border border-cream-200 p-3.5">
                      <img
                        src={elder.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(elder.fullName)}&background=D8F3DC&color=1B4332`}
                        alt={elder.fullName}
                        className="h-12 w-12 rounded-2xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-forest-900 truncate">{elder.fullName}</p>
                        <p className="text-xs text-forest-600">{elder.relationship} • Age {elder.age} • {elder.city}</p>
                        <p className="text-[11px] text-forest-500 truncate mt-0.5">{elder.hobbies}</p>
                      </div>
                      <Link to={`/family/book?elderId=${elder.id}`} className="rounded-full p-2 text-forest-600 hover:bg-mint-50" title="Book visit">
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </FamilyLayout>
  );
}
