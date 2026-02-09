import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  getPendingBookingsForAdvisor,
  validateServiceBooking,
} from "../controllers/advisorServiceBookingController.js";

const router = express.Router();

router.use(authenticate);

// Advisor sees only pending bookings
router.get("/service-bookings", getPendingBookingsForAdvisor);

// Advisor validates booking
router.patch("/service-bookings/:id/validate", validateServiceBooking);

export default router;
