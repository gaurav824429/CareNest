import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Tag, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import AdminLayout from './AdminLayout';
import ConfirmDialog from '../../components/ConfirmDialog';
import api, { getErrorMessage } from '../../api/client';
import { formatINR } from '../../utils/formatters';

const EMPTY = {
  name: '',
  description: '',
  iconName: 'HeartHandshake',
  durationLabel: '2 hours',
  defaultDurationHours: 2,
  regularPrice: 699,
  introductoryPrice: 499,
  promotionalPricingEnabled: true,
  active: true,
  specialOccasion: false,
};

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const loadServices = () => {
    setLoading(true);
    api.get('/admin/services')
      .then((res) => setServices(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadServices();
  }, []);

  const showSuccess = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 4000);
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (svc) => {
    setEditingId(svc.id);
    setForm({
      name: svc.name,
      description: svc.description || '',
      iconName: svc.iconName || 'HeartHandshake',
      durationLabel: svc.durationLabel || `${svc.defaultDurationHours || 2} hours`,
      defaultDurationHours: svc.defaultDurationHours || 2,
      regularPrice: svc.regularPrice ?? 699,
      introductoryPrice: svc.introductoryPrice ?? 499,
      promotionalPricingEnabled: svc.promotionalPricingEnabled ?? true,
      active: svc.active,
      specialOccasion: svc.specialOccasion,
    });
    setError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    const reg = Number(form.regularPrice);
    const intro = form.introductoryPrice !== '' && form.introductoryPrice !== null ? Number(form.introductoryPrice) : null;
    if (!reg || reg <= 0) {
      setError('Regular price must be greater than ₹0.');
      return;
    }
    if (intro !== null && intro <= 0) {
      setError('Introductory price must be greater than ₹0.');
      return;
    }
    if (form.promotionalPricingEnabled && (!intro || intro <= 0)) {
      setError('Please enter a valid introductory launch price when promotional pricing is enabled.');
      return;
    }
    if (intro !== null && intro > reg) {
      setError('Introductory price cannot exceed regular price.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        regularPrice: reg,
        introductoryPrice: intro,
        defaultDurationHours: Math.max(1, Number(form.defaultDurationHours || 2)),
      };
      if (editingId) {
        await api.put(`/admin/services/${editingId}`, payload);
        showSuccess(`Updated pricing and details for "${form.name}".`);
      } else {
        await api.post('/admin/services', payload);
        showSuccess(`Added new service "${form.name}" to CareNest.`);
      }
      setModalOpen(false);
      loadServices();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const togglePromo = async (svc) => {
    try {
      await api.put(`/admin/services/${svc.id}`, {
        ...svc,
        promotionalPricingEnabled: !svc.promotionalPricingEnabled,
      });
      showSuccess(`${!svc.promotionalPricingEnabled ? 'Enabled' : 'Disabled'} introductory pricing for "${svc.name}".`);
      loadServices();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const toggleActive = async (svc) => {
    try {
      await api.put(`/admin/services/${svc.id}`, {
        ...svc,
        active: !svc.active,
      });
      showSuccess(`${!svc.active ? 'Activated' : 'Deactivated'} "${svc.name}".`);
      loadServices();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/admin/services/${deleteTarget.id}`);
      showSuccess(`Deleted "${deleteTarget.name}".`);
      setDeleteTarget(null);
      loadServices();
    } catch (err) {
      alert(getErrorMessage(err));
      setDeleteTarget(null);
    }
  };

  return (
    <AdminLayout
      title="Service & Pricing Management"
      subtitle="Configure Pune introductory launch prices, regular rates, durations, and active service offerings."
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-mint-100 px-4 py-1.5 text-xs font-semibold text-forest-800">
          <Sparkles className="h-3.5 w-3.5 text-peach-500" />
          Changes saved here immediately update all public & family booking prices
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="h-4 w-4" /> Add Service Category
        </button>
      </div>

      {feedback && (
        <div className="mb-6 flex items-center gap-2.5 rounded-2xl border border-mint-200 bg-mint-50 p-4 text-sm font-medium text-forest-800">
          <CheckCircle2 className="h-5 w-5 text-forest-600 shrink-0" />
          {feedback}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-48 rounded-3xl bg-white animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {services.map((s) => (
            <div key={s.id} className={`card-warm flex flex-col justify-between ${!s.active ? 'opacity-70 bg-cream-50' : ''}`}>
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg font-bold text-forest-900">{s.name}</h3>
                      {s.promotionalPricingEnabled && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-peach-100 px-2.5 py-0.5 text-[11px] font-semibold text-peach-500">
                          <Tag className="h-3 w-3" /> Introductory Launch Price
                        </span>
                      )}
                      {!s.active && (
                        <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-[11px] font-semibold text-gray-700">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-forest-600">
                      <Clock className="h-3.5 w-3.5" /> {s.durationLabel || (s.defaultDurationHours ? `${s.defaultDurationHours} hours` : 'Per session')}
                      {s.specialOccasion && ' • Special Occasion'}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(s)} className="rounded-xl p-2 text-forest-600 hover:bg-mint-50" title="Edit price & details">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleteTarget(s)} className="rounded-xl p-2 text-red-600 hover:bg-red-50" title="Delete service">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-sm text-forest-700/85">{s.description}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-cream-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-2xl font-bold text-forest-900">
                    {formatINR(s.effectivePrice ?? s.regularPrice)}
                  </span>
                  {s.promotionalPricingEnabled && s.regularPrice > (s.effectivePrice ?? s.regularPrice) && (
                    <span className="text-xs text-forest-500 line-through">
                      {formatINR(s.regularPrice)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePromo(s)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold border transition ${
                      s.promotionalPricingEnabled
                        ? 'bg-peach-50 border-peach-200 text-peach-500 hover:bg-peach-100'
                        : 'bg-white border-cream-300 text-forest-600 hover:bg-cream-100'
                    }`}
                  >
                    {s.promotionalPricingEnabled ? 'Promo On' : 'Promo Off'}
                  </button>
                  <button
                    onClick={() => toggleActive(s)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold border transition ${
                      s.active
                        ? 'bg-mint-50 border-mint-200 text-forest-700 hover:bg-mint-100'
                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {s.active ? 'Active' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/40 backdrop-blur-sm p-4">
          <form onSubmit={handleSave} className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-7 shadow-elevated space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-forest-900">
                {editingId ? 'Edit Service & Pricing' : 'New Service Category'}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-full p-1.5 hover:bg-cream-200">
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-100 p-3 text-sm text-red-700">{error}</div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase text-forest-700 mb-1">Service Name *</label>
              <input className="input-warm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-forest-700 mb-1">Description *</label>
              <textarea rows={3} className="input-warm" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-forest-700 mb-1">Duration Label</label>
                <input className="input-warm" value={form.durationLabel} onChange={(e) => setForm({ ...form, durationLabel: e.target.value })} placeholder="e.g., 2 hours" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-forest-700 mb-1">Base Hours</label>
                <input type="number" min="1" className="input-warm" value={form.defaultDurationHours} onChange={(e) => setForm({ ...form, defaultDurationHours: Number(e.target.value) })} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-2xl bg-cream-50 border border-cream-200 p-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-forest-700 mb-1">Regular Price (₹) *</label>
                <input type="number" min="1" step="1" className="input-warm bg-white" value={form.regularPrice} onChange={(e) => setForm({ ...form, regularPrice: e.target.value })} required />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-forest-700 mb-1">Introductory Price (₹)</label>
                <input type="number" min="1" step="1" className="input-warm bg-white" value={form.introductoryPrice} onChange={(e) => setForm({ ...form, introductoryPrice: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-forest-700 mb-1">Icon Name</label>
              <select className="input-warm" value={form.iconName} onChange={(e) => setForm({ ...form, iconName: e.target.value })}>
                <option>HeartHandshake</option>
                <option>Sun</option>
                <option>Footprints</option>
                <option>BookOpen</option>
                <option>ShoppingBag</option>
                <option>PartyPopper</option>
                <option>CalendarDays</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-1 text-sm text-forest-800">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.promotionalPricingEnabled} onChange={(e) => setForm({ ...form, promotionalPricingEnabled: e.target.checked })} />
                Enable Introductory Launch Pricing
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                Active
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.specialOccasion} onChange={(e) => setForm({ ...form, specialOccasion: e.target.checked })} />
                Special Occasion
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className="btn-outline">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : 'Save Service & Pricing'}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        danger
        title="Delete Service Category"
        message={`Delete "${deleteTarget?.name}"?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
