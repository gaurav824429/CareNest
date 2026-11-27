import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Languages, Clock, ShieldCheck, CalendarPlus, CheckCircle2 } from 'lucide-react';
import FamilyLayout from './FamilyLayout';
import api from '../../api/client';
import { formatINR } from '../../utils/formatters';

export default function CompanionDetailsPage() {
  const { id } = useParams();
  const [companion, setCompanion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/companions/${id}`)
      .then((res) => setCompanion(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <FamilyLayout title="Companion Profile" subtitle="Review background, skills, and availability before booking.">
      <Link to="/family/companions" className="inline-flex items-center gap-2 text-sm font-semibold text-forest-600 hover:text-forest-800 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Companions
      </Link>

      {loading ? (
        <div className="h-80 rounded-3xl bg-white animate-pulse" />
      ) : !companion ? (
        <div className="card-warm text-center py-12">Companion not found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-6">
            <div className="card-warm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <img
                  src={companion.user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(companion.user?.fullName || 'C')}&background=1B4332&color=fff`}
                  alt={companion.user?.fullName}
                  className="h-24 w-24 rounded-3xl object-cover border-4 border-mint-100"
                />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-2xl font-bold text-forest-900">{companion.user?.fullName}</h2>
                    {companion.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-mint-100 px-3 py-0.5 text-xs font-semibold text-forest-700">
                        <ShieldCheck className="h-3.5 w-3.5" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-forest-700">{companion.headline}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-forest-600 pt-1">
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {companion.city}</span>
                    <span className="flex items-center gap-1 text-peach-500 font-semibold">
                      <Star className="h-3.5 w-3.5 fill-peach-300 text-peach-300" /> {companion.rating} ({companion.totalReviews} reviews)
                    </span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-forest-500" /> {companion.completedVisitsCount} visits completed</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-cream-200">
                <h3 className="font-display text-lg font-bold text-forest-900">About {companion.user?.fullName?.split(' ')[0]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-forest-700/90">{companion.bio}</p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-cream-50 p-4 border border-cream-200">
                  <p className="text-xs font-semibold uppercase tracking-wider text-forest-500 flex items-center gap-1.5">
                    <Languages className="h-4 w-4" /> Languages Spoken
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-forest-900">{companion.languages}</p>
                </div>
                <div className="rounded-2xl bg-cream-50 p-4 border border-cream-200">
                  <p className="text-xs font-semibold uppercase tracking-wider text-forest-500 flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> Typical Availability
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-forest-900">{companion.availability}</p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-forest-500 mb-2.5">Skills & Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {(companion.skills || '').split(',').map((s) => (
                    <span key={s} className="rounded-full bg-mint-50 border border-mint-200 px-3.5 py-1.5 text-xs font-semibold text-forest-700">
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="card-warm sticky top-24 space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-forest-500">CareNest Pune Pricing</p>
                <p className="mt-1 font-display text-2xl font-bold text-forest-900">
                  From {formatINR(399)} <span className="text-sm font-normal text-forest-600">/ session</span>
                </p>
              </div>
              <p className="text-xs leading-relaxed text-forest-600">
                Introductory Pune launch pricing applies based on the service you select. Includes visit summary notes and zero hidden fees.
              </p>
              <Link to={`/family/book?companionId=${companion.id}`} className="btn-primary w-full justify-center py-3.5">
                <CalendarPlus className="h-4 w-4" /> Book a Visit with {companion.user?.fullName?.split(' ')[0]}
              </Link>
            </div>
          </div>
        </div>
      )}
    </FamilyLayout>
  );
}
