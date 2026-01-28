import express from "express";
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerJobCards,
  getMyJobCards,
} from "../controllers/customerController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===============================
   CUSTOMER SELF ROUTES
   (MUST COME FIRST)
================================ */
router.get(
  "/me/job-cards",
  authenticate,
  getMyJobCards
);

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
