import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import StatusBadge from '../../components/StatusBadge';
import api, { getErrorMessage } from '../../api/client';
import { formatINR, formatDateIN } from '../../utils/formatters';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = () => {
    setLoading(true);
    api.get('/admin/bookings')
      .then((res) => setBookings(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const changeStatus = async (id, status) => {
    try {
      await api.patch(`/admin/bookings/${id}/status`, { status });
      loadBookings();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <AdminLayout title="All Platform Bookings" subtitle="Oversee every scheduled, active, and completed companionship visit.">
      {loading ? (
        <div className="h-64 rounded-3xl bg-white animate-pulse" />
      ) : (
        <div className="card-warm overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-cream-200 bg-cream-50 text-xs uppercase text-forest-500">
              <tr>
                <th className="px-5 py-4">Service</th>
                <th className="px-5 py-4">Family & Elder</th>
                <th className="px-5 py-4">Companion</th>
                <th className="px-5 py-4">Date & Time</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-cream-50/50">
                  <td className="px-5 py-4 font-semibold text-forest-900">{b.serviceCategory?.name}</td>
                  <td className="px-5 py-4 text-forest-700">
                    {b.familyUser?.fullName} <br />
                    <span className="text-xs text-forest-500">Elder: {b.elderProfile?.fullName}</span>
                  </td>
                  <td className="px-5 py-4 text-forest-700">{b.companionProfile?.user?.fullName}</td>
                  <td className="px-5 py-4 text-xs text-forest-600">
                    {formatDateIN(b.bookingDate)} • {b.startTime?.slice(0, 5)} ({b.durationHours}h)
                  </td>
                  <td className="px-5 py-4 font-bold text-forest-900">{formatINR(b.totalAmount)}</td>
                  <td className="px-5 py-4"><StatusBadge status={b.status} /></td>
                  <td className="px-5 py-4 text-right">
                    <select
                      className="rounded-xl border border-cream-300 bg-white px-2.5 py-1.5 text-xs font-medium text-forest-800"
                      value={b.status}
                      onChange={(e) => changeStatus(b.id, e.target.value)}
                    >
                      {['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REJECTED'].map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
