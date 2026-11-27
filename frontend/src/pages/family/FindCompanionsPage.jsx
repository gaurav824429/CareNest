import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Languages, ShieldCheck, ArrowRight } from 'lucide-react';
import FamilyLayout from './FamilyLayout';
import api from '../../api/client';
import { formatINR } from '../../utils/formatters';

export default function FindCompanionsPage() {
  const [companions, setCompanions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', city: '', language: '', maxRate: '' });

  const fetchCompanions = (params = filters) => {
    setLoading(true);
    const query = {};
    if (params.search) query.search = params.search;
    if (params.city) query.city = params.city;
    if (params.language) query.language = params.language;
    if (params.maxRate) query.maxRate = params.maxRate;

    api.get('/companions', { params: query })
      .then((res) => setCompanions(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCompanions();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCompanions(filters);
  };

  const handleReset = () => {
    const empty = { search: '', city: '', language: '', maxRate: '' };
    setFilters(empty);
    fetchCompanions(empty);
  };

  return (
    <FamilyLayout
      title="Find Trusted Companions"
      subtitle="Browse verified, warm-hearted companions matched by city, language, and shared interests."
    >
      {/* Search & Filter Bar */}
      <form onSubmit={handleSearch} className="card-warm mb-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-forest-500" />
            <input
              type="text"
              placeholder="Search name, skills, or hobbies..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="input-warm pl-10"
            />
          </div>
          <input
            type="text"
            placeholder="City (e.g., Pune)"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            className="input-warm"
          />
          <input
            type="text"
            placeholder="Language (e.g., Hindi)"
            value={filters.language}
            onChange={(e) => setFilters({ ...filters, language: e.target.value })}
            className="input-warm"
          />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1 justify-center py-3">
              Filter
            </button>
            <button type="button" onClick={handleReset} className="btn-outline px-4 py-3">
              Reset
            </button>
          </div>
        </div>
      </form>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-72 rounded-3xl bg-white animate-pulse" />)}
        </div>
      ) : companions.length === 0 ? (
        <div className="card-warm text-center py-14">
          <h3 className="font-display text-xl font-bold text-forest-900">No companions matched your filters</h3>
          <p className="mt-2 text-sm text-forest-600">Try clearing the city or language filter to see all available companions.</p>
          <button onClick={handleReset} className="btn-secondary mt-5">Show All Companions</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companions.map((comp) => (
            <div key={comp.id} className="card-warm flex flex-col justify-between hover:shadow-card">
              <div>
                <div className="flex items-start gap-4">
                  <img
                    src={comp.user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(comp.user?.fullName || 'C')}&background=1B4332&color=fff`}
                    alt={comp.user?.fullName}
                    className="h-16 w-16 rounded-2xl object-cover border-2 border-mint-100"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display text-lg font-bold text-forest-900 truncate">{comp.user?.fullName}</h3>
                      {comp.verified && <ShieldCheck className="h-4 w-4 text-forest-500 shrink-0" title="Verified" />}
                    </div>
                    <p className="text-xs text-forest-600 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3.5 w-3.5" /> {comp.city} • {comp.experienceYears} yrs exp
                    </p>
                    <p className="text-xs font-semibold text-peach-500 flex items-center gap-1 mt-1">
                      <Star className="h-3.5 w-3.5 fill-peach-300 text-peach-300" />
                      {comp.rating} ({comp.totalReviews} reviews)
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm font-semibold text-forest-800">{comp.headline}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-forest-700/80 line-clamp-3">{comp.bio}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {(comp.skills || '').split(',').slice(0, 3).map((skill) => (
                    <span key={skill} className="rounded-full bg-mint-50 border border-mint-200 px-2.5 py-0.5 text-[11px] font-medium text-forest-700">
                      {skill.trim()}
                    </span>
                  ))}
                </div>

                <p className="mt-3 flex items-center gap-1.5 text-xs text-forest-600">
                  <Languages className="h-3.5 w-3.5 text-forest-500" /> {comp.languages}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-cream-200 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-forest-600">Pune Launch Plans from {formatINR(399)}</span>
                <div className="flex gap-2">
                  <Link to={`/family/companions/${comp.id}`} className="btn-outline px-3.5 py-2 text-xs">
                    Profile
                  </Link>
                  <Link to={`/family/book?companionId=${comp.id}`} className="btn-primary px-4 py-2 text-xs">
                    Book <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </FamilyLayout>
  );
}
