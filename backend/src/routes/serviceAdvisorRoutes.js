import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  getAdvisorBookings,
  validateBookingByAdvisor,
} from "../controllers/serviceAdvisorController.js";

const router = express.Router();

router.use(authenticate);

// 🔐 Only Service Advisor
router.get("/bookings", getAdvisorBookings);
router.patch("/bookings/:id/validate", validateBookingByAdvisor);

export default router;
