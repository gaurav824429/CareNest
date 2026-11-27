import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartHandshake, ShieldCheck, Star, CalendarHeart, Sparkles,
  ArrowRight, CheckCircle2, Sun, BookOpen, Footprints, ShoppingBag, PartyPopper, Users, CalendarDays
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../api/client';
import { formatINR } from '../../utils/formatters';

const ICON_MAP = {
  HeartHandshake,
  Sun,
  Footprints,
  BookOpen,
  ShoppingBag,
  PartyPopper,
  CalendarDays,
};

export default function LandingPage() {
  const [services, setServices] = useState([]);
  const [companions, setCompanions] = useState([]);

  useEffect(() => {
    api.get('/services').then((r) => setServices(r.data)).catch(() => {});
    api.get('/companions').then((r) => setCompanions(r.data.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-cream-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6 space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-mint-200 bg-mint-50 px-4 py-1.5 text-xs font-semibold text-forest-700">
                <Sparkles className="h-3.5 w-3.5 text-peach-400" />
                Trusted Non-Medical Elder Companionship
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-forest-900">
                Care That <span className="text-forest-500 italic font-semibold">Connects</span> Hearts Across Every Mile.
              </h1>

              <p className="text-base sm:text-lg leading-relaxed text-forest-700/90 max-w-xl">
                When work or distance keeps you away, CareNest pairs your parents with vetted, warm-hearted companions for unhurried conversations, daily errands, park walks, and unforgettable birthday celebrations.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link to="/register" className="btn-primary px-7 py-3.5 text-base">
                  Find a Companion <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/how-it-works" className="btn-outline px-7 py-3.5 text-base">
                  How CareNest Works
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-forest-700">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-forest-500" /> Verified Companions
                </span>
                <span className="flex items-center gap-2">
                  <CalendarHeart className="h-4 w-4 text-peach-400" /> Real-Time Visit Updates
                </span>
                <span className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-peach-300 fill-peach-300" /> 4.9/5 Family Rating
                </span>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative">
                <div className="overflow-hidden rounded-[2rem] border-4 border-white shadow-elevated bg-mint-100">
                  <img
                    src="https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&w=1000&q=85"
                    alt="Warm companionship between an elder and a caring companion"
                    className="h-[420px] sm:h-[480px] w-full object-cover"
                  />
                </div>

                {/* Floating Peace-of-Mind Card */}
                <div className="absolute -bottom-6 left-4 sm:left-8 right-4 sm:right-auto sm:w-80 rounded-3xl border border-cream-200 bg-white/95 backdrop-blur p-4 shadow-card">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-peach-100 text-peach-500">
                      <HeartHandshake className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-forest-500">Latest Visit Update</p>
                      <p className="text-sm font-semibold text-forest-900">“Mom & Meera shared chai & Malgudi Days.”</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="bg-white py-20 border-y border-cream-300/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-widest text-forest-500">Why Families Choose CareNest</span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-forest-900">
              Built for Joy, Dignity & Peace of Mind
            </h2>
            <p className="mt-3 text-forest-700/80">
              We are not a clinic or hospital service. We are your extended family on the ground—dedicated to keeping loneliness away.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: Users,
                bg: 'bg-mint-100 text-forest-700',
                title: 'Human Connection First',
                desc: 'Companions matched by language, hobbies, and warmth—so visits feel like catching up with a cherished friend.',
              },
              {
                icon: PartyPopper,
                bg: 'bg-peach-100 text-peach-500',
                title: 'Never Miss a Milestone',
                desc: 'From 75th birthdays to quiet Sunday evenings, schedule special occasion visits with flowers, music, and video-call help.',
              },
              {
                icon: ShieldCheck,
                bg: 'bg-forest-50 text-forest-600',
                title: 'Heartfelt Visit Notes',
                desc: 'Receive thoughtful post-visit summaries and mood updates from your companion right in your family dashboard.',
              },
            ].map((item) => (
              <div key={item.title} className="card-warm hover:-translate-y-1 hover:shadow-card">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.bg}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-forest-900">{item.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-forest-700/80">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-forest-500">Thoughtful Services</span>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-forest-900">
                Support Tailored to Everyday Life
              </h2>
            </div>
            <Link to="/services" className="btn-outline self-start sm:self-auto">
              Explore All Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((svc) => {
              const Icon = ICON_MAP[svc.iconName] || HeartHandshake;
              return (
                <div key={svc.id} className="card-warm flex flex-col justify-between hover:border-mint-200 hover:shadow-card">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${svc.specialOccasion ? 'bg-peach-100 text-peach-500' : 'bg-mint-100 text-forest-700'}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-right">
                        <span className="text-base font-bold text-forest-700">{formatINR(svc.effectivePrice ?? svc.regularPrice)}</span>
                        {svc.promotionalPricingEnabled && (
                          <span className="block text-[10px] font-semibold uppercase tracking-wider text-peach-500">
                            Introductory Launch Price
                          </span>
                        )}
                      </div>
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold text-forest-900">{svc.name}</h3>
                    {svc.durationLabel && (
                      <p className="mt-0.5 text-xs font-semibold text-forest-500">{svc.durationLabel}</p>
                    )}
                    <p className="mt-2 text-sm leading-relaxed text-forest-700/80">{svc.description}</p>
                  </div>
                  <Link
                    to="/register"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-forest-600 hover:text-forest-800"
                  >
                    Book this service <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Companions */}
      {companions.length > 0 && (
        <section className="bg-forest-50/70 py-20 border-y border-cream-300/70">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-semibold uppercase tracking-widest text-forest-500">Meet Our Companions</span>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-forest-900">
                Warm, Vetted People Your Parents Will Adore
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {companions.map((comp) => (
                <div key={comp.id} className="card-warm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4">
                      <img
                        src={comp.user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(comp.user?.fullName || 'C')}&background=1B4332&color=fff`}
                        alt={comp.user?.fullName}
                        className="h-16 w-16 rounded-2xl object-cover border-2 border-mint-100"
                      />
                      <div>
                        <h3 className="font-display text-lg font-bold text-forest-900">{comp.user?.fullName}</h3>
                        <p className="text-xs font-medium text-forest-600">{comp.city} • {comp.experienceYears} yrs exp</p>
                        <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-peach-500">
                          <Star className="h-3.5 w-3.5 fill-peach-300 text-peach-300" />
                          {comp.rating} ({comp.totalReviews} reviews)
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-sm font-medium text-forest-800">{comp.headline}</p>
                    <p className="mt-2 text-xs leading-relaxed text-forest-700/80 line-clamp-3">{comp.bio}</p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-cream-200 flex items-center justify-between">
                    <span className="text-xs font-semibold text-forest-700">Verified Pune Companion</span>
                    <Link to="/login" className="text-xs font-semibold text-forest-600 hover:text-forest-900">
                      Sign in to book →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2.5rem] bg-forest-700 px-8 py-14 text-center text-white shadow-elevated sm:px-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Give Your Parents Company Worth Smiling About
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-mint-100/90">
              Create your family profile in two minutes, explore trusted companions in your parents’ city, and schedule your first visit today.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/register" className="btn-peach px-8 py-3.5 text-base">
                Create Family Account
              </Link>
              <Link to="/register" className="rounded-full border border-mint-200/40 px-8 py-3.5 text-base font-semibold text-white hover:bg-forest-600 transition">
                Apply as a Companion
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-6 text-xs text-mint-200/80">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> No long-term lock-in</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Demo accounts available</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
