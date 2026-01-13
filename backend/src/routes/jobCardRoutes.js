import express from 'express';
import {
  createJobCard,
  getJobCard,
  updateJobStatus,
  searchJobCards,
} from '../controllers/jobCardController.js';

import { authenticate, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * PUBLIC ROUTE
 * Dashboard uses this, so it must not require auth
 */
router.get('/search', searchJobCards);

/**
 * Everything below this requires authentication
 */
router.use(authenticate);

// Create job card
router.post(
  '/',
  authorizeRoles('ADMIN', 'ADVISOR'),
  createJobCard
);

// Get job card by ID
router.get('/:id', getJobCard);

// Update job card status
router.patch(
  '/:id/status',
  authorizeRoles('ADMIN', 'TECHNICIAN'),
  updateJobStatus
);

export default router;
