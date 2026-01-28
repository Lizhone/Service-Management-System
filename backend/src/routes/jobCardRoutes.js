import express from "express";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { authenticate } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createJobCardSchema } from "../validators/jobCard.schema.js";

import {
  createJobCard,
  createJobCardWithDetails,
  getJobCard,
  updateJobStatus,
  updateJobCard,
  deleteJobCard,
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

/**
 * JOB CARD ROUTES
 * 
 * Handles:
 * - Job card search and filtering
 * - Job card creation, retrieval, status updates
 * - Related data: inspections, complaints, parts, media
 * 
 * Protected: All routes after authenticate() middleware require JWT token
 */

/* ================================
   PUBLIC SEARCH (for customer visibility)
================================ */
router.get("/search", async (req, res) => {
  try {
    const { q = "" } = req.query;

    let whereClause = {};

    if (q.trim()) {
      /**
       * Search for job cards by:
       * - Job card number
       * - Customer name
       * - Vehicle model
       *
       * Returns all matching results for the search term
       */
      whereClause = {
        OR: [
          // Search by job card number
          { jobCardNumber: { contains: q, mode: "insensitive" } },
          // Search by customer name
          { customer: { name: { contains: q, mode: "insensitive" } } },
          // Search by vehicle model
          { vehicle: { model: { contains: q, mode: "insensitive" } } },
        ],
      };
    }

    const jobCards = await prisma.jobCard.findMany({
      where: whereClause,
      include: {
        customer: true,
        vehicle: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ data: jobCards });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

/* ================================
   AUTHENTICATION BOUNDARY
   All routes below require valid JWT token
================================ */
router.use(authenticate);

/* ================================
   JOB CARD CRUD
================================ */
router.post("/create-with-details", createJobCardWithDetails);
router.post("/", createJobCard);
router.get("/:id", getJobCard);
router.put("/:id", updateJobCard);
router.delete("/:id", deleteJobCard);
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
