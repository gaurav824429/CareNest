import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, MapPin, Languages, Heart, X } from 'lucide-react';
import FamilyLayout from './FamilyLayout';
import ConfirmDialog from '../../components/ConfirmDialog';
import api, { getErrorMessage } from '../../api/client';

const EMPTY_FORM = {
  fullName: '',
  age: '',
  gender: 'Female',
  relationship: 'Mother',
  city: '',
  address: '',
  languages: '',
  hobbies: '',
  mobilityNotes: '',
  dietaryPreferences: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
};

export default function ElderProfilesPage() {
  const [elders, setElders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadElders = () => {
    setLoading(true);
    api.get('/family/elders')
      .then((res) => setElders(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadElders();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (elder) => {
    setEditingId(elder.id);
    setForm({
      fullName: elder.fullName || '',
      age: elder.age || '',
      gender: elder.gender || 'Female',
      relationship: elder.relationship || 'Mother',
      city: elder.city || '',
      address: elder.address || '',
      languages: elder.languages || '',
      hobbies: elder.hobbies || '',
      mobilityNotes: elder.mobilityNotes || '',
      dietaryPreferences: elder.dietaryPreferences || '',
      emergencyContactName: elder.emergencyContactName || '',
      emergencyContactPhone: elder.emergencyContactPhone || '',
    });
    setError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = { ...form, age: form.age ? Number(form.age) : null };
      if (editingId) {
        await api.put(`/family/elders/${editingId}`, payload);
      } else {
        await api.post('/family/elders', payload);
      }
      setModalOpen(false);
      loadElders();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/family/elders/${deleteTarget.id}`);
      setDeleteTarget(null);
      loadElders();
    } catch (err) {
      alert(getErrorMessage(err));
      setDeleteTarget(null);
    }
  };

  return (
    <FamilyLayout
      title="Elder Profiles"
      subtitle="Share your parents’ interests, languages, and comfort notes so companions can connect meaningfully."
    >
      <div className="flex justify-end mb-6">
        <button onClick={openAdd} className="btn-primary">
          <Plus className="h-4 w-4" /> Add Elder Profile
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[1, 2].map((i) => <div key={i} className="h-56 rounded-3xl bg-white animate-pulse" />)}
        </div>
      ) : elders.length === 0 ? (
        <div className="card-warm text-center py-14">
          <Heart className="mx-auto h-10 w-10 text-peach-400" />
          <h3 className="mt-4 font-display text-xl font-bold text-forest-900">No Elder Profiles Yet</h3>
          <p className="mt-2 text-sm text-forest-600 max-w-md mx-auto">
            Add your mother, father, or grandparent’s profile so companions know their favorite hobbies and spoken languages.
          </p>
          <button onClick={openAdd} className="btn-primary mt-6">
            <Plus className="h-4 w-4" /> Add First Profile
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {elders.map((elder) => (
            <div key={elder.id} className="card-warm flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={elder.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(elder.fullName)}&background=D8F3DC&color=1B4332`}
                      alt={elder.fullName}
                      className="h-16 w-16 rounded-2xl object-cover border-2 border-mint-100"
                    />
                    <div>
                      <h3 className="font-display text-xl font-bold text-forest-900">{elder.fullName}</h3>
                      <p className="text-xs font-semibold text-forest-600">
                        {elder.relationship} • {elder.age} yrs • {elder.gender}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-forest-500">
                        <MapPin className="h-3.5 w-3.5" /> {elder.city}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(elder)} className="rounded-xl p-2 text-forest-600 hover:bg-mint-50" title="Edit">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleteTarget(elder)} className="rounded-xl p-2 text-red-600 hover:bg-red-50" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-5 space-y-2.5 text-sm text-forest-700">
                  {elder.languages && (
                    <p className="flex items-center gap-2 text-xs">
                      <Languages className="h-4 w-4 text-forest-500 shrink-0" />
                      <span><strong>Languages:</strong> {elder.languages}</span>
                    </p>
                  )}
                  {elder.hobbies && (
                    <p className="text-xs"><strong>Hobbies & Joys:</strong> {elder.hobbies}</p>
                  )}
                  {elder.mobilityNotes && (
                    <p className="text-xs"><strong>Mobility Notes:</strong> {elder.mobilityNotes}</p>
                  )}
                  {elder.dietaryPreferences && (
                    <p className="text-xs"><strong>Dietary Preferences:</strong> {elder.dietaryPreferences}</p>
                  )}
                </div>
              </div>
              {elder.address && (
                <p className="mt-4 pt-3 border-t border-cream-200 text-xs text-forest-500">
                  Address: {elder.address}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-elevated">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-forest-900">
                {editingId ? 'Edit Elder Profile' : 'Add Elder Profile'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="rounded-full p-2 hover:bg-cream-200">
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && <div className="mb-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase text-forest-700 mb-1">Full Name *</label>
                  <input className="input-warm" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-forest-700 mb-1">Relationship</label>
                  <input className="input-warm" value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })} placeholder="Mother, Father, Grandmother" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-forest-700 mb-1">Age</label>
                  <input type="number" className="input-warm" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-forest-700 mb-1">Gender</label>
                  <select className="input-warm" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-forest-700 mb-1">City</label>
                  <input className="input-warm" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-forest-700 mb-1">Languages Spoken</label>
                  <input className="input-warm" value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} placeholder="English, Hindi" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-forest-700 mb-1">Home Address</label>
                <input className="input-warm" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-forest-700 mb-1">Hobbies & Favorite Activities</label>
                <textarea rows={2} className="input-warm" value={form.hobbies} onChange={(e) => setForm({ ...form, hobbies: e.target.value })} placeholder="Gardening, classical music, chess..." />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase text-forest-700 mb-1">Mobility Notes</label>
                  <input className="input-warm" value={form.mobilityNotes} onChange={(e) => setForm({ ...form, mobilityNotes: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-forest-700 mb-1">Dietary Preferences</label>
                  <input className="input-warm" value={form.dietaryPreferences} onChange={(e) => setForm({ ...form, dietaryPreferences: e.target.value })} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-outline">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        danger
        title="Remove Elder Profile"
        message={`Are you sure you want to remove ${deleteTarget?.fullName}'s profile?`}
        confirmLabel="Remove"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </FamilyLayout>
  );
}
