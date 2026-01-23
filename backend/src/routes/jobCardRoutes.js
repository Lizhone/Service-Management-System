import express from "express";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { authenticate } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createJobCardSchema } from "../validators/jobCard.schema.js";

import {
  createJobCard,
  getJobCard,
  updateJobStatus,
  getJobCardMediaById,
} from "../controllers/jobCardController.js";

import {
  addInspection,
  getInspection,
} from "../controllers/inspectionController.js";

import {
  getJobCardMedia,
  uploadJobCardMedia,
} from "../controllers/jobCardMediaController.js";

import {
  getParts,
  saveParts,
} from "../controllers/partsController.js";

import {
  getComplaints,
  createComplaint,
} from "../controllers/complaintController.js";

const prisma = new PrismaClient();
const router = express.Router();

/* ================================
   PUBLIC
================================ */
router.get("/search", async (req, res) => {
  try {
    const { q = "" } = req.query;

    const jobCards = await prisma.jobCard.findMany({
      where: {
        jobCardNumber: { contains: q, mode: "insensitive" },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(jobCards);
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
});

/* ================================
   AUTH
================================ */
router.use(authenticate);

/* ================================
   JOB CARD
================================ */
router.post("/", validate(createJobCardSchema), createJobCard);
router.get("/:id", getJobCard);
router.patch("/:id/status", updateJobStatus);

/* ================================
   INSPECTION (FIXED)
================================ */
router.get("/:id/inspection", getInspection);
router.post("/:id/inspection", addInspection);

/* ================================
   COMPLAINTS
================================ */
router.get("/:id/complaints", getComplaints);
router.post("/:id/complaints", createComplaint);

/* ================================
   PARTS
================================ */
router.get("/:id/parts", getParts);
router.post("/:id/parts", saveParts);

/* ================================
   MEDIA
================================ */
router.get("/:jobCardId/media/:mediaId", getJobCardMediaById);

export default router;
