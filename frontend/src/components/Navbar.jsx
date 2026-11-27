import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { HeartHandshake, Menu, X, ArrowRight, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardPath = user
    ? user.role === 'ADMIN'
      ? '/admin/dashboard'
      : user.role === 'COMPANION'
      ? '/companion/dashboard'
      : '/family/dashboard'
    : '/login';

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-forest-600 font-semibold' : 'text-forest-800/80 hover:text-forest-600'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-cream-300/70 bg-cream-100/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest-600 text-mint-100 shadow-soft transition-transform group-hover:scale-105">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <div>
            <span className="font-display text-xl font-bold tracking-tight text-forest-800">CareNest</span>
            <span className="hidden sm:block text-[10px] font-medium uppercase tracking-widest text-forest-500">
              Care That Connects Hearts
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
          <NavLink to="/services" className={navLinkClass}>Services</NavLink>
          <NavLink to="/how-it-works" className={navLinkClass}>How It Works</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to={dashboardPath} className="btn-primary py-2.5 px-5 text-sm">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full p-2.5 text-forest-700 hover:bg-cream-200 transition"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-semibold text-forest-700 hover:text-forest-900">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary py-2.5 px-5 text-sm">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden rounded-xl p-2 text-forest-800 hover:bg-cream-200"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-cream-300 bg-white px-4 py-5 space-y-4">
          <div className="flex flex-col space-y-3">
            <NavLink to="/" onClick={() => setOpen(false)} className={navLinkClass}>Home</NavLink>
            <NavLink to="/about" onClick={() => setOpen(false)} className={navLinkClass}>About CareNest</NavLink>
            <NavLink to="/services" onClick={() => setOpen(false)} className={navLinkClass}>Services</NavLink>
            <NavLink to="/how-it-works" onClick={() => setOpen(false)} className={navLinkClass}>How It Works</NavLink>
            <NavLink to="/contact" onClick={() => setOpen(false)} className={navLinkClass}>Contact</NavLink>
          </div>
          <div className="pt-3 border-t border-cream-200 flex flex-col gap-2">
            {user ? (
              <>
                <Link to={dashboardPath} onClick={() => setOpen(false)} className="btn-primary w-full justify-center">
                  Go to Dashboard
                </Link>
                <button onClick={handleLogout} className="btn-outline w-full justify-center">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="btn-outline w-full justify-center">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-primary w-full justify-center">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
