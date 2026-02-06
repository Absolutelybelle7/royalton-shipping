import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { navigate } from './Router';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}


export function ProtectedRoute({
  children,
  requireAuth = false,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if authentication is required
  if (requireAuth && !user) {
    navigate('/signin');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Redirecting to sign in...</p>
      </div>
    );
  }

  // Check if admin is required
  if (requireAdmin && (!user || !isAdmin)) {
    navigate('/signin');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Admin access required. Redirecting...</p>
      </div>
    );
  }

  return <>{children}</>;
}
