import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Inbox, CalendarClock, CheckCircle2, IndianRupee, Star, AlertCircle } from 'lucide-react';
import CompanionLayout from './CompanionLayout';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/formatters';

export default function CompanionDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/companion/dashboard')
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Pending Requests', value: data?.pendingRequestsCount ?? 0, icon: Inbox, color: 'bg-peach-100 text-peach-500' },
    { label: 'Upcoming Visits', value: data?.upcomingVisitsCount ?? 0, icon: CalendarClock, color: 'bg-mint-100 text-forest-700' },
    { label: 'Completed Visits', value: data?.completedVisitsCount ?? 0, icon: CheckCircle2, color: 'bg-forest-50 text-forest-600' },
    { label: 'Total Earnings', value: formatINR(data?.totalEarnings ?? 0), icon: IndianRupee, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <CompanionLayout
      title={`Hello, ${user?.fullName?.split(' ')[0] || 'Companion'}`}
      subtitle="Manage your companionship schedule, booking requests, and heartfelt family updates."
    >
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 rounded-3xl bg-white animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-8">
          {data?.profile?.approvalStatus === 'PENDING' && (
            <div className="flex items-center gap-3 rounded-3xl border border-peach-200 bg-peach-50 p-5 text-sm text-forest-900">
              <AlertCircle className="h-5 w-5 text-peach-500 shrink-0" />
              <div>
                <strong>Profile Pending Approval:</strong> Our CareNest admin team is reviewing your profile. Complete your details in{' '}
                <Link to="/companion/profile" className="font-semibold underline">My Profile</Link> to speed up approval.
              </div>
            </div>
          )}

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

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8 card-warm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl font-bold text-forest-900">Recent Bookings</h2>
                <Link to="/companion/requests" className="text-xs font-semibold text-forest-600 hover:underline">
                  Manage requests →
                </Link>
              </div>
              {data?.recentBookings?.length === 0 ? (
                <p className="text-sm text-forest-600 py-8 text-center">No booking requests yet.</p>
              ) : (
                <div className="space-y-3">
                  {data?.recentBookings?.map((b) => (
                    <div key={b.id} className="rounded-2xl border border-cream-200 bg-cream-50/70 p-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-forest-900">{b.serviceCategory?.name}</p>
                        <p className="text-xs text-forest-600">
                          Elder: <strong>{b.elderProfile?.fullName}</strong> • Family: {b.familyUser?.fullName}
                        </p>
                        <p className="text-xs text-forest-500 mt-0.5">{b.bookingDate} at {b.startTime?.slice(0, 5)} ({b.durationHours} hrs)</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-forest-800">{formatINR(b.totalAmount)}</span>
                        <StatusBadge status={b.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-4 card-warm space-y-4">
              <h2 className="font-display text-xl font-bold text-forest-900">Profile Snapshot</h2>
              <div className="flex items-center justify-between text-sm">
                <span className="text-forest-600">Approval Status</span>
                <StatusBadge status={data?.profile?.approvalStatus} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-forest-600">Rating</span>
                <span className="flex items-center gap-1 font-semibold text-peach-500">
                  <Star className="h-4 w-4 fill-peach-300 text-peach-300" />
                  {data?.profile?.rating} ({data?.profile?.totalReviews})
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-forest-600">Hourly Payout Rate</span>
                <span className="font-bold text-forest-900">{formatINR(data?.profile?.hourlyRate)}/hr</span>
              </div>
              <Link to="/companion/profile" className="btn-outline w-full justify-center">
                Edit My Profile
              </Link>
            </div>
          </div>
        </div>
      )}
    </CompanionLayout>
  );
}
