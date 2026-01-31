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

import { requireCustomer } from "../middleware/customerAuth.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===============================
   CUSTOMER SELF ROUTES (IMPORTANT)
   ORDER MATTERS – DO NOT MOVE
================================ */

/* Logged-in customer job cards */
router.get("/me/job-cards", requireCustomer, getMyJobCards);

/* Logged-in customer vehicles (FIXED) */
router.get("/me/vehicles", authenticate, getMyVehicles);

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
