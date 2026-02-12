import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  createServiceBooking,
  getMyServiceBookings,
  getAllServiceBookings,
} from "../controllers/serviceBookingController.js";

const router = express.Router();

router.use(authenticate);

/* ==============================
   CUSTOMER
============================== */
router.get("/me/service-bookings", getMyServiceBookings);
router.post("/me/service-bookings", createServiceBooking);

/* ==============================
   ADMIN
============================== */
router.get("/", getAllServiceBookings);

export default router;
