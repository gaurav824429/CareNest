import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import ServicesPage from './pages/public/ServicesPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import ContactPage from './pages/public/ContactPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Family Pages
import FamilyDashboard from './pages/family/FamilyDashboard';
import ElderProfilesPage from './pages/family/ElderProfilesPage';
import FindCompanionsPage from './pages/family/FindCompanionsPage';
import CompanionDetailsPage from './pages/family/CompanionDetailsPage';
import BookServicePage from './pages/family/BookServicePage';
import MyBookingsPage from './pages/family/MyBookingsPage';
import SpecialOccasionsPage from './pages/family/SpecialOccasionsPage';
import FamilyProfilePage from './pages/family/FamilyProfilePage';

// Companion Pages
import CompanionDashboard from './pages/companion/CompanionDashboard';
import CompanionProfilePage from './pages/companion/CompanionProfilePage';
import BookingRequestsPage from './pages/companion/BookingRequestsPage';
import CompanionSchedulePage from './pages/companion/CompanionSchedulePage';
import CompletedVisitsPage from './pages/companion/CompletedVisitsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminCompanionsPage from './pages/admin/AdminCompanionsPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Family */}
          <Route path="/family/dashboard" element={<ProtectedRoute allowedRoles={['FAMILY']}><FamilyDashboard /></ProtectedRoute>} />
          <Route path="/family/elders" element={<ProtectedRoute allowedRoles={['FAMILY']}><ElderProfilesPage /></ProtectedRoute>} />
          <Route path="/family/companions" element={<ProtectedRoute allowedRoles={['FAMILY']}><FindCompanionsPage /></ProtectedRoute>} />
          <Route path="/family/companions/:id" element={<ProtectedRoute allowedRoles={['FAMILY']}><CompanionDetailsPage /></ProtectedRoute>} />
          <Route path="/family/book" element={<ProtectedRoute allowedRoles={['FAMILY']}><BookServicePage /></ProtectedRoute>} />
          <Route path="/family/bookings" element={<ProtectedRoute allowedRoles={['FAMILY']}><MyBookingsPage /></ProtectedRoute>} />
          <Route path="/family/occasions" element={<ProtectedRoute allowedRoles={['FAMILY']}><SpecialOccasionsPage /></ProtectedRoute>} />
          <Route path="/family/settings" element={<ProtectedRoute allowedRoles={['FAMILY']}><FamilyProfilePage /></ProtectedRoute>} />

          {/* Companion */}
          <Route path="/companion/dashboard" element={<ProtectedRoute allowedRoles={['COMPANION']}><CompanionDashboard /></ProtectedRoute>} />
          <Route path="/companion/profile" element={<ProtectedRoute allowedRoles={['COMPANION']}><CompanionProfilePage /></ProtectedRoute>} />
          <Route path="/companion/requests" element={<ProtectedRoute allowedRoles={['COMPANION']}><BookingRequestsPage /></ProtectedRoute>} />
          <Route path="/companion/schedule" element={<ProtectedRoute allowedRoles={['COMPANION']}><CompanionSchedulePage /></ProtectedRoute>} />
          <Route path="/companion/completed" element={<ProtectedRoute allowedRoles={['COMPANION']}><CompletedVisitsPage /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUsersPage /></ProtectedRoute>} />
          <Route path="/admin/companions" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminCompanionsPage /></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminBookingsPage /></ProtectedRoute>} />
          <Route path="/admin/services" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminServicesPage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
