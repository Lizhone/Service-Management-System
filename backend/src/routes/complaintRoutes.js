import express from 'express';
import { createComplaints } from '../controllers/complaintController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
  '/job-cards/:id/complaints',
  authenticate,
  createComplaints
);

export default router;
