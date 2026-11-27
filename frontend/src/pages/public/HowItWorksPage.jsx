import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Search, CalendarCheck, MessageSquareHeart, ArrowRight } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function HowItWorksPage() {
  const familySteps = [
    { icon: UserPlus, step: '01', title: 'Create Your Family & Elder Profile', desc: 'Share your parent’s languages, hobbies, mobility preferences, and favorite daily routines.' },
    { icon: Search, step: '02', title: 'Discover Trusted Companions', desc: 'Filter approved companions by city, spoken languages, skills, and verified family ratings.' },
    { icon: CalendarCheck, step: '03', title: 'Book a Visit or Special Occasion', desc: 'Pick the date, time, duration, and service—from morning walks to 75th birthday celebrations.' },
    { icon: MessageSquareHeart, step: '04', title: 'Receive Warm Visit Updates', desc: 'Stay connected with mood notes and heartfelt visit summaries right on your dashboard.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cream-100">
      <Navbar />

      <section className="py-16 lg:py-24 flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-widest text-forest-500">Simple & Transparent</span>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl font-bold text-forest-900">
              How CareNest Works
            </h1>
            <p className="mt-4 text-forest-700/85">
              From creating your parent’s profile to receiving warm visit updates, everything is designed for effortless peace of mind.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {familySteps.map((s) => (
              <div key={s.step} className="card-warm relative">
                <span className="font-display text-4xl font-bold text-mint-200">{s.step}</span>
                <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-600 text-white">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-forest-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-forest-700/80">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-3xl bg-white border border-cream-300 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-soft">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest-900">Ready to schedule a first visit?</h2>
              <p className="mt-2 text-forest-700/80">Sign up as a family member or explore with our instant demo login.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary">Get Started <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/login" className="btn-outline">Try Demo Account</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
