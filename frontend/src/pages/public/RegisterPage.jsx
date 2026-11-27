import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartHandshake, Users, UserCheck, ArrowRight } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../api/client';

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    role: 'FAMILY',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const user = await register(form);
      if (user.role === 'COMPANION') navigate('/companion/dashboard');
      else navigate('/family/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-100">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg space-y-6">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-600 text-mint-100 shadow-soft">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold text-forest-900">Join CareNest</h1>
            <p className="mt-1.5 text-sm text-forest-700/80">Choose how you would like to connect</p>
          </div>

          <form onSubmit={handleSubmit} className="card-warm space-y-5">
            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-100 p-3.5 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {/* Role selector */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'FAMILY', label: 'Family Member', sub: 'Book visits for parents', icon: Users },
                { value: 'COMPANION', label: 'Companion', sub: 'Offer warm companionship', icon: UserCheck },
              ].map((opt) => {
                const Icon = opt.icon;
                const active = form.role === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: opt.value })}
                    className={`rounded-2xl border p-4 text-left transition ${
                      active
                        ? 'border-forest-600 bg-mint-50 ring-2 ring-forest-600/20'
                        : 'border-cream-300 bg-cream-50 hover:border-forest-300'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${active ? 'text-forest-600' : 'text-forest-500'}`} />
                    <p className="mt-2 text-sm font-bold text-forest-900">{opt.label}</p>
                    <p className="text-xs text-forest-600">{opt.sub}</p>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Aarav Verma"
                  className="input-warm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-700 mb-1.5">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Pune"
                  className="input-warm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="input-warm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-700 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98220 12345"
                  className="input-warm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-700 mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="At least 6 characters"
                className="input-warm"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5">
              {loading ? 'Creating Account...' : 'Create CareNest Account'} <ArrowRight className="h-4 w-4" />
            </button>

            <p className="text-center text-sm text-forest-700">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-forest-600 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
