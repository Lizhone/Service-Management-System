import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * RoleBasedRoute Component
 * Protects routes based on user role
 * 
 * Usage:
 * <RoleBasedRoute allowedRoles={["ADMIN", "SERVICE_ADVISOR"]}>
 *   <YourComponent />
 * </RoleBasedRoute>
 */
export default function RoleBasedRoute({ children, allowedRoles = [] }) {
  const { user } = useAuth();

  // Not logged in - redirect to home
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // User role not in allowed list - redirect to home
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // User has correct role - render component
  return children;
}
