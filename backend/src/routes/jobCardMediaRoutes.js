import express from "express";
import {
  getJobCardMedia,
  uploadJobCardMedia,
} from "../controllers/jobCardMediaController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";
import { uploadJobCardMedia as multerUpload } from "../config/multer.js";

const router = express.Router();

/* ================================
   JOB CARD MEDIA
================================ */

// GET /:id/media
router.get(
  "/:id/media",
  authenticate,
  getJobCardMedia
);

// POST /:id/media
router.post(
  "/:id/media",
  authenticate,
  authorizeRoles("ADMIN"),
  multerUpload.single("file"),
  uploadJobCardMedia
);

export default router;
