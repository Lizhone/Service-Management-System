import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute Component
 * 
 * Protects routes by requiring:
 * 1. Valid JWT token in localStorage
 * 2. User object with role information
 * 3. User role must be in the allowed roles list
 * 
 * Usage:
 * <ProtectedRoute roles={["ADMIN"]}>
 *   <SomeComponent />
 * </ProtectedRoute>
 * 
 * Redirect behavior:
 * - No token: redirects to "/"
 * - No role: redirects to "/"
 * - Role not allowed: redirects to "/"
 * - All checks pass: renders children
 */
export default function ProtectedRoute({ children, roles }) {
  // Retrieve user data from localStorage
  const token = localStorage.getItem("token");
  const userJson = localStorage.getItem("user");
  
  let user = null;
  try {
    user = userJson ? JSON.parse(userJson) : null;
  } catch (e) {
    console.error("Failed to parse user object:", e);
    return <Navigate to="/" replace />;
  }

  /**
   * Check 1: User must be logged in (have a valid token)
   */
  if (!token || !user) {
    console.warn("ProtectedRoute: No token or user found - redirecting to /");
    return <Navigate to="/" replace />;
  }

  /**
   * Check 2: User must have a role defined
   * This is a safety check to prevent undefined role access
   */
  if (!user.role) {
    console.warn("ProtectedRoute: User has no role defined - redirecting to /");
    return <Navigate to="/" replace />;
  }

  /**
   * Check 3: User role must be in the allowed list
   * Supports case-sensitive role matching (e.g., "ADMIN", "TECHNICIAN", etc.)
   */
  if (roles && !roles.includes(user.role)) {
    console.warn(
      `ProtectedRoute: User role "${user.role}" not in allowed roles [${roles.join(", ")}] - redirecting to /`
    );
    return <Navigate to="/" replace />;
  }

  /**
   * All checks passed - render the protected component
   */
  return children;
}
