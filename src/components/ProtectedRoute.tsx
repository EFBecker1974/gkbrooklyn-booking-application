
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to auth page if not authenticated
      navigate("/auth", { state: { returnUrl: location.pathname } });
    }
  }, [user, loading, navigate, location.pathname]);

  // Show nothing while checking authentication status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  // Only render children if authenticated
  return user ? <>{children}</> : null;
};
