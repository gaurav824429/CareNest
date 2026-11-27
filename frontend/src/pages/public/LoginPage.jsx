import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartHandshake, ArrowRight, Sparkles } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../api/client';

const DEMO_ACCOUNTS = [
  { label: 'Family Demo', email: 'ananya@carenest.com', pass: 'Family@123', role: 'Family Member' },
  { label: 'Companion Demo', email: 'meera@carenest.com', pass: 'Companion@123', role: 'Companion' },
  { label: 'Admin Demo', email: 'admin@carenest.com', pass: 'Admin@123', role: 'Admin' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const redirectByRole = (role) => {
    if (role === 'ADMIN') navigate('/admin/dashboard');
    else if (role === 'COMPANION') navigate('/companion/dashboard');
    else navigate('/family/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      redirectByRole(user.role);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demo) => {
    setEmail(demo.email);
    setPassword(demo.pass);
    setError('');
    setLoading(true);
    try {
      const user = await login(demo.email, demo.pass);
      redirectByRole(user.role);
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
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-600 text-mint-100 shadow-soft">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold text-forest-900">Welcome Back</h1>
            <p className="mt-1.5 text-sm text-forest-700/80">Sign in to your CareNest account</p>
          </div>

          <form onSubmit={handleSubmit} className="card-warm space-y-5">
            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-100 p-3.5 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-warm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-warm"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5">
              {loading ? 'Signing In...' : 'Sign In'} <ArrowRight className="h-4 w-4" />
            </button>

            <p className="text-center text-sm text-forest-700">
              New to CareNest?{' '}
              <Link to="/register" className="font-semibold text-forest-600 hover:underline">
                Create an account
              </Link>
            </p>
          </form>

          {/* Instant Demo Access */}
          <div className="rounded-3xl border border-mint-200 bg-mint-50/70 p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-forest-700">
              <Sparkles className="h-3.5 w-3.5 text-peach-400" />
              Instant Demo Logins
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {DEMO_ACCOUNTS.map((demo) => (
                <button
                  key={demo.email}
                  type="button"
                  disabled={loading}
                  onClick={() => handleDemoLogin(demo)}
                  className="rounded-2xl border border-mint-200 bg-white px-3 py-2.5 text-left transition hover:border-forest-400 hover:shadow-soft"
                >
                  <p className="text-xs font-bold text-forest-800">{demo.label}</p>
                  <p className="text-[11px] text-forest-600">{demo.role}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
