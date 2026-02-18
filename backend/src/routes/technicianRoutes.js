import express from "express";
import {
  getTechnicians,
  getAvailableBookings,
  getClaimedJobs,
  claimBooking,
  getBookingDetail,
  startWork,
  completeWork
} from "../controllers/technicianController.js";

const router = express.Router();

router.get("/", getTechnicians);
router.get("/available", getAvailableBookings);
router.get("/:technicianId/claimed", getClaimedJobs);

router.put("/claim/:id/:technicianId", claimBooking);

router.get("/booking/:bookingId", getBookingDetail);

router.put("/start/:bookingId", startWork);
router.put("/complete/:bookingId", completeWork);

export default router;
