import express from "express";
import { createComplaint } from "../controllers/complaintController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/job-cards/:id/complaints", authenticate, createComplaint);

export default router;
