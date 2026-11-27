import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { HeartHandshake, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ title, subtitle, navItems, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleBadge = {
    FAMILY: 'Family Portal',
    COMPANION: 'Companion Portal',
    ADMIN: 'Admin Console',
  }[user?.role] || 'Portal';

  const SidebarContent = () => (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="flex items-center justify-between px-4 py-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-600 text-mint-100">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <span className="font-display text-lg font-bold text-forest-900">CareNest</span>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-forest-500">
                {roleBadge}
              </span>
            </div>
          </Link>
        </div>

        <nav className="mt-2 space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-forest-600 text-white shadow-soft'
                      : 'text-forest-800/80 hover:bg-mint-50 hover:text-forest-900'
                  }`
                }
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
                <ChevronRight className="h-3.5 w-3.5 opacity-40" />
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-cream-200 p-4">
        <div className="flex items-center gap-3 rounded-2xl bg-cream-100 p-3">
          <img
            src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'U')}&background=1B4332&color=fff`}
            alt={user?.fullName}
            className="h-10 w-10 rounded-full object-cover border border-mint-200"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-forest-900">{user?.fullName}</p>
            <p className="truncate text-xs text-forest-500">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-cream-300 px-4 py-2.5 text-sm font-medium text-forest-700 transition hover:bg-red-50 hover:text-red-700 hover:border-red-200"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream-100 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 border-r border-cream-300/80 bg-white">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-forest-900/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 max-w-full bg-white h-full shadow-elevated z-10">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-5 rounded-full p-2 text-forest-600 hover:bg-cream-200"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 border-b border-cream-300/70 bg-cream-100/90 backdrop-blur-md px-4 py-4 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden rounded-xl border border-cream-300 bg-white p-2 text-forest-800"
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-forest-900">{title}</h1>
                {subtitle && <p className="text-xs sm:text-sm text-forest-600">{subtitle}</p>}
              </div>
            </div>
            <Link to="/" className="hidden sm:inline-flex text-xs font-semibold text-forest-600 hover:text-forest-800">
              ← Back to Public Site
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
