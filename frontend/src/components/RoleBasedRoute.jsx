import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function RoleBasedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();

  // 🔥 DO NOTHING while auth is loading
  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login/customer" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
