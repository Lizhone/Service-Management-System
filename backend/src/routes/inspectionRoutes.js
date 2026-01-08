import express from 'express';
import {
  addInspection,
  getInspection,
} from '../controllers/inspectionController.js';

import { authenticate, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
  '/job-cards/:id/inspection',
  authenticate,
  authorizeRoles('TECHNICIAN', 'ADVISOR'),
  addInspection
);

router.get(
  '/job-cards/:id/inspection',
  authenticate,
  getInspection
);

export default router;   