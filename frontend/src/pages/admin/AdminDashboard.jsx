import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCheck, CalendarDays, IndianRupee, AlertCircle } from 'lucide-react';
import AdminLayout from './AdminLayout';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/client';
import { formatINR } from '../../utils/formatters';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Total Families', value: data?.totalFamilies ?? 0, icon: Users, color: 'bg-mint-100 text-forest-700' },
    { label: 'Companions', value: data?.totalCompanions ?? 0, icon: UserCheck, color: 'bg-forest-50 text-forest-600' },
    { label: 'Total Bookings', value: data?.totalBookings ?? 0, icon: CalendarDays, color: 'bg-peach-100 text-peach-500' },
    { label: 'Completed Value', value: formatINR(data?.totalPlatformValue ?? 0), icon: IndianRupee, color: 'bg-amber-50 text-amber-600' },
  ];

  const totalB = Math.max(1, data?.totalBookings || 1);
  const bars = [
    { label: 'Completed', count: data?.completedBookings ?? 0, color: 'bg-forest-600' },
    { label: 'Confirmed', count: data?.confirmedBookings ?? 0, color: 'bg-forest-400' },
    { label: 'Pending', count: data?.pendingBookings ?? 0, color: 'bg-peach-300' },
  ];

  return (
    <AdminLayout title="Platform Overview" subtitle="Monitor CareNest community growth, companion approvals, and bookings.">
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 rounded-3xl bg-white animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-8">
          {data?.pendingCompanions > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-peach-200 bg-peach-50 p-5 text-sm text-forest-900">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-peach-500 shrink-0" />
                <span>
                  <strong>{data.pendingCompanions} companion application(s)</strong> awaiting review and approval.
                </span>
              </div>
              <Link to="/admin/companions" className="btn-peach py-2 px-4 text-xs">Review Now</Link>
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
            {/* Booking Distribution */}
            <div className="lg:col-span-5 card-warm space-y-5">
              <h2 className="font-display text-xl font-bold text-forest-900">Booking Breakdown</h2>
              <div className="space-y-4">
                {bars.map((bar) => {
                  const pct = Math.round((bar.count / totalB) * 100);
                  return (
                    <div key={bar.label} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-forest-700">
                        <span>{bar.label}</span>
                        <span>{bar.count} ({pct}%)</span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-cream-200 overflow-hidden">
                        <div className={`h-full rounded-full ${bar.color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="pt-4 border-t border-cream-200 flex justify-between text-xs text-forest-600">
                <span>Registered Elder Profiles</span>
                <strong className="text-forest-900">{data?.totalElders ?? 0}</strong>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="lg:col-span-7 card-warm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl font-bold text-forest-900">Recent Platform Bookings</h2>
                <Link to="/admin/bookings" className="text-xs font-semibold text-forest-600 hover:underline">View all →</Link>
              </div>
              <div className="space-y-3">
                {data?.recentBookings?.map((b) => (
                  <div key={b.id} className="rounded-2xl border border-cream-200 bg-cream-50/70 p-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-forest-900">{b.serviceCategory?.name}</p>
                      <p className="text-xs text-forest-600">
                        {b.familyUser?.fullName} → {b.companionProfile?.user?.fullName} (for {b.elderProfile?.fullName})
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-forest-800">{formatINR(b.totalAmount)}</span>
                      <StatusBadge status={b.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
