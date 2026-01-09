import express from 'express';
import {
  createJobCard,
  getJobCard,
  updateJobStatus,
  searchJobCards,
} from '../controllers/jobCardController.js';

import { authenticate, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Search job cards
router.get(
  '/search',
  authenticate,
  authorizeRoles('ADMIN', 'ADVISOR', 'TECHNICIAN'),
  searchJobCards
);

// Create job card
router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'ADVISOR'),
  createJobCard
);

// Get job card by ID
router.get('/:id', authenticate, getJobCard);

// Update job card status
router.patch(
  '/:id/status',
  authenticate,
  authorizeRoles('ADMIN', 'TECHNICIAN'),
  updateJobStatus
);

export default router;
