import express from 'express';
import { uploadJobCardMedia } from '../config/multer.js';
import { uploadMedia, getMedia } from '../controllers/jobCardMediaController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get media for a job card
router.get('/job-cards/:jobCardId/media', authenticate, getMedia);

// Upload images/videos for a job card
router.post(
  '/job-cards/:jobCardId/media',
  authenticate,
  uploadJobCardMedia.single('file'),
  uploadMedia
);

export default router;
