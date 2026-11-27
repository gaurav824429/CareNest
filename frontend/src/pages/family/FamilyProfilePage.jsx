import React, { useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import FamilyLayout from './FamilyLayout';
import { useAuth } from '../../context/AuthContext';
import api, { getErrorMessage } from '../../api/client';

export default function FamilyProfilePage() {
  const { user, updateUserState } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    city: user?.city || '',
    avatarUrl: user?.avatarUrl || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const res = await api.put('/auth/profile', form);
      updateUserState(res.data);
      setMessage('Your profile and preferences have been updated.');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <FamilyLayout title="Profile & Settings" subtitle="Manage your family account details and contact preferences.">
      <form onSubmit={handleSubmit} className="card-warm max-w-2xl space-y-5">
        {message && (
          <div className="flex items-center gap-2 rounded-2xl bg-mint-100 p-3.5 text-sm font-medium text-forest-800">
            <CheckCircle2 className="h-4 w-4 text-forest-600" /> {message}
          </div>
        )}
        {error && <div className="rounded-2xl bg-red-50 p-3.5 text-sm text-red-700">{error}</div>}

        <div>
          <label className="block text-xs font-semibold uppercase text-forest-700 mb-1.5">Full Name</label>
          <input
            className="input-warm"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase text-forest-700 mb-1.5">Phone Number</label>
            <input
              className="input-warm"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-forest-700 mb-1.5">Your City</label>
            <input
              className="input-warm"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-forest-700 mb-1.5">Profile Photo URL (Optional)</label>
          <input
            className="input-warm"
            value={form.avatarUrl}
            onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
            placeholder="https://..."
          />
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </FamilyLayout>
  );
}
