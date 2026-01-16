import jwt from "jsonwebtoken";

/**
 * Authenticate JWT token from Authorization header
 * Header format: Authorization: Bearer <token>
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Check header presence & format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  // 2. Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    // 3. Validate expected payload
    if (!decoded?.id || !decoded?.role) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    // 4. Attach user to request
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

/**
 * Role-based authorization middleware
 * Usage: authorizeRoles("TECHNICIAN", "MANAGER")
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Admin bypass
    if (req.user.role === "ADMIN") {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
};
