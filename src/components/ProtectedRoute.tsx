
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  // Check if this is a first-time user that needs to be directed to the profile page
  useEffect(() => {
    if (user && location.pathname !== '/profile') {
      const profileCompleted = localStorage.getItem('profileCompleted') === 'true';
      const profileRedirected = localStorage.getItem('profileRedirected') === 'true';
      
      // If profile not completed and we haven't redirected yet
      if (!profileCompleted && !profileRedirected && location.pathname !== '/profile') {
        localStorage.setItem('profileRedirected', 'true');
      }
    }
  }, [user, location.pathname]);

  if (isLoading) {
    // You could show a loading spinner here
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect them to the login page, but save the current location they were
    // trying to go to so we can send them there after logging in
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
