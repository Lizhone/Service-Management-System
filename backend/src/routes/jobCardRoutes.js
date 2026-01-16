import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../middleware/authMiddleware.js";

const prisma = new PrismaClient();
const router = express.Router();

/* ================================
   PUBLIC ROUTES
================================ */

// GET /job-cards/search
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
   PROTECTED ROUTES
================================ */

// GET /job-cards/:id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid job card id" });
    }

    const jobCard = await prisma.jobCard.findUnique({
      where: { id },
    });

    if (!jobCard) {
      return res.status(404).json({ error: "Job card not found" });
    }

    res.json(jobCard);
  } catch (err) {
    console.error("Get job card failed:", err);
    res.status(500).json({ error: "Failed to load job card" });
  }
});

export default router;
