import React from 'react';
import { LayoutDashboard, Users, UserCheck, CalendarDays, Layers } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/companions', label: 'Companions', icon: UserCheck },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarDays },
  { to: '/admin/services', label: 'Service & Pricing Management', icon: Layers },
];

export default function AdminLayout({ title, subtitle, children }) {
  return (
    <DashboardLayout title={title} subtitle={subtitle} navItems={NAV_ITEMS}>
      {children}
    </DashboardLayout>
  );
}
