
    import React from 'react';
    import { Navigate, useLocation } from 'react-router-dom';
    import { useAuth } from '@/hooks/useAuth';
    import { Loader2 } from 'lucide-react';

    const ProtectedRoute = ({ children, adminOnly = false }) => {
      const { isAuthenticated, isAdmin, loading } = useAuth();
      const location = useLocation();

      if (loading) {
        return (
          <div className="flex items-center justify-center h-screen bg-gradient-to-br from-background to-secondary">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        );
      }

      if (!isAuthenticated) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
      }

      if (adminOnly && !isAdmin) {
        return <Navigate to="/dashboard" replace />;
      }

      return children;
    };

    export default ProtectedRoute;
  