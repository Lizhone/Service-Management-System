import express from "express";
import { addComplaint } from "../controllers/complaintController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/job-cards/:id/complaints",
  authenticate,
  authorizeRoles("ADMIN"),
  addComplaint
);

export default router;
