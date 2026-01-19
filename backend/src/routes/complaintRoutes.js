import express from "express";
import {
  getComplaints,
  createComplaint,
} from "../controllers/complaintController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================================
   COMPLAINT ROUTES
================================ */

// GET /:id/complaints
router.get(
  "/:id/complaints",
  authenticate,
  getComplaints
);

// POST /:id/complaints
router.post(
  "/:id/complaints",
  authenticate,
  authorizeRoles("ADMIN"),
  createComplaint
);

export default router;
