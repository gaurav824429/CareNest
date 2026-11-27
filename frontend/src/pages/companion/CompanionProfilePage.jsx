import React, { useEffect, useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import CompanionLayout from './CompanionLayout';
import StatusBadge from '../../components/StatusBadge';
import api, { getErrorMessage } from '../../api/client';

export default function CompanionProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/companion/profile')
      .then((res) => setProfile(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const res = await api.put('/companion/profile', profile);
      setProfile(res.data);
      setMessage('Your companion profile has been updated.');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <CompanionLayout title="My Companion Profile" subtitle="Keep your bio, skills, languages, and availability up to date for families.">
      {loading ? (
        <div className="h-80 rounded-3xl bg-white animate-pulse" />
      ) : (
        <form onSubmit={handleSave} className="card-warm max-w-3xl space-y-5">
          <div className="flex items-center justify-between border-b border-cream-200 pb-4">
            <div>
              <h2 className="font-display text-xl font-bold text-forest-900">{profile?.user?.fullName}</h2>
              <p className="text-xs text-forest-600">{profile?.user?.email}</p>
            </div>
            <StatusBadge status={profile?.approvalStatus} />
          </div>

          {message && (
            <div className="flex items-center gap-2 rounded-2xl bg-mint-100 p-3.5 text-sm font-medium text-forest-800">
              <CheckCircle2 className="h-4 w-4 text-forest-600" /> {message}
            </div>
          )}
          {error && <div className="rounded-2xl bg-red-50 p-3.5 text-sm text-red-700">{error}</div>}

          <div>
            <label className="block text-xs font-semibold uppercase text-forest-700 mb-1.5">Professional Headline</label>
            <input
              className="input-warm"
              value={profile?.headline || ''}
              onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-forest-700 mb-1.5">About Me / Bio</label>
            <textarea
              rows={4}
              className="input-warm"
              value={profile?.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-forest-700 mb-1.5">City</label>
              <input
                className="input-warm"
                value={profile?.city || ''}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-forest-700 mb-1.5">Experience (Years)</label>
              <input
                type="number"
                className="input-warm"
                value={profile?.experienceYears || 1}
                onChange={(e) => setProfile({ ...profile, experienceYears: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-forest-700 mb-1.5">Hourly Payout Rate (₹)</label>
              <input
                type="number"
                className="input-warm"
                value={profile?.hourlyRate || 200}
                onChange={(e) => setProfile({ ...profile, hourlyRate: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase text-forest-700 mb-1.5">Languages Spoken</label>
              <input
                className="input-warm"
                value={profile?.languages || ''}
                onChange={(e) => setProfile({ ...profile, languages: e.target.value })}
                placeholder="Marathi, Hindi, English"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-forest-700 mb-1.5">Availability</label>
              <input
                className="input-warm"
                value={profile?.availability || ''}
                onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
                placeholder="Mon - Sat, 9 AM - 6 PM"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-forest-700 mb-1.5">Skills (comma separated)</label>
            <input
              className="input-warm"
              value={profile?.skills || ''}
              onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
              placeholder="Reading, Conversation, Walking, Birthday Celebrations"
            />
          </div>

          <button type="submit" disabled={saving} className="btn-primary">
            <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      )}
    </CompanionLayout>
  );
}
