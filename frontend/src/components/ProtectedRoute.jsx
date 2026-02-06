import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roles }) {
  const adminToken = localStorage.getItem("token");
  const customerToken = localStorage.getItem("customerToken");

  const adminUser = localStorage.getItem("user");
  const customerUser = localStorage.getItem("customerUser");

  const token = adminToken || customerToken;

  let user = null;
  try {
    user = adminUser
      ? JSON.parse(adminUser)
      : customerUser
      ? JSON.parse(customerUser)
      : null;
  } catch {
    return <Navigate to="/" replace />;
  }

  if (!token || !user || !user.role) {
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
