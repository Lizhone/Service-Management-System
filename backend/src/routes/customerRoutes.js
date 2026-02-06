import express from "express";
import {
  getAllCustomers,
  getCustomerById,
  getCustomerJobCards,
  getMyJobCards,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getMyVehicles,
} from "../controllers/customerController.js";
import {
  createServiceComplaint,
  getMyServiceComplaints,
} from "../controllers/serviceComplaintController.js";

import { getMyServiceBookings } from "../controllers/serviceBookingController.js";
import { requireCustomer } from "../middleware/customerAuth.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===============================
   CUSTOMER SELF ROUTES
================================ */

router.get("/me/job-cards", requireCustomer, getMyJobCards);
router.get("/me/service-bookings", requireCustomer, getMyServiceBookings);

/* 🔥 FIX HERE: use requireCustomer */
router.get("/me/vehicles", requireCustomer, getMyVehicles);

router.post("/me/complaints", requireCustomer, createServiceComplaint);
router.get("/me/complaints", requireCustomer, getMyServiceComplaints);

/* ===============================
   ADMIN / STAFF ROUTES
================================ */

router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);
router.get("/:id/job-cards", getCustomerJobCards);
router.post("/", createCustomer);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

export default router;
