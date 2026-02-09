import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  createServiceBooking,
  getMyServiceBookings,
  getAllServiceBookings,
  approveServiceBooking,
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
router.put("/:id/approve", approveServiceBooking);


// ================================
// ADMIN: approve service booking
// ================================
router.put("/:id/approve", approveServiceBooking);



export default router;
