import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createJobCardSchema } from "../validators/jobCard.schema.js";

import {
  createJobCard,
  getJobCard,
  updateJobStatus,
} from "../controllers/jobCardController.js";

import {
  getInspection,
  saveInspection,
} from "../controllers/inspectionController.js";

import {
  getJobCardMedia,
  uploadJobCardMedia,
} from "../controllers/jobCardMediaController.js";

import {
  getParts,
  addParts,
} from "../controllers/partsController.js";

import {
  getComplaints,
  createComplaint,
} from "../controllers/complaintController.js";

const prisma = new PrismaClient();
const router = express.Router();

/* ================================
   PUBLIC ROUTES
================================ */

// GET /api/job-cards/search
router.get("/search", async (req, res) => {
  try {
    const { q = "" } = req.query;

    const jobCards = await prisma.jobCard.findMany({
      where: {
        jobCardNumber: {
          contains: q,
          mode: "insensitive",
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(jobCards);
  } catch (err) {
    console.error("Job card search failed:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

/* ================================
   AUTHENTICATION BOUNDARY
================================ */

router.use(authenticate);

/* ================================
   CORE JOB CARD
================================ */

router.post("/", validate(createJobCardSchema), createJobCard);
router.get("/:id", getJobCard);
router.patch("/:id/status", updateJobStatus);

/* ================================
   INSPECTION
================================ */

router.get("/:id/inspection", getInspection);
router.post("/:id/inspection", saveInspection);

/* ================================
   COMPLAINTS
================================ */

router.get("/:id/complaints", getComplaints);
router.post("/:id/complaints", createComplaint);

/* ================================
   PARTS
================================ */

router.get("/:id/parts", getParts);
router.post("/:id/parts", addParts);

/* ================================
   MEDIA
================================ */

router.get("/:id/media", getJobCardMedia);
router.post("/:id/media", uploadJobCardMedia);

export default router;
