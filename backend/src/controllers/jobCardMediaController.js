import prisma from "../prisma/client.js";
import path from "path";
import fs from "fs";

/**
 * GET /api/job-cards/:id/media
 */
export const getJobCardMedia = async (req, res) => {
  try {
    const { id } = req.params;

    const media = await prisma.jobCardMedia.findMany({
      where: { jobCardId: Number(id) },
      orderBy: { createdAt: "desc" },
    });

    res.json(media);
  } catch (err) {
    console.error("Get job card media failed:", err);
    res.status(500).json({ error: "Failed to load media" });
  }
};

/**
 * POST /api/job-cards/:id/media
 * multipart/form-data
 */
export const uploadJobCardMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { type = "IMAGE" } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }

    const media = await prisma.jobCardMedia.create({
      data: {
        jobCardId: Number(id),
        type,
        url: req.file.path.replace(/\\/g, "/"),
      },
    });

    res.status(201).json(media);
  } catch (err) {
    console.error("Upload job card media failed:", err);
    res.status(500).json({ error: "Media upload failed" });
  }
};
