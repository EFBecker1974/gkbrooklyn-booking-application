
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";

type ProtectedRouteProps = {
  children: React.ReactNode;
  adminOnly?: boolean;
};

export const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirect to auth page if not authenticated
        navigate("/auth", { state: { returnUrl: location.pathname } });
      } else if (adminOnly && !isAdmin) {
        // Redirect to home page if not an admin trying to access admin-only route
        navigate("/");
      }
    }
  }, [user, loading, navigate, location.pathname, adminOnly, isAdmin]);

  // Show nothing while checking authentication status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  // Only render children if authenticated and has appropriate role
  if (!user) return null;
  if (adminOnly && !isAdmin) return null;
  
  return <>{children}</>;
};
