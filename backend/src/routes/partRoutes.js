import express from 'express';
import { createParts } from '../controllers/partController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
  '/job-cards/:id/parts',
  authenticate,
  createParts
);

export default router;
