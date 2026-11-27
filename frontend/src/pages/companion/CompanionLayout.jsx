import React from 'react';
import { LayoutDashboard, UserCheck, Inbox, CalendarClock, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const NAV_ITEMS = [
  { to: '/companion/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/companion/profile', label: 'My Profile', icon: UserCheck },
  { to: '/companion/requests', label: 'Booking Requests', icon: Inbox },
  { to: '/companion/schedule', label: 'Schedule & Visits', icon: CalendarClock },
  { to: '/companion/completed', label: 'Completed & Earnings', icon: CheckCircle2 },
];

export default function CompanionLayout({ title, subtitle, children }) {
  return (
    <DashboardLayout title={title} subtitle={subtitle} navItems={NAV_ITEMS}>
      {children}
    </DashboardLayout>
  );
}
