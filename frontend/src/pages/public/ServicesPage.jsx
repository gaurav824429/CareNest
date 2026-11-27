import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartHandshake, Sun, Footprints, BookOpen, ShoppingBag, PartyPopper, CalendarDays, ArrowRight, Check
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../api/client';
import { formatINR } from '../../utils/formatters';

const ICON_MAP = { HeartHandshake, Sun, Footprints, BookOpen, ShoppingBag, PartyPopper, CalendarDays };

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services')
      .then((res) => setServices(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-cream-100">
      <Navbar />

      <section className="py-16 lg:py-20 flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-widest text-forest-500">CareNest Services</span>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl font-bold text-forest-900">
              Thoughtful Companionship for Every Day & Every Milestone
            </h1>
            <p className="mt-4 text-forest-700/85">
              Flexible, non-medical support designed around your parents’ routines, hobbies, and favorite moments.
            </p>
          </div>

          {loading ? (
            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 rounded-3xl bg-white/60 animate-pulse border border-cream-200" />
              ))}
            </div>
          ) : (
            <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((svc) => {
                const Icon = ICON_MAP[svc.iconName] || HeartHandshake;
                return (
                  <div key={svc.id} className="card-warm flex flex-col justify-between hover:shadow-card">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${svc.specialOccasion ? 'bg-peach-100 text-peach-500' : 'bg-mint-100 text-forest-700'}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="text-right">
                          <div className="flex items-baseline justify-end gap-2">
                            <span className="rounded-full bg-cream-200 px-3.5 py-1 text-sm font-bold text-forest-900">
                              {formatINR(svc.effectivePrice ?? svc.regularPrice)}
                            </span>
                            {svc.promotionalPricingEnabled && svc.regularPrice > (svc.effectivePrice ?? svc.regularPrice) && (
                              <span className="text-xs text-forest-500 line-through">{formatINR(svc.regularPrice)}</span>
                            )}
                          </div>
                          {svc.promotionalPricingEnabled && (
                            <span className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-wider text-peach-500">
                              Introductory Launch Price
                            </span>
                          )}
                        </div>
                      </div>
                      <h3 className="mt-5 font-display text-xl font-bold text-forest-900">{svc.name}</h3>
                      {svc.durationLabel && (
                        <p className="mt-1 text-xs font-semibold text-forest-500">{svc.durationLabel}</p>
                      )}
                      <p className="mt-2.5 text-sm leading-relaxed text-forest-700/85">{svc.description}</p>
                      <ul className="mt-4 space-y-1.5 text-xs text-forest-600">
                        <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-forest-500" /> Verified local companion</li>
                        <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-forest-500" /> Visit summary shared with family</li>
                        {(svc.slug === 'grocery-errands' || svc.slug === 'special-occasions') && (
                          <li className="flex items-center gap-2 text-peach-600 font-medium"><Check className="h-3.5 w-3.5 text-peach-400" /> Material & travel costs charged separately</li>
                        )}
                      </ul>
                    </div>
                    <Link to="/login" className="btn-secondary mt-6 w-full justify-center">
                      Book {svc.name.split(' ')[0]} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
