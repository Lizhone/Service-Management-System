import express from "express";
import { requireCustomer } from "../middleware/customerAuth.js";
import {
  createServiceBooking,
  getMyServiceBookings,
} from "../controllers/serviceBookingController.js";

const router = express.Router();

router.post("/", requireCustomer, createServiceBooking);
router.get("/me", requireCustomer, getMyServiceBookings);

export default router;
