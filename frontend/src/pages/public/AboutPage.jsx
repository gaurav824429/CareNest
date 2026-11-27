import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Globe2, Sparkles, ArrowRight } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-100">
      <Navbar />

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-forest-500">Our Story</span>
              <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold text-forest-900 leading-tight">
                Born From a Simple Wish: No Parent Should Feel Alone.
              </h1>
              <p className="mt-5 text-base leading-relaxed text-forest-700/90">
                Millions of working professionals live cities or continents away from their aging parents. While video calls help, nothing replaces sharing a cup of tea, taking a morning walk, or celebrating a birthday in person.
              </p>
              <p className="mt-4 text-base leading-relaxed text-forest-700/90">
                CareNest bridges that distance with verified, empathetic companions who bring warmth, conversation, and everyday assistance—giving elders joyful days and families genuine peace of mind.
              </p>
              <div className="mt-8">
                <Link to="/register" className="btn-primary">
                  Join CareNest Today <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="overflow-hidden rounded-[2rem] border-4 border-white shadow-elevated">
              <img
                src="https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=900&q=85"
                alt="Elderly couple smiling together"
                className="h-[420px] w-full object-cover"
              />
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: Heart,
                title: 'Companionship, Not Clinical Care',
                desc: 'We focus purely on emotional well-being, social connection, hobbies, errands, and joyful celebrations.',
              },
              {
                icon: ShieldCheck,
                title: 'Carefully Vetted Companions',
                desc: 'Every companion profile is reviewed and approved by our admin team before they can accept family visits.',
              },
              {
                icon: Globe2,
                title: 'Built for Distant Families',
                desc: 'Manage parent profiles, book visits across time zones, and read heartwarming visit notes anytime.',
              },
            ].map((val) => (
              <div key={val.title} className="card-warm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint-100 text-forest-700">
                  <val.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-forest-900">{val.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-forest-700/80">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
