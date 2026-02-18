import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function RoleBasedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();

  // 🔥 Show minimal loader instead of null
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#01263B] text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login/customer" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
