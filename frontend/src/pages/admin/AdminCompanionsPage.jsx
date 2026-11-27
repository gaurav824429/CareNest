import React, { useEffect, useState } from 'react';
import { Check, X, Star } from 'lucide-react';
import AdminLayout from './AdminLayout';
import StatusBadge from '../../components/StatusBadge';
import api, { getErrorMessage } from '../../api/client';
import { formatINR } from '../../utils/formatters';

export default function AdminCompanionsPage() {
  const [companions, setCompanions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCompanions = () => {
    setLoading(true);
    api.get('/admin/companions')
      .then((res) => setCompanions(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCompanions();
  }, []);

  const updateApproval = async (id, status) => {
    try {
      await api.patch(`/admin/companions/${id}/approval`, { status });
      loadCompanions();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <AdminLayout title="Companion Verification" subtitle="Approve or reject companion profiles before they appear to families.">
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-36 rounded-3xl bg-white animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {companions.map((c) => (
            <div key={c.id} className="card-warm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <img
                  src={c.user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user?.fullName || 'C')}&background=1B4332&color=fff`}
                  alt={c.user?.fullName}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-display text-lg font-bold text-forest-900">{c.user?.fullName}</h3>
                    <StatusBadge status={c.approvalStatus} />
                  </div>
                  <p className="text-sm font-medium text-forest-700">{c.headline}</p>
                  <p className="text-xs text-forest-600">
                    {c.city} • {c.experienceYears} yrs exp • Payout: {formatINR(c.hourlyRate)}/hr • Languages: {c.languages}
                  </p>
                  <p className="text-xs text-peach-500 flex items-center gap-1 font-semibold">
                    <Star className="h-3.5 w-3.5 fill-peach-300 text-peach-300" /> {c.rating} ({c.totalReviews} reviews)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {c.approvalStatus !== 'APPROVED' && (
                  <button onClick={() => updateApproval(c.id, 'APPROVED')} className="btn-primary px-4 py-2 text-xs">
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                )}
                {c.approvalStatus !== 'REJECTED' && (
                  <button
                    onClick={() => updateApproval(c.id, 'REJECTED')}
                    className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1"
                  >
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
