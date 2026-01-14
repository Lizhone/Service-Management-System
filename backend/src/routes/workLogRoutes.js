import express from "express";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  createWorkLog,
  startWorkLog,
  completeWorkLog,
  getWorkLogsByJobCard,
} from "../controllers/workLogController.js";

const router = express.Router();

/**
 * Get all work logs for a job card
 * Accessible by ADMIN, ADVISOR, TECHNICIAN
 */
router.get(
  "/job-cards/:id/work-log",
  authenticate,
  authorizeRoles("ADMIN", "ADVISOR", "TECHNICIAN"),
  getWorkLogsByJobCard
);

/**
 * Create a new work task for a job card
 * Only technicians can create tasks
 */
router.post(
  "/job-cards/:id/work-log",
  authenticate,
  authorizeRoles("TECHNICIAN"),
  createWorkLog
);

/**
 * Start a work task
 */
router.post(
  "/work-log/:id/start",
  authenticate,
  authorizeRoles("TECHNICIAN"),
  startWorkLog
);

/**
 * Complete a work task
 */
router.post(
  "/work-log/:id/complete",
  authenticate,
  authorizeRoles("TECHNICIAN"),
  completeWorkLog
);

export default router;
