import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function RoleBasedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();

  // ⏳ Wait for auth restore
  if (loading) {
    return null;
  }

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // ❌ Wrong role
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
