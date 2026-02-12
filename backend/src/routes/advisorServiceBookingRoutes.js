import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  getAdvisorBookings,
  validateServiceBooking,
  rejectServiceBooking,
  getAdvisorBookingHistory,
} from "../controllers/advisorServiceBookingController.js";

const router = express.Router();

router.use(authenticate);

/* ================================
   ADVISOR: PENDING BOOKINGS
================================ */
router.get("/service-bookings/pending", getAdvisorBookings);

/* ================================
   ADVISOR: VALIDATE BOOKING
================================ */
router.patch(
  "/service-bookings/:id/validate",
  validateServiceBooking
);

/* ================================
   ADVISOR: REJECT BOOKING ✅ FIXED
================================ */
router.patch(
  "/service-bookings/:id/reject",
  rejectServiceBooking
);

/* ================================
   ADVISOR: BOOKING HISTORY
================================ */
router.get(
  "/service-bookings/history",
  getAdvisorBookingHistory
);

export default router;
