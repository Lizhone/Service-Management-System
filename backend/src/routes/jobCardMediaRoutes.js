import express from "express";
import {
  getJobCardMedia,
  getJobCardMediaById,
  uploadJobCardMedia,
} from "../controllers/jobCardMediaController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";
import { uploadJobCardMedia as multerUpload } from "../config/multer.js";

const router = express.Router();

/* ================================
   MULTER ERROR HANDLER MIDDLEWARE
================================ */
const handleMulterError = (err, req, res, next) => {
  if (err && err.name === "MulterError") {
    if (err.code === "FILE_TOO_LARGE") {
      return res.status(400).json({ error: "File is too large (max 50MB)" });
    }
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File size exceeds limit" });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  if (err) {
    return res.status(400).json({ error: err.message || "Upload failed" });
  }
  next();
};

/* ================================
   JOB CARD MEDIA
================================ */

// GET /:id/media
router.get(
  "/:id/media",
  authenticate,
  getJobCardMedia
);

// GET /:id/media/:mediaId
router.get(
  "/:id/media/:mediaId",
  authenticate,
  getJobCardMediaById
);

// POST /:id/media
router.post(
  "/:id/media",
  authenticate,
  authorizeRoles("ADMIN"),
  multerUpload.single("file"),
  handleMulterError,
  uploadJobCardMedia
);

export default router;
