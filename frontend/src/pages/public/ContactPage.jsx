import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api, { getErrorMessage } from '../../api/client';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in your name, email, and message.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post('/public/contact', form);
      setSuccess(res.data.message);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-100">
      <Navbar />

      <section className="py-16 lg:py-24 flex-1">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-forest-500">Contact Us</span>
              <h1 className="font-display text-4xl font-bold text-forest-900">We’re Here to Help Your Family</h1>
              <p className="text-forest-700/85 leading-relaxed">
                Have questions about companion vetting, special occasion planning, or onboarding your parents? Reach out and our care coordinators will respond promptly.
              </p>

              <div className="space-y-4 pt-4">
                {[
                  { icon: Mail, label: 'Email', value: 'hello@carenest.com' },
                  { icon: Phone, label: 'Phone', value: '+91 20 6700 2200' },
                  { icon: MapPin, label: 'City', value: 'Pune' },
                ].map((c) => (
                  <div key={c.label} className="flex items-center gap-4 rounded-2xl bg-white p-4 border border-cream-300/80">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint-100 text-forest-700">
                      <c.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-forest-500">{c.label}</p>
                      <p className="text-sm font-semibold text-forest-900">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="card-warm space-y-5">
                <h2 className="font-display text-2xl font-bold text-forest-900">Send a Message</h2>

                {success && (
                  <div className="flex items-center gap-2.5 rounded-2xl bg-mint-100 p-4 text-sm font-medium text-forest-800">
                    <CheckCircle2 className="h-5 w-5 text-forest-600 shrink-0" />
                    {success}
                  </div>
                )}
                {error && (
                  <div className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-forest-700 mb-1.5">Your Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Ananya Sharma"
                      className="input-warm"
                      required
                    />
                  </div>
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
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-forest-700 mb-1.5">Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Question about companionship visits"
                    className="input-warm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-forest-700 mb-1.5">Message</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your parents and how we can help..."
                    className="input-warm"
                    required
                  />
                </div>

                <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
                  {submitting ? 'Sending...' : 'Send Message'} <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
