import React from 'react';
import {
  LayoutDashboard, Users, Search, CalendarPlus, CalendarDays, PartyPopper, Settings
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const NAV_ITEMS = [
  { to: '/family/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/family/elders', label: 'Elder Profiles', icon: Users },
  { to: '/family/companions', label: 'Find Companions', icon: Search },
  { to: '/family/book', label: 'Book a Service', icon: CalendarPlus },
  { to: '/family/bookings', label: 'My Bookings', icon: CalendarDays },
  { to: '/family/occasions', label: 'Special Occasions', icon: PartyPopper },
  { to: '/family/settings', label: 'Profile & Settings', icon: Settings },
];

export default function FamilyLayout({ title, subtitle, children }) {
  return (
    <DashboardLayout title={title} subtitle={subtitle} navItems={NAV_ITEMS}>
      {children}
    </DashboardLayout>
  );
}
