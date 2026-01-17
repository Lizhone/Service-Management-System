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
 * GET /api/job-cards/:id/work-log
 */
router.get(
  "/job-cards/:id/work-log",
  authenticate,
  authorizeRoles("ADMIN"),
  getWorkLogsByJobCard
);

/**
 * POST /api/job-cards/:id/work-log
 */
router.post(
  "/job-cards/:id/work-log",
  authenticate,
  authorizeRoles("ADMIN"),
  createWorkLog
);

/**
 * PATCH /api/work-log/:id/start
 */
router.patch(
  "/work-log/:id/start",
  authenticate,
  authorizeRoles("ADMIN"),
  startWorkLog
);

/**
 * PATCH /api/work-log/:id/complete
 */
router.patch(
  "/work-log/:id/complete",
  authenticate,
  authorizeRoles("ADMIN"),
  completeWorkLog
);

export default router;
