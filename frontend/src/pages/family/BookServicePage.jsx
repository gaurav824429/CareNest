import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CalendarPlus, Sparkles, ArrowRight, Tag } from 'lucide-react';
import FamilyLayout from './FamilyLayout';
import api, { getErrorMessage } from '../../api/client';
import { formatINR } from '../../utils/formatters';

export default function BookServicePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [elders, setElders] = useState([]);
  const [companions, setCompanions] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    elderProfileId: searchParams.get('elderId') || '',
    companionProfileId: searchParams.get('companionId') || '',
    serviceCategoryId: searchParams.get('serviceId') || '',
    bookingDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    startTime: '10:00',
    durationHours: 2,
    occasionType: searchParams.get('occasion') ? 'Birthday' : '',
    occasionTitle: '',
    specialNotes: '',
  });

  useEffect(() => {
    Promise.all([
      api.get('/family/elders'),
      api.get('/companions'),
      api.get('/services'),
    ]).then(([eRes, cRes, sRes]) => {
      setElders(eRes.data);
      setCompanions(cRes.data);
      setServices(sRes.data);
      const initialSvcId = searchParams.get('serviceId') || (sRes.data[0]?.id?.toString() || '');
      const initialSvc = sRes.data.find((s) => s.id.toString() === initialSvcId.toString());
      setForm((prev) => ({
        ...prev,
        elderProfileId: prev.elderProfileId || (eRes.data[0]?.id?.toString() || ''),
        companionProfileId: prev.companionProfileId || (cRes.data[0]?.id?.toString() || ''),
        serviceCategoryId: initialSvcId,
        durationHours: initialSvc?.defaultDurationHours || 2,
      }));
    }).finally(() => setLoading(false));
  }, []);

  const selectedCompanion = companions.find((c) => c.id.toString() === form.companionProfileId.toString());
  const selectedService = services.find((s) => s.id.toString() === form.serviceCategoryId.toString());

  const defaultHours = selectedService?.defaultDurationHours || 2;
  const servicePrice = selectedService?.effectivePrice ?? selectedService?.regularPrice ?? 499;
  const requestedHours = Number(form.durationHours || defaultHours);
  const estimatedTotal = requestedHours === defaultHours
    ? servicePrice
    : Math.round((servicePrice / Math.max(1, defaultHours)) * requestedHours);

  const handleServiceChange = (newServiceId) => {
    const svc = services.find((s) => s.id.toString() === newServiceId.toString());
    setForm({
      ...form,
      serviceCategoryId: newServiceId,
      durationHours: svc?.defaultDurationHours || 2,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.elderProfileId || !form.companionProfileId || !form.serviceCategoryId) {
      setError('Please select an elder profile, companion, and service.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/family/bookings', {
        elderProfileId: Number(form.elderProfileId),
        companionProfileId: Number(form.companionProfileId),
        serviceCategoryId: Number(form.serviceCategoryId),
        bookingDate: form.bookingDate,
        startTime: form.startTime,
        durationHours: Number(form.durationHours),
        occasionType: form.occasionType || null,
        occasionTitle: form.occasionTitle || null,
        specialNotes: form.specialNotes,
      });
      navigate('/family/bookings');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FamilyLayout
      title="Book a Companionship Visit"
      subtitle="Choose a companion, service, date, and any special instructions for your loved one in Pune."
    >
      {loading ? (
        <div className="h-96 rounded-3xl bg-white animate-pulse" />
      ) : elders.length === 0 ? (
        <div className="card-warm text-center py-14">
          <h3 className="font-display text-xl font-bold text-forest-900">Add an Elder Profile First</h3>
          <p className="mt-2 text-sm text-forest-600">Before booking a companion, please create a profile for your parent.</p>
          <Link to="/family/elders" className="btn-primary mt-5">Create Elder Profile</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <form onSubmit={handleSubmit} className="lg:col-span-8 card-warm space-y-5">
            {error && <div className="rounded-2xl bg-red-50 p-3.5 text-sm text-red-700">{error}</div>}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-forest-700 mb-1.5">For Whom (Elder Profile)</label>
                <select
                  className="input-warm"
                  value={form.elderProfileId}
                  onChange={(e) => setForm({ ...form, elderProfileId: e.target.value })}
                  required
                >
                  {elders.map((el) => (
                    <option key={el.id} value={el.id}>{el.fullName} ({el.relationship})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-forest-700 mb-1.5">Select Companion</label>
                <select
                  className="input-warm"
                  value={form.companionProfileId}
                  onChange={(e) => setForm({ ...form, companionProfileId: e.target.value })}
                  required
                >
                  {companions.map((c) => (
                    <option key={c.id} value={c.id}>{c.user?.fullName} — {c.city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-forest-700 mb-1.5">Service Category</label>
              <select
                className="input-warm"
                value={form.serviceCategoryId}
                onChange={(e) => handleServiceChange(e.target.value)}
                required
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {formatINR(s.effectivePrice ?? s.regularPrice)} ({s.durationLabel || `${s.defaultDurationHours} hrs`})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-forest-700 mb-1.5">Visit Date</label>
                <input
                  type="date"
                  className="input-warm"
                  value={form.bookingDate}
                  onChange={(e) => setForm({ ...form, bookingDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-forest-700 mb-1.5">Start Time</label>
                <input
                  type="time"
                  className="input-warm"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-forest-700 mb-1.5">Duration (Hours)</label>
                <select
                  className="input-warm"
                  value={form.durationHours}
                  onChange={(e) => setForm({ ...form, durationHours: Number(e.target.value) })}
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((h) => (
                    <option key={h} value={h}>{h} {h === 1 ? 'hour' : 'hours'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded-2xl bg-peach-50 border border-peach-100 p-4 space-y-3">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-peach-500">
                <Sparkles className="h-4 w-4" /> Optional: Special Occasion?
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <select
                  className="input-warm bg-white"
                  value={form.occasionType}
                  onChange={(e) => setForm({ ...form, occasionType: e.target.value })}
                >
                  <option value="">Regular Visit (No special occasion)</option>
                  <option value="Birthday">Birthday Celebration</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Festival">Festival / Cultural Celebration</option>
                  <option value="Family Milestone">Family Milestone</option>
                </select>
                {form.occasionType && (
                  <input
                    type="text"
                    placeholder="e.g., Aai's 75th Birthday Tea"
                    className="input-warm bg-white"
                    value={form.occasionTitle}
                    onChange={(e) => setForm({ ...form, occasionTitle: e.target.value })}
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-forest-700 mb-1.5">Notes & Preferences for Companion</label>
              <textarea
                rows={3}
                className="input-warm"
                placeholder="Share favorite chai, topics they enjoy, society gate instructions..."
                value={form.specialNotes}
                onChange={(e) => setForm({ ...form, specialNotes: e.target.value })}
              />
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-3.5">
              <CalendarPlus className="h-4 w-4" />
              {submitting ? 'Confirming Request...' : 'Send Booking Request'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Summary Card */}
          <div className="lg:col-span-4">
            <div className="card-warm sticky top-24 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-forest-900">Booking Summary</h3>
                {selectedService?.promotionalPricingEnabled && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-peach-100 px-2.5 py-0.5 text-[10px] font-semibold text-peach-500">
                    <Tag className="h-3 w-3" /> Launch Price
                  </span>
                )}
              </div>
              <div className="space-y-2.5 text-sm text-forest-700 border-b border-cream-200 pb-4">
                <div className="flex justify-between">
                  <span>Companion</span>
                  <span className="font-semibold text-forest-900">{selectedCompanion?.user?.fullName || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service</span>
                  <span className="font-semibold text-forest-900 text-right">{selectedService?.name || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Price</span>
                  <span className="font-semibold">
                    {formatINR(servicePrice)}
                    {selectedService?.promotionalPricingEnabled && selectedService?.regularPrice > servicePrice && (
                      <span className="ml-1.5 text-xs text-forest-400 line-through">{formatINR(selectedService.regularPrice)}</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Duration</span>
                  <span className="font-semibold">{form.durationHours} hrs</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-forest-900">Estimated Total</span>
                <span className="font-display text-2xl font-bold text-forest-700">{formatINR(estimatedTotal)}</span>
              </div>
              <p className="text-xs text-forest-500">
                No online payment required right now. Your companion will confirm shortly.
                {(selectedService?.slug === 'grocery-errands' || selectedService?.slug === 'special-occasions') && (
                  <span className="mt-1 block font-medium text-forest-600">
                    Note: Grocery, travel, and material costs are charged separately at actuals.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </FamilyLayout>
  );
}
