import express from "express";
import { getAllComplaintsAdmin } from "../controllers/complaintController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/complaints",
  authenticate,
  authorizeRoles("ADMIN"),
  getAllComplaintsAdmin
);

export default router;
