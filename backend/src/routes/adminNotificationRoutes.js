import express from "express";
import {
  getAdminNotificationStatus,
  markBookingsAsViewed,
  markComplaintsAsViewed
} from "../controllers/adminNotificationController.js";

const router = express.Router();

// 🔐 authenticate is already applied globally in index.js

router.get(
  "/admin/notifications/status",
  getAdminNotificationStatus
);

router.patch(
  "/admin/notifications/bookings/viewed",
  markBookingsAsViewed
);

router.patch(
  "/admin/notifications/complaints/viewed",
  markComplaintsAsViewed
);

export default router;
