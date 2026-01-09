import express from 'express';
import { uploadJobCardMedia } from '../config/multer.js';
import { uploadMedia } from '../controllers/jobCardMediaController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Upload images/videos for a job card
router.post(
  '/job-cards/:jobCardId/media',
  authenticate,
  uploadJobCardMedia.array('media', 10),
  uploadMedia
);

export default router;
