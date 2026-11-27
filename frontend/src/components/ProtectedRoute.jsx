import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-mint-200 border-t-forest-600" />
          <p className="text-sm font-medium text-forest-600">Loading CareNest...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectMap = {
      FAMILY: '/family/dashboard',
      COMPANION: '/companion/dashboard',
      ADMIN: '/admin/dashboard',
    };
    return <Navigate to={redirectMap[user.role] || '/'} replace />;
  }

  return children;
}
