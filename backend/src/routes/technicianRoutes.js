import express from "express";

import {
  getTechnicians,
  getAvailableBookings,
  getClaimedJobs,
  claimBooking,
  getBookingDetail,
  startWork,
  completeWork,
  uploadServiceMedia,
  deleteServiceMedia
} from "../controllers/technicianController.js";

import { serviceBookingUpload } from "../middleware/serviceBookingUpload.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================================
   TECHNICIAN LIST
========================================================= */
router.get("/", getTechnicians);

/* =========================================================
   AVAILABLE BOOKINGS (NEW ONLY)
========================================================= */
router.get("/available", getAvailableBookings);

/* =========================================================
   CLAIMED BOOKINGS
========================================================= */
router.get("/:technicianId/claimed", getClaimedJobs);

/* =========================================================
   CLAIM BOOKING
   NEW → CLAIMED
========================================================= */
router.put("/claim/:id/:technicianId", claimBooking);

/* =========================================================
   BOOKING DETAIL
========================================================= */
router.get("/booking/:bookingId", getBookingDetail);

/* =========================================================
   START WORK
   CLAIMED → IN_PROGRESS
========================================================= */
router.put("/start/:bookingId", startWork);

/* =========================================================
   COMPLETE WORK
   IN_PROGRESS → COMPLETED
========================================================= */
router.put("/complete/:bookingId", completeWork);

/* =========================================================
   UPLOAD SERVICE BOOKING MEDIA
   Allowed: IN_PROGRESS or COMPLETED
========================================================= */
router.post(
  "/service-bookings/:id/media",
  serviceBookingUpload.single("file"),
  uploadServiceMedia
);
router.delete(
  "/service-media/:mediaId",
  authenticate,
  authorizeRoles("TECHNICIAN"),
  deleteServiceMedia
);


export default router;
